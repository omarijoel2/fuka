import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, Building2 } from "lucide-react";

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

const CATEGORY_ORDER = ["vc", "dvc", "registrar", "finance", "library", "ict", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  vc: "Vice Chancellor",
  dvc: "Deputy Vice Chancellors",
  registrar: "Registrars",
  finance: "Finance",
  library: "Library",
  ict: "ICT",
  other: "Senior Officers",
};

const FALLBACK: ManagementProfile[] = [
  {
    id: 1, name: "Prof. Peter Nyamuhanga Mwita", title: "Vice Chancellor",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg",
    bio: "Prof. Mwita was officially appointed Vice Chancellor of Kaimosi Friends University on 14 May 2025, having served in an acting capacity since February 2024. Under his leadership, KAFU continues to advance its mission of quality education, research, and community engagement.",
    email: "vc@kafu.ac.ke", office: "Vice Chancellor's Office, Main Administration Block",
    phone: "+254 777 373 633", category: "vc", position_order: 1,
  },
  {
    id: 2, name: "Prof. Lilian A. Achola", title: "Deputy Vice Chancellor — Academic & Student Affairs",
    photo_url: null, bio: "Prof. Achola oversees all academic programmes, student welfare, curriculum development, and quality assurance across KAFU's five schools.",
    email: "dvc-asa@kafu.ac.ke", office: "DVC Academic Office", phone: "+254 777 373 640",
    category: "dvc", position_order: 2,
  },
  {
    id: 3, name: "Prof. Emmanuel W. Waswa", title: "Deputy Vice Chancellor — Research, Innovation & Partnerships",
    photo_url: null, bio: "Prof. Waswa leads KAFU's research agenda, innovation ecosystem, and strategic partnerships.",
    email: "dvc-rip@kafu.ac.ke", office: "DVC Research Office", phone: "+254 777 373 641",
    category: "dvc", position_order: 3,
  },
  {
    id: 4, name: "Dr. Francis Njoroge", title: "Registrar — Academic Affairs",
    photo_url: null, bio: "Dr. Njoroge manages all academic registration, examinations, student records, graduation, and CUE compliance.",
    email: "registrar-academic@kafu.ac.ke", office: "Academic Registrar's Office", phone: "+254 777 373 650",
    category: "registrar", position_order: 5,
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
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-accent text-sm font-medium uppercase tracking-widest mb-3">Leadership</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5">University Management</h1>
          <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto leading-relaxed">
            KAFU is led by a team of experienced academics and administrators committed to advancing the
            university's mission of quality education, impactful research, and community service.
          </p>
        </div>
      </section>

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
