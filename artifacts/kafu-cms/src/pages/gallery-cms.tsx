import React, { useState, useEffect, useRef } from "react";
import { apiFetch, apiGet } from "@/lib/api";
import { PhotoBrowserModal } from "@/components/photo-browser-modal";
import {
  Plus, Pencil, Trash2, X, Camera, Play, ArrowLeft, Search,
  Loader2, Image as ImageIcon, CheckCircle2, Grid, List,
  Eye, EyeOff, CalendarDays, Tag, Film, SortAsc,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryItem {
  id: number;
  album_id: number;
  title: string | null;
  caption: string | null;
  type: "image" | "video";
  media_url: string | null;
  thumbnail_url: string | null;
  youtube_id: string | null;
  sort_order: number;
  is_published: boolean;
}

interface GalleryAlbum {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  album_date: string | null;
  is_published: boolean;
  sort_order: number;
  items_count?: number;
  items?: GalleryItem[];
}

interface MediaFile {
  id: number;
  original_name: string;
  mime_type: string;
  url: string;
  folder: string;
  alt_text: string | null;
}

const CATEGORIES = ["graduation", "events", "campus", "sports", "research", "international", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  graduation: "Graduation", events: "Events", campus: "Campus Life",
  sports: "Sports", research: "Research", international: "International", other: "Other",
};
const CATEGORY_COLORS: Record<string, string> = {
  graduation: "bg-purple-100 text-purple-700",
  events: "bg-blue-100 text-blue-700",
  campus: "bg-green-100 text-green-700",
  sports: "bg-orange-100 text-orange-700",
  research: "bg-teal-100 text-teal-700",
  international: "bg-indigo-100 text-indigo-700",
  other: "bg-gray-100 text-gray-600",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function cls(...parts: string[]) { return parts.filter(Boolean).join(" "); }

// ─── Media Picker Modal ───────────────────────────────────────────────────────
function MediaPickerModal({ onPick, onClose }: {
  onPick: (url: string) => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function load(p = 1, q = "") {
    setLoading(true);
    try {
      const data = await apiGet("/media", { page: p, per_page: 24, type: "image", search: q || undefined });
      setFiles(data?.data ?? []);
      setTotal(data?.total ?? 0);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(1, search);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h2 className="font-semibold text-base text-gray-900">Pick from Media Library</h2>
            <p className="text-xs text-gray-500 mt-0.5">{total} images available</p>
          </div>
          <button onClick={onClose} data-testid="picker-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="px-6 py-3 border-b shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search images…"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30"
                data-testid="picker-search"
              />
            </div>
            <button type="submit" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50" data-testid="picker-search-btn">Search</button>
            {search && <button type="button" onClick={() => { setSearch(""); setPage(1); load(1, ""); }} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><X className="w-4 h-4" /></button>}
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <ImageIcon className="w-10 h-10 opacity-30" />
              <p className="text-sm">No images found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {files.map(file => (
                <button key={file.id} onClick={() => onPick(file.url)}
                  data-testid={`picker-file-${file.id}`}
                  className="group relative rounded-xl overflow-hidden border-2 border-transparent hover:border-[#1A5C38] transition-all aspect-square bg-gray-100 focus:outline-none">
                  <img src={file.url} alt={file.alt_text ?? file.original_name}
                    className="w-full h-full object-cover" loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                  <p className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.original_name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t shrink-0 flex items-center justify-between">
          <p className="text-xs text-gray-500">Click any image to select it</p>
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50" data-testid="picker-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Album Form Modal ─────────────────────────────────────────────────────────
const BLANK_ALBUM: Partial<GalleryAlbum> = {
  title: "", slug: "", description: "", category: "events",
  cover_image_url: "", album_date: "", is_published: true, sort_order: 0,
};

function AlbumModal({ album, onClose, onSaved }: {
  album: Partial<GalleryAlbum> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !album?.id;
  const [form, setForm] = useState({ ...BLANK_ALBUM, ...(album ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  function set(k: string, v: string | boolean | number) { setForm(f => ({ ...f, [k]: v })); }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (!form.title) { setError("Title is required."); setSaving(false); return; }
      if (!form.slug) form.slug = autoSlug(form.title ?? "");
      const endpoint = isNew ? "/gallery/albums" : `/gallery/albums/${album!.id}`;
      await apiFetch(endpoint, { method: isNew ? "POST" : "PUT", body: JSON.stringify(form) });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-base text-gray-900">{isNew ? "New Album" : "Edit Album"}</h2>
            <button onClick={onClose} data-testid="album-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={save} className="p-6 space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            <FormField label="Album Title" required>
              <input value={form.title ?? ""} onChange={e => { set("title", e.target.value); if (isNew) set("slug", autoSlug(e.target.value)); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="album-title" />
            </FormField>
            <FormField label="Slug" required>
              <input value={form.slug ?? ""} onChange={e => set("slug", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="album-slug" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Category" required>
                <select value={form.category ?? "events"} onChange={e => set("category", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 bg-white" data-testid="album-category">
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </FormField>
              <FormField label="Album Date">
                <input type="date" value={form.album_date ?? ""} onChange={e => set("album_date", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="album-date" />
              </FormField>
            </div>
            <FormField label="Cover Image">
              <div className="flex gap-2">
                <input value={form.cover_image_url ?? ""} onChange={e => set("cover_image_url", e.target.value)}
                  placeholder="Paste URL or pick from library…"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="album-cover" />
                <button type="button" onClick={() => setShowPicker(true)} data-testid="album-cover-pick"
                  className="shrink-0 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> Pick
                </button>
              </div>
              {form.cover_image_url && (
                <img src={form.cover_image_url} alt="Cover preview" className="mt-2 w-full h-28 object-cover rounded-lg" />
              )}
            </FormField>
            <FormField label="Description">
              <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)}
                rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="album-description" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Sort Order">
                <input type="number" value={form.sort_order ?? 0} onChange={e => set("sort_order", parseInt(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="album-sort" />
              </FormField>
              <FormField label="Status">
                <select value={form.is_published ? "1" : "0"} onChange={e => set("is_published", e.target.value === "1")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 bg-white" data-testid="album-published">
                  <option value="1">Published</option>
                  <option value="0">Draft</option>
                </select>
              </FormField>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50" data-testid="album-cancel">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-50" data-testid="album-save">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving…" : isNew ? "Create Album" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showPicker && (
        <PhotoBrowserModal onClose={() => setShowPicker(false)} onSelect={url => { set("cover_image_url", url); setShowPicker(false); }} title="Select Cover Image" />
      )}
    </>
  );
}

// ─── Item Form Modal ──────────────────────────────────────────────────────────
const BLANK_ITEM: Partial<GalleryItem> = {
  title: "", caption: "", type: "image",
  media_url: "", thumbnail_url: "", youtube_id: "",
  sort_order: 0, is_published: true,
};

function ItemModal({ item, albumId, onClose, onSaved }: {
  item: Partial<GalleryItem> | null;
  albumId: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !item?.id;
  const [form, setForm] = useState({ ...BLANK_ITEM, album_id: albumId, ...(item ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  function set(k: string, v: string | boolean | number) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (form.type === "image" && !form.media_url) { setError("Image URL is required."); setSaving(false); return; }
      if (form.type === "video" && !form.youtube_id) { setError("YouTube ID is required."); setSaving(false); return; }
      const endpoint = isNew ? "/gallery/items" : `/gallery/items/${item!.id}`;
      await apiFetch(endpoint, { method: isNew ? "POST" : "PUT", body: JSON.stringify(form) });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-base text-gray-900">{isNew ? "Add Item" : "Edit Item"}</h2>
            <button onClick={onClose} data-testid="item-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={save} className="p-6 space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            <div className="flex gap-2">
              {(["image", "video"] as const).map(t => (
                <button key={t} type="button" onClick={() => set("type", t)} data-testid={`item-type-${t}`}
                  className={cls(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition",
                    form.type === t ? "border-[#1A5C38] bg-[#1A5C38]/5 text-[#1A5C38]" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}>
                  {t === "image" ? <ImageIcon className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                  {t === "image" ? "Image" : "YouTube Video"}
                </button>
              ))}
            </div>

            {form.type === "image" ? (
              <FormField label="Image" required>
                <div className="flex gap-2">
                  <input value={form.media_url ?? ""} onChange={e => set("media_url", e.target.value)}
                    placeholder="Paste URL or pick from library…"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="item-media-url" />
                  <button type="button" onClick={() => setShowPicker(true)} data-testid="item-pick-image"
                    className="shrink-0 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> Pick
                  </button>
                </div>
                {form.media_url && <img src={form.media_url} alt="Preview" className="mt-2 w-full h-28 object-cover rounded-lg" />}
              </FormField>
            ) : (
              <>
                <FormField label="YouTube Video ID" required>
                  <input value={form.youtube_id ?? ""} onChange={e => set("youtube_id", e.target.value)}
                    placeholder="e.g. dQw4w9WgXcQ"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="item-youtube-id" />
                </FormField>
                <FormField label="Thumbnail URL (optional)">
                  <input value={form.thumbnail_url ?? ""} onChange={e => set("thumbnail_url", e.target.value)}
                    placeholder="Leave blank to use YouTube default"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="item-thumbnail" />
                </FormField>
                {form.youtube_id && (
                  <img src={`https://img.youtube.com/vi/${form.youtube_id}/hqdefault.jpg`} alt="Thumbnail" className="w-full h-28 object-cover rounded-lg" />
                )}
              </>
            )}

            <FormField label="Title">
              <input value={form.title ?? ""} onChange={e => set("title", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="item-title" />
            </FormField>
            <FormField label="Caption">
              <textarea value={form.caption ?? ""} onChange={e => set("caption", e.target.value)}
                rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="item-caption" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Sort Order">
                <input type="number" value={form.sort_order ?? 0} onChange={e => set("sort_order", parseInt(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30" data-testid="item-sort" />
              </FormField>
              <FormField label="Visibility">
                <select value={form.is_published ? "1" : "0"} onChange={e => set("is_published", e.target.value === "1")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 bg-white" data-testid="item-published">
                  <option value="1">Visible</option>
                  <option value="0">Hidden</option>
                </select>
              </FormField>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50" data-testid="item-cancel">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-50" data-testid="item-save">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving…" : isNew ? "Add Item" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showPicker && (
        <PhotoBrowserModal onClose={() => setShowPicker(false)} onSelect={url => { set("media_url", url); setShowPicker(false); }} title="Select Image" />
      )}
    </>
  );
}

// ─── Album Detail View ────────────────────────────────────────────────────────
function AlbumDetailView({ album, onBack, onAlbumEdited }: {
  album: GalleryAlbum;
  onBack: () => void;
  onAlbumEdited: () => void;
}) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemModal, setItemModal] = useState<Partial<GalleryItem> | null | undefined>(undefined);
  const [editAlbum, setEditAlbum] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function loadItems() {
    setLoading(true);
    try {
      const res = await apiFetch(`/gallery/albums/${album.id}/items`);
      setItems((res as { data: GalleryItem[] }).data);
    } finally { setLoading(false); }
  }

  useEffect(() => { loadItems(); }, [album.id]);

  async function deleteItem(id: number) {
    if (!confirm("Delete this item?")) return;
    await apiFetch(`/gallery/items/${id}`, { method: "DELETE" });
    loadItems();
  }

  async function toggleItemVisibility(item: GalleryItem) {
    await apiFetch(`/gallery/items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...item, is_published: !item.is_published }),
    });
    loadItems();
  }

  const imgCount = items.filter(i => i.type === "image").length;
  const vidCount = items.filter(i => i.type === "video").length;
  const visibleCount = items.filter(i => i.is_published).length;

  return (
    <div>
      {/* Breadcrumb + actions */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} data-testid="back-to-albums"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft className="w-4 h-4" /> Albums
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-900">{album.title}</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
            <button onClick={() => setViewMode("grid")} data-testid="detail-view-grid"
              className={`p-2 ${viewMode === "grid" ? "bg-[#1A5C38] text-white" : "hover:bg-gray-50 text-gray-500"}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} data-testid="detail-view-list"
              className={`p-2 ${viewMode === "list" ? "bg-[#1A5C38] text-white" : "hover:bg-gray-50 text-gray-500"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setEditAlbum(true)} data-testid="edit-album-detail"
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Pencil className="w-4 h-4" /> Edit Album
          </button>
          <button onClick={() => setItemModal({})} data-testid="add-item-detail"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A5C38] text-white text-sm font-medium hover:bg-[#154d2f]">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Album header card */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 bg-white">
        <div className="flex gap-0">
          {album.cover_image_url ? (
            <div className="w-52 shrink-0">
              <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-52 shrink-0 bg-gray-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-300" />
            </div>
          )}
          <div className="flex-1 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{album.title}</h2>
                <p className="text-sm font-mono text-gray-400 mt-0.5">{album.slug}</p>
              </div>
              <span className={cls("px-2.5 py-1 rounded-full text-xs font-medium", album.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                {album.is_published ? "Published" : "Draft"}
              </span>
            </div>
            {album.description && <p className="text-sm text-gray-600 mb-3">{album.description}</p>}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className={cls("flex items-center gap-1 px-2 py-1 rounded-full", CATEGORY_COLORS[album.category] ?? "bg-gray-100 text-gray-600")}>
                <Tag className="w-3 h-3" /> {CATEGORY_LABELS[album.category] ?? album.category}
              </span>
              {album.album_date && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                  <CalendarDays className="w-3 h-3" /> {album.album_date}
                </span>
              )}
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                <ImageIcon className="w-3 h-3" /> {imgCount} {imgCount === 1 ? "photo" : "photos"}
              </span>
              {vidCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600">
                  <Film className="w-3 h-3" /> {vidCount} {vidCount === 1 ? "video" : "videos"}
                </span>
              )}
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                <Eye className="w-3 h-3" /> {visibleCount} visible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading items…</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          <Camera className="w-12 h-12 opacity-20" />
          <p className="text-sm">No items yet.</p>
          <button onClick={() => setItemModal({})} data-testid="add-first-item"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A5C38] text-white text-sm font-medium hover:bg-[#154d2f] mt-1">
            <Plus className="w-4 h-4" /> Add First Item
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map(item => (
            <div key={item.id}
              className={cls("relative group rounded-xl overflow-hidden border bg-white", item.is_published ? "border-gray-200" : "border-gray-200 opacity-60")}
              data-testid={`item-card-${item.id}`}>
              <div className="aspect-square bg-gray-100">
                {item.type === "video" ? (
                  <div className="relative w-full h-full">
                    <img src={item.thumbnail_url || `https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`}
                      alt={item.title ?? ""} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img src={item.media_url ?? ""} alt={item.title ?? ""} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
              </div>
              {/* Hover actions */}
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleItemVisibility(item)} data-testid={`toggle-item-${item.id}`}
                  className="p-1.5 bg-white/90 rounded-lg shadow text-gray-600 hover:text-gray-900" title={item.is_published ? "Hide" : "Show"}>
                  {item.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setItemModal(item)} data-testid={`edit-item-${item.id}`}
                  className="p-1.5 bg-white/90 rounded-lg shadow text-gray-600 hover:text-gray-900">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteItem(item.id)} data-testid={`delete-item-${item.id}`}
                  className="p-1.5 bg-white/90 rounded-lg shadow text-gray-600 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {!item.is_published && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-700/80 text-white rounded font-medium">Hidden</span>
                </div>
              )}
              {item.title && (
                <p className="text-xs text-gray-600 px-2 py-1.5 truncate border-t border-gray-100">{item.title}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-12">Preview</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Title / Caption</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 flex items-center gap-1"><SortAsc className="w-3 h-3" /> Order</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Visible</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors" data-testid={`item-list-row-${item.id}`}>
                  <td className="px-4 py-3">
                    <div className="w-12 h-9 rounded overflow-hidden bg-gray-100 relative">
                      {item.type === "video" ? (
                        <>
                          <img src={item.thumbnail_url || `https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={item.media_url ?? ""} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-xs">{item.title || <span className="text-gray-400 italic">Untitled</span>}</p>
                    {item.caption && <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{item.caption}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cls("inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium",
                      item.type === "video" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                      {item.type === "video" ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                      {item.type === "video" ? "Video" : "Image"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={cls("text-[10px] px-2 py-0.5 rounded-full font-medium",
                      item.is_published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500")}>
                      {item.is_published ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleItemVisibility(item)} data-testid={`list-toggle-item-${item.id}`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        {item.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setItemModal(item)} data-testid={`list-edit-item-${item.id}`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteItem(item.id)} data-testid={`list-delete-item-${item.id}`}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">
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

      {itemModal !== undefined && (
        <ItemModal item={itemModal} albumId={album.id} onClose={() => setItemModal(undefined)}
          onSaved={() => { setItemModal(undefined); loadItems(); }} />
      )}
      {editAlbum && (
        <AlbumModal album={album} onClose={() => setEditAlbum(false)} onSaved={() => { setEditAlbum(false); onAlbumEdited(); }} />
      )}
    </div>
  );
}

// ─── Album Grid (main list view) ──────────────────────────────────────────────
function AlbumGrid({ albums, onEdit, onDelete, onOpen }: {
  albums: GalleryAlbum[];
  onEdit: (a: GalleryAlbum) => void;
  onDelete: (id: number) => void;
  onOpen: (a: GalleryAlbum) => void;
}) {
  if (albums.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
      <Camera className="w-14 h-14 opacity-20" />
      <p className="text-sm">No albums yet. Create your first gallery album.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {albums.map(album => (
        <div key={album.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          data-testid={`album-card-${album.id}`}>
          {/* Cover image */}
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            {album.cover_image_url ? (
              <img src={album.cover_image_url} alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-300" />
              </div>
            )}
            {/* Overlay badges */}
            <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
              <span className={cls("text-[10px] px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm",
                album.is_published ? "bg-green-500/90 text-white" : "bg-gray-700/80 text-white")}>
                {album.is_published ? "Published" : "Draft"}
              </span>
            </div>
            {typeof album.items_count === "number" && (
              <div className="absolute top-2.5 right-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white font-medium backdrop-blur-sm">
                  {album.items_count} {album.items_count === 1 ? "item" : "items"}
                </span>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{album.title}</h3>
                <p className="text-[10px] font-mono text-gray-400 truncate">{album.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <span className={cls("text-[10px] px-2 py-0.5 rounded-full font-medium", CATEGORY_COLORS[album.category] ?? "bg-gray-100 text-gray-600")}>
                {CATEGORY_LABELS[album.category] ?? album.category}
              </span>
              {album.album_date && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> {album.album_date}
                </span>
              )}
            </div>
            {album.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{album.description}</p>
            )}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => onOpen(album)} data-testid={`manage-album-${album.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#1A5C38] text-white text-xs font-medium hover:bg-[#154d2f] transition">
                <Grid className="w-3.5 h-3.5" /> Manage Items
              </button>
              <button onClick={() => onEdit(album)} data-testid={`edit-album-${album.id}`}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(album.id)} data-testid={`delete-album-${album.id}`}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-600 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GalleryCmsPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumModal, setAlbumModal] = useState<Partial<GalleryAlbum> | null | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openAlbum, setOpenAlbum] = useState<GalleryAlbum | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/gallery/albums");
      setAlbums((res as { data: GalleryAlbum[] }).data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function deleteAlbum(id: number) {
    if (!confirm("Delete this album and all its items?")) return;
    await apiFetch(`/gallery/albums/${id}`, { method: "DELETE" });
    if (openAlbum?.id === id) setOpenAlbum(null);
    load();
  }

  function afterSaved() { setAlbumModal(undefined); load(); }

  const filtered = categoryFilter === "all" ? albums : albums.filter(a => a.category === categoryFilter);
  const publishedCount = albums.filter(a => a.is_published).length;
  const totalItems = albums.reduce((s, a) => s + (a.items_count ?? 0), 0);

  if (openAlbum) {
    return (
      <div>
        <AlbumDetailView
          album={openAlbum}
          onBack={() => setOpenAlbum(null)}
          onAlbumEdited={() => { load(); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage photo and video albums for the public gallery.</p>
        </div>
        <button onClick={() => setAlbumModal({})} data-testid="new-album-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A5C38] text-white hover:bg-[#154d2f] text-sm font-medium transition-colors shrink-0">
          <Plus className="w-4 h-4" /> New Album
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Albums", value: albums.length, sub: `${publishedCount} published` },
          { label: "Total Items", value: totalItems, sub: "across all albums" },
          { label: "Draft Albums", value: albums.length - publishedCount, sub: "not yet public" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-[#1A5C38]">{s.value}</div>
            <div className="text-xs font-semibold text-gray-700 mt-1">{s.label}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {[{ value: "all", label: "All Albums" }, ...CATEGORIES.map(c => ({ value: c, label: CATEGORY_LABELS[c] }))].map(f => (
          <button key={f.value} onClick={() => setCategoryFilter(f.value)} data-testid={`filter-${f.value}`}
            className={cls(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              categoryFilter === f.value
                ? "bg-[#1A5C38] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}>
            {f.label}
            {f.value !== "all" && (
              <span className="ml-1.5 opacity-70">{albums.filter(a => a.category === f.value).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Albums grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading albums…
        </div>
      ) : (
        <AlbumGrid
          albums={filtered}
          onEdit={a => setAlbumModal(a)}
          onDelete={deleteAlbum}
          onOpen={a => setOpenAlbum(a)}
        />
      )}

      {albumModal !== undefined && (
        <AlbumModal album={albumModal} onClose={() => setAlbumModal(undefined)} onSaved={afterSaved} />
      )}
    </div>
  );
}
