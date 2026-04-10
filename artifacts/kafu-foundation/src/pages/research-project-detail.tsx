import React from "react";
import { Link } from "wouter";
import { useResearchProject } from "@/lib/api-hooks";
import { ChevronRight, Calendar, User, Building2, Banknote, FlaskConical, ExternalLink, Tag } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  active: "Active", completed: "Completed", planned: "Planned", suspended: "Suspended",
};
const STATUS_COLOURS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  planned: "bg-yellow-100 text-yellow-800",
  suspended: "bg-gray-100 text-gray-600",
};
const SDG_COLOURS: Record<number, string> = {
  1: "#E5243B", 2: "#DDA63A", 3: "#4C9F38", 4: "#C5192D", 5: "#FF3A21",
  6: "#26BDE2", 7: "#FCC30B", 8: "#A21942", 9: "#FD6925", 10: "#DD1367",
  11: "#FD9D24", 12: "#BF8B2E", 13: "#3F7E44", 14: "#0A97D9", 15: "#56C02B",
  16: "#00689D", 17: "#19486A",
};
const SDG_LABELS: Record<number, string> = {
  1: "No Poverty", 2: "Zero Hunger", 3: "Good Health", 4: "Quality Education",
  5: "Gender Equality", 6: "Clean Water", 7: "Affordable Energy", 8: "Decent Work",
  9: "Industry & Innovation", 10: "Reduced Inequalities", 11: "Sustainable Cities",
  12: "Responsible Consumption", 13: "Climate Action", 14: "Life Below Water",
  15: "Life on Land", 16: "Peace & Justice", 17: "Partnerships for Goals",
};

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function formatCurrency(amount?: number, currency = "KES") {
  if (!amount) return null;
  return new Intl.NumberFormat("en-KE", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default function ResearchProjectDetail({ slug }: { slug: string }) {
  const { data: project, isLoading, error } = useResearchProject(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <Link href="/research/projects" className="text-primary hover:underline">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 overflow-hidden">
        {project.featured_image_url ? (
          <img src={project.featured_image_url} alt="" aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2)" }} />
        ) : (
          <div className="absolute inset-0 bg-primary/90" />
        )}
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4 flex-wrap">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/research" className="hover:underline">Research</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/research/projects" className="hover:underline">Projects</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="truncate max-w-xs">{project.title}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.theme && (
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: project.theme.colour }}>
                {project.theme.name}
              </span>
            )}
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLOURS[project.status]}`}>
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 leading-tight max-w-4xl">{project.title}</h1>
          <p className="text-primary-foreground/70">{project.department}</p>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Abstract</h2>
              <p className="text-foreground leading-relaxed">{project.abstract}</p>
            </div>

            {/* Co-researchers */}
            {(project.co_researchers?.length ?? 0) > 0 && (
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Research Team</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{project.lead_researcher}</p>
                      <p className="text-xs text-muted-foreground">Lead Researcher</p>
                    </div>
                  </div>
                  {project.co_researchers?.map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">Co-Researcher</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SDG Alignment */}
            {(project.sdg_goals?.length ?? 0) > 0 && (
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">SDG Alignment</h2>
                <div className="flex flex-wrap gap-3">
                  {project.sdg_goals?.map((sdg) => (
                    <div key={sdg} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: SDG_COLOURS[sdg] + "15", borderLeft: `3px solid ${SDG_COLOURS[sdg]}` }}>
                      <span className="text-xs font-bold" style={{ color: SDG_COLOURS[sdg] }}>SDG {sdg}</span>
                      <span className="text-xs text-foreground">{SDG_LABELS[sdg]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {(project.publications?.length ?? 0) > 0 && (
              <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Research Outputs</h2>
                <div className="space-y-4">
                  {project.publications?.map((pub) => (
                    <div key={pub.id} className="border-l-2 border-primary/30 pl-4">
                      <div className="flex flex-wrap gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {pub.type?.replace("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">{pub.year}</span>
                      </div>
                      <Link href={`/research/publications/${pub.slug}`}>
                        <h4 className="font-semibold text-sm text-foreground hover:text-primary transition-colors">{pub.title}</h4>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {pub.authors?.map((a) => a.name).join("; ")}
                        {pub.journal && ` · ${pub.journal}`}
                      </p>
                      {pub.doi && (
                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink className="w-3 h-3" /> DOI: {pub.doi}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Project details */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-sm text-foreground">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Duration</p>
                    <p className="font-medium">{formatDate(project.start_date)} — {formatDate(project.end_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Department</p>
                    <p className="font-medium">{project.department ?? "—"}</p>
                  </div>
                </div>
                {project.funding_source && (
                  <div className="flex items-start gap-3">
                    <Banknote className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Funding Source</p>
                      <p className="font-medium">{project.funding_source}</p>
                    </div>
                  </div>
                )}
                {project.grant?.amount && (
                  <div className="flex items-start gap-3">
                    <Banknote className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Grant Value</p>
                      <p className="font-medium">{formatCurrency(project.grant.amount, project.grant.currency)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Theme */}
            {project.theme && (
              <div className="rounded-xl border border-border shadow-sm p-5" style={{ borderLeftWidth: 4, borderLeftColor: project.theme.colour }}>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Research Theme</p>
                <p className="font-bold text-foreground">{project.theme.name}</p>
                {project.theme.description && <p className="text-xs text-muted-foreground mt-1">{project.theme.description}</p>}
              </div>
            )}

            <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
              <h3 className="font-bold text-sm text-primary mb-2">Research Collaboration</h3>
              <p className="text-xs text-muted-foreground mb-3">Interested in collaborating on this or related research? Contact KAFU's Research Office.</p>
              <Link href="/contact">
                <button className="w-full text-xs font-semibold bg-primary text-white rounded-lg py-2 hover:opacity-90 transition" data-testid="btn-research-contact">
                  Contact Research Office
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
