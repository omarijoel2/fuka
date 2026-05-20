import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

interface Intake {
  id: number;
  name: string;
  academic_year: string;
  intake_period: string;
  status: string;
  open_at: string;
  close_at: string;
  application_fee_undergraduate: number;
  application_fee_masters: number;
  application_fee_phd: number;
  allow_kuccps: boolean;
  allow_self_sponsored_ug: boolean;
  allow_masters: boolean;
  allow_phd: boolean;
  notes: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; ring: string }> = {
  open:         { label: "Open",         color: "#15803d", bg: "#dcfce7", ring: "#86efac" },
  closing_soon: { label: "Closing Soon", color: "#b45309", bg: "#fef3c7", ring: "#fcd34d" },
  extended:     { label: "Extended",     color: "#1d4ed8", bg: "#dbeafe", ring: "#93c5fd" },
  scheduled:    { label: "Upcoming",     color: "#6d28d9", bg: "#ede9fe", ring: "#c4b5fd" },
  upcoming:     { label: "Upcoming",     color: "#6d28d9", bg: "#ede9fe", ring: "#c4b5fd" },
  closed:       { label: "Closed",       color: "#6b7280", bg: "#f3f4f6", ring: "#d1d5db" },
  archived:     { label: "Archived",     color: "#6b7280", bg: "#f3f4f6", ring: "#d1d5db" },
};

function formatDate(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

function DaysCountdown({ closeAt }: { closeAt: string }) {
  const diff = Math.ceil((new Date(closeAt).getTime() - Date.now()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return <span className="text-red-600 font-semibold text-xs">Closes today</span>;
  return <span className="text-xs text-muted-foreground">{diff} day{diff !== 1 ? "s" : ""} remaining</span>;
}

export default function AdmissionsCalendar() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    fetch("/api/admissions-app/calendar")
      .then(r => r.json())
      .then(d => setIntakes(d.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const grouped = intakes.reduce<Record<string, Intake[]>>((acc, intake) => {
    const yr = intake.academic_year ?? "Other";
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(intake);
    return acc;
  }, {});

  const hasOpen = intakes.some(i => i.status === "open" || i.status === "closing_soon" || i.status === "extended");

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Intake Calendar — KAFU Admissions"
        description="View the full admissions intake calendar for Kaimosi Friends University. Undergraduate, Masters, and PhD intake windows, deadlines, and fees."
        path="/admissions/calendar"
      />

      {/* Hero */}
      <section
        className="relative py-20 bg-primary text-primary-foreground overflow-hidden"
        style={{ backgroundImage: "url('https://kafu.ac.ke/wp-content/uploads/image-94.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-bold uppercase tracking-widest mb-5">
            <Calendar className="w-3.5 h-3.5" /> Admissions Calendar
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Intake Windows</h1>
          <p className="text-primary-foreground/75 max-w-xl mx-auto text-lg">
            All published intake periods for Kaimosi Friends University. Plan your application early to meet deadlines.
          </p>
          {hasOpen && (
            <div className="mt-8">
              <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent/90 font-bold" data-testid="btn-apply-now-hero">
                <Link href="/admissions/apply">Apply Now <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Fee Schedule */}
      <section className="py-8 bg-secondary/30 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Application Fee Schedule</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Undergraduate / KUCCPS", fee: "KES 1,000" },
              { label: "Masters Degree",         fee: "KES 1,500" },
              { label: "PhD / Doctoral",         fee: "KES 2,000" },
            ].map(({ label, fee }) => (
              <div key={label} className="bg-card rounded-xl border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-xl font-bold text-primary">{fee}</p>
                <p className="text-xs text-muted-foreground mt-1">Non-refundable</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="flex-1 py-14 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">

          {loading && (
            <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading intake calendar...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Could not load intake data. Please try again later or contact the Admissions Office.</p>
            </div>
          )}

          {!loading && !error && intakes.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No intake windows published yet.</p>
              <p className="text-sm mt-2">Please check back soon or contact the Admissions Office.</p>
            </div>
          )}

          {!loading && !error && Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([year, yearIntakes]) => (
            <div key={year} className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                Academic Year {year}
                <span className="h-px flex-1 bg-border" />
              </h2>

              <div className="space-y-5">
                {yearIntakes.map(intake => {
                  const cfg = STATUS_CONFIG[intake.status] ?? STATUS_CONFIG.closed;
                  const isOpen = ["open", "closing_soon", "extended"].includes(intake.status);
                  const pathways: string[] = [];
                  if (intake.allow_kuccps)           pathways.push("KUCCPS");
                  if (intake.allow_self_sponsored_ug) pathways.push("Self-Sponsored UG");
                  if (intake.allow_masters)           pathways.push("Masters");
                  if (intake.allow_phd)               pathways.push("PhD");

                  return (
                    <div
                      key={intake.id}
                      className="rounded-2xl border bg-card overflow-hidden"
                      data-testid={`intake-card-${intake.id}`}
                    >
                      {/* Status bar */}
                      <div className="h-1.5 w-full" style={{ backgroundColor: cfg.color }} />

                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-serif font-bold text-foreground">{intake.name}</h3>
                              <span
                                className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase"
                                style={{ backgroundColor: cfg.bg, color: cfg.color, outline: `1px solid ${cfg.ring}` }}
                              >
                                {cfg.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">{intake.intake_period} Intake · {intake.academic_year}</p>
                          </div>

                          {isOpen && (
                            <Button asChild size="sm" data-testid={`btn-apply-${intake.id}`}>
                              <Link href="/admissions/apply">Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
                            </Button>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Opens</p>
                            <p className="text-sm font-semibold text-foreground">{formatDate(intake.open_at)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Closes</p>
                            <p className="text-sm font-semibold text-foreground">{formatDate(intake.close_at)}</p>
                            {isOpen && <DaysCountdown closeAt={intake.close_at} />}
                          </div>
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <p className="text-xs text-muted-foreground mb-0.5">Application Fee (UG)</p>
                            <p className="text-sm font-semibold text-foreground">KES {Number(intake.application_fee_undergraduate).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Pathways */}
                        {pathways.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Open Pathways</p>
                            <div className="flex flex-wrap gap-2">
                              {pathways.map(p => (
                                <span key={p} className="text-xs px-2.5 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/20 font-medium">{p}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {intake.notes && (
                          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Note: </span>{intake.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Help block */}
          {!loading && (
            <div className="mt-10 p-6 rounded-2xl border bg-card">
              <h3 className="font-semibold text-foreground mb-2">Need assistance?</h3>
              <p className="text-sm text-muted-foreground mb-4">Contact the Admissions Office for guidance on the right pathway or programme for you.</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="mailto:admissions@kafu.ac.ke" className="text-primary hover:underline font-medium" data-testid="link-email-admissions">admissions@kafu.ac.ke</a>
                <span className="text-muted-foreground">·</span>
                <a href="tel:+254777373633" className="text-primary hover:underline font-medium" data-testid="link-phone-admissions">+254 777 373 633</a>
                <span className="text-muted-foreground">·</span>
                <Link href="/admissions/track" className="text-primary hover:underline font-medium" data-testid="link-track">Track existing application</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
