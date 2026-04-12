import { useState } from "react";
import { Link } from "wouter";
import { useExchangeProgrammes } from "../lib/api-hooks";
import type { ExchangeType, ExchangeStatus } from "../lib/api-types";

const TYPE_LABELS: Record<ExchangeType, string> = {
  student_exchange: "Student Exchange",
  staff_exchange: "Staff Exchange",
  joint_degree: "Joint Degree",
  summer_school: "Summer School",
  research_fellowship: "Research Fellowship",
  internship: "Internship",
};

const STATUS_STYLE: Record<ExchangeStatus, string> = {
  open: "bg-green-100 text-green-800",
  upcoming: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-600",
  suspended: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<ExchangeStatus, string> = {
  open: "Open",
  upcoming: "Upcoming",
  closed: "Closed",
  suspended: "Suspended",
};

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "student_exchange", label: "Student Exchange" },
  { value: "staff_exchange", label: "Staff Exchange" },
  { value: "research_fellowship", label: "Research Fellowship" },
  { value: "internship", label: "Internship" },
  { value: "summer_school", label: "Summer School" },
];

function formatDeadline(iso?: string): string {
  if (!iso) return "Rolling";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function InternationalExchangePage() {
  const [typeFilter, setTypeFilter] = useState("");
  const { data, isLoading } = useExchangeProgrammes({ type: typeFilter || undefined });
  const programmes = data?.data ?? [];

  const open = programmes.filter((p) => p.status === "open");
  const other = programmes.filter((p) => p.status !== "open");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="text-white py-16" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/international" className="hover:text-white">International</Link>
            <span>/</span>
            <span className="text-white">Exchange Programmes</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Exchange & Mobility Programmes</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Student exchange, staff mobility, research fellowships, and internships with KAFU's
            international partner institutions.
          </p>
        </div>
      </section>

      {/* Intro strip */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-sm text-amber-800">
            <strong>How it works:</strong> Select a programme, check eligibility, prepare your documents, and apply through the KAFU International Office.
            Stipends and travel support are available for most programmes.
          </p>
          <a
            data-testid="exchange-contact-link"
            href="mailto:international@kafu.ac.ke"
            className="shrink-0 text-sm font-semibold underline"
            style={{ color: "#1A5C38" }}
          >
            Contact International Office
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              data-testid={`filter-exchange-${f.value || "all"}`}
              onClick={() => setTypeFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                typeFilter === f.value
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={typeFilter === f.value ? { backgroundColor: "#1A5C38", borderColor: "#1A5C38" } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Open programmes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="space-y-5">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
                <div className="h-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : programmes.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No programmes found for the selected filter.</div>
        ) : (
          <>
            {open.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Open for Applications</h2>
                <div className="space-y-5">
                  {open.map((prog) => {
                    const days = daysUntil(prog.application_deadline);
                    const urgent = days !== null && days <= 30;
                    return (
                      <div
                        key={prog.id}
                        data-testid={`programme-card-${prog.slug}`}
                        className={`rounded-2xl border p-6 transition-all hover:shadow-md ${urgent ? "border-amber-300 bg-amber-50/30" : "border-gray-200 bg-white"}`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[prog.status as ExchangeStatus]}`}>
                                {STATUS_LABEL[prog.status as ExchangeStatus]}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {TYPE_LABELS[prog.type as ExchangeType]}
                              </span>
                              {urgent && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                  Deadline in {days} days
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{prog.title}</h3>
                            <p className="text-gray-500 text-sm mb-3">
                              {prog.partner_name}{prog.partner_country ? ` · ${prog.partner_country}` : ""}
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">{prog.description}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              {prog.duration_label && (
                                <div>
                                  <span className="text-gray-400 text-xs block">Duration</span>
                                  <span className="font-medium text-gray-800">{prog.duration_label}</span>
                                </div>
                              )}
                              {prog.next_intake && (
                                <div>
                                  <span className="text-gray-400 text-xs block">Next Intake</span>
                                  <span className="font-medium text-gray-800">{prog.next_intake}</span>
                                </div>
                              )}
                              {prog.slots_available != null && (
                                <div>
                                  <span className="text-gray-400 text-xs block">Slots</span>
                                  <span className="font-medium text-gray-800">{prog.slots_available} available</span>
                                </div>
                              )}
                              {prog.stipend_amount != null && (
                                <div>
                                  <span className="text-gray-400 text-xs block">Stipend</span>
                                  <span className="font-medium text-gray-800">
                                    {prog.stipend_currency} {Number(prog.stipend_amount).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="lg:w-64 shrink-0 space-y-3">
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-xs text-gray-500 mb-1">Application Deadline</p>
                              <p className="font-semibold text-gray-900 text-sm">{formatDeadline(prog.application_deadline)}</p>
                            </div>

                            {prog.eligibility && prog.eligibility.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-2 font-medium">Eligibility (summary)</p>
                                <ul className="space-y-1">
                                  {prog.eligibility.slice(0, 3).map((e, i) => (
                                    <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                                      <span style={{ color: "#1A5C38" }}>✓</span> {e}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <a
                              data-testid={`apply-btn-${prog.slug}`}
                              href="mailto:international@kafu.ac.ke?subject=Exchange Programme Application"
                              className="block text-center w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90"
                              style={{ backgroundColor: "#1A5C38" }}
                            >
                              Apply / Inquire
                            </a>
                          </div>
                        </div>

                        {prog.benefits && prog.benefits.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2 font-medium">Benefits include:</p>
                            <div className="flex flex-wrap gap-2">
                              {prog.benefits.map((b, i) => (
                                <span key={i} className="text-xs bg-green-50 text-green-800 px-2 py-0.5 rounded border border-green-100">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {other.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Programmes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {other.map((prog) => (
                    <div
                      key={prog.id}
                      data-testid={`programme-card-${prog.slug}`}
                      className="rounded-xl border border-gray-200 p-5 bg-white opacity-80"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[prog.status as ExchangeStatus]}`}>
                          {STATUS_LABEL[prog.status as ExchangeStatus]}
                        </span>
                        <span className="text-xs text-gray-500">{TYPE_LABELS[prog.type as ExchangeType]}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{prog.title}</h3>
                      <p className="text-sm text-gray-500">{prog.partner_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <section className="py-14 text-center" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-3">Don't See What You're Looking For?</h2>
          <p className="text-white/80 mb-6">
            Contact our International Office — new exchange opportunities are added throughout the year.
          </p>
          <a
            data-testid="exchange-cta-contact"
            href="mailto:international@kafu.ac.ke"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-green-900 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#C9A227" }}
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
