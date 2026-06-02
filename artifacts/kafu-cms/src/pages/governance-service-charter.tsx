import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Save, RefreshCw, Plus, Trash2, ChevronDown, ChevronUp, Pencil, X, Check } from "lucide-react";

const API_GET = (slug: string) => `/api/admin/pages/${slug}`;
const API_PUT = (slug: string) => `/api/admin/pages/${slug}`;
const PAGE_SLUG = "about-service-charter";

interface ServiceStandard {
  service: string;
  standard: string;
  remarks: string;
}

interface ServiceCategory {
  category: string;
  colour: string;
  services: ServiceStandard[];
}

interface ServiceModal {
  catIndex: number;
  svcIndex: number;
  data: ServiceStandard;
}

function Input({ id, value, onChange, placeholder }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input id={id} data-testid={id} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
  );
}

function ServiceRow({ svc, onEdit, onDelete }: { svc: ServiceStandard; onEdit: () => void; onDelete: () => void }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-2 text-gray-800">{svc.service}</td>
      <td className="px-3 py-2 text-gray-600">{svc.standard}</td>
      <td className="px-3 py-2 text-gray-400 text-xs">{svc.remarks}</td>
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end gap-1">
          <button type="button" onClick={onEdit} className="p-1.5 text-gray-400 hover:text-green-700 rounded"><Pencil className="w-3 h-3" /></button>
          <button type="button" onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3 h-3" /></button>
        </div>
      </td>
    </tr>
  );
}

