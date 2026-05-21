import React, { useState, useMemo } from "react";
import { SeoHead } from "@/components/seo-head";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Archive, FileText, Newspaper, Users, Bell, Search, Download, ExternalLink, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface ArchiveRecord {
  id: string;
  type: "notice" | "newsletter" | "leadership" | "announcement" | "circular";
  title: string;
  date: string;
  year: number;
  description: string;
  file_url?: string;
}

const RECORDS: ArchiveRecord[] = [
  { id: "a001", type: "newsletter", title: "The KAFU Chronicle — Issue 12 (Jan–Mar 2025)", date: "2025-03-31", year: 2025, description: "Quarterly newsletter covering academic achievements, research highlights, staff news, and community activities for Q1 2025.", file_url: "#" },
  { id: "a002", type: "newsletter", title: "The KAFU Chronicle — Issue 11 (Oct–Dec 2024)", date: "2024-12-31", year: 2024, description: "Year-end edition featuring graduation highlights, 2024 research output summary, and alumni spotlight.", file_url: "#" },
  { id: "a003", type: "notice", title: "Academic Calendar 2024/2025 (Revised)", date: "2024-09-02", year: 2024, description: "Revised academic calendar for 2024/2025 incorporating semester dates, examination periods, and public holidays.", file_url: "#" },
  { id: "a004", type: "notice", title: "COVID-19 Campus Return Guidelines (Final)", date: "2023-03-15", year: 2023, description: "Final guidelines for return to full in-person learning following the COVID-19 transitional period. Superseded by normal operations notice.", file_url: "#" },
  { id: "a005", type: "leadership", title: "Inaugural Vice Chancellor — Prof. Peter Mwita Appointed", date: "2022-01-10", year: 2022, description: "Gazette notice and official announcement of the appointment of Prof. Peter Mwita as the inaugural substantive Vice Chancellor of Kaimosi Friends University.", file_url: "#" },
  { id: "a006", type: "leadership", title: "Council Chairperson — Prof. Onyango Kwer Re-appointed", date: "2023-06-30", year: 2023, description: "Government Gazette notice of the re-appointment of Prof. Onyango Kwer as Chairman of the University Council for a second term.", file_url: "#" },
  { id: "a007", type: "circular", title: "Staff Welfare — Medical Insurance Scheme 2024", date: "2024-01-08", year: 2024, description: "Circular to all staff regarding the 2024 group medical insurance cover, dependants' enrollment, and claims procedures.", file_url: "#" },
  { id: "a008", type: "notice", title: "KAFU Charter — University Status Gazette Notice", date: "2014-05-12", year: 2014, description: "Original Kenya Gazette notice conferring full university status to Kaimosi Friends University under the Universities Act, 2012.", file_url: "#" },
  { id: "a009", type: "newsletter", title: "The KAFU Chronicle — Issue 10 (Jul–Sep 2024)", date: "2024-09-30", year: 2024, description: "Features mid-year enrolment statistics, the launch of the Health Sciences School, and international partnership news.", file_url: "#" },
  { id: "a010", type: "announcement", title: "Commission for University Education (CUE) Accreditation — 2023 Renewal", date: "2023-11-20", year: 2023, description: "Official notification from CUE confirming accreditation renewal for all five schools and 38 programmes for the period 2023–2026.", file_url: "#" },
  { id: "a011", type: "circular", title: "Revised Staff Performance Appraisal Tool (2023)", date: "2023-04-01", year: 2023, description: "Circular from the Deputy Vice Chancellor (Administration) on the revised annual performance appraisal tool aligned to the KAFU Strategic Plan 2023–2028.", file_url: "#" },
  { id: "a012", type: "leadership", title: "Dean, School of Business and Economics — Dr. Atieno Omondi Appointed", date: "2023-08-14", year: 2023, description: "Official communication on the appointment of Dr. Atieno Margaret Omondi as Dean of the School of Business and Economics.", file_url: "#" },
  { id: "a013", type: "notice", title: "Academic Calendar 2023/2024", date: "2023-08-01", year: 2023, description: "Full academic calendar for the 2023/2024 academic year including commencement dates, recess periods, and examination timetables.", file_url: "#" },
  { id: "a014", type: "announcement", title: "KAFU Achieves ISO Pre-Assessment Milestone", date: "2024-06-15", year: 2024, description: "Management memo on the successful completion of the ISO 9001:2015 pre-assessment, positioning KAFU for full certification in 2025.", file_url: "#" },
  { id: "a015", type: "newsletter", title: "The KAFU Chronicle — Issue 9 (Apr–Jun 2024)", date: "2024-06-28", year: 2024, description: "Features the Research Week 2024 highlights, student innovation showcase, and sports day results.", file_url: "#" },
  { id: "a016", type: "circular", title: "E-Learning Platform Migration Notice (2024)", date: "2024-03-01", year: 2024, description: "Circular to all academic staff and students on the migration to the new e-learning platform and timeline for legacy system decommissioning.", file_url: "#" },
  { id: "a017", type: "notice", title: "Land Title Deed — Kaimosi Campus (Phase II)", date: "2022-09-05", year: 2022, description: "Archived notice on the issuance of the land title deed for the Phase II campus expansion, totalling 42 acres.", file_url: "#" },
  { id: "a018", type: "leadership", title: "University Librarian — Ms. Florence Awino Appointed", date: "2022-05-23", year: 2022, description: "Official notification on the appointment of Ms. Florence Awino as the inaugural substantive University Librarian.", file_url: "#" },
  { id: "a019", type: "announcement", title: "Convocation 2024 — 5th Graduation Ceremony Notice", date: "2024-10-01", year: 2024, description: "Official notice and programme for KAFU's 5th Graduation Ceremony held on 18th October 2024 at the Main Campus.", file_url: "#" },
  { id: "a020", type: "circular", title: "Revised Examination Regulations — 2023 Edition", date: "2023-07-15", year: 2023, description: "Updated examination regulations covering online exams, academic integrity, and special examination provisions.", file_url: "#" },
];

