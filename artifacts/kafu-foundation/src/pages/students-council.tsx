import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Users, Vote, BookOpen, Shield, Music, Trophy, Accessibility, Home, ChevronRight, Mail, Phone } from "lucide-react";

const FALLBACK_MANDATE_AREAS = [
  {
    icon: BookOpen,
    title: "Academics",
    description: "Advocating for improved academic resources, equitable assessment practices, and student representation in academic governance.",
    colour: "#1A5C38",
  },
  {
    icon: Home,
    title: "Accommodation",
    description: "Liaising with university management on hostel conditions, availability, and the welfare of both on-campus and off-campus students.",
    colour: "#1B3A6B",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Working to ensure a safe learning environment for all students across all university premises and facilities.",
    colour: "#8B1A1A",
  },
  {
    icon: Music,
    title: "Entertainment & Culture",
    description: "Organising and supporting cultural activities, entertainment events, and programmes that celebrate student diversity and talent.",
    colour: "#C9A227",
  },
  {
    icon: Trophy,
    title: "Sports",
    description: "Promoting intercollegiate and intra-university sports competition, and supporting student athletes in their pursuit of excellence.",
    colour: "#2D6A4F",
  },
  {
    icon: Accessibility,
    title: "Persons with Disabilities",
    description: "Championing the rights and welfare of students with disabilities, ensuring accessible facilities, support, and full participation in campus life.",
    colour: "#5B4FCF",
  },
];

const FALLBACK_GOVERNANCE = [
  {
    title: "Elections",
    description: "Student leaders are elected annually for one academic year in strict accordance with the KAFUSA Constitution and the Universities Amendment Act (2016). Elections are coordinated by the Office of the Dean of Students.",
  },
  {
    title: "Executive Council",
    description: "The KAFUSA Executive is composed of elected student leaders representing all schools and student constituencies. The 4th KAFU Student Council currently serves the student community.",
  },
  {
    title: "Legal Basis",
    description: "KAFUSA's operations are grounded in the Universities Amendment Act (2016) and the KAFUSA Constitution, ensuring democratic, transparent, and accountable student governance.",
  },
  {
    title: "Relationship with Management",
    description: "KAFUSA works in close partnership with the Dean of Students Office and the university administration to address student concerns and contribute to institutional decision-making.",
  },
];

export default function StudentsCouncil() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "students-council"],
    queryFn: () => fetch("/api/pages/students-council").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const MANDATE_AREAS = (() => {
    const dbAreas = sd.mandate_areas as Array<Omit<(typeof FALLBACK_MANDATE_AREAS)[0], "icon">> | undefined;
    if (!dbAreas?.length) return FALLBACK_MANDATE_AREAS;
    return dbAreas.map((a, i) => ({ ...FALLBACK_MANDATE_AREAS[i], ...a }));
  })();
  const GOVERNANCE = (sd.governance as typeof FALLBACK_GOVERNANCE) ?? FALLBACK_GOVERNANCE;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="KAFU Student Council (KAFUSA) | KAFU"
        description="The Kaimosi Friends University Students' Association (KAFUSA) is the paramount body dedicated to student advocacy and welfare, covering academics, accommodation, sports, and more."
      />

      <PageHero
        title="KAFU Student Council"
        subtitle="The Kaimosi Friends University Students' Association — the voice and advocate of the KAFU student community"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Students", href: "/student-services" },
          { label: "Student Council" },
        ]}
      />

      {/* About KAFUSA */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2 space-y-5">
              <h2 className="text-2xl font-bold text-primary font-['Playfair_Display']">
                KAFUSA: The Voice of the Student Community
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Kaimosi Friends University Students' Association (KAFUSA) is the paramount body
                dedicated to the advocacy and welfare of Kaimosi Friends University students. As a
                registered membership organisation, KAFUSA provides essential support across a broad
                spectrum of student life.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Its mission is to address and resolve general welfare issues related to Academics,
                Accommodation, Security, Entertainment, Sports, and the specific requirements of
                Persons with Disabilities (PWDs), ensuring comprehensive coverage across both
                on-campus and off-campus living environments.
              </p>
              <p className="text-gray-700 leading-relaxed">
                KAFUSA's operations and leadership are grounded in law: its executive body is composed
                of student leaders elected for one academic year in strict accordance with the KAFUSA
                Constitution and the national framework established by the Universities Amendment Act
                (2016). These elections are professionally coordinated by the Office of the Dean of
                Students.
              </p>
            </div>

            {/* Contact card */}
            <div className="bg-primary text-white rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <p className="font-bold text-lg mb-1">KAFUSA Executive</p>
              <p className="text-white/80 text-sm mb-1">4th KAFU Student Council</p>
              <p className="text-white/70 text-xs mb-4">Kaimosi Friends University</p>
              <div className="border-t border-white/20 pt-4 space-y-2">
                <a
                  href="mailto:studentcouncil@kafu.ac.ke"
                  data-testid="link-kafusa-email"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" /> studentcouncil@kafu.ac.ke
                </a>
                <a
                  href="tel:+254777373633"
                  data-testid="link-kafusa-phone"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" /> +254 777 373 633
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <Link
                  href="/students/affairs"
                  data-testid="link-kafusa-dso"
                  className="flex items-center gap-1 text-white/80 hover:text-white text-sm transition-colors"
                >
                  Dean of Students Office <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of mandate */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary font-['Playfair_Display'] mb-3">
              Areas of Student Advocacy
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              KAFUSA works to address and improve student welfare across six core areas of campus life.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MANDATE_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: area.colour }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{area.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-primary font-['Playfair_Display'] mb-3">
              Governance &amp; Structure
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              KAFUSA operates under a democratic framework anchored in national law and the KAFUSA Constitution.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {GOVERNANCE.map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold font-['Playfair_Display'] mb-3">
            Get Involved with KAFUSA
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            KAFUSA represents every student at KAFU. Participate in elections, join committees, or
            bring your concerns to the student leadership.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/students/affairs"
              data-testid="btn-council-dso"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              <Users className="w-4 h-4" /> Dean of Students Office
            </Link>
            <a
              href="https://portal.kafu.ac.ke"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="btn-council-portal"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              Student Portal <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
