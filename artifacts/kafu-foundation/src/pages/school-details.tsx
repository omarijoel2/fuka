import { useRoute, Link } from "wouter";
import { useSchool, useProgrammes } from "@/lib/api-hooks";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoHead } from "@/components/seo-head";
import { ArrowLeft, BookOpen, User, GraduationCap, ChevronRight, Clock, ExternalLink, Building2, Mail, Phone } from "lucide-react";

interface Department {
  id: number;
  slug: string;
  name: string;
  hod_name: string | null;
  hod_title: string;
  hod_email: string | null;
  hod_photo_url: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
}

interface StaffMember {
  slug: string;
  name: string;
  designation: string;
  photo: string | null;
  email: string | null;
  school: string | null;
}

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
  const { data: deptsData, isLoading: deptsLoading } = useQuery<{ data: Department[] }>({
    queryKey: ["school-departments", code],
    queryFn: () => fetch(`/api/schools/${code}/departments`).then(r => r.json()),
    enabled: !!code,
    staleTime: 1000 * 60 * 10,
  });
  const departments = deptsData?.data ?? [];

  const { data: staffData } = useQuery<{ data: StaffMember[] }>({
    queryKey: ["school-staff-dean", code],
    queryFn: () => fetch(`/api/staff?school=${code}`).then(r => r.json()),
    enabled: !!code,
    staleTime: 1000 * 60 * 10,
  });
  const deanStaff = staffData?.data?.find(s =>
    s.designation?.toLowerCase().includes("dean") && !s.designation?.toLowerCase().includes("sub")
  ) ?? null;

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

  const defaultTab = departments.length > 0 ? "depts" : undergrad.length > 0 ? "ug" : postgrad.length > 0 ? "pg" : "doc";

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
        <div className="h-72 bg-muted animate-pulse" />
      ) : (
        <div className="bg-primary text-primary-foreground relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(ellipse at 80% 30%, #D4A017 0%, transparent 55%)" }}
          />
          <div className="container mx-auto px-4 py-16 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-primary-foreground/60 mb-8">
              <Link href="/" className="hover:text-primary-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <Link href="/schools" className="hover:text-primary-foreground transition-colors">Schools</Link>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="text-primary-foreground/80">{school?.code}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Title block */}
              <div className="flex-1">
                <p className="text-primary-foreground/55 text-xl md:text-2xl font-light tracking-wide mb-1">
                  The School of
                </p>
                <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-primary-foreground">
                  {(school?.name ?? "").replace(/^School of\s*/i, "")}
                </h1>
                <div className="flex items-center gap-2 mt-4">
                  <span className="py-1 px-3 rounded-full bg-accent/25 text-accent border border-accent/40 font-bold text-xs tracking-widest uppercase">
                    {school?.code}
                  </span>
                </div>
              </div>

              {/* Dean card */}
              <div
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-5 py-4 rounded-2xl shrink-0 border border-white/15 min-w-[240px]"
                data-testid="dean-card"
              >
                {deanStaff?.photo ? (
                  <img
                    src={deanStaff.photo}
                    alt={school?.dean ?? "Dean"}
                    className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-accent/50"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <User className="w-7 h-7 text-primary-foreground/60" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-foreground/55 mb-0.5">
                    Dean of School
                  </span>
                  <span className="block font-semibold text-primary-foreground leading-snug">
                    {school?.dean ?? "Position Vacant"}
                  </span>
                  {school?.dean && (
                    <span className="block text-xs text-primary-foreground/55 mt-0.5">
                      {school?.code}
                    </span>
                  )}
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

          {/* Tabs: Departments + Programmes */}
          <div className="lg:col-span-2">
            {(progsLoading || deptsLoading) ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <Tabs defaultValue={defaultTab}>
                <TabsList className="mb-6 bg-muted p-1 rounded-lg flex flex-wrap gap-1 h-auto">
                  {departments.length > 0 && (
                    <TabsTrigger value="depts" data-testid="tab-depts">
                      <Building2 className="w-3.5 h-3.5 mr-1.5" />
                      Departments ({departments.length})
                    </TabsTrigger>
                  )}
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

                {/* Departments Tab */}
                {departments.length > 0 && (
                  <TabsContent value="depts" className="space-y-3">
                    {departments.map((dept) => (
                      <Link key={dept.id} href={`/departments/${dept.slug}`}>
                        <div
                          className="group flex items-center gap-4 p-5 bg-card border rounded-xl hover:border-primary hover:shadow-sm transition-all cursor-pointer"
                          data-testid={`dept-${dept.slug}`}
                        >
                          {dept.hod_photo_url ? (
                            <img
                              src={dept.hod_photo_url}
                              alt={dept.hod_name ?? ""}
                              className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-border group-hover:ring-primary transition-all"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                              {dept.name}
                            </h3>
                            {dept.hod_name && (
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {dept.hod_title}: {dept.hod_name}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-1.5">
                              {dept.email && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {dept.email}
                                </span>
                              )}
                              {dept.phone && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {dept.phone}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </TabsContent>
                )}

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
