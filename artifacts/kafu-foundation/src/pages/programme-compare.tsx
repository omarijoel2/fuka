import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import { useProgrammeDetail } from "@/lib/api-hooks";
import type { ProgrammeDetail } from "@/lib/api-types";
import {
  ChevronRight,
  X,
  BookOpen,
  Clock,
  GraduationCap,
  CheckCircle2,
  Briefcase,
  Award,
  TrendingUp,
  Banknote,
  Plus,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const SCHOOL_NAMES: Record<string, string> = {
  SESS: "Education & Social Sciences",
  SBE: "Business & Economics",
  SCIT: "Computing & IT",
  SOS: "Science",
  SHS: "Health Sciences",
};

const LEVEL_LABELS: Record<string, string> = {
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  doctoral: "Doctoral",
};

// Comparison storage key
const COMPARE_KEY = "kafu_compare_progs";

export function getCompareList(): { school: string; code: string; name: string }[] {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addToCompare(item: { school: string; code: string; name: string }): boolean {
  const list = getCompareList();
  if (list.length >= 3) return false;
  if (list.some((l) => l.school === item.school && l.code === item.code)) return true;
  localStorage.setItem(COMPARE_KEY, JSON.stringify([...list, item]));
  return true;
}

export function removeFromCompare(school: string, code: string) {
  const list = getCompareList().filter((l) => !(l.school === school && l.code === code));
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
}

export function isInCompare(school: string, code: string): boolean {
  return getCompareList().some((l) => l.school === school && l.code === code);
}

export function clearCompare() {
  localStorage.setItem(COMPARE_KEY, "[]");
}

function ProgrammeColumn({ school, code, name, onRemove }: { school: string; code: string; name: string; onRemove: () => void }) {
  const { data: detail, isLoading } = useProgrammeDetail(school.toUpperCase(), code);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-40 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>
    );
  }

  return <div className="text-sm" data-testid={`compare-col-${school}-${code}`}>{null}</div>;
}

interface CompareRow {
  label: string;
  key: keyof ProgrammeDetail | string;
  render: (d: ProgrammeDetail | null, school: string, code: string) => React.ReactNode;
}

