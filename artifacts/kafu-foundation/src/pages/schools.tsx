import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSchools } from "@/lib/api-hooks";
import { SeoHead } from "@/components/seo-head";
import { BookOpen, GraduationCap, ChevronRight, User } from "lucide-react";

function progTotal(count: Record<string, number> | { undergraduate?: number; postgraduate?: number; doctoral?: number } | number): number {
  if (typeof count === "number") return count;
  return Object.values(count).reduce((a, b) => a + b, 0);
}

export default function Schools() {
  const { data: schools, isLoading } = useSchools();

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Schools & Faculties — Kaimosi Friends University"
        description="Explore the five schools at KAFU: School of Education & Social Sciences, Business & Economics, Computing & IT, Science, and Health Sciences. Find your programme today."
        path="/schools"
        breadcrumbs={[{ name: "Schools", path: "/schools" }]}
      />
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #D4A017 0%, transparent 60%)" }}
        />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-5">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Schools</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
            Schools & Faculties
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Five distinct academic schools, each with a unique identity, expert faculty, and
            programmes aligned to national and global development priorities.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
              ))
            : schools?.map((school) => (
                <div
                  key={school.code}
                  className="group flex flex-col md:flex-row border rounded-xl bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                  data-testid={`school-card-${school.code}`}
                >
                  {/* Left accent panel */}
                  <div className="w-full md:w-64 shrink-0 flex flex-col items-center justify-center p-8 rounded-t-xl md:rounded-l-xl md:rounded-tr-none bg-primary/5 border-b md:border-b-0 md:border-r text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center mb-4">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-bold text-accent uppercase tracking-wider mb-2">{school.code}</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {progTotal(school.programmes_count)} Programmes
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-7 md:p-8">
                    <h2 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {school.name}
                    </h2>
                    <p className="text-muted-foreground mb-5 leading-relaxed line-clamp-3">
                      {school.description}
                    </p>

                    {school.dean && (
                      <div className="flex items-center gap-3 mb-6 p-3 bg-secondary rounded-lg w-fit">
                        <User className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground uppercase font-semibold block">{school.dean_title ?? "Dean of School"}</span>
                          <span className="text-sm font-medium text-foreground">{school.dean}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 mt-auto">
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        asChild
                        data-testid={`btn-view-${school.code}`}
                      >
                        <Link href={school.href ?? `/schools/${school.code}`}>
                          View School <ChevronRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/5"
                        asChild
                        data-testid={`btn-progs-${school.code}`}
                      >
                        <Link href={`/programmes?school=${school.code}`}>Browse Programmes</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-accent hover:bg-accent/10"
                        asChild
                        data-testid={`btn-apply-${school.code}`}
                      >
                        <Link href="/admissions">Apply to this School</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
