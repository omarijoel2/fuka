import React, { useEffect, useState } from "react";
import {
  apiGetAlumni, apiPostAlumni, apiPutAlumni, apiDeleteAlumni,
} from "@/lib/api";
import { GraduationCap, Plus, Edit2, Trash2, X, RefreshCw, Search } from "lucide-react";

interface Alumnus {
  id: number; slug: string; name: string; programme?: string;
  school_code?: string; graduation_year?: number;
  current_role?: string; current_organization?: string;
  country?: string; industry?: string; sector?: string;
  achievements?: string; bio?: string; photo_url?: string; linkedin_url?: string;
  featured_category?: string; visibility?: string;
  is_featured: boolean; is_published: boolean;
}

const SECTORS = [
  "employed", "self_employed", "entrepreneur", "public_sector",
  "ngo_sector", "academic_sector", "further_study", "leadership",
];
const SECTOR_LABELS: Record<string, string> = {
  employed: "Employed", self_employed: "Self-Employed", entrepreneur: "Entrepreneur",
  public_sector: "Public Sector", ngo_sector: "NGO / Civil Society",
  academic_sector: "Academia", further_study: "Further Study", leadership: "Leadership",
};

function AlumnusModal({ item, onClose, onSaved }: {
  item: Partial<Alumnus> | null; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    name: item?.name ?? "",
    programme: item?.programme ?? "",
    school_code: item?.school_code ?? "",
    graduation_year: item?.graduation_year ?? "",
    current_role: item?.current_role ?? "",
    current_organization: item?.current_organization ?? "",
    country: item?.country ?? "Kenya",
    industry: item?.industry ?? "",
    sector: item?.sector ?? "employed",
    achievements: item?.achievements ?? "",
    bio: item?.bio ?? "",
    photo_url: item?.photo_url ?? "",
    linkedin_url: item?.linkedin_url ?? "",
    visibility: item?.visibility ?? "public",
    is_featured: item?.is_featured ?? false,
    is_published: item?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, graduation_year: form.graduation_year ? Number(form.graduation_year) : null };
      if (isNew) await apiPostAlumni(payload);
      else await apiPutAlumni(item!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Alumni Profile" : "Edit Alumni Profile"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Programme</label>
              <input value={form.programme} onChange={(e) => setForm((f) => ({ ...f, programme: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School Code</label>
              <input value={form.school_code} onChange={(e) => setForm((f) => ({ ...f, school_code: e.target.value }))}
                placeholder="e.g. SCIT" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-school-code" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graduation Year</label>
              <input type="number" value={form.graduation_year} onChange={(e) => setForm((f) => ({ ...f, graduation_year: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-grad-year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sector</label>
              <select value={form.sector} onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" data-testid="select-sector">
                {SECTORS.map((s) => <option key={s} value={s}>{SECTOR_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Role</label>
              <input value={form.current_role} onChange={(e) => setForm((f) => ({ ...f, current_role: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-role" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Organization</label>
              <input value={form.current_organization} onChange={(e) => setForm((f) => ({ ...f, current_organization: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-org" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-industry" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-country" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photo URL</label>
              <input value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-photo-url" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input value={form.linkedin_url} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-linkedin" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Achievements &amp; Impact</label>
              <textarea rows={3} value={form.achievements} onChange={(e) => setForm((f) => ({ ...f, achievements: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="textarea-achievements" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea rows={4} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="textarea-bio" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="rounded" data-testid="checkbox-featured" />
              Featured alumnus
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.visibility === "public"} onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.checked ? "public" : "private" }))} className="rounded" data-testid="checkbox-visibility" />
              Publicly visible
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50" data-testid="btn-save">
              {saving ? "Saving..." : isNew ? "Create Profile" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AlumniCmsPage() {
  const [items, setItems] = useState<Alumnus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Alumnus> | null | false>(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await apiGetAlumni();
      setItems((res as { data: Alumnus[] }).data ?? res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this alumni profile?")) return;
    try { await apiDeleteAlumni(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  const filtered = items.filter((i) =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.current_organization ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" /> Alumni Profiles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage alumni records, spotlights, and graduate destinations.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new">
            <Plus className="w-4 h-4" /> New Alumnus
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search alumni..."
          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-search" />
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Programme</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No alumni found</td></tr>
            ) : filtered.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors" data-testid={`alumni-row-${i.id}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{i.name}</p>
                  {i.current_organization && <p className="text-xs text-muted-foreground">{i.current_organization}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{i.current_role ?? "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{i.programme ?? "—"}{i.graduation_year ? ` '${String(i.graduation_year).slice(-2)}` : ""}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {i.is_featured && <span className="text-[10px] text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded">Featured</span>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${i.is_published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{i.is_published ? "Published" : "Draft"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setModal(i)} className="p-1.5 rounded hover:bg-muted" data-testid={`btn-edit-${i.id}`}><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => remove(i.id)} className="p-1.5 rounded hover:bg-red-50" data-testid={`btn-delete-${i.id}`}><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== false && <AlumnusModal item={modal} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}
