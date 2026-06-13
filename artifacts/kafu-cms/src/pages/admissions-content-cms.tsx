import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Save, RefreshCw, Plus, Trash2 } from "lucide-react";

const API = "/api/admin/site-config/admissions_content";

interface KcseGrade {
  level: string;
  pathway: string;
  grade: string;
  other: string;
}

interface HowToApplyStep {
  n: string;
  title: string;
  body: string;
}

interface AdmissionsContentConfig {
  kcse_heading?: string;
  kcse_intro?: string;
  kcse_grades?: KcseGrade[];
  how_to_apply_heading?: string;
  how_to_apply_intro?: string;
  how_to_apply?: HowToApplyStep[];
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const textareaCls = `${inputCls} min-h-[80px] resize-y`;

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function AdmissionsContentCmsPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState<AdmissionsContentConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setConfig((d && d.data) ? d.data : (d ?? {})); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  function set(key: keyof AdmissionsContentConfig, value: unknown) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function setGrade(i: number, field: keyof KcseGrade, val: string) {
    const arr = [...(config.kcse_grades ?? [])];
    arr[i] = { ...arr[i], [field]: val };
    set("kcse_grades", arr);
  }

  function addGrade() {
    set("kcse_grades", [...(config.kcse_grades ?? []), { level: "", pathway: "", grade: "", other: "" }]);
  }

  function removeGrade(i: number) {
    set("kcse_grades", (config.kcse_grades ?? []).filter((_, idx) => idx !== i));
  }

  function setStep(i: number, field: keyof HowToApplyStep, val: string) {
    const arr = [...(config.how_to_apply ?? [])];
    arr[i] = { ...arr[i], [field]: val };
    set("how_to_apply", arr);
  }

  function addStep() {
    const next = String((config.how_to_apply?.length ?? 0) + 1).padStart(2, "0");
    set("how_to_apply", [...(config.how_to_apply ?? []), { n: next, title: "", body: "" }]);
  }

  function removeStep(i: number) {
    set("how_to_apply", (config.how_to_apply ?? []).filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message ?? "Save failed.");
      setMsg({ type: "success", text: "Admissions content saved successfully." });
    } catch (err: unknown) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admissions Content Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit the Entry Requirements grade map and the How-to-Apply guide shown on the public Admissions page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="btn-save-admissions-content"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm border ${msg.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`} data-testid="admissions-content-save-msg">
          {msg.text}
        </div>
      )}

      {/* Entry Requirements (KCSE grade map) */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">Entry Requirements — Grade Map</h2>
        <Field label="Section Heading" id="kcse_heading">
          <input id="kcse_heading" className={inputCls} value={config.kcse_heading ?? ""} onChange={e => set("kcse_heading", e.target.value)} data-testid="input-kcse-heading" />
        </Field>
        <Field label="Section Intro" id="kcse_intro">
          <textarea id="kcse_intro" className={textareaCls} value={config.kcse_intro ?? ""} onChange={e => set("kcse_intro", e.target.value)} data-testid="input-kcse-intro" />
        </Field>

        <div className="space-y-4">
          {(config.kcse_grades ?? []).map((row, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50" data-testid={`grade-editor-${i}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Row {i + 1}</span>
                <button onClick={() => removeGrade(i)} className="text-red-600 hover:text-red-800" data-testid={`btn-remove-grade-${i}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Programme Level" id={`grade-level-${i}`}>
                  <input id={`grade-level-${i}`} className={inputCls} value={row.level ?? ""} onChange={e => setGrade(i, "level", e.target.value)} data-testid={`input-grade-level-${i}`} />
                </Field>
                <Field label="Pathway" id={`grade-pathway-${i}`}>
                  <input id={`grade-pathway-${i}`} className={inputCls} value={row.pathway ?? ""} onChange={e => setGrade(i, "pathway", e.target.value)} data-testid={`input-grade-pathway-${i}`} />
                </Field>
                <Field label="Minimum KCSE Mean Grade" id={`grade-grade-${i}`}>
                  <input id={`grade-grade-${i}`} className={inputCls} value={row.grade ?? ""} onChange={e => setGrade(i, "grade", e.target.value)} data-testid={`input-grade-grade-${i}`} />
                </Field>
                <Field label="Other Requirements" id={`grade-other-${i}`}>
                  <input id={`grade-other-${i}`} className={inputCls} value={row.other ?? ""} onChange={e => setGrade(i, "other", e.target.value)} data-testid={`input-grade-other-${i}`} />
                </Field>
              </div>
            </div>
          ))}
          <button onClick={addGrade} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:opacity-80" data-testid="btn-add-grade">
            <Plus className="w-4 h-4" /> Add Grade Row
          </button>
        </div>
      </section>

      {/* How to Apply */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">How to Apply — Unified Guide</h2>
        <Field label="Section Heading" id="how_to_apply_heading">
          <input id="how_to_apply_heading" className={inputCls} value={config.how_to_apply_heading ?? ""} onChange={e => set("how_to_apply_heading", e.target.value)} data-testid="input-how-heading" />
        </Field>
        <Field label="Section Intro" id="how_to_apply_intro">
          <textarea id="how_to_apply_intro" className={textareaCls} value={config.how_to_apply_intro ?? ""} onChange={e => set("how_to_apply_intro", e.target.value)} data-testid="input-how-intro" />
        </Field>

        <div className="space-y-4">
          {(config.how_to_apply ?? []).map((step, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50" data-testid={`step-editor-${i}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Step {i + 1}</span>
                <button onClick={() => removeStep(i)} className="text-red-600 hover:text-red-800" data-testid={`btn-remove-step-${i}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <Field label="Number" id={`step-n-${i}`}>
                  <input id={`step-n-${i}`} className={inputCls} value={step.n ?? ""} onChange={e => setStep(i, "n", e.target.value)} data-testid={`input-step-n-${i}`} />
                </Field>
                <Field label="Title" id={`step-title-${i}`}>
                  <input id={`step-title-${i}`} className={inputCls} value={step.title ?? ""} onChange={e => setStep(i, "title", e.target.value)} data-testid={`input-step-title-${i}`} />
                </Field>
              </div>
              <Field label="Description" id={`step-body-${i}`}>
                <textarea id={`step-body-${i}`} className={textareaCls} value={step.body ?? ""} onChange={e => setStep(i, "body", e.target.value)} data-testid={`input-step-body-${i}`} />
              </Field>
            </div>
          ))}
          <button onClick={addStep} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:opacity-80" data-testid="btn-add-step">
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      </section>
    </div>
  );
}
