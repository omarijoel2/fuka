import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Programme {
  id: number;
  slug: string;
  title: string;
  type: string;
  partner_name?: string;
  partner_country?: string;
  description: string;
  duration_label?: string;
  application_deadline?: string;
  next_intake?: string;
  slots_available?: number;
  stipend_amount?: number;
  stipend_currency: string;
  eligibility: string[];
  benefits: string[];
  required_documents: string[];
  status: string;
  is_featured: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  student_exchange: "Student Exchange",
  staff_exchange: "Staff Exchange",
  joint_degree: "Joint Degree",
  summer_school: "Summer School",
  research_fellowship: "Research Fellowship",
  internship: "Internship",
};

const STATUS_COLOR: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  upcoming: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-600",
  suspended: "bg-red-100 text-red-700",
};

const EMPTY_FORM = {
  slug: "", title: "", type: "student_exchange",
  partner_name: "", partner_country: "",
  description: "", duration_label: "", application_deadline: "",
  next_intake: "", slots_available: "", stipend_amount: "", stipend_currency: "USD",
  eligibility_raw: "", benefits_raw: "", required_documents_raw: "",
  status: "open", is_featured: false,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function splitLines(raw: string): string[] {
  return raw.split("\n").map((s) => s.trim()).filter(Boolean);
}

export default function ExchangeProgrammesCmsPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Programme | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/international/exchange");
      const json = await res.json();
      setProgrammes(json.data ?? []);
    } catch { setProgrammes([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(p: Programme) {
    setEditItem(p);
    setForm({
      slug: p.slug, title: p.title, type: p.type,
      partner_name: p.partner_name ?? "", partner_country: p.partner_country ?? "",
      description: p.description, duration_label: p.duration_label ?? "",
      application_deadline: p.application_deadline ?? "", next_intake: p.next_intake ?? "",
      slots_available: p.slots_available?.toString() ?? "",
      stipend_amount: p.stipend_amount?.toString() ?? "",
      stipend_currency: p.stipend_currency ?? "USD",
      eligibility_raw: (p.eligibility ?? []).join("\n"),
      benefits_raw: (p.benefits ?? []).join("\n"),
      required_documents_raw: (p.required_documents ?? []).join("\n"),
      status: p.status, is_featured: p.is_featured,
    });
    setError("");
    setShowModal(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    const payload = {
      slug: form.slug, title: form.title, type: form.type,
      partner_name: form.partner_name, partner_country: form.partner_country,
      description: form.description, duration_label: form.duration_label,
      application_deadline: form.application_deadline || null,
      next_intake: form.next_intake,
      slots_available: form.slots_available ? parseInt(form.slots_available) : null,
      stipend_amount: form.stipend_amount ? parseFloat(form.stipend_amount) : null,
      stipend_currency: form.stipend_currency,
      eligibility: splitLines(form.eligibility_raw),
      benefits: splitLines(form.benefits_raw),
      required_documents: splitLines(form.required_documents_raw),
      status: form.status, is_featured: form.is_featured,
    };
    try {
      const url = editItem
        ? `/api/admin/international/exchange/${editItem.id}`
        : "/api/admin/international/exchange";
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

  async function remove(p: Programme) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await apiRequest(`/api/admin/international/exchange/${p.id}`, { method: "DELETE" });
    load();
  }

  const filtered = programmes.filter((p) => {
    const ms = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.partner_name ?? "").toLowerCase().includes(search.toLowerCase());
    const mt = !typeFilter || p.type === typeFilter;
    return ms && mt;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowUpDown className="w-6 h-6 text-green-700" />
            Exchange Programmes
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage student and staff mobility programmes</p>
        </div>
        <button
          data-testid="new-programme-btn"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition"
          style={{ backgroundColor: "#228B22" }}
        >
          <Plus className="w-4 h-4" /> New Programme
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            data-testid="search-programmes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programmes..."
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
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Programme</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Partner</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Deadline</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No programmes found</td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.title}</div>
                    {p.is_featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded mt-0.5 inline-block">Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{TYPE_LABELS[p.type] ?? p.type}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.partner_name}
                    {p.partner_country && <span className="text-gray-400"> · {p.partner_country}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {p.application_deadline
                      ? new Date(p.application_deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "Rolling"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLOR[p.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        data-testid={`edit-programme-${p.id}`}
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        data-testid={`delete-programme-${p.id}`}
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
                {editItem ? "Edit Programme" : "New Programme"}
              </h2>
            </div>

            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programme Title *</label>
                  <input
                    data-testid="form-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. KAFU–Earlham College Student Exchange"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                  <input
                    data-testid="form-partner-name"
                    value={form.partner_name}
                    onChange={(e) => setForm({ ...form, partner_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. Earlham College"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Country</label>
                  <input
                    data-testid="form-partner-country"
                    value={form.partner_country}
                    onChange={(e) => setForm({ ...form, partner_country: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. United States"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    data-testid="form-description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration Label</label>
                  <input
                    data-testid="form-duration"
                    value={form.duration_label}
                    onChange={(e) => setForm({ ...form, duration_label: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. One semester (4 months)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Intake</label>
                  <input
                    data-testid="form-intake"
                    value={form.next_intake}
                    onChange={(e) => setForm({ ...form, next_intake: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                    placeholder="e.g. September 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    data-testid="form-deadline"
                    type="date"
                    value={form.application_deadline}
                    onChange={(e) => setForm({ ...form, application_deadline: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slots Available</label>
                  <input
                    data-testid="form-slots"
                    type="number"
                    value={form.slots_available}
                    onChange={(e) => setForm({ ...form, slots_available: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Amount</label>
                  <input
                    data-testid="form-stipend"
                    type="number"
                    value={form.stipend_amount}
                    onChange={(e) => setForm({ ...form, stipend_amount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    data-testid="form-currency"
                    value={form.stipend_currency}
                    onChange={(e) => setForm({ ...form, stipend_currency: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="KES">KES</option>
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
                    <option value="open">Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eligibility Requirements
                    <span className="text-gray-400 font-normal ml-1">(one per line)</span>
                  </label>
                  <textarea
                    data-testid="form-eligibility"
                    value={form.eligibility_raw}
                    onChange={(e) => setForm({ ...form, eligibility_raw: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none resize-none font-mono"
                    placeholder={"Year 2+ undergraduate\nMinimum GPA 3.0\nProficiency in English"}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                    <span className="text-gray-400 font-normal ml-1">(one per line)</span>
                  </label>
                  <textarea
                    data-testid="form-benefits"
                    value={form.benefits_raw}
                    onChange={(e) => setForm({ ...form, benefits_raw: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none resize-none font-mono"
                    placeholder={"Tuition waiver\nReturn economy airfare\nCampus accommodation"}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Documents
                    <span className="text-gray-400 font-normal ml-1">(one per line)</span>
                  </label>
                  <textarea
                    data-testid="form-documents"
                    value={form.required_documents_raw}
                    onChange={(e) => setForm({ ...form, required_documents_raw: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none resize-none font-mono"
                    placeholder={"Completed application form\nOfficial academic transcripts\nValid passport"}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    data-testid="form-featured"
                    id="is-featured-prog"
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="is-featured-prog" className="text-sm font-medium text-gray-700">
                    Featured programme
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
                style={{ backgroundColor: "#228B22" }}
              >
                {saving ? "Saving..." : "Save Programme"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
