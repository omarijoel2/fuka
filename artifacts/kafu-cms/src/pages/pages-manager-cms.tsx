import React, { useState, useEffect, useCallback } from "react";
import { apiGet, apiPut, apiPost, formatDate } from "@/lib/api";
import { Edit2, X, Save, AlertCircle, FileText, ChevronRight, RefreshCw, Plus } from "lucide-react";

interface NavPlacement {
  show_in_menu: boolean;
  parent: string;
  order: number;
}

interface PageRecord {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  body?: string | null;
  status: string;
  updated_at: string;
  structured_data: Record<string, unknown> | null;
  seo_meta: Record<string, unknown> | null;
}

const INPUT = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const TEXTAREA = INPUT + " resize-none";
const TOP_LEVEL = "__top__";

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

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readNav(sd: Record<string, unknown> | null): NavPlacement {
  const nav = (sd?._nav ?? {}) as Partial<NavPlacement>;
  return {
    show_in_menu: !!nav.show_in_menu,
    parent: typeof nav.parent === "string" ? nav.parent : "",
    order: typeof nav.order === "number" ? nav.order : 0,
  };
}

function isBuilderPage(page: PageRecord): boolean {
  if (page.structured_data && "_nav" in page.structured_data) return true;
  return !!(page.body && page.body.trim().length > 0);
}

