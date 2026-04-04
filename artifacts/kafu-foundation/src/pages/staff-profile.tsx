import { useRoute, Link } from "wouter";
import { useStaffProfile } from "@/lib/api-hooks";
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
  "from-primary to-primary/80",
  "from-[#1a5c38] to-[#0d3320]",
  "from-purple-700 to-purple-900",
  "from-teal-700 to-teal-900",
  "from-green-700 to-green-900",
  "from-red-700 to-red-900",
  "from-indigo-700 to-indigo-900",
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

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-serif font-bold text-primary mb-5 flex items-center gap-2.5 pb-3 border-b">
        <span className="text-primary/70">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StaffProfilePage() {
  const [, params] = useRoute("/staff/:slug");
  const slug = params?.slug ?? "";
  const { data: profile, isLoading, isError } = useStaffProfile(slug);

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

  const gradient = getGradient(slug);
  const schoolColor = profile?.school ? SCHOOL_COLORS[profile.school] : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero / Header */}
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 75% 40%, #D4A017 0%, transparent 50%)" }}
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
            <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg ring-4 ring-white/10`}>
              {isLoading ? (
                <div className="w-full h-full animate-pulse rounded-2xl bg-white/20" />
              ) : profile?.photo ? (
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-white text-4xl font-serif font-bold select-none">
                  {getInitials(profile?.name ?? "")}
                </span>
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
                  <p className="text-primary-foreground/75 text-sm">
                    {profile?.department}
                    {profile?.school && ` · ${SCHOOL_NAMES[profile.school] ?? profile.school}`}
                  </p>
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary-foreground/80 hover:text-white transition-colors"
                      data-testid="profile-email-link"
                    >
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main column */}
          <div className="lg:col-span-2">

            {/* Biography */}
            <Section icon={<BookOpen className="w-5 h-5" />} title="Biography">
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

            {/* Research Interests */}
            {(isLoading || (profile?.research_interests && profile.research_interests.length > 0)) && (
              <Section icon={<FlaskConical className="w-5 h-5" />} title="Research Interests">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 bg-muted rounded-lg animate-pulse" />)}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {profile!.research_interests.map((r, i) => (
                      <li key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-lg text-sm" data-testid={`research-${i}`}>
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
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

            {/* Publications */}
            {!isLoading && profile?.publications && profile.publications.length > 0 && (
              <Section icon={<FileText className="w-5 h-5" />} title="Selected Publications">
                <div className="space-y-3">
                  {profile.publications.map((pub, i) => (
                    <div key={i} className="p-4 bg-card border rounded-lg" data-testid={`pub-${i}`}>
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
                  ))}
                </div>
              </Section>
            )}

            {/* Teaching Areas */}
            {!isLoading && profile?.teaching_areas && profile.teaching_areas.length > 0 && (
              <Section icon={<Presentation className="w-5 h-5" />} title="Teaching Areas">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.teaching_areas.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-secondary border rounded-lg text-sm" data-testid={`teach-${i}`}>
                      <BookOpen className="w-4 h-4 text-primary shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Awards */}
              {!isLoading && profile?.awards && profile.awards.length > 0 && (
                <div className="bg-card border rounded-xl p-5">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent" /> Awards & Recognition
                  </h3>
                  <ul className="space-y-2">
                    {profile.awards.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground" data-testid={`award-${i}`}>
                        <Award className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Memberships */}
              {!isLoading && profile?.memberships && profile.memberships.length > 0 && (
                <div className="bg-card border rounded-xl p-5">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Professional Memberships
                  </h3>
                  <ul className="space-y-2">
                    {profile.memberships.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground" data-testid={`membership-${i}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        {m}
                      </li>
                    ))}
                  </ul>
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
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
