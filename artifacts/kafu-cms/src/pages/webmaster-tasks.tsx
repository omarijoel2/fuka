import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Plus, RefreshCw, Trash2, X, ArrowUpRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Task {
  id: number; title: string; description: string | null; type: string;
  priority: string; status: string; assigned_to: number | null;
  assignee_name: string | null; content_id: number | null;
  content_title: string | null; due_date: string | null; created_at: string;
}

interface TasksResponse {
  data: Task[];
  counts: { open: number; in_progress: number; escalated: number; done: number };
}

const PRIORITY: Record<string, string> = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-gray-100 text-gray-600",
};

const STATUS: Record<string, string> = {
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  escalated: "bg-red-100 text-red-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

const TASK_TYPES = ["review", "content_update", "seo", "accessibility", "escalation", "other"];
const PRIORITIES = ["low", "medium", "high", "urgent"];
const STATUSES = ["open", "in_progress", "done", "escalated", "cancelled"];

export default function WebmasterTasksPage() {
  const [data, setData] = useState<TasksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [owners, setOwners] = useState<{ id: number; name: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterPriority) params.set("priority", filterPriority);
      const res = await apiFetch(`/webmaster/tasks?${params.toString()}`);
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    apiFetch("/webmaster/governance/filters").then((f) => setOwners(f?.owners ?? [])).catch(() => {});
  }, []);

  async function updateStatus(id: number, status: string) {
    try {
      await apiFetch(`/webmaster/tasks/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      load();
    } catch { /* ignore */ }
  }

  async function remove(id: number) {
    if (!confirm("Delete this task?")) return;
    try {
      await apiFetch(`/webmaster/tasks/${id}`, { method: "DELETE" });
      load();
    } catch { /* ignore */ }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Webmaster Tasks</h1>
            <p className="text-sm text-gray-500">Assign and track governance and remediation work</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button data-testid="btn-refresh-tasks" onClick={load} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button data-testid="btn-new-task" onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">{error}</div>}

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {(["open", "in_progress", "escalated", "done"] as const).map((k) => (
            <div key={k} className="bg-white rounded-xl border border-gray-200 p-4" data-testid={`task-stat-${k}`}>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS[k]}`}>{k.replace(/_/g, " ")}</span>
                <span className="text-2xl font-bold text-gray-900">{data.counts[k]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-100">
          <select data-testid="filter-task-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          <select data-testid="filter-task-priority" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
          ) : !data || data.data.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No tasks. Create one to get started.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Task</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Assignee</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Due</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.data.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50" data-testid={`task-row-${t.id}`}>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium text-gray-900 line-clamp-1">{t.title}</div>
                      {t.content_title && <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><ArrowUpRight className="w-3 h-3" />{t.content_title}</div>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{t.type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY[t.priority]}`}>{t.priority}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{t.assignee_name ?? "Unassigned"}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        data-testid={`select-task-status-${t.id}`}
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${STATUS[t.status] ?? "bg-gray-100"}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button data-testid={`btn-delete-task-${t.id}`} onClick={() => remove(t.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreate && <CreateTaskModal owners={owners} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />}
    </div>
  );
}

function CreateTaskModal({ owners, onClose, onCreated }: { owners: { id: number; name: string }[]; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", type: "review", priority: "medium", assigned_to: "", due_date: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function save() {
    if (!form.title.trim()) { setErr("Title is required"); return; }
    setSaving(true);
    setErr(null);
    try {
      await apiFetch("/webmaster/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          type: form.type,
          priority: form.priority,
          assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
          due_date: form.due_date || null,
        }),
      });
      onCreated();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to create task");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="create-task-modal">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">New Task</h3>
          <button data-testid="btn-close-create-task" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {err && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{err}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input data-testid="input-task-title" value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea data-testid="input-task-desc" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select data-testid="input-task-type" value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {TASK_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select data-testid="input-task-priority" value={form.priority} onChange={(e) => set("priority", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Assign to</label>
              <select data-testid="input-task-assignee" value={form.assigned_to} onChange={(e) => set("assigned_to", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Unassigned</option>
                {owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due date</label>
              <input data-testid="input-task-due" type="date" value={form.due_date} onChange={(e) => set("due_date", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button data-testid="btn-cancel-create-task" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button data-testid="btn-save-task" onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">{saving ? "Creating..." : "Create Task"}</button>
        </div>
      </div>
    </div>
  );
}
