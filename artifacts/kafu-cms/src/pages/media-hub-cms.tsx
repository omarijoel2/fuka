import React, { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete, STATUS_COLORS, STATUS_LABELS, formatDate } from "@/lib/api";
import {
  Plus, Search, X, Edit2, Trash2, Newspaper, BookOpen, Video,
  Download, Archive, ExternalLink, Save, ChevronDown,
} from "lucide-react";

type MediaType = "press_release" | "publication" | "video" | "download" | "archive";

interface ContentItem {
  id: number;
  title: string;
  slug: string;
  type: MediaType;
  status: string;
  category: string | null;
  summary: string | null;
  featured_image: string | null;
  published_at: string | null;
  updated_at: string;
  structured_data: Record<string, unknown> | null;
}

const TABS: { key: MediaType; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "press_release", label: "Press Releases",  icon: <Newspaper className="w-4 h-4" />, desc: "Official media statements and communications" },
  { key: "publication",   label: "Publications",    icon: <BookOpen className="w-4 h-4" />,  desc: "Journals, magazines, newsletters, reports" },
  { key: "video",         label: "Videos",          icon: <Video className="w-4 h-4" />,      desc: "YouTube-hosted videos and lectures" },
  { key: "download",      label: "Downloads",       icon: <Download className="w-4 h-4" />,   desc: "PDF forms, calendars, policy documents" },
  { key: "archive",       label: "Archives",        icon: <Archive className="w-4 h-4" />,    desc: "Historical notices, circulars, newsletters" },
];

const CATEGORY_MAP: Record<MediaType, string[]> = {
  press_release: ["Press Release", "Official Statement", "Media Advisory", "Appointment", "Award", "Partnership", "Academic", "Research"],
  publication:   ["Journal", "Magazine", "Newsletter", "Annual Report", "Research Report", "Book", "Policy Brief"],
  video:         ["Event", "Graduation", "Research", "Campus Life", "Lecture", "Interview", "Sports", "Other"],
  download:      ["Academic", "Administrative", "Admissions", "Finance", "HR & Staff", "Student Services", "Research", "Forms"],
  archive:       ["Newsletter", "Notice", "Leadership", "Circular", "Announcement", "Gazette"],
};

