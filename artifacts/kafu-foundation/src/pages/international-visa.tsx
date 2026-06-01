import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "../components/seo-head";

const FALLBACK_VISA_CATEGORIES = [
  {
    title: "East African Community Citizens",
    countries: "Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, DRC",
    badge: "Simplified Process",
    badgeColor: "bg-green-100 text-green-800",
    steps: [
      "No student visa required — EAC student pass applies",
      "Obtain a Letter of Admission from KAFU",
      "Report to the nearest immigration office on arrival with admission letter + national ID",
      "Obtain a student pass from the Department of Immigration Services, Kenya",
      "Renew student pass each academic year",
    ],
    docs: [
      "Valid national identity card or passport",
      "KAFU official admission letter",
      "Proof of fees payment or financial sponsorship",
      "Passport photographs (2 recent colour photos)",
    ],
  },
  {
    title: "African Union Member States",
    countries: "Ghana, Nigeria, Ethiopia, South Africa, Egypt, Senegal, Cameroon, and all other AU members",
    badge: "Student Visa Required",
    badgeColor: "bg-amber-100 text-amber-800",
    steps: [
      "Receive official KAFU admission letter",
      "Apply for a Kenyan student visa at the nearest Kenyan embassy or consulate",
      "Alternatively, use the Kenya eDiaspora portal for visa on arrival (select nationalities)",
      "Pay visa fee (USD 50 single entry)",
      "Obtain student pass on arrival from Immigration",
    ],
    docs: [
      "Valid international passport (minimum 6 months validity)",
      "KAFU official admission letter",
      "Financial proof: bank statement, scholarship letter, or sponsor's letter",
      "Recent passport photographs (2 colour, white background)",
      "Yellow fever vaccination certificate (required for most travellers)",
      "Medical fitness certificate (for course lengths exceeding 3 months)",
    ],
  },
  {
    title: "Rest of World",
    countries: "Europe, North America, Asia, Australia, Latin America, Middle East, and all non-AU countries",
    badge: "Student Visa + KAFU Clearance",
    badgeColor: "bg-blue-100 text-blue-800",
    steps: [
      "Receive official KAFU admission letter",
      "Contact KAFU International Office to obtain a Visa Support Letter",
      "Apply for a Kenyan student visa at the nearest Kenyan embassy — minimum 6 weeks before travel",
      "Submit biometrics at the embassy (appointment required in most countries)",
      "On arrival, obtain a student pass at the airport or regional immigration office",
      "Register with the Department of Immigration Services within 30 days of arrival",
    ],
    docs: [
      "Valid international passport (minimum 6 months validity beyond intended stay)",
      "KAFU official admission letter",
      "KAFU Visa Support Letter (from International Office)",
      "Financial statement showing adequate funds (min. USD 5,000 equivalent)",
      "Health insurance covering Kenya",
      "Yellow fever vaccination certificate",
      "Medical fitness certificate",
      "Police clearance certificate (home country, apostille if required)",
      "Passport photographs (4 recent colour, white background)",
    ],
  },
];

const SUPPORT_ICONS: Record<string, ReactElement> = {
  airport: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  document: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
    </svg>
  ),
  academic: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
};

const SUPPORT_SERVICES = [
  {
    title: "Airport Pick-up",
    desc: "KAFU International Office can arrange airport transfer from Kisumu Airport or Eldoret Airport for new international students. Notify us 72 hours in advance.",
    iconKey: "airport",
  },
  {
    title: "Immigration Guidance",
    desc: "Our International Office staff provide personalised support for student pass applications, renewals, and any immigration queries throughout your studies.",
    iconKey: "document",
  },
  {
    title: "Orientation Week",
    desc: "All international students are invited to a dedicated orientation week before semester begins, covering campus life, culture, safety, and academic expectations.",
    iconKey: "academic",
  },
  {
    title: "Peer Buddy Programme",
    desc: "Each international student is matched with a Kenyan student buddy who helps with settling in, cultural adaptation, and navigating campus and Kaimosi town.",
    iconKey: "users",
  },
];

