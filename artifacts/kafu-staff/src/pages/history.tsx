import React, { useState, useEffect } from "react";
import { staffGet, STATUS_LABELS, STATUS_COLORS, fmtDate } from "@/lib/api";
import { ClipboardList, MessageSquare, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";

interface Comment {
  id: number;
  comment: string;
  comment_type: string;
  section: string | null;
  created_at: string;
  author: { name: string };
}

interface Submission {
  id: number;
  version_number: number;
  workflow_status: string;
  completeness_score: number;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  published_at: string | null;
  reviewer_summary: string | null;
  comments: Comment[];
}

const COMMENT_ICONS: Record<string, React.ReactNode> = {
  approval: <CheckCircle className="w-4 h-4 text-green-500" />,
  rejection: <AlertCircle className="w-4 h-4 text-red-500" />,
  revision_request: <RotateCcw className="w-4 h-4 text-orange-500" />,
  note: <MessageSquare className="w-4 h-4 text-blue-400" />,
};

const COMMENT_COLORS: Record<string, string> = {
  approval: "bg-green-50 border-green-200",
  rejection: "bg-red-50 border-red-200",
  revision_request: "bg-orange-50 border-orange-200",
  note: "bg-blue-50 border-blue-200",
};

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    staffGet("/profile/submissions").then(res => {
      setSubmissions(res.submissions ?? []);
      if (res.submissions?.length > 0) setExpanded(res.submissions[0].id);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-16 text-center text-gray-400">Loading submission history…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" /> Submission History
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Track your profile submissions and reviewer feedback.</p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No submissions yet. Complete your profile and submit for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(sub => (
            <div key={sub.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                data-testid={`submission-toggle-${sub.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-sm font-bold text-primary">
                    v{sub.version_number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[sub.workflow_status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[sub.workflow_status] ?? sub.workflow_status}
                      </span>
                      <span className="text-xs text-gray-400">Completeness: {sub.completeness_score}%</span>
                    </div>
                    {sub.submitted_at && <p className="text-xs text-gray-400 mt-0.5">Submitted {fmtDate(sub.submitted_at)}</p>}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{sub.comments?.length ?? 0} comment{sub.comments?.length !== 1 ? "s" : ""}</span>
              </button>

              {/* Expanded */}
              {expanded === sub.id && (
                <div className="border-t border-gray-100 px-5 pb-5">
                  {/* Timeline */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-4">
                    {[
                      { label: "Submitted", date: sub.submitted_at },
                      { label: "Reviewed", date: sub.reviewed_at },
                      { label: "Approved", date: sub.approved_at },
                      { label: "Published", date: sub.published_at },
                    ].map(t => (
                      <div key={t.label} className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{t.label}</p>
                        <p className="text-xs font-medium text-gray-700 mt-0.5">{fmtDate(t.date)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reviewer summary */}
                  {sub.reviewer_summary && (
                    <div className="bg-orange-50 rounded-xl p-4 mb-4 text-sm text-orange-800">
                      <p className="font-semibold mb-1">Reviewer Summary</p>
                      <p>{sub.reviewer_summary}</p>
                    </div>
                  )}

                  {/* Comments */}
                  {sub.comments?.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reviewer Comments</p>
                      {sub.comments.map(c => (
                        <div key={c.id} className={`flex gap-3 p-3 rounded-xl border ${COMMENT_COLORS[c.comment_type] ?? "bg-gray-50 border-gray-200"}`}>
                          <div className="flex-shrink-0 mt-0.5">{COMMENT_ICONS[c.comment_type] ?? <MessageSquare className="w-4 h-4 text-gray-400" />}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-semibold text-gray-700">{c.author?.name ?? "Reviewer"}{c.section ? ` — ${c.section}` : ""}</p>
                              <p className="text-xs text-gray-400">{fmtDate(c.created_at)}</p>
                            </div>
                            <p className="text-sm text-gray-700">{c.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No reviewer comments yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
