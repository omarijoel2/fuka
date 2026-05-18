import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useStats, useNews, useSchools, useEvents, useOpportunities, useProgrammes } from "@/lib/api-hooks";
import { SeoHead, ORG_JSONLD } from "@/components/seo-head";
import {
  Calendar,
  MapPin,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Search,
  Monitor,
  Library,
  Mail,
  Users,
  Award,
  Globe,
  Leaf,
  Clock,
  FileText,
  Briefcase,
  BadgeCheck,
} from "lucide-react";

// ─── Hero Carousel ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    image: "https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg",
    badge: "Est. 2014 · Kaimosi, Western Kenya · Quaker Heritage",
    headline: "Spring of",
    accent: "Knowledge",
    body: "Kaimosi Friends University — a premier institution in Western Kenya dedicated to truth, service, and academic excellence. Join over 5,000 students shaping Kenya's future.",
    cta1: { label: "Apply for Admissions", href: "/admissions", external: false },
    cta2: { label: "Explore Programmes", href: "/programmes", external: false },
    testid: "hero-slide-0",
  },
  {
    image: "https://kafu.ac.ke/wp-content/uploads/2025/10/posgraduate.jpg",
    badge: "5 Schools · 60+ Programmes · All Levels",
    headline: "World-Class",
    accent: "Programmes",
    body: "From Optometry to Computer Science, Education to Business — KAFU offers over 60 nationally accredited programmes, preparing graduates for a competitive and changing world.",
    cta1: { label: "Browse Programmes", href: "/programmes", external: false },
    cta2: { label: "Admissions Guide", href: "/admissions", external: false },
    testid: "hero-slide-1",
  },
  {
    image: "https://kafu.ac.ke/wp-content/uploads/2025/10/img8696.jpg",
    badge: "Modern Infrastructure · Kaimosi Highlands",
    headline: "Built for",
    accent: "Excellence",
    body: "State-of-the-art lecture halls, laboratories, and learning spaces set amidst the serene highlands of Kaimosi — an environment designed to inspire academic achievement.",
    cta1: { label: "About KAFU", href: "/about", external: false },
    cta2: { label: "Visit Campus", href: "/contact", external: false },
    testid: "hero-slide-2",
  },
  {
    image: "https://kafu.ac.ke/wp-content/uploads/2025/10/campus-1-scaled.jpg",
    badge: "Research · Innovation · Community Impact",
    headline: "Advancing",
    accent: "Research",
    body: "KAFU's research centres are driving solutions in health, environment, and development across Kenya and beyond — supported by national and international partnerships.",
    cta1: { label: "Explore Research", href: "/research", external: false },
    cta2: { label: "International Programmes", href: "/international", external: false },
    testid: "hero-slide-3",
  },
  {
    image: "https://kafu.ac.ke/wp-content/uploads/2025/10/undergraduate-fin.jpg",
    badge: "Student Life · Clubs · Community",
    headline: "Shaping",
    accent: "Tomorrow's Leaders",
    body: "Thousands of undergraduate students are discovering their potential at KAFU — through rigorous academics, hands-on learning, and a vibrant campus community.",
    cta1: { label: "Apply Now", href: "/admissions", external: false },
    cta2: { label: "Student Services", href: "/student-services", external: false },
    testid: "hero-slide-4",
  },
  {
    image: "https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg",
    badge: "Strong Leadership · Visionary Direction · Academic Excellence",
    headline: "Led by",
    accent: "Vision",
    body: "Under the leadership of Vice-Chancellor Prof. Peter Mwita, KAFU is transforming into a globally competitive university — driven by innovation, integrity, and a commitment to the people of Kenya.",
    cta1: { label: "Meet Our Team", href: "/staff", external: false },
    cta2: { label: "About KAFU", href: "/about", external: false },
    testid: "hero-slide-5",
  },
  {
    image: "https://kafu.ac.ke/wp-content/uploads/2025/10/sports.jpg",
    badge: "Sports · Recreation · Student Wellness",
    headline: "Compete,",
    accent: "Grow, Excel",
    body: "From inter-university tournaments to fitness and recreation, KAFU nurtures the whole student — balancing academic rigour with sport, culture, and community involvement.",
    cta1: { label: "Student Life", href: "/student-services", external: false },
    cta2: { label: "Admissions Open", href: "/admissions", external: false },
    testid: "hero-slide-6",
  },
  {
    image: "https://kafu.ac.ke/wp-content/uploads/2025/10/art-culture.jpg",
    badge: "Vibrant Campus Life · Western Kenya Highlands",
    headline: "A Community",
    accent: "That Inspires",
    body: "Experience rich campus life in the lush highlands of Kaimosi — where friendships form, talents flourish, and futures are forged in the spirit of service and truth.",
    cta1: { label: "Admissions Open", href: "/admissions", external: false },
    cta2: { label: "About KAFU", href: "/about", external: false },
    testid: "hero-slide-7",
  },
];