export default function InternationalVisaPage() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "international-visa"],
    queryFn: () => fetch("/api/pages/international-visa").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const VISA_CATEGORIES = (sd.visa_categories as typeof FALLBACK_VISA_CATEGORIES) ?? FALLBACK_VISA_CATEGORIES;

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title="Visa & Immigration — Kaimosi Friends University"
        description="Step-by-step visa and immigration guidance for international students at KAFU. Kenya student pass, Class G permit, required documents, and student support contacts."
        path="/international/visa"
        breadcrumbs={[{ name: "International", path: "/international" }, { name: "Visa & Immigration", path: "/international/visa" }]}
      />
      {/* Header */}
      <section className="text-white py-16" style={{ backgroundColor: "#228B22" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/international" className="hover:text-white">International</Link>
            <span>/</span>
            <span className="text-white">Visa & Immigration</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Visa & Immigration</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Everything you need to know about entering Kenya and maintaining legal student status at KAFU.
          </p>
        </div>
      </section>

      {/* Important note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
          <svg className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Important Notice</h3>
            <p className="text-sm text-amber-800">
              Visa and immigration regulations change frequently. The information below is a general guide.
              Always verify current requirements with the{" "}
              <a href="https://www.immigration.go.ke" target="_blank" rel="noreferrer" className="underline font-medium">
                Kenya Department of Immigration Services
              </a>{" "}
              or the nearest Kenyan embassy before travelling. KAFU's International Office is happy to assist.
            </p>
          </div>
        </div>
      </div>

      {/* Visa categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Visa Requirements by Region</h2>
        {VISA_CATEGORIES.map((cat) => (
          <div key={cat.title} className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{cat.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{cat.countries}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: "#228B22" }}
                  >
                    ✓
                  </span>
                  Process Steps
                </h4>
                <ol className="space-y-2">
                  {cat.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                        style={{ backgroundColor: "#DAA520" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: "#228B22" }}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </span>
                  Required Documents
                </h4>
                <ul className="space-y-2">
                  {cat.docs.map((doc, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-green-600 shrink-0 mt-0.5">•</span>
                      <span className="text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Processing times */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Typical Processing Times</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr style={{ backgroundColor: "#228B22" }} className="text-white">
                  <th className="text-left px-5 py-3 font-semibold">Application Type</th>
                  <th className="text-left px-5 py-3 font-semibold">Processing Time</th>
                  <th className="text-left px-5 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["EAC Student Pass", "1–5 working days", "On arrival; renewable annually at Immigration"],
                  ["African Union Student Visa", "5–15 working days", "Apply at Kenyan embassy; allow extra time during peak periods"],
                  ["Rest of World Student Visa", "2–6 weeks", "Allow minimum 6 weeks; biometrics required at embassy"],
                  ["Student Pass Renewal (in Kenya)", "3–10 working days", "Renew before expiry; done at Immigration HQ or regional offices"],
                  ["KAFU Visa Support Letter", "2–3 working days", "Request at least 3 weeks before embassy appointment"],
                ].map(([type, time, note], i) => (
                  <tr key={type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-3 font-medium text-gray-800">{type}</td>
                    <td className="px-5 py-3 text-gray-700">{time}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Support services */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">International Student Support</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUPPORT_SERVICES.map((s) => (
            <div key={s.title} className="rounded-xl border border-gray-100 p-5">
              <span className="mb-3 block text-green-700">{SUPPORT_ICONS[s.iconKey]}</span>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 text-center" style={{ backgroundColor: "#228B22" }}>
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-3">Need Help with Your Visa?</h2>
          <p className="text-white/80 mb-6">Our International Office is available Monday–Friday, 8am–5pm (EAT).</p>
          <a
            data-testid="visa-contact-btn"
            href="mailto:international@kafu.ac.ke"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-green-900 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#DAA520" }}
          >
            Email International Office
          </a>
        </div>
      </section>
    </div>
  );
}
