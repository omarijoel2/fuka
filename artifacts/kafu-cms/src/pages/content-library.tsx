import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { apiGet, apiPost, CONTENT_TYPE_LABELS, CONTENT_TYPES, STATUS_LABELS, formatDate } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import { useAuth } from "@/lib/auth";
import { Plus, Search, Filter, Edit2, Upload } from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: string;
  author: string | { id: number; name: string; role: string } | null;
  author_id?: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  summary: string | null;
}

interface Meta {
  current_page: number; last_page: number; total: number; per_page: number;
}

const ADMIN_ROLES = ["super_admin", "ict_admin", "communications_admin"];

export default function ContentLibraryPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialType = params.get("type") ?? "";
  const { user } = useAuth();

  const [items, setItems] = useState<ContentItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [publishing, setPublishing] = useState<number | null>(null);
  const [, navigate] = useLocation();

  const isAdmin = user && ADMIN_ROLES.includes(user.role);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/content", {
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
        page,
        per_page: 20,
      });
      setItems(data.data ?? []);
      setMeta(data ? {
        total: data.total ?? 0,
        last_page: data.last_page ?? 1,
        current_page: data.current_page ?? 1,
        per_page: data.per_page ?? 20,
      } : null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load content.");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    setTypeFilter(initialType);
    setPage(1);
  }, [initialType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleForcePublish = async (item: ContentItem) => {
    if (!window.confirm(`Publish "${item.title}" now? This will make it visible on the website immediately.`)) return;
    setPublishing(item.id);
    setError("");
    try {
      await apiPost(`/content/${item.id}/force-publish`);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to publish content.");
    } finally {
      setPublishing(null);
    }
  };

  const statuses = Object.entries(STATUS_LABELS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta ? `${meta.total} total items` : "All content items"}
            {typeFilter && ` · ${CONTENT_TYPE_LABELS[typeFilter] ?? typeFilter}`}
          </p>
        </div>
        <Link href="/content/new">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            data-testid="btn-new-content"
          >
            <Plus className="w-4 h-4" /> New Content
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-search"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="select-type-filter"
          >
            <option value="">All Types</option>
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>{CONTENT_TYPE_LABELS[t]}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="select-status-filter"
          >
            <option value="">All Statuses</option>
            {statuses.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            data-testid="btn-apply-filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Admin notice for unpublished content */}
      {isAdmin && items.some(i => !["published", "archived"].includes(i.status)) && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Some items below are not yet published and will not appear on the website. Use the Publish button to make them live immediately.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <p className="text-sm">No content found matching your filters.</p>
            <Link href="/content/new">
              <button className="text-sm text-primary hover:underline" data-testid="btn-create-first">
                Create your first item
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {["Title", "Type", "Status", "Author", "Updated", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.summary && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">{item.summary}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {CONTENT_TYPE_LABELS[item.type] ?? item.type}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {typeof item.author === "object" && item.author !== null
                        ? item.author.name
                        : (item.author ?? "—")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(item.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/content/${item.id}`}>
                          <button
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition"
                            data-testid={`btn-edit-${item.id}`}
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        {isAdmin && !["published", "archived"].includes(item.status) && (
                          <button
                            onClick={() => handleForcePublish(item)}
                            disabled={publishing === item.id}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                            data-testid={`btn-publish-${item.id}`}
                            title="Publish now — makes visible on the website immediately"
                          >
                            <Upload className="w-3 h-3" />
                            {publishing === item.id ? "..." : "Publish"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Page {meta.current_page} of {meta.last_page} &bull; {meta.total} items
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.current_page <= 1}
                className="px-3 py-1.5 rounded border border-border text-xs font-medium hover:bg-muted disabled:opacity-40"
                data-testid="btn-prev-page"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.current_page >= meta.last_page}
                className="px-3 py-1.5 rounded border border-border text-xs font-medium hover:bg-muted disabled:opacity-40"
                data-testid="btn-next-page"
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
