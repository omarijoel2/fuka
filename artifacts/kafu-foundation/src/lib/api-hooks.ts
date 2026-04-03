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
  ProgrammeDetail,
  StaffMember,
  StaffProfile,
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

export function useStaff(params?: { school?: string; search?: string; designation?: string }) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => {
      const p = new URLSearchParams();
      if (params?.school) p.append("school", params.school);
      if (params?.search) p.append("search", params.search);
      if (params?.designation) p.append("designation", params.designation);
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
