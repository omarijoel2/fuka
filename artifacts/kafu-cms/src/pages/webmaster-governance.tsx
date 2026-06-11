import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck, AlertTriangle, FileClock, FileCheck2, FileX2, UserX,
  Users, Bell, CheckCircle2, Filter, RefreshCw,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Overview {
  summary: {
    pending_approvals: number;
    awaiting_review: number;
    drafts: number;
    recently_published: number;
    expired: number;
    inactive_owners: number;
  };
  by_department: { department: string; total: number }[];
  by_type: { type: string; total: number }[];
  by_owner: { owner_id: number; owner_name: string; total: number }[];
  inactive_owners: { id: number; name: string; role_label: string; department: string | null; last_login_at: string | null }[];
}

interface ContentRow {
  id: number; title: string; type: string; status: string;
  department: string | null; owner: string; updated_at: string;
  expiry_date: string | null;
}

interface AlertRow {
  id: number; type: string; severity: string; title: string;
  message: string | null; content_title: string | null; status: string;
}

const BUCKETS = [
  { key: "pending", label: "Pending Approvals" },
  { key: "review", label: "Awaiting Review" },
  { key: "drafts", label: "Drafts" },
  { key: "recent", label: "Recently Published" },
  { key: "expired", label: "Expired" },
];

const SEVERITY_COLOR: Record<string, string> = {
  critical: "bg-red-100 text-red-800 border-red-200",
  major: "bg-amber-100 text-amber-800 border-amber-200",
  minor: "bg-blue-100 text-blue-800 border-blue-200",
  info: "bg-gray-100 text-gray-700 border-gray-200",
};

const STATUS_COLOR: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-amber-100 text-amber-800",
  approved: "bg-indigo-100 text-indigo-800",
  scheduled: "bg-purple-100 text-purple-800",
  unpublished: "bg-orange-100 text-orange-800",
  archived: "bg-gray-100 text-gray-500",
};

