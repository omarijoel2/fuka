import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, ChevronRight, MapPin, Phone, ExternalLink, Search } from "lucide-react";
import { Button } from "./ui/button";
import { SearchModal } from "./search-bar";

// ─── Departments mega-menu data (grouped by school) ──────────────────────────
const DEPARTMENTS_BY_SCHOOL = [
  {
    school: "Education & Social Sciences",
    code: "SESS",
    path: "/schools/SESS",
    depts: [
      { name: "Arts & Social Sciences Education",  slug: "arts-social-sciences-education" },
      { name: "Science & Technical Education",     slug: "science-technical-education" },
      { name: "Social Work & Community Dev.",      slug: "social-work-community-development" },
      { name: "Criminology, Security & Peace",     slug: "criminology-security-peace-studies" },
    ],
  },
  {
    school: "Business & Economics",
    code: "SBE",
    path: "/schools/SBE",
    depts: [
      { name: "Business Administration & Mgmt",   slug: "business-administration-management" },
      { name: "Accounting & Finance",              slug: "accounting-finance" },
      { name: "Economics",                         slug: "economics" },
    ],
  },
  {
    school: "Computing & IT",
    code: "SCIT",
    path: "/schools/SCIT",
    depts: [
      { name: "Computer Science",                  slug: "computer-science" },
      { name: "Information Technology",            slug: "information-technology" },
    ],
  },
  {
    school: "Science",
    code: "SOS",
    path: "/schools/SOS",
    depts: [
      { name: "Biological Sciences",               slug: "biological-sciences" },
      { name: "Physical & Chemical Sciences",      slug: "physical-chemical-sciences" },
      { name: "Mathematics & Statistics",          slug: "mathematics-statistics" },
      { name: "Agricultural Economics & Rural Dev.", slug: "agricultural-economics-rural-development" },
    ],
  },
  {
    school: "Health Sciences",
    code: "SHS",
    path: "/schools/SHS",
    depts: [
      { name: "Optometry & Vision Sciences",       slug: "optometry-vision-sciences" },
      { name: "Public & Community Health",         slug: "public-community-health" },
      { name: "Medical Laboratory Sciences",       slug: "medical-laboratory-sciences" },
    ],
  },
];

// ─── Original 10-item nav structure ──────────────────────────────────────────
const navItems = [
  { name: "Home", path: "/" },
  {
    name: "About",
    path: "/about",
    megaType: "about",
  },
  {
    name: "Academics",
    path: "/schools",
    children: [
      { name: "Schools & Faculties",                  path: "/schools" },
      { name: "Programme Catalogue",                  path: "/programmes" },
      { name: "SESS — Education & Social Sciences",   path: "/schools/SESS" },
      { name: "SBE — Business & Economics",           path: "/schools/SBE" },
      { name: "SCIT — Computing & IT",                path: "/schools/SCIT" },
      { name: "SOS — Science",                        path: "/schools/SOS" },
      { name: "SHS — Health Sciences",                path: "/schools/SHS" },
    ],
  },
  {
    name: "Departments",
    path: "/schools",
    megaType: "departments",
  },
  {
    name: "Admissions",
    path: "/admissions",
    children: [
      { name: "Admissions Overview",    path: "/admissions" },
      { name: "Apply Online",           path: "/admissions/apply" },
      { name: "Track Application",      path: "/admissions/track" },
      { name: "Intake Calendar",        path: "/admissions/calendar" },
      { name: "Undergraduate (KUCCPS)", path: "/admissions#undergraduate" },
      { name: "Postgraduate",           path: "/admissions#postgraduate" },
      { name: "International Students", path: "/admissions#international" },
      { name: "Self-Sponsored",         path: "/admissions#self-sponsored" },
      { name: "International Overview", path: "/international" },
      { name: "Study at KAFU",          path: "/international/study" },
      { name: "Visa & Immigration",     path: "/international/visa" },
      { name: "Exchange Programmes",    path: "/international/exchange" },
      { name: "Our Partners",           path: "/international/partnerships" },
    ],
  },
  {
    name: "Students",
    path: "/student-services",
    children: [
      { name: "Student Services", path: "/student-services" },
      { name: "Student Portal",   path: "https://portal.kafu.ac.ke",   external: true },
      { name: "E-Learning",       path: "https://elearning.kafu.ac.ke", external: true },
    ],
  },
  {
    name: "News",
    path: "/news",
    children: [
      { name: "Latest News",     path: "/news" },
      { name: "Events Calendar", path: "/events" },
      { name: "Announcements",   path: "/announcements" },
      { name: "Archives",        path: "/archives" },
    ],
  },
  {
    name: "Media",
    path: "/media",
    children: [
      { name: "Media Overview",     path: "/media" },
      { name: "Photo Gallery",      path: "/gallery" },
      { name: "Video Gallery",      path: "/media/videos" },
      { name: "Press Releases",     path: "/media/press-releases" },
      { name: "Publications",       path: "/media/publications" },
      { name: "Downloads",          path: "/media/downloads" },
      { name: "Branding Resources", path: "/media/branding" },
    ],
  },
  {
    name: "Research",
    path: "/research",
    children: [
      { name: "Research Overview",        path: "/research" },
      { name: "Research Projects",        path: "/research/projects" },
      { name: "Publications",             path: "/research/publications" },
      { name: "Partnerships & Grants",    path: "/research/partnerships" },
      { name: "Institutional Repository", path: "/repository" },
    ],
  },
  {
    name: "Directorates",
    path: "/directorates",
    children: [
      { name: "All Directorates",          path: "/directorates" },
      { name: "Graduate Studies",          path: "/directorates/graduate-studies" },
      { name: "Research & Innovation",     path: "/directorates/research-innovation" },
      { name: "ICT",                       path: "/directorates/ict" },
      { name: "Quality Assurance",         path: "/directorates/quality-assurance" },
      { name: "International Relations",   path: "/directorates/international-relations" },
      { name: "Corporate Communications",  path: "/directorates/corporate-communications" },
      { name: "Student Affairs",           path: "/directorates/student-affairs" },
      { name: "Finance",                   path: "/directorates/finance" },
      { name: "Procurement",               path: "/directorates/procurement" },
    ],
  },
  { name: "Contact",       path: "/contact" },
];

