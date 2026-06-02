export default function SEO() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">SEO Framework</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Search Engine Optimization standards to ensure KAFU ranks highly for relevant academic queries, 
          driving visibility for programmes, research, and institutional news.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">URL Architecture</h2>
        <p className="text-sm text-muted-foreground max-w-3xl">The current kafu.ac.ke site uses flat WordPress slugs (e.g. <code className="text-primary font-mono">/bachelor-of-commerce/</code>). The new platform will use a structured, hierarchical URL architecture for SEO and maintainability.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary text-left">
                <th className="px-4 py-3 font-semibold border-b border-border">Content Type</th>
                <th className="px-4 py-3 font-semibold border-b border-border text-red-600">Current (kafu.ac.ke)</th>
                <th className="px-4 py-3 font-semibold border-b border-border text-green-700">Recommended (New Platform)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["News / Blog", "/kafu-hosts-2nd-prayer-breakfast/", "/news/2026/03/kafu-hosts-2nd-prayer-breakfast"],
                ["Academic Programme", "/bachelor-of-commerce/", "/academic-programmes/sbe/bachelor-of-commerce"],
                ["School Page", "/school-of-education-social-sciences/", "/schools/sess"],
                ["Events", "/events/examination-schedule-2025-2026/", "/events/2026/examination-schedule-semester-2"],
                ["Staff Profile", "(Not available)", "/images/uploads/sess/dr-nabeta-sangili"],
                ["Opportunities / Tenders", "(Not structured)", "/opportunities/tenders/2026/ref-kafu-001"],
                ["Vacancies", "(Not structured)", "/opportunities/vacancies/2026/lecturer-computer-science"],
              ].map(([type, current, recommended]) => (
                <tr key={type} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-red-500">{current}</td>
                  <td className="px-4 py-3 font-mono text-xs text-green-700">{recommended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-secondary/40 border border-border rounded text-sm text-muted-foreground">
          <strong>Redirect strategy:</strong> All existing kafu.ac.ke flat slugs must be 301-redirected to the new hierarchical URLs at go-live. A redirect map should be maintained in the CMS. No broken links are acceptable during migration.
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">On-Page Meta Rules</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg mb-2">Title Tags</h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>Must be unique per page.</li>
              <li>Maximum length: 60 characters.</li>
              <li>Format: <code>[Page Title] | Kaimosi Friends University</code></li>
              <li>Homepage: <code>Kaimosi Friends University (KAFU) | Official Website</code></li>
            </ul>
          </div>
          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg mb-2">Meta Descriptions</h3>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
              <li>Must be unique and actionable.</li>
              <li>Maximum length: 160 characters.</li>
              <li>CMS must enforce character limits on content entry.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Structured Data (Schema.org)</h2>
        <div className="prose prose-slate max-w-none text-foreground mb-4 text-sm">
          <p>Implement JSON-LD structured data on relevant templates to enable rich snippets in Google Search results.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded bg-secondary/20">
            <div className="font-bold text-primary mb-1">Organization</div>
            <div className="text-xs text-muted-foreground">Homepage only. Includes logo, contact info, social profiles.</div>
          </div>
          <div className="p-4 border border-border rounded bg-secondary/20">
            <div className="font-bold text-primary mb-1">Course</div>
            <div className="text-xs text-muted-foreground">Programme pages. Includes provider, requirements, duration.</div>
          </div>
          <div className="p-4 border border-border rounded bg-secondary/20">
            <div className="font-bold text-primary mb-1">Article</div>
            <div className="text-xs text-muted-foreground">News pages. Includes headline, image, date published, author.</div>
          </div>
          <div className="p-4 border border-border rounded bg-secondary/20">
            <div className="font-bold text-primary mb-1">Event</div>
            <div className="text-xs text-muted-foreground">Event pages. Includes location, startDate, endDate, offers.</div>
          </div>
          <div className="p-4 border border-border rounded bg-secondary/20">
            <div className="font-bold text-primary mb-1">Person</div>
            <div className="text-xs text-muted-foreground">Staff profiles. Includes jobTitle, affiliation, email.</div>
          </div>
          <div className="p-4 border border-border rounded bg-secondary/20">
            <div className="font-bold text-primary mb-1">BreadcrumbList</div>
            <div className="text-xs text-muted-foreground">All deep pages to indicate hierarchy.</div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Technical SEO Controls</h2>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-32 font-bold shrink-0">Canonicals</div>
            <div className="text-sm text-muted-foreground">Self-referencing <code>&lt;link rel="canonical"&gt;</code> tags on all pages to prevent duplicate content issues, especially with query parameters.</div>
          </li>
          <li className="flex gap-4">
            <div className="w-32 font-bold shrink-0">Redirects</div>
            <div className="text-sm text-muted-foreground">CMS must provide a UI for managing redirects. Enforce 301 for permanent moves and 302 for temporary. Automatic 301 creation when a URL slug is changed.</div>
          </li>
          <li className="flex gap-4">
            <div className="w-32 font-bold shrink-0">Sitemap.xml</div>
            <div className="text-sm text-muted-foreground">Auto-generated XML sitemap updated on publish. News, Programmes, and Events indexed immediately. Staff profiles excluded by default unless marked public.</div>
          </li>
          <li className="flex gap-4">
            <div className="w-32 font-bold shrink-0">Robots.txt</div>
            <div className="text-sm text-muted-foreground">Explicitly block <code>/admin/</code>, <code>/api/</code>, and internal search result pages from being crawled.</div>
          </li>
        </ul>
      </section>
    </div>
  );
}
