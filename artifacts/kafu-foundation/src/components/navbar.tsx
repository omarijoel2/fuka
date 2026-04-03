import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { name: "Home", path: "/" },
  {
    name: "About",
    path: "/about",
    children: [
      { name: "About KAFU", path: "/about" },
      { name: "Vision & Mission", path: "/about#vision" },
      { name: "Staff Directory", path: "/staff" },
      { name: "Contact Us", path: "/contact" },
    ],
  },
  {
    name: "Academics",
    path: "/schools",
    children: [
      { name: "Schools & Faculties", path: "/schools" },
      { name: "Programme Catalogue", path: "/programmes" },
      { name: "SESS — Education & Social Sciences", path: "/schools/SESS" },
      { name: "SBE — Business & Economics", path: "/schools/SBE" },
      { name: "SCIT — Computing & IT", path: "/schools/SCIT" },
      { name: "SOS — Science", path: "/schools/SOS" },
      { name: "SHS — Health Sciences", path: "/schools/SHS" },
    ],
  },
  {
    name: "Admissions",
    path: "/admissions",
    children: [
      { name: "Admissions Overview", path: "/admissions" },
      { name: "Undergraduate (KUCCPS)", path: "/admissions#undergraduate" },
      { name: "Postgraduate", path: "/admissions#postgraduate" },
      { name: "International Students", path: "/admissions#international" },
      { name: "Self-Sponsored", path: "/admissions#self-sponsored" },
    ],
  },
  {
    name: "Students",
    path: "/student-services",
    children: [
      { name: "Student Services", path: "/student-services" },
      { name: "Student Portal", path: "https://portal.kafu.ac.ke", external: true },
      { name: "E-Learning", path: "https://elearning.kafu.ac.ke", external: true },
    ],
  },
  { name: "News", path: "/news" },
  { name: "Opportunities", path: "/opportunities" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [location] = useLocation();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? location === "/" : location.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-white">
      {/* Utility Bar */}
      <div className="bg-primary text-primary-foreground py-1.5 text-xs">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4 opacity-90">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              P.O BOX 385 – 50309, Kaimosi, Kenya
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0" />
              +254 777 373 633
            </span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <a
              href="https://portal.kafu.ac.ke"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
              data-testid="link-student-portal"
            >
              Student Portal
            </a>
            <span className="opacity-40">|</span>
            <a
              href="https://elearning.kafu.ac.ke"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
              data-testid="link-elearning"
            >
              E-Learning
            </a>
            <span className="opacity-40 hidden sm:inline">|</span>
            <a
              href="mailto:info@kafu.ac.ke"
              className="hover:text-accent transition-colors hidden sm:inline"
              data-testid="link-email"
            >
              info@kafu.ac.ke
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 h-[70px] flex items-center justify-between" ref={dropdownRef}>
        <Link href="/" className="flex items-center shrink-0" data-testid="link-home-logo">
          <img
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png"
            alt="Kaimosi Friends University"
            className="h-11 object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
              const parent = img.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="flex flex-col"><span class="font-serif font-bold text-xl text-primary leading-tight">KAFU</span><span class="text-xs text-accent italic">Spring of Knowledge</span></div>`;
              }
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <div key={item.path} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-accent bg-accent/10"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.name ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border py-2 z-50"
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.children.map((child) =>
                        child.external ? (
                          <a
                            key={child.path}
                            href={child.path}
                            target="_blank"
                            rel="noreferrer"
                            className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                            data-testid={`nav-dropdown-${child.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {child.name}
                          </a>
                        ) : (
                          <Link
                            key={child.path}
                            href={child.path}
                            className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => setOpenDropdown(null)}
                            data-testid={`nav-dropdown-${child.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {child.name}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-accent bg-accent/10"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <Button
            asChild
            className="ml-3 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            data-testid="button-apply-now"
          >
            <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
              Apply Now
            </a>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white flex flex-col max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.path}>
              <Link
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3.5 text-sm font-medium border-b border-muted ${
                  isActive(item.path) ? "text-accent bg-accent/5" : "text-foreground hover:bg-muted"
                }`}
                data-testid={`mobile-nav-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
              {item.children && (
                <div className="bg-muted/50">
                  {item.children.map((child) =>
                    child.external ? (
                      <a
                        key={child.path}
                        href={child.path}
                        target="_blank"
                        rel="noreferrer"
                        className="block pl-8 pr-5 py-2.5 text-xs text-muted-foreground hover:text-primary border-b border-muted"
                      >
                        {child.name}
                      </a>
                    ) : (
                      <Link
                        key={child.path}
                        href={child.path}
                        onClick={() => setIsOpen(false)}
                        className="block pl-8 pr-5 py-2.5 text-xs text-muted-foreground hover:text-primary border-b border-muted"
                      >
                        {child.name}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="p-4">
            <a
              href="https://portal.kafu.ac.ke"
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center py-3 bg-accent text-accent-foreground rounded-lg font-semibold"
              data-testid="mobile-button-apply-now"
            >
              Apply Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
