import React, { useEffect, useState } from "react";
import {
  apiGetResearchProjects, apiPostResearchProject, apiPutResearchProject, apiDeleteResearchProject,
  apiGetResearchThemes, formatDate
} from "@/lib/api";
import { FlaskConical, Plus, Edit2, Trash2, X, RefreshCw, Search } from "lucide-react";

interface Theme { id: number; name: string; colour: string; }
interface Project {
  id: number; slug: string; title: string; abstract: string;
  department: string; lead_researcher: string; status: string;
  start_date?: string; end_date?: string; funding_source?: string;
  is_featured: boolean; theme_id?: number; sdg_goals: number[];
  theme?: Theme; co_researchers?: { name: string }[];
}

const STATUSES = ["planned", "active", "completed", "suspended"];
const STATUS_COLOURS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800", completed: "bg-blue-100 text-blue-800",
  planned: "bg-yellow-100 text-yellow-800", suspended: "bg-gray-100 text-gray-600",
};

function ProjectModal({ project, themes, onClose, onSaved }: {
  project: Partial<Project> | null; themes: Theme[]; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !project?.id;
  const [form, setForm] = useState({
    title: project?.title ?? "",
    abstract: project?.abstract ?? "",
    department: project?.department ?? "",
    lead_researcher: project?.lead_researcher ?? "",
    status: project?.status ?? "planned",
    start_date: project?.start_date ?? "",
    end_date: project?.end_date ?? "",
    funding_source: project?.funding_source ?? "",
    theme_id: project?.theme_id ?? project?.theme?.id ?? "",
    is_featured: project?.is_featured ?? false,
    sdg_goals: project?.sdg_goals ?? [] as number[],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleSdg = (n: number) => setForm((f) => ({
    ...f, sdg_goals: f.sdg_goals.includes(n) ? f.sdg_goals.filter((x) => x !== n) : [...f.sdg_goals, n],
  }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, theme_id: form.theme_id || null };
      if (isNew) await apiPostResearchProject(payload);
      else await apiPutResearchProject(project!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Research Project" : "Edit Project"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Project Title *</label>
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-project-title" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Abstract *</label>
              <textarea rows={4} required value={form.abstract} onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="textarea-project-abstract" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lead Researcher *</label>
              <input required value={form.lead_researcher} onChange={(e) => setForm((f) => ({ ...f, lead_researcher: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-lead-researcher" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-department" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="select-status">
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Research Theme</label>
              <select value={form.theme_id} onChange={(e) => setForm((f) => ({ ...f, theme_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="select-theme">
                <option value="">No Theme</option>
                {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-start-date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-end-date" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Funding Source</label>
              <input value={form.funding_source} onChange={(e) => setForm((f) => ({ ...f, funding_source: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-funding-source" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SDG Alignment</label>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 17 }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" onClick={() => toggleSdg(n)}
                  className={`text-xs px-2 py-0.5 rounded font-semibold border transition-all ${form.sdg_goals.includes(n) ? "bg-primary text-white border-primary" : "bg-muted text-foreground border-border"}`}
                  data-testid={`btn-sdg-${n}`}>SDG {n}</button>
              ))}
            </div>
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
              data-testid="btn-save-project">
              {saving ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResearchProjectsCmsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Project> | null | false>(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [projRes, themeRes] = await Promise.all([
        apiGetResearchProjects({ search: search || undefined, status: statusFilter || undefined, per_page: 50 }),
        apiGetResearchThemes(),
      ]);
      setProjects((projRes as { data: Project[] }).data ?? projRes);
      setThemes((themeRes as { data: Theme[] }).data ?? themeRes);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, statusFilter]);

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this research project?")) return;
    try { await apiDeleteResearchProject(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" /> Research Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all KAFU research projects, their status, teams, and funding.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new-project">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-search" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-status-filter">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Project</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Lead</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">Theme</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              ))
            ) : projects.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No projects found</td></tr>
            ) : projects.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors" data-testid={`project-row-${p.id}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{p.title}</p>
                  {p.is_featured && <span className="text-[10px] text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded">Featured</span>}
                  {p.department && <p className="text-xs text-muted-foreground">{p.department}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.lead_researcher}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {p.theme ? (
                    <span className="text-xs px-2 py-0.5 rounded-full text-white font-semibold" style={{ backgroundColor: p.theme.colour }}>
                      {p.theme.name}
                    </span>
                  ) : <span className="text-muted-foreground text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOURS[p.status]}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setModal(p)} className="p-1.5 rounded hover:bg-muted" data-testid={`btn-edit-${p.id}`}>
                      <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded hover:bg-red-50" data-testid={`btn-delete-${p.id}`}>
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
        <ProjectModal
          project={modal}
          themes={themes}
          onClose={() => setModal(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
