import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { apiGet, apiPost, apiPut, apiDelete, CONTENT_TYPE_LABELS, CONTENT_TYPES, WORKFLOW_TRANSITIONS, STATUS_LABELS, formatDateTime, type WorkflowStatus } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import { Save, Trash2, Clock, ArrowLeft, RotateCcw, ChevronDown, ChevronUp, Plus, X } from "lucide-react";

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
  structured_data?: Record<string, unknown> | null;
  category?: string;
  department?: string;
  school_code?: string;
  tags?: string[];
  featured?: boolean;
}

interface Revision {
  id: number; version: number; status: string; created_at: string; created_by: number;
  change_summary?: string;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sdField(sd: Record<string, unknown>, key: string): string {
  return (sd[key] as string) ?? "";
}

function sdListField(sd: Record<string, unknown>, key: string): string[] {
  return (sd[key] as string[]) ?? [];
}

function sdObjField(sd: Record<string, unknown>, key: string): Record<string, string> {
  return (sd[key] as Record<string, string>) ?? {};
}

export default function ContentEditorPage({ id }: { id?: string }) {
  const isNew = !id || id === "new";
  const [, navigate] = useLocation();

  const [form, setForm] = useState<ContentItem>({
    title: "", slug: "", type: "news", status: "draft",
    summary: "", body: "", meta_title: "", meta_description: "",
    featured_image_url: "", structured_data: {}, category: "", department: "", school_code: "", tags: [], featured: false,
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
  const [requirementInput, setRequirementInput] = useState("");

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
        structured_data: raw?.structured_data ?? {},
        category: raw?.category ?? "",
        department: raw?.department ?? "",
        school_code: raw?.school_code ?? "",
        tags: raw?.tags ?? [],
        featured: raw?.featured ?? false,
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

  const field = (key: keyof ContentItem, value: unknown) => {
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(key === "title" && isNew ? { slug: slugify(value as string), meta_title: value as string } : {}),
    }));
  };

  const setSd = (key: string, value: unknown) => {
    setForm((f) => ({
      ...f,
      structured_data: { ...(f.structured_data ?? {}), [key]: value },
    }));
  };

  const sd = form.structured_data ?? {};

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
        category: form.category || null,
        department: form.department || null,
        school_code: form.school_code ? form.school_code.toUpperCase() : null,
        tags: form.tags ?? [],
        featured: form.featured ?? false,
        featured_image: form.featured_image_url || form.featured_image || "",
        structured_data: form.structured_data ?? {},
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
          {/* Core fields */}
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
                placeholder="Content body (HTML or plain text)..."
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-body"
              />
            </div>
          </div>

