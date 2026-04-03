import { CheckCircle2 } from "lucide-react";

export default function Accessibility() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">Accessibility Standards</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          KAFU digital properties must be usable by everyone, regardless of ability. 
          We target WCAG 2.1 AA compliance as a strict baseline, with AAA as an aspirational goal.
        </p>
      </header>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-primary mb-2">The "Why"</h3>
        <p className="text-sm text-muted-foreground">
          As a public institution, accessibility is not optional. It is a legal and ethical obligation. 
          A student using a screen reader or a prospective parent navigating via keyboard must have 
          equivalent access to all information and services.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Visual Requirements</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Color Contrast</strong>
              <p className="text-sm text-muted-foreground">Text must have a contrast ratio of at least 4.5:1 against its background. Large text (18px+) requires 3:1.</p>
            </div>
          </div>
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Visible Focus</strong>
              <p className="text-sm text-muted-foreground">All interactive elements must show a highly visible focus ring (2px minimum). Never use <code>outline: none</code> without a custom alternative.</p>
            </div>
          </div>
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">No Color-Only Meaning</strong>
              <p className="text-sm text-muted-foreground">Information must not be conveyed solely through color (e.g., error states need icons and text, not just red borders).</p>
            </div>
          </div>
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Text Resizing</strong>
              <p className="text-sm text-muted-foreground">Layouts must support text resizing up to 200% without breaking or hiding content.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Structural Requirements</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Heading Hierarchy</strong>
              <p className="text-sm text-muted-foreground">Strict logical order (H1 → H2 → H3). Never skip heading levels. Only one H1 per page.</p>
            </div>
          </div>
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">ARIA Landmarks</strong>
              <p className="text-sm text-muted-foreground">Proper use of <code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;aside&gt;</code>, and <code>&lt;footer&gt;</code> to help screen readers navigate page regions.</p>
            </div>
          </div>
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Image Alt Text</strong>
              <p className="text-sm text-muted-foreground">Content images require descriptive alt text. Decorative images must use empty <code>alt=""</code> to be ignored by screen readers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Interactive Requirements</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Keyboard Navigation</strong>
              <p className="text-sm text-muted-foreground">All functionality must be accessible via keyboard. Logical tab order. Modals must trap focus and close on Escape.</p>
            </div>
          </div>
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Form Labels & Errors</strong>
              <p className="text-sm text-muted-foreground">Every input needs an associated <code>&lt;label&gt;</code>. Error messages must be programmatically linked via <code>aria-describedby</code>.</p>
            </div>
          </div>
          <div className="p-4 border border-border rounded bg-card flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong className="block mb-1">Live Regions</strong>
              <p className="text-sm text-muted-foreground">Dynamic content updates (like toast notifications or search results) must use <code>aria-live</code> regions to announce changes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