type Child   = { name: string; path: string; external?: boolean };
type NavItem = { name: string; path: string; children?: Child[]; mega?: boolean; megaType?: "departments" | "about" };

// ─── Desktop Dropdown ────────────────────────────────────────────────────────
function DropdownPanel({ item, onClose }: { item: NavItem; onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-56 bg-white rounded-b-xl shadow-2xl border-t-2 border-accent py-2 z-50">
      {item.children!.map((child) =>
        child.external ? (
          <a
            key={child.path}
            href={child.path}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground/80 hover:bg-primary hover:text-white transition-colors group"
            data-testid={`nav-dropdown-${child.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {child.name}
            <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100" />
          </a>
        ) : (
          <Link
            key={child.path}
            href={child.path}
            className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-primary hover:text-white transition-colors"
            onClick={onClose}
            data-testid={`nav-dropdown-${child.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {child.name}
          </Link>
        )
      )}
    </div>
  );
}

// ─── Departments Mega Panel ───────────────────────────────────────────────────
function DepartmentsMegaPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-50 bg-white shadow-2xl border-t-2 border-accent rounded-b-xl"
      style={{ width: "780px" }}>
      <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100 p-4">
        {DEPARTMENTS_BY_SCHOOL.map((group) => (
          <div key={group.code} className="px-4 first:pl-0 last:pr-0">
            <Link
              href={group.path}
              onClick={onClose}
              className="block text-xs font-bold uppercase tracking-widest text-primary/60 hover:text-primary mb-2 pb-1 border-b border-gray-100"
              data-testid={`nav-dept-school-${group.code.toLowerCase()}`}
            >
              {group.school}
            </Link>
            {group.depts.map((dept) => (
              <Link
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                onClick={onClose}
                className="block py-1.5 text-xs text-foreground/75 hover:text-primary hover:bg-primary/5 rounded px-1 -ml-1 transition-colors leading-snug"
                data-testid={`nav-dept-${dept.slug}`}
              >
                {dept.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between bg-gray-50 rounded-b-xl">
        <span className="text-xs text-gray-400">16 departments across 5 schools</span>
        <Link
          href="/schools"
          onClick={onClose}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          data-testid="nav-dept-view-schools"
        >
          View all schools <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// ─── About Mega Panel ────────────────────────────────────────────────────────
const ABOUT_GROUPS = [
  {
    heading: "The University",
    links: [
      { name: "About KAFU",              path: "/about" },
      { name: "Vision & Mission",        path: "/about#vision" },
      { name: "Strategic Plan",          path: "/about/strategic-plan" },
      { name: "Policies & Regulations",  path: "/about/policies" },
      { name: "Service Charter",         path: "/about/service-charter" },
      { name: "Our Campuses",            path: "/campuses" },
    ],
  },
  {
    heading: "Governance",
    links: [
      { name: "University Council",      path: "/about/council" },
      { name: "Vice-Chancellor",         path: "/about/management" },
      { name: "University Management",   path: "/about/management" },
    ],
  },
  {
    heading: "Our People",
    links: [
      { name: "Directorates",            path: "/directorates" },
      { name: "Contact Us",              path: "/contact" },
    ],
  },
];

function AboutMegaPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-50 bg-white shadow-2xl border-t-2 border-accent rounded-b-xl"
      style={{ width: "560px" }}
    >
      <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100 p-4">
        {ABOUT_GROUPS.map((group) => (
          <div key={group.heading} className="px-4 first:pl-0 last:pr-0">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-2 pb-1 border-b border-gray-100">
              {group.heading}
            </p>
            {group.links.map((link) => (
              <Link
                key={link.path + link.name}
                href={link.path}
                onClick={onClose}
                className="block py-1.5 text-xs text-foreground/75 hover:text-primary hover:bg-primary/5 rounded px-1 -ml-1 transition-colors leading-snug"
                data-testid={`nav-about-${link.name.toLowerCase().replace(/[\s&]+/g, "-")}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-end bg-gray-50 rounded-b-xl">
        <Link
          href="/about"
          onClick={onClose}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          data-testid="nav-about-overview"
        >
          University overview <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// ─── Mobile Accordion Item ────────────────────────────────────────────────────
function MobileNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [location]      = useLocation();
  const isActive        = item.path === "/" ? location === "/" : location.startsWith(item.path);

  // About mega item — accordion grouped by section
  if (item.megaType === "about") {
    return (
      <div className="border-b border-gray-100">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors ${
            isActive ? "text-accent" : "text-foreground hover:bg-gray-50"
          }`}
          data-testid="mobile-nav-about"
        >
          About
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </button>
        {open && (
          <div className="bg-gray-50 border-t border-gray-100 pb-2">
            {ABOUT_GROUPS.map((group) => (
              <div key={group.heading} className="mt-2">
                <p className="pl-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary/60">
                  {group.heading}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={link.path + link.name}
                    href={link.path}
                    onClick={onClose}
                    className="block pl-8 pr-5 py-2 text-sm text-muted-foreground hover:text-primary"
                    data-testid={`mobile-about-${link.name.toLowerCase().replace(/[\s&]+/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Departments mega item — accordion grouped by school
  if (item.megaType === "departments") {

    return (
      <div className="border-b border-gray-100">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors ${
            isActive ? "text-accent" : "text-foreground hover:bg-gray-50"
          }`}
          data-testid="mobile-nav-departments"
        >
          Departments
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </button>
        {open && (
          <div className="bg-gray-50 border-t border-gray-100 pb-2">
            {DEPARTMENTS_BY_SCHOOL.map((group) => (
              <div key={group.code} className="mt-2">
                <Link
                  href={group.path}
                  onClick={onClose}
                  className="block pl-5 pr-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary/60 hover:text-primary"
                  data-testid={`mobile-dept-school-${group.code.toLowerCase()}`}
                >
                  {group.school}
                </Link>
                {group.depts.map((dept) => (
                  <Link
                    key={dept.slug}
                    href={`/departments/${dept.slug}`}
                    onClick={onClose}
                    className="block pl-8 pr-5 py-2 text-sm text-muted-foreground hover:text-primary"
                    data-testid={`mobile-dept-${dept.slug}`}
                  >
                    {dept.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.children) {
    return (
      <Link
        href={item.path}
        onClick={onClose}
        className={`flex items-center px-5 py-4 text-sm font-semibold border-b border-gray-100 transition-colors ${
          isActive ? "text-accent bg-accent/5" : "text-foreground hover:bg-gray-50"
        }`}
        data-testid={`mobile-nav-${item.name.toLowerCase()}`}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors ${
          isActive ? "text-accent" : "text-foreground hover:bg-gray-50"
        }`}
        data-testid={`mobile-nav-${item.name.toLowerCase()}`}
      >
        {item.name}
        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="bg-gray-50 border-t border-gray-100">
          {item.children.map((child) =>
            child.external ? (
              <a
                key={child.path}
                href={child.path}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 pl-8 pr-5 py-3 text-sm text-muted-foreground hover:text-primary"
              >
                {child.name}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ) : (
              <Link
                key={child.path}
                href={child.path}
                onClick={onClose}
                className="block pl-8 pr-5 py-3 text-sm text-muted-foreground hover:text-primary"
              >
                {child.name}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export function Navbar() {
  const [mobileOpen,   setMobileOpen]   = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [location]                      = useLocation();
  const navRowRef                       = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRowRef.current && !navRowRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  React.useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive    = (path: string) => path === "/" ? location === "/" : location.startsWith(path);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">

      {/* ── Row 1: Utility bar — desktop only ── */}
      <div className="hidden sm:block bg-primary text-primary-foreground py-1.5 text-xs">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4 opacity-90">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="hidden md:inline">P.O BOX 385 – 50309, </span>Kaimosi, Kenya
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0" />
              +254 777 373 633
            </span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer"
               className="hover:text-accent transition-colors" data-testid="link-student-portal">
              Student Portal
            </a>
            <span className="opacity-40">|</span>
            <a href="https://elearning.kafu.ac.ke" target="_blank" rel="noreferrer"
               className="hover:text-accent transition-colors" data-testid="link-elearning">
              E-Learning
            </a>
            <span className="opacity-40 hidden md:inline">|</span>
            <a href="mailto:info@kafu.ac.ke"
               className="hover:text-accent transition-colors hidden md:inline" data-testid="link-email">
              info@kafu.ac.ke
            </a>
          </div>
        </div>
      </div>

      {/* ── Row 2: Logo + Apply Now / Hamburger ── */}
      <div className="container mx-auto px-4 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0" data-testid="link-home-logo">
          <img
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png"
            alt="Kaimosi Friends University"
            className="h-11 object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
              const p = img.parentElement;
              if (p) p.innerHTML = `<div class="flex flex-col leading-tight"><span class="font-serif font-bold text-xl text-primary">KAFU</span><span class="text-xs text-accent italic">Spring of Knowledge</span></div>`;
            }}
          />
        </Link>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-md text-foreground hover:bg-muted transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            data-testid="button-open-search"
          >
            <Search className="w-4 h-4" />
          </button>
          <Button
            asChild
            size="sm"
            className="hidden xl:flex bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-5"
            data-testid="button-apply-now"
          >
            <a href="/admissions">Apply Now</a>
          </Button>

          <button
            className="xl:hidden flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Row 3: Full-width nav — desktop xl+ only ── */}
      <div className="hidden xl:block border-t border-gray-100" ref={navRowRef}>
        <nav className="container mx-auto px-4 flex items-center justify-center gap-0">
          {navItems.map((item) => (
            <div key={item.name} className="relative">
              {item.megaType ? (
                <div
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    className={`flex items-center gap-0.5 px-3 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                      isActive(item.path)
                        ? "border-accent text-accent"
                        : "border-transparent text-foreground hover:text-primary hover:border-primary/30"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.name}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.name ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === item.name && (
                    item.megaType === "about"
                      ? <AboutMegaPanel onClose={() => setOpenDropdown(null)} />
                      : <DepartmentsMegaPanel onClose={() => setOpenDropdown(null)} />
                  )}
                </div>
              ) : item.children ? (
                <div
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    className={`flex items-center gap-0.5 px-3 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                      isActive(item.path)
                        ? "border-accent text-accent"
                        : "border-transparent text-foreground hover:text-primary hover:border-primary/30"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.name}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.name ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === item.name && (
                    <DropdownPanel item={item} onClose={() => setOpenDropdown(null)} />
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`block px-3 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                    isActive(item.path)
                      ? "border-accent text-accent"
                      : "border-transparent text-foreground hover:text-primary hover:border-primary/30"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 top-[68px] z-40 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeMobile} />
          <div className="relative w-full max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="bg-primary px-5 py-3 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">Menu</span>
              <div className="flex gap-3 text-xs text-white/80">
                <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer" className="hover:text-accent">Portal</a>
                <span className="opacity-40">|</span>
                <a href="https://elearning.kafu.ac.ke" target="_blank" rel="noreferrer" className="hover:text-accent">E-Learning</a>
              </div>
            </div>
            <div className="flex-1">
              {navItems.map((item) => (
                <MobileNavItem key={item.name} item={item} onClose={closeMobile} />
              ))}
            </div>
            <div className="p-4 border-t">
              <a
                href="/admissions"
                onClick={closeMobile}
                className="block w-full text-center py-3.5 bg-accent text-accent-foreground rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors"
                data-testid="mobile-button-apply-now"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      )}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
