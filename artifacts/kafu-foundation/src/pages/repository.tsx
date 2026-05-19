import { useState } from "react";
import { Link } from "wouter";
import { useRepositoryOverview } from "../lib/api-hooks";
import type { RepositoryItem, RepoItemType } from "../lib/api-types";
import { SeoHead } from "../components/seo-head";

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

const TYPE_COLORS: Record<RepoItemType, string> = {
  thesis:           "bg-blue-100 text-blue-800",
  dissertation:     "bg-indigo-100 text-indigo-800",
  journal_article:  "bg-green-100 text-green-800",
  conference_paper: "bg-purple-100 text-purple-800",
  book_chapter:     "bg-orange-100 text-orange-800",
  research_report:  "bg-amber-100 text-amber-800",
  working_paper:    "bg-teal-100 text-teal-800",
  dataset:          "bg-rose-100 text-rose-800",
};

const ACCESS_ICON = {
  open:       <svg className="w-4 h-4 text-green-600 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
  restricted: <svg className="w-4 h-4 text-amber-600 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
  embargo:    <svg className="w-4 h-4 text-red-600 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
};

function ItemCard({ item }: { item: RepositoryItem }) {
  const firstAuthor = item.authors?.[0]?.name ?? "Unknown";
  const moreAuthors = item.authors?.length > 1 ? ` +${item.authors.length - 1}` : "";
  return (
    <Link
      to={`/repository/items/${item.slug}`}
      data-testid={`repo-card-${item.slug}`}
      className="group block rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all p-5 bg-white"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type as RepoItemType]}`}>
          {TYPE_LABELS[item.type as RepoItemType] ?? item.type}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          {ACCESS_ICON[item.access as keyof typeof ACCESS_ICON]}
          {item.access === "open" ? "Open Access" : item.access === "restricted" ? "Restricted" : "Embargo"}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 leading-snug mb-1 group-hover:text-green-800 line-clamp-2">
        {item.title}
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        {firstAuthor}{moreAuthors} · {item.year}
        {item.department ? ` · ${item.department}` : ""}
      </p>
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.abstract}</p>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        {item.doi && <span className="font-mono text-green-700">DOI</span>}
        {item.citation_count > 0 && <span>{item.citation_count} citations</span>}
        {item.downloads > 0 && <span>{item.downloads} downloads</span>}
      </div>
    </Link>
  );
}

const BROWSE_CATEGORIES = [
  {
    key: "by-type",
    label: "By Publication Type",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    desc: "Theses, dissertations, articles, reports, datasets",
  },
  {
    key: "by-department",
    label: "By Department / School",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    desc: "SBE, SCIT, SOS, SHS, SESS",
  },
  {
    key: "by-year",
    label: "By Year",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
      </svg>
    ),
    desc: "Filter by publication year",
  },
  {
    key: "open-access",
    label: "Open Access Only",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    desc: "Freely downloadable full-text items",
  },
];

export default function RepositoryPage() {
  const { data: overview, isLoading } = useRepositoryOverview();
  const [searchInput, setSearchInput] = useState("");

  const stats = overview?.stats;

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title="Institutional Repository — Kaimosi Friends University"
        description="KAFU's open-access institutional repository — theses, dissertations, journal articles, conference papers, and working papers from KAFU researchers and graduates."
        path="/repository"
        breadcrumbs={[{ name: "Repository", path: "/repository" }]}
      />
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #228B22 0%, #0f3d26 60%, #14344a 100%)" }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border border-white/30 bg-white/10">
            Knowledge Repository
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            KAFU Institutional Repository
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Open access to theses, research articles, datasets, and scholarly outputs from Kaimosi Friends University.
          </p>
          {/* Search bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = `/repository/browse?search=${encodeURIComponent(searchInput)}`; }}
            className="flex max-w-xl mx-auto gap-2"
          >
            <input
              data-testid="repo-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, author, keyword..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              data-testid="repo-search-btn"
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold text-gray-900"
              style={{ backgroundColor: "#DAA520" }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {isLoading
              ? Array(6).fill(null).map((_, i) => (
                  <div key={i} className="animate-pulse"><div className="h-8 bg-gray-200 rounded mb-2 w-16 mx-auto" /><div className="h-4 bg-gray-100 rounded w-24 mx-auto" /></div>
                ))
              : [
                  { label: "Total Records", value: stats?.total ?? 0 },
                  { label: "Theses & Dissertations", value: stats?.theses ?? 0 },
                  { label: "Journal Articles", value: stats?.articles ?? 0 },
                  { label: "Open Access", value: stats?.open_access ?? 0 },
                  { label: "Total Downloads", value: (stats?.downloads ?? 0).toLocaleString() },
                  { label: "Departments", value: stats?.departments ?? 0 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold" style={{ color: "#228B22" }}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* Browse categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse the Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BROWSE_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={`/repository/browse${cat.key === "open-access" ? "?access=open" : ""}`}
              data-testid={`browse-cat-${cat.key}`}
              className="group flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
            >
              <span className="text-green-700 mb-3">{cat.icon}</span>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-800 mb-1">{cat.label}</h3>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Most Cited */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Most Cited Works</h2>
              <p className="text-gray-500 text-sm mt-1">High-impact research from KAFU scholars</p>
            </div>
            <Link
              to="/repository/browse"
              data-testid="view-all-repo-link"
              className="font-medium hover:underline text-sm"
              style={{ color: "#228B22" }}
            >
              Browse all →
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                  <div className="h-12 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(overview?.featured ?? []).map((item) => (
                <ItemCard key={item.slug} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent additions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Additions</h2>
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {isLoading
            ? Array(5).fill(null).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex gap-4">
                  <div className="w-16 h-5 bg-gray-200 rounded" />
                  <div className="flex-1 h-5 bg-gray-200 rounded" />
                </div>
              ))
            : (overview?.recent ?? []).map((item) => (
                <Link
                  key={item.slug}
                  to={`/repository/items/${item.slug}`}
                  data-testid={`recent-item-${item.slug}`}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${TYPE_COLORS[item.type as RepoItemType] ?? "bg-gray-100 text-gray-700"}`}>
                    {TYPE_LABELS[item.type as RepoItemType] ?? item.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 leading-snug hover:text-green-800 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.authors?.[0]?.name} · {item.year}</p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* Open Access policy banner */}
      <section className="border-t border-gray-100 py-10 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Open Access Commitment</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
            KAFU is committed to open access principles. The majority of outputs in this repository are freely downloadable under Creative Commons licences. We comply with Dublin Core, Schema.org, and OpenAIRE metadata standards to ensure global discoverability.
          </p>
        </div>
      </section>
    </div>
  );
}
