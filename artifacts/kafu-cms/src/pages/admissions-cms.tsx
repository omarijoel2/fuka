import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { apiFetch } from "@/lib/api";
import {
  GraduationCap, FileText, Settings2, Upload, CheckCircle2, XCircle,
  Clock, Search, Plus, Edit2, Trash2, Save, X, RefreshCw, AlertCircle,
  Filter, Eye, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  BookOpen, Briefcase, Calendar, Users, FileUp, BarChart3, Download,
  ChevronRight, Inbox, AlertOctagon, CheckSquare, MessageSquare, Ban,
  SkipForward, DollarSign, Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface UploadRecord {
  id: number;
  reference_id: string;
  file_name: string;
  document_type: string;
  size_kb: number;
  status: "pending" | "verified" | "rejected";
  reviewed_by: string | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface PgProgramme {
  id: number;
  code: string;
  name: string;
  level: "masters" | "doctoral";
  school: string;
  duration: string;
  min_qual: string;
  min_class: string;
  career_hint: string;
  is_active: boolean;
  sort_order: number;
}

interface Setting {
  key: string;
  label: string;
  type: "text" | "date" | "boolean" | "number";
  value: string;
}

interface Intake {
  id: number;
  name: string;
  academic_year: string;
  intake_period: string;
  status: string;
  is_published: boolean;
  open_at: string;
  close_at: string;
  application_fee_undergraduate: number;
  application_fee_masters: number;
  application_fee_phd: number;
  max_applications: number | null;
  notes: string | null;
  created_at: string;
}

interface Application {
  id: number;
  application_number: string;
  reference: string;
  full_name: string;
  email: string;
  phone: string | null;
  programme_name: string;
  school_code: string;
  level: string;
  pathway_name: string;
  status: string;
  payment_status: string;
  completeness_score: number;
  submitted_at: string | null;
  created_at: string;
}

interface KuccpsBatch {
  id: number;
  filename: string;
  academic_year: string;
  intake_period: string;
  status: "pending" | "processing" | "completed" | "failed";
  total_rows: number;
  processed_rows: number;
  successful_rows: number;
  failed_rows: number;
  error_log: string | null;
  imported_by: number;
  created_at: string;
  completed_at: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SCHOOLS = ["SESS", "SBE", "SCIT", "SOS", "SHS"];
const SCHOOL_NAMES: Record<string, string> = {
  SESS: "Education & Social Sciences", SBE: "Business & Economics",
  SCIT: "Computing & IT", SOS: "Science", SHS: "Health Sciences",
};
const DEGREE_CLASSES = [
  { value: "pass", label: "Pass / Unclassified" },
  { value: "third", label: "Third Class Honours" },
  { value: "lower_second", label: "2nd Class Lower (2:2)" },
  { value: "upper_second", label: "2nd Class Upper (2:1)" },
  { value: "first", label: "First Class Honours" },
  { value: "masters", label: "Masters Degree" },
];

const UPLOAD_STATUS_CONFIG = {
  pending:  { label: "Pending", cls: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3.5 h-3.5" /> },
  verified: { label: "Verified", cls: "bg-emerald-100 text-emerald-800", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-800", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const APP_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  draft:       { label: "Draft",        cls: "bg-gray-100 text-gray-700" },
  submitted:   { label: "Submitted",    cls: "bg-blue-100 text-blue-700" },
  under_review:{ label: "Under Review", cls: "bg-purple-100 text-purple-700" },
  eligible:    { label: "Eligible",     cls: "bg-teal-100 text-teal-700" },
  offered:     { label: "Offer Sent",   cls: "bg-emerald-100 text-emerald-700" },
  rejected:    { label: "Rejected",     cls: "bg-red-100 text-red-700" },
  query:       { label: "Query Docs",   cls: "bg-amber-100 text-amber-700" },
  deferred:    { label: "Deferred",     cls: "bg-orange-100 text-orange-700" },
};

const INTAKE_STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  draft:         { label: "Draft",          cls: "bg-gray-100 text-gray-600" },
  published:     { label: "Published",      cls: "bg-blue-100 text-blue-700" },
  open:          { label: "Open",           cls: "bg-emerald-100 text-emerald-700" },
  closing_soon:  { label: "Closing Soon",   cls: "bg-amber-100 text-amber-700" },
  extended:      { label: "Extended",       cls: "bg-cyan-100 text-cyan-700" },
  closed:        { label: "Closed",         cls: "bg-red-100 text-red-700" },
  processing:    { label: "Processing",     cls: "bg-purple-100 text-purple-700" },
  archived:      { label: "Archived",       cls: "bg-gray-100 text-gray-500" },
};

function fmt(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Generic Badge ─────────────────────────────────────────────────────────────
function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Tab: Document Uploads ─────────────────────────────────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

function ReviewModal({ upload, onClose, onSaved }: { upload: UploadRecord; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState<UploadRecord["status"]>(upload.status);
  const [notes, setNotes] = useState(upload.reviewer_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true); setError("");
    try {
      await apiFetch(`/admissions/uploads/${upload.reference_id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900">Review Document Upload</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">File</span><span className="font-medium text-gray-800 truncate max-w-xs">{upload.file_name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="text-gray-800">{upload.document_type}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="text-gray-800">{upload.size_kb} KB</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Reference</span><code className="font-mono text-xs bg-gray-100 px-1 rounded">{upload.reference_id}</code></div>
            <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="text-gray-800">{fmt(upload.created_at)}</span></div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Decision</label>
            <div className="flex gap-3">
              {(["pending","verified","rejected"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${status === s ? "border-[#228B22] bg-[#228B22]/5 text-[#228B22]" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                  data-testid={`review-status-${s}`}>
                  {UPLOAD_STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reviewer Notes <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="e.g. Document verified against original. Approved for processing."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]/30"
              data-testid="review-notes" />
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
          <button onClick={save} disabled={saving}
            className="px-5 py-2 bg-[#228B22] text-white rounded-lg text-sm font-medium hover:bg-[#228B22]/90 disabled:opacity-50 flex items-center gap-2"
            data-testid="btn-save-review">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Decision
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadsTab() {
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reviewing, setReviewing] = useState<UploadRecord | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const data = await apiFetch(`/admissions/uploads?${params}`);
      setUploads(data.data ?? []);
    } finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const pendingCount = uploads.filter((u) => u.status === "pending").length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by file or reference…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]/30"
            data-testid="search-uploads" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          data-testid="filter-status">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        {pendingCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
            <AlertOctagon className="w-4 h-4" /> {pendingCount} pending review
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading uploads…</div>
      ) : uploads.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <div className="font-medium">No document uploads found</div>
        </div>
      ) : (
        <div className="space-y-2">
          {uploads.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 bg-white" data-testid={`upload-row-${u.id}`}>
              <FileText className="w-8 h-8 text-gray-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">{u.file_name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{u.document_type} · {u.size_kb} KB · Ref: <code className="font-mono bg-gray-100 px-1 rounded">{u.reference_id}</code></div>
                <div className="text-xs text-gray-400 mt-0.5">{fmt(u.created_at)}</div>
              </div>
              <Badge label={UPLOAD_STATUS_CONFIG[u.status]?.label ?? u.status} cls={UPLOAD_STATUS_CONFIG[u.status]?.cls ?? ""} />
              <button onClick={() => setReviewing(u)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#228B22] text-[#228B22] rounded-lg text-xs font-medium hover:bg-[#228B22]/5 transition-colors"
                data-testid={`btn-review-${u.id}`}>
                <Eye className="w-3.5 h-3.5" /> Review
              </button>
            </div>
          ))}
        </div>
      )}

      {reviewing && <ReviewModal upload={reviewing} onClose={() => setReviewing(null)} onSaved={() => { setReviewing(null); load(); }} />}
    </div>
  );
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Tab: Intake Management ────────────────────────────────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

const BLANK_INTAKE: Omit<Intake, "id" | "created_at"> = {
  name: "", academic_year: "", intake_period: "January",
  status: "draft", is_published: false,
  open_at: "", close_at: "",
  application_fee_undergraduate: 1000,
  application_fee_masters: 1500,
  application_fee_phd: 2000,
  max_applications: null, notes: null,
};

function IntakeModal({ intake, onClose, onSaved }: { intake: Partial<Intake> | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !intake?.id;
  const [form, setForm] = useState({ ...BLANK_INTAKE, ...(intake ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string | boolean | number | null) { setForm((f) => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (!form.name || !form.academic_year || !form.open_at || !form.close_at) {
        setError("Please fill all required fields."); setSaving(false); return;
      }
      const endpoint = isNew ? "/admin/admissions/intakes" : `/admin/admissions/intakes/${intake!.id}`;
      const method = isNew ? "POST" : "PUT";
      await apiFetch(endpoint, { method, body: JSON.stringify(form) });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900">{isNew ? "Create Intake" : "Edit Intake"}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Intake Name" required className="col-span-2">
              <input value={form.name} onChange={(e) => set("name",e.target.value)}
                placeholder="e.g. September 2026 Intake"
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-name" />
            </FormField>
            <FormField label="Academic Year" required>
              <input value={form.academic_year} onChange={(e) => set("academic_year",e.target.value)}
                placeholder="e.g. 2026/2027"
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-year" />
            </FormField>
            <FormField label="Intake Period" required>
              <select value={form.intake_period} onChange={(e) => set("intake_period",e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-period">
                {["January","May","September"].map(p => <option key={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Open Date" required>
              <input type="date" value={form.open_at?.split("T")[0] ?? ""} onChange={(e) => set("open_at",e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-open-at" />
            </FormField>
            <FormField label="Close Date" required>
              <input type="date" value={form.close_at?.split("T")[0] ?? ""} onChange={(e) => set("close_at",e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-close-at" />
            </FormField>
            <FormField label="UG Fee (KES)">
              <input type="number" value={form.application_fee_undergraduate} onChange={(e) => set("application_fee_undergraduate",Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-fee-ug" />
            </FormField>
            <FormField label="Masters Fee (KES)">
              <input type="number" value={form.application_fee_masters} onChange={(e) => set("application_fee_masters",Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-fee-masters" />
            </FormField>
            <FormField label="PhD Fee (KES)">
              <input type="number" value={form.application_fee_phd} onChange={(e) => set("application_fee_phd",Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-fee-phd" />
            </FormField>
            <FormField label="Max Applications">
              <input type="number" value={form.max_applications ?? ""} onChange={(e) => set("max_applications",e.target.value ? Number(e.target.value) : null)}
                placeholder="Leave blank for unlimited"
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-max" />
            </FormField>
          </div>
          <FormField label="Notes">
            <textarea value={form.notes ?? ""} onChange={(e) => set("notes",e.target.value || null)} rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="intake-notes" />
          </FormField>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published",e.target.checked)}
              className="accent-[#228B22]" data-testid="intake-published" />
            Publish intake (visible to applicants)
          </label>
          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-[#228B22] text-white rounded-lg text-sm font-medium hover:bg-[#228B22]/90 disabled:opacity-50 flex items-center gap-2"
              data-testid="btn-save-intake">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isNew ? "Create Intake" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IntakesTab() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Intake> | null | false>(false);
  const [actioning, setActioning] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/admissions/intakes");
      setIntakes(data.data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function doAction(id: number, action: "publish" | "open" | "close" | "archive") {
    setActioning(id); setError("");
    try {
      await apiFetch(`/admin/admissions/intakes/${id}/${action}`, { method: "POST" });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally { setActioning(null); }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete intake "${name}"? This cannot be undone.`)) return;
    setError("");
    try {
      await apiFetch(`/admin/admissions/intakes/${id}`, { method: "DELETE" });
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          {[
            { cls: "bg-emerald-50 text-emerald-800", count: intakes.filter(i => i.status === "open").length, label: "Open" },
            { cls: "bg-blue-50 text-blue-800",    count: intakes.filter(i => i.status === "published").length, label: "Published" },
            { cls: "bg-gray-50 text-gray-600",    count: intakes.filter(i => i.status === "draft").length, label: "Draft" },
          ].map(s => (
            <div key={s.label} className={`${s.cls} rounded-xl px-4 py-2 text-center`}>
              <div className="text-xl font-bold">{s.count}</div>
              <div className="text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setEditing({})}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#228B22] text-white rounded-lg text-sm font-medium hover:bg-[#228B22]/90"
          data-testid="btn-create-intake">
          <Plus className="w-4 h-4" /> Create Intake
        </button>
      </div>

      {error && <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"><AlertCircle className="w-4 h-4" />{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading intakes…</div>
      ) : intakes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <div className="font-medium">No intakes configured yet</div>
          <div className="text-xs mt-1">Create your first intake to begin accepting applications</div>
        </div>
      ) : (
        <div className="space-y-3">
          {intakes.map((intake) => {
            const cfg = INTAKE_STATUS_CONFIG[intake.status] ?? { label: intake.status, cls: "bg-gray-100 text-gray-600" };
            return (
              <div key={intake.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden" data-testid={`intake-row-${intake.id}`}>
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-[#228B22]/10 text-[#228B22] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-sm text-gray-900">{intake.name}</span>
                      <Badge label={cfg.label} cls={cfg.cls} />
                      {intake.is_published && <Badge label="Published" cls="bg-blue-100 text-blue-700" />}
                    </div>
                    <div className="text-xs text-gray-500">{intake.academic_year} · {intake.intake_period}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Open: {fmtDate(intake.open_at)} — Close: {fmtDate(intake.close_at)}
                    </div>
                    <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
                      <span>UG: KES {intake.application_fee_undergraduate.toLocaleString()}</span>
                      <span>Masters: KES {intake.application_fee_masters.toLocaleString()}</span>
                      <span>PhD: KES {intake.application_fee_phd.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditing(intake)} title="Edit"
                      className="p-1.5 text-gray-400 hover:text-[#228B22] rounded-lg hover:bg-[#228B22]/10"
                      data-testid={`btn-edit-intake-${intake.id}`}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(intake.id, intake.name)} title="Delete"
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      data-testid={`btn-delete-intake-${intake.id}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Action bar */}
                <div className="border-t bg-gray-50 px-4 py-2 flex flex-wrap gap-2">
                  {intake.status === "draft" && (
                    <ActionBtn id={intake.id} action="publish" label="Publish" icon={<Eye className="w-3.5 h-3.5" />} cls="border-blue-300 text-blue-700 hover:bg-blue-50" actioning={actioning} doAction={doAction} />
                  )}
                  {(intake.status === "published" || intake.status === "draft") && (
                    <ActionBtn id={intake.id} action="open" label="Open Now" icon={<CheckCircle2 className="w-3.5 h-3.5" />} cls="border-emerald-300 text-emerald-700 hover:bg-emerald-50" actioning={actioning} doAction={doAction} />
                  )}
                  {intake.status === "open" && (
                    <ActionBtn id={intake.id} action="close" label="Close" icon={<Ban className="w-3.5 h-3.5" />} cls="border-red-300 text-red-700 hover:bg-red-50" actioning={actioning} doAction={doAction} />
                  )}
                  {!["archived","draft"].includes(intake.status) && (
                    <ActionBtn id={intake.id} action="archive" label="Archive" icon={<SkipForward className="w-3.5 h-3.5" />} cls="border-gray-300 text-gray-600 hover:bg-gray-100" actioning={actioning} doAction={doAction} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing !== false && (
        <IntakeModal intake={editing || null} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); load(); }} />
      )}
    </div>
  );
}

function ActionBtn({ id, action, label, icon, cls, actioning, doAction }: { id: number; action: "publish"|"open"|"close"|"archive"; label: string; icon: React.ReactNode; cls: string; actioning: number | null; doAction: (id: number, action: "publish"|"open"|"close"|"archive") => void }) {
  return (
    <button onClick={() => doAction(id, action)} disabled={actioning === id}
      className={`flex items-center gap-1.5 px-3 py-1 border rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${cls}`}
      data-testid={`btn-${action}-${id}`}>
      {actioning === id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : icon}
      {label}
    </button>
  );
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Tab: Application Review Queue ─────────────────────────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

function ApplicationDetailModal({ app, onClose, onRefresh }: { app: Application; onClose: () => void; onRefresh: () => void }) {
  const [notes, setNotes] = useState("");
  const [actioning, setActioning] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function doAction(action: string) {
    if (action === "reject" || action === "query-documents") {
      if (!notes.trim()) { setError("Please provide notes before this action."); return; }
    }
    setActioning(action); setError("");
    try {
      await apiFetch(`/admin/admin-applications/${app.reference}/${action}`, {
        method: "POST",
        body: JSON.stringify({ notes }),
      });
      onRefresh(); onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally { setActioning(null); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-base text-gray-900">{app.full_name}</h2>
            <code className="text-xs text-gray-500 font-mono">{app.application_number ?? app.reference}</code>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["Programme", app.programme_name],
              ["School", SCHOOL_NAMES[app.school_code] ?? app.school_code],
              ["Level", app.level],
              ["Pathway", app.pathway_name],
              ["Status", <Badge key="s" label={APP_STATUS_CONFIG[app.status]?.label ?? app.status} cls={APP_STATUS_CONFIG[app.status]?.cls ?? ""} />],
              ["Payment", app.payment_status],
              ["Completeness", `${app.completeness_score ?? 0}%`],
              ["Submitted", fmtDate(app.submitted_at)],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between gap-2 border-b pb-1.5 col-span-1">
                <span className="text-gray-500 text-xs">{k}</span>
                <span className="text-gray-800 text-xs font-medium text-right">{v}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (required for Query / Reject)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Internal review notes or rejection reason…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]/30"
              data-testid="app-review-notes" />
          </div>

          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}

          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { action: "mark-eligible", label: "Mark Eligible", icon: <CheckSquare className="w-4 h-4" />, cls: "bg-teal-600 hover:bg-teal-700", show: ["submitted","under_review"].includes(app.status) },
              { action: "offer",         label: "Send Offer",    icon: <CheckCircle2 className="w-4 h-4" />, cls: "bg-[#228B22] hover:bg-[#228B22]/90", show: app.status === "eligible" },
              { action: "query-documents", label: "Query Docs", icon: <MessageSquare className="w-4 h-4" />, cls: "bg-amber-600 hover:bg-amber-700", show: ["submitted","under_review","eligible"].includes(app.status) },
              { action: "reject",        label: "Reject",        icon: <XCircle className="w-4 h-4" />, cls: "bg-red-600 hover:bg-red-700", show: !["draft","rejected","offered"].includes(app.status) },
              { action: "defer",         label: "Defer",         icon: <SkipForward className="w-4 h-4" />, cls: "bg-orange-500 hover:bg-orange-600", show: ["submitted","under_review","eligible"].includes(app.status) },
            ].filter(a => a.show).map(a => (
              <button key={a.action} onClick={() => doAction(a.action)} disabled={actioning === a.action}
                className={`flex items-center justify-center gap-1.5 py-2 ${a.cls} text-white rounded-lg text-sm font-medium disabled:opacity-50`}
                data-testid={`btn-${a.action}`}>
                {actioning === a.action ? <RefreshCw className="w-4 h-4 animate-spin" /> : a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [levelFilter, setLevelFilter] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (levelFilter) params.set("level", levelFilter);
      const data = await apiFetch(`/admin/admin-applications?${params}`);
      setApps(data.data ?? []);
    } finally { setLoading(false); }
  }, [search, statusFilter, levelFilter]);

  useEffect(() => { load(); }, [load]);

  const statusCounts = Object.entries(APP_STATUS_CONFIG).map(([k, cfg]) => ({
    status: k, label: cfg.label,
    count: apps.filter(a => a.status === k).length,
  }));

  return (
    <div>
      {/* Summary pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        {statusCounts.filter(s => s.count > 0).map(s => (
          <button key={s.status} onClick={() => setStatusFilter(s.status === statusFilter ? "" : s.status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === s.status ? "border-[#228B22] bg-[#228B22]/5 text-[#228B22]" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
            data-testid={`filter-status-${s.status}`}>
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, reference…"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            data-testid="search-apps" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" data-testid="filter-app-status">
          <option value="">All Statuses</option>
          {Object.entries(APP_STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" data-testid="filter-app-level">
          <option value="">All Levels</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="masters">Masters</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />Loading applications…
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <div className="font-medium">No applications found</div>
          <div className="text-xs mt-1">Applications will appear here once submitted by applicants</div>
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map((app) => {
            const cfg = APP_STATUS_CONFIG[app.status];
            return (
              <div key={app.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 bg-white cursor-pointer"
                onClick={() => setSelected(app)} data-testid={`app-row-${app.id}`}>
                <div className="w-9 h-9 rounded-full bg-[#228B22]/10 text-[#228B22] flex items-center justify-center text-xs font-bold shrink-0">
                  {app.full_name?.charAt(0)?.toUpperCase() ?? "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{app.full_name}</span>
                    {cfg && <Badge label={cfg.label} cls={cfg.cls} />}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{app.programme_name} · {app.pathway_name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{app.application_number ?? app.reference} · Submitted {fmtDate(app.submitted_at)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-gray-700">{app.completeness_score ?? 0}% complete</div>
                  <div className="text-xs text-gray-400 mt-0.5">{app.payment_status}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </div>
            );
          })}
        </div>
      )}

      {selected && <ApplicationDetailModal app={selected} onClose={() => setSelected(null)} onRefresh={() => { setSelected(null); load(); }} />}
    </div>
  );
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Tab: KUCCPS Import (Dashboard + Wizard launcher) ─────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

const KUCCPS_STATUS: Record<string, { label: string; cls: string }> = {
  uploaded:                 { label: "Uploaded",            cls: "bg-gray-100 text-gray-700" },
  mapping_in_progress:      { label: "Mapping",             cls: "bg-blue-100 text-blue-700" },
  mapped:                   { label: "Mapped",              cls: "bg-blue-100 text-blue-700" },
  validation_failed:        { label: "Validation Failed",   cls: "bg-red-100 text-red-700" },
  validation_passed:        { label: "Validated",           cls: "bg-amber-100 text-amber-800" },
  awaiting_approval:        { label: "Awaiting Approval",   cls: "bg-yellow-100 text-yellow-800" },
  approved:                 { label: "Approved",            cls: "bg-emerald-100 text-emerald-700" },
  import_queued:            { label: "Import Queued",       cls: "bg-cyan-100 text-cyan-700" },
  importing:                { label: "Importing",           cls: "bg-cyan-100 text-cyan-700" },
  imported:                 { label: "Imported",            cls: "bg-emerald-100 text-emerald-700" },
  imported_with_exceptions: { label: "Imported (Exceptions)", cls: "bg-orange-100 text-orange-700" },
  rolled_back:              { label: "Rolled Back",         cls: "bg-red-100 text-red-700" },
  cancelled:                { label: "Cancelled",           cls: "bg-gray-100 text-gray-500" },
};

interface KuccpsBatchFull {
  id: number;
  batch_reference: string;
  original_filename: string;
  status: string;
  academic_year?: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  imported_rows: number;
  created_at: string;
  approved_at?: string;
}

function KuccpsTab() {
  const [, navigate] = useLocation();
  const [batches, setBatches] = useState<KuccpsBatchFull[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/kuccps/import-batches");
      setBatches(data.batches ?? data.data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resumableStatuses = new Set(["uploaded","mapping_in_progress","mapped","validation_failed","validation_passed","awaiting_approval","approved","import_queued"]);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">KUCCPS Placement Import</h3>
          <p className="text-sm text-gray-500 mt-0.5">Upload, map, validate, and import KUCCPS placement data using the guided wizard</p>
        </div>
        <div className="flex gap-2">
          <button
            data-testid="btn-refresh-kuccps-batches"
            onClick={load}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            data-testid="btn-start-kuccps-import"
            onClick={() => navigate("/admissions/kuccps/wizard")}
            className="flex items-center gap-2 px-4 py-2 bg-[#228B22] text-white rounded-lg text-sm font-medium hover:bg-[#228B22]/90"
          >
            <Upload className="w-4 h-4" /> Start New Import
          </button>
        </div>
      </div>

      {/* Info notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        The import wizard supports Excel (.xlsx/.xls) and CSV files with automatic column mapping, programme matching, duplicate detection, manager approval workflow, and PDF admission letter generation.
      </div>

      {/* Batch list */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Import History</h4>
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading batches…</div>
        ) : batches.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
            <FileUp className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p>No import batches yet.</p>
            <button
              data-testid="btn-first-import"
              onClick={() => navigate("/admissions/kuccps/wizard")}
              className="mt-3 text-[#228B22] underline text-sm"
            >
              Start your first import
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {batches.map((batch) => {
              const cfg = KUCCPS_STATUS[batch.status] ?? { label: batch.status, cls: "bg-gray-100 text-gray-600" };
              const canResume = resumableStatuses.has(batch.status);
              return (
                <div key={batch.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors" data-testid={`kuccps-batch-${batch.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-sm text-gray-800 truncate">{batch.original_filename}</span>
                        <Badge label={cfg.label} cls={cfg.cls} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>Ref: {batch.batch_reference}</span>
                        {batch.academic_year && <span>{batch.academic_year}</span>}
                        <span>Uploaded: {fmt(batch.created_at)}</span>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-gray-600">Total: <strong>{batch.total_rows}</strong></span>
                        <span className="text-emerald-700">Valid: <strong>{batch.valid_rows}</strong></span>
                        {batch.invalid_rows > 0 && <span className="text-red-600">Invalid: <strong>{batch.invalid_rows}</strong></span>}
                        {batch.imported_rows > 0 && <span className="text-emerald-700">Imported: <strong>{batch.imported_rows}</strong></span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {canResume && (
                        <button
                          data-testid={`btn-resume-batch-${batch.id}`}
                          onClick={() => navigate(`/admissions/kuccps/wizard/${batch.id}`)}
                          className="px-3 py-1.5 text-xs bg-[#228B22] text-white rounded-lg font-medium hover:bg-[#228B22]/90"
                        >
                          Resume
                        </button>
                      )}
                      {!canResume && (
                        <button
                          data-testid={`btn-view-batch-${batch.id}`}
                          onClick={() => navigate(`/admissions/kuccps/wizard/${batch.id}`)}
                          className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Tab: Postgraduate Programmes ──────────────────────────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

const PG_BLANK: Omit<PgProgramme, "id"> = {
  code: "", name: "", level: "masters", school: "SESS", duration: "2 years",
  min_qual: "", min_class: "lower_second", career_hint: "", is_active: true, sort_order: 0,
};

function ProgrammeModal({ prog, onClose, onSaved }: { prog: Partial<PgProgramme> | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !prog?.id;
  const [form, setForm] = useState({ ...PG_BLANK, ...(prog ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string | boolean | number) { setForm((f) => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (isNew) {
        await apiFetch("/admissions/pg-programmes", { method: "POST", body: JSON.stringify(form) });
      } else {
        await apiFetch(`/admissions/pg-programmes/${prog!.id}`, { method: "PUT", body: JSON.stringify(form) });
      }
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900">{isNew ? "Add Postgraduate Programme" : "Edit Programme"}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Programme Code" required>
              <input value={form.code} onChange={(e) => set("code",e.target.value)} placeholder="e.g. MBA" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-code" />
            </FormField>
            <FormField label="Level" required>
              <select value={form.level} onChange={(e) => set("level",e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-level">
                <option value="masters">Masters</option>
                <option value="doctoral">Doctoral (PhD)</option>
              </select>
            </FormField>
            <FormField label="Programme Name" required className="col-span-2">
              <input value={form.name} onChange={(e) => set("name",e.target.value)} placeholder="e.g. Master of Business Administration" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-name" />
            </FormField>
            <FormField label="School" required>
              <select value={form.school} onChange={(e) => set("school",e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-school">
                {SCHOOLS.map((s) => <option key={s} value={s}>{SCHOOL_NAMES[s]}</option>)}
              </select>
            </FormField>
            <FormField label="Duration" required>
              <input value={form.duration} onChange={(e) => set("duration",e.target.value)} placeholder="e.g. 2 years" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-duration" />
            </FormField>
            <FormField label="Minimum Qualification" className="col-span-2">
              <input value={form.min_qual} onChange={(e) => set("min_qual",e.target.value)} placeholder="e.g. Bachelor's Degree in related field" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-min-qual" />
            </FormField>
            <FormField label="Minimum Degree Class" required>
              <select value={form.min_class} onChange={(e) => set("min_class",e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-min-class">
                {DEGREE_CLASSES.map((dc) => <option key={dc.value} value={dc.value}>{dc.label}</option>)}
              </select>
            </FormField>
            <FormField label="Sort Order">
              <input type="number" value={form.sort_order} onChange={(e) => set("sort_order",Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-sort" />
            </FormField>
            <FormField label="Career Hint" className="col-span-2">
              <input value={form.career_hint} onChange={(e) => set("career_hint",e.target.value)} placeholder="e.g. University Lecturer, Senior Researcher" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="prog-career" />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active",e.target.checked)} className="accent-[#228B22]" data-testid="prog-active" />
            Programme is active and visible to applicants
          </label>
          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 bg-[#228B22] text-white rounded-lg text-sm font-medium hover:bg-[#228B22]/90 disabled:opacity-50 flex items-center gap-2"
              data-testid="btn-save-prog">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isNew ? "Add Programme" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProgrammesTab() {
  const [progs, setProgs] = useState<PgProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("");
  const [editing, setEditing] = useState<Partial<PgProgramme> | null | false>(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admissions/pg-programmes${filterLevel ? `?level=${filterLevel}` : ""}`);
      setProgs(data.data ?? []);
    } finally { setLoading(false); }
  }, [filterLevel]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await apiFetch(`/admissions/pg-programmes/${id}`, { method: "DELETE" });
      load();
    } finally { setDeleting(null); }
  }

  async function handleSeed() {
    setSeeding(true); setSeedMsg("");
    try {
      const res = await apiFetch("/admissions/pg-programmes/seed", { method: "POST" });
      setSeedMsg(res.message ?? "Programmes seeded successfully");
      load();
    } catch (e: unknown) {
      setSeedMsg(e instanceof Error ? e.message : "Seed failed");
    } finally { setSeeding(false); }
  }

  const filtered = filterLevel ? progs.filter((p) => p.level === filterLevel) : progs;
  const mastersCount = progs.filter((p) => p.level === "masters").length;
  const doctoralCount = progs.filter((p) => p.level === "doctoral").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-3">
          <div className="bg-blue-50 text-blue-800 rounded-xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{mastersCount}</div>
            <div className="text-xs font-medium">Masters</div>
          </div>
          <div className="bg-purple-50 text-purple-800 rounded-xl px-4 py-3 text-center">
            <div className="text-xl font-bold">{doctoralCount}</div>
            <div className="text-xs font-medium">Doctoral (PhD)</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {progs.length === 0 && (
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-1.5 px-3 py-2 border border-amber-300 bg-amber-50 text-amber-800 rounded-lg text-sm hover:bg-amber-100 disabled:opacity-50"
              data-testid="btn-seed">
              <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} /> Import Default Programmes
            </button>
          )}
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" data-testid="filter-level">
            <option value="">All Levels</option>
            <option value="masters">Masters</option>
            <option value="doctoral">Doctoral (PhD)</option>
          </select>
          <button onClick={() => setEditing({})}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#228B22] text-white rounded-lg text-sm font-medium hover:bg-[#228B22]/90"
            data-testid="btn-add-programme">
            <Plus className="w-4 h-4" /> Add Programme
          </button>
        </div>
      </div>

      {seedMsg && <div className="mb-4 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">{seedMsg}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading programmes…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <div className="font-medium">No postgraduate programmes yet</div>
          <div className="text-xs mt-1 mb-4">Add programmes manually or import the default set</div>
          {progs.length === 0 && (
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#228B22] text-[#228B22] rounded-lg text-sm mx-auto hover:bg-[#228B22]/5"
              data-testid="btn-seed-empty">
              <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} /> Import Default Programmes
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((prog) => (
            <div key={prog.id} className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${prog.is_active ? "border-gray-200 bg-white hover:border-gray-300" : "border-gray-100 bg-gray-50 opacity-70"}`}
              data-testid={`prog-row-${prog.id}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${prog.level === "doctoral" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                {prog.level === "doctoral" ? "PhD" : "MSc"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-800">{prog.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${prog.level === "doctoral" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {prog.level === "doctoral" ? "Doctoral" : "Masters"}
                  </span>
                  {!prog.is_active && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Inactive</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{SCHOOL_NAMES[prog.school] ?? prog.school} · {prog.duration} · Min: {DEGREE_CLASSES.find((d) => d.value === prog.min_class)?.label ?? prog.min_class}</div>
                {prog.career_hint && (
                  <div className="text-xs text-[#DAA520] flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3 h-3" /> {prog.career_hint}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setEditing(prog)} className="p-1.5 text-gray-400 hover:text-[#228B22] rounded-lg hover:bg-[#228B22]/10" title="Edit" data-testid={`btn-edit-prog-${prog.id}`}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(prog.id, prog.name)} disabled={deleting === prog.id} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete" data-testid={`btn-delete-prog-${prog.id}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== false && (
        <ProgrammeModal prog={editing || null} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); load(); }} />
      )}
    </div>
  );
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Tab: Eligibility Settings ─────────────────────────────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

function SettingsTab() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admissions/settings");
      setSettings(data.data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function updateValue(key: string, value: string) {
    setSettings((prev) => prev.map((s) => s.key === key ? { ...s, value } : s));
    setSaved(false);
  }

  async function save() {
    setSaving(true); setError(""); setSaved(false);
    try {
      await apiFetch("/admissions/settings", {
        method: "PUT",
        body: JSON.stringify({ settings: settings.map((s) => ({ key: s.key, value: s.value })) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  const intakeSettings  = settings.filter((s) => s.key.includes("intake") || s.key.includes("deadline"));
  const cutoffSettings  = settings.filter((s) => s.key.includes("cutoff") || s.key.includes("pg_masters"));
  const contactSettings = settings.filter((s) => s.key.includes("contact"));

  return (
    <div className="max-w-2xl">
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading settings…</div>
      ) : (
        <div className="space-y-8">
          {[
            { label: "Intake Status & Deadlines", items: intakeSettings, icon: <Clock className="w-4 h-4" /> },
            { label: "Eligibility Cut-off Grades", items: cutoffSettings, icon: <GraduationCap className="w-4 h-4" /> },
            { label: "Admissions Contact Information", items: contactSettings, icon: <Settings2 className="w-4 h-4" /> },
          ].filter((g) => g.items.length > 0).map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                {group.icon} {group.label}
              </div>
              <div className="space-y-3 border border-gray-200 rounded-xl overflow-hidden">
                {group.items.map((setting, i) => (
                  <div key={setting.key} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-0.5" htmlFor={`setting-${setting.key}`}>{setting.label}</label>
                      <div className="text-xs text-gray-400 font-mono">{setting.key}</div>
                    </div>
                    {setting.type === "boolean" ? (
                      <button onClick={() => updateValue(setting.key, setting.value === "1" ? "0" : "1")}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${setting.value === "1" ? "text-emerald-700" : "text-gray-400"}`}
                        data-testid={`toggle-${setting.key}`}>
                        {setting.value === "1" ? <><ToggleRight className="w-8 h-8 text-emerald-600" /> Open</> : <><ToggleLeft className="w-8 h-8 text-gray-400" /> Closed</>}
                      </button>
                    ) : setting.type === "date" ? (
                      <input id={`setting-${setting.key}`} type="date" value={setting.value} onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]/30"
                        data-testid={`input-${setting.key}`} />
                    ) : (
                      <input id={`setting-${setting.key}`} type="text" value={setting.value} onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]/30 w-56"
                        data-testid={`input-${setting.key}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
          {saved && <div className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="w-4 h-4" />Settings saved successfully.</div>}

          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#228B22] text-white rounded-lg text-sm font-medium hover:bg-[#228B22]/90 disabled:opacity-50"
            data-testid="btn-save-settings">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All Settings
          </button>
        </div>
      )}
    </div>
  );
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Shared Field Wrapper ──────────────────────────────────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

function FormField({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──
// ── Main Page ─────────────────────────────────────────────────────────────────
// ── ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ──

type Tab = "intakes" | "applications" | "kuccps" | "uploads" | "programmes" | "settings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "intakes",      label: "Intake Management",        icon: <Calendar className="w-4 h-4" /> },
  { id: "applications", label: "Application Review",        icon: <Users className="w-4 h-4" /> },
  { id: "kuccps",       label: "KUCCPS Import",             icon: <FileUp className="w-4 h-4" /> },
  { id: "uploads",      label: "Document Uploads",          icon: <Upload className="w-4 h-4" /> },
  { id: "programmes",   label: "Postgraduate Programmes",   icon: <GraduationCap className="w-4 h-4" /> },
  { id: "settings",     label: "Eligibility Settings",      icon: <Settings2 className="w-4 h-4" /> },
];

const TAB_PATHS: Record<Tab, string> = {
  intakes:      "/admissions",
  applications: "/admissions/applications",
  kuccps:       "/admissions/kuccps",
  uploads:      "/admissions/uploads",
  programmes:   "/admissions/programmes",
  settings:     "/admissions/settings",
};

function pathToTab(path: string): Tab {
  if (path.endsWith("/applications")) return "applications";
  if (path.endsWith("/kuccps"))       return "kuccps";
  if (path.endsWith("/uploads"))      return "uploads";
  if (path.endsWith("/programmes"))   return "programmes";
  if (path.endsWith("/settings"))     return "settings";
  return "intakes";
}

export default function AdmissionsCmsPage() {
  const [location, navigate] = useLocation();
  const tab = pathToTab(location);

  function switchTab(id: Tab) {
    navigate(TAB_PATHS[id]);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#228B22]/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-[#228B22]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admissions Management</h1>
          <p className="text-sm text-gray-500">Manage intakes, review applications, import KUCCPS data, and configure settings</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-0.5 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? "border-[#228B22] text-[#228B22]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            data-testid={`tab-${t.id}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "intakes"      && <IntakesTab />}
      {tab === "applications" && <ApplicationsTab />}
      {tab === "kuccps"       && <KuccpsTab />}
      {tab === "uploads"      && <UploadsTab />}
      {tab === "programmes"   && <ProgrammesTab />}
      {tab === "settings"     && <SettingsTab />}
    </div>
  );
}
