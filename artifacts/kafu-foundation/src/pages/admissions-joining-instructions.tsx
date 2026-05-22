import React, { useState } from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { ChevronRight, CheckCircle, ExternalLink, FileText, Monitor, User, CreditCard, BookOpen, AlertCircle } from "lucide-react";

const PHASES = [
  {
    id: "phase1",
    title: "Phase 1: Online Document Access (Pre-Reporting)",
    subtitle: "Complete before arriving on campus",
    colour: "#1A5C38",
    steps: [
      {
        number: 1,
        title: "Access the Admission Portal or Kafu.Jiunge.com",
        description: "Navigate to the KAFU Admission Portal at portal.kafu.ac.ke or visit kafu.jiunge.com. Log in using the credentials provided in your admission letter.",
        icon: <Monitor className="w-5 h-5" />,
      },
      {
        number: 2,
        title: "Download Your Admission Letter",
        description: "Locate and download your official KAFU Admission Letter from the portal. Print three copies — one for your records, one for the Finance Office, and one for the Registrar.",
        icon: <FileText className="w-5 h-5" />,
      },
      {
        number: 3,
        title: "Review Your Programme Details",
        description: "Carefully review your programme of study, school, intake date, and student number as stated in your admission letter. Contact the Admissions Office immediately if there are any discrepancies.",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        number: 4,
        title: "Apply for HEF Funding",
        description: "If you have not yet applied for Higher Education Financing (HEF), do so immediately at hef.go.ke. Government-sponsored students must apply before reporting to ensure timely fee processing.",
        icon: <CreditCard className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "phase2",
    title: "Phase 2: Reporting to Campus",
    subtitle: "On your arrival day",
    colour: "#C9A227",
    steps: [
      {
        number: 5,
        title: "Proceed to the Finance Office",
        description: "On arrival at campus, go directly to the Finance Office with your admission letter and proof of fee payment or HEF approval. Pay the required minimum deposit to activate your registration.",
        icon: <CreditCard className="w-5 h-5" />,
      },
      {
        number: 6,
        title: "Collect Medical Forms",
        description: "Obtain medical examination forms from the Student Affairs Office. All new students are required to complete a medical examination at the KAFU Health Centre or a government hospital.",
        icon: <User className="w-5 h-5" />,
      },
      {
        number: 7,
        title: "Visit the Registrar's Office",
        description: "Submit your original certificates and academic documents for verification. The Registrar's Office will verify your entry qualifications against the documents submitted during application.",
        icon: <FileText className="w-5 h-5" />,
      },
      {
        number: 8,
        title: "Register for Accommodation (if applicable)",
        description: "Students seeking university accommodation should register at the Student Affairs Office. Allocation is subject to availability and is processed on a first-come, first-served basis.",
        icon: <User className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "phase3",
    title: "Phase 3: Course Registration & Orientation",
    subtitle: "During the first week of semester",
    colour: "#1B3A6B",
    steps: [
      {
        number: 9,
        title: "Course Registration via Student Portal",
        description: "Log in to the KAFU Student Portal and register for your courses for Semester I. Ensure you register for all units in your programme as per the curriculum. Seek guidance from your Head of Department if needed.",
        icon: <Monitor className="w-5 h-5" />,
      },
      {
        number: 10,
        title: "Obtain Student ID Card",
        description: "Proceed to the ICT Department with your registration confirmation slip and one passport-sized photograph to obtain your KAFU Student ID card.",
        icon: <User className="w-5 h-5" />,
      },
      {
        number: 11,
        title: "Attend Orientation Programme",
        description: "All first-year students must attend the mandatory orientation programme organised by the Dean of Students Office. The schedule will be communicated during reporting.",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        number: 12,
        title: "Library Registration",
        description: "Visit the KAFU Library with your Student ID card to register for library services, including physical and digital resource access.",
        icon: <BookOpen className="w-5 h-5" />,
      },
    ],
  },
];

const CHECKLIST = [
  "Original academic certificates (KCSE, KCPE, or equivalent)",
  "Original national ID card (or birth certificate)",
  "Four recent passport-sized photographs",
  "Printed admission letter (3 copies)",
  "Proof of HEF application or fee payment receipt",
  "Medical examination forms (completed)",
  "Next-of-kin contact details",
  "Bank account details or M-Pesa number",
];

export default function AdmissionsJoiningInstructions() {
  const [activePhase, setActivePhase] = useState<string>("phase1");
  const current = PHASES.find((p) => p.id === activePhase)!;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Joining Instructions — Admissions | KAFU"
        description="First-year student joining instructions for Kaimosi Friends University. Step-by-step guide to completing the admissions process, reporting to campus, and course registration."
        path="/admissions/joining-instructions"
        breadcrumbs={[
          { name: "Admissions", path: "/admissions" },
          { name: "Joining Instructions" },
        ]}
      />

      <PageHero
        title="First-Year Student Joining Instructions"
        subtitle="A step-by-step guide to completing your admissions process and registering at Kaimosi Friends University"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Joining Instructions" },
        ]}
      />

      {/* Welcome note */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="font-semibold text-primary mb-2">Welcome to Kaimosi Friends University — Class of 2025/2026</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Congratulations on your admission to KAFU. This guide outlines the steps required for all newly admitted
              students to complete the admissions process, report to campus, and formally register. Please read all
              instructions carefully before your reporting date.
            </p>
          </div>
        </div>
      </section>

      {/* Phase tabs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-3 mb-8">
            {PHASES.map((phase) => (
              <button
                key={phase.id}
                data-testid={`tab-${phase.id}`}
                onClick={() => setActivePhase(phase.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activePhase === phase.id
                    ? "text-white border-transparent"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
                style={activePhase === phase.id ? { backgroundColor: phase.colour, borderColor: phase.colour } : {}}
              >
                {phase.title.split(":")[0]}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: current.colour + "10" }}>
              <h2 className="text-xl font-bold font-serif text-gray-900">{current.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{current.subtitle}</p>
            </div>
            <div className="divide-y divide-gray-100">
              {current.steps.map((step) => (
                <div key={step.number} className="flex gap-5 px-6 py-5">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: current.colour }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400">STEP {step.number}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">Reporting Day Checklist</h2>
          <p className="text-gray-600 mb-6">Ensure you have all the following documents when reporting to campus.</p>
          <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-100">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important notice */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">Reporting Deadline</p>
                <p className="text-amber-700 text-sm">
                  Students who fail to report and register by the stipulated deadline may forfeit their admission.
                  If you anticipate any delays, contact the Admissions Office in advance to request an extension.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-bold text-xl mb-1">Need assistance?</p>
            <p className="text-white/80 text-sm">The Admissions Office is available Monday–Friday, 8 am – 5 pm.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:admissions@kafu.ac.ke" data-testid="link-admissions-email" className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/90 transition-colors">
              admissions@kafu.ac.ke
            </a>
            <Link href="/admissions/apply" data-testid="btn-apply-now">
              <span className="inline-flex items-center gap-2 border border-white text-white px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/10 transition-colors">
                Apply Online <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
