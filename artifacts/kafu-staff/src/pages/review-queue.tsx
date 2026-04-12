import React, { useState, useEffect, useCallback } from "react";
import { reviewerFetch } from "@/lib/api";
import { STATUS_COLORS, STATUS_LABELS, fmtDate } from "@/lib/api";
import { FileText, CheckCircle, RotateCcw, MessageSquare, AlertCircle, Search, ChevronDown } from "lucide-react";

interface Submission {
  id: number;
  user: { id: number; name: string; email: string; job_title?: string; department?: string };
  workflow_status: string;
  completeness_score: number;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_summary: string | null;
  comments?: { id: number; comment: string; comment_type: string; author: { name: string }; created_at: string }[];
}

export default function ReviewQueuePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("submitted");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewerFetch(`/queue?status=${filter === "all" ? "all" : filter}`);
      setSubmissions(res.data ?? res ?? []);
    } catch {
      showToast("error", "Failed to load queue.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function action(type: "review" | "approve" | "request-revision" | "reject", id: number) {
    setProcessing(true);
    try {
      await reviewerFetch(`/submissions/${id}/${type}`, {
        method: "POST",
        body: JSON.stringify({ notes: actionNote }),
      });
      showToast("success", "Action completed.");
      setSelected(null);
      setActionNote("");
      await load();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Action failed.");
    } finally {
      setProcessing(false);
    }
  }

  const filtered = submissions.filter(s =>
    !search || s.user.name.toLowerCase().includes(search.toLowerCase()) || s.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.text}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Review Queue</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review submitted staff profiles.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
            data-testid="input-review-search"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          data-testid="select-review-filter"
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="revision_requested">Revision Requested</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Queue */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading queue…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No submissions found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Staff Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Completeness</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" data-testid={`review-row-${sub.id}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{sub.user.name}</p>
                    <p className="text-xs text-gray-400">{sub.user.job_title ?? sub.user.email}</p>
                    {sub.user.department && <p className="text-xs text-gray-400">{sub.user.department}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[sub.workflow_status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[sub.workflow_status] ?? sub.workflow_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${sub.completeness_score >= 80 ? "bg-green-500" : sub.completeness_score >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${sub.completeness_score}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{sub.completeness_score}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-500">{fmtDate(sub.submitted_at)}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(sub)} data-testid={`btn-review-${sub.id}`}
                      className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review modal */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="font-bold text-gray-900">{selected.user.name}</h2>
                <p className="text-xs text-gray-500">{selected.user.job_title ?? selected.user.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="font-medium mt-0.5">{STATUS_LABELS[selected.workflow_status] ?? selected.workflow_status}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Completeness</p>
                  <p className="font-medium mt-0.5">{selected.completeness_score}%</p>
                </div>
              </div>

              {selected.comments && selected.comments.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Prior Comments</p>
                  {selected.comments.map(c => (
                    <div key={c.id} className="bg-gray-50 rounded-xl p-3 mb-2 text-xs">
                      <p className="font-semibold text-gray-700">{c.author?.name} — {c.comment_type}</p>
                      <p className="text-gray-600 mt-0.5">{c.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reviewer Notes</label>
                <textarea rows={4} value={actionNote} onChange={e => setActionNote(e.target.value)}
                  placeholder="Add notes, feedback, or instructions for the staff member…"
                  data-testid="textarea-review-notes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              {selected.workflow_status === "submitted" && (
                <button onClick={() => action("review", selected.id)} disabled={processing} data-testid="btn-begin-review"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  Begin Review
                </button>
              )}
              <button onClick={() => action("approve", selected.id)} disabled={processing} data-testid="btn-approve"
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => action("request-revision", selected.id)} disabled={!actionNote || processing} data-testid="btn-request-revision"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> Request Revision
              </button>
              <button onClick={() => { setSelected(null); setActionNote(""); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors ml-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
