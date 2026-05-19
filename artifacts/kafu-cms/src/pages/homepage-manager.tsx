import { useState, useEffect } from "react";
import { apiGet, apiPut } from "../lib/api";

interface QuickLink { label: string; url: string }
interface Stat { label: string; value: string }

interface HomepageConfig {
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  hero_image_url?: string;
  show_admissions_banner?: boolean;
  admissions_banner_text?: string;
  quick_links?: QuickLink[];
  stats?: Stat[];
}

function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  const cls = color === "green"
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {children}
    </span>
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
      .then((d) => { setCfg(d || {}); setLoading(false); })
      .catch(() => { setError("Failed to load homepage config"); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await apiPut("/site-config/homepage", cfg);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateQuickLink = (i: number, field: keyof QuickLink, val: string) => {
    const links = [...(cfg.quick_links || [])];
    links[i] = { ...links[i], [field]: val };
    setCfg({ ...cfg, quick_links: links });
  };

  const addQuickLink = () => {
    setCfg({ ...cfg, quick_links: [...(cfg.quick_links || []), { label: "", url: "" }] });
  };

  const removeQuickLink = (i: number) => {
    const links = (cfg.quick_links || []).filter((_, idx) => idx !== i);
    setCfg({ ...cfg, quick_links: links });
  };

  const updateStat = (i: number, field: keyof Stat, val: string) => {
    const stats = [...(cfg.stats || [])];
    stats[i] = { ...stats[i], [field]: val };
    setCfg({ ...cfg, stats: stats });
  };

  const addStat = () => {
    setCfg({ ...cfg, stats: [...(cfg.stats || []), { label: "", value: "" }] });
  };

  const removeStat = (i: number) => {
    const stats = (cfg.stats || []).filter((_, idx) => idx !== i);
    setCfg({ ...cfg, stats: stats });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading homepage configuration...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Homepage Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Control the homepage hero section, quick links, stats, and admissions banner.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <Badge color="green">Saved</Badge>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            data-testid="btn-save-homepage"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#228B22] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
          Hero Section
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Title
            </label>
            <input
              data-testid="input-hero-title"
              type="text"
              value={cfg.hero_title || ""}
              onChange={(e) => setCfg({ ...cfg, hero_title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Subtitle
            </label>
            <textarea
              data-testid="input-hero-subtitle"
              rows={3}
              value={cfg.hero_subtitle || ""}
              onChange={(e) => setCfg({ ...cfg, hero_subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary CTA Label
              </label>
              <input
                data-testid="input-hero-cta-primary"
                type="text"
                value={cfg.hero_cta_primary || ""}
                onChange={(e) => setCfg({ ...cfg, hero_cta_primary: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary CTA Label
              </label>
              <input
                data-testid="input-hero-cta-secondary"
                type="text"
                value={cfg.hero_cta_secondary || ""}
                onChange={(e) => setCfg({ ...cfg, hero_cta_secondary: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Background Image URL
            </label>
            <input
              data-testid="input-hero-image"
              type="url"
              value={cfg.hero_image_url || ""}
              onChange={(e) => setCfg({ ...cfg, hero_image_url: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
            {cfg.hero_image_url && (
              <img
                src={cfg.hero_image_url}
                alt="Hero preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
        </div>
      </section>

      {/* Admissions Banner */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
          Admissions Banner
        </h2>
        <div className="flex items-center gap-3">
          <input
            data-testid="toggle-admissions-banner"
            type="checkbox"
            id="admissions-banner-active"
            checked={!!cfg.show_admissions_banner}
            onChange={(e) => setCfg({ ...cfg, show_admissions_banner: e.target.checked })}
            className="w-4 h-4 text-[#228B22] rounded border-gray-300 focus:ring-[#228B22]"
          />
          <label htmlFor="admissions-banner-active" className="text-sm font-medium text-gray-700">
            Show admissions banner on homepage
          </label>
        </div>
        {cfg.show_admissions_banner && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Text
            </label>
            <input
              data-testid="input-admissions-banner-text"
              type="text"
              value={cfg.admissions_banner_text || ""}
              onChange={(e) => setCfg({ ...cfg, admissions_banner_text: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
          </div>
        )}
      </section>

      {/* Stats / Credibility Block */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-semibold text-gray-800">Stats / Credibility Block</h2>
          <button
            data-testid="btn-add-stat"
            onClick={addStat}
            className="text-sm text-[#228B22] font-medium hover:underline"
          >
            + Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {(cfg.stats || []).map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                data-testid={`input-stat-value-${i}`}
                type="text"
                placeholder="Value (e.g. 8,500+)"
                value={stat.value}
                onChange={(e) => updateStat(i, "value", e.target.value)}
                className="w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
              <input
                data-testid={`input-stat-label-${i}`}
                type="text"
                placeholder="Label (e.g. Students Enrolled)"
                value={stat.label}
                onChange={(e) => updateStat(i, "label", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
              <button
                data-testid={`btn-remove-stat-${i}`}
                onClick={() => removeStat(i)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {(cfg.stats || []).length === 0 && (
            <p className="text-sm text-gray-400">No stats configured. Click Add Stat to begin.</p>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-semibold text-gray-800">Homepage Quick Links</h2>
          <button
            data-testid="btn-add-quick-link"
            onClick={addQuickLink}
            className="text-sm text-[#228B22] font-medium hover:underline"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-3">
          {(cfg.quick_links || []).map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                data-testid={`input-quicklink-label-${i}`}
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateQuickLink(i, "label", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
              <input
                data-testid={`input-quicklink-url-${i}`}
                type="text"
                placeholder="URL or path"
                value={link.url}
                onChange={(e) => updateQuickLink(i, "url", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
              <button
                data-testid={`btn-remove-quicklink-${i}`}
                onClick={() => removeQuickLink(i)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          {(cfg.quick_links || []).length === 0 && (
            <p className="text-sm text-gray-400">No quick links configured.</p>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          data-testid="btn-save-homepage-bottom"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[#228B22] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
