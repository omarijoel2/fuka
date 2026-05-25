import React, { useEffect, useRef, useState } from "react";
import { useRoute, Link } from "wouter";
import { useStaffProfile } from "@/lib/api-hooks";
import { SITE_URL, SeoHead, ORG_JSONLD } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import {
  Mail,
  BookOpen,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Award,
  Users,
  FlaskConical,
  FileText,
  Presentation,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Download,
  Globe,
  Microscope,
  Banknote,
  ArrowUpRight,
  Library,
  BookMarked,
  UserCheck,
  TrendingUp,
  Quote,
} from "lucide-react";

const SCHOOL_NAMES: Record<string, string> = {
  SESS: "School of Education and Social Sciences",
  SBE: "School of Business and Economics",
  SCIT: "School of Computing and Information Technology",
  SOS: "School of Science",
  SHS: "School of Health Sciences",
};

const SCHOOL_COLORS: Record<string, string> = {
  SESS: "bg-purple-100 text-purple-800 border-purple-200",
  SBE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  SCIT: "bg-teal-100 text-teal-800 border-teal-200",
  SOS: "bg-green-100 text-green-800 border-green-200",
  SHS: "bg-red-100 text-red-800 border-red-200",
};

const GRADIENTS = [
  "from-[#228b22] to-[#0d3320]",
  "from-primary to-primary/80",
  "from-purple-700 to-purple-900",
  "from-teal-700 to-teal-900",
  "from-green-700 to-green-900",
  "from-red-700 to-red-900",
  "from-indigo-700 to-indigo-900",
];

const REPO_TYPE_LABELS: Record<string, string> = {
  thesis: "Thesis",
  dissertation: "Dissertation",
  journal_article: "Journal Article",
  conference_paper: "Conference Paper",
  book_chapter: "Book Chapter",
  research_report: "Research Report",
  working_paper: "Working Paper",
  dataset: "Dataset",
};

const NAV_TABS = [
  { id: "overview", label: "Overview" },
  { id: "teaching", label: "Teaching" },
  { id: "research", label: "Research" },
  { id: "supervision", label: "Supervision" },
  { id: "service", label: "Service" },
];

function getInitials(name: string) {
  const parts = name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.|Rev\.)\s*/i, "").split(" ");
  return parts.filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function getGradient(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffff;
  return GRADIENTS[hash % GRADIENTS.length];
}

