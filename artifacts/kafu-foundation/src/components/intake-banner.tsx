import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { X, ArrowRight, CheckCircle, GraduationCap, BookOpen } from "lucide-react";

interface Setting { key: string; value: string; type: string; }

function fmt(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function IntakeBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("kafu-intake-banner-v1") === "1"; } catch { return false; }
  });

  const { data } = useQuery<{ data: Setting[] }>({
    queryKey: ["admissions-settings-banner"],
    queryFn: () => fetch("/api/admissions/settings").then(r => r.json()),
    staleTime: 1000 * 60 * 15,
  });

  if (dismissed || !data?.data) return null;

  const s = Object.fromEntries(data.data.map(x => [x.key, x.value]));
  const ugOpen = s.ug_intake_open === "1";
  const pgOpen = s.pg_intake_open === "1";

  if (!ugOpen && !pgOpen) return null;

  function dismiss() {
    try { sessionStorage.setItem("kafu-intake-banner-v1", "1"); } catch { /* noop */ }
    setDismissed(true);
  }

  return (
    <div className="bg-primary text-primary-foreground" data-testid="intake-banner">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
          <CheckCircle className="w-3 h-3" /> Intake Open
        </span>

        {/* Messages */}
        <div className="flex-1 flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-1 text-sm min-w-0">
          {ugOpen && (
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>
                <strong>Undergraduate:</strong>{" "}
                <span className="text-primary-foreground/85">{s.ug_intake_note || "Applications now open."}</span>
                {s.ug_deadline && (
                  <span className="text-primary-foreground/55 text-xs ml-1.5">Deadline: {fmt(s.ug_deadline)}</span>
                )}
              </span>
            </span>
          )}
          {pgOpen && (
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>
                <strong>Postgraduate:</strong>{" "}
                <span className="text-primary-foreground/85">{s.pg_intake_note || "Masters & PhD applications open."}</span>
                {s.pg_deadline && (
                  <span className="text-primary-foreground/55 text-xs ml-1.5">Deadline: {fmt(s.pg_deadline)}</span>
                )}
              </span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <Link
            href="/admissions/apply"
            data-testid="intake-banner-apply"
            className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/90 transition-colors whitespace-nowrap"
          >
            Apply Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={dismiss}
            data-testid="intake-banner-dismiss"
            className="text-primary-foreground/40 hover:text-primary-foreground transition-colors p-0.5"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