const ROWS: CompareRow[] = [
  {
    label: "Programme Name",
    key: "code",
    render: (d, school, code) => (
      <div>
        <Link href={`/programmes/${school.toLowerCase()}/${encodeURIComponent(code)}`} className="font-bold text-primary hover:underline text-base">
          {code}
        </Link>
        <div className="text-xs text-muted-foreground mt-0.5">{SCHOOL_NAMES[school] ?? school}</div>
      </div>
    ),
  },
  {
    label: "School",
    key: "school",
    render: (d, school) => <span>{SCHOOL_NAMES[school] ?? school}</span>,
  },
  {
    label: "Mode of Study",
    key: "mode",
    render: (d) => <span>{d?.mode ?? "Full-time"}</span>,
  },
  {
    label: "Accreditation",
    key: "accreditation",
    render: (d) =>
      d?.accreditation ? (
        <div>
          <div className="flex items-center gap-1 text-emerald-700 font-semibold text-xs mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {d.accreditation.status}
          </div>
          <div className="text-xs text-muted-foreground">{d.accreditation.body}</div>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    label: "Employment Rate",
    key: "employability_data.employment_rate",
    render: (d) =>
      d?.employability_data ? (
        <div className="flex items-center gap-2">
          <div className="w-full bg-muted rounded-full h-2 flex-1">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${d.employability_data.employment_rate}%` }}
            />
          </div>
          <span className="font-bold text-primary text-sm shrink-0">{d.employability_data.employment_rate}%</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    label: "Annual Tuition (Self-Sponsored)",
    key: "fee_structure.tuition_kes_per_year",
    render: (d) =>
      d?.fee_structure ? (
        <div>
          <div className="font-bold text-foreground">KES {d.fee_structure.tuition_kes_per_year.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total est. KES {d.fee_structure.total_annual_kes.toLocaleString()}/yr</div>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">Contact Admissions</span>
      ),
  },
  {
    label: "Entry Requirements",
    key: "entry_requirements",
    render: (d) =>
      d?.entry_requirements?.length ? (
        <ul className="space-y-1">
          {d.entry_requirements.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>{r}</span>
            </li>
          ))}
          {d.entry_requirements.length > 3 && (
            <li className="text-xs text-muted-foreground">+{d.entry_requirements.length - 3} more</li>
          )}
        </ul>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    label: "Learning Outcomes",
    key: "learning_outcomes",
    render: (d) =>
      d?.learning_outcomes?.length ? (
        <ul className="space-y-1">
          {d.learning_outcomes.slice(0, 3).map((o, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span>{o}</span>
            </li>
          ))}
          {d.learning_outcomes.length > 3 && (
            <li className="text-xs text-muted-foreground">+{d.learning_outcomes.length - 3} more</li>
          )}
        </ul>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    label: "Career Opportunities",
    key: "career_opportunities",
    render: (d) =>
      d?.career_opportunities?.length ? (
        <div className="flex flex-wrap gap-1">
          {d.career_opportunities.slice(0, 4).map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{c}</span>
          ))}
          {d.career_opportunities.length > 4 && (
            <span className="text-xs text-muted-foreground">+{d.career_opportunities.length - 4}</span>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    label: "Industry Sectors",
    key: "employability_data.industry_sectors",
    render: (d) =>
      d?.employability_data?.industry_sectors?.length ? (
        <div className="flex flex-wrap gap-1">
          {d.employability_data.industry_sectors.map((s, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-secondary border text-xs text-muted-foreground">{s}</span>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
];

function CompareTable({ items }: { items: { school: string; code: string; name: string }[] }) {
  const details = items.map((item) => {
    // We can't call hooks in a loop; use a static render
    return item;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 text-left px-4 py-3 bg-secondary border-b font-semibold text-muted-foreground text-xs uppercase tracking-wider sticky left-0 z-10">
              Attribute
            </th>
            {items.map((item) => (
              <th key={`${item.school}-${item.code}`} className="px-4 py-3 bg-primary text-primary-foreground text-left min-w-52">
                <div className="font-serif font-bold text-sm">{item.code}</div>
                <div className="text-xs font-normal text-primary-foreground/70">{SCHOOL_NAMES[item.school] ?? item.school}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, ri) => (
            <CompareRowRenderer key={ri} row={row} items={items} rowIndex={ri} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="px-4 py-4 sticky left-0 bg-white border-t" />
            {items.map((item) => (
              <td key={`${item.school}-${item.code}`} className="px-4 py-4 border-t">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm" asChild>
                  <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                    Apply Now <ExternalLink className="ml-2 w-3.5 h-3.5" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full mt-2 border-primary text-primary text-sm" asChild>
                  <Link href={`/programmes/${item.school.toLowerCase()}/${encodeURIComponent(item.code)}`}>
                    Full Programme Details <ChevronRight className="ml-1 w-3.5 h-3.5" />
                  </Link>
                </Button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function CompareRowRenderer({ row, items, rowIndex }: { row: CompareRow; items: { school: string; code: string; name: string }[]; rowIndex: number }) {
  return (
    <tr className={rowIndex % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
      <td className="px-4 py-4 sticky left-0 font-semibold text-xs text-muted-foreground uppercase tracking-wide bg-inherit border-r">
        {row.label}
      </td>
      {items.map((item) => (
        <CompareCell key={`${item.school}-${item.code}`} school={item.school} code={item.code} row={row} />
      ))}
    </tr>
  );
}

function CompareCell({ school, code, row }: { school: string; code: string; row: CompareRow }) {
  const { data: detail, isLoading } = useProgrammeDetail(school.toUpperCase(), code);

  return (
    <td className="px-4 py-4 border-r border-border/50 align-top">
      {isLoading ? (
        <div className="h-8 bg-muted rounded animate-pulse" />
      ) : (
        row.render(detail ?? null, school.toUpperCase(), code)
      )}
    </td>
  );
}

export default function ProgrammeComparePage() {
  const [compareList, setCompareList] = useState(getCompareList);

  useEffect(() => {
    const handle = () => setCompareList(getCompareList());
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  function handleRemove(school: string, code: string) {
    removeFromCompare(school, code);
    setCompareList(getCompareList());
  }

  function handleClear() {
    clearCompare();
    setCompareList([]);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Compare Programmes — Kaimosi Friends University"
        description="Compare KAFU academic programmes side-by-side. See entry requirements, career outcomes, fees, accreditation, and learning outcomes."
        path="/programmes/compare"
        breadcrumbs={[
          { name: "Programmes", path: "/programmes" },
          { name: "Compare" },
        ]}
      />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link href="/programmes" className="hover:underline">Programmes</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span>Compare</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Programme <span className="text-accent">Comparison</span>
          </h1>
          <p className="text-primary-foreground/80 text-sm max-w-xl">Compare up to 3 programmes side-by-side to make an informed decision about your academic path.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Selected programmes chips */}
        {compareList.length > 0 && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-muted-foreground">Comparing:</span>
            {compareList.map((item) => (
              <div key={`${item.school}-${item.code}`} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium" data-testid={`compare-chip-${item.code}`}>
                {item.code}
                <button onClick={() => handleRemove(item.school, item.code)} className="hover:text-destructive transition-colors" data-testid={`remove-${item.code}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {compareList.length < 3 && (
              <Button variant="outline" size="sm" className="border-dashed border-primary text-primary" asChild>
                <Link href="/programmes">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Programme
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto" onClick={handleClear} data-testid="btn-clear-compare">
              Clear All
            </Button>
          </div>
        )}

        {compareList.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">No programmes selected</h2>
            <p className="text-muted-foreground mb-6 text-sm max-w-sm mx-auto">
              Browse the programme catalogue and use the "Compare" button on any programme card to add it here. You can compare up to 3 programmes.
            </p>
            <Button className="bg-primary text-white" asChild data-testid="btn-browse-programmes-empty">
              <Link href="/programmes">Browse Programmes</Link>
            </Button>
          </div>
        ) : (
          <div data-testid="compare-table-container">
            <CompareTable items={compareList} />
          </div>
        )}

        {compareList.length > 0 && compareList.length < 3 && (
          <div className="mt-6 p-4 bg-secondary border border-dashed rounded-xl text-sm text-muted-foreground flex items-center gap-3">
            <Plus className="w-4 h-4 shrink-0" />
            <span>You can add {3 - compareList.length} more programme{3 - compareList.length > 1 ? "s" : ""} to this comparison. <Link href="/programmes" className="text-primary font-medium hover:underline">Browse programmes</Link> to add more.</span>
          </div>
        )}

      </div>
    </div>
  );
}
