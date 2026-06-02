const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const API_BASE = API_ORIGIN.endsWith("/api")
  ? `${API_ORIGIN}/admin`
  : `${API_ORIGIN}/api/admin`;

export async function apiUploadFile(path: string, file: File, fieldName = "photo"): Promise<{ url: string }> {
  const token = localStorage.getItem("kafu_cms_token");
  const formData = new FormData();
  formData.append(fieldName, file);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (res.status === 401) {
    localStorage.removeItem("kafu_cms_token");
    localStorage.removeItem("kafu_cms_user");
    window.location.href = `${(import.meta.env.BASE_URL ?? "").replace(/\/$/, "")}/login`;
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error((err?.message as string) || `Upload failed (${res.status})`);
  }
  return res.json();
}
const TOKEN_KEY = "kafu_cms_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseJsonSafe(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    throw new Error(`Expected JSON but received ${ct || "unknown content type"} (status ${res.status})`);
  }
  return res.json();
}

export async function apiFetch(path: string, options: RequestInit = {}) {
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
    window.location.href = `${BASE_URL}/login`;
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const err = await parseJsonSafe(res).catch(() => ({})) as Record<string, unknown>;
    throw new Error((err?.message as string) || `API error ${res.status}`);
  }

  if (res.status === 204) return null;
  return parseJsonSafe(res);
}

export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
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
  submitted: "bg-teal-50 text-teal-700",
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
  press_release: "Press Release",
  publication: "Publication",
  video: "Video",
  download: "Download",
  archive: "Archive",
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

// ============================================================
// Research & Innovation (RIMS-lite) API helpers
// ============================================================

export function apiGetResearchThemes() { return apiGet("/research/themes"); }
export function apiPostResearchTheme(body: unknown) { return apiPost("/research/themes", body); }
export function apiPutResearchTheme(id: number, body: unknown) { return apiPut(`/research/themes/${id}`, body); }
export function apiDeleteResearchTheme(id: number) { return apiDelete(`/research/themes/${id}`); }

export function apiGetResearchProjects(params?: Record<string, string | number | undefined>) { return apiGet("/research/projects", params); }
export function apiPostResearchProject(body: unknown) { return apiPost("/admin/research/projects", body); }
export function apiPutResearchProject(id: number, body: unknown) { return apiPut(`/admin/research/projects/${id}`, body); }
export function apiDeleteResearchProject(id: number) { return apiDelete(`/admin/research/projects/${id}`); }

export function apiGetPublications(params?: Record<string, string | number | undefined>) { return apiGet("/research/publications", params); }
export function apiPostPublication(body: unknown) { return apiPost("/admin/research/publications", body); }
export function apiPutPublication(id: number, body: unknown) { return apiPut(`/admin/research/publications/${id}`, body); }
export function apiDeletePublication(id: number) { return apiDelete(`/admin/research/publications/${id}`); }

export function apiGetResearchGrants(params?: Record<string, string | number | undefined>) { return apiGet("/research/grants", params); }
export function apiPostResearchGrant(body: unknown) { return apiPost("/research/grants", body); }
export function apiPutResearchGrant(id: number, body: unknown) { return apiPut(`/research/grants/${id}`, body); }
export function apiDeleteResearchGrant(id: number) { return apiDelete(`/research/grants/${id}`); }

export function apiGetResearchPartners(params?: Record<string, string | number | undefined>) { return apiGet("/research/partners", params); }
export function apiPostResearchPartner(body: unknown) { return apiPost("/research/partners", body); }
export function apiPutResearchPartner(id: number, body: unknown) { return apiPut(`/research/partners/${id}`, body); }
export function apiDeleteResearchPartner(id: number) { return apiDelete(`/research/partners/${id}`); }
