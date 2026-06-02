import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Save, ShieldCheck, Info } from "lucide-react";

// ── Roles ─────────────────────────────────────────────────────────────────────
const ROLES: { value: string; label: string; abbr: string }[] = [
  { value: "super_admin",          label: "Super Admin",          abbr: "SA" },
  { value: "ict_admin",            label: "ICT Admin",            abbr: "ICT" },
  { value: "communications_admin", label: "Comms Admin",          abbr: "CA" },
  { value: "reviewer",             label: "Reviewer",             abbr: "RV" },
  { value: "admissions_owner",     label: "Admissions Owner",     abbr: "AO" },
  { value: "academic_owner",       label: "Academic Owner",       abbr: "AC" },
  { value: "procurement_owner",    label: "Procurement Owner",    abbr: "PO" },
  { value: "hr_owner",             label: "HR Owner",             abbr: "HR" },
  { value: "staff_user",           label: "Staff User",           abbr: "SU" },
  { value: "dept_editor",          label: "Dept Editor",          abbr: "DE" },
];

// ── Feature Areas ─────────────────────────────────────────────────────────────
const FEATURES: { key: string; label: string; description: string }[] = [
  { key: "content_management",  label: "Content Management",    description: "News, Events, Announcements, Opportunities, Pages, Documents" },
  { key: "review_queue",        label: "Review Queue",          description: "Approve/reject content submissions" },
  { key: "research_office",     label: "Research Office",       description: "Projects, Publications, Grants, Partnerships" },
  { key: "international_office",label: "International Office",  description: "Study Abroad, Visa Info, Exchange Programmes" },
  { key: "governance",          label: "Governance",            description: "University Council, VC Office, Management Board, Directorates" },
  { key: "admissions",          label: "Admissions",            description: "Applications, Uploads, Fees, KUCCPS, Eligibility" },
  { key: "media_library",       label: "Media Library",         description: "Images, videos, and file assets" },
  { key: "site_controls",       label: "Site Controls",         description: "Homepage, Navigation, Announcements, Footer, Social Links" },
  { key: "seo_redirects",       label: "SEO & Redirects",       description: "Redirect rules, meta tags, SEO settings" },
  { key: "reports",             label: "Reports",               description: "Workflow Console, Content Health, Audit Log" },
  { key: "user_management",     label: "User Management",       description: "Create/edit/deactivate CMS users and roles" },
  { key: "taxonomy",            label: "Taxonomy Manager",      description: "Tags, categories, and content taxonomies" },
  { key: "settings",            label: "System Settings",       description: "Branding, email, system configuration" },
];

// ── Default permissions (based on current hardcoded logic) ───────────────────
const DEFAULT_MATRIX: Record<string, Record<string, boolean>> = {
  super_admin:          { content_management: true,  review_queue: true,  research_office: true,  international_office: true,  governance: true,  admissions: true,  media_library: true,  site_controls: true,  seo_redirects: true,  reports: true,  user_management: true,  taxonomy: true,  settings: true },
  ict_admin:            { content_management: true,  review_queue: true,  research_office: true,  international_office: true,  governance: true,  admissions: true,  media_library: true,  site_controls: true,  seo_redirects: true,  reports: true,  user_management: false, taxonomy: true,  settings: true },
  communications_admin: { content_management: true,  review_queue: true,  research_office: true,  international_office: true,  governance: true,  admissions: true,  media_library: true,  site_controls: true,  seo_redirects: false, reports: true,  user_management: false, taxonomy: true,  settings: false },
  reviewer:             { content_management: false, review_queue: true,  research_office: false, international_office: false, governance: false, admissions: false, media_library: false, site_controls: false, seo_redirects: false, reports: false, user_management: false, taxonomy: false, settings: false },
  admissions_owner:     { content_management: false, review_queue: false, research_office: false, international_office: false, governance: false, admissions: true,  media_library: false, site_controls: false, seo_redirects: false, reports: false, user_management: false, taxonomy: false, settings: false },
  academic_owner:       { content_management: true,  review_queue: true,  research_office: false, international_office: false, governance: false, admissions: false, media_library: false, site_controls: false, seo_redirects: false, reports: false, user_management: false, taxonomy: false, settings: false },
  procurement_owner:    { content_management: true,  review_queue: false, research_office: false, international_office: false, governance: false, admissions: false, media_library: false, site_controls: false, seo_redirects: false, reports: false, user_management: false, taxonomy: false, settings: false },
  hr_owner:             { content_management: true,  review_queue: false, research_office: false, international_office: false, governance: false, admissions: false, media_library: false, site_controls: false, seo_redirects: false, reports: false, user_management: false, taxonomy: false, settings: false },
  staff_user:           { content_management: false, review_queue: false, research_office: false, international_office: false, governance: false, admissions: false, media_library: false, site_controls: false, seo_redirects: false, reports: false, user_management: false, taxonomy: false, settings: false },
  dept_editor:          { content_management: true,  review_queue: false, research_office: false, international_office: false, governance: false, admissions: false, media_library: true,  site_controls: false, seo_redirects: false, reports: false, user_management: false, taxonomy: false, settings: false },
};

