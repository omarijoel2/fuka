import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { Link } from "wouter";
import { SearchBar } from "@/components/search-bar";
import { FileText, Calendar, GraduationCap, Users, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
  type: string;
  url: string;
  title: string;
  description?: string;
  category?: string;
}

const TYPE_META: Record<string, { label: string; icon: React.ElementType; colour: string }> = {
  news:        { label: "News", icon: FileText, colour: "#1A5C38" },
  event:       { label: "Event", icon: Calendar, colour: "#C9A227" },
  programme:   { label: "Programme", icon: GraduationCap, colour: "#1B3A6B" },
  staff:       { label: "Staff", icon: Users, colour: "#2D6A4F" },
  opportunity: { label: "Opportunity", icon: Briefcase, colour: "#8B1A1A" },
};

function parseSearch(search: string) {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return { q: params.get("q") ?? "" };
}

export default function SearchPage() {
  const [location] = useLocation();
  const { q } = parseSearch(window.location.search);
  const [filterType, setFilterType] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => fetch(`/api/search?q=${encodeURIComponent(q)}`).then(r => r.json()),
    enabled: q.length >= 2,
    staleTime: 60_000,
  });

  const allResults: SearchResult[] = data?.data?.results ?? [];
  const filtered = filterType === "all" ? allResults : allResults.filter(r => r.type === filterType);
  const typeCounts = allResults.reduce<Record<string, number>>((acc, r) => { acc[r.type] = (acc[r.type] ?? 0) + 1; return acc; }, {});

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={q ? `Search: "${q}" — KAFU` : "Search — KAFU"}
        description="Search across programmes, news, staff, events, and opportunities at Kaimosi Friends University."
        path="/search"
      />

      {/* Search hero */}
      <section className="py-14 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-serif font-bold mb-6">Search KAFU</h1>
          <SearchBar />
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* Query summary */}
          {q && (
            <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Searching..." : `${allResults.length} result${allResults.length !== 1 ? "s" : ""} for `}
                {!isLoading && <strong className="text-foreground">"{q}"</strong>}
              </p>
            </div>
          )}

          {/* Type filters */}
          {allResults.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              <button
                onClick={() => setFilterType("all")}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filterType === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50"}`}
                data-testid="search-filter-all"
              >
                All ({allResults.length})
              </button>
              {Object.entries(typeCounts).map(([type, count]) => {
                const meta = TYPE_META[type];
                if (!meta) return null;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type === filterType ? "all" : type)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filterType === type ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50"}`}
                    data-testid={`search-filter-${type}`}
                  >
                    {meta.label} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Searching...
            </div>
          )}

          {/* No query */}
          {!q && !isLoading && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-2">Start typing to search</p>
              <p className="text-sm">Search across programmes, news, staff, events, and opportunities.</p>
            </div>
          )}

          {/* No results */}
          {q && !isLoading && allResults.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg font-medium mb-2 text-foreground">No results for "{q}"</p>
              <p className="text-sm text-muted-foreground mb-6">Try different keywords or browse the sections below.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" asChild><Link href="/programmes">Browse Programmes</Link></Button>
                <Button variant="outline" asChild><Link href="/news">Latest News</Link></Button>
                <Button variant="outline" asChild><Link href="/staff">Staff Directory</Link></Button>
              </div>
            </div>
          )}

          {/* Results list */}
          {filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map((r, i) => {
                const meta = TYPE_META[r.type] ?? { label: r.type, icon: FileText, colour: "#888" };
                const Icon = meta.icon;
                return (
                  <Link
                    key={i}
                    href={r.url}
                    data-testid={`search-result-item-${i}`}
                    className="group flex gap-4 p-5 rounded-xl border bg-card hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: meta.colour + "18" }}>
                      <Icon className="w-5 h-5" style={{ color: meta.colour }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.colour }}>{meta.label}</span>
                        {r.category && <><span className="text-muted-foreground text-xs">·</span><span className="text-xs text-muted-foreground">{r.category}</span></>}
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1">{r.title}</h3>
                      {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 self-center" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
