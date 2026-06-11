import React, { useEffect, useState } from "react";
import {
  apiGetGraduateOutcomes, apiPostGraduateOutcome, apiPutGraduateOutcome, apiDeleteGraduateOutcome,
} from "@/lib/api";
import { TrendingUp, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Outcome {
  id: number; programme: string; school_code?: string; cohort_year?: number;
  graduates_surveyed?: number; employment_rate?: number | string;
  further_study_rate?: number | string; entrepreneurship_rate?: number | string;
  avg_time_to_employment_months?: number | string; notes?: string;
  is_published: boolean;
}

function num(v: number | string | undefined | null): number {
  if (v === undefined || v === null) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}

function OutcomeModal({ item, onClose, onSaved }: {
  item: Partial<Outcome> | null; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    programme: item?.programme ?? "",
    school_code: item?.school_code ?? "",
    cohort_year: item?.cohort_year ?? "",
    graduates_surveyed: item?.graduates_surveyed ?? "",
    employment_rate: item?.employment_rate ?? "",
    further_study_rate: item?.further_study_rate ?? "",
    entrepreneurship_rate: item?.entrepreneurship_rate ?? "",
    avg_time_to_employment_months: item?.avg_time_to_employment_months ?? "",
    notes: item?.notes ?? "",
    is_published: item?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const numOrNull = (v: string | number) => (v === "" || v === null ? null : Number(v));
      const payload = {
        ...form,
        cohort_year: numOrNull(form.cohort_year),
        graduates_surveyed: numOrNull(form.graduates_surveyed),
        employment_rate: numOrNull(form.employment_rate),
        further_study_rate: numOrNull(form.further_study_rate),
        entrepreneurship_rate: numOrNull(form.entrepreneurship_rate),
        avg_time_to_employment_months: numOrNull(form.avg_time_to_employment_months),
      };
      if (isNew) await apiPostGraduateOutcome(payload);
      else await apiPutGraduateOutcome(item!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Graduate Outcome" : "Edit Graduate Outcome"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Programme *</label>
              <input required value={form.programme} onChange={(e) => setForm((f) => ({ ...f, programme: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School Code</label>
              <input value={form.school_code} onChange={(e) => setForm((f) => ({ ...f, school_code: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-school-code" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cohort Year</label>
              <input type="number" value={form.cohort_year} onChange={(e) => setForm((f) => ({ ...f, cohort_year: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-cohort-year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graduates Surveyed</label>
              <input type="number" value={form.graduates_surveyed} onChange={(e) => setForm((f) => ({ ...f, graduates_surveyed: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-surveyed" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Avg. Months to Employment</label>
              <input type="number" step="0.1" value={form.avg_time_to_employment_months} onChange={(e) => setForm((f) => ({ ...f, avg_time_to_employment_months: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-time-to-employment" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employment Rate (%)</label>
              <input type="number" step="0.1" value={form.employment_rate} onChange={(e) => setForm((f) => ({ ...f, employment_rate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-employment-rate" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Further Study Rate (%)</label>
              <input type="number" step="0.1" value={form.further_study_rate} onChange={(e) => setForm((f) => ({ ...f, further_study_rate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-further-study-rate" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Entrepreneurship Rate (%)</label>
              <input type="number" step="0.1" value={form.entrepreneurship_rate} onChange={(e) => setForm((f) => ({ ...f, entrepreneurship_rate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-entrepreneurship-rate" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="textarea-notes" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
            Published
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50" data-testid="btn-save">
              {saving ? "Saving..." : isNew ? "Create Outcome" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GraduateOutcomesCmsPage() {
  const [items, setItems] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Outcome> | null | false>(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await apiGetGraduateOutcomes();
      setItems((res as { data: Outcome[] }).data ?? res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this outcome record?")) return;
    try { await apiDeleteGraduateOutcome(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> Graduate Outcomes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage tracer-survey employment data by programme and cohort.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new">
            <Plus className="w-4 h-4" /> New Outcome
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Programme</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Cohort</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Employed</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Further Study</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No outcomes found</td></tr>
            ) : items.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors" data-testid={`outcome-row-${i.id}`}>
                <td className="px-4 py-3 font-medium text-foreground">{i.programme}{i.school_code ? <span className="text-xs text-muted-foreground ml-2">{i.school_code}</span> : null}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{i.cohort_year ?? "—"}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{num(i.employment_rate)}%</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{num(i.further_study_rate)}%</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${i.is_published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{i.is_published ? "Published" : "Draft"}</span>
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

      {modal !== false && <OutcomeModal item={modal} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}
