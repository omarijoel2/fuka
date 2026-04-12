import React, { useState, useCallback, useEffect } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { MapPin, Plus, Edit2, Trash2, Search, Globe, Phone, Mail, Eye } from "lucide-react";

interface Campus {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  address?: string;
  county?: string;
  region?: string;
  latitude?: number | null;
  longitude?: number | null;
  hero_image?: string;
  gallery_images?: string[];
  contact_email?: string;
  contact_phone?: string;
  visitor_notes?: string;
  transport_notes?: string;
  sort_order: number;
  status: "active" | "inactive";
}

const EMPTY_FORM = {
  name: "", slug: "", summary: "", description: "",
  address: "", county: "", region: "",
  latitude: "", longitude: "",
  hero_image: "", gallery_images_raw: "",
  contact_email: "", contact_phone: "",
  visitor_notes: "", transport_notes: "",
  sort_order: 0, status: "active" as "active" | "inactive",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CampusesCmsPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Campus | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Campus | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchCampuses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/campuses");
      setCampuses(res.data ?? res ?? []);
    } catch {
      showToast("error", "Failed to load campuses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampuses(); }, [fetchCampuses]);

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

  function openEdit(campus: Campus) {
    setEditing(campus);
    setForm({
      name: campus.name, slug: campus.slug,
      summary: campus.summary ?? "", description: campus.description ?? "",
      address: campus.address ?? "", county: campus.county ?? "", region: campus.region ?? "",
      latitude: campus.latitude != null ? String(campus.latitude) : "",
      longitude: campus.longitude != null ? String(campus.longitude) : "",
      hero_image: campus.hero_image ?? "",
      gallery_images_raw: (campus.gallery_images ?? []).join("\n"),
      contact_email: campus.contact_email ?? "",
      contact_phone: campus.contact_phone ?? "",
      visitor_notes: campus.visitor_notes ?? "",
      transport_notes: campus.transport_notes ?? "",
      sort_order: campus.sort_order,
      status: campus.status,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude as string) : null,
        longitude: form.longitude ? parseFloat(form.longitude as string) : null,
        gallery_images: form.gallery_images_raw.split("\n").map(s => s.trim()).filter(Boolean),
      };
      if (editing) {
        await apiPut(`/campuses/${editing.id}`, payload);
        showToast("success", "Campus updated.");
      } else {
        await apiPost("/campuses", payload);
        showToast("success", "Campus created.");
      }
      setShowModal(false);
      await fetchCampuses();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/campuses/${deleteTarget.id}`);
      showToast("success", "Campus deleted.");
      setDeleteTarget(null);
      await fetchCampuses();
    } catch {
      showToast("error", "Delete failed.");
    }
  }

  const filtered = campuses.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.county ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toastMsg.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-6 h-6 text-primary" />Campus Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage KAFU campuses, locations, and contact information.</p>
        </div>
        <button onClick={openCreate} data-testid="btn-create-campus"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Campus
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="search" placeholder="Search campuses…" value={search} onChange={e => setSearch(e.target.value)}
          data-testid="input-campus-search"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading campuses…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No campuses found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Campus</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Coordinates</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(campus => (
                <tr key={campus.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" data-testid={`campus-row-${campus.slug}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{campus.name}</p>
                    <p className="text-xs text-gray-400">/{campus.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{campus.county}{campus.region ? `, ${campus.region}` : ""}</p>
                    {campus.address && <p className="text-xs text-gray-400 truncate max-w-xs">{campus.address}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {campus.latitude && campus.longitude
                      ? <span className="text-xs text-gray-500 font-mono">{campus.latitude.toFixed(4)}, {campus.longitude.toFixed(4)}</span>
                      : <span className="text-xs text-gray-300 italic">No coordinates</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${campus.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {campus.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <a href={`/campuses/${campus.slug}`} target="_blank" rel="noopener noreferrer"
                        title="View on site" className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => openEdit(campus)} data-testid={`btn-edit-campus-${campus.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(campus)} data-testid={`btn-delete-campus-${campus.id}`}
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

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editing ? `Edit: ${editing.name}` : "Add Campus"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
              {/* Basic info */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Campus Name *</label>
                    <input type="text" value={form.name} onChange={e => setField("name", e.target.value)}
                      placeholder="Main Campus — Kaimosi" data-testid="input-campus-name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                    <input type="text" value={form.slug} onChange={e => setField("slug", e.target.value)}
                      data-testid="input-campus-slug"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Summary</label>
                  <textarea rows={2} value={form.summary} onChange={e => setField("summary", e.target.value)}
                    data-testid="input-campus-summary"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea rows={4} value={form.description} onChange={e => setField("description", e.target.value)}
                    data-testid="input-campus-description"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select value={form.status} onChange={e => setField("status", e.target.value as "active" | "inactive")}
                      data-testid="select-campus-status"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                    <input type="number" value={form.sort_order} onChange={e => setField("sort_order", parseInt(e.target.value) || 0)}
                      data-testid="input-campus-sort"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Location</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Physical Address</label>
                  <input type="text" value={form.address} onChange={e => setField("address", e.target.value)}
                    placeholder="P.O. Box 27 — 50309, Kaimosi, Kenya" data-testid="input-campus-address"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">County</label>
                    <input type="text" value={form.county} onChange={e => setField("county", e.target.value)}
                      placeholder="Vihiga" data-testid="input-campus-county"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Region</label>
                    <input type="text" value={form.region} onChange={e => setField("region", e.target.value)}
                      placeholder="Western Kenya" data-testid="input-campus-region"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                    <input type="text" value={form.latitude} onChange={e => setField("latitude", e.target.value)}
                      placeholder="0.1295" data-testid="input-campus-lat"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                    <input type="text" value={form.longitude} onChange={e => setField("longitude", e.target.value)}
                      placeholder="34.9085" data-testid="input-campus-lng"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </section>

              {/* Media */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Media</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hero Image URL</label>
                  <input type="text" value={form.hero_image} onChange={e => setField("hero_image", e.target.value)}
                    placeholder="/img8696.jpg" data-testid="input-campus-hero"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gallery Image URLs (one per line)</label>
                  <textarea rows={3} value={form.gallery_images_raw} onChange={e => setField("gallery_images_raw", e.target.value)}
                    placeholder="/img6424.jpg&#10;/pic1.jpg" data-testid="input-campus-gallery"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
                </div>
              </section>

              {/* Contact */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Contact Phone</label>
                    <input type="text" value={form.contact_phone} onChange={e => setField("contact_phone", e.target.value)}
                      placeholder="+254 700 000 000" data-testid="input-campus-phone"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Contact Email</label>
                    <input type="email" value={form.contact_email} onChange={e => setField("contact_email", e.target.value)}
                      placeholder="campus@kafu.ac.ke" data-testid="input-campus-email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Visitor & Transport Information</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Visitor Notes</label>
                  <textarea rows={3} value={form.visitor_notes} onChange={e => setField("visitor_notes", e.target.value)}
                    data-testid="input-campus-visitor-notes"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Transport Notes / How to Get There</label>
                  <textarea rows={3} value={form.transport_notes} onChange={e => setField("transport_notes", e.target.value)}
                    data-testid="input-campus-transport-notes"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </section>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} data-testid="btn-cancel-campus-modal"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} data-testid="btn-save-campus"
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Campus"}
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
            <h3 className="font-bold text-gray-900 mb-2">Delete Campus?</h3>
            <p className="text-sm text-gray-600 mb-5">"{deleteTarget.name}" will be permanently deleted. This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} data-testid="btn-confirm-delete-campus"
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
