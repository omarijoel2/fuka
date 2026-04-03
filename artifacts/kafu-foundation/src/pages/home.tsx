import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useStats, useNews, useSchools, useEvents } from "@/lib/api-hooks";
import { Calendar, MapPin, ArrowRight, BookOpen, ChevronRight, GraduationCap } from "lucide-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: schools, isLoading: schoolsLoading } = useSchools();
  const { data: events, isLoading: eventsLoading } = useEvents();

  const featuredNews = news?.filter(n => n.featured).slice(0, 3) || [];
  const upcomingEvents = events?.slice(0, 4) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/70" />
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #D4A017 0%, transparent 60%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)'}} />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent border border-accent/30 font-medium text-sm mb-6 animate-in slide-in-from-bottom-4 duration-500">
            Est. 2014 • Quaker Heritage
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animate-in slide-in-from-bottom-6 duration-700 delay-100">
            Spring of Knowledge
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-white/90 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            Welcome to Kaimosi Friends University. A premier institution in Western Kenya dedicated to truth, service, and academic excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8" asChild data-testid="hero-button-apply">
              <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                Apply for Admissions
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 text-lg px-8" asChild data-testid="hero-button-programmes">
              <Link href="/programmes">Explore Programmes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 animate-pulse">
                  <div className="h-10 w-20 bg-muted rounded mb-2" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              ))
            ) : (
              stats?.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center text-center p-4" data-testid={`stat-${stat.id}`}>
                  <span className="text-4xl md:text-5xl font-bold text-primary mb-2 font-serif">{stat.value}</span>
                  <span className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Our Academic Schools</h2>
              <p className="text-lg text-muted-foreground">
                KAFU offers diverse academic programmes across five distinct schools, designed to equip students with knowledge and skills for the modern world.
              </p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80 group" asChild data-testid="link-all-schools">
              <Link href="/schools">
                View all schools <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schoolsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
              ))
            ) : (
              schools?.map((school) => (
                <Link key={school.id} href={`/schools/${school.code}`} data-testid={`card-school-${school.code}`}>
                  <div className="group h-full flex flex-col justify-between p-8 rounded-xl border bg-card hover:border-primary hover:shadow-lg transition-all duration-300">
                    <div>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 font-serif line-clamp-2 group-hover:text-primary transition-colors">
                        {school.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                        {school.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-full">
                        {school.programmeCount} Programmes
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured News & Events */}
      <section className="py-20 bg-secondary/50 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* News Column */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-primary">University News</h2>
                <Button variant="ghost" asChild data-testid="link-all-news">
                  <Link href="/news">All News</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-80 bg-muted rounded-xl animate-pulse" />
                  ))
                ) : (
                  featuredNews.map((article) => (
                    <Link key={article.id} href={`/news`} data-testid={`card-news-${article.id}`}>
                      <div className="group rounded-xl overflow-hidden bg-card border hover:shadow-md transition-all">
                        {article.imageUrl && (
                          <div className="h-48 overflow-hidden bg-muted">
                            <img 
                              src={article.imageUrl} 
                              alt={article.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                            <span className="text-xs text-muted-foreground">{new Date(article.date).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-2 font-serif group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Events Column */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-primary">Upcoming Events</h2>
                <Button variant="ghost" asChild data-testid="link-all-events">
                  <Link href="/events">All Events</Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                {eventsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                  ))
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="group p-5 rounded-xl border bg-card hover:border-primary/50 transition-colors flex gap-4" data-testid={`card-event-${event.id}`}>
                      <div className="flex flex-col items-center justify-center min-w-[3.5rem] p-2 bg-primary/5 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-bold font-serif">{new Date(event.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold mb-1 font-serif text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to Join KAFU?</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Take the next step in your academic journey. Explore our admission requirements and apply to become part of our vibrant community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8" asChild data-testid="cta-button-apply">
              <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                Start Application
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8" asChild data-testid="cta-button-admissions">
              <Link href="/admissions">Admission Info</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
