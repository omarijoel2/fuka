import React from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Shield, FileText, CheckCircle, Users, Mail, Phone, ChevronRight, AlertCircle, ExternalLink } from "lucide-react";

const MANDATE = [
  "Review and approve research proposals involving human participants",
  "Conduct ongoing monitoring of approved research projects",
  "Ensure compliance with national and international ethical standards",
  "Safeguard the dignity, rights, safety, and well-being of research participants",
  "Promote a culture of research integrity across all academic schools",
  "Issue ethical approval certificates for qualifying research projects",
  "Investigate alleged breaches of research ethics",
];

const REVIEW_TYPES = [
  {
    title: "Full Board Review",
    colour: "#8B1A1A",
    description: "Required for research involving more than minimal risk to participants, vulnerable populations, or sensitive data. Reviewed at a full committee meeting.",
    turnaround: "4–6 weeks",
  },
  {
    title: "Expedited Review",
    colour: "#C9A227",
    description: "For research involving minimal risk. Reviewed by the Chair and one or two committee members without a full board meeting.",
    turnaround: "2–3 weeks",
  },
  {
    title: "Exempt Review",
    colour: "#1A5C38",
    description: "For research involving no more than minimal risk and using anonymous data, secondary sources, or publicly available information.",
    turnaround: "1 week",
  },
];

const SUBMISSION_STEPS = [
  { step: "01", title: "Obtain Application Forms", description: "Download the KAFUSERC application forms from the Research Directorate or the KAFU website." },
  { step: "02", title: "Prepare Your Protocol", description: "Complete the research protocol including objectives, methodology, participant recruitment, consent procedures, and data protection plan." },
  { step: "03", title: "Compile Supporting Documents", description: "Include informed consent forms, data collection instruments (questionnaires, interview guides), and any participant-facing materials." },
  { step: "04", title: "Submit to KAFUSERC Secretary", description: "Submit three printed copies plus a digital copy via email to kafuserc@kafu.ac.ke before the submission deadline." },
  { step: "05", title: "Await Review", description: "Your submission will be acknowledged within 3 working days and assigned a review pathway. You may be invited to respond to queries." },
  { step: "06", title: "Receive Ethical Approval Certificate", description: "Upon approval, you will receive an official KAFUSERC Ethical Approval Certificate, which is required before commencing data collection." },
];

const COMMITTEE_MEMBERS = [
  { name: "Dr. Emmanuel Okenwa-Vincent", role: "Chairman, KAFUSERC", affiliation: "School of Health Sciences" },
  { name: "Representative", role: "Secretary", affiliation: "Research Directorate" },
  { name: "Representative", role: "Legal & Compliance Member", affiliation: "Legal Office, KAFU" },
  { name: "Representative", role: "Community Representative", affiliation: "External — Vihiga County" },
];

export default function ResearchEthics() {
  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Scientific & Ethics Review Committee (KAFUSERC) — KAFU"
        description="The Kaimosi Friends University Scientific and Ethics Review Committee (KAFUSERC) reviews, approves, and monitors research proposals involving human participants, ensuring compliance with ethical and scientific standards."
        path="/research/ethics"
        breadcrumbs={[
          { name: "Research", path: "/research" },
          { name: "Ethics Review Committee" },
        ]}
      />

      <PageHero
        title="Scientific & Ethics Review Committee"
        subtitle="KAFUSERC — Safeguarding the dignity, rights, and well-being of all research participants at Kaimosi Friends University"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Research", href: "/research" },
          { label: "Ethics Review Committee" },
        ]}
      />

      {/* About KAFUSERC */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">About KAFUSERC</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Kaimosi Friends University Scientific and Ethics Review Committee (KAFUSERC) is an independent
                institutional body established to review, approve, and continuously monitor research proposals
                involving human participants. KAFUSERC ensures that all research conducted under the auspices of
                KAFU complies with ethical and scientific standards recognised nationally and internationally.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our core mission is to safeguard the dignity, rights, safety, and well-being of research
                participants while promoting a culture of research integrity and excellence across all academic
                schools and research centres at the university.
              </p>
              <p className="text-gray-700 leading-relaxed">
                KAFUSERC operates in accordance with the Kenya National Commission for Science, Technology and
                Innovation (NACOSTI) guidelines, the Helsinki Declaration, and relevant national and international
                ethical frameworks.
              </p>
            </div>
            <div className="bg-primary text-white rounded-xl p-6">
              <img
                src="/imgs/serc-chairman-okenwa.jpg"
                alt="Dr. Emmanuel Okenwa-Vincent, Chairman KAFUSERC"
                className="w-20 h-20 rounded-full object-cover object-top mb-4 border-2 border-white/30"
              />
              <p className="font-bold text-lg mb-1">Dr. Emmanuel Okenwa-Vincent</p>
              <p className="text-white/80 text-sm mb-3">Chairman, KAFUSERC</p>
              <p className="text-white/70 text-xs leading-relaxed">
                School of Health Sciences, Kaimosi Friends University
              </p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <a href="mailto:kafuserc@kafu.ac.ke" data-testid="link-kafuserc-email" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4" /> kafuserc@kafu.ac.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mandate */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Mandate & Functions</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {MANDATE.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review types */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Review Pathways</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEW_TYPES.map((r) => (
              <div key={r.title} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-2" style={{ backgroundColor: r.colour }} />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-3">{r.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{r.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Turnaround</span>
                    <span className="text-sm font-bold" style={{ color: r.colour }}>{r.turnaround}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission process */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">How to Submit a Research Proposal</h2>
          <p className="text-gray-600 mb-8">All research involving human participants must receive KAFUSERC approval before data collection begins.</p>
          <div className="space-y-5">
            {SUBMISSION_STEPS.map((s) => (
              <div key={s.step} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {s.step}
                </div>
                <div className="flex-1 pb-5 border-b border-gray-200 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important note */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">No Data Collection Without Approval</p>
              <p className="text-amber-700 text-sm">
                Commencing data collection before receiving a KAFUSERC Ethical Approval Certificate is a serious
                breach of research ethics and may result in disqualification of the research, academic penalties,
                or referral to disciplinary procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Committee */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Committee Composition</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMMITTEE_MEMBERS.map((m, i) => (
              <div key={`${m.name}-${i}`} className="flex items-start gap-4 bg-white rounded-lg border border-gray-200 p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                  <p className="text-primary text-xs font-medium mt-0.5">{m.role}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{m.affiliation}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            KAFUSERC includes representation from all major schools, external community members, and legal/compliance expertise.
            Full committee membership is available upon request.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-bold text-xl mb-1">KAFUSERC Secretariat</p>
            <p className="text-white/80 text-sm mb-3">Research Directorate, Kaimosi Friends University</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:kafuserc@kafu.ac.ke" data-testid="link-kafuserc-contact-email" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4" /> kafuserc@kafu.ac.ke
              </a>
              <a href="mailto:research@kafu.ac.ke" data-testid="link-research-email" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4" /> research@kafu.ac.ke
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" data-testid="btn-research">
              <span className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/90 transition-colors">
                Research Overview
              </span>
            </Link>
            <Link href="/directorates/research-innovation" data-testid="btn-research-directorate">
              <span className="inline-flex items-center gap-2 border border-white text-white px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/10 transition-colors">
                Research Directorate <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
