import React from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Mail, Phone, MapPin, ChevronRight,
  User, BookOpen, GraduationCap, ExternalLink, Building2, Users,
} from "lucide-react";

interface StaffMember {
  slug: string;
  name: string;
  designation: string;
  photo: string | null;
  email: string | null;
  department: string | null;
  school: string | null;
}

/** Match a staff member to a department — checks department field first,
 *  then falls back to Chair/COD designation keyword matching. */
function staffMatchesDept(staff: StaffMember, deptName: string): boolean {
  const deptKey = deptName.toLowerCase().replace(/^department of\s*/i, "").trim();
  const keywords = deptKey.split(/[\s,&]+/).filter(w => w.length > 3);

  // 1. Department field match (e.g. "Department of Computer Science" ↔ "computer science")
  if (staff.department?.trim()) {
    const s = staff.department.toLowerCase().replace(/^department of\s*/i, "").trim();
    if (s.includes(deptKey) || deptKey.includes(s)) return true;
    if (keywords.some(kw => s.includes(kw))) return true;
  }

  // 2. Fallback: Chair/COD designation mentions a dept keyword
  if (staff.designation?.trim()) {
    const d = staff.designation.toLowerCase();
    const isChair = d.includes("chair") || d.includes("cod") || d.startsWith("head");
    if (isChair && keywords.some(kw => d.includes(kw))) return true;
  }

  return false;
}

interface Department {
  id: number;
  school_code: string;
  name: string;
  slug: string;
  description: string | null;
  vision: string | null;
  hod_name: string | null;
  hod_title: string;
  hod_email: string | null;
  hod_phone: string | null;
  hod_photo_url: string | null;
  hod_bio: string | null;
  office_location: string | null;
  email: string | null;
  phone: string | null;
}

const SCHOOL_LABELS: Record<string, string> = {
  SESS: "School of Education & Social Sciences",
  SBE:  "School of Business & Economics",
  SCIT: "School of Computing & IT",
  SOS:  "School of Science",
  SHS:  "School of Health Sciences",
};

const SCHOOL_COLOURS: Record<string, string> = {
  SESS: "#1B3A6B",
  SBE:  "#7B4F00",
  SCIT: "#1A5C38",
  SOS:  "#3A5A8C",
  SHS:  "#7A1A1A",
};

