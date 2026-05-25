import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search, Upload, X, Check, RefreshCw, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const TOKEN_KEY = "kafu_cms_token";

const FOLDERS = ["all", "news", "campus", "marketing", "logos", "general"] as const;
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
  created_at: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
  title?: string;
}

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PhotoBrowserModal({ onSelect, onClose, title = "Select Photo" }: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [meta, setMeta] = useState<{ total: number; last_page: number; current_page: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<FolderType>("all");
  const [page, setPage] = useState(1);
  const [highlighted, setHighlighted] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const params = new URLSearchParams({
        page: String(page),
        per_page: "24",
        type: "image",
        ...(search ? { search } : {}),
        ...(folder !== "all" ? { folder } : {}),
      });
      const res = await fetch(`/api/admin/media?${params}`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 401) { setError("Session expired — please log in again."); return; }
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setFiles(data?.data ?? []);
      setMeta(data ? { total: data.total ?? 0, last_page: data.last_page ?? 1, current_page: data.current_page ?? 1 } : null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load media.");
    } finally {
      setLoading(false);
    }
  }, [page, folder, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    searchInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleFolderChange = (f: FolderType) => {
    setFolder(f);
    setPage(1);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder !== "all" ? folder : "general");
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (res.status === 401) { setUploadError("Session expired."); return; }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Upload failed (${res.status})`);
      }
      await load();
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmSelect = () => {
    if (highlighted) onSelect(highlighted.url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-testid="photo-browser-overlay"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition"
            data-testid="btn-photo-browser-close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-border bg-muted/30 shrink-0 space-y-2">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search images..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
                  data-testid="input-photo-search"
                />
              </div>
              <button type="submit" className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition" data-testid="btn-photo-search">
                Search
              </button>
              {search && (
                <button type="button" onClick={() => { setSearch(""); setPage(1); }} className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition" data-testid="btn-clear-photo-search">
                  Clear
                </button>
              )}
            </form>

            {/* Upload */}
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} data-testid="input-photo-upload-new" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition disabled:opacity-60"
                data-testid="btn-upload-new-photo"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploading ? "Uploading..." : "Upload New"}
              </button>
              <button onClick={load} className="p-1.5 rounded-lg border border-border hover:bg-muted transition" data-testid="btn-refresh-photos" title="Refresh">
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Folder tabs */}
          <div className="flex gap-1 flex-wrap">
            {FOLDERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFolderChange(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition capitalize ${
                  folder === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-white border border-border text-muted-foreground hover:bg-muted"
                }`}
                data-testid={`btn-folder-${f}`}
              >
                {f === "all" ? "All Images" : f}
              </button>
            ))}
          </div>
        </div>

        {uploadError && (
          <div className="mx-5 mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 shrink-0">{uploadError}</div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No images found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search or upload a new image above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {files.map((file) => {
                const isSelected = highlighted?.id === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => setHighlighted(isSelected ? null : file)}
                    onDoubleClick={() => { setHighlighted(file); onSelect(file.url); }}
                    className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-primary/40"
                    }`}
                    data-testid={`btn-select-photo-${file.id}`}
                    title={file.original_name}
                  >
                    <img
                      src={file.url}
                      alt={file.alt_text ?? file.original_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 transition ${isSelected ? "bg-primary/20" : "bg-transparent group-hover:bg-black/10"}`} />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected preview + footer */}
        <div className="border-t border-border px-5 py-3 bg-muted/20 shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {highlighted ? (
              <>
                <img src={highlighted.url} alt="" className="w-10 h-10 rounded-lg object-cover border border-border shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{highlighted.original_name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatBytes(highlighted.size)}{highlighted.folder && highlighted.folder !== "general" ? ` · ${highlighted.folder}` : ""}</p>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Click an image to select, double-click to insert immediately.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-3 shrink-0">
            {meta && meta.last_page > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 transition"
                  data-testid="btn-photo-prev-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-muted-foreground px-1">{page} / {meta.last_page}</span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={page >= meta.last_page}
                  className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 transition"
                  data-testid="btn-photo-next-page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition"
              data-testid="btn-photo-cancel"
            >
              Cancel
            </button>
            <button
              onClick={confirmSelect}
              disabled={!highlighted}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
              data-testid="btn-photo-confirm-select"
            >
              Use Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
