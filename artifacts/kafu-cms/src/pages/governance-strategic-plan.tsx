import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Save, RefreshCw, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const API_GET = (slug: string) => `/api/admin/pages/${slug}`;
const API_PUT = (slug: string) => `/api/admin/pages/${slug}`;
const PAGE_SLUG = "about-strategic-plan";

interface Pillar {
  id: number;
  title: string;
  colour: string;
  objectives: string[];
  kpis: string[];
}

interface Milestone {
  year: string;
  label: string;
}

interface StrategicPlanData {
  vision?: string;
  mission?: string;
  core_values?: string;
  pdf_url?: string;
  pillars?: Pillar[];
  milestones?: Milestone[];
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Textarea({ id, value, onChange, rows = 3 }: { id: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      id={id}
      data-testid={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );
}

function Input({ id, value, onChange, type = "text" }: { id: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      id={id}
      data-testid={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  );
}

function PillarCard({ pillar, index, onChange, onDelete }: {
  pillar: Pillar; index: number;
  onChange: (p: Pillar) => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const setField = <K extends keyof Pillar>(k: K, v: Pillar[K]) => onChange({ ...pillar, [k]: v });
  const updateList = (key: "objectives" | "kpis", i: number, val: string) => {
    const arr = [...pillar[key]];
    arr[i] = val;
    setField(key, arr);
  };
  const addToList = (key: "objectives" | "kpis") => setField(key, [...pillar[key], ""]);
  const removeFromList = (key: "objectives" | "kpis", i: number) => setField(key, pillar[key].filter((_, idx) => idx !== i));

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <span className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: pillar.colour || "#1A5C38" }} />
        <span className="flex-1 font-medium text-sm text-gray-800">{pillar.title || `Pillar ${index + 1}`}</span>
        <button type="button" data-testid={`delete-pillar-${index}`} onClick={e => { e.stopPropagation(); onDelete(); }} className="text-red-400 hover:text-red-600 mr-2">
          <Trash2 className="w-4 h-4" />
        </button>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </div>
      {open && (
        <div className="p-4 space-y-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Pillar Title" id={`pillar-title-${index}`}>
              <Input id={`pillar-title-${index}`} value={pillar.title} onChange={v => setField("title", v)} />
            </Field>
            <Field label="Accent Colour" id={`pillar-colour-${index}`}>
              <div className="flex gap-2 items-center">
                <input type="color" value={pillar.colour || "#1A5C38"} onChange={e => setField("colour", e.target.value)}
                  className="h-9 w-14 border border-gray-300 rounded cursor-pointer" />
                <Input id={`pillar-colour-text-${index}`} value={pillar.colour || ""} onChange={v => setField("colour", v)} />
              </div>
            </Field>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Objectives</label>
            <div className="space-y-2">
              {pillar.objectives.map((obj, i) => (
                <div key={i} className="flex gap-2">
                  <input data-testid={`pillar-${index}-obj-${i}`} value={obj} onChange={e => updateList("objectives", i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <button type="button" onClick={() => removeFromList("objectives", i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addToList("objectives")} data-testid={`add-objective-${index}`}
                className="text-sm text-green-700 hover:text-green-900 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Objective
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">KPIs</label>
            <div className="space-y-2">
              {pillar.kpis.map((kpi, i) => (
                <div key={i} className="flex gap-2">
                  <input data-testid={`pillar-${index}-kpi-${i}`} value={kpi} onChange={e => updateList("kpis", i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <button type="button" onClick={() => removeFromList("kpis", i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addToList("kpis")} data-testid={`add-kpi-${index}`}
                className="text-sm text-green-700 hover:text-green-900 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add KPI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GovernanceStrategicPlanPage() {
  const { token } = useAuth();
  const [data, setData] = useState<StrategicPlanData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    fetch(API_GET(PAGE_SLUG), { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(res => { setData(res.data?.structured_data ?? {}); setLoading(false); })
      .catch(() => { showToast("error", "Failed to load page data."); setLoading(false); });
  };

  useEffect(() => { if (token) load(); }, [token]);

  const save = () => {
    setSaving(true);
    fetch(API_PUT(PAGE_SLUG), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ structured_data: data }),
    })
      .then(r => r.json())
      .then(res => {
        setSaving(false);
        if (res.error) showToast("error", res.error);
        else showToast("success", "Strategic plan saved.");
      })
      .catch(() => { setSaving(false); showToast("error", "Save failed."); });
  };

  const set = <K extends keyof StrategicPlanData>(k: K, v: StrategicPlanData[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const updatePillar = (i: number, p: Pillar) =>
    setData(d => { const pillars = [...(d.pillars ?? [])]; pillars[i] = p; return { ...d, pillars }; });

  const deletePillar = (i: number) =>
    setData(d => ({ ...d, pillars: (d.pillars ?? []).filter((_, idx) => idx !== i) }));

  const addPillar = () =>
    setData(d => ({
      ...d,
      pillars: [...(d.pillars ?? []), { id: Date.now(), title: "", colour: "#1A5C38", objectives: [], kpis: [] }],
    }));

  const updateMilestone = (i: number, key: keyof Milestone, val: string) =>
    setData(d => {
      const milestones = [...(d.milestones ?? [])];
      milestones[i] = { ...milestones[i], [key]: val };
      return { ...d, milestones };
    });

  const deleteMilestone = (i: number) =>
    setData(d => ({ ...d, milestones: (d.milestones ?? []).filter((_, idx) => idx !== i) }));

  const addMilestone = () =>
    setData(d => ({ ...d, milestones: [...(d.milestones ?? []), { year: "", label: "" }] }));

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-sm text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategic Plan</h1>
          <p className="text-sm text-gray-500 mt-1">Edit the Strategic Plan 2023–2028 page content</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} data-testid="refresh-btn"
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button type="button" onClick={save} disabled={saving} data-testid="save-btn"
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-800 disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b pb-2">Plan Essentials</h2>
        <Field label="PDF Download URL" id="pdf_url">
          <Input id="pdf_url" value={data.pdf_url ?? ""} onChange={v => set("pdf_url", v)} />
        </Field>
        <Field label="Vision Statement" id="vision">
          <Textarea id="vision" value={data.vision ?? ""} onChange={v => set("vision", v)} rows={2} />
        </Field>
        <Field label="Mission Statement" id="mission">
          <Textarea id="mission" value={data.mission ?? ""} onChange={v => set("mission", v)} rows={2} />
        </Field>
        <Field label="Core Values (separate with middle dot ·)" id="core_values">
          <Input id="core_values" value={data.core_values ?? ""} onChange={v => set("core_values", v)} />
        </Field>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-base font-semibold text-gray-800">Strategic Pillars</h2>
          <button type="button" onClick={addPillar} data-testid="add-pillar-btn"
            className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900">
            <Plus className="w-4 h-4" /> Add Pillar
          </button>
        </div>
        {(data.pillars ?? []).length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No pillars yet. Click Add Pillar to begin.</p>
        )}
        <div className="space-y-3">
          {(data.pillars ?? []).map((pillar, i) => (
            <PillarCard key={pillar.id ?? i} pillar={pillar} index={i}
              onChange={p => updatePillar(i, p)} onDelete={() => deletePillar(i)} />
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-base font-semibold text-gray-800">Implementation Milestones</h2>
          <button type="button" onClick={addMilestone} data-testid="add-milestone-btn"
            className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900">
            <Plus className="w-4 h-4" /> Add Milestone
          </button>
        </div>
        {(data.milestones ?? []).length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No milestones defined.</p>
        )}
        <div className="space-y-2">
          {(data.milestones ?? []).map((m, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input data-testid={`milestone-year-${i}`} value={m.year} placeholder="Year"
                onChange={e => updateMilestone(i, "year", e.target.value)}
                className="w-20 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input data-testid={`milestone-label-${i}`} value={m.label} placeholder="Description"
                onChange={e => updateMilestone(i, "label", e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <button type="button" onClick={() => deleteMilestone(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
