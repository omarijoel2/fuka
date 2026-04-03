import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { apiGet, apiPost, apiPut, apiDelete, CONTENT_TYPE_LABELS, CONTENT_TYPES, WORKFLOW_TRANSITIONS, STATUS_LABELS, formatDateTime, type WorkflowStatus } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import { Save, Trash2, Clock, ArrowLeft, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

interface ContentItem {
  id?: number;
  title: string;
  slug: string;
  type: string;
  status: WorkflowStatus;
  summary: string;
  body: string;
  meta_title: string;
  meta_description: string;
  featured_image_url: string;
  featured_image?: string;
  seo_meta?: { title?: string; description?: string } | null;
  author?: string | { id: number; name: string; role: string } | null;
  author_id?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  scheduled_at?: string | null;
  publish_date?: string | null;
}

interface Revision {
  id: number; version: number; status: string; created_at: string; created_by: number;
  change_summary?: string;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ContentEditorPage({ id }: { id?: string }) {
  const isNew = !id || id === "new";
  const [, navigate] = useLocation();

  const [form, setForm] = useState<ContentItem>({
    title: "", slug: "", type: "news", status: "draft",
    summary: "", body: "", meta_title: "", meta_description: "",
    featured_image_url: "",
  });
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await apiGet(`/content/${id}`);
      const raw = res?.data ?? res;
      const seoMeta = raw?.seo_meta ?? {};
      setForm({
        ...raw,
        meta_title: seoMeta?.title ?? raw?.title ?? "",
        meta_description: seoMeta?.description ?? raw?.summary ?? "",
        featured_image_url: raw?.featured_image ?? "",
        summary: raw?.summary ?? "",
        body: raw?.body ?? "",
      });
      const revData = await apiGet(`/content/${id}/revisions`);
      setRevisions(revData?.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load content.");
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => { load(); }, [load]);

  const field = (key: keyof ContentItem, value: string) => {
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(key === "title" && isNew ? { slug: slugify(value), meta_title: value } : {}),
    }));
  };

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError(""); setSuccess("");
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        type: form.type,
        summary: form.summary,
        body: form.body,
        featured_image: form.featured_image_url || form.featured_image || "",
        seo_meta: {
          title: form.meta_title || form.title,
          description: form.meta_description || form.summary,
        },
      };
      if (isNew) {
        const res = await apiPost("/content", payload);
        setSuccess("Content created.");
        const newId = res?.data?.id ?? res?.id;
        navigate(`/content/${newId}`);
      } else {
        await apiPut(`/content/${id}`, payload);
        setSuccess("Changes saved.");
        await load();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const transition = async (to: WorkflowStatus) => {
    setTransitioning(to);
    setError(""); setSuccess("");
    try {
      const body: Record<string, string> = { to_status: to };
      if (to === "scheduled" && scheduleAt) body.scheduled_at = scheduleAt;
      await apiPost(`/content/${id}/transition`, body);
      setSuccess(`Status changed to ${STATUS_LABELS[to]}.`);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Transition failed.");
    } finally {
      setTransitioning(null);
    }
  };

  const deleteItem = async () => {
    if (!window.confirm("Delete this content item? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await apiDelete(`/content/${id}`);
      navigate("/content");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed.");
      setDeleting(false);
    }
  };

  const restoreRevision = async (revId: number) => {
    if (!window.confirm("Restore this revision? Current content will be replaced.")) return;
    try {
      await apiPost(`/content/${id}/revisions/${revId}/restore`);
      setSuccess("Revision restored.");
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Restore failed.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  const transitions = WORKFLOW_TRANSITIONS[form.status as WorkflowStatus] ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/content")} className="p-1.5 rounded hover:bg-muted text-muted-foreground" data-testid="btn-back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{isNew ? "New Content" : form.title || "Edit Content"}</h1>
            {!isNew && <StatusBadge status={form.status} />}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!isNew && (
            <button
              onClick={deleteItem}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition"
              data-testid="btn-delete"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            data-testid="btn-save"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="field-title">Title</label>
              <input
                id="field-title"
                type="text"
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                placeholder="Content title"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="field-slug">Slug</label>
              <input
                id="field-slug"
                type="text"
                value={form.slug}
                onChange={(e) => field("slug", e.target.value)}
                placeholder="url-slug"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="field-summary">Summary</label>
              <textarea
                id="field-summary"
                rows={2}
                value={form.summary}
                onChange={(e) => field("summary", e.target.value)}
                placeholder="Brief description..."
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-summary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="field-body">Body Content</label>
              <textarea
                id="field-body"
                rows={16}
                value={form.body}
                onChange={(e) => field("body", e.target.value)}
                placeholder="Content body (HTML or Markdown accepted)..."
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-body"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">SEO</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => field("meta_title", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-meta-title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Meta Description</label>
              <textarea
                rows={2}
                value={form.meta_description}
                onChange={(e) => field("meta_description", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-meta-desc"
              />
            </div>
          </div>
        </div>

        {/* Sidebar panel */}
        <div className="space-y-5">
          {/* Properties */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Properties</h3>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Content Type</label>
              <select
                value={form.type}
                onChange={(e) => field("type", e.target.value)}
                disabled={!isNew}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none disabled:opacity-60"
                data-testid="select-content-type"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>{CONTENT_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Featured Image URL</label>
              <input
                type="url"
                value={form.featured_image_url}
                onChange={(e) => field("featured_image_url", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-featured-image"
              />
              {form.featured_image_url && (
                <img src={form.featured_image_url} alt="" className="mt-2 w-full rounded-lg aspect-video object-cover border border-border" />
              )}
            </div>
            {!isNew && (
              <div className="space-y-1 text-xs text-muted-foreground border-t border-border pt-3">
                {form.author && (
              <p>Author: <span className="font-medium text-foreground">
                {typeof form.author === "object" ? form.author.name : form.author}
              </span></p>
            )}
                {form.created_at && <p>Created: {formatDateTime(form.created_at)}</p>}
                {form.updated_at && <p>Updated: {formatDateTime(form.updated_at)}</p>}
                {form.published_at && <p>Published: {formatDateTime(form.published_at)}</p>}
                {form.scheduled_at && <p>Scheduled: {formatDateTime(form.scheduled_at)}</p>}
              </div>
            )}
          </div>

          {/* Workflow */}
          {!isNew && transitions.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground">Workflow</h3>
              {transitions.some((t) => t.to === "scheduled") && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleAt}
                    onChange={(e) => setScheduleAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                    data-testid="input-schedule-at"
                  />
                </div>
              )}
              {transitions.map((t) => (
                <button
                  key={t.to}
                  onClick={() => transition(t.to)}
                  disabled={!!transitioning}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 ${
                    t.variant === "outline"
                      ? "border border-border text-foreground hover:bg-muted"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                  data-testid={`btn-transition-${t.to}`}
                >
                  {transitioning === t.to ? "..." : t.label}
                </button>
              ))}
            </div>
          )}

          {/* Revision history */}
          {!isNew && revisions.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-3">
              <button
                onClick={() => setShowRevisions((s) => !s)}
                className="w-full flex items-center justify-between text-sm font-bold text-foreground"
                data-testid="btn-toggle-revisions"
              >
                <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Revision History</span>
                {showRevisions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showRevisions && (
                <div className="space-y-2 border-t border-border pt-3">
                  {revisions.map((rev) => (
                    <div key={rev.id} className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <p className="font-medium text-foreground">v{rev.version} &bull; {rev.change_summary ?? rev.status}</p>
                        <p className="text-muted-foreground">{formatDateTime(rev.created_at)}</p>
                      </div>
                      <button
                        onClick={() => restoreRevision(rev.id)}
                        className="text-primary hover:underline shrink-0"
                        data-testid={`btn-restore-${rev.id}`}
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
