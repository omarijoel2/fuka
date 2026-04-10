import React from "react";
import { Link } from "wouter";
import { useResearchOverview } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, FlaskConical, Users, Banknote, ArrowRight, ExternalLink, Globe } from "lucide-react";

const SDG_LABELS: Record<number, string> = {
  1: "No Poverty", 2: "Zero Hunger", 3: "Good Health", 4: "Quality Education",
  5: "Gender Equality", 6: "Clean Water", 7: "Affordable Energy", 8: "Decent Work",
  9: "Industry & Innovation", 10: "Reduced Inequalities", 11: "Sustainable Cities",
  12: "Responsible Consumption", 13: "Climate Action", 14: "Life Below Water",
  15: "Life on Land", 16: "Peace & Justice", 17: "Partnerships for Goals",
};

const SDG_COLOURS: Record<number, string> = {
  1: "#E5243B", 2: "#DDA63A", 3: "#4C9F38", 4: "#C5192D", 5: "#FF3A21",
  6: "#26BDE2", 7: "#FCC30B", 8: "#A21942", 9: "#FD6925", 10: "#DD1367",
  11: "#FD9D24", 12: "#BF8B2E", 13: "#3F7E44", 14: "#0A97D9", 15: "#56C02B",
  16: "#00689D", 17: "#19486A",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  completed: "Completed",
  planned: "Planned",
  suspended: "Suspended",
};

const STATUS_COLOURS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  planned: "bg-yellow-100 text-yellow-800",
  suspended: "bg-gray-100 text-gray-600",
};

export default function Research() {
  const { data: overview, isLoading } = useResearchOverview();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
        <img
          src="https://kafu.ac.ke/wp-content/uploads/2025/10/campus-1-scaled.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.25)" }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Research & Innovation</span>
          </div>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/60 mb-3">Research & Innovation</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-5 leading-tight">
              Knowledge That<br />Transforms Communities
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl">
              Kaimosi Friends University is committed to generating research that addresses real challenges in health, agriculture, technology, education, and the environment — rooted in our community and connected to the world.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/research/projects">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold" data-testid="btn-view-projects">
                  View Research Projects <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/research/publications">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" data-testid="btn-view-publications">
                  Browse Publications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {!isLoading && overview?.stats && (
        <div className="bg-white border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 divide-x divide-border">
              {overview.stats.map((s) => (
                <div key={s.label} className="px-4 first:pl-0 last:pr-0 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Research Themes */}
      {!isLoading && (overview?.themes?.length ?? 0) > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Focus Areas</p>
                <h2 className="text-3xl font-serif font-bold text-foreground">Research Themes</h2>
                <p className="text-muted-foreground mt-2 max-w-xl">Our research is organised around six strategic themes aligned with Kenya's national development priorities and the United Nations Sustainable Development Goals.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {overview?.themes.map((theme) => (
                <div
                  key={theme.id}
                  className="bg-white rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow"
                  data-testid={`theme-card-${theme.slug}`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: theme.colour + "20" }}
                  >
                    <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: theme.colour }} />
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-2">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{theme.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(theme.sdg_goals ?? []).slice(0, 4).map((sdg) => (
                      <span
                        key={sdg}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: SDG_COLOURS[sdg] ?? "#666" }}
                        title={`SDG ${sdg}: ${SDG_LABELS[sdg]}`}
                      >
                        SDG {sdg}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {theme.projects_count ?? 0} project{theme.projects_count !== 1 ? "s" : ""}
                    {(theme.publications_count ?? 0) > 0 ? ` · ${theme.publications_count} publication${theme.publications_count !== 1 ? "s" : ""}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {!isLoading && (overview?.featured_projects?.length ?? 0) > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Active Research</p>
                <h2 className="text-3xl font-serif font-bold text-foreground">Featured Projects</h2>
              </div>
              <Link href="/research/projects" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                View all projects <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overview?.featured_projects.map((project) => (
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
                      <div className="flex items-center gap-2 mb-3">
                        {project.theme && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: project.theme.colour }}>
                            {project.theme.name}
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOURS[project.status]}`}>
                          {STATUS_LABELS[project.status]}
                        </span>
                      </div>
                      <h3 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">{project.abstract}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{project.lead_researcher}</span>
                        {project.department && ` · ${project.department}`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Publications */}
      {!isLoading && (overview?.featured_publications?.length ?? 0) > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Scholarly Output</p>
                <h2 className="text-3xl font-serif font-bold text-foreground">Recent Publications</h2>
              </div>
              <Link href="/research/publications" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                Browse all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-4">
              {overview?.featured_publications.map((pub) => (
                <div key={pub.id} className="bg-white rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow" data-testid={`pub-card-${pub.slug}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {pub.type.replace("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">{pub.year}</span>
                        {pub.indexed_in?.slice(0, 2).map((idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">{idx}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-foreground text-base mb-1">{pub.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pub.authors?.map((a) => a.name).join("; ")}
                        {pub.journal && ` · ${pub.journal}`}
                        {pub.volume && ` · Vol. ${pub.volume}`}
                        {pub.pages && `, pp. ${pub.pages}`}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {pub.doi && (
                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                          <ExternalLink className="w-3.5 h-3.5" /> DOI
                        </a>
                      )}
                      <Link href={`/research/publications/${pub.slug}`} className="text-xs text-primary hover:underline font-medium">
                        Details <ChevronRight className="w-3 h-3 inline" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick links */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: "/research/projects", icon: <FlaskConical className="w-6 h-6" />, title: "Research Projects", desc: "Browse all research projects by theme, status, or department" },
              { href: "/research/publications", icon: <BookOpen className="w-6 h-6" />, title: "Publications", desc: "Access the full KAFU research publications repository" },
              { href: "/research/partnerships", icon: <Globe className="w-6 h-6" />, title: "Partnerships & Grants", desc: "Explore our research collaborators and active grants" },
              { href: "/staff", icon: <Users className="w-6 h-6" />, title: "Research Staff", desc: "Meet the researchers driving KAFU's scholarly agenda" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="bg-white/10 hover:bg-white/20 rounded-xl p-6 transition-colors cursor-pointer h-full" data-testid={`quicklink-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="mb-3 opacity-80">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