function StatCard({ label, value, icon, accent, active, onClick, testid }: {
  label: string; value: number; icon: React.ReactNode; accent: string;
  active?: boolean; onClick?: () => void; testid: string;
}) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className={`text-left bg-white rounded-xl border p-4 transition-all ${active ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="flex items-center justify-between">
        <span className={`p-2 rounded-lg ${accent}`}>{icon}</span>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">{label}</p>
    </button>
  );
}

export default function WebmasterGovernancePage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [bucket, setBucket] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [filterType, setFilterType] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterOptions, setFilterOptions] = useState<{ types: string[]; departments: string[] }>({ types: [], departments: [] });
  const [showFilters, setShowFilters] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, al, fo] = await Promise.all([
        apiFetch("/webmaster/governance/overview"),
        apiFetch("/webmaster/alerts"),
        apiFetch("/webmaster/governance/filters"),
      ]);
      setOverview(ov);
      setAlerts(al?.data ?? []);
      setFilterOptions({ types: fo?.types ?? [], departments: fo?.departments ?? [] });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load console");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTable = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams({ bucket });
      if (filterType) params.set("type", filterType);
      if (filterDept) params.set("department", filterDept);
      const data = await apiFetch(`/webmaster/governance/content?${params.toString()}`);
      setRows(data?.data ?? []);
    } catch {
      setRows([]);
    } finally {
      setTableLoading(false);
    }
  }, [bucket, filterType, filterDept]);

  useEffect(() => { loadOverview(); }, [loadOverview]);
  useEffect(() => { loadTable(); }, [loadTable]);

  async function resolveAlert(id: number, status: string) {
    try {
      await apiFetch(`/webmaster/alerts/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      loadOverview();
    } catch { /* ignore */ }
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-400 text-sm">Loading Webmaster Console...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Governance</h1>
            <p className="text-sm text-gray-500">Monitor approvals, ownership, and content risk across the site</p>
          </div>
        </div>
        <button
          data-testid="btn-refresh-governance"
          onClick={() => { loadOverview(); loadTable(); }}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4" data-testid="governance-error">{error}</div>
      )}

      {/* Summary */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard testid="stat-pending" label="Pending Approvals" value={overview.summary.pending_approvals} icon={<FileClock className="w-4 h-4 text-amber-700" />} accent="bg-amber-100" active={bucket === "pending"} onClick={() => setBucket("pending")} />
          <StatCard testid="stat-review" label="Awaiting Review" value={overview.summary.awaiting_review} icon={<FileCheck2 className="w-4 h-4 text-blue-700" />} accent="bg-blue-100" active={bucket === "review"} onClick={() => setBucket("review")} />
          <StatCard testid="stat-drafts" label="Unpublished Drafts" value={overview.summary.drafts} icon={<FileClock className="w-4 h-4 text-gray-700" />} accent="bg-gray-100" active={bucket === "drafts"} onClick={() => setBucket("drafts")} />
          <StatCard testid="stat-published" label="Recently Published" value={overview.summary.recently_published} icon={<FileCheck2 className="w-4 h-4 text-green-700" />} accent="bg-green-100" active={bucket === "recent"} onClick={() => setBucket("recent")} />
          <StatCard testid="stat-expired" label="Expired Notices" value={overview.summary.expired} icon={<FileX2 className="w-4 h-4 text-red-700" />} accent="bg-red-100" active={bucket === "expired"} onClick={() => setBucket("expired")} />
          <StatCard testid="stat-inactive-owners" label="Inactive Owners" value={overview.summary.inactive_owners} icon={<UserX className="w-4 h-4 text-orange-700" />} accent="bg-orange-100" />
        </div>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-red-600" />
            <h2 className="text-sm font-semibold text-gray-900">Active Alerts ({alerts.length})</h2>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.slice(0, 30).map((a) => (
              <div key={a.id} className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${SEVERITY_COLOR[a.severity] ?? "bg-gray-50 border-gray-200"}`} data-testid={`alert-${a.id}`}>
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  {a.message && <p className="text-xs opacity-80 mt-0.5">{a.message}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button data-testid={`btn-ack-alert-${a.id}`} onClick={() => resolveAlert(a.id, "acknowledged")} className="px-2 py-1 text-xs rounded bg-white/70 hover:bg-white">Ack</button>
                  <button data-testid={`btn-resolve-alert-${a.id}`} onClick={() => resolveAlert(a.id, "resolved")} className="px-2 py-1 text-xs rounded bg-white/70 hover:bg-white flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ownership breakdown */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <BreakdownCard title="By Department" icon={<Users className="w-4 h-4 text-primary" />} rows={overview.by_department.map((d) => ({ label: d.department, value: d.total }))} testid="breakdown-department" />
          <BreakdownCard title="By Content Type" icon={<Users className="w-4 h-4 text-primary" />} rows={overview.by_type.map((d) => ({ label: d.type, value: d.total }))} testid="breakdown-type" />
          <BreakdownCard title="Top Content Owners" icon={<Users className="w-4 h-4 text-primary" />} rows={overview.by_owner.slice(0, 8).map((d) => ({ label: d.owner_name, value: d.total }))} testid="breakdown-owner" />
        </div>
      )}

      {/* Inactive owners */}
      {overview && overview.inactive_owners.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <UserX className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-semibold text-gray-900">Inactive Content Owners (no updates in 90 days)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {overview.inactive_owners.map((o) => (
              <div key={o.id} className="px-3 py-2 rounded-lg bg-orange-50 border border-orange-100 text-sm" data-testid={`inactive-owner-${o.id}`}>
                <p className="font-medium text-gray-900">{o.name}</p>
                <p className="text-xs text-gray-500">{o.role_label}{o.department ? ` · ${o.department}` : ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-100">
          {BUCKETS.map((b) => (
            <button
              key={b.key}
              data-testid={`tab-${b.key}`}
              onClick={() => setBucket(b.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${bucket === b.key ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {b.label}
            </button>
          ))}
          <button
            data-testid="btn-governance-filters"
            onClick={() => setShowFilters((p) => !p)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border-b border-gray-100 bg-gray-50">
            <select data-testid="filter-gov-type" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All Types</option>
              {filterOptions.types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select data-testid="filter-gov-dept" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">All Departments</option>
              {filterOptions.departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        <div className="overflow-x-auto">
          {tableLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No content in this view.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Owner</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Dept</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50" data-testid={`gov-row-${r.id}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs"><div className="line-clamp-2">{r.title}</div></td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{r.type}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{r.owner}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{r.department ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[r.status] ?? "bg-gray-100 text-gray-700"}`}>{r.status.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ title, icon, rows, testid }: { title: string; icon: React.ReactNode; rows: { label: string; value: number }[]; testid: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4" data-testid={testid}>
      <div className="flex items-center gap-2 mb-3">{icon}<h3 className="text-sm font-semibold text-gray-900">{title}</h3></div>
      <div className="space-y-2">
        {rows.length === 0 ? <p className="text-xs text-gray-400">No data</p> : rows.map((r, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-gray-600 truncate pr-2">{r.label}</span>
              <span className="font-semibold text-gray-900">{r.value}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(r.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
