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
