import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSchools } from "@/lib/api-hooks";
import { BookOpen, GraduationCap, ChevronRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function Schools() {
  const { data: schools, isLoading, error } = useSchools();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Schools & Faculties</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Discover our five distinct academic schools, each dedicated to specialized knowledge and practical skills.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading schools</AlertTitle>
            <AlertDescription>
              We encountered a problem while fetching the schools data. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-8">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 p-6 border rounded-xl bg-card shadow-sm">
                <Skeleton className="h-40 w-full md:w-64 rounded-lg" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-32 mt-4" />
                </div>
              </div>
            ))
          ) : (
            schools?.map((school) => (
              <div key={school.id} className="group flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-8 border rounded-xl bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all" data-testid={`school-card-${school.code}`}>
                <div className="w-full md:w-72 shrink-0 flex flex-col items-center justify-center p-8 bg-secondary rounded-lg text-center">
                  <BookOpen className="w-12 h-12 text-primary mb-4" />
                  <span className="text-sm font-bold text-accent uppercase tracking-wider mb-2">{school.code}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mt-auto">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {school.programmeCount} Programmes
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h2 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {school.name}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {school.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto mb-6 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-semibold">Dean of School</span>
                      <p className="font-medium">{school.dean}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <Button asChild data-testid={`btn-view-${school.code}`}>
                      <Link href={`/schools/${school.code}`}>
                        View School Details <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild data-testid={`btn-progs-${school.code}`}>
                      <Link href={`/programmes?school=${school.code}`}>
                        View Programmes
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