const TYPE_META: Record<string, { label: string; icon: React.ElementType; colour: string }> = {
  notice:       { label: "Notice", icon: Bell, colour: "#1A5C38" },
  newsletter:   { label: "Newsletter", icon: Newspaper, colour: "#C9A227" },
  leadership:   { label: "Leadership", icon: Users, colour: "#1B3A6B" },
  announcement: { label: "Announcement", icon: Archive, colour: "#3A5A8C" },
  circular:     { label: "Circular", icon: FileText, colour: "#8B1A1A" },
};

const YEARS = Array.from(new Set(RECORDS.map(r => r.year))).sort((a, b) => b - a);

export default function Archives() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("all");

  const filtered = useMemo(() => RECORDS.filter(r => {
    const matchType = type === "all" || r.type === type;
    const matchYear = year === "all" || r.year === Number(year);
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchYear && matchSearch;
  }).sort((a, b) => b.date.localeCompare(a.date)), [search, type, year]);

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Archives — KAFU"
        description="Searchable archive of historical notices, newsletters, leadership records, circulars, and announcements from Kaimosi Friends University."
        path="/archives"
      />

      {/* Hero */}
      <PageHero
        eyebrow="Records & History"
        title="University Archives"
        subtitle="Historical notices, newsletters, leadership records, and official circulars from Kaimosi Friends University since our establishment in 2014."
        photo="/imgs/image-82.jpeg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Archives" },
        ]}
      />

      {/* Type stats */}
      <section className="py-8 bg-secondary/30 border-b">
        <div className="container mx-auto px-4 flex flex-wrap gap-4 justify-center">
          {Object.entries(TYPE_META).map(([key, meta]) => {
            const Icon = meta.icon;
            const count = RECORDS.filter(r => r.type === key).length;
            return (
              <button
                key={key}
                onClick={() => setType(type === key ? "all" : key)}
                data-testid={`archive-type-${key}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  type === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <Icon className="w-4 h-4" style={{ color: type === key ? undefined : meta.colour }} />
                {meta.label} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Search + Year filter */}
      <section className="py-6 bg-background border-b">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search archives..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-archive-search"
            />
          </div>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            data-testid="select-archive-year"
          >
            <option value="all">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-sm text-muted-foreground shrink-0">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </section>

      {/* Records */}
      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No archive records match your search.</div>
          ) : (
            <div className="space-y-3 max-w-4xl mx-auto">
              {filtered.map(r => {
                const meta = TYPE_META[r.type];
                const Icon = meta.icon;
                return (
                  <div
                    key={r.id}
                    className="group flex gap-4 p-5 rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all"
                    data-testid={`archive-record-${r.id}`}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: meta.colour + "18" }}>
                      <Icon className="w-5 h-5" style={{ color: meta.colour }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.colour }}>{meta.label}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.date).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">{r.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                    </div>
                    {r.file_url && (
                      <div className="shrink-0 self-center">
                        <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground hover:text-primary" asChild data-testid={`archive-download-${r.id}`}>
                          <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline text-xs">Download</span>
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
