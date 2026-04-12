import { useState, useEffect } from "react";
import { apiGet } from "../lib/api";
import { Link } from "wouter";

interface HealthSummary {
  stale_content: number;
  stale_drafts: number;
  expired_opportunities: number;
  missing_alt_text: number;
  incomplete_staff_profiles: number;
  missing_seo: number;
  overdue_reviews: number;
  recently_published: number;
}

interface ContentItem {
  id: number;
  title: string;
  type: string;
  status?: string;
  updated_at: string;
  expiry_date?: string;
}

interface HealthData {
  health_score: number;
  summary: HealthSummary;
  status_breakdown: Record<string, number>;
  type_breakdown: Record<string, number>;
  stale_content_list: ContentItem[];
  stale_drafts_list: ContentItem[];
  overdue_review_list: ContentItem[];
  expired_list: ContentItem[];
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? "#1A5C38" : score >= 60 ? "#C9A227" : "#dc2626";
  return (
    <div className="flex flex-col items-center">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${fill} ${circ - fill}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text x="56" y="62" textAnchor="middle" fontSize="22" fontWeight="700" fill={color}>
          {score}
        </text>
      </svg>
      <span className="text-sm font-medium text-gray-600 mt-1">Health Score</span>
    </div>
  );
}

function IssueCard({
  title,
  count,
  severity,
  description,
}: {
  title: string;
  count: number;
  severity: "critical" | "warning" | "ok";
  description: string;
}) {
  const colors = {
    critical: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    ok: "bg-green-50 border-green-200 text-green-800",
  };
  const countColors = {
    critical: "text-red-600",
    warning: "text-amber-600",
    ok: "text-green-600",
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[severity]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs mt-0.5 opacity-75">{description}</p>
        </div>
        <span className={`text-2xl font-bold ${countColors[severity]}`}>{count}</span>
      </div>
    </div>
  );
}

function ContentList({ items, emptyMsg }: { items: ContentItem[]; emptyMsg: string }) {
  if (items.length === 0)
    return <p className="text-sm text-gray-400 py-3 text-center">{emptyMsg}</p>;
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-2.5 px-1">
          <div className="min-w-0">
            <Link
              to={`/content/${item.id}`}
              className="text-sm font-medium text-[#1A5C38] hover:underline truncate block"
            >
              {item.title}
            </Link>
            <span className="text-xs text-gray-400 capitalize">{item.type}</span>
          </div>
          <div className="text-right ml-4 shrink-0">
            <span className="text-xs text-gray-400">
              {item.expiry_date
                ? `Expired ${new Date(item.expiry_date).toLocaleDateString()}`
                : `Updated ${new Date(item.updated_at).toLocaleDateString()}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContentHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/content-health")
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Analyzing content health...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  const { summary, stale_content_list, stale_drafts_list, overdue_review_list, expired_list } = data;

  const issues = [
    {
      title: "Published content not updated in 180+ days",
      count: summary.stale_content,
      severity: summary.stale_content > 5 ? "critical" : summary.stale_content > 0 ? "warning" : "ok",
      description: "Review and refresh stale published content.",
    },
    {
      title: "Draft items not updated in 30+ days",
      count: summary.stale_drafts,
      severity: summary.stale_drafts > 10 ? "warning" : "ok",
      description: "Old drafts that may need attention or archiving.",
    },
    {
      title: "Expired opportunities still published",
      count: summary.expired_opportunities,
      severity: summary.expired_opportunities > 0 ? "critical" : "ok",
      description: "These should be archived or unpublished.",
    },
    {
      title: "Media files missing alt text",
      count: summary.missing_alt_text,
      severity: summary.missing_alt_text > 10 ? "warning" : summary.missing_alt_text > 0 ? "warning" : "ok",
      description: "Affects accessibility compliance.",
    },
    {
      title: "Staff profiles below 40% completeness",
      count: summary.incomplete_staff_profiles,
      severity: summary.incomplete_staff_profiles > 5 ? "warning" : "ok",
      description: "Staff profiles published on the public site should be complete.",
    },
    {
      title: "Published content missing SEO metadata",
      count: summary.missing_seo,
      severity: summary.missing_seo > 20 ? "critical" : summary.missing_seo > 5 ? "warning" : "ok",
      description: "Pages without SEO meta will underperform in search.",
    },
    {
      title: "Items awaiting review for 3+ days",
      count: summary.overdue_reviews,
      severity: summary.overdue_reviews > 3 ? "warning" : summary.overdue_reviews > 0 ? "warning" : "ok",
      description: "Workflow bottlenecks — assign a reviewer.",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Content Health</h1>
        <p className="text-sm text-gray-500 mt-1">
          Quality, completeness, and freshness report across all platform content.
        </p>
      </div>

      {/* Score + summary row */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-8">
        <ScoreRing score={data.health_score} />
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 flex-1">
          <div className="text-sm text-gray-600">
            Recently published (30 days):{" "}
            <span className="font-semibold text-gray-900">{summary.recently_published}</span>
          </div>
          <div className="text-sm text-gray-600">
            Overdue reviews:{" "}
            <span className={`font-semibold ${summary.overdue_reviews > 0 ? "text-amber-600" : "text-gray-900"}`}>
              {summary.overdue_reviews}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Missing SEO meta:{" "}
            <span className={`font-semibold ${summary.missing_seo > 20 ? "text-red-600" : "text-gray-900"}`}>
              {summary.missing_seo}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Expired opportunities:{" "}
            <span className={`font-semibold ${summary.expired_opportunities > 0 ? "text-red-600" : "text-gray-900"}`}>
              {summary.expired_opportunities}
            </span>
          </div>
        </div>
      </div>

      {/* Issues grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard key={issue.title} {...issue} />
        ))}
      </div>

      {/* Content by status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Content by Status</h3>
          <div className="space-y-2">
            {Object.entries(data.status_breakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600">{status.replace("_", " ")}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Content by Type</h3>
          <div className="space-y-2">
            {Object.entries(data.type_breakdown).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600">{type.replace("_", " ")}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Stale Published Content
            {stale_content_list.length > 0 && (
              <span className="ml-2 text-xs text-red-500 font-normal">Needs attention</span>
            )}
          </h3>
          <ContentList items={stale_content_list} emptyMsg="No stale published content." />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Overdue Review Items</h3>
          <ContentList items={overdue_review_list} emptyMsg="No overdue review items." />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Stale Drafts (30+ days)</h3>
          <ContentList items={stale_drafts_list} emptyMsg="No stale drafts." />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Expired Opportunities</h3>
          <ContentList items={expired_list} emptyMsg="No expired opportunities still published." />
        </div>
      </div>
    </div>
  );
}
