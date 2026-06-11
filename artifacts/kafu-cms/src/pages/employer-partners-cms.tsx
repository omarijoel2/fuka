import React, { useEffect, useState } from "react";
import {
  apiGetEmployerPartners, apiPostEmployerPartner, apiPutEmployerPartner, apiDeleteEmployerPartner,
} from "@/lib/api";
import { Building2, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Employer {
  id: number; slug: string; name: string; industry?: string;
  description?: string; website_url?: string; logo_url?: string;
  partnership_status?: string; internship_opportunities?: boolean; graduate_hires?: number;
  is_featured: boolean; is_published: boolean;
}

const PARTNERSHIP_STATUSES = ["active", "prospective", "mou_signed", "inactive"];
const STATUS_LABELS: Record<string, string> = {
  active: "Active", prospective: "Prospective", mou_signed: "MOU Signed", inactive: "Inactive",
};

function EmployerModal({ item, onClose, onSaved }: {
  item: Partial<Employer> | null; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    name: item?.name ?? "",
    industry: item?.industry ?? "",
    description: item?.description ?? "",
    website_url: item?.website_url ?? "",
    logo_url: item?.logo_url ?? "",
    partnership_status: item?.partnership_status ?? "active",
    internship_opportunities: item?.internship_opportunities ?? false,
    graduate_hires: item?.graduate_hires ?? "",
    is_featured: item?.is_featured ?? false,
    is_published: item?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, graduate_hires: form.graduate_hires ? Number(form.graduate_hires) : 0 };
      if (isNew) await apiPostEmployerPartner(payload);
      else await apiPutEmployerPartner(item!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Employer Partner" : "Edit Employer Partner"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-industry" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Partnership Status</label>
              <select value={form.partnership_status} onChange={(e) => setForm((f) => ({ ...f, partnership_status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" data-testid="select-partnership-status">
                {PARTNERSHIP_STATUSES.map((t) => <option key={t} value={t}>{STATUS_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graduate Hires</label>
              <input type="number" value={form.graduate_hires} onChange={(e) => setForm((f) => ({ ...f, graduate_hires: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-graduate-hires" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-logo-url" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-website-url" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="textarea-description" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.internship_opportunities} onChange={(e) => setForm((f) => ({ ...f, internship_opportunities: e.target.checked }))} className="rounded" data-testid="checkbox-internship" />
              Offers internships
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="rounded" data-testid="checkbox-featured" />
              Featured partner
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
              Published
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50" data-testid="btn-save">
              {saving ? "Saving..." : isNew ? "Create Partner" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmployerPartnersCmsPage() {
  const [items, setItems] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Employer> | null | false>(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await apiGetEmployerPartners();
      setItems((res as { data: Employer[] }).data ?? res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this employer partner?")) return;
    try { await apiDeleteEmployerPartner(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" /> Employer Partners
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage organizations that recruit and partner with KAFU.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new">
            <Plus className="w-4 h-4" /> New Partner
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Industry</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Hires</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No partners found</td></tr>
            ) : items.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors" data-testid={`employer-row-${i.id}`}>
                <td className="px-4 py-3 font-medium text-foreground">{i.name}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{i.industry ?? "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{i.graduate_hires ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {i.partnership_status && <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{STATUS_LABELS[i.partnership_status] ?? i.partnership_status}</span>}
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

      {modal !== false && <EmployerModal item={modal} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}
