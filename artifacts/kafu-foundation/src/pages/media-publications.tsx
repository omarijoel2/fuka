import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { BookOpen, Download, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Publication {
  id: string;
  title: string;
  type: string;
  year: number;
  frequency?: string;
  description: string;
  cover_url?: string;
  file_url?: string;
  pages?: number;
}

const FALLBACK_PUBLICATIONS: Publication[] = [
  { id: "pub01", title: "KAFU Prospectus 2025/2026", type: "Prospectus", year: 2025, description: "The official university prospectus containing programme details, entry requirements, fees, facilities, and scholarship information for the 2025/2026 academic year.", cover_url: "/images/uploads/undergraduate.jpg", file_url: "#", pages: 112 },
  { id: "pub02", title: "The KAFU Chronicle — Issue 12 (Jan–Mar 2025)", type: "Newsletter", year: 2025, frequency: "Quarterly", description: "Quarterly newsletter covering academic achievements, research highlights, staff news, student activities, and community initiatives for Q1 2025.", cover_url: "/images/uploads/IMG_8696.jpg", file_url: "#", pages: 24 },
  { id: "pub03", title: "The KAFU Chronicle — Issue 11 (Oct–Dec 2024)", type: "Newsletter", year: 2024, frequency: "Quarterly", description: "Year-end edition featuring 2024 graduation highlights, annual research output summary, staff honours, and alumni spotlight.", cover_url: "/images/uploads/campus-main.jpg", file_url: "#", pages: 24 },
  { id: "pub04", title: "Annual Report 2024", type: "Annual Report", year: 2024, description: "Comprehensive annual report covering enrolment statistics, financial performance, academic achievements, research output, infrastructure development, and strategic milestones for the year 2024.", cover_url: "/images/uploads/aerial-1.jpg", file_url: "#", pages: 68 },
  { id: "pub05", title: "Annual Report 2023", type: "Annual Report", year: 2023, description: "The 2023 Annual Report documenting the university's academic, financial, and operational performance including progress against the 2020–2025 Strategic Plan.", cover_url: "/images/uploads/health.jpg", file_url: "#", pages: 60 },
  { id: "pub06", title: "Research Digest 2024", type: "Research Publication", year: 2024, description: "An annual publication highlighting selected research projects, publications, and innovation activities from KAFU's five schools and research directorates.", cover_url: "/images/uploads/PIC1.jpg", file_url: "#", pages: 48 },
  { id: "pub07", title: "Strategic Plan 2025–2030", type: "Strategic Document", year: 2025, description: "The KAFU Strategic Plan 2025–2030 outlining the university's vision, mission, strategic objectives, and key performance indicators across five strategic pillars.", cover_url: "/images/uploads/campus-main.jpg", file_url: "#", pages: 80 },
  { id: "pub08", title: "Student Handbook 2025/2026", type: "Handbook", year: 2025, description: "Comprehensive guide for students covering academic regulations, conduct and discipline, student welfare services, clubs and societies, and campus life information.", cover_url: "/images/uploads/undergraduate.jpg", file_url: "#", pages: 96 },
  { id: "pub09", title: "The KAFU Chronicle — Issue 10 (Jul–Sep 2024)", type: "Newsletter", year: 2024, frequency: "Quarterly", description: "Covers mid-year enrolment statistics, the launch of the Health Sciences School, international partnership news, and staff promotions.", cover_url: "/images/uploads/art-culture.jpg", file_url: "#", pages: 24 },
  { id: "pub10", title: "The KAFU Chronicle — Issue 9 (Apr–Jun 2024)", type: "Newsletter", year: 2024, frequency: "Quarterly", description: "Features the Research Week 2024 highlights, student innovation showcase, sports day results, and community outreach activities.", cover_url: "/images/uploads/IMG_8696.jpg", file_url: "#", pages: 24 },
  { id: "pub11", title: "Quality Assurance Framework 2024", type: "Policy Document", year: 2024, description: "KAFU's Quality Assurance Framework outlining internal quality review mechanisms, programme monitoring, and performance evaluation processes aligned to CUE standards.", cover_url: "/images/uploads/health.jpg", file_url: "#", pages: 42 },
  { id: "pub12", title: "KAFU Prospectus 2024/2025", type: "Prospectus", year: 2024, description: "The official university prospectus for the 2024/2025 academic year containing programme listings, fee structures, and admission requirements.", cover_url: "/images/uploads/undergraduate.jpg", file_url: "#", pages: 104 },
];

const TYPES = ["All", "Prospectus", "Newsletter", "Annual Report", "Research Publication", "Strategic Document", "Handbook", "Policy Document"];

const TYPE_COLOURS: Record<string, string> = {
  "Prospectus": "bg-green-100 text-green-800",
  "Newsletter": "bg-blue-100 text-blue-800",
  "Annual Report": "bg-amber-100 text-amber-800",
  "Research Publication": "bg-purple-100 text-purple-800",
  "Strategic Document": "bg-teal-100 text-teal-800",
  "Handbook": "bg-orange-100 text-orange-800",
  "Policy Document": "bg-red-100 text-red-800",
};

export default function MediaPublicationsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");

  const { data: apiData } = useQuery<{ data: Publication[] }>({
    queryKey: ["publications"],
    queryFn: () => fetch("/api/publications").then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const publications = apiData?.data ?? FALLBACK_PUBLICATIONS;

  const YEARS = useMemo(
    () => Array.from(new Set(publications.map(p => p.year))).sort((a, b) => b - a),
    [publications]
  );

  const filtered = useMemo(() => publications.filter(p => {
    if (type !== "All" && p.type !== type) return false;
    if (year !== "All" && p.year !== Number(year)) return false;
    if (search && !`${p.title} ${p.description} ${p.type}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [publications, search, type, year]);

  return (
    <>
      <SeoHead
        title="Publications | Kaimosi Friends University"
        description="KAFU institutional publications — prospectus, newsletters, annual reports, strategic documents, and handbooks."
      />

      <PageHero
        eyebrow="Media"
        title="Publications"
        subtitle="Official university publications including the prospectus, newsletters, annual reports, and strategic documents."
        photo="/images/uploads/undergraduate.jpg"
        align="left"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Media", href: "/media" }, { label: "Publications" }]}
      />

      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search publications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              data-testid="pub-search"
            />
          </div>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="pub-filter-type"
          >
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="pub-filter-year"
          >
            <option>All</option>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        <p className="text-sm text-gray-400 mb-6">{filtered.length} publication{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No publications match your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col" data-testid={`pub-card-${p.id}`}>
                {/* Cover */}
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOURS[p.type] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.type}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{p.year}</span>
                    {p.frequency && <><span>·</span><span>{p.frequency}</span></>}
                    {p.pages && <><span>·</span><span>{p.pages} pages</span></>}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 flex-1">{p.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-3 mb-4">{p.description}</p>
                  {p.file_url && (
                    <a
                      href={p.file_url}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 mt-auto"
                      data-testid={`pub-download-${p.id}`}
                    >
                      <Download className="w-4 h-4" /> Download PDF
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
