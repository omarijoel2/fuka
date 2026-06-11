import { Link } from "wouter";
import { useAlumniProfile } from "@/lib/api-hooks";
import { ChevronRight, GraduationCap, Linkedin, MapPin, Briefcase, Building2, ArrowLeft, ArrowRight } from "lucide-react";
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

export default function AlumniDetail({ slug }: { slug: string }) {
  const { data: a, isLoading, isError } = useAlumniProfile(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !a) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold mb-2">Alumni profile not found</h1>
        <p className="text-muted-foreground mb-6">This profile may have been removed or is not publicly visible.</p>
        <Link href="/alumni" className="text-primary font-medium hover:underline" data-testid="link-back-alumni">
          Back to Alumni
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={`${a.name} — KAFU Alumni`}
        description={a.seo_meta?.description ?? a.achievements ?? `${a.name}, ${a.programme ?? "KAFU"} graduate.`}
        path={`/alumni/${a.slug}`}
        breadcrumbs={[{ name: "Alumni", path: "/alumni" }, { name: a.name, path: `/alumni/${a.slug}` }]}
      />

      <div className="relative bg-primary text-primary-foreground py-12 overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/alumni" className="hover:underline">Alumni</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>{a.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
              {a.photo_url ? (
                <img src={a.photo_url} alt={a.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white/70">{a.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold">{a.name}</h1>
              <p className="text-primary-foreground/90 text-lg mt-1">
                {a.current_role}{a.current_organization ? `, ${a.current_organization}` : ""}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 text-sm">
                {a.sector && <span className="px-2.5 py-1 rounded-full bg-white/15">{SECTOR_LABELS[a.sector] ?? a.sector}</span>}
                {a.programme && <span className="px-2.5 py-1 rounded-full bg-white/15">{a.programme}</span>}
                {a.graduation_year && <span className="px-2.5 py-1 rounded-full bg-white/15">Class of {a.graduation_year}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid md:grid-cols-[1fr_300px] gap-8 flex-1">
        <div className="space-y-8">
          {a.bio && (
            <section>
              <h2 className="text-xl font-serif font-bold mb-3">About</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{a.bio}</p>
            </section>
          )}
          {a.achievements && (
            <section>
              <h2 className="text-xl font-serif font-bold mb-3">Achievements &amp; Impact</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{a.achievements}</p>
            </section>
          )}
          {(a.stories ?? []).length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold mb-3">Featured Stories</h2>
              <div className="space-y-3">
                {(a.stories ?? []).map((s) => (
                  <Link key={s.id} href={`/alumni-stories/${s.slug}`}>
                    <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between gap-4" data-testid={`linked-story-${s.slug}`}>
                      <div>
                        <p className="font-semibold">{s.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{s.summary}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 space-y-3 text-sm">
            <h3 className="font-semibold text-foreground">Details</h3>
            {a.current_role && (
              <div className="flex gap-2 text-muted-foreground"><Briefcase className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" /><span>{a.current_role}{a.current_organization ? ` at ${a.current_organization}` : ""}</span></div>
            )}
            {a.industry && (
              <div className="flex gap-2 text-muted-foreground"><Building2 className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" /><span>{a.industry}</span></div>
            )}
            {a.country && (
              <div className="flex gap-2 text-muted-foreground"><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" /><span>{a.country}</span></div>
            )}
            {a.linkedin_url && (
              <a href={a.linkedin_url} target="_blank" rel="noreferrer" className="flex gap-2 text-primary hover:underline" data-testid="link-linkedin">
                <Linkedin className="w-4 h-4 shrink-0 mt-0.5" /><span>LinkedIn Profile</span>
              </a>
            )}
          </div>
          <Link href="/alumni" className="flex items-center gap-2 text-sm text-primary font-medium hover:underline" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" /> Back to all alumni
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Building2Icon() {
  return <Briefcase className="w-4 h-4 shrink-0 mt-0.5 text-primary/60" />;
}
