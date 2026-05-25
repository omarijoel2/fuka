export default function Analytics() {
  const events = [
    { event: "page_view", trigger: "Page load", properties: "url, title, user_type", purpose: "Base traffic measurement" },
    { event: "cta_click", trigger: "Click on primary buttons", properties: "button_text, destination, location", purpose: "Measure engagement" },
    { event: "apply_now_click", trigger: "Click on 'Apply' buttons", properties: "programme_id, faculty", purpose: "Primary conversion tracking" },
    { event: "document_download", trigger: "Click on file links", properties: "file_name, file_type", purpose: "Resource utility tracking" },
    { event: "programme_view", trigger: "View programme page", properties: "programme_id, faculty, level", purpose: "Academic interest tracking" },
    { event: "staff_profile_view", trigger: "View staff directory/profile", properties: "staff_id, department", purpose: "Personnel visibility" },
    { event: "opportunity_view", trigger: "View job/tender", properties: "opp_id, type", purpose: "External stakeholder interest" },
    { event: "search_query", trigger: "Submit search", properties: "search_term, result_count", purpose: "Identify content gaps/intent" },
    { event: "search_result_click", trigger: "Click search result", properties: "search_term, clicked_url, rank", purpose: "Search effectiveness" },
    { event: "form_submit", trigger: "Successful form submission", properties: "form_id, form_type", purpose: "Lead generation tracking" },
    { event: "form_error", trigger: "Form validation failure", properties: "form_id, error_field", purpose: "UX improvement" },
    { event: "event_rsvp", trigger: "Event registration click", properties: "event_id, event_name", purpose: "Event engagement" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">Analytics Event Map</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Standardized telemetry strategy for the KAFU platform. 
          Defines what user actions we measure, how we measure them, and why.
        </p>
      </header>

      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h3 className="font-bold text-lg mb-3">Implementation Guidelines</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>Events should be pushed to a central data layer (e.g., GTM `dataLayer`).</li>
          <li>Never transmit Personally Identifiable Information (PII) like names or emails in event properties.</li>
          <li>Ensure all event names use `snake_case` strictly.</li>
        </ul>
      </div>

      <section className="space-y-6">
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-secondary-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-4 border-r border-border">Event Name</th>
                  <th className="p-4 border-r border-border">Trigger</th>
                  <th className="p-4 border-r border-border">Key Properties</th>
                  <th className="p-4">Business Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-primary border-r border-border font-medium whitespace-nowrap">{row.event}</td>
                    <td className="p-4 border-r border-border">{row.trigger}</td>
                    <td className="p-4 border-r border-border text-muted-foreground text-xs font-mono">{row.properties}</td>
                    <td className="p-4">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Dashboard Recommendations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 border border-border rounded-lg bg-card space-y-3">
            <h3 className="font-bold text-primary">Executive Dashboard</h3>
            <p className="text-sm text-muted-foreground">For VC and University Council.</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Total application conversions</li>
              <li>• Overall traffic trends</li>
              <li>• Top requested programmes</li>
            </ul>
          </div>
          <div className="p-5 border border-border rounded-lg bg-card space-y-3">
            <h3 className="font-bold text-primary">Admissions Dashboard</h3>
            <p className="text-sm text-muted-foreground">For Academic Registry.</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• <code>apply_now_click</code> by programme</li>
              <li>• Funnel drop-off rates</li>
              <li>• Form completion errors</li>
            </ul>
          </div>
          <div className="p-5 border border-border rounded-lg bg-card space-y-3">
            <h3 className="font-bold text-primary">Content Dashboard</h3>
            <p className="text-sm text-muted-foreground">For Corporate Communications.</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Most read news/events</li>
              <li>• Top search queries & zero-results</li>
              <li>• Document download metrics</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
