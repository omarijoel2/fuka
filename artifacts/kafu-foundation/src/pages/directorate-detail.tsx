import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "wouter";
import { Mail, Phone, ArrowLeft, ExternalLink, CheckCircle, User } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface QuickLink {
  label: string;
  url: string;
  external?: boolean;
}

interface StaffMember {
  name: string;
  title: string;
  photo_url?: string | null;
  email?: string | null;
  phone?: string | null;
}

interface Directorate {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  director_message: string | null;
  director_name: string | null;
  director_title: string | null;
  director_photo_url: string | null;
  director_bio: string | null;
  director_email: string | null;
  director_phone: string | null;
  functions: string[] | null;
  services: string[] | null;
  quick_links: QuickLink[] | null;
  staff_roster: StaffMember[] | null;
}

interface DirectorateListItem {
  id: number;
  name: string;
  slug: string;
}

const STATIC_FALLBACKS: Record<string, Partial<Directorate>> = {
  "cecare": {
    id: 16,
    name: "Centre of Excellence on Climate Action and Research",
    slug: "cecare",
    tagline: "A Premier Hub for Climate Research, Policy and Community Resilience",
    description:
      "The Centre of Excellence on Climate Action and Research (CECARE) was established at Kaimosi Friends University in September 2024 in collaboration with the County Government of Vihiga (CGV) and the University Fund (UF). CECARE is responsible for informing policies through research and training on climate change issues, including adaptation, mitigation, and financing. It stands as a vital nexus between academia, government, and local communities, driving tangible climate action and sustainable development in Vihiga County, the Lake Region Economic Block (LREB) and beyond.",
    director_message:
      "The Centre of Excellence on Climate Action and Research (CECARE) was established at Kaimosi Friends University in September 2024 in collaboration with the County Government of Vihiga (CGV) and the University Fund (UF). It is responsible for informing policies through research and training on Climate Change issues, including adaptation, mitigation, and financing. Our mission is to serve as a premier hub for informing evidence-based policy, driving innovative research, and building community resilience in the face of climate change. CECARE is dedicated to understanding climate variability and its impacts on the environment and society. Its core activities are structured around four key pillars: Research and Knowledge Management, Policy and Stakeholder Engagement, Community Action and Innovation, and Global Alignment. We interpret and localise global climate frameworks and declarations to contribute effectively to achieving the Sustainable Development Goals (SDGs). CECARE stands as a vital nexus between academia, government, and local communities, driving tangible climate action and sustainable development in Vihiga County, the Lake Region Economic Block (LREB) and beyond.",
    director_name: "Prof. Caroline Mulinya",
    director_title: "Director, CECARE",
    director_photo_url: null,
    director_bio: null,
    director_email: "cecare@kafu.ac.ke",
    director_phone: "+254 777 373 633",
    functions: [
      "Research and Knowledge Management — conducting cutting-edge research on climate adaptation, mitigation, and financing; managing climate information and documenting best practices.",
      "Policy and Stakeholder Engagement — translating research into actionable insights for policymakers and increasing public awareness through targeted outreach on climate change consequences and solutions.",
      "Community Action and Innovation — developing and implementing on-the-ground projects to enhance community resilience, including innovations in renewable energy, clean technology, recycling, and sustainable practices.",
      "Global Alignment — interpreting and localising global climate frameworks and declarations to contribute effectively to achieving the Sustainable Development Goals (SDGs).",
    ],
    services: [
      "Climate change research and technical advisory",
      "Policy briefs and evidence-based recommendations",
      "Community resilience training and capacity building",
      "Renewable energy and clean technology innovation",
      "Climate data and knowledge management",
      "Stakeholder outreach and public awareness programmes",
    ],
    quick_links: [
      { label: "Research Overview",  url: "/research" },
      { label: "Research Projects",  url: "/research/projects" },
      { label: "Contact Us",         url: "/contact" },
    ],
    staff_roster: [
      { name: "Prof. Caroline Mulinya", title: "Director, CECARE", photo_url: null, email: "cecare@kafu.ac.ke" },
    ],
  },
  "planning-performance-contracting": {
    id: 12,
    name: "Directorate of Performance Planning and Contracting",
    slug: "planning-performance-contracting",
    tagline: "Driving Strategic Growth and Institutional Accountability",
    description:
      "Performance Contracting (PC) is the cornerstone of Kaimosi Friends University's (KAFU) commitment to delivering high-quality public service. As a critical mechanism under the Public Sector Reforms agenda, the PC is a negotiated, legally-binding agreement between the Government of the Republic of Kenya (through the Ministry of Education) and the University Management. This system ensures that our operations are not only mission-driven but also aligned with national development goals, providing a clear framework for measuring institutional success. The Directorate of Performance Planning and Contracting is charged with institutionalising accountability and transparency, enhancing service delivery through impartiality and fairness, and guaranteeing the effective, efficient, and responsible use of public funds entrusted to the University.",
    director_message:
      "Performance Contracting (PC) is the cornerstone of Kaimosi Friends University's (KAFU) commitment to delivering high-quality public service. As a critical mechanism under the Public Sector Reforms agenda, the PC is a negotiated, legally-binding agreement between the Government of the Republic of Kenya (specifically through the Ministry of Education) and the University Management. This system ensures that our operations are not only mission-driven but also aligned with national development goals, providing a clear framework for measuring institutional success. Fundamentally, this process is geared toward three key outcomes: Ensuring Accountability and Integrity by institutionalizing a culture of accountability, transparency, and promoting the core values and principles of the public service; Enhancing Service Delivery by mandating impartiality, fairness, and responsiveness in the provision of public services; and Resource Optimization — guaranteeing the effective, efficient, and responsible use of public funds entrusted to the University.",
    director_name: "Dr. Metrine Sulungi",
    director_title: "Director, PPC",
    director_photo_url: "/images/uploads/Dr.-Sulungai.jpg",
    director_bio: "Dr. Metrine Sulungai serves as Director of Performance Planning and Contracting at Kaimosi Friends University, overseeing the university's compliance with government performance contracting obligations and leading institutional strategic planning and monitoring.",
    director_email: "planning@kafu.ac.ke",
    director_phone: "+254 777 373 780",
    functions: [
      "Target Cascading: Setting comprehensive performance targets and extending the contract to all departments, sections, units, levels, and cadres of employees for complete institutional integration",
      "Monitoring and Reporting: Continuously tracking progress and submitting detailed quarterly and annual reports to designated government agencies",
      "Accountability and Integrity: Institutionalising a culture of accountability, transparency, and promoting the core values and principles of the public service",
      "Service Delivery Enhancement: Mandating impartiality, fairness, and responsiveness in the provision of public services",
      "Resource Optimisation: Guaranteeing the effective, efficient, and responsible use of public funds entrusted to the University",
      "Strategic Planning: Coordinating the development and monitoring of the University's strategic plan and institutional development programmes",
      "Institutional Research and Statistics: Managing institutional data and preparing evidence-based reports for management and external agencies",
    ],
    services: [
      "Institutional statistics and data requests",
      "Strategic plan information and progress updates",
      "Performance contracting compliance advisory",
      "Quarterly and annual performance reports",
      "Development project planning and M&E support",
    ],
    quick_links: [
      { label: "About KAFU", url: "/about" },
      { label: "Contact Us",  url: "/contact" },
    ],
    staff_roster: [
      { name: "Dr. Metrine Sulungi", title: "Director, PPC", photo_url: "/images/uploads/Dr.-Sulungai.jpg", email: "planning@kafu.ac.ke" },
    ],
  },
  "university-linkages-alumni-career": {
    id: 13,
    name: "Directorate of University Linkages, Alumni and Career Services",
    slug: "university-linkages-alumni-career",
    tagline: "Connecting KAFU to the World and Its Graduates to Opportunity",
    description:
      "The Directorate of University Linkages, Alumni and Career Services (DULACS) at Kaimosi Friends University (KAFU) was established in 2019 with the sole responsibility of overseeing matters of partnerships, collaborations, and linkages with like-minded organisations and institutions with the purpose of improving the University's image both locally and globally. DULACS is dedicated to serving as the link between the academic and the non-academic community by developing services and delivering programmes to facilitate student and staff engagement for their personal growth and for the good of society at large.",
    director_message:
      "The Directorate of University Linkages, Alumni and Career Services (DULACS) at Kaimosi Friends University (KAFU) was established in 2019 with the sole responsibility of overseeing matters of partnerships, collaborations, and linkages with like-minded organizations and institutions with the sole purpose of improving the University's image both locally and globally. We believe that it is through linkages, collaborations, and partnerships that we foster international awareness and deeper understanding of current emerging issues such as Food Security, unemployment, Climate Change, and Epidemic diseases that can be addressed accordingly. The University, through DULACS, initiates, implements, and sustains collaborations with partners across the world to produce innovative research, deliver innovative teaching and learning, and create opportunities for students and staff to gain international experience through exchange programs.",
    director_name: "Prof. Okumu Joseph Otsyulah",
    director_title: "Director, DULACS",
    director_photo_url: null,
    director_bio: "Prof. Okumu Joseph Otsyulah CHRP(K) serves as Director of the Directorate of University Linkages, Alumni and Career Services (DULACS) at Kaimosi Friends University.",
    director_email: "linkages@kafu.ac.ke",
    director_phone: "+254 777 373 730",
    functions: [
      "Development and management of international and local partnership agreements (MoUs)",
      "Coordination of student and staff exchange programmes",
      "International student recruitment and support services",
      "Visa and immigration guidance for international students",
      "Alumni engagement and association management",
      "Career development services and graduate placement support",
      "Management of internship and industrial attachment programmes",
      "Representation of KAFU at national and international forums",
    ],
    services: [
      "International student admission support",
      "Student exchange programme coordination",
      "MoU and partnership agreement management",
      "Visa and immigration advisory",
      "Alumni registration and networking",
      "Career counselling and job placement support",
      "Internship and attachment placement assistance",
    ],
    quick_links: [
      { label: "International Students", url: "/international" },
      { label: "Exchange Programmes",    url: "/international/exchange" },
      { label: "Our Partners",           url: "/international/partnerships" },
      { label: "Career Services",        url: "/contact" },
    ],
    staff_roster: [
      { name: "Prof. Okumu Joseph Otsyulah CHRP(K)", title: "Director, DULACS", photo_url: null, email: "linkages@kafu.ac.ke" },
    ],
  },
  "enterprises-resource-mobilization": {
    id: 14,
    name: "Directorate of Enterprise and Resource Mobilization",
    slug: "enterprises-resource-mobilization",
    tagline: "Transforming University Resources into Sustainable Enterprises",
    description:
      "The Directorate of Enterprise and Resource Mobilization (ERM) plays a strategic role in advancing Kaimosi Friends University's agenda on sustainability, innovation, practical training and income generation. Through its enterprise activities — particularly the University Farm — the Directorate continues to support teaching, research and resource mobilisation while promoting commercially viable and sustainable ventures. Key areas of operation include dairy production, crop farming, greenhouse farming, poultry, aquaculture, apiary development and other emerging income-generating initiatives.",
    director_message:
      "The Directorate of Enterprise and Resource Mobilization (ERM) plays a strategic role in advancing Kaimosi Friends University's agenda on sustainability, innovation, practical training and income generation. Through its enterprise activities, particularly the University Farm, the Directorate continues to support teaching, research and resource mobilization while promoting commercially viable and sustainable ventures. Our focus is to transform institutional resources into productive enterprises that contribute to the University's growth and long-term financial resilience. We remain committed to prudent resource utilization, innovation, strategic partnerships and continuous improvement. We shall continue to enhance productivity, expand enterprise opportunities and support the University's vision of becoming a centre of excellence in teaching, research and community service.",
    director_name: "Dr. Damianus Okaka",
    director_title: "Director, Enterprise & Resource Mobilization",
    director_photo_url: null,
    director_bio: "Dr. Damianus Okaka serves as Director of Enterprise and Resource Mobilization at Kaimosi Friends University, overseeing all commercial enterprises including the University Farm, dairy production, crop farming, poultry, aquaculture, and apiary development, as well as resource mobilisation partnerships and fundraising activities.",
    director_email: "enterprises@kafu.ac.ke",
    director_phone: "+254 777 373 790",
    functions: [
      "University Farm Management: Overseeing dairy production, crop farming, greenhouse farming, poultry, aquaculture, and apiary development",
      "Income Generation: Developing and managing commercially viable enterprises that contribute to the University's financial resilience",
      "Practical Training Support: Providing students with practical exposure to agricultural and enterprise activities aligned with their studies",
      "Resource Mobilisation: Attracting funding from government, donors, development partners, and private sector through strategic partnerships",
      "Enterprise Expansion: Identifying new income-generating opportunities and emerging ventures aligned with the University's mission",
      "Innovation and Sustainability: Promoting prudent resource utilisation, sustainable farming practices, and continuous improvement",
      "Reporting: Reporting on enterprise performance and resource mobilisation outcomes to University Management and Council",
    ],
    services: [
      "Sponsorship and partnership proposals",
      "University facilities and conference hire",
      "Commercial agricultural produce and farm products",
      "Practical training attachments and field visits",
      "Donation and endowment management",
      "Commercial consultancy and advisory services",
    ],
    quick_links: [
      { label: "About KAFU", url: "/about" },
      { label: "Contact Us",  url: "/contact" },
    ],
    staff_roster: [
      { name: "Dr. Damianus Okaka", title: "Director, Enterprise & Resource Mobilization", photo_url: null, email: "enterprises@kafu.ac.ke" },
    ],
  },
  "corporate-affairs": {
    id: 11,
    name: "Directorate of Corporate Affairs",
    slug: "corporate-affairs",
    tagline: "Shaping Institutional Identity, Voice and Reputation",
    description:
      "The Corporate Affairs Section at Kaimosi Friends University is domiciled in the Office of the Vice-Chancellor and serves as the central coordinating unit for the University's corporate communication and public relations functions. The department is mandated to plan, direct and manage corporate communication programmes aimed at creating, enhancing and sustaining a positive public image of the University. It plays a critical role in shaping institutional perception, strengthening stakeholder confidence and supporting the University's strategic objectives. In executing its mandate, the Section formulates and implements policies, guidelines and procedures that govern communication and public relations activities. It also develops, coordinates and oversees both internal and external communication programmes to ensure consistency, clarity and alignment with the University's vision and mission.",
    director_message:
      "At Kaimosi Friends University, communication is a strategic function that underpins institutional growth, visibility and reputation. The Corporate Affairs Department is entrusted with the responsibility of shaping and projecting the University's image through clear, consistent and credible engagement with our diverse stakeholders. Our role extends beyond information dissemination. We position the University by articulating its vision, showcasing its achievements and strengthening its identity in an increasingly competitive higher education landscape. Through strategic communication, media relations, branding, digital platforms and stakeholder engagement, we ensure that the University's voice remains authoritative, responsive and aligned to its core mandate of teaching, research and community service. We are deliberate in leveraging both traditional and emerging communication channels to enhance visibility, support student enrolment, promote partnerships and reinforce public confidence in the University. Equally, we remain committed to upholding the highest standards of professionalism, accuracy and integrity in all our engagements. As Kaimosi Friends University continues to expand its academic, research and outreach footprint, the Corporate Affairs Department will remain a key enabler in building a strong, trusted and recognizable institutional brand. We welcome you to connect with us and be part of our journey of excellence.",
    director_name: "Mr. Silas Rugut",
    director_title: "Director, Corporate Affairs",
    director_photo_url: null,
    director_bio: null,
    director_email: "corporateaffairs@kafu.ac.ke",
    director_phone: "+254 777 373 633",
    functions: [
      "Marketing and Publicity — drives visibility through targeted campaigns that promote programmes and support student enrolment.",
      "Corporate Communication — manages internal and external communication to ensure clear, timely and consistent messaging.",
      "Media Relations — coordinates engagement with media and facilitates accurate press coverage of University activities.",
      "Corporate Branding — safeguards and promotes the University's corporate identity across all platforms and materials.",
      "Corporate Events — plans and executes official University functions, ceremonies and institutional engagements.",
      "Protocol and Events Coordination — ensures adherence to protocol standards and effective coordination of events.",
      "Corporate Publications — oversees development of newsletters, reports and other institutional publications.",
      "Corporate Social Responsibility — implements community outreach and social impact initiatives.",
      "Corporate Policy Development — formulates and reviews policies guiding communication and public relations.",
      "Photographic Services — provides professional visual documentation for communication and publicity needs.",
    ],
    services: null,
    quick_links: [
      { label: "News & Media", url: "/news" },
      { label: "Corporate Social Responsibility", url: "/about/csr" },
      { label: "Events", url: "/events" },
      { label: "Contact Us", url: "/contact" },
    ],
    staff_roster: [
      { name: "Mr. Silas Rugut",       title: "Director, Corporate Affairs",            photo_url: null, email: "corporateaffairs@kafu.ac.ke" },
      { name: "Mr. Arnold Adidi",       title: "Assistant Public Relations Officer",     photo_url: null, email: null },
      { name: "Ms. Claudia Mballaga",   title: "Assistant Public Relations Officer",     photo_url: null, email: null },
      { name: "Ms. Linah Moraa",        title: "Office Administrator",                   photo_url: null, email: null },
      { name: "Mr. Dan Shamwamwa",      title: "Office Assistant",                       photo_url: null, email: null },
      { name: "Mr. Charles Alulu",      title: "Community Liaison",                      photo_url: null, email: null },
    ],
  },
};

