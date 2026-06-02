import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { MessageSquare, CheckCircle, Phone, Mail, FileText, Users, Clock, ChevronRight, AlertCircle } from "lucide-react";

const FALLBACK_PROCESS_STEPS = [
  {
    step: "01",
    title: "Submit Your Complaint",
    description: "Submit your complaint in writing using the KAFU Public Complaints Form, available at the Main Reception, Student Affairs Office, or by email to complaints@kafu.ac.ke.",
  },
  {
    step: "02",
    title: "Acknowledgement",
    description: "You will receive written acknowledgement of your complaint within 3 working days of receipt, including a reference number for tracking.",
  },
  {
    step: "03",
    title: "Investigation & Review",
    description: "The Chair, Resolutions and Public Complaints, will review the complaint, gather evidence, and consult relevant departments as necessary. You may be invited for a meeting.",
  },
  {
    step: "04",
    title: "Resolution",
    description: "A formal written response will be communicated within 21 working days of the complaint submission date, outlining the findings and any actions taken.",
  },
  {
    step: "05",
    title: "Appeal",
    description: "If you are not satisfied with the resolution, you may submit an appeal to the Vice-Chancellor's Office within 14 days of receiving the resolution letter.",
  },
];

const FALLBACK_COMPLAINT_CATEGORIES = [
  { label: "Academic Services", description: "Grading disputes, course delivery concerns, examination irregularities" },
  { label: "Administrative Services", description: "Registration delays, certificate issuance, fee statements" },
  { label: "Student Support Services", description: "Accommodation, health services, counselling, welfare" },
  { label: "Staff Conduct", description: "Professional conduct issues involving academic or administrative staff" },
  { label: "ICT & Digital Services", description: "Portal access, email, e-learning platform problems" },
  { label: "Facilities & Infrastructure", description: "Maintenance issues, safety concerns, equipment" },
  { label: "General Institutional Matters", description: "Any other matter not covered above" },
];

const FALLBACK_RIGHTS = [
  "Be treated with courtesy, dignity, and respect throughout the process",
  "Receive a fair and impartial investigation of your complaint",
  "Be kept informed of the progress of your complaint",
  "Submit additional evidence or information at any stage",
  "Appeal against a decision you believe is unjust",
  "Have your identity protected where disclosure would be harmful",
];

export default function AboutComplaints() {
  const [open, setOpen] = useState<number | null>(null);

  const { data: pageData } = useQuery({
    queryKey: ["page", "about-complaints"],
    queryFn: () => fetch("/api/pages/about-complaints").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const PROCESS_STEPS = (sd.process_steps as typeof FALLBACK_PROCESS_STEPS) ?? FALLBACK_PROCESS_STEPS;
  const COMPLAINT_CATEGORIES = (sd.complaint_categories as typeof FALLBACK_COMPLAINT_CATEGORIES) ?? FALLBACK_COMPLAINT_CATEGORIES;
  const RIGHTS = (sd.rights as string[]) ?? FALLBACK_RIGHTS;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Complaints and Resolution — About | KAFU"
        description="KAFU is committed to transparency and accountability. Learn how to submit a public complaint, understand the resolution process, and contact the Chair of Resolutions and Public Complaints."
        path="/about/complaints"
        breadcrumbs={[
          { name: "About", path: "/about" },
          { name: "Complaints and Resolution" },
        ]}
      />

      <PageHero
        title="Complaints and Resolution"
        subtitle="A robust feedback mechanism for achieving excellence — KAFU's commitment to transparency and service improvement"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Complaints and Resolution" },
        ]}
      />

      {/* Chair message */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Message from the Chair</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A robust feedback mechanism is essential for achieving excellence. At the heart of our
                commitment to transparency and service improvement is the effective handling of public
                complaints and compliments.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kaimosi Friends University takes every complaint seriously as an opportunity to improve
                our services, processes, and institutional culture. Our complaints handling process is
                designed to be fair, transparent, and responsive — ensuring that all members of the
                university community and the general public have a clear and accessible channel through
                which to raise concerns.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We encourage you to submit your complaint using the channels provided. Every complaint
                is assigned a tracking reference and investigated with objectivity and confidentiality.
                We are committed to providing timely, reasoned responses.
              </p>
            </div>
            <div className="bg-primary text-white rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <p className="font-bold text-lg mb-1">Dr. Remmy Shiundu</p>
              <p className="text-white/80 text-sm mb-3">Chair, Resolutions & Public Complaints</p>
              <p className="text-white/70 text-xs leading-relaxed mb-4">Kaimosi Friends University</p>
              <div className="border-t border-white/20 pt-4 space-y-2">
                <a href="mailto:complaints@kafu.ac.ke" data-testid="link-complaints-email" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4" /> complaints@kafu.ac.ke
                </a>
                <a href="tel:+254777373633" data-testid="link-complaints-phone" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4" /> +254 777 373 633
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Types of Complaints We Handle</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMPLAINT_CATEGORIES.map((c) => (
              <div key={c.label} className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 p-4">
                <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{c.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resolution process */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">The Resolution Process</h2>
          <p className="text-gray-600 mb-8">Follow these steps when submitting a complaint to KAFU.</p>
          <div className="space-y-5">
            {PROCESS_STEPS.map((s) => (
              <div key={s.step} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {s.step}
                </div>
                <div className="flex-1 pb-5 border-b border-gray-100 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your rights */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Your Rights as a Complainant</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {RIGHTS.map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Frivolous or Vexatious Complaints</p>
              <p className="text-amber-700 text-sm">
                KAFU reserves the right to decline to investigate complaints that are found to be frivolous,
                vexatious, or made in bad faith. Complainants found to have submitted false information may
                face disciplinary action.
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
              <p className="font-bold text-xl mb-1">Submit a Complaint</p>
              <p className="text-white/80 text-sm">Office hours: Monday–Friday, 8 am – 5 pm</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:complaints@kafu.ac.ke" data-testid="btn-submit-complaint" className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/90 transition-colors">
                <Mail className="w-4 h-4" /> complaints@kafu.ac.ke
              </a>
              <Link href="/contact" data-testid="btn-contact">
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