function Section({ id, icon, title, children }: { id?: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-32">
      <h2 className="text-xl font-serif font-bold text-primary mb-5 flex items-center gap-2.5 pb-3 border-b">
        <span className="text-primary/70">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function CompletenessBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="bg-card border rounded-xl p-4" data-testid="profile-completeness-bar">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile Completeness</span>
        <span className="text-sm font-bold text-foreground">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function StaffProfilePage() {
  const [, params] = useRoute("/staff/:slug");
  const slug = params?.slug ?? "";
  const { data: profile, isLoading, isError } = useStaffProfile(slug);
  const [activeTab, setActiveTab] = useState("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = NAV_TABS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => observerRef.current!.observe(s));
    return () => observerRef.current?.disconnect();
  }, [isLoading]);

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex items-start gap-3 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Profile not found</p>
            <p className="text-sm mt-1 opacity-80">This staff profile may have been updated or is no longer available.</p>
          </div>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/staff">
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" /> Back to Staff Directory
          </Link>
        </Button>
      </div>
    );
  }

  // Loading skeleton — shown while profile data is in-flight.
  // Returning here also narrows `profile` to StaffProfile for everything below,
  // removing the need for optional-chaining or non-null assertions.
  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen" data-testid="profile-loading">
        {/* Skeleton hero */}
        <div className="bg-primary text-primary-foreground py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1.5 mb-7">
              <div className="h-3 w-8 bg-white/20 rounded animate-pulse" />
              <div className="h-3 w-3 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
              <div className="h-3 w-3 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-32 bg-white/15 rounded animate-pulse" />
            </div>
            <div className="flex flex-col sm:flex-row gap-7">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/20 animate-pulse shrink-0" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-white/20 rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-white/15 rounded-full animate-pulse" />
                </div>
                <div className="h-9 w-80 max-w-full bg-white/20 rounded animate-pulse" />
                <div className="h-5 w-56 bg-white/15 rounded animate-pulse" />
                <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-28 bg-white/15 rounded-lg animate-pulse" />
                  <div className="h-8 w-24 bg-white/10 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Skeleton tab nav */}
        <div className="border-b bg-background">
          <div className="container mx-auto px-4 flex gap-6 py-1">
            {NAV_TABS.map((t) => (
              <div key={t.id} className="h-10 w-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
        {/* Skeleton body */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-5 bg-muted rounded animate-pulse" style={{ width: `${85 - (i % 3) * 15}%` }} />
              ))}
              <div className="h-px bg-border my-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-20 bg-muted rounded-xl animate-pulse" />
              <div className="h-32 bg-muted rounded-xl animate-pulse" />
              <div className="h-40 bg-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // From here profile is guaranteed to be defined (StaffProfile).
  const gradient = getGradient(slug);
  const schoolColor = profile?.school ? SCHOOL_COLORS[profile.school] : null;
  const supervision = profile?.supervision ?? { masters_count: 0, phd_count: 0 };
  const totalSupervised = (supervision.masters_count ?? 0) + (supervision.phd_count ?? 0);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/staff/${slug}`,
    name: profile.name,
    jobTitle: profile.title,
    description: profile.biography ?? undefined,
    email: profile.email ?? undefined,
    affiliation: { "@id": `${SITE_URL}/#organization` },
    worksFor: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/staff/${slug}`,
    sameAs: [
      ...(profile.orcid_id ? [`https://orcid.org/${profile.orcid_id}`] : []),
      ...(profile.google_scholar_url ? [profile.google_scholar_url] : []),
      ...(profile.scopus_id ? [`https://www.scopus.com/authid/detail.uri?authorId=${profile.scopus_id}`] : []),
      ...(profile.linkedin_url ? [profile.linkedin_url] : []),
    ],
    ...(profile.research_interests?.length
      ? { knowsAbout: profile.research_interests }
      : {}),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={`${profile.name} — ${profile.title} | KAFU`}
        description={profile.biography ? profile.biography.slice(0, 160) : `${profile.name} is ${profile.title} at the ${SCHOOL_NAMES[profile.school ?? ""] ?? profile.school}, Kaimosi Friends University.`}
        path={`/staff/${slug}`}
        type="profile"
        breadcrumbs={[
          { name: "Staff Directory", path: "/staff" },
          { name: profile.name },
        ]}
        jsonLd={personJsonLd}
      />
      {/* Hero */}
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 75% 40%, #DAA520 0%, transparent 50%)" }}
        />
        <div className="container mx-auto px-4 py-10 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-primary-foreground/70 mb-7">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link href="/staff" className="hover:underline">Staff Directory</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-white/90">{isLoading ? "Loading..." : profile?.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start gap-7">
            {/* Avatar */}
            <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg ring-4 ring-white/10 relative overflow-hidden`}>
              {isLoading ? (
                <div className="w-full h-full animate-pulse rounded-2xl bg-white/20" />
              ) : (
                <>
                  <span className="text-white text-4xl font-serif font-bold select-none">
                    {getInitials(profile?.name ?? "")}
                  </span>
                  {profile?.photo && (
                    <img
                      src={profile.photo}
                      alt={profile.name ?? ""}
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-8 bg-white/20 rounded w-72 animate-pulse" />
                  <div className="h-5 bg-white/15 rounded w-56 animate-pulse" />
                  <div className="h-4 bg-white/10 rounded w-40 animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile?.school && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${schoolColor ?? ""}`}>
                        {profile.school}
                      </span>
                    )}
                    {profile?.rank && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                        {profile.rank}
                      </span>
                    )}
                    {profile?.unit && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                        {profile.unit}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-2">
                    {profile?.name}
                  </h1>
                  <p className="text-accent font-semibold text-base mb-1.5">{profile?.designation}</p>
                  <p className="text-primary-foreground/75 text-sm mb-4">
                    {profile?.department}
                    {profile?.school && ` · ${SCHOOL_NAMES[profile.school] ?? profile.school}`}
                  </p>

                  {/* Academic identity badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile?.orcid_id && (
                      <a
                        href={`https://orcid.org/${profile.orcid_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A6CE39] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                        data-testid="badge-orcid"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.869-1.559 3.869-3.722 0-2.016-1.369-3.722-3.916-3.722h-2.25z"/></svg>
                        ORCID {profile.orcid_id}
                      </a>
                    )}
                    {profile?.google_scholar_url && (
                      <a
                        href={profile.google_scholar_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white text-xs font-semibold rounded-lg hover:bg-white/25 transition-colors border border-white/20"
                        data-testid="badge-scholar"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> Google Scholar
                      </a>
                    )}
                    {profile?.scopus_id && (
                      <a
                        href={`https://www.scopus.com/authid/detail.uri?authorId=${profile.scopus_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white text-xs font-semibold rounded-lg hover:bg-white/25 transition-colors border border-white/20"
                        data-testid="badge-scopus"
                      >
                        <Globe className="w-3.5 h-3.5" /> Scopus
                      </a>
                    )}
                    {profile?.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0077B5]/80 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        data-testid="badge-linkedin"
                      >
                        <Globe className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    )}
                  </div>

                  {/* Contact + CV row */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {profile?.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-white transition-colors"
                        data-testid="profile-email-link"
                      >
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </a>
                    )}
                    {profile?.cv_url && (
                      <a
                        href={profile.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors"
                        data-testid="btn-download-cv"
                      >
                        <Download className="w-3.5 h-3.5" /> Download CV
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="border-b bg-background sticky top-[70px] z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-none" role="tablist" data-testid="profile-tab-nav">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main column */}
          <div className="lg:col-span-2">

            {/* OVERVIEW */}
            <Section id="overview" icon={<BookOpen className="w-5 h-5" />} title="Biography">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-4 bg-muted rounded animate-pulse ${i === 4 ? "w-2/3" : "w-full"}`} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  {profile?.biography ?? profile?.bio ?? "Biography not available."}
                </p>
              )}
            </Section>

            {/* Qualifications */}
            {(isLoading || (profile?.qualifications && profile.qualifications.length > 0)) && (
              <Section icon={<GraduationCap className="w-5 h-5" />} title="Academic Qualifications">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profile!.qualifications.map((q, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 bg-card border rounded-lg"
                        data-testid={`qualification-${i}`}
                      >
                        <div className="w-14 text-sm font-bold text-accent shrink-0 pt-0.5">{q.year}</div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground">{q.qualification}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{q.institution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* Specializations */}
            {(isLoading || (profile?.specializations && profile.specializations.length > 0)) && (
              <Section icon={<FlaskConical className="w-5 h-5" />} title="Fields of Specialization">
                {isLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 w-32 bg-muted rounded-full animate-pulse" />)}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile!.specializations.map((s, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-full text-sm font-medium"
                        data-testid={`spec-${i}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* Professional Experience */}
            {(isLoading || (profile?.experience && profile.experience.length > 0)) && (
              <Section icon={<Briefcase className="w-5 h-5" />} title="Professional Experience">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />
                    <div className="space-y-4">
                      {profile!.experience.map((e, i) => (
                        <div key={i} className="flex gap-5 pl-12 relative" data-testid={`exp-${i}`}>
                          <div className="absolute left-3.5 top-2.5 w-3 h-3 rounded-full bg-primary ring-2 ring-background" />
                          <div className="flex-1 p-4 bg-card border rounded-lg">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                              <p className="font-semibold text-sm text-foreground">{e.position}</p>
                              <span className="text-xs text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded">
                                {e.start} – {e.end}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{e.institution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* TEACHING */}
            <Section id="teaching" icon={<Presentation className="w-5 h-5" />} title="Teaching">
              {/* Teaching Areas */}
              {!isLoading && profile?.teaching_areas && profile.teaching_areas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Teaching Areas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.teaching_areas.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-secondary border rounded-lg text-sm" data-testid={`teach-${i}`}>
                        <BookOpen className="w-4 h-4 text-primary shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses Taught */}
              {!isLoading && profile?.courses_taught && profile.courses_taught.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Courses Currently Taught</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="courses-table">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Code</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Course</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Programme</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.courses_taught.map((c, i) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-muted/50" data-testid={`course-${i}`}>
                            <td className="py-2.5 px-3">
                              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded font-semibold">{c.code}</span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-foreground">{c.name}</td>
                            <td className="py-2.5 px-3 text-muted-foreground text-xs">{c.programme ?? "—"}</td>
                            <td className="py-2.5 px-3">
                              {c.level && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  c.level === "postgraduate"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  {c.level === "postgraduate" ? "PG" : "UG"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!isLoading && (!profile?.teaching_areas?.length) && (!profile?.courses_taught?.length) && (
                <p className="text-muted-foreground text-sm">Teaching information not yet available.</p>
              )}
            </Section>

            {/* RESEARCH */}
            <Section id="research" icon={<Microscope className="w-5 h-5" />} title="Research">
              {/* Research Interests */}
              {!isLoading && profile?.research_interests && profile.research_interests.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Research Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.research_interests.map((r, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-full text-sm"
                        data-testid={`research-${i}`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Publications (manual) */}
              {!isLoading && profile?.publications && profile.publications.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Selected Publications</h3>
                  <div className="space-y-3">
                    {profile.publications.map((pub, i) => (
                      <div key={i} className="p-4 bg-card border rounded-lg" data-testid={`pub-${i}`}>
                        <div className="flex gap-3">
                          <Quote className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-foreground leading-relaxed">{pub.citation}</p>
                            {pub.url && (
                              <a
                                href={pub.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> View Publication
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Repository Publications (auto-linked) */}
              {!isLoading && profile?.repo_publications && profile.repo_publications.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Repository Publications
                      <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-normal normal-case">
                        {profile.repo_publications.length} found
                      </span>
                    </h3>
                    <Link href="/repository" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Library className="w-3 h-3" /> Browse Repository
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {profile.repo_publications.map((pub, i) => (
                      <Link
                        key={i}
                        href={`/repository/item/${pub.slug}`}
                        className="block p-4 bg-card border rounded-lg hover:border-primary hover:shadow-sm transition-all group"
                        data-testid={`repo-pub-${i}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium">
                                {REPO_TYPE_LABELS[pub.type] ?? pub.type}
                              </span>
                              <span className="text-xs text-muted-foreground">{pub.year}</span>
                              {pub.access === "open" && (
                                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">Open Access</span>
                              )}
                            </div>
                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {pub.title}
                            </p>
                            {pub.journal_name && (
                              <p className="text-xs text-muted-foreground mt-0.5 italic">{pub.journal_name}</p>
                            )}
                          </div>
                          <div className="shrink-0 text-right">
                            {pub.citation_count > 0 && (
                              <div className="text-center">
                                <p className="text-lg font-bold text-primary">{pub.citation_count}</p>
                                <p className="text-[10px] text-muted-foreground">citations</p>
                              </div>
                            )}
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-1 ml-auto transition-colors" />
                          </div>
                        </div>
                        {pub.doi && (
                          <p className="text-xs text-muted-foreground mt-2 font-mono truncate">DOI: {pub.doi}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Grants & Funding */}
              {!isLoading && profile?.grants && profile.grants.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Grants &amp; Funding</h3>
                  <div className="space-y-3">
                    {profile.grants.map((g, i) => (
                      <div key={i} className="p-4 bg-card border rounded-lg" data-testid={`grant-${i}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="font-semibold text-sm text-foreground flex-1">{g.title}</p>
                          {g.status && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                              g.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {g.status === "active" ? "Active" : "Completed"}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5" /> {g.funder}
                          </span>
                          {g.amount && <span className="font-semibold text-foreground">{g.amount}</span>}
                          {g.role && <span>{g.role}</span>}
                          {g.start && <span>{g.start}{g.end ? ` – ${g.end}` : ""}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading &&
                !profile?.research_interests?.length &&
                !profile?.publications?.length &&
                !profile?.repo_publications?.length &&
                !profile?.grants?.length && (
                  <p className="text-muted-foreground text-sm">Research information not yet available.</p>
              )}
            </Section>

            {/* SUPERVISION */}
            <Section id="supervision" icon={<UserCheck className="w-5 h-5" />} title="Supervision">
              {!isLoading && (
                <>
                  {/* Stats */}
                  {totalSupervised > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-center" data-testid="supervision-masters">
                        <p className="text-3xl font-bold text-primary">{supervision.masters_count}</p>
                        <p className="text-xs text-muted-foreground mt-1">Masters Supervised</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-center" data-testid="supervision-phd">
                        <p className="text-3xl font-bold text-primary">{supervision.phd_count}</p>
                        <p className="text-xs text-muted-foreground mt-1">PhD Supervised</p>
                      </div>
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-center col-span-2 sm:col-span-1">
                        <p className="text-3xl font-bold text-accent">{totalSupervised}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Postgraduates</p>
                      </div>
                    </div>
                  )}

                  {/* Current students */}
                  {supervision.current_students && supervision.current_students.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Current Supervisees</h3>
                      <div className="space-y-3">
                        {supervision.current_students.map((s, i) => (
                          <div key={i} className="p-4 bg-card border rounded-lg" data-testid={`supervisee-${i}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-foreground">{s.name}</p>
                                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{s.topic}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                  s.level === "PhD"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  {s.level}
                                </span>
                                {s.year && <p className="text-xs text-muted-foreground mt-1">{s.year}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {totalSupervised === 0 && (!supervision.current_students?.length) && (
                    <p className="text-muted-foreground text-sm">Supervision data not available.</p>
                  )}
                </>
              )}
              {isLoading && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
                  </div>
                </div>
              )}
            </Section>

            {/* SERVICE */}
            <Section id="service" icon={<Award className="w-5 h-5" />} title="Service &amp; Memberships">
              {/* Awards */}
              {!isLoading && profile?.awards && profile.awards.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Awards &amp; Recognition</h3>
                  <div className="space-y-2">
                    {profile.awards.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg" data-testid={`award-${i}`}>
                        <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Memberships */}
              {!isLoading && profile?.memberships && profile.memberships.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Professional Memberships</h3>
                  <div className="space-y-2">
                    {profile.memberships.map((m, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-card border rounded-lg" data-testid={`membership-${i}`}>
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && !profile?.awards?.length && !profile?.memberships?.length && (
                <p className="text-muted-foreground text-sm">Service information not yet available.</p>
              )}
            </Section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Profile completeness */}
              {!isLoading && profile?.profile_completeness !== undefined && (
                <CompletenessBar score={profile.profile_completeness} />
              )}

              {/* Academic identity */}
              {!isLoading && (profile?.orcid_id || profile?.google_scholar_url || profile?.scopus_id) && (
                <div className="bg-card border rounded-xl p-5">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Academic Identity</h3>
                  <div className="space-y-2">
                    {profile?.orcid_id && (
                      <a
                        href={`https://orcid.org/${profile.orcid_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors"
                        data-testid="sidebar-orcid"
                      >
                        <span className="w-5 h-5 rounded bg-[#A6CE39] flex items-center justify-center text-white text-[9px] font-bold shrink-0">iD</span>
                        <span className="font-mono">{profile.orcid_id}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                      </a>
                    )}
                    {profile?.google_scholar_url && (
                      <a
                        href={profile.google_scholar_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors"
                        data-testid="sidebar-scholar"
                      >
                        <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>Google Scholar</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                      </a>
                    )}
                    {profile?.scopus_id && (
                      <a
                        href={`https://www.scopus.com/authid/detail.uri?authorId=${profile.scopus_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors"
                        data-testid="sidebar-scopus"
                      >
                        <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>Scopus ID: {profile.scopus_id}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Research stats */}
              {!isLoading && (
                <div className="bg-card border rounded-xl p-5">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Research Output</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Publications
                      </span>
                      <span className="font-bold text-foreground">
                        {(profile?.publications?.length ?? 0) + (profile?.repo_publications?.length ?? 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5" /> Repository Items
                      </span>
                      <span className="font-bold text-foreground">{profile?.repo_publications?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5" /> Grants
                      </span>
                      <span className="font-bold text-foreground">{profile?.grants?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" /> Postgrads Supervised
                      </span>
                      <span className="font-bold text-foreground">{totalSupervised}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="bg-secondary border rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Quick Links</h3>
                <Button variant="outline" className="w-full text-sm justify-start" asChild>
                  <Link href="/staff">
                    <Users className="w-4 h-4 mr-2" /> Staff Directory
                  </Link>
                </Button>
                {profile?.school && (
                  <Button variant="outline" className="w-full text-sm justify-start" asChild>
                    <Link href={`/schools/${profile.school}`}>
                      <BookOpen className="w-4 h-4 mr-2" /> {profile.school} School Page
                    </Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full text-sm justify-start" asChild>
                  <Link href="/repository">
                    <Library className="w-4 h-4 mr-2" /> Repository
                  </Link>
                </Button>
                <Button variant="outline" className="w-full text-sm justify-start" asChild>
                  <Link href="/programmes">
                    <GraduationCap className="w-4 h-4 mr-2" /> Programmes
                  </Link>
                </Button>
                {profile?.email && (
                  <Button className="w-full text-sm bg-primary text-white justify-start" asChild>
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="w-4 h-4 mr-2" /> Send Email
                    </a>
                  </Button>
                )}
                {profile?.cv_url && (
                  <Button variant="outline" className="w-full text-sm justify-start border-accent text-accent hover:bg-accent/10" asChild>
                    <a href={profile.cv_url} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4 mr-2" /> Download CV
                    </a>
                  </Button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
