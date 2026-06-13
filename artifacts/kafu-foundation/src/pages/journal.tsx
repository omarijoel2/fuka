import React, { useState } from "react";
import { Link } from "wouter";
import { useJournal } from "@/lib/api-hooks";
import { Search, FileText, Download, Eye, ChevronRight, Calendar } from "lucide-react";
import { SeoHead } from "@/components/seo-head";

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function fileSizeLabel(kb: number | null): string {
  if (!kb) return "";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}

export default function Journal() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: items, isLoading } = useJournal({
    category: category !== "All" ? category : undefined,
    search: debouncedSearch || undefined,
  });

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    (items ?? []).forEach((i) => { if (i.category) set.add(i.category); });
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Journal — Kaimosi Friends University"
        description="The KAFU Journal — browse, view and download published journal issues, volumes and academic documents from Kaimosi Friends University."
        path="/journal"
        breadcrumbs={[{ name: "Journal", path: "/journal" }]}
      />

      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <img
          src="/images/uploads/campus-main.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.3)" }}
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline" data-testid="link-journal-breadcrumb-home">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Journal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">KAFU Journal</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Browse, view and download published journal issues, volumes and academic documents from Kaimosi Friends University.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-background border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search journal..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              data-testid="input-journal-search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                data-testid={`btn-journal-category-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
                <div className="h-44 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-9 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (items?.length ?? 0) === 0 ? (
          <div className="text-center py-20" data-testid="journal-empty">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No journal documents available yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items!.map((item) => (
              <article
                key={item.id}
                data-testid={`card-journal-${item.id}`}
                className="group rounded-xl border bg-card overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="relative h-44 bg-muted overflow-hidden">
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <FileText className="w-14 h-14 text-primary/30" />
                    </div>
                  )}
                  {item.file_type && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold tracking-wide">
                      {item.file_type}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {item.category && (
                    <span className="text-xs font-medium text-secondary mb-1.5">{item.category}</span>
                  )}
                  <h2 className="font-serif font-semibold text-lg leading-snug mb-2 line-clamp-2">
                    {item.title}
                  </h2>
                  {item.issue_label && (
                    <p className="text-sm text-muted-foreground mb-1">{item.issue_label}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.publication_date)}</span>
                    {item.file_size_kb ? (
                      <>
                        <span className="opacity-50">·</span>
                        <span>{fileSizeLabel(item.file_size_kb)}</span>
                      </>
                    ) : null}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {item.description}
                    </p>
                  )}

                  <div className="flex gap-2 mt-auto pt-2">
                    {item.file_url ? (
                      <>
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`btn-journal-view-${item.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition"
                        >
                          <Eye className="w-4 h-4" /> View
                        </a>
                        <a
                          href={item.file_url}
                          download={item.file_name ?? undefined}
                          data-testid={`btn-journal-download-${item.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Document unavailable</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
