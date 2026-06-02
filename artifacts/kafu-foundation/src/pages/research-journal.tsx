import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { ChevronRight, BookOpen, ExternalLink, Calendar, FileText, Users, Send, Download } from "lucide-react";

interface JournalIssue {
  id: string;
  title: string;
  type: string;
  year: number;
  description: string;
  cover_url?: string | null;
  file_url?: string | null;
  pages?: string | null;
  frequency?: string | null;
}

const FALLBACK_ISSUES: JournalIssue[] = [
  {
    id: "kafu-journal-vol4-no2-2025",
    title: "KAFU Journal of Research and Innovation — Vol. 4, No. 2 (2025)",
    type: "Journal",
    year: 2025,
    description: "Features peer-reviewed articles on educational technology, health sciences, agribusiness, and environmental sustainability from KAFU researchers and collaborating institutions.",
    pages: "148",
    frequency: "Bi-annual",
  },
  {
    id: "kafu-journal-vol4-no1-2025",
    title: "KAFU Journal of Research and Innovation — Vol. 4, No. 1 (2025)",
    type: "Journal",
    year: 2025,
    description: "Special edition on community development and rural transformation in Western Kenya, featuring articles from the 2024 Research Week symposium.",
    pages: "132",
    frequency: "Bi-annual",
  },
  {
    id: "kafu-journal-vol3-no2-2024",
    title: "KAFU Journal of Research and Innovation — Vol. 3, No. 2 (2024)",
    type: "Journal",
    year: 2024,
    description: "Research contributions covering curriculum reform, clinical nursing practice, entrepreneurship education, and data science applications.",
    pages: "124",
    frequency: "Bi-annual",
  },
  {
    id: "kafu-journal-vol3-no1-2024",
    title: "KAFU Journal of Research and Innovation — Vol. 3, No. 1 (2024)",
    type: "Journal",
    year: 2024,
    description: "Interdisciplinary research in education, ICT, law, and agri-food systems — including a thematic cluster on post-pandemic learning recovery.",
    pages: "118",
    frequency: "Bi-annual",
  },
  {
    id: "kafu-journal-vol2-no2-2023",
    title: "KAFU Journal of Research and Innovation — Vol. 2, No. 2 (2023)",
    type: "Journal",
    year: 2023,
    description: "Peer-reviewed articles addressing gender equity in higher education, food security interventions, and mobile health applications.",
    pages: "110",
    frequency: "Bi-annual",
  },
  {
    id: "kafu-journal-vol2-no1-2023",
    title: "KAFU Journal of Research and Innovation — Vol. 2, No. 1 (2023)",
    type: "Journal",
    year: 2023,
    description: "Inaugural second-year edition with special focus on research capacity building, bibliometric analysis, and KAFU's growing research output.",
    pages: "98",
    frequency: "Bi-annual",
  },
];

const SCOPE_AREAS = [
  "Education, Pedagogy & Curriculum Studies",
  "Health Sciences & Public Health",
  "Agriculture, Food Security & Environment",
  "Business, Economics & Entrepreneurship",
  "Information & Communication Technology",
  "Law, Governance & Social Sciences",
  "Engineering & Applied Sciences",
  "Humanities, Languages & Cultural Studies",
];

const SUBMISSION_STEPS = [
  { step: "1", title: "Prepare Manuscript", desc: "Format your article according to the KAFU Journal Author Guidelines (APA 7th edition, 4,000–8,000 words)." },
  { step: "2", title: "Submit Online", desc: "Send your manuscript as a Word document (.docx) to research@kafu.ac.ke with subject line: KJRI Submission — [Title]." },
  { step: "3", title: "Peer Review", desc: "All submissions undergo double-blind peer review by at least two subject-area experts. Review takes 4–8 weeks." },
  { step: "4", title: "Revision & Decision", desc: "Authors receive detailed reviewer feedback. Accepted manuscripts undergo copy-editing and typesetting." },
  { step: "5", title: "Publication", desc: "Accepted articles are published in the next available issue (bi-annual: May and November)." },
];

const EDITORIAL_BOARD = [
  { name: "Prof. Daniel Mwangi Kariuki",   role: "Editor-in-Chief",         school: "School of Education & Social Sciences" },
  { name: "Dr. Atieno Margaret Otieno",    role: "Associate Editor",         school: "School of Business & Economics" },
  { name: "Dr. Samuel Kiprotich Langat",   role: "Associate Editor",         school: "School of Health Sciences" },
  { name: "Mr. Bernard Ochieng Adhiambo",  role: "Associate Editor",         school: "School of Agriculture & Natural Resources" },
  { name: "Dr. Grace Wanjiku Kamau",       role: "Associate Editor",         school: "School of Pure & Applied Sciences" },
  { name: "Ms. Lydia Nekesa Wafula",       role: "Editorial Assistant",      school: "Directorate of Research & Innovation" },
];

