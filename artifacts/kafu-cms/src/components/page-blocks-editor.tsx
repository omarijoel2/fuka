import React from "react";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Type, Heading, Image as ImageIcon,
  Video, Music, FileDown, Code,
} from "lucide-react";
import MediaUploadField from "@/components/media-upload-field";

const INPUT =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

export type PageBlockType =
  | "richtext" | "heading" | "image" | "video" | "audio" | "file" | "embed";

export interface PageBlock {
  id: string;
  type: PageBlockType;
  html?: string;
  text?: string;
  level?: number;
  url?: string;
  caption?: string;
  label?: string;
}

const BLOCK_META: Record<PageBlockType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  richtext: { label: "Text", icon: Type },
  heading: { label: "Heading", icon: Heading },
  image: { label: "Image", icon: ImageIcon },
  video: { label: "Video", icon: Video },
  audio: { label: "Audio", icon: Music },
  file: { label: "File download", icon: FileDown },
  embed: { label: "Embed", icon: Code },
};

const BLOCK_ORDER: PageBlockType[] = ["richtext", "heading", "image", "video", "audio", "file", "embed"];

function uid(): string {
  return "blk-" + Math.random().toString(36).slice(2, 10);
}

function newBlock(type: PageBlockType): PageBlock {
  const base: PageBlock = { id: uid(), type };
  if (type === "heading") return { ...base, text: "", level: 2 };
  if (type === "richtext") return { ...base, html: "" };
  return { ...base, url: "", caption: "", label: "" };
}

interface Props {
  value: PageBlock[];
  onChange: (next: PageBlock[]) => void;
}

export default function PageBlocksEditor({ value, onChange }: Props) {
  const blocks = Array.isArray(value) ? value : [];

  const update = (id: string, patch: Partial<PageBlock>) =>
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const remove = (id: string) => onChange(blocks.filter((b) => b.id !== id));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...blocks];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };
  const add = (type: PageBlockType) => onChange([...blocks, newBlock(type)]);

  return (
    <div className="space-y-3" data-testid="page-blocks-editor">
      {blocks.length === 0 && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3" data-testid="blocks-empty">
          No content blocks yet. Add text, images, video, audio, downloadable files or embeds below.
        </p>
      )}

      {blocks.map((block, idx) => {
        const Meta = BLOCK_META[block.type] ?? { label: `${block.type} (advanced — edit via JSON view)`, icon: Code };
        const Icon = Meta.icon;
        return (
          <div key={block.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50/40" data-testid={`block-${block.id}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                <Icon className="w-3.5 h-3.5" /> {Meta.label}
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                  data-testid={`block-up-${block.id}`}
                  className="text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors" aria-label="Move up">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === blocks.length - 1}
                  data-testid={`block-down-${block.id}`}
                  className="text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors" aria-label="Move down">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => remove(block.id)}
                  data-testid={`block-remove-${block.id}`}
                  className="text-gray-300 hover:text-red-500 transition-colors" aria-label="Remove block">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {block.type === "richtext" && (
              <textarea
                rows={5}
                value={block.html ?? ""}
                onChange={(e) => update(block.id, { html: e.target.value })}
                data-testid={`block-html-${block.id}`}
                className={`${INPUT} font-mono text-xs resize-y`}
                placeholder="<p>Write your content here. Basic HTML is supported.</p>"
              />
            )}

            {block.type === "heading" && (
              <div className="flex items-center gap-2">
                <select
                  value={block.level ?? 2}
                  onChange={(e) => update(block.id, { level: Number(e.target.value) })}
                  data-testid={`block-level-${block.id}`}
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm shrink-0"
                >
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                  <option value={4}>H4</option>
                </select>
                <input
                  value={block.text ?? ""}
                  onChange={(e) => update(block.id, { text: e.target.value })}
                  data-testid={`block-text-${block.id}`}
                  className={INPUT}
                  placeholder="Heading text"
                />
              </div>
            )}

            {block.type === "image" && (
              <div className="space-y-2">
                <MediaUploadField
                  value={block.url ?? ""}
                  onChange={(url) => update(block.id, { url })}
                  testid={`img-${block.id}`}
                  accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
                  placeholder="Image URL or upload…"
                />
                <input
                  value={block.caption ?? ""}
                  onChange={(e) => update(block.id, { caption: e.target.value })}
                  data-testid={`block-caption-${block.id}`}
                  className={INPUT}
                  placeholder="Caption (optional)"
                />
              </div>
            )}

            {block.type === "video" && (
              <div className="space-y-2">
                <MediaUploadField
                  value={block.url ?? ""}
                  onChange={(url) => update(block.id, { url })}
                  testid={`vid-${block.id}`}
                  accept=".mp4,.webm,.mov,.m4v"
                  placeholder="YouTube/Vimeo link or upload a video…"
                />
                <p className="text-[10px] text-gray-400">
                  Paste a YouTube or Vimeo link to embed, or upload a video file (mp4/webm).
                </p>
                <input
                  value={block.caption ?? ""}
                  onChange={(e) => update(block.id, { caption: e.target.value })}
                  data-testid={`block-caption-${block.id}`}
                  className={INPUT}
                  placeholder="Caption (optional)"
                />
              </div>
            )}

            {block.type === "audio" && (
              <div className="space-y-2">
                <MediaUploadField
                  value={block.url ?? ""}
                  onChange={(url) => update(block.id, { url })}
                  testid={`aud-${block.id}`}
                  accept=".mp3,.wav,.ogg,.m4a,.aac"
                  placeholder="Audio URL or upload…"
                />
                <input
                  value={block.caption ?? ""}
                  onChange={(e) => update(block.id, { caption: e.target.value })}
                  data-testid={`block-caption-${block.id}`}
                  className={INPUT}
                  placeholder="Caption (optional)"
                />
              </div>
            )}

            {block.type === "file" && (
              <div className="space-y-2">
                <MediaUploadField
                  value={block.url ?? ""}
                  onChange={(url) => update(block.id, { url })}
                  testid={`file-${block.id}`}
                  placeholder="Document URL or upload…"
                />
                <input
                  value={block.label ?? ""}
                  onChange={(e) => update(block.id, { label: e.target.value })}
                  data-testid={`block-label-${block.id}`}
                  className={INPUT}
                  placeholder="Download label (e.g. Annual Report 2025)"
                />
              </div>
            )}

            {block.type === "embed" && (
              <input
                value={block.url ?? ""}
                onChange={(e) => update(block.id, { url: e.target.value })}
                data-testid={`block-embed-${block.id}`}
                className={INPUT}
                placeholder="Embed URL (YouTube, Vimeo, Google Maps, etc.)"
              />
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {BLOCK_ORDER.map((type) => {
          const Meta = BLOCK_META[type];
          const Icon = Meta.icon;
          return (
            <button
              key={type}
              type="button"
              onClick={() => add(type)}
              data-testid={`btn-add-block-${type}`}
              className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-2.5 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-3 h-3" /> <Icon className="w-3.5 h-3.5" /> {Meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
