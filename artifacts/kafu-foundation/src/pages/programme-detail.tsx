import { useRoute, Link } from "wouter";
import { useSchool, useProgrammeDetail } from "@/lib/api-hooks";
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
} from "lucide-react";

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
          <Link href="/programmes">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes
          </Link>
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
    description: detail?.description ?? baseProgramme?.description ?? `Study ${baseProgramme?.name ?? code} at Kaimosi Friends University.`,
    provider: ORG_JSONLD,
    courseCode: code,
    educationalLevel: LEVEL_LABELS[level] ?? level,
    url: `https://kafu.ac.ke/programmes/${school.toLowerCase()}/${code}`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Blended",
      duration,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={`${baseProgramme?.name ?? code} — ${SCHOOL_NAMES[school] ?? school} | KAFU`}
        description={detail?.description ?? baseProgramme?.description ?? `Study ${baseProgramme?.name ?? code} at Kaimosi Friends University. ${LEVEL_LABELS[level] ?? ""} programme offered by the ${SCHOOL_NAMES[school] ?? school}.`}
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
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 40%, #D4A017 0%, transparent 55%)" }}
        />
        <div className="container mx-auto px-4 py-14 relative z-10">
          {/* Breadcrumb */}
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
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-bold">
                  {school}
                </span>
                {level && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
                    {LEVEL_LABELS[level] ?? level}
                  </span>
                )}
                {detail?.mode && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" /> {detail.mode}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold max-w-4xl leading-tight mb-3">
                {baseProgramme?.name ?? code}
              </h1>
              <div className="flex items-center gap-4 text-primary-foreground/75 text-sm">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {SCHOOL_NAMES[school] ?? school}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {duration}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> Programme Overview
              </h2>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-base">
                  {detail?.overview ?? "Programme overview information is being updated."}
                </p>
              )}
            </section>

            {/* Entry Requirements */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Entry Requirements
              </h2>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {(detail?.entry_requirements ?? []).map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-4 bg-secondary rounded-lg border"
                      data-testid={`req-${i}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Career Opportunities */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6" /> Career Opportunities
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(detail?.career_opportunities ?? []).map((career, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
                      data-testid={`career-${i}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{career}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Other Programmes in School */}
            {!isLoading && schoolData?.programmes && schoolData.programmes.length > 1 && (
              <section className="border-t pt-10">
                <h2 className="text-xl font-serif font-bold text-primary mb-4">
                  More Programmes in {SCHOOL_NAMES[school] ?? school}
                </h2>
                <div className="space-y-2">
                  {schoolData.programmes
                    .filter((p) => p.code !== code)
                    .slice(0, 5)
                    .map((p, i) => (
                      <Link
                        key={i}
                        href={`/programmes/${school}/${encodeURIComponent(p.code)}`}
                        className="group flex items-center justify-between p-4 bg-card border rounded-lg hover:border-primary hover:shadow-sm transition-all"
                        data-testid={`related-prog-${i}`}
                      >
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <div>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {p.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {LEVEL_LABELS[p.level] ?? p.level} · {p.duration}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                </div>
                <div className="mt-4">
                  <Button variant="ghost" className="text-primary" asChild>
                    <Link href={`/schools/${school}`}>
                      View all {school} programmes <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
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
                <p className="text-sm text-accent-foreground/80 mb-5">
                  View full admission requirements and start your application.
                </p>
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90 font-semibold mb-2"
                  asChild
                  data-testid="sidebar-btn-admissions"
                >
                  <Link href="/admissions">View Admissions Guide</Link>
                </Button>
                <Button
                  className="w-full bg-white text-primary hover:bg-white/90 border font-semibold"
                  asChild
                  data-testid="sidebar-btn-apply-portal"
                >
                  <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                    Apply on Student Portal <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>

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
                </dl>
              </div>

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
