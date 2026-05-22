import React from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Heart, Leaf, Users, BookOpen, Globe, CheckCircle, ChevronRight, Mail } from "lucide-react";

const CSR_PILLARS = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Education & Skills Development",
    colour: "#1A5C38",
    description:
      "KAFU supports community education through outreach programmes, bursaries for needy students from the surrounding region, adult literacy initiatives, and school mentorship programmes at secondary schools in Vihiga, Kakamega, and neighbouring counties.",
    initiatives: [
      "Annual KAFU Open Days for secondary school students",
      "Academic bursaries for students from underserved communities",
      "Adult literacy and continuing education support",
      "Career mentorship programme for secondary school students",
    ],
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Health & Community Well-Being",
    colour: "#8B1A1A",
    description:
      "Through the School of Health Sciences, KAFU runs community health outreach programmes including eye health camps, general health screening, and health education initiatives targeting rural communities in Western Kenya.",
    initiatives: [
      "Community eye health camps in Vihiga and Kakamega counties",
      "Free health screening days at the KAFU Health Centre",
      "Community partnerships with county referral hospitals",
      "Health education workshops for village health workers",
    ],
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Environmental Sustainability",
    colour: "#2D6A4F",
    description:
      "KAFU is committed to environmental stewardship through the Centre of Excellence on Climate Action and Research. The university promotes sustainable practices across the campus and in the wider community.",
    initiatives: [
      "Tree planting and reforestation programmes across campus",
      "Sustainable waste management and recycling initiatives",
      "Solar energy installations reducing the campus carbon footprint",
      "Community environmental awareness campaigns",
    ],
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Engagement & Partnerships",
    colour: "#C9A227",
    description:
      "KAFU actively engages with local government, civil society, faith communities, and the private sector to co-create solutions that uplift livelihoods and build social capital in the surrounding region.",
    initiatives: [
      "Annual Community Service Day involving students and staff",
      "Partnerships with Vihiga County Government on development programmes",
      "Faith community engagement through the university's Quaker heritage",
      "Collaboration with NGOs on poverty alleviation initiatives",
    ],
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Responsible Institutional Stewardship",
    colour: "#1B3A6B",
    description:
      "KAFU upholds the principles of responsible governance, ethical resource management, and transparent reporting in all its operations. The university is committed to being a responsible corporate citizen.",
    initiatives: [
      "Annual sustainability and social impact reporting",
      "Ethical procurement practices preferring local suppliers",
      "Living wage commitments for all university employees",
      "Transparent financial management and audit compliance",
    ],
  },
];

const COMMITMENTS = [
  "Transform lives through knowledge, service, and community engagement",
  "Actively uplift society beyond the boundaries of the university campus",
  "Promote environmental sustainability and responsible resource use",
  "Advance social equity through targeted support for underserved communities",
  "Build deliberate partnerships that amplify community impact",
  "Embed Quaker values of service, integrity, and compassion in all our work",
];

export default function AboutCSR() {
  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Corporate Social Responsibility — About | KAFU"
        description="At KAFU, Corporate Social Responsibility is embedded in our mission to transform lives through knowledge, service, and community engagement. Explore our CSR pillars and initiatives."
        path="/about/csr"
        breadcrumbs={[
          { name: "About", path: "/about" },
          { name: "Corporate Social Responsibility" },
        ]}
      />

      <PageHero
        title="Corporate Social Responsibility"
        subtitle="KAFU believes a university must not only educate but actively uplift society — through partnerships, community engagement, and responsible stewardship"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Corporate Social Responsibility" },
        ]}
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Our Commitment to Society</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Kaimosi Friends University, Corporate Social Responsibility is embedded in our mission to
            transform lives through knowledge, service, and community engagement. We believe a university
            must not only educate but actively uplift society.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Through deliberate partnerships, community engagement, and responsible stewardship of resources,
            the University actively contributes to improving livelihoods, promoting environmental
            sustainability, and advancing social equity across Western Kenya and beyond.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Rooted in the Quaker tradition of service and integrity, KAFU's CSR approach is not a separate
            corporate programme — it is woven into the fabric of how we teach, research, and operate as an
            institution.
          </p>

          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="font-bold text-primary mb-4">Our CSR Commitments</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {COMMITMENTS.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CSR Pillars */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">CSR Pillars & Initiatives</h2>
          <p className="text-gray-600 mb-8">Our CSR work is organised around five strategic pillars, each reflecting a dimension of our responsibility to society.</p>
          <div className="space-y-6">
            {CSR_PILLARS.map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: pillar.colour }}>
                    {pillar.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{pillar.title}</h3>
                </div>
                <div className="px-6 py-5 grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3">
                    <p className="text-gray-700 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Key Initiatives</p>
                    <ul className="space-y-2">
                      {pillar.initiatives.map((init, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: pillar.colour }} />
                          {init}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quaker heritage note */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-primary text-white rounded-xl p-8">
            <h2 className="text-xl font-bold font-serif mb-4">Rooted in Quaker Values</h2>
            <p className="text-white/85 leading-relaxed mb-4">
              Kaimosi Friends University was founded by the Friends Church (Quakers) and carries a
              deep heritage of service, integrity, peace-building, and community uplift. These values
              are not merely historical — they actively shape how KAFU engages with society today.
            </p>
            <p className="text-white/85 leading-relaxed">
              The Quaker principle of "that of God in every person" underpins our belief in the equal
              dignity and worth of every community member we serve, from our students and staff to the
              farmers, traders, and families who live and work around our campus in Kaimosi, Vihiga County.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-bold text-xl text-gray-900 mb-1">Partner with KAFU on CSR</p>
            <p className="text-gray-600 text-sm">We welcome partnerships with organisations that share our commitment to community development.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:csr@kafu.ac.ke" data-testid="btn-csr-email" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded font-semibold text-sm hover:bg-primary/90 transition-colors">
              <Mail className="w-4 h-4" /> csr@kafu.ac.ke
            </a>
            <Link href="/contact" data-testid="btn-contact">
              <span className="inline-flex items-center gap-2 border border-primary text-primary px-5 py-2.5 rounded font-semibold text-sm hover:bg-primary/5 transition-colors">
                Contact Us <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
