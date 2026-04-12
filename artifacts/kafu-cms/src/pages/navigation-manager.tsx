import { useState, useEffect } from "react";
import { apiGet, apiPut } from "../lib/api";

interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
}

interface FooterGroup {
  group: string;
  items: NavItem[];
}

interface NavConfig {
  primary_nav?: NavItem[];
  utility_nav?: NavItem[];
  footer_nav?: FooterGroup[];
}

function NavItemRow({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: NavItem;
  index: number;
  onUpdate: (i: number, field: keyof NavItem, val: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
      <input
        data-testid={`nav-label-${index}`}
        type="text"
        placeholder="Label"
        value={item.label}
        onChange={(e) => onUpdate(index, "label", e.target.value)}
        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
      />
      <input
        data-testid={`nav-url-${index}`}
        type="text"
        placeholder="URL"
        value={item.url}
        onChange={(e) => onUpdate(index, "url", e.target.value)}
        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
      />
      <button
        data-testid={`btn-remove-nav-${index}`}
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700 text-xs px-2"
      >
        Remove
      </button>
    </div>
  );
}

export default function NavigationManagerPage() {
  const [cfg, setCfg] = useState<NavConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"primary" | "utility" | "footer">("primary");

  useEffect(() => {
    apiGet("/site-config/navigation")
      .then((d) => { setCfg(d || {}); setLoading(false); })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false); setError("");
    try {
      await apiPut("/site-config/navigation", cfg);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updatePrimary = (i: number, field: keyof NavItem, val: string) => {
    const items = [...(cfg.primary_nav || [])];
    items[i] = { ...items[i], [field]: val };
    setCfg({ ...cfg, primary_nav: items });
  };
  const addPrimary = () =>
    setCfg({ ...cfg, primary_nav: [...(cfg.primary_nav || []), { label: "", url: "", children: [] }] });
  const removePrimary = (i: number) =>
    setCfg({ ...cfg, primary_nav: (cfg.primary_nav || []).filter((_, idx) => idx !== i) });

  const updateUtility = (i: number, field: keyof NavItem, val: string) => {
    const items = [...(cfg.utility_nav || [])];
    items[i] = { ...items[i], [field]: val };
    setCfg({ ...cfg, utility_nav: items });
  };
  const addUtility = () =>
    setCfg({ ...cfg, utility_nav: [...(cfg.utility_nav || []), { label: "", url: "" }] });
  const removeUtility = (i: number) =>
    setCfg({ ...cfg, utility_nav: (cfg.utility_nav || []).filter((_, idx) => idx !== i) });

  const updateFooterGroupName = (gi: number, val: string) => {
    const groups = [...(cfg.footer_nav || [])];
    groups[gi] = { ...groups[gi], group: val };
    setCfg({ ...cfg, footer_nav: groups });
  };
  const updateFooterItem = (gi: number, ii: number, field: keyof NavItem, val: string) => {
    const groups = [...(cfg.footer_nav || [])];
    const items = [...(groups[gi].items || [])];
    items[ii] = { ...items[ii], [field]: val };
    groups[gi] = { ...groups[gi], items };
    setCfg({ ...cfg, footer_nav: groups });
  };
  const addFooterItem = (gi: number) => {
    const groups = [...(cfg.footer_nav || [])];
    groups[gi] = { ...groups[gi], items: [...(groups[gi].items || []), { label: "", url: "" }] };
    setCfg({ ...cfg, footer_nav: groups });
  };
  const removeFooterItem = (gi: number, ii: number) => {
    const groups = [...(cfg.footer_nav || [])];
    groups[gi] = { ...groups[gi], items: (groups[gi].items || []).filter((_, idx) => idx !== ii) };
    setCfg({ ...cfg, footer_nav: groups });
  };
  const addFooterGroup = () =>
    setCfg({ ...cfg, footer_nav: [...(cfg.footer_nav || []), { group: "", items: [] }] });
  const removeFooterGroup = (gi: number) =>
    setCfg({ ...cfg, footer_nav: (cfg.footer_nav || []).filter((_, idx) => idx !== gi) });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading navigation...</div>;

  const tabs = [
    { id: "primary", label: "Primary Navigation" },
    { id: "utility", label: "Utility Navigation" },
    { id: "footer", label: "Footer Navigation" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Navigation Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage primary menu, utility links, and footer navigation structure.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Saved</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            data-testid="btn-save-navigation"
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-[#1A5C38] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            data-testid={`tab-nav-${t.id}`}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-[#1A5C38] text-[#1A5C38]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Primary Nav */}
      {activeTab === "primary" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              Top-level navigation items shown in the main site header.
            </p>
            <button
              data-testid="btn-add-primary-nav"
              onClick={addPrimary}
              className="text-sm text-[#1A5C38] font-medium hover:underline"
            >
              + Add Item
            </button>
          </div>
          {(cfg.primary_nav || []).map((item, i) => (
            <NavItemRow key={i} item={item} index={i} onUpdate={updatePrimary} onRemove={removePrimary} />
          ))}
          {(cfg.primary_nav || []).length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No primary nav items.</p>
          )}
        </div>
      )}

      {/* Utility Nav */}
      {activeTab === "utility" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              Utility links shown in the top utility bar (Student Portal, E-Learning, etc.).
            </p>
            <button
              data-testid="btn-add-utility-nav"
              onClick={addUtility}
              className="text-sm text-[#1A5C38] font-medium hover:underline"
            >
              + Add Item
            </button>
          </div>
          {(cfg.utility_nav || []).map((item, i) => (
            <NavItemRow key={i} item={item} index={i} onUpdate={updateUtility} onRemove={removeUtility} />
          ))}
          {(cfg.utility_nav || []).length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No utility nav items.</p>
          )}
        </div>
      )}

      {/* Footer Nav */}
      {activeTab === "footer" && (
        <div className="space-y-4">
          {(cfg.footer_nav || []).map((group, gi) => (
            <div key={gi} className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Group name:</span>
                  <input
                    data-testid={`footer-group-name-${gi}`}
                    type="text"
                    value={group.group}
                    onChange={(e) => updateFooterGroupName(gi, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    data-testid={`btn-add-footer-item-${gi}`}
                    onClick={() => addFooterItem(gi)}
                    className="text-sm text-[#1A5C38] font-medium hover:underline"
                  >
                    + Add Link
                  </button>
                  <button
                    data-testid={`btn-remove-footer-group-${gi}`}
                    onClick={() => removeFooterGroup(gi)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove Group
                  </button>
                </div>
              </div>
              {(group.items || []).map((item, ii) => (
                <div key={ii} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <input
                    data-testid={`footer-item-label-${gi}-${ii}`}
                    type="text"
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => updateFooterItem(gi, ii, "label", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                  <input
                    data-testid={`footer-item-url-${gi}-${ii}`}
                    type="text"
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) => updateFooterItem(gi, ii, "url", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                  <button
                    data-testid={`btn-remove-footer-item-${gi}-${ii}`}
                    onClick={() => removeFooterItem(gi, ii)}
                    className="text-red-500 hover:text-red-700 text-xs px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ))}
          <button
            data-testid="btn-add-footer-group"
            onClick={addFooterGroup}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors"
          >
            + Add Footer Group
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          data-testid="btn-save-navigation-bottom"
          onClick={save}
          disabled={saving}
          className="px-6 py-2 bg-[#1A5C38] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
