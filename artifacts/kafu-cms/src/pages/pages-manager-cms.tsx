import React, { useState, useEffect, useCallback } from "react";
import { apiGet, apiPut, formatDate } from "@/lib/api";
import { Edit2, X, Save, AlertCircle, FileText, ChevronRight, RefreshCw } from "lucide-react";

interface PageRecord {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  status: string;
  updated_at: string;
  structured_data: Record<string, unknown> | null;
}

const INPUT = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const TEXTAREA = INPUT + " resize-none";

const PAGE_HINTS: Record<string, string> = {
  "about-service-charter":            "standards — array of service standard categories with items",
  "about-complaints":                 "process_steps, complaint_categories, rights",
  "about-legal":                      "functions, legal_areas, legal_basis",
  "research-ethics":                  "mandate, review_types, submission_steps, committee_members",
  "admissions-funding":               "steps, funding_types, documents",
  "admissions-timetables":            "academic_year, timetable_sets",
  "students-council":                 "mandate_areas, governance",
  "about-csr":                        "pillars, commitments",
  "about-strategic-plan":             "pillars, milestones",
  "about-policies":                   "policies — array with title/category/slug/status/review_date/description",
  "student-affairs":                  "services, mandate",
  "admissions-joining-instructions":  "phases, checklist",
  "international-study":              "why_kafu, fees_table, schools, steps",
  "international-visa":               "visa_categories",
};

export default function PagesManagerCmsPage() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageRecord | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/content", { type: "page", per_page: 50, status: undefined });
      setPages(res?.data ?? []);
    } catch {
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openEdit(page: PageRecord) {
    setEditing({ ...page });
    setJsonText(JSON.stringify(page.structured_data ?? {}, null, 2));
    setJsonError("");
  }

  function handleJsonChange(val: string) {
    setJsonText(val);
    try {
      JSON.parse(val);
      setJsonError("");
    } catch {
      setJsonError("Invalid JSON — fix before saving");
    }
  }

  async function save() {
    if (!editing) return;
    if (jsonError) { showToast("error", "Fix JSON errors before saving."); return; }
    let parsedSd: Record<string, unknown> = {};
    try { parsedSd = JSON.parse(jsonText); } catch { showToast("error", "Invalid JSON."); return; }
    setSaving(true);
    try {
      await apiPut(`/content/${editing.id}`, {
        title: editing.title,
        summary: editing.summary,
        structured_data: parsedSd,
        status: "published",
      });
      showToast("success", "Page saved and published.");
      setEditing(null);
      load();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const hint = editing ? PAGE_HINTS[editing.slug] : null;

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Edit the content of structural website pages. Changes publish immediately.
          </p>
        </div>
        <button onClick={load} data-testid="btn-refresh-pages"
          className="flex items-center gap-2 text-sm text-gray-500 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Guidance card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Structured Data Editor</p>
          <p>Each page has a JSON <code>structured_data</code> field that controls its content arrays and lists. Edit with care — the website falls back to hardcoded defaults if the JSON is removed or malformed.</p>
        </div>
      </div>

      {/* Pages list */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading pages…</div>
        ) : pages.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No structural pages found. Run the ContentPagesSeeder to populate.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Page</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Last Updated</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map(page => (
                <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{page.slug}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(page.updated_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      page.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(page)} data-testid={`btn-edit-page-${page.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors ml-auto">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-900">{editing.title}</h2>
                <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">{editing.slug}</code>
              </div>
              <button onClick={() => setEditing(null)} data-testid="btn-close-page-modal" className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Page Title</label>
                <input value={editing.title} onChange={e => setEditing(p => p ? { ...p, title: e.target.value } : p)}
                  data-testid="input-page-title" className={INPUT} />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Summary / Intro Text</label>
                <textarea rows={3} value={editing.summary ?? ""} onChange={e => setEditing(p => p ? { ...p, summary: e.target.value } : p)}
                  data-testid="textarea-page-summary" className={TEXTAREA}
                  placeholder="Short descriptive text for this page section…" />
              </div>

              {/* Structured data JSON editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">Structured Data (JSON)</label>
                  {hint && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      Expected keys: <code className="bg-gray-100 px-1 rounded">{hint}</code>
                    </span>
                  )}
                </div>
                <textarea
                  rows={18}
                  value={jsonText}
                  onChange={e => handleJsonChange(e.target.value)}
                  data-testid="textarea-structured-data"
                  spellCheck={false}
                  className={`${TEXTAREA} font-mono text-xs ${jsonError ? "border-red-400 focus:ring-red-300" : ""}`}
                />
                {jsonError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {jsonError}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  The website falls back to hardcoded defaults if any key is missing or removed. Save to publish changes immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setEditing(null)} data-testid="btn-cancel-page-edit"
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving || !!jsonError} data-testid="btn-save-page"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
