import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  GraduationCap, FileText, Settings2, Upload, CheckCircle2, XCircle,
  Clock, Search, Plus, Edit2, Trash2, Save, X, RefreshCw, AlertCircle,
  Filter, Eye, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  BookOpen, Briefcase,
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

// ── Constants ─────────────────────────────────────────────────────────────────
const SCHOOLS = ["SESS", "SBE", "SCIT", "SOS", "SHS"];
const SCHOOL_NAMES: Record<string, string> = {
  SESS: "Education & Social Sciences",
  SBE: "Business & Economics",
  SCIT: "Computing & IT",
  SOS: "Science",
  SHS: "Health Sciences",
};
const DEGREE_CLASSES = [
  { value: "pass", label: "Pass / Unclassified" },
  { value: "third", label: "Third Class Honours" },
  { value: "lower_second", label: "2nd Class Lower (2:2)" },
  { value: "upper_second", label: "2nd Class Upper (2:1)" },
  { value: "first", label: "First Class Honours" },
  { value: "masters", label: "Masters Degree" },
];

const STATUS_CONFIG = {
  pending:  { label: "Pending", cls: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3.5 h-3.5" /> },
  verified: { label: "Verified", cls: "bg-emerald-100 text-emerald-800", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-800", icon: <XCircle className="w-3.5 h-3.5" /> },
};

function fmt(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: UploadRecord["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Upload Review Modal ────────────────────────────────────────────────────────
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
    } finally {
      setSaving(false);
    }
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
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${status === s ? "border-[#1A5C38] bg-[#1A5C38]/5 text-[#1A5C38]" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                  data-testid={`review-status-${s}`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reviewer Notes <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Document verified against original. Approved for processing."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30"
              data-testid="review-notes"
            />
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 bg-[#1A5C38] text-white rounded-lg text-sm font-medium hover:bg-[#1A5C38]/90 disabled:opacity-50 flex items-center gap-2" data-testid="btn-save-review">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Decision
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PG Programme Modal ─────────────────────────────────────────────────────────
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
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900">{isNew ? "Add Postgraduate Programme" : "Edit Programme"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Programme Code *</label>
              <input value={form.code} onChange={(e) => set("code", e.target.value)} required placeholder="e.g. MSc IT" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-code" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Level *</label>
              <select value={form.level} onChange={(e) => set("level", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-level">
                <option value="masters">Masters</option>
                <option value="doctoral">Doctoral (PhD)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Programme Name *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="e.g. Master of Science in Information Technology" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">School *</label>
              <select value={form.school} onChange={(e) => set("school", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-school">
                {SCHOOLS.map((s) => <option key={s} value={s}>{s} — {SCHOOL_NAMES[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Duration *</label>
              <input value={form.duration} onChange={(e) => set("duration", e.target.value)} required placeholder="2 years" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-duration" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Minimum Qualification *</label>
            <input value={form.min_qual} onChange={(e) => set("min_qual", e.target.value)} required placeholder={form.level === "doctoral" ? "Master's degree in relevant field" : "Bachelor's degree, 2nd Class Honours or above"} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-min-qual" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Minimum Degree Class *</label>
              <select value={form.min_class} onChange={(e) => set("min_class", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-min-class">
                {DEGREE_CLASSES.map((dc) => <option key={dc.value} value={dc.value}>{dc.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Display Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-sort-order" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Career Outcomes / Hint</label>
            <input value={form.career_hint} onChange={(e) => set("career_hint", e.target.value)} placeholder="e.g. Technology Leadership, Research" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="field-career-hint" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="rounded" data-testid="field-is-active" />
            <span className="text-sm text-gray-700">Active (visible on eligibility checker)</span>
          </label>
          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-[#1A5C38] text-white rounded-lg text-sm font-medium hover:bg-[#1A5C38]/90 disabled:opacity-50 flex items-center gap-2" data-testid="btn-save-programme">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? "Add Programme" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Tab: Document Uploads ──────────────────────────────────────────────────────
function UploadsTab() {
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<UploadRecord | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedRef, setExpandedRef] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      const data = await apiFetch(`/admissions/uploads?${params}`);
      setUploads(data.data ?? []);
      setTotal(data.total ?? 0);
      setLastPage(data.last_page ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(ref: string) {
    if (!confirm("Delete this upload record? This cannot be undone.")) return;
    setDeleting(ref);
    try { await apiFetch(`/admissions/uploads/${ref}`, { method: "DELETE" }); load(); }
    finally { setDeleting(null); }
  }

  const pendingCount = uploads.filter((u) => u.status === "pending").length;

  return (
    <div>
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Uploads", value: total, cls: "bg-blue-50 text-blue-800" },
          { label: "Pending Review", value: pendingCount, cls: "bg-yellow-50 text-yellow-800" },
          { label: "Verified", value: uploads.filter((u) => u.status === "verified").length, cls: "bg-emerald-50 text-emerald-800" },
          { label: "Rejected", value: uploads.filter((u) => u.status === "rejected").length, cls: "bg-red-50 text-red-800" },
        ].map((s) => (
          <div key={s.label} className={`${s.cls} rounded-xl p-4`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-44">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by filename..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30"
            data-testid="search-uploads"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="filter-status">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:border-gray-400" data-testid="btn-refresh-uploads">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading uploads...</div>
      ) : uploads.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <div className="font-medium">No uploads found</div>
          <div className="text-xs mt-1">Certificate uploads from the public eligibility checker will appear here</div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">File / Reference</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Submitted</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {uploads.map((u) => (
                <React.Fragment key={u.reference_id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-2 text-left" onClick={() => setExpandedRef(expandedRef === u.reference_id ? null : u.reference_id)} data-testid={`expand-upload-${u.id}`}>
                        {expandedRef === u.reference_id ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                        <div>
                          <div className="font-medium text-gray-800 truncate max-w-xs">{u.file_name}</div>
                          <div className="text-xs text-gray-400 font-mono">{u.reference_id.slice(0, 16)}…</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{u.document_type}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{fmtDate(u.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setReviewing(u)} className="p-1.5 text-gray-400 hover:text-[#1A5C38] rounded-lg hover:bg-[#1A5C38]/10 transition-colors" title="Review" data-testid={`btn-review-${u.id}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(u.reference_id)} disabled={deleting === u.reference_id} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete" data-testid={`btn-delete-upload-${u.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRef === u.reference_id && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-4 text-sm">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div><span className="text-gray-500 text-xs block">Reference ID</span><code className="font-mono text-xs">{u.reference_id}</code></div>
                          <div><span className="text-gray-500 text-xs block">File Size</span>{u.size_kb} KB</div>
                          <div><span className="text-gray-500 text-xs block">Submitted</span>{fmt(u.created_at)}</div>
                          {u.reviewed_by && <div><span className="text-gray-500 text-xs block">Reviewed by</span>{u.reviewed_by}</div>}
                          {u.reviewed_at && <div><span className="text-gray-500 text-xs block">Reviewed at</span>{fmt(u.reviewed_at)}</div>}
                          {u.reviewer_notes && <div className="col-span-2 sm:col-span-3"><span className="text-gray-500 text-xs block">Notes</span>{u.reviewer_notes}</div>}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {lastPage > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
              <span className="text-gray-500">Page {page} of {lastPage} · {total} records</span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-400 disabled:opacity-40 text-xs">Previous</button>
                <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage} className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-400 disabled:opacity-40 text-xs">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {reviewing && (
        <ReviewModal upload={reviewing} onClose={() => setReviewing(null)} onSaved={() => { setReviewing(null); load(); }} />
      )}
    </div>
  );
}

// ── Tab: Postgraduate Programmes ───────────────────────────────────────────────
function ProgrammesTab() {
  const [progs, setProgs] = useState<PgProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PgProgramme> | null | false>(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admissions/pg-programmes");
      setProgs(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try { await apiFetch(`/admissions/pg-programmes/${id}`, { method: "DELETE" }); load(); }
    finally { setDeleting(null); }
  }

  async function handleSeed() {
    setSeeding(true); setSeedMsg("");
    try {
      const data = await apiFetch("/admissions/pg-programmes/seed", { method: "POST" });
      setSeedMsg(data.data?.message ?? "Done");
      load();
    } catch (e: unknown) {
      setSeedMsg(e instanceof Error ? e.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
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
            <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-1.5 px-3 py-2 border border-amber-300 bg-amber-50 text-amber-800 rounded-lg text-sm hover:bg-amber-100 disabled:opacity-50" data-testid="btn-seed">
              <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} /> Import Default Programmes
            </button>
          )}
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" data-testid="filter-level">
            <option value="">All Levels</option>
            <option value="masters">Masters</option>
            <option value="doctoral">Doctoral (PhD)</option>
          </select>
          <button onClick={() => setEditing({})} className="flex items-center gap-1.5 px-4 py-2 bg-[#1A5C38] text-white rounded-lg text-sm font-medium hover:bg-[#1A5C38]/90" data-testid="btn-add-programme">
            <Plus className="w-4 h-4" /> Add Programme
          </button>
        </div>
      </div>

      {seedMsg && <div className="mb-4 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">{seedMsg}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading programmes...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <div className="font-medium">No postgraduate programmes yet</div>
          <div className="text-xs mt-1 mb-4">Add programmes manually or import the 14 default programmes</div>
          {progs.length === 0 && (
            <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-1.5 px-4 py-2 border border-[#1A5C38] text-[#1A5C38] rounded-lg text-sm mx-auto hover:bg-[#1A5C38]/5" data-testid="btn-seed-empty">
              <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} /> Import Default Programmes
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((prog) => (
            <div key={prog.id} className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${prog.is_active ? "border-gray-200 bg-white hover:border-gray-300" : "border-gray-100 bg-gray-50 opacity-70"}`} data-testid={`prog-row-${prog.id}`}>
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
                  <div className="text-xs text-[#C9A227] flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3 h-3" /> {prog.career_hint}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setEditing(prog)} className="p-1.5 text-gray-400 hover:text-[#1A5C38] rounded-lg hover:bg-[#1A5C38]/10 transition-colors" title="Edit" data-testid={`btn-edit-prog-${prog.id}`}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(prog.id, prog.name)} disabled={deleting === prog.id} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete" data-testid={`btn-delete-prog-${prog.id}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== false && (
        <ProgrammeModal
          prog={editing || null}
          onClose={() => setEditing(false)}
          onSaved={() => { setEditing(false); load(); }}
        />
      )}
    </div>
  );
}

// ── Tab: Eligibility Settings ──────────────────────────────────────────────────
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
    } finally {
      setLoading(false);
    }
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
    } finally {
      setSaving(false);
    }
  }

  const intakeSettings = settings.filter((s) => s.key.includes("intake") || s.key.includes("deadline"));
  const cutoffSettings = settings.filter((s) => s.key.includes("cutoff") || s.key.includes("cutoff") || s.key.includes("pg_masters"));
  const contactSettings = settings.filter((s) => s.key.includes("contact"));

  return (
    <div className="max-w-2xl">
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading settings...</div>
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
                      <label className="block text-sm font-medium text-gray-700 mb-0.5" htmlFor={`setting-${setting.key}`}>
                        {setting.label}
                      </label>
                      <div className="text-xs text-gray-400 font-mono">{setting.key}</div>
                    </div>
                    {setting.type === "boolean" ? (
                      <button
                        onClick={() => updateValue(setting.key, setting.value === "1" ? "0" : "1")}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${setting.value === "1" ? "text-emerald-700" : "text-gray-400"}`}
                        data-testid={`toggle-${setting.key}`}
                      >
                        {setting.value === "1"
                          ? <><ToggleRight className="w-8 h-8 text-emerald-600" /> Open</>
                          : <><ToggleLeft className="w-8 h-8 text-gray-400" /> Closed</>}
                      </button>
                    ) : setting.type === "date" ? (
                      <input
                        id={`setting-${setting.key}`}
                        type="date"
                        value={setting.value}
                        onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30"
                        data-testid={`input-${setting.key}`}
                      />
                    ) : (
                      <input
                        id={`setting-${setting.key}`}
                        type="text"
                        value={setting.value}
                        onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 w-56"
                        data-testid={`input-${setting.key}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {error && <div className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" />{error}</div>}
          {saved && <div className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="w-4 h-4" />Settings saved successfully.</div>}

          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1A5C38] text-white rounded-lg text-sm font-medium hover:bg-[#1A5C38]/90 disabled:opacity-50" data-testid="btn-save-settings">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All Settings
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
type Tab = "uploads" | "programmes" | "settings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "uploads",    label: "Document Uploads",          icon: <Upload className="w-4 h-4" /> },
  { id: "programmes", label: "Postgraduate Programmes",   icon: <GraduationCap className="w-4 h-4" /> },
  { id: "settings",  label: "Eligibility Settings",       icon: <Settings2 className="w-4 h-4" /> },
];

function getInitialTab(): Tab {
  const p = new URLSearchParams(window.location.search).get("tab");
  if (p === "programmes" || p === "settings") return p;
  return "uploads";
}

export default function AdmissionsCmsPage() {
  const [tab, setTab] = useState<Tab>(getInitialTab);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#1A5C38]/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-[#1A5C38]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admissions Management</h1>
          <p className="text-sm text-gray-500">Certificate uploads, postgraduate programme catalogue, and eligibility settings</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-[#1A5C38] text-[#1A5C38]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            data-testid={`tab-${t.id}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "uploads"    && <UploadsTab />}
      {tab === "programmes" && <ProgrammesTab />}
      {tab === "settings"   && <SettingsTab />}
    </div>
  );
}
