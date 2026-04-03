import React, { useEffect, useState } from "react";
import { apiGet, formatDateTime } from "@/lib/api";
import { ClipboardList, RefreshCw, Search } from "lucide-react";

interface AuditLogEntry {
  id: number; user_name: string; action: string; entity_type: string;
  entity_id: number | null; description: string; ip_address: string | null;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-50 text-emerald-700",
  update: "bg-blue-50 text-blue-700",
  delete: "bg-red-50 text-red-700",
  publish: "bg-purple-50 text-purple-700",
  login: "bg-gray-50 text-gray-600",
  logout: "bg-gray-50 text-gray-600",
  transition: "bg-yellow-50 text-yellow-700",
};

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [meta, setMeta] = useState<{ total: number; last_page: number; current_page: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiGet("/audit-logs", {
        search: search || undefined,
        entity_type: entityFilter || undefined,
        page,
        per_page: 30,
      });
      setEntries(data?.data ?? []);
      setMeta(data?.meta ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load audit log.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{meta?.total ?? 0} log entries</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition" data-testid="btn-refresh-audit">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by user, action, entity..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-audit-search" />
        </div>
        <select value={entityFilter} onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
          data-testid="select-entity-filter">
          <option value="">All Entities</option>
          <option value="cms_content">Content</option>
          <option value="user">User</option>
          <option value="media_file">Media</option>
          <option value="taxonomy_term">Taxonomy</option>
        </select>
        <button onClick={() => { setPage(1); load(); }}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90" data-testid="btn-search-audit">
          Search
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <ClipboardList className="w-10 h-10 opacity-30" />
            <p className="text-sm">No audit log entries found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {["Time", "User", "Action", "Entity", "Description", "IP"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(entry.created_at)}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{entry.user_name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${ACTION_COLORS[entry.action] ?? "bg-gray-50 text-gray-600"}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {entry.entity_type.replace("_", " ")}
                    {entry.entity_id ? ` #${entry.entity_id}` : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{entry.description}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{entry.ip_address ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page} &bull; {meta.total} entries</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.current_page <= 1}
                className="px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40" data-testid="btn-prev-audit">Previous</button>
              <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={meta.current_page >= meta.last_page}
                className="px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40" data-testid="btn-next-audit">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
