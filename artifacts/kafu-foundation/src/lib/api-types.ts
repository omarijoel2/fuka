export interface ApiResponse<T> {
  data: T;
}

export interface Stat {
  label: string;
  value: number;
}

export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  imageUrl?: string | null;
  tags: string[];
  featured: boolean;
}

export interface NewsArticleDetail extends NewsArticle {
  content: string;
  related: number[];
}

export interface ProgrammeCount {
  undergraduate: number;
  postgraduate: number;
  doctoral: number;
}

export interface School {
  code: string;
  name: string;
  dean: string | null;
  dean_title?: string | null;
  dean_photo?: string | null;
  description: string;
  programmes_count: ProgrammeCount | number;
  colour?: string;
  vision?: string;
  mission?: string;
  programmes?: Programme[];
  href?: string | null;
}

export interface Programme {
  school: string;
  level: string;
  name: string;
  code: string;
  duration: string;
  description?: string;
}

export interface Event {
  id: number;
  slug: string;
  title: string;
  date: string;
  end_date?: string | null;
  time: string;
  location: string;
  venue?: string;
  category: string;
  description: string;
  registration_link?: string | null;
  tags: string[];
  status: "upcoming" | "past" | "ongoing";
}

export interface Announcement {
  id: number;
  slug: string;
  title: string;
  department: string;
  priority: "normal" | "urgent";
  publish_date: string;
  summary: string;
  tags: string[];
  status: "active" | "archived";
  imageUrl?: string | null;
}

export interface AnnouncementDetail extends Announcement {
  content: string;
  attachments: { title: string; url: string; type: string }[];
}

export interface Opportunity {
  id: number;
  slug: string;
  category: string;
  type: string;
  title: string;
  reference: string;
  department: string;
  summary: string;
  publish_date: string;
  deadline: string | null;
  deadline_time: string | null;
  status: string;
  featured: boolean;
  documents_count: number;
}

export interface OpportunityDocument {
  title: string;
  type: string;
  size: string;
  url: string;
}

export interface OpportunityContact {
  office: string;
  email: string;
  phone: string;
  location: string;
}

export interface OpportunityDetail extends Opportunity {
  description: string;
  requirements: string[];
  submission_info: string;
  contact: OpportunityContact;
  documents: OpportunityDocument[];
}

export interface ContactEmail {
  label: string;
  address: string;
}

