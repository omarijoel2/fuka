import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useProgrammes, useSchools } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import {
  Search,
  BookOpen,
  Clock,
  GraduationCap,
  ChevronRight,
  FilterX,
  GitCompare,
  X,
  CheckCircle2,
} from "lucide-react";
import { addToCompare, removeFromCompare, isInCompare, getCompareList } from "@/lib/compare-store";

const SCHOOL_NAMES: Record<string, string> = {
  SESS: "Education & Social Sciences",
  SBE: "Business & Economics",
  SCIT: "Computing & IT",
  SOS: "Science",
  SHS: "Health Sciences",
};

const LEVEL_LABELS: Record<string, string> = {
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  doctoral: "Doctoral",
};

const LEVEL_COLORS: Record<string, string> = {
  undergraduate: "bg-emerald-50 text-emerald-700 border-emerald-200",
  postgraduate: "bg-purple-50 text-purple-700 border-purple-200",
  doctoral: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Programmes() {
  const searchParams = new URLSearchParams(window.location.search);
  const [schoolFilter, setSchoolFilter] = useState(searchParams.get("school") || "all");
  const [levelFilter, setLevelFilter] = useState(searchParams.get("level") || "all");
  const [modeFilter, setModeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareList, setCompareList] = useState(getCompareList());
  const [compareMax, setCompareMax] = useState(false);
  const [, navigate] = useLocation();

  const { data: schools } = useSchools();
  const { data: programmes, isLoading } = useProgrammes(
    schoolFilter !== "all" ? schoolFilter : undefined,
    levelFilter !== "all" ? levelFilter : undefined
  );

  const filtered = (programmes ?? []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode =
      modeFilter === "all" ||
      (modeFilter === "full-time" && !p.name.toLowerCase().includes("part")) ||
      (modeFilter === "part-time" && p.level === "postgraduate");
    return matchesSearch && matchesMode;
  });

  const hasFilters = schoolFilter !== "all" || levelFilter !== "all" || modeFilter !== "all" || searchQuery !== "";

  function toggleCompare(prog: { school: string; code: string; name: string }) {
    if (isInCompare(prog.school, prog.code)) {
      removeFromCompare(prog.school, prog.code);
    } else {
      const ok = addToCompare(prog);
      if (!ok) {
        setCompareMax(true);
        setTimeout(() => setCompareMax(false), 3000);
        return;
      }
    }
    setCompareList(getCompareList());
  }

  // Sync compare list on focus (if user navigated away)
  useEffect(() => {
    const handler = () => setCompareList(getCompareList());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Academic Programmes — Kaimosi Friends University"
        description="Browse KAFU's academic programmes — undergraduate, postgraduate, and doctoral degrees in Business, Education, Computing, Science, and Health Sciences."
        path="/programmes"
        breadcrumbs={[{ name: "Programmes", path: "/programmes" }]}
      />
      {/* Hero */}
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #D4A017 0%, transparent 60%)" }}
        />
        <div className="container mx-auto px-4 py-14 relative z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-5">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Programmes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Academic Catalogue</h1>
          <p className="text-primary-foreground/80 max-w-2xl text-lg">
            Browse 38+ undergraduate, postgraduate, and doctoral programmes across five schools. Use the compare tool to evaluate programmes side-by-side.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild data-testid="hero-btn-eligibility">
              <Link href="/admissions/eligibility">Check Your Eligibility</Link>
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10" asChild data-testid="hero-btn-fees">
              <Link href="/admissions/fees">View Fee Structures</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Compare Max Warning */}
        {compareMax && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800" data-testid="compare-max-warning">
            <GitCompare className="w-4 h-4 shrink-0" />
            You can compare up to 3 programmes at a time. Remove one to add another.
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-card border rounded-xl p-4 md:p-5 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by programme name or code..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                data-testid="input-search-programmes"
              />
            </div>
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[200px]"
              data-testid="select-school"
            >
              <option value="all">All Schools</option>
              {schools?.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} — {SCHOOL_NAMES[s.code] ?? s.name}
                </option>
              ))}
            </select>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[160px]"
              data-testid="select-level"
            >
              <option value="all">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="doctoral">Doctoral</option>
            </select>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[150px]"
              data-testid="select-mode"
            >
              <option value="all">All Modes</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time / Flexible</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => {
                  setSchoolFilter("all");
                  setLevelFilter("all");
                  setModeFilter("all");
                  setSearchQuery("");
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted border transition"
                data-testid="btn-reset-filters"
              >
                <FilterX className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} programme${filtered.length !== 1 ? "s" : ""} found`}
            {hasFilters && !isLoading && ` (filtered from ${programmes?.length ?? 0})`}
          </p>
          <div className="flex items-center gap-3">
            {compareList.length >= 2 && (
              <Button size="sm" className="bg-primary text-white flex items-center gap-2" asChild data-testid="btn-go-compare">
                <Link href="/programmes/compare">
                  <GitCompare className="w-4 h-4" /> Compare ({compareList.length})
                </Link>
              </Button>
            )}
            <Button variant="ghost" className="text-primary text-sm" asChild>
              <Link href="/admissions">View Admissions Guide <ChevronRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>

        {/* Programme Cards */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-xl">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-xl font-bold mb-2">No programmes found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search.</p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => { setSchoolFilter("all"); setLevelFilter("all"); setModeFilter("all"); setSearchQuery(""); }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((prog, i) => {
              const inCompare = isInCompare(prog.school, prog.code);
              return (
                <div
                  key={i}
                  className={`group flex flex-col md:flex-row gap-5 md:items-center justify-between p-6 bg-card border rounded-xl hover:shadow-md transition-all ${inCompare ? "border-primary ring-1 ring-primary/20" : "hover:border-primary"}`}
                  data-testid={`programme-card-${prog.code.replace(/[^a-z0-9]/gi, "-")}`}
                >
                  {/* Left */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${inCompare ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"}`}>
                      {inCompare ? <CheckCircle2 className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {prog.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${LEVEL_COLORS[prog.level] ?? "bg-muted text-muted-foreground border-border"}`}>
                          {LEVEL_LABELS[prog.level] ?? prog.level}
                        </span>
                        <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded font-medium">
                          {prog.code}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {SCHOOL_NAMES[prog.school] ?? prog.school}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {prog.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right — Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                    <button
                      onClick={() => toggleCompare({ school: prog.school, code: prog.code, name: prog.name })}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        inCompare
                          ? "bg-primary text-white border-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                      data-testid={`btn-compare-${prog.code.replace(/[^a-z0-9]/gi, "-")}`}
                    >
                      {inCompare ? <X className="w-3 h-3" /> : <GitCompare className="w-3 h-3" />}
                      {inCompare ? "Remove" : "Compare"}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white text-xs"
                      asChild
                      data-testid={`btn-details-${prog.code.replace(/[^a-z0-9]/gi, "-")}`}
                    >
                      <Link href={`/programmes/${prog.school}/${encodeURIComponent(prog.code)}`}>
                        View Details <ChevronRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
                      asChild
                      data-testid={`btn-apply-${prog.code.replace(/[^a-z0-9]/gi, "-")}`}
                    >
                      <Link href="/admissions">Apply</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        {!isLoading && filtered.length > 0 && (
          <div className="mt-12 p-8 bg-primary rounded-xl text-center text-primary-foreground">
            <h3 className="font-serif text-2xl font-bold mb-3">Ready to join KAFU?</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto text-sm">
              Once you've found your programme, check your eligibility or visit our Admissions page for step-by-step guides and application links.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild data-testid="footer-cta-eligibility">
                <Link href="/admissions/eligibility">Check Eligibility</Link>
              </Button>
              <Button variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10" asChild data-testid="footer-cta-admissions">
                <Link href="/admissions">Go to Admissions <ChevronRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky comparison bar */}
      {compareList.length >= 1 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground border-t border-white/20 shadow-lg" data-testid="sticky-compare-bar">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GitCompare className="w-5 h-5 text-accent shrink-0" />
              <span className="text-sm font-medium">
                {compareList.length} programme{compareList.length > 1 ? "s" : ""} selected for comparison
              </span>
              <div className="hidden sm:flex gap-2">
                {compareList.map((item) => (
                  <span key={`${item.school}-${item.code}`} className="px-2 py-0.5 bg-white/20 text-white rounded text-xs font-medium">
                    {item.code}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {compareList.length >= 2 && (
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild data-testid="btn-compare-now">
                  <Link href="/programmes/compare">Compare Now</Link>
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => { localStorage.setItem("kafu_compare_progs", "[]"); setCompareList([]); }}
                data-testid="btn-clear-bar"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
