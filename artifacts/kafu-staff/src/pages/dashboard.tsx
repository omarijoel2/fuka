import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { staffGet, STATUS_LABELS, STATUS_COLORS, fmtDate } from "@/lib/api";
import { Link } from "wouter";
import {
  User, CheckCircle, Clock, AlertCircle, ArrowRight,
  FileText, ShieldCheck, Eye, BookOpen, Send
} from "lucide-react";

interface Submission {
  id: number;
  workflow_status: string;
  completeness_score: number;
  section_completion: Record<string, number>;
  submitted_at: string | null;
  approved_at: string | null;
  reviewer_summary: string | null;
  comments?: { id: number; comment: string; comment_type: string; created_at: string; author: { name: string } }[];
}

const SECTION_LABELS: Record<string, string> = {
  personal: "Personal & Institutional",
  bio: "Biography",
  qualifications: "Academic Qualifications",
  teaching: "Teaching Areas",
  research: "Research Interests",
  contact: "Contact Information",
  uploads: "Photo & CV",
};

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  return (
    <svg width="96" height="96" className="-rotate-90">
      <circle cx="48" cy="48" r={r} stroke="#e5e7eb" strokeWidth="8" fill="none" />
      <circle cx="48" cy="48" r={r} stroke={color} strokeWidth="8" fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffGet("/profile").then(res => {
      setSubmission(res.submission);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusBadge = submission
    ? <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[submission.workflow_status] ?? "bg-gray-100 text-gray-600"}`}>
        {STATUS_LABELS[submission.workflow_status] ?? submission.workflow_status}
      </span>
    : null;

  const score = submission?.completeness_score ?? 0;

  const latestComment = submission?.comments?.[submission.comments.length - 1];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#228B22] to-[#2d7a52] rounded-2xl p-6 text-white">
        <p className="text-sm text-white/70">Welcome back,</p>
        <h1 className="text-2xl font-bold mt-0.5">{user?.name}</h1>
        <p className="text-sm text-white/70 mt-1">{user?.job_title ?? ""}{user?.department ? ` · ${user.department}` : ""}</p>
        {!user?.has_consent && (
          <Link href="/onboarding">
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer hover:bg-yellow-300 transition-colors">
              <AlertCircle className="w-3.5 h-3.5" /> Complete onboarding to enable profile submission
            </div>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completeness */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Profile Completeness</h3>
          <div className="relative">
            <ScoreRing score={score} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{score}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            {score < 40 ? "Complete at least 40% to submit for review." : score < 80 ? "Good progress! Keep adding details." : "Excellent profile completeness."}
          </p>
        </div>

        {/* Status + Quick actions */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Profile Status</h3>
              {statusBadge}
            </div>
            {submission ? (
              <div className="space-y-1.5 text-sm text-gray-600">
                {submission.submitted_at && <p>Submitted: <span className="text-gray-900 font-medium">{fmtDate(submission.submitted_at)}</span></p>}
                {submission.approved_at && <p>Approved: <span className="text-gray-900 font-medium">{fmtDate(submission.approved_at)}</span></p>}
                {latestComment && (
                  <div className="mt-3 bg-orange-50 rounded-xl p-3 text-xs text-orange-700">
                    <p className="font-semibold">Reviewer note:</p>
                    <p className="mt-1">{latestComment.comment}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No profile submission yet. Start building your profile.</p>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/profile", icon: <User className="w-4 h-4" />, label: "Edit Profile", color: "bg-blue-50 text-blue-700" },
              { href: "/history", icon: <Clock className="w-4 h-4" />, label: "View History", color: "bg-purple-50 text-purple-700" },
              { href: "/profile#submit", icon: <Send className="w-4 h-4" />, label: "Submit for Review", color: "bg-green-50 text-green-700" },
              { href: "/profile#uploads", icon: <FileText className="w-4 h-4" />, label: "Upload CV / Photo", color: "bg-amber-50 text-amber-700" },
            ].map(a => (
              <Link href={a.href} key={a.href}>
                <div className={`flex items-center gap-2.5 p-3 rounded-xl ${a.color} text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity`} data-testid={`quick-action-${a.label.replace(/\s+/g, "-").toLowerCase()}`}>
                  {a.icon} {a.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Section completion */}
      {submission && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Section Completion</h3>
          <div className="space-y-3">
            {Object.entries(SECTION_LABELS).map(([key, label]) => {
              const pct = submission.section_completion?.[key] ?? 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-gray-500 flex-shrink-0">{label}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-8 text-xs text-gray-500 text-right">{pct}%</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/profile">
              <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline cursor-pointer">
                Edit Profile <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
