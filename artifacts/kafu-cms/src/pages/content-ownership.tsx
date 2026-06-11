import { useState, useEffect } from "react";
import { apiGet, formatDate } from "../lib/api";

interface AuthorRow {
  author_id: number | null;
  author_name: string;
  role: string | null;
  department: string | null;
  total: number;
  published: number;
  draft: number;
  in_review: number;
  last_updated: string | null;
}

interface DeptRow {
  department: string;
  total: number;
}

interface OwnershipData {
  total_content: number;
  unassigned: number;
  by_author: AuthorRow[];
  by_department: DeptRow[];
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  ict_admin: "ICT Admin",
  communications_admin: "Communications Admin",
  reviewer: "Reviewer",
  webmaster: "Webmaster",
  department_editor: "Department Editor",
  author: "Author",
};

function StatCard({ label, value, testid }: { label: string; value: number; testid: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4" data-testid={testid}>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function ContentOwnershipPage() {
  const [data, setData] = useState<OwnershipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    apiGet("/content-ownership")
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load report."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="p-6" data-testid="ownership-loading">
        <p className="text-sm text-gray-500">Loading content ownership report…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" data-testid="ownership-error">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const distinctAuthors = data.by_author.filter((a) => a.author_id !== null).length;
  const maxDept = Math.max(1, ...data.by_department.map((d) => d.total));

  return (
    <div className="p-6 space-y-6" data-testid="content-ownership-page">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Ownership</h1>
        <p className="text-sm text-gray-500 mt-1">
          Who owns what across the site — content distribution by author and department.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Content" value={data.total_content} testid="stat-total" />
        <StatCard label="Contributors" value={distinctAuthors} testid="stat-authors" />
        <StatCard label="Departments" value={data.by_department.length} testid="stat-departments" />
        <StatCard label="Unassigned Items" value={data.unassigned} testid="stat-unassigned" />
      </div>

      {/* By Author */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">By Author</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="ownership-author-table">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-5 py-2.5 font-medium">Author</th>
                <th className="px-5 py-2.5 font-medium">Role</th>
                <th className="px-5 py-2.5 font-medium">Department</th>
                <th className="px-5 py-2.5 font-medium text-right">Total</th>
                <th className="px-5 py-2.5 font-medium text-right">Published</th>
                <th className="px-5 py-2.5 font-medium text-right">In Review</th>
                <th className="px-5 py-2.5 font-medium text-right">Draft</th>
                <th className="px-5 py-2.5 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.by_author.map((a, i) => (
                <tr
                  key={a.author_id ?? `unassigned-${i}`}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  data-testid={`ownership-author-row-${a.author_id ?? "unassigned"}`}
                >
                  <td className="px-5 py-2.5 font-medium text-gray-900">{a.author_name}</td>
                  <td className="px-5 py-2.5 text-gray-600">{a.role ? ROLE_LABELS[a.role] ?? a.role : "—"}</td>
                  <td className="px-5 py-2.5 text-gray-600">{a.department ?? "—"}</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-gray-900">{a.total}</td>
                  <td className="px-5 py-2.5 text-right text-emerald-700">{a.published}</td>
                  <td className="px-5 py-2.5 text-right text-amber-700">{a.in_review}</td>
                  <td className="px-5 py-2.5 text-right text-gray-500">{a.draft}</td>
                  <td className="px-5 py-2.5 text-gray-500">{formatDate(a.last_updated)}</td>
                </tr>
              ))}
              {data.by_author.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-6 text-center text-gray-400">No content found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Department */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">By Department</h2>
        </div>
        <div className="p-5 space-y-3" data-testid="ownership-department-list">
          {data.by_department.map((d, i) => (
            <div key={`${d.department}-${i}`} data-testid={`ownership-dept-row-${i}`}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700">{d.department}</span>
                <span className="font-semibold text-gray-900">{d.total}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(d.total / maxDept) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {data.by_department.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">No departments found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
