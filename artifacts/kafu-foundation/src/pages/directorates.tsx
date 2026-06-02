import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface DirectorateListItem {
  id: number;
  name: string;
  slug: string;
  type: string;
  tagline: string | null;
  description: string | null;
  director_name: string | null;
  director_title: string | null;
  director_photo_url: string | null;
  position_order: number;
}

const FALLBACK: DirectorateListItem[] = [
  { id: 1,  type: "directorate", name: "Directorate of Graduate Studies",                              slug: "graduate-studies",                   tagline: "Advancing Postgraduate Excellence at KAFU",                          director_name: "Prof. Benson O. Ojwang",        director_title: "Director, Graduate Studies",                      director_photo_url: "/images/uploads/Prof.-Ojwang.jpg",    description: "Coordinates all postgraduate programmes at KAFU, managing Masters and PhD programmes across all five schools.", position_order: 1 },
  { id: 2,  type: "directorate", name: "Directorate of Research & Innovation",                         slug: "research-innovation",                tagline: "Generating Knowledge that Transforms Society",                       director_name: "Dr. Victor Shikuku",            director_title: "Director, Research & Innovation",                 director_photo_url: null,                              description: "Drives KAFU's research agenda, fostering inquiry, discovery, and creative problem-solving across all disciplines.", position_order: 2 },
  { id: 3,  type: "directorate", name: "Directorate of ICT",                                           slug: "ict",                                tagline: "Powering Digital Transformation at KAFU",                            director_name: "Mr. Yohana Obiye",              director_title: "Director, ICT",                                   director_photo_url: null,                              description: "Manages the university's technology infrastructure, digital services, and enterprise systems.", position_order: 3 },
  { id: 4,  type: "directorate", name: "Directorate of Quality Assurance & Performance",               slug: "quality-assurance",                  tagline: "Upholding Standards of Academic Excellence",                         director_name: "Mr. Nicholas S. Khasoha",       director_title: "Director, Quality Assurance",                     director_photo_url: null,                              description: "Ensures KAFU maintains high standards in teaching, research, administration, and student services.", position_order: 4 },
  { id: 10, type: "directorate", name: "Directorate of Open, Distance and e-Learning",                 slug: "open-distance-elearning",             tagline: "Expanding Access to Quality Higher Education",                       director_name: "Dr. Hillan Ronoh",              director_title: "Director, Open Distance and e-Learning",          director_photo_url: "/images/uploads/Dr.-Ronoh.jpg",       description: "Coordinates the delivery of all open, distance, and online learning programmes at KAFU.", position_order: 5 },
  { id: 11, type: "directorate", name: "Directorate of Corporate Affairs",                             slug: "corporate-affairs",                  tagline: "Shaping Institutional Identity, Voice and Reputation",               director_name: "Mr. Silas Rugut",               director_title: "Director, Corporate Affairs",                     director_photo_url: null,                              description: "The central coordinating unit for corporate communication, media relations, branding, events, and public relations at KAFU.", position_order: 6 },
  { id: 12, type: "directorate", name: "Directorate of Performance Planning and Contracting",          slug: "planning-performance-contracting",   tagline: "Driving Strategic Growth and Institutional Accountability",          director_name: "Dr. Metrine Sulungi",           director_title: "Director, PPC",                                   director_photo_url: "/images/uploads/Dr.-Sulungai.jpg",    description: "Leads strategic planning, performance contracting, and institutional effectiveness initiatives at KAFU.", position_order: 7 },
  { id: 13, type: "directorate", name: "Directorate of University Linkages, Alumni and Career Services", slug: "university-linkages-alumni-career", tagline: "Connecting KAFU to the World and Its Graduates to Opportunity",      director_name: "Prof. Okumu Joseph Otsyulah",   director_title: "Director, DULACS",                                director_photo_url: null,                              description: "Manages partnerships, alumni relations, and career services to connect students with opportunities.", position_order: 8 },
  { id: 14, type: "directorate", name: "Directorate of Enterprise and Resource Mobilization",          slug: "enterprises-resource-mobilization",  tagline: "Transforming University Resources into Sustainable Enterprises",    director_name: "Dr. Damianus Okaka",            director_title: "Director, Enterprise & Resource Mobilization",    director_photo_url: null,                              description: "Drives income-generating activities, fundraising, and enterprise development to sustain university operations.", position_order: 9 },
  { id: 16, type: "centre",      name: "Centre of Excellence on Climate Action and Research",           slug: "cecare",                             tagline: "A Premier Hub for Climate Research, Policy and Community Resilience", director_name: "Prof. Caroline Mulinya",        director_title: "Director, CECARE",                                director_photo_url: null,                              description: "Established in 2024 in partnership with the County Government of Vihiga and the University Fund, CECARE drives evidence-based climate policy, research, and community resilience across the Lake Region Economic Block.", position_order: 1 },
];

