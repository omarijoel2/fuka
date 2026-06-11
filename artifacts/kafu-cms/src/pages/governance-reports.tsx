import { useState, useEffect, useCallback } from "react";
import { FileBarChart, Plus, Trash2, X, RefreshCw, AlertTriangle, CheckCircle2, ListChecks, Lightbulb } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ReportSummary {
  id: number; type: string; type_label: string; title: string;
  period_start: string | null; period_end: string | null;
  status: string; created_at: string;
}

interface ReportType { key: string; label: string }

interface ReportPayload {
  executive_summary: string;
  key_risks: string[];
  resolved_issues: string[];
  pending_issues: string[];
  recommendations: string[];
  responsible_offices: string[];
  timelines: string;
  metrics: Record<string, number>;
}

interface FullReport extends ReportSummary {
  payload: ReportPayload;
}

export default function GovernanceReportsPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [types, setTypes] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [viewing, setViewing] = useState<FullReport | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/webmaster/reports");
      setReports(res?.data ?? []);
      setTypes(res?.types ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function view(id: number) {
    try {
      const r = await apiFetch(`/webmaster/reports/${id}`);
      setViewing(r);
    } catch { /* ignore */ }
  }

  async function remove(id: number) {
    if (!confirm("Delete this report?")) return;
    try {
      await apiFetch(`/webmaster/reports/${id}`, { method: "DELETE" });
      load();
    } catch { /* ignore */ }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileBarChart className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Governance Reports</h1>
            <p className="text-sm text-gray-500">Generate executive reports for management and ICT governance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button data-testid="btn-refresh-reports" onClick={load} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button data-testid="btn-generate-report" onClick={() => setShowGenerate(true)} className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No reports yet. Generate your first report.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Report</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Period</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Generated</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => view(r.id)} data-testid={`report-row-${r.id}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{r.type_label}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                    {r.period_start ? new Date(r.period_start).toLocaleDateString() : "—"} – {r.period_end ? new Date(r.period_end).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button data-testid={`btn-view-report-${r.id}`} onClick={() => view(r.id)} className="px-2 py-1 text-xs text-primary hover:bg-primary/5 rounded mr-1">View</button>
                    <button data-testid={`btn-delete-report-${r.id}`} onClick={() => remove(r.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600 inline-flex"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showGenerate && <GenerateModal types={types} onClose={() => setShowGenerate(false)} onGenerated={() => { setShowGenerate(false); load(); }} />}
      {viewing && <ReportViewer report={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function GenerateModal({ types, onClose, onGenerated }: { types: ReportType[]; onClose: () => void; onGenerated: () => void }) {
  const [type, setType] = useState(types[0]?.key ?? "monthly_webmaster");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function generate() {
    setSaving(true);
    setErr(null);
    try {
      await apiFetch("/webmaster/reports/generate", {
        method: "POST",
        body: JSON.stringify({ type, period_start: start || null, period_end: end || null }),
      });
      onGenerated();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to generate report");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="generate-report-modal">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Generate Report</h3>
          <button data-testid="btn-close-generate" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {err && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{err}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Report Type</label>
            <select data-testid="select-report-type" value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {types.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Period start</label>
              <input data-testid="input-report-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Period end</label>
              <input data-testid="input-report-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Leave dates blank to report on the current month to date.</p>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button data-testid="btn-cancel-generate" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button data-testid="btn-confirm-generate" onClick={generate} disabled={saving} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">{saving ? "Generating..." : "Generate"}</button>
        </div>
      </div>
    </div>
  );
}

function ReportViewer({ report, onClose }: { report: FullReport; onClose: () => void }) {
  const p = report.payload;
  const metricLabels: Record<string, string> = {
    total_content: "Total Content", published: "Published", drafts: "Drafts",
    pending_review: "Pending Review", published_in_period: "Published (Period)",
    expired: "Expired", stale: "Stale", critical_freshness: "Critical Freshness",
    missing_seo: "Missing SEO", open_tasks: "Open Tasks", resolved_tasks: "Resolved Tasks",
    active_alerts: "Active Alerts", critical_alerts: "Critical Alerts",
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="report-viewer">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h3 className="font-bold text-gray-900">{report.title}</h3>
            <p className="text-xs text-gray-500">{report.type_label}</p>
          </div>
          <button data-testid="btn-close-report-viewer" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <section>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Executive Summary</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{p.executive_summary}</p>
          </section>

          {p.metrics && (
            <section>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Metrics</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(p.metrics).map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xl font-bold text-gray-900">{v}</p>
                    <p className="text-xs text-gray-500">{metricLabels[k] ?? k}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <ReportList title="Key Risks" icon={<AlertTriangle className="w-4 h-4 text-amber-600" />} items={p.key_risks} />
          <ReportList title="Resolved Issues" icon={<CheckCircle2 className="w-4 h-4 text-green-600" />} items={p.resolved_issues} />
          <ReportList title="Pending Issues" icon={<ListChecks className="w-4 h-4 text-blue-600" />} items={p.pending_issues} />
          <ReportList title="Recommendations" icon={<Lightbulb className="w-4 h-4 text-primary" />} items={p.recommendations} />

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Responsible Offices</h4>
              <ul className="text-sm text-gray-600 space-y-1">{p.responsible_offices.map((o, i) => <li key={i}>· {o}</li>)}</ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Timelines</h4>
              <p className="text-sm text-gray-600">{p.timelines}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ReportList({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">{icon}{title}</h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-gray-300">·</span><span>{it}</span></li>)}
      </ul>
    </section>
  );
}
