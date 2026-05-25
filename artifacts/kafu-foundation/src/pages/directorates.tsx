import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface DirectorateListItem {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  director_name: string | null;
  director_title: string | null;
  director_photo_url: string | null;
  position_order: number;
}

const FALLBACK: DirectorateListItem[] = [
  { id: 1,  name: "Directorate of Graduate Studies",                     slug: "graduate-studies",                    tagline: "Advancing Postgraduate Excellence at KAFU",               director_name: "Prof. Benson O. Ojwang",        director_title: "Director, Graduate Studies",                      director_photo_url: "/imgs/staff/Prof.-Ojwang.jpg",      description: "Coordinates all postgraduate programmes at KAFU, managing Masters and PhD programmes across all five schools.", position_order: 1 },
  { id: 2,  name: "Directorate of Research & Innovation",                slug: "research-innovation",                 tagline: "Generating Knowledge that Transforms Society",           director_name: "Dr. Victor Shikuku",            director_title: "Director, Research & Innovation",                 director_photo_url: null,                                description: "Drives KAFU's research agenda, fostering inquiry, discovery, and creative problem-solving across all disciplines.", position_order: 2 },
  { id: 3,  name: "Directorate of ICT",                                  slug: "ict",                                 tagline: "Powering Digital Transformation at KAFU",                director_name: "Mr. Yohana Obiye",              director_title: "Director, ICT",                                   director_photo_url: null,                                description: "Manages the university's technology infrastructure, digital services, and enterprise systems.", position_order: 3 },
  { id: 4,  name: "Directorate of Quality Assurance & Performance",      slug: "quality-assurance",                  tagline: "Upholding Standards of Academic Excellence",             director_name: "Mr. Nicholas S. Khasoha",       director_title: "Director, Quality Assurance",                     director_photo_url: null,                                description: "Ensures KAFU maintains high standards in teaching, research, administration, and student services.", position_order: 4 },
  { id: 10, name: "Directorate of Open, Distance and e-Learning",        slug: "open-distance-elearning",             tagline: "Expanding Access to Quality Higher Education",           director_name: "Dr. Hillan Ronoh",              director_title: "Director, Open Distance and e-Learning",          director_photo_url: "/imgs/staff/Dr.-Ronoh.jpg",         description: "Coordinates the delivery of all open, distance, and online learning programmes at KAFU, ensuring distance learners receive quality education regardless of location.", position_order: 5 },
  { id: 11, name: "Directorate of Corporate Affairs",                    slug: "corporate-affairs",                  tagline: "Shaping Institutional Identity, Voice and Reputation",   director_name: "Mr. Silas Rugut",               director_title: "Director, Corporate Affairs",                     director_photo_url: null,                                description: "The central coordinating unit for corporate communication, media relations, branding, events, and public relations at KAFU, domiciled in the Office of the Vice-Chancellor.", position_order: 6 },
  { id: 12, name: "Directorate of Planning & Performance Contracting",   slug: "planning-performance-contracting",   tagline: "Strategic Planning for Institutional Excellence",        director_name: "Dr. Metrine Sulungi",           director_title: "Director, Planning & Performance Contracting",    director_photo_url: "/imgs/staff/Dr.-Sulungai.jpg",      description: "Leads strategic planning, performance contracting, and institutional effectiveness initiatives at KAFU.", position_order: 7 },
  { id: 13, name: "Directorate of University Linkages, Alumni & Career", slug: "university-linkages-alumni-career",  tagline: "Connecting KAFU to Industry and the World",              director_name: "Prof. Okumu Joseph Otsyulah",   director_title: "Director, University Linkages, Alumni & Career",  director_photo_url: null,                                description: "Manages partnerships, alumni relations, and career services to connect students with opportunities.", position_order: 8 },
  { id: 14, name: "Directorate of Enterprises & Resource Mobilization",  slug: "enterprises-resource-mobilization",  tagline: "Generating Resources for Sustainable University Growth",  director_name: "Dr. Damianus Okaka",            director_title: "Director, Enterprises & Resource Mobilization",   director_photo_url: null,                                description: "Drives income-generating activities, fundraising, and enterprise development to sustain university operations.", position_order: 9 },
];

export default function DirectoratesPage() {
  const { data: apiData } = useQuery<{ data: DirectorateListItem[] }>({
    queryKey: ["directorates-list"],
    queryFn: () => fetch("/api/directorates").then(r => r.json()),
  });

  const directorates = apiData?.data ?? FALLBACK;

  return (
    <>
      <Helmet>
        <title>Directorates — KAFU</title>
        <meta name="description" content="Explore the administrative directorates of Kaimosi Friends University, each responsible for a key function in running the institution." />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="Administration"
        title="University Directorates"
        subtitle="KAFU's directorates are specialised administrative units responsible for key functions that support the university's academic mission and operational excellence."
        photo="/imgs/staff/image-8-1.jpeg"
        align="center"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Directorates" },
        ]}
      />

      {/* Stats bar */}
      <section className="bg-accent/5 border-b border-border py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-primary font-serif">{directorates.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Directorates</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary font-serif">5</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Schools</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary font-serif">38+</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Academic Programmes</p>
          </div>
        </div>
      </section>

      {/* Directorates grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directorates.map(d => (
            <Link key={d.id} href={`/directorates/${d.slug}`} data-testid={`directorate-card-${d.slug}`}>
              <div className="group bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all h-full flex flex-col cursor-pointer">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <div className="w-4 h-4 rounded-sm bg-primary/50" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                    {d.name}
                  </h3>
                  {d.tagline && (
                    <p className="text-xs text-accent font-medium mb-3">{d.tagline}</p>
                  )}
                  {d.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {d.description}
                    </p>
                  )}
                </div>
                {d.director_name && (
                  <div className="pt-4 border-t border-border mt-auto flex items-center gap-3">
                    {d.director_photo_url ? (
                      <img
                        src={d.director_photo_url}
                        alt={d.director_name}
                        className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 border border-border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-border">
                        <span className="text-xs font-bold text-primary">
                          {d.director_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">{d.director_title}</p>
                      <p className="text-sm font-medium text-foreground leading-tight">{d.director_name}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1 text-primary text-xs font-medium mt-4 group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-primary/5 rounded-2xl border border-border p-8 text-center">
          <h2 className="font-serif text-xl font-bold text-primary mb-2">Contact a Directorate</h2>
          <p className="text-muted-foreground text-sm mb-5 max-w-lg mx-auto">
            Each directorate has dedicated staff ready to assist. Use our contact page to reach
            the right office or find specific email addresses on each directorate's page.
          </p>
          <Link href="/contact" data-testid="directorates-contact-link">
            <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
              Contact Us
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
