import React, { useState, useCallback, useEffect } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { Building2, Plus, Edit2, Trash2, Search, Eye, Phone, Mail, Clock } from "lucide-react";

interface Campus { id: number; name: string; slug: string; }
interface Office {
  id: number;
  name: string;
  slug: string;
  category: string;
  campus_id?: number;
  campus?: { id: number; name: string; slug: string };
  building?: string;
  contact_person?: string;
  public_phone?: string;
  public_email?: string;
  whatsapp?: string;
  physical_location?: string;
  latitude?: number | null;
  longitude?: number | null;
  operating_hours?: { mon_fri?: string; sat?: string; sun?: string };
  summary?: string;
  support_scope?: string;
  related_links?: { label: string; url: string }[];
  sort_order: number;
  status: "active" | "inactive";
  seo_meta?: { title?: string; description?: string } | null;
}

const CATEGORIES = [
  { value: "admissions", label: "Admissions" },
  { value: "registrar", label: "Registrar" },
  { value: "finance", label: "Finance" },
  { value: "student_affairs", label: "Student Affairs" },
  { value: "ict", label: "ICT Support" },
  { value: "library", label: "Library" },
  { value: "health", label: "Health Services" },
  { value: "international", label: "International" },
  { value: "research", label: "Research" },
  { value: "procurement", label: "Procurement" },
  { value: "accommodation", label: "Accommodation" },
  { value: "other", label: "Other" },
];

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(CATEGORIES.map(c => [c.value, c.label]));

