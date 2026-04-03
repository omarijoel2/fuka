import { useRoute, Link } from "wouter";
import { useSchool, useProgrammes } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, BookOpen, User, GraduationCap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SchoolDetails() {
  const [, params] = useRoute("/schools/:code");
  const code = params?.code || "";

  const { data: school, isLoading: schoolLoading, error: schoolError } = useSchool(code);
  const { data: programmes, isLoading: progsLoading } = useProgrammes(code);

  const undergrad = programmes?.filter(p => p.level === "Undergraduate") || [];
  const postgrad = programmes?.filter(p => p.level === "Postgraduate") || [];
  const doctoral = programmes?.filter(p => p.level === "Doctoral") || [];
  const other = programmes?.filter(p => p.level === "Diploma" || p.level === "Certificate") || [];

  if (schoolError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading school</AlertTitle>
          <AlertDescription>
            Could not find school details for "{code}". It may not exist.
          </AlertDescription>
        </Alert>
        <Button variant="ghost" asChild className="mt-4">
          <Link href="/schools"><ArrowLeft className="w-4 h-4 mr-2"/> Back to Schools</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {schoolLoading ? (
        <div className="w-full h-64 bg-muted animate-pulse" />
      ) : (
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild className="text-primary-foreground/80 hover:text-white hover:bg-white/10 mb-8 -ml-4" data-testid="btn-back">
              <Link href="/schools"><ArrowLeft className="w-4 h-4 mr-2"/> All Schools</Link>
            </Button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent border border-accent/30 font-bold text-sm mb-4 tracking-wider">
                  {school?.code}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-bold max-w-4xl">{school?.name}</h1>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg shrink-0">
                <User className="w-8 h-8 text-accent" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-primary-foreground/70">Dean of School</span>
                  <span className="block font-medium">{school?.dean}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-8">
            {schoolLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                <section className="bg-secondary p-6 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="text-xl font-serif font-bold">About the School</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {school?.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Vision</h4>
                      <p className="text-sm text-muted-foreground">{school?.vision}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-1">Mission</h4>
                      <p className="text-sm text-muted-foreground">{school?.mission}</p>
                    </div>
                  </div>
                </section>
                
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" asChild data-testid="btn-apply-school">
                  <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                    Apply to this School
                  </a>
                </Button>
              </>
            )}
          </div>

          {/* Right Column - Programmes */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold text-primary">Academic Programmes</h2>
            </div>

            {progsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full mb-8" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <Tabs defaultValue={undergrad.length > 0 ? "ug" : postgrad.length > 0 ? "pg" : "other"} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-muted p-1 rounded-lg mb-8">
                  {undergrad.length > 0 && <TabsTrigger value="ug" data-testid="tab-ug">Undergraduate ({undergrad.length})</TabsTrigger>}
                  {postgrad.length > 0 && <TabsTrigger value="pg" data-testid="tab-pg">Postgraduate ({postgrad.length})</TabsTrigger>}
                  {doctoral.length > 0 && <TabsTrigger value="doc" data-testid="tab-doc">Doctoral ({doctoral.length})</TabsTrigger>}
                  {other.length > 0 && <TabsTrigger value="other" data-testid="tab-other">Diploma & Cert ({other.length})</TabsTrigger>}
                </TabsList>

                {[
                  { value: "ug", items: undergrad },
                  { value: "pg", items: postgrad },
                  { value: "doc", items: doctoral },
                  { value: "other", items: other },
                ].map((group) => (
                  group.items.length > 0 && (
                    <TabsContent key={group.value} value={group.value} className="space-y-4">
                      {group.items.map((prog) => (
                        <div key={prog.id} className="p-6 bg-card border rounded-lg shadow-sm hover:border-primary/40 transition-colors" data-testid={`prog-${prog.id}`}>
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                            <h3 className="text-lg font-bold text-foreground font-serif">{prog.name}</h3>
                            <span className="inline-block shrink-0 text-xs font-mono font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded">
                              {prog.code}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {prog.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded"><BookOpen className="w-3.5 h-3.5" /> {prog.duration}</span>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  )
                ))}
              </Tabs>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
