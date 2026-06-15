import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { ShieldCheck, CheckCircle, Phone, Mail, FileText, Download, Scale, AlertCircle, ChevronRight, MapPin } from "lucide-react";

const REPORTING_FORM_URL = "/downloads/kafu-bribery-corruption-reporting-form.docx";

const FALLBACK_FRAMEWORKS = [
  "The Ethics and Anti-Corruption Commission legal and regulatory framework",
  "The Anti-Bribery Act, Cap. 79B",
  "The Bribery Regulations, 2022",
  "Guidelines to Assist Public and Private Entities in the Preparation of Procedures for Prevention of Bribery and Corruption, 2022",
  "The Kaimosi Friends University Anti-Bribery and Corruption Procedure Manual",
];

const FALLBACK_COMMITMENTS = [
  "Preventing, detecting, deterring, and responding to acts of bribery and corruption",
  "Promoting ethical leadership and responsible governance",
  "Fostering a culture of honesty, professionalism, and accountability among staff, students, suppliers, contractors, and partners",
  "Protecting whistleblowers and encouraging confidential reporting of unethical conduct",
  "Ensuring compliance with all applicable laws, regulations, policies, and procedures",
  "Enhancing public trust and confidence in the University's governance and service delivery systems",
];

const FALLBACK_COMMITTEE_FUNCTIONS = [
  "Development and implementation of anti-bribery and corruption policies",
  "Conducting integrity awareness and sensitization programmes",
  "Monitoring compliance with anti-corruption laws and regulations",
  "Receiving and facilitating handling of corruption-related complaints and reports",
  "Supporting risk assessment and mitigation measures related to corruption vulnerabilities",
  "Promoting transparency, accountability, and ethical decision-making",
];

const FALLBACK_UNIVERSITY_CHANNELS = [
  "In-person reporting to designated Integrity Assurance Officers",
  "Postal Address: Kaimosi Friends University, P.O. Box 385 - 50309, Kaimosi, Kenya",
  "Suggestion / Reporting Boxes located at strategic points within the University",
  "Digital and Social Media Platforms",
  "Official Website Feedback Channels",
  "Anonymous Whistleblower Reporting Mechanisms",
];

const FALLBACK_EACC_CHANNELS = [
  "Anonymous Whistleblower Reporting System available on the EACC website",
  "Telephone Contacts: 020 2717468, 0715 007700, 0783 777700",
  "Toll-Free Line: 1551",
  "Physical Reporting: visit any EACC office (Headquarters or Regional Offices)",
  "Digital and Social Media Platforms",
  "Email: report@integrity.go.ke",
];

