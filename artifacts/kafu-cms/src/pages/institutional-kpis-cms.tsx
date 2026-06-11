import React, { useEffect, useState } from "react";
import {
  apiGetInstitutionalKpis, apiPostInstitutionalKpi, apiPutInstitutionalKpi, apiDeleteInstitutionalKpi,
} from "@/lib/api";
import { BarChart3, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Kpi {
  id: number; slug: string; label: string; category: string;
  value?: number | string; display_value?: string; unit?: string;
  period_year?: number; trend?: string; trend_value?: number | string;
  icon?: string; description?: string; sort_order?: number;
  is_featured: boolean; is_published: boolean;
}

const CATEGORIES = ["overview", "enrollment", "academic", "research", "staff", "finance", "infrastructure", "community"];
const TRENDS = ["", "up", "down", "flat"];

function KpiModal({ item, onClose, onSaved }: { item: Partial<Kpi> | null; onClose: () => void; onSaved: () => void; }) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    label: item?.label ?? "", category: item?.category ?? "overview",
    value: item?.value ?? "", display_value: item?.display_value ?? "", unit: item?.unit ?? "",
    period_year: item?.period_year ?? "", trend: item?.trend ?? "", trend_value: item?.trend_value ?? "",
    icon: item?.icon ?? "", description: item?.description ?? "", sort_order: item?.sort_order ?? 0,
    is_featured: item?.is_featured ?? false, is_published: item?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const numOrNull = (v: string | number) => (v === "" || v === null ? null : Number(v));
      const payload = {
        ...form, value: numOrNull(form.value), period_year: numOrNull(form.period_year),
        trend: form.trend || null, trend_value: numOrNull(form.trend_value), sort_order: Number(form.sort_order) || 0,
      };
      if (isNew) await apiPostInstitutionalKpi(payload);
      else await apiPutInstitutionalKpi(item!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New KPI" : "Edit KPI"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Label *</label>
              <input required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-label" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" data-testid="select-category">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon (lucide name)</label>
              <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="users, book-open, award..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-icon" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numeric Value</label>
              <input type="number" step="0.01" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-value" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Value</label>
              <input value={form.display_value} onChange={(e) => setForm((f) => ({ ...f, display_value: e.target.value }))}
                placeholder="8,420 / 47.5% / KES 3.2B" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-display-value" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-unit" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Period Year</label>
              <input type="number" value={form.period_year} onChange={(e) => setForm((f) => ({ ...f, period_year: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-period-year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trend</label>
              <select value={form.trend} onChange={(e) => setForm((f) => ({ ...f, trend: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" data-testid="select-trend">
                {TRENDS.map((t) => <option key={t} value={t}>{t === "" ? "None" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trend Value (%)</label>
              <input type="number" step="0.1" value={form.trend_value} onChange={(e) => setForm((f) => ({ ...f, trend_value: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-trend-value" />
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
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="rounded" data-testid="checkbox-featured" />
              Featured (shown in hero stats)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
              Published
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50" data-testid="btn-save">
              {saving ? "Saving..." : isNew ? "Create KPI" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InstitutionalKpisCmsPage() {
  const [items, setItems] = useState<Kpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Kpi> | null | false>(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { const res = await apiGetInstitutionalKpis(); setItems((res as { data: Kpi[] }).data ?? res); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Load failed."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this KPI?")) return;
    try { await apiDeleteInstitutionalKpi(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Institutional KPIs</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage facts and figures shown on the public institutional data dashboard.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new"><Plus className="w-4 h-4" /> New KPI</button>
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Label</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Value</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? [...Array(5)].map((_, i) => (<tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>))
            : items.length === 0 ? (<tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No KPIs found</td></tr>)
            : items.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors" data-testid={`kpi-row-${i.id}`}>
                <td className="px-4 py-3 font-medium text-foreground">{i.label}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground capitalize">{i.category}</td>
                <td className="px-4 py-3 text-foreground">{i.display_value ?? i.value ?? "—"}</td>
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
      {modal !== false && <KpiModal item={modal} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}
