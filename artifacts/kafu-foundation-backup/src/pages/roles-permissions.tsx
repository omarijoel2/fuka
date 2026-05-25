export default function RolesPermissions() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">Roles & Permissions</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Access control matrix for the KAFU digital platform. Defines exactly what each user role is authorized to do within the system.
        </p>
      </header>

      <section className="space-y-6">
        <div className="rounded-md border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-secondary-foreground font-semibold border-b border-border">
              <tr>
                <th className="p-4 min-w-[200px] border-r border-border">Permission</th>
                <th className="p-4 text-center border-r border-border"><div className="rotate-0 md:rotate-0 whitespace-nowrap">Super Admin</div></th>
                <th className="p-4 text-center border-r border-border"><div className="rotate-0 md:rotate-0 whitespace-nowrap">ICT Admin</div></th>
                <th className="p-4 text-center border-r border-border"><div className="rotate-0 md:rotate-0 whitespace-nowrap">Corp Comms</div></th>
                <th className="p-4 text-center border-r border-border"><div className="rotate-0 md:rotate-0 whitespace-nowrap">Dept Editor</div></th>
                <th className="p-4 text-center border-r border-border"><div className="rotate-0 md:rotate-0 whitespace-nowrap">Staff User</div></th>
                <th className="p-4 text-center"><div className="rotate-0 md:rotate-0 whitespace-nowrap">Reviewer</div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: "Create Content", roles: [true, true, true, true, false, false] },
                { name: "Edit Own Content", roles: [true, true, true, true, false, false] },
                { name: "Edit Any Content", roles: [true, true, true, false, false, false] },
                { name: "Delete Content", roles: [true, true, true, false, false, false] },
                { name: "Review Submissions", roles: [true, false, true, false, false, true] },
                { name: "Approve Content", roles: [true, false, true, false, false, true] },
                { name: "Publish Content", roles: [true, false, true, false, false, true] },
                { name: "Archive Content", roles: [true, true, true, false, false, false] },
                { name: "Manage Menus", roles: [true, true, true, false, false, false] },
                { name: "Manage Users", roles: [true, true, false, false, false, false] },
                { name: "System Settings", roles: [true, true, false, false, false, false] },
                { name: "Media Library", roles: [true, true, true, true, false, false] },
                { name: "View Reports", roles: [true, true, true, false, false, false] },
                { name: "Audit Logs", roles: [true, true, false, false, false, false] },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium border-r border-border">{row.name}</td>
                  {row.roles.map((hasPermission, j) => (
                    <td key={j} className="p-4 text-center border-r border-border last:border-r-0">
                      {hasPermission ? (
                        <span className="inline-flex w-6 h-6 rounded-full bg-green-100 text-green-700 items-center justify-center" aria-label="Yes">✓</span>
                      ) : (
                        <span className="inline-flex w-6 h-6 rounded-full bg-muted text-muted-foreground items-center justify-center opacity-50" aria-label="No">×</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2">Role Descriptions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary">Super Admin</h3>
            <p className="text-sm text-muted-foreground">Full unrestricted access to all platform features, settings, and user management. Reserved for lead developers and platform owners.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary">ICT Admin</h3>
            <p className="text-sm text-muted-foreground">Technical management of the platform. Can manage users, adjust system settings, and view logs, but generally does not participate in content review workflows.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary">Corporate Comms Admin</h3>
            <p className="text-sm text-muted-foreground">Lead editorial role. Controls the narrative of the university, manages the homepage, and has final say on public-facing content publishing.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary">Department Content Editor</h3>
            <p className="text-sm text-muted-foreground">Responsible for updating content specific to their faculty or department. Can create drafts and edit their own content, which then goes to review.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-primary">Reviewer / Approver</h3>
            <p className="text-sm text-muted-foreground">Heads of Departments or Deans who review drafted content for accuracy before it is published by Corporate Comms.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
