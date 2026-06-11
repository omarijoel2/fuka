import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Users, Heart, BookOpen, Trophy, Brain, Shield, ChevronRight, Mail, Phone } from "lucide-react";

const FALLBACK_SERVICES = [
  {
    title: "Accommodation",
    description: "KAFU provides on-campus accommodation facilities to support students throughout their studies. The hostels offer a safe, comfortable, and conducive environment for academic and personal development.",
    icon: Shield,
    colour: "#1A5C38",
    img: "/images/uploads/sa-accommodation.jpg",
    path: "/student-services#accommodation",
  },
  {
    title: "Catering Services",
    description: "The university's catering facilities serve nutritious and affordable meals to students and staff. Our dining halls are designed to foster community and provide a welcoming space for students.",
    icon: Heart,
    colour: "#C9A227",
    img: "/images/uploads/sa-catering.jpg",
    path: "/student-services#catering",
  },
  {
    title: "Scholarships & Bursaries",
    description: "KAFU facilitates access to government bursaries, Higher Education Loans Board (HELB) funding, and university-based scholarships to ensure no student is excluded due to financial constraints.",
    icon: BookOpen,
    colour: "#1B3A6B",
    img: "/images/uploads/sa-bursary.jpg",
    path: "/admissions/funding",
  },
  {
    title: "Games & Sports",
    description: "The office coordinates intercollegiate and intramural sports programmes, supporting student athletes and promoting physical wellness, teamwork, and competitive excellence across a range of disciplines.",
    icon: Trophy,
    colour: "#8B1A1A",
    img: "/images/uploads/sa-games.jpg",
    path: "/student-services#sports",
  },
  {
    title: "Counselling & Guidance",
    description: "Confidential counselling services are available to all students. Our trained counsellors provide support for academic stress, personal challenges, mental health, and career guidance.",
    icon: Brain,
    colour: "#2D6A4F",
    img: "/images/uploads/sa-counselling.jpg",
    path: "/student-services#counselling",
  },
  {
    title: "Student Governing Council",
    description: "The KAFU Student Governing Council is the principal representative body for students. It channels student voices to the university administration, organises student activities, and promotes student leadership.",
    icon: Users,
    colour: "#5B4FCF",
    img: "/images/uploads/sa-leadership.jpg",
    path: "/student-services#council",
  },
];

const FALLBACK_MANDATE = [
  "Champion student welfare and holistic development at all levels",
  "Act as a crucial link between students and the university administration",
  "Foster a positive, equitable, and supportive campus environment",
  "Provide guidance, counselling, and personal development support",
  "Manage student conduct, discipline, and conflict resolution",
  "Coordinate student organisations, activities, and co-curricular programmes",
  "Support students with special needs, spiritual nourishment, and career placement",
  "Assist students facing difficulties that could negatively impact their learning",
  "Help students develop strong interpersonal, ethical, and leadership skills",
];

export default function StudentAffairs() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "student-affairs"],
    queryFn: () => fetch("/api/pages/student-affairs").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const SERVICES = (() => {
    const dbSvcs = sd.services as Array<Omit<(typeof FALLBACK_SERVICES)[0], "icon">> | undefined;
    if (!dbSvcs?.length) return FALLBACK_SERVICES;
    return dbSvcs.map((s, i) => ({ ...FALLBACK_SERVICES[i], ...s }));
  })();
  const MANDATE = (sd.mandate as string[]) ?? FALLBACK_MANDATE;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Dean of Students — Student Affairs | KAFU"
        description="The Dean of Students Office at Kaimosi Friends University champions student welfare, holistic development, and a supportive campus environment from admission through graduation."
      />

      <PageHero
        title="Dean of Students Office"
        subtitle="Championing student welfare, holistic development, and a supportive campus environment from admission through graduation"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Students", href: "/student-services" },
          { label: "Student Affairs" },
        ]}
      />

      {/* Message from Dean */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2 space-y-5">
              <h2 className="text-2xl font-bold text-primary font-['Playfair_Display']">
                Message from the Dean of Students
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Dean of Students Office is primarily mandated to champion student welfare and holistic
                development, acting as a crucial link between students and the Administration. Its mission
                is to foster a positive, equitable, and supportive campus environment from admission through
                graduation, encompassing academic, co-curricular, and personal growth.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Key services include providing guidance and counselling, managing student conduct and
                discipline, coordinating student organizations and activities, and offering support for
                areas like games and sports, special needs, spiritual nourishment, and career placement.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our top priority is to provide the necessary resources and support to supplement academic
                development, aiming to produce a holistic individual ready to function anywhere. This
                involves assisting students facing difficulties that could negatively impact their learning
                and helping them develop a strong sense of self, healthy interpersonal relationship skills,
                consistent ethics, and an appreciation for diversity and lifelong learning.
              </p>
              <p className="text-gray-700 leading-relaxed font-medium">
                Students are encouraged to contact the office for information and guidance to promote their
                well-being and professional development.
              </p>
            </div>

            {/* Dean profile card */}
            <div className="bg-primary text-white rounded-xl p-6">
              <img
                src="/images/uploads/dean-nyambane.jpg"
                alt="Dr. Fredrick M. Nyambane, Dean of Students"
                className="w-24 h-24 rounded-full object-cover object-top mb-4 border-2 border-white/30"
              />
              <p className="font-bold text-lg mb-1">Dr. Fredrick M. Nyambane</p>
              <p className="text-white/80 text-sm mb-3">Dean of Students</p>
              <p className="text-white/70 text-xs leading-relaxed mb-4">
                Office of the Dean of Students, Kaimosi Friends University
              </p>
              <div className="border-t border-white/20 pt-4 space-y-2">
                <a
                  href="mailto:dso@kafu.ac.ke"
                  data-testid="link-dso-email"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" /> dso@kafu.ac.ke
                </a>
                <a
                  href="tel:+254777373633"
                  data-testid="link-dso-phone"
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" /> +254 777 373 633
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary font-['Playfair_Display'] mb-3">
              Student Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive range of support services designed to enhance every aspect of student life at KAFU.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.title}
                  href={svc.path}
                  data-testid={`link-sa-service-${svc.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={svc.img}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: svc.colour }}
                      >
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{svc.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed mb-3">{svc.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      Learn more <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mandate */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-primary font-['Playfair_Display'] mb-8 text-center">
            Our Mandate
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {MANDATE.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold font-['Playfair_Display'] mb-3">
            Need Support? We Are Here for You
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            The Dean of Students Office is open to all KAFU students. Visit us on campus, call, or email
            to access any of our student support services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:dso@kafu.ac.ke"
              data-testid="btn-sa-email"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" /> Email Us
            </a>
            <a
              href="https://portal.kafu.ac.ke"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="btn-sa-portal"
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
