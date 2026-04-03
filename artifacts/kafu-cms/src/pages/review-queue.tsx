import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { apiGet } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/api";
import { ClipboardList, RefreshCw } from "lucide-react";

interface QueueItem {
  id: number; title: string; type: string; status: string;
  author: string | { id: number; name: string; role: string } | null;
  author_id?: number;
  created_at: string; updated_at: string;
}

export default function ReviewQueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiGet("/review-queue");
      setItems(data?.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load review queue.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const byStatus: Record<string, QueueItem[]> = {};
  for (const item of items) {
    if (!byStatus[item.status]) byStatus[item.status] = [];
    byStatus[item.status].push(item);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Queue</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} items awaiting action</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
          data-testid="btn-refresh-queue"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <ClipboardList className="w-12 h-12 opacity-30" />
          <p className="text-sm font-medium">Review queue is empty</p>
          <p className="text-xs text-center max-w-xs">All content is either published, archived, or still in draft.</p>
        </div>
      ) : (
        Object.entries(byStatus).map(([status, statusItems]) => (
          <div key={status} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <StatusBadge status={status} />
              <span className="text-sm font-semibold text-foreground">{statusItems.length} item{statusItems.length !== 1 ? "s" : ""}</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  {["Title", "Type", "Author", "Submitted", ""].map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {statusItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/content/${item.id}`} className="hover:text-primary hover:underline">{item.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{item.type.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {typeof item.author === "object" && item.author !== null ? item.author.name : (item.author ?? "—")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDateTime(item.updated_at)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/content/${item.id}`}>
                        <button
                          className="text-xs font-semibold text-primary hover:underline"
                          data-testid={`btn-review-${item.id}`}
                        >
                          Review
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
