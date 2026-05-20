import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Save, RefreshCw, Plus, Trash2, GripVertical } from "lucide-react";

const API = "/api/admin/site-config/about";

interface AboutConfig {
  hero_heading?: string;
  hero_description?: string;
  hero_image_url?: string;
  campus_photo_url?: string;
  history_heading?: string;
  history_p1?: string;
  history_p2?: string;
  history_p3?: string;
  vision?: string;
  mission?: string;
  quaker_heritage?: string;
  vc_name?: string;
  vc_title?: string;
  vc_bio?: string;
  vc_email?: string;
  vc_photo_url?: string;
  core_values?: string[];
  sidebar_stats?: { label: string; value: string }[];
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const textareaCls = `${inputCls} min-h-[80px] resize-y`;

export default function AboutCmsPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState<AboutConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setConfig(d.data ?? {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  function set(key: keyof AboutConfig, value: unknown) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function setValueItem(key: "core_values", i: number, val: string) {
    const arr = [...(config[key] ?? [])];
    arr[i] = val;
    set(key, arr);
  }

  function addCoreValue() {
    set("core_values", [...(config.core_values ?? []), ""]);
  }

  function removeCoreValue(i: number) {
    set("core_values", (config.core_values ?? []).filter((_, idx) => idx !== i));
  }

  function setStat(i: number, field: "label" | "value", val: string) {
    const arr = [...(config.sidebar_stats ?? [])];
    arr[i] = { ...arr[i], [field]: val };
    set("sidebar_stats", arr);
  }

  function addStat() {
    set("sidebar_stats", [...(config.sidebar_stats ?? []), { label: "", value: "" }]);
  }

  function removeStat(i: number) {
    set("sidebar_stats", (config.sidebar_stats ?? []).filter((_, idx) => idx !== i));
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
      setMsg({ type: "success", text: "About page content saved successfully." });
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
          <h1 className="text-2xl font-bold text-foreground">About Page Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit the content shown on the public About KAFU page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="btn-save-about"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm border ${msg.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`} data-testid="about-save-msg">
          {msg.text}
        </div>
      )}

      {/* Hero */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">Page Hero</h2>
        <Field label="Hero Heading" id="hero_heading">
          <input id="hero_heading" className={inputCls} value={config.hero_heading ?? ""} onChange={e => set("hero_heading", e.target.value)} data-testid="input-hero-heading" />
        </Field>
        <Field label="Hero Description" id="hero_description">
          <textarea id="hero_description" className={textareaCls} value={config.hero_description ?? ""} onChange={e => set("hero_description", e.target.value)} data-testid="input-hero-description" />
        </Field>
        <Field label="Hero Image URL" id="hero_image_url">
          <input id="hero_image_url" className={inputCls} value={config.hero_image_url ?? ""} onChange={e => set("hero_image_url", e.target.value)} data-testid="input-hero-image-url" />
        </Field>
        <Field label="Campus Strip Photo URL" id="campus_photo_url">
          <input id="campus_photo_url" className={inputCls} value={config.campus_photo_url ?? ""} onChange={e => set("campus_photo_url", e.target.value)} data-testid="input-campus-photo-url" />
        </Field>
      </section>

      {/* History */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">Our History</h2>
        <Field label="Section Heading" id="history_heading">
          <input id="history_heading" className={inputCls} value={config.history_heading ?? ""} onChange={e => set("history_heading", e.target.value)} data-testid="input-history-heading" />
        </Field>
        <Field label="Paragraph 1" id="history_p1">
          <textarea id="history_p1" className={textareaCls} value={config.history_p1 ?? ""} onChange={e => set("history_p1", e.target.value)} data-testid="input-history-p1" />
        </Field>
        <Field label="Paragraph 2" id="history_p2">
          <textarea id="history_p2" className={textareaCls} value={config.history_p2 ?? ""} onChange={e => set("history_p2", e.target.value)} data-testid="input-history-p2" />
        </Field>
        <Field label="Paragraph 3" id="history_p3">
          <textarea id="history_p3" className={textareaCls} value={config.history_p3 ?? ""} onChange={e => set("history_p3", e.target.value)} data-testid="input-history-p3" />
        </Field>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">Vision & Mission</h2>
        <Field label="Vision Statement" id="vision">
          <textarea id="vision" className={textareaCls} value={config.vision ?? ""} onChange={e => set("vision", e.target.value)} data-testid="input-vision" />
        </Field>
        <Field label="Mission Statement" id="mission">
          <textarea id="mission" className={textareaCls} value={config.mission ?? ""} onChange={e => set("mission", e.target.value)} data-testid="input-mission" />
        </Field>
        <Field label="Quaker Heritage Text" id="quaker_heritage">
          <textarea id="quaker_heritage" className={textareaCls} value={config.quaker_heritage ?? ""} onChange={e => set("quaker_heritage", e.target.value)} data-testid="input-quaker-heritage" />
        </Field>
      </section>

      {/* VC Section */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">Vice-Chancellor Feature</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" id="vc_name">
            <input id="vc_name" className={inputCls} value={config.vc_name ?? ""} onChange={e => set("vc_name", e.target.value)} data-testid="input-vc-name" />
          </Field>
          <Field label="Title" id="vc_title">
            <input id="vc_title" className={inputCls} value={config.vc_title ?? ""} onChange={e => set("vc_title", e.target.value)} data-testid="input-vc-title" />
          </Field>
        </div>
        <Field label="Email" id="vc_email">
          <input id="vc_email" type="email" className={inputCls} value={config.vc_email ?? ""} onChange={e => set("vc_email", e.target.value)} data-testid="input-vc-email" />
        </Field>
        <Field label="Photo URL" id="vc_photo_url">
          <input id="vc_photo_url" className={inputCls} value={config.vc_photo_url ?? ""} onChange={e => set("vc_photo_url", e.target.value)} data-testid="input-vc-photo-url" />
        </Field>
        <Field label="Bio" id="vc_bio">
          <textarea id="vc_bio" className={textareaCls} value={config.vc_bio ?? ""} onChange={e => set("vc_bio", e.target.value)} data-testid="input-vc-bio" />
        </Field>
      </section>

      {/* Core Values */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-semibold text-foreground">Core Values</h2>
          <button onClick={addCoreValue} className="flex items-center gap-1.5 text-xs text-primary hover:underline" data-testid="btn-add-value">
            <Plus className="w-3.5 h-3.5" /> Add Value
          </button>
        </div>
        <div className="space-y-2">
          {(config.core_values ?? []).map((val, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
              <input
                className={inputCls}
                value={val}
                onChange={e => setValueItem("core_values", i, e.target.value)}
                placeholder="Core value"
                data-testid={`input-core-value-${i}`}
              />
              <button onClick={() => removeCoreValue(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0" data-testid={`btn-remove-value-${i}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar Stats */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-semibold text-foreground">Sidebar Stats (KAFU at a Glance)</h2>
          <button onClick={addStat} className="flex items-center gap-1.5 text-xs text-primary hover:underline" data-testid="btn-add-stat">
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {(config.sidebar_stats ?? []).map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputCls}
                value={stat.label}
                onChange={e => setStat(i, "label", e.target.value)}
                placeholder="Label"
                data-testid={`input-stat-label-${i}`}
              />
              <input
                className={inputCls}
                value={stat.value}
                onChange={e => setStat(i, "value", e.target.value)}
                placeholder="Value"
                data-testid={`input-stat-value-${i}`}
              />
              <button onClick={() => removeStat(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0" data-testid={`btn-remove-stat-${i}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="btn-save-about-bottom"
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
