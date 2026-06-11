import { useState, useEffect, useCallback } from "react";
import { CalendarClock, RefreshCw, CheckCircle2, Filter, Clock, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface FreshnessItem {
  id: number; title: string; type: string; status: string;
  department: string | null; owner: string; owner_id: number | null;
  updated_at: string; days_since_update: number | null;
  last_reviewed_at: string | null; next_review_due: string | null;
  review_frequency_days: number | null; freshness: string;
}

interface FreshnessResponse {
  counts: { fresh: number; warning: number; stale: number; critical: number };
  total: number;
  items: FreshnessItem[];
}

const BADGE: Record<string, { label: string; cls: string }> = {
  fresh: { label: "Fresh", cls: "bg-green-100 text-green-800" },
  warning: { label: "Aging", cls: "bg-amber-100 text-amber-800" },
  stale: { label: "Stale", cls: "bg-orange-100 text-orange-800" },
  critical: { label: "Critical", cls: "bg-red-100 text-red-800" },
};

const FREQ_OPTIONS = [30, 60, 90, 180, 365, 730];

export default function ContentFreshnessPage() {
  const [data, setData] = useState<FreshnessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bucket, setBucket] = useState("");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [scheduleFor, setScheduleFor] = useState<FreshnessItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (bucket) params.set("bucket", bucket);
      if (filterType) params.set("type", filterType);
      if (search) params.set("search", search);
      const res = await apiFetch(`/webmaster/freshness?${params.toString()}`);
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [bucket, filterType, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    apiFetch("/webmaster/governance/filters").then((f) => setTypes(f?.types ?? [])).catch(() => {});
  }, []);

  async function markReviewed(id: number) {
    try {
      await apiFetch(`/webmaster/freshness/${id}/reviewed`, { method: "POST" });
      load();
    } catch { /* ignore */ }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarClock className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Freshness</h1>
            <p className="text-sm text-gray-500">Track ageing content and schedule periodic reviews</p>
          </div>
        </div>
        <button data-testid="btn-refresh-freshness" onClick={load} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">{error}</div>}

      {/* Counts */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {(["fresh", "warning", "stale", "critical"] as const).map((k) => (
            <button
              key={k}
              data-testid={`freshness-stat-${k}`}
              onClick={() => setBucket(bucket === k ? "" : k)}
              className={`text-left bg-white rounded-xl border p-4 transition-all ${bucket === k ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${BADGE[k].cls}`}>{BADGE[k].label}</span>
                <span className="text-2xl font-bold text-gray-900">{data.counts[k]}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {k === "fresh" && "Updated within 90 days"}
                {k === "warning" && "90–180 days old"}
                {k === "stale" && "Over 180 days old"}
                {k === "critical" && "Public risk / review overdue"}
              </p>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <input
            data-testid="input-freshness-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or slug..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button data-testid="btn-freshness-filters" onClick={() => setShowFilters((p) => !p)} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        {showFilters && (
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <select data-testid="filter-freshness-type" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-64">
              <option value="">All Types</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
          ) : !data || data.items.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No content matches.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Owner</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Age</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Next Review</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((r) => {
                  const overdue = r.next_review_due && new Date(r.next_review_due) < new Date();
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50" data-testid={`freshness-row-${r.id}`}>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs"><div className="line-clamp-2">{r.title}</div></td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">{r.type}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{r.owner}</td>
                      <td className="px-4 py-3 text-gray-600">{r.days_since_update ?? "—"}d</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {r.next_review_due ? (
                          <span className={`text-xs ${overdue ? "text-red-600 font-medium" : "text-gray-500"}`}>{new Date(r.next_review_due).toLocaleDateString()}</span>
                        ) : <span className="text-xs text-gray-400">Not set</span>}
                      </td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${BADGE[r.freshness]?.cls}`}>{BADGE[r.freshness]?.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button data-testid={`btn-mark-reviewed-${r.id}`} onClick={() => markReviewed(r.id)} title="Mark reviewed now" className="p-1.5 rounded hover:bg-green-50 text-green-700"><CheckCircle2 className="w-4 h-4" /></button>
                          <button data-testid={`btn-schedule-${r.id}`} onClick={() => setScheduleFor(r)} title="Set review schedule" className="p-1.5 rounded hover:bg-blue-50 text-blue-700"><Clock className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {scheduleFor && (
        <ScheduleModal item={scheduleFor} onClose={() => setScheduleFor(null)} onSaved={() => { setScheduleFor(null); load(); }} />
      )}
    </div>
  );
}

function ScheduleModal({ item, onClose, onSaved }: { item: FreshnessItem; onClose: () => void; onSaved: () => void }) {
  const [freq, setFreq] = useState(item.review_frequency_days ?? 180);
  const [nextDue, setNextDue] = useState(item.next_review_due ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      await apiFetch(`/webmaster/freshness/${item.id}/schedule`, {
        method: "PUT",
        body: JSON.stringify({ review_frequency_days: freq, next_review_due: nextDue || null }),
      });
      onSaved();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="schedule-modal">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Review Schedule</h3>
          <button data-testid="btn-close-schedule" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{item.title}</p>
          {err && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{err}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Review every</label>
            <select data-testid="select-review-freq" value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {FREQ_OPTIONS.map((d) => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Next review due (optional)</label>
            <input data-testid="input-next-review" type="date" value={nextDue ? nextDue.substring(0, 10) : ""} onChange={(e) => setNextDue(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <p className="text-xs text-gray-400 mt-1">Leave blank to auto-set based on frequency.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button data-testid="btn-cancel-schedule" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button data-testid="btn-save-schedule" onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">{saving ? "Saving..." : "Save Schedule"}</button>
        </div>
      </div>
    </div>
  );
}
