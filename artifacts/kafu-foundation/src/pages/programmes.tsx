import { useState } from "react";
import { useLocation } from "wouter";
import { useProgrammes, useSchools } from "@/lib/api-hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Clock, FilterX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Programmes() {
  // Simple URL params parsing
  const [loc] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialSchool = searchParams.get("school") || "all";
  const initialLevel = searchParams.get("level") || "all";

  const [schoolFilter, setSchoolFilter] = useState(initialSchool);
  const [levelFilter, setLevelFilter] = useState(initialLevel);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: schools } = useSchools();
  const { data: programmes, isLoading } = useProgrammes(
    schoolFilter !== "all" ? schoolFilter : undefined,
    levelFilter !== "all" ? levelFilter : undefined
  );

  const filteredProgrammes = programmes?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetFilters = () => {
    setSchoolFilter("all");
    setLevelFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Academic Catalogue</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Explore our comprehensive range of undergraduate, postgraduate, and diploma programmes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-card p-4 md:p-6 rounded-xl border shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search programmes by name or code..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-programmes"
            />
          </div>
          
          <Select value={schoolFilter} onValueChange={setSchoolFilter}>
            <SelectTrigger className="w-full md:w-[250px]" data-testid="select-school">
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools?.map(s => (
                <SelectItem key={s.id} value={s.code}>{s.code} - {s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-[200px]" data-testid="select-level">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
              <SelectItem value="Postgraduate">Postgraduate</SelectItem>
              <SelectItem value="Doctoral">Doctoral</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Certificate">Certificate</SelectItem>
            </SelectContent>
          </Select>

          {(schoolFilter !== "all" || levelFilter !== "all" || searchQuery !== "") && (
            <Button variant="ghost" onClick={resetFilters} className="px-3" data-testid="btn-reset-filters">
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="font-semibold text-muted-foreground mb-4">
            {isLoading ? "Loading programmes..." : `Showing ${filteredProgrammes?.length || 0} programmes`}
          </h2>

          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))
          ) : filteredProgrammes?.length === 0 ? (
            <div className="text-center py-20 bg-card border rounded-xl">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No programmes found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Button variant="outline" className="mt-6" onClick={resetFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProgrammes?.map((prog) => (
                <div key={prog.id} className="bg-card p-6 border rounded-xl shadow-sm hover:border-primary transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between" data-testid={`programme-${prog.id}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-1 rounded">
                        {prog.level}
                      </span>
                      <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {prog.code}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-primary mb-2">{prog.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-4xl">{prog.description}</p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{prog.duration}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild data-testid={`btn-apply-${prog.id}`}>
                      <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">Apply</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
