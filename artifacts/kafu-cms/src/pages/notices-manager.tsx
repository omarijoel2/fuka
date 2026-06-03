import React, { useState } from "react";
import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Download, Upload, X, AlertCircle } from "lucide-react";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");

type Category = "memo" | "circular" | "notice" | "policy" | "announcement";

interface Notice {
  id: number;
  title: string;
  description: string | null;
  category: Category;
  file_url: string | null;
  file_name: string | null;
  file_size: string | null;
  issued_date: string;
  is_active: boolean;
}

const BLANK: Omit<Notice, "id"> = {
  title: "",
  description: "",
  category: "memo",
  file_url: null,
  file_name: null,
  file_size: null,
  issued_date: new Date().toISOString().slice(0, 10),
  is_active: true,
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "memo", label: "Memo" },
  { value: "circular", label: "Circular" },
  { value: "notice", label: "Notice" },
  { value: "policy", label: "Policy" },
  { value: "announcement", label: "Announcement" },
];

const CATEGORY_COLORS: Record<Category, string> = {
  memo: "bg-blue-100 text-blue-700",
  circular: "bg-amber-100 text-amber-700",
  notice: "bg-red-100 text-red-700",
  policy: "bg-purple-100 text-purple-700",
  announcement: "bg-green-100 text-green-700",
};

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function useToken() {
  const { token } = useAuth();
  return token ?? "";
}

export default function NoticesManagerPage() {
  const token = useToken();
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState<Omit<Notice, "id">>(BLANK);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saveError, setSaveError] = useState("");

  const { data: notices = [], isLoading } = useQuery<Notice[]>({
    queryKey: ["admin-notices"],
    queryFn: () =>
      fetch(`${API}/api/admin/notices`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (body: Omit<Notice, "id">) =>
      fetch(`${API}/api/admin/notices`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Save failed");
        return r.json();
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-notices"] }); closeModal(); },
    onError: (e: Error) => setSaveError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Omit<Notice, "id"> }) =>
      fetch(`${API}/api/admin/notices/${id}`, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(body),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).message ?? "Save failed");
        return r.json();
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-notices"] }); closeModal(); },
    onError: (e: Error) => setSaveError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`${API}/api/admin/notices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-notices"] }); setDeleteId(null); },
  });

  function openAdd() {
    setForm(BLANK);
    setSaveError("");
    setModal("add");
  }

  function openEdit(n: Notice) {
    setEditing(n);
    setForm({ title: n.title, description: n.description ?? "", category: n.category, file_url: n.file_url, file_name: n.file_name, file_size: n.file_size, issued_date: n.issued_date, is_active: n.is_active });
    setSaveError("");
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
    setUploadError("");
    setSaveError("");
  }

  function handleSave() {
    setSaveError("");
    if (!form.title.trim()) { setSaveError("Title is required."); return; }
    if (!form.issued_date) { setSaveError("Issued date is required."); return; }
    if (modal === "add") createMutation.mutate(form);
    else if (modal === "edit" && editing) updateMutation.mutate({ id: editing.id, body: form });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/api/admin/notices/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url, name, size } = await res.json();
      setForm((f) => ({ ...f, file_url: url, file_name: name, file_size: size }));
    } catch {
      setUploadError("Upload failed. Ensure file is PDF/DOC/XLS under 20 MB.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-serif text-foreground">Notices &amp; Memos</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage official memos, circulars, and institutional notices displayed on the homepage.</p>
          </div>
          <Button onClick={openAdd} className="bg-[#1A5C38] hover:bg-[#154a2d] text-white" data-testid="btn-add-notice">
            <Plus className="w-4 h-4 mr-2" /> Add Notice
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border rounded-xl">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No notices yet. Click "Add Notice" to create the first one.</p>
          </div>
        ) : (
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-28">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-32">Date Issued</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-20">File</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-20">Status</th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {notices.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium line-clamp-1">{n.title}</p>
                      {n.description && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{n.description}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${CATEGORY_COLORS[n.category]}`}>
                        {n.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(n.issued_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      {n.file_url ? (
                        <a href={n.file_url} target="_blank" rel="noopener noreferrer" className="text-[#1A5C38] hover:underline flex items-center gap-1 text-xs" data-testid={`notice-file-${n.id}`}>
                          <Download className="w-3.5 h-3.5" /> {n.file_size ?? "View"}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${n.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {n.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(n)} className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`btn-edit-notice-${n.id}`}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(n.id)} className="text-muted-foreground hover:text-destructive transition-colors" data-testid={`btn-delete-notice-${n.id}`}>
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
      </div>

      {/* ─── Add / Edit Modal ─── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold font-serif">{modal === "add" ? "Add Notice" : "Edit Notice"}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground" data-testid="btn-modal-close"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title <span className="text-destructive">*</span></label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. VC Circular No. 1/2026 — ..." data-testid="input-notice-title" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Category <span className="text-destructive">*</span></label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="w-full h-9 border rounded-md px-3 text-sm bg-background"
                    data-testid="select-notice-category"
                  >
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date Issued <span className="text-destructive">*</span></label>
                  <Input type="date" value={form.issued_date} onChange={(e) => setForm({ ...form, issued_date: e.target.value })} data-testid="input-notice-date" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief summary (optional)" data-testid="input-notice-description" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Attachment (PDF / DOC / XLS)</label>
                {form.file_url ? (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/40">
                    <Download className="w-4 h-4 text-[#1A5C38] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{form.file_name}</p>
                      <p className="text-xs text-muted-foreground">{form.file_size}</p>
                    </div>
                    <button
                      onClick={() => setForm({ ...form, file_url: null, file_name: null, file_size: null })}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid="btn-remove-file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors" data-testid="label-upload-file">
                    <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Click to upload file"}</span>
                    <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} className="hidden" disabled={uploading} data-testid="input-file-upload" />
                  </label>
                )}
                {uploadError && <p className="text-xs text-destructive mt-1">{uploadError}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" data-testid="checkbox-notice-active" />
                <label htmlFor="is_active" className="text-sm font-medium">Show on website (active)</label>
              </div>

              {saveError && <p className="text-sm text-destructive">{saveError}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={closeModal} data-testid="btn-modal-cancel">Cancel</Button>
              <Button onClick={handleSave} disabled={isBusy || uploading} className="bg-[#1A5C38] hover:bg-[#154a2d] text-white" data-testid="btn-modal-save">
                {isBusy ? "Saving..." : modal === "add" ? "Add Notice" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation ─── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-2">Delete Notice</h2>
            <p className="text-sm text-muted-foreground mb-5">This notice will be permanently removed from the website. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteId(null)} data-testid="btn-delete-cancel">Cancel</Button>
              <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteId!)} disabled={deleteMutation.isPending} data-testid="btn-delete-confirm">
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
