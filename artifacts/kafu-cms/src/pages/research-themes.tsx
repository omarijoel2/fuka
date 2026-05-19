import React, { useEffect, useState } from "react";
import { apiGetResearchThemes, apiPostResearchTheme, apiPutResearchTheme, apiDeleteResearchTheme } from "@/lib/api";
import { FlaskConical, Plus, Edit2, Trash2, X, RefreshCw } from "lucide-react";

interface Theme {
  id: number; name: string; slug: string; description: string;
  colour: string; icon: string; sdg_goals: number[];
  projects_count?: number; publications_count?: number;
}

const COLOUR_PRESETS = ["#228B22","#DAA520","#2563EB","#DC2626","#7C3AED","#0891B2","#D97706","#16A34A"];
const SDG_OPTIONS = Array.from({ length: 17 }, (_, i) => i + 1);

function ThemeModal({ theme, onClose, onSaved }: { theme: Partial<Theme> | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !theme?.id;
  const [form, setForm] = useState({
    name: theme?.name ?? "",
    description: theme?.description ?? "",
    colour: theme?.colour ?? "#228B22",
    icon: theme?.icon ?? "flask",
    sdg_goals: theme?.sdg_goals ?? [] as number[],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleSdg = (n: number) => {
    setForm((f) => ({
      ...f,
      sdg_goals: f.sdg_goals.includes(n) ? f.sdg_goals.filter((x) => x !== n) : [...f.sdg_goals, n],
    }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (isNew) await apiPostResearchTheme(form);
      else await apiPutResearchTheme(theme!.id!, form);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Research Theme" : "Edit Theme"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme Name *</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. Health & Biomedical Sciences" data-testid="input-theme-name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="textarea-theme-description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Theme Colour</label>
            <div className="flex flex-wrap gap-2">
              {COLOUR_PRESETS.map((c) => (
                <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, colour: c }))}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{ backgroundColor: c, borderColor: form.colour === c ? "#000" : "transparent" }}
                  data-testid={`btn-colour-${c.replace("#","")}`} />
              ))}
              <input type="color" value={form.colour} onChange={(e) => setForm((f) => ({ ...f, colour: e.target.value }))}
                className="w-7 h-7 rounded cursor-pointer border" title="Custom colour" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Aligned SDGs</label>
            <div className="flex flex-wrap gap-1.5">
              {SDG_OPTIONS.map((n) => (
                <button key={n} type="button" onClick={() => toggleSdg(n)}
                  className={`text-xs px-2 py-0.5 rounded font-semibold border transition-all ${form.sdg_goals.includes(n) ? "bg-primary text-white border-primary" : "bg-muted text-foreground border-border hover:border-primary"}`}
                  data-testid={`btn-sdg-${n}`}>
                  SDG {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              data-testid="btn-save-theme">
              {saving ? "Saving..." : isNew ? "Create Theme" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResearchThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Theme> | null | false>(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await apiGetResearchThemes();
      setThemes((res as { data: Theme[] }).data ?? res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const deleteTheme = async (id: number) => {
    if (!confirm("Delete this theme? Projects linked to it will lose their theme.")) return;
    try { await apiDeleteResearchTheme(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" /> Research Themes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the strategic research themes that group KAFU's research projects.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new-theme">
            <Plus className="w-4 h-4" /> New Theme
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-muted rounded-xl h-40 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div key={theme.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow" data-testid={`theme-row-${theme.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: theme.colour }} />
                  <h3 className="font-bold text-sm text-foreground">{theme.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal(theme)} className="p-1.5 rounded hover:bg-muted" data-testid={`btn-edit-${theme.id}`}>
                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteTheme(theme.id)} className="p-1.5 rounded hover:bg-red-50" data-testid={`btn-delete-${theme.id}`}>
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{theme.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {(theme.sdg_goals ?? []).map((n) => (
                  <span key={n} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">SDG {n}</span>
                ))}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                <span>{theme.projects_count ?? 0} projects</span>
                <span>{theme.publications_count ?? 0} publications</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== false && (
        <ThemeModal
          theme={modal}
          onClose={() => setModal(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
