import { useState } from "react";
import { Link } from "wouter";
import { useInternationalPartnerships } from "../lib/api-hooks";
import type { PartnerType } from "../lib/api-types";

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
  government: "bg-gray-100 text-gray-700",
  ngo: "bg-orange-100 text-orange-800",
  professional_body: "bg-indigo-100 text-indigo-800",
};

const AREA_LABELS: Record<string, string> = {
  student_exchange: "Student Exchange",
  staff_exchange: "Staff Exchange",
  research: "Research",
  joint_degrees: "Joint Degrees",
  joint_curriculum: "Joint Curriculum",
  quaker_studies: "Quaker Studies",
  peace_studies: "Peace Studies",
  postgraduate: "Postgraduate",
  health_sciences: "Health Sciences",
  agriculture: "Agriculture",
  agroforestry: "Agroforestry",
  food_security: "Food Security",
  research_funding: "Research Funding",
  capacity_building: "Capacity Building",
  water_sanitation: "WASH",
  health: "Health",
  quaker_network: "Quaker Network",
  scholarship: "Scholarship",
  global_engagement: "Global Engagement",
  leadership_development: "Leadership Dev.",
  sustainable_development: "Sustainable Dev.",
  digital_governance: "Digital Governance",
};

const ALPHA2: Record<string, string> = {
  USA: "us", GBR: "gb", UGA: "ug", KEN: "ke", GHA: "gh", NGA: "ng", CIV: "ci",
};

function CountryFlag({ code }: { code?: string }) {
  const alpha2 = ALPHA2[code ?? ""];
  if (!alpha2) {
    return (
      <svg className="w-8 h-8 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c-2.21 0-4-4.03-4-9s1.79-9 4-9m0 18c2.21 0 4-4.03 4-9s-1.79-9-4-9M3 12h18" />
      </svg>
    );
  }
  return <img src={`https://flagcdn.com/w40/${alpha2}.png`} alt={code} className="w-8 h-auto rounded-sm shadow-sm shrink-0" />;
}

const FILTER_TYPES: { value: string; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "university", label: "Universities" },
  { value: "quaker", label: "Quaker Institutions" },
  { value: "research_institute", label: "Research Institutes" },
  { value: "development_agency", label: "Development Agencies" },
  { value: "ngo", label: "NGOs" },
  { value: "government", label: "Government" },
];

export default function InternationalPartnershipsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const { data, isLoading } = useInternationalPartnerships({ type: typeFilter || undefined });
  const partners = data?.data ?? [];

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
            <span className="text-white">Partnerships</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Partnerships & Collaborations</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            KAFU's global network of universities, research institutes, Quaker institutions, and development agencies
            driving knowledge, mobility, and impact.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {FILTER_TYPES.map((f) => (
            <button
              key={f.value}
              data-testid={`filter-type-${f.value || "all"}`}
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

      {/* Partners grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(null).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-gray-100 rounded mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                  <div className="h-6 bg-gray-100 rounded-full w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No partnerships found for the selected filter.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                data-testid={`partner-card-${p.slug}`}
                className="rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all overflow-hidden bg-white"
              >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CountryFlag code={p.country_code ?? ""} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 leading-tight">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.country}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${TYPE_COLOR[p.type] ?? "bg-gray-100 text-gray-700"}`}>
                      {TYPE_LABELS[p.type] ?? p.type}
                    </span>
                  </div>

                  {p.description && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">{p.description}</p>
                  )}

                  {p.mou_date && (
                    <p className="text-xs text-gray-400 mb-3">
                      MOU signed: {new Date(p.mou_date).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
                      {p.mou_expiry ? ` · Valid until ${new Date(p.mou_expiry).getFullYear()}` : ""}
                    </p>
                  )}

                  {p.collaboration_areas?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.collaboration_areas.slice(0, 4).map((a) => (
                        <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {AREA_LABELS[a] ?? a.replace(/_/g, " ")}
                        </span>
                      ))}
                      {p.collaboration_areas.length > 4 && (
                        <span className="text-xs text-gray-400 px-1">+{p.collaboration_areas.length - 4} more</span>
                      )}
                    </div>
                  )}

                  {p.website_url && (
                    <a
                      data-testid={`partner-website-${p.slug}`}
                      href={p.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: "#1A5C38" }}
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Become a partner CTA */}
      <section className="py-14 text-center" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in Partnering with KAFU?</h2>
          <p className="text-white/80 mb-8">
            We welcome new partnerships with universities, research institutes, and development organisations
            that share our commitment to transformative education and community impact.
          </p>
          <a
            data-testid="partnership-inquiry-btn"
            href="mailto:international@kafu.ac.ke?subject=Partnership Inquiry"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-green-900 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#C9A227" }}
          >
            Send Partnership Inquiry
          </a>
        </div>
      </section>
    </div>
  );
}
