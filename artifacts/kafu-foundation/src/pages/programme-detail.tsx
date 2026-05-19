import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useSchool, useProgrammeDetail, useStaff } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { SeoHead, ORG_JSONLD } from "@/components/seo-head";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Monitor,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Target,
  Award,
  TrendingUp,
  Banknote,
  GitCompare,
  Users,
  ListChecks,
  CalendarDays,
  CheckCheck,
} from "lucide-react";
import { addToCompare, isInCompare } from "@/lib/compare-store";

const SCHOOL_NAMES: Record<string, string> = {
  SESS: "School of Education and Social Sciences",
  SBE: "School of Business and Economics",
  SCIT: "School of Computing and Information Technology",
  SOS: "School of Science",
  SHS: "School of Health Sciences",
};

const LEVEL_LABELS: Record<string, string> = {
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  doctoral: "Doctoral",
};

export default function ProgrammeDetailPage() {
  const [, params] = useRoute("/programmes/:school/:code");
  const school = (params?.school ?? "").toUpperCase();
  const code = decodeURIComponent(params?.code ?? "");

  const { data: schoolData, isLoading: schoolLoading } = useSchool(school);
  const { data: detail, isLoading: detailLoading } = useProgrammeDetail(school, code);
  const { data: staff } = useStaff({ school });

  const [compareAdded, setCompareAdded] = useState(false);
  const [compareMax, setCompareMax] = useState(false);

  const baseProgramme = schoolData?.programmes?.find((p) => p.code === code);
  const isLoading = schoolLoading || detailLoading;

  if (!isLoading && !schoolData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-start gap-3 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Programme not found. It may have been updated or removed.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/programmes"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes</Link>
        </Button>
      </div>
    );
  }

  const duration = baseProgramme?.duration ?? "Refer to school";
  const level = baseProgramme?.level ?? "";

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: baseProgramme?.name ?? code,
    description: detail?.overview ?? baseProgramme?.description ?? `Study ${baseProgramme?.name ?? code} at Kaimosi Friends University.`,
    provider: ORG_JSONLD,
    courseCode: code,
    educationalLevel: LEVEL_LABELS[level] ?? level,
    url: `https://kafu.ac.ke/programmes/${school.toLowerCase()}/${code}`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: detail?.mode ?? "Blended",
      duration,
    },
  };

  function handleCompare() {
    if (isInCompare(school, code)) {
      setCompareAdded(true);
      return;
    }
    const ok = addToCompare({ school, code, name: baseProgramme?.name ?? code });
    if (!ok) {
      setCompareMax(true);
      setTimeout(() => setCompareMax(false), 3000);
    } else {
      setCompareAdded(true);
      setTimeout(() => setCompareAdded(false), 3000);
    }
  }

  const feeStructure = detail?.fee_structure;
  const accreditation = detail?.accreditation;
  const employability = detail?.employability_data;
  const learningOutcomes = detail?.learning_outcomes ?? [];
  const courseStructure = detail?.course_structure ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={`${baseProgramme?.name ?? code} — ${SCHOOL_NAMES[school] ?? school} | KAFU`}
        description={detail?.overview ?? baseProgramme?.description ?? `Study ${baseProgramme?.name ?? code} at Kaimosi Friends University.`}
        path={`/programmes/${school.toLowerCase()}/${code}`}
        breadcrumbs={[
          { name: "Programmes", path: "/programmes" },
          { name: SCHOOL_NAMES[school] ?? school, path: `/schools/${school.toLowerCase()}` },
          { name: baseProgramme?.name ?? code },
        ]}
        jsonLd={courseJsonLd}
      />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(ellipse at 80% 40%, #D4A017 0%, transparent 55%)" }} />
        <div className="container mx-auto px-4 py-14 relative z-10">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-primary-foreground/70 mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link href="/programmes" className="hover:underline">Programmes</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link href={`/schools/${school}`} className="hover:underline">{school}</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-white/90">{code}</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
              <div className="h-12 w-2/3 bg-white/20 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-bold">{school}</span>
                {level && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">{LEVEL_LABELS[level] ?? level}</span>
                )}
                {detail?.mode && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" /> {detail.mode}
                  </span>
                )}
                {accreditation && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-sm font-medium flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> {accreditation.status}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold max-w-4xl leading-tight mb-3">
                {baseProgramme?.name ?? code}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-primary-foreground/75 text-sm">
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {SCHOOL_NAMES[school] ?? school}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {duration}</span>
                {employability && (
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {employability.employment_rate}% employment rate</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compare added toast */}
      {(compareAdded || compareMax) && (
        <div className={`text-center text-sm py-2 font-medium ${compareMax ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`} data-testid="compare-toast">
          {compareMax ? "Maximum 3 programmes can be compared. Remove one first." : "Added to comparison. Go to the Programmes page to compare."}
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Overview */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> Programme Overview
              </h2>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-4 bg-muted rounded w-full animate-pulse" />)}
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-base">
                  {detail?.overview ?? "Programme overview information is being updated."}
                </p>
              )}
            </section>

            {/* Learning Outcomes */}
            {(isLoading || learningOutcomes.length > 0) && (
              <section data-testid="section-learning-outcomes">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" /> Learning Outcomes
                </h2>
                <p className="text-muted-foreground text-sm mb-5">Upon successful completion of this programme, graduates will be able to:</p>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
                  </div>
                ) : (
                  <ol className="space-y-3">
                    {learningOutcomes.map((outcome, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-4 bg-secondary/50 border rounded-xl"
                        data-testid={`outcome-${i}`}
                      >
                        <span className="w-7 h-7 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-foreground leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            )}

            {/* Accreditation */}
            {!isLoading && accreditation && (
              <section data-testid="section-accreditation">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6" /> Accreditation
                </h2>
                <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-emerald-800 text-base">{accreditation.status}</span>
                      <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">Since {accreditation.year}</span>
                    </div>
                    <p className="text-sm text-emerald-700 leading-relaxed">{accreditation.body}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Entry Requirements */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Entry Requirements
              </h2>
              {isLoading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}</div>
              ) : (
                <ul className="space-y-3">
                  {(detail?.entry_requirements ?? []).map((req, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-secondary rounded-lg border" data-testid={`req-${i}`}>
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-foreground leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4">
                <Button variant="outline" className="text-sm border-primary text-primary" asChild data-testid="btn-eligibility-checker">
                  <Link href="/admissions/eligibility">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Check Your Eligibility
                  </Link>
                </Button>
              </div>
            </section>

            {/* Course Structure */}
            {(isLoading || courseStructure.length > 0) && (
              <section data-testid="section-course-structure">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                  <ListChecks className="w-6 h-6" /> Course Structure
                </h2>
                <p className="text-muted-foreground text-sm mb-5">Overview of units covered across the programme years. Exact unit offerings may vary by intake.</p>
                {isLoading ? (
                  <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}</div>
                ) : (
                  <div className="space-y-4">
                    {courseStructure.map((yr, i) => (
                      <div key={i} className="border rounded-xl overflow-hidden" data-testid={`course-year-${i}`}>
                        <div className="bg-primary/5 border-b px-5 py-3 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-sm text-foreground">{yr.year}</span>
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {yr.units.map((unit, j) => (
                              <span key={j} className="px-3 py-1.5 bg-secondary border rounded-lg text-xs text-foreground font-medium">
                                {unit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Employability */}
            {!isLoading && employability && (
              <section data-testid="section-employability">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" /> Employability & Career Intelligence
                </h2>

                {/* Employment Rate */}
                <div className="mb-6 p-5 bg-primary/5 border rounded-xl flex items-center gap-5">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke="#228B22" strokeWidth="3"
                        strokeDasharray={`${employability.employment_rate} ${100 - employability.employment_rate}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-base font-bold text-primary">{employability.employment_rate}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xl text-foreground">{employability.employment_rate}% Employment Rate</div>
                    <p className="text-sm text-muted-foreground mt-1">Percentage of graduates employed or in further study within 12 months of graduation.</p>
                  </div>
                </div>

                {/* Job Roles */}
                <h3 className="font-semibold text-base text-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Career Pathways
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {employability.job_roles.map((role, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all" data-testid={`job-role-${i}`}>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{role}</span>
                    </div>
                  ))}
                </div>

                {/* Industry Sectors */}
                <h3 className="font-semibold text-base text-foreground mb-3">Industry Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {employability.industry_sectors.map((sector, i) => (
                    <span key={i} className="px-3 py-1.5 bg-secondary border rounded-full text-sm text-muted-foreground font-medium" data-testid={`sector-${i}`}>
                      {sector}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Career Opportunities (legacy fallback) */}
            {!isLoading && !employability && (detail?.career_opportunities ?? []).length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" /> Career Opportunities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(detail?.career_opportunities ?? []).map((career, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all" data-testid={`career-${i}`}>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{career}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Faculty */}
            {!isLoading && staff && staff.length > 0 && (
              <section data-testid="section-faculty">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" /> Faculty
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {staff.slice(0, 4).map((member, i) => (
                    <Link
                      key={i}
                      href={`/staff/${member.slug}`}
                      className="group flex items-center gap-4 p-4 bg-card border rounded-xl hover:border-primary hover:shadow-sm transition-all"
                      data-testid={`faculty-${i}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-lg">
                        {member.name?.charAt(0) ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{member.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{member.designation ?? member.rank}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {staff.length > 4 && (
                  <div className="mt-3">
                    <Button variant="ghost" className="text-primary text-sm" asChild>
                      <Link href={`/staff?school=${school}`}>View all {school} faculty <ChevronRight className="ml-1 w-4 h-4" /></Link>
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Other Programmes in School */}
            {!isLoading && schoolData?.programmes && schoolData.programmes.length > 1 && (
              <section className="border-t pt-10">
                <h2 className="text-xl font-serif font-bold text-primary mb-4">
                  More Programmes in {SCHOOL_NAMES[school] ?? school}
                </h2>
                <div className="space-y-2">
                  {schoolData.programmes.filter((p) => p.code !== code).slice(0, 5).map((p, i) => (
                    <Link
                      key={i}
                      href={`/programmes/${school}/${encodeURIComponent(p.code)}`}
                      className="group flex items-center justify-between p-4 bg-card border rounded-lg hover:border-primary hover:shadow-sm transition-all"
                      data-testid={`related-prog-${i}`}
                    >
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <div>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{p.name}</span>
                          <span className="block text-xs text-muted-foreground">{LEVEL_LABELS[p.level] ?? p.level} · {p.duration}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="ghost" className="text-primary" asChild>
                    <Link href={`/schools/${school}`}>View all {school} programmes <ChevronRight className="ml-1 w-4 h-4" /></Link>
                  </Button>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Apply CTA */}
              <div className="bg-accent rounded-xl p-6 text-center">
                <GraduationCap className="w-10 h-10 mx-auto mb-3 text-accent-foreground opacity-80" />
                <h3 className="font-serif font-bold text-lg text-accent-foreground mb-2">Apply for this Programme</h3>
                <p className="text-sm text-accent-foreground/80 mb-5">View full admission requirements and start your application.</p>
                <Button className="w-full bg-primary text-white hover:bg-primary/90 font-semibold mb-2" asChild data-testid="sidebar-btn-admissions">
                  <Link href="/admissions">View Admissions Guide</Link>
                </Button>
                <Button className="w-full bg-white text-primary hover:bg-white/90 border font-semibold" asChild data-testid="sidebar-btn-apply-portal">
                  <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                    Apply on Student Portal <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>

              {/* Compare Button */}
              <button
                onClick={handleCompare}
                className={`w-full flex items-center justify-center gap-2 p-4 border rounded-xl text-sm font-semibold transition-all ${
                  isInCompare(school, code)
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border hover:border-primary hover:text-primary"
                }`}
                data-testid="btn-add-to-compare"
              >
                <GitCompare className="w-4 h-4" />
                {isInCompare(school, code) ? "In Comparison List" : "Add to Compare"}
              </button>

              {/* Programme Summary */}
              <div className="bg-card border rounded-xl p-5">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">Programme Summary</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Code</dt>
                    <dd className="font-medium font-mono">{code}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Level</dt>
                    <dd className="font-medium">{LEVEL_LABELS[level] ?? level}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-medium">{duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Mode</dt>
                    <dd className="font-medium">{detail?.mode ?? "Full-time"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">School</dt>
                    <dd className="font-medium">{school}</dd>
                  </div>
                  {accreditation && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd className="font-medium text-emerald-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Accredited
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Fee Summary */}
              {feeStructure && (
                <div className="bg-card border rounded-xl p-5" data-testid="sidebar-fee-structure">
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-accent" /> Annual Fees (Self-Sponsored)
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tuition</dt>
                      <dd className="font-mono font-medium">KES {feeStructure.tuition_kes_per_year.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Accommodation</dt>
                      <dd className="font-mono font-medium">KES {feeStructure.accommodation_kes_per_year.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Other Costs</dt>
                      <dd className="font-mono font-medium">KES {feeStructure.other_costs_kes.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <dt className="text-foreground">Total/year</dt>
                      <dd className="font-mono text-primary">KES {feeStructure.total_annual_kes.toLocaleString()}</dd>
                    </div>
                  </dl>
                  <p className="text-xs text-muted-foreground mt-2 leading-snug">{feeStructure.notes}</p>
                  <Button variant="outline" className="w-full mt-3 text-xs border-primary text-primary" asChild data-testid="btn-full-fee-guide">
                    <Link href="/admissions/fees">Full Fee Guide</Link>
                  </Button>
                </div>
              )}

              {/* Links */}
              <div className="bg-secondary border rounded-xl p-5 space-y-2">
                <Button variant="outline" className="w-full text-sm justify-start" asChild>
                  <Link href={`/schools/${school}`}>
                    <BookOpen className="w-4 h-4 mr-2" /> About {school}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full text-sm justify-start" asChild>
                  <Link href="/programmes">
                    <GraduationCap className="w-4 h-4 mr-2" /> All Programmes
                  </Link>
                </Button>
                <Button variant="outline" className="w-full text-sm justify-start" asChild>
                  <Link href="/admissions/eligibility">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Eligibility Checker
                  </Link>
                </Button>
                <Button variant="outline" className="w-full text-sm justify-start" asChild>
                  <Link href="/contact">Contact Admissions</Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
