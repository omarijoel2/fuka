import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  Plus, Pencil, Trash2, X, BookOpen, Loader2, Filter,
  GraduationCap, FlaskConical, Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Programme {
  id: number;
  name: string;
  slug: string;
  school: string;
  level: "undergraduate" | "postgraduate" | "doctoral";
  programme_code: string;
  duration: string;
  description: string;
  status: "published" | "draft";
  updated_at: string;
}

const SCHOOLS = [
  { code: "SESS", name: "Education & Social Sciences" },
  { code: "SBE",  name: "Business & Economics" },
  { code: "SCIT", name: "Computing & IT" },
  { code: "SOS",  name: "Science" },
  { code: "SHS",  name: "Health Sciences" },
];

const LEVELS = [
  { value: "undergraduate", label: "Undergraduate", icon: <BookOpen className="w-3.5 h-3.5" />, colour: "bg-blue-100 text-blue-700" },
  { value: "postgraduate",  label: "Postgraduate",  icon: <GraduationCap className="w-3.5 h-3.5" />, colour: "bg-purple-100 text-purple-700" },
  { value: "doctoral",      label: "Doctoral",       icon: <FlaskConical className="w-3.5 h-3.5" />, colour: "bg-red-100 text-red-700" },
];

const LEVEL_MAP = Object.fromEntries(LEVELS.map(l => [l.value, l]));

const BLANK: Partial<Programme> = {
  name: "", school: "SESS", level: "undergraduate",
  programme_code: "", duration: "4 years", description: "", status: "published",
};

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38]";

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

