import React, { useRef, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon, Music, Video, Loader2 } from "lucide-react";
import { apiUploadAttachment, type UploadedAttachment } from "@/lib/api";

const INPUT =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const ACCEPT_ALL =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,.csv,.jpg,.jpeg,.png,.webp,.gif,.svg,.mp3,.wav,.ogg,.m4a,.aac,.mp4,.webm,.mov,.m4v";

function kindFromUrl(url: string): UploadedAttachment["kind"] {
  const ext = (url.split("?")[0].split(".").pop() ?? "").toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) return "image";
  if (["mp3", "wav", "ogg", "m4a", "aac"].includes(ext)) return "audio";
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";
  return "document";
}

function KindIcon({ kind }: { kind: UploadedAttachment["kind"] }) {
  const cls = "w-4 h-4 text-gray-400 shrink-0";
  if (kind === "image") return <ImageIcon className={cls} />;
  if (kind === "audio") return <Music className={cls} />;
  if (kind === "video") return <Video className={cls} />;
  return <FileText className={cls} />;
}

interface MediaUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  onUploaded?: (file: UploadedAttachment) => void;
  testid: string;
  accept?: string;
  placeholder?: string;
  onRemove?: () => void;
}

export default function MediaUploadField({
  value,
  onChange,
  onUploaded,
  testid,
  accept = ACCEPT_ALL,
  placeholder = "Paste a URL or upload a file…",
  onRemove,
}: MediaUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await apiUploadAttachment(file);
      onChange(result.url);
      onUploaded?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-2.5">
          {value ? <KindIcon kind={kindFromUrl(value)} /> : null}
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            data-testid={`media-url-${testid}`}
            className="flex-1 py-2 text-sm bg-transparent focus:outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              data-testid={`media-clear-${testid}`}
              className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
              aria-label="Clear file"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          data-testid={`media-upload-${testid}`}
          className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-3 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading" : "Upload"}
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            data-testid={`media-remove-${testid}`}
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0 px-1"
            aria-label="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        data-testid={`media-input-${testid}`}
        className="hidden"
      />
      {error && <p className="text-[11px] text-red-600" data-testid={`media-error-${testid}`}>{error}</p>}
      {value && kindFromUrl(value) === "image" && (
        <img src={value} alt="" className="mt-1 max-h-24 rounded-lg border border-gray-200 object-contain" />
      )}
    </div>
  );
}

export { ACCEPT_ALL };
