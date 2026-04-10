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
  description: string;
  programmes_count: ProgrammeCount | number;
  colour?: string;
  vision?: string;
  mission?: string;
  programmes?: Programme[];
}

export interface Programme {
  school: string;
  level: string;
  name: string;
  code: string;
  duration: string;
}

export interface Event {
  id: number;
  slug: string;
  title: string;
  date: string;
  end_date?: string | null;
  time: string;
  location: string;
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

export interface StaffProfile extends StaffMember {
  phone_visible: boolean;
  biography: string;
  qualifications: StaffQualification[];
  research_interests: string[];
  teaching_areas: string[];
  experience: StaffExperience[];
  publications: StaffPublication[];
  awards: string[];
  memberships: string[];
}

export interface ProgrammeDetail {
  school: string;
  code: string;
  overview: string;
  mode: string;
  career_opportunities: string[];
  entry_requirements: string[];
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

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`/api${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
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
  theme?: { name: string; slug: string; colour: string };
  publications?: ResearchPublication[];
  grant?: { name: string; funder: string; amount: number; currency: string; status: string };
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