// ─── Programme Modal ──────────────────────────────────────────────────────────
function ProgrammeModal({ programme, onClose, onSaved }: {
  programme: Partial<Programme> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !programme?.id;
  const [form, setForm] = useState<Partial<Programme>>({ ...BLANK, ...(programme ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) { setError("Programme name is required."); return; }
    if (!form.school) { setError("School is required."); return; }
    setSaving(true); setError("");
    try {
      const endpoint = isNew ? "/academic/programmes" : `/academic/programmes/${programme!.id}`;
      await apiFetch(endpoint, { method: isNew ? "POST" : "PUT", body: JSON.stringify(form) });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1A5C38]" />
            {isNew ? "Add Programme" : "Edit Programme"}
          </h2>
          <button onClick={onClose} data-testid="prog-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <form onSubmit={save} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          <FormField label="Programme Name" required>
            <input value={form.name ?? ""} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Bachelor of Science in Computer Science" className={inputCls} data-testid="prog-name" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="School" required>
              <select value={form.school ?? "SESS"} onChange={e => set("school", e.target.value)}
                className={`${inputCls} bg-white`} data-testid="prog-school">
                {SCHOOLS.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
              </select>
            </FormField>
            <FormField label="Level" required>
              <select value={form.level ?? "undergraduate"} onChange={e => set("level", e.target.value)}
                className={`${inputCls} bg-white`} data-testid="prog-level">
                {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Programme Code / Abbreviation" hint="e.g. BSc CS, MBA, BEd (Arts)">
              <input value={form.programme_code ?? ""} onChange={e => set("programme_code", e.target.value)}
                placeholder="BSc CS" className={inputCls} data-testid="prog-code" />
            </FormField>
            <FormField label="Duration" hint="e.g. 4 years, 2 years, 3-5 years">
              <input value={form.duration ?? ""} onChange={e => set("duration", e.target.value)}
                placeholder="4 years" className={inputCls} data-testid="prog-duration" />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)}
              rows={3} className={`${inputCls} resize-none`} data-testid="prog-description"
              placeholder="Short programme overview shown on the website…" />
          </FormField>

          <FormField label="Status">
            <select value={form.status ?? "published"} onChange={e => set("status", e.target.value)}
              className={`${inputCls} bg-white`} data-testid="prog-status">
              <option value="published">Published — visible on site</option>
              <option value="draft">Draft — hidden from site</option>
            </select>
          </FormField>

          <div className="flex justify-between pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50" data-testid="prog-cancel">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-60 font-semibold"
              data-testid="prog-save">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving…" : isNew ? "Add Programme" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProgrammesCmsPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Programme> | null | undefined>(undefined);
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/academic/programmes");
      setProgrammes((res as { data: Programme[] }).data ?? []);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function deleteProgramme(prog: Programme) {
    if (!confirm(`Delete "${prog.name}"?`)) return;
    await apiFetch(`/academic/programmes/${prog.id}`, { method: "DELETE" });
    load();
  }

  const filtered = programmes.filter(p => {
    if (schoolFilter !== "all" && p.school !== schoolFilter) return false;
    if (levelFilter !== "all" && p.level !== levelFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.programme_code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group filtered by school for display
  const grouped = SCHOOLS.map(s => ({
    ...s,
    programmes: filtered.filter(p => p.school === s.code),
  })).filter(s => s.programmes.length > 0);

  const ug = programmes.filter(p => p.level === "undergraduate").length;
  const pg = programmes.filter(p => p.level === "postgraduate").length;
  const phd = programmes.filter(p => p.level === "doctoral").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programmes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all academic programmes across all schools. Changes are reflected on the Programmes listing page.
          </p>
        </div>
        <button onClick={() => setModal({})} data-testid="new-prog-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A5C38] text-white hover:bg-[#154d2f] text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Programme
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: programmes.length, colour: "text-[#1A5C38]" },
          { label: "Undergraduate", value: ug, colour: "text-blue-600" },
          { label: "Postgraduate",  value: pg, colour: "text-purple-600" },
          { label: "Doctoral",       value: phd, colour: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className={`text-3xl font-bold ${s.colour}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or code…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30"
            data-testid="prog-search" />
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-medium">Filter:</span>
        </div>
        <select value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none" data-testid="filter-school">
          <option value="all">All Schools</option>
          {SCHOOLS.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
        </select>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none" data-testid="filter-level">
          <option value="all">All Levels</option>
          {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        {(schoolFilter !== "all" || levelFilter !== "all" || search) && (
          <button onClick={() => { setSchoolFilter("all"); setLevelFilter("all"); setSearch(""); }}
            className="text-xs text-gray-500 hover:text-red-500 underline" data-testid="clear-filters">Clear filters</button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} programme{filtered.length !== 1 ? "s" : ""} shown</span>
      </div>

      {/* Programme groups */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading programmes…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          <BookOpen className="w-12 h-12 opacity-20" />
          <p className="text-sm">{programmes.length === 0 ? "No programmes yet." : "No programmes match the current filters."}</p>
          {programmes.length === 0 && (
            <p className="text-xs text-center max-w-sm">The website serves static fallback data until programmes are added here. Add programmes to enable dynamic content.</p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(school => (
            <div key={school.code} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1A5C38] text-sm">{school.code}</span>
                  <span className="text-gray-500 text-sm ml-2">— School of {school.name}</span>
                </div>
                <span className="text-xs text-gray-400">{school.programmes.length} programme{school.programmes.length !== 1 ? "s" : ""}</span>
              </div>
              <table className="w-full text-sm">
                <thead className="border-b bg-white">
                  <tr className="text-gray-400 text-xs uppercase">
                    <th className="px-5 py-2.5 text-left">Programme Name</th>
                    <th className="px-4 py-2.5 text-left hidden sm:table-cell">Code</th>
                    <th className="px-4 py-2.5 text-left">Level</th>
                    <th className="px-4 py-2.5 text-left hidden md:table-cell">Duration</th>
                    <th className="px-4 py-2.5 text-left hidden lg:table-cell">Status</th>
                    <th className="px-4 py-2.5 w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {school.programmes.map(prog => {
                    const lvl = LEVEL_MAP[prog.level];
                    return (
                      <tr key={prog.id} className="hover:bg-gray-50 transition-colors" data-testid={`prog-row-${prog.id}`}>
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{prog.name}</p>
                          {prog.description && <p className="text-xs text-gray-400 truncate max-w-[280px] mt-0.5">{prog.description}</p>}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{prog.programme_code || "—"}</code>
                        </td>
                        <td className="px-4 py-3">
                          {lvl ? (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${lvl.colour}`}>
                              {lvl.icon}{lvl.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">{prog.level}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-gray-500">{prog.duration}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${prog.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {prog.status === "published" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => setModal(prog)} data-testid={`edit-prog-${prog.id}`}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteProgramme(prog)} data-testid={`delete-prog-${prog.id}`}
                              className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {modal !== undefined && (
        <ProgrammeModal programme={modal} onClose={() => setModal(undefined)}
          onSaved={() => { setModal(undefined); load(); }} />
      )}
    </div>
  );
}
