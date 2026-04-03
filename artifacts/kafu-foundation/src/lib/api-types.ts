export interface ApiResponse<T> {
  data: T;
}

export interface HealthResponse {
  status: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  imageUrl?: string;
  featured: boolean;
}

export interface School {
  id: string;
  code: string;
  name: string;
  description: string;
  dean: string;
  vision: string;
  mission: string;
  programmeCount: number;
}

export interface Programme {
  id: string;
  code: string;
  name: string;
  schoolCode: string;
  level: "Undergraduate" | "Postgraduate" | "Doctoral" | "Diploma" | "Certificate";
  duration: string;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: "Tender" | "Job Vacancy" | "Scholarship";
  deadline: string;
  description: string;
  link: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  portals: {
    student: string;
    elearning: string;
    staff: string;
  };
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`/api${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  const json = await res.json();
  if ('data' in json) {
    return json.data as T;
  }
  return json as T;
}
