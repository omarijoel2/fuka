import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, Building2 } from "lucide-react";
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

const FALLBACK: ManagementProfile[] = [
  {
    id: 1, name: "Prof. Peter N. Mwita", title: "Vice Chancellor",
    photo_url: "/imgs/staff/Prof.-Mwita-council.jpg",
    bio: "Prof. Peter N. Mwita (born 15 July 1968) is the Vice Chancellor of Kaimosi Friends University and Secretary to the University Council. He is a Full Professor of Statistics and holds a PhD. He previously served as Deputy Vice-Chancellor (Research, Innovation & Linkages) at Machakos University, where he also served as Acting Vice Chancellor. He has served as Dean of the School of Mathematical Sciences and Chairman of the Department of Statistics and Actuarial Sciences at JKUAT. He played a key role in restructuring the Kenya National Bureau of Statistics (KNBS) and currently chairs the Board of Governors of Kendege Technical and Vocational College.",
    email: "vc@kafu.ac.ke", office: "Vice Chancellor's Office, Main Administration Block",
    phone: "+254 777 373 633", category: "vc", position_order: 1,
  },
  {
    id: 2, name: "Prof. Fred. A. Amimo", title: "Deputy Vice Chancellor — Academic, Student Affairs & Research",
    photo_url: "/imgs/staff/Prof.-Amimo.jpg",
    bio: "Prof. Fred. A. Amimo serves as the Deputy Vice Chancellor responsible for Academic Affairs, Student Affairs, and Research (DVC ASA&R) at Kaimosi Friends University. He oversees all academic programmes, student welfare, curriculum development, quality assurance, and the university's research agenda across the five schools.",
    email: "dvc-asar@kafu.ac.ke", office: "DVC Academic Office, Administration Block", phone: "+254 777 373 640",
    category: "dvc", position_order: 2,
  },
  {
    id: 3, name: "Prof. Thomas Kipkurgat", title: "Deputy Vice Chancellor — Administration, Finance, Planning & Development",
    photo_url: "/imgs/staff/Kipkurgat.jpg",
    bio: "Prof. Thomas Kipkurgat serves as the Deputy Vice Chancellor responsible for Administration, Finance, Planning and Development (DVC AFP&D) at Kaimosi Friends University. He oversees the university's administrative operations, financial management, strategic planning, and campus infrastructure development.",
    email: "dvc-afpd@kafu.ac.ke", office: "DVC Administration Office, Administration Block", phone: "+254 777 373 642",
    category: "dvc", position_order: 3,
  },
  {
    id: 4, name: "Dr. Samuel Munda", title: "Senior Assistant Registrar — Academic Affairs",
    photo_url: "/imgs/Dr.-Munda-1.jpg",
    bio: "Dr. Samuel Munda serves as the Senior Assistant Registrar for Academic Affairs at Kaimosi Friends University. He is responsible for academic registration, examinations management, student records, and compliance with Commission for University Education (CUE) standards.",
    email: "registrar-aa@kafu.ac.ke", office: "Academic Registrar's Office, Administration Block", phone: "+254 777 373 650",
    category: "registrar", position_order: 4,
  },
  {
    id: 5, name: "Dr. Patrick Agesa", title: "Acting Deputy Registrar",
    photo_url: "/imgs/staff/Dr.-Agesa.jpg",
    bio: "Dr. Patrick Agesa serves as the Acting Deputy Registrar at Kaimosi Friends University, supporting the overall registry functions including student admissions, records management, academic governance, and institutional compliance.",
    email: "registrar@kafu.ac.ke", office: "Registry, Administration Block", phone: "+254 777 373 651",
    category: "registrar", position_order: 5,
  },
  {
    id: 6, name: "CPA Emmanuel M. Momanyi", title: "Finance Officer",
    photo_url: "/imgs/IMGPSP_001.png",
    bio: "CPA Emmanuel M. Momanyi is the Finance Officer of Kaimosi Friends University, responsible for financial governance, budgeting, financial reporting, fee collection, procurement oversight, and compliance with the Public Finance Management Act.",
    email: "finance@kafu.ac.ke", office: "Finance Department, Administration Block", phone: "+254 777 373 660",
    category: "finance", position_order: 6,
  },
  {
    id: 7, name: "Dr. Fredrick M. Nyambane", title: "Dean of Students",
    photo_url: "/imgs/staff/Monanti.jpg",
    bio: "Dr. Fredrick M. Nyambane serves as the Dean of Students at Kaimosi Friends University, overseeing student welfare, counselling services, accommodation, clubs and societies, and the general wellbeing of the student body.",
    email: "dean.students@kafu.ac.ke", office: "Dean of Students Office, Student Centre", phone: "+254 777 373 670",
    category: "other", position_order: 7,
  },
];

