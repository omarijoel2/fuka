import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "./api-types";
import type { 
  Stat, 
  NewsArticle, 
  School, 
  Programme, 
  Event, 
  Opportunity, 
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

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => fetchApi<NewsArticle[]>("/news"),
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

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchApi<Event[]>("/events"),
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: () => fetchApi<Opportunity[]>("/opportunities"),
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
