import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Scale, FileText, Shield, CheckCircle, Mail, Phone, ChevronRight, Users } from "lucide-react";

const FALLBACK_FUNCTIONS = [
  "Providing legal advice and opinions to the Vice-Chancellor, University Management, and Governing Council",
  "Drafting, reviewing, and interpreting contracts, agreements, and Memoranda of Understanding (MoUs)",
  "Representing the university in legal proceedings and liaising with external counsel",
  "Ensuring institutional compliance with the Universities Act, KAFU Charter, KAFU Statutes, and applicable Kenyan law",
  "Managing intellectual property matters including patents, trademarks, and copyright",
  "Advising on data protection obligations under the Kenya Data Protection Act",
  "Supporting the development and review of university policies and regulations",
  "Handling land and property legal matters including title deeds, leases, and conveyancing",
  "Overseeing the management and custody of university legal documents and instruments",
];

const FALLBACK_LEGAL_AREAS = [
  {
    title: "Contract Management",
    colour: "#1A5C38",
    description: "Drafting, reviewing, and managing all contractual agreements entered into by the university including procurement contracts, partnership agreements, and employment contracts.",
  },
  {
    title: "Compliance & Regulatory",
    colour: "#C9A227",
    description: "Ensuring the university's operations comply with the Universities Act, KAFU Charter, KAFU Statutes, Commission for University Education (CUE) regulations, and all applicable laws.",
  },
  {
    title: "Dispute Resolution & Litigation",
    colour: "#8B1A1A",
    description: "Managing legal disputes involving the university, coordinating with external advocates, and representing the university's interests in arbitration, mediation, and court proceedings.",
  },
  {
    title: "Intellectual Property",
    colour: "#1B3A6B",
    description: "Protecting the university's intellectual property assets including research outputs, innovations, brand marks, and publications in collaboration with the Research Directorate.",
  },
];

const FALLBACK_LEGAL_BASIS = [
  { title: "Universities Act, 2012", description: "The primary legislation governing universities in Kenya. KAFU operates within this legal framework." },
  { title: "KAFU Charter", description: "Granted by the Cabinet Secretary for Education, the Charter establishes KAFU as a chartered university and confers its legal personality." },
  { title: "KAFU Statutes", description: "Statutes authorised by the Charter that govern the internal operations, governance structures, and disciplinary procedures of the university." },
  { title: "Kenya Data Protection Act, 2019", description: "Governs the collection, use, and storage of personal data by the university." },
];

export default function AboutLegal() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "about-legal"],
    queryFn: () => fetch("/api/pages/about-legal").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const FUNCTIONS = (sd.functions as string[]) ?? FALLBACK_FUNCTIONS;
  const LEGAL_AREAS = (sd.legal_areas as typeof FALLBACK_LEGAL_AREAS) ?? FALLBACK_LEGAL_AREAS;
  const LEGAL_BASIS = (sd.legal_basis as typeof FALLBACK_LEGAL_BASIS) ?? FALLBACK_LEGAL_BASIS;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Legal Office — About | KAFU"
        description="The Legal Office of Kaimosi Friends University provides legal advice, contract management, compliance oversight, and litigation support. Rooted in the KAFU Statutes and Charter."
        path="/about/legal"
        breadcrumbs={[
          { name: "About", path: "/about" },
          { name: "Legal Office" },
        ]}
      />

      <PageHero
        title="Legal Office"
        subtitle="Providing legal guidance, compliance oversight, and institutional protection for Kaimosi Friends University"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Legal Office" },
        ]}
      />

      {/* Message */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Message from the Legal Office</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Legal Office of Kaimosi Friends University (KAFU) is established as a vital organ of the
                institution, with its authority rooted in the KAFU Statutes, which are in turn authorised by
                the KAFU Charter. This legal foundation mandates the Office to provide comprehensive legal
                services that protect the interests of the university and ensure compliance with all applicable
                laws and regulations.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Office serves as the primary legal advisor to the Vice-Chancellor, University Management
                Board, and the University Council. We are committed to providing timely, accurate, and practical
                legal guidance that supports the university's strategic objectives while managing institutional
                legal risk.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We work closely with all university departments, the Research Directorate, the Finance Office,
                and external partners to ensure that all legal obligations are met and that the university's
                interests are protected in all its dealings.
              </p>
            </div>
            <div className="bg-primary text-white rounded-xl p-6">
              <img
                src="/imgs/legal-officer-kethi.jpg"
                alt="Harriet Kethi, Legal Officer"
                className="w-20 h-20 rounded-full object-cover object-top mb-4 border-2 border-white/30"
              />
              <p className="font-bold text-lg mb-1">Harriet Kethi</p>
              <p className="text-white/80 text-sm mb-3">Legal Officer</p>
              <p className="text-white/70 text-xs leading-relaxed mb-4">
                Legal Office, Kaimosi Friends University
              </p>
              <div className="border-t border-white/20 pt-4 space-y-2">
                <a href="mailto:legal@kafu.ac.ke" data-testid="link-legal-email" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4" /> legal@kafu.ac.ke
                </a>
                <a href="tel:+254777373633" data-testid="link-legal-phone" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4" /> +254 777 373 633
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Areas */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Areas of Legal Practice</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {LEGAL_AREAS.map((area) => (
              <div key={area.title} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: area.colour }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: area.colour }}>
                      <Scale className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900">{area.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Functions */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Functions of the Legal Office</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {FUNCTIONS.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg border border-gray-100 px-4 py-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal basis */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Legal Framework</h2>
          <p className="text-gray-600 mb-6">The Legal Office operates within the following key legislative and institutional instruments.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {LEGAL_BASIS.map((b) => (
              <div key={b.title} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-sm">{b.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-bold text-xl mb-1">Legal Office — KAFU</p>
            <p className="text-white/80 text-sm mb-3">For all legal enquiries and requests</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:legal@kafu.ac.ke" data-testid="link-legal-contact-email" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4" /> legal@kafu.ac.ke
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/about" data-testid="btn-about">
              <span className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/90 transition-colors">
                About KAFU
              </span>
            </Link>
            <Link href="/about/policies" data-testid="btn-policies">
              <span className="inline-flex items-center gap-2 border border-white text-white px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/10 transition-colors">
                Policies & Regulations <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
