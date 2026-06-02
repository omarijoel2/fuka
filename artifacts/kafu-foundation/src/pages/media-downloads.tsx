import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Download, Search, FileText, File, Sheet, Book } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DownloadItem {
  id: string;
  title: string;
  category: string;
  type: "PDF" | "DOCX" | "XLSX" | "ZIP";
  size: string;
  updated: string;
  description: string;
  file_url: string;
}

const FALLBACK_DOWNLOADS: DownloadItem[] = [
  { id: "dl01", title: "Undergraduate Application Form 2025/2026", category: "Admissions", type: "PDF", size: "280 KB", updated: "Jan 2025", description: "Official application form for undergraduate degree programmes (Self-Sponsored Category).", file_url: "#" },
  { id: "dl02", title: "Postgraduate Application Form 2025/2026", category: "Admissions", type: "PDF", size: "310 KB", updated: "Jan 2025", description: "Official application form for Masters and PhD programmes.", file_url: "#" },
  { id: "dl03", title: "Fee Structure 2025/2026 — Undergraduate", category: "Finance", type: "PDF", size: "195 KB", updated: "Sep 2025", description: "Approved tuition and levies fee structure for all undergraduate programmes for the 2025/2026 academic year.", file_url: "#" },
  { id: "dl04", title: "Fee Structure 2025/2026 — Postgraduate", category: "Finance", type: "PDF", size: "180 KB", updated: "Sep 2025", description: "Approved fee structure for all postgraduate (Masters and PhD) programmes.", file_url: "#" },
  { id: "dl05", title: "Academic Calendar 2025/2026", category: "Academic", type: "PDF", size: "145 KB", updated: "Aug 2025", description: "Approved academic calendar for the 2025/2026 academic year including semester dates, examination periods, and holidays.", file_url: "#" },
  { id: "dl06", title: "Examination Regulations (2023 Edition)", category: "Academic", type: "PDF", size: "420 KB", updated: "Jul 2023", description: "Updated examination regulations covering examination conduct, academic integrity, special exam provisions, and appeals.", file_url: "#" },
  { id: "dl07", title: "Student Handbook 2025/2026", category: "Student Affairs", type: "PDF", size: "1.8 MB", updated: "Sep 2025", description: "Comprehensive guide for all students on academic regulations, code of conduct, welfare services, and campus life.", file_url: "#" },
  { id: "dl08", title: "Research Proposal Template", category: "Research", type: "DOCX", size: "95 KB", updated: "Mar 2026", description: "Standard research proposal template for postgraduate students and staff grant applications.", file_url: "#" },
  { id: "dl09", title: "Staff Leave Application Form", category: "Human Resources", type: "PDF", size: "120 KB", updated: "Jan 2024", description: "Annual leave, sick leave, and special leave application form for KAFU employees.", file_url: "#" },
  { id: "dl10", title: "Staff Performance Appraisal Form 2024", category: "Human Resources", type: "PDF", size: "260 KB", updated: "Jan 2024", description: "Annual staff performance appraisal tool aligned to the KAFU Strategic Plan 2023–2028.", file_url: "#" },
  { id: "dl11", title: "Bursary & Financial Aid Application Form", category: "Finance", type: "PDF", size: "175 KB", updated: "Mar 2026", description: "Application form for KAFU internal bursary, government HELB complementary support, and special needs fund.", file_url: "#" },
  { id: "dl12", title: "Postgraduate Supervision Agreement Template", category: "Research", type: "DOCX", size: "110 KB", updated: "Jan 2025", description: "Standard supervision agreement between postgraduate students and their supervisors, as required by the School of Graduate Studies.", file_url: "#" },
  { id: "dl13", title: "Transfer of Units / Credit Transfer Form", category: "Academic", type: "PDF", size: "140 KB", updated: "Jan 2025", description: "Form for students applying to transfer academic credits from other accredited institutions.", file_url: "#" },
  { id: "dl14", title: "Room Allocation Request Form — Hostels", category: "Student Affairs", type: "PDF", size: "100 KB", updated: "Aug 2025", description: "Form for continuing and new students requesting on-campus hostel accommodation.", file_url: "#" },
  { id: "dl15", title: "Procurement Tender Documents — Current Cycle", category: "Procurement", type: "ZIP", size: "3.2 MB", updated: "May 2026", description: "Current procurement tender documents for suppliers and service providers. Includes general conditions of contract.", file_url: "#" },
  { id: "dl16", title: "Student Club Registration Form", category: "Student Affairs", type: "PDF", size: "90 KB", updated: "Sep 2025", description: "Form for registering new student clubs, societies, and associations with the Dean of Students office.", file_url: "#" },
];

const CATEGORIES = ["All", "Admissions", "Finance", "Academic", "Student Affairs", "Human Resources", "Research", "Procurement"];

const TYPE_ICON: Record<string, React.ElementType> = {
  PDF: FileText,
  DOCX: File,
  XLSX: Sheet,
  ZIP: Book,
};

const TYPE_COLOUR: Record<string, string> = {
  PDF: "bg-red-50 text-red-700",
  DOCX: "bg-blue-50 text-blue-700",
  XLSX: "bg-green-50 text-green-700",
  ZIP: "bg-amber-50 text-amber-700",
};

export default function MediaDownloadsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: apiData } = useQuery<{ data: DownloadItem[] }>({
    queryKey: ["downloads"],
    queryFn: () => fetch("/api/downloads").then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const downloads = apiData?.data ?? FALLBACK_DOWNLOADS;

  const filtered = useMemo(() => downloads.filter(d => {
    if (category !== "All" && d.category !== category) return false;
    if (search && !`${d.title} ${d.description} ${d.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [downloads, search, category]);

  return (
    <>
      <SeoHead
        title="Downloads | Kaimosi Friends University"
        description="Download KAFU forms, fee structures, academic calendars, regulations, handbooks, and other official documents."
      />

      <PageHero
        eyebrow="Media"
        title="Downloads"
        subtitle="Official forms, fee structures, academic calendars, regulations, and other documents for students, staff, and the public."
        photo="/images/uploads/campus-main.jpg"
        align="left"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Media", href: "/media" }, { label: "Downloads" }]}
      />

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              data-testid="downloads-search"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="downloads-filter-category"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <p className="text-sm text-gray-400 mb-6">{filtered.length} document{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Download className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No documents match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(d => {
              const Icon = TYPE_ICON[d.type] ?? FileText;
              return (
                <div key={d.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:border-primary/30 transition-colors" data-testid={`download-card-${d.id}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLOUR[d.type] ?? "bg-gray-50 text-gray-600"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{d.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{d.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{d.category}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{d.type} · {d.size}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">Updated {d.updated}</span>
                    </div>
                  </div>
                  <a
                    href={d.file_url}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 whitespace-nowrap"
                    data-testid={`download-btn-${d.id}`}
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