export interface Portal {
  name: string;
  url: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface ContactInfo {
  institution: string;
  abbreviation: string;
  address: string;
  phone: string;
  emails: ContactEmail[];
  website: string;
  portals: Portal[];
  social_media: SocialMedia[];
}

export interface StaffMember {
  slug: string;
  title: string;
  name: string;
  designation: string;
  school: string | null;
  department: string;
  unit: string | null;
  email: string;
  specializations: string[];
  photo: string | null;
  bio: string;
}

export interface StaffQualification {
  year: string;
  qualification: string;
  institution: string;
}

export interface StaffExperience {
  start: string;
  end: string;
  position: string;
  institution: string;
}

export interface StaffPublication {
  citation: string;
  url: string | null;
}

export interface StaffCourse {
  code: string;
  name: string;
  programme?: string;
  level?: string;
}

export interface StaffGrant {
  title: string;
  funder: string;
  amount?: string;
  start?: string;
  end?: string;
  role?: string;
  status?: string;
}

export interface StaffSupervision {
  masters_count: number;
  phd_count: number;
  current_students?: { name: string; topic: string; level: string; year?: string }[];
}

export interface StaffRepoPublication {
  id: number;
  slug: string;
  title: string;
  type: string;
  year: number;
  journal_name?: string;
  doi?: string;
  citation_count: number;
  access: string;
}

export interface StaffProfile extends StaffMember {
  rank?: string;
  phone_visible: boolean;
  biography: string;
  orcid_id?: string;
  google_scholar_url?: string;
  scopus_id?: string;
  linkedin_url?: string;
  cv_url?: string;
  qualifications: StaffQualification[];
  research_interests: string[];
  teaching_areas: string[];
  courses_taught: StaffCourse[];
  experience: StaffExperience[];
  publications: StaffPublication[];
  repo_publications: StaffRepoPublication[];
  grants: StaffGrant[];
  supervision: StaffSupervision;
  awards: string[];
  memberships: string[];
  profile_completeness?: number;
}

export interface CourseStructureYear {
  year: string;
  units: string[];
}

export interface Accreditation {
  body: string;
  status: string;
  year: number;
}

export interface EmployabilityData {
  job_roles: string[];
  industry_sectors: string[];
  employment_rate: number;
}

export interface FeeStructure {
  tuition_kes_per_year: number;
  accommodation_kes_per_year: number;
  other_costs_kes: number;
  total_annual_kes: number;
  govt_sponsored_tuition: number;
  notes: string;
}

export interface ProgrammeDetail {
  school: string;
  code: string;
  overview: string;
  mode: string;
  career_opportunities: string[];
  entry_requirements: string[];
  learning_outcomes?: string[];
  course_structure?: CourseStructureYear[];
  accreditation?: Accreditation;
  employability_data?: EmployabilityData;
  fee_structure?: FeeStructure;
}

export interface EligibleProgramme {
  name: string;
  code: string;
  school: string;
  min_grade: string;
  min_points: number;
  duration: string;
  career_hint: string;
  note?: string;
}

export interface ClusterRequirementResult {
  description: string;
  required_grade: string;
  required_count: number;
  options: string[];
  best_subject: string | null;
  best_grade: string | null;
  pass: boolean;
}

export interface EligibilityResult {
  verdict: 'eligible' | 'borderline' | 'not_eligible';
  pathway: string;
  mean_grade: string;
  grade_points: number;
  subject_grades_provided: boolean;
  message: string;
  eligible_programmes: (EligibleProgramme & {
    cluster_check: ClusterRequirementResult[] | null;
    cluster_pass: boolean | null;
  })[];
  alternative_options: (EligibleProgramme & {
    cluster_check: ClusterRequirementResult[] | null;
    cluster_pass: boolean | null;
  })[];
  next_steps: { label: string; url: string }[];
}

export interface CertificateUploadResult {
  reference_id: string;
  file_name: string;
  document_type: string;
  size_kb: number;
  message: string;
}

export interface FeeItem {
  label: string;
  amount: number;
  note: string;
}

export interface FeePathway {
  id: string;
  title: string;
  subtitle: string;
  tuition_note: string;
  annual_items: FeeItem[];
  estimated_annual_total: number;
  estimated_4yr_total?: number;
  estimated_annual_total_usd?: number;
  helb_note: string;
  scholarships: string[];
}

export interface PaymentMethod {
  method: string;
  details: string;
}

export interface AdmissionsFees {
  currency: string;
  academic_year: string;
  pathways: FeePathway[];
  payment_methods: PaymentMethod[];
  note: string;
}

export interface AdmissionsStep {
  step: number;
  title: string;
  description: string;
}

export interface AdmissionsPathway {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  requirements: string[];
  steps: AdmissionsStep[];
  cta_label: string;
  cta_url: string;
  cta_external: boolean;
}

export interface AdmissionsDeadline {
  event: string;
  date: string;
  description: string;
}

export interface AdmissionsDocument {
  id: number;
  title: string;
  category: string;
  description: string;
  file_url: string;
  version: string;
}

export interface AdmissionsContact {
  office: string;
  email: string;
  phone: string;
  location: string;
  hours: string;
}

export interface AdmissionsData {
  pathways: AdmissionsPathway[];
  deadlines: AdmissionsDeadline[];
  documents: AdmissionsDocument[];
  contact: AdmissionsContact;
}

const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export async function fetchApi<T>(endpoint: string): Promise<T> {
const API_BASE = API_ORIGIN.endsWith("/api")
  ? API_ORIGIN
  : `${API_ORIGIN}/api`;

const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    throw new Error(`API returned non-JSON for ${endpoint} (content-type: ${ct})`);
  }
  const json = await res.json();
  if (json && typeof json === "object" && "error" in json && json.error === true) {
    throw new Error(json.message ?? "Server error");
  }
  if ("data" in json) {
    return json.data as T;
  }
  return json as T;
}

