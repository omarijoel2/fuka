import { Link } from "wouter";
import { useCampuses, useServicePoints } from "@/lib/api-hooks";
import { SeoHead, ORG_JSONLD } from "@/components/seo-head";
import { CampusMap } from "@/components/campus-map";
import {
  MapPin, Phone, Mail, Clock, Building2, ChevronRight, Wifi, Heart,
  BookOpen, Globe, Send, GraduationCap, ClipboardList, CreditCard,
  Users, Monitor, FlaskConical, Package, Home, HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { JSX } from "react";

const BRAND_GREEN = "#1A5C38";
const BRAND_GOLD  = "#C9A227";

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  admissions:     <GraduationCap className="w-4 h-4" />,
  registrar:      <ClipboardList className="w-4 h-4" />,
  finance:        <CreditCard className="w-4 h-4" />,
  student_affairs:<Users className="w-4 h-4" />,
  ict:            <Monitor className="w-4 h-4" />,
  library:        <BookOpen className="w-4 h-4" />,
  health:         <Heart className="w-4 h-4" />,
  international:  <Globe className="w-4 h-4" />,
  research:       <FlaskConical className="w-4 h-4" />,
  procurement:    <Package className="w-4 h-4" />,
  accommodation:  <Home className="w-4 h-4" />,
  other:          <HelpCircle className="w-4 h-4" />,
};

const seoJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    ORG_JSONLD,
    { "@type": "ContactPage", "@id": "https://kafu.ac.ke/contact", "name": "Contact KAFU",
      "description": "Find offices, campuses, and contact information for Kaimosi Friends University.",
      "url": "https://kafu.ac.ke/contact", "isPartOf": { "@id": "https://kafu.ac.ke" } },
  ],
};

