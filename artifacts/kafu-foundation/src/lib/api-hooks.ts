import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "./api-types";

/**
 * Resolves a storage URL so it works in both dev (Vite proxy) and production.
 *
 * The API and its storage symlink live at /api/storage/ on the production server
 * (kafu.ac.ke/api/storage/...). The frontend is served from the root domain, so
 * relative /storage/... paths would resolve to the wrong location.
 *
 * Rules:
 *  - /storage/...          → /api/storage/...   (relative path — add prefix)
 *  - https://host/storage/ → /api/storage/...   (absolute with wrong base — extract path)
 *  - /api/storage/...      → unchanged           (already correct)
 *  - https://host/api/storage/ → unchanged       (already correct absolute)
 *
 * In dev, the Vite proxy forwards /api/storage/ → PHP server (stripping /api).
 */
export function resolveStorageUrl(url: string): string {
  if (!url) return url;
  // Already correct
  if (url.startsWith("/api/storage/") || url.includes("/api/storage/")) return url;
  // Relative /storage/... — add the /api prefix
  if (url.startsWith("/storage/")) return "/api" + url;
  // Absolute URL whose path has /storage/ but lacks /api/storage/
  // e.g. https://kafu.ac.ke/storage/content-attachments/file.pdf
  const pathMatch = url.match(/\/storage\/.+$/);
  if (pathMatch) return "/api" + pathMatch[0];
  return url;
}

// ─── Branding ────────────────────────────────────────────────────────────────
export interface BrandingConfig {
  logo_primary_url: string;
  logo_white_url: string;
  logo_alt: string;
  favicon_url: string;
  tagline: string;
  site_description: string;
  primary_color: string;
  gold_color: string;
  white_color: string;
  dark_color: string;
  logo_full_color_url: string;
  logo_reversed_url: string;
  logo_gold_url: string;
  logo_mono_url: string;
  logo_icon_url: string;
  brand_guidelines_url: string;
}

export const BRANDING_DEFAULTS: BrandingConfig = {
  logo_primary_url:     "/images/uploads/logo-updated.png",
  logo_white_url:       "/images/uploads/logo-updated.png",
  logo_alt:             "Kaimosi Friends University",
  favicon_url:          "/favicon.ico",
  tagline:              "Spring of Knowledge",
  site_description:     "A Quaker-founded public university established in 2014, committed to truth, service, and academic excellence.",
  primary_color:        "#1A5C38",
  gold_color:           "#C9A227",
  white_color:          "#FFFFFF",
  dark_color:           "#111827",
  logo_full_color_url:  "#",
  logo_reversed_url:    "#",
  logo_gold_url:        "#",
  logo_mono_url:        "#",
  logo_icon_url:        "#",
  brand_guidelines_url: "#",
};

export function useBranding() {
  return useQuery<BrandingConfig>({
    queryKey: ["branding"],
    queryFn: async () => {
      const res = await fetch("/api/branding");
      if (!res.ok) return BRANDING_DEFAULTS;
      const data = await res.json();
      return { ...BRANDING_DEFAULTS, ...data } as BrandingConfig;
    },
    staleTime: 10 * 60 * 1000,
  });
}
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

export interface HeroSlide {
  id: number;
  headline: string;
  accent: string;
  badge: string;
  body: string;
  image: string;
  objectPosition: string;
  sortOrder: number;
  cta1: { label: string; href: string; external: boolean };
  cta2: { label: string; href: string; external: boolean };
  status: string;
  featured: boolean;
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: () => fetchApi<HeroSlide[]>("/hero-slides"),
    staleTime: 5 * 60 * 1000,
  });
}

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
    queryFn: () => fetchApi<StaffProfile>(`/images/uploads/${slug}`),
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
  degree_class?: string;
  subject_grades?: Record<string, string>;
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

