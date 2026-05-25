import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Check, Loader2, Upload, Trash2, Eye, CreditCard, Phone, AlertCircle, CheckCircle2, GraduationCap, BookOpen, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Pathway { id: number; code: string; name: string; description: string; level: string; requires_payment: boolean; requires_kuccps_verification: boolean; }
interface Intake  { id: number; name: string; academic_year: string; intake_period: string; open_at: string; close_at: string; status: string; is_published: boolean; application_fee_undergraduate: number; application_fee_masters: number; application_fee_phd: number; }
interface Programme { id: number; programme_code: string; programme_name: string; school_code: string; department: string; level: string; duration: string; mode: string; minimum_requirements: string; required_documents: string | string[]; available_pathways?: string | string[]; }
interface UploadedDoc { document_type: string; original_filename: string; }
interface WizardState {
  step: number;
  pathway: Pathway | null;
  intake: Intake | null;
  programme: Programme | null;
  token: string;
  applicantName: string;
  reference: string;
  applicationNumber: string;
  kuccpsPlacement: Record<string, unknown> | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STEPS = ["Pathway","Intake & Programme","Your Account","Personal Details","Qualifications","Documents","Review & Declare","Payment","Confirmation"];
const SCHOOL_NAMES: Record<string, string> = {
  SESS: "Education & Social Sciences", SBE: "Business & Economics",
  SCIT: "Computing & IT", SOS: "Science", SHS: "Health Sciences",
};
const DOC_LABELS: Record<string, string> = {
  national_id: "National ID (both sides)", passport: "Passport (bio-data page)",
  birth_cert: "Birth Certificate", kcse_cert: "KCSE Certificate",
  kcse_result_slip: "KCSE Result Slip", transcript: "Academic Transcript",
  degree_cert: "Undergraduate Degree Certificate", masters_cert: "Masters Degree Certificate",
  passport_photo: "Passport-size Photograph", concept_note: "Research Concept Note / Proposal",
  referee_letter: "Referee Letter",
};
const PATHWAY_ICONS: Record<string, React.ReactNode> = {
  kuccps: <GraduationCap className="w-6 h-6" />,
  ug_self: <Users className="w-6 h-6" />,
  masters: <BookOpen className="w-6 h-6" />,
  phd: <FileText className="w-6 h-6" />,
};
const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

async function apiGet(path: string) {
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function apiPost(path: string, body: unknown, token?: string) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const r = await fetch(`${BASE}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
  const json = await r.json();
  if (!r.ok) throw new Error(json.error ?? "Request failed");
  return json;
}
async function apiPatch(path: string, body: unknown, token: string) {
  const r = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.error ?? "Request failed");
  return json;
}
async function uploadDoc(ref: string, docType: string, docLabel: string, file: File, token: string) {
  const fd = new FormData();
  fd.append("document_type", docType);
  fd.append("document_label", docLabel);
  fd.append("file", file);
  const r = await fetch(`${BASE}/api/applications/${ref}/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.error ?? "Upload failed");
  return json;
}

// ── Step 0 — Pathway Selection ────────────────────────────────────────────────
function StepPathway({ pathways, onSelect }: { pathways: Pathway[]; onSelect: (p: Pathway) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
        Choose the correct admission pathway so that your application is processed under the right category. KUCCPS applicants should only use the KUCCPS pathway if they have been officially placed at Kaimosi Friends University.
      </div>
      <div className="grid gap-3">
        {pathways.map(p => (
          <button key={p.id} onClick={() => onSelect(p)}
            data-testid={`pathway-${p.code}`}
            className="flex items-start gap-4 w-full rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all p-4 text-left group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              {PATHWAY_ICONS[p.code] ?? <GraduationCap className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{p.description}</div>
              {!p.requires_payment && <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">No application fee required</span>}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 1 — KUCCPS Verification ─────────────────────────────────────────────
function StepKuccps({ pathway, onVerified }: { pathway: Pathway; onVerified: (data: Record<string,unknown>) => void }) {
  const [form, setForm] = useState({ kcse_index_number: "", kcse_year: "", id_document_number: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleVerify = async () => {
    if (!form.kcse_index_number || !form.kcse_year || !form.id_document_number) {
      setError("All fields are required."); return;
    }
    setLoading(true); setError("");
    try {
      const res = await apiPost("/api/admissions-app/kuccps/verify", form);
      if (!res.verified) { setError(res.message); return; }
      onVerified(res);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Enter your KCSE details to verify your KUCCPS placement at Kaimosi Friends University.</p>
      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
      <div className="space-y-3">
        <Field label="KCSE Index Number" required><input data-testid="kuccps-index" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.kcse_index_number} onChange={e => set("kcse_index_number", e.target.value)} placeholder="e.g. 12345678001" /></Field>
        <Field label="KCSE Year" required><input data-testid="kuccps-year" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.kcse_year} onChange={e => set("kcse_year", e.target.value)} placeholder="e.g. 2024" /></Field>
        <Field label="National ID / Birth Certificate Number" required><input data-testid="kuccps-id" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.id_document_number} onChange={e => set("id_document_number", e.target.value)} placeholder="ID or birth cert number" /></Field>
      </div>
      <Button data-testid="kuccps-verify" onClick={handleVerify} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : "Verify KUCCPS Placement"}
      </Button>
      <p className="text-xs text-center text-muted-foreground">Having trouble? <a href="mailto:admissions@kafu.ac.ke" className="text-primary underline">Contact Admissions Office</a></p>
    </div>
  );
}

// ── Step 1b — Intake + Programme Selection ────────────────────────────────────
function StepIntakeProgramme({ pathway, intake, setIntake, programme, setProgramme, intakes, programmes, loading }:
  { pathway: Pathway; intake: Intake|null; setIntake: (i: Intake)=>void; programme: Programme|null; setProgramme: (p: Programme)=>void; intakes: Intake[]; programmes: Programme[]; loading: boolean }) {

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState(
    pathway.code === "kuccps" || pathway.code === "ug_self" ? "undergraduate" :
    pathway.code === "masters" ? "masters" : "phd"
  );

  const filteredProgs = programmes.filter(p => {
    const pathways = typeof p.available_pathways === "string" ? JSON.parse(p.available_pathways) : p.available_pathways;
    const matchPath = pathways?.includes(pathway.code);
    const matchLevel = !levelFilter || p.level === levelFilter;
    const matchSearch = !search || p.programme_name.toLowerCase().includes(search.toLowerCase()) || p.school_code.toLowerCase().includes(search.toLowerCase());
    return matchPath && matchLevel && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Intake selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Select Intake <span className="text-red-500">*</span></label>
        <div className="grid gap-2">
          {intakes.filter(i => i.status !== "archived").map(i => {
            const isOpen = i.status === "open" || i.status === "closing_soon" || i.status === "extended";
            return (
              <label key={i.id} data-testid={`intake-${i.id}`}
                className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${intake?.id === i.id ? "border-primary bg-primary/5" : isOpen ? "border-border hover:border-primary/50" : "border-border bg-muted/30 opacity-60 cursor-not-allowed"}`}>
                <input type="radio" name="intake" checked={intake?.id === i.id} disabled={!isOpen}
                  onChange={() => isOpen && setIntake(i)} className="accent-primary" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.academic_year} — Close: {new Date(i.close_at).toLocaleDateString("en-KE")}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isOpen ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {isOpen ? "Open" : "Closed"}
                </span>
              </label>
            );
          })}
        </div>
        {intakes.every(i => !["open","closing_soon","extended"].includes(i.status)) && (
          <div className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Applications for this intake are currently closed. Please check the admissions calendar for upcoming application windows.
          </div>
        )}
      </div>

      {/* Programme selector */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Select Programme <span className="text-red-500">*</span></label>
        <input data-testid="prog-search" type="search" placeholder="Search programmes..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-2" />
        {loading ? <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div> : (
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {filteredProgs.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No programmes match your search.</p>}
            {filteredProgs.map(p => (
              <label key={p.id} data-testid={`prog-${p.id}`}
                className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${programme?.id === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                <input type="radio" name="programme" checked={programme?.id === p.id} onChange={() => setProgramme(p)} className="accent-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{p.programme_name}</div>
                  <div className="text-xs text-muted-foreground">{SCHOOL_NAMES[p.school_code] ?? p.school_code} · {p.duration} · {p.mode.replace("_"," ")}</div>
                  {p.minimum_requirements && <div className="text-xs text-primary/80 mt-0.5">Entry: {p.minimum_requirements}</div>}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {programme && intake && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary/80 space-y-1">
          <p className="font-semibold text-sm text-primary">Selected Programme Details</p>
          <p><strong>Programme:</strong> {programme.programme_name}</p>
          <p><strong>School:</strong> {SCHOOL_NAMES[programme.school_code] ?? programme.school_code}</p>
          <p><strong>Duration:</strong> {programme.duration}</p>
          <p><strong>Entry Requirement:</strong> {programme.minimum_requirements}</p>
          <p><strong>Application Fee:</strong> KES {(programme.level === "masters" ? intake.application_fee_masters : programme.level === "phd" ? intake.application_fee_phd : intake.application_fee_undergraduate).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

// ── Step 2 — Account ──────────────────────────────────────────────────────────
function StepAccount({ onRegister, onLogin }: { onRegister: (token:string,name:string)=>void; onLogin: (token:string,name:string)=>void }) {
  const [mode, setMode] = useState<"register"|"login">("register");
  const [form, setForm] = useState({ email:"", full_name:"", phone:"", password:"", confirm_password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async () => {
    setError("");
    if (mode === "register") {
      if (!form.email || !form.full_name || !form.password) { setError("Please fill all required fields."); return; }
      if (form.password !== form.confirm_password) { setError("Passwords do not match."); return; }
      if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    } else {
      if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    }
    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/api/applications/register" : "/api/applications/login";
      const body = mode === "register" ? { email: form.email, full_name: form.full_name, phone: form.phone, password: form.password } : { email: form.email, password: form.password };
      const res = await apiPost(endpoint, body);
      if (mode === "register") onRegister(res.token, form.full_name);
      else onLogin(res.token, res.full_name);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border overflow-hidden">
        <button data-testid="tab-register" onClick={() => setMode("register")} className={`flex-1 py-2 text-sm font-medium transition-colors ${mode==="register" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>New Applicant</button>
        <button data-testid="tab-login" onClick={() => setMode("login")} className={`flex-1 py-2 text-sm font-medium transition-colors ${mode==="login" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>Existing Applicant</button>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
      <div className="space-y-3">
        {mode === "register" && <Field label="Full Legal Name" required><input data-testid="acc-name" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.full_name} onChange={e => set("full_name",e.target.value)} placeholder="As it appears on your ID/Passport" /></Field>}
        <Field label="Email Address" required><input data-testid="acc-email" type="email" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.email} onChange={e => set("email",e.target.value)} placeholder="your@email.com" /></Field>
        {mode === "register" && <Field label="Phone Number"><input data-testid="acc-phone" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.phone} onChange={e => set("phone",e.target.value)} placeholder="+254 7XX XXX XXX" /></Field>}
        <Field label="Password" required><input data-testid="acc-password" type="password" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.password} onChange={e => set("password",e.target.value)} placeholder="Minimum 8 characters" /></Field>
        {mode === "register" && <Field label="Confirm Password" required><input data-testid="acc-confirm" type="password" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.confirm_password} onChange={e => set("confirm_password",e.target.value)} /></Field>}
      </div>
      <Button data-testid="acc-submit" onClick={handleSubmit} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Please wait...</> : mode === "register" ? "Create Account & Continue" : "Log In & Continue"}
      </Button>
    </div>
  );
}

// ── Step 3 — Personal Details ─────────────────────────────────────────────────
function StepPersonal({ token, reference, onSaved }: { token: string; reference: string; onSaved: () => void }) {
  const [form, setForm] = useState({ full_name:"", gender:"male", date_of_birth:"", nationality:"Kenyan", id_document_type:"national_id", id_document_number:"", county:"", sub_county:"", postal_address:"", physical_address:"", emergency_contact_name:"", emergency_contact_phone:"", has_disability: false, disability_description:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string | boolean) => setForm(f => ({...f,[k]:v}));
  const COUNTIES = ["Vihiga","Kakamega","Kisumu","Siaya","Homabay","Migori","Kericho","Nandi","Uasin Gishu","Bungoma","Busia","Trans Nzoia","Elgeyo Marakwet","Baringo","West Pokot","Turkana","Samburu","Laikipia","Nakuru","Nairobi","Kiambu","Muranga","Nyeri","Kirinyaga","Embu","Tharaka Nithi","Meru","Isiolo","Marsabit","Wajir","Mandera","Garissa","Tana River","Lamu","Kwale","Kilifi","Mombasa","Taita Taveta","Makueni","Machakos","Kitui","Narok","Kajiado","Bomet","Nyamira","Kisii","Migori"].sort();

  const handleSave = async () => {
    if (!form.full_name || !form.date_of_birth || !form.id_document_number) { setError("Please fill all required fields."); return; }
    setLoading(true); setError("");
    try {
      await apiPatch(`/api/applications/${reference}/personal`, form, token);
      onSaved();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Legal Name" required className="col-span-2"><input data-testid="pd-name" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.full_name} onChange={e => set("full_name",e.target.value)} placeholder="As per ID/Passport" /></Field>
        <Field label="Gender" required>
          <select data-testid="pd-gender" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.gender} onChange={e => set("gender",e.target.value)}>
            <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
          </select>
        </Field>
        <Field label="Date of Birth" required><input data-testid="pd-dob" type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.date_of_birth} onChange={e => set("date_of_birth",e.target.value)} /></Field>
        <Field label="Nationality" required><input data-testid="pd-nationality" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.nationality} onChange={e => set("nationality",e.target.value)} /></Field>
        <Field label="ID Document Type" required>
          <select data-testid="pd-id-type" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.id_document_type} onChange={e => set("id_document_type",e.target.value)}>
            <option value="national_id">National ID</option><option value="passport">Passport</option><option value="birth_cert">Birth Certificate</option>
          </select>
        </Field>
        <Field label="ID/Passport Number" required className="col-span-2"><input data-testid="pd-id-num" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.id_document_number} onChange={e => set("id_document_number",e.target.value)} /></Field>
        <Field label="County">
          <select data-testid="pd-county" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.county} onChange={e => set("county",e.target.value)}>
            <option value="">-- Select County --</option>
            {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Sub-County"><input data-testid="pd-subcounty" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.sub_county} onChange={e => set("sub_county",e.target.value)} /></Field>
        <Field label="Postal Address" className="col-span-2"><input data-testid="pd-postal" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.postal_address} onChange={e => set("postal_address",e.target.value)} placeholder="P.O. Box XXXXX - YYYYY, Town" /></Field>
        <Field label="Emergency Contact Name"><input data-testid="pd-emrg-name" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.emergency_contact_name} onChange={e => set("emergency_contact_name",e.target.value)} /></Field>
        <Field label="Emergency Contact Phone"><input data-testid="pd-emrg-phone" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.emergency_contact_phone} onChange={e => set("emergency_contact_phone",e.target.value)} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input data-testid="pd-disability" type="checkbox" className="accent-primary" checked={form.has_disability} onChange={e => set("has_disability",e.target.checked)} />
        I have a disability or special needs
      </label>
      {form.has_disability && <Field label="Describe disability/special needs"><input data-testid="pd-disability-desc" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.disability_description} onChange={e => set("disability_description",e.target.value)} /></Field>}
      <Button data-testid="pd-save" onClick={handleSave} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white mt-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : "Save & Continue"}
      </Button>
    </div>
  );
}

// ── Step 4 — Academic Qualifications ─────────────────────────────────────────
function StepQualifications({ token, reference, pathway, onSaved }: { token: string; reference: string; pathway: Pathway; onSaved: () => void }) {
  const isUG  = pathway.code === "kuccps" || pathway.code === "ug_self";
  const isMasters = pathway.code === "masters";

  const [form, setForm] = useState({ qualification_level: isUG ? "kcse" : isMasters ? "undergraduate" : "masters", institution_name:"", programme_name:"", completion_year:"", grade_or_classification:"", kcse_index_number:"", kcse_year:"", mean_grade:"", school_attended:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}));

  const handleSave = async () => {
    setLoading(true); setError("");
    try {
      await apiPatch(`/api/applications/${reference}/qualifications`, form, token);
      onSaved();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const GRADES = ["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","E"];
  const DEGREE_CLASSES = ["First Class Honours","Second Class Honours (Upper Division)","Second Class Honours (Lower Division)","Pass","Unclassified"];
  const YEARS = Array.from({length:30}, (_,i) => String(new Date().getFullYear() - i));

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

      {isUG && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">KCSE Results</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="KCSE Index Number" required><input data-testid="qua-kcse-idx" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.kcse_index_number} onChange={e => set("kcse_index_number",e.target.value)} /></Field>
            <Field label="KCSE Year" required>
              <select data-testid="qua-kcse-yr" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.kcse_year} onChange={e => set("kcse_year",e.target.value)}>
                <option value="">-- Year --</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="Mean Grade" required>
              <select data-testid="qua-mean" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.mean_grade} onChange={e => set("mean_grade",e.target.value)}>
                <option value="">-- Grade --</option>{GRADES.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Secondary School" required><input data-testid="qua-school" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.school_attended} onChange={e => set("school_attended",e.target.value)} /></Field>
          </div>
        </div>
      )}

      {(isMasters || pathway.code === "phd") && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{isMasters ? "Undergraduate" : "Masters"} Degree Details</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Institution" required className="col-span-2"><input data-testid="qua-inst" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.institution_name} onChange={e => set("institution_name",e.target.value)} /></Field>
            <Field label="Degree Programme" required className="col-span-2"><input data-testid="qua-prog" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.programme_name} onChange={e => set("programme_name",e.target.value)} /></Field>
            <Field label="Graduation Year" required>
              <select data-testid="qua-grad-yr" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.completion_year} onChange={e => set("completion_year",e.target.value)}>
                <option value="">-- Year --</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="Degree Classification" required>
              <select data-testid="qua-class" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.grade_or_classification} onChange={e => set("grade_or_classification",e.target.value)}>
                <option value="">-- Select --</option>{DEGREE_CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>
      )}

      <Button data-testid="qua-save" onClick={handleSave} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white mt-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : "Save & Continue"}
      </Button>
    </div>
  );
}

// ── Step 5 — Documents ────────────────────────────────────────────────────────
function StepDocuments({ token, reference, programme, onSaved }: { token: string; reference: string; programme: Programme; onSaved: (docs: UploadedDoc[]) => void }) {
  const requiredDocs: string[] = typeof programme.required_documents === "string"
    ? JSON.parse(programme.required_documents)
    : programme.required_documents ?? [];

  const [uploads, setUploads] = useState<Record<string, { file?: File; status: "idle"|"uploading"|"done"|"error"; name?: string }>>(() =>
    Object.fromEntries(requiredDocs.map(d => [d, { status: "idle" }]))
  );
  const [error, setError] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = async (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError(`${DOC_LABELS[docType] ?? docType}: File must be under 5MB.`); return; }
    setUploads(u => ({...u, [docType]: { file, status: "uploading", name: file.name }}));
    setError("");
    try {
      await uploadDoc(reference, docType, DOC_LABELS[docType] ?? docType, file, token);
      setUploads(u => ({...u, [docType]: { file, status: "done", name: file.name }}));
    } catch (e: unknown) {
      setError((e as Error).message);
      setUploads(u => ({...u, [docType]: { status: "error" }}));
    }
  };

  const allDone = requiredDocs.every(d => uploads[d]?.status === "done");

  const handleNext = () => {
    const done = Object.entries(uploads).filter(([,v]) => v.status === "done").map(([k]) => ({ document_type: k, original_filename: uploads[k].name ?? "" }));
    onSaved(done);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Upload the required supporting documents. Accepted formats: PDF, JPG, PNG (max 5MB each).</p>
      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

      <div className="space-y-2">
        {requiredDocs.map(docType => {
          const u = uploads[docType];
          return (
            <div key={docType} data-testid={`doc-${docType}`} className="flex items-center gap-3 border rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{DOC_LABELS[docType] ?? docType} <span className="text-red-500">*</span></div>
                {u?.name && <div className="text-xs text-muted-foreground truncate">{u.name}</div>}
              </div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                ref={el => { fileRefs.current[docType] = el; }}
                onChange={e => handleFileChange(docType, e)} />
              {u?.status === "done" ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <button onClick={() => fileRefs.current[docType]?.click()} className="text-xs text-primary underline">Replace</button>
                </div>
              ) : u?.status === "uploading" ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <button data-testid={`upload-${docType}`} onClick={() => fileRefs.current[docType]?.click()}
                  className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-medium transition-colors">
                  <Upload className="w-3.5 h-3.5" />Upload
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Button data-testid="docs-next" onClick={handleNext} disabled={!allDone} className="w-full bg-primary hover:bg-primary/90 text-white">
        Continue to Review
      </Button>
      {!allDone && <p className="text-xs text-center text-amber-700">Please upload all required documents to continue.</p>}
    </div>
  );
}

// ── Step 6 — Review + Declarations ───────────────────────────────────────────
function StepReview({ token, reference, wizardState, uploadedDocs, onAccepted }: { token: string; reference: string; wizardState: WizardState; uploadedDocs: UploadedDoc[]; onAccepted: () => void }) {
  const [declarations, setDeclarations] = useState({ truth: false, authentic: false, consent: false, aware: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allChecked = Object.values(declarations).every(Boolean);

  const handleAccept = async () => {
    setLoading(true); setError("");
    try {
      await apiPatch(`/api/applications/${reference}/declarations`, {}, token);
      onAccepted();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const row = (label: string, value: string) => (
    <div className="flex justify-between gap-4 py-1.5 border-b last:border-0 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-primary px-4 py-2.5 text-white text-sm font-semibold">Application Summary</div>
        <div className="px-4 py-3 space-y-0">
          {row("Pathway", wizardState.pathway?.name ?? "—")}
          {row("Intake", wizardState.intake?.name ?? "—")}
          {row("Programme", wizardState.programme?.programme_name ?? "—")}
          {row("Level", wizardState.programme?.level ?? "—")}
          {row("Academic Year", wizardState.intake?.academic_year ?? "—")}
          {row("Application Fee", wizardState.pathway?.requires_payment ? `KES ${((wizardState.programme?.level === "masters" ? wizardState.intake?.application_fee_masters : wizardState.programme?.level === "phd" ? wizardState.intake?.application_fee_phd : wizardState.intake?.application_fee_undergraduate) ?? 1000).toLocaleString()}` : "Not required")}
        </div>
      </div>

      {uploadedDocs.length > 0 && (
        <div className="border rounded-xl overflow-hidden">
          <div className="bg-muted px-4 py-2.5 text-sm font-semibold">Uploaded Documents</div>
          <div className="px-4 py-3 space-y-1.5">
            {uploadedDocs.map(d => (
              <div key={d.document_type} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{DOC_LABELS[d.document_type] ?? d.document_type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold">Declarations</p>
        {[
          { key: "truth", text: "I declare that all information provided in this application is true and accurate to the best of my knowledge." },
          { key: "authentic", text: "All documents uploaded are authentic originals or certified copies. I understand that submission of false documents may lead to disqualification." },
          { key: "consent", text: "I consent to KAFU verifying and processing my submitted data for the purpose of this application." },
          { key: "aware", text: "I am aware of and accept KAFU's admissions policies and conditions." },
        ].map(d => (
          <label key={d.key} data-testid={`decl-${d.key}`} className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" className="accent-primary mt-0.5 shrink-0" checked={declarations[d.key as keyof typeof declarations]} onChange={e => setDeclarations(prev => ({...prev,[d.key]:e.target.checked}))} />
            <span className="text-sm text-muted-foreground leading-relaxed">{d.text}</span>
          </label>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

      <Button data-testid="review-accept" onClick={handleAccept} disabled={!allChecked || loading} className="w-full bg-primary hover:bg-primary/90 text-white">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : "I Accept — Proceed to Payment"}
      </Button>
    </div>
  );
}

// ── Step 7 — Payment ──────────────────────────────────────────────────────────
function StepPayment({ token, reference, pathway, intake, programme, onPaid, onFree }: { token: string; reference: string; pathway: Pathway; intake: Intake; programme: Programme; onPaid: () => void; onFree: () => void }) {
  const [method, setMethod] = useState<"mpesa"|"bank">("mpesa");
  const [phone, setPhone] = useState("");
  const [payRef, setPayRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [initiated, setInitiated] = useState(false);
  const [error, setError] = useState("");

  const fee = programme.level === "masters" ? intake.application_fee_masters : programme.level === "phd" ? intake.application_fee_phd : intake.application_fee_undergraduate;

  useEffect(() => { if (!pathway.requires_payment) onFree(); }, [pathway]);

  const handleInitiate = async () => {
    if (method === "mpesa" && !phone) { setError("Please enter your M-Pesa phone number."); return; }
    setLoading(true); setError("");
    try {
      const res = await apiPost(`/api/applications/${reference}/payment/initiate`, { method, mpesa_phone: phone }, token);
      setPayRef(res.payment_reference);
      setInitiated(true);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const handleSimulate = async () => {
    setSimulating(true); setError("");
    try {
      await apiPost(`/api/applications/${reference}/payment/simulate-confirm`, {}, token);
      setTimeout(onPaid, 800);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setSimulating(false); }
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Application Fee</p>
        <p className="text-3xl font-bold text-primary">KES {fee.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">{intake.name} — {programme.programme_name}</p>
      </div>

      {!initiated ? (
        <>
          <div className="flex rounded-lg border overflow-hidden">
            <button data-testid="pay-mpesa" onClick={() => setMethod("mpesa")} className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${method==="mpesa" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}><Phone className="w-4 h-4" />M-Pesa</button>
            <button data-testid="pay-bank" onClick={() => setMethod("bank")} className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${method==="bank" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}><CreditCard className="w-4 h-4" />Bank / PayBill</button>
          </div>

          {method === "mpesa" && (
            <Field label="M-Pesa Phone Number" required>
              <input data-testid="pay-phone" className="w-full border rounded-lg px-3 py-2 text-sm" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712345678" />
            </Field>
          )}

          {method === "bank" && (
            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
              <p className="font-semibold">Bank / M-Pesa PayBill Details</p>
              <p>PayBill Number: <strong>400200</strong></p>
              <p>Account Number: <strong>Your Application Reference</strong></p>
              <p className="text-xs text-muted-foreground">Payments typically take 1–2 business days to reflect.</p>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

          <Button data-testid="pay-initiate" onClick={handleInitiate} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</> : `Pay KES ${fee.toLocaleString()}`}
          </Button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-900">
            <p className="font-semibold mb-1">Payment Initiated</p>
            {method === "mpesa" ? <p>An M-Pesa prompt has been sent to <strong>{phone}</strong>. Enter your PIN to complete the payment.</p>
              : <p>Use reference <strong>{payRef}</strong> to make your PayBill payment to 400200.</p>}
            <p className="text-xs mt-2 text-emerald-700">Reference: <strong>{payRef}</strong></p>
          </div>

          <div className="border rounded-lg p-3 bg-amber-50 border-amber-200 text-amber-800 text-xs">
            <strong>Demo / Development Mode:</strong> Click below to simulate payment confirmation. In production, this is handled automatically by M-Pesa callback.
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

          <Button data-testid="pay-simulate" onClick={handleSimulate} disabled={simulating} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            {simulating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Confirming Payment...</> : "Simulate Payment Confirmation"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Step 8 — Final Submission + Confirmation ──────────────────────────────────
function StepConfirmation({ token, reference, onDone }: { token: string; reference: string; onDone: (appNum: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [appNumber, setAppNumber] = useState("");

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await apiPost(`/api/applications/${reference}/submit`, {}, token);
      setAppNumber(res.application_number);
      setSubmitted(true);
      onDone(res.application_number);
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">Application Submitted!</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Your application has been submitted successfully. Please keep your application reference number for future communication.</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Application Reference Number</p>
          <p className="text-lg font-mono font-bold text-primary">{appNumber}</p>
        </div>
        <p className="text-xs text-muted-foreground">A confirmation email has been sent to your registered email address. The Admissions Office will contact you within 5–10 business days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm space-y-1.5">
        <p className="font-semibold text-primary mb-2">Ready to Submit</p>
        <p>Your application is complete. Click "Submit Application" to finalise and submit to the Admissions Office.</p>
        <p className="text-muted-foreground text-xs">Once submitted, you will not be able to edit your application unless the Admissions Office requests changes.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

      <Button data-testid="submit-application" onClick={handleSubmit} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting Application...</> : "Submit Application"}
      </Button>
    </div>
  );
}

// ── Shared Field wrapper ──────────────────────────────────────────────────────
function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-foreground mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

// ── Main Wizard Component ─────────────────────────────────────────────────────
interface ApplicationWizardProps { onClose: () => void; }

export default function ApplicationWizard({ onClose }: ApplicationWizardProps) {
  const [loading, setLoading] = useState(true);
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [progsLoading, setProgsLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);

  const [state, setState] = useState<WizardState>({
    step: 0, pathway: null, intake: null, programme: null,
    token: "", applicantName: "", reference: "", applicationNumber: "",
    kuccpsPlacement: null,
  });

  const set = useCallback(<K extends keyof WizardState>(k: K, v: WizardState[K]) =>
    setState(s => ({...s, [k]: v})), []);

  const nextStep = useCallback(() => setState(s => ({...s, step: s.step + 1})), []);

  // Load pathways + intakes on mount
  useEffect(() => {
    Promise.all([
      apiGet("/api/admissions-app/pathways").then(r => setPathways(r.data ?? [])),
      apiGet("/api/admissions-app/intakes").then(r => setIntakes(r.data ?? [])),
    ]).finally(() => setLoading(false));
  }, []);

  // Load programmes when pathway/intake selected
  useEffect(() => {
    if (!state.pathway) return;
    setProgsLoading(true);
    const params = new URLSearchParams({ pathway: state.pathway.code });
    if (state.pathway.code === "kuccps" || state.pathway.code === "ug_self") params.set("level","undergraduate");
    if (state.pathway.code === "masters") params.set("level","masters");
    if (state.pathway.code === "phd") params.set("level","phd");
    apiGet(`/api/admissions-app/programmes?${params}`).then(r => setProgrammes(r.data ?? [])).finally(() => setProgsLoading(false));
  }, [state.pathway]);

  // Start application once we have token, intake, and programme
  const handleStartApplication = useCallback(async () => {
    if (!state.token || !state.intake || !state.programme || !state.pathway) return;
    try {
      const res = await apiPost("/api/applications/start", {
        intake_id: state.intake.id,
        programme_id: state.programme.id,
        pathway_id: state.pathway.id,
      }, state.token);
      set("reference", res.reference);
      nextStep();
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  }, [state.token, state.intake, state.programme, state.pathway, set, nextStep]);

  const { step, pathway, intake, programme, token, reference } = state;

  const stepLabels = ["Pathway","Intake & Programme","Your Account","Personal Details","Qualifications","Documents","Review","Payment","Submit"];

  const canProceedStep1 = !!(intake && programme && ["open","closing_soon","extended"].includes(intake.status));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="bg-background w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif font-bold text-base">Apply to KAFU</h2>
            <p className="text-primary-foreground/80 text-xs mt-0.5">
              {stepLabels[Math.min(step, stepLabels.length - 1)]} — Step {Math.min(step+1, stepLabels.length)} of {stepLabels.length}
            </p>
          </div>
          <button data-testid="wizard-close" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/20 shrink-0 bg-primary/10">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${((step)/(stepLabels.length-1))*100}%` }} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading admissions information...</p>
            </div>
          ) : (
            <>
              {/* Step 0 — Pathway */}
              {step === 0 && <StepPathway pathways={pathways} onSelect={p => { set("pathway", p); if (p.requires_kuccps_verification) setState(s => ({...s,step:1,pathway:p})); else setState(s => ({...s,step:1,pathway:p})); }} />}

              {/* Step 1 — KUCCPS or Intake+Programme */}
              {step === 1 && pathway?.requires_kuccps_verification && (
                <StepKuccps pathway={pathway} onVerified={data => { set("kuccpsPlacement", data); setState(s => ({...s,step:2})); }} />
              )}
              {step === 1 && !pathway?.requires_kuccps_verification && (
                <div className="space-y-4">
                  <StepIntakeProgramme pathway={pathway!} intake={intake} setIntake={i => set("intake",i)} programme={programme} setProgramme={p => set("programme",p)} intakes={intakes} programmes={programmes} loading={progsLoading} />
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" data-testid="step1-back" onClick={() => setState(s=>({...s,step:0,pathway:null}))} className="flex-1"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
                    <Button data-testid="step1-next" disabled={!canProceedStep1} onClick={() => nextStep()} className="flex-1 bg-primary text-white">Continue<ChevronRight className="w-4 h-4 ml-1" /></Button>
                  </div>
                </div>
              )}

              {/* Step 2 — Account */}
              {step === 2 && (
                <div className="space-y-4">
                  <StepAccount onRegister={(t,n) => setState(s=>({...s,token:t,applicantName:n}))} onLogin={(t,n) => setState(s=>({...s,token:t,applicantName:n}))} />
                  {state.token && (
                    <Button data-testid="step2-next" onClick={handleStartApplication} className="w-full bg-primary text-white">
                      Continue to Personal Details<ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              )}

              {/* Step 3 — Personal Details */}
              {step === 3 && token && reference && (
                <StepPersonal token={token} reference={reference} onSaved={nextStep} />
              )}

              {/* Step 4 — Qualifications */}
              {step === 4 && token && reference && pathway && (
                <StepQualifications token={token} reference={reference} pathway={pathway} onSaved={nextStep} />
              )}

              {/* Step 5 — Documents */}
              {step === 5 && token && reference && programme && (
                <StepDocuments token={token} reference={reference} programme={programme} onSaved={docs => { setUploadedDocs(docs); nextStep(); }} />
              )}

              {/* Step 6 — Review */}
              {step === 6 && token && reference && (
                <StepReview token={token} reference={reference} wizardState={state} uploadedDocs={uploadedDocs} onAccepted={nextStep} />
              )}

              {/* Step 7 — Payment */}
              {step === 7 && token && reference && pathway && intake && programme && (
                <StepPayment token={token} reference={reference} pathway={pathway} intake={intake} programme={programme} onPaid={nextStep} onFree={nextStep} />
              )}

              {/* Step 8 — Confirmation */}
              {step === 8 && token && reference && (
                <StepConfirmation token={token} reference={reference} onDone={num => set("applicationNumber", num)} />
              )}
            </>
          )}
        </div>

        {/* Footer nav for steps with back btn */}
        {step >= 3 && step <= 5 && (
          <div className="px-5 py-3 border-t shrink-0">
            <Button variant="outline" data-testid="wizard-back" onClick={() => setState(s=>({...s,step:s.step-1}))} className="text-sm">
              <ChevronLeft className="w-4 h-4 mr-1" />Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
