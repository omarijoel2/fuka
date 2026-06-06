import React, { useState, useCallback, useRef } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Plus, Trash2, Save, ArrowLeft, ChevronUp, ChevronDown, Upload,
  Eye, Globe, FileText, Image as ImageIcon, Quote, Heading, AlignLeft,
  Loader2, CheckCircle, AlertCircle, X, ExternalLink, Images,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────────────────── */
type BlockType = "paragraph" | "heading" | "image" | "quote";

interface ArticleBlock {
  id: string;
  type: BlockType;
  content?: string;
  url?: string;
  caption?: string;
  level?: 2 | 3;
  attribution?: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: string;
  featured_image: string | null;
  tags: string[];
  featured: boolean;
  status: string;
  structured_data: { blocks?: ArticleBlock[]; gallery_album_slug?: string | null; gallery_album_id?: number | null };
  blocks: ArticleBlock[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ArticleMeta {
  title: string;
  slug: string;
  summary: string;
  category: string;
  featured_image: string;
  tags: string;
  featured: boolean;
}

/* ── Helpers ────────────────────────────────────────────────────────────────── */
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const API_BASE = API_ORIGIN.endsWith("/api")
  ? `${API_ORIGIN}/admin`
  : `${API_ORIGIN}/api/admin`;

function uid() { return Math.random().toString(36).slice(2, 10); }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const CATEGORIES = [
  "General", "Research & Innovation", "Academic", "Institutional",
  "Outreach", "Partnerships", "Leadership", "Events", "Community",
];

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
  paragraph: <AlignLeft className="w-3.5 h-3.5" />,
  heading:   <Heading    className="w-3.5 h-3.5" />,
  image:     <ImageIcon  className="w-3.5 h-3.5" />,
  quote:     <Quote      className="w-3.5 h-3.5" />,
};

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading:   "Heading",
  image:     "Image",
  quote:     "Quote",
};

function newBlock(type: BlockType): ArticleBlock {
  const block: ArticleBlock = { id: uid(), type };
  if (type === "heading") block.level = 2;
  if (type === "paragraph") block.content = "<p></p>";
  return block;
}

