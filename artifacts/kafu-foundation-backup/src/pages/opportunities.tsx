import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useOpportunities } from "@/lib/api-hooks";
import type { Opportunity } from "@/lib/api-types";
import { SeoHead } from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Briefcase,
  GraduationCap,
  Megaphone,
  FlaskConical,
  Bell,
  ChevronRight,
  Clock,
  Building2,
  CalendarDays,
  FileDown,
  AlertTriangle,
  ArchiveIcon,
} from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All", icon: <Bell className="w-4 h-4" /> },
  { key: "tender", label: "Tenders", icon: <FileText className="w-4 h-4" /> },
  { key: "vacancy", label: "Vacancies", icon: <Briefcase className="w-4 h-4" /> },
  { key: "internship", label: "Internships", icon: <FlaskConical className="w-4 h-4" /> },
  { key: "call", label: "Calls", icon: <Megaphone className="w-4 h-4" /> },
  { key: "scholarship", label: "Scholarships", icon: <GraduationCap className="w-4 h-4" /> },
  { key: "notice", label: "Notices", icon: <Bell className="w-4 h-4" /> },
];

function getStatusBadge(status: string) {
  if (status === "closing-soon") {
    return (
      <Badge variant="destructive" className="text-xs gap-1" data-testid="badge-closing-soon">
        <AlertTriangle className="w-3 h-3" /> Closing Soon
      </Badge>
    );
  }
  if (status === "open") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs border border-green-200" data-testid="badge-open">
        Open
      </Badge>
    );
  }
  if (status === "closed") {
    return (
      <Badge variant="secondary" className="text-xs" data-testid="badge-closed">
        Closed
      </Badge>
    );
  }
  return null;
}

function getDaysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const now = new Date();
  const dl = new Date(deadline);
  const diff = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDeadline(deadline: string, deadlineTime: string | null) {
  const d = new Date(deadline);
  const formatted = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return deadlineTime ? `${formatted} at ${deadlineTime}` : formatted;
}

function categoryIcon(category: string, className = "w-5 h-5") {
  switch (category) {
    case "tender": return <FileText className={className} />;
    case "vacancy": return <Briefcase className={className} />;
    case "internship": return <FlaskConical className={className} />;
    case "call": return <Megaphone className={className} />;
    case "notice": return <Bell className={className} />;
    case "scholarship": return <GraduationCap className={className} />;
    default: return <FileText className={className} />;
  }
}

