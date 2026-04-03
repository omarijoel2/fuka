import { useEvents } from "@/lib/api-hooks";
import { Calendar as CalendarIcon, MapPin, Clock, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Events() {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">University Events</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Academic calendar, public lectures, student activities, and administrative deadlines.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-xl">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">Check back later for new university events.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events?.map(event => {
              const eventDate = new Date(event.date);
              const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
              const day = eventDate.getDate();
              const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

              return (
                <div key={event.id} className="bg-card border rounded-xl p-6 shadow-sm hover:border-primary/40 transition-colors flex flex-col sm:flex-row gap-6 group" data-testid={`event-${event.id}`}>
                  
                  {/* Date Block */}
                  <div className="shrink-0 w-full sm:w-32 h-24 sm:h-full bg-primary/5 rounded-lg flex flex-row sm:flex-col items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <div className="text-center px-4 sm:px-0 border-r sm:border-r-0 sm:border-b border-primary/20 sm:pb-2 sm:mb-2 sm:w-full">
                      <span className="block text-sm font-bold uppercase tracking-wider">{month}</span>
                      <span className="block text-3xl font-serif font-bold leading-none">{day}</span>
                    </div>
                    <div className="text-center px-4 sm:px-0">
                      <span className="block text-xs font-medium opacity-80">{weekday}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {event.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-foreground/70">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-muted-foreground" /> {event.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-muted-foreground" /> {event.location}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
