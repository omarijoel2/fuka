import React, { useState } from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Download, Calendar, BookOpen, AlertCircle } from "lucide-react";

const ACADEMIC_YEAR = "2025/2026";

const TIMETABLE_SETS = [
  {
    id: "sem2",
    label: "Semester II — 2025/2026",
    active: true,
    documents: [
      {
        title: "Final Postgraduate Examination Timetable",
        subtitle: "Semester II 2025/2026",
        type: "Examination",
        level: "Postgraduate",
        url: "https://kafu.ac.ke/timetables/",
        testid: "dl-pg-exam-sem2",
      },
      {
        title: "Final Undergraduate Examination Timetable",
        subtitle: "Semester II 2025/2026",
        type: "Examination",
        level: "Undergraduate",
        url: "https://kafu.ac.ke/timetables/",
        testid: "dl-ug-exam-sem2",
      },
      {
        title: "Teaching Timetable",
        subtitle: "Semester II 2025/2026",
        type: "Teaching",
        level: "All Students",
        url: "https://kafu.ac.ke/timetables/",
        testid: "dl-teaching-sem2",
      },
    ],
  },
  {
    id: "sem1",
    label: "Semester I — 2025/2026",
    active: false,
    documents: [
      {
        title: "Examination Timetable",
        subtitle: "Semester I 2025/2026",
        type: "Examination",
        level: "All Students",
        url: "https://kafu.ac.ke/timetables/",
        testid: "dl-exam-sem1",
      },
      {
        title: "Teaching Timetable",
        subtitle: "Semester I 2025/2026",
        type: "Teaching",
        level: "All Students",
        url: "https://kafu.ac.ke/timetables/",
        testid: "dl-teaching-sem1",
      },
      {
        title: "Examination Processing Schedule",
        subtitle: "Semester I 2025/2026",
        type: "Schedule",
        level: "All Students",
        url: "https://kafu.ac.ke/timetables/",
        testid: "dl-processing-sem1",
      },
    ],
  },
];

const TYPE_COLOURS: Record<string, string> = {
  Examination: "#8B1A1A",
  Teaching: "#1A5C38",
  Schedule: "#C9A227",
};

export default function AdmissionsTimetables() {
  const [activeSem, setActiveSem] = useState("sem2");
  const current = TIMETABLE_SETS.find((s) => s.id === activeSem)!;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={`Timetables ${ACADEMIC_YEAR} — KAFU`}
        description={`Download the latest examination and teaching timetables for Kaimosi Friends University. Semester I and II schedules for the ${ACADEMIC_YEAR} academic year.`}
        path="/admissions/timetables"
        breadcrumbs={[
          { name: "Admissions", path: "/admissions" },
          { name: "Timetables" },
        ]}
      />

      <PageHero
        title="Timetables"
        subtitle={`Download examination and teaching timetables for the ${ACADEMIC_YEAR} academic year`}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Timetables" },
        ]}
      />

      {/* Notice */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Check for Updates Regularly</p>
              <p className="text-amber-700 text-sm">
                Timetables are updated periodically by the Academic Registrar's Office. Always download the latest
                version. For clash reports or corrections, contact your Head of Department.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Semester tabs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex gap-3 mb-8">
            {TIMETABLE_SETS.map((set) => (
              <button
                key={set.id}
                data-testid={`tab-${set.id}`}
                onClick={() => setActiveSem(set.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                  activeSem === set.id
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <Calendar className="w-4 h-4" />
                {set.label}
                {set.active && (
                  <span className="ml-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Current</span>
                )}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold font-serif text-gray-900 mb-6">{current.label}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {current.documents.map((doc) => (
              <a
                key={doc.testid}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={doc.testid}
                className="flex items-start gap-4 bg-white rounded-lg border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-white"
                  style={{ backgroundColor: TYPE_COLOURS[doc.type] ?? "#1A5C38" }}
                >
                  {doc.type === "Teaching" ? <BookOpen className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{doc.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{doc.subtitle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: TYPE_COLOURS[doc.type] ?? "#1A5C38" }}
                    >
                      {doc.type}
                    </span>
                    <span className="text-xs text-gray-500">{doc.level}</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-6">
            All timetable documents are hosted on the official KAFU website. Clicking any document will take you to the
            kafu.ac.ke timetables page where the latest versions are available for download.
          </p>
        </div>
      </section>

      {/* Exam processing schedule */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Examination Processing Schedule</h2>
          <p className="text-gray-600 mb-6">
            The Examination Processing Schedule sets out key milestones and deadlines managed by the Academic
            Registrar for each semester's examination cycle.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Exam Registration Opens", detail: "Week 8 of semester" },
              { label: "Exam Registration Closes", detail: "Week 10 of semester" },
              { label: "Provisional Timetable Published", detail: "Week 11 of semester" },
              { label: "Clash/Error Reporting Deadline", detail: "48 hours after provisional release" },
              { label: "Final Timetable Published", detail: "Week 12 of semester" },
              { label: "Examinations Begin", detail: "Week 14 of semester" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-bold text-xl mb-1">Registrar's Office</p>
            <p className="text-white/80 text-sm">For timetable queries, contact the Academic Registrar.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://kafu.ac.ke/timetables/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-kafu-timetables"
              className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              <Download className="w-4 h-4" /> Download from kafu.ac.ke
            </a>
            <Link href="/admissions" data-testid="btn-admissions">
              <span className="inline-flex items-center gap-2 border border-white text-white px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/10 transition-colors">
                Admissions Overview
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
