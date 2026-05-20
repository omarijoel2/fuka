import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Save, Building2, ChevronDown, ChevronUp } from "lucide-react";

interface QuickLink { label: string; url: string; external?: boolean }

interface Directorate {
  id?: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  director_name: string;
  director_title: string;
  director_photo_url: string;
  director_bio: string;
  director_email: string;
  director_phone: string;
  functions: string[];
  services: string[];
  quick_links: QuickLink[];
  position_order: number;
  is_active: boolean;
}

const BLANK: Directorate = {
  name: "", slug: "", tagline: "", description: "",
  director_name: "", director_title: "", director_photo_url: "",
  director_bio: "", director_email: "", director_phone: "",
  functions: [], services: [], quick_links: [], position_order: 0, is_active: true,
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => { if (!input.trim()) return; onChange([...items, input.trim()]); setInput(""); };
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Add item and press Enter" />
        <button onClick={add} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">Add</button>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-muted/40 rounded px-3 py-1.5 text-sm">
            <span className="flex-1">{item}</span>
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DirectorateModal({
  initial, onClose, onSave,
}: { initial: Directorate; onClose: () => void; onSave: (d: Directorate) => void }) {
  const [form, setForm] = useState<Directorate>(initial);
  const [section, setSection] = useState<"basic" | "director" | "content">("basic");
  const set = (k: keyof Directorate, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{form.id ? "Edit Directorate" : "Add Directorate"}</h2>
          <button onClick={onClose} data-testid="modal-close" className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-border px-6 gap-4 text-sm">
          {(["basic", "director", "content"] as const).map(s => (
            <button key={s} onClick={() => setSection(s)} data-testid={`tab-${s}`}
              className={`py-3 font-medium border-b-2 transition-colors capitalize ${section === s ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {s === "basic" ? "Basic Info" : s === "director" ? "Director" : "Functions & Services"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {section === "basic" && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Directorate Name *</label>
                <input data-testid="input-name" value={form.name}
                  onChange={e => { set("name", e.target.value); if (!form.id) set("slug", toSlug(e.target.value)); }}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">URL Slug *</label>
                <input data-testid="input-slug" value={form.slug} onChange={e => set("slug", e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <p className="text-xs text-muted-foreground mt-1">URL: /directorates/{form.slug || "..."}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Tagline</label>
                <input data-testid="input-tagline" value={form.tagline} onChange={e => set("tagline", e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Description</label>
                <textarea data-testid="input-description" value={form.description} onChange={e => set("description", e.target.value)} rows={4}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Position Order</label>
                  <input data-testid="input-position" type="number" value={form.position_order}
                    onChange={e => set("position_order", parseInt(e.target.value) || 0)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={form.is_active}
                  onChange={e => set("is_active", e.target.checked)} data-testid="input-active" className="rounded border-border" />
                <label htmlFor="is_active" className="text-sm text-foreground">Active (visible on website)</label>
              </div>
            </>
          )}

          {section === "director" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Director Name</label>
                  <input data-testid="input-director-name" value={form.director_name} onChange={e => set("director_name", e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Director Title</label>
                  <input data-testid="input-director-title" value={form.director_title} onChange={e => set("director_title", e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Email</label>
                  <input data-testid="input-director-email" type="email" value={form.director_email} onChange={e => set("director_email", e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Phone</label>
                  <input data-testid="input-director-phone" value={form.director_phone} onChange={e => set("director_phone", e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Photo URL</label>
                  <input data-testid="input-director-photo" value={form.director_photo_url} onChange={e => set("director_photo_url", e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Director Biography</label>
                  <textarea data-testid="input-director-bio" value={form.director_bio} onChange={e => set("director_bio", e.target.value)} rows={5}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
              </div>
            </>
          )}

          {section === "content" && (
            <>
              <ListEditor label="Core Functions" items={form.functions} onChange={v => set("functions", v)} />
              <ListEditor label="Services Offered" items={form.services} onChange={v => set("services", v)} />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <button onClick={onClose} data-testid="cancel-btn"
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} data-testid="save-btn"
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Directorate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DirectoratesCmsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<Directorate | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ data: Directorate[] }>({
    queryKey: ["cms-directorates"],
    queryFn: () => apiFetch("/directorates"),
  });

  const save = useMutation({
    mutationFn: (d: Directorate) =>
      d.id ? apiFetch(`/directorates/${d.id}`, { method: "PUT", body: JSON.stringify(d) })
           : apiFetch("/directorates", { method: "POST", body: JSON.stringify(d) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-directorates"] }); setModal(null); },
  });

  const del = useMutation({
    mutationFn: (id: number) => apiFetch(`/directorates/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-directorates"] }); setDeleteId(null); },
  });

  const directorates = data?.data ?? [];

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Directorates
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage university directorates and their director profiles.</p>
        </div>
        <button onClick={() => setModal({ ...BLANK })} data-testid="add-directorate-btn"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Directorate
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Loading directorates...</div>
      ) : directorates.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl py-16 text-center">
          <Building2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No directorates yet.</p>
          <button onClick={() => setModal({ ...BLANK })} data-testid="add-first-btn"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add First Directorate
          </button>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Director</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {directorates.sort((a, b) => a.position_order - b.position_order).map(d => (
                <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{d.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{d.director_name}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <code className="text-xs bg-muted px-2 py-0.5 rounded">/directorates/{d.slug}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${d.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {d.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(d)} data-testid={`edit-${d.id}`}
                      className="text-muted-foreground hover:text-primary mr-2 p-1 rounded hover:bg-primary/10">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(d.id!)} data-testid={`delete-${d.id}`}
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

      {modal && <DirectorateModal initial={modal} onClose={() => setModal(null)} onSave={d => save.mutate(d)} />}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-foreground mb-2">Remove Directorate</h3>
            <p className="text-sm text-muted-foreground mb-5">This will remove the directorate from the website.</p>
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
