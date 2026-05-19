import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiGet, formatDateTime } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import {
  FileText, Clock, CheckCircle, AlertCircle,
  TrendingUp, Users, Image, ArrowRight, RefreshCw,
  Activity, GitBranch, AlertTriangle, Heart, Home, Navigation, ArrowRightLeft
} from "lucide-react";

interface DashboardData {
  stats: {
    pending_review: number;
    draft: number;
    published: number;
    expiring_soon: number;
    total_content: number;
    total_media: number;
    total_users: number;
  };
  by_type: Record<string, number>;
  recent_activity: {
    user_name: string; user_role: string; action: string;
    entity_type: string; entity_title: string; created_at: string;
  }[];
  review_queue: {
    id: number; type: string; title: string; status: string;
    department: string | null; updated_at: string;
  }[];
}

interface HealthSnapshot {
  health_score: number;
  summary: {
    stale_content: number;
    expired_opportunities: number;
    missing_seo: number;
    overdue_reviews: number;
    recently_published: number;
  };
}

interface WorkflowCounts {
  submitted?: number;
  under_review?: number;
  revision_requested?: number;
  approved?: number;
  scheduled?: number;
}

function StatCard({
  label, value, icon, color, href,
}: {
  label: string; value: number | string; icon: React.ReactNode;
  color: string; href?: string;
}) {
  const inner = (
    <div className="bg-white rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        {href && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function HealthScoreRing({ score }: { score: number }) {
  const radius = 32;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? "#228B22" : score >= 60 ? "#DAA520" : "#dc2626";
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
      <circle
        cx="45" cy="45" r={radius} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <text x="45" y="51" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
        {score}
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [health, setHealth] = useState<HealthSnapshot | null>(null);
  const [workflowCounts, setWorkflowCounts] = useState<WorkflowCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user && ["super_admin", "ict_admin", "communications_admin"].includes(user.role);
  const isReviewer = user && [...["super_admin", "ict_admin", "communications_admin"], "reviewer"].includes(user.role);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, healthRes, wfRes] = await Promise.all([
        apiGet("/dashboard"),
        isAdmin ? apiGet("/content-health") : Promise.resolve(null),
        isReviewer ? apiGet("/workflow-queue") : Promise.resolve(null),
      ]);
      setData(dashRes);
      if (healthRes) setHealth(healthRes);
      if (wfRes) setWorkflowCounts(wfRes.counts || {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalWorkflow = workflowCounts
    ? Object.values(workflowCounts).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, <span className="font-medium text-foreground">{user?.name}</span>
            <span className="ml-1 text-xs text-muted-foreground">({user?.role_label})</span>
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
          data-testid="btn-refresh-dashboard"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Content"
          value={data?.stats.total_content ?? "—"}
          icon={<FileText className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
          href="/content"
        />
        <StatCard
          label="Pending Review"
          value={data?.stats.pending_review ?? "—"}
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          color="bg-yellow-50"
          href="/review-queue"
        />
        <StatCard
          label="Published"
          value={data?.stats.published ?? "—"}
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard
          label="Expiring Soon"
          value={data?.stats.expiring_soon ?? "—"}
          icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
        />
      </div>

      {/* Content Health + Workflow Counts (admin/reviewer only) */}
      {(health || workflowCounts) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Health widget */}
          {health && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Content Health
                </h2>
                <Link href="/content-health" className="text-xs text-primary hover:underline">
                  Full report
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <HealthScoreRing score={health.health_score} />
                <div className="space-y-2 flex-1">
                  {health.summary.overdue_reviews > 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {health.summary.overdue_reviews} overdue review item{health.summary.overdue_reviews > 1 ? "s" : ""}
                    </div>
                  )}
                  {health.summary.expired_opportunities > 0 && (
                    <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 rounded px-2 py-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {health.summary.expired_opportunities} expired opportunit{health.summary.expired_opportunities > 1 ? "ies" : "y"} still published
                    </div>
                  )}
                  {health.summary.missing_seo > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                      <FileText className="w-3 h-3 shrink-0" />
                      {health.summary.missing_seo} items missing SEO metadata
                    </div>
                  )}
                  {health.summary.overdue_reviews === 0 && health.summary.expired_opportunities === 0 && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded px-2 py-1">
                      <CheckCircle className="w-3 h-3 shrink-0" />
                      No critical issues detected
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {health.summary.recently_published} item{health.summary.recently_published !== 1 ? "s" : ""} published in last 30 days
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Workflow queue counts */}
          {workflowCounts && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" /> Workflow Pipeline
                </h2>
                <Link href="/workflow" className="text-xs text-primary hover:underline">
                  View console
                </Link>
              </div>
              {totalWorkflow === 0 ? (
                <p className="text-sm text-muted-foreground">No items currently in the workflow pipeline.</p>
              ) : (
                <div className="space-y-2">
                  {[
                    { key: "submitted", label: "Submitted for review", color: "bg-blue-100 text-blue-700" },
                    { key: "under_review", label: "Under review", color: "bg-amber-100 text-amber-700" },
                    { key: "revision_requested", label: "Revision requested", color: "bg-orange-100 text-orange-700" },
                    { key: "approved", label: "Approved, pending publish", color: "bg-green-100 text-green-700" },
                    { key: "scheduled", label: "Scheduled", color: "bg-purple-100 text-purple-700" },
                  ].map(({ key, label, color }) => {
                    const count = (workflowCounts as any)[key] ?? 0;
                    if (count === 0) return null;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content by type */}
          {Object.keys(data.by_type).length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Content by Type
              </h2>
              <div className="space-y-2.5">
                {Object.entries(data.by_type).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-foreground capitalize">{type.replace("_", " ")}</span>
                    <span className="text-sm font-semibold text-foreground bg-secondary px-2 py-0.5 rounded">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review queue */}
          {data.review_queue.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" /> Review Queue
                </h2>
                <Link href="/review-queue" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {data.review_queue.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <StatusBadge status={item.status} />
                    <div className="flex-1 min-w-0">
                      <Link href={`/content/${item.id}`}>
                        <p className="text-sm font-medium text-foreground truncate hover:text-primary hover:underline">
                          {item.title}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.type} &bull; {formatDateTime(item.updated_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent activity */}
      {data && data.recent_activity.length > 0 && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground" /> Recent Activity
            </h2>
            <Link href="/audit" className="text-xs text-primary hover:underline">
              View full log
            </Link>
          </div>
          <div className="space-y-2.5">
            {data.recent_activity.map((act, i) => (
              <div key={i} className="flex items-start gap-3 py-1">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {act.user_name?.charAt(0) ?? "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{act.user_name}</span>
                    <span className="text-muted-foreground mx-1">{act.action?.replace(".", " ")}</span>
                    {act.entity_title && <span className="italic">"{act.entity_title}"</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(act.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links to new admin sections */}
      {isAdmin && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" /> Site Operations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { href: "/homepage", icon: <Home className="w-5 h-5" />, label: "Homepage" },
              { href: "/navigation", icon: <Navigation className="w-5 h-5" />, label: "Navigation" },
              { href: "/site-controls", icon: <AlertTriangle className="w-5 h-5" />, label: "Banners" },
              { href: "/redirects", icon: <ArrowRightLeft className="w-5 h-5" />, label: "Redirects" },
              { href: "/content-health", icon: <Activity className="w-5 h-5" />, label: "Health" },
              { href: "/workflow", icon: <GitBranch className="w-5 h-5" />, label: "Workflow" },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href}>
                <div
                  data-testid={`quick-action-${label.toLowerCase()}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer text-center"
                >
                  <div className="text-primary opacity-70">{icon}</div>
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Draft Content"
          value={data?.stats.draft ?? "—"}
          icon={<FileText className="w-5 h-5 text-muted-foreground" />}
          color="bg-muted"
        />
        <StatCard
          label="Total Users"
          value={data?.stats.total_users ?? "—"}
          icon={<Users className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
          href="/users"
        />
        <StatCard
          label="Total Media"
          value={data?.stats.total_media ?? "—"}
          icon={<Image className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
          href="/media"
        />
        <StatCard
          label="Pending Review"
          value={data?.stats.pending_review ?? "—"}
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          color="bg-yellow-50"
          href="/workflow"
        />
      </div>
    </div>
  );
}
