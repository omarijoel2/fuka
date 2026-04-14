import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import { checkEligibility } from "@/lib/api-hooks";
import type { EligibilityResult } from "@/lib/api-types";
import {
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Briefcase,
} from "lucide-react";

const KCSE_GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

const QUALIFICATION_TYPES = [
  { value: "KCSE", label: "KCSE (Kenya Certificate of Secondary Education)" },
  { value: "A-Level", label: "A-Level (British System)" },
  { value: "IB", label: "International Baccalaureate (IB)" },
  { value: "IGCSE", label: "IGCSE / O-Level" },
  { value: "Other", label: "Other International Qualification" },
];

const PATHWAY_OPTIONS = [
  { value: "undergraduate", label: "Undergraduate Degree", desc: "Bachelor's programmes (4–5 years)" },
  { value: "postgraduate", label: "Postgraduate", desc: "Masters & PhD programmes" },
  { value: "international", label: "International Student", desc: "From outside Kenya" },
  { value: "self-sponsored", label: "Self-Sponsored (Module II)", desc: "Direct entry without KUCCPS" },
];

const SCHOOL_NAMES: Record<string, string> = {
  SESS: "Education & Social Sciences",
  SBE: "Business & Economics",
  SCIT: "Computing & IT",
  SOS: "Science",
  SHS: "Health Sciences",
};

type Step = 1 | 2 | 3 | 4;