export async function uploadCertificate(file: File, documentType: string): Promise<import("./api-types").CertificateUploadResult> {
  const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  const formData = new FormData();
  formData.append("certificate", file);
  formData.append("document_type", documentType);
  const res = await fetch(`${BASE}/api/admissions/documents/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Upload failed. Please check the file type and size (max 5 MB).");
  }
  const json = await res.json();
  return json.data as import("./api-types").CertificateUploadResult;
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

// ─── Navigation Config (public) ──────────────────────────────────────────────
export interface CmsNavLink {
  label: string;
  url: string;
  external?: boolean;
}
export interface CmsMegaGroup {
  heading: string;
  links: CmsNavLink[];
}
export interface CmsPrimaryNavItem {
  label: string;
  url: string;
  type?: "link" | "mega" | "departments";
  mega_width?: number;
  mega_cols?: 2 | 3 | 4;
  mega_groups?: CmsMegaGroup[];
  mega_footer?: Array<{ label: string; url: string }>;
  children?: CmsNavLink[];
}
export interface CmsNavConfig {
  primary_nav?: CmsPrimaryNavItem[];
  utility_nav?: Array<{ label: string; url: string }>;
  footer_nav?: Array<{ group: string; items: Array<{ label: string; url: string }> }>;
}

const FALLBACK_NAV_CONFIG: CmsNavConfig = {
  primary_nav: [
    { label: "Home", url: "/" },
    {
      label: "About",
      url: "/about",
      type: "mega",
      mega_width: 520,
      mega_cols: 2,
      mega_groups: [
        {
          heading: "The University",
          links: [
            { label: "About KAFU", url: "/about" },
            { label: "Vice-Chancellor", url: "/about/vice-chancellor" },
            { label: "Management Board", url: "/about/management" },
            { label: "University Council", url: "/about/council" },
            { label: "Strategic Plan", url: "/about/strategic-plan" },
          ],
        },
        {
          heading: "Governance",
          links: [
            { label: "Policies & Regulations", url: "/about/policies" },
            { label: "Service Charter", url: "/about/service-charter" },
            { label: "Directorates", url: "/directorates" },
            { label: "Campuses", url: "/campuses" },
            { label: "Contacts & Offices", url: "/contact" },
          ],
        },
      ],
      mega_footer: [
        { label: "Our History", url: "/about/history" },
        { label: "Contact Us", url: "/contact" },
      ],
    },
    {
      label: "Academics",
      url: "/academics",
      type: "mega",
      mega_width: 560,
      mega_cols: 2,
      mega_groups: [
        {
          heading: "Study",
          links: [
            { label: "Schools & Faculties", url: "/schools" },
            { label: "All Programmes", url: "/programmes" },
            { label: "Postgraduate", url: "/programmes?level=postgraduate" },
            { label: "Diploma & Certificate", url: "/programmes?level=diploma" },
            { label: "ODeL (Online & Distance)", url: "/odel" },
          ],
        },
        {
          heading: "Resources",
          links: [
            { label: "Academic Calendar", url: "/academic-calendar" },
            { label: "Examination Timetables", url: "/exams" },
            { label: "Library", url: "https://library.kafu.ac.ke", },
            { label: "E-Learning", url: "https://elearning.kafu.ac.ke" },
          ],
        },
      ],
      mega_footer: [
        { label: "All Programmes", url: "/programmes" },
        { label: "Compare Programmes", url: "/programmes/compare" },
      ],
    },
    { label: "Departments", url: "/departments", type: "departments" },
    {
      label: "Admissions",
      url: "/admissions",
      type: "mega",
      mega_width: 480,
      mega_cols: 2,
      mega_groups: [
        {
          heading: "Apply",
          links: [
            { label: "Undergraduate (KUCCPS)", url: "/admissions/undergraduate" },
            { label: "Self-Sponsored (Mod. II)", url: "/admissions/module-ii" },
            { label: "Postgraduate", url: "/admissions/postgraduate" },
            { label: "International Students", url: "/admissions/international" },
            { label: "KUCCPS Verification", url: "/kuccps-verify" },
          ],
        },
        {
          heading: "Information",
          links: [
            { label: "Entry Requirements", url: "/admissions/requirements" },
            { label: "Fees & Funding", url: "/admissions/fees" },
            { label: "Scholarships", url: "/opportunities?type=scholarship" },
            { label: "Hostel & Accommodation", url: "/students/accommodation" },
          ],
        },
      ],
      mega_footer: [{ label: "Apply Now", url: "/admissions" }],
    },
    {
      label: "Students",
      url: "/student-services",
      children: [
        { label: "Student Services", url: "/student-services" },
        { label: "Student Portal", url: "https://portal.kafu.ac.ke" },
        { label: "E-Learning Platform", url: "https://elearning.kafu.ac.ke" },
        { label: "Library", url: "https://library.kafu.ac.ke" },
        { label: "Accommodation", url: "/students/accommodation" },
        { label: "Clubs & Societies", url: "/students/clubs" },
        { label: "Health & Welfare", url: "/students/welfare" },
        { label: "Graduation", url: "/students/graduation" },
      ],
    },
    {
      label: "News",
      url: "/news",
      children: [
        { label: "University News", url: "/news" },
        { label: "Events Calendar", url: "/events" },
        { label: "Announcements", url: "/announcements" },
        { label: "Opportunities", url: "/opportunities" },
        { label: "Media Gallery", url: "/media" },
        { label: "Press Releases", url: "/news?category=press-release" },
      ],
    },
    {
      label: "Research",
      url: "/research",
      type: "mega",
      mega_width: 480,
      mega_cols: 2,
      mega_groups: [
        {
          heading: "Research",
          links: [
            { label: "Research Overview", url: "/research" },
            { label: "Research Projects", url: "/research/projects" },
            { label: "Publications", url: "/research/publications" },
            { label: "Grants & Funding", url: "/research/grants" },
          ],
        },
        {
          heading: "Innovation",
          links: [
            { label: "Research Partnerships", url: "/research/partnerships" },
            { label: "KAFU Journal", url: "/research/journal" },
            { label: "Innovation Hub", url: "/research/innovation" },
            { label: "International", url: "/international" },
          ],
        },
      ],
      mega_footer: [{ label: "Research & Innovation Hub", url: "/research" }],
    },
    { label: "Contact", url: "/contact" },
  ],
};

export function useNavConfig() {
  return useQuery<CmsNavConfig>({
    queryKey: ["nav-config"],
    queryFn: () =>
      fetch("/api/navigation")
        .then((r) => {
          if (!r.ok) throw new Error("nav fetch failed");
          return r.json();
        })
        .catch(() => FALLBACK_NAV_CONFIG),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: FALLBACK_NAV_CONFIG,
  });
}
