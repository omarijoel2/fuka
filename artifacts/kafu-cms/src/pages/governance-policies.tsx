import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Save, RefreshCw, Plus, Trash2, Pencil, X, Check } from "lucide-react";

const API_GET = (slug: string) => `/api/admin/pages/${slug}`;
const API_PUT = (slug: string) => `/api/admin/pages/${slug}`;
const PAGE_SLUG = "about-policies";

interface PolicyDoc {
  slug: string;
  title: string;
  category: string;
  version: string;
  pages: number | string;
  approved: string;
  review_date: string;
  description?: string;
}

const EMPTY_POLICY: PolicyDoc = {
  slug: "", title: "", category: "Academic", version: "", pages: 0, approved: "", review_date: "", description: "",
};

const CATEGORIES = ["Academic", "Student Affairs", "Research", "Human Resources", "ICT", "Finance & Procurement", "Facilities", "Other"];

function Input({ id, value, onChange, placeholder }: { id: string; value: string | number; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input id={id} data-testid={id} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
  );
}

function PolicyModal({ policy, onSave, onClose }: { policy: PolicyDoc; onSave: (p: PolicyDoc) => void; onClose: () => void }) {
  const [form, setForm] = useState<PolicyDoc>({ ...policy });
  const set = <K extends keyof PolicyDoc>(k: K, v: PolicyDoc[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{policy.title ? "Edit Policy" : "Add Policy"}</h2>
          <button type="button" onClick={onClose} data-testid="modal-close"><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input id="policy-title" value={form.title} onChange={v => set("title", v)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly ID)</label>
            <Input id="policy-slug" value={form.slug} onChange={v => set("slug", v.toLowerCase().replace(/\s+/g, "-"))} placeholder="academic-policy" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select data-testid="policy-category" value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
              <Input id="policy-pages" value={form.pages} onChange={v => set("pages", v)} placeholder="45" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <Input id="policy-version" value={form.version} onChange={v => set("version", v)} placeholder="v2.0 (2023)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Date</label>
              <Input id="policy-review-date" value={form.review_date} onChange={v => set("review_date", v)} placeholder="June 2026" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
            <Input id="policy-approved" value={form.approved} onChange={v => set("approved", v)} placeholder="University Council, June 2023" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea data-testid="policy-description" value={form.description ?? ""} onChange={e => set("description", e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button type="button" onClick={onClose} data-testid="modal-cancel"
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={() => onSave(form)} data-testid="modal-save"
            className="px-4 py-2 text-sm bg-green-700 text-white rounded hover:bg-green-800 flex items-center gap-2">
            <Check className="w-4 h-4" /> Save Policy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GovernancePoliciesPage() {
  const { token } = useAuth();
  const [policies, setPolicies] = useState<PolicyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{ policy: PolicyDoc; index: number } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    fetch(API_GET(PAGE_SLUG), { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(res => {
        const sd = res.data?.structured_data ?? {};
        setPolicies(Array.isArray(sd.policies) ? sd.policies : []);
        setLoading(false);
      })
      .catch(() => { showToast("error", "Failed to load policies."); setLoading(false); });
  };

  useEffect(() => { if (token) load(); }, [token]);

  const save = (list: PolicyDoc[]) => {
    setSaving(true);
    fetch(API_PUT(PAGE_SLUG), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ structured_data: { policies: list } }),
    })
      .then(r => r.json())
      .then(res => {
        setSaving(false);
        if (res.error) showToast("error", res.error);
        else { setPolicies(list); showToast("success", "Policies saved."); }
      })
      .catch(() => { setSaving(false); showToast("error", "Save failed."); });
  };

  const handleSavePolicy = (p: PolicyDoc) => {
    if (!modal) return;
    const list = [...policies];
    if (modal.index === -1) list.push(p);
    else list[modal.index] = p;
    setModal(null);
    save(list);
  };

  const deletePolicy = (i: number) => {
    if (!confirm("Delete this policy document?")) return;
    save(policies.filter((_, idx) => idx !== i));
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  const categories = Array.from(new Set(policies.map(p => p.category))).sort();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-sm text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}
      {modal && (
        <PolicyModal policy={modal.policy} onSave={handleSavePolicy} onClose={() => setModal(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policies & Regulations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage policy documents listed on the public Policies page</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} data-testid="refresh-btn"
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button type="button" data-testid="add-policy-btn"
            onClick={() => setModal({ policy: { ...EMPTY_POLICY }, index: -1 })}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-800">
            <Plus className="w-4 h-4" /> Add Policy
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {policies.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No policy documents yet. Click Add Policy to begin.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Version</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Review Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {policies.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-green-50 text-green-800 rounded text-xs">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.version}</td>
                  <td className="px-4 py-3 text-gray-500">{p.review_date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" data-testid={`edit-policy-${i}`}
                        onClick={() => setModal({ policy: { ...p }, index: i })}
                        className="p-1.5 text-gray-400 hover:text-green-700 rounded hover:bg-green-50">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" data-testid={`delete-policy-${i}`}
                        onClick={() => deletePolicy(i)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50">
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

      {categories.length > 0 && (
        <div className="text-xs text-gray-400">
          {policies.length} document{policies.length !== 1 ? "s" : ""} across {categories.length} categor{categories.length !== 1 ? "ies" : "y"}: {categories.join(", ")}
        </div>
      )}
    </div>
  );
}
