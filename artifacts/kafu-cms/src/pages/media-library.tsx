import React, { useEffect, useState, useRef } from "react";
import { apiGet } from "@/lib/api";
import { formatDateTime } from "@/lib/api";
import { Image as ImageIcon, Upload, Search, Copy, Trash2, RefreshCw, ExternalLink, X, Folder } from "lucide-react";

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

function formatBytes(bytes: number) {
  if (!bytes || bytes === 0) return "External";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        per_page: 24,
        search: search || undefined,
        folder: folder !== "all" ? folder : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      };
      const data = await apiGet("/media", params);
      setFiles(data?.data ?? []);
      setMeta(data ? {
        total: data.total ?? 0,
        last_page: data.last_page ?? 1,
        current_page: data.current_page ?? 1,
      } : null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load media.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, folder, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
      if (res.status === 401) { window.location.href = "/kafu-cms/login"; return; }
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

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.original_name}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(`/api/admin/media/${file.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Delete failed.");
      if (selected?.id === file.id) setSelected(null);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed.");
    }
  };

  const isImage = (type: string) => (type ?? "").startsWith("image/");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{meta?.total ?? 0} files</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition"
            data-testid="btn-refresh-media"
            onClick={load}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            data-testid="input-upload-file"
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
            onChange={handleUpload}
          />
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            data-testid="btn-upload-media"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          <X className="w-4 h-4 shrink-0" />
          {uploadError}
        </div>
      )}

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
              data-testid="input-media-search"
            />
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

        {/* Type filter */}
        <div className="flex gap-1">
          {(["all", "image", "document"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                typeFilter === t
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:border-primary"
              }`}
              data-testid={`btn-type-${t}`}
            >
              {t === "all" ? "All Types" : t === "image" ? "Images" : "Documents"}
            </button>
          ))}
        </div>
      </div>

      {/* Folder tabs */}
      <div className="flex gap-1 flex-wrap">
        {FOLDERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFolder(f); setPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
              folder === f
                ? "bg-primary/10 text-primary border border-primary/30"
                : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
            data-testid={`btn-folder-${f}`}
          >
            {f !== "all" && <Folder className="w-3 h-3" />}
            {f === "all" ? "All Folders" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3 border border-destructive/20">
          {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <ImageIcon className="w-12 h-12 opacity-30" />
              <p className="text-sm">No media files found.</p>
              <p className="text-xs opacity-70">
                {folder !== "all" ? `No files in the "${folder}" folder.` : "Upload a file to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelected(file)}
                  className={`group relative rounded-lg border overflow-hidden bg-white transition hover:border-primary hover:shadow-md text-left ${
                    selected?.id === file.id ? "border-primary ring-2 ring-primary/30" : "border-border"
                  }`}
                  data-testid={`media-file-${file.id}`}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {isImage(file.mime_type) ? (
                      <img
                        src={file.url}
                        alt={file.alt_text ?? file.original_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 p-3 text-muted-foreground">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span className="text-[10px] uppercase font-bold opacity-60">
                          {(file.mime_type ?? "").split("/")[1] ?? "file"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-foreground truncate">{file.original_name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</p>
                    {file.folder && (
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                        {file.folder}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.current_page <= 1}
                className="px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40" data-testid="btn-media-prev">
                Previous
              </button>
              <span className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page}</span>
              <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={meta.current_page >= meta.last_page}
                className="px-3 py-1.5 rounded border border-border text-xs hover:bg-muted disabled:opacity-40" data-testid="btn-media-next">
                Next
              </button>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-xl border border-border shadow-sm p-4 space-y-3 sticky top-0">
              {isImage(selected.mime_type) ? (
                <img
                  src={selected.url}
                  alt={selected.alt_text ?? ""}
                  className="w-full rounded-lg aspect-video object-cover border border-border"
                  onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                />
              ) : (
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-10 h-10 opacity-30" />
                </div>
              )}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground text-sm break-all">{selected.original_name}</p>
                <p>Type: {selected.mime_type}</p>
                <p>Size: {formatBytes(selected.size)}</p>
                <p>Folder: <span className="text-foreground font-medium">{selected.folder ?? "general"}</span></p>
                <p>Uploaded by: {
                  typeof selected.uploader === "object" && selected.uploader
                    ? selected.uploader.name
                    : `User #${selected.uploaded_by ?? "unknown"}`
                }</p>
                <p>Date: {formatDateTime(selected.created_at)}</p>
                {selected.alt_text && <p>Alt: {selected.alt_text}</p>}
                {selected.caption && <p className="border-t border-border pt-1.5">{selected.caption}</p>}
              </div>
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-[10px] text-muted-foreground font-mono break-all bg-muted rounded p-1.5">{selected.url}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(selected.url)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded border border-border text-xs font-medium hover:bg-muted transition"
                    data-testid="btn-copy-url"
                  >
                    <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy URL"}
                  </button>
                  <a href={selected.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 rounded border border-border hover:bg-muted transition" data-testid="btn-open-media">
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                  <button
                    onClick={() => handleDelete(selected)}
                    className="flex items-center justify-center w-8 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 transition"
                    title="Delete file"
                    data-testid="btn-delete-media"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
