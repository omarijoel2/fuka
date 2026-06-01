import React, { useEffect, useState, useRef, useCallback } from "react";
import { apiGet, apiFetch, formatDateTime } from "@/lib/api";
import {
  Image as ImageIcon, Upload, Search, Copy, Trash2, RefreshCw, ExternalLink, X,
  Folder, Grid, List, CheckSquare, Square, ChevronLeft, ChevronRight,
  ZoomIn, Save, Loader2, AlertCircle, CheckCircle2, Clock, FileText,
} from "lucide-react";

const TOKEN_KEY = "kafu_cms_token";
const FOLDERS = ["all", "logos", "campus", "marketing", "news", "general"] as const;
type FolderType = typeof FOLDERS[number];

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  folder: string;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: number | string | null;
  uploader?: { id: number; name: string } | null;
  created_at: string;
}

type UploadStatus = "pending" | "uploading" | "done" | "error";
interface UploadQueueItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  result?: MediaFile;
}

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return "External";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mime: string) { return (mime ?? "").startsWith("image/"); }
function fileExt(mime: string) { return (mime ?? "").split("/")[1]?.toUpperCase() ?? "FILE"; }

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ files, index, onClose, onNav }: {
  files: MediaFile[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const file = files[index];
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNav(index - 1);
      if (e.key === "ArrowRight" && index < files.length - 1) onNav(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, files.length, onClose, onNav]);

  if (!file) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} data-testid="lightbox-close"
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
        <X className="w-5 h-5" />
      </button>
      {index > 0 && (
        <button onClick={e => { e.stopPropagation(); onNav(index - 1); }} data-testid="lightbox-prev"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {index < files.length - 1 && (
        <button onClick={e => { e.stopPropagation(); onNav(index + 1); }} data-testid="lightbox-next"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      <div onClick={e => e.stopPropagation()} className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-3 px-16">
        <img src={file.url} alt={file.alt_text ?? file.original_name}
          className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl" />
        <div className="text-center">
          <p className="text-white font-medium text-sm">{file.original_name}</p>
          {file.alt_text && <p className="text-white/60 text-xs mt-0.5">{file.alt_text}</p>}
          <p className="text-white/40 text-xs mt-0.5">{index + 1} of {files.length}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Queue Panel ───────────────────────────────────────────────────────
function UploadQueuePanel({ queue, onDismiss }: { queue: UploadQueueItem[]; onDismiss: (id: string) => void }) {
  if (queue.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 bg-muted border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">Upload Queue ({queue.length})</span>
        <span className="text-xs text-muted-foreground">
          {queue.filter(q => q.status === "done").length}/{queue.length} complete
        </span>
      </div>
      <div className="divide-y divide-border max-h-48 overflow-y-auto">
        {queue.map(item => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
            <div className="shrink-0">
              {item.status === "pending" && <Clock className="w-4 h-4 text-muted-foreground" />}
              {item.status === "uploading" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              {item.status === "done" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              {item.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{item.file.name}</p>
              <p className="text-[10px] text-muted-foreground">{formatBytes(item.file.size)}</p>
              {item.status === "uploading" && (
                <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
                </div>
              )}
              {item.status === "error" && <p className="text-[10px] text-destructive">{item.error}</p>}
            </div>
            {(item.status === "done" || item.status === "error") && (
              <button onClick={() => onDismiss(item.id)} data-testid={`dismiss-upload-${item.id}`}
                className="shrink-0 p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Detail / Edit Panel ──────────────────────────────────────────────────────
function DetailPanel({ file, onClose, onDeleted, onUpdated }: {
  file: MediaFile;
  onClose: () => void;
  onDeleted: (id: number) => void;
  onUpdated: (file: MediaFile) => void;
}) {
  const [altText, setAltText] = useState(file.alt_text ?? "");
  const [caption, setCaption] = useState(file.caption ?? "");
  const [folder, setFolder] = useState(file.folder ?? "general");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setAltText(file.alt_text ?? "");
    setCaption(file.caption ?? "");
    setFolder(file.folder ?? "general");
    setSaveMsg("");
  }, [file.id]);

  async function save() {
    setSaving(true); setSaveMsg("");
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(`/api/admin/media/${file.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ alt_text: altText, caption, folder }),
      });
      if (!res.ok) throw new Error("Save failed.");
      const json = await res.json();
      onUpdated(json.data);
      setSaveMsg("Saved");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (e: unknown) {
      setSaveMsg(e instanceof Error ? e.message : "Error");
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${file.original_name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(`/api/admin/media/${file.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error("Delete failed.");
      onDeleted(file.id);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed.");
      setDeleting(false);
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="w-72 shrink-0">
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden sticky top-0">
        {/* Preview */}
        <div className="relative">
          {isImage(file.mime_type) ? (
            <img src={file.url} alt={file.alt_text ?? ""} className="w-full aspect-video object-cover" />
          ) : (
            <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <FileText className="w-10 h-10 opacity-30" />
              <span className="text-xs font-bold opacity-50">{fileExt(file.mime_type)}</span>
            </div>
          )}
          <button onClick={onClose} data-testid="detail-close"
            className="absolute top-2 right-2 p-1 bg-black/40 hover:bg-black/60 rounded-full text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* File info */}
          <div>
            <p className="font-semibold text-sm text-foreground break-all leading-snug">{file.original_name}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              <span className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</span>
              <span className="text-[10px] text-muted-foreground">{file.mime_type}</span>
              <span className="text-[10px] text-muted-foreground">{formatDateTime(file.created_at)}</span>
            </div>
            {file.uploader && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Uploaded by {typeof file.uploader === "object" && file.uploader ? file.uploader.name : `User #${file.uploaded_by}`}
              </p>
            )}
          </div>

          {/* Editable metadata */}
          <div className="space-y-2.5 pt-1 border-t border-border">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Edit Metadata</p>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Alt Text</label>
              <input
                value={altText} onChange={e => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
                data-testid="detail-alt-text"
                className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Caption</label>
              <textarea
                value={caption} onChange={e => setCaption(e.target.value)}
                rows={2} placeholder="Optional caption"
                data-testid="detail-caption"
                className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Folder</label>
              <select value={folder} onChange={e => setFolder(e.target.value)} data-testid="detail-folder"
                className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white">
                {FOLDERS.filter(f => f !== "all").map(f => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>

            <button onClick={save} disabled={saving} data-testid="detail-save"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-60">
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              {saveMsg || "Save Metadata"}
            </button>
          </div>

          {/* URL + actions */}
          <div className="pt-1 border-t border-border space-y-2">
            <p className="text-[10px] font-mono text-muted-foreground bg-muted rounded px-2 py-1.5 break-all">{file.url}</p>
            <div className="flex gap-2">
              <button onClick={copyUrl} data-testid="btn-copy-url"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded border border-border text-xs font-medium hover:bg-muted transition">
                <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy URL"}
              </button>
              <a href={file.url} target="_blank" rel="noopener noreferrer" data-testid="btn-open-media"
                className="flex items-center justify-center w-8 rounded border border-border hover:bg-muted transition">
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
              <button onClick={handleDelete} disabled={deleting} data-testid="btn-delete-media"
                className="flex items-center justify-center w-8 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 transition disabled:opacity-60">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [meta, setMeta] = useState<{ total: number; last_page: number; current_page: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<FolderType>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "document">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Upload queue
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag state
  const [dragging, setDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Bulk select
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const imageFiles = files.filter(f => isImage(f.mime_type));

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params: Record<string, string | number | undefined> = {
        page, per_page: 24,
        search: search || undefined,
        folder: folder !== "all" ? folder : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      };
      const data = await apiGet("/media", params);
      setFiles(data?.data ?? []);
      setMeta(data ? { total: data.total ?? 0, last_page: data.last_page ?? 1, current_page: data.current_page ?? 1 } : null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load media.");
    } finally { setLoading(false); }
  }, [page, folder, typeFilter, search]);

  useEffect(() => { load(); }, [page, folder, typeFilter]);

  // Drag-and-drop handlers
  useEffect(() => {
    function onDragOver(e: DragEvent) { e.preventDefault(); setDragging(true); }
    function onDragLeave(e: DragEvent) { if (!dropRef.current?.contains(e.relatedTarget as Node)) setDragging(false); }
    function onDrop(e: DragEvent) {
      e.preventDefault(); setDragging(false);
      const droppedFiles = Array.from(e.dataTransfer?.files ?? []);
      if (droppedFiles.length > 0) enqueueFiles(droppedFiles);
    }
    const el = dropRef.current;
    el?.addEventListener("dragover", onDragOver);
    el?.addEventListener("dragleave", onDragLeave);
    el?.addEventListener("drop", onDrop);
    return () => { el?.removeEventListener("dragover", onDragOver); el?.removeEventListener("dragleave", onDragLeave); el?.removeEventListener("drop", onDrop); };
  }, [folder]);

  function enqueueFiles(filesToAdd: File[]) {
    const newItems: UploadQueueItem[] = filesToAdd.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      status: "pending",
      progress: 0,
    }));
    setQueue(q => [...q, ...newItems]);
    newItems.forEach(item => uploadFile(item));
  }

  async function uploadFile(item: UploadQueueItem) {
    setQueue(q => q.map(i => i.id === item.id ? { ...i, status: "uploading" } : i));
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("folder", folder !== "all" ? folder : "general");

      // Use XMLHttpRequest for progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/media");
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setQueue(q => q.map(i => i.id === item.id ? { ...i, progress: pct } : i));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 401) { window.location.href = "/kafu-cms/login"; reject(new Error("Unauthorized")); return; }
          if (xhr.status >= 400) {
            let msg = `Upload failed (${xhr.status})`;
            try { msg = JSON.parse(xhr.responseText)?.message ?? msg; } catch { /* ignore */ }
            reject(new Error(msg));
          } else {
            const result = JSON.parse(xhr.responseText)?.data;
            setQueue(q => q.map(i => i.id === item.id ? { ...i, status: "done", progress: 100, result } : i));
            resolve();
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
      load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setQueue(q => q.map(i => i.id === item.id ? { ...i, status: "error", error: msg } : i));
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length > 0) enqueueFiles(picked);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function dismissQueueItem(id: string) { setQueue(q => q.filter(i => i.id !== id)); }

  // Bulk select
  function toggleBulk(id: number) {
    setSelectedIds(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function selectAll() { setSelectedIds(new Set(files.map(f => f.id))); }
  function deselectAll() { setSelectedIds(new Set()); }

  async function bulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} file(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    const token = localStorage.getItem(TOKEN_KEY);
    await Promise.all(Array.from(selectedIds).map(id =>
      fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }).catch(() => null)
    ));
    setBulkDeleting(false);
    setSelectedIds(new Set());
    setBulkMode(false);
    if (selected && selectedIds.has(selected.id)) setSelected(null);
    load();
  }

  function openLightbox(file: MediaFile) {
    const idx = imageFiles.findIndex(f => f.id === file.id);
    if (idx !== -1) setLightboxIndex(idx);
  }

  function handleSearch(e: React.FormEvent) { e.preventDefault(); setPage(1); load(); }

  function handleFileUpdated(updated: MediaFile) {
    setFiles(fs => fs.map(f => f.id === updated.id ? updated : f));
    setSelected(updated);
  }

  function handleFileDeleted(id: number) {
    setFiles(fs => fs.filter(f => f.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const hasQueue = queue.length > 0;
  const activeUploads = queue.filter(q => q.status === "uploading").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta?.total ?? 0} files{activeUploads > 0 ? ` · uploading ${activeUploads}…` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {bulkMode ? (
            <>
              <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
              <button onClick={selectAll} data-testid="btn-select-all" className="text-sm text-primary hover:underline">Select all</button>
              <button onClick={deselectAll} data-testid="btn-deselect-all" className="text-sm text-muted-foreground hover:underline">None</button>
              <button onClick={bulkDelete} disabled={selectedIds.size === 0 || bulkDeleting} data-testid="btn-bulk-delete"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60">
                {bulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
              <button onClick={() => { setBulkMode(false); setSelectedIds(new Set()); }} data-testid="btn-cancel-bulk"
                className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
            </>
          ) : (
            <>
              <div className="flex items-center rounded-lg border border-border overflow-hidden">
                <button onClick={() => setViewMode("grid")} data-testid="btn-view-grid"
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")} data-testid="btn-view-list"
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => setBulkMode(true)} data-testid="btn-bulk-mode"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition">
                <CheckSquare className="w-4 h-4" /> Select
              </button>
              <button onClick={load} data-testid="btn-refresh-media"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition">
                <RefreshCw className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" data-testid="input-upload-file" multiple
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                onChange={handleFileInput} />
              <button onClick={() => fileInputRef.current?.click()} data-testid="btn-upload-media"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
                <Upload className="w-4 h-4" /> Upload Files
              </button>
            </>
          )}
        </div>
      </div>

      {/* Drag-and-drop zone */}
      <div ref={dropRef}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all cursor-pointer py-6 px-4
          ${dragging ? "border-primary bg-primary/5 scale-[1.005]" : "border-border bg-muted/40 hover:border-primary/50 hover:bg-muted/60"}`}
        onClick={() => fileInputRef.current?.click()}
        data-testid="drop-zone">
        <Upload className={`w-6 h-6 ${dragging ? "text-primary" : "text-muted-foreground"}`} />
        <p className={`text-sm font-medium ${dragging ? "text-primary" : "text-muted-foreground"}`}>
          {dragging ? "Drop files to upload" : "Drag and drop files here, or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground">Images, PDFs, Office documents · Multiple files supported</p>
      </div>

      {/* Upload queue */}
      {hasQueue && <UploadQueuePanel queue={queue} onDismiss={dismissQueueItem} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-52"
              data-testid="input-media-search" />
          </div>
          <button type="submit" className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition" data-testid="btn-media-search">
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(""); setPage(1); }} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition" data-testid="btn-clear-search">
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
        <div className="h-5 w-px bg-border" />
        <div className="flex gap-1">
          {(["all", "image", "document"] as const).map(t => (
            <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }} data-testid={`btn-type-${t}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${typeFilter === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground hover:border-primary"}`}>
              {t === "all" ? "All Types" : t === "image" ? "Images" : "Documents"}
            </button>
          ))}
        </div>
      </div>

      {/* Folder tabs */}
      <div className="flex gap-1 flex-wrap">
        {FOLDERS.map(f => (
          <button key={f} onClick={() => { setFolder(f); setPage(1); }} data-testid={`btn-folder-${f}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${folder === f ? "bg-primary/10 text-primary border border-primary/30" : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}>
            {f !== "all" && <Folder className="w-3 h-3" />}
            {f === "all" ? "All Folders" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3 border border-destructive/20">{error}</div>
      )}

      <div className="flex gap-5">
        {/* File grid / list */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <ImageIcon className="w-12 h-12 opacity-20" />
              <p className="text-sm">No files found.</p>
              <p className="text-xs opacity-60">{folder !== "all" ? `No files in "${folder}".` : "Upload files to get started."}</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {files.map(file => {
                const checked = selectedIds.has(file.id);
                return (
                  <div key={file.id}
                    onClick={() => bulkMode ? toggleBulk(file.id) : setSelected(selected?.id === file.id ? null : file)}
                    className={`group relative rounded-xl border overflow-hidden bg-white cursor-pointer transition hover:shadow-md
                      ${bulkMode && checked ? "border-primary ring-2 ring-primary/30" : selected?.id === file.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                    data-testid={`media-file-${file.id}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
                      {isImage(file.mime_type) ? (
                        <>
                          <img src={file.url} alt={file.alt_text ?? file.original_name}
                            className="w-full h-full object-cover" loading="lazy"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          {!bulkMode && (
                            <button onClick={e => { e.stopPropagation(); openLightbox(file); }}
                              data-testid={`lightbox-open-${file.id}`}
                              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 opacity-0 group-hover:opacity-100 transition-all">
                              <ZoomIn className="w-6 h-6 text-white drop-shadow-lg" />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-3 text-muted-foreground">
                          <FileText className="w-8 h-8 opacity-30" />
                          <span className="text-[10px] uppercase font-bold opacity-50">{fileExt(file.mime_type)}</span>
                        </div>
                      )}
                    </div>
                    {bulkMode && (
                      <div className="absolute top-2 left-2">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${checked ? "bg-primary border-primary" : "bg-white border-gray-300"}`}>
                          {checked && <CheckSquare className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground truncate">{file.original_name}</p>
                      <p className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</p>
                      {file.folder && (
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {file.folder}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List view */
            <div className="rounded-xl border border-border overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    {bulkMode && <th className="px-4 py-2.5 w-8"><button onClick={selectedIds.size === files.length ? deselectAll : selectAll} data-testid="btn-select-all-list"><CheckSquare className="w-4 h-4" /></button></th>}
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground w-12">Preview</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Folder</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Size</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Uploaded</th>
                    <th className="px-4 py-2.5 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {files.map(file => {
                    const checked = selectedIds.has(file.id);
                    return (
                      <tr key={file.id}
                        className={`hover:bg-muted/40 cursor-pointer transition ${selected?.id === file.id ? "bg-primary/5" : ""}`}
                        onClick={() => bulkMode ? toggleBulk(file.id) : setSelected(selected?.id === file.id ? null : file)}
                        data-testid={`media-list-row-${file.id}`}>
                        {bulkMode && (
                          <td className="px-4 py-2.5">
                            <div className={`w-4 h-4 rounded border-2 ${checked ? "bg-primary border-primary" : "border-gray-300"}`} />
                          </td>
                        )}
                        <td className="px-4 py-2.5">
                          {isImage(file.mime_type) ? (
                            <img src={file.url} alt="" className="w-10 h-8 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-8 bg-muted rounded flex items-center justify-center">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-foreground text-xs truncate max-w-[200px]">{file.original_name}</p>
                          {file.alt_text && <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{file.alt_text}</p>}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{file.folder ?? "general"}</span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatBytes(file.size)}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDateTime(file.created_at)}</td>
                        <td className="px-4 py-2.5">
                          {isImage(file.mime_type) && !bulkMode && (
                            <button onClick={e => { e.stopPropagation(); openLightbox(file); }}
                              data-testid={`list-lightbox-${file.id}`}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.current_page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40" data-testid="btn-media-prev">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page}</span>
              <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={meta.current_page >= meta.last_page}
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40" data-testid="btn-media-next">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Detail / edit panel */}
        {selected && !bulkMode && (
          <DetailPanel
            file={selected}
            onClose={() => setSelected(null)}
            onDeleted={handleFileDeleted}
            onUpdated={handleFileUpdated}
          />
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          files={imageFiles}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </div>
  );
}
