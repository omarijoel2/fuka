import { Link, useParams } from "wouter";
import { useAnnouncementDetail } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, Tag, ChevronRight, ArrowLeft, AlertTriangle, Bell, Download, ArrowRight } from "lucide-react";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function AnnouncementDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data: announcement, isLoading, isError } = useAnnouncementDetail(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-10 bg-muted rounded w-3/4" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-4 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !announcement) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Announcement Not Found</h1>
        <p className="text-muted-foreground mb-6">The announcement you're looking for could not be found.</p>
        <Button asChild><Link href="/announcements">All Announcements</Link></Button>
      </div>
    );
  }

  const isUrgent = announcement.priority === "urgent";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-secondary/30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/announcements" className="hover:text-primary transition-colors">Announcements</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-foreground font-medium line-clamp-1 max-w-xs">{announcement.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main content */}
          <div className="lg:col-span-8">
            {/* Priority badge + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {isUrgent ? (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Urgent Notice
                </span>
              ) : (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" /> Notice
                </span>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(announcement.publish_date)}
              </span>
            </div>

            <h1 className={`text-3xl md:text-4xl font-serif font-bold mb-6 leading-snug ${isUrgent ? "text-red-900" : "text-foreground"}`}>
              {announcement.title}
            </h1>

            {/* Issuing department */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-secondary/50 border rounded-xl">
              <Building2 className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Issuing Office</p>
                <p className="text-sm font-semibold text-foreground">{announcement.department}</p>
              </div>
            </div>

            {/* Summary callout */}
            <div className={`p-4 rounded-xl border-l-4 mb-8 ${isUrgent ? "bg-red-50 border-red-500 text-red-800" : "bg-primary/5 border-primary text-foreground"}`}>
              <p className="text-sm leading-relaxed font-medium">{announcement.summary}</p>
            </div>

            {/* Full content */}
            <div
              className="prose max-w-none text-foreground [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:text-muted-foreground [&_li]:mb-2 [&_strong]:text-foreground [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />

            {/* Attachments */}
            {announcement.attachments?.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-serif font-bold text-base mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" /> Attachments
                </h3>
                <div className="space-y-2">
                  {announcement.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                      data-testid={`attachment-${i}`}
                    >
                      <Download className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{att.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{att.type}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {announcement.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {announcement.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button variant="outline" asChild data-testid="btn-back-to-announcements">
                <Link href="/announcements">
                  <ArrowLeft className="w-4 h-4 mr-2" /> All Announcements
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <h4 className="font-serif font-bold text-base mb-1">Published By</h4>
              <p className="text-accent font-semibold mb-3">{announcement.department}</p>
              <div className="border-t border-white/20 pt-3 mt-3">
                <p className="text-xs text-primary-foreground/70 uppercase tracking-wider mb-1">Date Issued</p>
                <p className="text-sm font-medium">{formatDate(announcement.publish_date)}</p>
              </div>
              {isUrgent && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-100 leading-relaxed">
                    This is an urgent notice. Please read carefully and take necessary action before the stated deadline.
                  </p>
                </div>
              )}
            </div>

            <div className="border rounded-xl p-5 bg-card">
              <h4 className="font-serif font-bold text-sm mb-3">Related Channels</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/announcements"><ArrowRight className="w-4 h-4 mr-2" /> All Announcements</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/news"><ArrowRight className="w-4 h-4 mr-2" /> University News</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/events"><ArrowRight className="w-4 h-4 mr-2" /> Events Calendar</Link>
                </Button>
                <Button className="w-full text-sm" asChild>
                  <a href="mailto:info@kafu.ac.ke">Contact Us</a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
