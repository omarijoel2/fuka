import React from "react";
import { Link } from "wouter";
import { useStaff } from "@/lib/api-hooks";
import type { StaffMember } from "@/lib/api-types";
import { SeoHead } from "@/components/seo-head";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronRight,
  GraduationCap,
  Mail,
  Users,
  Filter,
  X,
  TrendingUp,
} from "lucide-react";

const SCHOOLS = [
  { code: "", label: "All Schools" },
  { code: "SESS", label: "SESS — Education & Social Sciences" },
  { code: "SBE", label: "SBE — Business & Economics" },
  { code: "SCIT", label: "SCIT — Computing & IT" },
  { code: "SOS", label: "SOS — Science" },
  { code: "SHS", label: "SHS — Health Sciences" },
  { code: "leadership", label: "University Leadership" },
];

const RANKS = [
  { value: "", label: "All Ranks" },
  { value: "Professor", label: "Professor" },
  { value: "Associate Professor", label: "Associate Professor" },
  { value: "Senior Lecturer", label: "Senior Lecturer" },
  { value: "Lecturer", label: "Lecturer" },
  { value: "Tutorial Fellow", label: "Tutorial Fellow" },
  { value: "Dean", label: "Deans" },
];

const RESEARCH_THEMES = [
  "Artificial Intelligence",
  "Malaria & Tropical Diseases",
  "Environmental Science",
  "Education Policy",
  "Entrepreneurship",
  "Eye Health",
  "NLP & African Languages",
  "Water Quality",
];

const SCHOOL_COLORS: Record<string, string> = {
  SESS: "bg-purple-100 text-purple-800 border-purple-200",
  SBE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  SCIT: "bg-teal-100 text-teal-800 border-teal-200",
  SOS: "bg-green-100 text-green-800 border-green-200",
  SHS: "bg-red-100 text-red-800 border-red-200",
  leadership: "bg-amber-100 text-amber-800 border-amber-200",
};

function getInitials(name: string) {
  const parts = name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.|Rev\.)\s*/i, "").split(" ");
  return parts
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function getAvatarGradient(slug: string) {
  const gradients = [
    "from-primary to-primary/80",
    "from-primary to-primary/70",
    "from-purple-700 to-purple-900",
    "from-teal-700 to-teal-900",
    "from-green-700 to-green-900",
    "from-red-700 to-red-900",
    "from-indigo-700 to-indigo-900",
  ];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffff;
  return gradients[hash % gradients.length];
}

