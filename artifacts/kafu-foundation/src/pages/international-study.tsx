import type { ReactElement } from "react";
import { Link } from "wouter";

const WHY_KAFU: { icon: ReactElement; title: string; desc: string }[] = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Quaker Values",
    desc: "Founded on integrity, peace, and community — a transformative environment unlike any other African university.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c-2.21 0-4-4.03-4-9s1.79-9 4-9m0 18c2.21 0 4-4.03 4-9s-1.79-9-4-9M3 12h18" />
      </svg>
    ),
    title: "Globally Connected",
    desc: "Partnerships with Quaker universities in the USA and UK, African universities, and international development agencies.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: "Kaimosi Campus Experience",
    desc: "Set in lush Western Kenya highlands — safe, serene, and rich in biodiversity. A unique African campus experience.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Applied Research Focus",
    desc: "Hands-on research embedded in real communities — water, agriculture, health, and digital development.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Affordable Excellence",
    desc: "High-quality education at fees significantly lower than comparable institutions in the region or globally.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: "Accredited Programmes",
    desc: "All programmes accredited by the Kenya Universities and Colleges Central Placement Service (KUCCPS) and Commission for University Education.",
  },
];

const FEES_TABLE = [
  { level: "Certificate", ksh: "45,000–60,000", usd: "340–460" },
  { level: "Diploma",     ksh: "60,000–85,000", usd: "460–650" },
  { level: "Bachelor's Degree", ksh: "85,000–130,000", usd: "650–1,000" },
  { level: "Bachelor's (Science/Engineering)", ksh: "120,000–165,000", usd: "920–1,270" },
  { level: "Postgraduate Diploma", ksh: "95,000–120,000", usd: "730–920" },
  { level: "Master's Degree",    ksh: "130,000–200,000", usd: "1,000–1,540" },
  { level: "PhD",                ksh: "180,000–250,000", usd: "1,380–1,920" },
];

const SCHOOLS = [
  { name: "School of Education", programmes: 12, highlight: "Teacher education, Educational management, Psychology" },
  { name: "School of Health Sciences", programmes: 8, highlight: "Nursing, Public Health, Community Health, Medical Lab" },
  { name: "School of Agriculture & Natural Resources", programmes: 7, highlight: "Agriculture, Agribusiness, Forestry, Environmental Science" },
  { name: "School of Business & Economics", programmes: 9, highlight: "Business Admin, Accounting, Economics, Entrepreneurship" },
  { name: "School of Science, Technology & Engineering", programmes: 8, highlight: "Computer Science, IT, Mathematics, Physics" },
];

const STEPS = [
  { step: "01", title: "Choose your Programme", desc: "Browse KAFU's catalogue across 5 schools and 44 accredited programmes." },
  { step: "02", title: "Check Entry Requirements", desc: "Confirm your qualifications meet the minimum requirements for your chosen programme." },
  { step: "03", title: "Prepare Documents", desc: "Gather certified transcripts, certificates, passport copy, and English proficiency evidence (if required)." },
  { step: "04", title: "Apply Online", desc: "Submit your application via the KAFU Student Portal. Pay the application fee (KES 2,000 / USD 15)." },
  { step: "05", title: "Receive Admission Letter", desc: "Successful applicants receive an official offer letter within 3–4 weeks." },
  { step: "06", title: "Apply for Visa", desc: "Use your admission letter to apply for a Kenyan student visa at your nearest embassy or through the eDiaspora portal." },
  { step: "07", title: "Arrive & Register", desc: "Complete registration, pay fees, and join the KAFU campus community." },
];

export default function InternationalStudyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section
        className="text-white py-16"
        style={{ backgroundColor: "#1A5C38" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/international" className="hover:text-white">International</Link>
            <span>/</span>
            <span className="text-white">Study at KAFU</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Study at KAFU</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Everything international students need to know about studying at Kaimosi Friends University.
          </p>
        </div>
      </section>

      {/* Why KAFU */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose KAFU?</h2>
        <p className="text-gray-600 mb-10">A distinctive education rooted in Quaker principles and East African excellence.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_KAFU.map((item) => (
            <div key={item.title} className="p-6 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
              <span className="mb-3 block text-green-700">{item.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schools & Programmes */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Programmes Available</h2>
              <p className="text-gray-600 mt-2">44 accredited programmes across 5 schools</p>
            </div>
            <Link
              data-testid="view-all-programmes-link"
              to="/academics"
              className="font-medium hover:underline text-sm"
              style={{ color: "#1A5C38" }}
            >
              Full programme catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCHOOLS.map((school) => (
              <div key={school.name} className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">{school.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{school.programmes} programmes</p>
                <p className="text-sm text-gray-600">{school.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">International Student Fees</h2>
        <p className="text-gray-600 mb-8">Per academic year (2 semesters). Fees are indicative — confirm at time of admission.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#1A5C38" }} className="text-white">
                <th className="text-left px-5 py-3 font-semibold rounded-tl-lg">Level of Study</th>
                <th className="text-right px-5 py-3 font-semibold">Annual Fees (KES)</th>
                <th className="text-right px-5 py-3 font-semibold rounded-tr-lg">Annual Fees (USD approx.)</th>
              </tr>
            </thead>
            <tbody>
              {FEES_TABLE.map((row, i) => (
                <tr key={row.level} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-5 py-3 text-gray-800 font-medium">{row.level}</td>
                  <td className="px-5 py-3 text-right text-gray-700">{row.ksh}</td>
                  <td className="px-5 py-3 text-right text-gray-700">{row.usd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          * USD conversion based on approximate exchange rate of KES 130 = USD 1.
          Accommodation costs range from KES 12,000–25,000 per semester (on-campus).
          Meals: KES 8,000–15,000 per semester (catered options available).
        </p>
      </section>

      {/* Application Process */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How to Apply</h2>
          <p className="text-gray-600 mb-10">Follow these steps to join KAFU as an international student.</p>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />
            <div className="space-y-6">
              {STEPS.map((s) => (
                <div key={s.step} className="flex gap-6 items-start">
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm z-10"
                    style={{ backgroundColor: "#1A5C38" }}
                  >
                    {s.step}
                  </div>
                  <div className="bg-white rounded-xl p-5 flex-1 border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center" style={{ backgroundColor: "#1A5C38" }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Begin Your KAFU Journey</h2>
          <p className="text-white/80 mb-8">Applications for the September 2026 intake are now open.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              data-testid="study-apply-btn"
              to="/admissions"
              className="px-8 py-3 rounded-lg font-semibold text-green-900 text-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: "#C9A227" }}
            >
              Apply Now
            </Link>
            <Link
              data-testid="study-visa-btn"
              to="/international/visa"
              className="px-8 py-3 rounded-lg font-semibold text-white text-lg border border-white/40 hover:bg-white/10 transition-all"
            >
              Visa Information
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
