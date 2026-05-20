import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, Camera, Play, ArrowLeft } from "lucide-react";

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
  items?: GalleryItem[];
}

const CATEGORIES = ["graduation", "events", "campus", "sports", "research", "international", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  graduation: "Graduation", events: "Events", campus: "Campus Life",
  sports: "Sports", research: "Research", international: "International", other: "Other",
};

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

// ─── Album Modal ──────────────────────────────────────────────────────────────
const BLANK_ALBUM: Partial<GalleryAlbum> = {
  title: "", slug: "", description: "", category: "events",
  cover_image_url: "", album_date: "", is_published: true, sort_order: 0,
};

function AlbumModal({ album, onClose, onSaved }: { album: Partial<GalleryAlbum> | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !album?.id;
  const [form, setForm] = useState({ ...BLANK_ALBUM, ...(album ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900">{isNew ? "New Album" : "Edit Album"}</h2>
          <button onClick={onClose} data-testid="album-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <FormField label="Album Title" required>
            <input value={form.title ?? ""} onChange={e => { set("title", e.target.value); if (isNew) set("slug", autoSlug(e.target.value)); }}
              className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="album-title" />
          </FormField>
          <FormField label="Slug" required>
            <input value={form.slug ?? ""} onChange={e => set("slug", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono" data-testid="album-slug" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category" required>
              <select value={form.category ?? "events"} onChange={e => set("category", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="album-category">
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </FormField>
            <FormField label="Album Date">
              <input type="date" value={form.album_date ?? ""} onChange={e => set("album_date", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="album-date" />
            </FormField>
          </div>
          <FormField label="Cover Image URL">
            <input value={form.cover_image_url ?? ""} onChange={e => set("cover_image_url", e.target.value)}
              placeholder="https://..." className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="album-cover" />
          </FormField>
          <FormField label="Description">
            <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)}
              rows={3} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" data-testid="album-description" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Sort Order">
              <input type="number" value={form.sort_order ?? 0} onChange={e => set("sort_order", parseInt(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="album-sort" />
            </FormField>
            <FormField label="Published">
              <select value={form.is_published ? "1" : "0"} onChange={e => set("is_published", e.target.value === "1")}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="album-published">
                <option value="1">Published</option>
                <option value="0">Draft</option>
              </select>
            </FormField>
          </div>
          {form.cover_image_url && (
            <img src={form.cover_image_url} alt="Cover preview" className="w-full h-32 object-cover rounded-lg" />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50" data-testid="album-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-50" data-testid="album-save">
              {saving ? "Saving..." : isNew ? "Create Album" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Item Modal ───────────────────────────────────────────────────────────────
const BLANK_ITEM: Partial<GalleryItem> = {
  title: "", caption: "", type: "image",
  media_url: "", thumbnail_url: "", youtube_id: "",
  sort_order: 0, is_published: true,
};

function ItemModal({ item, albumId, onClose, onSaved }: { item: Partial<GalleryItem> | null; albumId: number; onClose: () => void; onSaved: () => void }) {
  const isNew = !item?.id;
  const [form, setForm] = useState({ ...BLANK_ITEM, album_id: albumId, ...(item ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string | boolean | number) { setForm(f => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (form.type === "image" && !form.media_url) { setError("Image URL is required for image items."); setSaving(false); return; }
      if (form.type === "video" && !form.youtube_id) { setError("YouTube ID is required for video items."); setSaving(false); return; }
      const endpoint = isNew ? "/gallery/items" : `/gallery/items/${item!.id}`;
      await apiFetch(endpoint, { method: isNew ? "POST" : "PUT", body: JSON.stringify(form) });
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-base text-gray-900">{isNew ? "Add Item" : "Edit Item"}</h2>
          <button onClick={onClose} data-testid="item-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <FormField label="Type" required>
            <select value={form.type ?? "image"} onChange={e => set("type", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="item-type">
              <option value="image">Image</option>
              <option value="video">YouTube Video</option>
            </select>
          </FormField>
          {form.type === "image" ? (
            <FormField label="Image URL" required>
              <input value={form.media_url ?? ""} onChange={e => set("media_url", e.target.value)}
                placeholder="https://..." className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="item-media-url" />
            </FormField>
          ) : (
            <>
              <FormField label="YouTube Video ID" required>
                <input value={form.youtube_id ?? ""} onChange={e => set("youtube_id", e.target.value)}
                  placeholder="e.g. dQw4w9WgXcQ" className="w-full border rounded-lg px-3 py-2 text-sm font-mono" data-testid="item-youtube-id" />
              </FormField>
              <FormField label="Thumbnail URL (optional)">
                <input value={form.thumbnail_url ?? ""} onChange={e => set("thumbnail_url", e.target.value)}
                  placeholder="Leave blank to use YouTube default" className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="item-thumbnail" />
              </FormField>
            </>
          )}
          <FormField label="Title">
            <input value={form.title ?? ""} onChange={e => set("title", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="item-title" />
          </FormField>
          <FormField label="Caption">
            <textarea value={form.caption ?? ""} onChange={e => set("caption", e.target.value)}
              rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" data-testid="item-caption" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Sort Order">
              <input type="number" value={form.sort_order ?? 0} onChange={e => set("sort_order", parseInt(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="item-sort" />
            </FormField>
            <FormField label="Published">
              <select value={form.is_published ? "1" : "0"} onChange={e => set("is_published", e.target.value === "1")}
                className="w-full border rounded-lg px-3 py-2 text-sm" data-testid="item-published">
                <option value="1">Published</option>
                <option value="0">Hidden</option>
              </select>
            </FormField>
          </div>
          {form.type === "image" && form.media_url && (
            <img src={form.media_url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
          )}
          {form.type === "video" && form.youtube_id && (
            <img src={`https://img.youtube.com/vi/${form.youtube_id}/hqdefault.jpg`} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg" />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50" data-testid="item-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-50" data-testid="item-save">
              {saving ? "Saving..." : isNew ? "Add Item" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Album Row (expandable with items) ───────────────────────────────────────
function AlbumRow({ album, onEdit, onDelete, onRefresh }: {
  album: GalleryAlbum;
  onEdit: (a: GalleryAlbum) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemModal, setItemModal] = useState<Partial<GalleryItem> | null | undefined>(undefined);

  async function loadItems() {
    if (loadingItems) return;
    setLoadingItems(true);
    try {
      const res = await apiFetch(`/gallery/albums/${album.id}/items`);
      setItems((res as { data: GalleryItem[] }).data);
    } finally { setLoadingItems(false); }
  }

  function toggle() {
    if (!expanded) loadItems();
    setExpanded(e => !e);
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this item?")) return;
    await apiFetch(`/gallery/items/${id}`, { method: "DELETE" });
    loadItems();
  }

  function afterItemSaved() { setItemModal(undefined); loadItems(); }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3">
          <button onClick={toggle} className="text-gray-400 hover:text-gray-700" data-testid={`expand-album-${album.id}`}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
        <td className="px-4 py-3">
          {album.cover_image_url ? (
            <img src={album.cover_image_url} alt="" className="w-12 h-9 object-cover rounded" />
          ) : (
            <div className="w-12 h-9 bg-gray-100 rounded flex items-center justify-center">
              <Camera className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </td>
        <td className="px-4 py-3">
          <p className="font-medium text-gray-900 text-sm">{album.title}</p>
          <p className="text-xs text-gray-400 font-mono">{album.slug}</p>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{CATEGORY_LABELS[album.category] ?? album.category}</td>
        <td className="px-4 py-3 text-sm text-gray-500">{album.album_date ?? "—"}</td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${album.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
            {album.is_published ? "Published" : "Draft"}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button onClick={() => onEdit(album)} data-testid={`edit-album-${album.id}`}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(album.id)} data-testid={`delete-album-${album.id}`}
              className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="px-4 py-0">
            <div className="bg-gray-50 rounded-xl mx-2 mb-3 p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Items in "{album.title}"</p>
                <button
                  onClick={() => setItemModal({ album_id: album.id })}
                  data-testid={`add-item-${album.id}`}
                  className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f]"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {loadingItems ? (
                <p className="text-sm text-gray-400 py-2">Loading...</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-gray-400 py-2">No items yet. Add photos or videos to this album.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {items.map(item => (
                    <div key={item.id} className="relative group rounded-lg overflow-hidden bg-white border border-gray-200">
                      <div className="aspect-square bg-gray-100">
                        {item.type === "video" ? (
                          <div className="relative w-full h-full">
                            <img src={item.thumbnail_url || `https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`}
                              alt={item.title ?? ""} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white drop-shadow" />
                            </div>
                          </div>
                        ) : (
                          <img src={item.media_url ?? ""} alt={item.title ?? ""} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setItemModal(item)} data-testid={`edit-item-${item.id}`}
                          className="p-1 bg-white rounded shadow text-gray-600 hover:text-gray-900">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => deleteItem(item.id)} data-testid={`delete-item-${item.id}`}
                          className="p-1 bg-white rounded shadow text-gray-600 hover:text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {item.title && (
                        <p className="text-xs text-gray-600 px-1.5 py-1 truncate">{item.title}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
      {itemModal !== undefined && (
        <ItemModal
          item={itemModal}
          albumId={album.id}
          onClose={() => setItemModal(undefined)}
          onSaved={afterItemSaved}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GalleryCmsPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumModal, setAlbumModal] = useState<Partial<GalleryAlbum> | null | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState("all");

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
    load();
  }

  function afterSaved() { setAlbumModal(undefined); load(); }

  const filtered = categoryFilter === "all" ? albums : albums.filter(a => a.category === categoryFilter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">Manage photo and video albums for the public gallery.</p>
        </div>
        <button
          onClick={() => setAlbumModal({})}
          data-testid="new-album-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A5C38] text-white hover:bg-[#154d2f] text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Album
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[{ value: "all", label: "All" }, ...CATEGORIES.map(c => ({ value: c, label: CATEGORY_LABELS[c] }))].map(f => (
          <button
            key={f.value}
            onClick={() => setCategoryFilter(f.value)}
            data-testid={`filter-${f.value}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === f.value ? "bg-[#1A5C38] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Albums", value: albums.length },
          { label: "Published", value: albums.filter(a => a.is_published).length },
          { label: "Drafts", value: albums.filter(a => !a.is_published).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-[#1A5C38]">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading albums...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Camera className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No albums yet. Create your first gallery album.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-8" />
                <th className="px-4 py-3 text-left w-16">Cover</th>
                <th className="px-4 py-3 text-left">Title / Slug</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(album => (
                <AlbumRow
                  key={album.id}
                  album={album}
                  onEdit={a => setAlbumModal(a)}
                  onDelete={deleteAlbum}
                  onRefresh={load}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Album Modal */}
      {albumModal !== undefined && (
        <AlbumModal album={albumModal} onClose={() => setAlbumModal(undefined)} onSaved={afterSaved} />
      )}
    </div>
  );
}
