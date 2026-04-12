import { useRoute, Link } from "wouter";
import { useSchool, useProgrammes } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoHead } from "@/components/seo-head";
import { ArrowLeft, BookOpen, User, GraduationCap, ChevronRight, Clock, ExternalLink } from "lucide-react";

function progSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function progTotal(count: Record<string, number> | number): number {
  if (typeof count === "number") return count;
  return Object.values(count).reduce((a, b) => a + b, 0);
}

export default function SchoolDetails() {
  const [, params] = useRoute("/schools/:code");
  const code = params?.code?.toUpperCase() || "";

  const { data: school, isLoading: schoolLoading, error } = useSchool(code);
  const { data: programmes, isLoading: progsLoading } = useProgrammes(code);

  const undergrad = programmes?.filter((p) => p.level === "undergraduate") ?? [];
  const postgrad = programmes?.filter((p) => p.level === "postgraduate") ?? [];
  const doctoral = programmes?.filter((p) => p.level === "doctoral") ?? [];

  if (!schoolLoading && error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-destructive mb-4">School "{code}" not found.</p>
        <Button variant="ghost" asChild>
          <Link href="/schools">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Schools
          </Link>
        </Button>
      </div>
    );
  }

  const defaultTab = undergrad.length > 0 ? "ug" : postgrad.length > 0 ? "pg" : "doc";

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={school ? `${school.name} — Kaimosi Friends University` : "School — Kaimosi Friends University"}
        description={school?.description?.slice(0, 155) ?? "School at Kaimosi Friends University — programmes, staff, research, and more."}
        path={`/schools/${code}`}
        breadcrumbs={[{ name: "Schools", path: "/schools" }, { name: school?.name ?? code, path: `/schools/${code}` }]}
      />
      {/* Hero */}
      {schoolLoading ? (
        <div className="h-64 bg-muted animate-pulse" />
      ) : (
        <div className="bg-primary text-primary-foreground relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(ellipse at 80% 30%, #D4A017 0%, transparent 55%)" }}
          />
          <div className="container mx-auto px-4 py-14 relative z-10">
            <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-5">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <Link href="/schools" className="hover:underline">Schools</Link>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span>{school?.code}</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent border border-accent/30 font-bold text-sm mb-4 tracking-wider">
                  {school?.code}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-bold max-w-4xl leading-tight">
                  {school?.name}
                </h1>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl shrink-0">
                <User className="w-8 h-8 text-accent" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-primary-foreground/70">Dean of School</span>
                  <span className="block font-semibold">{school?.dean ?? "Position Vacant"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {schoolLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* About */}
                <div className="bg-secondary border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="font-serif font-bold text-lg">About the School</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{school?.description}</p>
                </div>

                {/* Vision & Mission */}
                {(school?.vision || school?.mission) && (
                  <div className="border rounded-xl p-6 space-y-4">
                    {school.vision && (
                      <div>
                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Vision</h4>
                        <p className="text-sm text-foreground leading-relaxed">{school.vision}</p>
                      </div>
                    )}
                    {school.mission && (
                      <div>
                        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Mission</h4>
                        <p className="text-sm text-foreground leading-relaxed">{school.mission}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "UG", value: undergrad.length },
                    { label: "PG", value: postgrad.length },
                    { label: "PhD", value: doctoral.length },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 bg-primary/5 rounded-lg border">
                      <div className="text-xl font-bold font-serif text-primary">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    asChild
                    data-testid="btn-apply-school"
                  >
                    <Link href="/admissions">Apply to this School</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5"
                    asChild
                    data-testid="btn-all-progs"
                  >
                    <Link href={`/programmes?school=${code}`}>
                      <GraduationCap className="w-4 h-4 mr-2" /> All Programmes
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Programme Tabs */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" /> Academic Programmes
            </h2>

            {progsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <Tabs defaultValue={defaultTab}>
                <TabsList className="mb-6 bg-muted p-1 rounded-lg flex flex-wrap gap-1 h-auto">
                  {undergrad.length > 0 && (
                    <TabsTrigger value="ug" data-testid="tab-ug">
                      Undergraduate ({undergrad.length})
                    </TabsTrigger>
                  )}
                  {postgrad.length > 0 && (
                    <TabsTrigger value="pg" data-testid="tab-pg">
                      Postgraduate ({postgrad.length})
                    </TabsTrigger>
                  )}
                  {doctoral.length > 0 && (
                    <TabsTrigger value="doc" data-testid="tab-doc">
                      Doctoral ({doctoral.length})
                    </TabsTrigger>
                  )}
                </TabsList>

                {[
                  { value: "ug", items: undergrad },
                  { value: "pg", items: postgrad },
                  { value: "doc", items: doctoral },
                ].map(
                  ({ value, items }) =>
                    items.length > 0 && (
                      <TabsContent key={value} value={value} className="space-y-3">
                        {items.map((prog, i) => (
                          <div
                            key={i}
                            className="group flex items-center justify-between gap-4 p-5 bg-card border rounded-xl hover:border-primary hover:shadow-sm transition-all"
                            data-testid={`prog-${progSlug(prog.code)}`}
                          >
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                {prog.name}
                              </h3>
                              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded font-medium">
                                  {prog.code}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {prog.duration}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary hover:text-white text-xs"
                                asChild
                                data-testid={`btn-view-prog-${progSlug(prog.code)}`}
                              >
                                <Link href={`/programmes/${prog.school}/${encodeURIComponent(prog.code)}`}>
                                  Details <ChevronRight className="ml-1 w-3 h-3" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
                                asChild
                                data-testid={`btn-apply-prog-${progSlug(prog.code)}`}
                              >
                                <Link href="/admissions">Apply</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    )
                )}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
