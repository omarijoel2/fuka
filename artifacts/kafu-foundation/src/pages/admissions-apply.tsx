import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check, ChevronRight, ChevronLeft, GraduationCap, BookOpen,
  Users, CreditCard, FileCheck, Loader2, AlertCircle, Calendar,
  Phone, User, MapPin, FileText, ClipboardList,
} from "lucide-react";

const API = "/api/admissions-app";

const STEPS = ["Intake", "Personal", "Academic", "Programme", "Documents", "Payment", "Review"];

const COUNTIES = [
  "Nairobi","Mombasa","Kisumu","Nakuru","Eldoret/Uasin Gishu","Vihiga","Kakamega",
  "Bungoma","Busia","Siaya","Kisii","Migori","Homa Bay","Nyamira","Nandi",
  "Trans Nzoia","West Pokot","Turkana","Baringo","Elgeyo-Marakwet","Laikipia",
  "Nyandarua","Nyeri","Kirinyaga","Murang'a","Kiambu","Machakos","Makueni","Kitui",
  "Meru","Tharaka-Nithi","Embu","Isiolo","Marsabit","Wajir","Mandera","Garissa",
  "Tana River","Lamu","Kilifi","Taita-Taveta","Kwale","Kajiado","Narok","Kericho",
  "Bomet","Nyahururu","Other",
];

const GRADES = ["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","E"];

const PATHWAY_OPTIONS = [
  { code: "kuccps",  label: "KUCCPS Government Placement",    icon: GraduationCap, level: "undergraduate", desc: "For KCSE candidates placed by KUCCPS (minimum C+)" },
  { code: "ug_self", label: "Self-Sponsored Undergraduate",   icon: BookOpen,      level: "undergraduate", desc: "Module II programmes — minimum C plain in KCSE" },
  { code: "masters", label: "Masters Degree",                 icon: Users,         level: "masters",       desc: "Minimum Second Class Honours (Lower Division)" },
  { code: "phd",     label: "PhD / Doctoral Programme",       icon: BookOpen,      level: "phd",           desc: "For holders of a relevant Masters degree" },
];

const DOCS_BY_LEVEL: Record<string, string[]> = {
  undergraduate: [
    "National ID / Birth Certificate",
    "KCSE Certificate / Result Slip",
    "KUCCPS Admission Letter (if applicable)",
    "2 Recent Passport-Size Photos",
  ],
  masters: [
    "National ID / Passport",
    "Degree Certificate",
    "Official Transcripts",
    "2 Academic Referees (letters or contacts)",
    "2 Recent Passport-Size Photos",
  ],
  phd: [
    "National ID / Passport",
    "Masters Degree Certificate",
    "Official Transcripts (Degree + Masters)",
    "Research Proposal (2–5 pages)",
    "2 Academic Referees (letters or contacts)",
    "2 Recent Passport-Size Photos",
  ],
};

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
}

interface Programme {
  id: number;
  programme_code: string;
  programme_name: string;
  school_code: string;
  level: string;
  duration: string;
}

interface FormData {
  intake_id: number | null;
  pathway_code: string;
  first_name: string; last_name: string; other_names: string;
  gender: string; date_of_birth: string; nationality: string;
  id_passport_number: string; phone: string; email: string;
  postal_address: string; county: string;
  kcse_index_number: string; kcse_year: string; mean_grade: string;
  degree_institution: string; degree_class: string; degree_year: string; degree_field: string;
  school_code: string; programme_code: string; programme_name: string;
  second_choice_code: string; second_choice_name: string;
  docs_declared: string[];
  payment_phone: string;
}

