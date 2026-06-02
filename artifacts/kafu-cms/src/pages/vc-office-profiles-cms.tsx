import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, UserCog } from "lucide-react";
import PhotoUploadField from "@/components/photo-upload-field";

interface ManagementProfile {
  id?: number;
  name: string;
  title: string;
  photo_url: string;
  bio: string;
  email: string;
  office: string;
  phone: string;
  category: string;
  position_order: number;
  is_active: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "vc", label: "Vice-Chancellor" },
  { value: "dvc", label: "Deputy Vice-Chancellor" },
];

const BLANK: ManagementProfile = {
  name: "", title: "", photo_url: "", bio: "", email: "",
  office: "", phone: "", category: "dvc", position_order: 0, is_active: true,
};

function ProfileModal({
  initial, onClose, onSave,
}: { initial: ManagementProfile; onClose: () => void; onSave: (m: ManagementProfile) => void }) {
  const [form, setForm] = useState<ManagementProfile>(initial);
  const set = (k: keyof ManagementProfile, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{form.id ? "Edit Profile" : "Add Profile"}</h2>
          <button onClick={onClose} data-testid="modal-close" className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Full Name *</label>
              <input data-testid="input-name" value={form.name} onChange={e => set("name", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Title *</label>
              <input data-testid="input-title" value={form.title} onChange={e => set("title", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Category *</label>
              <select data-testid="select-category" value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Position Order</label>
              <input data-testid="input-position" type="number" value={form.position_order}
                onChange={e => set("position_order", parseInt(e.target.value) || 0)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="col-span-2">
              <PhotoUploadField value={form.photo_url} onChange={url => set("photo_url", url)} personName={form.name} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Email</label>
              <input data-testid="input-email" type="email" value={form.email} onChange={e => set("email", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Phone</label>
              <input data-testid="input-phone" value={form.phone} onChange={e => set("phone", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Office Location</label>
              <input data-testid="input-office" value={form.office} onChange={e => set("office", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Biography</label>
              <textarea data-testid="input-bio" value={form.bio} onChange={e => set("bio", e.target.value)} rows={4}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="is_active" checked={form.is_active}
                onChange={e => set("is_active", e.target.checked)} data-testid="input-active" className="rounded border-border" />
              <label htmlFor="is_active" className="text-sm text-foreground">Active (visible on website)</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <button onClick={onClose} data-testid="cancel-btn"
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} data-testid="save-btn"
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VcOfficeProfilesCmsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<ManagementProfile | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ data: ManagementProfile[] }>({
    queryKey: ["cms-management-profiles"],
    queryFn: () => apiFetch("/management-profiles"),
  });

  const save = useMutation({
    mutationFn: (m: ManagementProfile) =>
      m.id ? apiFetch(`/management-profiles/${m.id}`, { method: "PUT", body: JSON.stringify(m) })
           : apiFetch("/management-profiles", { method: "POST", body: JSON.stringify(m) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-management-profiles"] }); setModal(null); },
  });

  const del = useMutation({
    mutationFn: (id: number) => apiFetch(`/management-profiles/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-management-profiles"] }); setDeleteId(null); },
  });

  // Only show VC and DVC profiles on this page
  const profiles = (data?.data ?? [])
    .filter(p => p.category === "vc" || p.category === "dvc")
    .sort((a, b) => a.position_order - b.position_order);

  const LABEL: Record<string, string> = { vc: "Vice-Chancellor", dvc: "Deputy Vice-Chancellor" };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" /> VC Office Profiles
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Vice-Chancellor and Deputy Vice-Chancellors displayed on the
            <strong className="text-foreground"> /about/vice-chancellor</strong> page.
          </p>
        </div>
        <button onClick={() => setModal({ ...BLANK })} data-testid="add-profile-btn"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Profile
        </button>
      </div>

      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        Profiles here are shown briefly on the Vice-Chancellor page. The VC's full academic credentials and
        leadership history are displayed separately on the Management Board page.
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-16 text-center">
          <UserCog className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No VC office profiles yet.</p>
          <button onClick={() => setModal({ ...BLANK })} data-testid="add-first-btn"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add First Profile
          </button>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles.map(p => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{p.title}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{LABEL[p.category] ?? p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(p)} data-testid={`edit-${p.id}`}
                      className="text-muted-foreground hover:text-primary mr-2 p-1 rounded hover:bg-primary/10">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(p.id!)} data-testid={`delete-${p.id}`}
                      className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <ProfileModal initial={modal} onClose={() => setModal(null)} onSave={m => save.mutate(m)} />}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-foreground mb-2">Remove Profile</h3>
            <p className="text-sm text-muted-foreground mb-5">This will remove the profile from the website.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} data-testid="cancel-delete"
                className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted">Cancel</button>
              <button onClick={() => del.mutate(deleteId)} data-testid="confirm-delete"
                className="flex-1 px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
