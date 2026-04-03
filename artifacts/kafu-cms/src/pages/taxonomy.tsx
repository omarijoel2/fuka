import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { Tag, Plus, Edit2, Trash2, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";

interface TaxonomyTerm {
  id: number; name: string; slug: string; vocabulary: string;
  description?: string; parent_id?: number | null; sort_order: number;
  children?: TaxonomyTerm[];
}

const VOCABULARY_LABELS: Record<string, string> = {
  category: "Categories", tag: "Tags", school: "Schools", department: "Departments",
  programme_level: "Programme Levels", event_type: "Event Types",
  announcement_type: "Announcement Types", opportunity_type: "Opportunity Types",
  media_type: "Media Types", research_area: "Research Areas",
  publication_type: "Publication Types", partner_type: "Partner Types",
};

export default function TaxonomyPage() {
  const [terms, setTerms] = useState<TaxonomyTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVocab, setActiveVocab] = useState("category");
  const [modal, setModal] = useState<Partial<TaxonomyTerm> | null | false>(false);
  const [expandedTerms, setExpandedTerms] = useState<Set<number>>(new Set());

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiGet("/taxonomy");
      setTerms(data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load taxonomy.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const vocabs = Object.keys(VOCABULARY_LABELS);
  const vocabTerms = terms.filter((t) => t.vocabulary === activeVocab);
  const topLevel = vocabTerms.filter((t) => !t.parent_id);
  const childrenOf = (id: number) => vocabTerms.filter((t) => t.parent_id === id);

  const deleteTerm = async (id: number) => {
    if (!window.confirm("Delete this taxonomy term?")) return;
    try { await apiDelete(`/taxonomy/${id}`); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Taxonomy Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{terms.length} terms across {vocabs.length} vocabularies</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition" data-testid="btn-refresh-taxonomy">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setModal({ vocabulary: activeVocab })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90" data-testid="btn-add-term">
            <Plus className="w-4 h-4" /> Add Term
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex gap-6">
        {/* Vocabulary list */}
        <div className="w-48 shrink-0">
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            {vocabs.map((v) => {
              const count = terms.filter((t) => t.vocabulary === v).length;
              return (
                <button key={v} onClick={() => setActiveVocab(v)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm border-b border-border last:border-0 transition ${activeVocab === v ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"}`}
                  data-testid={`vocab-${v}`}>
                  <span>{VOCABULARY_LABELS[v]}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms for selected vocabulary */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">{VOCABULARY_LABELS[activeVocab]}</h2>
              <span className="text-xs text-muted-foreground">{vocabTerms.length} terms</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Loading...</div>
            ) : topLevel.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                <Tag className="w-8 h-8 opacity-30" />
                <p className="text-sm">No terms yet. Add the first one.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {topLevel.map((term) => {
                  const children = childrenOf(term.id);
                  const expanded = expandedTerms.has(term.id);
                  return (
                    <div key={term.id}>
                      <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20">
                        {children.length > 0 ? (
                          <button onClick={() => setExpandedTerms((s) => { const n = new Set(s); n.has(term.id) ? n.delete(term.id) : n.add(term.id); return n; })}
                            className="text-muted-foreground hover:text-foreground">
                            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        ) : <div className="w-3.5" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{term.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{term.slug}</p>
                        </div>
                        {term.description && <p className="text-xs text-muted-foreground truncate max-w-xs hidden lg:block">{term.description}</p>}
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => setModal(term)}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary" data-testid={`btn-edit-term-${term.id}`}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteTerm(term.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600" data-testid={`btn-delete-term-${term.id}`}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {expanded && children.map((child) => (
                        <div key={child.id} className="flex items-center gap-3 px-5 py-2.5 pl-11 bg-muted/20 hover:bg-muted/30 border-t border-border/50">
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{child.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{child.slug}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setModal(child)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary" data-testid={`btn-edit-term-${child.id}`}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteTerm(child.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600" data-testid={`btn-delete-term-${child.id}`}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal !== false && (
        <TermModal
          term={modal}
          vocabulary={activeVocab}
          parentOptions={vocabTerms.filter((t) => !t.parent_id)}
          onClose={() => setModal(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}

function TermModal({ term, vocabulary, parentOptions, onClose, onSaved }: {
  term: Partial<TaxonomyTerm> | null; vocabulary: string;
  parentOptions: TaxonomyTerm[]; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !term?.id;
  const [form, setForm] = useState({
    name: term?.name ?? "", slug: term?.slug ?? "",
    vocabulary: term?.vocabulary ?? vocabulary,
    description: term?.description ?? "",
    parent_id: term?.parent_id ?? "",
    sort_order: term?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const body = { ...form, parent_id: form.parent_id || null };
      if (isNew) await apiPost("/taxonomy", body);
      else await apiPut(`/taxonomy/${term!.id}`, body);
      onSaved(); onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">{isNew ? "Add Term" : "Edit Term"}</h2>
        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input type="text" required value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-term-name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
            <input type="text" required value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm font-mono focus:outline-none"
              data-testid="input-term-slug" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <input type="text" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
              data-testid="input-term-desc" />
          </div>
          {parentOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Parent Term</label>
              <select value={form.parent_id ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                data-testid="select-parent-term">
                <option value="">None (top-level)</option>
                {parentOptions.filter((p) => p.id !== term?.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted" data-testid="btn-cancel-term">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60" data-testid="btn-save-term">
              {saving ? "Saving..." : "Save Term"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
