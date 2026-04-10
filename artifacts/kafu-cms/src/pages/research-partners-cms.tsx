import React, { useEffect, useState } from "react";
import { apiGetResearchPartners, apiPostResearchPartner, apiPutResearchPartner, apiDeleteResearchPartner } from "@/lib/api";
import { HeartHandshake, Plus, Edit2, Trash2, X, RefreshCw, Globe } from "lucide-react";

interface Partner {
  id: number; name: string; slug: string; type: string; country?: string;
  description?: string; logo_url?: string; website_url?: string;
  collaboration_areas: string[]; is_featured: boolean;
}

const PARTNER_TYPES = ["academic", "government", "ngo", "donor", "industry", "international"];
const TYPE_LABELS: Record<string, string> = {
  academic: "Academic", government: "Government", ngo: "NGO",
  donor: "Donor", industry: "Industry", international: "International",
};

function PartnerModal({ partner, onClose, onSaved }: {
  partner: Partial<Partner> | null; onClose: () => void; onSaved: () => void;
}) {
  const isNew = !partner?.id;
  const [form, setForm] = useState({
    name: partner?.name ?? "",
    type: partner?.type ?? "academic",
    country: partner?.country ?? "",
    description: partner?.description ?? "",
    logo_url: partner?.logo_url ?? "",
    website_url: partner?.website_url ?? "",
    collaboration_areas_raw: partner?.collaboration_areas?.join(", ") ?? "",
    is_featured: partner?.is_featured ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const collaboration_areas = form.collaboration_areas_raw
        .split(",").map((s) => s.trim()).filter(Boolean);
      const payload = { ...form, collaboration_areas };
      if (isNew) await apiPostResearchPartner(payload);
      else await apiPutResearchPartner(partner!.id!, payload);
      onSaved(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "New Partner" : "Edit Partner"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Partner Name *</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-partner-name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="select-partner-type">
                {PARTNER_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-country" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="textarea-description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Collaboration Areas (comma-separated)</label>
            <input value={form.collaboration_areas_raw} onChange={(e) => setForm((f) => ({ ...f, collaboration_areas_raw: e.target.value }))}
              placeholder="Health Research, Capacity Building, Student Exchange"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-collaboration-areas" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input type="url" value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-logo-url" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input type="url" value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                data-testid="input-website-url" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_featured" checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              className="rounded" data-testid="checkbox-featured" />
            <label htmlFor="is_featured" className="text-sm">Feature on Partnerships page</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              data-testid="btn-save-partner">
              {saving ? "Saving..." : isNew ? "Add Partner" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm hover:bg-muted" data-testid="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResearchPartnersCmsPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Partner> | null | false>(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await apiGetResearchPartners({ type: typeFilter || undefined });
      setPartners((res as { data: Partner[] }).data ?? res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [typeFilter]);

  const deletePartner = async (id: number) => {
    if (!confirm("Delete this partner?")) return;
    try { await apiDeleteResearchPartner(id); load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-primary" /> Research Partners
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage KAFU's research collaboration partners worldwide.</p>
        </div>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-type-filter">
            <option value="">All Types</option>
            {PARTNER_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          <button onClick={load} className="p-2 rounded-lg border hover:bg-muted" data-testid="btn-refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90" data-testid="btn-new-partner">
            <Plus className="w-4 h-4" /> New Partner
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="bg-muted rounded-xl h-40 animate-pulse" />)
        ) : partners.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">No partners found</div>
        ) : partners.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow" data-testid={`partner-row-${p.id}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {TYPE_LABELS[p.type] ?? p.type}
                  </span>
                  {p.is_featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 font-bold">Featured</span>}
                </div>
                <h3 className="font-bold text-sm text-foreground">{p.name}</h3>
                {p.country && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Globe className="w-3 h-3" /> {p.country}
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setModal(p)} className="p-1.5 rounded hover:bg-muted" data-testid={`btn-edit-${p.id}`}>
                  <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => deletePartner(p.id)} className="p-1.5 rounded hover:bg-red-50" data-testid={`btn-delete-${p.id}`}>
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
            {p.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
            {(p.collaboration_areas?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {p.collaboration_areas?.slice(0, 3).map((a) => (
                  <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a}</span>
                ))}
                {(p.collaboration_areas?.length ?? 0) > 3 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{(p.collaboration_areas?.length ?? 0) - 3} more</span>
                )}
              </div>
            )}
            {p.website_url && (
              <a href={p.website_url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1" data-testid={`btn-website-${p.id}`}>
                <Globe className="w-3 h-3" /> Website
              </a>
            )}
          </div>
        ))}
      </div>

      {modal !== false && (
        <PartnerModal partner={modal} onClose={() => setModal(false)} onSaved={load} />
      )}
    </div>
  );
}