          {/* TYPE-SPECIFIC FIELDS — Event */}
          {form.type === "event" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Event Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    value={sdField(sd, "date")}
                    onChange={(e) => setSd("date", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-event-date"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    value={sdField(sd, "end_date")}
                    onChange={(e) => setSd("end_date", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-event-end-date"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Time (e.g. 09:00 – 17:00)</label>
                  <input
                    type="text"
                    value={sdField(sd, "time")}
                    onChange={(e) => setSd("time", e.target.value)}
                    placeholder="09:00 – 17:00"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-event-time"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Event Status</label>
                  <select
                    value={sdField(sd, "event_status") || "upcoming"}
                    onChange={(e) => setSd("event_status", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                    data-testid="select-event-status"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={sdField(sd, "location")}
                  onChange={(e) => setSd("location", e.target.value)}
                  placeholder="e.g. Main Campus, Kaimosi"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-event-location"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Registration Link (optional)</label>
                <input
                  type="url"
                  value={sdField(sd, "registration_link")}
                  onChange={(e) => setSd("registration_link", e.target.value)}
                  placeholder="https://portal.kafu.ac.ke"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-event-reg-link"
                />
              </div>
            </div>
          )}

          {/* TYPE-SPECIFIC FIELDS — Announcement */}
          {form.type === "announcement" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Announcement Details</h3>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Priority</label>
                <select
                  value={sdField(sd, "priority") || "normal"}
                  onChange={(e) => setSd("priority", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                  data-testid="select-announcement-priority"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          )}

          {/* TYPE-SPECIFIC FIELDS — Opportunity */}
          {form.type === "opportunity" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Opportunity Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <select
                    value={sdField(sd, "opportunity_category") || "notice"}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const typeLabels: Record<string, string> = {
                        tender: "Tender", vacancy: "Job Vacancy", internship: "Internship",
                        scholarship: "Scholarship", call: "Call for Applications", notice: "Notice",
                      };
                      setSd("opportunity_category", cat);
                      setSd("opportunity_type", typeLabels[cat] ?? cat);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                    data-testid="select-opportunity-category"
                  >
                    <option value="tender">Tender</option>
                    <option value="vacancy">Job Vacancy</option>
                    <option value="internship">Internship</option>
                    <option value="scholarship">Scholarship/Bursary</option>
                    <option value="call">Call for Applications</option>
                    <option value="notice">Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={sdField(sd, "opportunity_status") || "open"}
                    onChange={(e) => setSd("opportunity_status", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                    data-testid="select-opportunity-status"
                  >
                    <option value="open">Open</option>
                    <option value="closing-soon">Closing Soon</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Reference Number</label>
                <input
                  type="text"
                  value={sdField(sd, "reference")}
                  onChange={(e) => setSd("reference", e.target.value)}
                  placeholder="e.g. KAFU/PROC/001/2026"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-opp-reference"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={sdField(sd, "deadline")}
                    onChange={(e) => setSd("deadline", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-opp-deadline"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Deadline Time</label>
                  <input
                    type="text"
                    value={sdField(sd, "deadline_time")}
                    onChange={(e) => setSd("deadline_time", e.target.value)}
                    placeholder="17:00"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-opp-deadline-time"
                  />
                </div>
              </div>

              {/* Requirements list */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Requirements</label>
                <div className="space-y-1.5">
                  {sdListField(sd, "requirements").map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="flex-1 text-sm bg-muted rounded px-2 py-1">{req}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const list = sdListField(sd, "requirements").filter((_, idx) => idx !== i);
                          setSd("requirements", list);
                        }}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`btn-remove-req-${i}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (requirementInput.trim()) {
                            setSd("requirements", [...sdListField(sd, "requirements"), requirementInput.trim()]);
                            setRequirementInput("");
                          }
                        }
                      }}
                      placeholder="Add requirement and press Enter"
                      className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      data-testid="input-opp-req"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (requirementInput.trim()) {
                          setSd("requirements", [...sdListField(sd, "requirements"), requirementInput.trim()]);
                          setRequirementInput("");
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
                      data-testid="btn-add-req"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submission info */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Submission Instructions</label>
                <textarea
                  rows={3}
                  value={sdField(sd, "submission_info")}
                  onChange={(e) => setSd("submission_info", e.target.value)}
                  placeholder="How to apply / submit..."
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-opp-submission"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Contact Office</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: "office", p: "Office name" },
                    { k: "email", p: "Email address" },
                    { k: "phone", p: "Phone number" },
                    { k: "location", p: "Physical location" },
                  ].map(({ k, p }) => (
                    <input
                      key={k}
                      type="text"
                      value={sdObjField(sd, "contact")[k] ?? ""}
                      onChange={(e) => setSd("contact", { ...sdObjField(sd, "contact"), [k]: e.target.value })}
                      placeholder={p}
                      className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      data-testid={`input-opp-contact-${k}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TYPE-SPECIFIC FIELDS — Staff Profile */}
          {form.type === "staff_profile" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Staff Profile Details</h3>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Title Prefix</label>
                  <select value={sdField(sd, "title_prefix") || "Dr."} onChange={(e) => setSd("title_prefix", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none" data-testid="select-staff-title">
                    <option value="Prof.">Prof.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Eng.">Eng.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">First Name</label>
                  <input type="text" value={sdField(sd, "first_name")} onChange={(e) => setSd("first_name", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-staff-first-name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Middle Name</label>
                  <input type="text" value={sdField(sd, "middle_name")} onChange={(e) => setSd("middle_name", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-staff-middle-name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Last Name</label>
                  <input type="text" value={sdField(sd, "last_name")} onChange={(e) => setSd("last_name", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-staff-last-name" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Designation / Job Title</label>
                <input type="text" value={sdField(sd, "designation")} onChange={(e) => setSd("designation", e.target.value)} placeholder="e.g. Dean, School of Business and Economics" className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-staff-designation" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Unit / Office</label>
                  <input type="text" value={sdField(sd, "unit")} onChange={(e) => setSd("unit", e.target.value)} placeholder="e.g. University Leadership" className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-staff-unit" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address</label>
                  <input type="email" value={sdField(sd, "email")} onChange={(e) => setSd("email", e.target.value)} placeholder="name@kafu.ac.ke" className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-staff-email" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Photo URL</label>
                <input type="url" value={sdField(sd, "photo")} onChange={(e) => setSd("photo", e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-staff-photo" />
              </div>
              {/* Specializations */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Specializations</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {sdListField(sd, "specializations").map((s, i) => (
                    <span key={i} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      {s}
                      <button type="button" onClick={() => setSd("specializations", sdListField(sd, "specializations").filter((_, idx) => idx !== i))} className="hover:text-red-500" data-testid={`btn-rm-spec-${i}`}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" id="spec-input" placeholder="Add specialization and press Enter" className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) { setSd("specializations", [...sdListField(sd, "specializations"), v]); (e.target as HTMLInputElement).value = ""; } } }}
                    data-testid="input-spec" />
                  <button type="button" onClick={() => { const el = document.getElementById("spec-input") as HTMLInputElement; const v = el.value.trim(); if (v) { setSd("specializations", [...sdListField(sd, "specializations"), v]); el.value = ""; } }} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm" data-testid="btn-add-spec"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              {/* Qualifications JSON */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Qualifications (JSON array)</label>
                <textarea rows={3} value={sd.qualifications ? JSON.stringify(sd.qualifications, null, 2) : "[]"} onChange={(e) => { try { setSd("qualifications", JSON.parse(e.target.value)); } catch {} }} className="w-full px-3 py-2 rounded-lg border border-border text-xs font-mono resize-none focus:outline-none" placeholder={'[{"year":"2010","qualification":"PhD","institution":"University of Nairobi"}]'} data-testid="input-staff-qualifications" />
                <p className="text-[10px] text-muted-foreground mt-0.5">Array of objects: year, qualification, institution</p>
              </div>
              {/* Experience JSON */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Experience (JSON array)</label>
                <textarea rows={3} value={sd.experience ? JSON.stringify(sd.experience, null, 2) : "[]"} onChange={(e) => { try { setSd("experience", JSON.parse(e.target.value)); } catch {} }} className="w-full px-3 py-2 rounded-lg border border-border text-xs font-mono resize-none focus:outline-none" placeholder={'[{"start":"2020","end":"Present","position":"Professor","institution":"KAFU"}]'} data-testid="input-staff-experience" />
              </div>
            </div>
          )}

          {/* TYPE-SPECIFIC FIELDS — School */}
          {form.type === "school" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">School Details</h3>
              <p className="text-xs text-muted-foreground">Use the Slug field above to set the school code (e.g. SESS, SBE, SCIT). The Title is the full school name.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Dean / Acting Dean</label>
                  <input type="text" value={sdField(sd, "dean")} onChange={(e) => setSd("dean", e.target.value)} placeholder="Dr. Jane Doe" className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-school-dean" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">School Colour (hex)</label>
                  <div className="flex gap-2">
                    <input type="color" value={sdField(sd, "colour") || "#1A5C38"} onChange={(e) => setSd("colour", e.target.value)} className="w-12 h-9 rounded border border-border cursor-pointer" data-testid="input-school-colour-picker" />
                    <input type="text" value={sdField(sd, "colour") || "#1A5C38"} onChange={(e) => setSd("colour", e.target.value)} placeholder="#1A5C38" className="flex-1 px-3 py-2 rounded-lg border border-border text-sm font-mono focus:outline-none" data-testid="input-school-colour" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Vision Statement</label>
                <textarea rows={2} value={sdField(sd, "vision")} onChange={(e) => setSd("vision", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-school-vision" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Mission Statement</label>
                <textarea rows={2} value={sdField(sd, "mission")} onChange={(e) => setSd("mission", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-school-mission" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Programme Counts</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["undergraduate", "postgraduate", "doctoral"] as const).map((level) => (
                    <div key={level}>
                      <span className="text-[10px] text-muted-foreground capitalize">{level}</span>
                      <input type="number" min={0} value={(sdObjField(sd, "programmes_count") as Record<string, number | string>)[level] ?? 0} onChange={(e) => setSd("programmes_count", { ...sdObjField(sd, "programmes_count"), [level]: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none mt-0.5" data-testid={`input-school-count-${level}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TYPE-SPECIFIC FIELDS — Programme */}
          {form.type === "programme" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Programme Details</h3>
              <p className="text-xs text-muted-foreground">Use the School field in the sidebar to associate this programme with a school.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Level</label>
                  <select value={sdField(sd, "level") || "undergraduate"} onChange={(e) => setSd("level", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none" data-testid="select-programme-level">
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="doctoral">Doctoral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Programme Code</label>
                  <input type="text" value={sdField(sd, "programme_code")} onChange={(e) => setSd("programme_code", e.target.value)} placeholder="e.g. BEd (Arts), BSc CS" className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme-code" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Duration</label>
                  <input type="text" value={sdField(sd, "duration")} onChange={(e) => setSd("duration", e.target.value)} placeholder="e.g. 4 years" className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme-duration" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Mode of Delivery</label>
                  <select value={sdField(sd, "mode") || "full_time"} onChange={(e) => setSd("mode", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none" data-testid="select-programme-mode">
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="distance">Distance Learning (ODL)</option>
                    <option value="blended">Blended</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Entry Requirements</label>
                <textarea rows={3} value={sdField(sd, "entry_requirements")} onChange={(e) => setSd("entry_requirements", e.target.value)} placeholder="Minimum KCSE grade, specific subjects, etc." className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme-requirements" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Career Opportunities</label>
                <textarea rows={2} value={sdField(sd, "career_opportunities")} onChange={(e) => setSd("career_opportunities", e.target.value)} placeholder="Graduates may pursue careers in..." className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-programme-career" />
              </div>
            </div>
          )}

          {form.type === "document" && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Document Details</h3>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Document URL (PDF or file link)</label>
                <input
                  type="url"
                  value={sdField(sd, "document_url")}
                  onChange={(e) => setSd("document_url", e.target.value)}
                  placeholder="https://kafu.ac.ke/documents/handbook-2025.pdf"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-doc-url"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">Direct link to the document file (PDF, DOCX, etc.)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Document Category</label>
                  <select
                    value={sdField(sd, "document_category") || "policy"}
                    onChange={(e) => setSd("document_category", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                    data-testid="select-doc-category"
                  >
                    <option value="policy">Policy</option>
                    <option value="handbook">Handbook</option>
                    <option value="regulation">Regulation</option>
                    <option value="calendar">Academic Calendar</option>
                    <option value="form">Form / Template</option>
                    <option value="report">Report</option>
                    <option value="circular">Circular / Notice</option>
                    <option value="statute">Statute / Charter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Version / Year</label>
                  <input
                    type="text"
                    value={sdField(sd, "version")}
                    onChange={(e) => setSd("version", e.target.value)}
                    placeholder="e.g. 2025/2026"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-doc-version"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={sdField(sd, "effective_date")}
                    onChange={(e) => setSd("effective_date", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                    data-testid="input-doc-effective-date"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">File Size</label>
                  <input
                    type="text"
                    value={sdField(sd, "file_size")}
                    onChange={(e) => setSd("file_size", e.target.value)}
                    placeholder="e.g. 2.4 MB"
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-doc-size"
                  />
                </div>
              </div>
            </div>
          )}

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
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <input
                type="text"
                value={form.category ?? ""}
                onChange={(e) => field("category", e.target.value)}
                placeholder="e.g. Research & Innovation"
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-category"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Department</label>
              <input
                type="text"
                value={form.department ?? ""}
                onChange={(e) => field("department", e.target.value)}
                placeholder="e.g. Office of the Vice-Chancellor"
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-department"
              />
            </div>
            {(form.type === "staff_profile" || form.type === "programme" || form.type === "school") && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  {form.type === "school" ? "School Code (Slug)" : "School Code"}
                </label>
                <input
                  type="text"
                  value={form.school_code ?? ""}
                  onChange={(e) => field("school_code", e.target.value.toUpperCase())}
                  placeholder="e.g. SESS, SBE, SCIT, SOS, SHS"
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                  data-testid="input-school-code"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">Used to link staff and programmes to a school.</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={(form.tags ?? []).join(", ")}
                onChange={(e) => field("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                placeholder="e.g. Research, Innovation, SCIT"
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-tags"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="chk-featured"
                checked={form.featured ?? false}
                onChange={(e) => field("featured", e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary"
                data-testid="chk-featured"
              />
              <label htmlFor="chk-featured" className="text-xs font-medium text-muted-foreground">Featured</label>
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
                    {typeof form.author === "object" ? (form.author as { name: string }).name : form.author}
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
