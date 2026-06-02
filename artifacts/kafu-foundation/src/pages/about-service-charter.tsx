import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, Phone, Mail, ArrowLeft, Download } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

const FALLBACK_STANDARDS = [
  {
    category: "Admissions & Registration",
    colour: "#1A5C38",
    services: [
      { service: "Online application acknowledgement", standard: "Within 1 working day", remarks: "Automated confirmation email sent" },
      { service: "Application review & offer letter", standard: "5–10 working days", remarks: "After receipt of complete documents" },
      { service: "Student ID card issuance", standard: "2 working days", remarks: "After fee payment confirmation" },
      { service: "Course registration", standard: "Same day", remarks: "Via student portal" },
    ],
  },
  {
    category: "Academic Records",
    colour: "#C9A227",
    services: [
      { service: "Academic transcripts (unofficial)", standard: "3 working days", remarks: "" },
      { service: "Academic transcripts (official)", standard: "5 working days", remarks: "Certified and sealed" },
      { service: "Degree certificate issuance", standard: "30 calendar days", remarks: "After graduation ceremony" },
      { service: "Letter of completion / recommendation", standard: "3 working days", remarks: "" },
      { service: "HELB certification", standard: "2 working days", remarks: "After exam results confirmed" },
    ],
  },
  {
    category: "Finance & Fees",
    colour: "#1B3A6B",
    services: [
      { service: "Fee statement generation", standard: "Immediate", remarks: "Via student portal" },
      { service: "Payment receipt confirmation", standard: "1 working day", remarks: "After bank confirmation" },
      { service: "Bursary / scholarship processing", standard: "10 working days", remarks: "After application submission" },
      { service: "Fee structure enquiries", standard: "Same day", remarks: "Walk-in or phone" },
    ],
  },
  {
    category: "Library Services",
    colour: "#2D6A4F",
    services: [
      { service: "Book borrowing", standard: "Immediate", remarks: "On presentation of valid student ID" },
      { service: "E-resource access", standard: "Immediate", remarks: "Via library portal (24/7)" },
      { service: "Interlibrary loan request", standard: "5–7 working days", remarks: "" },
      { service: "Research assistance", standard: "Same day", remarks: "During library hours" },
    ],
  },
  {
    category: "ICT Support",
    colour: "#8B1A1A",
    services: [
      { service: "Email account activation", standard: "1 working day", remarks: "After registration confirmation" },
      { service: "Password reset", standard: "30 minutes", remarks: "Via helpdesk or self-service" },
      { service: "Network / WiFi fault reporting", standard: "4 working hours", remarks: "" },
      { service: "System access requests", standard: "2 working days", remarks: "Requires line manager approval" },
    ],
  },
  {
    category: "Student Affairs",
    colour: "#3A5A8C",
    services: [
      { service: "Disciplinary complaint acknowledgement", standard: "3 working days", remarks: "" },
      { service: "Counselling appointment", standard: "2 working days", remarks: "Or immediate for crisis situations" },
      { service: "Club / association registration", standard: "5 working days", remarks: "" },
      { service: "Accommodation allocation", standard: "5 working days", remarks: "Subject to availability" },
    ],
  },
];

export default function ServiceCharter() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "about-service-charter"],
    queryFn: () => fetch("/api/pages/about-service-charter").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const STANDARDS = (sd.standards as typeof FALLBACK_STANDARDS) ?? FALLBACK_STANDARDS;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Service Charter — KAFU"
        description="KAFU's Service Charter sets out the service standards and commitments we make to students, staff, and the public across all university departments."
        path="/about/service-charter"
      />

      {/* Hero */}
      <PageHero
        eyebrow="Governance"
        title="Service Charter"
        subtitle="Our commitment to service excellence — the standards students, staff, and the public can expect from every department of Kaimosi Friends University."
        photo="/images/uploads/campus-main.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Service Charter" },
        ]}
      >
        <Button className="bg-[#C9A227] text-[#1A5C38] hover:bg-[#b8911f] font-semibold" asChild data-testid="button-download-charter">
          <a href="/documents/kafu-service-charter.pdf" target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4 mr-2" /> Download Service Charter (PDF)
          </a>
        </Button>
      </PageHero>

      {/* Our Commitment */}
      <section className="py-12 bg-secondary/30 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">Our Commitment to You</h2>
            <p className="text-muted-foreground">
              KAFU is committed to providing timely, responsive, and professional services. This charter sets measurable standards
              that our departments are held accountable to. If we fall short, you have the right to raise a concern.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { icon: Clock, title: "Timeliness", desc: "Clear response timeframes for every service, measured and reported quarterly." },
              { icon: CheckCircle, title: "Professionalism", desc: "Courteous, knowledgeable, and respectful service from all KAFU staff." },
              { icon: AlertCircle, title: "Accountability", desc: "Complaints are investigated and resolved. Escalation paths are clear and accessible." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Standards Table */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">Service Standards by Department</h2>
          <div className="space-y-8 max-w-5xl mx-auto">
            {STANDARDS.map(cat => (
              <div key={cat.category} className="rounded-2xl border bg-card overflow-hidden" data-testid={`service-cat-${cat.category.replace(/\s/g, "-").toLowerCase()}`}>
                <div className="h-1.5" style={{ backgroundColor: cat.colour }} />
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold mb-4" style={{ color: cat.colour }}>{cat.category}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 font-semibold text-muted-foreground pr-4">Service</th>
                          <th className="pb-2 font-semibold text-muted-foreground pr-4 whitespace-nowrap">Standard</th>
                          <th className="pb-2 font-semibold text-muted-foreground hidden sm:table-cell">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {cat.services.map((s, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 pr-4 text-foreground">{s.service}</td>
                            <td className="py-3 pr-4 font-semibold text-primary whitespace-nowrap">{s.standard}</td>
                            <td className="py-3 text-muted-foreground hidden sm:table-cell">{s.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to raise a concern */}
      <section className="py-16 bg-secondary/30 border-t">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-primary text-center mb-8">How to Raise a Concern</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { step: "1", title: "Contact the Department", desc: "First raise your concern directly with the relevant department or office." },
              { step: "2", title: "Escalate to Head of Department", desc: "If unresolved within 5 working days, escalate to the Head of Department." },
              { step: "3", title: "Write to the Registrar", desc: "For unresolved matters, write formally to the Academic or Administrative Registrar." },
              { step: "4", title: "Complaints & Ethics Office", desc: "For serious grievances or whistleblowing, contact the Complaints & Ethics Office." },
            ].map(s => (
              <div key={s.step} className="flex gap-4 p-5 rounded-xl bg-card border">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">{s.step}</div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-5 rounded-xl bg-card border flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-muted-foreground">For urgent matters or if you are unsatisfied with the process:</p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+254777373633" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                <Phone className="w-4 h-4" /> +254 777 373 633
              </a>
              <a href="mailto:registrar@kafu.ac.ke" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                <Mail className="w-4 h-4" /> registrar@kafu.ac.ke
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
