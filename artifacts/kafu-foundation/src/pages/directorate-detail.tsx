import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Mail, Phone, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface QuickLink {
  label: string;
  url: string;
  external?: boolean;
}

interface Directorate {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  director_name: string | null;
  director_title: string | null;
  director_photo_url: string | null;
  director_bio: string | null;
  director_email: string | null;
  director_phone: string | null;
  functions: string[] | null;
  services: string[] | null;
  quick_links: QuickLink[] | null;
}

interface DirectorateListItem {
  id: number;
  name: string;
  slug: string;
}

export default function DirectorateDetail({ slug }: { slug: string }) {
  const { data: apiData, isLoading, isError } = useQuery<{ data: Directorate }>({
    queryKey: ["directorate", slug],
    queryFn: () => fetch(`/api/directorates/${slug}`).then(r => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
  });

  const { data: listData } = useQuery<{ data: DirectorateListItem[] }>({
    queryKey: ["directorates-list"],
    queryFn: () => fetch("/api/directorates").then(r => r.json()),
  });

  const d = apiData?.data;
  const siblings = listData?.data?.filter(i => i.slug !== slug) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading directorate information...</div>
      </div>
    );
  }

  if (isError || !d) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-primary">Directorate Not Found</h2>
        <p className="text-muted-foreground">The directorate you are looking for could not be found.</p>
        <Link href="/directorates" data-testid="back-to-directorates">
          <span className="inline-flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Directorates
          </span>
        </Link>
      </div>
    );
  }

  const initials = d.director_name
    ? d.director_name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("")
    : "D";

  return (
    <>
      <Helmet>
        <title>{d.name} — KAFU</title>
        <meta name="description" content={d.tagline ?? d.description ?? `Learn about the ${d.name} at Kaimosi Friends University.`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b border-border py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" data-testid="breadcrumb-home"><span className="hover:text-primary transition-colors cursor-pointer">Home</span></Link>
          <span>/</span>
          <Link href="/directorates" data-testid="breadcrumb-directorates"><span className="hover:text-primary transition-colors cursor-pointer">Directorates</span></Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{d.name}</span>
        </div>
      </div>

      {/* Hero */}
      <PageHero
        eyebrow="Directorate"
        title={d.name}
        subtitle={d.tagline ?? undefined}
        photo="https://kafu.ac.ke/wp-content/uploads/2026/02/image-8-1.jpeg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Directorates", href: "/directorates" },
          { label: d.name },
        ]}
      />

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            {d.description && (
              <section>
                <h2 className="font-serif text-xl font-bold text-primary mb-4">About This Directorate</h2>
                <p className="text-muted-foreground leading-relaxed">{d.description}</p>
              </section>
            )}

            {/* Director profile */}
            {d.director_name && (
              <section className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary/5 px-6 py-5 flex items-center gap-2 border-b border-border">
                  <h2 className="font-serif text-lg font-bold text-primary">Director's Profile</h2>
                </div>
                <div className="p-6 flex gap-5 flex-col sm:flex-row">
                  {d.director_photo_url ? (
                    <img src={d.director_photo_url} alt={d.director_name}
                      className="w-20 h-20 rounded-full object-cover object-top border-4 border-white shadow-md shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center shrink-0">
                      <span className="text-xl font-bold text-primary font-serif">{initials}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">{d.director_name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{d.director_title}</p>
                    {d.director_bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.director_bio}</p>
                    )}
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      {d.director_email && (
                        <a href={`mailto:${d.director_email}`} data-testid="director-email-link"
                          className="flex items-center gap-2 hover:text-primary transition-colors">
                          <Mail className="w-4 h-4" />{d.director_email}
                        </a>
                      )}
                      {d.director_phone && (
                        <a href={`tel:${d.director_phone}`} data-testid="director-phone-link"
                          className="flex items-center gap-2 hover:text-primary transition-colors">
                          <Phone className="w-4 h-4" />{d.director_phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Functions */}
            {d.functions && d.functions.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-primary mb-5">Core Functions</h2>
                <div className="space-y-2.5">
                  {d.functions.map((fn, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{fn}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {d.services && d.services.length > 0 && (
              <section className="bg-primary/5 rounded-xl border border-border p-6">
                <h2 className="font-serif text-xl font-bold text-primary mb-5">Services Offered</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {d.services.map((svc, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick links */}
            {d.quick_links && d.quick_links.length > 0 && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary px-4 py-3">
                  <h3 className="text-sm font-bold text-primary-foreground">Quick Links</h3>
                </div>
                <div className="divide-y divide-border">
                  {d.quick_links.map((link, i) => (
                    link.external ? (
                      <a key={i} href={link.url} target="_blank" rel="noreferrer"
                        data-testid={`quick-link-${i}`}
                        className="flex items-center justify-between px-4 py-3 text-sm text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors group">
                        {link.label}
                        <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                      </a>
                    ) : (
                      <Link key={i} href={link.url} data-testid={`quick-link-${i}`}>
                        <span className="flex items-center justify-between px-4 py-3 text-sm text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Contact card */}
            {(d.director_email || d.director_phone) && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-accent/10 px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">Contact</h3>
                </div>
                <div className="p-4 space-y-3">
                  {d.director_email && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <a href={`mailto:${d.director_email}`} data-testid="sidebar-email"
                        className="text-sm text-primary hover:underline break-all">{d.director_email}</a>
                    </div>
                  )}
                  {d.director_phone && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                      <a href={`tel:${d.director_phone}`} data-testid="sidebar-phone"
                        className="text-sm text-foreground hover:text-primary">{d.director_phone}</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other directorates */}
            {siblings.length > 0 && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/40 px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">Other Directorates</h3>
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {siblings.map(s => (
                    <Link key={s.id} href={`/directorates/${s.slug}`} data-testid={`sibling-${s.slug}`}>
                      <span className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors cursor-pointer">
                        {s.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <Link href="/directorates" data-testid="back-to-list">
              <span className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                <ArrowLeft className="w-4 h-4" /> All Directorates
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
