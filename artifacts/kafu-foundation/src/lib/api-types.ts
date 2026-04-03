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
  excerpt: string;
  summary?: string;
  content?: string;
  category: string;
  date: string;
  image?: string | null;
  imageUrl?: string | null;
  featured: boolean;
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
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

export interface Opportunity {
  id: number;
  type: string;
  title: string;
  reference?: string;
  deadline: string;
  status: string;
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
