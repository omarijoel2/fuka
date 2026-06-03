import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, ChevronRight, MapPin, Phone, ExternalLink, Search } from "lucide-react";
import { Button } from "./ui/button";
import { SearchModal } from "./search-bar";
import { useBranding, BRANDING_DEFAULTS, useNavConfig } from "@/lib/api-hooks";
import type { CmsPrimaryNavItem } from "@/lib/api-hooks";

// ─── Departments mega-menu data (grouped by school) ──────────────────────────
// Slugs MUST match the `slug` column in the `departments` table (DepartmentSeeder)
const DEPARTMENTS_BY_SCHOOL = [
  {
    school: "Education & Social Sciences",
    code: "SESS",
    path: "/schools/SESS",
    depts: [
      { name: "Educational Foundations & Psychology", slug: "educational-foundations-psychology-management" },
      { name: "Curriculum & Instruction",             slug: "curriculum-instruction" },
      { name: "Languages & Literature",               slug: "languages-literature" },
      { name: "Social Sciences",                      slug: "social-sciences" },
    ],
  },
  {
    school: "Business & Economics",
    code: "SBE",
    path: "/schools/SBE",
    depts: [
      { name: "Business Administration & Mgmt",    slug: "business-administration-management" },
      { name: "Accounting, Finance & Economics",   slug: "accounting-finance-economics" },
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
      { name: "Physical & Biological Sciences",   slug: "physical-biological-sciences" },
      { name: "Mathematics & Statistics",         slug: "mathematics-statistics" },
    ],
  },
  {
    school: "Health Sciences",
    code: "SHS",
    path: "/schools/SHS",
    depts: [
      { name: "Optometry & Vision Sciences",           slug: "optometry-vision-sciences" },
      { name: "Nursing",                               slug: "nursing" },
      { name: "Clinical Medicine & Community Health",  slug: "clinical-medicine-community-health" },
    ],
  },
];

// ─── Nav types ────────────────────────────────────────────────────────────────
type MegaLink  = { name: string; path: string; external?: boolean };
type MegaGroup = { heading: string; links: MegaLink[] };
type MegaFooterLink = { label: string; path: string; testid: string };
type Child   = { name: string; path: string; external?: boolean };
type NavItem = {
  name: string;
  path: string;
  children?: Child[];
  megaType?: "departments";
  megaGroups?: MegaGroup[];
  megaWidth?: number;
  megaCols?: 2 | 3 | 4;
  megaFooter?: MegaFooterLink[];
};

// ─── CMS → NavItem mapper ─────────────────────────────────────────────────────

function cmsToNavItems(items: CmsPrimaryNavItem[]): NavItem[] {
  if (!items?.length) return [];
  return items.map((item) => {
    const name = item.label;
    const path = item.url;

    if (item.type === "departments") {
      return { name, path, megaType: "departments" as const };
    }

    if (item.mega_groups?.length) {
      return {
        name,
        path,
        megaWidth: item.mega_width,
        megaCols: item.mega_cols as (2 | 3 | 4 | undefined),
        megaGroups: item.mega_groups.map((g) => ({
          heading: g.heading,
          links: g.links.map((l) => ({ name: l.label, path: l.url, external: l.external })),
        })),
        megaFooter: item.mega_footer?.map((f, i) => ({
          label: f.label,
          path: f.url,
          testid: `nav-${name.toLowerCase().replace(/\s+/g, "-")}-footer-${i}`,
        })),
      };
    }

    if (item.children?.length) {
      return {
        name,
        path,
        children: item.children.map((c) => ({
          name: c.label,
          path: c.url,
          external: c.external ?? c.url.startsWith("http"),
        })),
      };
    }

    return { name, path };
  });
}

