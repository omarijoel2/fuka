import type { ReactElement } from "react";
import { Link } from "wouter";
import { useInternationalOverview } from "../lib/api-hooks";

const TYPE_LABELS: Record<string, string> = {
  university: "University",
  research_institute: "Research Institute",
  government: "Government",
  ngo: "NGO",
  development_agency: "Development Agency",
  quaker: "Quaker Institution",
  professional_body: "Professional Body",
};

const TYPE_COLOR: Record<string, string> = {
  quaker: "bg-amber-100 text-amber-800",
  university: "bg-blue-100 text-blue-800",
  research_institute: "bg-purple-100 text-purple-800",
  development_agency: "bg-green-100 text-green-800",
  government: "bg-gray-100 text-gray-800",
  ngo: "bg-orange-100 text-orange-800",
  professional_body: "bg-indigo-100 text-indigo-800",
};

const EXCHANGE_TYPE_LABEL: Record<string, string> = {
  student_exchange: "Student Exchange",
  staff_exchange: "Staff Exchange",
  joint_degree: "Joint Degree",
  summer_school: "Summer School",
  research_fellowship: "Research Fellowship",
  internship: "Internship",
};

const ALPHA2: Record<string, string> = {
  USA: "us", GBR: "gb", UGA: "ug", KEN: "ke", GHA: "gh", NGA: "ng", CIV: "ci",
};

function CountryFlag({ code }: { code?: string }) {
  const alpha2 = ALPHA2[code ?? ""];
  if (!alpha2) {
    return (
      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c-2.21 0-4-4.03-4-9s1.79-9 4-9m0 18c2.21 0 4-4.03 4-9s-1.79-9-4-9M3 12h18" />
      </svg>
    );
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${alpha2}.png`}
      alt={code}
      className="w-8 h-auto rounded-sm shadow-sm"
    />
  );
}

const QuickLinkIcons: Record<string, ReactElement> = {
  study: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  visa: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m0-3.75h3M6 6.75A2.25 2.25 0 018.25 4.5h1.5" />
    </svg>
  ),
  exchange: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  partners: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
};

export default function InternationalPage() {
  const { data: overview, isLoading } = useInternationalOverview();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A5C38 0%, #0f3d26 40%, #1a3a5c 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium tracking-wide uppercase">Global Engagement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            KAFU at the{" "}
            <span style={{ color: "#C9A227" }}>World Stage</span>
          </h1>
          <p className="text-xl text-white/85 max-w-3xl mx-auto mb-10 leading-relaxed">
            Kaimosi Friends University bridges Western Kenya with the world through partnerships,
            exchange programmes, and global research collaborations rooted in Quaker values.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              data-testid="hero-apply-btn"
              to="/admissions"
              className="px-8 py-3 rounded-lg font-semibold text-white text-lg transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#C9A227" }}
            >
              Apply as International Student
            </Link>
            <Link
              data-testid="hero-exchange-btn"
              to="/international/exchange"
              className="px-8 py-3 rounded-lg font-semibold text-white text-lg border border-white/40 hover:bg-white/10 transition-all"
            >
              Explore Exchange Programmes
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-black/20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {isLoading
              ? Array(5).fill(null).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-8 bg-white/20 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded" />
                  </div>
                ))
              : overview?.stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-bold" style={{ color: "#C9A227" }}>
                      {typeof s.value === "number" && s.value > 100 ? s.value.toLocaleString() : s.value}
                    </div>
                    <div className="text-sm text-white/70 mt-1">{s.label}</div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: "/international/study", iconKey: "study", title: "Study at KAFU", sub: "Programmes, fees & application" },
            { to: "/international/visa",  iconKey: "visa", title: "Visa & Immigration", sub: "Requirements & documentation" },
            { to: "/international/exchange", iconKey: "exchange", title: "Exchange Programmes", sub: "Student & staff mobility" },
            { to: "/international/partnerships", iconKey: "partners", title: "Our Partners", sub: "Global institutional network" },
          ].map((card) => (
            <Link
              key={card.to}
              data-testid={`quick-link-${card.to.split("/").pop()}`}
              to={card.to}
              className="group flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
            >
              <span className="mb-3 text-green-700 group-hover:text-green-900">{QuickLinkIcons[card.iconKey]}</span>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-800">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Partnerships */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Partners</h2>
              <p className="text-gray-600 mt-2">Institutions shaping KAFU's global reach</p>
            </div>
            <Link
              data-testid="view-all-partners-link"
              to="/international/partnerships"
              className="font-medium hover:underline"
              style={{ color: "#1A5C38" }}
            >
              View all partners →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(6).fill(null).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-16 bg-gray-100 rounded" />
                  </div>
                ))
              : overview?.featured_partnerships.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <CountryFlag code={p.country_code} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 leading-tight">{p.name}</h3>
                        <p className="text-sm text-gray-500">{p.country}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${TYPE_COLOR[p.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {TYPE_LABELS[p.type] ?? p.type}
                      </span>
                    </div>
                    {p.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                    )}
                    {p.collaboration_areas?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.collaboration_areas.slice(0, 3).map((a) => (
                          <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {a.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Exchange Programmes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Open Opportunities</h2>
              <p className="text-gray-600 mt-2">Student & staff mobility programmes currently accepting applications</p>
            </div>
            <Link
              data-testid="view-all-exchange-link"
              to="/international/exchange"
              className="font-medium hover:underline"
              style={{ color: "#1A5C38" }}
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(3).fill(null).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                    <div className="h-16 bg-gray-100 rounded" />
                  </div>
                ))
              : overview?.featured_programmes.map((prog) => (
                  <div
                    key={prog.id}
                    className="rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-green-700 bg-green-50 px-2 py-0.5 rounded">
                          {EXCHANGE_TYPE_LABEL[prog.type] ?? prog.type}
                        </span>
                        <span className="text-xs text-green-600 font-medium">Open</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 leading-tight">{prog.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{prog.partner_name} · {prog.partner_country}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{prog.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {prog.duration_label && (
                          <div>
                            <span className="text-gray-400 text-xs">Duration</span>
                            <p className="font-medium text-gray-700">{prog.duration_label}</p>
                          </div>
                        )}
                        {prog.next_intake && (
                          <div>
                            <span className="text-gray-400 text-xs">Next Intake</span>
                            <p className="font-medium text-gray-700">{prog.next_intake}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <Link
                        data-testid={`programme-detail-${prog.slug}`}
                        to={`/international/exchange`}
                        className="block text-center w-full py-2.5 rounded-lg font-medium text-white text-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: "#1A5C38" }}
                      >
                        View Programme
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Why KAFU global CTA */}
      <section
        className="py-16 text-white text-center"
        style={{ backgroundColor: "#1A5C38" }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Join a Global Community?</h2>
          <p className="text-white/80 text-lg mb-8">
            Applications are open for international undergraduate and postgraduate programmes.
            Our International Office is here to guide you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              data-testid="cta-apply-international"
              to="/admissions"
              className="px-8 py-3 rounded-lg font-semibold text-green-900 text-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#C9A227" }}
            >
              Apply Now
            </Link>
            <a
              data-testid="cta-contact-intl"
              href="mailto:international@kafu.ac.ke"
              className="px-8 py-3 rounded-lg font-semibold text-white text-lg border border-white/40 hover:bg-white/10 transition-all"
            >
              Contact International Office
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
