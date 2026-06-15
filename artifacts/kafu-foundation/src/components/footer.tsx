import React from "react";
import { Link } from "wouter";
import { useBranding, BRANDING_DEFAULTS, useNavConfig } from "@/lib/api-hooks";

interface FooterItem {
  label: string;
  url: string;
  external?: boolean;
}
interface FooterGroup {
  group: string;
  items: FooterItem[];
}

const FALLBACK_FOOTER_GROUPS: FooterGroup[] = [
  {
    group: "Quick Links",
    items: [
      { label: "About KAFU", url: "/about" },
      { label: "Schools & Faculties", url: "/schools" },
      { label: "Academic Programmes", url: "/programmes" },
      { label: "Admissions", url: "/admissions" },
      { label: "Apply Online", url: "/admissions/apply" },
      { label: "Staff Directory", url: "/staff" },
      { label: "Anti-Bribery and Corruption", url: "/about/anti-bribery-corruption" },
      { label: "Contact Us", url: "/contact" },
    ],
  },
  {
    group: "Opportunities",
    items: [
      { label: "All Opportunities", url: "/opportunities" },
      { label: "Tenders", url: "/opportunities?category=tender" },
      { label: "Vacancies", url: "/opportunities?category=vacancy" },
      { label: "Internships", url: "/opportunities?category=internship" },
      { label: "Scholarships", url: "/opportunities?category=scholarship" },
      { label: "Calls for Applications", url: "/opportunities?category=call" },
      { label: "Archives", url: "/archives" },
    ],
  },
  {
    group: "Research & Info",
    items: [
      { label: "Research Overview", url: "/research" },
      { label: "Research Projects", url: "/research/projects" },
      { label: "Publications", url: "/research/publications" },
      { label: "Repository", url: "/repository" },
      { label: "International", url: "/international" },
      { label: "Strategic Plan", url: "/about/strategic-plan" },
      { label: "Policies", url: "/about/policies" },
    ],
  },
  {
    group: "Portals",
    items: [
      { label: "Student Portal", url: "https://portal.kafu.ac.ke" },
      { label: "E-Learning", url: "https://elearning.kafu.ac.ke" },
      { label: "Staff Portal", url: "/staff" },
      { label: "Library Portal", url: "https://library.kafu.ac.ke" },
    ],
  },
  {
    group: "Governance",
    items: [
      { label: "University Council", url: "/about/council" },
      { label: "Management", url: "/about/management" },
      { label: "Directorates", url: "/directorates" },
      { label: "Service Charter", url: "/about/service-charter" },
    ],
  },
];

function isExternal(url: string, explicit?: boolean): boolean {
  if (explicit) return true;
  return /^(https?:)?\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function Footer() {
  const { data: branding } = useBranding();
  const { data: navConfig } = useNavConfig();

  const logoUrl     = branding?.logo_primary_url ?? BRANDING_DEFAULTS.logo_primary_url;
  const logoAlt     = branding?.logo_alt          ?? BRANDING_DEFAULTS.logo_alt;
  const tagline     = branding?.tagline           ?? BRANDING_DEFAULTS.tagline;
  const description = branding?.site_description  ?? BRANDING_DEFAULTS.site_description;

  const footerGroups: FooterGroup[] =
    navConfig?.footer_nav && navConfig.footer_nav.length > 0
      ? (navConfig.footer_nav as FooterGroup[])
      : FALLBACK_FOOTER_GROUPS;

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Brand */}
          <div className="lg:col-span-3">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-10 object-contain mb-4 brightness-0 invert"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
            <p className="text-primary-foreground/75 mb-5 text-sm leading-relaxed">
              {tagline}. {description}
            </p>
            <div className="space-y-1.5 text-sm text-primary-foreground/70">
              <p>P.O BOX 385 – 50309, Kaimosi</p>
              <p>+254 777 373 633</p>
              <a href="mailto:info@kafu.ac.ke" className="hover:text-accent transition-colors">info@kafu.ac.ke</a>
            </div>
            {/* Social links */}
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com/kafu.ac.ke" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-xs font-bold"
                data-testid="footer-social-fb" aria-label="Facebook">F</a>
              <a href="https://twitter.com/kafukenya" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-xs font-bold"
                data-testid="footer-social-x" aria-label="X / Twitter">X</a>
              <a href="https://linkedin.com/school/kaimosi-friends-university" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-xs font-bold"
                data-testid="footer-social-li" aria-label="LinkedIn">in</a>
              <a href="https://youtube.com/@kafukenya" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors text-xs font-bold"
                data-testid="footer-social-yt" aria-label="YouTube">YT</a>
            </div>
          </div>

          {/* Link columns (CMS-managed via Navigation manager → Footer tab) */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {footerGroups.map((group, gi) => (
                <div key={`${group.group}-${gi}`} data-testid={`footer-group-${slugify(group.group) || gi}`}>
                  <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-xs">{group.group}</h4>
                  <ul className="space-y-2 text-sm">
                    {(group.items ?? []).map((item, ii) => {
                      const testid = `footer-link-${slugify(group.group) || gi}-${slugify(item.label) || ii}`;
                      return (
                        <li key={`${item.url}-${ii}`}>
                          {isExternal(item.url, item.external) ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary-foreground/75 hover:text-accent transition-colors"
                              data-testid={testid}
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link
                              href={item.url}
                              className="text-primary-foreground/75 hover:text-accent transition-colors"
                              data-testid={testid}
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Kaimosi Friends University. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/about/policies" className="hover:text-white transition-colors" data-testid="footer-privacy">Privacy Policy</Link>
            <a href="/terms" className="hover:text-white transition-colors" data-testid="footer-terms">Terms of Service</a>
            <Link href="/about/service-charter" className="hover:text-white transition-colors" data-testid="footer-charter-link">Service Charter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
