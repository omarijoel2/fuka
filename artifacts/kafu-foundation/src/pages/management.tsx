import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Mail, Building2, GraduationCap, Briefcase, Globe } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface ManagementProfile {
  id: number;
  name: string;
  title: string;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  office: string | null;
  phone: string | null;
  category: string;
  position_order: number;
}

const CATEGORY_ORDER = ["vc", "dvc", "registrar", "finance", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  vc: "Vice Chancellor",
  dvc: "Deputy Vice Chancellors",
  registrar: "Registrars",
  finance: "Finance",
  other: "Senior Officers",
};

// Structured sections for the VC profile (sourced from official bio document)
const VC_PROFILE = {
  qualifications: [
    { degree: "PhD, Statistics", institution: "Technische Universität Kaiserslautern, Germany" },
    { degree: "MSc, Applied Statistics", institution: "Macquarie University, Australia" },
    { degree: "BSc, Statistics — First Class Honours", institution: "Kenyatta University" },
  ],
  leadership: [
    "Vice-Chancellor, Kaimosi Friends University — Current",
    "Deputy Vice-Chancellor (Research, Innovation & Linkages), Machakos University",
    "Dean, School of Mathematical Sciences, JKUAT",
    "Chairman, Department of Statistics & Actuarial Science, JKUAT",
    "Chairman, Kenya National Bureau of Statistics (KNBS)",
    "Chairman, Board of Governors, Kendege Technical & Vocational College",
    "Council Member, Multimedia University of Kenya",
  ],
  service: [
    "Board Member, Kenya Universities & Colleges Central Placement Service (KUCCPS)",
    "Member, Inter-University Council for East Africa (IUCEA)",
    "Member, Association of African Universities (AAU)",
  ],
  research: [
    "Established UNESCO Chair on Cloud Computing for Sustainable Development at JKUAT",
    "Published widely in statistics, data analysis, and sustainable development",
    "Supervised Masters and PhD students across three decades",
    "Champion of youth talent: Luban Workshop, Ajiry Centre, STEM Centre",
  ],
};

const FALLBACK: ManagementProfile[] = [
  {
    id: 1, name: "Prof. Peter N. Mwita", title: "Vice-Chancellor",
    photo_url: "/vc-prof-mwita.jpg",
    bio: "Prof. Peter N. Mwita is a distinguished Kenyan academic leader and statistician with over 30 years' experience in higher education, research, and national development. As Vice-Chancellor of Kaimosi Friends University, he leads a transformative agenda anchored on academic excellence, research expansion, fiscal discipline, strong governance, and community-centred growth.",
    email: "vc@kafu.ac.ke", office: "Vice-Chancellor's Office, Administration Block",
    phone: "+254 777 373 633", category: "vc", position_order: 1,
  },
  {
    id: 2, name: "Prof. Fred. A. Amimo", title: "Deputy Vice Chancellor — Academic, Student Affairs & Research",
    photo_url: "/imgs/staff/Prof.-Amimo.jpg",
    bio: "Oversees all academic programmes, student welfare, curriculum development, quality assurance, and the university's research agenda across the five schools.",
    email: "dvc-asar@kafu.ac.ke", office: "DVC Academic Office, Administration Block", phone: "+254 777 373 640",
    category: "dvc", position_order: 2,
  },
  {
    id: 3, name: "Prof. Thomas Kipkurgat", title: "Deputy Vice Chancellor — Administration, Finance, Planning & Development",
    photo_url: "/imgs/staff/Kipkurgat.jpg",
    bio: "Oversees the university's administrative operations, financial management, strategic planning, and campus infrastructure development.",
    email: "dvc-afpd@kafu.ac.ke", office: "DVC Administration Office, Administration Block", phone: "+254 777 373 642",
    category: "dvc", position_order: 3,
  },
  {
    id: 4, name: "Dr. Samuel Munda", title: "Senior Assistant Registrar — Academic Affairs",
    photo_url: "/imgs/Dr.-Munda-1.jpg",
    bio: "Responsible for academic registration, examinations management, student records, and compliance with Commission for University Education (CUE) standards.",
    email: "registrar-aa@kafu.ac.ke", office: "Academic Registrar's Office, Administration Block", phone: "+254 777 373 650",
    category: "registrar", position_order: 4,
  },
  {
    id: 5, name: "Dr. Patrick Agesa", title: "Acting Deputy Registrar",
    photo_url: "/imgs/staff/Dr.-Agesa.jpg",
    bio: "Supports overall registry functions including student admissions, records management, academic governance, and institutional compliance.",
    email: "registrar@kafu.ac.ke", office: "Registry, Administration Block", phone: "+254 777 373 651",
    category: "registrar", position_order: 5,
  },
  {
    id: 6, name: "CPA Emmanuel M. Momanyi", title: "Finance Officer",
    photo_url: "/imgs/IMGPSP_001.png",
    bio: "Responsible for financial governance, budgeting, financial reporting, fee collection, procurement oversight, and compliance with the Public Finance Management Act.",
    email: "finance@kafu.ac.ke", office: "Finance Department, Administration Block", phone: "+254 777 373 660",
    category: "finance", position_order: 6,
  },
  {
    id: 7, name: "Dr. Fredrick M. Nyambane", title: "Dean of Students",
    photo_url: "/imgs/staff/Monanti.jpg",
    bio: "Oversees student welfare, counselling services, accommodation, clubs and societies, and the general wellbeing of the student body.",
    email: "dean.students@kafu.ac.ke", office: "Dean of Students Office, Student Centre", phone: "+254 777 373 670",
    category: "other", position_order: 7,
  },
];