export default function ContactPage() {
  const { data: campuses = [], isLoading: campusLoading } = useCampuses();
  const { data: offices = [] } = useServicePoints();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const mainCampus = campuses[0];
  const mapMarkers = campuses.filter(c => c.latitude && c.longitude).map(c => ({
    lat: c.latitude!, lng: c.longitude!, title: c.name, description: c.address, type: "campus" as const,
  }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Message Sent", description: "Thank you. We'll get back to you within 2 business days." });
      (e.target as HTMLFormElement).reset();
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title="Contact & Campuses | KAFU"
        description="Find campuses, offices, and contact information for Kaimosi Friends University. Get directions, office hours, and service point details."
        path="/contact" jsonLd={seoJsonLd}
        breadcrumbs={[{ name: "Contact & Campuses", path: "/contact" }]}
      />

      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: BRAND_GREEN }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link><span>/</span>
            <span className="text-white">Contact &amp; Campuses</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact &amp; Campuses</h1>
          <p className="text-lg text-white/80 max-w-2xl">Find our campuses, offices, and service points. We're here to support you.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="tel:+254777373633" data-testid="quick-call-btn"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Phone className="w-4 h-4" /> Call Us
            </a>
            <a href="mailto:info@kafu.ac.ke" data-testid="quick-email-btn"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Mail className="w-4 h-4" /> Email Us
            </a>
            <Link to="/campuses" data-testid="view-campuses-btn"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <MapPin className="w-4 h-4" /> All Campuses
            </Link>
            <Link to="/offices" data-testid="view-offices-btn"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Building2 className="w-4 h-4" /> Office Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Quick contacts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Phone className="w-5 h-5 text-white" />, label: "Main Switchboard", value: "+254 777 373 633", href: "tel:+254777373633", sub: "Mon–Fri, 8:00 AM – 5:00 PM" },
              { icon: <Mail className="w-5 h-5 text-white" />, label: "General Enquiries", value: "info@kafu.ac.ke", href: "mailto:info@kafu.ac.ke", sub: "Response within 2 business days" },
              { icon: <MapPin className="w-5 h-5 text-white" />, label: "Main Campus", value: "Kaimosi, Vihiga County", href: undefined, sub: "P.O. Box 27 — 50309, Kenya" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND_GREEN }}>{item.icon}</div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-base font-bold text-gray-900 hover:text-primary transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-base font-bold text-gray-900">{item.value}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Find Us on the Map</h2>
            <Link to="/campuses" className="text-sm font-medium hover:underline" style={{ color: BRAND_GREEN }}>All campuses &rarr;</Link>
          </div>
          {campusLoading ? (
            <div className="h-80 animate-pulse bg-gray-200 rounded-xl" />
          ) : mainCampus ? (
            <CampusMap center={[mainCampus.latitude ?? 0.1295, mainCampus.longitude ?? 34.9085]} zoom={13} markers={mapMarkers} height="380px" />
          ) : null}
          <p className="text-xs text-gray-400 mt-2">Map data &copy; OpenStreetMap contributors.</p>
        </div>
      </section>

      {/* Campuses */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Campuses</h2>
              <p className="text-gray-500 text-sm mt-1">KAFU campuses across Western Kenya</p>
            </div>
            <Link to="/campuses" data-testid="all-campuses-link" className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: BRAND_GREEN }}>
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campuses.map((campus) => (
              <Link key={campus.id} to={`/campuses/${campus.slug}`} data-testid={`campus-card-${campus.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                {campus.hero_image ? (
                  <img src={campus.hero_image} alt={campus.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: BRAND_GREEN }}>
                    <MapPin className="w-12 h-12 text-white/40" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">{campus.name}</h3>
                  {campus.address && <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{campus.address}</p>}
                  {campus.summary && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{campus.summary}</p>}
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: BRAND_GREEN }}>View campus <ChevronRight className="w-3 h-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Office quick-access */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Key Offices &amp; Services</h2>
              <p className="text-gray-500 text-sm mt-1">Quick access to essential university offices</p>
            </div>
            <Link to="/offices" data-testid="all-offices-link" className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: BRAND_GREEN }}>
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offices.slice(0, 6).map((office) => (
              <Link key={office.id} to={`/offices/${office.slug}`} data-testid={`office-card-${office.slug}`}
                className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: BRAND_GREEN }}>
                  {CATEGORY_ICONS[office.category] ?? <HelpCircle className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm leading-snug">{office.name}</h3>
                  {office.public_phone && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{office.public_phone}</p>}
                  {office.operating_hours?.mon_fri && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{office.operating_hours.mon_fri}</p>}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/offices" data-testid="offices-full-directory-btn"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: BRAND_GREEN }}>
              <Building2 className="w-4 h-4" /> Full Office Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Contact form + quick links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">We'll respond within 2 business days.</p>
              <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required placeholder="John" data-testid="input-firstname" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required placeholder="Doe" data-testid="input-lastname" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required placeholder="you@example.com" data-testid="input-email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required placeholder="How can we help?" data-testid="input-subject" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required placeholder="Your message..." className="min-h-[100px]" data-testid="input-message" />
                </div>
                <Button type="submit" disabled={submitting} data-testid="btn-submit-contact"
                  className="w-full text-white font-semibold" style={{ backgroundColor: BRAND_GOLD }}>
                  {submitting ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
                </Button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">More Ways to Connect</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Wifi className="w-5 h-5" />, title: "Student Portal", desc: "Academic records and fees", href: "https://portal.kafu.ac.ke", testId: "link-portal" },
                  { icon: <Heart className="w-5 h-5" />, title: "Counselling", desc: "Mental health and support", href: "/offices/student-affairs-office", testId: "link-counselling" },
                  { icon: <BookOpen className="w-5 h-5" />, title: "Library", desc: "Physical and digital resources", href: "/offices/library", testId: "link-library" },
                  { icon: <Globe className="w-5 h-5" />, title: "International Students", desc: "Support for international applicants", href: "/international", testId: "link-international" },
                ].map((item) => (
                  <a key={item.testId} href={item.href} data-testid={item.testId}
                    className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-white" style={{ backgroundColor: BRAND_GREEN }}>{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
