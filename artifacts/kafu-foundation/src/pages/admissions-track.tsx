import React, { useState } from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, Clock, AlertCircle, XCircle, FileText, Loader2, ArrowRight } from "lucide-react";

interface AppStatus {
  reference_number: string;
  applicant_name: string;
  applicant_type: string;
  programme_name: string;
  school_code: string;
  status: string;
  payment_status: string;
  submitted_at: string;
  status_message: string;
}

const STATUS_META: Record<string, { label: string; icon: React.ElementType; colour: string; bg: string }> = {
  submitted:    { label: "Application Received", icon: CheckCircle, colour: "#1A5C38", bg: "#dcfce7" },
  under_review: { label: "Under Review", icon: Clock, colour: "#C9A227", bg: "#fef9c3" },
  offered:      { label: "Offer Issued", icon: CheckCircle, colour: "#1B3A6B", bg: "#dbeafe" },
  rejected:     { label: "Unsuccessful", icon: XCircle, colour: "#8B1A1A", bg: "#fee2e2" },
  draft:        { label: "Draft — Not Submitted", icon: AlertCircle, colour: "#888", bg: "#f3f4f6" },
};

export default function AdmissionsTrack() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AppStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const res = await fetch(`/api/admissions-app/track/${encodeURIComponent(ref.trim())}`);
      if (res.status === 404) { setNotFound(true); }
      else {
        const data = await res.json();
        setResult(data?.data ?? null);
        if (!data?.data) setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  const meta = result ? (STATUS_META[result.status] ?? STATUS_META.submitted) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Track Application — KAFU Admissions"
        description="Track the status of your KAFU admissions application using your reference number."
        path="/admissions/track"
      />

      {/* Hero */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-3">Track Your Application</h1>
          <p className="text-primary-foreground/75 max-w-md mx-auto">
            Enter your application reference number to check the status of your admissions application.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-lg">

          {/* Search form */}
          <form onSubmit={handleTrack} className="flex gap-3 mb-8" data-testid="track-form">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={ref}
                onChange={e => setRef(e.target.value)}
                placeholder="e.g. KAFU-2026-001234"
                className="pl-9"
                data-testid="input-ref-number"
              />
            </div>
            <Button type="submit" disabled={loading || !ref.trim()} data-testid="btn-track">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
            </Button>
          </form>

          {/* Not found */}
          {notFound && (
            <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/5 text-center" data-testid="not-found">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Application Not Found</h3>
              <p className="text-sm text-muted-foreground">No application found for reference number <strong>{ref}</strong>. Please check the reference and try again.</p>
            </div>
          )}

          {/* Result card */}
          {result && meta && (
            <div className="rounded-2xl border bg-card overflow-hidden" data-testid="track-result">
              <div className="h-1.5" style={{ backgroundColor: meta.colour }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: meta.bg }}>
                    <meta.icon className="w-6 h-6" style={{ color: meta.colour }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.colour }}>{meta.label}</p>
                    <p className="font-mono font-bold text-foreground">{result.reference_number}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Applicant", value: result.applicant_name },
                    { label: "Application Type", value: result.applicant_type.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()) },
                    { label: "Programme", value: result.programme_name },
                    { label: "School", value: result.school_code },
                    { label: "Payment", value: result.payment_status === "paid" ? "Paid" : "Pending" },
                    { label: "Submitted", value: result.submitted_at ? new Date(result.submitted_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 py-2.5 border-b last:border-b-0">
                      <span className="text-sm text-muted-foreground w-32 shrink-0">{label}</span>
                      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
                    </div>
                  ))}
                </div>

                {result.status_message && (
                  <div className="mt-5 p-4 rounded-xl text-sm" style={{ backgroundColor: meta.bg, color: meta.colour }}>
                    <p className="font-semibold mb-1">Update from Admissions Office</p>
                    <p>{result.status_message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help */}
          <div className="mt-10 p-5 rounded-xl bg-secondary/30 border text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Need help?</p>
            <p className="mb-3">If you cannot find your application, contact the Admissions Office with your full name and date of application.</p>
            <div className="flex flex-wrap gap-3">
              <a href="mailto:admissions@kafu.ac.ke" className="text-primary hover:underline font-medium">admissions@kafu.ac.ke</a>
              <span className="text-muted-foreground">·</span>
              <a href="tel:+254777373633" className="text-primary hover:underline font-medium">+254 777 373 633</a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/admissions/apply" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline" data-testid="link-apply-new">
              Start a new application <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
