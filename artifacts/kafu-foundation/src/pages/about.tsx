import { BookOpen, Users, MapPin, Globe, GraduationCap, FlaskConical } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import { useQuery } from "@tanstack/react-query";

interface AboutData {
  hero_heading?: string;
  hero_description?: string;
  hero_image_url?: string;
  campus_photo_url?: string;
  history_heading?: string;
  history_p1?: string;
  history_p2?: string;
  history_p3?: string;
  vision?: string;
  mission?: string;
  quaker_heritage?: string;
  vc_name?: string;
  vc_title?: string;
  vc_bio?: string;
  vc_email?: string;
  vc_photo_url?: string;
  core_values?: string[];
  sidebar_stats?: { label: string; value: string }[];
}

const DEFAULTS: Required<AboutData> = {
  hero_heading: "About KAFU",
  hero_description: "Discover the history, mission, and vision of Kaimosi Friends University — a public-spirited institution at the heart of Western Kenya.",
  hero_image_url: "/imgs/aerial-1.jpg",
  campus_photo_url: "/imgs/aerial-2.jpg",
  history_heading: "Our History",
  history_p1: "Kaimosi Friends University (KAFU) was formally awarded its University Charter on August 2, 2022. This landmark event, presided over by the Government of Kenya, marked the institution's elevation to a fully autonomous public university — one of the chartered public universities in Kenya operating under the Universities Act, 2012, guidelines issued by the Commission for University Education (CUE), its own University Charter, and Statutes.",
  history_p2: "KAFU, formerly Kaimosi Friends University College (KAFUCO), was established in 2014 through Legal Notice Number 87 of May 22, 2015, as a Constituent College of Masinde Muliro University of Science and Technology (MMUST). KAFUCO itself was a successor institution to the educational infrastructure previously occupied by the Kaimosi Teachers Training College (KTTC), building upon the rich academic heritage of the larger Kaimosi Complex.",
  history_p3: "The University is strategically located within the renowned Kaimosi Complex in Vihiga County, Western Kenya — just 500 metres off the Chavakali-Kapsabet Road — providing an ideal environment for teaching, learning, and research. KAFU is ISO 9001:2015 certified, demonstrating its commitment to delivering high-quality education and maintaining the security of its data and processes to international standards.",
  vision: "To be a premier university in training, research, innovation and community service.",
  mission: "To provide quality education and training, promote research and innovation for sustainable development.",
  quaker_heritage: "KAFU draws from the rich Quaker tradition of Friends Church East Africa, which established the first school at Kaimosi in 1902. This heritage of service, integrity, and education without discrimination remains at the core of every programme, policy, and partnership the university pursues.",
  vc_name: "Prof. Peter N. Mwita",
  vc_title: "Vice Chancellor",
  vc_bio: "Prof. Peter N. Mwita is the Vice Chancellor of Kaimosi Friends University and the Secretary to the Council. A full Professor and esteemed academic leader with a distinguished career spanning over 29 years in academia and research, he previously served as Deputy Vice-Chancellor (Research, Innovation, and Linkages) at Machakos University. Under his leadership, KAFU continues to advance its mission of quality education, research, and community engagement.",
  vc_email: "vc@kafu.ac.ke",
  vc_photo_url: "/imgs/staff/Prof.-Mwita-council.jpg",
  core_values: ["Integrity and Professionalism", "Quality and Excellence", "Equity and Inclusivity", "Innovation and Creativity", "Teamwork and Collaboration"],
  sidebar_stats: [
    { label: "Location", value: "Kaimosi Complex, Vihiga County, Western Kenya" },
    { label: "Academic Breadth", value: "5 Schools, 38+ Programmes" },
    { label: "University Charter", value: "Awarded August 2, 2022" },
    { label: "Programmes", value: "Certificate to PhD level" },
    { label: "Quality Standard", value: "ISO 9001:2015 Certified" },
  ],
};

