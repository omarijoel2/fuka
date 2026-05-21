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
  position_order: number;
}

const FALLBACK: DirectorateListItem[] = [
  { id: 1, name: "Directorate of Graduate Studies", slug: "graduate-studies", tagline: "Advancing Postgraduate Excellence at KAFU", director_name: "Dr. Caroline Mutai", director_title: "Director, Graduate Studies", description: "Coordinates all postgraduate programmes at KAFU, managing Masters and PhD programmes across all five schools.", position_order: 1 },
  { id: 2, name: "Directorate of Research & Innovation", slug: "research-innovation", tagline: "Generating Knowledge that Transforms Society", director_name: "Prof. Daniel Barasa", director_title: "Director, Research & Innovation", description: "Drives KAFU's research agenda, fostering inquiry, discovery, and creative problem-solving across all disciplines.", position_order: 2 },
  { id: 3, name: "Directorate of ICT", slug: "ict", tagline: "Powering Digital Transformation at KAFU", director_name: "Mr. Isaac Wafula", director_title: "Director, ICT", description: "Manages the university's technology infrastructure, digital services, and enterprise systems.", position_order: 3 },
  { id: 4, name: "Directorate of Quality Assurance & Performance", slug: "quality-assurance", tagline: "Upholding Standards of Academic Excellence", director_name: "Dr. Naomi Kiptoo", director_title: "Director, Quality Assurance", description: "Ensures KAFU maintains high standards in teaching, research, administration, and student services.", position_order: 4 },
  { id: 5, name: "Directorate of International Relations", slug: "international-relations", tagline: "Connecting KAFU to the World", director_name: "Dr. Sylvia Omondi", director_title: "Director, International Relations", description: "Manages global partnerships, exchange programmes, and international student support.", position_order: 5 },
  { id: 6, name: "Directorate of Corporate Communications & Marketing", slug: "corporate-communications", tagline: "Telling the KAFU Story to the World", director_name: "Mr. Brian Momanyi", director_title: "Director, Corporate Communications", description: "Manages all institutional communications, brand identity, media relations, and digital content.", position_order: 6 },
  { id: 7, name: "Directorate of Student Affairs", slug: "student-affairs", tagline: "Supporting Student Success Inside and Outside the Classroom", director_name: "Dr. Paul Simiyu", director_title: "Director, Student Affairs", description: "Provides holistic student support including accommodation, counselling, sports, and career development.", position_order: 7 },
  { id: 8, name: "Directorate of Finance", slug: "finance", tagline: "Stewardship of Institutional Resources", director_name: "Mr. Peter Odhiambo", director_title: "Finance Officer", description: "Responsible for all financial management, budgeting, fee management, and PFM Act compliance.", position_order: 8 },
  { id: 9, name: "Directorate of Procurement", slug: "procurement", tagline: "Value for Money in Every University Purchase", director_name: "Mr. Joseph Barasa", director_title: "Director, Procurement", description: "Manages all procurement activities in compliance with the Public Procurement and Asset Disposal Act, 2015.", position_order: 9 },
  { id: 10, name: "Directorate of Open, Distance and e-Learning", slug: "open-distance-elearning", tagline: "Expanding Access to Quality Higher Education", director_name: "Dr. Jacqueline Wanjiku", director_title: "Director, Open Distance and e-Learning", description: "Coordinates the delivery of all open, distance, and online learning programmes at KAFU, ensuring distance learners receive quality education regardless of location.", position_order: 10 },
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
        photo="https://kafu.ac.ke/wp-content/uploads/2026/02/image-8-1.jpeg"
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
                  <div className="pt-4 border-t border-border mt-auto">
                    <p className="text-xs text-muted-foreground">{d.director_title}</p>
                    <p className="text-sm font-medium text-foreground">{d.director_name}</p>
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