const EMPTY_FORM = {
  name: "", slug: "", category: "admissions",
  campus_id: "",
  building: "", contact_person: "",
  public_phone: "", public_email: "", whatsapp: "",
  physical_location: "", latitude: "", longitude: "",
  hours_mon_fri: "", hours_sat: "", hours_sun: "",
  summary: "", support_scope: "",
  related_links_raw: "",
  sort_order: 0, status: "active" as "active" | "inactive",
  meta_title: "", meta_description: "",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function OfficesCmsPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Office | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Office | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [offRes, camRes] = await Promise.all([
        apiGet("/service-points"),
        apiGet("/campuses"),
      ]);
      setOffices(offRes.data ?? offRes ?? []);
      setCampuses(camRes.data ?? camRes ?? []);
    } catch {
      showToast("error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function setField<K extends keyof typeof EMPTY_FORM>(key: K, value: typeof EMPTY_FORM[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !editing) next.slug = slugify(value as string);
      return next;
    });
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(office: Office) {
    setEditing(office);
    setForm({
      name: office.name, slug: office.slug, category: office.category,
      campus_id: office.campus_id ? String(office.campus_id) : "",
      building: office.building ?? "", contact_person: office.contact_person ?? "",
      public_phone: office.public_phone ?? "", public_email: office.public_email ?? "",
      whatsapp: office.whatsapp ?? "", physical_location: office.physical_location ?? "",
      latitude: office.latitude != null ? String(office.latitude) : "",
      longitude: office.longitude != null ? String(office.longitude) : "",
      hours_mon_fri: office.operating_hours?.mon_fri ?? "",
      hours_sat: office.operating_hours?.sat ?? "",
      hours_sun: office.operating_hours?.sun ?? "",
      summary: office.summary ?? "", support_scope: office.support_scope ?? "",
      related_links_raw: (office.related_links ?? []).map(l => `${l.label}|${l.url}`).join("\n"),
      sort_order: office.sort_order, status: office.status,
      meta_title: office.seo_meta?.title ?? "",
      meta_description: office.seo_meta?.description ?? "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.category) return;
    setSaving(true);
    try {
      const operating_hours: Record<string, string> = {};
      if (form.hours_mon_fri) operating_hours.mon_fri = form.hours_mon_fri;
      if (form.hours_sat) operating_hours.sat = form.hours_sat;
      if (form.hours_sun) operating_hours.sun = form.hours_sun;
      const related_links = (form.related_links_raw || "")
        .split("\n").map(s => s.trim()).filter(Boolean)
        .map(line => { const [label, url] = line.split("|"); return { label: label?.trim() ?? "", url: url?.trim() ?? "" }; })
        .filter(l => l.label && l.url);
      const payload = {
        ...form,
        campus_id: form.campus_id ? parseInt(form.campus_id as string) : null,
        latitude: form.latitude ? parseFloat(form.latitude as string) : null,
        longitude: form.longitude ? parseFloat(form.longitude as string) : null,
        operating_hours: Object.keys(operating_hours).length ? operating_hours : null,
        related_links,
        seo_meta: (form.meta_title || form.meta_description) ? { title: form.meta_title, description: form.meta_description } : null,
      };
      if (editing) {
        await apiPut(`/service-points/${editing.id}`, payload);
        showToast("success", "Office updated.");
      } else {
        await apiPost("/service-points", payload);
        showToast("success", "Office created.");
      }
      setShowModal(false);
      await fetchData();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/service-points/${deleteTarget.id}`);
      showToast("success", "Office deleted.");
      setDeleteTarget(null);
      await fetchData();
    } catch {
      showToast("error", "Delete failed.");
    }
  }

  const filtered = offices.filter(o => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || (o.summary ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategory || o.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toastMsg.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" />Offices & Service Points</h1>
          <p className="text-sm text-gray-500 mt-1">Manage university offices, service centres, and contact points.</p>
        </div>
        <button onClick={openCreate} data-testid="btn-create-office"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Office
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="search" placeholder="Search offices…" value={search} onChange={e => setSearch(e.target.value)}
            data-testid="input-office-cms-search"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          data-testid="select-office-cms-category"
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading offices…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No offices found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Office</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Campus</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(office => (
                <tr key={office.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" data-testid={`office-row-${office.slug}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{office.name}</p>
                    {office.building && <p className="text-xs text-gray-400">{office.building}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      {CATEGORY_LABELS[office.category] ?? office.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{office.campus?.name ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {office.public_phone && (
                      <p className="flex items-center gap-1 text-xs text-gray-600"><Phone className="w-3 h-3" />{office.public_phone}</p>
                    )}
                    {office.public_email && (
                      <p className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" />{office.public_email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${office.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {office.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <a href={`/offices/${office.slug}`} target="_blank" rel="noopener noreferrer"
                        title="View on site" className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => openEdit(office)} data-testid={`btn-edit-office-${office.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(office)} data-testid={`btn-delete-office-${office.id}`}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editing ? `Edit: ${editing.name}` : "Add Office / Service Point"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
              {/* Basic */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Office Name *</label>
                    <input type="text" value={form.name} onChange={e => setField("name", e.target.value)}
                      data-testid="input-office-name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                    <input type="text" value={form.slug} onChange={e => setField("slug", e.target.value)}
                      data-testid="input-office-slug"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                    <select value={form.category} onChange={e => setField("category", e.target.value)}
                      data-testid="select-office-category-form"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Campus</label>
                    <select value={form.campus_id} onChange={e => setField("campus_id", e.target.value)}
                      data-testid="select-office-campus"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">No campus</option>
                      {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Building / Location</label>
                    <input type="text" value={form.building} onChange={e => setField("building", e.target.value)}
                      placeholder="Admin Block, Ground Floor" data-testid="input-office-building"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Contact Person</label>
                    <input type="text" value={form.contact_person} onChange={e => setField("contact_person", e.target.value)}
                      data-testid="input-office-contact-person"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Summary</label>
                  <textarea rows={2} value={form.summary} onChange={e => setField("summary", e.target.value)}
                    data-testid="input-office-summary"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Support Scope / What We Help With</label>
                  <textarea rows={2} value={form.support_scope} onChange={e => setField("support_scope", e.target.value)}
                    data-testid="input-office-support-scope"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select value={form.status} onChange={e => setField("status", e.target.value as "active" | "inactive")}
                      data-testid="select-office-status"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                    <input type="number" value={form.sort_order} onChange={e => setField("sort_order", parseInt(e.target.value) || 0)}
                      data-testid="input-office-sort"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                    <input type="text" value={form.public_phone} onChange={e => setField("public_phone", e.target.value)}
                      data-testid="input-office-phone"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                    <input type="email" value={form.public_email} onChange={e => setField("public_email", e.target.value)}
                      data-testid="input-office-email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
                    <input type="text" value={form.whatsapp} onChange={e => setField("whatsapp", e.target.value)}
                      data-testid="input-office-whatsapp"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Physical Location Description</label>
                    <input type="text" value={form.physical_location} onChange={e => setField("physical_location", e.target.value)}
                      placeholder="Admin Block, Ground Floor, Main Campus" data-testid="input-office-location"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                    <input type="text" value={form.latitude} onChange={e => setField("latitude", e.target.value)}
                      placeholder="0.1295" data-testid="input-office-lat"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                    <input type="text" value={form.longitude} onChange={e => setField("longitude", e.target.value)}
                      placeholder="34.9085" data-testid="input-office-lng"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </section>

              {/* Opening hours */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Opening Hours</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mon–Fri</label>
                    <input type="text" value={form.hours_mon_fri} onChange={e => setField("hours_mon_fri", e.target.value)}
                      placeholder="8:00 AM – 5:00 PM" data-testid="input-hours-monFri"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Saturday</label>
                    <input type="text" value={form.hours_sat} onChange={e => setField("hours_sat", e.target.value)}
                      placeholder="8:00 AM – 1:00 PM" data-testid="input-hours-sat"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sunday</label>
                    <input type="text" value={form.hours_sun} onChange={e => setField("hours_sun", e.target.value)}
                      placeholder="Closed" data-testid="input-hours-sun"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </section>

              {/* Related links */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Related Links <span className="font-normal text-gray-400">(Label|URL, one per line)</span></h3>
                <textarea rows={3} value={form.related_links_raw} onChange={e => setField("related_links_raw", e.target.value)}
                  placeholder="Apply Online|https://portal.kafu.ac.ke&#10;Fee Structure|https://kafu.ac.ke/fees"
                  data-testid="input-office-links"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </section>

              {/* SEO */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">SEO Overrides <span className="font-normal text-gray-400">(optional)</span></h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                  <input type="text" value={form.meta_title} onChange={e => setField("meta_title", e.target.value)}
                    data-testid="input-office-meta-title"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                  <textarea rows={2} value={form.meta_description} onChange={e => setField("meta_description", e.target.value)}
                    data-testid="input-office-meta-desc"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </section>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} data-testid="btn-cancel-office-modal"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} data-testid="btn-save-office"
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Office"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Office?</h3>
            <p className="text-sm text-gray-600 mb-5">"{deleteTarget.name}" will be permanently deleted.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} data-testid="btn-confirm-delete-office"
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
