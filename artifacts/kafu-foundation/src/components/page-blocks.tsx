import DOMPurify from "dompurify";
import { FileDown } from "lucide-react";

export interface PageBlock {
  id?: string;
  type: "richtext" | "heading" | "image" | "video" | "audio" | "file" | "embed";
  html?: string;
  text?: string;
  level?: number;
  url?: string;
  caption?: string;
  label?: string;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com") return url;
    return null;
  } catch {
    return null;
  }
}

function isFileVideo(url: string): boolean {
  const ext = (url.split("?")[0].split(".").pop() ?? "").toLowerCase();
  return ["mp4", "webm", "mov", "m4v", "ogg"].includes(ext);
}

function fileTypeLabel(url: string): string {
  const ext = (url.split("?")[0].split(".").pop() ?? "").toUpperCase();
  return ext || "FILE";
}

function Frame({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-gray-200" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

function BlockView({ block, index }: { block: PageBlock; index: number }) {
  switch (block.type) {
    case "richtext":
      return block.html && block.html.trim() ? (
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary"
          data-testid={`block-richtext-${index}`}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.html) }}
        />
      ) : null;

    case "heading": {
      const lvl = block.level === 4 ? "h4" : block.level === 3 ? "h3" : "h2";
      const Tag = lvl as "h2" | "h3" | "h4";
      const cls =
        lvl === "h2" ? "font-serif text-2xl font-bold text-primary"
          : lvl === "h3" ? "font-serif text-xl font-bold text-primary"
            : "font-serif text-lg font-semibold text-primary";
      return block.text ? <Tag className={cls} data-testid={`block-heading-${index}`}>{block.text}</Tag> : null;
    }

    case "image":
      return block.url ? (
        <figure data-testid={`block-image-${index}`}>
          <img src={block.url} alt={block.caption ?? ""} className="w-full rounded-xl border border-gray-200" loading="lazy" />
          {block.caption ? <figcaption className="mt-2 text-sm text-gray-500 text-center">{block.caption}</figcaption> : null}
        </figure>
      ) : null;

    case "video": {
      if (!block.url) return null;
      const embed = toEmbedUrl(block.url);
      return (
        <figure data-testid={`block-video-${index}`}>
          {embed ? (
            <Frame src={embed} title={block.caption ?? "Embedded video"} />
          ) : isFileVideo(block.url) ? (
            <video src={block.url} controls className="w-full rounded-xl border border-gray-200" />
          ) : (
            <Frame src={block.url} title={block.caption ?? "Embedded video"} />
          )}
          {block.caption ? <figcaption className="mt-2 text-sm text-gray-500 text-center">{block.caption}</figcaption> : null}
        </figure>
      );
    }

    case "audio":
      return block.url ? (
        <figure data-testid={`block-audio-${index}`}>
          <audio src={block.url} controls className="w-full" />
          {block.caption ? <figcaption className="mt-2 text-sm text-gray-500">{block.caption}</figcaption> : null}
        </figure>
      ) : null;

    case "file":
      return block.url ? (
        <a
          href={block.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`block-file-${index}`}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <FileDown className="h-5 w-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-medium text-gray-900 truncate">{block.label || "Download document"}</span>
            <span className="block text-xs text-gray-500">{fileTypeLabel(block.url)}</span>
          </span>
          <span className="text-xs font-semibold text-primary group-hover:underline shrink-0">Download</span>
        </a>
      ) : null;

    case "embed": {
      if (!block.url || !/^https:\/\//i.test(block.url)) return null;
      const embed = toEmbedUrl(block.url) ?? block.url;
      return <div data-testid={`block-embed-${index}`}><Frame src={embed} title="Embedded content" /></div>;
    }

    default:
      return null;
  }
}

export default function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  const list = Array.isArray(blocks) ? blocks.filter((b) => b && b.type) : [];
  if (list.length === 0) return null;
  return (
    <div className="space-y-8" data-testid="page-blocks">
      {list.map((block, i) => (
        <BlockView key={block.id ?? i} block={block} index={i} />
      ))}
    </div>
  );
}
