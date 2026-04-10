import React, { useEffect, useState } from "react";
import { apiGetPublications, apiPostPublication, apiPutPublication, apiDeletePublication, apiGetResearchProjects } from "@/lib/api";
import { BookOpen, Plus, Edit2, Trash2, X, RefreshCw, Search, ExternalLink } from "lucide-react";

interface Project { id: number; title: string; }
interface Author { name: string; affiliation?: string; }
interface Publication {
  id: number; slug: string; title: string; year: number; journal?: string; publisher?: string;
  doi?: string; url?: string; type: string; abstract?: string; indexed_in: string[];
  volume?: string; issue?: string; pages?: string; is_featured: boolean;
  authors: Author[]; citation: string; research_project_id?: number;
  project?: { title: string };
}

const PUB_TYPES = ["journal", "conference", "book_chapter", "thesis", "report", "book", "preprint"];
const TYPE_LABELS: Record<string, string> = {
  journal: "Journal", conference: "Conference", book_chapter: "Book Chapter",
  thesis: "Thesis", report: "Report", book: "Book", preprint: "Preprint",
};
const INDEX_OPTIONS = ["Scopus", "Web of Science", "PubMed", "ERIC", "DOAJ", "Crossref", "Google Scholar"];

function PubModal({ pub, projects, onClose, onSaved }: {
  pub: Partial<Publication> | null; projects: Project[]; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !pub?.id;
  const [form, setForm] = useState({
    title: pub?.title ?? "",
    year: pub?.year ?? new Date().getFullYear(),
    type: pub?.type ?? "journal",
    journal: pub?.journal ?? "",
    publisher: pub?.publisher ?? "",
    doi: pub?.doi ?? "",
    url: pub?.url ?? "",
    abstract: pub?.abstract ?? "",
    volume: pub?.volume ?? "",
    issue: pub?.issue ?? "",
    pages: pub?.pages ?? "",
    indexed_in: pub?.indexed_in ?? [] as string[],
    authors_raw: pub?.authors?.map((a) => a.name).join("; ") ?? "",
    is_featured: pub?.is_featured ?? false,
    research_project_id: pub?.research_project_id ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleIndex = (idx: string) => setForm((f) => ({
    ...f, indexed_in: f.indexed_in.includes(idx) ? f.indexed_in.filter((x) => x !== idx) : [...f.indexed_in, idx],
  }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const authors = form.authors_raw.split(";").map((n) => ({ name: n.trim() })).filter((a) => a.name);
      const payload = { ...form, authors, research_project_id: form.research_project_id || null };
      if (isNew) await apiPostPublication(payload);
      else await apiPutPublication(pub!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Publication" : "Edit Publication"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-pub-title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Authors (semicolon-separated) *</label>
            <input required value={form.authors_raw} onChange={(e) => setForm((f) => ({ ...f, authors_raw: e.target.value }))}
              placeholder="Smith, J.; Doe, A.; Kamau, W."
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-authors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="select-pub-type">
                {PUB_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <input type="number" required min={1980} max={new Date().getFullYear() + 1}
                value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-year" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Journal / Publisher</label>
              <input value={form.journal} onChange={(e) => setForm((f) => ({ ...f, journal: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-journal" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DOI</label>
              <input value={form.doi} onChange={(e) => setForm((f) => ({ ...f, doi: e.target.value }))}
                placeholder="10.xxxx/xxxxx"
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-doi" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Volume</label>
              <input value={form.volume} onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-volume" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Issue</label>
              <input value={form.issue} onChange={(e) => setForm((f) => ({ ...f, issue: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-issue" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pages</label>
              <input value={form.pages} onChange={(e) => setForm((f) => ({ ...f, pages: e.target.value }))}
                placeholder="e.g. 123-145"
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-pages" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input type="url" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-url" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Abstract</label>
            <textarea rows={3} value={form.abstract} onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="textarea-abstract" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Indexed In</label>
            <div className="flex flex-wrap gap-2">
              {INDEX_OPTIONS.map((idx) => (
                <button key={idx} type="button" onClick={() => toggleIndex(idx)}
                  className={`text-xs px-2.5 py-1 rounded font-semibold border transition-all ${form.indexed_in.includes(idx) ? "bg-primary text-white border-primary" : "bg-muted text-foreground border-border"}`}
                  data-testid={`btn-index-${idx.toLowerCase().replace(/\s/g, "-")}`}>
                  {idx}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Linked Research Project</label>
            <select value={form.research_project_id} onChange={(e) => setForm((f) => ({ ...f, research_project_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              data-testid="select-project">
              <option value="">No linked project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_featured" checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              className="rounded" data-testid="checkbox-featured" />
            <label htmlFor="is_featured" className="text-sm">Feature on Research Overview page</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              data-testid="btn-save-pub">
              {saving ? "Saving..." : isNew ? "Create Publication" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResearchPublicationsCmsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Publication> | null | false>(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [pubRes, projRes] = await Promise.all([
        apiGetPublications({ search: search || undefined, type: typeFilter || undefined, per_page: 50 }),
        apiGetResearchProjects({ per_page: 100 }),
      ]);
      setPublications((pubRes as { data: Publication[] }).data ?? pubRes);
      setProjects((projRes as { data: Project[] }).data ?? projRes);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, typeFilter]);

  const deletePub = async (id: number) => {
    if (!confirm("Delete this publication?")) return;
    try { await apiDeletePublication(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Publications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage KAFU's scholarly publications repository.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new-pub">
            <Plus className="w-4 h-4" /> Add Publication
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search publications..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-search" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-type-filter">
          <option value="">All Types</option>
          {PUB_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Type · Year</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Journal</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : publications.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No publications found</td></tr>
            ) : publications.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors" data-testid={`pub-row-${p.id}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{p.title}</p>
                  {p.is_featured && <span className="text-[10px] text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded">Featured</span>}
                  <p className="text-xs text-muted-foreground mt-0.5">{p.authors?.map((a) => a.name).join("; ")}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{TYPE_LABELS[p.type]}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.year}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">{p.journal ?? p.publisher ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end items-center">
                    {p.doi && (
                      <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-muted" title="View DOI" data-testid={`btn-doi-${p.id}`}>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    )}
                    <button onClick={() => setModal(p)} className="p-1.5 rounded hover:bg-muted" data-testid={`btn-edit-${p.id}`}>
                      <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => deletePub(p.id)} className="p-1.5 rounded hover:bg-red-50" data-testid={`btn-delete-${p.id}`}>
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== false && (
        <PubModal pub={modal} projects={projects} onClose={() => setModal(false)} onSaved={load} />
      )}
    </div>
  );
}