function DirectorateCard({ d }: { d: DirectorateListItem }) {
  return (
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
  );
}

export default function DirectoratesPage() {
  const { data: apiData } = useQuery<{ data: DirectorateListItem[] }>({
    queryKey: ["directorates-list"],
    queryFn: () => fetch("/api/directorates").then(r => r.json()),
  });

  const all = apiData?.data ?? FALLBACK;
  const directorates = all.filter(d => d.type !== "centre");
  const centres = all.filter(d => d.type === "centre");

  return (
    <>
      <Helmet>
        <title>Directorates & Centres — KAFU</title>
        <meta name="description" content="Explore the administrative directorates and centres of Kaimosi Friends University, each responsible for a key function in running the institution." />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="Administration"
        title="Directorates & Centres"
        subtitle="KAFU's directorates and centres are specialised units responsible for key functions that support the university's academic mission, operational excellence, and research impact."
        photo="/images/uploads/image-8-1.jpeg"
        align="center"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Directorates & Centres" },
        ]}
      />

      {/* Intro */}
      <section className="border-b border-border bg-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Kaimosi Friends University's (KAFU) Directorates and Centres function as dedicated engines
            driving our commitment to integrity, service, and academic excellence. They are strategic
            units designed to foster innovation, ensure operational efficiency, and deliver service
            excellence that aligns with the Friends' values of peace and community stewardship.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg mt-4">
            These Directorates and Centres strategically complement our academic and administrative
            functions by spearheading specialised holistic programmes, impactful research initiatives,
            and vital community outreach activities rooted in ethical service. Each unit plays a
            pivotal role in advancing KAFU's mission and vision through focused leadership, responsible
            resource optimisation, and the active promotion of partnerships that enhance institutional
            growth and societal transformation. They ensure KAFU remains a beacon of quality education
            and a dedicated partner in development.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-accent/5 border-b border-border py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-primary font-serif">{directorates.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Directorates</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary font-serif">{centres.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Centres</p>
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

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">

        {/* Directorates section */}
        <section>
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-primary mb-2">Directorates</h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Administrative directorates that oversee key operational, academic support, and strategic functions across the university.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {directorates.map(d => <DirectorateCard key={d.id} d={d} />)}
          </div>
        </section>

        {/* Centres section */}
        {centres.length > 0 && (
          <section>
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-primary mb-2">Centres</h2>
              <p className="text-muted-foreground text-sm max-w-2xl">
                Specialised research and innovation centres established to address emerging academic, scientific, and community development priorities.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centres.map(d => <DirectorateCard key={d.id} d={d} />)}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="bg-primary/5 rounded-2xl border border-border p-8 text-center">
          <h2 className="font-serif text-xl font-bold text-primary mb-2">Contact a Directorate or Centre</h2>
          <p className="text-muted-foreground text-sm mb-5 max-w-lg mx-auto">
            Each directorate and centre has dedicated staff ready to assist. Use our contact page to reach
            the right office or find specific email addresses on each unit's page.
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