function OpportunityCard({ opp }: { opp: Opportunity }) {
  const daysLeft = getDaysUntilDeadline(opp.deadline);

  return (
    <div
      className={`bg-card border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all group relative ${opp.featured ? "border-primary/20 ring-1 ring-primary/10" : ""}`}
      data-testid={`opp-card-${opp.slug}`}
    >
      {opp.featured && (
        <span className="absolute top-0 right-0 mt-3 mr-3">
          <Badge className="bg-primary/10 text-primary border-0 text-xs">Featured</Badge>
        </span>
      )}
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mt-0.5">
          {categoryIcon(opp.category)}
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{opp.reference}</span>
            {getStatusBadge(opp.status)}
          </div>
          <h3 className="font-bold font-serif text-foreground text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {opp.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{opp.department}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{opp.summary}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {opp.deadline ? (
              <span className={`flex items-center gap-1.5 font-medium ${daysLeft !== null && daysLeft <= 7 ? "text-destructive" : ""}`} data-testid={`deadline-${opp.slug}`}>
                <Clock className="w-3.5 h-3.5" />
                Deadline: {formatDeadline(opp.deadline, opp.deadline_time)}
                {daysLeft !== null && daysLeft > 0 && daysLeft <= 30 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded font-semibold ${daysLeft <= 7 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                    {daysLeft}d left
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Published {new Date(opp.publish_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </span>
            )}
            {opp.documents_count > 0 && (
              <span className="flex items-center gap-1.5">
                <FileDown className="w-3.5 h-3.5" />
                {opp.documents_count} document{opp.documents_count > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link href={`/opportunities/${opp.slug}`} data-testid={`btn-view-${opp.slug}`}>
          <Button variant="outline" size="sm" className="gap-1.5 group/btn" data-testid={`link-${opp.slug}`}>
            View Details
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ category }: { category: string }) {
  const messages: Record<string, string> = {
    all: "No opportunities found matching your search.",
    tender: "No open tenders at the moment.",
    vacancy: "No job vacancies currently open.",
    internship: "No internship positions available right now.",
    call: "No active calls for applications.",
    scholarship: "No scholarships open at this time.",
    notice: "No current notices to display.",
  };
  return (
    <div className="text-center py-20 bg-card border border-dashed rounded-xl" data-testid="empty-state">
      <div className="flex justify-center mb-4 text-muted-foreground/30">
        {categoryIcon(category, "w-16 h-16")}
      </div>
      <p className="text-muted-foreground text-sm">{messages[category] ?? messages.all}</p>
    </div>
  );
}

export default function Opportunities() {
  const urlSearch = useSearch();
  const [activeCategory, setActiveCategory] = useState(
    () => new URLSearchParams(urlSearch).get("category") ?? "all"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cat = new URLSearchParams(urlSearch).get("category") ?? "all";
    setActiveCategory(cat);
  }, [urlSearch]);
  const [searchInput, setSearchInput] = useState("");
  const [showArchive, setShowArchive] = useState(false);

  const { data: allOpps, isLoading } = useOpportunities();

  const active = useMemo(() => {
    if (!allOpps) return [];
    return allOpps.filter((o) => o.status !== "closed");
  }, [allOpps]);

  const archived = useMemo(() => {
    if (!allOpps) return [];
    return allOpps.filter((o) => o.status === "closed");
  }, [allOpps]);

  const filtered = useMemo(() => {
    let list = active;
    if (activeCategory !== "all") list = list.filter((o) => o.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.summary.toLowerCase().includes(q) ||
          o.reference.toLowerCase().includes(q) ||
          o.department.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.status === "closing-soon" && b.status !== "closing-soon") return -1;
      if (a.status !== "closing-soon" && b.status === "closing-soon") return 1;
      return 0;
    });
  }, [active, activeCategory, search]);

  const handleSearch = () => setSearch(searchInput);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: active.length };
    for (const o of active) {
      counts[o.category] = (counts[o.category] || 0) + 1;
    }
    return counts;
  }, [active]);

  const closingSoonCount = useMemo(() => active.filter((o) => o.status === "closing-soon").length, [active]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SeoHead
        title="Opportunities — Kaimosi Friends University"
        description="Explore academic, research, and career opportunities at KAFU — fellowships, scholarships, teaching vacancies, staff positions, and student internships."
        path="/opportunities"
        breadcrumbs={[{ name: "Opportunities", path: "/opportunities" }]}
      />
      <div className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Opportunities</h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Tenders, vacancies, internships, scholarships, and calls for applications at Kaimosi Friends University.
            </p>
            <div className="relative max-w-xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-primary-foreground/50" />
                <Input
                  data-testid="search-input"
                  placeholder="Search by title, reference, or department..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-white/15 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:bg-white/20"
                />
              </div>
              <Button
                data-testid="btn-search"
                onClick={handleSearch}
                className="bg-white text-primary hover:bg-white/90 shrink-0"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {closingSoonCount > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20" data-testid="closing-soon-banner">
          <div className="container mx-auto px-4 py-3 flex items-center gap-2 max-w-5xl">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-medium">
              {closingSoonCount} opportunit{closingSoonCount > 1 ? "ies are" : "y is"} closing within 7 days. Act now.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex flex-wrap gap-2 mb-8 justify-center" data-testid="category-tabs">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.key] ?? 0;
            return (
              <button
                key={cat.key}
                data-testid={`tab-${cat.key}`}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat.icon}
                {cat.label}
                {count > 0 && (
                  <span className={`ml-0.5 text-xs px-1.5 rounded-full ${activeCategory === cat.key ? "bg-white/20" : "bg-muted"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="space-y-4" data-testid="loading-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState category={activeCategory} />
        ) : (
          <div className="space-y-4" data-testid="opportunities-list">
            {filtered.map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))}
          </div>
        )}

        {archived.length > 0 && (
          <div className="mt-14 border-t pt-10" data-testid="archive-section">
            <button
              data-testid="btn-toggle-archive"
              onClick={() => setShowArchive((v) => !v)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-6"
            >
              <ArchiveIcon className="w-4 h-4" />
              <span className="font-medium">{showArchive ? "Hide" : "Show"} archive</span>
              <span className="text-xs bg-muted rounded-full px-2 py-0.5">{archived.length}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showArchive ? "rotate-90" : ""}`} />
            </button>
            {showArchive && (
              <div className="space-y-3 opacity-60" data-testid="archive-list">
                {archived.map((opp) => (
                  <OpportunityCard key={opp.id} opp={opp} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
