import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  Plus, Pencil, Trash2, X, GraduationCap, Loader2,
  BookOpen, Users, FlaskConical,
} from "lucide-react";
import PhotoUploadField from "@/components/photo-upload-field";
import { PhotoBrowserModal } from "@/components/photo-browser-modal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface School {
  id: number;
  name: string;
  code: string;
  slug: string;
  description: string;
  vision: string;
  mission: string;
  dean: string;
  dean_title: string;
  dean_photo: string;
  colour: string;
  href: string;
  programmes_count: { undergraduate: number; postgraduate: number; doctoral: number };
  status: "published" | "draft";
  updated_at: string;
}

const BLANK: Partial<School> = {
  name: "", code: "", slug: "", description: "", vision: "", mission: "",
  dean: "", dean_title: "Dean", dean_photo: "", colour: "#1A5C38", href: "",
  programmes_count: { undergraduate: 0, postgraduate: 0, doctoral: 0 },
  status: "published",
};

type Tab = "basic" | "dean" | "counts";

function FormField({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38]";

// ─── School Modal ─────────────────────────────────────────────────────────────
function SchoolModal({ school, onClose, onSaved }: {
  school: Partial<School> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !school?.id;
  const [form, setForm] = useState<Partial<School>>({ ...BLANK, ...(school ?? {}) });
  const [tab, setTab] = useState<Tab>("basic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showBrowser, setShowBrowser] = useState(false);

  function set(k: string, v: string | number | object) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function setCount(k: keyof School["programmes_count"], v: number) {
    setForm(f => ({
      ...f,
      programmes_count: { ...(f.programmes_count ?? { undergraduate: 0, postgraduate: 0, doctoral: 0 }), [k]: v },
    }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError("School name is required."); return; }
    if (!form.code) { setError("School code is required (e.g. SESS, SBE)."); return; }
    setSaving(true); setError("");
    try {
      const endpoint = isNew ? "/schools" : `/schools/${school!.id}`;
      await apiFetch(endpoint, { method: isNew ? "POST" : "PUT", body: JSON.stringify({ ...form, code: form.code?.toUpperCase() }) });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally { setSaving(false); }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "basic", label: "School Details" },
    { key: "dean",  label: "Dean's Profile" },
    { key: "counts", label: "Programme Counts" },
  ];

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1A5C38]" />
            {isNew ? "New School" : `Edit: ${school!.name}`}
          </h2>
          <button onClick={onClose} data-testid="school-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex gap-0 border-b">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} data-testid={`school-tab-${t.key}`}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors
                ${tab === t.key ? "border-[#1A5C38] text-[#1A5C38]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={save} className="p-6 space-y-4" data-testid="school-form">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          {tab === "basic" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="School Name" required>
                  <input value={form.name ?? ""} onChange={e => set("name", e.target.value)}
                    placeholder="e.g. School of Computing and IT" className={`col-span-2 ${inputCls}`} data-testid="school-name" />
                </FormField>
                <FormField label="Code" required hint="e.g. SCIT, SESS, SBE">
                  <input value={form.code ?? ""} onChange={e => set("code", e.target.value.toUpperCase())}
                    placeholder="SCIT" maxLength={10}
                    className={`${inputCls} font-mono uppercase`} data-testid="school-code" />
                </FormField>
              </div>
              <FormField label="Description" required>
                <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)}
                  rows={4} className={`${inputCls} resize-none`} data-testid="school-description"
                  placeholder="Overview of the school shown on the website…" />
              </FormField>
              <FormField label="Vision Statement">
                <input value={form.vision ?? ""} onChange={e => set("vision", e.target.value)}
                  placeholder="To be the leading school in…" className={inputCls} data-testid="school-vision" />
              </FormField>
              <FormField label="Mission Statement">
                <textarea value={form.mission ?? ""} onChange={e => set("mission", e.target.value)}
                  rows={2} className={`${inputCls} resize-none`} data-testid="school-mission" />
              </FormField>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Accent Colour" hint="Shown on the school card">
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.colour ?? "#1A5C38"} onChange={e => set("colour", e.target.value)}
                      className="w-10 h-10 rounded border border-gray-200 cursor-pointer p-0.5" data-testid="school-colour" />
                    <input value={form.colour ?? "#1A5C38"} onChange={e => set("colour", e.target.value)}
                      className={`flex-1 ${inputCls} font-mono`} data-testid="school-colour-hex" />
                  </div>
                </FormField>
                <FormField label="Page URL Slug" hint="e.g. /schools/scit">
                  <input value={form.href ?? ""} onChange={e => set("href", e.target.value)}
                    placeholder="/schools/scit" className={inputCls} data-testid="school-href" />
                </FormField>
                <FormField label="Status">
                  <select value={form.status ?? "published"} onChange={e => set("status", e.target.value)}
                    className={`${inputCls} bg-white`} data-testid="school-status">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </FormField>
              </div>
            </>
          )}

          {tab === "dean" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Dean's Full Name">
                  <input value={form.dean ?? ""} onChange={e => set("dean", e.target.value)}
                    placeholder="e.g. Prof. Kelvin K. Omieno" className={inputCls} data-testid="school-dean" />
                </FormField>
                <FormField label="Dean's Title">
                  <input value={form.dean_title ?? ""} onChange={e => set("dean_title", e.target.value)}
                    placeholder="Dean, School of Computing & IT" className={inputCls} data-testid="school-dean-title" />
                </FormField>
              </div>
              <div className="space-y-2">
                <PhotoUploadField
                  value={form.dean_photo ?? ""}
                  onChange={url => set("dean_photo", url)}
                  personName={form.dean ?? ""}
                  endpoint="/governance-photo"
                />
                <button type="button" onClick={() => setShowBrowser(true)}
                  data-testid="school-dean-browse-library"
                  className="text-xs text-[#1A5C38] underline hover:no-underline">
                  Browse media library
                </button>
              </div>
              {form.dean_photo && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <img src={form.dean_photo} alt="Dean preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div>
                    <p className="font-semibold text-gray-900">{form.dean || "Dean name"}</p>
                    <p className="text-sm text-gray-500">{form.dean_title || "Title"}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "counts" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-xl p-3">
                These counts are shown as statistics on the school card. They do not auto-calculate from the programmes database — update them manually when adding new programmes.
              </p>
              {([
                { key: "undergraduate" as const, label: "Undergraduate Programmes", icon: <BookOpen className="w-4 h-4" /> },
                { key: "postgraduate" as const,  label: "Postgraduate Programmes",  icon: <GraduationCap className="w-4 h-4" /> },
                { key: "doctoral" as const,      label: "Doctoral Programmes",       icon: <FlaskConical className="w-4 h-4" /> },
              ]).map(({ key, label, icon }) => (
                <div key={key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-[#1A5C38]/10 text-[#1A5C38] flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                  </div>
                  <input type="number" min={0} value={(form.programmes_count ?? {})[key] ?? 0}
                    onChange={e => setCount(key, parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30"
                    data-testid={`school-count-${key}`} />
                </div>
              ))}
              <div className="flex items-center gap-4 p-4 bg-[#1A5C38]/5 rounded-xl border border-[#1A5C38]/10">
                <Users className="w-5 h-5 text-[#1A5C38]" />
                <span className="text-sm font-medium text-[#1A5C38]">Total Programmes</span>
                <span className="ml-auto font-bold text-[#1A5C38] text-lg">
                  {((form.programmes_count?.undergraduate ?? 0) + (form.programmes_count?.postgraduate ?? 0) + (form.programmes_count?.doctoral ?? 0))}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50" data-testid="school-cancel">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-60 font-semibold"
              data-testid="school-save">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving…" : isNew ? "Create School" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
    {showBrowser && (
      <PhotoBrowserModal
        onSelect={url => { set("dean_photo", url); setShowBrowser(false); }}
        onClose={() => setShowBrowser(false)}
        title="Select Dean's Photo"
      />
    )}
    </>
  );
}

// ─── School Card ──────────────────────────────────────────────────────────────
function SchoolCard({ school, onEdit, onDelete }: {
  school: School;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const total = (school.programmes_count?.undergraduate ?? 0) + (school.programmes_count?.postgraduate ?? 0) + (school.programmes_count?.doctoral ?? 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      data-testid={`school-card-${school.id}`}>
      {/* Colour header */}
      <div className="h-2" style={{ backgroundColor: school.colour }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
            style={{ backgroundColor: school.colour }}>
            {school.code || school.name.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-900 text-sm leading-snug">{school.name}</h3>
                <p className="text-xs font-mono text-gray-400 mt-0.5">{school.code}</p>
              </div>
              <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${school.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {school.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>

        {school.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{school.description}</p>
        )}

        {/* Dean */}
        {school.dean && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
            {school.dean_photo ? (
              <img src={school.dean_photo} alt={school.dean} className="w-8 h-8 rounded-full object-cover shrink-0"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-bold">{school.dean.slice(0, 2)}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{school.dean}</p>
              <p className="text-[10px] text-gray-400 truncate">{school.dean_title}</p>
            </div>
          </div>
        )}

        {/* Programme counts */}
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {[
            { label: "UG", value: school.programmes_count?.undergraduate ?? 0 },
            { label: "PG", value: school.programmes_count?.postgraduate ?? 0 },
            { label: "PhD", value: school.programmes_count?.doctoral ?? 0 },
          ].map(s => (
            <div key={s.label} className="text-center bg-gray-50 rounded-lg py-1.5">
              <div className="text-base font-bold text-gray-800">{s.value}</div>
              <div className="text-[10px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 text-center mb-3">{total} total programme{total !== 1 ? "s" : ""}</p>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button onClick={onEdit} data-testid={`edit-school-${school.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={onDelete} data-testid={`delete-school-${school.id}`}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-50 text-gray-400 hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SchoolsCmsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<School> | null | undefined>(undefined);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/schools");
      setSchools((res as { data: School[] }).data ?? []);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function deleteSchool(school: School) {
    if (!confirm(`Delete "${school.name}"? This removes it from the public website.`)) return;
    await apiFetch(`/schools/${school.id}`, { method: "DELETE" });
    load();
  }

  const published = schools.filter(s => s.status === "published").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools &amp; Faculties</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the academic schools shown on the university website — dean profiles, descriptions, and programme counts.
          </p>
        </div>
        <button onClick={() => setModal({})} data-testid="new-school-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A5C38] text-white hover:bg-[#154d2f] text-sm font-semibold">
          <Plus className="w-4 h-4" /> New School
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Schools", value: schools.length },
          { label: "Published", value: published, green: true },
          { label: "Drafts", value: schools.length - published },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className={`text-3xl font-bold ${s.green ? "text-green-600" : "text-[#1A5C38]"}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading schools…
        </div>
      ) : schools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          <GraduationCap className="w-12 h-12 opacity-20" />
          <p className="text-sm">No schools yet. Click "New School" to add the first one.</p>
          <p className="text-xs text-gray-400 max-w-sm text-center">
            The website will show static fallback data until schools are added here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schools.map(school => (
            <SchoolCard key={school.id} school={school}
              onEdit={() => setModal(school)}
              onDelete={() => deleteSchool(school)} />
          ))}
        </div>
      )}

      {modal !== undefined && (
        <SchoolModal school={modal} onClose={() => setModal(undefined)}
          onSaved={() => { setModal(undefined); load(); }} />
      )}
      {/* PhotoBrowserModal is rendered inside SchoolModal via showBrowser state */}
    </div>
  );
}