function VCCard({ profile }: { profile: ManagementProfile }) {
  const initials = profile.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
      {/* Portrait photo */}
      <div className="relative md:w-60 shrink-0 bg-primary/5 overflow-hidden" style={{ minHeight: 300 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold text-primary/20 font-serif">{initials}</span>
        </div>
        {profile.photo_url && (
          <img
            src={profile.photo_url}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent md:bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>
      {/* Content */}
      <div className="flex-1 p-7 md:p-9 flex flex-col justify-center">
        <span className="inline-block text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full mb-4 self-start">
          {CATEGORY_LABELS[profile.category]}
        </span>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">{profile.name}</h3>
        <p className="text-muted-foreground mb-5 text-sm">{profile.title}</p>
        <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground mb-5">
          {profile.email && (
            <a href={`mailto:${profile.email}`} data-testid="vc-email-link"
              className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />{profile.email}
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} data-testid="vc-phone-link"
              className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />{profile.phone}
            </a>
          )}
        </div>
        {profile.office && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Building2 className="w-4 h-4 shrink-0" />{profile.office}
          </p>
        )}
        {profile.bio && (
          <p className="text-muted-foreground leading-relaxed text-sm border-t border-border pt-4">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ profile }: { profile: ManagementProfile }) {
  const initials = profile.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Portrait photo — tall aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-primary/20 font-serif">{initials}</span>
        </div>
        {profile.photo_url && (
          <img
            src={profile.photo_url}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/75 via-primary/20 to-transparent pt-12 pb-2 px-3">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
            {CATEGORY_LABELS[profile.category]}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-base font-bold text-foreground leading-snug mb-0.5">{profile.name}</h3>
        <p className="text-xs text-primary font-medium mb-3 leading-snug">{profile.title}</p>
        {profile.bio && (
          <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">{profile.bio}</p>
        )}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
          {profile.email && (
            <a href={`mailto:${profile.email}`} data-testid={`management-email-${profile.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors truncate">
              <Mail className="w-3 h-3 shrink-0" />{profile.email}
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} data-testid={`management-phone-${profile.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="w-3 h-3 shrink-0" />{profile.phone}
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
        <meta name="description" content="Meet the senior management team of Kaimosi Friends University — the Vice Chancellor, Deputy Vice Chancellors, Registrars, and other senior officers." />
      </Helmet>

      {/* Hero */}
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

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-14">

        {/* Vice Chancellor */}
        {vc && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-primary mb-6 pb-3 border-b border-border">
              Vice Chancellor
            </h2>
            <VCCard profile={vc} />
          </section>
        )}

        {/* Grouped sections */}
        {CATEGORY_ORDER.filter(cat => cat !== "vc" && grouped[cat]).map(cat => (
          <section key={cat}>
            <h2 className="font-serif text-2xl font-bold text-primary mb-6 pb-3 border-b border-border">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {grouped[cat].map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </section>
        ))}

        {/* Governance note */}
        <section className="bg-primary/5 rounded-2xl border border-border p-8">
          <h2 className="font-serif text-xl font-bold text-primary mb-3">Governance Structure</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            KAFU's management structure operates under the authority of the University Council and in accordance
            with the Universities Act, 2012 and the KAFU Charter. The Vice Chancellor is the academic and
            administrative head of the university, supported by three Deputy Vice Chancellors responsible for
            academic affairs, research and innovation, and administration and finance respectively.
          </p>
          <a href="/about/council" data-testid="view-council-link"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            View the University Council
          </a>
        </section>

      </div>
    </>
  );
}
