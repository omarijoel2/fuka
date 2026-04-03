import { useOpportunities } from "@/lib/api-hooks";
import { Briefcase, FileText, GraduationCap, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Opportunities() {
  const { data: opps, isLoading } = useOpportunities();

  const tenders = opps?.filter(o => o.type === "Tender") || [];
  const jobs = opps?.filter(o => o.type === "Job Vacancy") || [];
  const scholarships = opps?.filter(o => o.type === "Scholarship") || [];

  const renderList = (items: typeof opps, icon: React.ReactNode, emptyMsg: string) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-16 bg-card border rounded-xl">
          <div className="flex justify-center text-muted-foreground mb-4 opacity-50">{icon}</div>
          <p className="text-muted-foreground">{emptyMsg}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map(item => {
          const isExpiringSoon = new Date(item.deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
          return (
            <div key={item.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 items-start md:items-center hover:border-primary/50 transition-colors" data-testid={`opp-${item.id}`}>
              <div className="flex-1">
                <h3 className="text-lg font-bold font-serif text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted ${isExpiringSoon ? 'text-destructive bg-destructive/10' : 'text-foreground/70'}`}>
                    <Clock className="w-3.5 h-3.5" /> 
                    Deadline: {new Date(item.deadline).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="shrink-0 group" asChild data-testid={`btn-opp-${item.id}`}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  View Details <ExternalLink className="w-4 h-4 ml-2 text-muted-foreground group-hover:text-foreground" />
                </a>
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Opportunities</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Current tenders, job vacancies, and scholarship opportunities at KAFU.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-full max-w-md mx-auto mb-8" />
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : (
          <Tabs defaultValue="tenders" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="tenders" data-testid="tab-tenders">Tenders ({tenders.length})</TabsTrigger>
              <TabsTrigger value="jobs" data-testid="tab-jobs">Careers ({jobs.length})</TabsTrigger>
              <TabsTrigger value="scholarships" data-testid="tab-scholarships">Scholarships ({scholarships.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="tenders">
              {renderList(tenders, <FileText className="w-12 h-12" />, "No open tenders at the moment.")}
            </TabsContent>
            
            <TabsContent value="jobs">
              {renderList(jobs, <Briefcase className="w-12 h-12" />, "No job vacancies currently open.")}
            </TabsContent>
            
            <TabsContent value="scholarships">
              {renderList(scholarships, <GraduationCap className="w-12 h-12" />, "No active scholarships right now.")}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
