import React, { useState } from "react";
import { Link } from "wouter";
import {
  useAlumni, useAlumniFeatured, useAlumniStories,
  useEmployerPartners, useGraduateOutcomes, useSchools,
} from "@/lib/api-hooks";
import {
  ChevronRight, Search, GraduationCap, Briefcase, Building2,
  TrendingUp, Award, ArrowRight, Quote, PlayCircle,
} from "lucide-react";
import { SeoHead } from "@/components/seo-head";

const SECTOR_LABELS: Record<string, string> = {
  employed: "Employed",
  self_employed: "Self-Employed",
  entrepreneur: "Entrepreneur",
  public_sector: "Public Sector",
  ngo_sector: "NGO / Civil Society",
  academic_sector: "Academia",
  further_study: "Further Study",
  leadership: "Leadership",
};

function num(v: number | string | undefined | null): number {
  if (v === undefined || v === null) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}

export default function Alumni() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: featured } = useAlumniFeatured();
  const { data: schools } = useSchools();
  const { data: stories } = useAlumniStories();
  const { data: employers } = useEmployerPartners();
  const { data: outcomes } = useGraduateOutcomes();
  const { data: result, isLoading } = useAlumni({
    school_code: schoolFilter || undefined,
    sector: sectorFilter || undefined,
    search: debouncedSearch || undefined,
    page,
    per_page: 12,
  });

  const alumni = result?.data ?? [];
  const meta = result;

  const avgEmployment = outcomes && outcomes.length
    ? Math.round(outcomes.reduce((s, o) => s + num(o.employment_rate), 0) / outcomes.length)
    : null;
  const totalHires = (employers ?? []).reduce((s, e) => s + (e.graduate_hires ?? 0), 0);

  const spotlight = (featured ?? [])[0];

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Alumni & Graduate Outcomes — Kaimosi Friends University"
        description="Discover where KAFU graduates are today — alumni success stories, graduate employment outcomes, and the employers who hire our talent."
        path="/alumni"
        breadcrumbs={[{ name: "Alumni", path: "/alumni" }]}
      />

      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <img src="/images/uploads/visual-acuity.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2)" }} />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Alumni</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-primary-foreground">Alumni &amp; Graduate Outcomes</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            From Kaimosi to the world — explore where our graduates are today, the impact they make, and the outcomes that define a KAFU education.
          </p>
        </div>
      </div>

      {/* Outcome stats */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "Avg. Employment Rate", value: avgEmployment !== null ? `${avgEmployment}%` : "—" },
            { icon: Building2, label: "Employer Partners", value: (employers ?? []).length || "—" },
            { icon: Briefcase, label: "Graduate Hires Tracked", value: totalHires || "—" },
            { icon: Award, label: "Featured Alumni", value: (featured ?? []).length || "—" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5 text-center" data-testid={`stat-${i}`}>
              <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spotlight */}
      {spotlight && (
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-12">
            <Link href={`/alumni/${spotlight.slug}`}>
              <div className="grid md:grid-cols-[280px_1fr] gap-8 items-center bg-white rounded-2xl border border-border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow" data-testid="alumni-spotlight">
                <div className="aspect-square md:h-full bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                  {spotlight.photo_url ? (
                    <img src={spotlight.photo_url} alt={spotlight.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                </div>
                <div className="p-6 md:pr-10">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-secondary-foreground bg-secondary/15 text-primary px-2 py-1 rounded">
                    Alumni Spotlight
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mt-3 mb-1">{spotlight.name}</h2>
                  <p className="text-primary font-medium">{spotlight.current_role}{spotlight.current_organization ? `, ${spotlight.current_organization}` : ""}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {spotlight.programme}{spotlight.graduation_year ? ` · Class of ${spotlight.graduation_year}` : ""}
                  </p>
                  {spotlight.achievements && (
                    <p className="text-muted-foreground mt-4 line-clamp-3">{spotlight.achievements}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-primary font-medium text-sm mt-4">
                    Read profile <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-background border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search alumni..." data-testid="input-alumni-search"
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={schoolFilter} onChange={(e) => { setSchoolFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-school-filter">
            <option value="">All Schools</option>
            {(schools ?? []).map((s) => (
              <option key={s.code} value={s.code}>{s.code}</option>
            ))}
          </select>
          <select value={sectorFilter} onChange={(e) => { setSectorFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-sector-filter">
            <option value="">All Sectors</option>
            {Object.entries(SECTOR_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Directory */}
      <div className="container mx-auto px-4 py-10 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted rounded-xl h-56 animate-pulse" />
            ))}
          </div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <GraduationCap className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No alumni found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {meta?.total ?? 0} alum{(meta?.total ?? 0) !== 1 ? "ni" : "nus"} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((a) => (
                <Link key={a.id} href={`/alumni/${a.slug}`}>
                  <div className="group bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" data-testid={`alumni-card-${a.slug}`}>
                    <div className="flex gap-4 p-5">
                      <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        {a.photo_url ? (
                          <img src={a.photo_url} alt={a.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-primary/50">{a.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">{a.name}</h3>
                        <p className="text-sm text-primary/80 truncate">{a.current_role}</p>
                        {a.current_organization && <p className="text-xs text-muted-foreground truncate">{a.current_organization}</p>}
                      </div>
                    </div>
                    <div className="px-5 pb-5 mt-auto">
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {a.sector && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{SECTOR_LABELS[a.sector] ?? a.sector}</span>
                        )}
                        {a.school_code && <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{a.school_code}</span>}
                        {a.graduation_year && <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">'{String(a.graduation_year).slice(-2)}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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

      {/* Graduate outcomes by programme */}
      {(outcomes ?? []).length > 0 && (
        <div className="bg-muted/30 border-y">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-serif font-bold mb-2">Graduate Outcomes by Programme</h2>
            <p className="text-muted-foreground mb-6">Employment, further study, and entrepreneurship rates from recent graduate tracer surveys.</p>
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Programme</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Cohort</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Employed</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Further Study</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(outcomes ?? []).map((o) => (
                    <tr key={o.id} data-testid={`outcome-row-${o.id}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{o.programme}{o.school_code ? <span className="text-xs text-muted-foreground ml-2">{o.school_code}</span> : null}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{o.cohort_year ?? "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden hidden sm:block">
                            <div className="h-full bg-primary" style={{ width: `${num(o.employment_rate)}%` }} />
                          </div>
                          <span className="font-semibold text-foreground">{num(o.employment_rate)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{num(o.further_study_rate)}%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{num(o.entrepreneurship_rate)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stories */}
      {(stories ?? []).length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(stories ?? []).map((s) => (
              <Link key={s.id} href={`/alumni-stories/${s.slug}`}>
                <div className="group bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col" data-testid={`story-card-${s.slug}`}>
                  {s.photo_url ? (
                    <div className="aspect-video overflow-hidden relative">
                      <img src={s.photo_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {s.video_url && <PlayCircle className="absolute inset-0 m-auto w-12 h-12 text-white drop-shadow-lg" />}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Quote className="w-10 h-10 text-primary/30" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{s.summary}</p>
                    {(s.alumni_name || s.graduation_year) && (
                      <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-3">
                        {s.alumni_name}{s.graduation_year ? ` · Class of ${s.graduation_year}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Employer partners */}
      {(employers ?? []).length > 0 && (
        <div className="bg-muted/30 border-t">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-serif font-bold mb-2">Where Our Graduates Work</h2>
            <p className="text-muted-foreground mb-6">Employer partners who recruit, mentor, and offer internships to KAFU students and graduates.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(employers ?? []).map((e) => (
                <div key={e.id} className="bg-white rounded-xl border border-border p-5 flex flex-col" data-testid={`employer-card-${e.slug}`}>
                  <div className="h-12 flex items-center mb-3">
                    {e.logo_url ? (
                      <img src={e.logo_url} alt={e.name} className="max-h-12 max-w-full object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary/40" />
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground">{e.name}</p>
                  {e.industry && <p className="text-xs text-muted-foreground">{e.industry}</p>}
                  {(e.graduate_hires ?? 0) > 0 && (
                    <p className="text-xs text-primary mt-2 font-medium">{e.graduate_hires} graduate{e.graduate_hires !== 1 ? "s" : ""} hired</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
