import React, { useState } from "react";
import { Link } from "wouter";
import { useAnnouncements } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, Bell, ChevronRight, ArrowRight, Calendar, Tag } from "lucide-react";
import { SeoHead } from "@/components/seo-head";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function Announcements() {
  const [priority, setPriority] = useState<"all" | "urgent" | "normal">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: announcements, isLoading } = useAnnouncements({
    priority: priority !== "all" ? priority : undefined,
    search: debouncedSearch || undefined,
  });

  const urgent = announcements?.filter((a) => a.priority === "urgent") ?? [];
  const normal = announcements?.filter((a) => a.priority === "normal") ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Announcements — Kaimosi Friends University"
        description="Official announcements from Kaimosi Friends University — academic notices, examination schedules, registration deadlines, and institutional updates."
        path="/announcements"
        breadcrumbs={[{ name: "Announcements", path: "/announcements" }]}
      />
      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0d2347]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 30%, #D4A017 0%, transparent 60%)" }}
        />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Announcements</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Official Announcements</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Official notices, administrative updates, academic communications, and urgent alerts from university offices and departments.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-background border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              data-testid="input-announcements-search"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "urgent", "normal"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border capitalize ${
                  priority === p
                    ? p === "urgent"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                }`}
                data-testid={`tab-priority-${p}`}
              >
                {p === "urgent" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : announcements?.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-xl">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2 font-serif">No announcements found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Urgent announcements */}
            {urgent.length > 0 && priority !== "normal" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h2 className="text-base font-bold text-red-600 uppercase tracking-wider text-sm">Urgent Notices</h2>
                </div>
                <div className="space-y-3">
                  {urgent.map((ann) => (
                    <Link key={ann.id} href={`/announcements/${ann.slug}`} data-testid={`announcement-card-${ann.id}`}>
                      <div className="group bg-red-50 border border-red-200 rounded-xl overflow-hidden hover:border-red-400 hover:shadow-md transition-all">
                        {ann.imageUrl && (
                          <div className="h-40 overflow-hidden">
                            <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-4 p-5">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" /> Urgent
                              </span>
                              <span className="text-xs text-muted-foreground font-medium">{ann.department}</span>
                            </div>
                            <h3 className="font-serif font-bold text-foreground group-hover:text-red-700 transition-colors line-clamp-2 mb-2">
                              {ann.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ann.summary}</p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {formatDate(ann.publish_date)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Normal announcements */}
            {normal.length > 0 && priority !== "urgent" && (
              <div>
                {urgent.length > 0 && priority === "all" && (
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-primary" />
                    <h2 className="text-base font-bold text-primary uppercase tracking-wider text-sm">General Notices</h2>
                  </div>
                )}
                <div className="space-y-3">
                  {normal.map((ann) => (
                    <Link key={ann.id} href={`/announcements/${ann.slug}`} data-testid={`announcement-card-${ann.id}`}>
                      <div className="group bg-card border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all">
                        {ann.imageUrl && (
                          <div className="h-40 overflow-hidden">
                            <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-4 p-5">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs text-muted-foreground font-semibold bg-secondary px-2 py-0.5 rounded">
                                {ann.department}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {ann.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                    <Tag className="w-2.5 h-2.5" /> {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                              {ann.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ann.summary}</p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {formatDate(ann.publish_date)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
