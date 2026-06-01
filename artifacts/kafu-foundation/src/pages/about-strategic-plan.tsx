import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { ChevronRight, Target, TrendingUp, Users, Building2, ShieldCheck, Download, ArrowLeft } from "lucide-react";

const FALLBACK_PILLARS = [
  {
    id: 1,
    icon: Target,
    colour: "#1A5C38",
    title: "Academic Excellence & Innovation",
    objectives: [
      "Develop 10 new market-responsive academic programmes by 2026",
      "Achieve 80% graduate employment rate within 12 months of graduation",
      "Attain Commission for University Education (CUE) top-tier rating",
      "Enhance student experience through digital learning integration",
    ],
    kpis: ["10 new programmes (2023–2028)", "80% pass rate across all schools", "90% graduate employment", "4.0/5.0 student satisfaction score"],
  },
  {
    id: 2,
    icon: TrendingUp,
    colour: "#C9A227",
    title: "Research & Knowledge Creation",
    objectives: [
      "Increase peer-reviewed publications to 50 per year by 2026",
      "Establish 3 new research centres aligned to national priorities",
      "Attract KES 50 million in research grants over the plan period",
      "Strengthen postgraduate research supervision capacity",
    ],
    kpis: ["50 publications/year", "3 new research centres", "KES 50M in research grants", "100 active postgraduate researchers"],
  },
  {
    id: 3,
    icon: Users,
    colour: "#1B3A6B",
    title: "Community Engagement & Partnerships",
    objectives: [
      "Sign 20 new industry partnership agreements by 2026",
      "Scale community outreach to 10 counties in Western Kenya",
      "Establish 5 new international academic partnerships",
      "Launch KAFU Alumni Association and mentorship programme",
    ],
    kpis: ["20 industry MoUs signed", "10 counties reached", "5 international partners", "2,000 alumni network members"],
  },
  {
    id: 4,
    icon: Building2,
    colour: "#2D6A4F",
    title: "Infrastructure & Resource Development",
    objectives: [
      "Achieve 100% fibre-optic campus connectivity by 2025",
      "Construct a 500-bed student centre and modern lecture halls",
      "Expand library holdings to 100,000 volumes with digital access",
      "Upgrade laboratory and clinical simulation facilities",
    ],
    kpis: ["100% fibre connectivity", "500-bed student centre complete", "100,000 library volumes", "10 upgraded labs"],
  },
  {
    id: 5,
    icon: ShieldCheck,
    colour: "#8B1A1A",
    title: "Institutional Governance & Leadership",
    objectives: [
      "Maintain unqualified annual audit opinion throughout the plan period",
      "Achieve 50% self-generated revenue by 2028",
      "Implement ISO 9001:2015 quality management certification",
      "Digitise all administrative and academic processes",
    ],
    kpis: ["Unqualified audit (5 years)", "50% self-generated revenue", "ISO 9001 certification by 2026", "100% digital HR/Finance"],
  },
];

const FALLBACK_MILESTONES = [
  { year: "2023", label: "Plan launch & baseline assessment" },
  { year: "2024", label: "New programmes approved, 2 research centres opened" },
  { year: "2025", label: "100% campus connectivity, ISO pre-assessment" },
  { year: "2026", label: "Mid-term review & course corrections" },
  { year: "2027", label: "75% KPI achievement target" },
  { year: "2028", label: "Final evaluation & new plan development" },
];

export default function StrategicPlan() {
  const [active, setActive] = useState<number | null>(null);

  const { data: pageData } = useQuery({
    queryKey: ["page", "about-strategic-plan"],
    queryFn: () => fetch("/api/pages/about-strategic-plan").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const PILLARS = (() => {
    const dbPillars = sd.pillars as Array<Omit<(typeof FALLBACK_PILLARS)[0], "icon">> | undefined;
    if (!dbPillars?.length) return FALLBACK_PILLARS;
    return dbPillars.map((p, i) => ({ ...FALLBACK_PILLARS[i], ...p }));
  })();
  const MILESTONES = (sd.milestones as typeof FALLBACK_MILESTONES) ?? FALLBACK_MILESTONES;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Strategic Plan 2023–2028 — KAFU"
        description="KAFU's Strategic Plan 2023–2028: Transforming Lives Through Knowledge. Five strategic pillars guiding the university's development over five years."
        path="/about/strategic-plan"
      />

      {/* Hero */}
      <section
        className="relative py-24 bg-primary text-primary-foreground overflow-hidden"
        style={{ backgroundImage: "url(/imgs/aerial-1.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative container mx-auto px-4">
          <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground mb-6 -ml-2" asChild>
            <Link href="/about"><ArrowLeft className="w-4 h-4 mr-1" /> Back to About</Link>
          </Button>
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Governance & Strategy</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 max-w-3xl">
            Strategic Plan 2023–2028
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mb-8">
            Transforming Lives Through Knowledge — five strategic pillars guiding Kaimosi Friends University into a new era of excellence, research, and community impact.
          </p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild data-testid="button-download-sp">
            <a href="/documents/kafu-strategic-plan-2023-2028.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" /> Download Full Document (PDF)
            </a>
          </Button>
        </div>
      </section>

      {/* Mission & Vision row */}
      <section className="py-12 bg-secondary/30 border-b">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { label: "Vision", text: "A premier African university committed to academic excellence, research, and community transformation." },
            { label: "Mission", text: "To provide quality university education, conduct research, and engage with community to transform lives through knowledge." },
            { label: "Core Values", text: "Integrity · Excellence · Innovation · Service · Inclusivity · Stewardship" },
          ].map(({ label, text }) => (
            <div key={label} className="p-6 rounded-xl bg-card border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">{label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">Five Strategic Pillars</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Click each pillar to view its objectives and key performance indicators.</p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              const open = active === p.id;
              return (
                <div key={p.id} className="rounded-xl border bg-card overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-6 text-left hover:bg-muted/40 transition-colors"
                    onClick={() => setActive(open ? null : p.id)}
                    data-testid={`pillar-toggle-${p.id}`}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: p.colour + "22" }}>
                      <Icon className="w-5 h-5" style={{ color: p.colour }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pillar {p.id}</span>
                      <h3 className="font-serif text-lg font-bold text-foreground">{p.title}</h3>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-90" : ""}`} />
                  </button>
                  {open && (
                    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Strategic Objectives</h4>
                        <ul className="space-y-2">
                          {p.objectives.map((obj, i) => (
                            <li key={i} className="flex gap-2 text-sm text-foreground">
                              <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Key Performance Indicators</h4>
                        <ul className="space-y-2">
                          {p.kpis.map((kpi, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                              {kpi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Implementation Milestones</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-foreground/20" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`flex gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`} data-testid={`milestone-${m.year}`}>
                  <div className="md:w-1/2 flex md:justify-end pl-10 md:pl-0">
                    <div className={`p-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 max-w-xs ${i % 2 !== 0 ? "md:ml-auto" : ""}`}>
                      <span className="text-accent font-bold text-sm block mb-1">{m.year}</span>
                      <p className="text-sm text-primary-foreground/85">{m.label}</p>
                    </div>
                  </div>
                  <div className="absolute left-1 md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0 mt-3">
                    <span className="text-accent-foreground text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-xl font-bold text-primary mb-6">Related Governance Documents</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" asChild><Link href="/about/policies">Policies & Regulations</Link></Button>
            <Button variant="outline" asChild><Link href="/about/service-charter">Service Charter</Link></Button>
            <Button variant="outline" asChild><Link href="/about/council">University Council</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
