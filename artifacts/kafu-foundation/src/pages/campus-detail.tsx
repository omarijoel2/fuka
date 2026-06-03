import { Link, useParams } from "wouter";
import { useCampusDetail } from "@/lib/api-hooks";
import { SITE_URL, SeoHead, ORG_JSONLD } from "@/components/seo-head";
import { CampusMap } from "@/components/campus-map";
import { MapPin, Phone, Mail, Clock, ChevronRight, Building2, ArrowRight, Bus, Info, Users } from "lucide-react";

interface CampusChampion {
  name: string;
  role: string;
  department?: string;
  email?: string;
}

const CAMPUS_CHAMPIONS: Record<string, { title: string; champions: CampusChampion[] }> = {
  "kobujoi": {
    title: "Kobujoi Campus — Web Content Team",
    champions: [
      { name: "To be appointed", role: "Campus Webmaster", department: "Overall site content & coordination", email: "webmaster.kobujoi@kafu.ac.ke" },
      { name: "To be appointed", role: "Academics Content Manager", department: "Programmes, timetables & academic notices" },
      { name: "To be appointed", role: "Student Affairs Content Manager", department: "Student news, welfare & events" },
      { name: "To be appointed", role: "Finance Content Manager", department: "Fees, payments & finance notices" },
      { name: "To be appointed", role: "ICT Content Manager", department: "Systems, e-learning & ICT updates" },
      { name: "To be appointed", role: "Library Content Manager", department: "Library resources & catalogue updates" },
      { name: "To be appointed", role: "Research Content Manager", department: "Research projects, grants & publications" },
    ],
  },
  "vokoli": {
    title: "Vokoli Campus — Web Content Team",
    champions: [
      { name: "To be appointed", role: "Campus Webmaster", department: "Overall site content & coordination", email: "webmaster.vokoli@kafu.ac.ke" },
      { name: "To be appointed", role: "Academics Content Manager", department: "Programmes, timetables & academic notices" },
      { name: "To be appointed", role: "Student Affairs Content Manager", department: "Student news, welfare & events" },
      { name: "To be appointed", role: "Finance Content Manager", department: "Fees, payments & finance notices" },
      { name: "To be appointed", role: "ICT Content Manager", department: "Systems, e-learning & ICT updates" },
      { name: "To be appointed", role: "Library Content Manager", department: "Library resources & catalogue updates" },
      { name: "To be appointed", role: "Research Content Manager", department: "Research projects, grants & publications" },
    ],
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  admissions: "🎓", registrar: "📋", finance: "💳",
  student_affairs: "🤝", ict: "💻", library: "📚",
  health: "🏥", international: "🌍", research: "🔬",
  procurement: "📦", accommodation: "🏠", other: "📌",
};

export default function CampusDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: campus, isLoading, isError } = useCampusDetail(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-72 animate-pulse" style={{ backgroundColor: "#228B22" }} />
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-24 animate-pulse bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !campus) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Campus not found</h1>
          <Link to="/campuses" className="text-primary hover:underline">Back to all campuses</Link>
        </div>
      </div>
    );
  }

  const mapMarker = campus.latitude && campus.longitude ? [{
    lat: campus.latitude, lng: campus.longitude, title: campus.name, description: campus.address, type: "campus" as const,
  }] : [];

  const officesOnCampus = (campus.offices ?? []);

  const seoJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ORG_JSONLD,
      {
        "@type": "Place",
        "name": campus.name,
        "url": `${SITE_URL}/campuses/${campus.slug}`,
        "description": campus.summary,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": campus.address,
          "addressRegion": campus.county,
          "addressCountry": "KE",
        },
        ...(campus.latitude && campus.longitude ? {
          "geo": { "@type": "GeoCoordinates", "latitude": campus.latitude, "longitude": campus.longitude },
        } : {}),
        "telephone": campus.contact_phone,
        "email": campus.contact_email,
        "containedInPlace": { "@id": SITE_URL },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={`${campus.name} | KAFU`}
        description={campus.summary ?? `Learn about ${campus.name}, a Kaimosi Friends University campus in ${campus.county}, Kenya.`}
        path={`/campuses/${campus.slug}`} jsonLd={seoJsonLd}
        breadcrumbs={[{ name: "Contact", path: "/contact" }, { name: "Campuses", path: "/campuses" }, { name: campus.name }]}
      />

      {/* Hero */}
      {campus.hero_image ? (
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={campus.hero_image} alt={campus.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-8">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-3">
              <Link to="/" className="hover:text-white">Home</Link><span>/</span>
              <Link to="/campuses" className="hover:text-white">Campuses</Link><span>/</span>
              <span className="text-white">{campus.name}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{campus.name}</h1>
            {campus.address && <p className="text-white/80 mt-1 flex items-center gap-1.5"><MapPin className="w-4 h-4" />{campus.address}</p>}
          </div>
        </div>
      ) : (
        <section className="text-white py-16" style={{ backgroundColor: "#228B22" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link to="/" className="hover:text-white">Home</Link><span>/</span>
              <Link to="/campuses" className="hover:text-white">Campuses</Link><span>/</span>
              <span className="text-white">{campus.name}</span>
            </nav>
            <h1 className="text-4xl font-bold mb-2">{campus.name}</h1>
            {campus.address && <p className="text-white/80 flex items-center gap-1.5"><MapPin className="w-4 h-4" />{campus.address}</p>}
          </div>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {campus.description && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this Campus</h2>
                <p className="text-gray-700 leading-relaxed">{campus.description}</p>
              </section>
            )}

            {/* Map */}
            {mapMarker.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                <CampusMap center={[campus.latitude!, campus.longitude!]} zoom={15} markers={mapMarker} height="320px" />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${campus.latitude},${campus.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  data-testid="get-directions-btn"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium hover:underline" style={{ color: "#228B22" }}>
                  <MapPin className="w-4 h-4" /> Get Directions on Google Maps
                </a>
              </section>
            )}

            {/* Transport notes */}
            {campus.transport_notes && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Bus className="w-5 h-5" />Getting Here</h2>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <p className="text-gray-700 leading-relaxed text-sm">{campus.transport_notes}</p>
                </div>
              </section>
            )}

            {/* Visitor notes */}
            {campus.visitor_notes && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Info className="w-5 h-5" />Visitor Information</h2>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <p className="text-gray-700 leading-relaxed text-sm">{campus.visitor_notes}</p>
                </div>
              </section>
            )}

            {/* Campus Champions */}
            {CAMPUS_CHAMPIONS[campus.slug ?? ""] && (() => {
              const champ = CAMPUS_CHAMPIONS[campus.slug!];
              return (
                <section data-testid="section-campus-champions">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Users className="w-5 h-5" style={{ color: "#1A5C38" }} />
                    {champ.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">These staff members manage and update web content for this campus. Contact them to submit news, events, or updates.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {champ.champions.map((c, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3" data-testid={`champion-card-${i}`}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ backgroundColor: "#1A5C38" }}>
                          {c.name === "To be appointed" ? "?" : c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold leading-snug ${c.name === "To be appointed" ? "text-gray-400 italic" : "text-gray-900"}`}>{c.name}</p>
                          <p className="text-xs font-medium mt-0.5" style={{ color: "#1A5C38" }}>{c.role}</p>
                          {c.department && <p className="text-xs text-gray-400 mt-0.5">{c.department}</p>}
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="text-xs text-blue-600 hover:underline mt-0.5 block">{c.email}</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Offices on campus */}
            {officesOnCampus.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5" />Offices & Services on this Campus</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {officesOnCampus.map((office) => (
                    <Link key={office.id} to={`/offices/${office.slug}`} data-testid={`office-link-${office.slug}`}
                      className="group flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                      <span className="text-xl">{CATEGORY_ICONS[office.category] ?? "📌"}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{office.name}</p>
                        {office.public_phone && <p className="text-xs text-gray-500">{office.public_phone}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Contact info */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Campus Contact</h3>
              <div className="space-y-3">
                {campus.contact_phone && (
                  <a href={`tel:${campus.contact_phone}`} data-testid="campus-phone" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#228B22" }} />{campus.contact_phone}
                  </a>
                )}
                {campus.contact_email && (
                  <a href={`mailto:${campus.contact_email}`} data-testid="campus-email" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#228B22" }} />{campus.contact_email}
                  </a>
                )}
                {campus.address && (
                  <p className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#228B22" }} />{campus.address}
                  </p>
                )}
                {campus.county && (
                  <p className="text-xs text-gray-400">{campus.county}{campus.region ? `, ${campus.region}` : ""}</p>
                )}
              </div>
            </div>

            {/* Gallery */}
            {(campus.gallery_images ?? []).length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Campus Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(campus.gallery_images ?? []).map((img, i) => (
                    <img key={i} src={img} alt={`${campus.name} gallery ${i + 1}`} className="rounded-lg h-24 w-full object-cover" />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-xl p-5 text-white" style={{ backgroundColor: "#228B22" }}>
              <h3 className="font-bold mb-2">Join KAFU</h3>
              <p className="text-sm text-white/80 mb-4">Start your application and become part of our community.</p>
              <Link to="/admissions" data-testid="campus-sidebar-apply-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: "#DAA520", color: "#1A1A1A" }}>
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
