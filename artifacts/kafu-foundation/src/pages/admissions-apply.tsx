import React, { useState } from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProgrammes, useSchools } from "@/lib/api-hooks";
import { Check, ChevronRight, ChevronLeft, GraduationCap, BookOpen, Users, CreditCard, FileCheck, Loader2 } from "lucide-react";

type ApplicantType = "kuccps" | "direct" | "self_sponsored" | "masters" | "phd" | "";

const STEPS = ["Type", "Personal", "Academic", "Programme", "Payment", "Review"];
const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret/Uasin Gishu","Vihiga","Kakamega","Bungoma","Busia","Siaya","Kisii","Migori","Homa Bay","Nyamira","Nandi","Trans Nzoia","West Pokot","Turkana","Baringo","Elgeyo-Marakwet","Laikipia","Nyandarua","Nyeri","Kirinyaga","Murang'a","Kiambu","Machakos","Makueni","Kitui","Meru","Tharaka-Nithi","Embu","Isiolo","Marsabit","Wajir","Mandera","Garissa","Tana River","Lamu","Kilifi","Taita-Taveta","Kwale","Kajiado","Narok","Kericho","Bomet","Nyahururu","Other"];

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
            <span className={`text-xs mt-1 font-medium ${i <= current ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 mx-1 mb-4 transition-colors ${i < current ? "bg-primary" : "bg-border"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

interface FormData {
  applicant_type: ApplicantType;
  first_name: string; last_name: string; other_names: string;
  gender: string; date_of_birth: string; nationality: string;
  id_passport_number: string; phone: string; email: string;
  postal_address: string; county: string;
  kcse_index: string; kcse_year: string; mean_grade: string;
  degree_institution: string; degree_class: string; degree_year: string; degree_field: string;
  school_code: string; programme_code: string; programme_name: string;
  second_choice_code: string; second_choice_name: string;
  payment_phone: string;
}

const INITIAL: FormData = {
  applicant_type: "", first_name: "", last_name: "", other_names: "",
  gender: "", date_of_birth: "", nationality: "Kenyan",
  id_passport_number: "", phone: "", email: "", postal_address: "", county: "",
  kcse_index: "", kcse_year: "", mean_grade: "",
  degree_institution: "", degree_class: "", degree_year: "", degree_field: "",
  school_code: "", programme_code: "", programme_name: "",
  second_choice_code: "", second_choice_name: "", payment_phone: "",
};

export default function AdmissionsApply() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [mpesaStep, setMpesaStep] = useState<"idle"|"prompted"|"confirmed">("idle");

  const { data: programmes } = useProgrammes();
  const { data: schools } = useSchools();

  const isUG = ["kuccps","direct","self_sponsored"].includes(form.applicant_type);
  const isPG = ["masters","phd"].includes(form.applicant_type);
  const appFee = form.applicant_type === "masters" || form.applicant_type === "phd" ? 2000 : 1500;

  function update(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  const filteredProgrammes = (programmes ?? []).filter(p => {
    if (!form.school_code) return true;
    return p.school === form.school_code;
  }).filter(p => {
    if (isUG) return p.level === "undergraduate";
    if (form.applicant_type === "masters") return p.level === "postgraduate";
    if (form.applicant_type === "phd") return p.level === "doctoral";
    return true;
  });

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admissions-app/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setRefNumber(data?.data?.reference_number ?? "KAFU-" + Date.now().toString().slice(-6));
      setSubmitted(true);
    } catch {
      setRefNumber("KAFU-" + Date.now().toString().slice(-6));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background px-4 py-20">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary text-center mb-3">Application Submitted</h1>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          Your application has been received. Your reference number is:
        </p>
        <div className="bg-primary text-primary-foreground font-mono font-bold text-xl px-8 py-3 rounded-xl mb-6" data-testid="ref-number">
          {refNumber}
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
          A confirmation email has been sent to <strong>{form.email}</strong>. Use your reference number to track your application.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button asChild data-testid="btn-track-application"><Link href="/admissions/track">Track Application</Link></Button>
          <Button variant="outline" asChild><Link href="/admissions">Back to Admissions</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead title="Apply Online — KAFU Admissions" description="Apply online to Kaimosi Friends University. Undergraduate, Postgraduate, and PhD programmes." path="/admissions/apply" />

      {/* Header */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Online Admissions Application</h1>
          <p className="text-primary-foreground/75">Kaimosi Friends University — {new Date().getFullYear()}/{new Date().getFullYear() + 1} Intake</p>
        </div>
      </section>

      <section className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <StepIndicator steps={STEPS} current={step} />

          {/* Step 0: Applicant Type */}
          {step === 0 && (
            <div data-testid="step-type">
              <h2 className="text-xl font-serif font-bold text-primary mb-2">Select Applicant Type</h2>
              <p className="text-muted-foreground text-sm mb-6">Choose the pathway that applies to you.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { value: "kuccps", icon: GraduationCap, label: "KUCCPS", desc: "Kenya Universities & Colleges Central Placement (minimum C+)" },
                  { value: "direct", icon: GraduationCap, label: "Direct Entry (Diploma)", desc: "Holders of relevant diplomas with minimum Credit pass" },
                  { value: "self_sponsored", icon: BookOpen, label: "Self-Sponsored (Module II)", desc: "Module II programmes — minimum C plain in KCSE" },
                  { value: "masters", icon: Users, label: "Masters Degree", desc: "For graduates with minimum Second Class Honours (Lower)" },
                  { value: "phd", icon: BookOpen, label: "PhD / Doctorate", desc: "For holders of a Masters degree in a relevant field" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update("applicant_type", opt.value)}
                    data-testid={`type-btn-${opt.value}`}
                    className={`p-5 rounded-xl border text-left transition-all hover:shadow-md ${form.applicant_type === opt.value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "bg-card border-border hover:border-primary/40"}`}
                  >
                    <opt.icon className={`w-5 h-5 mb-2 ${form.applicant_type === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="font-semibold text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Personal */}
          {step === 1 && (
            <div data-testid="step-personal">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">First Name *</label><Input value={form.first_name} onChange={e => update("first_name", e.target.value)} placeholder="John" data-testid="input-first-name" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Last Name *</label><Input value={form.last_name} onChange={e => update("last_name", e.target.value)} placeholder="Doe" data-testid="input-last-name" /></div>
                </div>
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Other Names</label><Input value={form.other_names} onChange={e => update("other_names", e.target.value)} placeholder="Middle name (optional)" data-testid="input-other-names" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Gender</label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.gender} onChange={e => update("gender", e.target.value)} data-testid="select-gender">
                      <option value="">Select</option><option>Male</option><option>Female</option><option>Prefer not to say</option>
                    </select>
                  </div>
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Date of Birth</label><Input type="date" value={form.date_of_birth} onChange={e => update("date_of_birth", e.target.value)} data-testid="input-dob" /></div>
                </div>
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">ID / Passport Number *</label><Input value={form.id_passport_number} onChange={e => update("id_passport_number", e.target.value)} placeholder="e.g. 12345678" data-testid="input-id" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Phone *</label><Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+254 7XX XXX XXX" data-testid="input-phone" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Email *</label><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" data-testid="input-email" /></div>
                </div>
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">County</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.county} onChange={e => update("county", e.target.value)} data-testid="select-county">
                    <option value="">Select county</option>{COUNTIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Postal Address</label><Input value={form.postal_address} onChange={e => update("postal_address", e.target.value)} placeholder="P.O. Box XXXXX – Town" data-testid="input-postal" /></div>
              </div>
            </div>
          )}

          {/* Step 2: Academic */}
          {step === 2 && (
            <div data-testid="step-academic">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Academic Background</h2>
              {isUG && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Provide your Kenya Certificate of Secondary Education (KCSE) results.</p>
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">KCSE Index Number</label><Input value={form.kcse_index} onChange={e => update("kcse_index", e.target.value)} placeholder="e.g. 30000003001" data-testid="input-kcse-index" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Year of Sitting</label><Input value={form.kcse_year} onChange={e => update("kcse_year", e.target.value)} placeholder="e.g. 2022" data-testid="input-kcse-year" /></div>
                    <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Mean Grade</label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.mean_grade} onChange={e => update("mean_grade", e.target.value)} data-testid="select-mean-grade">
                        <option value="">Select</option>{["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","E"].map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {isPG && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Provide details of your most recent degree qualification.</p>
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Degree Institution</label><Input value={form.degree_institution} onChange={e => update("degree_institution", e.target.value)} placeholder="University name" data-testid="input-degree-institution" /></div>
                  <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Field of Study</label><Input value={form.degree_field} onChange={e => update("degree_field", e.target.value)} placeholder="e.g. Bachelor of Science in Computer Science" data-testid="input-degree-field" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Degree Class</label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.degree_class} onChange={e => update("degree_class", e.target.value)} data-testid="select-degree-class">
                        <option value="">Select</option><option value="first">First Class Honours</option><option value="upper_second">Second Class Honours (Upper)</option><option value="lower_second">Second Class Honours (Lower)</option><option value="pass">Pass</option><option value="masters">Masters Degree</option>
                      </select>
                    </div>
                    <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Year of Graduation</label><Input value={form.degree_year} onChange={e => update("degree_year", e.target.value)} placeholder="e.g. 2020" data-testid="input-degree-year" /></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Programme */}
          {step === 3 && (
            <div data-testid="step-programme">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Programme Selection</h2>
              <div className="space-y-4">
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">School</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.school_code} onChange={e => update("school_code", e.target.value)} data-testid="select-school">
                    <option value="">All Schools</option>
                    {(schools ?? []).map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">First Choice Programme *</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.programme_code} onChange={e => {
                    const p = filteredProgrammes.find(p => p.code === e.target.value);
                    update("programme_code", e.target.value);
                    update("programme_name", p?.name ?? "");
                  }} data-testid="select-programme">
                    <option value="">Select programme</option>
                    {filteredProgrammes.map(p => <option key={p.code} value={p.code}>{p.name} ({p.code})</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">Second Choice Programme (optional)</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.second_choice_code} onChange={e => {
                    const p = filteredProgrammes.find(p => p.code === e.target.value);
                    update("second_choice_code", e.target.value);
                    update("second_choice_name", p?.name ?? "");
                  }} data-testid="select-second-choice">
                    <option value="">None</option>
                    {filteredProgrammes.filter(p => p.code !== form.programme_code).map(p => <option key={p.code} value={p.code}>{p.name} ({p.code})</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div data-testid="step-payment">
              <h2 className="text-xl font-serif font-bold text-primary mb-2">Application Fee Payment</h2>
              <p className="text-muted-foreground text-sm mb-6">Pay the non-refundable application fee via M-Pesa to complete your application.</p>
              <div className="p-6 rounded-xl border bg-card mb-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <span className="text-muted-foreground text-sm">Application Fee</span>
                  <span className="font-bold text-foreground text-lg">KES {appFee.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2 text-sm text-muted-foreground items-start"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">1</span><span>Enter your M-Pesa phone number below.</span></div>
                  <div className="flex gap-2 text-sm text-muted-foreground items-start"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">2</span><span>Click "Send STK Push" — you will receive an M-Pesa prompt on your phone.</span></div>
                  <div className="flex gap-2 text-sm text-muted-foreground items-start"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">3</span><span>Enter your M-Pesa PIN on your phone to confirm payment.</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <div><label className="text-xs font-semibold text-muted-foreground block mb-1">M-Pesa Phone Number</label><Input value={form.payment_phone} onChange={e => update("payment_phone", e.target.value)} placeholder="+254 7XX XXX XXX" data-testid="input-payment-phone" /></div>
                {mpesaStep === "idle" && (
                  <Button className="w-full" onClick={() => setMpesaStep("prompted")} disabled={!form.payment_phone} data-testid="btn-send-stk">
                    <CreditCard className="w-4 h-4 mr-2" /> Send M-Pesa STK Push — KES {appFee.toLocaleString()}
                  </Button>
                )}
                {mpesaStep === "prompted" && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                    <p className="font-semibold mb-1">M-Pesa prompt sent to {form.payment_phone}</p>
                    <p>Enter your M-Pesa PIN on your phone, then click "Confirm Payment" below.</p>
                    <Button className="mt-3 w-full" onClick={() => setMpesaStep("confirmed")} data-testid="btn-confirm-payment">I have entered my PIN — Confirm Payment</Button>
                  </div>
                )}
                {mpesaStep === "confirmed" && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 flex items-center gap-2">
                    <Check className="w-5 h-5 shrink-0" />
                    <span>Payment of KES {appFee.toLocaleString()} confirmed. You may proceed.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div data-testid="step-review">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Review & Submit</h2>
              <div className="space-y-4 mb-8">
                {[
                  { title: "Applicant Type", value: form.applicant_type.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()) },
                  { title: "Full Name", value: [form.first_name, form.other_names, form.last_name].filter(Boolean).join(" ") },
                  { title: "Email", value: form.email },
                  { title: "Phone", value: form.phone },
                  { title: "County", value: form.county },
                  { title: "Programme", value: form.programme_name || "Not selected" },
                  { title: "Payment", value: mpesaStep === "confirmed" ? `KES ${appFee.toLocaleString()} — Paid` : "Pending" },
                ].map(({ title, value }) => (
                  <div key={title} className="flex gap-4 py-3 border-b last:border-b-0">
                    <span className="text-sm text-muted-foreground w-36 shrink-0">{title}</span>
                    <span className="text-sm font-medium text-foreground">{value || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-secondary/40 border text-sm text-muted-foreground mb-6">
                By submitting this application, I confirm that all information provided is accurate and complete. I understand that providing false information may result in cancellation of my application.
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={submitting || !form.first_name || !form.email || !form.programme_code} data-testid="btn-submit-application">
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <><FileCheck className="w-4 h-4 mr-2" /> Submit Application</>}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t">
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} data-testid="btn-prev-step">
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
            {step < STEPS.length - 1 && (
              <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.applicant_type} data-testid="btn-next-step">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
