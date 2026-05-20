import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, Users } from "lucide-react";

interface CouncilMember {
  id?: number;
  name: string;
  title: string;
  photo_url: string;
  bio: string;
  credentials: string[];
  category: string;
  position_order: number;
  is_active: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "chairperson", label: "Chairperson" },
  { value: "vice_chair", label: "Vice Chairperson" },
  { value: "ex_officio", label: "Ex-Officio" },
  { value: "government", label: "Government Representative" },
  { value: "member", label: "Council Member" },
];

const BLANK: CouncilMember = {
  name: "", title: "", photo_url: "", bio: "",
  credentials: [], category: "member", position_order: 0, is_active: true,
};

function MemberModal({
  initial, onClose, onSave,
}: { initial: CouncilMember; onClose: () => void; onSave: (m: CouncilMember) => void }) {
  const [form, setForm] = useState<CouncilMember>(initial);
  const [credInput, setCredInput] = useState("");

  const set = (k: keyof CouncilMember, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const addCred = () => {
    if (!credInput.trim()) return;
    set("credentials", [...form.credentials, credInput.trim()]);
    setCredInput("");
  };

  const removeCred = (i: number) => set("credentials", form.credentials.filter((_, idx) => idx !== i));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{form.id ? "Edit Council Member" : "Add Council Member"}</h2>
          <button onClick={onClose} data-testid="modal-close" className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Full Name *</label>
              <input data-testid="input-name" value={form.name} onChange={e => set("name", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Prof. John Ong'ete" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Title *</label>
              <input data-testid="input-title" value={form.title} onChange={e => set("title", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Chairperson, University Council" />
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
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Photo URL</label>
              <input data-testid="input-photo" value={form.photo_url} onChange={e => set("photo_url", e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Biography</label>
              <textarea data-testid="input-bio" value={form.bio} onChange={e => set("bio", e.target.value)} rows={4}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Credentials</label>
              <div className="flex gap-2 mb-2">
                <input value={credInput} onChange={e => setCredInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCred())}
                  data-testid="input-credential"
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. PhD, University of Nairobi" />
                <button onClick={addCred} data-testid="add-credential"
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.credentials.map((c, i) => (
                  <span key={i} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    {c}
                    <button onClick={() => removeCred(i)} data-testid={`remove-cred-${i}`} className="text-muted-foreground hover:text-destructive ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="is_active" checked={form.is_active}
                onChange={e => set("is_active", e.target.checked)}
                data-testid="input-active" className="rounded border-border" />
              <label htmlFor="is_active" className="text-sm text-foreground">Active (visible on website)</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <button onClick={onClose} data-testid="cancel-btn"
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} data-testid="save-btn"
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Member
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CouncilMembersCmsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<CouncilMember | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ data: CouncilMember[] }>({
    queryKey: ["cms-council-members"],
    queryFn: () => apiFetch("/council-members"),
  });

  const save = useMutation({
    mutationFn: (m: CouncilMember) =>
      m.id ? apiFetch(`/council-members/${m.id}`, { method: "PUT", body: JSON.stringify(m) })
           : apiFetch("/council-members", { method: "POST", body: JSON.stringify(m) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-council-members"] }); setModal(null); },
  });

  const del = useMutation({
    mutationFn: (id: number) => apiFetch(`/council-members/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-council-members"] }); setDeleteId(null); },
  });

  const members = data?.data ?? [];

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Council Members
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage University Council members displayed on the website.</p>
        </div>
        <button onClick={() => setModal({ ...BLANK })} data-testid="add-member-btn"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Loading council members...</div>
      ) : members.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-16 text-center">
          <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No council members yet.</p>
          <button onClick={() => setModal({ ...BLANK })} data-testid="add-first-btn"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add First Member
          </button>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.sort((a, b) => a.position_order - b.position_order).map(m => (
                <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{m.title}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">{m.category.replace("_", " ")}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${m.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {m.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(m)} data-testid={`edit-${m.id}`}
                      className="text-muted-foreground hover:text-primary mr-2 p-1 rounded hover:bg-primary/10">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(m.id!)} data-testid={`delete-${m.id}`}
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

      {modal && (
        <MemberModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={m => save.mutate(m)}
        />
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-foreground mb-2">Remove Council Member</h3>
            <p className="text-sm text-muted-foreground mb-5">This will remove the member from the website. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} data-testid="cancel-delete"
                className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted">Cancel</button>
              <button onClick={() => del.mutate(deleteId)} data-testid="confirm-delete"
                className="flex-1 px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
