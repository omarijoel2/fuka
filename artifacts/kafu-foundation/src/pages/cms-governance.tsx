export default function CMSGovernance() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">CMS Governance</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Content architecture, editorial workflows, and taxonomy rules for the KAFU digital platform.
          Ensures content remains fresh, accurate, and structured.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Content Types</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg text-primary mb-2">Page</h3>
            <p className="text-sm text-muted-foreground mb-3">Standard structured pages (homepage, landing pages, generic content).</p>
            <div className="text-xs space-y-1">
              <div className="flex"><span className="font-medium w-24">Fields:</span> <span className="text-muted-foreground">Title, Slug, Blocks (Hero, Content, Call to Action)</span></div>
            </div>
          </div>
          
          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg text-primary mb-2">News Article</h3>
            <p className="text-sm text-muted-foreground mb-3">University announcements, press releases, and general news.</p>
            <div className="text-xs space-y-1">
              <div className="flex"><span className="font-medium w-24">Fields:</span> <span className="text-muted-foreground">Title, Summary, Body, Category, Author, Date, Featured Image, Tags</span></div>
            </div>
          </div>

          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg text-primary mb-2">Event</h3>
            <p className="text-sm text-muted-foreground mb-3">Upcoming university events, seminars, and deadlines.</p>
            <div className="text-xs space-y-1">
              <div className="flex"><span className="font-medium w-24">Fields:</span> <span className="text-muted-foreground">Title, Date, Time, Venue, Description, Registration Link, Category</span></div>
            </div>
          </div>

          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg text-primary mb-2">Programme</h3>
            <p className="text-sm text-muted-foreground mb-3">Academic course offerings.</p>
            <div className="text-xs space-y-1">
              <div className="flex"><span className="font-medium w-24">Fields:</span> <span className="text-muted-foreground">Name, Faculty, Level, Duration, Entry Requirements, Fees, Accreditation</span></div>
            </div>
          </div>

          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg text-primary mb-2">Staff Profile</h3>
            <p className="text-sm text-muted-foreground mb-3">Directory of university personnel.</p>
            <div className="text-xs space-y-1">
              <div className="flex"><span className="font-medium w-24">Fields:</span> <span className="text-muted-foreground">Name, Title, Department, Bio, Photo, Email, Qualifications</span></div>
            </div>
          </div>

          <div className="p-5 border border-border rounded-lg bg-card">
            <h3 className="font-bold text-lg text-primary mb-2">Opportunity</h3>
            <p className="text-sm text-muted-foreground mb-3">Tenders, job vacancies, and scholarships.</p>
            <div className="text-xs space-y-1">
              <div className="flex"><span className="font-medium w-24">Fields:</span> <span className="text-muted-foreground">Title, Type (Tender/Job/Scholarship), Deadline, Reference, Description, Attachments</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Editorial Workflow</h2>
        <div className="p-8 border border-border rounded-lg bg-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <div className="space-y-2 flex-1">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">1</div>
              <div className="font-semibold">Draft</div>
              <div className="text-xs text-muted-foreground">Content created by Editor</div>
            </div>
            <div className="hidden md:block w-8 h-px bg-border"></div>
            <div className="space-y-2 flex-1">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">2</div>
              <div className="font-semibold">Review</div>
              <div className="text-xs text-muted-foreground">Awaiting approval</div>
            </div>
            <div className="hidden md:block w-8 h-px bg-border"></div>
            <div className="space-y-2 flex-1">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">3</div>
              <div className="font-semibold">Approved</div>
              <div className="text-xs text-muted-foreground">Ready for publication</div>
            </div>
            <div className="hidden md:block w-8 h-px bg-border"></div>
            <div className="space-y-2 flex-1">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">4</div>
              <div className="font-semibold">Published</div>
              <div className="text-xs text-muted-foreground">Live on platform</div>
            </div>
            <div className="hidden md:block w-8 h-px bg-border"></div>
            <div className="space-y-2 flex-1">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">5</div>
              <div className="font-semibold">Archived</div>
              <div className="text-xs text-muted-foreground">Removed from public view</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Reusable Blocks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Hero Banner</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Call to Action</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Testimonial</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Stats Block</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Gallery</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Video Embed</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">News Feed</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Events Feed</div>
          <div className="p-3 border border-border rounded bg-secondary/30 text-sm font-medium flex items-center justify-center text-center h-20">Programme Highlights</div>
        </div>
      </section>
    </div>
  );
}
