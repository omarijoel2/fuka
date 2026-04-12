import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../lib/api";
import { Link } from "wouter";

interface WorkflowItem {
  id: number;
  title: string;
  type: string;
  status: string;
  slug: string;
  updated_at: string;
  author_name?: string;
  author_email?: string;
  reviewer_name?: string;
}

interface QueueData {
  items: {
    data: WorkflowItem[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
  counts: Record<string, number>;
}

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  revision_requested: "Revision Requested",
  approved: "Approved",
  scheduled: "Scheduled",
};

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  revision_requested: "bg-orange-100 text-orange-700",
  approved: "bg-green-100 text-green-700",
  scheduled: "bg-purple-100 text-purple-700",
};

const TYPE_LABELS: Record<string, string> = {
  page: "Page",
  news: "News",
  event: "Event",
  announcement: "Announcement",
  opportunity: "Opportunity",
  policy: "Policy",
};

export default function WorkflowConsolePage() {
  const [data, setData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), per_page: "20" };
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      const d = await apiGet("/workflow-queue", params as any);
      setData(d);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter, search]);

  useEffect(() => { load(); }, [load]);

  const totalInQueue = data
    ? Object.values(data.counts).reduce((a, b) => a + b, 0)
    : 0;

  const items = data?.items?.data || [];
  const total = data?.items?.total ?? 0;
  const lastPage = data?.items?.last_page ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Workflow Console</h1>
        <p className="text-sm text-gray-500 mt-1">
          Centralized view of all content items in the review and approval pipeline.
          {totalInQueue > 0 && (
            <span className="ml-2 font-medium text-amber-600">
              {totalInQueue} item{totalInQueue === 1 ? "" : "s"} require attention
            </span>
          )}
        </p>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          data-testid="filter-all"
          onClick={() => { setStatusFilter(""); setPage(1); }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            statusFilter === "" ? "bg-[#1A5C38] text-white border-[#1A5C38]" : "border-gray-300 text-gray-600 hover:border-[#1A5C38]"
          }`}
        >
          All ({totalInQueue})
        </button>
        {Object.entries(STATUS_LABELS).map(([key, label]) => {
          const count = data?.counts?.[key] ?? 0;
          return (
            <button
              key={key}
              data-testid={`filter-${key}`}
              onClick={() => { setStatusFilter(key); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                statusFilter === key
                  ? "bg-[#1A5C38] text-white border-[#1A5C38]"
                  : "border-gray-300 text-gray-600 hover:border-[#1A5C38]"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search + type filter */}
      <div className="flex gap-3">
        <input
          data-testid="input-workflow-search"
          type="text"
          placeholder="Search title or author..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
        />
        <select
          data-testid="select-workflow-type"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
        >
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Queue table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-24">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-32">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-36">Author</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-32">Reviewer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-28">Last Updated</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700 w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No items in this queue.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const age = Math.floor(
                  (Date.now() - new Date(item.updated_at).getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr
                    key={item.id}
                    data-testid={`workflow-row-${item.id}`}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/content/${item.id}`}
                        className="text-[#1A5C38] hover:underline font-medium line-clamp-1"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-gray-600 text-xs">
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {item.author_name || item.author_email || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {item.reviewer_name || (
                        <span className="text-amber-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      <span
                        className={age > 7 ? "text-red-500 font-medium" : age > 3 ? "text-amber-500" : ""}
                        title={new Date(item.updated_at).toLocaleString()}
                      >
                        {age === 0 ? "Today" : age === 1 ? "Yesterday" : `${age}d ago`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/content/${item.id}`}
                        data-testid={`btn-review-${item.id}`}
                        className="text-xs text-[#1A5C38] hover:underline font-medium"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {items.length} of {total} items (page {page} of {lastPage})</span>
          <div className="flex gap-2">
            <button
              data-testid="btn-workflow-prev"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              data-testid="btn-workflow-next"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