export default function About() {
  const { data: apiData } = useQuery<{ data: AboutData }>({
    queryKey: ["about-content"],
    queryFn: () => fetch("/api/about").then(r => r.json()),
    staleTime: 1000 * 60 * 10,
  });

  const d = { ...DEFAULTS, ...(apiData?.data ?? {}) };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="About KAFU — Our Mission, Vision & History"
        description="Learn about Kaimosi Friends University — our Quaker heritage, academic mission, leadership, and commitment to transformative education in Western Kenya since 2013."
        path="/about"
        breadcrumbs={[{ name: "About", path: "/about" }]}
      />

      {/* Page Header */}
      <div className="relative bg-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
        <img
          src={d.hero_image_url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35)" }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">{d.hero_heading}</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">{d.hero_description}</p>
        </div>
      </div>

      {/* Campus photo feature strip */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={d.campus_photo_url}
          alt="Kaimosi Friends University campus"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className="inline-block bg-background/80 backdrop-blur-sm text-foreground text-sm font-medium px-4 py-1.5 rounded-full border border-border/50">
            Kaimosi Campus — Vihiga County, Western Kenya
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-8 space-y-12">
            {/* History */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">{d.history_heading}</h2>
              <div className="prose max-w-none text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>{d.history_p1}</p>
                <p>{d.history_p2}</p>
                <p>{d.history_p3}</p>
              </div>
            </section>

            {/* VC Photo Feature */}
            <section className="rounded-2xl overflow-hidden border shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto min-h-[260px]">
                  <img
                    src={d.vc_photo_url}
                    alt={`${d.vc_name} — ${d.vc_title}`}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
                <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">{d.vc_title}</span>
                  <h3 className="text-2xl font-serif font-bold mb-3">{d.vc_name}</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mb-5">{d.vc_bio}</p>
                  <a href={`mailto:${d.vc_email}`} className="text-accent text-sm font-medium hover:underline">
                    {d.vc_email}
                  </a>
                </div>
              </div>
            </section>

            {/* Mission & Vision */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary p-8 rounded-xl border border-border/50">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-muted-foreground">{d.vision}</p>
              </div>
              <div className="bg-secondary p-8 rounded-xl border border-border/50">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Our Mission</h3>
                <p className="text-muted-foreground">{d.mission}</p>
              </div>
            </section>

            {/* Quaker Heritage */}
            <section className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-primary/90" />
              <img
                src="/imgs/art-culture.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.25)", mixBlendMode: "multiply" }}
              />
              <div className="relative p-8 md:p-12 text-white z-10">
                <h3 className="text-2xl font-serif font-bold mb-4 text-accent">Quaker Heritage</h3>
                <p className="text-white/85 leading-relaxed max-w-2xl">{d.quaker_heritage}</p>
              </div>
            </section>

            {/* Core Values */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Core Values</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(d.core_values ?? DEFAULTS.core_values).map((value, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-card border rounded-lg shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Sidebar Stats */}
            <div className="bg-primary text-primary-foreground p-8 rounded-xl sticky top-24">
              <h3 className="text-xl font-bold font-serif mb-6 border-b border-primary-foreground/20 pb-4">KAFU at a Glance</h3>
              <ul className="space-y-6">
                {(d.sidebar_stats ?? DEFAULTS.sidebar_stats).map((stat, i) => {
                  const icons = [MapPin, BookOpen, Users, GraduationCap, FlaskConical];
                  const Icon = icons[i % icons.length];
                  return (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="mt-1"><Icon className="w-5 h-5 text-accent" /></div>
                      <div>
                        <strong className="block font-medium">{stat.label}</strong>
                        <span className="text-sm text-primary-foreground/80">{stat.value}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Explore CTA */}
            <div className="rounded-xl border bg-card p-6 space-y-3">
              <h4 className="font-serif font-bold text-base">Explore KAFU</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/schools">Academic Schools</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/programmes">Programmes</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/staff">Staff Directory</Link>
                </Button>
                <Button className="w-full text-sm" asChild>
                  <Link href="/admissions">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
