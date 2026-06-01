import { useRef, useState } from "react";
import { UploadCloud, X, Link } from "lucide-react";
import { apiUploadFile } from "@/lib/api";

interface PhotoUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  personName?: string;
  endpoint?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(w => /^[A-Z]/i.test(w))
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");
}

export default function PhotoUploadField({
  value,
  onChange,
  personName = "",
  endpoint = "/governance-photo",
}: PhotoUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = getInitials(personName || "?");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    setImgBroken(false);
    try {
      const result = await apiUploadFile(endpoint, file, "photo");
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
    setImgBroken(false);
    setError(null);
  };

  const hasPhoto = Boolean(value) && !imgBroken;

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
        Photo
      </label>

      <div className="flex items-start gap-4">
        {/* Preview thumbnail */}
        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-primary/5 border border-border flex items-center justify-center relative">
          {hasPhoto ? (
            <img
              src={value}
              alt={personName || "Profile photo"}
              className="w-full h-full object-cover object-top"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <span className="text-xl font-bold text-primary/30 font-serif select-none">
              {initials}
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="upload-photo-btn"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>

            <button
              type="button"
              data-testid="toggle-url-input-btn"
              onClick={() => setShowUrlInput(v => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Link className="w-3.5 h-3.5" />
              {showUrlInput ? "Hide URL" : "Use URL"}
            </button>

            {value && (
              <button
                type="button"
                data-testid="clear-photo-btn"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">JPG, PNG or WebP — max 5 MB</p>

          {error && (
            <p className="text-xs text-destructive" data-testid="upload-error">{error}</p>
          )}
        </div>
      </div>

      {/* Collapsible URL input */}
      {showUrlInput && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Or paste an image URL
          </label>
          <input
            data-testid="input-photo-url"
            type="url"
            value={value}
            onChange={e => { onChange(e.target.value); setImgBroken(false); }}
            placeholder="https://..."
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        data-testid="photo-file-input"
        onChange={handleFile}
      />
    </div>
  );
}
