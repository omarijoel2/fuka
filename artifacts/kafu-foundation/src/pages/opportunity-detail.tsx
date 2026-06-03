import { useParams } from "wouter";
import { Link } from "wouter";
import { useOpportunityDetail, resolveStorageUrl } from "@/lib/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SITE_URL, SeoHead, ORG_JSONLD } from "@/components/seo-head";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileDown,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  FlaskConical,
  Megaphone,
  GraduationCap,
  Bell,
  Info,
  Send,
  ExternalLink,
} from "lucide-react";

function categoryIcon(category: string) {
  switch (category) {
    case "tender": return <FileText className="w-5 h-5" />;
    case "vacancy": return <Briefcase className="w-5 h-5" />;
    case "internship": return <FlaskConical className="w-5 h-5" />;
    case "call": return <Megaphone className="w-5 h-5" />;
    case "notice": return <Bell className="w-5 h-5" />;
    case "scholarship": return <GraduationCap className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "closing-soon") {
    return (
      <Badge variant="destructive" className="gap-1 text-xs" data-testid="detail-badge-closing">
        <AlertTriangle className="w-3 h-3" /> Closing Soon
      </Badge>
    );
  }
  if (status === "open") {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs hover:bg-green-100" data-testid="detail-badge-open">
        Open
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs" data-testid="detail-badge-closed">
      Closed
    </Badge>
  );
}

function getDaysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function OpportunityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: opp, isLoading, isError } = useOpportunityDetail(slug ?? "");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-14 max-w-4xl" data-testid="detail-loading">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-2/3 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-5 w-full" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !opp) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl text-center" data-testid="detail-error">
        <h2 className="text-2xl font-serif font-bold mb-3">Opportunity Not Found</h2>
        <p className="text-muted-foreground mb-8">This opportunity may have been removed or the reference may be incorrect.</p>
        <Link href="/opportunities" data-testid="back-to-opportunities">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back to Opportunities
          </Button>
        </Link>
      </div>
    );
  }

  const daysLeft = getDaysLeft(opp.deadline);
  const isClosed = opp.status === "closed";

  const oppJsonLd = opp.category === "vacancy"
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: opp.title,
        description: opp.description,
        hiringOrganization: ORG_JSONLD,
        jobLocation: {
          "@type": "Place",
          name: "Kaimosi Friends University",
          address: { "@type": "PostalAddress", addressLocality: "Kaimosi", addressCountry: "KE" },
        },
        validThrough: opp.deadline,
        datePosted: opp.publish_date,
        employmentType: "FULL_TIME",
        url: `${SITE_URL}/opportunities/${slug}`,
      }
    : undefined;

  return (
    <>
    <div className="min-h-screen bg-background">
      <SeoHead
        title={opp.title}
        description={opp.description?.slice(0, 160)}
        path={`/opportunities/${slug}`}
        breadcrumbs={[
          { name: "Opportunities", path: "/opportunities" },
          { name: opp.title },
        ]}
        jsonLd={oppJsonLd}
      />
      <div className={`${isClosed ? "bg-muted" : "bg-primary"} ${isClosed ? "text-foreground" : "text-primary-foreground"} py-12`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <nav className="flex items-center gap-2 text-sm mb-6 opacity-80" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline" data-testid="breadcrumb-home">Home</Link>
            <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            <Link href="/opportunities" className="hover:underline" data-testid="breadcrumb-opportunities">Opportunities</Link>
            <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            <span className="opacity-60 truncate max-w-[200px]">{opp.reference}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded ${isClosed ? "bg-muted-foreground/20" : "bg-white/20"}`}>
              {categoryIcon(opp.category)}
            </div>
            <span className={`text-sm font-medium px-2.5 py-0.5 rounded ${isClosed ? "bg-muted-foreground/20" : "bg-white/15"}`}>
              {opp.type}
            </span>
            <StatusBadge status={opp.status} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 leading-tight">{opp.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {opp.department}
            </span>
            <span className="font-mono opacity-60">{opp.reference}</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              Published {formatDate(opp.publish_date)}
            </span>
          </div>
        </div>
      </div>

      {opp.status === "closing-soon" && opp.deadline && (
        <div className="bg-destructive/10 border-b border-destructive/20" data-testid="closing-soon-bar">
          <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-medium">
              This opportunity closes on {formatDate(opp.deadline)}{opp.deadline_time ? ` at ${opp.deadline_time}` : ""}
              {daysLeft !== null && daysLeft > 0 ? ` — ${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining` : " — Today is the deadline"}.
            </p>
          </div>
        </div>
      )}

      {isClosed && (
        <div className="bg-muted border-b" data-testid="closed-bar">
          <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground">This opportunity is now closed. Applications are no longer being accepted.</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="mb-5">
          <Link href="/opportunities" data-testid="back-link">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Opportunities
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section data-testid="section-overview">
              <h2 className="text-xl font-serif font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{opp.description}</p>
            </section>

            {opp.requirements && opp.requirements.length > 0 && (
              <section data-testid="section-requirements">
                <h2 className="text-xl font-serif font-bold mb-4">Requirements / Eligibility</h2>
                <ul className="space-y-2.5">
                  {opp.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section data-testid="section-submission">
              <h2 className="text-xl font-serif font-bold mb-4">How to Apply / Submit</h2>
              <div className="bg-muted/50 border rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{opp.submission_info}</p>
                </div>
              </div>
            </section>

            {opp.documents && opp.documents.length > 0 && (
              <section data-testid="section-documents">
                <h2 className="text-xl font-serif font-bold mb-4">Downloads</h2>
                <div className="space-y-3">
                  {opp.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 border rounded-xl px-5 py-3.5 bg-card hover:border-primary/40 transition-colors" data-testid={`doc-${i}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {doc.type}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" className="gap-1.5" asChild data-testid={`btn-open-${i}`}>
                          <a href={doc.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5" asChild data-testid={`btn-download-${i}`}>
                          <a href={doc.url} download target="_blank" rel="noreferrer">
                            <FileDown className="w-3.5 h-3.5" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-5">
            {opp.deadline && (
              <div className={`rounded-xl border p-5 ${opp.status === "closing-soon" ? "border-destructive/40 bg-destructive/5" : opp.status === "closed" ? "border-border bg-muted/40" : "border-primary/20 bg-primary/5"}`} data-testid="deadline-card">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Deadline
                </h3>
                <p className="text-lg font-bold font-serif mb-1">{formatDate(opp.deadline)}</p>
                {opp.deadline_time && (
                  <p className="text-sm text-muted-foreground mb-2">at {opp.deadline_time} (EAT)</p>
                )}
                {daysLeft !== null && !isClosed && (
                  <p className={`text-sm font-medium ${daysLeft <= 7 ? "text-destructive" : "text-muted-foreground"}`}>
                    {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining` : "Deadline is today"}
                  </p>
                )}
                {isClosed && <p className="text-sm text-muted-foreground">This opportunity has closed.</p>}
              </div>
            )}

            <div className="rounded-xl border p-5 bg-card" data-testid="contact-card">
              <h3 className="font-semibold text-sm mb-4">Contact / Enquiries</h3>
              <div className="space-y-3 text-sm">
                <p className="font-medium text-foreground">{opp.contact.office}</p>
                <a href={`mailto:${opp.contact.email}`} className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors" data-testid="contact-email">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {opp.contact.email}
                </a>
                <a href={`tel:${opp.contact.phone.replace(/\s/g, "")}`} className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors" data-testid="contact-phone">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {opp.contact.phone}
                </a>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {opp.contact.location}
                </p>
              </div>
            </div>

            {!isClosed && opp.status !== "notice" && opp.documents && opp.documents.length > 0 && (
              <div className="rounded-xl border bg-card p-5" data-testid="action-card">
                <h3 className="font-semibold text-sm mb-3">Get Started</h3>
                <Button className="w-full gap-2" asChild data-testid="btn-download-main">
                  <a href={resolveStorageUrl(opp.documents[0].url)} download>
                    <FileDown className="w-4 h-4" />
                    Download {opp.category === "vacancy" ? "Job Description" : opp.category === "tender" ? "Tender Document" : "Application Form"}
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-2.5 text-center">
                  {opp.documents[0].type} &middot; {opp.documents[0].size}
                </p>
              </div>
            )}

            <div className="rounded-xl border p-4 bg-card text-sm text-muted-foreground" data-testid="meta-card">
              <dl className="space-y-1.5">
                <div className="flex justify-between">
                  <dt>Reference</dt>
                  <dd className="font-mono font-medium text-foreground text-xs">{opp.reference}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Category</dt>
                  <dd className="capitalize font-medium text-foreground">{opp.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Published</dt>
                  <dd>{formatDate(opp.publish_date)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}
