import { useState, useEffect } from "react";
import { apiGet, apiPut } from "../lib/api";

interface UtilityLink {
  label: string;
  url: string;
}

interface NavConfig {
  utility_nav?: UtilityLink[];
  [key: string]: unknown;
}

interface SiteConfig {
  site_name?: string;
  site_tagline?: string;
  emergency_banner_active?: boolean;
  emergency_banner_text?: string;
  emergency_banner_type?: string;
  announcement_bar_active?: boolean;
  announcement_bar_text?: string;
  announcement_bar_url?: string;
  maintenance_mode?: boolean;
  social_facebook?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_youtube?: string;
  social_instagram?: string;
  footer_copyright?: string;
  footer_tagline?: string;
}

export default function SiteControlsPage() {
  const [cfg, setCfg] = useState<SiteConfig>({});
  const [nav, setNav] = useState<NavConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiGet("/site-config/site"), apiGet("/site-config/navigation")])
      .then(([site, navigation]) => {
        setCfg(site || {});
        setNav(navigation || {});
        setLoading(false);
      })
      .catch(() => { setError("Failed to load site config"); setLoading(false); });
  }, []);

  const utilityLinks: UtilityLink[] = Array.isArray(nav.utility_nav) ? nav.utility_nav : [];

  const updateUtilityLink = (index: number, field: keyof UtilityLink, value: string) => {
    const next = utilityLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setNav({ ...nav, utility_nav: next });
  };

  const addUtilityLink = () => {
    setNav({ ...nav, utility_nav: [...utilityLinks, { label: "", url: "" }] });
  };

  const removeUtilityLink = (index: number) => {
    setNav({ ...nav, utility_nav: utilityLinks.filter((_, i) => i !== index) });
  };

  const moveUtilityLink = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= utilityLinks.length) return;
    const next = [...utilityLinks];
    [next[index], next[target]] = [next[target], next[index]];
    setNav({ ...nav, utility_nav: next });
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await apiPut("/site-config/site", cfg);
      await apiPut("/site-config/navigation", { utility_nav: utilityLinks });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Site Controls</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage site-wide alerts, banners, social links, and global settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Saved</span>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            data-testid="btn-save-site-controls"
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-[#228B22] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Emergency Banner */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Emergency Banner</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Shown prominently at the top of all public pages. Use for critical notices only.
            </p>
          </div>
          {cfg.emergency_banner_active && (
            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
              ACTIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            data-testid="toggle-emergency-banner"
            type="checkbox"
            id="emergency-active"
            checked={!!cfg.emergency_banner_active}
            onChange={(e) => setCfg({ ...cfg, emergency_banner_active: e.target.checked })}
            className="w-4 h-4 text-red-600 rounded border-gray-300"
          />
          <label htmlFor="emergency-active" className="text-sm font-medium text-gray-700">
            Activate emergency banner
          </label>
        </div>
        {cfg.emergency_banner_active && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
              <input
                data-testid="input-emergency-text"
                type="text"
                value={cfg.emergency_banner_text || ""}
                onChange={(e) => setCfg({ ...cfg, emergency_banner_text: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. University offices closed on 14 April 2026 due to public holiday."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
              <select
                data-testid="select-emergency-type"
                value={cfg.emergency_banner_type || "warning"}
                onChange={(e) => setCfg({ ...cfg, emergency_banner_type: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              >
                <option value="warning">Warning (amber)</option>
                <option value="danger">Danger (red)</option>
                <option value="info">Info (blue)</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* Announcement Bar */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Announcement Bar</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Subtle top bar for promotions and non-urgent announcements.
            </p>
          </div>
          {cfg.announcement_bar_active && (
            <span className="px-2 py-1 text-xs font-semibold bg-[#DAA520]/20 text-[#DAA520] rounded-full">
              ACTIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            data-testid="toggle-announcement-bar"
            type="checkbox"
            id="announcement-active"
            checked={!!cfg.announcement_bar_active}
            onChange={(e) => setCfg({ ...cfg, announcement_bar_active: e.target.checked })}
            className="w-4 h-4 text-[#228B22] rounded border-gray-300"
          />
          <label htmlFor="announcement-active" className="text-sm font-medium text-gray-700">
            Show announcement bar
          </label>
        </div>
        {cfg.announcement_bar_active && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
              <input
                data-testid="input-announcement-text"
                type="text"
                value={cfg.announcement_bar_text || ""}
                onChange={(e) => setCfg({ ...cfg, announcement_bar_text: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (optional)</label>
              <input
                data-testid="input-announcement-url"
                type="text"
                value={cfg.announcement_bar_url || ""}
                onChange={(e) => setCfg({ ...cfg, announcement_bar_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
              />
            </div>
          </div>
        )}
      </section>

      {/* Maintenance Mode */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="border-b border-gray-100 pb-3 mb-4">
          <h2 className="text-base font-semibold text-gray-800">Maintenance Mode</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            When active, public visitors see a maintenance page. Admin users are unaffected.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            data-testid="toggle-maintenance-mode"
            type="checkbox"
            id="maintenance-mode"
            checked={!!cfg.maintenance_mode}
            onChange={(e) => setCfg({ ...cfg, maintenance_mode: e.target.checked })}
            className="w-4 h-4 text-red-600 rounded border-gray-300"
          />
          <label htmlFor="maintenance-mode" className="text-sm font-medium text-gray-700">
            Enable maintenance mode
          </label>
          {cfg.maintenance_mode && (
            <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
              Site is in maintenance mode
            </span>
          )}
        </div>
      </section>

      {/* Top Banner Links */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Top Banner Links</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              The utility links shown in the slim bar at the very top of every public page
              (Student Portal, Staff Login, Library, etc.). Use full URLs for external systems
              (e.g. https://kafu.ac.ke/staff) or a path like /contact for on-site pages.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {utilityLinks.length === 0 && (
            <p className="text-sm text-gray-400">No top banner links yet. Add one below.</p>
          )}
          {utilityLinks.map((link, i) => (
            <div key={i} className="flex items-end gap-2" data-testid={`utility-link-row-${i}`}>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                <input
                  data-testid={`input-utility-label-${i}`}
                  type="text"
                  value={link.label || ""}
                  onChange={(e) => updateUtilityLink(i, "label", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
                  placeholder="e.g. Staff Login"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                <input
                  data-testid={`input-utility-url-${i}`}
                  type="text"
                  value={link.url || ""}
                  onChange={(e) => updateUtilityLink(i, "url", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
                  placeholder="https://kafu.ac.ke/staff or /contact"
                />
              </div>
              <div className="flex items-center gap-1 pb-0.5">
                <button
                  data-testid={`btn-utility-up-${i}`}
                  type="button"
                  onClick={() => moveUtilityLink(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                  className="px-2 py-2 text-gray-500 hover:text-gray-800 disabled:opacity-30"
                >
                  Up
                </button>
                <button
                  data-testid={`btn-utility-down-${i}`}
                  type="button"
                  onClick={() => moveUtilityLink(i, 1)}
                  disabled={i === utilityLinks.length - 1}
                  title="Move down"
                  className="px-2 py-2 text-gray-500 hover:text-gray-800 disabled:opacity-30"
                >
                  Down
                </button>
                <button
                  data-testid={`btn-utility-remove-${i}`}
                  type="button"
                  onClick={() => removeUtilityLink(i)}
                  title="Remove link"
                  className="px-2 py-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          data-testid="btn-utility-add"
          type="button"
          onClick={addUtilityLink}
          className="px-3 py-2 border border-dashed border-gray-300 text-sm text-gray-600 rounded-lg hover:border-[#228B22] hover:text-[#228B22]"
        >
          Add Link
        </button>
      </section>

      {/* Social Links */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
          Social Media Links
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { key: "social_facebook", label: "Facebook URL" },
            { key: "social_twitter", label: "Twitter / X URL" },
            { key: "social_linkedin", label: "LinkedIn URL" },
            { key: "social_youtube", label: "YouTube URL" },
            { key: "social_instagram", label: "Instagram URL" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                data-testid={`input-${key}`}
                type="url"
                value={(cfg as any)[key] || ""}
                onChange={(e) => setCfg({ ...cfg, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Content */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">
          Footer Content
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Line</label>
            <input
              data-testid="input-footer-copyright"
              type="text"
              value={cfg.footer_copyright || ""}
              onChange={(e) => setCfg({ ...cfg, footer_copyright: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Tagline / Address</label>
            <input
              data-testid="input-footer-tagline"
              type="text"
              value={cfg.footer_tagline || ""}
              onChange={(e) => setCfg({ ...cfg, footer_tagline: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          data-testid="btn-save-site-controls-bottom"
          onClick={save}
          disabled={saving}
          className="px-6 py-2 bg-[#228B22] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
