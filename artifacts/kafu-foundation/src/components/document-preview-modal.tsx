import { useState } from "react";
import { X, Download, FileDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentPreviewModalProps {
  url: string;
  title: string;
  type: string;
  size?: string;
  onClose: () => void;
}

function getPreviewUrl(url: string, type: string): string | null {
  const ext = type.toLowerCase().replace(".", "");
  if (ext === "pdf") return url;
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return null;
}

export function DocumentPreviewModal({ url, title, type, size, onClose }: DocumentPreviewModalProps) {
  const [frameLoaded, setFrameLoaded] = useState(false);
  const previewUrl = getPreviewUrl(url, type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-testid="doc-preview-overlay"
    >
      <div className="bg-background rounded-xl shadow-2xl flex flex-col w-full max-w-5xl h-[90vh] overflow-hidden border">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b shrink-0">
          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {type.toUpperCase().slice(0, 4)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{title}</p>
            {size && <p className="text-xs text-muted-foreground">{size}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" className="gap-1.5" asChild data-testid="btn-modal-download">
              <a href={url} download target="_blank" rel="noreferrer">
                <FileDown className="w-3.5 h-3.5" />
                Download
              </a>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              data-testid="btn-modal-close"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 relative bg-muted/30 overflow-hidden">
          {previewUrl ? (
            <>
              {!frameLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Eye className="w-8 h-8 animate-pulse" />
                  <p className="text-sm">Loading preview...</p>
                </div>
              )}
              <iframe
                src={previewUrl}
                title={title}
                className="w-full h-full border-0"
                onLoad={() => setFrameLoaded(true)}
                data-testid="doc-preview-iframe"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground" data-testid="doc-preview-unavailable">
              <EyeOff className="w-10 h-10" />
              <p className="text-sm font-medium">Preview not available for this file type</p>
              <p className="text-xs">Download the file to view it on your device.</p>
              <Button className="mt-2 gap-2" asChild data-testid="btn-no-preview-download">
                <a href={url} download target="_blank" rel="noreferrer">
                  <Download className="w-4 h-4" />
                  Download {title}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
