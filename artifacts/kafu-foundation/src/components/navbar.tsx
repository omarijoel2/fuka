import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, ChevronRight, MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

// ─── Navigation structure ───────────────────────────────────────────────────
const navItems = [
  {
    name: "About",
    path: "/about",
    children: [
      { name: "About KAFU",         path: "/about" },
      { name: "Vision & Mission",   path: "/about#vision" },
      { name: "Leadership & Staff", path: "/staff" },
      { name: "Campuses",           path: "/campuses" },
      { name: "Offices & Services", path: "/offices" },
      { name: "Contact Us",         path: "/contact" },
    ],
  },
  {
    name: "Academics",
    path: "/schools",
    children: [
      { name: "Schools & Faculties",            path: "/schools" },
      { name: "Programme Catalogue",            path: "/programmes" },
      { name: "SESS — Education & Social Sci.", path: "/schools/SESS" },
      { name: "SBE — Business & Economics",     path: "/schools/SBE" },
      { name: "SCIT — Computing & IT",          path: "/schools/SCIT" },
      { name: "SOS — Science",                  path: "/schools/SOS" },
      { name: "SHS — Health Sciences",          path: "/schools/SHS" },
    ],
  },
  {
    name: "Admissions",
    path: "/admissions",
    children: [
      { name: "Admissions Overview",    path: "/admissions" },
      { name: "Eligibility Checker",    path: "/admissions/eligibility" },
      { name: "Tuition & Fees",         path: "/admissions/fees" },
      { name: "Undergraduate (KUCCPS)", path: "/admissions#undergraduate" },
      { name: "Postgraduate",           path: "/admissions#postgraduate" },
      { name: "International Students", path: "/admissions#international" },
      { name: "Self-Sponsored",         path: "/admissions#self-sponsored" },
    ],
  },
  {
    name: "Research",
    path: "/research",
    children: [
      { name: "Research Overview",     path: "/research" },
      { name: "Projects",              path: "/research/projects" },
      { name: "Publications",          path: "/research/publications" },
      { name: "Partnerships & Grants", path: "/research/partnerships" },
      { name: "Repository",            path: "/repository" },
      { name: "International",         path: "/international" },
      { name: "Exchange Programmes",   path: "/international/exchange" },
      { name: "Global Partners",       path: "/international/partnerships" },
    ],
  },
  {
    name: "Campus Life",
    path: "/student-services",
    children: [
      { name: "Student Services", path: "/student-services" },
      { name: "News",             path: "/news" },
      { name: "Events",           path: "/events" },
      { name: "Announcements",    path: "/announcements" },
      { name: "Opportunities",    path: "/opportunities" },
      { name: "Student Portal",   path: "https://portal.kafu.ac.ke",   external: true },
      { name: "E-Learning",       path: "https://elearning.kafu.ac.ke", external: true },
    ],
  },
  { name: "Contact", path: "/contact" },
];

type Child    = { name: string; path: string; external?: boolean };
type NavItem  = { name: string; path: string; children?: Child[] };

// ─── Desktop Dropdown ────────────────────────────────────────────────────────
function DropdownPanel({ item, onClose }: { item: NavItem; onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-60 bg-white rounded-b-xl shadow-2xl border-t-2 border-accent py-2 z-50">
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

// ─── Mobile Accordion Item ────────────────────────────────────────────────────
function MobileNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [location]      = useLocation();
  const isActive        = item.path === "/" ? location === "/" : location.startsWith(item.path);

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
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5 opacity-90">
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
      <div className="container mx-auto px-6 h-[68px] flex items-center justify-between">
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

        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="hidden lg:flex bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-5"
            data-testid="button-apply-now"
          >
            <a href="/admissions">Apply Now</a>
          </Button>

          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Row 3: Full-width nav — desktop (lg+) only ── */}
      <div className="hidden lg:block border-t border-gray-100" ref={navRowRef}>
        <nav className="container mx-auto px-6 flex items-center justify-center gap-1">
          {navItems.map((item) => (
            <div key={item.name} className="relative">
              {item.children ? (
                <div
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    className={`flex items-center gap-1 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                      isActive(item.path)
                        ? "border-accent text-accent"
                        : "border-transparent text-foreground hover:text-primary hover:border-primary/30"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.name ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === item.name && (
                    <DropdownPanel item={item} onClose={() => setOpenDropdown(null)} />
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`block px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
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
        <div className="lg:hidden fixed inset-0 top-[68px] z-40 flex">
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
    </header>
  );
}
