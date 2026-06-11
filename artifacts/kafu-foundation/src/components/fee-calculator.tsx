import React, { useMemo, useState } from "react";
import { Calculator, Home, Award, Info } from "lucide-react";

interface CalculatorPathway {
  id: string;
  title: string;
  estimated_annual_total: number;
  estimated_annual_total_usd?: number;
}

interface FeeCalculatorProps {
  pathway: CalculatorPathway;
}

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6];

export function FeeCalculator({ pathway }: FeeCalculatorProps) {
  const isInternational = pathway.id === "international";
  const currency = isInternational ? "USD" : "KES";
  const annualTuition = isInternational
    ? pathway.estimated_annual_total_usd ?? pathway.estimated_annual_total
    : pathway.estimated_annual_total;

  const [years, setYears] = useState<number>(4);
  const [includeLiving, setIncludeLiving] = useState<boolean>(!isInternational);
  const [livingPerMonth, setLivingPerMonth] = useState<number>(5000);
  const [scholarshipPerYear, setScholarshipPerYear] = useState<number>(0);

  const totals = useMemo(() => {
    const tuitionTotal = annualTuition * years;
    const livingTotal = !isInternational && includeLiving ? livingPerMonth * 12 * years : 0;
    const scholarshipTotal = scholarshipPerYear * years;
    const net = Math.max(0, tuitionTotal + livingTotal - scholarshipTotal);
    return { tuitionTotal, livingTotal, scholarshipTotal, net, perMonth: net / (years * 12) };
  }, [annualTuition, years, includeLiving, livingPerMonth, scholarshipPerYear, isInternational]);

  function fmt(amount: number): string {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }

  return (
    <div className="mb-8" data-testid="fee-calculator">
      <h3 className="font-serif font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" /> Affordability Calculator
      </h3>
      <div className="border rounded-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Inputs */}
          <div className="p-5 space-y-5 bg-card">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Programme duration
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYears(y)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      years === y
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted-foreground border-input hover:bg-secondary"
                    }`}
                    data-testid={`calc-years-${y}`}
                  >
                    {y} {y === 1 ? "year" : "years"}
                  </button>
                ))}
              </div>
            </div>

            {!isInternational && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-primary" /> Include living expenses
                  </label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={includeLiving}
                    onClick={() => setIncludeLiving((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      includeLiving ? "bg-primary" : "bg-muted"
                    }`}
                    data-testid="calc-toggle-living"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        includeLiving ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {includeLiving && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                      <span>Estimated monthly living cost</span>
                      <span className="font-mono font-semibold text-foreground">{fmt(livingPerMonth)}</span>
                    </div>
                    <input
                      type="range"
                      min={3000}
                      max={8000}
                      step={500}
                      value={livingPerMonth}
                      onChange={(e) => setLivingPerMonth(Number(e.target.value))}
                      className="w-full accent-primary"
                      data-testid="calc-living-range"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                      <span>KES 3,000</span>
                      <span>KES 8,000</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                <Award className="w-4 h-4 text-accent" /> Scholarship / funding per year
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {currency}
                </span>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={scholarshipPerYear || ""}
                  placeholder="0"
                  onChange={(e) => setScholarshipPerYear(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-12 pr-3 py-2 rounded-lg border border-input bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  data-testid="calc-scholarship-input"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Include HELB, bursaries, or scholarships you expect to receive each year.
              </p>
            </div>
          </div>

          {/* Result */}
          <div className="p-5 bg-primary text-primary-foreground flex flex-col">
            <div className="text-sm text-primary-foreground/70 mb-1">Estimated total cost over {years} {years === 1 ? "year" : "years"}</div>
            <div className="text-3xl font-bold font-mono mb-1" data-testid="calc-net-total">{fmt(totals.net)}</div>
            <div className="text-sm text-primary-foreground/70 mb-5">
              ≈ {fmt(totals.perMonth)} per month
            </div>

            <dl className="space-y-2 text-sm border-t border-white/15 pt-4">
              <div className="flex justify-between">
                <dt className="text-primary-foreground/80">Tuition &amp; fees ({years}x)</dt>
                <dd className="font-mono">{fmt(totals.tuitionTotal)}</dd>
              </div>
              {totals.livingTotal > 0 && (
                <div className="flex justify-between">
                  <dt className="text-primary-foreground/80">Living expenses</dt>
                  <dd className="font-mono">{fmt(totals.livingTotal)}</dd>
                </div>
              )}
              {totals.scholarshipTotal > 0 && (
                <div className="flex justify-between text-accent">
                  <dt>Less funding</dt>
                  <dd className="font-mono">- {fmt(totals.scholarshipTotal)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-auto pt-5 flex items-start gap-2 text-xs text-primary-foreground/60">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Indicative estimate based on the {pathway.title} pathway. Actual costs vary by programme and
                year. Confirm with the Finance Office before making financial decisions.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
