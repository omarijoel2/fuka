import { useState } from "react";
import { Link, useParams } from "wouter";
import { useRepositoryItemDetail } from "../lib/api-hooks";
import type { RepositoryItem, RepoItemType } from "../lib/api-types";
import { SeoHead, ORG_JSONLD } from "../components/seo-head";

const TYPE_LABELS: Record<RepoItemType, string> = {
  thesis:           "Thesis",
  dissertation:     "Dissertation",
  journal_article:  "Journal Article",
  conference_paper: "Conference Paper",
  book_chapter:     "Book Chapter",
  research_report:  "Research Report",
  working_paper:    "Working Paper",
  dataset:          "Dataset",
};

const TYPE_COLORS: Record<string, string> = {
  thesis:           "bg-blue-100 text-blue-800",
  dissertation:     "bg-indigo-100 text-indigo-800",
  journal_article:  "bg-green-100 text-green-800",
  conference_paper: "bg-purple-100 text-purple-800",
  book_chapter:     "bg-orange-100 text-orange-800",
  research_report:  "bg-amber-100 text-amber-800",
  working_paper:    "bg-teal-100 text-teal-800",
  dataset:          "bg-rose-100 text-rose-800",
};

const LICENSE_LABELS: Record<string, string> = {
  cc_by:            "CC BY 4.0",
  cc_by_nc:         "CC BY-NC 4.0",
  cc_by_sa:         "CC BY-SA 4.0",
  all_rights_reserved: "All Rights Reserved",
  open_access:      "Open Access",
};

const DEPT_LABELS: Record<string, string> = {
  SBE:  "School of Business & Economics",
  SCIT: "School of Computing & IT",
  SOS:  "School of Science & Natural Resources",
  SHS:  "School of Health Sciences",
  SESS: "School of Education & Social Sciences",
};

function formatAPA(item: RepositoryItem): string {
  const authors = item.authors.map((a) => {
    const parts = a.name.split(",").map((p) => p.trim());
    return parts.length === 2 ? `${parts[0]}, ${parts[1][0]}.` : a.name;
  }).join(", ");
  let cite = `${authors} (${item.year}). ${item.title}.`;
  if (item.journal_name) cite += ` ${item.journal_name}`;
  if (item.volume) cite += `, ${item.volume}`;
  if (item.issue) cite += `(${item.issue})`;
  if (item.pages) cite += `, ${item.pages}`;
  if (item.doi) cite += `. https://doi.org/${item.doi}`;
  return cite + ".";
}

function formatMLA(item: RepositoryItem): string {
  const authors = item.authors.map((a) => a.name).join(", and ");
  let cite = `${authors}. "${item.title}."`;
  if (item.journal_name) cite += ` ${item.journal_name},`;
  if (item.volume) cite += ` vol. ${item.volume},`;
  if (item.issue) cite += ` no. ${item.issue},`;
  cite += ` ${item.year}`;
  if (item.pages) cite += `, pp. ${item.pages}`;
  if (item.doi) cite += `. DOI: ${item.doi}`;
  return cite + ".";
}

function formatChicago(item: RepositoryItem): string {
  const authors = item.authors.map((a) => a.name).join(", and ");
  let cite = `${authors}. "${item.title}."`;
  if (item.journal_name) cite += ` ${item.journal_name}`;
  if (item.volume) cite += ` ${item.volume}`;
  if (item.issue) cite += `, no. ${item.issue}`;
  cite += ` (${item.year})`;
  if (item.pages) cite += `: ${item.pages}`;
  if (item.doi) cite += `. https://doi.org/${item.doi}`;
  return cite + ".";
}

