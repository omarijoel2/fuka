import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "./api-types";
import type {
  Stat,
  NewsArticle,
  NewsArticleDetail,
  School,
  Programme,
  Event,
  Announcement,
  AnnouncementDetail,
  Opportunity,
  OpportunityDetail,
  ContactInfo,
  AdmissionsData,
  AdmissionsFees,
  EligibilityResult,
  ProgrammeDetail,
  StaffMember,
  StaffProfile,
  ResearchOverview,
  ResearchProject,
  ResearchPublication,
  ResearchGrant,
  ResearchPartner,
  PaginatedResearch,
  InternationalOverview,
  InternationalPartnership,
  InternationalPartnershipDetail,
  ExchangeProgramme,
  Campus,
  ServicePoint,
} from "./api-types";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchApi<Stat[]>("/stats"),
  });
}

export function useNews(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => {
      const p = new URLSearchParams();
      if (params?.category && params.category !== "All") p.append("category", params.category);
      if (params?.search) p.append("search", params.search);
      const q = p.toString() ? `?${p.toString()}` : "";
      return fetchApi<NewsArticle[]>(`/news${q}`);
    },
  });
}

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: ["news-detail", slug],
    queryFn: () => fetchApi<NewsArticleDetail>(`/news/${slug}`),
    enabled: !!slug,
  });
}

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: () => fetchApi<School[]>("/schools"),
  });
}

export function useSchool(code: string) {
  return useQuery({
    queryKey: ["schools", code],
    queryFn: () => fetchApi<School>(`/schools/${code}`),
    enabled: !!code,
  });
}

export function useProgrammes(schoolCode?: string, level?: string) {
  return useQuery({
    queryKey: ["programmes", schoolCode, level],
    queryFn: () => {
      const params = new URLSearchParams();
      if (schoolCode) params.append("school", schoolCode);
      if (level) params.append("level", level);
      const q = params.toString() ? `?${params.toString()}` : "";
      return fetchApi<Programme[]>(`/programmes${q}`);
    },
  });
}

export function useEvents(params?: { filter?: string; category?: string; search?: string }) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => {
      const p = new URLSearchParams();
      if (params?.filter) p.append("filter", params.filter);
      if (params?.category && params.category !== "All") p.append("category", params.category);
      if (params?.search) p.append("search", params.search);
      const q = p.toString() ? `?${p.toString()}` : "";
      return fetchApi<Event[]>(`/events${q}`);
    },
  });
}

export function useEventDetail(slug: string) {
  return useQuery({
    queryKey: ["event-detail", slug],
    queryFn: () => fetchApi<Event>(`/events/${slug}`),
    enabled: !!slug,
  });
}

export function useAnnouncements(params?: { priority?: string; search?: string; status?: string }) {
  return useQuery({
    queryKey: ["announcements", params],
    queryFn: () => {
      const p = new URLSearchParams();
      if (params?.priority && params.priority !== "all") p.append("priority", params.priority);
      if (params?.search) p.append("search", params.search);
      if (params?.status) p.append("status", params.status);
      const q = p.toString() ? `?${p.toString()}` : "";
      return fetchApi<Announcement[]>(`/announcements${q}`);
    },
  });
}

export function useAnnouncementDetail(slug: string) {
  return useQuery({
    queryKey: ["announcement-detail", slug],
    queryFn: () => fetchApi<AnnouncementDetail>(`/announcements/${slug}`),
    enabled: !!slug,
  });
}

export function useOpportunities(params?: { category?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["opportunities", params],
    queryFn: () => {
      const p = new URLSearchParams();
      if (params?.category) p.append("category", params.category);
      if (params?.status) p.append("status", params.status);
      if (params?.search) p.append("search", params.search);
      const q = p.toString() ? `?${p.toString()}` : "";
      return fetchApi<Opportunity[]>(`/opportunities${q}`);
    },
  });
}

export function useOpportunityDetail(slug: string) {
  return useQuery({
    queryKey: ["opportunity-detail", slug],
    queryFn: () => fetchApi<OpportunityDetail>(`/opportunities/${slug}`),
    enabled: !!slug,
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: ["contact"],
    queryFn: () => fetchApi<ContactInfo>("/contact"),
  });
}

export function useAdmissions() {
  return useQuery({
    queryKey: ["admissions"],
    queryFn: () => fetchApi<AdmissionsData>("/admissions"),
  });
}

