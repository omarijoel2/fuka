import React, { useEffect, useState } from "react";
import { apiGet, formatDateTime } from "@/lib/api";
import { ClipboardList, RefreshCw, Search } from "lucide-react";

interface AuditLogEntry {
  id: number;
  user_name: string | null;
  user_role: string | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  entity_title: string | null;
  notes: string | null;
  ip_address: string | null;
  created_at: string;
}

interface PageMeta { total: number; last_page: number; current_page: number; }

interface Query { search: string; entity_type: string; action: string; page: number; }

const ACTION_COLORS: Record<string, string> = {
  create:     "bg-emerald-50 text-emerald-700",
  update:     "bg-amber-50 text-amber-700",
  delete:     "bg-red-50 text-red-700",
  publish:    "bg-purple-50 text-purple-700",
  login:      "bg-gray-50 text-gray-600",
  logout:     "bg-gray-50 text-gray-600",
  transition: "bg-yellow-50 text-yellow-700",
};

function actionColor(action: string): string {
  const key = Object.keys(ACTION_COLORS).find((k) => action.startsWith(k));
  return key ? ACTION_COLORS[key] : "bg-gray-50 text-gray-600";
}

export default function AuditLogPage() {
  // "Draft" input state — changes as the user types / selects
  const [searchInput, setSearchInput]     = useState("");
  const [entityInput, setEntityInput]     = useState("");
  const [actionInput, setActionInput]     = useState("");

  // "Committed" query — only changes when Search is clicked or dropdowns change
  const [query, setQuery] = useState<Query>({ search: "", entity_type: "", action: "", page: 1 });

  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [meta, setMeta]       = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiGet("/audit-logs", {
          search:      query.search      || undefined,
          entity_type: query.entity_type || undefined,
          action:      query.action      || undefined,
          page:        query.page,
        });
        if (cancelled) return;
        setEntries(data?.data ?? []);
        setMeta(
          data
            ? { total: data.total ?? 0, last_page: data.last_page ?? 1, current_page: data.current_page ?? 1 }
            : null
        );
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load audit log.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [query]);

  function commitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setQuery({ search: searchInput, entity_type: entityInput, action: actionInput, page: 1 });
  }

  function changeDropdown(field: "entity_type" | "action", value: string) {
    if (field === "entity_type") {
      setEntityInput(value);
      setQuery((q) => ({ ...q, entity_type: value, page: 1 }));
    } else {
      setActionInput(value);
      setQuery((q) => ({ ...q, action: value, page: 1 }));
    }
  }

  function changePage(next: number) {
    setQuery((q) => ({ ...q, page: next }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{meta?.total ?? 0} log entries</p>
        </div>
        <button
          onClick={() => commitSearch()}
          disabled={loading}
          data-testid="btn-refresh-audit"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={commitSearch} className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user or content title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-audit-search"
          />
        </div>

        <select
          value={entityInput}
          onChange={(e) => changeDropdown("entity_type", e.target.value)}
          className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
          data-testid="select-entity-filter"
        >
          <option value="">All Entity Types</option>
          <option value="cms_content">Content</option>
          <option value="user">User</option>
          <option value="media_file">Media</option>
          <option value="taxonomy_term">Taxonomy</option>
          <option value="research_project">Research Project</option>
          <option value="publication">Publication</option>
        </select>

        <select
          value={actionInput}
          onChange={(e) => changeDropdown("action", e.target.value)}
          className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
          data-testid="select-action-filter"
        >
          <option value="">All Actions</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="publish">Publish</option>
          <option value="transition">Transition</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
          data-testid="btn-search-audit"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" data-testid="audit-error">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <ClipboardList className="w-10 h-10 opacity-30" />
            <p className="text-sm">No audit log entries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {["Time", "User", "Action", "Entity", "Title / Notes", "IP"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(entry.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{entry.user_name ?? "System"}</span>
                      {entry.user_role && (
                        <span className="ml-1.5 text-xs text-muted-foreground capitalize">
                          ({entry.user_role.replace(/_/g, " ")})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded tracking-wide ${actionColor(entry.action)}`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap capitalize">
                      {entry.entity_type ? entry.entity_type.replace(/_/g, " ") : "—"}
                      {entry.entity_id ? <span className="ml-1 font-mono">#{entry.entity_id}</span> : ""}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[260px]">
                      {entry.entity_title && (
                        <span className="block truncate font-medium text-foreground/80">{entry.entity_title}</span>
                      )}
                      {entry.notes && (
                        <span className="block truncate text-xs">{entry.notes}</span>
                      )}
                      {!entry.entity_title && !entry.notes && "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {entry.ip_address ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Page {meta.current_page} of {meta.last_page} &bull; {meta.total} entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => changePage(Math.max(1, query.page - 1))}
                disabled={meta.current_page <= 1}
                data-testid="btn-prev-audit"
                className="px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => changePage(Math.min(meta.last_page, query.page + 1))}
                disabled={meta.current_page >= meta.last_page}
                data-testid="btn-next-audit"
                className="px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
