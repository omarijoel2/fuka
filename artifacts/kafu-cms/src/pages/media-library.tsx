import React, { useEffect, useState, useRef } from "react";
import { apiGet } from "@/lib/api";
import { formatDateTime } from "@/lib/api";
import { Image as ImageIcon, Upload, Search, Copy, Trash2, RefreshCw, ExternalLink } from "lucide-react";

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: number | string | null;
  uploader?: { id: number; name: string } | null;
  created_at: string;
}

function formatBytes(bytes: number) {
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
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiGet("/media", { search: search || undefined, page, per_page: 24 });
      setFiles(data?.data ?? []);
      setMeta(data?.meta ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load media.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isImage = (type: string) => (type ?? "").startsWith("image/");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{meta?.total ?? 0} files</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          data-testid="btn-upload-media"
          onClick={() => alert("File upload requires a dedicated upload endpoint. Contact your ICT admin.")}
        >
          <Upload className="w-4 h-4" /> Upload File
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-media-search"
          />
        </div>
        <button
          onClick={() => { setPage(1); load(); }}
          disabled={loading}
          className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
          data-testid="btn-media-search"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex gap-6">
        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <ImageIcon className="w-12 h-12 opacity-30" />
              <p className="text-sm">No media files found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelected(file)}
                  className={`group relative rounded-lg border overflow-hidden bg-white transition hover:border-primary hover:shadow-md ${
                    selected?.id === file.id ? "border-primary ring-2 ring-primary/30" : "border-border"
                  }`}
                  data-testid={`media-file-${file.id}`}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {isImage(file.mime_type) ? (
                      <img
                        src={file.url}
                        alt={file.alt_text ?? file.original_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
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
                  <div className="p-2 text-left">
                    <p className="text-xs font-medium text-foreground truncate">{file.original_name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</p>
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
                <img src={selected.url} alt={selected.alt_text ?? ""} className="w-full rounded-lg aspect-video object-cover border border-border" />
              ) : (
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-10 h-10 opacity-30" />
                </div>
              )}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground text-sm break-all">{selected.original_name}</p>
                <p>Type: {selected.mime_type}</p>
                <p>Size: {formatBytes(selected.size)}</p>
                <p>Uploaded by: {
                  typeof selected.uploader === "object" && selected.uploader
                    ? selected.uploader.name
                    : `User #${selected.uploaded_by ?? "unknown"}`
                }</p>
                <p>Date: {formatDateTime(selected.created_at)}</p>
                {selected.alt_text && <p>Alt: {selected.alt_text}</p>}
                {selected.caption && <p>Caption: {selected.caption}</p>}
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
