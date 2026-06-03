import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from "lucide-react";
import { apiGet, apiPut } from "../lib/api";

interface CmsNavLink {
  label: string;
  url: string;
  external?: boolean;
}

interface CmsMegaGroup {
  heading: string;
  links: CmsNavLink[];
}

interface NavItem {
  label: string;
  url: string;
  type?: "link" | "mega" | "departments";
  mega_width?: number;
  mega_cols?: 2 | 3 | 4;
  mega_groups?: CmsMegaGroup[];
  mega_footer?: Array<{ label: string; url: string }>;
  children?: CmsNavLink[];
}

interface FooterGroup {
  group: string;
  items: Array<{ label: string; url: string }>;
}

interface NavConfig {
  primary_nav?: NavItem[];
  utility_nav?: Array<{ label: string; url: string }>;
  footer_nav?: FooterGroup[];
}

const TYPE_LABELS: Record<string, string> = {
  link: "Plain Link",
  mega: "Mega Menu",
  departments: "Departments (auto)",
};

function MegaGroupEditor({
  groups,
  onChange,
}: {
  groups: CmsMegaGroup[];
  onChange: (g: CmsMegaGroup[]) => void;
}) {
  const addGroup = () =>
    onChange([...groups, { heading: "", links: [] }]);

  const removeGroup = (gi: number) =>
    onChange(groups.filter((_, i) => i !== gi));

  const updateHeading = (gi: number, val: string) => {
    const g = [...groups];
    g[gi] = { ...g[gi], heading: val };
    onChange(g);
  };

  const addLink = (gi: number) => {
    const g = [...groups];
    g[gi] = { ...g[gi], links: [...g[gi].links, { label: "", url: "" }] };
    onChange(g);
  };

  const updateLink = (gi: number, li: number, field: keyof CmsNavLink, val: string | boolean) => {
    const g = [...groups];
    const links = [...g[gi].links];
    links[li] = { ...links[li], [field]: val };
    g[gi] = { ...g[gi], links };
    onChange(g);
  };

  const removeLink = (gi: number, li: number) => {
    const g = [...groups];
    g[gi] = { ...g[gi], links: g[gi].links.filter((_, i) => i !== li) };
    onChange(g);
  };

  return (
    <div className="space-y-3 mt-3">
      {groups.map((group, gi) => (
        <div key={gi} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 border-b border-gray-200">
            <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            <input
              data-testid={`mega-group-heading-${gi}`}
              type="text"
              placeholder="Group heading (e.g. Apply)"
              value={group.heading}
              onChange={(e) => updateHeading(gi, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
            <button
              data-testid={`btn-remove-group-${gi}`}
              onClick={() => removeGroup(gi)}
              className="text-red-400 hover:text-red-600 p-1"
              title="Remove group"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-3 py-2 space-y-1.5">
            {group.links.map((link, li) => (
              <div key={li} className="flex items-center gap-2 bg-white border border-gray-100 rounded px-2 py-1.5">
                <input
                  data-testid={`mega-link-label-${gi}-${li}`}
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => updateLink(gi, li, "label", e.target.value)}
                  className="w-40 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#228B22]"
                />
                <input
                  data-testid={`mega-link-url-${gi}-${li}`}
                  type="text"
                  placeholder="URL (e.g. /about or https://...)"
                  value={link.url}
                  onChange={(e) => updateLink(gi, li, "url", e.target.value)}
                  className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#228B22]"
                />
                <label className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <input
                    data-testid={`mega-link-external-${gi}-${li}`}
                    type="checkbox"
                    checked={!!link.external}
                    onChange={(e) => updateLink(gi, li, "external", e.target.checked)}
                    className="rounded"
                  />
                  External
                </label>
                <button
                  data-testid={`btn-remove-mega-link-${gi}-${li}`}
                  onClick={() => removeLink(gi, li)}
                  className="text-red-400 hover:text-red-600 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              data-testid={`btn-add-mega-link-${gi}`}
              onClick={() => addLink(gi)}
              className="flex items-center gap-1 text-xs text-[#228B22] hover:underline mt-1"
            >
              <Plus className="w-3 h-3" /> Add Link
            </button>
          </div>
        </div>
      ))}
      <button
        data-testid="btn-add-mega-group"
        onClick={addGroup}
        className="flex items-center gap-1.5 text-xs text-[#228B22] font-medium hover:underline"
      >
        <Plus className="w-3.5 h-3.5" /> Add Group
      </button>
    </div>
  );
}

function MegaFooterEditor({
  footer,
  onChange,
}: {
  footer: Array<{ label: string; url: string }>;
  onChange: (f: Array<{ label: string; url: string }>) => void;
}) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-gray-500 mb-1.5">Footer quick-links</p>
      <div className="space-y-1.5">
        {footer.map((f, fi) => (
          <div key={fi} className="flex items-center gap-2">
            <input
              data-testid={`mega-footer-label-${fi}`}
              type="text"
              placeholder="Label"
              value={f.label}
              onChange={(e) => {
                const nf = [...footer];
                nf[fi] = { ...nf[fi], label: e.target.value };
                onChange(nf);
              }}
              className="w-36 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#228B22]"
            />
            <input
              data-testid={`mega-footer-url-${fi}`}
              type="text"
              placeholder="URL"
              value={f.url}
              onChange={(e) => {
                const nf = [...footer];
                nf[fi] = { ...nf[fi], url: e.target.value };
                onChange(nf);
              }}
              className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#228B22]"
            />
            <button
              data-testid={`btn-remove-footer-link-${fi}`}
              onClick={() => onChange(footer.filter((_, i) => i !== fi))}
              className="text-red-400 hover:text-red-600 p-0.5"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          data-testid="btn-add-footer-link"
          onClick={() => onChange([...footer, { label: "", url: "" }])}
          className="flex items-center gap-1 text-xs text-[#228B22] hover:underline"
        >
          <Plus className="w-3 h-3" /> Add Footer Link
        </button>
      </div>
    </div>
  );
}

function PrimaryNavItemRow({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: NavItem;
  index: number;
  onUpdate: (i: number, updated: NavItem) => void;
  onRemove: (i: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const type = item.type ?? (item.mega_groups?.length ? "mega" : item.children?.length ? "mega" : "link");

  const updateField = (field: keyof NavItem, val: unknown) =>
    onUpdate(index, { ...item, [field]: val });

  const setType = (t: "link" | "mega" | "departments") => {
    const updated: NavItem = { label: item.label, url: item.url, type: t };
    if (t === "mega") {
      updated.mega_groups = item.mega_groups ?? [];
      updated.mega_footer = item.mega_footer ?? [];
      updated.mega_width = item.mega_width ?? 480;
      updated.mega_cols = item.mega_cols ?? 2;
    }
    onUpdate(index, updated);
  };

  const typeBadgeColor: Record<string, string> = {
    link: "bg-gray-100 text-gray-600",
    mega: "bg-green-100 text-green-700",
    departments: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
        <input
          data-testid={`nav-label-${index}`}
          type="text"
          placeholder="Label"
          value={item.label}
          onChange={(e) => updateField("label", e.target.value)}
          className="w-28 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
        />
        <input
          data-testid={`nav-url-${index}`}
          type="text"
          placeholder="URL"
          value={item.url}
          onChange={(e) => updateField("url", e.target.value)}
          className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
        />
        <select
          data-testid={`nav-type-${index}`}
          value={type}
          onChange={(e) => setType(e.target.value as "link" | "mega" | "departments")}
          className={`border border-gray-300 rounded px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#228B22] ${typeBadgeColor[type] ?? ""}`}
        >
          <option value="link">Plain Link</option>
          <option value="mega">Mega Menu</option>
          <option value="departments">Departments</option>
        </select>
        {type === "mega" && (
          <button
            data-testid={`btn-toggle-mega-${index}`}
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs text-[#228B22] font-medium bg-green-50 hover:bg-green-100 px-2 py-1.5 rounded border border-green-200 transition-colors whitespace-nowrap"
          >
            {(item.mega_groups?.length ?? 0)} groups
            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}
        <button
          data-testid={`btn-remove-nav-${index}`}
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 p-1"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {type === "mega" && expanded && (
        <div className="border-t border-gray-200 bg-white px-4 pt-3 pb-4">
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-1.5 text-xs text-gray-600">
              Width (px):
              <input
                data-testid={`nav-mega-width-${index}`}
                type="number"
                value={item.mega_width ?? 480}
                onChange={(e) => updateField("mega_width", Number(e.target.value))}
                className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#228B22]"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-600">
              Columns:
              <select
                data-testid={`nav-mega-cols-${index}`}
                value={item.mega_cols ?? 2}
                onChange={(e) => updateField("mega_cols", Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#228B22]"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>
          </div>
          <p className="text-xs font-semibold text-gray-600 mb-1">Menu Groups</p>
          <MegaGroupEditor
            groups={item.mega_groups ?? []}
            onChange={(g) => updateField("mega_groups", g)}
          />
          <div className="border-t border-gray-100 mt-3 pt-3">
            <MegaFooterEditor
              footer={item.mega_footer ?? []}
              onChange={(f) => updateField("mega_footer", f)}
            />
          </div>
        </div>
      )}

      {type === "departments" && (
        <div className="border-t border-gray-100 px-4 py-2 bg-blue-50">
          <p className="text-xs text-blue-600">
            This item renders the auto-generated departments mega-menu (grouped by school from the database). No manual editing needed.
          </p>
        </div>
      )}
    </div>
  );
}

function NavItemRow({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: { label: string; url: string };
  index: number;
  onUpdate: (i: number, field: "label" | "url", val: string) => void;
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
        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
      />
      <input
        data-testid={`nav-url-${index}`}
        type="text"
        placeholder="URL"
        value={item.url}
        onChange={(e) => onUpdate(index, "url", e.target.value)}
        className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
      />
      <button
        data-testid={`btn-remove-nav-${index}`}
        onClick={() => onRemove(index)}
        className="text-red-500 hover:text-red-700 p-1"
      >
        <Trash2 className="w-4 h-4" />
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
      .then((d) => {
        const raw: NavConfig = d || {};
        // Migrate legacy flat children[] → mega_groups[] format.
        // The original seeder used {children:[{label,url},...]} but the editor
        // expects {mega_groups:[{heading,links:[...]}]}. Migrate on load so
        // existing live-server data becomes editable immediately. Once the user
        // saves the page the migrated format is written back.
        if (raw.primary_nav) {
          raw.primary_nav = raw.primary_nav.map((item) => {
            const hasOldChildren = (item.children?.length ?? 0) > 0;
            const hasNewGroups  = (item.mega_groups?.length ?? 0) > 0;
            if (hasOldChildren && !hasNewGroups) {
              return {
                label:       item.label,
                url:         item.url,
                type:        "mega" as const,
                mega_width:  item.mega_width ?? 480,
                mega_cols:   item.mega_cols  ?? 2,
                // Wrap the flat children list into a single unnamed group so
                // every link is visible. The editor can then be used to split
                // them into labelled groups before saving.
                mega_groups: [{ heading: "", links: item.children! }],
                mega_footer: item.mega_footer ?? [],
              };
            }
            return item;
          });
        }
        setCfg(raw);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false); setError("");
    try {
      await apiPut("/site-config/navigation", cfg);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updatePrimary = (i: number, updated: NavItem) => {
    const items = [...(cfg.primary_nav || [])];
    items[i] = updated;
    setCfg({ ...cfg, primary_nav: items });
  };
  const addPrimary = () =>
    setCfg({ ...cfg, primary_nav: [...(cfg.primary_nav || []), { label: "", url: "", type: "link" }] });
  const removePrimary = (i: number) =>
    setCfg({ ...cfg, primary_nav: (cfg.primary_nav || []).filter((_, idx) => idx !== i) });

  const updateUtility = (i: number, field: "label" | "url", val: string) => {
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
  const updateFooterItem = (gi: number, ii: number, field: "label" | "url", val: string) => {
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
            Manage primary menu groups and links, utility links, and footer navigation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Saved</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            data-testid="btn-save-navigation"
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-[#228B22] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            data-testid={`tab-nav-${t.id}`}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-[#228B22] text-[#228B22]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "primary" && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            <p className="text-xs text-amber-700">
              <strong>Mega Menu</strong> items render grouped columns with headings on the live site.
              Set type to <strong>Plain Link</strong> for top-level links with no dropdown.
              The <strong>Departments</strong> type auto-generates from the university database.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                Top-level navigation items. Expand any Mega Menu item to edit its groups and links.
              </p>
              <button
                data-testid="btn-add-primary-nav"
                onClick={addPrimary}
                className="flex items-center gap-1 text-sm text-[#228B22] font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            {(cfg.primary_nav || []).map((item, i) => (
              <PrimaryNavItemRow
                key={i}
                item={item}
                index={i}
                onUpdate={updatePrimary}
                onRemove={removePrimary}
              />
            ))}
            {(cfg.primary_nav || []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No primary nav items.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "utility" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              Utility links shown in the top utility bar (Student Portal, E-Learning, etc.).
            </p>
            <button
              data-testid="btn-add-utility-nav"
              onClick={addUtility}
              className="flex items-center gap-1 text-sm text-[#228B22] font-medium hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Item
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
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#228B22]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    data-testid={`btn-add-footer-item-${gi}`}
                    onClick={() => addFooterItem(gi)}
                    className="flex items-center gap-1 text-sm text-[#228B22] font-medium hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Link
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
                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
                  />
                  <input
                    data-testid={`footer-item-url-${gi}-${ii}`}
                    type="text"
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) => updateFooterItem(gi, ii, "url", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#228B22]"
                  />
                  <button
                    data-testid={`btn-remove-footer-item-${gi}-${ii}`}
                    onClick={() => removeFooterItem(gi, ii)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ))}
          <button
            data-testid="btn-add-footer-group"
            onClick={addFooterGroup}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#228B22] hover:text-[#228B22] transition-colors"
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
          className="px-6 py-2 bg-[#228B22] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
