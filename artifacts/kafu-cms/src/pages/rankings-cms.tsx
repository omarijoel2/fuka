import React, { useEffect, useState } from "react";
import {
  apiGetRankings, apiPostRanking, apiPutRanking, apiDeleteRanking,
} from "@/lib/api";
import { Trophy, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Ranking {
  id: number; slug: string; organization: string; title: string;
  rank_value?: string; rank_numeric?: number; category: string;
  year?: number; scope?: string; logo_url?: string; source_url?: string;
  description?: string; sort_order?: number; is_featured: boolean; is_published: boolean;
}

const CATEGORIES = ["national", "regional", "global", "subject"];

function RankingModal({ item, onClose, onSaved }: { item: Partial<Ranking> | null; onClose: () => void; onSaved: () => void; }) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    organization: item?.organization ?? "", title: item?.title ?? "",
    rank_value: item?.rank_value ?? "", rank_numeric: item?.rank_numeric ?? "",
    category: item?.category ?? "national", year: item?.year ?? "", scope: item?.scope ?? "",
    logo_url: item?.logo_url ?? "", source_url: item?.source_url ?? "", description: item?.description ?? "",
    sort_order: item?.sort_order ?? 0, is_featured: item?.is_featured ?? false, is_published: item?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const numOrNull = (v: string | number) => (v === "" || v === null ? null : Number(v));
      const payload = { ...form, rank_numeric: numOrNull(form.rank_numeric), year: numOrNull(form.year), sort_order: Number(form.sort_order) || 0 };
      if (isNew) await apiPostRanking(payload);
      else await apiPutRanking(item!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Ranking" : "Edit Ranking"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Organization *</label>
              <input required value={form.organization} onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                placeholder="Webometrics, uniRank..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-organization" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" data-testid="select-category">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rank Value (display)</label>
              <input value={form.rank_value} onChange={(e) => setForm((f) => ({ ...f, rank_value: e.target.value }))}
                placeholder="Top 25, #23..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-rank-value" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rank Numeric</label>
              <input type="number" value={form.rank_numeric} onChange={(e) => setForm((f) => ({ ...f, rank_numeric: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-rank-numeric" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scope</label>
              <input value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                placeholder="Kenya, Africa, Global..." className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-scope" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-logo-url" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Source URL</label>
              <input value={form.source_url} onChange={(e) => setForm((f) => ({ ...f, source_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-source-url" />
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
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
              Published
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50" data-testid="btn-save">
              {saving ? "Saving..." : isNew ? "Create Ranking" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RankingsCmsPage() {
  const [items, setItems] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Ranking> | null | false>(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { const res = await apiGetRankings(); setItems((res as { data: Ranking[] }).data ?? res); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Load failed."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this ranking?")) return;
    try { await apiDeleteRanking(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Trophy className="w-6 h-6 text-primary" /> Rankings &amp; Recognition</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage external university rankings shown publicly.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new"><Plus className="w-4 h-4" /> New Ranking</button>
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Organization</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Rank</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Year</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? [...Array(4)].map((_, i) => (<tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>))
            : items.length === 0 ? (<tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No rankings found</td></tr>)
            : items.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors" data-testid={`ranking-row-${i.id}`}>
                <td className="px-4 py-3"><p className="font-medium text-foreground">{i.organization}</p><p className="text-xs text-muted-foreground">{i.title}</p></td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground capitalize">{i.category}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{i.rank_value ?? (i.rank_numeric ? `#${i.rank_numeric}` : "—")}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{i.year ?? "—"}</td>
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
      {modal !== false && <RankingModal item={modal} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}
