export default function ComponentInventory() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">Component Inventory</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A comprehensive library of UI components used across the KAFU digital ecosystem. 
          Use these established patterns to ensure consistency and speed up development.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Buttons</h2>
        <div className="p-6 border border-border rounded-lg bg-card space-y-8">
          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">Primary Button</button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors">Secondary Button</button>
            <button className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md font-medium text-sm transition-colors">Outline Button</button>
            <button className="px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md font-medium text-sm transition-colors">Ghost Button</button>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium text-sm hover:bg-destructive/90 transition-colors">Destructive</button>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Usage:</strong> Primary buttons for main actions. Secondary for alternative actions. Outline/Ghost for low priority actions. Destructive for actions that delete data or have negative consequences.
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Forms</h2>
        <div className="p-6 border border-border rounded-lg bg-card grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
              <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="student@kafu.ac.ke" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Department</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Select department...</option>
                <option>Computer Science</option>
                <option>Business Administration</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="h-4 w-4 rounded border-primary text-primary focus:ring-primary" />
              <label htmlFor="terms" className="text-sm font-medium leading-none">Accept terms and conditions</label>
            </div>
            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium leading-none">Message</label>
              <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type your message here..."></textarea>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Cards</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Standard Card</h3>
              <p className="text-sm text-muted-foreground">General content container</p>
            </div>
            <div className="p-6 pt-0">
              <p className="text-sm">Cards provide flexible containers for grouped content, with optional headers and footers.</p>
            </div>
            <div className="flex items-center p-6 pt-0">
              <button className="text-sm font-medium text-primary hover:underline">Learn more</button>
            </div>
          </div>
          
          <div className="rounded-xl border-2 border-primary bg-card text-card-foreground shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">Featured</div>
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Programme Card</h3>
              <p className="text-sm text-muted-foreground">BSc. Computer Science</p>
            </div>
            <div className="p-6 pt-0 space-y-2 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Duration</span><span>4 Years</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Intake</span><span>September</span></div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow flex flex-col items-center text-center p-6">
            <div className="w-20 h-20 rounded-full bg-secondary mb-4 flex items-center justify-center text-2xl font-serif">JD</div>
            <h3 className="font-semibold leading-none tracking-tight mb-1">Dr. Jane Doe</h3>
            <p className="text-sm text-primary font-medium mb-3">Senior Lecturer</p>
            <p className="text-xs text-muted-foreground line-clamp-3">Department of Information Technology, Faculty of Science.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Alerts & Badges</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-200">
              <h5 className="font-medium mb-1">Information</h5>
              <div className="text-sm opacity-90">Registration for the upcoming semester opens next week.</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900 dark:bg-green-950/50 dark:border-green-900 dark:text-green-200">
              <h5 className="font-medium mb-1">Success</h5>
              <div className="text-sm opacity-90">Your application has been submitted successfully.</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-200">
              <h5 className="font-medium mb-1">Warning</h5>
              <div className="text-sm opacity-90">Your session will expire in 5 minutes due to inactivity.</div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 dark:bg-red-950/50 dark:border-red-900 dark:text-red-200">
              <h5 className="font-medium mb-1">Error</h5>
              <div className="text-sm opacity-90">Failed to connect to the student portal. Please try again.</div>
            </div>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wider">Badge Styles</h3>
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">Default</span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">Secondary</span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">Outline</span>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80">Destructive</span>
            </div>
            
            <h3 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wider">Status Indicators</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-sm">Active / Published</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <span className="text-sm">Pending / Draft</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground"></span> <span className="text-sm">Archived / Inactive</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Tables</h2>
        <div className="rounded-md border bg-card">
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Programme Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Faculty</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">BSc. Computer Science</td>
                  <td className="p-4 align-middle">Science</td>
                  <td className="p-4 align-middle">4 Years</td>
                  <td className="p-4 align-middle text-right"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</span></td>
                </tr>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">BEd. Arts</td>
                  <td className="p-4 align-middle">Education</td>
                  <td className="p-4 align-middle">4 Years</td>
                  <td className="p-4 align-middle text-right"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</span></td>
                </tr>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">Diploma in Business Management</td>
                  <td className="p-4 align-middle">Business</td>
                  <td className="p-4 align-middle">2 Years</td>
                  <td className="p-4 align-middle text-right"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-4 border border-input bg-background" disabled>Previous</button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-4 border border-input bg-background">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
