import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Lock, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface Policy {
  slug: string;
  title: string;
  category: string;
  version: string;
  pages: number;
  approved: string;
  review_date: string;
  description: string;
  file_url?: string;
  staff_only?: boolean;
}

const FALLBACK_POLICIES: Policy[] = [
  {
    slug: "academic-policy",
    title: "Academic Policy",
    category: "Academic",
    version: "v3.0 (2023)",
    pages: 45,
    approved: "University Council, June 2023",
    review_date: "June 2026",
    description: "Governs all academic programmes, assessments, academic integrity, examination regulations, and student progression criteria at Kaimosi Friends University.",
    staff_only: false,
  },
  {
    slug: "student-code-of-conduct",
    title: "Student Code of Conduct",
    category: "Student Affairs",
    version: "v2.1 (2023)",
    pages: 28,
    approved: "University Council, March 2023",
    review_date: "March 2026",
    description: "Sets out the standards of behaviour, rights, and responsibilities for all registered KAFU students on campus and during university-affiliated activities.",
    staff_only: false,
  },
  {
    slug: "research-policy",
    title: "Research & Innovation Policy",
    category: "Research",
    version: "v2.0 (2022)",
    pages: 38,
    approved: "Senate, November 2022",
    review_date: "November 2025",
    description: "Framework for the conduct, governance, and ethics of research activities at KAFU including intellectual property rights, data management, and research commercialisation.",
    staff_only: false,
  },
  {
    slug: "staff-code-of-ethics",
    title: "Staff Code of Ethics & Conduct",
    category: "Human Resources",
    version: "v2.2 (2023)",
    pages: 20,
    approved: "University Council, January 2023",
    review_date: "January 2026",
    description: "Defines the ethical standards, professional obligations, and conduct expectations for all KAFU staff members in the performance of their duties.",
    staff_only: true,
  },
  {
    slug: "hr-policies-manual",
    title: "Human Resources Policies Manual",
    category: "Human Resources",
    version: "v4.0 (2024)",
    pages: 88,
    approved: "University Council, March 2024",
    review_date: "March 2027",
    description: "Comprehensive HR manual covering staff recruitment, contracts, leave entitlements, disciplinary procedures, performance management, and staff welfare at KAFU.",
    staff_only: true,
  },
  {
    slug: "ict-security-policy",
    title: "ICT Security Policy",
    category: "ICT",
    version: "v1.2 (2024)",
    pages: 32,
    approved: "Management, February 2024",
    review_date: "February 2026",
    description: "Governs the acceptable use, security, and management of all ICT resources, systems, and data at Kaimosi Friends University.",
    staff_only: false,
  },
  {
    slug: "anti-sexual-harassment-policy",
    title: "Anti-Sexual Harassment Policy",
    category: "Student Affairs",
    version: "v1.1 (2021)",
    pages: 15,
    approved: "University Council, July 2021",
    review_date: "July 2024",
    description: "Sets out KAFU's zero-tolerance stance on sexual harassment and the procedures for reporting, investigating, and resolving complaints.",
    staff_only: false,
  },
  {
    slug: "procurement-policy",
    title: "Procurement Policy",
    category: "Finance & Procurement",
    version: "v2.0 (2023)",
    pages: 42,
    approved: "University Council, April 2023",
    review_date: "April 2026",
    description: "Governs the procurement of goods, works, and services at KAFU in compliance with the Public Procurement and Asset Disposal Act (PPADA) 2015.",
    staff_only: false,
  },
  {
    slug: "finance-accounts-policy",
    title: "Finance & Accounts Policy",
    category: "Finance & Procurement",
    version: "v3.1 (2022)",
    pages: 56,
    approved: "University Council, August 2022",
    review_date: "August 2025",
    description: "Comprehensive financial management policy covering budgeting, revenue collection, expenditure control, asset management, and financial reporting.",
    staff_only: true,
  },
  {
    slug: "library-information-policy",
    title: "Library & Information Services Policy",
    category: "Academic",
    version: "v1.3 (2023)",
    pages: 24,
    approved: "Senate, September 2023",
    review_date: "September 2026",
    description: "Governs the provision, access, and management of library resources and information services for the KAFU academic community.",
    staff_only: false,
  },
  {
    slug: "environmental-management-policy",
    title: "Environmental Management Policy",
    category: "Facilities",
    version: "v1.1 (2022)",
    pages: 18,
    approved: "Management, May 2022",
    review_date: "May 2025",
    description: "KAFU's commitment to environmental stewardship — covering waste management, energy conservation, and sustainable campus development.",
    staff_only: false,
  },
  {
    slug: "gender-mainstreaming-policy",
    title: "Gender Mainstreaming Policy",
    category: "Student Affairs",
    version: "v1.0 (2021)",
    pages: 22,
    approved: "University Council, October 2021",
    review_date: "October 2024",
    description: "Guides the university's commitment to gender equity, equal opportunity, and the mainstreaming of gender perspectives in all university operations.",
    staff_only: false,
  },
  {
    slug: "disability-policy",
    title: "Disability Mainstreaming Policy",
    category: "Student Affairs",
    version: "v1.0 (2022)",
    pages: 16,
    approved: "University Council, March 2022",
    review_date: "March 2025",
    description: "Establishes KAFU's obligations and commitments to students, staff, and visitors with disabilities — ensuring full access, reasonable accommodation, and non-discrimination.",
    staff_only: false,
  },
  {
    slug: "salary-scales",
    title: "Staff Salary Scales & Grading Structure",
    category: "Human Resources",
    version: "v2.0 (2023)",
    pages: 12,
    approved: "University Council, June 2023",
    review_date: "June 2026",
    description: "Official salary scales, job grades, and remuneration framework for all categories of staff at Kaimosi Friends University.",
    staff_only: true,
  },
  {
    slug: "student-records-privacy",
    title: "Student Records & Data Privacy Policy",
    category: "Academic",
    version: "v1.0 (2023)",
    pages: 19,
    approved: "Senate, October 2023",
    review_date: "October 2026",
    description: "Governs the collection, storage, access, and use of student records and personal data in compliance with the Kenya Data Protection Act, 2019.",
    staff_only: false,
  },
];