interface HeroCarouselProps {
  stats?: { label: string; value: string | number }[];
  statsLoading?: boolean;
}

function HeroCarousel({ stats, statsLoading }: HeroCarouselProps) {
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const count = SLIDES.length;

  const goTo = React.useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((idx + count) % count);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating, count]
  );

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(t);
  }, [current, paused, goTo]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative min-h-[620px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero carousel"
      data-testid="hero-carousel"
    >
      {/* Slide backgrounds — crossfade */}
      {SLIDES.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : 0,
            filter: "brightness(0.68)",
            zIndex: 0,
          }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-primary/30" style={{ zIndex: 1 }} />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          zIndex: 1,
          backgroundImage:
            "radial-gradient(ellipse at 20% 60%, #D4A017 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.15) 0%, transparent 45%)",
        }}
      />

      {/* Slide content */}
      <div
        className="relative container mx-auto px-4 py-20 text-center text-white max-w-5xl"
        style={{ zIndex: 2 }}
      >
        <span className="inline-block py-1 px-4 rounded-full bg-accent/20 text-accent border border-accent/40 font-medium text-sm mb-6 transition-opacity duration-500">
          {slide.badge}
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight transition-opacity duration-500">
          {slide.headline}{" "}
          <span className="text-accent">{slide.accent}</span>
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/85 leading-relaxed transition-opacity duration-500">
          {slide.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-12 font-semibold"
            asChild
            data-testid="hero-button-apply"
          >
            {slide.cta1.external ? (
              <a href={slide.cta1.href} target="_blank" rel="noreferrer">{slide.cta1.label}</a>
            ) : (
              <Link href={slide.cta1.href}>{slide.cta1.label}</Link>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white border-white/60 hover:bg-white/10 text-base px-8 h-12"
            asChild
            data-testid="hero-button-programmes"
          >
            {slide.cta2.external ? (
              <a href={slide.cta2.href} target="_blank" rel="noreferrer">{slide.cta2.label}</a>
            ) : (
              <Link href={slide.cta2.href}>{slide.cta2.label}</Link>
            )}
          </Button>
        </div>

        {/* Stats overlay */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-4 animate-pulse h-20" />
              ))
            : stats?.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3"
                  data-testid={`hero-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="text-2xl md:text-3xl font-serif font-bold text-accent">{stat.value}+</div>
                  <div className="text-xs text-white/75 mt-0.5 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/20"
        aria-label="Previous slide"
        data-testid="carousel-prev"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/20"
        aria-label="Next slide"
        data-testid="carousel-next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-7 h-2.5 bg-accent"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            data-testid={`carousel-dot-${i}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/10">
        <div
          className={`h-full bg-accent/70 transition-none ${!paused ? "animate-none" : ""}`}
          style={{
            width: paused ? "100%" : undefined,
            animation: paused ? "none" : `progress-bar 6000ms linear`,
          }}
          key={`${current}-${paused}`}
        />
      </div>

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: schools, isLoading: schoolsLoading } = useSchools();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: opportunities } = useOpportunities();
  const { data: programmes } = useProgrammes();

  const [progSearch, setProgSearch] = React.useState("");
  const [progLevel, setProgLevel] = React.useState("");
  const [progSchool, setProgSchool] = React.useState("");

  const featuredNews = news?.filter((n) => n.featured).slice(0, 3) ?? [];
  const latestNews = news?.slice(0, 4) ?? [];
  const upcomingEvents = events?.slice(0, 4) ?? [];
  const openOpportunities = opportunities?.slice(0, 4) ?? [];

  const filteredProgrammes = (programmes ?? [])
    .filter((p) => {
      const matchSearch = progSearch
        ? p.name.toLowerCase().includes(progSearch.toLowerCase()) ||
          p.code.toLowerCase().includes(progSearch.toLowerCase())
        : true;
      const matchLevel = progLevel ? p.level === progLevel : true;
      const matchSchool = progSchool ? p.school === progSchool : true;
      return matchSearch && matchLevel && matchSchool;
    })
    .slice(0, 6);

  const whyKafu = [
    {
      icon: <BadgeCheck className="w-7 h-7" />,
      title: "Accredited Quality",
      body: "Fully accredited by the Commission for University Education (CUE) with programmes meeting national and international standards.",
    },
    {
      icon: <Leaf className="w-7 h-7" />,
      title: "Quaker Values",
      body: "Founded on the Quaker principles of truth, integrity, and service to humanity — shaping leaders of character since 2014.",
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Community Impact",
      body: "Deeply rooted in Western Kenya, KAFU actively engages 47 counties through research, outreach, and partnerships.",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Unique Programmes",
      body: "Home to rare and high-demand offerings — including one of only two institutions in Kenya offering Optometry up to PhD level.",
    },
  ];

  const admissionPathways = [
    {
      title: "Undergraduate",
      subtitle: "KUCCPS & Direct Entry",
      description: "Apply through Kenya Universities and Colleges Central Placement Service or directly with certified qualifications.",
      href: "/admissions#undergraduate",
      testid: "card-admissions-undergraduate",
    },
    {
      title: "Postgraduate",
      subtitle: "Masters & PhD",
      description: "Advance your career with research-based or taught postgraduate programmes across all five schools.",
      href: "/admissions#postgraduate",
      testid: "card-admissions-postgraduate",
    },
    {
      title: "International Students",
      subtitle: "Open to All Nations",
      description: "KAFU welcomes students from across Africa and beyond. Guidance on visa, recognition, and admission requirements.",
      href: "/admissions#international",
      testid: "card-admissions-international",
    },
    {
      title: "Self-Sponsored",
      subtitle: "Module II Programmes",
      description: "Flexible Module II pathways for working professionals and those seeking alternative entry into university education.",
      href: "/admissions#self-sponsored",
      testid: "card-admissions-self-sponsored",
    },
  ];

  const digitalServices = [
    {
      icon: <Monitor className="w-7 h-7" />,
      label: "Student Portal",
      desc: "Registration, results, fee statements and more",
      href: "https://portal.kafu.ac.ke",
      external: true,
      testid: "service-student-portal",
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      label: "E-Learning",
      desc: "Online classes, course materials and assignments",
      href: "https://elearning.kafu.ac.ke",
      external: true,
      testid: "service-elearning",
    },
    {
      icon: <Library className="w-7 h-7" />,
      label: "Library",
      desc: "Digital resources, research databases and journals",
      href: "#",
      external: false,
      testid: "service-library",
    },
    {
      icon: <Mail className="w-7 h-7" />,
      label: "Institutional Email",
      desc: "Official KAFU email for students and staff",
      href: "mailto:info@kafu.ac.ke",
      external: false,
      testid: "service-email",
    },
    {
      icon: <Users className="w-7 h-7" />,
      label: "Staff Portal",
      desc: "HR, payroll and administrative services for staff",
      href: "#",
      external: false,
      testid: "service-staff-portal",
    },
    {
      icon: <FileText className="w-7 h-7" />,
      label: "Document Downloads",
      desc: "Forms, joining instructions, fee structures",
      href: "/admissions",
      external: false,
      testid: "service-documents",
    },
  ];

  const levelLabels: Record<string, string> = {
    undergraduate: "Undergraduate",
    postgraduate: "Postgraduate",
    doctoral: "Doctoral",
  };

  const schoolLabels: Record<string, string> = {
    SESS: "SESS",
    SBE: "SBE",
    SCIT: "SCIT",
    SOS: "SOS",
    SHS: "SHS",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://kafu.ac.ke/#website",
    url: "https://kafu.ac.ke",
    name: "Kaimosi Friends University",
    description: "Spring of Knowledge — A Quaker-founded public university in Western Kenya",
    publisher: { "@id": "https://kafu.ac.ke/#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://kafu.ac.ke/programmes?search={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex flex-col">
      <SeoHead
        title="Kaimosi Friends University — Spring of Knowledge"
        description="Kaimosi Friends University (KAFU) — Spring of Knowledge. A Quaker-founded public university in Kaimosi, Western Kenya offering undergraduate, postgraduate, and doctoral programmes in Sciences, Technology, Business, Education, and Health."
        path="/"
        jsonLd={[ORG_JSONLD, websiteJsonLd]}
      />

      {/* ─── HERO CAROUSEL ─── */}
      <HeroCarousel stats={stats} statsLoading={statsLoading} />

      {/* ─── NEWS, EVENTS & ANNOUNCEMENTS ─── */}
      <section className="py-20 bg-secondary/40 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* News — 2/3 width */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">University News</h2>
                <Button variant="ghost" className="text-primary" asChild data-testid="link-all-news">
                  <Link href="/news">
                    All News <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {newsLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-56 bg-muted rounded-xl animate-pulse" />
                    ))
                  : latestNews.map((article) => (
                      <Link key={article.id} href="/news" data-testid={`card-news-${article.id}`}>
                        <div className="group rounded-xl overflow-hidden bg-card border hover:shadow-md hover:border-primary/30 transition-all h-full flex flex-col">
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-xs font-semibold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded">
                                {article.category}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(article.date).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <h3 className="text-base font-bold mb-2 font-serif group-hover:text-primary transition-colors line-clamp-3 flex-1">
                              {article.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
              </div>
            </div>

            {/* Events — 1/3 width */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">Upcoming Events</h2>
                <Button variant="ghost" className="text-primary" asChild data-testid="link-all-events">
                  <Link href="/events">All</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {eventsLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                    ))
                  : upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="group p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all flex gap-4"
                        data-testid={`card-event-${event.id}`}
                      >
                        <div className="flex flex-col items-center justify-center min-w-[3rem] p-2 bg-primary/5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                          <span className="text-[10px] font-bold uppercase">
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-xl font-bold font-serif">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm font-serif text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </h4>
                          <div className="flex flex-col gap-0.5 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 shrink-0" /> {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" /> {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ADMISSIONS PATHWAYS ─── */}
      <section className="py-20 bg-primary/5 border-y" id="admissions-pathways">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Admission Pathways</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose the pathway that fits your academic background and goals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionPathways.map((path) => (
              <Link
                key={path.testid}
                href={path.href}
                className="group flex flex-col bg-white rounded-xl border p-7 hover:border-accent hover:shadow-lg transition-all"
                data-testid={path.testid}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-colors">
                  <GraduationCap className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {path.title}
                </h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">{path.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{path.description}</p>
                <span className="flex items-center gap-1 text-sm font-medium text-primary mt-5 group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8" asChild data-testid="button-admissions-overview">
              <Link href="/admissions">Full Admissions Guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── SCHOOLS & FACULTIES ─── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Schools & Faculties</h2>
              <p className="text-muted-foreground text-lg">
                Five distinct schools, each with a unique academic identity, world-class faculty, and programmes
                aligned to national development priorities.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 group shrink-0"
              asChild
              data-testid="link-all-schools"
            >
              <Link href="/schools">
                All Schools <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schoolsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                ))
              : schools?.map((school) => (
                  <Link
                    key={school.code}
                    href={`/schools/${school.code}`}
                    data-testid={`card-school-${school.code}`}
                  >
                    <div className="group h-full flex flex-col justify-between p-8 rounded-xl border bg-card hover:border-primary hover:shadow-lg transition-all duration-300">
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{school.code}</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-3 font-serif line-clamp-2 group-hover:text-primary transition-colors">
                          {school.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">{school.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <span className="text-xs font-medium text-primary">
                          {typeof school.programmes_count === "object"
                            ? Object.values(school.programmes_count as Record<string, number>).reduce((a, b) => a + b, 0)
                            : school.programmes_count}{" "}
                          Programmes
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ─── CAMPUS LIFE PHOTO STRIP ─── */}
      <section className="py-0 bg-background">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 h-56 md:h-72">
          {[
            { src: "https://kafu.ac.ke/wp-content/uploads/2025/10/undergraduate-fin.jpg", label: "Undergraduate Life" },
            { src: "https://kafu.ac.ke/wp-content/uploads/2025/10/posgraduate.jpg", label: "Postgraduate Research" },
            { src: "https://kafu.ac.ke/wp-content/uploads/2025/10/art-culture.jpg", label: "Arts & Culture" },
            { src: "https://kafu.ac.ke/wp-content/uploads/2025/10/sports.jpg", label: "Sports & Recreation" },
          ].map(({ src, label }, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img
                src={src}
                alt={label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/50 group-hover:bg-primary/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-xs font-semibold">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHY KAFU ─── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why Choose KAFU?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              More than a university — a community of purpose, rooted in values and driven by impact.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyKafu.map((item, i) => (
              <div key={i} className="flex flex-col items-start" data-testid={`why-kafu-${i}`}>
                <div className="w-14 h-14 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-primary-foreground/75 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROGRAMME DISCOVERY ─── */}
      <section className="py-20 bg-background" id="programmes">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Find Your Programme</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Search across 38+ programmes spanning Education, Business, Computing, Science, and Health Sciences.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={progSearch}
                onChange={(e) => setProgSearch(e.target.value)}
                placeholder="Search programmes or codes..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                data-testid="input-programme-search"
              />
            </div>
            <select
              value={progLevel}
              onChange={(e) => setProgLevel(e.target.value)}
              className="px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white min-w-[160px]"
              data-testid="select-programme-level"
            >
              <option value="">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="doctoral">Doctoral</option>
            </select>
            <select
              value={progSchool}
              onChange={(e) => setProgSchool(e.target.value)}
              className="px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white min-w-[160px]"
              data-testid="select-programme-school"
            >
              <option value="">All Schools</option>
              <option value="SESS">SESS — Education</option>
              <option value="SBE">SBE — Business</option>
              <option value="SCIT">SCIT — Computing</option>
              <option value="SOS">SOS — Science</option>
              <option value="SHS">SHS — Health Sciences</option>
            </select>
          </div>

          {/* Programme Cards */}
          {filteredProgrammes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
              {filteredProgrammes.map((prog, i) => (
                <Link
                  key={i}
                  href={`/programmes`}
                  className="group flex items-start gap-4 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all"
                  data-testid={`card-programme-${prog.code.replace(/\s+/g, "-")}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {prog.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded font-medium">{prog.code}</span>
                      <span className="text-xs text-muted-foreground capitalize">{levelLabels[prog.level] ?? prog.level}</span>
                      <span className="text-xs text-muted-foreground">{prog.duration}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground max-w-sm mx-auto">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No programmes found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          <div className="text-center">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild data-testid="link-view-all-programmes">
              <Link href="/programmes">
                View Full Programme Catalogue <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── OPPORTUNITIES ─── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">Opportunities</h2>
              <p className="text-muted-foreground">Tenders, vacancies, scholarships, and official notices.</p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white shrink-0" asChild data-testid="link-all-opportunities">
              <Link href="/opportunities">
                View All Opportunities <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openOpportunities.length === 0 ? (
              <div className="col-span-2 text-center py-10 text-muted-foreground">No open opportunities at this time.</div>
            ) : (
              openOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="group flex items-start gap-4 p-5 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all"
                  data-testid={`card-opportunity-${opp.id}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {opp.type === "Tender" ? (
                      <FileText className="w-5 h-5" />
                    ) : opp.type === "Job Vacancy" ? (
                      <Briefcase className="w-5 h-5" />
                    ) : (
                      <Award className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{opp.type}</span>
                      <span className="text-xs text-muted-foreground">Closes: {new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {opp.title}
                    </h4>
                    {opp.reference && (
                      <p className="text-xs text-muted-foreground mt-1">{opp.reference}</p>
                    )}
                  </div>
                  <span className="shrink-0 inline-block px-2.5 py-0.5 text-xs rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">
                    Open
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── DIGITAL SERVICES HUB ─── */}
      <section className="py-20 bg-primary/5 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Digital Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Access all your university services online — anytime, anywhere.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {digitalServices.map((svc) => {
              const inner = (
                <div
                  className="group flex flex-col items-center text-center p-6 rounded-xl border bg-white hover:border-primary hover:shadow-md transition-all h-full"
                  data-testid={svc.testid}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    {svc.icon}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                    {svc.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-tight">{svc.desc}</p>
                </div>
              );
              return svc.external ? (
                <a key={svc.label} href={svc.href} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <Link key={svc.label} href={svc.href}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 overflow-hidden">
        <img
          src="https://kafu.ac.ke/wp-content/uploads/2025/10/apply-now.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35)" }}
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Applications for the 2025/2026 academic year are open. Take the next step toward your future at
            Kaimosi Friends University.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12"
              asChild
              data-testid="cta-button-apply"
            >
              <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                Start Application
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white/10 px-8 h-12"
              asChild
              data-testid="cta-button-admissions"
            >
              <Link href="/admissions">Admission Information</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