function useJournalIssues() {
  return useQuery({
    queryKey: ["journal-publications"],
    queryFn: async (): Promise<JournalIssue[]> => {
      const res = await fetch(`/api/publications?type=Journal`);
      if (!res.ok) throw new Error("not found");
      const json = await res.json();
      const items = (json.data ?? []) as JournalIssue[];
      return items.length ? items : FALLBACK_ISSUES;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK_ISSUES,
  });
}

export default function ResearchJournal() {
  const [yearFilter, setYearFilter] = useState<number | "">("");
  const { data: issues = FALLBACK_ISSUES } = useJournalIssues();

  const years = [...new Set(issues.map(i => i.year))].sort((a, b) => b - a);
  const filtered = yearFilter ? issues.filter(i => i.year === yearFilter) : issues;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="KAFU Journal of Research and Innovation"
        description="The peer-reviewed open-access journal of Kaimosi Friends University. Bi-annual publication covering education, health, agriculture, ICT, law, and more."
        path="/research/journal"
        breadcrumbs={[
          { name: "Research", path: "/research" },
          { name: "KAFU Journal", path: "/research/journal" },
        ]}
      />

      {/* Hero */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <img src="/imgs/picture2.png" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2)" }} />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative max-w-5xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6">
            <Link href="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/research" className="hover:text-primary-foreground transition-colors">Research</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-foreground">KAFU Journal</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="hidden sm:flex w-16 h-16 bg-gold/20 border border-gold/40 rounded-xl items-center justify-center shrink-0">
              <BookOpen className="w-8 h-8 text-gold" />
            </div>
            <div>
              <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Open Access · Peer-Reviewed</p>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                KAFU Journal of Research and Innovation
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl">
                The interdisciplinary academic journal of Kaimosi Friends University, publishing original research across all disciplinary areas twice a year.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-primary-foreground/70">
                <span>ISSN: 2790-4512 (Online)</span>
                <span>ISSN: 2790-4504 (Print)</span>
                <span>Published: May &amp; November</span>
                <span>Open Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

          {/* About strip */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <FileText className="w-5 h-5 text-primary" />, title: "Scope", body: "Publishes original research, review articles, and case studies across all academic disciplines represented at KAFU." },
              { icon: <Users className="w-5 h-5 text-primary" />,    title: "Peer Review", body: "Double-blind peer review process ensuring rigorous academic quality. All reviewers are subject-area experts." },
              { icon: <Calendar className="w-5 h-5 text-primary" />, title: "Publication", body: "Bi-annual issues published in May and November. Open access — freely available to readers worldwide." },
            ].map(card => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center mb-3">{card.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.body}</p>
              </div>
            ))}
          </div>

          {/* Issues */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-display font-bold text-gray-900">Issues &amp; Volumes</h2>
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value ? Number(e.target.value) : "")}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              {filtered.map((issue, idx) => (
                <div key={issue.id ?? idx} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4 hover:border-primary/30 transition-colors">
                  <div className="hidden sm:flex w-12 h-12 bg-primary/10 rounded-xl items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{issue.title}</h3>
                      <span className="shrink-0 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">{issue.year}</span>
                    </div>
                    {issue.description && <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{issue.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      {issue.pages && <span>{issue.pages} pages</span>}
                      {issue.frequency && <span>{issue.frequency}</span>}
                    </div>
                  </div>
                  {issue.file_url ? (
                    <a href={issue.file_url} target="_blank" rel="noreferrer"
                      className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                  ) : (
                    <a href="mailto:research@kafu.ac.ke"
                      className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Request
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Scope */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-2">Aims &amp; Scope</h2>
            <p className="text-gray-500 text-sm mb-5">
              The KAFU Journal of Research and Innovation welcomes original, high-quality manuscripts that contribute to knowledge across the following disciplinary areas:
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SCOPE_AREAS.map(area => (
                <div key={area} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {area}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Interdisciplinary and cross-cutting research is particularly encouraged. All submissions must present original findings not previously published elsewhere.
            </p>
          </section>

          {/* Submission process */}
          <section>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-5">How to Submit</h2>
            <div className="space-y-4">
              {SUBMISSION_STEPS.map(s => (
                <div key={s.step} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Ready to submit?</p>
                <p className="text-sm text-gray-500 mt-0.5">Send your manuscript to <a href="mailto:research@kafu.ac.ke" className="text-primary underline">research@kafu.ac.ke</a></p>
              </div>
              <a href="mailto:research@kafu.ac.ke"
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" /> Submit Manuscript
              </a>
            </div>
          </section>

          {/* Editorial board */}
          <section>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-5">Editorial Board</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {EDITORIAL_BOARD.map(member => (
                <div key={member.name} className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{member.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">{member.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{member.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Back nav */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link href="/research" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" /> Research Overview
            </Link>
            <Link href="/research/publications" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
              All Publications <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