// ============================================================
// Research & Innovation (RIMS-lite) Types
// ============================================================

export interface ResearchTheme {
  id: number;
  name: string;
  slug: string;
  description: string;
  colour: string;
  icon: string;
  sdg_goals: number[];
  projects_count?: number;
  publications_count?: number;
}

export interface ResearchProject {
  id: number;
  slug: string;
  title: string;
  abstract: string;
  department: string;
  lead_researcher: string;
  lead_researcher_slug?: string;
  co_researchers?: { name: string; slug?: string }[];
  status: "planned" | "active" | "completed" | "suspended";
  start_date?: string;
  end_date?: string;
  funding_source?: string;
  sdg_goals: number[];
  featured_image_url?: string;
  is_featured: boolean;
  theme?: { name: string; slug: string; colour: string; description?: string };
  publications?: ResearchPublication[];
  grant?: { name: string; funder: string; amount: number; currency: string; status: string };
  seo_meta?: { title?: string; description?: string } | null;
}

export interface ResearchPublication {
  id: number;
  slug: string;
  title: string;
  authors: { name: string; first_initial?: string; last_name?: string; affiliation?: string }[];
  year: number;
  journal?: string;
  publisher?: string;
  doi?: string;
  url?: string;
  type: "journal" | "conference" | "book_chapter" | "thesis" | "report" | "book" | "preprint";
  abstract?: string;
  indexed_in: string[];
  volume?: string;
  issue?: string;
  pages?: string;
  is_featured: boolean;
  citation: string;
  project?: { id: number; slug: string; title: string; theme?: { name: string; colour: string } };
  seo_meta?: { title?: string; description?: string } | null;
}

export interface ResearchGrant {
  id: number;
  name: string;
  funder: string;
  funder_type?: string;
  funder_country?: string;
  amount?: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  status: "active" | "completed" | "pending";
  description?: string;
  grant_number?: string;
  project?: { slug: string; title: string };
}

export interface ResearchPartner {
  id: number;
  name: string;
  slug: string;
  type: "academic" | "government" | "ngo" | "donor" | "industry" | "international";
  country?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  collaboration_areas: string[];
  is_featured: boolean;
}

export interface ResearchOverview {
  stats: { label: string; value: number }[];
  featured_projects: ResearchProject[];
  featured_publications: ResearchPublication[];
  themes: ResearchTheme[];
}

export interface PaginatedResearch<T> {
  data: T[];
  total: number;
  last_page: number;
  current_page: number;
  per_page: number;
}

// ── International & Partnerships ─────────────────────────────

export type PartnerType =
  | "university"
  | "research_institute"
  | "government"
  | "ngo"
  | "development_agency"
  | "quaker"
  | "professional_body";

export type PartnerStatus = "active" | "inactive" | "pending";

export interface InternationalPartnership {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  country: string;
  country_code?: string;
  type: PartnerType;
  status: PartnerStatus;
  description?: string;
  logo_url?: string;
  website_url?: string;
  mou_date?: string;
  mou_expiry?: string;
  collaboration_areas: string[];
  is_featured: boolean;
  sort_order: number;
}

export interface InternationalPartnershipDetail extends InternationalPartnership {
  exchange_programmes: ExchangeProgramme[];
}

export type ExchangeType =
  | "student_exchange"
  | "staff_exchange"
  | "joint_degree"
  | "summer_school"
  | "research_fellowship"
  | "internship";