export default function GovernanceServiceCharterPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openCats, setOpenCats] = useState<Record<number, boolean>>({});
  const [modal, setModal] = useState<ServiceModal | null>(null);
  const [catModal, setCatModal] = useState<{ index: number; data: Partial<ServiceCategory> } | null>(null);
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
        const cats: ServiceCategory[] = Array.isArray(sd.standards) ? sd.standards : [];
        setCategories(cats);
        const openState: Record<number, boolean> = {};
        cats.forEach((_, i) => { openState[i] = i === 0; });
        setOpenCats(openState);
        setLoading(false);
      })
      .catch(() => { showToast("error", "Failed to load."); setLoading(false); });
  };

  useEffect(() => { if (token) load(); }, [token]);

  const save = (cats: ServiceCategory[]) => {
    setSaving(true);
    fetch(API_PUT(PAGE_SLUG), {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ structured_data: { standards: cats } }),
    })
      .then(r => r.json())
      .then(res => {
        setSaving(false);
        if (res.error) showToast("error", res.error);
        else { setCategories(cats); showToast("success", "Service charter saved."); }
      })
      .catch(() => { setSaving(false); showToast("error", "Save failed."); });
  };

  const toggleCat = (i: number) => setOpenCats(s => ({ ...s, [i]: !s[i] }));

  const updateCat = (i: number, updates: Partial<ServiceCategory>) => {
    const cats = [...categories];
    cats[i] = { ...cats[i], ...updates };
    setCategories(cats);
  };

  const deleteCat = (i: number) => {
    if (!confirm("Delete this category and all its services?")) return;
    const cats = categories.filter((_, idx) => idx !== i);
    save(cats);
  };

  const addCategory = () => {
    setCatModal({ index: -1, data: { category: "", colour: "#1A5C38", services: [] } });
  };

  const saveCatModal = () => {
    if (!catModal) return;
    const cats = [...categories];
    const entry: ServiceCategory = {
      category: catModal.data.category ?? "",
      colour: catModal.data.colour ?? "#1A5C38",
      services: catModal.data.services ?? [],
    };
    if (catModal.index === -1) cats.push(entry);
    else cats[catModal.index] = entry;
    setCatModal(null);
    save(cats);
  };

  const saveService = (m: ServiceModal) => {
    const cats = [...categories];
    const services = [...cats[m.catIndex].services];
    if (m.svcIndex === -1) services.push(m.data);
    else services[m.svcIndex] = m.data;
    cats[m.catIndex] = { ...cats[m.catIndex], services };
    setModal(null);
    save(cats);
  };

  const deleteService = (catIdx: number, svcIdx: number) => {
    const cats = [...categories];
    cats[catIdx] = { ...cats[catIdx], services: cats[catIdx].services.filter((_, i) => i !== svcIdx) };
    save(cats);
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-sm text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Service modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{modal.svcIndex === -1 ? "Add Service Standard" : "Edit Service Standard"}</h2>
              <button type="button" onClick={() => setModal(null)} data-testid="svc-modal-close"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <Input id="svc-service" value={modal.data.service} onChange={v => setModal(m => m && ({ ...m, data: { ...m.data, service: v } }))} placeholder="Online application acknowledgement" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard / Turnaround</label>
                <Input id="svc-standard" value={modal.data.standard} onChange={v => setModal(m => m && ({ ...m, data: { ...m.data, standard: v } }))} placeholder="Within 1 working day" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <Input id="svc-remarks" value={modal.data.remarks} onChange={v => setModal(m => m && ({ ...m, data: { ...m.data, remarks: v } }))} placeholder="Automated confirmation email sent" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
              <button type="button" data-testid="save-svc-btn" onClick={() => modal && saveService(modal)}
                className="px-4 py-2 text-sm bg-green-700 text-white rounded hover:bg-green-800 flex items-center gap-2">
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category modal */}
      {catModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{catModal.index === -1 ? "Add Category" : "Edit Category"}</h2>
              <button type="button" onClick={() => setCatModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <Input id="cat-name" value={catModal.data.category ?? ""} onChange={v => setCatModal(m => m && ({ ...m, data: { ...m.data, category: v } }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Colour</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={catModal.data.colour ?? "#1A5C38"}
                    onChange={e => setCatModal(m => m && ({ ...m, data: { ...m.data, colour: e.target.value } }))}
                    className="h-9 w-14 border border-gray-300 rounded cursor-pointer" />
                  <Input id="cat-colour" value={catModal.data.colour ?? ""} onChange={v => setCatModal(m => m && ({ ...m, data: { ...m.data, colour: v } }))} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button type="button" onClick={() => setCatModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
              <button type="button" data-testid="save-cat-btn" onClick={saveCatModal}
                className="px-4 py-2 text-sm bg-green-700 text-white rounded hover:bg-green-800 flex items-center gap-2">
                <Check className="w-4 h-4" /> Save Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Charter</h1>
          <p className="text-sm text-gray-500 mt-1">Manage service categories and their turnaround standards</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} data-testid="refresh-btn"
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button type="button" onClick={addCategory} data-testid="add-category-btn"
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-800">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg py-12 text-center text-gray-400 text-sm">
          No service categories yet. Click Add Category to begin.
        </div>
      )}

      <div className="space-y-3">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer" onClick={() => toggleCat(catIdx)}>
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.colour || "#1A5C38" }} />
              <span className="flex-1 font-medium text-sm text-gray-800">{cat.category}</span>
              <span className="text-xs text-gray-400 mr-2">{cat.services.length} services</span>
              <button type="button" data-testid={`edit-cat-${catIdx}`}
                onClick={e => { e.stopPropagation(); setCatModal({ index: catIdx, data: { ...cat } }); }}
                className="p-1 text-gray-400 hover:text-green-700">
                <Pencil className="w-4 h-4" />
              </button>
              <button type="button" data-testid={`delete-cat-${catIdx}`}
                onClick={e => { e.stopPropagation(); deleteCat(catIdx); }}
                className="p-1 text-gray-400 hover:text-red-600 mr-1">
                <Trash2 className="w-4 h-4" />
              </button>
              {openCats[catIdx] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>

            {openCats[catIdx] && (
              <div className="border-t border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-500">Service</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-500">Standard</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-500">Remarks</th>
                      <th className="text-right px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cat.services.map((svc, svcIdx) => (
                      <ServiceRow key={svcIdx} svc={svc}
                        onEdit={() => setModal({ catIndex: catIdx, svcIndex: svcIdx, data: { ...svc } })}
                        onDelete={() => deleteService(catIdx, svcIdx)} />
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button type="button" data-testid={`add-service-${catIdx}`}
                    onClick={() => setModal({ catIndex: catIdx, svcIndex: -1, data: { service: "", standard: "", remarks: "" } })}
                    className="text-sm text-green-700 hover:text-green-900 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Service Standard
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
