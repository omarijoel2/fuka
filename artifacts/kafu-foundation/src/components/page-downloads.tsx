import { FileText, Download } from "lucide-react";

export interface PageDownload {
  label?: string;
  title?: string;
  url?: string;
  description?: string;
  type?: string;
}

function fileType(d: PageDownload): string {
  if (d.type) return d.type.toUpperCase();
  const ext = ((d.url ?? "").split("?")[0].split(".").pop() ?? "").toUpperCase();
  return ext || "FILE";
}

interface Props {
  downloads: PageDownload[] | undefined | null;
  title?: string;
  className?: string;
}

export default function PageDownloads({ downloads, title = "Downloads", className }: Props) {
  const list = (Array.isArray(downloads) ? downloads : []).filter((d) => d && d.url);
  if (list.length === 0) return null;

  return (
    <section className={className ?? "py-12 bg-white"} data-testid="page-downloads">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">{title}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {list.map((d, i) => (
            <a
              key={i}
              href={d.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`download-item-${i}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileText className="h-5 w-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-gray-900 truncate">{d.label || d.title || "Download"}</span>
                {d.description ? (
                  <span className="block text-xs text-gray-500 truncate">{d.description}</span>
                ) : (
                  <span className="block text-xs text-gray-500">{fileType(d)}</span>
                )}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline shrink-0">
                <Download className="h-3.5 w-3.5" /> Download
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
