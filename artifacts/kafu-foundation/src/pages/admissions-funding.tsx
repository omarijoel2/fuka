import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { ExternalLink, ChevronRight, DollarSign, FileText, HelpCircle, CheckCircle, AlertCircle, Phone, Mail } from "lucide-react";

const FALLBACK_STEPS = [
  {
    number: "01",
    title: "Receive Admission Letter",
    description: "Upon admission, KAFU issues you an official admission letter containing your student number and programme details.",
  },
  {
    number: "02",
    title: "Register on the HEF Portal",
    description: "Visit the Higher Education Financing (HEF) portal at hef.go.ke or jiunge.helb.co.ke and create an account using your national ID and admission details.",
  },
  {
    number: "03",
    title: "Select Your Funding Category",
    description: "Choose between Scholarship, Loan, or a combination under the Variable Scholarship and Loan Funding Model based on your assessed level of need.",
  },
  {
    number: "04",
    title: "Submit Supporting Documents",
    description: "Upload required documents including National ID, KCSE certificate, household income assessment documents, and your KAFU admission letter.",
  },
  {
    number: "05",
    title: "Await Assessment & Approval",
    description: "HELB will assess your socio-economic status and notify you of your scholarship percentage and loan amount within the processing period.",
  },
  {
    number: "06",
    title: "Funds Disbursed to University",
    description: "Approved scholarship funds are disbursed directly to KAFU. Upkeep loan amounts are sent to your registered M-Pesa or bank account each semester.",
  },
];

const FALLBACK_FUNDING_TYPES = [
  {
    type: "Scholarship",
    colour: "#1A5C38",
    description: "A non-repayable award that covers a portion or all of your tuition fees based on financial need. The scholarship percentage is determined after assessment.",
    eligibility: "All admitted Kenyan students with demonstrated financial need.",
  },
  {
    type: "Upkeep Loan",
    colour: "#C9A227",
    description: "A repayable loan to cover living and study expenses disbursed directly to students each semester. Repayment begins 12 months after completing your programme.",
    eligibility: "Students who apply through the HEF portal and meet loan criteria.",
  },
  {
    type: "HELB Student Loan",
    colour: "#1B3A6B",
    description: "The Higher Education Loans Board provides supplementary loans for students not fully covered under the HEF model. Apply via the HELB portal.",
    eligibility: "Kenyan students at recognised universities. Income-tested.",
  },
];

const FALLBACK_DOCUMENTS = [
  "National Identity Card (or Birth Certificate for those under 18)",
  "KAFU Admission Letter",
  "KCSE Certificate or Result Slip",
  "Parent/Guardian National ID cards",
  "Household income assessment documents (pay slips, tax returns, or affidavit)",
  "Bank account details or M-Pesa number for upkeep disbursement",
  "Secondary school leaving certificate",
];

export default function AdmissionsFunding() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "admissions-funding"],
    queryFn: () => fetch("/api/pages/admissions-funding").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const STEPS = (sd.steps as typeof FALLBACK_STEPS) ?? FALLBACK_STEPS;
  const FUNDING_TYPES = (sd.funding_types as typeof FALLBACK_FUNDING_TYPES) ?? FALLBACK_FUNDING_TYPES;
  const DOCUMENTS = (sd.documents as string[]) ?? FALLBACK_DOCUMENTS;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Access to Funding — Admissions | KAFU"
        description="Learn how to access Higher Education Financing (HEF), scholarships, and upkeep loans as a KAFU student. Step-by-step guide to the HEF portal registration and document requirements."
        path="/admissions/funding"
        breadcrumbs={[
          { name: "Admissions", path: "/admissions" },
          { name: "Access to Funding" },
        ]}
      />

      <PageHero
        title="Access to Funding"
        subtitle="Variable Scholarship and Loan Funding Model — supporting every admitted student to finance their university education"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Access to Funding" },
        ]}
      />

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex gap-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary mb-1">Congratulations on your admission to KAFU!</p>
                <p className="text-gray-700 text-sm">
                  Kaimosi Friends University is pleased to inform all newly admitted students that there is provision for a
                  Variable Scholarship and Loan Funding Model to finance your university education based on your assessed
                  level of need. All admitted Kenyan students are encouraged to apply through the Higher Education Financing
                  (HEF) portal.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The Higher Education Financing (HEF) model, administered by the Higher Education Loans Board (HELB), is the
            primary mechanism through which the Government of Kenya funds university students. It combines scholarship
            awards (non-repayable) and upkeep loans (repayable) based on a means-tested assessment.
          </p>
          <p className="text-gray-700 leading-relaxed">
            KAFU works closely with HELB to ensure students receive their funding in a timely manner. The university's
            Finance Office provides guidance to students throughout the application process.
          </p>
        </div>
      </section>

      {/* Funding types */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-8">Types of Funding Available</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FUNDING_TYPES.map((f) => (
              <div key={f.type} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: f.colour }}>
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{f.type}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.description}</p>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Eligibility</p>
                  <p className="text-sm text-gray-700">{f.eligibility}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-step guide */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">Step-by-Step Guide to the HEF Portal</h2>
          <p className="text-gray-600 mb-8">Follow these steps to register and apply for funding through the Higher Education Financing portal.</p>
          <div className="space-y-6">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                <div className="flex-1 pb-6 border-b border-gray-100 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Required Documents</h2>
          <p className="text-gray-600 mb-6">Prepare and scan the following documents before starting your HEF portal application.</p>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {DOCUMENTS.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important notice */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">Important Notice</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Apply as early as possible. HEF funding is processed on a first-come, first-served basis. Delays in
                  application may affect your registration and course commencement. Students who miss the HEF deadline
                  may still apply for a HELB supplementary loan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* External links & contact */}
      <section className="py-12 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif mb-6">Apply for Funding</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <a
              href="https://hef.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-hef-portal"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-5 py-4 transition-colors"
            >
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">HEF Portal</p>
                <p className="text-sm text-white/70">hef.go.ke</p>
              </div>
            </a>
            <a
              href="https://jiunge.helb.co.ke"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-helb-portal"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-5 py-4 transition-colors"
            >
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">HELB Jiunge Portal</p>
                <p className="text-sm text-white/70">jiunge.helb.co.ke</p>
              </div>
            </a>
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="font-semibold mb-4">Finance Office — KAFU</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:finance@kafu.ac.ke" data-testid="link-finance-email" className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
                <Mail className="w-4 h-4" /> finance@kafu.ac.ke
              </a>
              <a href="tel:+254777373633" data-testid="link-finance-phone" className="flex items-center gap-2 text-white/80 hover:text-white text-sm">
                <Phone className="w-4 h-4" /> +254 777 373 633
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4">
          <Link href="/admissions/apply" data-testid="btn-apply-now">
            <span className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded font-semibold text-sm hover:bg-primary/90 transition-colors">
              Apply for Admission <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
          <Link href="/admissions/fees" data-testid="btn-fees">
            <span className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded font-semibold text-sm hover:bg-primary/5 transition-colors">
              View Fee Structure
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
