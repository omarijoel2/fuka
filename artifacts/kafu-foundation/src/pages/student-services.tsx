import { Users, Library, Activity, HeartHandshake, ShieldCheck, Laptop, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import { useQuery } from "@tanstack/react-query";

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface StudentServicesData {
  hero_heading?: string;
  hero_description?: string;
  intro_text?: string;
  services?: Service[];
  digital_title?: string;
  digital_description?: string;
  portal_url?: string;
  elearning_url?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Activity, Library, ShieldCheck, HeartHandshake, Users, Laptop,
};

const DEFAULT_SERVICES: Service[] = [
  { icon: "Activity",       title: "Games & Sports",       description: "Established alongside the university in 2014, our sports department offers football, basketball, athletics, and indoor games. We actively participate in regional university leagues." },
  { icon: "Library",        title: "University Library",   description: "A quiet, resourceful environment with extensive physical collections and access to thousands of e-journals and academic databases for research." },
  { icon: "ShieldCheck",    title: "Accommodation",        description: "Secure, affordable on-campus hostels for students. Off-campus private hostels around Kaimosi are also vetted by our accommodation office." },
  { icon: "HeartHandshake", title: "Counselling Services", description: "Professional, confidential psychological support and mentorship to help students navigate academic stress and personal challenges." },
  { icon: "Users",          title: "Student Government",   description: "The KAFU Students Organization advocates for student welfare, organizes cultural events, and provides leadership development opportunities." },
];

const DEFAULTS: Required<StudentServicesData> = {
  hero_heading:        "Student Life & Services",
  hero_description:    "We are committed to providing a holistic university experience that nurtures the mind, body, and spirit.",
  intro_text:          "At Kaimosi Friends University, learning goes beyond the classroom. Since our establishment in 2014, we have continuously developed support systems and extracurricular facilities to ensure our students thrive academically and personally.",
  services:            DEFAULT_SERVICES,
  digital_title:       "Digital Services",
  digital_description: "Access your timetables, exam results, and online classes through our centralized portals.",
  portal_url:          "https://portal.kafu.ac.ke",
  elearning_url:       "https://elearning.kafu.ac.ke",
};

export default function StudentServices() {
  const { data: apiData } = useQuery<{ data: StudentServicesData }>({
    queryKey: ["student-services-content"],
    queryFn: () => fetch("/api/student-services").then(r => r.json()),
    staleTime: 1000 * 60 * 10,
  });

  const d = { ...DEFAULTS, ...(apiData?.data ?? {}) };
  const services = (d.services && d.services.length > 0) ? d.services : DEFAULT_SERVICES;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Student Services — Kaimosi Friends University"
        description="KAFU student support services — academic registry, library, health services, counselling, accommodation, career services, and digital learning tools."
        path="/student-services"
        breadcrumbs={[{ name: "Student Services", path: "/student-services" }]}
      />
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">{d.hero_heading}</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">{d.hero_description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed">{d.intro_text}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Activity;
            return (
              <div key={i} className="bg-card p-8 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            );
          })}

          <div className="bg-primary p-8 border rounded-xl shadow-sm text-primary-foreground">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Laptop className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">{d.digital_title}</h3>
            <p className="text-primary-foreground/80 text-sm mb-6">{d.digital_description}</p>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90" asChild data-testid="btn-ss-portal">
                <a href={d.portal_url} target="_blank" rel="noreferrer">Student Portal</a>
              </Button>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/10" asChild data-testid="btn-ss-elearning">
                <a href={d.elearning_url} target="_blank" rel="noreferrer">E-Learning System</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