export default function AboutPolicies() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showStaffOnly, setShowStaffOnly] = useState(false);

  const isStaffLoggedIn = !!localStorage.getItem("kafu_staff_token");

  const { data: pageData } = useQuery({
    queryKey: ["page", "about-policies"],
    queryFn: () => fetch("/api/pages/about-policies").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const POLICIES = (sd.policies as typeof FALLBACK_POLICIES) ?? FALLBACK_POLICIES;
  const CATEGORIES = ["All", ...Array.from(new Set(POLICIES.map((p: any) => p.category))).sort()];

  const filtered = POLICIES.filter(p => {
    if (showStaffOnly && !p.staff_only) return false;
    const matchCat = category === "All" || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const staffOnlyCount = POLICIES.filter(p => p.staff_only).length;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Policies & Regulations — KAFU"
        description="Official policies and regulations governing Kaimosi Friends University — academic, student, research, finance, ICT, and HR policies."
        path="/about/policies"
      />

      <PageHero
        eyebrow="Governance"
        title="Policies & Regulations"
        subtitle="Official policies governing academic, student, research, financial, and administrative operations at Kaimosi Friends University."
        photo="/images/uploads/aerial-1.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Policies & Regulations" },
        ]}
      />

      {/* Staff-only notice banner */}
      {!isStaffLoggedIn && (
        <div className="bg-amber-50 border-b border-amber-200 py-3">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <p className="text-sm text-amber-800 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Some policy documents are restricted to KAFU staff. <strong>{staffOnlyCount} staff-only</strong> documents require staff portal login to download.</span>
            </p>
            <a
              href="https://portal.kafu.ac.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
              data-testid="btn-staff-login-notice"
            >
              Staff Login <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Filters */}
      <section className="py-6 bg-secondary/30 border-b sticky top-14 z-20">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-3 items-center flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search policies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-policy-search"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                data-testid={`filter-category-${c.replace(/\s/g, "-").toLowerCase()}`}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                  category === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowStaffOnly(s => !s)}
            data-testid="filter-staff-only"
            className={`text-xs px-3 py-1.5 rounded-full font-medium border flex items-center gap-1.5 transition-colors ${
              showStaffOnly
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-background text-muted-foreground border-border hover:border-amber-400"
            }`}
          >
            <Lock className="w-3 h-3" /> Staff Only
          </button>
          <span className="text-sm text-muted-foreground shrink-0 ml-auto">{filtered.length} document{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </section>

      {/* Policy list */}
      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No policies match your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map(p => {
                const canDownload = !p.staff_only || isStaffLoggedIn;
                const downloadUrl = p.file_url ?? `/documents/policies/${p.slug}.pdf`;

                return (
                  <div
                    key={p.slug}
                    className={`group flex flex-col rounded-xl border bg-card p-6 transition-all ${p.staff_only ? "border-amber-200 hover:border-amber-400 hover:shadow-md" : "hover:shadow-md hover:border-primary/30"}`}
                    data-testid={`card-policy-${p.slug}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.staff_only ? "bg-amber-50 text-amber-600" : "bg-primary/10 text-primary"}`}>
                        {p.staff_only ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-widest text-accent">{p.category}</span>
                          {p.staff_only && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Staff Only
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{p.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>{p.version} · {p.pages} pages</p>
                        <p>Next review: {p.review_date}</p>
                      </div>
                      {canDownload ? (
                        <Button size="sm" variant="outline" className="gap-1.5 shrink-0" asChild data-testid={`btn-download-${p.slug}`}>
                          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        </Button>
                      ) : (
                        <a
                          href="https://portal.kafu.ac.ke"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                          data-testid={`btn-staff-login-${p.slug}`}
                        >
                          <Lock className="w-3 h-3" /> Staff login required
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 bg-secondary/30 border-t">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">For queries about specific policies, contact the Office of the Deputy Vice Chancellor (Administration).</p>
          <div className="flex gap-3">
            <Button variant="outline" asChild><Link href="/about/strategic-plan">Strategic Plan</Link></Button>
            <Button variant="outline" asChild><Link href="/about/service-charter">Service Charter</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
