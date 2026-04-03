const API_BASE = "/api/admin";
const TOKEN_KEY = "kafu_cms_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("kafu_cms_user");
    window.location.href = "/kafu-cms/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `API error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function apiGet(path: string, params?: Record<string, string | number | undefined>) {
  const q = params
    ? "?" + Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
        .join("&")
    : "";
  return apiFetch(`${path}${q}`);
}

export function apiPost(path: string, body?: unknown) {
  return apiFetch(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
}

export function apiPut(path: string, body?: unknown) {
  return apiFetch(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });
}

export function apiDelete(path: string) {
  return apiFetch(path, { method: "DELETE" });
}

export type WorkflowStatus =
  | "draft" | "submitted" | "under_review" | "approved"
  | "scheduled" | "published" | "unpublished" | "archived";

export const STATUS_LABELS: Record<WorkflowStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  unpublished: "Unpublished",
  archived: "Archived",
};

export const STATUS_COLORS: Record<WorkflowStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-blue-50 text-blue-700",
  under_review: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  scheduled: "bg-purple-50 text-purple-700",
  published: "bg-emerald-50 text-emerald-700",
  unpublished: "bg-orange-50 text-orange-700",
  archived: "bg-gray-50 text-gray-500",
};

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  page: "Page",
  news: "News",
  event: "Event",
  announcement: "Announcement",
  opportunity: "Opportunity",
  programme: "Programme",
  staff_profile: "Staff Profile",
  school: "School",
  document: "Document",
  research: "Research",
  partner: "Partner",
};

export const CONTENT_TYPES = Object.keys(CONTENT_TYPE_LABELS);

export const WORKFLOW_TRANSITIONS: Record<WorkflowStatus, { to: WorkflowStatus; label: string; variant: string }[]> = {
  draft: [{ to: "submitted", label: "Submit for Review", variant: "default" }],
  submitted: [
    { to: "under_review", label: "Begin Review", variant: "default" },
    { to: "draft", label: "Return to Draft", variant: "outline" },
  ],
  under_review: [
    { to: "approved", label: "Approve", variant: "default" },
    { to: "draft", label: "Request Changes", variant: "outline" },
  ],
  approved: [
    { to: "published", label: "Publish Now", variant: "default" },
    { to: "scheduled", label: "Schedule", variant: "outline" },
    { to: "draft", label: "Return to Draft", variant: "outline" },
  ],
  scheduled: [
    { to: "published", label: "Publish Now", variant: "default" },
    { to: "draft", label: "Cancel Schedule", variant: "outline" },
  ],
  published: [
    { to: "unpublished", label: "Unpublish", variant: "outline" },
    { to: "archived", label: "Archive", variant: "outline" },
  ],
  unpublished: [
    { to: "published", label: "Re-publish", variant: "default" },
    { to: "archived", label: "Archive", variant: "outline" },
    { to: "draft", label: "Return to Draft", variant: "outline" },
  ],
  archived: [],
};

export function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function apiGetSiteSettings(key: string) {
  return apiFetch(`/site-settings/${key}`);
}

export function apiPutSiteSettings(key: string, structured_data: unknown) {
  return apiFetch(`/site-settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({ structured_data }),
  });
}
