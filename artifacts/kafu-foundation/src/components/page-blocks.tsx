import DOMPurify from "dompurify";
import { FileDown, CalendarDays, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export interface PageBlockItem {
  title?: string;
  text?: string;
  label?: string;
  value?: string;
  date?: string;
  url?: string;
  items?: string[];
}

export interface PageBlock {
  id?: string;
  type:
    | "richtext" | "heading" | "image" | "video" | "audio" | "file" | "embed"
    | "stats" | "cards" | "timeline" | "tiers" | "cta" | "notice";
  html?: string;
  text?: string;
  level?: number;
  url?: string;
  caption?: string;
  label?: string;
  heading?: string;
  intro?: string;
  items?: PageBlockItem[];
  buttons?: { label: string; url: string }[];
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

    case "stats": {
      const items = block.items ?? [];
      if (items.length === 0) return null;
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid={`block-stats-${index}`}>
          {items.map((it, i) => (
            <div key={i} className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-5 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-primary/70 mb-1">{it.label}</div>
              <div className="font-serif font-bold text-primary text-sm md:text-base leading-snug">{it.value}</div>
            </div>
          ))}
        </div>
      );
    }

    case "cards": {
      const items = block.items ?? [];
      if (items.length === 0) return null;
      return (
        <section data-testid={`block-cards-${index}`}>
          {block.heading ? <h2 className="font-serif text-2xl font-bold text-primary mb-2">{block.heading}</h2> : null}
          {block.intro ? <p className="text-gray-600 mb-6">{block.intro}</p> : <div className="mb-6" />}
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((it, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-serif font-bold text-sm">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1.5 leading-snug">{it.title}</h3>
                    {it.text ? <p className="text-sm text-gray-600 leading-relaxed">{it.text}</p> : null}
                    {(it.items ?? []).length > 0 ? (
                      <ul className="mt-1.5 space-y-1">
                        {(it.items ?? []).map((li, j) => (
                          <li key={j} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-primary mt-0.5 shrink-0">•</span>{li}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "timeline": {
      const items = block.items ?? [];
      if (items.length === 0) return null;
      return (
        <section data-testid={`block-timeline-${index}`}>
          {block.heading ? <h2 className="font-serif text-2xl font-bold text-primary mb-6">{block.heading}</h2> : null}
          <ol className="relative border-l-2 border-primary/20 ml-3 space-y-6">
            {items.map((it, i) => (
              <li key={i} className="relative pl-8">
                <span className="absolute -left-[11px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                  <CalendarDays className="h-3 w-3" />
                </span>
                <div className="font-semibold text-gray-900">{it.title}</div>
                <div className="text-sm text-primary font-medium">{it.date}</div>
                {it.text ? <div className="text-sm text-gray-500 mt-0.5">{it.text}</div> : null}
              </li>
            ))}
          </ol>
        </section>
      );
    }

    case "tiers": {
      const items = block.items ?? [];
      if (items.length === 0) return null;
      const tierStyles = [
        "border-amber-400/60 bg-gradient-to-b from-amber-50 to-white",
        "border-sky-300/60 bg-gradient-to-b from-sky-50 to-white",
        "border-yellow-300/60 bg-gradient-to-b from-yellow-50 to-white",
        "border-gray-300 bg-gradient-to-b from-gray-50 to-white",
        "border-orange-300/60 bg-gradient-to-b from-orange-50 to-white",
        "border-emerald-300/60 bg-gradient-to-b from-emerald-50 to-white",
      ];
      return (
        <section data-testid={`block-tiers-${index}`}>
          {block.heading ? <h2 className="font-serif text-2xl font-bold text-primary mb-2">{block.heading}</h2> : null}
          {block.intro ? <p className="text-gray-600 mb-6">{block.intro}</p> : <div className="mb-6" />}
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((it, i) => (
              <div key={i} className={`rounded-xl border-2 p-5 ${tierStyles[i % tierStyles.length]}`}>
                <div className="flex items-baseline justify-between gap-3 mb-3 pb-3 border-b border-gray-200/70">
                  <h3 className="font-serif text-lg font-bold text-gray-900">{it.title}</h3>
                  <span className="text-sm font-semibold text-primary whitespace-nowrap">{it.value}</span>
                </div>
                <ul className="space-y-1.5">
                  {(it.items ?? []).map((li, j) => (
                    <li key={j} className="text-sm text-gray-600 flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "cta": {
      return (
        <div className="rounded-2xl bg-primary text-white px-6 py-8 md:px-10 md:py-10 text-center" data-testid={`block-cta-${index}`}>
          {block.heading ? <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">{block.heading}</h2> : null}
          {block.text ? <p className="text-white/85 max-w-2xl mx-auto mb-6">{block.text}</p> : null}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(block.buttons ?? [])
              .filter((b) => b && typeof b.url === "string" && /^(https?:|mailto:|tel:|\/)/i.test(b.url.trim()))
              .map((b, i) => (
              <a
                key={i}
                href={b.url}
                className={
                  i === 0
                    ? "inline-flex items-center gap-2 rounded-lg bg-accent text-primary font-semibold px-5 py-2.5 hover:brightness-105 transition"
                    : "inline-flex items-center gap-2 rounded-lg border border-white/40 text-white font-semibold px-5 py-2.5 hover:bg-white/10 transition"
                }
              >
                {b.url.startsWith("mailto:") ? <Mail className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                {b.label}
              </a>
            ))}
          </div>
        </div>
      );
    }

    case "notice":
      return (
        <div className="rounded-xl border-l-4 border-accent bg-accent/10 px-5 py-4" data-testid={`block-notice-${index}`}>
          {block.heading ? <div className="font-semibold text-gray-900 mb-1">{block.heading}</div> : null}
          {block.html ? (
            <div
              className="prose prose-sm max-w-none text-gray-700 prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.html) }}
            />
          ) : block.text ? (
            <p className="text-sm text-gray-700">{block.text}</p>
          ) : null}
        </div>
      );

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
