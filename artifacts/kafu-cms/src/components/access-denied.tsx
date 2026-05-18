import { ShieldX } from "lucide-react";
import { Link } from "wouter";

interface AccessDeniedProps {
  message?: string;
  requiredRole?: string;
}

export function AccessDenied({ message, requiredRole }: AccessDeniedProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8"
      data-testid="access-denied"
    >
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5">
        <ShieldX className="w-8 h-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
      <p className="text-muted-foreground text-sm mb-1 max-w-sm">
        {message ?? "You do not have permission to view this page."}
      </p>
      {requiredRole && (
        <p className="text-xs text-muted-foreground mb-6">
          Required access level: <span className="font-semibold">{requiredRole}</span>
        </p>
      )}
      {!requiredRole && <div className="mb-6" />}
      <p className="text-xs text-muted-foreground mb-6">
        Contact your system administrator if you believe this is an error.
      </p>
      <Link href="/">
        <div
          className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          data-testid="btn-go-dashboard"
        >
          Return to Dashboard
        </div>
      </Link>
    </div>
  );
}
