import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";

interface Redirect {
  id: number;
  source_path: string;
  destination_url: string;
  type: 301 | 302;
  is_active: boolean;
  hit_count: number;
  notes?: string;
  created_at: string;
}

const EMPTY: Omit<Redirect, "id" | "hit_count" | "created_at"> = {
  source_path: "",
  destination_url: "",
  type: 301,
  is_active: true,
  notes: "",
};

export default function RedirectsCmsPage() {
  const [items, setItems] = useState<Redirect[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; edit?: Redirect }>({ open: false });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), per_page: "20" };
      if (search) params.search = search;
      const d = await apiGet("/redirects", params as any);
      setItems(d.data || []);
      setTotal(d.total ?? 0);
      setLastPage(d.last_page ?? 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ ...EMPTY });
    setFormError("");
    setModal({ open: true });
  };

  const openEdit = (item: Redirect) => {
    setForm({
      source_path: item.source_path,
      destination_url: item.destination_url,
      type: item.type,
      is_active: item.is_active,
      notes: item.notes || "",
    });
    setFormError("");
    setModal({ open: true, edit: item });
  };

  const closeModal = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.source_path || !form.destination_url) {
      setFormError("Source path and destination URL are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (modal.edit) {
        await apiPut(`/redirects/${modal.edit.id}`, form);
      } else {
        await apiPost("/redirects", form);
      }
      closeModal();
      load();
    } catch (e: any) {
      setFormError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this redirect rule?")) return;
    try {
      await apiDelete(`/redirects/${id}`);
      load();
    } catch {
      alert("Delete failed.");
    }
  };

  const handleToggle = async (item: Redirect) => {
    try {
      await apiPut(`/redirects/${item.id}`, { is_active: !item.is_active });
      load();
    } catch {
      alert("Update failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Redirects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage URL redirect rules. {total > 0 && `${total} rule${total === 1 ? "" : "s"} total.`}
          </p>
        </div>
        <button
          data-testid="btn-add-redirect"
          onClick={openCreate}
          className="px-4 py-2 bg-[#1A5C38] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f]"
        >
          + Add Redirect
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          data-testid="input-redirect-search"
          type="text"
          placeholder="Search source or destination..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-80 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-700">Source Path</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Destination</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-16">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-16">Hits</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 w-20">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No redirects found. Add your first redirect rule.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-800">{item.source_path}</td>
                  <td className="px-4 py-3 text-gray-600 truncate max-w-xs">{item.destination_url}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${
                      item.type === 301 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.hit_count}</td>
                  <td className="px-4 py-3">
                    <button
                      data-testid={`btn-toggle-redirect-${item.id}`}
                      onClick={() => handleToggle(item)}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        item.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        data-testid={`btn-edit-redirect-${item.id}`}
                        onClick={() => openEdit(item)}
                        className="text-[#1A5C38] hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        data-testid={`btn-delete-redirect-${item.id}`}
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {lastPage}</span>
          <div className="flex gap-2">
            <button
              data-testid="btn-redirects-prev"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              data-testid="btn-redirects-next"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          data-testid="redirect-modal"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {modal.edit ? "Edit Redirect" : "Add Redirect"}
              </h2>
              <button data-testid="btn-close-redirect-modal" onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">
                &times;
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{formError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Path <span className="text-red-500">*</span>
                </label>
                <input
                  data-testid="input-redirect-source"
                  type="text"
                  value={form.source_path}
                  onChange={(e) => setForm({ ...form, source_path: e.target.value })}
                  placeholder="/old-page-path"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                />
                <p className="text-xs text-gray-400 mt-1">Must start with /</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination URL <span className="text-red-500">*</span>
                </label>
                <input
                  data-testid="input-redirect-destination"
                  type="text"
                  value={form.destination_url}
                  onChange={(e) => setForm({ ...form, destination_url: e.target.value })}
                  placeholder="/new-page or https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    data-testid="select-redirect-type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: parseInt(e.target.value) as 301 | 302 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  >
                    <option value={301}>301 Permanent</option>
                    <option value={302}>302 Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    data-testid="select-redirect-status"
                    value={form.is_active ? "1" : "0"}
                    onChange={(e) => setForm({ ...form, is_active: e.target.value === "1" })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  data-testid="input-redirect-notes"
                  rows={2}
                  value={form.notes || ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  placeholder="Why is this redirect needed?"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                data-testid="btn-cancel-redirect"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                data-testid="btn-confirm-save-redirect"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#1A5C38] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
              >
                {saving ? "Saving..." : modal.edit ? "Save Changes" : "Create Redirect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