export default function DepartmentDetailPage() {
  const [, params] = useRoute("/departments/:slug");
  const slug = params?.slug ?? "";

  const { data, isLoading } = useQuery<{ data: Department }>({
    queryKey: ["department", slug],
    queryFn: () => fetch(`/api/departments/${slug}`).then(r => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  const dept = data?.data;
  const schoolColour = dept ? (SCHOOL_COLOURS[dept.school_code] ?? "#1A5C38") : "#1A5C38";

  // Clean dept name for API filter (strip "Department of" prefix)
  const deptApiParam = dept
    ? encodeURIComponent(dept.name.replace(/^Department of\s*/i, "").trim())
    : "";

  const { data: staffData } = useQuery<{ data: StaffMember[] }>({
    queryKey: ["dept-staff", dept?.school_code, dept?.name],
    queryFn: () =>
      fetch(`/api/staff?school=${dept!.school_code}&department=${deptApiParam}`)
        .then(r => r.json()),
    enabled: !!dept?.school_code && !!dept?.name,
    staleTime: 1000 * 60 * 10,
  });

  // If API-filtered staff came back empty (dept field not set on legacy records),
  // fall back to client-side matching across all school staff
  const { data: schoolStaffData } = useQuery<{ data: StaffMember[] }>({
    queryKey: ["school-staff-fallback", dept?.school_code],
    queryFn: () =>
      fetch(`/api/staff?school=${dept!.school_code}`).then(r => r.json()),
    enabled: !!dept?.school_code && (staffData?.data ?? []).length === 0,
    staleTime: 1000 * 60 * 10,
  });

  const apiFiltered = staffData?.data ?? [];
  const deptStaff = apiFiltered.length > 0
    ? apiFiltered
    : (schoolStaffData?.data ?? []).filter(s =>
        dept ? staffMatchesDept(s, dept.name) : false
      );

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64" />
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl text-foreground mb-2">Department Not Found</h1>
        <p className="text-muted-foreground mb-6">This department page could not be found.</p>
        <Link href="/schools" className="text-primary font-medium hover:underline">Back to Schools</Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={`${dept.name} | ${SCHOOL_LABELS[dept.school_code] ?? dept.school_code} | KAFU`}
        description={dept.description?.slice(0, 155) ?? `${dept.name} at Kaimosi Friends University.`}
      />

      {/* Hero */}
      <section
        className="text-white py-16"
        style={{ background: `linear-gradient(135deg, ${schoolColour} 0%, ${schoolColour}cc 100%)` }}
      >
        <div className="max-w-5xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/schools" className="hover:text-white transition-colors">Schools</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/schools/${dept.school_code}`} className="hover:text-white transition-colors">
              {dept.school_code}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{dept.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <div className="flex-1">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/60 mb-3">
                {SCHOOL_LABELS[dept.school_code] ?? dept.school_code}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-4">
                {dept.name}
              </h1>
              {dept.vision && (
                <p className="text-white/75 italic text-sm max-w-xl">"{dept.vision}"</p>
              )}
            </div>

            {/* HOD Quick Card */}
            {dept.hod_name && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 shrink-0 max-w-xs">
                {dept.hod_photo_url ? (
                  <img
                    src={dept.hod_photo_url}
                    alt={dept.hod_name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-7 h-7 text-white/60" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider">{dept.hod_title}</p>
                  <p className="font-semibold text-sm">{dept.hod_name}</p>
                  {dept.hod_email && (
                    <a href={`mailto:${dept.hod_email}`} className="text-xs text-white/60 hover:text-white transition-colors">
                      {dept.hod_email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {dept.description && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> About the Department
                </h2>
                <p className="text-muted-foreground leading-relaxed">{dept.description}</p>
              </div>
            )}

            {/* HOD Profile */}
            {dept.hod_name && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" /> Head of Department
                </h2>
                <div className="bg-card border rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
                  {dept.hod_photo_url ? (
                    <img
                      src={dept.hod_photo_url}
                      alt={dept.hod_name}
                      className="w-28 h-28 rounded-xl object-cover shrink-0 self-start"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-xl text-foreground">{dept.hod_name}</h3>
                    <p className="text-primary text-sm font-medium mb-3">{dept.hod_title}, {dept.name}</p>
                    {dept.hod_bio && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{dept.hod_bio}</p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {dept.hod_email && (
                        <a
                          href={`mailto:${dept.hod_email}`}
                          data-testid="hod-email"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Mail className="w-4 h-4" /> {dept.hod_email}
                        </a>
                      )}
                      {dept.hod_phone && (
                        <a
                          href={`tel:${dept.hod_phone}`}
                          data-testid="hod-phone"
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="w-4 h-4" /> {dept.hod_phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Department Staff */}
            <div data-testid="dept-staff-section">
              <h2 className="font-serif text-2xl font-bold text-primary mb-5 flex items-center gap-2">
                <Users className="w-5 h-5" /> Department Staff
              </h2>
              {deptStaff.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deptStaff.map(s => (
                    <Link key={s.slug} href={`/staff/${s.slug}`}>
                      <div
                        className="group flex items-center gap-4 p-4 bg-card border rounded-xl hover:border-primary hover:shadow-sm transition-all cursor-pointer"
                        data-testid={`staff-card-${s.slug}`}
                      >
                        {s.photo ? (
                          <img
                            src={s.photo}
                            alt={s.name}
                            className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-border group-hover:ring-primary transition-all"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-snug truncate">
                            {s.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                            {s.designation}
                          </p>
                          {s.email && (
                            <p className="text-xs text-primary/70 mt-1 flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{s.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-secondary/40 rounded-xl p-5 border text-sm text-muted-foreground">
                  <p className="mb-3">Staff listing for this department is being updated.</p>
                  <Button asChild variant="outline" className="border-primary text-primary text-xs" data-testid="view-staff-fallback">
                    <Link href={`/staff?school=${dept.school_code}`}>
                      <User className="w-3.5 h-3.5 mr-2" /> Browse {dept.school_code} Staff Directory
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Academic Programmes */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Academic Programmes
              </h2>
              <div className="bg-secondary/50 rounded-xl p-5 border">
                <p className="text-muted-foreground text-sm mb-4">
                  Browse all programmes offered under the {dept.school_code} school, which includes this department's offerings.
                </p>
                <Button asChild className="bg-primary text-primary-foreground" data-testid="view-programmes">
                  <Link href={`/programmes?school=${dept.school_code}`}>
                    View {dept.school_code} Programmes <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact */}
            <div className="bg-card border rounded-xl p-5 space-y-4">
              <h3 className="font-serif font-bold text-lg text-foreground">Contact</h3>
              {dept.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
                    <a href={`mailto:${dept.email}`} className="text-sm text-primary hover:underline break-all">
                      {dept.email}
                    </a>
                  </div>
                </div>
              )}
              {dept.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Phone</p>
                    <a href={`tel:${dept.phone}`} className="text-sm text-foreground hover:text-primary">
                      {dept.phone}
                    </a>
                  </div>
                </div>
              )}
              {dept.office_location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Office</p>
                    <p className="text-sm text-foreground">{dept.office_location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* School link */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Parent School</p>
              <Link
                href={`/schools/${dept.school_code}`}
                className="font-serif font-semibold text-primary hover:underline block mb-3"
              >
                {SCHOOL_LABELS[dept.school_code] ?? dept.school_code}
              </Link>
              <Link
                href={`/schools/${dept.school_code}`}
                data-testid="back-to-school"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="w-3 h-3" /> Back to School page
              </Link>
            </div>

            {/* Apply CTA */}
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-sm text-foreground">Ready to join?</p>
              <Button
                asChild
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="apply-now"
              >
                <Link href="/admissions">Apply for Admission</Link>
              </Button>
              <a
                href="https://portal.kafu.ac.ke"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                data-testid="student-portal-link"
              >
                Student Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
