import React, { useState } from "react";
import { Link } from "wouter";
import { useResearchProjects, useResearchOverview } from "@/lib/api-hooks";
import { ChevronRight, Search, FlaskConical, Filter, ArrowRight } from "lucide-react";
import { SeoHead } from "@/components/seo-head";

const STATUS_LABELS: Record<string, string> = {
  active: "Active", completed: "Completed", planned: "Planned", suspended: "Suspended",
};
const STATUS_COLOURS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  planned: "bg-yellow-100 text-yellow-800",
  suspended: "bg-gray-100 text-gray-600",
};
const PUB_TYPE_LABELS: Record<string, string> = {
  journal: "Journal Article", conference: "Conference Paper", book_chapter: "Book Chapter",
  thesis: "Thesis", report: "Report", book: "Book", preprint: "Preprint",
};

export default function ResearchProjects() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: overview } = useResearchOverview();
  const { data: result, isLoading } = useResearchProjects({
    theme: themeFilter || undefined,
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
    page,
    per_page: 12,
  });

  const projects = result?.data ?? [];
  const meta = result;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Research Projects — Kaimosi Friends University"
        description="Explore active and completed research projects at KAFU — funded studies across AI, public health, environmental science, agriculture, education, and social development."
        path="/research/projects"
        breadcrumbs={[{ name: "Research", path: "/research" }, { name: "Projects", path: "/research/projects" }]}
      />
      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <img src="https://kafu.ac.ke/wp-content/uploads/2021/01/1.-Student-visual-acuity.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2)" }} />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/research" className="hover:underline">Research</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Projects</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Research Projects</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Explore KAFU research projects across all disciplines and themes — from community health to digital innovation.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-background border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search projects..." data-testid="input-projects-search"
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={themeFilter} onChange={(e) => { setThemeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-theme-filter">
            <option value="">All Themes</option>
            {(overview?.themes ?? []).map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-status-filter">
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FlaskConical className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No projects found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {meta?.total ?? 0} project{(meta?.total ?? 0) !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/research/projects/${project.slug}`}>
                  <div className="group bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" data-testid={`project-card-${project.slug}`}>
                    {project.featured_image_url ? (
                      <div className="aspect-video overflow-hidden">
                        <img src={project.featured_image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <FlaskConical className="w-10 h-10 text-primary/30" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {project.theme && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: project.theme.colour }}>
                            {project.theme.name}
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOURS[project.status]}`}>
                          {STATUS_LABELS[project.status]}
                        </span>
                      </div>
                      <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">{project.abstract}</p>
                      <div className="text-xs text-muted-foreground border-t border-border pt-3 flex flex-col gap-1">
                        <span><span className="font-medium text-foreground">{project.lead_researcher}</span></span>
                        {project.department && <span>{project.department}</span>}
                        {project.funding_source && <span className="text-primary/80">Funded by {project.funding_source}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
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
