import React, { useState } from "react";
import { Link } from "wouter";
import { useResearchPublications } from "@/lib/api-hooks";
import { ChevronRight, Search, BookOpen, ExternalLink } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  journal: "Journal Article", conference: "Conference Paper", book_chapter: "Book Chapter",
  thesis: "Thesis", report: "Report", book: "Book", preprint: "Preprint",
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

export default function ResearchPublications() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: result, isLoading } = useResearchPublications({
    type: typeFilter || undefined,
    year: yearFilter,
    search: debouncedSearch || undefined,
    page,
    per_page: 12,
  });

  const publications = result?.data ?? [];
  const meta = result;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <img src="https://kafu.ac.ke/wp-content/uploads/2025/10/campus-1-scaled.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2)" }} />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/research" className="hover:underline">Research</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Publications</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Publications Repository</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Scholarly output from KAFU researchers — journal articles, conference papers, theses, reports, and books.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search publications..." data-testid="input-publications-search"
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-type-filter">
            <option value="">All Types</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={yearFilter ?? ""} onChange={(e) => { setYearFilter(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-year-filter">
            <option value="">All Years</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 flex-1">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="bg-muted rounded-xl h-28 animate-pulse" />)}
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No publications found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {meta?.total ?? 0} publication{(meta?.total ?? 0) !== 1 ? "s" : ""}
            </p>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div key={pub.id} className="bg-white rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow" data-testid={`pub-card-${pub.slug}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {TYPE_LABELS[pub.type] ?? pub.type}
                        </span>
                        <span className="text-xs font-semibold text-foreground">{pub.year}</span>
                        {pub.indexed_in?.slice(0, 3).map((idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">{idx}</span>
                        ))}
                        {pub.is_featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 font-bold">Featured</span>
                        )}
                      </div>
                      <Link href={`/research/publications/${pub.slug}`}>
                        <h3 className="font-bold text-foreground text-base mb-1.5 hover:text-primary transition-colors cursor-pointer">{pub.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-1">
                        {pub.authors?.map((a) => a.name).join("; ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {[pub.journal ?? pub.publisher, pub.volume ? `Vol. ${pub.volume}` : null, pub.issue ? `No. ${pub.issue}` : null, pub.pages ? `pp. ${pub.pages}` : null].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      {pub.doi && (
                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium" data-testid={`btn-doi-${pub.id}`}>
                          <ExternalLink className="w-3.5 h-3.5" /> DOI
                        </a>
                      )}
                      <Link href={`/research/publications/${pub.slug}`} className="text-xs text-primary hover:underline font-medium" data-testid={`btn-view-${pub.id}`}>
                        View <ChevronRight className="w-3 h-3 inline" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(meta?.last_page ?? 1) > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted disabled:opacity-40" data-testid="btn-prev-page">
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">Page {page} of {meta?.last_page}</span>
                <button onClick={() => setPage((p) => Math.min(meta?.last_page ?? 1, p + 1))} disabled={page >= (meta?.last_page ?? 1)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted disabled:opacity-40" data-testid="btn-next-page">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
