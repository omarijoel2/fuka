import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Save, RefreshCw, Plus, Trash2, GripVertical } from "lucide-react";

const API = "/api/admin/site-config/student-services";

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface SSConfig {
  hero_heading?: string;
  hero_description?: string;
  intro_text?: string;
  services?: Service[];
  digital_title?: string;
  digital_description?: string;
  portal_url?: string;
  elearning_url?: string;
}

const ICON_OPTIONS = ["Activity", "Library", "ShieldCheck", "HeartHandshake", "Users", "Laptop", "BookOpen", "Globe", "Heart", "Star"];

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

export default function StudentServicesCmsPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState<SSConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setConfig(d.data ?? {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  function set(key: keyof SSConfig, value: unknown) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function setService(i: number, field: keyof Service, val: string) {
    const arr = [...(config.services ?? [])];
    arr[i] = { ...arr[i], [field]: val };
    set("services", arr);
  }

  function addService() {
    set("services", [...(config.services ?? []), { icon: "Activity", title: "", description: "" }]);
  }

  function removeService(i: number) {
    set("services", (config.services ?? []).filter((_, idx) => idx !== i));
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
      setMsg({ type: "success", text: "Student services content saved successfully." });
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
          <h1 className="text-2xl font-bold text-foreground">Student Services Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the Student Life & Services page shown to visitors.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="btn-save-ss"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm border ${msg.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`} data-testid="ss-save-msg">
          {msg.text}
        </div>
      )}

      {/* Hero */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">Page Hero</h2>
        <Field label="Heading" id="hero_heading">
          <input id="hero_heading" className={inputCls} value={config.hero_heading ?? ""} onChange={e => set("hero_heading", e.target.value)} data-testid="input-ss-hero-heading" />
        </Field>
        <Field label="Description" id="hero_description">
          <textarea id="hero_description" className={textareaCls} value={config.hero_description ?? ""} onChange={e => set("hero_description", e.target.value)} data-testid="input-ss-hero-description" />
        </Field>
        <Field label="Intro Paragraph" id="intro_text">
          <textarea id="intro_text" className={textareaCls} style={{ minHeight: "100px" }} value={config.intro_text ?? ""} onChange={e => set("intro_text", e.target.value)} data-testid="input-ss-intro" />
        </Field>
      </section>

      {/* Services */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-base font-semibold text-foreground">Service Cards</h2>
          <button onClick={addService} className="flex items-center gap-1.5 text-xs text-primary hover:underline" data-testid="btn-add-service">
            <Plus className="w-3.5 h-3.5" /> Add Service
          </button>
        </div>
        <div className="space-y-4">
          {(config.services ?? []).map((svc, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-xs font-medium text-gray-500">Service {i + 1}</span>
                </div>
                <button onClick={() => removeService(i)} className="text-gray-400 hover:text-red-500" data-testid={`btn-remove-service-${i}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                  <select
                    className={inputCls}
                    value={svc.icon}
                    onChange={e => setService(i, "icon", e.target.value)}
                    data-testid={`select-service-icon-${i}`}
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                  <input
                    className={inputCls}
                    value={svc.title}
                    onChange={e => setService(i, "title", e.target.value)}
                    placeholder="Service name"
                    data-testid={`input-service-title-${i}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  className={textareaCls}
                  value={svc.description}
                  onChange={e => setService(i, "description", e.target.value)}
                  placeholder="Brief description of this service"
                  data-testid={`input-service-desc-${i}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Services */}
      <section className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b pb-3">Digital Services Card</h2>
        <Field label="Card Title" id="digital_title">
          <input id="digital_title" className={inputCls} value={config.digital_title ?? ""} onChange={e => set("digital_title", e.target.value)} data-testid="input-digital-title" />
        </Field>
        <Field label="Card Description" id="digital_description">
          <textarea id="digital_description" className={textareaCls} value={config.digital_description ?? ""} onChange={e => set("digital_description", e.target.value)} data-testid="input-digital-description" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Student Portal URL" id="portal_url">
            <input id="portal_url" className={inputCls} value={config.portal_url ?? ""} onChange={e => set("portal_url", e.target.value)} data-testid="input-portal-url" />
          </Field>
          <Field label="E-Learning URL" id="elearning_url">
            <input id="elearning_url" className={inputCls} value={config.elearning_url ?? ""} onChange={e => set("elearning_url", e.target.value)} data-testid="input-elearning-url" />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="btn-save-ss-bottom"
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
