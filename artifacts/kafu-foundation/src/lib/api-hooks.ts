import { useQuery } from "@tanstack/react-query";
import { fetchApi, type ArticleDetail, type JournalItem } from "./api-types";

/**
 * Resolves a storage URL so it works in both dev (Vite proxy) and production.
 *
 * Production layout:
 *  - Frontend + API share kafu.ac.ke (no separate API subdomain).
 *  - Storage files are served at kafu.ac.ke/storage/... via an Apache Alias:
 *      Alias /storage /home/kafu/kafu-platform/artifacts/kafu-api/storage/app/public
 *  - VITE_API_URL is left empty; /storage/... paths work as relative URLs.
 *
 * Dev: Vite proxy forwards /storage/ → local PHP server. VITE_API_URL is empty.
 *
 * If VITE_API_URL is set (e.g. a separate API domain), it is used to prefix
 * relative /storage/... paths and to normalise absolute URLs with a wrong base.
 *
 * Rules:
 *  - /storage/...              → <VITE_API_URL>/storage/...  (or unchanged if empty)
 *  - https://any-host/storage/ → <VITE_API_URL>/storage/...  (normalise wrong base)
 *  - Already absolute with correct origin → unchanged
 */
export function resolveStorageUrl(url: string): string {
  if (!url) return url;
  const apiOrigin = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  // Relative /storage/... path — prefix with API origin when known
  if (url.startsWith("/storage/")) {
    return apiOrigin ? `${apiOrigin}${url}` : url;
  }
  // Absolute URL: if it has /storage/ but the origin doesn't match apiOrigin,
  // strip the wrong origin and rebuild with the correct one.
  // This fixes URLs where APP_URL was baked in incorrectly on the server.
  if (apiOrigin && /^https?:\/\//.test(url)) {
    const pathMatch = url.match(/\/storage\/.+$/);
    if (pathMatch && !url.startsWith(apiOrigin)) return `${apiOrigin}${pathMatch[0]}`;
  }
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
  AlumniProfile,
  AlumniStory,
  EmployerPartner,
  GraduateOutcome,
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

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchApi<ArticleDetail>(`/articles/${slug}`),
    enabled: !!slug,
  });
}

