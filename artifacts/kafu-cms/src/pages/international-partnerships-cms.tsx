import { useState } from "react";
import { Plus, Search, Edit, Trash2, ExternalLink, Globe } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Partnership {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  country: string;
  country_code?: string;
  type: string;
  status: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  mou_date?: string;
  mou_expiry?: string;
  collaboration_areas: string[];
  is_featured: boolean;
  sort_order: number;
}

const TYPE_LABELS: Record<string, string> = {
  university: "University",
  research_institute: "Research Institute",
  government: "Government",
  ngo: "NGO",
  development_agency: "Development Agency",
  quaker: "Quaker Institution",
  professional_body: "Professional Body",
};

const TYPE_COLOR: Record<string, string> = {
  quaker: "bg-amber-100 text-amber-800",
  university: "bg-blue-100 text-blue-800",
  research_institute: "bg-purple-100 text-purple-800",
  development_agency: "bg-green-100 text-green-800",
  government: "bg-gray-100 text-gray-700",
  ngo: "bg-orange-100 text-orange-800",
  professional_body: "bg-indigo-100 text-indigo-800",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-800",
};

const EMPTY_FORM = {
  slug: "", name: "", short_name: "", country: "", country_code: "",
  type: "university", status: "active", description: "", logo_url: "",
  website_url: "", mou_date: "", mou_expiry: "", collaboration_areas_raw: "",
  is_featured: false, sort_order: 0,
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function InternationalPartnershipsCmsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Partnership | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/international/partnerships");
      const json = await res.json();
      setPartnerships(json.data ?? []);
    } catch { setPartnerships([]); }
    setLoading(false);
  }

  useState(() => { load(); });

  function openNew() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(p: Partnership) {
    setEditItem(p);
    setForm({
      slug: p.slug, name: p.name, short_name: p.short_name ?? "",
      country: p.country, country_code: p.country_code ?? "",
      type: p.type, status: p.status, description: p.description ?? "",
      logo_url: p.logo_url ?? "", website_url: p.website_url ?? "",
      mou_date: p.mou_date ?? "", mou_expiry: p.mou_expiry ?? "",
      collaboration_areas_raw: (p.collaboration_areas ?? []).join(", "),
      is_featured: p.is_featured, sort_order: p.sort_order,
    });
    setError("");
    setShowModal(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      collaboration_areas: form.collaboration_areas_raw.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      const url = editItem
        ? `/api/admin/international/partnerships/${editItem.id}`
        : "/api/admin/international/partnerships";
      const method = editItem ? "PUT" : "POST";
      const res = await apiRequest(url, { method, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message ?? "Save failed");
        setSaving(false);
        return;
      }
      setShowModal(false);
      load();
    } catch (e: any) { setError(e.message ?? "Save failed"); }
    setSaving(false);
  }

  async function remove(p: Partnership) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await apiRequest(`/api/admin/international/partnerships/${p.id}`, { method: "DELETE" });
    load();
  }

  const filtered = partnerships.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || p.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-green-700" />
            International Partnerships
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage KAFU's global institutional network</p>
        </div>
        <button
          data-testid="new-partnership-btn"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition"
          style={{ backgroundColor: "#1A5C38" }}
        >
          <Plus className="w-4 h-4" /> New Partnership
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            data-testid="search-partnerships"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or country..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
          />
        </div>
        <select
          data-testid="filter-type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
        >
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Partner</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Country</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Featured</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No partnerships found</td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                        <ExternalLink className="w-3 h-3" /> Website
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.country}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLOR[p.type] ?? "bg-gray-100 text-gray-700"}`}>
                      {TYPE_LABELS[p.type] ?? p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLOR[p.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_featured ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        data-testid={`edit-partnership-${p.id}`}
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        data-testid={`delete-partnership-${p.id}`}
                        onClick={() => remove(p)}
                        className="p-1.5 rounded hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editItem ? "Edit Partnership" : "New Partnership"}
              </h2>
            </div>

            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                  <input
                    data-testid="form-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. Earlham College"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                  <input
                    data-testid="form-short-name"
                    value={form.short_name}
                    onChange={(e) => setForm({ ...form, short_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. Earlham"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    data-testid="form-slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    data-testid="form-country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. United States"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                  <input
                    data-testid="form-country-code"
                    value={form.country_code}
                    onChange={(e) => setForm({ ...form, country_code: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none font-mono uppercase"
                    placeholder="USA"
                    maxLength={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    data-testid="form-type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  >
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    data-testid="form-status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    data-testid="form-description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none resize-none"
                    placeholder="Describe the partnership..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    data-testid="form-website"
                    value={form.website_url}
                    onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    data-testid="form-logo"
                    value={form.logo_url}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MOU Date</label>
                  <input
                    data-testid="form-mou-date"
                    type="date"
                    value={form.mou_date}
                    onChange={(e) => setForm({ ...form, mou_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MOU Expiry</label>
                  <input
                    data-testid="form-mou-expiry"
                    type="date"
                    value={form.mou_expiry}
                    onChange={(e) => setForm({ ...form, mou_expiry: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collaboration Areas
                    <span className="text-gray-400 font-normal ml-1">(comma-separated slugs, e.g. student_exchange, research)</span>
                  </label>
                  <input
                    data-testid="form-areas"
                    value={form.collaboration_areas_raw}
                    onChange={(e) => setForm({ ...form, collaboration_areas_raw: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="student_exchange, research, joint_degrees"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    data-testid="form-sort"
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    data-testid="form-featured"
                    id="is-featured"
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="is-featured" className="text-sm font-medium text-gray-700">
                    Featured on homepage / landing page
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                data-testid="modal-cancel"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                data-testid="modal-save"
                onClick={save}
                disabled={saving}
                className="px-6 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
                style={{ backgroundColor: "#1A5C38" }}
              >
                {saving ? "Saving..." : "Save Partnership"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
