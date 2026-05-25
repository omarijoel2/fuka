import { CheckSquare } from "lucide-react";

export default function Security() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-foreground">Security Baseline</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Mandatory security requirements for the KAFU digital platform. 
          These standards protect university data, student information, and system integrity.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2 flex items-center gap-2">
            Authentication & Identity
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">OAuth2 / OIDC Integration</strong>
                <span className="text-xs text-muted-foreground">Integration with institutional SSO for all internal users.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Multi-Factor Authentication (MFA)</strong>
                <span className="text-xs text-muted-foreground">Mandatory MFA for all Admin and Editor roles.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">JWT Token Lifecycles</strong>
                <span className="text-xs text-muted-foreground">Short-lived access tokens (15-min) with secure refresh mechanism.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Strict Password Policy</strong>
                <span className="text-xs text-muted-foreground">Min 12 chars, complexity requirements, check against common passwords, 90-day expiry for admins.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2 flex items-center gap-2">
            Session & Access Control
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Idle Timeout</strong>
                <span className="text-xs text-muted-foreground">Automatic session termination after 30 minutes of inactivity.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Concurrent Sessions</strong>
                <span className="text-xs text-muted-foreground">Single active session enforcement for sensitive roles.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Secure Cookies</strong>
                <span className="text-xs text-muted-foreground">All session cookies must be HttpOnly, Secure, and SameSite=Strict.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2 flex items-center gap-2">
            Data Input & Output
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">File Upload Restrictions</strong>
                <span className="text-xs text-muted-foreground">Max 10MB limit. Whitelist only: .pdf, .docx, .xlsx, .jpg, .png, .webp.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Malware Scanning</strong>
                <span className="text-xs text-muted-foreground">All uploads scanned via VirusTotal API or local ClamAV before storage.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">WAF & Injection Protection</strong>
                <span className="text-xs text-muted-foreground">Block SQLi, XSS. CSRF tokens on all state-changing forms.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Rate Limiting</strong>
                <span className="text-xs text-muted-foreground">Strict API rate limiting (e.g., 100 req/min per IP) to prevent abuse.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold border-b border-border pb-2 flex items-center gap-2">
            Infrastructure & Operations
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Environment Separation</strong>
                <span className="text-xs text-muted-foreground">Strict separation of Dev, Staging, and Production. No production data in dev.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Comprehensive Logging</strong>
                <span className="text-xs text-muted-foreground">All admin actions logged with user, timestamp, and IP. 12-month tamper-evident retention.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded bg-card border border-border">
              <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm">Backup Strategy</strong>
                <span className="text-xs text-muted-foreground">Daily automated backups, encrypted at rest, 30-day retention, monthly restore tests.</span>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