/* ── Status badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft:       "bg-muted text-muted-foreground",
    published:   "bg-green-100 text-green-800",
    archived:    "bg-orange-100 text-orange-800",
    submitted:   "bg-blue-100 text-blue-800",
    under_review:"bg-purple-100 text-purple-800",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

/* ── Block editor row ───────────────────────────────────────────────────────── */
function BlockRow({
  block,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
  onUploadImage,
}: {
  block: ArticleBlock;
  index: number;
  total: number;
  onUpdate: (id: string, changes: Partial<ArticleBlock>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onUploadImage: (id: string, file: File) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await onUploadImage(block.id, file); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  return (
    <div
      className="border rounded-xl bg-card overflow-hidden"
      data-testid={`block-row-${block.id}`}
    >
      {/* Block header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/40 border-b">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          {BLOCK_ICONS[block.type]} {BLOCK_LABELS[block.type]}
        </span>
        <span className="text-xs text-muted-foreground/50 ml-1">#{index + 1}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => onMove(block.id, -1)}
            disabled={index === 0}
            className="p-1 rounded hover:bg-secondary disabled:opacity-30"
            title="Move up"
            data-testid={`block-move-up-${block.id}`}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMove(block.id, 1)}
            disabled={index === total - 1}
            className="p-1 rounded hover:bg-secondary disabled:opacity-30"
            title="Move down"
            data-testid={`block-move-down-${block.id}`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(block.id)}
            className="p-1 rounded hover:bg-red-100 hover:text-red-600 text-muted-foreground"
            title="Delete block"
            data-testid={`block-delete-${block.id}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Block fields */}
      <div className="p-3 space-y-2">
        {block.type === "paragraph" && (
          <textarea
            className="w-full text-sm border rounded-lg p-2.5 min-h-[120px] font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
            value={block.content ?? ""}
            onChange={(e) => onUpdate(block.id, { content: e.target.value })}
            placeholder="<p>Enter paragraph HTML here...</p>"
            data-testid={`block-content-${block.id}`}
          />
        )}

        {block.type === "heading" && (
          <div className="flex gap-2">
            <select
              className="text-sm border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0"
              value={block.level ?? 2}
              onChange={(e) => onUpdate(block.id, { level: Number(e.target.value) as 2 | 3 })}
              data-testid={`block-level-${block.id}`}
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
            <input
              type="text"
              className="w-full text-sm border rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
              value={block.content ?? ""}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Section heading text"
              data-testid={`block-content-${block.id}`}
            />
          </div>
        )}

        {block.type === "image" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                className="w-full text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                value={block.url ?? ""}
                onChange={(e) => onUpdate(block.id, { url: e.target.value })}
                placeholder="https://... or /storage/..."
                data-testid={`block-url-${block.id}`}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border hover:bg-secondary shrink-0 disabled:opacity-50"
                data-testid={`block-upload-${block.id}`}
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            {block.url && (
              <img
                src={block.url}
                alt=""
                className="h-28 w-auto rounded-lg object-cover border"
              />
            )}
            <input
              type="text"
              className="w-full text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
              value={block.caption ?? ""}
              onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
              placeholder="Caption (optional)"
              data-testid={`block-caption-${block.id}`}
            />
          </div>
        )}

        {block.type === "quote" && (
          <div className="space-y-2">
            <textarea
              className="w-full text-sm border rounded-lg p-2.5 min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
              value={block.content ?? ""}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Quote text..."
              data-testid={`block-content-${block.id}`}
            />
            <input
              type="text"
              className="w-full text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
              value={block.attribution ?? ""}
              onChange={(e) => onUpdate(block.id, { attribution: e.target.value })}
              placeholder="Attribution — e.g. Prof. John Doe, Vice-Chancellor"
              data-testid={`block-attribution-${block.id}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Add block toolbar ──────────────────────────────────────────────────────── */
function AddBlockBar({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const types: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: "paragraph", label: "Paragraph", icon: <AlignLeft className="w-3.5 h-3.5" /> },
    { type: "heading",   label: "Heading",   icon: <Heading    className="w-3.5 h-3.5" /> },
    { type: "image",     label: "Image",     icon: <ImageIcon  className="w-3.5 h-3.5" /> },
    { type: "quote",     label: "Quote",     icon: <Quote      className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((t) => (
        <button
          key={t.type}
          onClick={() => onAdd(t.type)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
          data-testid={`add-block-${t.type}`}
        >
          <Plus className="w-3 h-3" /> {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────────── */
export default function ArticlesCmsPage() {
  const { user } = useAuth();

  /* list state */
  const [articles, setArticles]     = useState<Article[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError]   = useState("");

  /* editor state */
  const [view, setView]             = useState<"list" | "editor">("list");
  const [editId, setEditId]         = useState<number | null>(null);
  const [meta, setMeta]             = useState<ArticleMeta>({
    title: "", slug: "", summary: "", category: "General",
    featured_image: "", tags: "", featured: false,
  });
  const [blocks, setBlocks]         = useState<ArticleBlock[]>([]);
  const [saving, setSaving]         = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast]           = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [gallerySlug, setGallerySlug] = useState<string | null>(null);

  function showToast(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  /* ── Load list ─────────────────────────────────────────────────────────── */
  const loadArticles = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const res = await apiGet("/articles") as { data: Article[] };
      setArticles(res.data ?? []);
    } catch { setListError("Failed to load articles."); }
    finally { setListLoading(false); }
  }, []);

  React.useEffect(() => { loadArticles(); }, [loadArticles]);

  /* ── Open editor ───────────────────────────────────────────────────────── */
  async function openNew() {
    setEditId(null);
    setMeta({ title: "", slug: "", summary: "", category: "General", featured_image: "", tags: "", featured: false });
    setBlocks([newBlock("paragraph")]);
    setGallerySlug(null);
    setView("editor");
  }

  async function openEdit(a: Article) {
    setEditId(a.id);
    setMeta({
      title:          a.title,
      slug:           a.slug,
      summary:        a.summary ?? "",
      category:       a.category ?? "General",
      featured_image: a.featured_image ?? "",
      tags:           (a.tags ?? []).join(", "),
      featured:       a.featured ?? false,
    });
    setBlocks(a.blocks?.length ? a.blocks : [newBlock("paragraph")]);
    setGallerySlug(a.structured_data?.gallery_album_slug ?? null);
    setView("editor");
  }

  /* ── Block operations ──────────────────────────────────────────────────── */
  function addBlock(type: BlockType) {
    setBlocks((prev) => [...prev, newBlock(type)]);
  }

  function updateBlock(id: string, changes: Partial<ArticleBlock>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...changes } : b)));
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const arr = [...prev];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  /* ── Image upload for block ────────────────────────────────────────────── */
  async function uploadImage(blockId: string, file: File) {
    const token = localStorage.getItem("kafu_cms_token");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "articles");
    const res = await fetch(`${API_BASE}/content/upload-attachment`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: fd,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json() as { url?: string };
    if (data.url) updateBlock(blockId, { url: data.url });
  }

  /* ── Build payload ─────────────────────────────────────────────────────── */
  function buildPayload(status?: string) {
    const tags = meta.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return {
      title:            meta.title,
      slug:             meta.slug,
      summary:          meta.summary,
      category:         meta.category,
      featured_image:   meta.featured_image || undefined,
      tags,
      featured:         meta.featured,
      structured_data:  { blocks },
      ...(status ? { status } : {}),
    };
  }

  /* ── Save draft ────────────────────────────────────────────────────────── */
  async function saveDraft() {
    if (!meta.title.trim()) { showToast("err", "Title is required."); return; }
    if (!meta.slug.trim())  { showToast("err", "Slug is required.");  return; }
    setSaving(true);
    try {
      if (editId) {
        await apiPut(`/articles/${editId}`, buildPayload());
        showToast("ok", "Article saved.");
      } else {
        const res = await apiPost("/articles", buildPayload("draft")) as { data: Article };
        setEditId(res.data.id);
        showToast("ok", "Article created.");
        await loadArticles();
      }
    } catch (e: unknown) {
      showToast("err", (e as Error).message ?? "Save failed.");
    } finally { setSaving(false); }
  }

  /* ── Publish ───────────────────────────────────────────────────────────── */
  async function publishArticle() {
    if (!meta.title.trim()) { showToast("err", "Title is required."); return; }
    if (!meta.slug.trim())  { showToast("err", "Slug is required.");  return; }
    setPublishing(true);
    try {
      let id = editId;
      if (!id) {
        const res = await apiPost("/articles", buildPayload("draft")) as { data: Article };
        id = res.data.id;
        setEditId(id);
      } else {
        await apiPut(`/articles/${id}`, buildPayload());
      }
      const pub = await apiPost(`/articles/${id}/publish`, {}) as {
        success: boolean; gallery_album_slug?: string | null; message?: string;
      };
      setGallerySlug(pub.gallery_album_slug ?? null);
      showToast("ok", pub.message ?? "Article published.");
      await loadArticles();
    } catch (e: unknown) {
      showToast("err", (e as Error).message ?? "Publish failed.");
    } finally { setPublishing(false); }
  }

  /* ── Soft delete ───────────────────────────────────────────────────────── */
  async function deleteArticle(id: number) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    try {
      await apiDelete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch { showToast("err", "Delete failed."); }
  }

  /* ── Render: list view ──────────────────────────────────────────────────── */
  if (view === "list") {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Articles</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Feature stories and in-depth articles</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="btn-new-article"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
            toast.type === "ok" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {toast.type === "ok" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        {/* List */}
        {listLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {listError && (
          <div className="text-sm text-red-600 py-8 text-center">{listError}</div>
        )}
        {!listLoading && articles.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No articles yet. Create your first article.</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Status</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground line-clamp-1">{a.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.slug}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {a.category ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      {a.created_at ? formatDate(a.created_at) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(a)}
                          className="text-xs px-3 py-1.5 rounded-lg border hover:bg-secondary transition-colors"
                          data-testid={`btn-edit-article-${a.id}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteArticle(a.id)}
                          className="text-xs px-2 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-muted-foreground transition-colors"
                          data-testid={`btn-delete-article-${a.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  /* ── Render: editor view ────────────────────────────────────────────────── */
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => { setView("list"); loadArticles(); }}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          data-testid="btn-back-to-list"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-serif font-bold text-foreground">
            {editId ? "Edit Article" : "New Article"}
          </h1>
          {editId && <p className="text-xs text-muted-foreground">ID: {editId}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveDraft}
            disabled={saving || publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
            data-testid="btn-save-draft"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Draft
          </button>
          <button
            onClick={publishArticle}
            disabled={saving || publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            data-testid="btn-publish-article"
          >
            {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
            Publish
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
          toast.type === "ok" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "ok" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Gallery album link (after publish) */}
      {gallerySlug && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50">
          <Images className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-800 flex-1">
            Gallery album created from image blocks.
          </p>
          <a
            href={`/gallery/${gallerySlug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-green-700 underline flex items-center gap-1"
            data-testid="link-gallery-album"
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* ── Meta fields ──────────────────────────────────────────────────── */}
      <div className="border rounded-xl bg-card p-5 space-y-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Article Details</h2>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1" htmlFor="art-title">
            Title *
          </label>
          <input
            id="art-title"
            type="text"
            className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
            value={meta.title}
            onChange={(e) => {
              const title = e.target.value;
              setMeta((prev) => ({
                ...prev,
                title,
                slug: prev.slug || slugify(title),
              }));
            }}
            placeholder="Article headline"
            data-testid="art-title"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1" htmlFor="art-slug">
            Slug *
          </label>
          <input
            id="art-slug"
            type="text"
            className="w-full text-sm border rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
            value={meta.slug}
            onChange={(e) => setMeta((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
            placeholder="url-friendly-slug"
            data-testid="art-slug"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1" htmlFor="art-summary">
            Excerpt / Summary
          </label>
          <textarea
            id="art-summary"
            className="w-full text-sm border rounded-lg px-3 py-2 min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
            value={meta.summary}
            onChange={(e) => setMeta((prev) => ({ ...prev, summary: e.target.value }))}
            placeholder="Brief description shown on news cards and in metadata"
            data-testid="art-summary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1" htmlFor="art-category">
              Category
            </label>
            <select
              id="art-category"
              className="w-full text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={meta.category}
              onChange={(e) => setMeta((prev) => ({ ...prev, category: e.target.value }))}
              data-testid="art-category"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              id="art-featured"
              type="checkbox"
              className="w-4 h-4 accent-primary"
              checked={meta.featured}
              onChange={(e) => setMeta((prev) => ({ ...prev, featured: e.target.checked }))}
              data-testid="art-featured"
            />
            <label htmlFor="art-featured" className="text-sm text-foreground cursor-pointer">
              Featured article
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1" htmlFor="art-featured-image">
            Featured Image URL
          </label>
          <input
            id="art-featured-image"
            type="url"
            className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
            value={meta.featured_image}
            onChange={(e) => setMeta((prev) => ({ ...prev, featured_image: e.target.value }))}
            placeholder="https://... or /storage/..."
            data-testid="art-featured-image"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1" htmlFor="art-tags">
            Tags <span className="font-normal">(comma separated)</span>
          </label>
          <input
            id="art-tags"
            type="text"
            className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
            value={meta.tags}
            onChange={(e) => setMeta((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="research, innovation, 2026"
            data-testid="art-tags"
          />
        </div>
      </div>

      {/* ── Block editor ─────────────────────────────────────────────────── */}
      <div className="border rounded-xl bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Article Body
          </h2>
          <span className="text-xs text-muted-foreground">{blocks.length} block{blocks.length !== 1 ? "s" : ""}</span>
        </div>

        {blocks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No blocks yet. Add your first block below.</p>
          </div>
        )}

        <div className="space-y-3">
          {blocks.map((block, i) => (
            <BlockRow
              key={block.id}
              block={block}
              index={i}
              total={blocks.length}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onMove={moveBlock}
              onUploadImage={uploadImage}
            />
          ))}
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Add block:</p>
          <AddBlockBar onAdd={addBlock} />
        </div>
      </div>

      {/* Preview hint */}
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Eye className="w-3.5 h-3.5" />
        <span>
          Publish the article to see it live at{" "}
          <span className="font-mono">/articles/{meta.slug || "[slug]"}</span>.
          Image blocks will auto-create a gallery album.
        </span>
      </div>
    </div>
  );
}
