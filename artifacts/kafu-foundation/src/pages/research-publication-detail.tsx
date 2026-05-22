import React from "react";
import { Link } from "wouter";
import { useResearchPublication } from "@/lib/api-hooks";
import { ChevronRight, ExternalLink, BookOpen, Copy, Check } from "lucide-react";
import { SeoHead, ORG_JSONLD } from "@/components/seo-head";

const TYPE_LABELS: Record<string, string> = {
  journal: "Journal Article", conference: "Conference Paper", book_chapter: "Book Chapter",
  thesis: "Thesis", report: "Report", book: "Book", preprint: "Preprint",
};

export default function ResearchPublicationDetail({ slug }: { slug: string }) {
  const { data: pub, isLoading, error } = useResearchPublication(slug);
  const [copied, setCopied] = React.useState(false);

  const handleCopyCitation = () => {
    if (pub?.citation) {
      navigator.clipboard.writeText(pub.citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading publication...</div>;
  }
  if (error || !pub) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Publication Not Found</h2>
        <Link href="/research/publications" className="text-primary hover:underline">Back to Publications</Link>
      </div>
    );
  }

  const pubJsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    abstract: pub.abstract ?? undefined,
    author: pub.authors?.map((a) => ({ "@type": "Person", name: typeof a === "string" ? a : a.name })),
    datePublished: String(pub.year),
    publisher: ORG_JSONLD,
    ...(pub.doi ? { identifier: `https://doi.org/${pub.doi}`, sameAs: `https://doi.org/${pub.doi}` } : {}),
    url: `https://kafu.ac.ke/research/publications/${pub.id}`,
    inLanguage: "en",
    isPartOf: pub.journal ? { "@type": "Periodical", name: pub.journal } : undefined,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={pub.seo_meta?.title ?? `${pub.title} | KAFU Research`}
        description={pub.seo_meta?.description ?? pub.abstract?.slice(0, 160) ?? `${TYPE_LABELS[pub.type] ?? pub.type} published by Kaimosi Friends University researchers in ${pub.year}.`}
        path={`/research/publications/${pub.id}`}
        breadcrumbs={[
          { name: "Research", path: "/research" },
          { name: "Publications", path: "/research/publications" },
          { name: pub.title },
        ]}
        jsonLd={pubJsonLd}
      />
      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4 flex-wrap">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/research" className="hover:underline">Research</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/research/publications" className="hover:underline">Publications</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="truncate max-w-xs opacity-70">{pub.title}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full">
              {TYPE_LABELS[pub.type] ?? pub.type}
            </span>
            <span className="text-sm text-primary-foreground/70">{pub.year}</span>
            {pub.is_featured && <span className="text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full">Featured</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold max-w-4xl leading-tight">{pub.title}</h1>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Authors */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-base font-bold text-foreground mb-3">Authors</h2>
              <div className="space-y-2">
                {pub.authors?.map((author, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{author.name}</p>
                      {author.affiliation && <p className="text-xs text-muted-foreground">{author.affiliation}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abstract */}
            {pub.abstract && (
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="text-base font-bold text-foreground mb-3">Abstract</h2>
                <p className="text-sm text-foreground leading-relaxed">{pub.abstract}</p>
              </div>
            )}

            {/* Citation */}
            <div className="bg-muted/50 rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground">Citation</h2>
                <button onClick={handleCopyCitation} className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium" data-testid="btn-copy-citation">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-foreground font-mono leading-relaxed bg-white p-4 rounded-lg border border-border">{pub.citation}</p>
            </div>

            {/* Linked project */}
            {pub.project && (
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="text-base font-bold text-foreground mb-3">Linked Research Project</h2>
                <Link href={`/research/projects/${pub.project.slug}`}>
                  <div className="flex items-start gap-3 hover:bg-muted/30 rounded-lg p-3 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (pub.project.theme?.colour ?? "#228B22") + "20" }}>
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: pub.project.theme?.colour ?? "#228B22" }} />
                    </div>
                    <div>
                      {pub.project.theme && <p className="text-xs font-bold text-muted-foreground mb-0.5">{pub.project.theme.name}</p>}
                      <p className="text-sm font-semibold text-foreground hover:text-primary transition-colors">{pub.project.title}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-sm text-foreground">Publication Details</h3>
              <div className="space-y-3 text-sm">
                {pub.journal && <div><p className="text-xs text-muted-foreground">Journal / Publisher</p><p className="font-medium">{pub.journal}</p></div>}
                {pub.publisher && !pub.journal && <div><p className="text-xs text-muted-foreground">Publisher</p><p className="font-medium">{pub.publisher}</p></div>}
                <div><p className="text-xs text-muted-foreground">Year</p><p className="font-medium">{pub.year}</p></div>
                {pub.volume && <div><p className="text-xs text-muted-foreground">Volume / Issue</p><p className="font-medium">Vol. {pub.volume}{pub.issue ? `, No. ${pub.issue}` : ""}</p></div>}
                {pub.pages && <div><p className="text-xs text-muted-foreground">Pages</p><p className="font-medium">{pub.pages}</p></div>}
              </div>
              {(pub.indexed_in?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Indexed In</p>
                  <div className="flex flex-wrap gap-1">
                    {pub.indexed_in?.map((idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">{idx}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 pt-2 border-t border-border">
                {pub.doi && (
                  <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline font-medium" data-testid="btn-doi">
                    <ExternalLink className="w-3.5 h-3.5" /> View via DOI
                  </a>
                )}
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline font-medium" data-testid="btn-full-text">
                    <BookOpen className="w-3.5 h-3.5" /> Full Text
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
