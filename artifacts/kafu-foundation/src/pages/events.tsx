import React, { useState } from "react";
import { Link } from "wouter";
import { useEvents } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Search, ExternalLink, ChevronRight, Tag, ArrowRight } from "lucide-react";
import { SeoHead } from "@/components/seo-head";
import type { Event } from "@/lib/api-types";

const CATEGORIES = ["All", "Examinations", "Academic", "Administration", "Graduation", "Special Events", "Community Outreach", "Student Life"];

function formatDateRange(start: string, end?: string | null) {
  const s = new Date(start);
  const sStr = s.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  if (!end || end === start) return sStr;
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  return `${sStr} – ${e.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}

function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const isMultiDay = event.end_date && event.end_date !== event.date;

  return (
    <Link href={`/events/${event.slug}`} data-testid={`event-card-${event.id}`}>
      <div className="group bg-card border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all flex flex-col sm:flex-row gap-4">
        {/* Date block */}
        <div className="shrink-0 w-20 sm:w-16 text-center">
          <div className="bg-primary/8 border border-primary/20 rounded-xl p-3 group-hover:bg-primary group-hover:border-primary transition-colors">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-primary group-hover:text-primary-foreground transition-colors">{month}</span>
            <span className="block text-2xl font-serif font-bold leading-none text-primary group-hover:text-primary-foreground transition-colors">{day}</span>
          </div>
          {isMultiDay && (
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-wider">Multi-day</p>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" /> {event.category}
            </span>
          </div>
          <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
            {isMultiDay && (
              <span className="flex items-center gap-1 text-primary font-medium">
                <Calendar className="w-3.5 h-3.5" /> {formatDateRange(event.date, event.end_date)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center shrink-0">
          {event.registration_link ? (
            <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full flex items-center gap-1 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              Register <ExternalLink className="w-3 h-3" />
            </span>
          ) : (
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Events() {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: events, isLoading } = useEvents({
    filter,
    category: category !== "All" ? category : undefined,
    search: debouncedSearch || undefined,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Events — Kaimosi Friends University"
        description="Upcoming and past events at Kaimosi Friends University — academic calendar, graduation ceremonies, conferences, public lectures, and community outreach events."
        path="/events"
        breadcrumbs={[{ name: "Events", path: "/events" }]}
      />
      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <img
          src="https://kafu.ac.ke/wp-content/uploads/2025/10/sports.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.25)" }}
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Events</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Events Calendar</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Academic ceremonies, public lectures, examinations, community outreach, and special events at KAFU.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-background border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
          {/* Upcoming / Past toggle */}
          <div className="flex rounded-lg border overflow-hidden shrink-0">
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                filter === "upcoming" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-secondary"
              }`}
              data-testid="tab-events-upcoming"
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                filter === "past" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-secondary"
              }`}
              data-testid="tab-events-past"
            >
              Past Events
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              data-testid="input-events-search"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                }`}
                data-testid={`tab-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-xl">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2 font-serif">No events found</h3>
            <p className="text-muted-foreground text-sm">
              {filter === "past" ? "No past events match your search." : "No upcoming events match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
