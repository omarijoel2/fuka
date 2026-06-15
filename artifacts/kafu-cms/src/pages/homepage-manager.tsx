import { useState, useEffect } from "react";
import { apiGet, apiPut } from "../lib/api";
import { Link } from "wouter";
import {
  Monitor, BarChart3, Link as LinkIcon, Megaphone, LayoutGrid,
  Plus, Trash2, ChevronRight, ArrowRight, CheckCircle, Loader2,
} from "lucide-react";

interface QuickLink { label: string; url: string }
interface Stat { label: string; value: string }
interface DigitalService { icon: string; label: string; desc: string; url: string; external?: boolean }

const DIGITAL_SERVICE_ICON_OPTIONS = [
  { value: "monitor", label: "Monitor / Portal" },
  { value: "book", label: "Book / E-Learning" },
  { value: "library", label: "Library" },
  { value: "mail", label: "Email" },
  { value: "users", label: "People / Staff" },
  { value: "file", label: "Document" },
  { value: "globe", label: "Globe / Web" },
  { value: "graduation", label: "Graduation" },
  { value: "calendar", label: "Calendar" },
  { value: "award", label: "Award" },
  { value: "briefcase", label: "Briefcase" },
];

interface HomepageConfig {
  show_admissions_banner?: boolean;
  admissions_banner_text?: string;
  quick_links?: QuickLink[];
  stats?: Stat[];
  digital_services?: DigitalService[];
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="w-8 h-8 bg-[#1A5C38]/10 rounded-lg flex items-center justify-center text-[#1A5C38]">{icon}</div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function HomepageManagerPage() {
  const [cfg, setCfg] = useState<HomepageConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/site-config/homepage")
      .then(d => { setCfg(d || {}); setLoading(false); })
      .catch(() => { setError("Failed to load homepage config"); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false); setError("");
    try {
      await apiPut("/site-config/homepage", cfg);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  const updateQuickLink = (i: number, field: keyof QuickLink, val: string) => {
    const links = [...(cfg.quick_links || [])];
    links[i] = { ...links[i], [field]: val };
    setCfg({ ...cfg, quick_links: links });
  };

  const addQuickLink = () => setCfg({ ...cfg, quick_links: [...(cfg.quick_links || []), { label: "", url: "" }] });
  const removeQuickLink = (i: number) => setCfg({ ...cfg, quick_links: (cfg.quick_links || []).filter((_, idx) => idx !== i) });

  const updateStat = (i: number, field: keyof Stat, val: string) => {
    const stats = [...(cfg.stats || [])];
    stats[i] = { ...stats[i], [field]: val };
    setCfg({ ...cfg, stats: stats });
  };

  const addStat = () => setCfg({ ...cfg, stats: [...(cfg.stats || []), { label: "", value: "" }] });
  const removeStat = (i: number) => setCfg({ ...cfg, stats: (cfg.stats || []).filter((_, idx) => idx !== i) });

  const updateService = (i: number, field: keyof DigitalService, val: string | boolean) => {
    const list = [...(cfg.digital_services || [])];
    list[i] = { ...list[i], [field]: val };
    setCfg({ ...cfg, digital_services: list });
  };
  const addService = () => setCfg({ ...cfg, digital_services: [...(cfg.digital_services || []), { icon: "monitor", label: "", desc: "", url: "", external: false }] });
  const removeService = (i: number) => setCfg({ ...cfg, digital_services: (cfg.digital_services || []).filter((_, idx) => idx !== i) });

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38]";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading homepage configuration…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">Control the admissions banner, stats block, and quick links.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button onClick={handleSave} disabled={saving} data-testid="btn-save-homepage"
            className="flex items-center gap-2 px-4 py-2 bg-[#1A5C38] text-white text-sm font-semibold rounded-xl hover:bg-[#154d2f] disabled:opacity-50 transition-colors">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Hero Carousel link-out card */}
      <div className="bg-gradient-to-br from-[#1A5C38] to-[#154d2f] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Hero Carousel Slides</h2>
              <p className="text-white/75 text-sm mt-0.5 max-w-xl">
                Manage the rotating banner shown at the top of the homepage — add, edit, reorder, and publish individual slides with custom images, headlines, captions, and call-to-action buttons.
              </p>
              <div className="flex gap-2 mt-3 text-xs text-white/60">
                <span className="bg-white/10 px-2 py-0.5 rounded">Full CRUD</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">Live preview</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">Media Library picker</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">Reorder</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">Duplicate slides</span>
              </div>
            </div>
          </div>
          <Link href="/hero-slides">
            <a data-testid="btn-go-hero-slides"
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#1A5C38] font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors shrink-0 whitespace-nowrap">
              Manage Slides <ChevronRight className="w-4 h-4" />
            </a>
          </Link>
        </div>
      </div>

      {/* Admissions Banner */}
      <SectionCard title="Admissions Banner" icon={<Megaphone className="w-4 h-4" />}>
        <div className="space-y-4">
          <p className="text-xs text-gray-500">An announcement strip shown at the top of the homepage when enabled. Typically used to highlight open intake periods.</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" id="admissions-banner-active" checked={!!cfg.show_admissions_banner}
                onChange={e => setCfg({ ...cfg, show_admissions_banner: e.target.checked })}
                className="sr-only peer" data-testid="toggle-admissions-banner" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#1A5C38] transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm font-medium text-gray-700">Show admissions banner on homepage</span>
          </label>

          {cfg.show_admissions_banner && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner Message</label>
              <input type="text" value={cfg.admissions_banner_text || ""}
                onChange={e => setCfg({ ...cfg, admissions_banner_text: e.target.value })}
                placeholder="e.g. Applications for May 2026 intake are now open. Apply before 31st August."
                className={inputCls} data-testid="input-admissions-banner-text" />
              <p className="text-xs text-gray-400 mt-1.5">The banner links to <code className="font-mono bg-gray-100 px-1 rounded">/admissions</code> automatically.</p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Stats Block */}
      <SectionCard title="Stats / Credibility Block" icon={<BarChart3 className="w-4 h-4" />}>
        <div className="space-y-4">
          <p className="text-xs text-gray-500">Key figures shown in the "Why KAFU" section — e.g. student count, programmes, years of operation.</p>
          <div className="space-y-3">
            {(cfg.stats || []).map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="text" placeholder="Value (e.g. 8,500+)" value={stat.value}
                  onChange={e => updateStat(i, "value", e.target.value)}
                  className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30 font-semibold"
                  data-testid={`input-stat-value-${i}`} />
                <input type="text" placeholder="Label (e.g. Students Enrolled)" value={stat.label}
                  onChange={e => updateStat(i, "label", e.target.value)}
                  className={`flex-1 ${inputCls}`} data-testid={`input-stat-label-${i}`} />
                <button onClick={() => removeStat(i)} data-testid={`btn-remove-stat-${i}`}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(cfg.stats || []).length === 0 && (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">No stats configured. Click below to add your first figure.</p>
            )}
          </div>
          <button onClick={addStat} data-testid="btn-add-stat"
            className="flex items-center gap-2 text-sm text-[#1A5C38] font-medium hover:underline">
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>
      </SectionCard>

      {/* Digital Services */}
      <SectionCard title="Digital Services" icon={<LayoutGrid className="w-4 h-4" />}>
        <div className="space-y-4">
          <p className="text-xs text-gray-500">The grid of service tiles shown in the "Digital Services" section of the homepage — e.g. Student Portal, E-Learning, Library. Each tile has an icon, title, short description, and a link.</p>
          <div className="space-y-4">
            {(cfg.digital_services || []).map((svc, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3" data-testid={`service-card-${i}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Tile {i + 1}</span>
                  <button onClick={() => removeService(i)} data-testid={`btn-remove-service-${i}`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                    <select value={svc.icon || "monitor"} onChange={e => updateService(i, "icon", e.target.value)}
                      className={inputCls} data-testid={`select-service-icon-${i}`}>
                      {DIGITAL_SERVICE_ICON_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input type="text" value={svc.label} onChange={e => updateService(i, "label", e.target.value)}
                      placeholder="e.g. Student Portal" className={inputCls} data-testid={`input-service-label-${i}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input type="text" value={svc.desc} onChange={e => updateService(i, "desc", e.target.value)}
                    placeholder="e.g. Registration, results, fee statements and more" className={inputCls} data-testid={`input-service-desc-${i}`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link (URL or path)</label>
                    <input type="text" value={svc.url} onChange={e => updateService(i, "url", e.target.value)}
                      placeholder="e.g. https://portal.kafu.ac.ke or /admissions" className={inputCls} data-testid={`input-service-url-${i}`} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input type="checkbox" checked={!!svc.external} onChange={e => updateService(i, "external", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#1A5C38] focus:ring-[#1A5C38]/30" data-testid={`checkbox-service-external-${i}`} />
                    <span className="text-sm text-gray-700">Open in new tab (external link)</span>
                  </label>
                </div>
              </div>
            ))}
            {(cfg.digital_services || []).length === 0 && (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">No service tiles configured. The homepage will show the default set until you add tiles here.</p>
            )}
          </div>
          <button onClick={addService} data-testid="btn-add-service"
            className="flex items-center gap-2 text-sm text-[#1A5C38] font-medium hover:underline">
            <Plus className="w-4 h-4" /> Add Service Tile
          </button>
        </div>
      </SectionCard>

      {/* Quick Links */}
      <SectionCard title="Homepage Quick Links" icon={<LinkIcon className="w-4 h-4" />}>
        <div className="space-y-4">
          <p className="text-xs text-gray-500">Shortcut links shown in the Digital Services Hub section of the homepage.</p>
          <div className="space-y-3">
            {(cfg.quick_links || []).map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="text" placeholder="Label" value={link.label}
                  onChange={e => updateQuickLink(i, "label", e.target.value)}
                  className={`flex-1 ${inputCls}`} data-testid={`input-quicklink-label-${i}`} />
                <div className="relative flex-1">
                  <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="text" placeholder="URL or path" value={link.url}
                    onChange={e => updateQuickLink(i, "url", e.target.value)}
                    className={`w-full pl-8 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/30`}
                    data-testid={`input-quicklink-url-${i}`} />
                </div>
                <button onClick={() => removeQuickLink(i)} data-testid={`btn-remove-quicklink-${i}`}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(cfg.quick_links || []).length === 0 && (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">No quick links configured.</p>
            )}
          </div>
          <button onClick={addQuickLink} data-testid="btn-add-quick-link"
            className="flex items-center gap-2 text-sm text-[#1A5C38] font-medium hover:underline">
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>
      </SectionCard>

      {/* Bottom save */}
      <div className="flex justify-end pb-4">
        <button onClick={handleSave} disabled={saving} data-testid="btn-save-homepage-bottom"
          className="flex items-center gap-2 px-6 py-2 bg-[#1A5C38] text-white text-sm font-semibold rounded-xl hover:bg-[#154d2f] disabled:opacity-50">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