export default function AboutABCC() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "anti-bribery-corruption"],
    queryFn: () => fetch("/api/pages/anti-bribery-corruption").then((r) => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const FRAMEWORKS = (sd.frameworks as string[]) ?? FALLBACK_FRAMEWORKS;
  const COMMITMENTS = (sd.commitments as string[]) ?? FALLBACK_COMMITMENTS;
  const COMMITTEE_FUNCTIONS = (sd.committee_functions as string[]) ?? FALLBACK_COMMITTEE_FUNCTIONS;
  const UNIVERSITY_CHANNELS = (sd.university_channels as string[]) ?? FALLBACK_UNIVERSITY_CHANNELS;
  const EACC_CHANNELS = (sd.eacc_channels as string[]) ?? FALLBACK_EACC_CHANNELS;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Anti-Bribery and Corruption — About | KAFU"
        description="Kaimosi Friends University maintains a zero-tolerance policy towards bribery and corruption. Learn about our commitment, the Anti-Bribery & Corruption Committee, how to report, and download the reporting form."
        path="/about/anti-bribery-corruption"
        breadcrumbs={[
          { name: "About", path: "/about" },
          { name: "Anti-Bribery and Corruption" },
        ]}
      />

      <PageHero
        title="Anti-Bribery and Corruption"
        subtitle="Upholding integrity, accountability, and transparency across all University operations"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Anti-Bribery and Corruption" },
        ]}
      />

      {/* Our commitment */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kaimosi Friends University is committed to upholding the highest standards of integrity,
                accountability, transparency, and ethical conduct in all its operations and engagements.
                The University maintains a zero-tolerance policy towards bribery, corruption, fraud, abuse
                of office, and unethical practices.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The University implements anti-bribery and corruption measures in compliance with the
                following legal and regulatory frameworks:
              </p>
            </div>
            <div className="bg-primary text-white rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="font-bold text-lg mb-1">Zero Tolerance</p>
              <p className="text-white/80 text-sm leading-relaxed">
                Towards bribery, corruption, fraud, abuse of office, and unethical practices.
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {FRAMEWORKS.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
                <Scale className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The University is committed to */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">The University is Committed To</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {COMMITMENTS.map((c, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABCC Committee */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Anti-Bribery &amp; Corruption Committee</h2>
          <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl">
            The Anti-Bribery &amp; Corruption Committee (ABCC) coordinates institutional strategies and
            initiatives aimed at preventing bribery and corruption within the University. The Committee
            promotes integrity awareness, ethical conduct, risk management, compliance monitoring, and
            implementation of corruption prevention measures across all University operations.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Functions of the Committee</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {COMMITTEE_FUNCTIONS.map((fn, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
                <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{fn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report bribery / corruption */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Report Bribery or Corruption</h2>
          <p className="text-gray-700 leading-relaxed mb-8 max-w-3xl">
            Kaimosi Friends University encourages staff, students, stakeholders, and members of the public
            to report any suspected or actual incidents of bribery, corruption, fraud, conflict of interest,
            abuse of office, unethical conduct, or maladministration. All reports are handled with
            confidentiality and professionalism in accordance with applicable laws and University procedures.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* University channels */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">University Reporting Channels</h3>
              <div className="space-y-2 mb-4">
                <a href="mailto:integrity@kafu.ac.ke" data-testid="link-abcc-email" className="flex items-center gap-2 text-primary hover:underline text-sm font-medium">
                  <Mail className="w-4 h-4" /> integrity@kafu.ac.ke
                </a>
                <a href="tel:+254777373633" data-testid="link-abcc-phone" className="flex items-center gap-2 text-primary hover:underline text-sm font-medium">
                  <Phone className="w-4 h-4" /> 0777 373 633
                </a>
                <p className="flex items-start gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" /> P.O. Box 385 - 50309, Kaimosi, Kenya
                </p>
              </div>
              <ul className="space-y-2">
                {UNIVERSITY_CHANNELS.map((ch, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EACC channels */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report to the Ethics and Anti-Corruption Commission (EACC)</h3>
              <div className="space-y-2 mb-4">
                <a href="mailto:report@integrity.go.ke" data-testid="link-eacc-email" className="flex items-center gap-2 text-primary hover:underline text-sm font-medium">
                  <Mail className="w-4 h-4" /> report@integrity.go.ke
                </a>
              </div>
              <ul className="space-y-2">
                {EACC_CHANNELS.map((ch, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download reporting form */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-gray-900 mb-1">Bribery and Corruption Reporting Form</h2>
                <p className="text-gray-600 text-sm max-w-xl">
                  Download, complete, and submit the official KAFU reporting form through any of the
                  University reporting channels above. You may report anonymously.
                </p>
              </div>
            </div>
            <a
              href={REPORTING_FORM_URL}
              download
              data-testid="btn-download-reporting-form"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" /> Download Form
            </a>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Confidentiality &amp; Good Faith</p>
              <p className="text-amber-700 text-sm">
                All reports are treated with the highest level of confidentiality. The University may take
                disciplinary action where a report is proven to be malicious or frivolous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="font-bold text-xl mb-1">Report an Integrity Concern</p>
              <p className="text-white/80 text-sm">Confidential. Professional. In accordance with the law.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:integrity@kafu.ac.ke" data-testid="btn-report-email" className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/90 transition-colors">
                <Mail className="w-4 h-4" /> integrity@kafu.ac.ke
              </a>
              <Link href="/contact" data-testid="btn-abcc-contact">
                <span className="inline-flex items-center gap-2 border border-white text-white px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/10 transition-colors">
                  Contact Us <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
