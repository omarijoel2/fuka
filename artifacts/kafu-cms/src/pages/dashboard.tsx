import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiGet, formatDateTime } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import {
  FileText, Clock, CheckCircle, AlertCircle,
  TrendingUp, Users, Image, ArrowRight, RefreshCw
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

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet("/dashboard");
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
          label="Total Media"
          value={data?.stats.total_media ?? "—"}
          icon={<Image className="w-5 h-5 text-primary" />}
          color="bg-primary/10"
          href="/media"
        />
      </div>

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

      {/* Extra stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Draft Content"
          value={data?.stats.draft ?? "—"}
          icon={<FileText className="w-5 h-5 text-muted-foreground" />}
          color="bg-muted"
        />
        <StatCard
          label="Expiring Soon"
          value={data?.stats.expiring_soon ?? "—"}
          icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
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
      </div>
    </div>
  );
}