function StaffCard({ member }: { member: StaffMember }) {
  const gradient = getAvatarGradient(member.slug);
  const schoolOrUnit = member.school ?? (member.unit === "University Leadership" ? "leadership" : null);

  return (
    <Link
      href={`/staff/${member.slug}`}
      className="group bg-card border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
      data-testid={`staff-card-${member.slug}`}
    >
      {/* Avatar */}
      <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-4xl font-serif font-bold opacity-90 select-none">
            {getInitials(member.name)}
          </span>
        )}
        {schoolOrUnit && (
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${SCHOOL_COLORS[schoolOrUnit] ?? "bg-white/90 text-primary border-primary/20"}`}
          >
            {member.school ?? "Leadership"}
          </span>
        )}
        {(member as any).orcid_id && (
          <span className="absolute top-3 left-3 w-5 h-5 rounded bg-[#A6CE39] flex items-center justify-center text-white text-[9px] font-bold" title="ORCID verified">
            iD
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-foreground text-base leading-tight mb-1 group-hover:text-primary transition-colors">
          {member.name}
        </h3>
        <p className="text-xs text-accent font-semibold mb-0.5">{member.designation}</p>
        {(member as any).rank && (
          <p className="text-xs text-muted-foreground mb-0.5">{(member as any).rank}</p>
        )}
        <p className="text-xs text-muted-foreground mb-3">{member.department}</p>

        {member.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {member.specializations.slice(0, 2).map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <span className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{member.email}</span>
          </span>
          <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border rounded-xl overflow-hidden animate-pulse">
      <div className="h-36 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-5 w-24 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function StaffDirectoryPage() {
  const [search, setSearch] = React.useState("");
  const [school, setSchool] = React.useState("");
  const [rank, setRank] = React.useState("");
  const [researchTheme, setResearchTheme] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const apiSchool = school === "leadership" ? "" : school;
  const { data: allStaff, isLoading } = useStaff({
    school: apiSchool || undefined,
    search: debouncedSearch || undefined,
    rank: rank || undefined,
  });

  const staff = React.useMemo(() => {
    if (!allStaff) return [];
    let filtered = allStaff;
    if (school === "leadership") {
      filtered = filtered.filter((s) => s.unit === "University Leadership");
    }
    if (researchTheme) {
      filtered = filtered.filter((s) =>
        s.specializations.some((sp) =>
          sp.toLowerCase().includes(researchTheme.toLowerCase())
        )
      );
    }
    return filtered;
  }, [allStaff, school, researchTheme]);

  const hasFilters = !!search || !!school || !!rank || !!researchTheme;

  const clearFilters = () => {
    setSearch("");
    setSchool("");
    setRank("");
    setResearchTheme("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Staff Directory — Kaimosi Friends University"
        description="Meet KAFU's academic and administrative staff — professors, senior lecturers, researchers, and professional staff across all five schools."
        path="/staff"
        breadcrumbs={[{ name: "Staff Directory", path: "/staff" }]}
      />
      {/* Hero */}
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 20% 60%, #C9A227 0%, transparent 55%)" }}
        />
        <div className="container mx-auto px-4 py-14 relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-primary-foreground/70 mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-white/90">Staff Directory</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold">Staff Directory</h1>
              <p className="text-primary-foreground/75 text-sm mt-1">Kaimosi Friends University — Academic and Administrative Staff</p>
            </div>
          </div>
          <p className="text-primary-foreground/80 text-base max-w-2xl mt-4">
            Meet the scholars, researchers, and professionals shaping KAFU's academic mission. Browse by school, rank, or research theme.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-card sticky top-[70px] z-30">
        <div className="container mx-auto px-4 py-3">
          {/* Main filter row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9 h-10 text-sm"
                placeholder="Search by name, role, or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="staff-search-input"
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch("")}
                  data-testid="staff-search-clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                className="h-10 border rounded-md px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                data-testid="staff-school-filter"
              >
                {SCHOOLS.map((s) => (
                  <option key={s.code} value={s.code}>{s.label}</option>
                ))}
              </select>
              <select
                className="h-10 border rounded-md px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                data-testid="staff-rank-filter"
              >
                {RANKS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground h-10 shrink-0"
                data-testid="staff-clear-filters"
              >
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {/* Research theme chip bar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Research:
            </span>
            {RESEARCH_THEMES.map((theme) => (
              <button
                key={theme}
                onClick={() => setResearchTheme(researchTheme === theme ? "" : theme)}
                className={`text-xs px-3 py-1.5 rounded-full border shrink-0 transition-all ${
                  researchTheme === theme
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
                data-testid={`theme-chip-${theme.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 flex-1">
        {/* Count + context */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            ) : (
              <span>
                <strong className="text-foreground">{staff.length}</strong> staff member{staff.length !== 1 ? "s" : ""} found
                {school && ` in ${SCHOOLS.find((s) => s.code === school)?.label}`}
                {rank && ` · ${rank}`}
                {researchTheme && ` · ${researchTheme}`}
              </span>
            )}
          </div>
          <Button variant="ghost" className="text-primary text-sm" asChild>
            <Link href="/schools">
              <GraduationCap className="w-4 h-4 mr-1.5" /> Browse Schools
            </Link>
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No staff found</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Try adjusting your search or filters to find what you are looking for.
            </p>
            <Button variant="outline" onClick={clearFilters} data-testid="btn-clear-all-filters">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {staff.map((member) => (
              <StaffCard key={member.slug} member={member} />
            ))}
          </div>
        )}

        {/* School Browse */}
        {!hasFilters && !isLoading && (
          <div className="mt-14 border-t pt-10">
            <h2 className="text-xl font-serif font-bold text-primary mb-5">Browse by School</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {SCHOOLS.filter((s) => s.code && s.code !== "leadership").map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSchool(s.code)}
                  className={`p-4 rounded-xl border text-left hover:border-primary hover:shadow-sm transition-all ${SCHOOL_COLORS[s.code] ?? ""}`}
                  data-testid={`browse-school-${s.code}`}
                >
                  <span className="font-bold text-sm block">{s.code}</span>
                  <span className="text-xs mt-1 block leading-snug">
                    {s.label.replace(`${s.code} — `, "")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
