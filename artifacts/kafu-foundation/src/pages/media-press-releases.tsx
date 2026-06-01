import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Input } from "@/components/ui/input";
import { Newspaper, Search, Download, Calendar, Tag } from "lucide-react";

interface PressRelease {
  id: string;
  title: string;
  date: string;
  year: number;
  category: string;
  summary: string;
  file_url?: string;
}

const FALLBACK_PRESS_RELEASES: PressRelease[] = [
  { id: "pr01", title: "KAFU Launches New School of Health Sciences Building", date: "12 May 2026", year: 2026, category: "Infrastructure", summary: "The Vice Chancellor officially opened the newly constructed School of Health Sciences laboratory block, a KES 120 million facility funded through government capitation and a USAID infrastructure grant.", file_url: "#" },
  { id: "pr02", title: "University Receives KES 50 Million Research Grant from Wellcome Trust", date: "28 Apr 2026", year: 2026, category: "Research", summary: "Kaimosi Friends University has been awarded a KES 50 million multi-year research grant by the Wellcome Trust to support health systems research in rural Western Kenya.", file_url: "#" },
  { id: "pr03", title: "KAFU Signs MOU with Masinde Muliro University of Science and Technology", date: "10 Apr 2026", year: 2026, category: "Partnerships", summary: "The memorandum of understanding covers joint research initiatives, staff exchange, and sharing of specialized laboratory equipment between the two institutions.", file_url: "#" },
  { id: "pr04", title: "CUE Accreditation Renewed for All 38 Programmes", date: "5 Mar 2026", year: 2026, category: "Accreditation", summary: "The Commission for University Education (CUE) has renewed accreditation for all 38 academic programmes offered at Kaimosi Friends University for the 2026–2029 cycle.", file_url: "#" },
  { id: "pr05", title: "KAFU 2025 Graduation: 812 Graduates Feted", date: "30 Nov 2025", year: 2025, category: "Events", summary: "Kaimosi Friends University held its 6th graduation ceremony, conferring degrees, diplomas, and certificates to 812 graduands in a colourful ceremony attended by over 3,000 guests.", file_url: "#" },
  { id: "pr06", title: "New Vice Chancellor Appointed by University Council", date: "14 Oct 2025", year: 2025, category: "Leadership", summary: "The University Council has approved the appointment of a new substantive Vice Chancellor following a competitive national search. The incoming VC takes office in January 2026.", file_url: "#" },
  { id: "pr07", title: "KAFU Ranked Among Top 10 Mid-Size Universities in Kenya", date: "2 Sep 2025", year: 2025, category: "Rankings", summary: "The 2025 UniRank Kenya University Rankings placed KAFU among the top 10 mid-size universities in Kenya, citing improvements in research output, student satisfaction, and employability.", file_url: "#" },
  { id: "pr08", title: "KAFU–Rongo University Student Exchange Programme Launched", date: "20 Aug 2025", year: 2025, category: "Partnerships", summary: "A bilateral student exchange programme has been formalised between KAFU and Rongo University, allowing up to 20 students per semester to study at the partner institution.", file_url: "#" },
  { id: "pr09", title: "University ISO 9001:2015 Certification Achieved", date: "15 Jun 2025", year: 2025, category: "Quality", summary: "KAFU has been awarded ISO 9001:2015 certification for its Quality Management System, making it one of the first public universities in Kenya to achieve this standard.", file_url: "#" },
  { id: "pr10", title: "E-Learning Platform Upgraded — 4,200 Students Now Online", date: "3 Mar 2025", year: 2025, category: "Technology", summary: "The university's e-learning platform has been upgraded to support 4,200 concurrent users, with new features including video lectures, live sessions, and mobile app access.", file_url: "#" },
  { id: "pr11", title: "KAFU Wins National Innovation Award — Student Category", date: "18 Feb 2025", year: 2025, category: "Awards", summary: "A team of KAFU Computer Science students won first prize at the 2025 Kenya National Innovation Awards for their solar-powered water purification system designed for rural communities.", file_url: "#" },
  { id: "pr12", title: "University Council Approves 2025–2030 Strategic Plan", date: "10 Dec 2024", year: 2024, category: "Governance", summary: "The University Council has unanimously approved the 2025–2030 Strategic Plan, which sets ambitious targets for enrolment growth, research output, infrastructure development, and community impact.", file_url: "#" },
];

const CATEGORIES = ["All", "Infrastructure", "Research", "Partnerships", "Accreditation", "Events", "Leadership", "Rankings", "Quality", "Technology", "Awards", "Governance"];

function formatForSearch(pr: PressRelease) {
  return `${pr.title} ${pr.summary} ${pr.category}`.toLowerCase();
}

export default function MediaPressReleasesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");

  const { data: apiData } = useQuery<{ data: PressRelease[] }>({
    queryKey: ["press-releases"],
    queryFn: () => fetch("/api/press-releases").then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const pressReleases = apiData?.data ?? FALLBACK_PRESS_RELEASES;

  const YEARS = useMemo(
    () => Array.from(new Set(pressReleases.map(pr => pr.year))).sort((a, b) => b - a),
    [pressReleases]
  );

  const filtered = useMemo(() => pressReleases.filter(pr => {
    if (category !== "All" && pr.category !== category) return false;
    if (year !== "All" && pr.year !== Number(year)) return false;
    if (search && !formatForSearch(pr).includes(search.toLowerCase())) return false;
    return true;
  }), [pressReleases, search, category, year]);

  return (
    <>
      <SeoHead
        title="Press Releases | Kaimosi Friends University"
        description="Official press releases and media statements from Kaimosi Friends University."
      />

      <PageHero
        eyebrow="Media"
        title="Press Releases"
        subtitle="Official media statements, announcements, and communications from Kaimosi Friends University."
        photo="/imgs/campus-main.jpg"
        align="left"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Media", href: "/media" }, { label: "Press Releases" }]}
      />

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search press releases..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              data-testid="press-search"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="press-filter-category"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="press-filter-year"
          >
            <option>All</option>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-6">{filtered.length} press release{filtered.length !== 1 ? "s" : ""} found</p>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No press releases match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(pr => (
              <div key={pr.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-primary/30 transition-colors" data-testid={`press-card-${pr.id}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        <Tag className="w-3 h-3" />{pr.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />{pr.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base leading-snug">{pr.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{pr.summary}</p>
                  </div>
                  {pr.file_url && pr.file_url !== "#" && (
                    <a
                      href={pr.file_url}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 whitespace-nowrap"
                      data-testid={`press-download-${pr.id}`}
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
