import React, { useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import { checkEligibility, uploadCertificate } from "@/lib/api-hooks";
import type { EligibilityResult, CertificateUploadResult } from "@/lib/api-types";
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
  Upload,
  FileText,
  X,
  CheckCheck,
  Info,
  ExternalLink,
  Loader2,
} from "lucide-react";

// ── KCSE constants ─────────────────────────────────────────────────────────────
const KCSE_GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"];

const KCSE_SUBJECTS = [
  { key: "English", label: "English" },
  { key: "Kiswahili", label: "Kiswahili" },
  { key: "Mathematics", label: "Mathematics" },
  { key: "Biology", label: "Biology" },
  { key: "Chemistry", label: "Chemistry" },
  { key: "Physics", label: "Physics" },
  { key: "History", label: "History & Government" },
  { key: "Geography", label: "Geography" },
  { key: "Business Studies", label: "Business Studies" },
  { key: "Agriculture", label: "Agriculture" },
  { key: "Computer Studies", label: "Computer Studies" },
  { key: "French", label: "French" },
  { key: "CRE", label: "Christian Religious Education" },
  { key: "IRE", label: "Islamic Religious Education" },
  { key: "Home Science", label: "Home Science" },
];

// ── Pathway options ────────────────────────────────────────────────────────────
const PATHWAY_OPTIONS = [
  { value: "undergraduate", label: "Undergraduate Degree", desc: "Bachelor's programmes (4–5 years)" },
  { value: "postgraduate", label: "Postgraduate", desc: "Masters & PhD programmes" },
  { value: "international", label: "International Student", desc: "From outside Kenya" },
  { value: "self-sponsored", label: "Self-Sponsored (Module II)", desc: "Direct entry without KUCCPS" },
];

// ── Step 2 qualification options by pathway ────────────────────────────────────
const UG_QUAL_TYPES = [
  { value: "KCSE", label: "KCSE (Kenya Certificate of Secondary Education)" },
  { value: "A-Level", label: "A-Level (British System)" },
  { value: "IB", label: "International Baccalaureate (IB)" },
  { value: "IGCSE", label: "IGCSE / O-Level" },
  { value: "Other", label: "Other International Qualification" },
];

const PG_QUAL_TYPES = [
  {
    value: "bachelors",
    label: "Bachelor's Degree",
    desc: "I hold an undergraduate degree — I want to pursue a Masters programme",
  },
  {
    value: "masters_degree",
    label: "Master's Degree",
    desc: "I hold a Masters degree — I want to pursue a PhD / Doctoral programme",
  },
  {
    value: "secondary",
    label: "Secondary School Certificate only",
    desc: "I have not yet completed an undergraduate degree",
  },
];

// ── Degree classification options (postgraduate Step 3) ────────────────────────
const DEGREE_CLASSES = [
  { value: "first", label: "First Class Honours" },
  { value: "upper_second", label: "Second Class Honours — Upper Division (2:1)" },
  { value: "lower_second", label: "Second Class Honours — Lower Division (2:2)" },
  { value: "third", label: "Third Class Honours / Pass" },
  { value: "pass", label: "Pass / Unclassified (e.g. MBA direct entry)" },
];

// ── Misc ───────────────────────────────────────────────────────────────────────
const SCHOOL_NAMES: Record<string, string> = {
  SESS: "Education & Social Sciences",
  SBE: "Business & Economics",
  SCIT: "Computing & IT",
  SOS: "Science",
  SHS: "Health Sciences",
};

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_MB = 5;

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS: Record<Step, string> = {
  1: "Pathway",
  2: "Qualification",
  3: "Grade / Class",
  4: "Upload Certificate",
  5: "Results",
};

