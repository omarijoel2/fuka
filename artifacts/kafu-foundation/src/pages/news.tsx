import React, { useState } from "react";
import { Link } from "wouter";
import { useNews } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Tag, ArrowRight, User, ChevronRight } from "lucide-react";
import { SeoHead } from "@/components/seo-head";

const CATEGORIES = ["All", "Research & Innovation", "Institutional", "Academic", "Outreach", "Partnerships", "Leadership", "Events"];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function News() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: articles, isLoading } = useNews({
    category: category !== "All" ? category : undefined,
    search: debouncedSearch || undefined,
  });

  const featured = articles?.find((a) => a.featured);
  const rest = articles?.filter((a) => !a.featured) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="News — Kaimosi Friends University"
        description="Latest news from Kaimosi Friends University — research breakthroughs, institutional milestones, academic achievements, and community impact stories."
        path="/news"
        breadcrumbs={[{ name: "News", path: "/news" }]}
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
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>News</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">University News</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Official news, research highlights, partnerships, and institutional updates from Kaimosi Friends University.
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
              placeholder="Search news..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              data-testid="input-news-search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                }`}
                data-testid={`tab-news-${cat.toLowerCase().replace(/\s+&\s+|[\s]+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-8">
            <div className="h-72 bg-muted rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : articles?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-lg">No articles found</p>
            <p className="text-sm mt-1">Try adjusting your search or selecting a different category.</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && category === "All" && !debouncedSearch && (
              <Link href={featured.content_type === "article" ? `/articles/${featured.slug}` : `/news/${featured.slug}`} data-testid={`news-featured-${featured.id}`}>
                <div className="mb-10 group rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-lg hover:border-primary/30 transition-all flex flex-col md:flex-row">
                  <div className="md:w-5/12 h-56 md:h-auto overflow-hidden bg-primary/5">
                    {featured.imageUrl ? (
                      <img
                        src={featured.imageUrl}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <span className="text-white/30 text-8xl font-serif font-bold">K</span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {featured.category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground mb-5 line-clamp-3 leading-relaxed">{featured.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(featured.date)}</span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {featured.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Read Full Story <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(category !== "All" || debouncedSearch ? articles : rest)?.map((article) => (
                <Link
                  key={article.id}
                  href={article.content_type === "article" ? `/articles/${article.slug}` : `/news/${article.slug}`}
                  data-testid={`news-card-${article.id}`}
                >
                  <div className="group h-full flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-md hover:border-primary/30 transition-all">
                    <div className="h-44 overflow-hidden bg-primary/5 shrink-0">
                      {article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <span className="text-primary/20 text-6xl font-serif font-bold">K</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-3 flex-1 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{article.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(article.date)}
                        </span>
                        <span className="text-xs font-medium text-primary group-hover:text-accent transition-colors flex items-center gap-1">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
