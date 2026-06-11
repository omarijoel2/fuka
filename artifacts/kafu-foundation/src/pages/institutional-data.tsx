import React, { useState } from "react";
import { Link } from "wouter";
import {
  useInstitutionalKpis, useRankings, useInstitutionalReports, useAccreditations,
} from "@/lib/api-hooks";
import {
  ChevronRight, TrendingUp, TrendingDown, Minus, Users, UserCheck, BookOpen,
  GraduationCap, Award, Scale, FileText, Banknote, MapPin, Library, Wallet,
  Trophy, FileDown, ShieldCheck, ExternalLink, Calendar,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { SeoHead } from "@/components/seo-head";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users, "user-check": UserCheck, "book-open": BookOpen,
  "graduation-cap": GraduationCap, award: Award, scale: Scale,
  "file-text": FileText, banknote: Banknote, "map-pin": MapPin,
  library: Library, wallet: Wallet, "trending-up": TrendingUp,
};

const CATEGORY_LABELS: Record<string, string> = {
  overview: "Overview", enrollment: "Students & Enrolment", academic: "Academic",
  research: "Research & Innovation", staff: "Staff", finance: "Finance",
  infrastructure: "Infrastructure & Facilities", community: "Community",
};

const RANK_CATEGORY_LABELS: Record<string, string> = {
  national: "National", regional: "Regional", global: "Global", subject: "By Subject",
};

const REPORT_TYPE_LABELS: Record<string, string> = {
  annual_report: "Annual Report", financial: "Financial", strategic_plan: "Strategic Plan",
  audit: "Audit", factbook: "Fact Book", policy: "Policy",
};

const STATUS_STYLES: Record<string, string> = {
  accredited: "bg-emerald-50 text-emerald-700 border-emerald-200",
  provisional: "bg-amber-50 text-amber-700 border-amber-200",
  candidate: "bg-blue-50 text-blue-700 border-blue-200",
  expired: "bg-red-50 text-red-700 border-red-200",
};

function num(v: number | string | undefined | null): number {
  if (v === undefined || v === null) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}