export default function AdmissionsEligibilityPage() {
  const [step, setStep] = useState<Step>(1);
  const [pathway, setPathway] = useState("");
  const [qualType, setQualType] = useState("KCSE");
  const [meanGrade, setMeanGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    setLoading(true);
    setError(null);
    try {
      const data = await checkEligibility({ pathway, qualification_type: qualType, mean_grade: meanGrade });
      setResult(data);
      setStep(4);
    } catch {
      setError("Could not complete the eligibility check. Please try again or contact the Admissions Office.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(1);
    setPathway("");
    setQualType("KCSE");
    setMeanGrade("");
    setResult(null);
    setError(null);
  }

  const canAdvance = () => {
    if (step === 1) return !!pathway;
    if (step === 2) return !!qualType;
    if (step === 3) return !!meanGrade;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Eligibility Checker — Admissions | KAFU"
        description="Check your eligibility for KAFU programmes. Enter your KCSE grade or qualification to see which programmes you qualify for."
        path="/admissions/eligibility"
        breadcrumbs={[
          { name: "Admissions", path: "/admissions" },
          { name: "Eligibility Checker" },
        ]}
      />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link href="/admissions" className="hover:underline">Admissions</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span>Eligibility Checker</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            Eligibility <span className="text-accent">Pre-Check</span>
          </h1>
          <p className="text-primary-foreground/80 max-w-xl text-base leading-relaxed">
            Find out which KAFU programmes you qualify for based on your grades. This tool gives you instant guidance — not a binding admissions decision.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            {(["Pathway", "Qualification", "Grade", "Results"] as const).map((label, i) => {
              const n = (i + 1) as Step;
              const active = step === n;
              const done = step > n;
              return (
                <React.Fragment key={label}>
                  <div className={`flex items-center gap-1.5 ${done ? "text-primary" : active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${done ? "bg-primary text-white" : active ? "bg-foreground text-white" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : n}
                    </span>
                    <span className="hidden sm:block">{label}</span>
                  </div>
                  {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">

          {/* STEP 1: Pathway */}
          {step === 1 && (
            <div data-testid="step-1">
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">Step 1: Choose Your Pathway</h2>
              <p className="text-muted-foreground text-sm mb-6">Which type of study are you interested in?</p>
              <div className="space-y-3">
                {PATHWAY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPathway(opt.value)}
                    className={`w-full text-left flex items-start gap-4 p-5 rounded-xl border transition-all ${pathway === opt.value ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/50"}`}
                    data-testid={`pathway-option-${opt.value}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${pathway === opt.value ? "border-primary" : "border-muted-foreground/40"}`}>
                      {pathway === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{opt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={() => setStep(2)} disabled={!pathway} className="bg-primary text-white" data-testid="btn-next-step1">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Qualification Type */}
          {step === 2 && (
            <div data-testid="step-2">
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">Step 2: Your Qualification Type</h2>
              <p className="text-muted-foreground text-sm mb-6">What secondary school qualification do you hold or expect?</p>
              <div className="space-y-3">
                {QUALIFICATION_TYPES.map((qt) => (
                  <button
                    key={qt.value}
                    onClick={() => setQualType(qt.value)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${qualType === qt.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}
                    data-testid={`qual-option-${qt.value}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${qualType === qt.value ? "border-primary" : "border-muted-foreground/40"}`}>
                      {qualType === qt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{qt.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} data-testid="btn-back-step2">Back</Button>
                <Button onClick={() => setStep(3)} disabled={!qualType} className="bg-primary text-white" data-testid="btn-next-step2">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Grade */}
          {step === 3 && (
            <div data-testid="step-3">
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">Step 3: Your Mean Grade</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {qualType === "KCSE"
                  ? "Select your KCSE overall mean grade (or expected grade)."
                  : "Select the closest equivalent KCSE mean grade for your qualification."}
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
                {KCSE_GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setMeanGrade(g)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${meanGrade === g ? "bg-primary text-white border-primary shadow" : "bg-card border-border hover:border-primary text-foreground"}`}
                    data-testid={`grade-option-${g}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {meanGrade && (
                <div className="mb-4 p-3 bg-secondary rounded-lg text-sm text-foreground">
                  Selected: <strong>{meanGrade}</strong>
                  {meanGrade === "C+" || meanGrade === "B-" || meanGrade === "B" || meanGrade === "B+" || meanGrade === "A-" || meanGrade === "A"
                    ? " — This meets the standard minimum for most undergraduate programmes."
                    : meanGrade === "C"
                    ? " — This is slightly below the standard minimum. Check alternative pathways."
                    : " — Contact the Admissions Office to discuss available options."}
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} data-testid="btn-back-step3">Back</Button>
                <Button
                  onClick={handleCheck}
                  disabled={!meanGrade || loading}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="btn-check-eligibility"
                >
                  {loading ? "Checking..." : "Check Eligibility"}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && result && (
            <div data-testid="step-4-results">
              {/* Verdict Banner */}
              <div className={`flex items-start gap-3 p-5 rounded-xl mb-6 border ${
                result.verdict === "eligible" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                result.verdict === "borderline" ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-red-50 border-red-200 text-red-800"
              }`} data-testid="eligibility-verdict">
                {result.verdict === "eligible" ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" /> :
                 result.verdict === "borderline" ? <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" /> :
                 <XCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                <div>
                  <div className="font-bold text-base mb-1">
                    {result.verdict === "eligible" ? "You Qualify" : result.verdict === "borderline" ? "Borderline — Review Options" : "Below Standard Minimum"}
                  </div>
                  <p className="text-sm leading-relaxed">{result.message}</p>
                  <p className="text-xs mt-1 opacity-75">Mean Grade: {result.mean_grade} · Pathway: {result.pathway}</p>
                </div>
              </div>

              {/* Eligible Programmes */}
              {result.eligible_programmes.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-serif font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    {result.verdict === "eligible" ? "Programmes You Qualify For" : "Available Programmes"} ({result.eligible_programmes.length})
                  </h3>
                  <div className="space-y-2">
                    {result.eligible_programmes.map((prog, i) => (
                      <Link
                        key={i}
                        href={`/programmes/${prog.school.toLowerCase()}/${encodeURIComponent(prog.code)}`}
                        className="group flex items-center justify-between p-4 bg-card border rounded-xl hover:border-primary hover:shadow-sm transition-all"
                        data-testid={`eligible-prog-${i}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{prog.name}</div>
                            <div className="text-xs text-muted-foreground">{SCHOOL_NAMES[prog.school] ?? prog.school} · {prog.duration}</div>
                            <div className="text-xs text-accent font-medium mt-0.5 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" /> {prog.career_hint}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternative Options */}
              {result.alternative_options.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-serif font-bold text-base text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent" /> Alternative Options
                  </h3>
                  <div className="space-y-2">
                    {result.alternative_options.map((prog, i) => (
                      <div key={i} className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm" data-testid={`alt-prog-${i}`}>
                        <div className="font-semibold text-foreground">{prog.name} ({SCHOOL_NAMES[prog.school] ?? prog.school})</div>
                        {prog.note && <div className="text-amber-700 text-xs mt-1">{prog.note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="mb-8">
                <h3 className="font-serif font-bold text-base text-foreground mb-3">Next Steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.next_steps.map((ns, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {ns.url.startsWith("http") ? (
                        <a href={ns.url} target="_blank" rel="noreferrer" className="flex-1 flex items-center gap-2 p-3 bg-card border rounded-lg text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all" data-testid={`next-step-${i}`}>
                          <ChevronRight className="w-4 h-4 shrink-0 text-primary" /> {ns.label}
                        </a>
                      ) : (
                        <Link href={ns.url} className="flex-1 flex items-center gap-2 p-3 bg-card border rounded-lg text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all" data-testid={`next-step-${i}`}>
                          <ChevronRight className="w-4 h-4 shrink-0 text-primary" /> {ns.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Over */}
              <Button variant="outline" onClick={reset} className="border-primary text-primary" data-testid="btn-start-over">
                <RotateCcw className="w-4 h-4 mr-2" /> Check Another Grade / Pathway
              </Button>

              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                This tool provides indicative guidance only. Admission is subject to the availability of places, meeting specific subject requirements, and formal verification of documents by the KAFU Admissions Office.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto border-t bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
            <div>
              <p className="font-semibold text-foreground">Need personalised guidance?</p>
              <p className="text-sm text-muted-foreground">Our admissions team can answer specific questions about your qualifications.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-primary text-primary" asChild data-testid="btn-contact-admissions">
                <Link href="/contact">Contact Admissions</Link>
              </Button>
              <Button className="bg-primary text-white" asChild data-testid="btn-browse-programmes">
                <Link href="/programmes">Browse Programmes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