function parseMatrix(raw: Record<string, string>): Record<string, Record<string, boolean>> {
  try {
    if (raw?.matrix) return JSON.parse(raw.matrix);
  } catch { /* fall through */ }
  return DEFAULT_MATRIX;
}

export default function PermissionsMatrixPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const isSuperAdmin = user?.role === "super_admin";

  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(DEFAULT_MATRIX);
  const [saved, setSaved] = useState(false);

  const { data: raw, isLoading } = useQuery({
    queryKey: ["cms-permissions-matrix"],
    queryFn: () => apiFetch("/site-config/permissions"),
  });

  useEffect(() => {
    if (raw) setMatrix(parseMatrix(raw as Record<string, string>));
  }, [raw]);

  const save = useMutation({
    mutationFn: () =>
      apiFetch("/site-config/permissions", {
        method: "PUT",
        body: JSON.stringify({ matrix: JSON.stringify(matrix) }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cms-permissions-matrix"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const toggle = (role: string, feature: string) => {
    if (!isSuperAdmin || role === "super_admin") return;
    setMatrix(m => ({
      ...m,
      [role]: { ...(m[role] ?? {}), [feature]: !(m[role]?.[feature] ?? false) },
    }));
  };

  const resetToDefaults = () => setMatrix(DEFAULT_MATRIX);

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading permissions...</div>;

  return (
    <div className="p-6 max-w-full space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Permissions Matrix
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Role-based access control for all CMS feature areas. Only Super Admin can modify.
          </p>
        </div>
        {isSuperAdmin && (
          <div className="flex gap-2">
            <button
              onClick={resetToDefaults}
              data-testid="reset-defaults-btn"
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending}
              data-testid="save-permissions-btn"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved" : save.isPending ? "Saving..." : "Save Matrix"}
            </button>
          </div>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          You are viewing the permissions matrix in read-only mode. Contact a Super Admin to modify role permissions.
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-primary/90 inline-block" /> Full access
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border-2 border-border inline-block bg-white" /> No access
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-primary/20 border border-primary/30 inline-block" /> Super Admin (always full)
        </span>
      </div>

      {/* Matrix table — scrollable horizontally */}
      <div className="overflow-x-auto rounded-xl border border-border shadow-sm bg-white">
        <table className="min-w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide min-w-[200px] sticky left-0 bg-muted/50 z-10 border-r border-border">
                Feature Area
              </th>
              {ROLES.map(r => (
                <th key={r.value} className="px-3 py-3 font-semibold text-center min-w-[72px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold text-white
                      ${r.value === "super_admin" ? "bg-primary" :
                        r.value === "ict_admin" || r.value === "communications_admin" ? "bg-primary/70" :
                        r.value === "reviewer" ? "bg-amber-500" : "bg-muted-foreground/50"}`}>
                      {r.abbr}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight text-center whitespace-nowrap">{r.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {FEATURES.map((feat, fi) => (
              <tr key={feat.key} className={fi % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                <td className="px-4 py-3 sticky left-0 z-10 border-r border-border" style={{ background: fi % 2 === 0 ? "white" : "hsl(var(--muted)/0.2)" }}>
                  <div className="font-medium text-foreground">{feat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug max-w-[180px]">{feat.description}</div>
                </td>
                {ROLES.map(role => {
                  const hasAccess = matrix[role.value]?.[feat.key] ?? false;
                  const isSA = role.value === "super_admin";
                  return (
                    <td key={role.value} className="px-3 py-3 text-center">
                      <button
                        onClick={() => toggle(role.value, feat.key)}
                        disabled={!isSuperAdmin || isSA}
                        data-testid={`perm-${role.value}-${feat.key}`}
                        title={isSA ? "Super Admin always has full access" : hasAccess ? "Click to revoke" : "Click to grant"}
                        className={`w-5 h-5 rounded mx-auto flex items-center justify-center transition-colors
                          ${isSA
                            ? "bg-primary/20 border border-primary/30 cursor-default"
                            : hasAccess
                              ? "bg-primary hover:bg-primary/80 cursor-pointer"
                              : "border-2 border-border bg-white hover:border-primary/40 cursor-pointer"}
                          ${!isSuperAdmin ? "cursor-default" : ""}`}
                      >
                        {(hasAccess || isSA) && (
                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1.5,6 4.5,9 10.5,3" />
                          </svg>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role legend below */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROLES.map(r => (
          <div key={r.value} className="border border-border rounded-lg px-3 py-2.5 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-bold text-white
                ${r.value === "super_admin" ? "bg-primary" :
                  r.value === "ict_admin" || r.value === "communications_admin" ? "bg-primary/70" :
                  r.value === "reviewer" ? "bg-amber-500" : "bg-muted-foreground/50"}`}>
                {r.abbr}
              </span>
              <span className="font-medium text-xs text-foreground">{r.label}</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">
              {Object.values(matrix[r.value] ?? {}).filter(Boolean).length} of {FEATURES.length} features enabled
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