export function useJournal(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["journal", params],
    queryFn: () => {
      const p = new URLSearchParams();
      if (params?.category && params.category !== "All") p.append("category", params.category);
      if (params?.search) p.append("search", params.search);
      const q = p.toString() ? `?${p.toString()}` : "";
      return fetchApi<JournalItem[]>(`/journal${q}`);
    },
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
      label: "About Us",
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
            { label: "University Management", url: "/about/management" },
            { label: "University Council", url: "/about/council" },
            { label: "Strategic Plan", url: "/about/strategic-plan" },
          ],
        },
        {
          heading: "Governance & More",
          links: [
            { label: "Service Charter", url: "/about/service-charter" },
            { label: "Policies & Regulations", url: "/about/policies" },
            { label: "Our Campuses", url: "/campuses" },
            { label: "Directorates", url: "/directorates" },
            { label: "Corporate Social Responsibility", url: "/about/csr" },
          ],
        },
      ],
      mega_footer: [
        { label: "Facts & Figures", url: "/institutional-data" },
        { label: "Contact Us", url: "/contact" },
      ],
    },
    {
      label: "Academics",
      url: "/schools",
      type: "mega",
      mega_width: 720,
      mega_cols: 3,
      mega_groups: [
        {
          heading: "Schools & Faculties",
          links: [
            { label: "All Schools", url: "/schools" },
            { label: "Education & Social Sciences", url: "/schools/SESS" },
            { label: "Business & Economics", url: "/schools/SBE" },
            { label: "Computing & IT", url: "/schools/SCIT" },
            { label: "Science", url: "/schools/SOS" },
            { label: "Health Sciences", url: "/schools/SHS" },
          ],
        },
        {
          heading: "Programmes",
          links: [
            { label: "Programme Catalogue", url: "/programmes" },
            { label: "Compare Programmes", url: "/programmes/compare" },
            { label: "Postgraduate", url: "/programmes?level=postgraduate" },
            { label: "Open, Distance & e-Learning", url: "/directorates/open-distance-elearning" },
          ],
        },
        {
          heading: "Resources",
          links: [
            { label: "Academic Calendar", url: "/admissions/calendar" },
            { label: "Timetables", url: "/admissions/timetables" },
            { label: "Library & Repository", url: "/repository" },
            { label: "E-Learning", url: "https://elearning.kafu.ac.ke", external: true },
          ],
        },
      ],
      mega_footer: [{ label: "All Programmes", url: "/programmes" }],
    },
    {
      label: "Admission",
      url: "/admissions",
      type: "mega",
      mega_width: 520,
      mega_cols: 2,
      mega_groups: [
        {
          heading: "Apply",
          links: [
            { label: "Admissions Overview", url: "/admissions" },
            { label: "Apply Online", url: "/admissions/apply" },
            { label: "Track Application", url: "/admissions/track" },
            { label: "International Admissions", url: "/international/study" },
            { label: "Visa & Immigration", url: "/international/visa" },
          ],
        },
        {
          heading: "Information",
          links: [
            { label: "Entry Requirements", url: "/admissions/eligibility" },
            { label: "Fees & Financing", url: "/admissions/fees" },
            { label: "Access to Funding", url: "/admissions/funding" },
            { label: "Intake Calendar", url: "/admissions/calendar" },
            { label: "Joining Instructions", url: "/admissions/joining-instructions" },
          ],
        },
      ],
      mega_footer: [{ label: "Apply Now", url: "/admissions" }],
    },
    {
      label: "Research",
      url: "/research",
      type: "mega",
      mega_width: 520,
      mega_cols: 2,
      mega_groups: [
        {
          heading: "Research",
          links: [
            { label: "Research Overview", url: "/research" },
            { label: "Research Projects", url: "/research/projects" },
            { label: "Publications", url: "/research/publications" },
            { label: "KAFU Journal", url: "/research/journal" },
          ],
        },
        {
          heading: "Innovation & More",
          links: [
            { label: "Partnerships & Grants", url: "/research/partnerships" },
            { label: "Institutional Repository", url: "/repository" },
            { label: "Ethics Review Committee", url: "/research/ethics" },
            { label: "Innovation & Incubation Hub", url: "https://kafu-iihub.com", external: true },
          ],
        },
      ],
      mega_footer: [{ label: "Research & Innovation", url: "/research" }],
    },
    {
      label: "Info",
      url: "/news",
      type: "mega",
      mega_width: 720,
      mega_cols: 3,
      mega_groups: [
        {
          heading: "News & Media",
          links: [
            { label: "Latest News", url: "/news" },
            { label: "Events Calendar", url: "/events" },
            { label: "Announcements", url: "/announcements" },
            { label: "Journal", url: "/journal" },
            { label: "Media Gallery", url: "/media" },
            { label: "Photo Gallery", url: "/gallery" },
          ],
        },
        {
          heading: "Student Life",
          links: [
            { label: "Student Services", url: "/student-services" },
            { label: "Dean of Students", url: "/students/affairs" },
            { label: "Student Council", url: "/students/council" },
            { label: "Alumni & Outcomes", url: "/alumni" },
            { label: "Opportunities", url: "/opportunities" },
          ],
        },
        {
          heading: "Quick Links",
          links: [
            { label: "Student Portal", url: "https://portal.kafu.ac.ke", external: true },
            { label: "E-Learning", url: "https://elearning.kafu.ac.ke", external: true },
            { label: "Staff Login", url: "/staff" },
            { label: "Downloads", url: "/media/downloads" },
            { label: "International", url: "/international" },
            { label: "Contact", url: "/contact" },
          ],
        },
      ],
      mega_footer: [{ label: "All News", url: "/news" }],
    },
  ],
  utility_nav: [
    { label: "Student Portal", url: "https://portal.kafu.ac.ke" },
    { label: "E-Learning",     url: "https://elearning.kafu.ac.ke" },
    { label: "Staff Login",    url: "/staff" },
    { label: "Library",        url: "/repository" },
    { label: "Downloads",      url: "/media/downloads" },
    { label: "Alumni",         url: "/alumni" },
    { label: "Tenders",        url: "/opportunities" },
    { label: "Contacts",       url: "/contact" },
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

export interface SiteSettings {
  site_name?: string;
  site_tagline?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_youtube?: string;
  social_instagram?: string;
  footer_copyright?: string;
  footer_tagline?: string;
  [key: string]: unknown;
}

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: () =>
      fetch("/api/site-config/site")
        .then((r) => {
          if (!r.ok) throw new Error("site-config fetch failed");
          return r.json();
        })
        .then((d) => (d?.data ?? {}) as SiteSettings)
        .catch(() => ({} as SiteSettings)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// MP18 — Alumni & Graduate Outcomes Hooks

export function useAlumniFeatured() {
  return useQuery<AlumniProfile[]>({
    queryKey: ["alumni-featured"],
    queryFn: () => fetchApi<AlumniProfile[]>("/alumni/featured"),
  });
}

export function useAlumni(params?: { school_code?: string; sector?: string; programme?: string; graduation_year?: number; search?: string; page?: number; per_page?: number }) {
  const p = params ?? {};
  return useQuery<PaginatedResearch<AlumniProfile>>({
    queryKey: ["alumni", p],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (p.school_code) q.set("school_code", p.school_code);
      if (p.sector) q.set("sector", p.sector);
      if (p.programme) q.set("programme", p.programme);
      if (p.graduation_year) q.set("graduation_year", String(p.graduation_year));
      if (p.search) q.set("search", p.search);
      if (p.page) q.set("page", String(p.page));
      if (p.per_page) q.set("per_page", String(p.per_page));
      const qs = q.toString();
      const res = await fetch(`/api/alumni${qs ? "?" + qs : ""}`);
      return res.json();
    },
  });
}

export function useAlumniProfile(slug: string) {
  return useQuery<AlumniProfile>({
    queryKey: ["alumni-profile", slug],
    queryFn: () => fetchApi<AlumniProfile>(`/alumni/${slug}`),
    enabled: !!slug,
  });
}

export function useAlumniStories(featured?: boolean) {
  return useQuery<AlumniStory[]>({
    queryKey: ["alumni-stories", featured ?? false],
    queryFn: () => fetchApi<AlumniStory[]>(`/alumni-stories${featured ? "?featured=1" : ""}`),
  });
}

export function useAlumniStory(slug: string) {
  return useQuery<AlumniStory>({
    queryKey: ["alumni-story", slug],
    queryFn: () => fetchApi<AlumniStory>(`/alumni-stories/${slug}`),
    enabled: !!slug,
  });
}

export function useEmployerPartners(params?: { industry?: string; status?: string; featured?: boolean }) {
  const p = params ?? {};
  return useQuery<EmployerPartner[]>({
    queryKey: ["employer-partners", p],
    queryFn: () => {
      const q = new URLSearchParams();
      if (p.industry) q.set("industry", p.industry);
      if (p.status) q.set("status", p.status);
      if (p.featured) q.set("featured", "1");
      const qs = q.toString();
      return fetchApi<EmployerPartner[]>(`/employer-partners${qs ? "?" + qs : ""}`);
    },
  });
}

export function useGraduateOutcomes(params?: { programme_slug?: string; school_code?: string }) {
  const p = params ?? {};
  return useQuery<GraduateOutcome[]>({
    queryKey: ["graduate-outcomes", p],
    queryFn: () => {
      const q = new URLSearchParams();
      if (p.programme_slug) q.set("programme_slug", p.programme_slug);
      if (p.school_code) q.set("school_code", p.school_code);
      const qs = q.toString();
      return fetchApi<GraduateOutcome[]>(`/graduate-outcomes${qs ? "?" + qs : ""}`);
    },
  });
}

// ============================================================
// MP19 — Institutional Data, Rankings & Transparency
// ============================================================
import type {
  InstitutionalKpi as Mp19Kpi,
  Ranking as Mp19Ranking,
  InstitutionalReport as Mp19Report,
  Accreditation as Mp19Accreditation,
} from "./api-types";

export function useInstitutionalKpis(params?: { category?: string; featured?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.featured) qs.set("featured", "1");
  const q = qs.toString();
  return useQuery<Mp19Kpi[]>({
    queryKey: ["institutional-kpis", params],
    queryFn: () => fetchApi<Mp19Kpi[]>(`/institutional-kpis${q ? "?" + q : ""}`),
  });
}

export function useRankings(params?: { category?: string; featured?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.featured) qs.set("featured", "1");
  const q = qs.toString();
  return useQuery<Mp19Ranking[]>({
    queryKey: ["rankings", params],
    queryFn: () => fetchApi<Mp19Ranking[]>(`/rankings${q ? "?" + q : ""}`),
  });
}

export function useInstitutionalReports(params?: { report_type?: string; year?: number }) {
  const qs = new URLSearchParams();
  if (params?.report_type) qs.set("report_type", params.report_type);
  if (params?.year) qs.set("year", String(params.year));
  const q = qs.toString();
  return useQuery<Mp19Report[]>({
    queryKey: ["institutional-reports", params],
    queryFn: () => fetchApi<Mp19Report[]>(`/institutional-reports${q ? "?" + q : ""}`),
  });
}

export function useAccreditations(params?: { accreditation_type?: string }) {
  const qs = new URLSearchParams();
  if (params?.accreditation_type) qs.set("accreditation_type", params.accreditation_type);
  const q = qs.toString();
  return useQuery<Mp19Accreditation[]>({
    queryKey: ["accreditations", params],
    queryFn: () => fetchApi<Mp19Accreditation[]>(`/accreditations${q ? "?" + q : ""}`),
  });
}