// ─── Desktop Dropdown ────────────────────────────────────────────────────────
function DropdownPanel({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const count = item.children!.length;
  const multiCol = count > 6;
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white rounded-b-xl shadow-2xl border-t-2 border-accent z-50 ${multiCol ? "w-96" : "w-56"}`}
    >
      <div className={multiCol ? "grid grid-cols-2 py-2" : "py-2"}>
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

// ─── Generic Grouped Mega Panel ───────────────────────────────────────────────
function GenericMegaPanel({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const cols   = item.megaCols ?? 2;
  const width  = item.megaWidth ?? 420;
  const groups = item.megaGroups!;
  const footer = item.megaFooter;
  const slug   = item.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-50 bg-white shadow-2xl border-t-2 border-accent rounded-b-xl"
      style={{ width: `${width}px` }}
    >
      <div
        className={`grid gap-0 divide-x divide-gray-100 p-4 ${
          cols === 4 ? "grid-cols-4" : cols === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {groups.map((group) => (
          <div key={group.heading} className="px-4 first:pl-0 last:pr-0">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-2 pb-1 border-b border-gray-100">
              {group.heading}
            </p>
            {group.links.map((link) =>
              link.external ? (
                <a
                  key={link.path + link.name}
                  href={link.path}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 py-1.5 text-xs text-foreground/75 hover:text-primary hover:bg-primary/5 rounded px-1 -ml-1 transition-colors leading-snug"
                  data-testid={`nav-${slug}-${link.name.toLowerCase().replace(/[\s&()—]+/g, "-")}`}
                >
                  {link.name}
                  <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                </a>
              ) : (
                <Link
                  key={link.path + link.name}
                  href={link.path}
                  onClick={onClose}
                  className="block py-1.5 text-xs text-foreground/75 hover:text-primary hover:bg-primary/5 rounded px-1 -ml-1 transition-colors leading-snug"
                  data-testid={`nav-${slug}-${link.name.toLowerCase().replace(/[\s&()—]+/g, "-")}`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        ))}
      </div>
      {footer && footer.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-end gap-6 bg-gray-50 rounded-b-xl">
          {footer.map((f) => (
            <Link
              key={f.testid}
              href={f.path}
              onClick={onClose}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              data-testid={f.testid}
            >
              {f.label} <ChevronRight className="w-3 h-3" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mobile Accordion Item ────────────────────────────────────────────────────
function MobileNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [location]      = useLocation();
  const isActive        = item.path === "/" ? location === "/" : location.startsWith(item.path);

  // Generic grouped mega items (megaGroups)
  if (item.megaGroups) {
    const slug = item.name.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="border-b border-gray-100">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors ${
            isActive ? "text-accent" : "text-foreground hover:bg-gray-50"
          }`}
          data-testid={`mobile-nav-${slug}`}
        >
          {item.name}
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </button>
        {open && (
          <div className="bg-gray-50 border-t border-gray-100 pb-2">
            {item.megaGroups.map((group) => (
              <div key={group.heading} className="mt-2">
                <p className="pl-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary/60">
                  {group.heading}
                </p>
                {group.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.path + link.name}
                      href={link.path}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 pl-8 pr-5 py-2 text-sm text-muted-foreground hover:text-primary"
                      data-testid={`mobile-${slug}-${link.name.toLowerCase().replace(/[\s&()—]+/g, "-")}`}
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      key={link.path + link.name}
                      href={link.path}
                      onClick={onClose}
                      className="block pl-8 pr-5 py-2 text-sm text-muted-foreground hover:text-primary"
                      data-testid={`mobile-${slug}-${link.name.toLowerCase().replace(/[\s&()—]+/g, "-")}`}
                    >
                      {link.name}
                    </Link>
                  )
                )}
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
  const { data: branding }   = useBranding();
  const { data: navConfig }  = useNavConfig();
  const logoUrl = branding?.logo_primary_url ?? BRANDING_DEFAULTS.logo_primary_url;
  const logoAlt = branding?.logo_alt         ?? BRANDING_DEFAULTS.logo_alt;
  const resolvedNavItems = React.useMemo(
    () => cmsToNavItems(navConfig?.primary_nav ?? []),
    [navConfig]
  );
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
            src={logoUrl}
            alt={logoAlt}
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
          {resolvedNavItems.map((item) => (
            <div key={item.name} className="relative">
              {(item.megaGroups || item.megaType === "departments") ? (
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
                    item.megaType === "departments"
                      ? <DepartmentsMegaPanel onClose={() => setOpenDropdown(null)} />
                      : <GenericMegaPanel item={item} onClose={() => setOpenDropdown(null)} />
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
              {resolvedNavItems.map((item) => (
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
