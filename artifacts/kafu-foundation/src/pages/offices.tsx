import { useState } from "react";
import { Link } from "wouter";
import { useServicePoints, useCampuses } from "@/lib/api-hooks";
import { SeoHead, ORG_JSONLD } from "@/components/seo-head";
import { Phone, Mail, Clock, MapPin, Search, ChevronRight, Building2 } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  admissions: "Admissions", registrar: "Registrar", finance: "Finance",
  student_affairs: "Student Affairs", ict: "ICT Support", library: "Library",
  health: "Health Services", international: "International", research: "Research",
  procurement: "Procurement", accommodation: "Accommodation", other: "General",
};

const CATEGORY_ICONS: Record<string, string> = {
  admissions: "🎓", registrar: "📋", finance: "💳",
  student_affairs: "🤝", ict: "💻", library: "📚",
  health: "🏥", international: "🌍", research: "🔬",
  procurement: "📦", accommodation: "🏠", other: "📌",
};

const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS);

const seoJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    ORG_JSONLD,
    { "@type": "WebPage", "name": "KAFU Offices & Services Directory", "url": "https://kafu.ac.ke/offices",
      "description": "Find offices and service points at Kaimosi Friends University." },
  ],
};

export default function OfficesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [campusFilter, setCampusFilter] = useState("");

  const { data: campuses = [] } = useCampuses();
  const { data: offices = [], isLoading } = useServicePoints({
    category: category || undefined,
    campus_id: campusFilter ? Number(campusFilter) : undefined,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title="Offices & Services Directory | KAFU"
        description="Find offices, service points, and contact details for all university departments at Kaimosi Friends University."
        path="/offices" jsonLd={seoJsonLd}
        breadcrumbs={[{ name: "Contact", path: "/contact" }, { name: "Offices & Services" }]}
      />

      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link><span>/</span>
            <Link to="/contact" className="hover:text-white">Contact</Link><span>/</span>
            <span className="text-white">Offices & Services</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Offices & Services</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Find any university office, service centre, or support department — with contact details and opening hours.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search offices…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                data-testid="input-office-search"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              />
            </div>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              data-testid="select-office-category"
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
              <option value="">All Categories</option>
              {ALL_CATEGORIES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {campuses.length > 1 && (
              <select
                value={campusFilter} onChange={e => setCampusFilter(e.target.value)}
                data-testid="select-office-campus"
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                <option value="">All Campuses</option>
                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{isLoading ? "Loading…" : `${offices.length} office${offices.length !== 1 ? "s" : ""} found`}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="h-44 animate-pulse bg-gray-200 rounded-xl" />)}
            </div>
          ) : offices.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No offices found matching your filters.</p>
              <button onClick={() => { setSearch(""); setCategory(""); setCampusFilter(""); }}
                className="mt-3 text-sm hover:underline" style={{ color: "#1A5C38" }}>Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offices.map((office) => (
                <Link key={office.id} to={`/offices/${office.slug}`} data-testid={`office-item-${office.slug}`}
                  className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{CATEGORY_ICONS[office.category] ?? "📌"}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 mb-1 inline-block">
                        {CATEGORY_LABELS[office.category] ?? office.category}
                      </span>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm leading-snug">{office.name}</h3>
                    </div>
                  </div>

                  {office.summary && <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2 flex-1">{office.summary}</p>}

                  <div className="space-y-1.5 mt-auto pt-3 border-t border-gray-100">
                    {office.public_phone && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Phone className="w-3 h-3 flex-shrink-0" style={{ color: "#1A5C38" }} />{office.public_phone}
                      </p>
                    )}
                    {office.operating_hours?.mon_fri && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3 flex-shrink-0" />{office.operating_hours.mon_fri}
                      </p>
                    )}
                    {office.campus && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="w-3 h-3 flex-shrink-0" />{office.campus.name}
                      </p>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-xs font-semibold mt-3" style={{ color: "#1A5C38" }}>
                    View details <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
