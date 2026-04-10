import React, { useEffect, useState } from "react";
import { apiGetResearchGrants, apiPostResearchGrant, apiPutResearchGrant, apiDeleteResearchGrant, apiGetResearchProjects, formatDate } from "@/lib/api";
import { Banknote, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Project { id: number; title: string; }
interface Grant {
  id: number; name: string; funder: string; funder_type?: string; funder_country?: string;
  amount?: number; currency: string; start_date?: string; end_date?: string;
  status: string; description?: string; grant_number?: string;
  research_project_id?: number; project?: { title: string };
}

const STATUSES = ["pending", "active", "completed"];
const STATUS_COLOURS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800", completed: "bg-blue-100 text-blue-800", pending: "bg-yellow-100 text-yellow-800",
};
const FUNDER_TYPES = ["government", "ngo", "bilateral", "multilateral", "private", "university", "foundation"];
const CURRENCIES = ["USD", "EUR", "GBP", "KES", "SEK", "NOK", "DKK"];

function GrantModal({ grant, projects, onClose, onSaved }: {
  grant: Partial<Grant> | null; projects: Project[]; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !grant?.id;
  const [form, setForm] = useState({
    name: grant?.name ?? "",
    funder: grant?.funder ?? "",
    funder_type: grant?.funder_type ?? "",
    funder_country: grant?.funder_country ?? "",
    amount: grant?.amount ?? "",
    currency: grant?.currency ?? "USD",
    start_date: grant?.start_date ?? "",
    end_date: grant?.end_date ?? "",
    status: grant?.status ?? "active",
    description: grant?.description ?? "",
    grant_number: grant?.grant_number ?? "",
    research_project_id: grant?.research_project_id ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, amount: form.amount ? Number(form.amount) : null, research_project_id: form.research_project_id || null };
      if (isNew) await apiPostResearchGrant(payload);
      else await apiPutResearchGrant(grant!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Grant" : "Edit Grant"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Grant Name *</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-grant-name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Funder *</label>
              <input required value={form.funder} onChange={(e) => setForm((f) => ({ ...f, funder: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-funder" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Funder Type</label>
              <select value={form.funder_type} onChange={(e) => setForm((f) => ({ ...f, funder_type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="select-funder-type">
                <option value="">Select type</option>
                {FUNDER_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Funder Country</label>
              <input value={form.funder_country} onChange={(e) => setForm((f) => ({ ...f, funder_country: e.target.value }))}
                placeholder="e.g. United States"
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-funder-country" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grant Number</label>
              <input value={form.grant_number} onChange={(e) => setForm((f) => ({ ...f, grant_number: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-grant-number" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input type="number" min={0} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-amount" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="select-currency">
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-start-date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-end-date" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              data-testid="select-status">
              {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="textarea-description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Linked Research Project</label>
            <select value={form.research_project_id} onChange={(e) => setForm((f) => ({ ...f, research_project_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              data-testid="select-project">
              <option value="">No linked project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              data-testid="btn-save-grant">
              {saving ? "Saving..." : isNew ? "Create Grant" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatCurrency(amount?: number, currency = "USD") {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default function ResearchGrantsCmsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Grant> | null | false>(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [grantRes, projRes] = await Promise.all([
        apiGetResearchGrants({ status: statusFilter || undefined }),
        apiGetResearchProjects({ per_page: 100 }),
      ]);
      setGrants((grantRes as { data: Grant[] }).data ?? grantRes);
      setProjects((projRes as { data: Project[] }).data ?? projRes);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const deleteGrant = async (id: number) => {
    if (!confirm("Delete this grant?")) return;
    try { await apiDeleteResearchGrant(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Banknote className="w-6 h-6 text-primary" /> Research Grants
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track external research funding and grant agreements.</p>
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-status-filter">
            <option value="">All Grants</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new-grant">
            <Plus className="w-4 h-4" /> New Grant
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Grant</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Funder</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Value</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : grants.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No grants found</td></tr>
            ) : grants.map((g) => (
              <tr key={g.id} className="hover:bg-muted/30 transition-colors" data-testid={`grant-row-${g.id}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{g.name}</p>
                  {g.grant_number && <p className="text-xs text-muted-foreground">#{g.grant_number}</p>}
                  {g.project && <p className="text-xs text-primary/80">{g.project.title}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-sm">{g.funder}</p>
                  {g.funder_country && <p className="text-xs text-muted-foreground">{g.funder_country}</p>}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell font-semibold text-primary">{formatCurrency(g.amount, g.currency)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOURS[g.status]}`}>
                    {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setModal(g)} className="p-1.5 rounded hover:bg-muted" data-testid={`btn-edit-${g.id}`}>
                      <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => deleteGrant(g.id)} className="p-1.5 rounded hover:bg-red-50" data-testid={`btn-delete-${g.id}`}>
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== false && (
        <GrantModal grant={modal} projects={projects} onClose={() => setModal(false)} onSaved={load} />
      )}
    </div>
  );
}
