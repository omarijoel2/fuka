import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useStats, useNews, useSchools, useEvents, useOpportunities, useProgrammes, useHeroSlides, type HeroSlide } from "@/lib/api-hooks";
import { IntakeBanner } from "@/components/intake-banner";
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
// Split layout: text panel left, clean photo right — matching kafu.ac.ke style.
// No overlay on photos. Light background with decorative blobs.
const SLIDES = [
  {
    image: "/imgs/vc.jpeg",
    objectPosition: "center top",
    badge: "Vice-Chancellor · Prof. Peter N. Mwita",
    headline: "Vision. Leadership.",
    accent: "Excellence.",
    body: "KAFU is transforming lives through quality education, research, and innovation in Western Kenya.",
    cta1: { label: "Apply for Admissions", href: "/admissions", external: false },
    cta2: { label: "About the VC", href: "/staff/prof-peter-n-mwita", external: false },
    testid: "hero-slide-0",
  },
  {
    image: "/imgs/vc-cbe-training.jpg",
    objectPosition: "center top",
    badge: "Teaching & Learning · Competency-Based Education",
    headline: "Leading from",
    accent: "the Front.",
    body: "Prof. Peter Mwita opens CBE training for teacher trainees — building the next generation of educators.",
    cta1: { label: "Explore Programmes", href: "/programmes", external: false },
    cta2: { label: "Our Schools", href: "/schools", external: false },
    testid: "hero-slide-1",
  },
  {
    image: "/imgs/kafu-kuccps-visit.jpeg",
    objectPosition: "center center",
    badge: "National Recognition · KUCCPS CEO Visit",
    headline: "A Rising",
    accent: "Academic Profile.",
    body: "KUCCPS CEO commends KAFU's growing academic excellence and student placement performance.",
    cta1: { label: "Admissions Guide", href: "/admissions", external: false },
    cta2: { label: "About KAFU", href: "/about", external: false },
    testid: "hero-slide-2",
  },
  {
    image: "/imgs/kafu-africa-pubservice.jpg",
    objectPosition: "center center",
    badge: "Historic Milestone · Africa Public Service Day 2026",
    headline: "KAFU on the",
    accent: "Continental Stage.",
    body: "KAFU earmarked to host Africa Public Service Day 2026 — a landmark recognition for Western Kenya.",
    cta1: { label: "About KAFU", href: "/about", external: false },
    cta2: { label: "Research & Innovation", href: "/research", external: false },
    testid: "hero-slide-3",
  },
  {
    image: "/imgs/kafu-kippra-conference.jpeg",
    objectPosition: "center center",
    badge: "Research Leadership · KIPPRA Annual Conference",
    headline: "Advancing",
    accent: "Research.",
    body: "KAFU joins national leaders at the 9th KIPPRA Regional Conference — driving economic transformation.",
    cta1: { label: "Research & Innovation", href: "/research", external: false },
    cta2: { label: "International Programmes", href: "/international", external: false },
    testid: "hero-slide-4",
  },
  {
    image: "/imgs/kafu-innovation-week.jpeg",
    objectPosition: "center center",
    badge: "Innovation · Kenya Science and Innovation Week",
    headline: "Local Ideas,",
    accent: "National Impact.",
    body: "KAFU innovations shine at Kenya's first Science and Innovation Week — turning campus ideas into solutions.",
    cta1: { label: "Explore Research", href: "/research", external: false },
    cta2: { label: "Apply Now", href: "/admissions", external: false },
    testid: "hero-slide-5",
  },
  {
    image: "/imgs/kafu-ministry-health.jpg",
    objectPosition: "center center",
    badge: "Community & Health · Ministry of Health Partnership",
    headline: "Serving",
    accent: "Community.",
    body: "KAFU hosts Ministry of Health officials — strengthening the university's role in public health.",
    cta1: { label: "Schools & Faculties", href: "/schools", external: false },
    cta2: { label: "Contact Us", href: "/contact", external: false },
    testid: "hero-slide-6",
  },
];

// Static fallback used while API loads or if API fails
const STATIC_SLIDES = SLIDES;