export default function PagesManagerCmsPage() {
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageRecord | null>(null);
  const [mode, setMode] = useState<"structured" | "builder">("structured");
  const [creating, setCreating] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [nav, setNav] = useState<NavPlacement>({ show_in_menu: false, parent: "", order: 0 });
  const [navParents, setNavParents] = useState<string[]>([]);
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

  useEffect(() => {
    apiGet("/site-config/navigation")
      .then((cfg) => {
        const items = (cfg?.primary_nav ?? []) as Array<{ label?: string; type?: string; mega_groups?: unknown[] }>;
        const labels = items
          .filter((i) => i.type === "mega" || (Array.isArray(i.mega_groups) && i.mega_groups.length > 0))
          .map((i) => i.label)
          .filter((l): l is string => typeof l === "string" && l.length > 0);
        setNavParents(labels);
      })
      .catch(() => setNavParents([]));
  }, []);

  function openCreate() {
    setCreating(true);
    setMode("builder");
    setEditing({
      id: 0, slug: "", title: "", summary: "", body: "",
      status: "draft", updated_at: "", structured_data: {}, seo_meta: {},
    });
    setNav({ show_in_menu: false, parent: TOP_LEVEL, order: 0 });
    setJsonError("");
  }

  function openEdit(page: PageRecord) {
    setCreating(false);
    setEditing({ ...page });
    if (isBuilderPage(page)) {
      setMode("builder");
      setNav(readNav(page.structured_data));
    } else {
      setMode("structured");
      setJsonText(JSON.stringify(page.structured_data ?? {}, null, 2));
    }
    setJsonError("");
  }

  function closeModal() {
    setEditing(null);
    setCreating(false);
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

  function setSeo(key: string, value: string) {
    setEditing((p) => (p ? { ...p, seo_meta: { ...(p.seo_meta ?? {}), [key]: value } } : p));
  }

  async function saveStructured() {
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
      closeModal();
      load();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function saveBuilder() {
    if (!editing) return;
    const title = editing.title.trim();
    const slug = (editing.slug || slugify(title)).trim();
    if (!title) { showToast("error", "Page title is required."); return; }
    if (!slug) { showToast("error", "Page slug is required."); return; }
    if (!/^[a-z0-9-]+$/.test(slug)) { showToast("error", "Slug may only contain lowercase letters, numbers and dashes."); return; }

    const navObj: NavPlacement = {
      show_in_menu: !!nav.show_in_menu,
      parent: nav.parent ?? TOP_LEVEL,
      order: Number(nav.order) || 0,
    };
    const sd = { ...(editing.structured_data ?? {}), _nav: navObj };
    const payload = {
      title,
      slug,
      summary: editing.summary ?? "",
      body: editing.body ?? "",
      seo_meta: editing.seo_meta ?? {},
      structured_data: sd,
      status: "published",
    };

    setSaving(true);
    try {
      if (creating) {
        await apiPost("/content", { type: "page", ...payload });
        showToast("success", "Page created and published.");
      } else {
        await apiPut(`/content/${editing.id}`, payload);
        showToast("success", "Page saved and published.");
      }
      closeModal();
      load();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const hint = editing && mode === "structured" ? PAGE_HINTS[editing.slug] : null;
  const seo = (editing?.seo_meta ?? {}) as Record<string, string>;

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
            Build new pages or edit existing website pages. Changes publish immediately.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} data-testid="btn-refresh-pages"
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={openCreate} data-testid="btn-new-page"
            className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> New Page
          </button>
        </div>
      </div>

      {/* Guidance card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Two kinds of pages</p>
          <p><strong>New Page</strong> creates a standalone content page (title, body, SEO) that you can place in the navbar. Existing structural pages use a JSON <code>structured_data</code> editor — edit those with care.</p>
        </div>
      </div>

      {/* Pages list */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading pages…</div>
        ) : pages.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No pages found. Use New Page to create one.</div>
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
              {pages.map(page => {
                const navInfo = readNav(page.structured_data);
                return (
                  <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{page.title}</span>
                        {navInfo.show_in_menu && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary" data-testid={`badge-in-menu-${page.id}`}>
                            In menu
                          </span>
                        )}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit / Create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {creating ? "New Page" : editing.title}
                </h2>
                {!creating && (
                  <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">{editing.slug}</code>
                )}
              </div>
              <button onClick={closeModal} data-testid="btn-close-page-modal" className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Page Title</label>
                <input
                  value={editing.title}
                  onChange={e => {
                    const title = e.target.value;
                    setEditing(p => {
                      if (!p) return p;
                      const autoSlug = creating && (!p.slug || p.slug === slugify(p.title));
                      return { ...p, title, slug: autoSlug ? slugify(title) : p.slug };
                    });
                  }}
                  data-testid="input-page-title" className={INPUT} />
              </div>

              {mode === "builder" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug (URL)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">/p/</span>
                    <input
                      value={editing.slug}
                      onChange={e => setEditing(p => p ? { ...p, slug: slugify(e.target.value) } : p)}
                      data-testid="input-page-slug" className={INPUT}
                      placeholder="page-url-slug" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    This page will be reachable at <code className="bg-gray-100 px-1 rounded">/p/{editing.slug || "your-slug"}</code>
                  </p>
                </div>
              )}

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Summary / Intro Text</label>
                <textarea rows={2} value={editing.summary ?? ""} onChange={e => setEditing(p => p ? { ...p, summary: e.target.value } : p)}
                  data-testid="textarea-page-summary" className={TEXTAREA}
                  placeholder="Short descriptive text shown under the page title…" />
              </div>

              {mode === "builder" ? (
                <>
                  {/* Body */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Page Content (HTML)</label>
                    <textarea
                      rows={12}
                      value={editing.body ?? ""}
                      onChange={e => setEditing(p => p ? { ...p, body: e.target.value } : p)}
                      data-testid="textarea-page-body"
                      className={`${TEXTAREA} font-mono text-xs`}
                      placeholder="<h2>Section heading</h2>&#10;<p>Write the page content here. Basic HTML is supported.</p>" />
                    <p className="text-xs text-gray-400 mt-1">Basic HTML such as headings, paragraphs, lists and links is supported.</p>
                  </div>

                  {/* SEO */}
                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-600">SEO</p>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Meta Title</label>
                      <input value={seo.title ?? ""} onChange={e => setSeo("title", e.target.value)}
                        data-testid="input-seo-title" className={INPUT} placeholder="Defaults to the page title" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Meta Description</label>
                      <textarea rows={2} value={seo.description ?? ""} onChange={e => setSeo("description", e.target.value)}
                        data-testid="textarea-seo-description" className={TEXTAREA} placeholder="Short description for search engines" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Meta Keywords</label>
                      <input value={seo.keywords ?? ""} onChange={e => setSeo("keywords", e.target.value)}
                        data-testid="input-seo-keywords" className={INPUT} placeholder="comma, separated, keywords" />
                    </div>
                  </div>

                  {/* Navbar placement */}
                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-600">Navbar Placement</p>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={nav.show_in_menu}
                        onChange={e => setNav(n => ({ ...n, show_in_menu: e.target.checked }))}
                        data-testid="checkbox-show-in-menu" className="rounded border-gray-300 text-primary focus:ring-primary/30" />
                      Show this page in the navigation menu
                    </label>
                    {nav.show_in_menu && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">Parent Menu</label>
                          <select value={nav.parent} onChange={e => setNav(n => ({ ...n, parent: e.target.value }))}
                            data-testid="select-nav-parent" className={INPUT}>
                            <option value={TOP_LEVEL}>Top level (main bar)</option>
                            {navParents.map(label => (
                              <option key={label} value={label}>{label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">Order</label>
                          <input type="number" value={nav.order}
                            onChange={e => setNav(n => ({ ...n, order: Number(e.target.value) }))}
                            data-testid="input-nav-order" className={INPUT} />
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">
                      Pages placed under a parent menu appear in a "More" group within that dropdown. Lower order numbers appear first.
                    </p>
                  </div>
                </>
              ) : (
                /* Structured data JSON editor */
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
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={closeModal} data-testid="btn-cancel-page-edit"
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={mode === "builder" ? saveBuilder : saveStructured}
                disabled={saving || (mode === "structured" && !!jsonError)}
                data-testid="btn-save-page"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : creating ? "Create & Publish" : "Save & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