export function useStaff(params?: { school?: string; search?: string; designation?: string; rank?: string }) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => {
      const p = new URLSearchParams();
      if (params?.school) p.append("school", params.school);
      if (params?.search) p.append("search", params.search);
      if (params?.designation) p.append("designation", params.designation);
      if (params?.rank) p.append("rank", params.rank);
      const q = p.toString() ? `?${p.toString()}` : "";
      return fetchApi<StaffMember[]>(`/staff${q}`);
    },
  });
}

export function useStaffProfile(slug: string) {
  return useQuery({
    queryKey: ["staff", slug],
    queryFn: () => fetchApi<StaffProfile>(`/staff/${slug}`),
    enabled: !!slug,
  });
}

export function useProgrammeDetail(school: string, code: string) {
  return useQuery({
    queryKey: ["programme-detail", school, code],
    queryFn: () => fetchApi<ProgrammeDetail>(`/programmes/${encodeURIComponent(school)}/${encodeURIComponent(code)}`),
    enabled: !!school && !!code,
  });
}

export function useAdmissionsFees() {
  return useQuery({
    queryKey: ["admissions-fees"],
    queryFn: () => fetchApi<AdmissionsFees>("/admissions/fees"),
  });
}

export async function checkEligibility(params: {
  pathway: string;
  qualification_type: string;
  mean_grade: string;
}): Promise<EligibilityResult> {
  const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  const res = await fetch(`${BASE}/api/admissions/eligibility`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Eligibility check failed");
  const json = await res.json();
  return json.data as EligibilityResult;
}

// Research & Innovation Hooks

export function useResearchOverview() {
  return useQuery<ResearchOverview>({
    queryKey: ["research-overview"],
    queryFn: () => fetchApi<ResearchOverview>("/research/overview"),
  });
}

export function useResearchProjects(params?: { theme?: string; status?: string; search?: string; page?: number; per_page?: number }) {
  const p = params ?? {};
  return useQuery<PaginatedResearch<ResearchProject>>({
    queryKey: ["research-projects", p],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (p.theme) q.set("theme", p.theme);
      if (p.status) q.set("status", p.status);
      if (p.search) q.set("search", p.search);
      if (p.page) q.set("page", String(p.page));
      if (p.per_page) q.set("per_page", String(p.per_page));
      const qs = q.toString();
      const res = await fetch(`/api/research/projects${qs ? "?" + qs : ""}`);
      return res.json();
    },
  });
}

export function useResearchProject(slug: string) {
  return useQuery<ResearchProject>({
    queryKey: ["research-project", slug],
    queryFn: () => fetchApi<ResearchProject>(`/research/projects/${slug}`),
    enabled: !!slug,
  });
}

export function useResearchPublications(params?: { type?: string; year?: number; search?: string; page?: number; per_page?: number }) {
  const p = params ?? {};
  return useQuery<PaginatedResearch<ResearchPublication>>({
    queryKey: ["research-publications", p],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (p.type) q.set("type", p.type);
      if (p.year) q.set("year", String(p.year));
      if (p.search) q.set("search", p.search);
      if (p.page) q.set("page", String(p.page));
      if (p.per_page) q.set("per_page", String(p.per_page));
      const qs = q.toString();
      const res = await fetch(`/api/research/publications${qs ? "?" + qs : ""}`);
      return res.json();
    },
  });
}

export function useResearchPublication(slug: string) {
  return useQuery<ResearchPublication>({
    queryKey: ["research-publication", slug],
    queryFn: () => fetchApi<ResearchPublication>(`/research/publications/${slug}`),
    enabled: !!slug,
  });
}

export function useResearchGrants(params?: { status?: string }) {
  const p = params ?? {};
  return useQuery<{ data: ResearchGrant[] }>({
    queryKey: ["research-grants", p],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (p.status) q.set("status", p.status);
      const qs = q.toString();
      const res = await fetch(`/api/research/grants${qs ? "?" + qs : ""}`);
      return res.json();
    },
  });
}

export function useResearchPartners(params?: { type?: string }) {
  const p = params ?? {};
  return useQuery<{ data: ResearchPartner[] }>({
    queryKey: ["research-partners", p],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (p.type) q.set("type", p.type);
      const qs = q.toString();
      const res = await fetch(`/api/research/partners${qs ? "?" + qs : ""}`);
      return res.json();
    },
  });
}

// ── International & Partnerships hooks ──────────────────────