interface HeroCarouselProps {
  stats?: { label: string; value: string | number }[];
  statsLoading?: boolean;
}

function HeroCarousel({ stats, statsLoading }: HeroCarouselProps) {
  const { data: apiSlides } = useHeroSlides();
  // Map API shape → carousel shape, fall back to static SLIDES if API empty
  const slides: typeof SLIDES = React.useMemo(() => {
    if (apiSlides && apiSlides.length > 0) {
      return apiSlides.map((s: HeroSlide, i: number) => ({
        image: s.image,
        objectPosition: s.objectPosition,
        badge: s.badge,
        headline: s.headline,
        accent: s.accent,
        body: s.body,
        cta1: s.cta1,
        cta2: s.cta2,
        testid: `hero-slide-${i}`,
      }));
    }
    return STATIC_SLIDES;
  }, [apiSlides]);

  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const count = slides.length;

  const goTo = React.useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((idx + count) % count);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating, count]
  );

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => goTo(current + 1), 7000);
    return () => clearInterval(t);
  }, [current, paused, goTo]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-gray-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero carousel"
      data-testid="hero-carousel"
    >
      {/* ── Decorative blobs (matching kafu.ac.ke style) ── */}
      {/* Gold blob — bottom left */}
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)", zIndex: 0 }}
      />
      {/* Green blob — top right */}
      <div
        className="absolute -top-16 -right-16 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1A5C38 0%, transparent 70%)", zIndex: 0 }}
      />

      {/* ── Main split layout ── */}
      <div
        className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-0 md:gap-8 px-6 sm:px-10 md:px-12 py-10 md:py-14"
        style={{ zIndex: 1, minHeight: "clamp(420px, 70vh, 620px)" }}
      >
        {/* LEFT — text panel */}
        <div className="flex-1 flex flex-col justify-center order-2 md:order-1 py-4 md:py-0 md:pr-6 w-full">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/15 text-accent border border-accent/40 font-medium text-xs sm:text-sm mb-4 w-fit leading-snug">
            {slide.badge}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4 text-gray-900">
            {slide.headline}{" "}
            <span className="text-primary">{slide.accent}</span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 mb-7 leading-relaxed max-w-lg">
            {slide.body}
          </p>

          <div className="flex flex-row flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 font-semibold px-7 h-12 text-sm sm:text-base rounded-full"
              asChild
              data-testid="hero-button-primary"
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
              className="border-primary text-primary hover:bg-primary/5 px-7 h-12 text-sm sm:text-base rounded-full"
              asChild
              data-testid="hero-button-secondary"
            >
              {slide.cta2.external ? (
                <a href={slide.cta2.href} target="_blank" rel="noreferrer">{slide.cta2.label}</a>
              ) : (
                <Link href={slide.cta2.href}>{slide.cta2.label}</Link>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT — clean photo, no overlay */}
        <div className="relative flex-shrink-0 order-1 md:order-2 w-full md:w-[52%] lg:w-[55%]">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-xl" style={{ aspectRatio: "4/3" }}>
            {slides.map((s, i) => (
              <img
                key={s.testid}
                src={s.image}
                alt={s.badge}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600"
                style={{
                  opacity: i === current ? 1 : 0,
                  objectPosition: s.objectPosition,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md hover:bg-gray-100 text-primary flex items-center justify-center transition-colors border border-gray-200"
        aria-label="Previous slide"
        data-testid="carousel-prev"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md hover:bg-gray-100 text-primary flex items-center justify-center transition-colors border border-gray-200"
        aria-label="Next slide"
        data-testid="carousel-next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dot indicators ── */}
      <div className="relative z-10 flex items-center justify-center gap-2 pb-5 pt-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2.5 bg-primary"
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            data-testid={`carousel-dot-${i}`}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-gray-200">
        <div
          className="h-full bg-primary/50"
          style={{ animation: paused ? "none" : `progress-bar 7000ms linear`, width: paused ? "100%" : undefined }}
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

interface OpenIntake {
  id: number;
  name: string;
  intake_period: string;
  status: string;
  close_at: string;
  open_at: string;
  application_fee_undergraduate: number;
  application_fee_masters: number;
  application_fee_phd: number;
}

function IntakeConversionSection() {
  const [intakes, setIntakes] = React.useState<OpenIntake[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admissions-app/intakes/open")
      .then(r => r.json())
      .then(d => { setIntakes(d.data ?? []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || intakes.length === 0) return null;

  const intake = intakes[0];
  const closeDate = new Date(intake.close_at);
  const now = new Date();
  const daysLeft = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft > 0 && daysLeft <= 21;
  const isClosed = daysLeft <= 0;

  return (
    <section className="bg-primary text-primary-foreground py-10" data-testid="intake-conversion-section">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Left: Intake info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {!isClosed && (
                <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Applications Open
                </span>
              )}
              {isUrgent && !isClosed && (
                <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Closing in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1">{intake.name}</h2>
            <p className="text-primary-foreground/70 text-sm">
              {isClosed
                ? "This intake is now closed. Check back for the next intake window."
                : `Deadline: ${closeDate.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })} — ${daysLeft} days remaining`}
            </p>
          </div>

          {/* Right: CTAs */}
          {!isClosed && (
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                asChild
                data-testid="intake-btn-apply-ug"
              >
                <Link href="/admissions/apply">Apply — Undergraduate</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white/50 hover:bg-white/10"
                asChild
                data-testid="intake-btn-apply-pg"
              >
                <Link href="/admissions/apply">Apply — Masters / PhD</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
                asChild
                data-testid="intake-btn-track"
              >
                <Link href="/admissions/track">Track Application</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
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
  const [whyIdx, setWhyIdx] = React.useState(0);
  const [whyPerView, setWhyPerView] = React.useState(3);

  React.useEffect(() => {
    const update = () => {
      const pv = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      setWhyPerView(pv);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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

  const whyKafuSlides = [
    {
      image: "/imgs/image-99.jpeg",
      category: "Accreditation",
      title: "Accredited Quality",
      body: "Fully accredited by the Commission for University Education (CUE) with programmes meeting national and international standards.",
      href: "/about",
      testid: "why-slide-accredited",
    },
    {
      image: "/imgs/posgraduate.jpg",
      category: "Programmes",
      title: "Unique Programmes",
      body: "Home to rare and high-demand offerings — including one of only two institutions in Kenya offering Optometry up to PhD level.",
      href: "/programmes",
      testid: "why-slide-programmes",
    },
    {
      image: "/imgs/visual-acuity.jpg",
      category: "Research",
      title: "Research & Innovation",
      body: "Driving solutions in health, environment, and development across Kenya — supported by national and international partnerships.",
      href: "/research",
      testid: "why-slide-research",
    },
    {
      image: "/imgs/art-culture.jpg",
      category: "Campus Life",
      title: "Quaker Values",
      body: "Founded on principles of truth, integrity, and service to humanity — shaping leaders of character since 2014.",
      href: "/about#vision",
      testid: "why-slide-values",
    },
    {
      image: "/imgs/campus-main.jpg",
      category: "Community",
      title: "Community Impact",
      body: "Deeply rooted in Western Kenya, KAFU actively engages 47 counties through research, outreach, and partnerships.",
      href: "/research/partnerships",
      testid: "why-slide-community",
    },
    {
      image: "/imgs/undergraduate.jpg",
      category: "Students",
      title: "Student Life",
      body: "Thousands of students discovering their potential through rigorous academics, hands-on learning, and vibrant campus community.",
      href: "/student-services",
      testid: "why-slide-students",
    },
    {
      image: "/imgs/sports.jpg",
      category: "Sports",
      title: "Sports & Recreation",
      body: "From inter-university tournaments to fitness and wellness, KAFU nurtures the whole student beyond the classroom.",
      href: "/student-services",
      testid: "why-slide-sports",
    },
    {
      image: "/imgs/vc-lecture.jpg",
      category: "Leadership",
      title: "Visionary Leadership",
      body: "Under Vice-Chancellor Prof. Peter Mwita, KAFU is transforming into a globally competitive university driven by innovation and integrity.",
      href: "/staff",
      testid: "why-slide-leadership",
    },
  ];

  const whyCount = whyKafuSlides.length;

  React.useEffect(() => {
    const t = setInterval(() => setWhyIdx((i) => (i + 1) % whyCount), 4500);
    return () => clearInterval(t);
  }, [whyCount]);

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
    SBE: "SOBE",
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

      {/* ─── INTAKE STATUS BANNER ─── */}
      <IntakeBanner />

      {/* ─── LIVE ADMISSIONS CONVERSION ─── */}
      <IntakeConversionSection />

      {/* ─── NEWS, EVENTS & ANNOUNCEMENTS ─── */}
      <section className="py-12 md:py-20 bg-secondary/40 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

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
      <section className="py-12 md:py-20 bg-primary/5 border-y" id="admissions-pathways">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
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
      <section className="py-12 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Our Schools</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Schools & Faculties</h2>
              <p className="text-muted-foreground text-lg">
                Five distinct schools, each led by accomplished academics committed to excellence, research, and
                service to the community.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schoolsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
                ))
              : schools?.map((school, idx) => {
                  const pc =
                    typeof school.programmes_count === "object"
                      ? (school.programmes_count as unknown as Record<string, number>)
                      : null;
                  const initials = school.dean
                    ? school.dean
                        .split(" ")
                        .filter((w) => /^[A-Z]/.test(w))
                        .slice(0, 2)
                        .join("")
                    : null;
                  return (
                    <Link
                      key={school.code}
                      href={`/schools/${school.code}`}
                      data-testid={`card-school-${school.code}`}
                      className={idx === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
                    >
                      <div className="group h-full flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                        {/* School colour accent bar */}
                        <div
                          className="h-1.5 w-full shrink-0"
                          style={{ backgroundColor: school.colour ?? "hsl(var(--primary))" }}
                        />

                        <div className="p-6 flex flex-col flex-1">
                          {/* Dean row */}
                          <div className="flex items-center gap-3 mb-5">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 relative overflow-hidden ring-2 ring-border group-hover:ring-primary/40 transition-all"
                              style={{ backgroundColor: school.colour ?? "hsl(var(--primary))" }}
                            >
                              {initials ?? "?"}
                              {school.dean_photo && (
                                <img
                                  src={school.dean_photo}
                                  alt={school.dean ?? "Dean"}
                                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                                {school.dean ?? `Dean, ${school.name}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Dean of School
                              </p>
                            </div>
                          </div>

                          {/* School code badge */}
                          <div className="mb-2">
                            <span
                              className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: `${school.colour ?? "#1A5C38"}22`,
                                color: school.colour ?? "hsl(var(--primary))",
                              }}
                            >
                              {school.code}
                            </span>
                          </div>

                          <h3 className="font-serif text-base font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                            {school.name}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 flex-1">{school.description}</p>

                          {/* Programme level pills */}
                          <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            {pc ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                {pc.undergraduate > 0 && (
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                    {pc.undergraduate} UG
                                  </span>
                                )}
                                {pc.postgraduate > 0 && (
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                    {pc.postgraduate} PG
                                  </span>
                                )}
                                {(pc.doctoral ?? 0) > 0 && (
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                    {pc.doctoral} PhD
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {Number(school.programmes_count)} Programmes
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ─── CAMPUS LIFE PHOTO STRIP ─── */}
      <section className="py-0 bg-background">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 h-56 md:h-72">
          {[
            { src: "/imgs/undergraduate.jpg", label: "Undergraduate Life" },
            { src: "/imgs/posgraduate.jpg", label: "Postgraduate Research" },
            { src: "/imgs/art-culture.jpg", label: "Arts & Culture" },
            { src: "/imgs/sports.jpg", label: "Sports & Recreation" },
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

      {/* ─── VIRTUAL CAMPUS TOUR ─── */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Virtual Campus Tour</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Life at Kaimosi</h2>
            <p className="text-primary-foreground/75 max-w-xl mx-auto">
              Take a virtual walk through our campus — set in the serene highlands of Western Kenya, designed to inspire learning, growth, and community.
            </p>
          </div>

          {/* YouTube Virtual Tour Embed */}
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-8 bg-black"
            style={{ paddingBottom: "56.25%" }}
            data-testid="virtual-tour-video"
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/JtZa1TFGdkU?rel=0&modestbranding=1"
              title="Kaimosi Friends University Virtual Campus Tour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* 4-column campus feature tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                image: "/imgs/image-99.jpeg",
                label: "Library & Digital Resources",
                desc: "50,000+ volumes and online research databases",
                testid: "tour-tile-library",
              },
              {
                image: "/imgs/visual-acuity.jpg",
                label: "Science & Health Labs",
                desc: "State-of-the-art optometry, computing and science labs",
                testid: "tour-tile-labs",
              },
              {
                image: "/imgs/undergraduate.jpg",
                label: "Student Residences",
                desc: "On-campus accommodation in a safe, serene environment",
                testid: "tour-tile-residences",
              },
              {
                image: "/imgs/sports.jpg",
                label: "Sports & Recreation",
                desc: "Football, basketball, athletics and fitness facilities",
                testid: "tour-tile-sports",
              },
            ].map((tile) => (
              <div
                key={tile.testid}
                data-testid={tile.testid}
                className="relative rounded-xl overflow-hidden group"
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="w-full h-32 lg:h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <p className="text-white text-xs font-bold leading-tight">{tile.label}</p>
                  <p className="text-white/65 text-xs mt-0.5 line-clamp-1 hidden sm:block">{tile.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
              asChild
              data-testid="button-plan-visit"
            >
              <Link href="/contact">Plan a Campus Visit</Link>
            </Button>
            <Button
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8"
              asChild
              data-testid="button-kafu-youtube"
            >
              <a href="https://www.youtube.com/watch?v=JtZa1TFGdkU" target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── WHY KAFU — Image Carousel ─── */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why Choose KAFU?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">
              More than a university — a community of purpose, rooted in values and driven by impact.
            </p>
          </div>

          {/* Sliding cards — 3 visible on desktop, 2 on tablet, 1 on mobile */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(calc(-${whyIdx} * (100% / ${whyPerView})))` }}
              >
                {/* Duplicate slides at end for seamless looping feel */}
                {[...whyKafuSlides, ...whyKafuSlides.slice(0, 3)].map((slide, i) => (
                  <div
                    key={`why-card-${i}`}
                    className="shrink-0 w-full md:w-1/2 lg:w-1/3 px-3"
                  >
                    <Link
                      href={slide.href}
                      className="group block relative rounded-2xl overflow-hidden h-80 shadow-xl"
                      data-testid={slide.testid}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-2 bg-black/30 px-2 py-0.5 rounded w-fit">
                          {slide.category}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-white mb-2 leading-tight group-hover:text-accent transition-colors">
                          {slide.title}
                        </h3>
                        <p className="text-white/75 text-sm leading-relaxed line-clamp-2">
                          {slide.body}
                        </p>
                        <span className="flex items-center gap-1 text-accent text-sm font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          Learn more <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={() => setWhyIdx((i) => (i - 1 + whyCount) % whyCount)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-accent text-white flex items-center justify-center transition-colors z-10 shadow-lg"
              aria-label="Previous"
              data-testid="why-prev"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setWhyIdx((i) => (i + 1) % whyCount)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-accent text-white flex items-center justify-center transition-colors z-10 shadow-lg"
              aria-label="Next"
              data-testid="why-next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {whyKafuSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setWhyIdx(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === whyIdx
                    ? "w-7 h-2.5 bg-accent"
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                data-testid={`why-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROGRAMME DISCOVERY ─── */}
      <section className="py-12 md:py-20 bg-background" id="programmes">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
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
              <option value="SBE">SOBE — Business</option>
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
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 gap-4">
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
                      <span className="text-xs text-muted-foreground">Closes: {opp.deadline ? new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
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
      <section className="py-12 md:py-20 bg-primary/5 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
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
      <section className="relative py-16 md:py-24 overflow-hidden">
        <img
          src="/imgs/apply-now.jpg"
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
