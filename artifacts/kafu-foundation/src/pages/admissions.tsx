import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAdmissions, useProgrammes } from "@/lib/api-hooks";
import type { AdmissionsPathway } from "@/lib/api-types";
import {
  CheckCircle2,
  GraduationCap,
  Globe,
  Users,
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Download,
  FileText,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const PATHWAY_ICONS: Record<string, React.ReactNode> = {
  undergraduate: <GraduationCap className="w-6 h-6" />,
  postgraduate: <BookOpen className="w-6 h-6" />,
  international: <Globe className="w-6 h-6" />,
  "self-sponsored": <Users className="w-6 h-6" />,
};

const DOC_CATEGORY_ORDER = ["Application Forms", "Fee Structures", "Joining Instructions", "Brochures"];

function daysUntil(dateStr: string): number {
  const now = new Date();
  const deadline = new Date(dateStr);
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PathwaySection({ pathway }: { pathway: AdmissionsPathway }) {
  return (
    <div id={pathway.id} className="scroll-mt-24">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
          {PATHWAY_ICONS[pathway.id] ?? <GraduationCap className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">{pathway.title}</h2>
          <p className="text-accent font-semibold text-sm mt-0.5">{pathway.subtitle}</p>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-8 text-base">{pathway.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Requirements */}
        <div className="bg-secondary/50 border rounded-xl p-6">
          <h3 className="font-serif font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Entry Requirements
          </h3>
          <ul className="space-y-3">
            {pathway.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {i + 1}
                </span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h3 className="font-serif font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            Application Steps
          </h3>
          <ol className="relative border-l-2 border-primary/20 pl-6 space-y-5">
            {pathway.steps.map((step) => (
              <li key={step.step} className="relative">
                <span className="absolute -left-[1.65rem] top-0.5 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  {step.step}
                </span>
                <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          asChild
          data-testid={`btn-apply-${pathway.id}`}
        >
          {pathway.cta_external ? (
            <a href={pathway.cta_url} target="_blank" rel="noreferrer">
              {pathway.cta_label} <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          ) : (
            <Link href={pathway.cta_url}>{pathway.cta_label}</Link>
          )}
        </Button>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild data-testid={`btn-programmes-${pathway.id}`}>
          <Link href="/programmes">Browse Programmes <ChevronRight className="ml-1 w-4 h-4" /></Link>
        </Button>
      </div>
    </div>
  );
}

export default function Admissions() {
  const { data, isLoading } = useAdmissions();
  const { data: programmes } = useProgrammes();
  const [activePathway, setActivePathway] = React.useState<string>("undergraduate");
  const [activeDocCategory, setActiveDocCategory] = React.useState<string>("Application Forms");

  const pathways = data?.pathways ?? [];
  const deadlines = data?.deadlines ?? [];
  const documents = data?.documents ?? [];
  const contact = data?.contact;

  const filteredDocs = documents.filter((d) => d.category === activeDocCategory);
  const docCategories = DOC_CATEGORY_ORDER.filter((cat) => documents.some((d) => d.category === cat));

  const activePathwayData = pathways.find((p) => p.id === activePathway);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ─── HERO ─── */}
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #D4A017 0%, transparent 60%)" }}
        />
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-4">
              <Link href="/" className="hover:underline text-primary-foreground/70">Home</Link>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span>Admissions</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-5 leading-tight">
              Join the <span className="text-accent">Spring of Knowledge</span>
            </h1>
            <p className="text-lg text-primary-foreground/85 max-w-2xl leading-relaxed mb-8">
              Everything you need to apply to Kaimosi Friends University — from entry requirements and
              step-by-step guides to application forms and fee structures.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                asChild
                data-testid="hero-btn-apply"
              >
                <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                  Apply Now <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white/50 hover:bg-white/10"
                asChild
                data-testid="hero-btn-kuccps"
              >
                <a href="https://students.kuccps.net/" target="_blank" rel="noreferrer">
                  KUCCPS Portal <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KEY DEADLINES BANNER ─── */}
      {deadlines.length > 0 && (
        <div className="bg-accent/10 border-b border-accent/20 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm font-bold text-foreground uppercase tracking-wider">Key Dates & Deadlines</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {deadlines.map((dl, i) => {
                const days = daysUntil(dl.date);
                const urgent = days <= 30 && days > 0;
                const passed = days <= 0;
                return (
                  <div
                    key={i}
                    className={`flex flex-col p-3 rounded-lg border text-sm ${passed ? "bg-muted border-muted opacity-60" : urgent ? "bg-red-50 border-red-200" : "bg-white border-border"}`}
                    data-testid={`deadline-${i}`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-wide mb-1 ${passed ? "text-muted-foreground" : urgent ? "text-red-600" : "text-accent"}`}>
                      {passed ? "Closed" : urgent ? `${days} days left` : formatDate(dl.date)}
                    </span>
                    <span className="font-semibold text-foreground text-xs leading-snug">{dl.event}</span>
                    {!passed && !urgent && (
                      <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(dl.date)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ── LEFT: Pathway Nav + Sections ── */}
          <div className="lg:col-span-3 space-y-16">

            {/* Pathway Cards / Selector */}
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-6">Choose Your Pathway</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-36 bg-muted rounded-xl animate-pulse" />
                    ))
                  : pathways.map((pathway) => (
                      <button
                        key={pathway.id}
                        onClick={() => {
                          setActivePathway(pathway.id);
                          document.getElementById(pathway.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`group text-left flex flex-col p-5 rounded-xl border transition-all ${
                          activePathway === pathway.id
                            ? "bg-primary text-primary-foreground border-primary shadow-lg"
                            : "bg-card border-border hover:border-primary hover:shadow-md"
                        }`}
                        data-testid={`pathway-card-${pathway.id}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                            activePathway === pathway.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                          }`}
                        >
                          {PATHWAY_ICONS[pathway.id]}
                        </div>
                        <h3 className={`font-serif font-bold text-base mb-0.5 ${activePathway === pathway.id ? "text-white" : "text-foreground"}`}>
                          {pathway.title}
                        </h3>
                        <p className={`text-xs leading-snug ${activePathway === pathway.id ? "text-white/80" : "text-muted-foreground"}`}>
                          {pathway.subtitle}
                        </p>
                      </button>
                    ))}
              </div>
            </div>

            {/* Individual Pathway Sections */}
            <div className="space-y-16 divide-y divide-border">
              {pathways.map((pathway, i) => (
                <div key={pathway.id} className={i > 0 ? "pt-16" : ""}>
                  <PathwaySection pathway={pathway} />
                </div>
              ))}
            </div>

            {/* ── HOW TO APPLY — Unified Visual Guide ── */}
            <div id="how-to-apply" className="scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">How to Apply — Unified Guide</h2>
              <p className="text-muted-foreground mb-8">Regardless of your pathway, the core application process follows these steps.</p>
              <div className="relative">
                {/* Connecting line */}
                <div className="hidden md:block absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-transparent" />
                <div className="space-y-6">
                  {[
                    { n: "01", title: "Identify Your Programme", body: "Browse the KAFU Programme Catalogue and identify the degree, diploma, or certificate that aligns with your career goals and eligibility." },
                    { n: "02", title: "Confirm Entry Requirements", body: "Cross-check the minimum KCSE grades, subject requirements, and any special prerequisites for your chosen programme." },
                    { n: "03", title: "Choose Your Application Route", body: "Government-sponsored students apply via KUCCPS. All others apply directly through the KAFU Student Portal at portal.kafu.ac.ke." },
                    { n: "04", title: "Gather Required Documents", body: "Prepare certified copies of your academic certificates, national ID, passport photos, and any additional documents required for your pathway." },
                    { n: "05", title: "Submit & Pay Application Fee", body: "Complete your application form online or in person and pay the non-refundable application fee via M-Pesa, bank, or at the Finance Office." },
                    { n: "06", title: "Receive & Accept Offer", body: "Successful applicants will receive an admission letter. Accept your offer, pay the required fees, and report on the designated joining date." },
                  ].map((step, i) => (
                    <div key={i} className="relative flex gap-6 items-start" data-testid={`how-step-${i + 1}`}>
                      <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0 z-10">
                        {step.n}
                      </div>
                      <div className="flex-1 bg-card border rounded-xl p-5 hover:shadow-sm transition-shadow">
                        <h3 className="font-serif font-bold text-base text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild data-testid="unified-btn-apply">
                  <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                    Start Your Application <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild data-testid="unified-btn-programmes">
                  <Link href="/programmes">Browse All Programmes <ChevronRight className="ml-1 w-4 h-4" /></Link>
                </Button>
              </div>
            </div>

            {/* ── DOWNLOAD CENTRE ── */}
            <div id="downloads" className="scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">Download Centre</h2>
              <p className="text-muted-foreground mb-6">Official application forms, fee structures, joining instructions, and brochures.</p>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {docCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveDocCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeDocCategory === cat
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                    data-testid={`doc-tab-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center gap-4 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all"
                      data-testid={`doc-card-${doc.id}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{doc.description}</p>
                        <span className="text-xs text-accent font-medium mt-0.5 block">Version: {doc.version}</span>
                      </div>
                      <a
                        href={doc.file_url}
                        className="shrink-0 w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                        data-testid={`btn-download-${doc.id}`}
                        aria-label={`Download ${doc.title}`}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                Documents marked with # are pending upload. Contact the Admissions Office to request physical copies.
              </p>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">

              {/* Sticky Apply CTA */}
              <div className="bg-accent rounded-xl p-6 text-center" data-testid="sidebar-apply-cta">
                <GraduationCap className="w-10 h-10 mx-auto mb-3 text-accent-foreground opacity-80" />
                <h3 className="font-serif font-bold text-lg text-accent-foreground mb-2">Ready to Apply?</h3>
                <p className="text-sm text-accent-foreground/80 mb-5">
                  Applications for the 2025/2026 academic year are open.
                </p>
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
                  asChild
                  data-testid="sidebar-btn-portal"
                >
                  <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                    Open Student Portal
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 border-primary/30 text-primary bg-white/90 hover:bg-primary/5"
                  asChild
                  data-testid="sidebar-btn-kuccps"
                >
                  <a href="https://students.kuccps.net/" target="_blank" rel="noreferrer">
                    KUCCPS Portal
                  </a>
                </Button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border rounded-xl p-5">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  {[
                    { label: "Undergraduate Admissions", href: "#undergraduate" },
                    { label: "Postgraduate Admissions", href: "#postgraduate" },
                    { label: "International Students", href: "#international" },
                    { label: "Self-Sponsored (Module II)", href: "#self-sponsored" },
                    { label: "How to Apply Guide", href: "#how-to-apply" },
                    { label: "Download Centre", href: "#downloads" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(link.href.replace("#", ""));
                        el?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                      data-testid={`sidebar-link-${link.href.replace("#", "")}`}
                    >
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Admissions Contact */}
              <div className="bg-primary text-primary-foreground rounded-xl p-6">
                <h3 className="font-serif font-bold text-base mb-4">Contact Admissions</h3>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-4 bg-white/20 rounded animate-pulse" />
                    ))}
                  </div>
                ) : contact ? (
                  <div className="space-y-3 text-sm text-primary-foreground/85">
                    <p className="font-medium text-white text-xs">{contact.office}</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 hover:text-accent transition-colors"
                      data-testid="sidebar-admissions-email"
                    >
                      <Mail className="w-4 h-4 shrink-0" /> {contact.email}
                    </a>
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 hover:text-accent transition-colors"
                      data-testid="sidebar-admissions-phone"
                    >
                      <Phone className="w-4 h-4 shrink-0" /> {contact.phone}
                    </a>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{contact.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{contact.hours}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-primary-foreground/80">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> admissions@kafu.ac.ke</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +254 777 373 633</p>
                  </div>
                )}
              </div>

              {/* Programmes Link */}
              <div className="bg-secondary border rounded-xl p-5 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-primary mb-3" />
                <p className="text-sm font-semibold text-foreground mb-3">Not sure which programme to choose?</p>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white" asChild data-testid="sidebar-btn-browse-programmes">
                  <Link href="/programmes">Browse All Programmes <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
