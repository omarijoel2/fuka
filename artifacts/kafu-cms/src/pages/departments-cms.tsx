import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Building2, ChevronRight } from "lucide-react";
import PhotoUploadField from "@/components/photo-upload-field";
import { PhotoBrowserModal } from "@/components/photo-browser-modal";

interface Department {
  id: number;
  school_code: string;
  name: string;
  slug: string;
  description: string | null;
  vision: string | null;
  hod_name: string | null;
  hod_title: string;
  hod_email: string | null;
  hod_phone: string | null;
  hod_photo_url: string | null;
  hod_bio: string | null;
  office_location: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  sort_order: number;
}

const SCHOOLS = [
  { code: "SESS", name: "Education & Social Sciences" },
  { code: "SBE",  name: "Business & Economics" },
  { code: "SCIT", name: "Computing & IT" },
  { code: "SOS",  name: "Science" },
  { code: "SHS",  name: "Health Sciences" },
];

const SCHOOL_MAP: Record<string, string> = Object.fromEntries(SCHOOLS.map(s => [s.code, s.name]));

function FormField({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const BLANK: Partial<Department> = {
  school_code: "SESS", name: "", slug: "", description: "", vision: "",
  hod_name: "", hod_title: "Head of Department", hod_email: "", hod_phone: "",
  hod_photo_url: "", hod_bio: "",
  office_location: "", email: "", phone: "",
  is_active: true, sort_order: 0,
};

function autoSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function DeptModal({ dept, onClose, onSaved }: { dept: Partial<Department> | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !dept?.id;
  const [form, setForm] = useState({ ...BLANK, ...(dept ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"basic" | "hod" | "contact">("basic");
  const [showBrowser, setShowBrowser] = useState(false);

  function set(k: string, v: string | boolean | number) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (!form.name) { setError("Name is required."); setSaving(false); return; }
      if (!form.slug) form.slug = autoSlug(form.name ?? "");
      const endpoint = isNew ? "/departments" : `/departments/${dept!.id}`;
      await apiFetch(endpoint, { method: isNew ? "POST" : "PUT", body: JSON.stringify(form) });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  const tabs = [
    { key: "basic", label: "Basic Info" },
    { key: "hod",   label: "HOD Profile" },
    { key: "contact", label: "Contact" },
  ] as const;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900">{isNew ? "New Department" : "Edit Department"}</h2>
          <button onClick={onClose} data-testid="dept-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              data-testid={`tab-${t.key}`}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.key ? "border-[#1A5C38] text-[#1A5C38]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={save} className="p-6 space-y-4" data-testid="dept-form">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          {tab === "basic" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="School" required>
                  <select value={form.school_code ?? "SESS"} onChange={e => set("school_code", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-school">
                    {SCHOOLS.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
                  </select>
                </FormField>
                <FormField label="Sort Order">
                  <input type="number" value={form.sort_order ?? 0} onChange={e => set("sort_order", parseInt(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-sort" />
                </FormField>
              </div>
              <FormField label="Department Name" required>
                <input value={form.name ?? ""} onChange={e => { set("name", e.target.value); if (isNew) set("slug", autoSlug(e.target.value)); }}
                  className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-name" />
              </FormField>
              <FormField label="Slug" required>
                <input value={form.slug ?? ""} onChange={e => set("slug", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono" data-testid="dept-slug" />
              </FormField>
              <FormField label="Vision Statement">
                <input value={form.vision ?? ""} onChange={e => set("vision", e.target.value)}
                  placeholder='e.g. "To be the leading department in ..."'
                  className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-vision" />
              </FormField>
              <FormField label="Description">
                <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)}
                  rows={4} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" data-testid="dept-description" />
              </FormField>
              <FormField label="Status">
                <select value={form.is_active ? "1" : "0"} onChange={e => set("is_active", e.target.value === "1")}
                  className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-active">
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </FormField>
            </>
          )}

          {tab === "hod" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="HOD Full Name" className="col-span-2">
                  <input value={form.hod_name ?? ""} onChange={e => set("hod_name", e.target.value)}
                    placeholder="e.g. Dr. Jane Doe" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="hod-name" />
                </FormField>
                <FormField label="HOD Title">
                  <input value={form.hod_title ?? "Head of Department"} onChange={e => set("hod_title", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="hod-title" />
                </FormField>
                <FormField label="HOD Email">
                  <input value={form.hod_email ?? ""} onChange={e => set("hod_email", e.target.value)}
                    placeholder="name@kafu.ac.ke" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="hod-email" />
                </FormField>
                <FormField label="HOD Phone">
                  <input value={form.hod_phone ?? ""} onChange={e => set("hod_phone", e.target.value)}
                    placeholder="+254 700 000 000" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="hod-phone" />
                </FormField>
              </div>
              <div className="space-y-2">
                <PhotoUploadField
                  value={form.hod_photo_url ?? ""}
                  onChange={url => set("hod_photo_url", url)}
                  personName={form.hod_name ?? ""}
                  endpoint="/governance-photo"
                />
                <button type="button" onClick={() => setShowBrowser(true)}
                  data-testid="hod-browse-library"
                  className="text-xs text-[#1A5C38] underline hover:no-underline">
                  Browse media library
                </button>
              </div>
              {form.hod_photo_url && (
                <img src={form.hod_photo_url} alt="HOD Preview" className="w-20 h-20 rounded-xl object-cover" />
              )}
              <FormField label="HOD Biography">
                <textarea value={form.hod_bio ?? ""} onChange={e => set("hod_bio", e.target.value)}
                  rows={5} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" data-testid="hod-bio" />
              </FormField>
            </>
          )}

          {tab === "contact" && (
            <>
              <FormField label="Department Email">
                <input value={form.email ?? ""} onChange={e => set("email", e.target.value)}
                  placeholder="dept.name@kafu.ac.ke" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-email" />
              </FormField>
              <FormField label="Department Phone">
                <input value={form.phone ?? ""} onChange={e => set("phone", e.target.value)}
                  placeholder="+254 700 000 000" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-phone" />
              </FormField>
              <FormField label="Office Location">
                <input value={form.office_location ?? ""} onChange={e => set("office_location", e.target.value)}
                  placeholder="e.g. Science Block A, Room 102, KAFU Main Campus"
                  className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="dept-office" />
              </FormField>
            </>
          )}

          <div className="flex justify-between pt-2">
            <div className="flex gap-2">
              {tab !== "basic" && (
                <button type="button" onClick={() => setTab(tab === "contact" ? "hod" : "basic")}
                  className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50 text-gray-600">
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50" data-testid="dept-cancel">Cancel</button>
              {tab !== "contact" ? (
                <button type="button"
                  onClick={() => setTab(tab === "basic" ? "hod" : "contact")}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Next <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              ) : (
                <button type="submit" disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-50"
                  data-testid="dept-save">
                  {saving ? "Saving..." : isNew ? "Create Department" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
    {showBrowser && (
      <PhotoBrowserModal
        onSelect={url => { set("hod_photo_url", url); setShowBrowser(false); }}
        onClose={() => setShowBrowser(false)}
        title="Select HOD Photo"
      />
    )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DepartmentsCmsPage() {
  const [depts, setDepts] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Department> | null | undefined>(undefined);
  const [schoolFilter, setSchoolFilter] = useState("all");

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/departments");
      setDepts((res as { data: Department[] }).data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function deleteDept(id: number) {
    if (!confirm("Delete this department?")) return;
    await apiFetch(`/departments/${id}`, { method: "DELETE" });
    load();
  }

  function afterSaved() { setModal(undefined); load(); }

  const filtered = schoolFilter === "all" ? depts : depts.filter(d => d.school_code === schoolFilter);

  // Group by school for display
  const bySchool = SCHOOLS.map(s => ({
    ...s,
    depts: filtered.filter(d => d.school_code === s.code),
  })).filter(s => s.depts.length > 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage departments, HOD profiles, and contact information across all schools.</p>
        </div>
        <button
          onClick={() => setModal({})}
          data-testid="new-dept-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A5C38] text-white hover:bg-[#154d2f] text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Department
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Departments", value: depts.length },
          { label: "Active", value: depts.filter(d => d.is_active).length },
          { label: "With HOD", value: depts.filter(d => d.hod_name).length },
          { label: "Schools", value: SCHOOLS.filter(s => depts.some(d => d.school_code === s.code)).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-[#1A5C38]">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* School filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ code: "all", name: "All Schools" }, ...SCHOOLS].map(s => (
          <button key={s.code} onClick={() => setSchoolFilter(s.code)}
            data-testid={`filter-${s.code}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${schoolFilter === s.code ? "bg-[#1A5C38] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s.code === "all" ? "All Schools" : s.code}
          </button>
        ))}
      </div>

      {/* Department groups */}
      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Loading departments...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <Building2 className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No departments found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bySchool.map(school => (
            <div key={school.code} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1A5C38] text-sm">{school.code}</span>
                  <span className="text-gray-500 text-sm ml-2">— School of {school.name}</span>
                </div>
                <span className="text-xs text-gray-400">{school.depts.length} dept{school.depts.length !== 1 ? "s" : ""}</span>
              </div>
              <table className="w-full text-sm">
                <thead className="border-b bg-white">
                  <tr className="text-gray-500 text-xs uppercase">
                    <th className="px-5 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left hidden md:table-cell">HOD</th>
                    <th className="px-4 py-2 text-left hidden lg:table-cell">Email</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {school.depts.map(dept => (
                    <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{dept.slug}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-gray-700 text-sm">{dept.hod_name ?? <span className="text-gray-400 italic">Not set</span>}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-gray-500 text-sm">{dept.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${dept.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                          {dept.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setModal(dept)} data-testid={`edit-dept-${dept.id}`}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteDept(dept.id)} data-testid={`delete-dept-${dept.id}`}
                            className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {modal !== undefined && (
        <DeptModal dept={modal} onClose={() => setModal(undefined)} onSaved={afterSaved} />
      )}
    </div>
  );
}
