export default function Overview() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Foundation Layer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          The master system blueprint for the Kaimosi Friends University (KAFU) Digital Platform. 
          This document establishes the standards, governance, and architecture that all future KAFU digital products will depend on.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Purpose and Scope</h2>
        <div className="prose prose-slate max-w-none text-foreground">
          <p>
            The KAFU Digital Platform Foundation Layer serves as the authoritative source of truth for all digital development at the university. It is designed to ensure consistency, accessibility, security, and maintainability across the entire digital ecosystem.
          </p>
          <p>
            Whether you are building the main university website, a departmental portal, or an internal application, these standards must be adhered to. This prevents fragmentation, reduces technical debt, and provides a unified, premium experience for students, staff, and external stakeholders.
          </p>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">1</span>
            For Designers
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Use the Design System and Component Inventory to create layouts that align with the KAFU brand identity. Do not invent new UI patterns unless absolutely necessary.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">2</span>
            For Developers
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Implement the standards laid out in the Security Baseline, SEO Framework, and Accessibility guides. Use the documented components to build interfaces.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">3</span>
            For Content Creators
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Follow the CMS Governance rules for structuring content. Understand your capabilities within the Roles & Permissions matrix.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">4</span>
            For Administrators
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ensure compliance across the platform. Utilize the Analytics Event Map to track KPIs and measure platform success.
          </p>
        </div>
      </div>

      <section className="space-y-6 pt-4">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Institutional Profile</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-lg border border-border space-y-3">
            <h3 className="font-bold text-base text-foreground">Schools & Faculties</h3>
            <ul className="space-y-2 text-sm">
              {[
                { code: "SESS", name: "School of Education & Social Sciences" },
                { code: "SBE",  name: "School of Business & Economics" },
                { code: "SCIT", name: "School of Computing & Information Technology" },
                { code: "SOS",  name: "School of Science" },
                { code: "SHS",  name: "School of Health Sciences" },
              ].map((s) => (
                <li key={s.code} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 font-mono text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{s.code}</span>
                  <span className="text-muted-foreground">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border space-y-4">
            <h3 className="font-bold text-base text-foreground">Institution Details</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">Full Name: </span>Kaimosi Friends University</div>
              <div><span className="font-medium text-foreground">Abbreviation: </span>KAFU</div>
              <div><span className="font-medium text-foreground">Location: </span>Kaimosi, Vihiga County, Kenya</div>
              <div><span className="font-medium text-foreground">Postal: </span>P.O BOX 385 – 50309, Kaimosi</div>
              <div><span className="font-medium text-foreground">Phone: </span>+254 777 373 633</div>
              <div><span className="font-medium text-foreground">VC Email: </span>vc@kafu.ac.ke</div>
              <div><span className="font-medium text-foreground">General: </span>info@kafu.ac.ke</div>
              <div><span className="font-medium text-foreground">Website: </span>
                <a href="https://kafu.ac.ke" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">kafu.ac.ke</a>
              </div>
            </div>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border space-y-3">
            <h3 className="font-bold text-base text-foreground">Student Digital Portals</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Student Portal</span>
                <a href="https://portal.kafu.ac.ke" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary underline">portal.kafu.ac.ke</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">E-Learning / ODL</span>
                <a href="https://elearning.kafu.ac.ke" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary underline">elearning.kafu.ac.ke</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Main Website</span>
                <a href="https://kafu.ac.ke" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary underline">kafu.ac.ke</a>
              </div>
            </div>
          </div>
          <div className="p-6 bg-card rounded-lg border border-border space-y-3">
            <h3 className="font-bold text-base text-foreground">Programme Levels Offered</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span>Certificate &amp; Diploma</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span>Undergraduate (Bachelor's Degree)</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span>Postgraduate (Master's Degree)</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span>Doctoral (PhD)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Implementation Order</h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-md bg-secondary/50 border border-secondary-border">
            <div className="font-bold text-primary w-24 shrink-0">Phase 1</div>
            <div>
              <strong className="block text-foreground mb-1">Core Architecture & Design System</strong>
              <p className="text-sm text-muted-foreground">Establish typography, colors, spacing, and base components. Set up the development environment with strict security baselines.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-md bg-secondary/50 border border-secondary-border">
            <div className="font-bold text-primary w-24 shrink-0">Phase 2</div>
            <div>
              <strong className="block text-foreground mb-1">CMS Governance & Roles</strong>
              <p className="text-sm text-muted-foreground">Define content models, implement the editorial workflow, and configure role-based access control.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-md bg-secondary/50 border border-secondary-border">
            <div className="font-bold text-primary w-24 shrink-0">Phase 3</div>
            <div>
              <strong className="block text-foreground mb-1">Compliance & Tracking</strong>
              <p className="text-sm text-muted-foreground">Implement SEO structures, ensure WCAG 2.1 AA accessibility compliance, and integrate the analytics event map.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