export default function AdmissionsEligibilityPage() {
  const [step, setStep] = useState<Step>(1);
  const [pathway, setPathway] = useState("");
  const [qualType, setQualType] = useState("");
  const [meanGrade, setMeanGrade] = useState("");
  const [degreeClass, setDegreeClass] = useState("");
  const [subjectGrades, setSubjectGrades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocType, setUploadDocType] = useState("KCSE Result Slip");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<CertificateUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPostgraduate = pathway === "postgraduate";
  const isKCSE = !isPostgraduate && qualType === "KCSE";
  const subjectCount = Object.keys(subjectGrades).length;

  function setSubjectGrade(subj: string, grade: string) {
    setSubjectGrades((prev) => {
      if (!grade) { const n = { ...prev }; delete n[subj]; return n; }
      return { ...prev, [subj]: grade };
    });
  }

  // Step 2 options depend on pathway
  const step2Options = isPostgraduate ? PG_QUAL_TYPES : UG_QUAL_TYPES;

  // Step 3 is "Grade" for UG, "Degree Classification" for PG
  const step3Complete = isPostgraduate ? !!degreeClass : !!meanGrade;

  async function handleCheck() {
    setLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof checkEligibility>[0] = {
        pathway,
        qualification_type: qualType,
        mean_grade: isPostgraduate ? "N/A" : meanGrade,
        degree_class: isPostgraduate ? degreeClass : undefined,
        subject_grades: isKCSE && subjectCount > 0 ? subjectGrades : undefined,
      };
      const data = await checkEligibility(params);
      setResult(data);
      setStep(5);
    } catch {
      setError("Could not complete the eligibility check. Please try again or contact the Admissions Office.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(file: File | null) {
    setUploadError(null);
    if (!file) { setUploadFile(null); return; }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only PDF, JPG, or PNG files are accepted.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setUploadError(`File must be under ${MAX_FILE_MB} MB.`);
      return;
    }
    setUploadFile(file);
  }

  async function handleUpload() {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadCertificate(uploadFile, uploadDocType);
      setUploadResult(res);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    setStep(1);
    setPathway("");
    setQualType("");
    setMeanGrade("");
    setDegreeClass("");
    setSubjectGrades({});
    setResult(null);
    setError(null);
    setUploadFile(null);
    setUploadResult(null);
    setUploadError(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Eligibility Checker — Admissions | KAFU"
        description="Check your eligibility for KAFU programmes. Undergraduate KCSE cluster checking, postgraduate degree classification, and certificate upload in one wizard."
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
            Find out which KAFU programmes you qualify for. This is indicative guidance — not a binding admissions decision.
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="border-b bg-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm overflow-x-auto pb-1">
            {([1, 2, 3, 4, 5] as Step[]).map((n, i) => {
              const active = step === n;
              const done = step > n;
              return (
                <React.Fragment key={n}>
                  <div className={`flex items-center gap-1.5 shrink-0 ${done ? "text-primary" : active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${done ? "bg-primary text-white" : active ? "bg-foreground text-white" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
                    </span>
                    <span className="hidden sm:block">{STEP_LABELS[n]}</span>
                  </div>
                  {i < 4 && <div className={`flex-1 h-0.5 shrink-0 ${step > n ? "bg-primary" : "bg-border"}`} style={{ minWidth: 12, maxWidth: 40 }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">

          {/* ── STEP 1: Pathway ─────────────────────────────────────────────── */}
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
                <Button onClick={() => { setQualType(""); setStep(2); }} disabled={!pathway} className="bg-primary text-white" data-testid="btn-next-step1">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Qualification ────────────────────────────────────────── */}
          {step === 2 && (
            <div data-testid="step-2">
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">Step 2: Your Qualification</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {isPostgraduate
                  ? "What is your highest academic qualification?"
                  : "What secondary / high school qualification do you hold or expect to receive?"}
              </p>
              <div className="space-y-3">
                {step2Options.map((qt) => (
                  <button
                    key={qt.value}
                    onClick={() => setQualType(qt.value)}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all ${qualType === qt.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}
                    data-testid={`qual-option-${qt.value}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${qualType === qt.value ? "border-primary" : "border-muted-foreground/40"}`}>
                      {qualType === qt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground block">{qt.label}</span>
                      {"desc" in qt && <span className="text-xs text-muted-foreground mt-0.5 block">{(qt as { desc: string }).desc}</span>}
                    </div>
                  </button>
                ))}
              </div>

              {/* Postgraduate ineligible warning */}
              {isPostgraduate && qualType === "secondary" && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800" data-testid="pg-secondary-warning">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    Postgraduate programmes require a minimum of a Bachelor's degree. Complete an undergraduate degree before applying for Masters or PhD programmes.
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="border-amber-500 text-amber-700" onClick={() => { setPathway("undergraduate"); setQualType(""); setStep(2); }} data-testid="btn-switch-ug">
                        Switch to Undergraduate Check
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} data-testid="btn-back-step2">Back</Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!qualType || (isPostgraduate && qualType === "secondary")}
                  className="bg-primary text-white"
                  data-testid="btn-next-step2"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Grade / Degree Class ────────────────────────────────── */}
          {step === 3 && (
            <div data-testid="step-3">
              {isPostgraduate ? (
                /* ── Postgraduate: Degree Classification ── */
                <>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-2">Step 3: Degree Classification</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    {qualType === "masters_degree"
                      ? "Select your Masters degree level. All Masters degree holders are eligible to apply for Doctoral programmes."
                      : "Select your Bachelor's degree classification. Most Masters programmes require at least a Second Class Honours (Lower Division)."}
                  </p>
                  <div className="space-y-3">
                    {(qualType === "masters_degree"
                      ? [{ value: "masters", label: "Master's Degree (any specialisation)" }]
                      : DEGREE_CLASSES
                    ).map((dc) => (
                      <button
                        key={dc.value}
                        onClick={() => setDegreeClass(dc.value)}
                        className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${degreeClass === dc.value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}
                        data-testid={`degree-class-${dc.value}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${degreeClass === dc.value ? "border-primary" : "border-muted-foreground/40"}`}>
                          {degreeClass === dc.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm font-medium text-foreground">{dc.label}</span>
                      </button>
                    ))}
                  </div>

                  {qualType === "masters_degree" && (
                    <div className="mt-4 flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-foreground">
                      <Info className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                      Holders of a Master's degree are eligible for all KAFU Doctoral (PhD) programmes, subject to availability and research proposal approval.
                    </div>
                  )}
                </>
              ) : (
                /* ── Undergraduate: KCSE Mean Grade + Subject Grades ── */
                <>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-2">Step 3: Your Grades</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    {isKCSE
                      ? "Select your KCSE overall mean grade, then optionally enter individual subject grades to check cluster subject requirements."
                      : "Select the closest equivalent KCSE mean grade for your qualification."}
                  </p>

                  {/* Mean Grade Grid */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      {isKCSE ? "KCSE Overall Mean Grade" : "Equivalent Mean Grade"}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
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
                      <div className="mt-3 p-3 bg-secondary rounded-lg text-sm text-foreground">
                        Selected: <strong>{meanGrade}</strong>
                        {["C+", "B-", "B", "B+", "A-", "A"].includes(meanGrade)
                          ? " — Meets the standard minimum for most undergraduate programmes."
                          : meanGrade === "C"
                          ? " — Slightly below the standard minimum. Check Module II (Self-Sponsored) options."
                          : " — Contact the Admissions Office to discuss available options."}
                      </div>
                    )}
                  </div>

                  {/* Subject Grades — KCSE only */}
                  {isKCSE && (
                    <div className="border rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-5 py-3 bg-primary/5 border-b">
                        <Info className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-semibold text-foreground">Individual Subject Grades</span>
                        <span className="ml-auto text-xs text-muted-foreground font-normal">Optional — enables cluster subject checking</span>
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                          Enter grades for subjects you sat. Only fill in subjects relevant to your intended programme. Blank subjects won't be checked against cluster requirements.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="subject-grades-grid">
                          {KCSE_SUBJECTS.map((subj) => (
                            <div key={subj.key} className="flex items-center gap-3">
                              <label className="text-xs font-medium text-foreground min-w-0 flex-1 truncate" htmlFor={`subj-${subj.key}`}>
                                {subj.label}
                              </label>
                              <select
                                id={`subj-${subj.key}`}
                                value={subjectGrades[subj.key] ?? ""}
                                onChange={(e) => setSubjectGrade(subj.key, e.target.value)}
                                className="border rounded-lg text-xs px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 w-20 shrink-0"
                                data-testid={`subject-grade-${subj.key.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                <option value="">—</option>
                                {KCSE_GRADES.map((g) => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                        {subjectCount > 0 && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {subjectCount} subject{subjectCount > 1 ? "s" : ""} entered — cluster requirements will be checked.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} data-testid="btn-back-step3">Back</Button>
                <Button onClick={() => setStep(4)} disabled={!step3Complete} className="bg-primary text-white" data-testid="btn-next-step3">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Certificate Upload ───────────────────────────────────── */}
          {step === 4 && (
            <div data-testid="step-4">
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">Step 4: Upload Your Certificate</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {isPostgraduate
                  ? "Upload your degree certificate or academic transcript. Accepted formats: PDF, JPG, PNG (max 5 MB)."
                  : "Upload your KCSE result slip, academic transcript, or equivalent certificate. Optional here but required for formal applications. Accepted formats: PDF, JPG, PNG (max 5 MB)."}
              </p>

              {/* Document type */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-foreground mb-2">Document Type</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full border rounded-lg text-sm px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="select-doc-type"
                >
                  {isPostgraduate ? (
                    <>
                      <option>Degree Certificate</option>
                      <option>Academic Transcript</option>
                      <option>Masters Certificate</option>
                      <option>Postgraduate Diploma Certificate</option>
                      <option>Other Qualification</option>
                    </>
                  ) : (
                    <>
                      <option>KCSE Result Slip</option>
                      <option>KCSE Certificate</option>
                      <option>A-Level Certificate</option>
                      <option>IB Diploma</option>
                      <option>O-Level / IGCSE Certificate</option>
                      <option>Degree Certificate</option>
                      <option>Academic Transcript</option>
                      <option>Other Qualification</option>
                    </>
                  )}
                </select>
              </div>

              {/* Upload Zone */}
              {!uploadResult ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${uploadFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files[0] ?? null); }}
                  data-testid="upload-drop-zone"
                >
                  {uploadFile ? (
                    <div>
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="text-left">
                          <div className="font-semibold text-sm text-foreground">{uploadFile.name}</div>
                          <div className="text-xs text-muted-foreground">{(uploadFile.size / 1024).toFixed(1)} KB · {uploadDocType}</div>
                        </div>
                        <button onClick={() => { setUploadFile(null); setUploadError(null); }} className="ml-auto text-muted-foreground hover:text-destructive" data-testid="btn-remove-file">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <Button onClick={handleUpload} disabled={uploading} className="bg-primary text-white" data-testid="btn-upload-file">
                        {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Upload Document</>}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium text-foreground mb-1">Drag and drop your file here</p>
                      <p className="text-xs text-muted-foreground mb-4">PDF, JPG, or PNG — maximum 5 MB</p>
                      <Button variant="outline" className="border-primary text-primary" onClick={() => fileInputRef.current?.click()} data-testid="btn-choose-file">
                        Choose File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                        data-testid="input-file"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3 p-5 bg-emerald-50 border border-emerald-200 rounded-xl" data-testid="upload-success">
                  <CheckCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-800 mb-0.5">Document Uploaded Successfully</div>
                    <p className="text-sm text-emerald-700">{uploadResult.message}</p>
                    <div className="mt-2 text-xs text-emerald-600">
                      Reference: <code className="font-mono bg-emerald-100 px-1 rounded">{uploadResult.reference_id}</code>
                      &nbsp;· {uploadResult.size_kb} KB · {uploadResult.file_name}
                    </div>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-3 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm flex items-center gap-2" data-testid="upload-error">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {uploadError}
                </div>
              )}

              <div className="mt-4 p-3 bg-secondary border rounded-lg text-xs text-muted-foreground flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                Your document is stored securely and will only be used by the KAFU Admissions Office to verify your qualifications.
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setStep(3)} data-testid="btn-back-step4">Back</Button>
                <Button
                  onClick={handleCheck}
                  disabled={loading}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="btn-check-eligibility"
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...</> : <>Check Eligibility <ArrowRight className="ml-2 w-4 h-4" /></>}
                </Button>
                {!uploadResult && !loading && (
                  <Button variant="ghost" onClick={handleCheck} disabled={loading} className="text-muted-foreground text-sm" data-testid="btn-skip-upload">
                    Skip upload
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 5: Results ──────────────────────────────────────────────── */}
          {step === 5 && result && (
            <div data-testid="step-5-results">
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
                    {result.verdict === "eligible" ? "You Qualify" : result.verdict === "borderline" ? "Borderline — Review Options" : "Not Eligible for This Level"}
                  </div>
                  <p className="text-sm leading-relaxed">{result.message}</p>
                  <div className="text-xs mt-1 opacity-75 flex flex-wrap gap-3">
                    <span>Pathway: {result.pathway}</span>
                    {result.mean_grade && result.mean_grade !== "N/A" && <span>Mean Grade: {result.mean_grade}</span>}
                    {uploadResult && (
                      <span className="flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5" /> Certificate uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Eligible Programmes */}
              {result.eligible_programmes.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-serif font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Programmes You Qualify For ({result.eligible_programmes.length})
                  </h3>
                  <div className="space-y-3">
                    {result.eligible_programmes.map((prog, i) => {
                      const levelBadge = (prog as { level?: string }).level === "doctoral"
                        ? "PhD" : (prog as { level?: string }).level === "masters" ? "Masters" : null;
                      const clusterAll = prog.cluster_check?.every((c) => c.pass) ?? null;
                      const clusterFailed = prog.cluster_check?.filter((c) => !c.pass) ?? [];
                      return (
                        <div key={i} className="border rounded-xl overflow-hidden" data-testid={`eligible-prog-${i}`}>
                          <Link
                            href={`/programmes/${prog.school.toLowerCase()}/${encodeURIComponent(prog.code)}`}
                            className="group flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{prog.name}</span>
                                  {levelBadge && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${levelBadge === "PhD" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                      {levelBadge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{SCHOOL_NAMES[prog.school] ?? prog.school} · {prog.duration}</div>
                                <div className="text-xs text-accent font-medium mt-0.5 flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" /> {prog.career_hint}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {clusterAll === true && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Cluster Met</span>
                              )}
                              {clusterAll === false && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{clusterFailed.length} req. unmet</span>
                              )}
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </Link>

                          {/* min_qual row for postgraduate */}
                          {(prog as { min_qual?: string }).min_qual && !prog.cluster_check && (
                            <div className="border-t px-4 py-2 bg-secondary/30 text-xs text-muted-foreground">
                              Minimum requirement: {(prog as { min_qual?: string }).min_qual}
                            </div>
                          )}

                          {/* Cluster subject detail */}
                          {prog.cluster_check && prog.cluster_check.length > 0 && (
                            <div className="border-t px-4 py-3 bg-secondary/30" data-testid={`cluster-check-${i}`}>
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cluster Subject Requirements</div>
                              <div className="space-y-1.5">
                                {prog.cluster_check.map((req, j) => (
                                  <div key={j} className="flex items-center gap-2 text-xs">
                                    {req.pass
                                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                                    <span className={req.pass ? "text-foreground" : "text-red-700 font-medium"}>{req.description}</span>
                                    {req.best_subject && req.best_grade && (
                                      <span className={`ml-auto font-mono font-bold px-1.5 rounded shrink-0 ${req.pass ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                        {req.best_subject}: {req.best_grade}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {result.alternative_options.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-serif font-bold text-base text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent" /> Alternative Options
                  </h3>
                  <div className="space-y-2">
                    {result.alternative_options.map((prog, i) => {
                      const levelBadge = (prog as { level?: string }).level === "doctoral" ? "PhD" : (prog as { level?: string }).level === "masters" ? "Masters" : null;
                      return (
                        <div key={i} className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm" data-testid={`alt-prog-${i}`}>
                          <div className="flex items-center gap-2 flex-wrap font-semibold text-foreground mb-1">
                            {prog.name}
                            {levelBadge && (
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${levelBadge === "PhD" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                {levelBadge}
                              </span>
                            )}
                            <span className="text-muted-foreground font-normal text-xs">({SCHOOL_NAMES[prog.school] ?? prog.school})</span>
                          </div>
                          {prog.note && <div className="text-amber-700 text-xs">{prog.note}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload prompt if skipped */}
              {!uploadResult && (
                <div className="mb-6 p-4 border border-dashed rounded-xl flex items-start gap-3 text-sm" data-testid="upload-prompt">
                  <Upload className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Upload your certificate</div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      You skipped the upload step. When applying formally, you must submit certified copies of your academic documents.
                    </p>
                    <Button size="sm" variant="outline" className="border-primary text-primary" onClick={() => setStep(4)} data-testid="btn-go-upload">
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Certificate
                    </Button>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="mb-8">
                <h3 className="font-serif font-bold text-base text-foreground mb-3">Next Steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.next_steps.map((ns, i) => (
                    ns.url.startsWith("http") ? (
                      <a key={i} href={ns.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-card border rounded-lg text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all" data-testid={`next-step-${i}`}>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-primary" /> {ns.label}
                      </a>
                    ) : (
                      <Link key={i} href={ns.url} className="flex items-center gap-2 p-3 bg-card border rounded-lg text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all" data-testid={`next-step-${i}`}>
                        <ChevronRight className="w-4 h-4 shrink-0 text-primary" /> {ns.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>

              <Button variant="outline" onClick={reset} className="border-primary text-primary" data-testid="btn-start-over">
                <RotateCcw className="w-4 h-4 mr-2" /> Check Another Grade / Pathway
              </Button>

              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                This tool provides indicative guidance only. Admission is subject to the availability of places, meeting specific entry requirements, and formal verification by the KAFU Admissions Office.
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
              <p className="text-sm text-muted-foreground">Our admissions team can answer specific questions about your qualifications and requirements.</p>
            </div>
            <div className="flex gap-3 shrink-0">
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
