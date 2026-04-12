import { useState } from "react";
import { Link } from "wouter";
import { useRepositoryItems, useRepositoryFacets } from "../lib/api-hooks";
import type { RepoItemType } from "../lib/api-types";
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

const DEPT_LABELS: Record<string, string> = {
  SBE:  "School of Business & Economics",
  SCIT: "School of Computing & IT",
  SOS:  "School of Science & Natural Resources",
  SHS:  "School of Health Sciences",
  SESS: "School of Education & Social Sciences",
};

const SORT_OPTIONS = [
  { value: "recent",     label: "Most Recent" },
  { value: "citations",  label: "Most Cited" },
  { value: "downloads",  label: "Most Downloaded" },
  { value: "year_desc",  label: "Newest First" },
  { value: "year_asc",   label: "Oldest First" },
];

export default function RepositoryBrowsePage() {
  const [search,     setSearch]     = useState(() => {
    try { return new URLSearchParams(window.location.search).get("search") ?? ""; } catch { return ""; }
  });
  const [searchInput, setSearchInput] = useState(search);
  const [type,       setType]       = useState(() => {
    try { return new URLSearchParams(window.location.search).get("type") ?? ""; } catch { return ""; }
  });
  const [dept,       setDept]       = useState("");
  const [year,       setYear]       = useState("");
  const [access,     setAccess]     = useState(() => {
    try { return new URLSearchParams(window.location.search).get("access") ?? ""; } catch { return ""; }
  });
  const [sort,       setSort]       = useState("recent");
  const [page,       setPage]       = useState(1);

  const { data, isLoading } = useRepositoryItems({
    type: type || undefined,
    department: dept || undefined,
    year: year || undefined,
    access: access || undefined,
    search: search || undefined,
    sort,
    page,
    per_page: 12,
  });

  const { data: facets } = useRepositoryFacets();

  const items    = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const total    = data?.total ?? 0;

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function clearFilters() {
    setSearch(""); setSearchInput(""); setType("");
    setDept(""); setYear(""); setAccess(""); setSort("recent"); setPage(1);
  }

  const hasFilters = search || type || dept || year || access;

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title="Browse Repository — Kaimosi Friends University"
        description="Browse KAFU's institutional repository by type, department, year, or keyword. Access theses, dissertations, articles, conference papers, and working papers."
        path="/repository/browse"
        breadcrumbs={[{ name: "Repository", path: "/repository" }, { name: "Browse", path: "/repository/browse" }]}
      />
      {/* Header */}
      <section className="text-white py-10" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/repository" className="hover:text-white">Repository</Link>
            <span>/</span>
            <span className="text-white">Browse</span>
          </nav>
          <h1 className="text-2xl font-bold">Browse the Repository</h1>
          <p className="text-white/70 text-sm mt-1">
            {total > 0 ? `${total} records found` : "Search and filter the KAFU scholarly archive"}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            {/* Search */}
            <form onSubmit={applySearch} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Search</label>
              <div className="flex gap-2">
                <input
                  data-testid="browse-search-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Keywords, title, author..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button data-testid="browse-search-btn" type="submit" className="px-3 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: "#1A5C38" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Type</label>
              <div className="space-y-1">
                <button
                  data-testid="type-filter-all"
                  onClick={() => { setType(""); setPage(1); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!type ? "text-white font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                  style={!type ? { backgroundColor: "#1A5C38" } : {}}
                >
                  All Types
                </button>
                {(facets?.types ?? []).map((t) => (
                  <button
                    key={t.type}
                    data-testid={`type-filter-${t.type}`}
                    onClick={() => { setType(t.type); setPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${type === t.type ? "text-white font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                    style={type === t.type ? { backgroundColor: "#1A5C38" } : {}}
                  >
                    <span>{TYPE_LABELS[t.type] ?? t.type}</span>
                    <span className={`text-xs ml-2 ${type === t.type ? "text-white/70" : "text-gray-400"}`}>{t.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select
                data-testid="dept-filter"
                value={dept}
                onChange={(e) => { setDept(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">All Departments</option>
                {(facets?.departments ?? []).map((d) => (
                  <option key={d.department} value={d.department}>
                    {d.department} ({d.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
              <select
                data-testid="year-filter"
                value={year}
                onChange={(e) => { setYear(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">All Years</option>
                {(facets?.years ?? []).map((y) => (
                  <option key={y.year} value={String(y.year)}>{y.year} ({y.count})</option>
                ))}
              </select>
            </div>

            {/* Access */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Access</label>
              <div className="space-y-1">
                {[{ v: "", l: "All" }, { v: "open", l: "Open Access" }, { v: "restricted", l: "Restricted" }].map((a) => (
                  <button
                    key={a.v}
                    data-testid={`access-filter-${a.v || "all"}`}
                    onClick={() => { setAccess(a.v); setPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${access === a.v ? "text-white font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                    style={access === a.v ? { backgroundColor: "#1A5C38" } : {}}
                  >
                    {a.l}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                data-testid="clear-filters-btn"
                onClick={clearFilters}
                className="w-full text-sm text-red-600 hover:text-red-800 underline text-left"
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-600">
                {isLoading ? "Loading..." : `${total} result${total !== 1 ? "s" : ""}`}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Sort:</label>
                <select
                  data-testid="sort-select"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="text-sm px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array(6).fill(null).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                    <div className="h-10 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v5.25M12 21a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
                <p className="font-medium text-gray-700 mb-1">No results found</p>
                <p className="text-sm">Try adjusting your search or clearing filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/repository/items/${item.slug}`}
                    data-testid={`browse-item-${item.slug}`}
                    className="group block bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all p-5"
                  >
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {TYPE_LABELS[item.type as RepoItemType] ?? item.type}
                      </span>
                      {item.access === "open" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          Open Access
                        </span>
                      )}
                      {item.doi && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">DOI</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-800 leading-snug mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.authors.map((a) => a.name).join(", ")} · {item.year}
                      {item.department ? ` · ${DEPT_LABELS[item.department] ?? item.department}` : ""}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.abstract}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      {item.citation_count > 0 && <span>{item.citation_count} citations</span>}
                      {item.downloads > 0 && <span>{item.downloads.toLocaleString()} downloads</span>}
                      {item.journal_name && <span className="italic">{item.journal_name}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  data-testid="page-prev-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {lastPage}</span>
                <button
                  data-testid="page-next-btn"
                  disabled={page === lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