export default function DirectorateDetail({ slug: propSlug }: { slug?: string }) {
  const params = useParams<{ slug: string }>();
  const slug = propSlug ?? params.slug ?? "";

  const { data: apiData, isLoading, isError } = useQuery<{ data: Directorate }>({
    queryKey: ["directorate", slug],
    queryFn: () => fetch(`/api/directorates/${slug}`).then(r => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
  });

  const { data: listData } = useQuery<{ data: DirectorateListItem[] }>({
    queryKey: ["directorates-list"],
    queryFn: () => fetch("/api/directorates").then(r => r.json()),
  });

  const staticFallback = STATIC_FALLBACKS[slug];
  const d: Directorate | null = apiData?.data ?? (staticFallback as Directorate) ?? null;
  const siblings = listData?.data?.filter(i => i.slug !== slug) ?? [];

  if (isLoading && !staticFallback) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading directorate information...</div>
      </div>
    );
  }

  if ((isError || !d) && !staticFallback) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-primary">Directorate Not Found</h2>
        <p className="text-muted-foreground">The directorate you are looking for could not be found.</p>
        <Link href="/directorates" data-testid="back-to-directorates">
          <span className="inline-flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Directorates
          </span>
        </Link>
      </div>
    );
  }

  if (!d) return null;

  const initials = d.director_name
    ? d.director_name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("")
    : "D";

  return (
    <>
      <Helmet>
        <title>{d.name} — KAFU</title>
        <meta name="description" content={d.tagline ?? d.description ?? `Learn about the ${d.name} at Kaimosi Friends University.`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b border-border py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" data-testid="breadcrumb-home"><span className="hover:text-primary transition-colors cursor-pointer">Home</span></Link>
          <span>/</span>
          <Link href="/directorates" data-testid="breadcrumb-directorates"><span className="hover:text-primary transition-colors cursor-pointer">Directorates</span></Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{d.name}</span>
        </div>
      </div>

      {/* Hero */}
      <PageHero
        eyebrow="Directorate"
        title={d.name}
        subtitle={d.tagline ?? undefined}
        photo="/images/uploads/image-8-1.jpeg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Directorates", href: "/directorates" },
          { label: d.name },
        ]}
      />

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {d.description && (
              <section>
                <h2 className="font-serif text-xl font-bold text-primary mb-4">About This Directorate</h2>
                <p className="text-muted-foreground leading-relaxed">{d.description}</p>
              </section>
            )}

            {/* Director's Message */}
            {d.director_message && (
              <section className="bg-primary/5 rounded-xl border border-primary/10 p-7">
                <h2 className="font-serif text-xl font-bold text-primary mb-5">Message from the Director</h2>
                <div className="flex gap-5 flex-col sm:flex-row">
                  <div className="shrink-0">
                    {d.director_photo_url ? (
                      <img
                        src={d.director_photo_url}
                        alt={d.director_name ?? "Director"}
                        className="w-16 h-16 rounded-full object-cover object-top border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 border-4 border-white shadow-md flex items-center justify-center">
                        <span className="text-lg font-bold text-primary font-serif">{initials}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <blockquote className="text-sm text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-4 mb-4">
                      "{d.director_message}"
                    </blockquote>
                    <p className="text-sm font-semibold text-foreground">{d.director_name}</p>
                    <p className="text-xs text-primary">{d.director_title}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Director profile (when no message — shows full card) */}
            {d.director_name && !d.director_message && (
              <section className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary/5 px-6 py-5 flex items-center gap-2 border-b border-border">
                  <h2 className="font-serif text-lg font-bold text-primary">Director's Profile</h2>
                </div>
                <div className="p-6 flex gap-5 flex-col sm:flex-row">
                  {d.director_photo_url ? (
                    <img src={d.director_photo_url} alt={d.director_name}
                      className="w-20 h-20 rounded-full object-cover object-top border-4 border-white shadow-md shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center shrink-0">
                      <span className="text-xl font-bold text-primary font-serif">{initials}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">{d.director_name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{d.director_title}</p>
                    {d.director_bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.director_bio}</p>
                    )}
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      {d.director_email && (
                        <a href={`mailto:${d.director_email}`} data-testid="director-email-link"
                          className="flex items-center gap-2 hover:text-primary transition-colors">
                          <Mail className="w-4 h-4" />{d.director_email}
                        </a>
                      )}
                      {d.director_phone && (
                        <a href={`tel:${d.director_phone}`} data-testid="director-phone-link"
                          className="flex items-center gap-2 hover:text-primary transition-colors">
                          <Phone className="w-4 h-4" />{d.director_phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Functions */}
            {d.functions && d.functions.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-primary mb-5">Core Functions</h2>
                <div className="space-y-2.5">
                  {d.functions.map((fn, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{fn}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {d.services && d.services.length > 0 && (
              <section className="bg-primary/5 rounded-xl border border-border p-6">
                <h2 className="font-serif text-xl font-bold text-primary mb-5">Services Offered</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {d.services.map((svc, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Staff Roster */}
            {d.staff_roster && d.staff_roster.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-primary mb-5">Our Staff</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {d.staff_roster.map((member, i) => (
                    <div
                      key={i}
                      data-testid={`staff-member-${i}`}
                      className="flex items-center gap-4 bg-white border border-border rounded-xl p-4 shadow-sm"
                    >
                      <div className="shrink-0">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover object-top border-2 border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center">
                            <User className="w-5 h-5 text-primary/60" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">{member.name}</p>
                        <p className="text-xs text-primary mt-0.5">{member.title}</p>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            data-testid={`staff-email-${i}`}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{member.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick links */}
            {d.quick_links && d.quick_links.length > 0 && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary px-4 py-3">
                  <h3 className="text-sm font-bold text-primary-foreground">Quick Links</h3>
                </div>
                <div className="divide-y divide-border">
                  {d.quick_links.map((link, i) => (
                    link.external ? (
                      <a key={i} href={link.url} target="_blank" rel="noreferrer"
                        data-testid={`quick-link-${i}`}
                        className="flex items-center justify-between px-4 py-3 text-sm text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors group">
                        {link.label}
                        <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                      </a>
                    ) : (
                      <Link key={i} href={link.url} data-testid={`quick-link-${i}`}>
                        <span className="flex items-center justify-between px-4 py-3 text-sm text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Contact card */}
            {(d.director_email || d.director_phone) && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-accent/10 px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">Contact</h3>
                </div>
                <div className="p-4 space-y-3">
                  {d.director_email && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <a href={`mailto:${d.director_email}`} data-testid="sidebar-email"
                        className="text-sm text-primary hover:underline break-all">{d.director_email}</a>
                    </div>
                  )}
                  {d.director_phone && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                      <a href={`tel:${d.director_phone}`} data-testid="sidebar-phone"
                        className="text-sm text-foreground hover:text-primary">{d.director_phone}</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other directorates */}
            {siblings.length > 0 && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/40 px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">Other Directorates</h3>
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {siblings.map(s => (
                    <Link key={s.id} href={`/directorates/${s.slug}`} data-testid={`sibling-${s.slug}`}>
                      <span className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors cursor-pointer">
                        {s.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <Link href="/directorates" data-testid="back-to-list">
              <span className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                <ArrowLeft className="w-4 h-4" /> All Directorates
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
