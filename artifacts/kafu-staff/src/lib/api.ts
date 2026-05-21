const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const API_BASE = `${API_ORIGIN}/api/staff`;
const TOKEN_KEY = "kafu_staff_token";
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem("kafu_staff_user"); }

export async function staffFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Only redirect to login on 401 if we already had a token (session expired)
  // For unauthenticated requests (no token), treat 401 as a normal error
  if (res.status === 401 && token) {
    clearToken();
    window.location.href = `${BASE}/login`;
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `API error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function staffGet(path: string, params?: Record<string, string | number | undefined>) {
  const q = params
    ? "?" + Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
        .join("&")
    : "";
  return staffFetch(`${path}${q}`);
}
export function staffPost(path: string, body?: unknown) {
  return staffFetch(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
}
export function staffPut(path: string, body?: unknown) {
  return staffFetch(path, { method: "PUT", body: JSON.stringify(body) });
}
export function staffPostForm(path: string, form: FormData) {
  return staffFetch(path, { method: "POST", body: form, headers: {} });
}

export function reviewerFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  return fetch(`${API_ORIGIN}/api/reviewer${path}`, { ...options, headers }).then(async res => {
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.message || `API error ${res.status}`); }
    return res.json();
  });
}

export function adminStaffFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  return fetch(`${API_ORIGIN}/api/admin/staff-accounts${path}`, { ...options, headers }).then(async res => {
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.message || `API error ${res.status}`); }
    return res.json();
  });
}

export type WorkflowStatus = "draft" | "submitted" | "under_review" | "revision_requested" | "approved" | "published" | "withdrawn";
export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft", submitted: "Submitted", under_review: "Under Review",
  revision_requested: "Revision Requested", approved: "Approved",
  published: "Published", withdrawn: "Withdrawn",
};
export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-blue-50 text-blue-700",
  under_review: "bg-yellow-50 text-yellow-700",
  revision_requested: "bg-orange-50 text-orange-700",
  approved: "bg-green-50 text-green-700",
  published: "bg-emerald-50 text-emerald-700",
  withdrawn: "bg-gray-50 text-gray-500",
};

export function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
