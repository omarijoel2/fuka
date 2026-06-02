import React from "react";
import { Link } from "wouter";
import { useBranding, BRANDING_DEFAULTS } from "@/lib/api-hooks";

export function Footer() {
  const { data: branding } = useBranding();
  const logoUrl     = branding?.logo_primary_url ?? BRANDING_DEFAULTS.logo_primary_url;
  const logoAlt     = branding?.logo_alt          ?? BRANDING_DEFAULTS.logo_alt;
  const tagline     = branding?.tagline           ?? BRANDING_DEFAULTS.tagline;
  const description = branding?.site_description  ?? BRANDING_DEFAULTS.site_description;

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
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

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About KAFU",           href: "/about",              testid: "footer-link-about" },
                { label: "Schools & Faculties",  href: "/schools",            testid: "footer-link-schools" },
                { label: "Academic Programmes",  href: "/programmes",         testid: "footer-link-programmes" },
                { label: "Admissions",           href: "/admissions",         testid: "footer-link-admissions" },
                { label: "Apply Online",         href: "/admissions/apply",   testid: "footer-link-apply" },
                { label: "Staff Directory",      href: "/staff",              testid: "footer-link-staff-dir" },
                { label: "Contact Us",           href: "/contact",            testid: "footer-link-contact" },
              ].map(({ label, href, testid }) => (
                <li key={href}>
                  <Link href={href} className="text-primary-foreground/75 hover:text-accent transition-colors" data-testid={testid}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Opportunities */}
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-xs">Opportunities</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "All Opportunities",      href: "/opportunities",                      testid: "footer-opp-all" },
                { label: "Tenders",                href: "/opportunities?category=tender",      testid: "footer-opp-tenders" },
                { label: "Vacancies",              href: "/opportunities?category=vacancy",     testid: "footer-opp-vacancies" },
                { label: "Internships",            href: "/opportunities?category=internship",  testid: "footer-opp-internships" },
                { label: "Scholarships",           href: "/opportunities?category=scholarship", testid: "footer-opp-scholarships" },
                { label: "Calls for Applications", href: "/opportunities?category=call",        testid: "footer-opp-calls" },
                { label: "Archives",               href: "/archives",                           testid: "footer-opp-archives" },
              ].map(({ label, href, testid }) => (
                <li key={href}>
                  <Link href={href} className="text-primary-foreground/75 hover:text-accent transition-colors" data-testid={testid}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Research & Info */}
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-xs">Research & Info</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Research Overview",      href: "/research",                    testid: "footer-res-overview" },
                { label: "Research Projects",      href: "/research/projects",           testid: "footer-res-projects" },
                { label: "Publications",           href: "/research/publications",       testid: "footer-res-pubs" },
                { label: "Repository",             href: "/repository",                  testid: "footer-res-repo" },
                { label: "International",          href: "/international",               testid: "footer-res-intl" },
                { label: "Strategic Plan",         href: "/about/strategic-plan",        testid: "footer-res-sp" },
                { label: "Policies",               href: "/about/policies",              testid: "footer-res-policies" },
              ].map(({ label, href, testid }) => (
                <li key={href}>
                  <Link href={href} className="text-primary-foreground/75 hover:text-accent transition-colors" data-testid={testid}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Portals */}
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-xs">Portals</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Student Portal",    href: "https://portal.kafu.ac.ke",    testid: "footer-portal-student",   external: true },
                { label: "E-Learning",        href: "https://elearning.kafu.ac.ke", testid: "footer-portal-elearning", external: true },
                { label: "Staff Portal",      href: "https://staff.kafu.ac.ke",     testid: "footer-portal-staff",     external: true },
                { label: "CMS Admin",         href: "/kafu-cms/",                   testid: "footer-portal-cms",       external: false },
                { label: "Library Portal",    href: "https://library.kafu.ac.ke",   testid: "footer-portal-library",   external: true },
              ].map(({ label, href, testid, external }) => (
                <li key={href}>
                  {external ? (
                    <a href={href} target="_blank" rel="noreferrer"
                      className="text-primary-foreground/75 hover:text-accent transition-colors"
                      data-testid={testid}>{label}</a>
                  ) : (
                    <Link href={href} className="text-primary-foreground/75 hover:text-accent transition-colors" data-testid={testid}>
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-primary-foreground/15">
              <h4 className="font-bold mb-3 text-white uppercase tracking-wider text-xs">Governance</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "University Council", href: "/about/council",         testid: "footer-gov-council" },
                  { label: "Management",         href: "/about/management",      testid: "footer-gov-mgmt" },
                  { label: "Directorates",       href: "/directorates",          testid: "footer-gov-dir" },
                  { label: "Service Charter",    href: "/about/service-charter", testid: "footer-gov-charter" },
                ].map(({ label, href, testid }) => (
                  <li key={href}>
                    <Link href={href} className="text-primary-foreground/75 hover:text-accent transition-colors" data-testid={testid}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
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
