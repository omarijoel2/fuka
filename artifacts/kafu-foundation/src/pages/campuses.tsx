import { Link } from "wouter";
import { useCampuses } from "@/lib/api-hooks";
import { SeoHead, ORG_JSONLD } from "@/components/seo-head";
import { CampusMap } from "@/components/campus-map";
import { MapPin, Phone, Mail, ChevronRight, ArrowRight } from "lucide-react";

const seoJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    ORG_JSONLD,
    { "@type": "WebPage", "name": "KAFU Campuses", "url": "https://kafu.ac.ke/campuses",
      "description": "Discover Kaimosi Friends University campuses across Western Kenya." },
  ],
};

export default function CampusesPage() {
  const { data: campuses = [], isLoading } = useCampuses();

  const mapMarkers = campuses.filter(c => c.latitude && c.longitude).map(c => ({
    lat: c.latitude!, lng: c.longitude!, title: c.name, description: c.address, type: "campus" as const,
  }));

  const mainCenter: [number, number] = campuses[0]?.latitude && campuses[0]?.longitude
    ? [campuses[0].latitude, campuses[0].longitude]
    : [0.1295, 34.9085];

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title="Our Campuses | KAFU"
        description="Discover Kaimosi Friends University campuses — Main Campus in Kaimosi, Vihiga County, and Kisumu Campus serving the Lake Basin region."
        path="/campuses" jsonLd={seoJsonLd}
        breadcrumbs={[{ name: "Contact", path: "/contact" }, { name: "Campuses" }]}
      />

      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link><span>/</span>
            <Link to="/contact" className="hover:text-white">Contact</Link><span>/</span>
            <span className="text-white">Campuses</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Campuses</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Kaimosi Friends University operates campuses across Western Kenya, bringing quality higher education closer to communities.
          </p>
        </div>
      </section>

      {/* Map overview */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Campus Locations</h2>
          {!isLoading && campuses.length > 0 ? (
            <CampusMap center={mainCenter} zoom={10} markers={mapMarkers} height="400px" />
          ) : (
            <div className="h-96 animate-pulse bg-gray-200 rounded-xl" />
          )}
          <p className="text-xs text-gray-400 mt-2">Click a marker to see campus details. Map data © OpenStreetMap contributors.</p>
        </div>
      </section>

      {/* Campus cards */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Campuses</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2].map(i => <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-64" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {campuses.map((campus) => (
                <div key={campus.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow" data-testid={`campus-item-${campus.slug}`}>
                  {campus.hero_image ? (
                    <img src={campus.hero_image} alt={campus.name} className="w-full h-52 object-cover" />
                  ) : (
                    <div className="w-full h-52 flex items-center justify-center" style={{ backgroundColor: "#1A5C38" }}>
                      <MapPin className="w-14 h-14 text-white/30" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{campus.name}</h3>
                    {campus.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{campus.address}
                      </p>
                    )}
                    {campus.summary && <p className="text-gray-600 text-sm leading-relaxed mb-4">{campus.summary}</p>}

                    <div className="flex flex-wrap gap-3 mb-5">
                      {campus.contact_phone && (
                        <a href={`tel:${campus.contact_phone}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary transition-colors">
                          <Phone className="w-3 h-3" />{campus.contact_phone}
                        </a>
                      )}
                      {campus.contact_email && (
                        <a href={`mailto:${campus.contact_email}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary transition-colors">
                          <Mail className="w-3 h-3" />{campus.contact_email}
                        </a>
                      )}
                    </div>

                    <Link to={`/campuses/${campus.slug}`} data-testid={`campus-detail-link-${campus.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: "#1A5C38" }}>
                      View Campus <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join KAFU?</h2>
          <p className="text-white/80 mb-8">Apply today and begin your academic journey at Kaimosi Friends University.</p>
          <Link to="/admissions" data-testid="campus-apply-btn"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: "#C9A227", color: "#1A1A1A" }}>
            Apply Now <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