export function useInternationalOverview() {
  return useQuery<InternationalOverview>({
    queryKey: ["international-overview"],
    queryFn: async () => {
      const res = await fetch("/api/international/overview");
      return res.json();
    },
  });
}

export function useInternationalPartnerships(params?: { type?: string; country?: string }) {
  const p = params ?? {};
  return useQuery<{ data: InternationalPartnership[] }>({
    queryKey: ["international-partnerships", p],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (p.type) q.set("type", p.type);
      if (p.country) q.set("country", p.country);
      const qs = q.toString();
      const res = await fetch(`/api/international/partnerships${qs ? "?" + qs : ""}`);
      return res.json();
    },
  });
}

export function useInternationalPartnershipDetail(slug: string) {
  return useQuery<InternationalPartnershipDetail>({
    queryKey: ["international-partnership-detail", slug],
    queryFn: async () => {
      const res = await fetch(`/api/international/partnerships/${slug}`);
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useExchangeProgrammes(params?: { type?: string; status?: string }) {
  const p = params ?? {};
  return useQuery<{ data: ExchangeProgramme[] }>({
    queryKey: ["exchange-programmes", p],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (p.type) q.set("type", p.type);
      if (p.status) q.set("status", p.status);
      const qs = q.toString();
      const res = await fetch(`/api/international/exchange${qs ? "?" + qs : ""}`);
      return res.json();
    },
  });
}

export function useExchangeProgrammeDetail(slug: string) {
  return useQuery<ExchangeProgramme>({
    queryKey: ["exchange-programme-detail", slug],
    queryFn: async () => {
      const res = await fetch(`/api/international/exchange/${slug}`);
      return res.json();
    },
    enabled: !!slug,
  });
}

// ── INSTITUTIONAL REPOSITORY (MP12) ──────────────────────────────────────
import type {
  RepositoryOverview, RepositoryPage, RepositoryFacets, RepositoryItem,
} from "./api-types";

export function useRepositoryOverview() {
  return useQuery<RepositoryOverview>({
    queryKey: ["repository-overview"],
    queryFn: () => fetch("/api/repository/overview").then(r => r.json()),
  });
}

export function useRepositoryItems(params: {
  type?: string; department?: string; year?: string;
  access?: string; search?: string; sort?: string;
  page?: number; per_page?: number;
}) {
  return useQuery<RepositoryPage>({
    queryKey: ["repository-items", params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.type)       q.set("type", params.type);
      if (params.department) q.set("department", params.department);
      if (params.year)       q.set("year", params.year);
      if (params.access)     q.set("access", params.access);
      if (params.search)     q.set("search", params.search);
      if (params.sort)       q.set("sort", params.sort);
      if (params.page)       q.set("page", String(params.page));
      if (params.per_page)   q.set("per_page", String(params.per_page));
      return fetch(`/api/repository/items?${q}`).then(r => r.json());
    },
  });
}

export function useRepositoryFacets() {
  return useQuery<RepositoryFacets>({
    queryKey: ["repository-facets"],
    queryFn: () => fetch("/api/repository/facets").then(r => r.json()),
  });
}

export function useRepositoryItemDetail(slug: string) {
  return useQuery<RepositoryItem>({
    queryKey: ["repository-item", slug],
    queryFn: () => fetch(`/api/repository/items/${slug}`).then(r => r.json()),
    enabled: !!slug,
  });
}

// ── MP15 — Campus & Service Points ──────────────────────────────────────────

export function useCampuses() {
  return useQuery<Campus[]>({
    queryKey: ["campuses"],
    queryFn: () => fetch("/api/campuses").then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCampusDetail(slug: string) {
  return useQuery<Campus>({
    queryKey: ["campus", slug],
    queryFn: () => fetch(`/api/campuses/${slug}`).then(r => r.json()),
    enabled: !!slug,
  });
}

export function useServicePoints(params?: { category?: string; campus_id?: number; search?: string }) {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.campus_id) q.set("campus_id", String(params.campus_id));
  if (params?.search)    q.set("search", params.search);
  const qs = q.toString();
  return useQuery<ServicePoint[]>({
    queryKey: ["service-points", params],
    queryFn: () => fetch(`/api/service-points${qs ? "?" + qs : ""}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });
}

export function useServicePointDetail(slug: string) {
  return useQuery<ServicePoint>({
    queryKey: ["service-point", slug],
    queryFn: () => fetch(`/api/service-points/${slug}`).then(r => r.json()),
    enabled: !!slug,
  });
}
