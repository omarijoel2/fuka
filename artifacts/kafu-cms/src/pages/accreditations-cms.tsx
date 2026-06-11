import React, { useEffect, useState } from "react";
import {
  apiGetAccreditations, apiPostAccreditation, apiPutAccreditation, apiDeleteAccreditation,
} from "@/lib/api";
import { ShieldCheck, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Accreditation {
  id: number; slug: string; body_name: string; accreditation_type: string;
  programme?: string; school_code?: string; status: string;
  award_date?: string; expiry_date?: string; certificate_url?: string;
  logo_url?: string; description?: string; sort_order?: number; is_published: boolean;
}

const TYPES = ["institutional", "programme"];
const STATUSES = ["accredited", "provisional", "candidate", "expired"];

function AccreditationModal({ item, onClose, onSaved }: { item: Partial<Accreditation> | null; onClose: () => void; onSaved: () => void; }) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    body_name: item?.body_name ?? "", accreditation_type: item?.accreditation_type ?? "institutional",
    programme: item?.programme ?? "", school_code: item?.school_code ?? "", status: item?.status ?? "accredited",
    award_date: item?.award_date ?? "", expiry_date: item?.expiry_date ?? "", certificate_url: item?.certificate_url ?? "",
    logo_url: item?.logo_url ?? "", description: item?.description ?? "", sort_order: item?.sort_order ?? 0,
    is_published: item?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, programme: form.programme || null, school_code: form.school_code || null,
        award_date: form.award_date || null, expiry_date: form.expiry_date || null, sort_order: Number(form.sort_order) || 0 };
      if (isNew) await apiPostAccreditation(payload);
      else await apiPutAccreditation(item!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Accreditation" : "Edit Accreditation"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Accrediting Body *</label>
              <input required value={form.body_name} onChange={(e) => setForm((f) => ({ ...f, body_name: e.target.value }))}
                placeholder="Commission for University Education..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-body-name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.accreditation_type} onChange={(e) => setForm((f) => ({ ...f, accreditation_type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" data-testid="select-type">
                {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" data-testid="select-status">
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Programme (if programme-level)</label>
              <input value={form.programme} onChange={(e) => setForm((f) => ({ ...f, programme: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School Code</label>
              <input value={form.school_code} onChange={(e) => setForm((f) => ({ ...f, school_code: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-school-code" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Award Date</label>
              <input type="date" value={form.award_date} onChange={(e) => setForm((f) => ({ ...f, award_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-award-date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-expiry-date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Certificate URL</label>
              <input value={form.certificate_url} onChange={(e) => setForm((f) => ({ ...f, certificate_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-certificate-url" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-logo-url" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-sort-order" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="textarea-description" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
            Published
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50" data-testid="btn-save">
              {saving ? "Saving..." : isNew ? "Create Accreditation" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccreditationsCmsPage() {
  const [items, setItems] = useState<Accreditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Accreditation> | null | false>(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { const res = await apiGetAccreditations(); setItems((res as { data: Accreditation[] }).data ?? res); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Load failed."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this accreditation?")) return;
    try { await apiDeleteAccreditation(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-primary" /> Accreditations</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage institutional and programme accreditation records.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new"><Plus className="w-4 h-4" /> New Accreditation</button>
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Body</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Expiry</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? [...Array(5)].map((_, i) => (<tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>))
            : items.length === 0 ? (<tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No accreditations found</td></tr>)
            : items.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors" data-testid={`accreditation-row-${i.id}`}>
                <td className="px-4 py-3"><p className="font-medium text-foreground">{i.body_name}</p>{i.programme && <p className="text-xs text-muted-foreground">{i.programme}</p>}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground capitalize">{i.accreditation_type}</td>
                <td className="px-4 py-3"><span className="text-[11px] px-2 py-0.5 rounded border capitalize bg-muted">{i.status}</span></td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{i.expiry_date ?? "—"}</td>
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
      {modal !== false && <AccreditationModal item={modal} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}