export type ExchangeStatus = "open" | "closed" | "upcoming" | "suspended";

export interface ExchangeProgramme {
  id: number;
  slug: string;
  title: string;
  type: ExchangeType;
  partnership_id?: number;
  partner_name?: string;
  partner_country?: string;
  description: string;
  duration_weeks?: number;
  duration_label?: string;
  application_deadline?: string;
  next_intake?: string;
  slots_available?: number;
  stipend_amount?: number;
  stipend_currency: string;
  eligibility: string[];
  benefits: string[];
  required_documents: string[];
  status: ExchangeStatus;
  is_featured: boolean;
  partnership?: { id: number; name: string; country: string; logo_url?: string; slug: string };
}

export interface InternationalOverview {
  stats: { label: string; value: number | string }[];
  featured_partnerships: InternationalPartnership[];
  featured_programmes: ExchangeProgramme[];
}

// ── INSTITUTIONAL REPOSITORY (MP12) ──────────────────────────────────────

export type RepoItemType =
  | 'thesis' | 'dissertation' | 'journal_article' | 'conference_paper'
  | 'book_chapter' | 'research_report' | 'working_paper' | 'dataset';

export type RepoAccess  = 'open' | 'restricted' | 'embargo';
export type RepoLicense = 'cc_by' | 'cc_by_nc' | 'cc_by_sa' | 'all_rights_reserved' | 'open_access';
export type RepoStatus  = 'draft' | 'under_review' | 'approved' | 'published' | 'withdrawn';

export interface RepoAuthor {
  name: string;
  staff_slug?: string;
  role?: string;
}

export interface RepositoryItem {
  id: number;
  slug: string;
  title: string;
  type: RepoItemType;
  abstract: string;
  authors: RepoAuthor[];
  keywords: string[];
  department?: string;
  research_theme?: string;
  year: number;
  publisher?: string;
  journal_name?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  isbn_issn?: string;
  file_url?: string;
  file_size_kb: number;
  language: string;
  license: RepoLicense;
  access: RepoAccess;
  embargo_until?: string;
  funded_by?: string;
  student_name?: string;
  supervisor?: string;
  degree?: string;
  citation_count: number;
  downloads: number;
  views: number;
  status: RepoStatus;
  seo_meta?: { title?: string; description?: string } | null;
  related?: Pick<RepositoryItem, 'id' | 'slug' | 'title' | 'type' | 'year' | 'authors'>[];
}

export interface RepositoryOverview {
  stats: {
    total: number; theses: number; articles: number;
    open_access: number; downloads: number; departments: number;
  };
  featured: RepositoryItem[];
  recent: RepositoryItem[];
}

export interface RepositoryPage {
  data: RepositoryItem[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface RepositoryFacets {
  years:       { year: number; count: number }[];
  departments: { department: string; count: number }[];
  types:       { type: RepoItemType; count: number }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// MP15 — Campuses & Service Points
// ─────────────────────────────────────────────────────────────────────────────

export interface Campus {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  address?: string;
  county?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  hero_image?: string;
  gallery_images?: string[];
  contact_email?: string;
  contact_phone?: string;
  visitor_notes?: string;
  transport_notes?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  offices?: ServicePoint[];
}

export interface ServicePoint {
  id: number;
  name: string;
  slug: string;
  category: string;
  campus_id?: number;
  campus?: { id: number; name: string; slug: string; address?: string; latitude?: number; longitude?: number };
  building?: string;
  contact_person?: string;
  public_phone?: string;
  public_email?: string;
  whatsapp?: string;
  physical_location?: string;
  latitude?: number;
  longitude?: number;
  operating_hours?: { mon_fri?: string; sat?: string; sun?: string };
  summary?: string;
  support_scope?: string;
  related_links?: { label: string; url: string }[];
  hero_image?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  seo_meta?: { title?: string; description?: string } | null;
}
