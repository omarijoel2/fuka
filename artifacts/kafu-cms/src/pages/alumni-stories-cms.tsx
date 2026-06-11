import React, { useEffect, useState } from "react";
import {
  apiGetAlumniStories, apiPostAlumniStory, apiPutAlumniStory, apiDeleteAlumniStory,
} from "@/lib/api";
import { Quote, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Story {
  id: number; slug: string; title: string; summary: string; body?: string;
  alumni_name?: string; alumni_id?: number; programme?: string;
  graduation_year?: number; photo_url?: string; video_url?: string;
  is_featured: boolean; is_published: boolean;
}

function StoryModal({ item, onClose, onSaved }: {
  item: Partial<Story> | null; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    title: item?.title ?? "",
    summary: item?.summary ?? "",
    body: item?.body ?? "",
    alumni_name: item?.alumni_name ?? "",
    programme: item?.programme ?? "",
    graduation_year: item?.graduation_year ?? "",
    photo_url: item?.photo_url ?? "",
    video_url: item?.video_url ?? "",
    is_featured: item?.is_featured ?? false,
    is_published: item?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, graduation_year: form.graduation_year ? Number(form.graduation_year) : null };
      if (isNew) await apiPostAlumniStory(payload);
      else await apiPutAlumniStory(item!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Success Story" : "Edit Story"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Summary *</label>
            <textarea rows={2} required value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="textarea-summary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Story</label>
            <textarea rows={6} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="textarea-body" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Alumni Name</label>
              <input value={form.alumni_name} onChange={(e) => setForm((f) => ({ ...f, alumni_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-alumni-name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Programme</label>
              <input value={form.programme} onChange={(e) => setForm((f) => ({ ...f, programme: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graduation Year</label>
              <input type="number" value={form.graduation_year} onChange={(e) => setForm((f) => ({ ...f, graduation_year: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-grad-year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photo URL</label>
              <input value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-photo-url" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Video URL (YouTube)</label>
              <input value={form.video_url} onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-video-url" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="rounded" data-testid="checkbox-featured" />
              Featured story
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} className="rounded" data-testid="checkbox-published" />
              Published
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50" data-testid="btn-save">
              {saving ? "Saving..." : isNew ? "Create Story" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AlumniStoriesCmsPage() {
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Story> | null | false>(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await apiGetAlumniStories();
      setItems((res as { data: Story[] }).data ?? res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this story?")) return;
    try { await apiDeleteAlumniStory(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Quote className="w-6 h-6 text-primary" /> Alumni Success Stories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage written and video stories that showcase graduate journeys.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new">
            <Plus className="w-4 h-4" /> New Story
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Alumnus</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No stories found</td></tr>
            ) : items.map((i) => (
              <tr key={i.id} className="hover:bg-muted/30 transition-colors" data-testid={`story-row-${i.id}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{i.title}</p>
                  {i.video_url && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">Video</span>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{i.alumni_name ?? "—"}{i.graduation_year ? ` '${String(i.graduation_year).slice(-2)}` : ""}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {i.is_featured && <span className="text-[10px] text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded">Featured</span>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${i.is_published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{i.is_published ? "Published" : "Draft"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setModal(i)} className="p-1.5 rounded hover:bg-muted" data-testid={`btn-edit-${i.id}`}><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => remove(i.id)} className="p-1.5 rounded hover:bg-red-50" data-testid={`btn-delete-${i.id}`}><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== false && <StoryModal item={modal} onClose={() => setModal(false)} onSaved={load} />}
    </div>
  );
}