function TrendBadge({ trend, value }: { trend?: string | null; value?: number | string | null }) {
  if (!trend) return null;
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`} data-testid="kpi-trend">
      <Icon className="w-3.5 h-3.5" />
      {value ? `${num(value)}%` : ""}
    </span>
  );
}

export default function InstitutionalData() {
  const [reportType, setReportType] = useState("");
  const { data: kpis } = useInstitutionalKpis();
  const { data: rankings } = useRankings();
  const { data: reports } = useInstitutionalReports(reportType ? { report_type: reportType } : undefined);
  const { data: accreditations } = useAccreditations();

  const featured = (kpis ?? []).filter((k) => k.is_featured);
  const enrolmentTrend = (kpis ?? []).find((k) => k.slug === "total-students")?.series ?? [];

  const grouped = (kpis ?? []).reduce<Record<string, typeof kpis>>((acc, k) => {
    (acc[k.category] = acc[k.category] ?? []).push(k);
    return acc;
  }, {} as Record<string, NonNullable<typeof kpis>>);

  const reportTypes = Array.from(new Set((reports ?? []).map((r) => r.report_type)));

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Institutional Data & Transparency — Kaimosi Friends University"
        description="Key facts and figures, national and regional rankings, accreditation status, and public reports from Kaimosi Friends University."
        path="/institutional-data"
        breadcrumbs={[{ name: "Institutional Data", path: "/institutional-data" }]}
      />

      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Institutional Data</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-primary-foreground">Facts, Figures &amp; Transparency</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            A clear, public view of Kaimosi Friends University — our scale, performance, rankings, accreditation, and the reports that hold us accountable.
          </p>
        </div>
      </div>

      {/* Featured KPIs */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((k) => {
              const Icon = ICON_MAP[k.icon ?? ""] ?? TrendingUp;
              return (
                <div key={k.id} className="bg-white rounded-xl border border-border p-5" data-testid={`featured-kpi-${k.slug}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <TrendBadge trend={k.trend} value={k.trend_value} />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{k.display_value ?? num(k.value)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{k.label}{k.period_year ? ` · ${k.period_year}` : ""}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enrolment trend chart */}
      {enrolmentTrend.length > 1 && (
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-serif font-bold mb-1">Student Enrolment Growth</h2>
            <p className="text-muted-foreground mb-6">Total enrolment across all campuses and programmes over recent years.</p>
            <div className="bg-white rounded-xl border border-border shadow-sm p-5" data-testid="enrolment-chart">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={enrolmentTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="enrolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A5C38" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1A5C38" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), "Students"]} />
                  <Area type="monotone" dataKey="value" stroke="#1A5C38" strokeWidth={2} fill="url(#enrolGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* KPIs by category */}
      <div className="container mx-auto px-4 py-12 space-y-10">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="text-xl font-serif font-bold mb-4">{CATEGORY_LABELS[cat] ?? cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(items ?? []).map((k) => {
                const Icon = ICON_MAP[k.icon ?? ""] ?? TrendingUp;
                return (
                  <div key={k.id} className="bg-white rounded-xl border border-border p-5 flex gap-4" data-testid={`kpi-${k.slug}`}>
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-foreground">{k.display_value ?? num(k.value)}</p>
                        <TrendBadge trend={k.trend} value={k.trend_value} />
                      </div>
                      <p className="text-sm font-medium text-foreground">{k.label}</p>
                      {k.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{k.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Rankings */}
      {(rankings ?? []).length > 0 && (
        <div className="bg-muted/30 border-y">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-secondary" />
              <h2 className="text-2xl font-serif font-bold">Rankings &amp; Recognition</h2>
            </div>
            <p className="text-muted-foreground mb-6">Our standing in independent national, regional, and global university rankings.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(rankings ?? []).map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-border p-5 flex flex-col" data-testid={`ranking-${r.slug}`}>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded self-start">
                    {RANK_CATEGORY_LABELS[r.category] ?? r.category}
                  </span>
                  <p className="text-2xl font-bold text-foreground mt-3">{r.rank_value ?? `#${r.rank_numeric}`}</p>
                  <p className="text-sm font-medium text-foreground mt-1">{r.organization}</p>
                  <p className="text-xs text-muted-foreground">{r.title}{r.year ? ` · ${r.year}` : ""}</p>
                  {r.source_url && (
                    <a href={r.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3" data-testid={`ranking-source-${r.slug}`}>
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Accreditations */}
      {(accreditations ?? []).length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-serif font-bold">Accreditation &amp; Recognition</h2>
          </div>
          <p className="text-muted-foreground mb-6">Statutory and professional bodies that accredit the university and its programmes.</p>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Body</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Scope</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Valid Until</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(accreditations ?? []).map((a) => (
                  <tr key={a.id} data-testid={`accreditation-${a.slug}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{a.body_name}</p>
                      {a.description && <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">{a.description}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {a.accreditation_type === "programme" ? (a.programme ?? "Programme") : "Institutional"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded border capitalize ${STATUS_STYLES[a.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{a.expiry_date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports */}
      {(reports ?? []).length > 0 && (
        <div className="bg-muted/30 border-t">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-serif font-bold">Public Reports &amp; Documents</h2>
                </div>
                <p className="text-muted-foreground mt-1">Annual reports, strategic plans, financial statements, and policy documents.</p>
              </div>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-report-type">
                <option value="">All Types</option>
                {(reportType ? [reportType, ...reportTypes] : reportTypes).filter((v, i, arr) => arr.indexOf(v) === i).map((t) => (
                  <option key={t} value={t}>{REPORT_TYPE_LABELS[t] ?? t}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(reports ?? []).map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-border p-5 flex flex-col" data-testid={`report-${r.slug}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {REPORT_TYPE_LABELS[r.report_type] ?? r.report_type}
                    </span>
                    {r.year && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{r.year}</span>}
                  </div>
                  <h3 className="font-bold text-base mt-3">{r.title}</h3>
                  {r.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">{r.description}</p>}
                  {r.file_url ? (
                    <a href={r.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-4" data-testid={`report-download-${r.slug}`}>
                      <FileDown className="w-4 h-4" /> Download{r.file_size ? ` (${r.file_size})` : ""}
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground mt-4">Available on request</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