const INITIAL: FormData = {
  intake_id: null, pathway_code: "",
  first_name: "", last_name: "", other_names: "",
  gender: "", date_of_birth: "", nationality: "Kenyan",
  id_passport_number: "", phone: "", email: "", postal_address: "", county: "",
  kcse_index_number: "", kcse_year: "", mean_grade: "",
  degree_institution: "", degree_class: "", degree_year: "", degree_field: "",
  school_code: "", programme_code: "", programme_name: "",
  second_choice_code: "", second_choice_name: "",
  docs_declared: [],
  payment_phone: "",
};

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < current ? "bg-primary border-primary text-primary-foreground" :
              i === current ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20" :
              "bg-background border-border text-muted-foreground"
            }`}>
              {i < current ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${i <= current ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-6 mx-0.5 mb-4 transition-colors ${i < current ? "bg-primary" : "bg-border"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-muted-foreground block mb-1">{children}</label>;
}

export default function AdmissionsApply() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<FormData>(INITIAL);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loadingIntakes, setLoadingIntakes]     = useState(true);
  const [loadingProgrammes, setLoadingProgrammes] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [refNumber, setRefNumber]     = useState("");
  const [payRef, setPayRef]           = useState("");
  const [mpesaStep, setMpesaStep]     = useState<"idle" | "sending" | "prompted" | "confirming" | "confirmed">("idle");
  const [done, setDone]               = useState(false);

  const pathway  = PATHWAY_OPTIONS.find(p => p.code === form.pathway_code);
  const isUG     = form.pathway_code === "kuccps" || form.pathway_code === "ug_self";
  const isPG     = form.pathway_code === "masters" || form.pathway_code === "phd";
  const intake   = intakes.find(i => i.id === form.intake_id);
  const appFee   = !intake ? 1000 : (
    form.pathway_code === "phd"     ? intake.application_fee_phd :
    form.pathway_code === "masters" ? intake.application_fee_masters :
                                      intake.application_fee_undergraduate
  );
  const docList  = DOCS_BY_LEVEL[pathway?.level === "undergraduate" ? "undergraduate" : pathway?.level ?? "undergraduate"] ?? DOCS_BY_LEVEL.undergraduate;

  useEffect(() => {
    fetch(`${API}/intakes`)
      .then(r => r.json())
      .then(d => setIntakes(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingIntakes(false));
  }, []);

  useEffect(() => {
    if (!form.pathway_code) { setProgrammes([]); return; }
    setLoadingProgrammes(true);
    const level = form.pathway_code === "masters" ? "masters" :
                  form.pathway_code === "phd"     ? "phd" : "undergraduate";
    fetch(`${API}/programmes?level=${level}`)
      .then(r => r.json())
      .then(d => setProgrammes(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingProgrammes(false));
  }, [form.pathway_code]);

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function toggleDoc(doc: string) {
    setForm(f => ({
      ...f,
      docs_declared: f.docs_declared.includes(doc)
        ? f.docs_declared.filter(d => d !== doc)
        : [...f.docs_declared, doc],
    }));
  }

  const filteredProgrammes = programmes.filter(p =>
    !form.school_code || p.school_code === form.school_code
  );

  const schools = [...new Map(programmes.map(p => [p.school_code, p.school_code])).values()];

  function canNext(): boolean {
    if (step === 0) return !!form.intake_id && !!form.pathway_code;
    if (step === 1) return !!(form.first_name && form.last_name && form.phone && form.email);
    if (step === 2) return isUG ? !!form.kcse_year : !!(form.degree_institution && form.degree_field);
    if (step === 3) return !!form.programme_code;
    if (step === 4) return form.docs_declared.length >= Math.min(2, docList.length);
    if (step === 5) return mpesaStep === "confirmed";
    return true;
  }

  async function handleSendStk() {
    if (!form.payment_phone) return;
    setMpesaStep("sending");
    setError("");
    try {
      // Step 1: Submit application to get reference number
      const submitRes = await fetch(`${API}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const submitData = await submitRes.json();
      if (!submitRes.ok) {
        setError(submitData.error ?? submitData.message ?? "Failed to submit application.");
        setMpesaStep("idle");
        return;
      }
      const ref = submitData.data?.reference_number;
      setRefNumber(ref);

      // Step 2: Trigger M-Pesa STK push
      const payRes = await fetch(`${API}/apply/${ref}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.payment_phone }),
      });
      const payData = await payRes.json();
      setPayRef(payData.payment_reference ?? "");
      setMpesaStep("prompted");
    } catch {
      setError("A network error occurred. Please try again.");
      setMpesaStep("idle");
    }
  }

  async function handleConfirmPayment() {
    setMpesaStep("confirming");
    setError("");
    try {
      await fetch(`${API}/apply/${refNumber}/pay/confirm`, { method: "POST" });
      setMpesaStep("confirmed");
    } catch {
      setError("Could not confirm payment. Please try again.");
      setMpesaStep("prompted");
    }
  }

  function handleSubmitFinal() {
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background px-4 py-20">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary text-center mb-3">Application Submitted</h1>
        <p className="text-muted-foreground text-center max-w-md mb-5">
          Your application has been received by the Admissions Office. Your reference number is:
        </p>
        <div className="bg-primary text-primary-foreground font-mono font-bold text-2xl px-10 py-4 rounded-2xl mb-6 tracking-wider" data-testid="ref-number">
          {refNumber}
        </div>
        <div className="bg-secondary/40 rounded-xl p-5 text-sm text-muted-foreground max-w-sm text-center mb-8 space-y-2">
          <p>A confirmation email will be sent to <strong>{form.email}</strong>.</p>
          <p>Payment of <strong>KES {appFee.toLocaleString()}</strong> confirmed via M-Pesa.</p>
          <p>Use your reference number to track your application at any time.</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button asChild data-testid="btn-track-application">
            <Link href="/admissions/track">Track Application</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admissions/calendar">View Intake Calendar</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/admissions">Back to Admissions</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Apply Online — KAFU Admissions"
        description="Apply online to Kaimosi Friends University. Undergraduate, Postgraduate, and PhD programmes for the 2026/2027 academic year."
        path="/admissions/apply"
      />

      {/* Header */}
      <section className="py-10 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold mb-1">Online Admissions Application</h1>
          <p className="text-primary-foreground/70 text-sm">Kaimosi Friends University — Academic Year 2026/2027</p>
        </div>
      </section>

      <section className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <StepIndicator steps={STEPS} current={step} />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex gap-3 items-start text-sm text-destructive" data-testid="error-banner">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Step 0: Intake & Pathway ─────────────────────────────── */}
          {step === 0 && (
            <div data-testid="step-intake">
              <h2 className="text-xl font-serif font-bold text-primary mb-1">Select Intake &amp; Pathway</h2>
              <p className="text-muted-foreground text-sm mb-6">Choose the intake you are applying for and your admission pathway.</p>

              {/* Intake selector */}
              <div className="mb-6">
                <FieldLabel>Intake *</FieldLabel>
                {loadingIntakes ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading intakes...
                  </div>
                ) : intakes.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-3">No published intakes found. Please check back later.</p>
                ) : (
                  <div className="grid gap-3">
                    {intakes.map(i => {
                      const isOpen = i.status === "open" || i.status === "closing_soon" || i.status === "extended";
                      const isSelected = form.intake_id === i.id;
                      return (
                        <button
                          key={i.id}
                          onClick={() => update("intake_id", i.id)}
                          data-testid={`intake-btn-${i.id}`}
                          className={`p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                            isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/20" :
                            "bg-card border-border hover:border-primary/40"
                          } ${!isOpen ? "opacity-60" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-foreground">{i.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{i.academic_year} · Closes {new Date(i.close_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                            <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                              isOpen ? "bg-green-100 text-green-700" :
                              i.status === "upcoming" || i.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {i.status === "closing_soon" ? "Closing Soon" : i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pathway selector */}
              {form.intake_id && (
                <div>
                  <FieldLabel>Admission Pathway *</FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PATHWAY_OPTIONS.map(opt => (
                      <button
                        key={opt.code}
                        onClick={() => { update("pathway_code", opt.code); update("programme_code", ""); update("programme_name", ""); }}
                        data-testid={`pathway-btn-${opt.code}`}
                        className={`p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                          form.pathway_code === opt.code
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "bg-card border-border hover:border-primary/40"
                        }`}
                      >
                        <opt.icon className={`w-5 h-5 mb-2 ${form.pathway_code === opt.code ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>

                  {intake && form.pathway_code && (
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                      <p className="font-semibold text-primary mb-1">Application Fee</p>
                      <p className="text-foreground font-bold text-lg">KES {appFee.toLocaleString()}</p>
                      <p className="text-muted-foreground text-xs mt-1">Non-refundable. Payable via M-Pesa at the payment step.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Step 1: Personal Information ──────────────────────────── */}
          {step === 1 && (
            <div data-testid="step-personal">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-serif font-bold text-primary">Personal Information</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>First Name *</FieldLabel>
                    <Input value={form.first_name} onChange={e => update("first_name", e.target.value)} placeholder="John" data-testid="input-first-name" />
                  </div>
                  <div>
                    <FieldLabel>Last Name *</FieldLabel>
                    <Input value={form.last_name} onChange={e => update("last_name", e.target.value)} placeholder="Doe" data-testid="input-last-name" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Other Names (Middle Name)</FieldLabel>
                  <Input value={form.other_names} onChange={e => update("other_names", e.target.value)} placeholder="Optional" data-testid="input-other-names" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Gender</FieldLabel>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.gender} onChange={e => update("gender", e.target.value)} data-testid="select-gender">
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Date of Birth</FieldLabel>
                    <Input type="date" value={form.date_of_birth} onChange={e => update("date_of_birth", e.target.value)} data-testid="input-dob" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Nationality</FieldLabel>
                    <Input value={form.nationality} onChange={e => update("nationality", e.target.value)} data-testid="input-nationality" />
                  </div>
                  <div>
                    <FieldLabel>National ID / Passport No. *</FieldLabel>
                    <Input value={form.id_passport_number} onChange={e => update("id_passport_number", e.target.value)} placeholder="e.g. 12345678" data-testid="input-id" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Phone Number *</FieldLabel>
                    <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+254 7XX XXX XXX" data-testid="input-phone" />
                  </div>
                  <div>
                    <FieldLabel>Email Address *</FieldLabel>
                    <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" data-testid="input-email" />
                  </div>
                </div>
                <div>
                  <FieldLabel>County</FieldLabel>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.county} onChange={e => update("county", e.target.value)} data-testid="select-county">
                    <option value="">Select county</option>
                    {COUNTIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Postal Address</FieldLabel>
                  <Input value={form.postal_address} onChange={e => update("postal_address", e.target.value)} placeholder="P.O. Box XXXXX – Town" data-testid="input-postal" />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Academic Background ───────────────────────────── */}
          {step === 2 && (
            <div data-testid="step-academic">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-serif font-bold text-primary">Academic Background</h2>
              </div>

              {isUG && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border text-sm text-muted-foreground mb-2">
                    Provide your Kenya Certificate of Secondary Education (KCSE) results.
                  </div>
                  <div>
                    <FieldLabel>KCSE Index Number</FieldLabel>
                    <Input value={form.kcse_index_number} onChange={e => update("kcse_index_number", e.target.value)} placeholder="e.g. 30000003001" data-testid="input-kcse-index" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Year of Sitting *</FieldLabel>
                      <Input value={form.kcse_year} onChange={e => update("kcse_year", e.target.value)} placeholder="e.g. 2022" data-testid="input-kcse-year" />
                    </div>
                    <div>
                      <FieldLabel>Mean Grade</FieldLabel>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.mean_grade} onChange={e => update("mean_grade", e.target.value)} data-testid="select-mean-grade">
                        <option value="">Select</option>
                        {GRADES.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Secondary School Attended</FieldLabel>
                    <Input value={""} onChange={() => {}} placeholder="Name of school" data-testid="input-school-attended" />
                  </div>
                </div>
              )}

              {isPG && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border text-sm text-muted-foreground mb-2">
                    {form.pathway_code === "phd"
                      ? "Provide details of your Masters degree qualification."
                      : "Provide details of your undergraduate degree qualification."}
                  </div>
                  <div>
                    <FieldLabel>Degree Institution *</FieldLabel>
                    <Input value={form.degree_institution} onChange={e => update("degree_institution", e.target.value)} placeholder="University name" data-testid="input-degree-institution" />
                  </div>
                  <div>
                    <FieldLabel>Field / Programme of Study *</FieldLabel>
                    <Input value={form.degree_field} onChange={e => update("degree_field", e.target.value)} placeholder="e.g. Bachelor of Science in Computer Science" data-testid="input-degree-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Degree Class</FieldLabel>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.degree_class} onChange={e => update("degree_class", e.target.value)} data-testid="select-degree-class">
                        <option value="">Select</option>
                        <option value="first">First Class Honours</option>
                        <option value="upper_second">Second Class Honours (Upper)</option>
                        <option value="lower_second">Second Class Honours (Lower)</option>
                        <option value="pass">Pass</option>
                        {form.pathway_code === "phd" && <option value="masters">Masters Degree</option>}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Year of Graduation</FieldLabel>
                      <Input value={form.degree_year} onChange={e => update("degree_year", e.target.value)} placeholder="e.g. 2020" data-testid="input-degree-year" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Programme Selection ───────────────────────────── */}
          {step === 3 && (
            <div data-testid="step-programme">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-serif font-bold text-primary">Programme Selection</h2>
              </div>
              <div className="space-y-4">
                {loadingProgrammes ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading programmes...
                  </div>
                ) : (
                  <>
                    <div>
                      <FieldLabel>School / Faculty</FieldLabel>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.school_code} onChange={e => { update("school_code", e.target.value); update("programme_code", ""); update("programme_name", ""); }} data-testid="select-school">
                        <option value="">All Schools</option>
                        {schools.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>First Choice Programme *</FieldLabel>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.programme_code} onChange={e => {
                        const p = filteredProgrammes.find(p => p.programme_code === e.target.value);
                        update("programme_code", e.target.value);
                        update("programme_name", p?.programme_name ?? "");
                        update("school_code", p?.school_code ?? form.school_code);
                      }} data-testid="select-programme">
                        <option value="">Select programme</option>
                        {filteredProgrammes.map(p => (
                          <option key={p.programme_code} value={p.programme_code}>
                            {p.programme_name} ({p.programme_code}) · {p.duration}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(isUG || form.pathway_code === "ug_self") && (
                      <div>
                        <FieldLabel>Second Choice Programme (optional)</FieldLabel>
                        <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.second_choice_code} onChange={e => {
                          const p = filteredProgrammes.find(p => p.programme_code === e.target.value);
                          update("second_choice_code", e.target.value);
                          update("second_choice_name", p?.programme_name ?? "");
                        }} data-testid="select-second-choice">
                          <option value="">None</option>
                          {filteredProgrammes.filter(p => p.programme_code !== form.programme_code).map(p => (
                            <option key={p.programme_code} value={p.programme_code}>{p.programme_name} ({p.programme_code})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Step 4: Documents Declaration ─────────────────────────── */}
          {step === 4 && (
            <div data-testid="step-documents">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-serif font-bold text-primary">Documents Declaration</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Tick the documents you have ready. Physical originals and certified copies will be required on reporting day.
              </p>
              <div className="space-y-3">
                {docList.map(doc => (
                  <button
                    key={doc}
                    onClick={() => toggleDoc(doc)}
                    data-testid={`doc-check-${doc.replace(/\s+/g, "-").toLowerCase()}`}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      form.docs_declared.includes(doc)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      form.docs_declared.includes(doc) ? "bg-primary border-primary" : "border-border"
                    }`}>
                      {form.docs_declared.includes(doc) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{doc}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Please tick at least 2 documents to proceed. Document uploads are not required at this stage.
              </p>
            </div>
          )}

          {/* ── Step 5: Payment ───────────────────────────────────────── */}
          {step === 5 && (
            <div data-testid="step-payment">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-serif font-bold text-primary">Application Fee Payment</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Pay the non-refundable application fee via M-Pesa to finalise your application.
              </p>

              <div className="p-5 rounded-xl border bg-card mb-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <span className="text-muted-foreground text-sm">Application Fee ({pathway?.label})</span>
                  <span className="font-bold text-foreground text-xl">KES {appFee.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {[
                    "Enter your M-Pesa phone number below.",
                    "Click \"Send Payment Request\" — you will receive an M-Pesa prompt.",
                    "Enter your M-Pesa PIN on your phone.",
                    "Click \"I Have Paid\" to confirm and finalise your application.",
                  ].map((text, i) => (
                    <div key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">{i + 1}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PayBill info */}
              <div className="p-4 rounded-xl bg-secondary/30 border text-sm mb-5">
                <p className="font-semibold text-foreground mb-1">M-Pesa PayBill Details</p>
                <p className="text-muted-foreground">Business Number: <strong className="text-foreground">400200</strong></p>
                <p className="text-muted-foreground">Account Number: <strong className="text-foreground">Your Application Reference</strong></p>
              </div>

              <div className="space-y-4">
                <div>
                  <FieldLabel>M-Pesa Phone Number *</FieldLabel>
                  <Input
                    value={form.payment_phone}
                    onChange={e => update("payment_phone", e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    disabled={mpesaStep !== "idle"}
                    data-testid="input-payment-phone"
                  />
                </div>

                {mpesaStep === "idle" && (
                  <Button
                    className="w-full"
                    onClick={handleSendStk}
                    disabled={!form.payment_phone}
                    data-testid="btn-send-stk"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Send Payment Request — KES {appFee.toLocaleString()}
                  </Button>
                )}

                {mpesaStep === "sending" && (
                  <Button className="w-full" disabled>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting application &amp; sending STK push...
                  </Button>
                )}

                {mpesaStep === "prompted" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                      <p className="font-semibold mb-1">M-Pesa prompt sent to {form.payment_phone}</p>
                      <p>Enter your M-Pesa PIN on your phone, then click the button below.</p>
                      {payRef && <p className="mt-2 font-mono text-xs">Payment Ref: {payRef}</p>}
                    </div>
                    <Button className="w-full" onClick={handleConfirmPayment} data-testid="btn-confirm-payment">
                      <Check className="w-4 h-4 mr-2" />
                      I Have Paid — Confirm Payment
                    </Button>
                  </div>
                )}

                {mpesaStep === "confirming" && (
                  <Button className="w-full" disabled>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming payment...
                  </Button>
                )}

                {mpesaStep === "confirmed" && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 flex items-center gap-3">
                    <Check className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Payment of KES {appFee.toLocaleString()} confirmed.</p>
                      <p>Your application reference: <strong className="font-mono">{refNumber}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 6: Review ────────────────────────────────────────── */}
          {step === 6 && (
            <div data-testid="step-review">
              <div className="flex items-center gap-2 mb-6">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-serif font-bold text-primary">Review &amp; Confirm</h2>
              </div>

              <div className="space-y-0 rounded-xl border overflow-hidden mb-6">
                {[
                  { label: "Reference Number", value: refNumber, mono: true },
                  { label: "Intake",           value: intake?.name },
                  { label: "Pathway",          value: pathway?.label },
                  { label: "Full Name",        value: [form.first_name, form.other_names, form.last_name].filter(Boolean).join(" ") },
                  { label: "Email",            value: form.email },
                  { label: "Phone",            value: form.phone },
                  { label: "County",           value: form.county },
                  { label: "Programme",        value: form.programme_name || "—" },
                  { label: "Second Choice",    value: form.second_choice_name || "None" },
                  { label: "Payment",          value: `KES ${appFee.toLocaleString()} — Paid` },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex gap-4 px-5 py-3 border-b last:border-b-0 bg-card">
                    <span className="text-sm text-muted-foreground w-36 shrink-0">{label}</span>
                    <span className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-secondary/40 border text-sm text-muted-foreground mb-6">
                By finalising this application, I confirm that all information provided is accurate and complete. I understand that providing false information may lead to disqualification.
              </div>

              <Button
                className="w-full"
                onClick={handleSubmitFinal}
                disabled={submitting}
                data-testid="btn-submit-application"
              >
                {submitting
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  : <><FileCheck className="w-4 h-4 mr-2" /> Finalise Application</>
                }
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => { setStep(s => s - 1); setError(""); }}
              disabled={step === 0}
              data-testid="btn-prev-step"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>

            <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>

            {step < STEPS.length - 1 && step !== 5 && (
              <Button
                onClick={() => { setStep(s => s + 1); setError(""); }}
                disabled={!canNext()}
                data-testid="btn-next-step"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {step === 5 && mpesaStep === "confirmed" && (
              <Button
                onClick={() => { setStep(6); setError(""); }}
                data-testid="btn-next-step"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {step === 5 && mpesaStep !== "confirmed" && (
              <Button disabled data-testid="btn-next-step-disabled">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
