import { Users, Library, Activity, HeartHandshake, ShieldCheck, Laptop, LucideIcon, ExternalLink, Lock, Globe, BookOpen, Stethoscope, Briefcase, GraduationCap, CreditCard, FileText, Wifi, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import { useQuery } from "@tanstack/react-query";

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface StudentServicesData {
  hero_heading?: string;
  hero_description?: string;
  intro_text?: string;
  services?: Service[];
  digital_title?: string;
  digital_description?: string;
  portal_url?: string;
  elearning_url?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Activity, Library, ShieldCheck, HeartHandshake, Users, Laptop,
};

const DEFAULT_SERVICES: Service[] = [
  { icon: "Activity",       title: "Games & Sports",       description: "Football, basketball, athletics, and indoor games. We actively participate in regional university leagues." },
  { icon: "Library",        title: "University Library",   description: "Extensive physical collections and access to thousands of e-journals and academic databases for research." },
  { icon: "ShieldCheck",    title: "Accommodation",        description: "Secure, affordable on-campus hostels. Off-campus private hostels around Kaimosi are also vetted by our accommodation office." },
  { icon: "HeartHandshake", title: "Counselling Services", description: "Professional, confidential psychological support and mentorship to help students navigate academic stress and personal challenges." },
  { icon: "Users",          title: "Student Government",   description: "The KAFU Students Organization advocates for student welfare, organizes cultural events, and provides leadership development." },
];

const DEFAULTS = {
  hero_heading:        "Student Life & Services",
  hero_description:    "We are committed to providing a holistic university experience that nurtures the mind, body, and spirit.",
  intro_text:          "At Kaimosi Friends University, learning goes beyond the classroom. We have continuously developed support systems to ensure our students thrive academically and personally.",
  services:            DEFAULT_SERVICES,
  digital_title:       "Digital Services",
  digital_description: "Access your timetables, exam results, and online classes through our centralized portals.",
  portal_url:          "https://portal.kafu.ac.ke",
  elearning_url:       "https://elearning.kafu.ac.ke",
};

// ── ERP / Digital Ecosystem Integration Map ────────────────────────────────
const PORTAL_SYSTEMS = [
  {
    group: "Academic Portals",
    colour: "#1A5C38",
    systems: [
      { name: "Student Portal", desc: "Results, transcripts, timetables, course registration", url: "https://portal.kafu.ac.ke", icon: GraduationCap, sso: true, status: "live" },
      { name: "E-Learning (LMS)", desc: "Online classes, assignments, digital course content", url: "https://elearning.kafu.ac.ke", icon: BookOpen, sso: true, status: "live" },
      { name: "Library Portal", desc: "e-Resources, digital catalogue, JSTOR, research databases", url: "https://library.kafu.ac.ke", icon: Library, sso: false, status: "live" },
      { name: "Institutional Repository", desc: "Theses, dissertations, research papers, publications", url: "/repository", icon: FileText, sso: false, status: "live", internal: true },
    ],
  },
  {
    group: "Finance & Fees",
    colour: "#C9A227",
    systems: [
      { name: "Fee Payment Portal", desc: "Pay fees via M-Pesa, bank transfer, or card", url: "https://portal.kafu.ac.ke/fees", icon: CreditCard, sso: true, status: "live" },
      { name: "Bursary & Scholarship", desc: "Apply for bursaries, HELB linking, scholarship forms", url: "https://portal.kafu.ac.ke/bursary", icon: Briefcase, sso: true, status: "live" },
      { name: "HELB Portal", desc: "Kenya Higher Education Loans Board — applications and repayments", url: "https://www.helb.co.ke", icon: CreditCard, sso: false, status: "external" },
    ],
  },
  {
    group: "Health & Welfare",
    colour: "#1B3A6B",
    systems: [
      { name: "Health Services", desc: "KAFU Clinic appointments, medical records, referrals", url: "https://portal.kafu.ac.ke/health", icon: Stethoscope, sso: true, status: "live" },
      { name: "NHIF Linking", desc: "Link your NHIF card for subsidized campus health cover", url: "https://www.nhif.or.ke", icon: ShieldCheck, sso: false, status: "external" },
      { name: "Counselling Services", desc: "Online appointment booking for mental health support", url: "https://portal.kafu.ac.ke/counselling", icon: HeartHandshake, sso: true, status: "coming-soon" },
    ],
  },
  {
    group: "Career & Alumni",
    colour: "#2D6A4F",
    systems: [
      { name: "Career Services", desc: "Job board, internship listings, CV builder, career fairs", url: "https://portal.kafu.ac.ke/careers", icon: Briefcase, sso: true, status: "live" },
      { name: "Alumni Network", desc: "Stay connected with the KAFU alumni community", url: "https://alumni.kafu.ac.ke", icon: Users, sso: false, status: "coming-soon" },
    ],
  },
  {
    group: "ICT & Connectivity",
    colour: "#8B1A1A",
    systems: [
      { name: "KAFU Email (Google Workspace)", desc: "Official @kafu.ac.ke email and collaboration suite", url: "https://mail.google.com", icon: Globe, sso: true, status: "live" },
      { name: "Campus WiFi Self-Provisioning", desc: "Register your device for campus wireless access", url: "https://portal.kafu.ac.ke/wifi", icon: Wifi, sso: true, status: "live" },
      { name: "ICT Helpdesk", desc: "Log support tickets, track ICT issues", url: "https://portal.kafu.ac.ke/helpdesk", icon: Phone, sso: false, status: "live" },
    ],
  },
];

const STATUS_BADGE: Record<string, { label: string; colour: string; bg: string }> = {
  live:         { label: "Live",         colour: "#1A5C38", bg: "#dcfce7" },
  "coming-soon":{ label: "Coming Soon",  colour: "#8B5A00", bg: "#fef9c3" },
  external:     { label: "External",     colour: "#555",    bg: "#f3f4f6" },
};

export default function StudentServices() {
  const { data: apiData } = useQuery<{ data: StudentServicesData }>({
    queryKey: ["student-services-content"],
    queryFn: () => fetch("/api/student-services").then(r => r.json()),
    staleTime: 1000 * 60 * 10,
  });

  const d = { ...DEFAULTS, ...(apiData?.data ?? {}) };
  const services = (d.services && d.services.length > 0) ? d.services : DEFAULT_SERVICES;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Student Services & Digital Hub — KAFU"
        description="KAFU student support services, digital portals, ERP integrations — academic registry, library, health services, counselling, accommodation, career services, and more."
        path="/student-services"
        breadcrumbs={[{ name: "Student Services", path: "/student-services" }]}
      />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">{d.hero_heading}</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">{d.hero_description}</p>
        </div>
      </div>

      {/* Campus Services */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-3">Campus Support Services</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">{d.intro_text}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Activity;
            return (
              <div key={i} className="bg-card p-7 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            );
          })}

          <div className="bg-primary p-7 border rounded-xl shadow-sm text-primary-foreground">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
              <Laptop className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold font-serif mb-2">{d.digital_title}</h3>
            <p className="text-primary-foreground/80 text-sm mb-5">{d.digital_description}</p>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90" asChild data-testid="btn-ss-portal">
                <a href={d.portal_url} target="_blank" rel="noreferrer">Student Portal</a>
              </Button>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/10" asChild data-testid="btn-ss-elearning">
                <a href={d.elearning_url} target="_blank" rel="noreferrer">E-Learning System</a>
              </Button>
            </div>
          </div>
        </div>

        {/* ── ERP Digital Ecosystem ── */}
        <div className="border-t pt-16">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-2">Digital Ecosystem</span>
            <h2 className="text-3xl font-serif font-bold text-primary mb-3">Integrated Digital Services Hub</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              All KAFU digital systems in one place. Single sign-on (SSO) enabled systems marked with a lock icon allow you to log in once using your KAFU credentials.
            </p>
          </div>

          {/* SSO Key */}
          <div className="flex flex-wrap gap-4 justify-center mb-10 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-primary" /> SSO-enabled — log in with your KAFU account</span>
            <span className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /> External service (separate login)</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">Live</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Coming Soon</span>
          </div>

          <div className="space-y-10 max-w-5xl mx-auto">
            {PORTAL_SYSTEMS.map(group => (
              <div key={group.group} data-testid={`erp-group-${group.group.replace(/\s/g, "-").toLowerCase()}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-0.5 w-6 rounded" style={{ backgroundColor: group.colour }} />
                  <h3 className="font-semibold text-sm uppercase tracking-widest" style={{ color: group.colour }}>{group.group}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.systems.map(sys => {
                    const Icon = sys.icon;
                    const badge = STATUS_BADGE[sys.status] ?? STATUS_BADGE.live;
                    const isExternal = !sys.internal && (sys.url.startsWith("http") || sys.status === "external");
                    const isComingSoon = sys.status === "coming-soon";
                    return (
                      <div
                        key={sys.name}
                        className={`rounded-xl border bg-card p-5 flex flex-col gap-3 transition-all ${isComingSoon ? "opacity-60" : "hover:shadow-md hover:border-primary/20"}`}
                        data-testid={`erp-system-${sys.name.replace(/\s/g, "-").toLowerCase()}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: group.colour + "18" }}>
                            <Icon className="w-4.5 h-4.5" style={{ color: group.colour, width: "1.125rem", height: "1.125rem" }} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            {sys.sso && <Lock className="w-3.5 h-3.5 text-primary" title="SSO Enabled" />}
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.colour }}>
                              {badge.label}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground mb-1">{sys.name}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{sys.desc}</p>
                        </div>
                        {!isComingSoon && (
                          <a
                            href={sys.url}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-auto"
                            data-testid={`erp-link-${sys.name.replace(/\s/g, "-").toLowerCase()}`}
                          >
                            {isExternal ? "Open" : "Go"} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {isComingSoon && (
                          <p className="text-xs text-muted-foreground mt-auto">Available soon</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ERP note */}
          <div className="mt-14 p-6 rounded-2xl bg-secondary/40 border max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-3">
              All KAFU digital systems use centralized identity management. Staff and students log in once with their <strong className="text-foreground">@kafu.ac.ke</strong> credentials.
              System access is role-based and managed by the ICT Directorate.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" size="sm" asChild><a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer" data-testid="btn-portal-main">Access Student Portal</a></Button>
              <Button variant="outline" size="sm" asChild><a href="/directorates/ict" data-testid="btn-ict-directorate">ICT Directorate</a></Button>
              <Button variant="outline" size="sm" asChild><a href="/contact" data-testid="btn-ict-contact">ICT Helpdesk</a></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
