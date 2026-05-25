import { Link, useParams } from "wouter";
import { useEventDetail } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Tag, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { SITE_URL, SeoHead, ORG_JSONLD } from "@/components/seo-head";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateRange(start: string, end?: string | null) {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export default function EventDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data: event, isLoading, isError } = useEventDetail(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-12 bg-muted rounded w-3/4" />
          <div className="h-40 bg-muted rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-4 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-6">The event you're looking for could not be found.</p>
        <Button asChild><Link href="/events">Back to Events</Link></Button>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = eventDate.getDate();
  const isMultiDay = event.end_date && event.end_date !== event.date;
  const isPast = event.status === "past";

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    endDate: event.end_date ?? event.date,
    location: {
      "@type": "Place",
      name: event.venue ?? "Kaimosi Friends University",
      address: { "@type": "PostalAddress", addressLocality: "Kaimosi", addressCountry: "KE" },
    },
    organizer: ORG_JSONLD,
    eventStatus: isPast
      ? "https://schema.org/EventPostponed"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${SITE_URL}/events/${slug}`,
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SeoHead
        title={event.title}
        description={event.description}
        path={`/events/${slug}`}
        breadcrumbs={[{ name: "Events", path: "/events" }, { name: event.title }]}
        jsonLd={eventJsonLd}
      />
      {/* Breadcrumb */}
      <div className="border-b bg-secondary/30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-foreground font-medium line-clamp-1 max-w-xs">{event.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main content */}
          <div className="lg:col-span-8">
            {/* Category + status */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> {event.category}
              </span>
              {isPast && (
                <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Past Event
                </span>
              )}
              {!isPast && (
                <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                  Upcoming
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 leading-snug">
              {event.title}
            </h1>

            {/* Key info box */}
            <div className="bg-secondary/50 border rounded-xl p-6 mb-8">
              <h3 className="font-serif font-bold text-base mb-4">Event Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Date</p>
                    <p className="text-sm font-medium text-foreground">{formatDateRange(event.date, event.end_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Time</p>
                    <p className="text-sm font-medium text-foreground">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Location</p>
                    <p className="text-sm font-medium text-foreground">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            {/* Tags */}
            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button variant="outline" asChild data-testid="btn-back-to-events">
                <Link href="/events">
                  <ArrowLeft className="w-4 h-4 mr-2" /> All Events
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Date highlight */}
            <div className="bg-primary text-primary-foreground rounded-xl p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">{month}</p>
              <p className="text-6xl font-serif font-bold leading-none mb-1">{day}</p>
              <p className="text-sm text-primary-foreground/80">{formatDate(event.date)}</p>
              {isMultiDay && event.end_date && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs text-primary-foreground/70">Through</p>
                  <p className="text-sm font-medium">{formatDate(event.end_date)}</p>
                </div>
              )}
            </div>

            {/* Registration CTA */}
            {event.registration_link && !isPast && (
              <div className="border rounded-xl p-5 bg-accent/5">
                <h4 className="font-serif font-bold text-sm mb-2">Registration</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Register for this event through the KAFU Student Portal or the link below.
                </p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-sm" asChild data-testid="btn-register-event">
                  <a href={event.registration_link} target="_blank" rel="noreferrer">
                    Register Now <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </a>
                </Button>
              </div>
            )}

            {/* Quick links */}
            <div className="border rounded-xl p-5 bg-card">
              <h4 className="font-serif font-bold text-sm mb-3">More Events</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/events">Events Calendar</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/announcements">Announcements</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/news">Latest News</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