export default function RepositoryItemPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading, error } = useRepositoryItemDetail(slug ?? "");
  const [citationFormat, setCitationFormat] = useState<"apa" | "mla" | "chicago">("apa");
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-6 bg-gray-100 rounded w-1/2 mb-8" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Item not found.</p>
          <Link to="/repository/browse" className="text-green-700 underline">Return to browse</Link>
        </div>
      </div>
    );
  }

  const citationText = citationFormat === "apa" ? formatAPA(item) : citationFormat === "mla" ? formatMLA(item) : formatChicago(item);

  function copyCitation() {
    navigator.clipboard.writeText(citationText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isThesis = item.type === "thesis" || item.type === "dissertation";

  const repoJsonLd = {
    "@context": "https://schema.org",
    "@type": isThesis ? "Thesis" : "ScholarlyArticle",
    headline: item.title,
    abstract: item.abstract ?? undefined,
    author: item.authors.map((a) => ({ "@type": "Person", name: a.name })),
    datePublished: String(item.year),
    publisher: ORG_JSONLD,
    ...(item.doi ? { identifier: `https://doi.org/${item.doi}`, sameAs: `https://doi.org/${item.doi}` } : {}),
    url: `https://kafu.ac.ke/repository/items/${item.slug}`,
    inLanguage: "en",
    educationalUse: "research",
    ...(item.journal_name ? { isPartOf: { "@type": "Periodical", name: item.journal_name } } : {}),
  };

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={item.seo_meta?.title ?? `${item.title} | KAFU Repository`}
        description={item.seo_meta?.description ?? item.abstract?.slice(0, 160) ?? `${TYPE_LABELS[item.type]} by ${item.authors.map((a) => a.name).join(", ")} — ${item.year}. KAFU Institutional Repository.`}
        path={`/repository/items/${item.slug}`}
        breadcrumbs={[
          { name: "Repository", path: "/repository" },
          { name: "Browse", path: "/repository/browse" },
          { name: item.title },
        ]}
        jsonLd={repoJsonLd}
      />
      {/* Header */}
      <section className="text-white py-12" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/repository" className="hover:text-white">Repository</Link>
            <span>/</span>
            <Link to="/repository/browse" className="hover:text-white">Browse</Link>
            <span>/</span>
            <span className="text-white/80 truncate max-w-xs">{item.title.slice(0, 50)}{item.title.length > 50 ? "…" : ""}</span>
          </nav>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${TYPE_COLORS[item.type] ?? "bg-gray-200 text-gray-800"}`}>
              {TYPE_LABELS[item.type as RepoItemType] ?? item.type}
            </span>
            {item.access === "open" && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-900 font-medium">Open Access</span>
            )}
            {item.doi && (
              <a
                href={`https://doi.org/${item.doi}`}
                target="_blank"
                rel="noreferrer"
                data-testid="doi-link"
                className="text-xs px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 font-mono"
              >
                DOI: {item.doi}
              </a>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif leading-tight mb-3">{item.title}</h1>
          <p className="text-white/80 text-sm">
            {item.authors.map((a) => a.name).join("; ")} · {item.year}
            {item.department ? ` · ${DEPT_LABELS[item.department] ?? item.department}` : ""}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Abstract */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Abstract</h2>
              <p className="text-gray-700 leading-relaxed">{item.abstract}</p>
            </section>

            {/* Keywords */}
            {item.keywords?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((kw) => (
                    <Link
                      key={kw}
                      to={`/repository/browse?search=${encodeURIComponent(kw)}`}
                      data-testid={`keyword-${kw}`}
                      className="px-3 py-1 text-sm rounded-full border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-800 transition-colors"
                    >
                      {kw}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Citation Export */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Cite This Work</h2>
              <div className="flex gap-2 mb-3">
                {(["apa", "mla", "chicago"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    data-testid={`cite-format-${fmt}`}
                    onClick={() => setCitationFormat(fmt)}
                    className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                      citationFormat === fmt
                        ? "text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    style={citationFormat === fmt ? { backgroundColor: "#1A5C38" } : {}}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed font-serif">
                {citationText}
              </div>
              <button
                data-testid="copy-citation-btn"
                onClick={copyCitation}
                className="mt-2 text-sm text-green-700 hover:text-green-900 underline"
              >
                {copied ? "Copied to clipboard!" : "Copy citation"}
              </button>
            </section>

            {/* Related items */}
            {item.related && item.related.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Related Works</h2>
                <div className="space-y-3">
                  {item.related.map((r) => (
                    <Link
                      key={r.slug}
                      to={`/repository/items/${r.slug}`}
                      data-testid={`related-${r.slug}`}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors"
                    >
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${TYPE_COLORS[r.type] ?? "bg-gray-100 text-gray-600"}`}>
                        {TYPE_LABELS[r.type as RepoItemType] ?? r.type}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.authors?.[0]?.name} · {r.year}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Download / Access */}
            <div className="rounded-xl border border-gray-200 p-5 space-y-3">
              {item.access === "open" && item.file_url ? (
                <a
                  href={`/api/repository/items/${item.slug}/download`}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="download-btn"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-white font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#1A5C38" }}
                  onClick={(e) => {
                    e.preventDefault();
                    fetch(`/api/repository/items/${item.slug}/download`)
                      .then(r => r.json())
                      .then(d => window.open(d.url, "_blank"));
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                  {item.file_size_kb > 0 && (
                    <span className="text-xs text-white/70 ml-1">
                      ({item.file_size_kb > 1024 ? `${(item.file_size_kb / 1024).toFixed(1)} MB` : `${item.file_size_kb} KB`})
                    </span>
                  )}
                </a>
              ) : (
                <div className="text-center py-3 text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg">
                  <svg className="w-6 h-6 mx-auto mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  {item.access === "restricted" ? "Restricted access — contact library" : "Embargoed — not yet available"}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500 pt-1">
                <div><div className="text-lg font-bold text-gray-700">{item.views.toLocaleString()}</div>Views</div>
                <div><div className="text-lg font-bold text-gray-700">{item.downloads.toLocaleString()}</div>Downloads</div>
                <div><div className="text-lg font-bold text-gray-700">{item.citation_count}</div>Citations</div>
              </div>
            </div>

            {/* Metadata */}
            <div className="rounded-xl border border-gray-200 p-5 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Metadata</h3>
              {[
                { label: "Type",        value: TYPE_LABELS[item.type as RepoItemType] ?? item.type },
                { label: "Year",        value: String(item.year) },
                { label: "Language",    value: item.language === "en" ? "English" : item.language },
                { label: "Department",  value: item.department ? (DEPT_LABELS[item.department] ?? item.department) : null },
                { label: "Theme",       value: item.research_theme ?? null },
                { label: "Publisher",   value: item.publisher ?? null },
                { label: "Journal",     value: item.journal_name ?? null },
                { label: "Volume/Issue",value: [item.volume, item.issue].filter(Boolean).join(" / ") || null },
                { label: "Pages",       value: item.pages ?? null },
                { label: "ISBN/ISSN",   value: item.isbn_issn ?? null },
                { label: "Funded by",   value: item.funded_by ?? null },
                { label: "License",     value: LICENSE_LABELS[item.license] ?? item.license },
                ...(isThesis ? [
                  { label: "Student",    value: item.student_name ?? null },
                  { label: "Degree",     value: item.degree ?? null },
                  { label: "Supervisor", value: item.supervisor ?? null },
                ] : []),
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-400 shrink-0">{row.label}</span>
                  <span className="text-gray-800 text-right">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Authors */}
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Authors</h3>
              <div className="space-y-2">
                {item.authors.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: "#1A5C38" }}>
                      {a.name.split(",")[0]?.[0] ?? "?"}
                    </div>
                    <div>
                      {a.staff_slug ? (
                        <Link to={`/staff/${a.staff_slug}`} data-testid={`author-link-${a.staff_slug}`} className="text-sm font-medium text-green-700 hover:underline">
                          {a.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-gray-800">{a.name}</span>
                      )}
                      {a.role && <p className="text-xs text-gray-400 capitalize">{a.role}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