const BLANK_ITEM = (type: MediaType): Partial<ContentItem> => ({
  title: "", slug: "", type,
  status: "draft", category: CATEGORY_MAP[type][0],
  summary: "", featured_image: null, published_at: null,
  structured_data: {},
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function today() {
  return new Date().toISOString().split("T")[0];
}

const INPUT = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const TEXTAREA = INPUT + " resize-none";

export default function MediaHubCmsPage() {
  const [activeTab, setActiveTab] = useState<MediaType>("press_release");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<ContentItem>>({});
  const [sdText, setSdText] = useState("{}");
  const [sdError, setSdError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/content", { type: activeTab, per_page: 100, search: search || undefined, category: catFilter !== "All" ? catFilter : undefined });
      setItems(res?.data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, catFilter]);

  useEffect(() => { load(); setCatFilter("All"); setSearch(""); }, [activeTab]);
  useEffect(() => { const t = setTimeout(load, 350); return () => clearTimeout(t); }, [search, catFilter]);

  function openCreate() {
    const blank = BLANK_ITEM(activeTab);
    blank.published_at = today();
    setEditing(blank);
    setSdText("{}");
    setSdError("");
    setModalOpen(true);
  }

  function openEdit(item: ContentItem) {
    setEditing({ ...item });
    setSdText(JSON.stringify(item.structured_data ?? {}, null, 2));
    setSdError("");
    setModalOpen(true);
  }

  function setSdField(key: string, value: unknown) {
    try {
      const parsed = JSON.parse(sdText);
      parsed[key] = value;
      setSdText(JSON.stringify(parsed, null, 2));
      setSdError("");
    } catch {
      setSdError("Invalid JSON in structured data");
    }
  }

  function getSdField(key: string): string {
    try { return String((JSON.parse(sdText) as Record<string, unknown>)[key] ?? ""); } catch { return ""; }
  }

  async function save() {
    if (!editing.title?.trim()) { showToast("error", "Title is required."); return; }
    let parsedSd: Record<string, unknown> = {};
    try { parsedSd = JSON.parse(sdText); } catch { showToast("error", "Structured data is not valid JSON."); return; }
    setSaving(true);
    try {
      const payload = {
        ...editing,
        slug: editing.slug || slugify(editing.title ?? ""),
        structured_data: parsedSd,
        type: activeTab,
      };
      if (editing.id) {
        await apiPut(`/content/${editing.id}`, payload);
      } else {
        await apiPost("/content", payload);
      }
      showToast("success", editing.id ? "Saved." : "Created.");
      setModalOpen(false);
      load();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function publish(item: ContentItem) {
    try {
      await apiPost(`/content/${item.id}/transition`, { status: "published" });
      showToast("success", "Published.");
      load();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Failed to publish.");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await apiDelete(`/content/${deleteId}`);
      showToast("success", "Deleted.");
      setDeleteId(null);
      load();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Delete failed.");
    }
  }

  const filtered = items.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || item.category === catFilter;
    return matchSearch && matchCat;
  });

  const tab = TABS.find(t => t.key === activeTab)!;
  const cats = ["All", ...CATEGORY_MAP[activeTab]];

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Hub</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all university media content types</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-gray-200 pb-0">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} data-testid={`tab-${t.key}`}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
              activeTab === t.key ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab.label.toLowerCase()}…`}
            data-testid="input-media-search"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} data-testid="select-category-filter"
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white cursor-pointer">
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <button onClick={openCreate} data-testid="btn-new-item"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New {tab.label.slice(0, -1)}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No {tab.label.toLowerCase()} found.{" "}
            <button onClick={openCreate} className="text-primary hover:underline">Add one now.</button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                    {item.summary && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.summary}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.category ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(item.published_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] ?? item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status !== "published" && (
                        <button onClick={() => publish(item)} data-testid={`btn-publish-${item.id}`}
                          className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium">
                          Publish
                        </button>
                      )}
                      <button onClick={() => openEdit(item)} data-testid={`btn-edit-${item.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} data-testid={`btn-delete-${item.id}`}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">
                {editing.id ? "Edit" : "New"} {tab.label.slice(0, -1)}
              </h2>
              <button onClick={() => setModalOpen(false)} data-testid="btn-close-modal" className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value, slug: p.id ? p.slug : slugify(e.target.value) }))}
                  data-testid="input-item-title" className={INPUT} placeholder="Enter title…" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                  <select value={editing.category ?? CATEGORY_MAP[activeTab][0]} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                    data-testid="select-item-category" className={INPUT}>
                    {CATEGORY_MAP[activeTab].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
                  <select value={editing.status ?? "draft"} onChange={e => setEditing(p => ({ ...p, status: e.target.value }))}
                    data-testid="select-item-status" className={INPUT}>
                    {["draft", "published", "archived"].map(s => <option key={s} value={s}>{STATUS_LABELS[s as keyof typeof STATUS_LABELS] ?? s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Summary / Description</label>
                <textarea rows={3} value={editing.summary ?? ""} onChange={e => setEditing(p => ({ ...p, summary: e.target.value }))}
                  data-testid="textarea-item-summary" className={TEXTAREA} placeholder="Brief description…" />
              </div>

              {activeTab !== "download" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
                  <input type="date" value={editing.published_at?.split("T")[0] ?? today()} onChange={e => setEditing(p => ({ ...p, published_at: e.target.value }))}
                    data-testid="input-item-date" className={INPUT} />
                </div>
              )}

              {/* Type-specific structured data fields */}
              {activeTab === "press_release" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">PDF / Document URL</label>
                  <input type="url" value={getSdField("file_url")} onChange={e => setSdField("file_url", e.target.value)}
                    data-testid="input-file-url" className={INPUT} placeholder="https://…" />
                </div>
              )}

              {activeTab === "publication" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">File / Link URL</label>
                      <input type="url" value={getSdField("file_url")} onChange={e => setSdField("file_url", e.target.value)}
                        data-testid="input-file-url" className={INPUT} placeholder="https://…" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pages</label>
                      <input type="number" value={getSdField("pages")} onChange={e => setSdField("pages", e.target.value)}
                        data-testid="input-pages" className={INPUT} placeholder="e.g. 48" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Frequency</label>
                      <input value={getSdField("frequency")} onChange={e => setSdField("frequency", e.target.value)}
                        data-testid="input-frequency" className={INPUT} placeholder="e.g. Quarterly" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cover Image URL</label>
                      <input type="url" value={editing.featured_image ?? ""} onChange={e => setEditing(p => ({ ...p, featured_image: e.target.value }))}
                        data-testid="input-cover-url" className={INPUT} placeholder="https://…" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "video" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">YouTube ID</label>
                    <input value={getSdField("youtube_id")} onChange={e => setSdField("youtube_id", e.target.value)}
                      data-testid="input-youtube-id" className={INPUT} placeholder="e.g. dQw4w9WgXcQ" />
                    <p className="text-xs text-gray-400 mt-1">The part after <code>?v=</code> in the YouTube URL</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Duration</label>
                    <input value={getSdField("duration")} onChange={e => setSdField("duration", e.target.value)}
                      data-testid="input-duration" className={INPUT} placeholder="e.g. 12:34" />
                  </div>
                </div>
              )}

              {activeTab === "download" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">File URL <span className="text-red-500">*</span></label>
                      <input type="url" value={getSdField("file_url")} onChange={e => setSdField("file_url", e.target.value)}
                        data-testid="input-file-url" className={INPUT} placeholder="https://…" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">File Type</label>
                      <input value={getSdField("type")} onChange={e => setSdField("type", e.target.value)}
                        data-testid="input-file-type" className={INPUT} placeholder="PDF" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">File Size</label>
                      <input value={getSdField("size")} onChange={e => setSdField("size", e.target.value)}
                        data-testid="input-file-size" className={INPUT} placeholder="e.g. 2.4 MB" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Updated</label>
                      <input value={getSdField("updated")} onChange={e => setSdField("updated", e.target.value)}
                        data-testid="input-file-updated" className={INPUT} placeholder="e.g. Jan 2025" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "archive" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Archive Type / Document Type</label>
                  <input value={getSdField("archive_type") || (editing.category ?? "")} onChange={e => setSdField("archive_type", e.target.value)}
                    data-testid="input-archive-type" className={INPUT} placeholder="e.g. Notice, Circular, Newsletter" />
                </div>
              )}

              {sdError && <p className="text-xs text-red-500">{sdError}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setModalOpen(false)} data-testid="btn-cancel-modal"
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving} data-testid="btn-save-item"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete this item?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} data-testid="btn-cancel-delete"
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={confirmDelete} data-testid="btn-confirm-delete"
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* External link hint */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <ExternalLink className="w-3.5 h-3.5" />
        <span>Changes published here appear immediately on the public website.</span>
      </div>
    </div>
  );
}
