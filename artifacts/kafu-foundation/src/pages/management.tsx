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
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Peter-Mwita-Sec-to-Council.jpg",
    bio: "Prof. Peter N. Mwita (born 15 July 1968) is the Vice Chancellor of Kaimosi Friends University and Secretary to the University Council. He is a Full Professor of Statistics and holds a PhD. He previously served as Deputy Vice-Chancellor (Research, Innovation & Linkages) at Machakos University, where he also served as Acting Vice Chancellor. He has served as Dean of the School of Mathematical Sciences and Chairman of the Department of Statistics and Actuarial Sciences at JKUAT. He played a key role in restructuring the Kenya National Bureau of Statistics (KNBS) and currently chairs the Board of Governors of Kendege Technical and Vocational College.",
    email: "vc@kafu.ac.ke", office: "Vice Chancellor's Office, Main Administration Block",
    phone: "+254 777 373 633", category: "vc", position_order: 1,
  },
  {
    id: 2, name: "Prof. Fred. A. Amimo", title: "Deputy Vice Chancellor — Academic, Student Affairs & Research",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Amimo.jpg",
    bio: "Prof. Fred. A. Amimo serves as the Deputy Vice Chancellor responsible for Academic Affairs, Student Affairs, and Research (DVC ASA&R) at Kaimosi Friends University. He oversees all academic programmes, student welfare, curriculum development, quality assurance, and the university's research agenda across the five schools.",
    email: "dvc-asar@kafu.ac.ke", office: "DVC Academic Office, Administration Block", phone: "+254 777 373 640",
    category: "dvc", position_order: 2,
  },
  {
    id: 3, name: "Prof. Thomas Kipkurgat", title: "Deputy Vice Chancellor — Administration, Finance, Planning & Development",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Kipkurgat.jpg",
    bio: "Prof. Thomas Kipkurgat serves as the Deputy Vice Chancellor responsible for Administration, Finance, Planning and Development (DVC AFP&D) at Kaimosi Friends University. He oversees the university's administrative operations, financial management, strategic planning, and campus infrastructure development.",
    email: "dvc-afpd@kafu.ac.ke", office: "DVC Administration Office, Administration Block", phone: "+254 777 373 642",
    category: "dvc", position_order: 3,
  },
  {
    id: 4, name: "Dr. Samuel Munda", title: "Senior Assistant Registrar — Academic Affairs",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/Dr.-Munda-1.jpg",
    bio: "Dr. Samuel Munda serves as the Senior Assistant Registrar for Academic Affairs at Kaimosi Friends University. He is responsible for academic registration, examinations management, student records, and compliance with Commission for University Education (CUE) standards.",
    email: "registrar-aa@kafu.ac.ke", office: "Academic Registrar's Office, Administration Block", phone: "+254 777 373 650",
    category: "registrar", position_order: 4,
  },
  {
    id: 5, name: "Dr. Patrick Agesa", title: "Acting Deputy Registrar",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Agesa.jpg",
    bio: "Dr. Patrick Agesa serves as the Acting Deputy Registrar at Kaimosi Friends University, supporting the overall registry functions including student admissions, records management, academic governance, and institutional compliance.",
    email: "registrar@kafu.ac.ke", office: "Registry, Administration Block", phone: "+254 777 373 651",
    category: "registrar", position_order: 5,
  },
  {
    id: 6, name: "CPA Emmanuel M. Momanyi", title: "Finance Officer",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/IMGPSP_001.png",
    bio: "CPA Emmanuel M. Momanyi is the Finance Officer of Kaimosi Friends University, responsible for financial governance, budgeting, financial reporting, fee collection, procurement oversight, and compliance with the Public Finance Management Act.",
    email: "finance@kafu.ac.ke", office: "Finance Department, Administration Block", phone: "+254 777 373 660",
    category: "finance", position_order: 6,
  },
  {
    id: 7, name: "Dr. Fredrick M. Nyambane", title: "Dean of Students",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Monanti.jpg",
    bio: "Dr. Fredrick M. Nyambane serves as the Dean of Students at Kaimosi Friends University, overseeing student welfare, counselling services, accommodation, clubs and societies, and the general wellbeing of the student body.",
    email: "dean.students@kafu.ac.ke", office: "Dean of Students Office, Student Centre", phone: "+254 777 373 670",
    category: "other", position_order: 7,
  },
];

function ProfileAvatar({ profile, size = "md" }: { profile: ManagementProfile; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-16 h-16 text-lg", md: "w-24 h-24 text-2xl", lg: "w-32 h-32 text-3xl" };
  const cls = sizes[size];
  const initials = profile.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  if (profile.photo_url) {
    return (
      <img
        src={profile.photo_url} alt={profile.name}
        className={`${cls} rounded-full object-cover object-top border-4 border-white shadow-md shrink-0`}
      />
    );
  }
  return (
    <div className={`${cls} rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center shrink-0`}>
      <span className={`font-bold text-primary font-serif`}>{initials}</span>
    </div>
  );
}

function VCCard({ profile }: { profile: ManagementProfile }) {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-md">
      <div className="bg-primary/5 px-8 py-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <ProfileAvatar profile={profile} size="lg" />
        <div className="text-center md:text-left">
          <span className="inline-block text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full mb-3">
            {CATEGORY_LABELS[profile.category]}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">{profile.name}</h3>
          <p className="text-muted-foreground mb-4">{profile.title}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start text-sm text-muted-foreground">
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
        </div>
      </div>
      {profile.bio && (
        <div className="px-8 py-6 border-t border-border">
          {profile.office && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Building2 className="w-4 h-4 shrink-0" />{profile.office}
            </p>
          )}
          <p className="text-muted-foreground leading-relaxed text-sm">{profile.bio}</p>
        </div>
      )}
    </div>
  );
}

function ProfileCard({ profile }: { profile: ManagementProfile }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4">
      <ProfileAvatar profile={profile} size="sm" />
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-base font-bold text-foreground leading-snug mb-0.5">{profile.name}</h3>
        <p className="text-xs text-primary font-medium mb-2">{profile.title}</p>
        {profile.bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{profile.bio}</p>}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {profile.office && (
            <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{profile.office}</span>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} data-testid={`management-email-${profile.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors">
              <Mail className="w-3 h-3" />{profile.email}
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} data-testid={`management-phone-${profile.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="w-3 h-3" />{profile.phone}
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
        photo="https://kafu.ac.ke/wp-content/uploads/2026/03/IMG_6424-scaled.jpg"
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
            <div className="grid md:grid-cols-2 gap-5">
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
