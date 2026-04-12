import { Link, useParams } from "wouter";
import { useServicePointDetail } from "@/lib/api-hooks";
import { SeoHead, ORG_JSONLD } from "@/components/seo-head";
import { CampusMap } from "@/components/campus-map";
import { Phone, Mail, Clock, MapPin, MessageSquare, ExternalLink, Building2, ChevronRight } from "lucide-react";

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

const HOURS_LABELS: Record<string, string> = {
  mon_fri: "Monday – Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export default function OfficeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: office, isLoading, isError } = useServicePointDetail(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-52 animate-pulse" style={{ backgroundColor: "#1A5C38" }} />
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-5">
          {[1,2,3].map(i => <div key={i} className="h-20 animate-pulse bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !office) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Office not found</h1>
          <Link to="/offices" className="text-primary hover:underline">Back to offices</Link>
        </div>
      </div>
    );
  }

  const mapMarker = office.latitude && office.longitude ? [{
    lat: office.latitude, lng: office.longitude, title: office.name, type: "office" as const,
  }] : (office.campus?.latitude && office.campus?.longitude ? [{
    lat: office.campus.latitude, lng: office.campus.longitude, title: office.campus.name, type: "campus" as const,
  }] : []);

  const mapCenter: [number, number] = office.latitude && office.longitude
    ? [office.latitude, office.longitude]
    : office.campus?.latitude && office.campus?.longitude
      ? [office.campus.latitude, office.campus.longitude]
      : [0.1295, 34.9085];

  const seoJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ORG_JSONLD,
      {
        "@type": "GovernmentOffice",
        "name": office.name,
        "url": `https://kafu.ac.ke/offices/${office.slug}`,
        "description": office.summary,
        "telephone": office.public_phone,
        "email": office.public_email,
        ...(office.physical_location ? { "address": { "@type": "PostalAddress", "streetAddress": office.physical_location, "addressCountry": "KE" } } : {}),
        "parentOrganization": { "@id": "https://kafu.ac.ke" },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={office.seo_meta?.title ?? `${office.name} | KAFU`}
        description={office.seo_meta?.description ?? office.summary ?? `Contact ${office.name} at Kaimosi Friends University.`}
        path={`/offices/${office.slug}`} jsonLd={seoJsonLd}
        breadcrumbs={[
          { name: "Contact", path: "/contact" },
          { name: "Offices", path: "/offices" },
          { name: office.name },
        ]}
      />

      {/* Hero */}
      <section className="text-white py-14" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link><span>/</span>
            <Link to="/contact" className="hover:text-white">Contact</Link><span>/</span>
            <Link to="/offices" className="hover:text-white">Offices</Link><span>/</span>
            <span className="text-white">{office.name}</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{CATEGORY_ICONS[office.category] ?? "📌"}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/20">
              {CATEGORY_LABELS[office.category] ?? office.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{office.name}</h1>
          {office.physical_location && (
            <p className="text-white/70 flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4" />{office.physical_location}</p>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {office.summary && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">About this Office</h2>
                <p className="text-gray-700 leading-relaxed">{office.summary}</p>
              </section>
            )}

            {office.support_scope && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">What We Can Help With</h2>
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <p className="text-gray-700 leading-relaxed text-sm">{office.support_scope}</p>
                </div>
              </section>
            )}

            {/* Office hours */}
            {office.operating_hours && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><Clock className="w-5 h-5" />Opening Hours</h2>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  {Object.entries(office.operating_hours).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between px-5 py-3 border-b last:border-0 border-gray-100 bg-white">
                      <span className="text-sm font-medium text-gray-600">{HOURS_LABELS[key] ?? key}</span>
                      <span className={`text-sm font-semibold ${value === "Closed" ? "text-red-500" : "text-gray-900"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Map */}
            {mapMarker.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
                <CampusMap center={mapCenter} zoom={15} markers={mapMarker} height="280px" />
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapCenter[0]},${mapCenter[1]}`}
                  target="_blank" rel="noopener noreferrer" data-testid="office-directions-btn"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium hover:underline" style={{ color: "#1A5C38" }}>
                  <MapPin className="w-4 h-4" /> Get Directions
                </a>
              </section>
            )}

            {/* Related links */}
            {(office.related_links ?? []).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Related Links</h2>
                <ul className="space-y-2">
                  {(office.related_links ?? []).map((link, i) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" data-testid={`related-link-${i}`}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: "#1A5C38" }}>
                        <ExternalLink className="w-3.5 h-3.5" />{link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Contact card */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">Contact This Office</h3>
              {office.public_phone && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Phone</p>
                  <a href={`tel:${office.public_phone}`} data-testid="office-phone"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" style={{ color: "#1A5C38" }} />{office.public_phone}
                  </a>
                </div>
              )}
              {office.public_email && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Email</p>
                  <a href={`mailto:${office.public_email}`} data-testid="office-email"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-primary transition-colors break-all">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#1A5C38" }} />{office.public_email}
                  </a>
                </div>
              )}
              {office.whatsapp && (
                <a href={`https://wa.me/${office.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                  data-testid="office-whatsapp"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-primary transition-colors">
                  <MessageSquare className="w-4 h-4" style={{ color: "#25D366" }} />WhatsApp: {office.whatsapp}
                </a>
              )}
              {office.contact_person && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Contact Person</p>
                  <p className="text-sm text-gray-700">{office.contact_person}</p>
                </div>
              )}
            </div>

            {/* Campus link */}
            {office.campus && (
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Campus</h3>
                <Link to={`/campuses/${office.campus.slug}`} data-testid="office-campus-link"
                  className="group flex items-center justify-between gap-2 hover:text-primary transition-colors">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Building2 className="w-4 h-4" style={{ color: "#1A5C38" }} />
                    <span className="font-medium group-hover:text-primary">{office.campus.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                </Link>
              </div>
            )}

            {/* Office directory link */}
            <Link to="/offices" data-testid="back-to-offices-btn"
              className="block text-center py-3 px-4 rounded-xl border-2 text-sm font-semibold hover:bg-primary/5 transition-colors"
              style={{ borderColor: "#1A5C38", color: "#1A5C38" }}>
              ← Back to Office Directory
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
