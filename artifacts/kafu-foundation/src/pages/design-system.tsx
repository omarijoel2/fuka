export default function DesignSystem() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">Design System</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          The visual language of KAFU. These foundational elements ensure a consistent, premium institutional identity across all digital touchpoints.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-[#1B3A6B] border border-border shadow-sm flex items-end p-3">
              <span className="text-white font-mono text-xs">#1B3A6B</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Primary Navy</div>
              <div className="text-xs text-muted-foreground">Institutional anchor</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-[#D4A017] border border-border shadow-sm flex items-end p-3">
              <span className="text-white font-mono text-xs">#D4A017</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Accent Gold</div>
              <div className="text-xs text-muted-foreground">University crest</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-[#F5F7FA] border border-border shadow-sm flex items-end p-3">
              <span className="text-[#1A2B42] font-mono text-xs">#F5F7FA</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Light Grey</div>
              <div className="text-xs text-muted-foreground">Backgrounds</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-[#FFFFFF] border border-border shadow-sm flex items-end p-3">
              <span className="text-[#1A2B42] font-mono text-xs">#FFFFFF</span>
            </div>
            <div>
              <div className="font-semibold text-sm">White</div>
              <div className="text-xs text-muted-foreground">Cards & surfaces</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-[#1A2B42] border border-border shadow-sm flex items-end p-3">
              <span className="text-white font-mono text-xs">#1A2B42</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Dark Text</div>
              <div className="text-xs text-muted-foreground">Typography</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Typography</h2>
        
        <div className="space-y-8">
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">Headings: Playfair Display / Georgia</div>
            <div className="space-y-4">
              <div className="flex items-end gap-6 border-b border-border pb-4">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0">5xl</div>
                <div className="text-5xl font-serif font-bold truncate">The quick brown fox</div>
              </div>
              <div className="flex items-end gap-6 border-b border-border pb-4">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0">4xl</div>
                <div className="text-4xl font-serif font-bold truncate">The quick brown fox</div>
              </div>
              <div className="flex items-end gap-6 border-b border-border pb-4">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0">3xl</div>
                <div className="text-3xl font-serif font-bold truncate">The quick brown fox</div>
              </div>
              <div className="flex items-end gap-6 border-b border-border pb-4">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0">2xl</div>
                <div className="text-2xl font-serif font-bold truncate">The quick brown fox jumps</div>
              </div>
              <div className="flex items-end gap-6">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0">xl</div>
                <div className="text-xl font-serif font-bold truncate">The quick brown fox jumps over the lazy dog</div>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">Body: Inter</div>
            <div className="space-y-4">
              <div className="flex items-start gap-6 border-b border-border pb-4">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0 mt-1">lg</div>
                <div className="text-lg leading-relaxed">Kaimosi Friends University is committed to providing quality education, research and innovation for sustainable development.</div>
              </div>
              <div className="flex items-start gap-6 border-b border-border pb-4">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0 mt-1">base</div>
                <div className="text-base leading-relaxed">Kaimosi Friends University is committed to providing quality education, research and innovation for sustainable development.</div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 text-muted-foreground text-sm font-mono shrink-0 mt-1">sm</div>
                <div className="text-sm leading-relaxed text-muted-foreground">Kaimosi Friends University is committed to providing quality education, research and innovation for sustainable development.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Logo & Brand Mark</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 border border-border rounded-lg bg-white flex flex-col items-center gap-4">
            <img
              src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png"
              alt="Kaimosi Friends University — Primary Logo"
              className="max-h-16 w-auto object-contain"
            />
            <span className="text-xs text-muted-foreground">Primary Logo — Light backgrounds</span>
          </div>
          <div className="p-8 border border-border rounded-lg bg-primary flex flex-col items-center gap-4">
            <img
              src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-footer.png"
              alt="Kaimosi Friends University — Footer Logo"
              className="max-h-16 w-auto object-contain brightness-0 invert"
            />
            <span className="text-xs text-white/70">Footer / Reversed — Dark backgrounds</span>
          </div>
        </div>
        <div className="p-5 border border-border rounded-lg bg-card text-sm">
          <h3 className="font-bold mb-3">Logo Usage Rules</h3>
          <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
            <li>Always use the official logo from the approved asset library — never recreate from text.</li>
            <li>Minimum clear space: equal to the height of the "K" in KAFU on all sides.</li>
            <li>Minimum digital size: 120px wide for desktop, 80px for mobile.</li>
            <li>Do not stretch, rotate, recolor, or add effects to the logo.</li>
            <li>Primary logo for light backgrounds; reversed/footer logo for dark or primary-colored backgrounds.</li>
            <li>Favicon: University crest mark only, at 32×32px and 192×192px.</li>
          </ul>
          <div className="mt-4 flex gap-4 text-xs font-mono">
            <div><span className="text-muted-foreground">Primary: </span>kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png</div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Spacing & Grid</h2>
        <div className="prose prose-slate max-w-none mb-6">
          <p>We use a 4px base unit for all spacing decisions to ensure vertical and horizontal rhythm.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          {[4, 8, 12, 16, 24, 32, 48, 64].map(space => (
            <div key={space} className="flex flex-col items-center gap-2">
              <div className="bg-primary/20 rounded" style={{ width: space, height: space }}></div>
              <span className="text-xs font-mono text-muted-foreground">{space}px</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Breakpoints</h2>
        <div className="grid gap-4">
          <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-card">
            <div>
              <div className="font-semibold">Mobile</div>
              <div className="text-sm text-muted-foreground">Single column, stacked content</div>
            </div>
            <div className="font-mono text-sm bg-secondary px-2 py-1 rounded">&lt; 640px</div>
          </div>
          <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-card">
            <div>
              <div className="font-semibold">Tablet</div>
              <div className="text-sm text-muted-foreground">Transition to multi-column</div>
            </div>
            <div className="font-mono text-sm bg-secondary px-2 py-1 rounded">640px - 1024px</div>
          </div>
          <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-card">
            <div>
              <div className="font-semibold">Desktop</div>
              <div className="text-sm text-muted-foreground">Standard 12-column grid</div>
            </div>
            <div className="font-mono text-sm bg-secondary px-2 py-1 rounded">1024px - 1280px</div>
          </div>
          <div className="flex justify-between items-center p-4 border border-border rounded-lg bg-card">
            <div>
              <div className="font-semibold">Wide</div>
              <div className="text-sm text-muted-foreground">Max-width container (1440px)</div>
            </div>
            <div className="font-mono text-sm bg-secondary px-2 py-1 rounded">&gt; 1280px</div>
          </div>
        </div>
      </section>
    </div>
  );
}