function VCCard({ profile }: { profile: ManagementProfile }) {
  const initials = profile.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Portrait */}
        <div className="relative md:w-56 shrink-0 bg-primary/5 overflow-hidden" style={{ minHeight: 280 }}>
          <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-primary/20 font-serif">
            {initials}
          </span>
          {profile.photo_url && (
            <img
              src={profile.photo_url}
              alt={profile.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent pt-12 pb-3 px-4">
            <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">Vice-Chancellor</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 md:p-7 min-w-0">
          {/* Name + contact */}
          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-0.5">{profile.name}</h3>
          <p className="text-sm text-primary font-medium mb-3">{profile.title} · Professor of Statistics</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-4">
            {profile.email && (
              <a href={`mailto:${profile.email}`} data-testid="vc-email-link"
                className="flex items-center gap-1 hover:text-primary transition-colors">
                <Mail className="w-3 h-3" />{profile.email}
              </a>
            )}
            {profile.office && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />{profile.office}
              </span>
            )}
          </div>

          {/* Profile bio */}
          {profile.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 mb-5">
              {profile.bio}
            </p>
          )}

          {/* Structured sections — two columns on md+ */}
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
            {/* Academic qualifications */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-primary" /> Academic Background
              </h4>
              <ul className="space-y-1.5">
                {VC_PROFILE.qualifications.map((q, i) => (
                  <li key={i} className="text-xs text-muted-foreground leading-snug">
                    <span className="font-medium text-foreground/80">{q.degree}</span>
                    <br /><span className="text-[11px]">{q.institution}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Research highlights */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Globe className="w-3.5 h-3.5 text-primary" /> Research & Innovation
              </h4>
              <ul className="space-y-1">
                {VC_PROFILE.research.map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground leading-snug flex gap-1.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership timeline — full width footer strip */}
      <div className="border-t border-border bg-gray-50/70 px-6 md:px-7 py-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Briefcase className="w-3.5 h-3.5 text-primary" /> Leadership & Governance
        </h4>
        <div className="flex flex-wrap gap-2">
          {VC_PROFILE.leadership.map((role, i) => {
            const [title, ...rest] = role.split(",");
            return (
              <span key={i} className="text-xs bg-white border border-border rounded-full px-3 py-1 text-muted-foreground leading-snug">
                <span className="font-medium text-foreground/80">{title.trim()}</span>
                {rest.length > 0 && <span className="text-[11px]">, {rest.join(",").trim()}</span>}
              </span>
            );
          })}
        </div>
        {/* National service */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {VC_PROFILE.service.map((s, i) => (
            <span key={i} className="text-[11px] text-muted-foreground flex gap-1 items-start">
              <span className="text-primary shrink-0">·</span>{s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ profile }: { profile: ManagementProfile }) {
  const initials = profile.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary/20 font-serif">{initials}</span>
        {profile.photo_url && (
          <img src={profile.photo_url} alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent pt-10 pb-1.5 px-3">
          <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider">
            {CATEGORY_LABELS[profile.category]}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-sm font-bold text-foreground leading-snug mb-0.5">{profile.name}</h3>
        <p className="text-xs text-primary font-medium mb-3 leading-snug">{profile.title}</p>
        {profile.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{profile.bio}</p>
        )}
        <div className="mt-auto pt-2 border-t border-border text-xs text-muted-foreground">
          {profile.email && (
            <a href={`mailto:${profile.email}`} data-testid={`management-email-${profile.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors truncate">
              <Mail className="w-3 h-3 shrink-0" />{profile.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManagementPage() {
  const { data: apiData } = useQuery<{ data: ManagementProfile[] }>({
    queryKey: ["management-profiles"],
    queryFn: () => fetch("/api/management").then(r => r.json()),
  });

  const allProfiles = apiData?.data ?? FALLBACK;

  const vc = allProfiles.find(p => p.category === "vc");
  const grouped = CATEGORY_ORDER.filter(cat => cat !== "vc").reduce((acc, cat) => {
    const items = allProfiles.filter(p => p.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, ManagementProfile[]>);

  return (
    <>
      <Helmet>
        <title>University Management — KAFU</title>
        <meta name="description" content="Meet the senior management team of Kaimosi Friends University — the Vice-Chancellor, Deputy Vice Chancellors, Registrars, and other senior officers." />
      </Helmet>

      <PageHero
        eyebrow="Leadership"
        title="University Management"
        subtitle="KAFU is led by a team of experienced academics and administrators committed to advancing the university's mission of quality education, impactful research, and community service."
        photo="/imgs/aerial-1.jpg"
        align="center"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "University Management" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-12">

        {vc && (
          <section>
            <h2 className="font-serif text-xl font-bold text-primary mb-5 pb-2 border-b border-border">
              Vice-Chancellor
            </h2>
            <VCCard profile={vc} />
          </section>
        )}

        {CATEGORY_ORDER.filter(cat => cat !== "vc" && grouped[cat]).map(cat => (
          <section key={cat}>
            <h2 className="font-serif text-xl font-bold text-primary mb-5 pb-2 border-b border-border">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[cat].map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </section>
        ))}

        <section className="bg-primary/5 rounded-xl border border-border p-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-2">Governance Structure</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            KAFU's management structure operates under the authority of the University Council and in accordance
            with the Universities Act, 2012 and the KAFU Charter. The Vice-Chancellor is the academic and
            administrative head of the university, supported by Deputy Vice-Chancellors.
          </p>
          <a href="/about/council" data-testid="view-council-link"
            className="text-sm font-medium text-primary hover:underline">
            View the University Council
          </a>
        </section>

      </div>
    </>
  );
}
