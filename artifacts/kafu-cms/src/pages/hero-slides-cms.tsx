import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import {
  Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, Image as ImageIcon,
  Eye, EyeOff, Star, Copy, Loader2, Search, CheckCircle2, ArrowRight,
  ExternalLink, Monitor, SlidersHorizontal, AlignLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeroSlide {
  id: number;
  headline: string;
  accent: string;
  badge: string;
  body: string;
  image: string;
  objectPosition: string;
  sortOrder: number;
  cta1: { label: string; href: string; external: boolean };
  cta2: { label: string; href: string; external: boolean };
  status: "published" | "draft";
  featured: boolean;
}

interface SlideForm {
  headline: string;
  accent: string;
  badge: string;
  body: string;
  image: string;
  object_position: string;
  sort_order: number;
  cta1_label: string;
  cta1_href: string;
  cta1_external: boolean;
  cta2_label: string;
  cta2_href: string;
  cta2_external: boolean;
  status: "published" | "draft";
  featured: boolean;
}

const EMPTY_FORM: SlideForm = {
  headline: "",
  accent: "",
  badge: "",
  body: "",
  image: "",
  object_position: "center center",
  sort_order: 99,
  cta1_label: "Apply for Admissions",
  cta1_href: "/admissions",
  cta1_external: false,
  cta2_label: "About KAFU",
  cta2_href: "/about",
  cta2_external: false,
  status: "draft",
  featured: false,
};

const OBJECT_POSITIONS = [
  { value: "center center", label: "Center" },
  { value: "center top", label: "Top" },
  { value: "center bottom", label: "Bottom" },
  { value: "left center", label: "Left" },
  { value: "left top", label: "Left Top" },
  { value: "right center", label: "Right" },
  { value: "right top", label: "Right Top" },
];

const TOKEN_KEY = "kafu_cms_token";

// ─── Media Picker Modal ───────────────────────────────────────────────────────
interface MediaFile { id: number; original_name: string; mime_type: string; url: string; alt_text: string | null; }

function MediaPickerModal({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  async function load(q = "") {
    setLoading(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const params = new URLSearchParams({ per_page: "30", type: "image", ...(q ? { search: q } : {}) });
      const res = await fetch(`/api/admin/media?${params}`, {
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const json = await res.json();
      setFiles(json.data ?? []);
      setTotal(json.total ?? 0);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) { e.preventDefault(); load(search); }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h3 className="font-semibold text-gray-900">Pick from Media Library</h3>
            <p className="text-xs text-gray-500 mt-0.5">{total} images · click to select</p>
          </div>
          <button onClick={onClose} data-testid="picker-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="px-6 py-3 border-b shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images…"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30"
                data-testid="picker-search" />
            </div>
            <button type="submit" className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Search</button>
            {search && <button type="button" onClick={() => { setSearch(""); load(""); }} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><X className="w-4 h-4" /></button>}
          </form>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…</div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <ImageIcon className="w-10 h-10 opacity-30" /><p className="text-sm">No images found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {files.map(file => (
                <button key={file.id} onClick={() => onPick(file.url)} data-testid={`picker-file-${file.id}`}
                  className="group relative rounded-xl overflow-hidden border-2 border-transparent hover:border-[#1A5C38] transition-all aspect-square bg-gray-100 focus:outline-none">
                  <img src={file.url} alt={file.alt_text ?? file.original_name} className="w-full h-full object-cover" loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-3 border-t shrink-0 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50" data-testid="picker-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Live Slide Preview ───────────────────────────────────────────────────────
function SlidePreview({ form }: { form: SlideForm }) {
  return (
    <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden bg-gray-800 select-none">
      {form.image ? (
        <img src={form.image} alt="Slide preview" className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: form.object_position }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
          <ImageIcon className="w-10 h-10 opacity-30" />
        </div>
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 py-6 gap-2 max-w-[65%]">
        {form.badge && (
          <span className="self-start text-[10px] font-semibold uppercase tracking-widest text-white/70 bg-white/10 px-2 py-0.5 rounded">
            {form.badge}
          </span>
        )}
        <div>
          {form.headline && (
            <h2 className="text-2xl font-bold text-white leading-tight">
              {form.headline}{" "}
              {form.accent && <span className="text-[#C9A227]">{form.accent}</span>}
            </h2>
          )}
          {!form.headline && !form.accent && (
            <p className="text-white/30 text-sm italic">Headline will appear here</p>
          )}
        </div>
        {form.body && <p className="text-white/75 text-xs leading-relaxed line-clamp-2">{form.body}</p>}
        <div className="flex gap-2 mt-1">
          {form.cta1_label && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-3 py-1 rounded bg-[#1A5C38] text-white">
              {form.cta1_label}
              {form.cta1_external && <ExternalLink className="w-2.5 h-2.5" />}
            </span>
          )}
          {form.cta2_label && (
            <span className="flex items-center gap-1 text-[10px] font-medium px-3 py-1 rounded border border-white/40 text-white">
              {form.cta2_label}
              {form.cta2_external && <ExternalLink className="w-2.5 h-2.5" />}
            </span>
          )}
        </div>
      </div>
      {/* Status pill */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        {form.featured && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A227]/90 text-white font-semibold">Featured</span>
        )}
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${form.status === "published" ? "bg-green-500/90 text-white" : "bg-gray-700/80 text-white"}`}>
          {form.status === "published" ? "Published" : "Draft"}
        </span>
      </div>
    </div>
  );
}

// ─── Slide Editor Modal ───────────────────────────────────────────────────────
type EditorTab = "content" | "buttons" | "settings";

function SlideEditorModal({ slide, defaultSortOrder, onClose, onSaved }: {
  slide: HeroSlide | null;
  defaultSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !slide;
  const [form, setForm] = useState<SlideForm>(
    slide ? {
      headline: slide.headline,
      accent: slide.accent,
      badge: slide.badge,
      body: slide.body,
      image: slide.image,
      object_position: slide.objectPosition,
      sort_order: slide.sortOrder,
      cta1_label: slide.cta1.label,
      cta1_href: slide.cta1.href,
      cta1_external: slide.cta1.external,
      cta2_label: slide.cta2.label,
      cta2_href: slide.cta2.href,
      cta2_external: slide.cta2.external,
      status: slide.status,
      featured: slide.featured,
    } : { ...EMPTY_FORM, sort_order: defaultSortOrder }
  );
  const [tab, setTab] = useState<EditorTab>("content");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const set = <K extends keyof SlideForm>(k: K, v: SlideForm[K]) => setForm(f => ({ ...f, [k]: v }));

  async function save() {
    if (!form.headline.trim()) { setError("Headline is required."); return; }
    if (!form.image.trim()) { setError("Image URL is required — paste a URL or pick from the Media Library."); return; }
    setSaving(true); setError("");
    try {
      if (slide) {
        await apiPut(`/hero-slides/${slide.id}`, form as unknown as Record<string, unknown>);
      } else {
        await apiPost("/hero-slides", form as unknown as Record<string, unknown>);
      }
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally { setSaving(false); }
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38]";

  const TABS: { key: EditorTab; label: string; icon: React.ReactNode }[] = [
    { key: "content", label: "Content", icon: <AlignLeft className="w-4 h-4" /> },
    { key: "buttons", label: "Buttons", icon: <ArrowRight className="w-4 h-4" /> },
    { key: "settings", label: "Settings", icon: <SlidersHorizontal className="w-4 h-4" /> },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4 flex flex-col max-h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[#1A5C38]" />
              {isNew ? "New Slide" : "Edit Slide"}
            </h2>
            <button onClick={onClose} data-testid="btn-close-slide-modal">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {/* Live preview */}
            <div className="px-6 pt-5 pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Live Preview</p>
              <SlidePreview form={form} />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pb-0 border-b border-gray-100">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} data-testid={`slide-tab-${t.key}`}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors
                    ${tab === t.key ? "border-[#1A5C38] text-[#1A5C38]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
              )}

              {tab === "content" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headline <span className="text-red-500">*</span></label>
                      <input type="text" value={form.headline} onChange={e => set("headline", e.target.value)}
                        placeholder="e.g. Shaping Futures." className={inputCls} data-testid="input-slide-headline" />
                      <p className="text-[10px] text-gray-400 mt-1">Main heading shown on the slide</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accent Word / Phrase</label>
                      <input type="text" value={form.accent} onChange={e => set("accent", e.target.value)}
                        placeholder="e.g. Excellence." className={inputCls} data-testid="input-slide-accent" />
                      <p className="text-[10px] text-gray-400 mt-1">Displayed in gold after the headline</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge / Tagline</label>
                    <input type="text" value={form.badge} onChange={e => set("badge", e.target.value)}
                      placeholder="e.g. Vice-Chancellor · Prof. Peter N. Mwita" className={inputCls} data-testid="input-slide-badge" />
                    <p className="text-[10px] text-gray-400 mt-1">Small label shown above the headline — category, person name, event title</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
                    <textarea rows={3} value={form.body} onChange={e => set("body", e.target.value)}
                      placeholder="Short supporting paragraph shown beneath the headline…"
                      className={`${inputCls} resize-none`} data-testid="input-slide-body" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Image <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="text" value={form.image} onChange={e => set("image", e.target.value)}
                        placeholder="Paste image URL or pick from Media Library…"
                        className={`flex-1 ${inputCls}`} data-testid="input-slide-image" />
                      <button type="button" onClick={() => setShowPicker(true)} data-testid="btn-pick-image"
                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600">
                        <ImageIcon className="w-4 h-4" /> Pick
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Recommended: 1920×1080 or wider. The preview above updates as you type.</p>
                  </div>
                </>
              )}

              {tab === "buttons" && (
                <>
                  {/* Primary CTA */}
                  <div className="rounded-xl border border-[#1A5C38]/20 bg-[#1A5C38]/3 p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#1A5C38]" />
                      <p className="text-sm font-semibold text-gray-900">Primary Button</p>
                      <span className="text-[10px] text-gray-400 ml-auto">Solid green · shown first</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Button Label</label>
                        <input type="text" value={form.cta1_label} onChange={e => set("cta1_label", e.target.value)}
                          placeholder="Apply for Admissions" className={inputCls} data-testid="input-cta1-label" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Link URL / Path</label>
                        <input type="text" value={form.cta1_href} onChange={e => set("cta1_href", e.target.value)}
                          placeholder="/admissions" className={inputCls} data-testid="input-cta1-href" />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.cta1_external} onChange={e => set("cta1_external", e.target.checked)}
                        className="rounded border-gray-300" data-testid="check-cta1-external" />
                      Opens in new tab (external link)
                    </label>
                    {!form.cta1_label && (
                      <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">Leave the label blank to hide this button.</p>
                    )}
                  </div>

                  {/* Secondary CTA */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-sm border border-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">Secondary Button</p>
                      <span className="text-[10px] text-gray-400 ml-auto">Outlined · shown second</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Button Label</label>
                        <input type="text" value={form.cta2_label} onChange={e => set("cta2_label", e.target.value)}
                          placeholder="About KAFU" className={inputCls} data-testid="input-cta2-label" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Link URL / Path</label>
                        <input type="text" value={form.cta2_href} onChange={e => set("cta2_href", e.target.value)}
                          placeholder="/about" className={inputCls} data-testid="input-cta2-href" />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.cta2_external} onChange={e => set("cta2_external", e.target.checked)}
                        className="rounded border-gray-300" data-testid="check-cta2-external" />
                      Opens in new tab (external link)
                    </label>
                    {!form.cta2_label && (
                      <p className="text-xs text-gray-400 bg-white px-3 py-2 rounded-lg border border-gray-100">Leave blank to show only one button.</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
                    <strong>Tip:</strong> For admission-related CTAs, use <code className="font-mono bg-blue-100 px-1 rounded">/admissions</code>. For portal access, use <code className="font-mono bg-blue-100 px-1 rounded">https://portal.kafu.ac.ke</code> with "Open in new tab" checked.
                  </div>
                </>
              )}

              {tab === "settings" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Focus Point</label>
                    <p className="text-xs text-gray-500 mb-2">Controls which part of the background image is most visible. Adjust if faces or key subjects are being cropped.</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {OBJECT_POSITIONS.map(pos => (
                        <button key={pos.value} type="button" onClick={() => set("object_position", pos.value)}
                          data-testid={`pos-${pos.value.replace(/\s/g, "-")}`}
                          className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors
                            ${form.object_position === pos.value
                              ? "border-[#1A5C38] bg-[#1A5C38]/5 text-[#1A5C38]"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Publish Status</label>
                      <select value={form.status} onChange={e => set("status", e.target.value as "published" | "draft")}
                        className={inputCls} data-testid="select-slide-status">
                        <option value="published">Published — visible on site</option>
                        <option value="draft">Draft — hidden from site</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort Position</label>
                      <input type="number" min={0} value={form.sort_order} onChange={e => set("sort_order", Number(e.target.value))}
                        className={inputCls} data-testid="input-slide-sort" />
                      <p className="text-[10px] text-gray-400 mt-1">Lower = appears first</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 accent-[#C9A227]" data-testid="check-slide-featured" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-[#C9A227]" /> Mark as Featured
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Featured slides may be promoted or shown with special styling in some layouts.</p>
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-2xl shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-100" data-testid="btn-cancel-slide">
              Cancel
            </button>
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-[#1A5C38] text-white hover:bg-[#154d2f] disabled:opacity-60"
              data-testid="btn-save-slide">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving…" : isNew ? "Create Slide" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {showPicker && (
        <MediaPickerModal onClose={() => setShowPicker(false)} onPick={url => { set("image", url); setShowPicker(false); }} />
      )}
    </>
  );
}

// ─── Slide Card ───────────────────────────────────────────────────────────────
function SlideCard({ slide, index, total, onEdit, onDelete, onDuplicate, onMove, onToggleStatus, reordering }: {
  slide: HeroSlide;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (dir: "up" | "down") => void;
  onToggleStatus: () => void;
  reordering: boolean;
}) {
  return (
    <div className={`group bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md
      ${slide.status === "published" ? "border-gray-200" : "border-gray-200 opacity-80"}`}
      data-testid={`slide-card-${slide.id}`}>
      {/* Thumbnail strip */}
      <div className="relative aspect-[16/6] bg-gray-100 overflow-hidden">
        {slide.image ? (
          <img src={slide.image} alt={slide.headline} className="w-full h-full object-cover"
            style={{ objectPosition: slide.objectPosition }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />

        {/* Slide content overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-5 py-3 gap-1 max-w-[70%]">
          {slide.badge && (
            <span className="self-start text-[9px] font-semibold uppercase tracking-widest text-white/70">{slide.badge}</span>
          )}
          <h3 className="text-base font-bold text-white leading-tight">
            {slide.headline}{" "}
            {slide.accent && <span className="text-[#C9A227]">{slide.accent}</span>}
          </h3>
          {(slide.cta1.label || slide.cta2.label) && (
            <div className="flex gap-1.5 mt-0.5">
              {slide.cta1.label && (
                <span className="text-[9px] px-2 py-0.5 rounded bg-[#1A5C38] text-white font-medium flex items-center gap-1">
                  {slide.cta1.label}{slide.cta1.external && <ExternalLink className="w-2 h-2" />}
                </span>
              )}
              {slide.cta2.label && (
                <span className="text-[9px] px-2 py-0.5 rounded border border-white/40 text-white flex items-center gap-1">
                  {slide.cta2.label}{slide.cta2.external && <ExternalLink className="w-2 h-2" />}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Top-right badges */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {slide.featured && (
            <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-[#C9A227]/90 text-white font-semibold">
              <Star className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>

        {/* Slide number */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] font-bold text-white/50">#{index + 1}</span>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        {/* Reorder */}
        <div className="flex flex-col shrink-0">
          <button onClick={() => onMove("up")} disabled={index === 0 || reordering} data-testid={`btn-move-up-${slide.id}`}
            className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-25">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove("down")} disabled={index === total - 1 || reordering} data-testid={`btn-move-down-${slide.id}`}
            className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-25">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Status toggle */}
        <button onClick={onToggleStatus} data-testid={`btn-toggle-status-${slide.id}`}
          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold transition-colors
            ${slide.status === "published"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
          {slide.status === "published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {slide.status === "published" ? "Published" : "Draft"}
        </button>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button onClick={onDuplicate} data-testid={`btn-duplicate-${slide.id}`} title="Duplicate slide"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onEdit} data-testid={`btn-edit-slide-${slide.id}`}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button onClick={onDelete} data-testid={`btn-delete-slide-${slide.id}`}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirm({ slide, onCancel, onConfirm }: { slide: HeroSlide; onCancel: () => void; onConfirm: () => void }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-gray-900">Delete Slide?</h3>
          <p className="text-sm text-gray-500 mt-1">"{slide.headline}" will be permanently removed from the carousel.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50" data-testid="btn-cancel-delete">Cancel</button>
          <button onClick={async () => { setDeleting(true); await onConfirm(); }}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
            data-testid="btn-confirm-delete">
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {deleting ? "Deleting…" : "Delete Slide"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HeroSlidesCmsPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSlide, setEditSlide] = useState<HeroSlide | null | undefined>(undefined);
  const [deleteSlide, setDeleteSlide] = useState<HeroSlide | null>(null);
  const [reordering, setReordering] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiGet("/hero-slides");
      setSlides((d.data ?? []).sort((a: HeroSlide, b: HeroSlide) => a.sortOrder - b.sortOrder));
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(slide: HeroSlide) {
    await apiDelete(`/hero-slides/${slide.id}`);
    setDeleteSlide(null);
    load();
  }

  async function handleDuplicate(slide: HeroSlide) {
    await apiPost("/hero-slides", {
      headline: `${slide.headline} (Copy)`,
      accent: slide.accent,
      badge: slide.badge,
      body: slide.body,
      image: slide.image,
      object_position: slide.objectPosition,
      sort_order: slides.length,
      cta1_label: slide.cta1.label,
      cta1_href: slide.cta1.href,
      cta1_external: slide.cta1.external,
      cta2_label: slide.cta2.label,
      cta2_href: slide.cta2.href,
      cta2_external: slide.cta2.external,
      status: "draft",
      featured: false,
    } as Record<string, unknown>);
    load();
  }

  async function toggleStatus(slide: HeroSlide) {
    await apiPut(`/hero-slides/${slide.id}`, {
      status: slide.status === "published" ? "draft" : "published",
    } as Record<string, unknown>);
    load();
  }

  async function move(index: number, direction: "up" | "down") {
    const arr = [...slides];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    const optimistic = arr.map((s, i) => ({ ...s, sortOrder: i }));
    setSlides(optimistic);
    setReordering(true);
    try {
      await apiPost("/hero-slides/reorder", { order: optimistic.map(s => s.id) });
    } catch { await load(); }
    finally { setReordering(false); }
  }

  const published = slides.filter(s => s.status === "published").length;
  const drafts = slides.filter(s => s.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Carousel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage the rotating banner on the homepage. Slides play in order from top to bottom.</p>
        </div>
        <button onClick={() => setEditSlide(null)} data-testid="btn-add-hero-slide"
          className="flex items-center gap-2 px-4 py-2 bg-[#1A5C38] text-white text-sm font-semibold rounded-xl hover:bg-[#154d2f] transition-colors">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Slides", value: slides.length },
          { label: "Published", value: published, green: true },
          { label: "Drafts", value: drafts },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className={`text-3xl font-bold ${s.green ? "text-green-600" : "text-[#1A5C38]"}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Slide list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading slides…
        </div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
          <Monitor className="w-14 h-14 opacity-20" />
          <p className="text-sm">No hero slides yet.</p>
          <button onClick={() => setEditSlide(null)} data-testid="btn-add-first-slide"
            className="flex items-center gap-2 px-4 py-2 bg-[#1A5C38] text-white text-sm font-medium rounded-xl hover:bg-[#154d2f]">
            <Plus className="w-4 h-4" /> Add First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, i) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              index={i}
              total={slides.length}
              reordering={reordering}
              onEdit={() => setEditSlide(slide)}
              onDelete={() => setDeleteSlide(slide)}
              onDuplicate={() => handleDuplicate(slide)}
              onMove={dir => move(i, dir)}
              onToggleStatus={() => toggleStatus(slide)}
            />
          ))}
        </div>
      )}

      {/* Editor modal — undefined = closed, null = new, HeroSlide = edit */}
      {editSlide !== undefined && (
        <SlideEditorModal
          slide={editSlide}
          defaultSortOrder={slides.length}
          onClose={() => setEditSlide(undefined)}
          onSaved={() => { setEditSlide(undefined); load(); }}
        />
      )}

      {/* Delete confirmation */}
      {deleteSlide && (
        <DeleteConfirm
          slide={deleteSlide}
          onCancel={() => setDeleteSlide(null)}
          onConfirm={() => handleDelete(deleteSlide)}
        />
      )}
    </div>
  );
}
