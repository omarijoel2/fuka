import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit, Trash2, FileText, Upload, ExternalLink } from "lucide-react";
import { apiFetch, apiUploadFile } from "@/lib/api";

interface JournalItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  summary: string | null;
  category: string | null;
  issue_label: string | null;
  cover_image: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size_kb: number | null;
  publication_date: string | null;
  status: string;
}

const STATUS_COLOR: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-600",
};

const EMPTY_FORM = {
  title: "",
  slug: "",
  description: "",
  category: "",
  issue_label: "",
  publication_date: new Date().toISOString().slice(0, 10),
  cover_image: "",
  file_url: "",
  file_name: "",
  file_type: "",
  file_size_kb: 0 as number,
  status: "draft" as string,
};

type FormState = typeof EMPTY_FORM;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT_CLS = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const SELECT_CLS = INPUT_CLS;

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function JournalCmsPage() {
  const [items, setItems]             = useState<JournalItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editingItem, setEditingItem] = useState<JournalItem | null>(null);
  const [form, setForm]               = useState<FormState>({ ...EMPTY_FORM });
  const [saving, setSaving]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JournalItem | null>(null);
  const [formError, setFormError]     = useState<string | null>(null);
  const [uploadingFile, setUploadingFile]   = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search)       params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      const data = await apiFetch(`/journal?${params.toString()}`);
      setItems(data?.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openCreate() {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM });
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(item: JournalItem) {
    setEditingItem(item);
    setForm({
      title:            item.title,
      slug:             item.slug,
      description:      item.description ?? "",
      category:         item.category ?? "",
      issue_label:      item.issue_label ?? "",
      publication_date: item.publication_date ?? new Date().toISOString().slice(0, 10),
      cover_image:      item.cover_image ?? "",
      file_url:         item.file_url ?? "",
      file_name:        item.file_name ?? "",
      file_type:        item.file_type ?? "",
      file_size_kb:     item.file_size_kb ?? 0,
      status:           item.status,
    });
    setFormError(null);
    setShowModal(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !editingItem) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleFileUpload(file: File) {
    setUploadingFile(true);
    setFormError(null);
    try {
      const res = await apiUploadFile("/journal/upload", file, "file") as {
        url: string; file_name?: string; file_type?: string; size_kb?: number;
      };
      setForm((prev) => ({
        ...prev,
        file_url:     res.url,
        file_name:    res.file_name ?? file.name,
        file_type:    res.file_type ?? "",
        file_size_kb: res.size_kb ?? 0,
      }));
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "File upload failed");
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    setFormError(null);
    try {
      const res = await apiUploadFile("/journal/upload-cover", file, "image") as { url: string };
      setForm((prev) => ({ ...prev, cover_image: res.url }));
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Cover upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.file_url) {
      setFormError("Please upload a PDF/document file.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        slug:             form.slug || slugify(form.title),
        title:            form.title,
        description:      form.description || null,
        category:         form.category || null,
        issue_label:      form.issue_label || null,
        publication_date: form.publication_date || null,
        cover_image:      form.cover_image || null,
        file_url:         form.file_url || null,
        file_name:        form.file_name || null,
        file_type:        form.file_type || null,
        file_size_kb:     form.file_size_kb || null,
        status:           form.status,
      };
      if (editingItem) {
        await apiFetch(`/journal/${editingItem.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/journal`, { method: "POST", body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchItems();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/journal/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchItems();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journal</h1>
            <p className="text-sm text-gray-500">{items.length} document{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button
          data-testid="btn-add-journal"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Journal Document
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              data-testid="input-journal-search"
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchItems()}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            data-testid="select-journal-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4" data-testid="journal-error">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm" data-testid="journal-empty">
          No journal documents yet. Click "Add Journal Document" to upload your first issue.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Issue / Volume</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">File</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 line-clamp-2 max-w-xs">{item.title}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{item.issue_label ?? "—"}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{item.category ?? "—"}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{formatDate(item.publication_date)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {item.file_url ? (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                          data-testid={`link-journal-file-${item.id}`}
                        >
                          {item.file_type || "FILE"} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[item.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          data-testid={`btn-edit-journal-${item.id}`}
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          data-testid={`btn-delete-journal-${item.id}`}
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? "Edit Journal Document" : "Add Journal Document"}
              </h2>
              <button
                data-testid="btn-close-journal-modal"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[72vh] overflow-y-auto">
              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              {/* File upload */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Document File</h3>
                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                  {form.file_url ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <a
                            href={form.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary hover:underline truncate block"
                            data-testid="link-journal-uploaded-file"
                          >
                            {form.file_name || "Uploaded file"}
                          </a>
                          <p className="text-xs text-gray-400">
                            {form.file_type}{form.file_size_kb ? ` · ${form.file_size_kb} KB` : ""}
                          </p>
                        </div>
                      </div>
                      <button
                        data-testid="btn-journal-remove-file"
                        onClick={() => setForm((p) => ({ ...p, file_url: "", file_name: "", file_type: "", file_size_kb: 0 }))}
                        className="text-xs text-red-600 hover:underline shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4 text-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {uploadingFile ? "Uploading..." : "Click to upload PDF or document"}
                      </span>
                      <span className="text-xs text-gray-400">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX up to 50 MB</span>
                      <input
                        data-testid="input-journal-file"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        className="hidden"
                        disabled={uploadingFile}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                      />
                    </label>
                  )}
                </div>
              </section>

              {/* Metadata */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</h3>
                <LabeledField label="Title *">
                  <input data-testid="input-journal-title" type="text" value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className={INPUT_CLS} placeholder="e.g. KAFU Journal of Sciences — Vol. 3" />
                </LabeledField>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Slug">
                    <input data-testid="input-journal-slug" type="text" value={form.slug}
                      onChange={(e) => setField("slug", e.target.value)} className={INPUT_CLS} />
                  </LabeledField>
                  <LabeledField label="Publication Date">
                    <input data-testid="input-journal-date" type="date" value={form.publication_date}
                      onChange={(e) => setField("publication_date", e.target.value)} className={INPUT_CLS} />
                  </LabeledField>
                </div>
                <LabeledField label="Description / Summary">
                  <textarea data-testid="input-journal-description" value={form.description} rows={3}
                    onChange={(e) => setField("description", e.target.value)}
                    className={INPUT_CLS} placeholder="Brief description of this issue (optional)" />
                </LabeledField>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Issue / Volume Label">
                    <input data-testid="input-journal-issue" type="text" value={form.issue_label}
                      onChange={(e) => setField("issue_label", e.target.value)}
                      className={INPUT_CLS} placeholder="e.g. Vol. 3, Issue 1" />
                  </LabeledField>
                  <LabeledField label="Category">
                    <input data-testid="input-journal-category" type="text" value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      className={INPUT_CLS} placeholder="e.g. Sciences" />
                  </LabeledField>
                </div>
              </section>

              {/* Cover image */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover Image (optional)</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                    {form.cover_image ? (
                      <img src={form.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer w-fit">
                      <Upload className="w-4 h-4" />
                      {uploadingCover ? "Uploading..." : "Upload cover"}
                      <input
                        data-testid="input-journal-cover"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingCover}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }}
                      />
                    </label>
                    {form.cover_image && (
                      <button
                        data-testid="btn-journal-remove-cover"
                        onClick={() => setForm((p) => ({ ...p, cover_image: "" }))}
                        className="text-xs text-red-600 hover:underline w-fit"
                      >
                        Remove cover
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Status */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</h3>
                <LabeledField label="Visibility">
                  <select data-testid="select-journal-status" value={form.status}
                    onChange={(e) => setField("status", e.target.value)} className={SELECT_CLS}>
                    <option value="draft">Draft (hidden)</option>
                    <option value="published">Published (public)</option>
                  </select>
                </LabeledField>
              </section>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                data-testid="btn-cancel-journal-modal"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="btn-save-journal"
                onClick={handleSave}
                disabled={saving || uploadingFile || uploadingCover}
                className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : (editingItem ? "Save Changes" : "Add Document")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Journal Document?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently delete <strong>{deleteTarget.title}</strong>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                data-testid="btn-cancel-journal-delete"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                data-testid="btn-confirm-journal-delete"
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
