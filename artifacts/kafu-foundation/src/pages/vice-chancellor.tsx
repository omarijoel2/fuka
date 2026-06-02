import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Mail, Building2 } from "lucide-react";
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
  is_active: boolean;
}

const FALLBACK: ManagementProfile[] = [
  {
    id: 1, name: "Prof. Peter N. Mwita", title: "Vice-Chancellor",
    photo_url: "/images/uploads/prof-peter-mwita.jpg",
    bio: "Prof. Peter N. Mwita is a distinguished Kenyan academic leader and statistician with over 30 years' experience in higher education, research, and national development. As Vice-Chancellor of Kaimosi Friends University, he leads a transformative agenda anchored on academic excellence, research expansion, fiscal discipline, strong governance, and community-centred growth.",
    email: "vc@kafu.ac.ke", office: "Vice-Chancellor's Office, Administration Block",
    phone: "+254 777 373 633", category: "vc", position_order: 1, is_active: true,
  },
  {
    id: 2, name: "Prof. Fred. A. Amimo", title: "Deputy Vice-Chancellor — Academic, Student Affairs & Research",
    photo_url: "/images/uploads/Prof.-Amimo.jpg",
    bio: "Oversees all academic programmes, student welfare, curriculum development, quality assurance, and the university's research agenda across the five schools.",
    email: "dvc-asar@kafu.ac.ke", office: "DVC Academic Office, Administration Block",
    phone: "+254 777 373 640", category: "dvc", position_order: 2, is_active: true,
  },
  {
    id: 3, name: "Prof. Thomas Kipkurgat", title: "Deputy Vice-Chancellor — Administration, Finance, Planning & Development",
    photo_url: "/images/uploads/Kipkurgat.jpg",
    bio: "Oversees the university's administrative operations, financial management, strategic planning, and campus infrastructure development.",
    email: "dvc-afpd@kafu.ac.ke", office: "DVC Administration Office, Administration Block",
    phone: "+254 777 373 642", category: "dvc", position_order: 3, is_active: true,
  },
];

function VCBriefCard({ profile }: { profile: ManagementProfile }) {
  const initials = profile.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
      {/* Portrait */}
      <div className="relative md:w-60 shrink-0 bg-primary/5 overflow-hidden" style={{ minHeight: 260 }}>
        <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-primary/20 font-serif">{initials}</span>
        {profile.photo_url && (
          <img src={profile.photo_url} alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent pt-12 pb-3 px-4">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">Vice-Chancellor</span>
        </div>
      </div>

      {/* Content — brief only */}
      <div className="flex-1 p-6 md:p-8 min-w-0 flex flex-col justify-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">{profile.name}</h2>
        <p className="text-sm text-primary font-medium mb-4">{profile.title}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground mb-5">
          {profile.email && (
            <a href={`mailto:${profile.email}`} data-testid="vc-email-link"
              className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5" />{profile.email}
            </a>
          )}
          {profile.office && (
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />{profile.office}
            </span>
          )}
        </div>
        {profile.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
        )}
        <a href="/about/management" data-testid="vc-management-link"
          className="mt-5 inline-flex self-start text-xs font-medium text-primary hover:underline border-b border-primary/30 pb-0.5">
          View full profile and academic credentials on the Management Board page
        </a>
      </div>
    </div>
  );
}

function DVCCard({ profile }: { profile: ManagementProfile }) {
  const initials = profile.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative aspect-[5/4] overflow-hidden bg-primary/5">
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary/20 font-serif">{initials}</span>
        {profile.photo_url && (
          <img src={profile.photo_url} alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent pt-10 pb-2 px-3">
          <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider">Deputy Vice-Chancellor</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-sm font-bold text-foreground leading-snug mb-1">{profile.name}</h3>
        <p className="text-xs text-primary font-medium mb-3 leading-snug">{profile.title}</p>
        {profile.bio && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{profile.bio}</p>
        )}
        <div className="mt-auto pt-3 border-t border-border">
          {profile.email && (
            <a href={`mailto:${profile.email}`} data-testid={`dvc-email-${profile.id}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors truncate">
              <Mail className="w-3 h-3 shrink-0" />{profile.email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ViceChancellorPage() {
  const { data: apiData } = useQuery<{ data: ManagementProfile[] }>({
    queryKey: ["management-profiles"],
    queryFn: () => fetch("/api/management").then(r => r.json()),
  });

  const all = (apiData?.data ?? FALLBACK).filter(p => p.is_active);
  const vc = all.find(p => p.category === "vc");
  const dvcs = all.filter(p => p.category === "dvc").sort((a, b) => a.position_order - b.position_order);

  return (
    <>
      <Helmet>
        <title>Office of the Vice-Chancellor — KAFU</title>
        <meta name="description" content="The Vice-Chancellor and Deputy Vice-Chancellors of Kaimosi Friends University." />
      </Helmet>

      <PageHero
        eyebrow="Leadership"
        title="Office of the Vice-Chancellor"
        subtitle="The Vice-Chancellor provides overall academic, administrative, and strategic leadership of Kaimosi Friends University, supported by the Deputy Vice-Chancellors."
        photo="/images/uploads/aerial-1.jpg"
        align="center"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Office of the Vice-Chancellor" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-12">

        {vc && (
          <section>
            <h2 className="font-serif text-xl font-bold text-primary mb-5 pb-2 border-b border-border">
              Vice-Chancellor
            </h2>
            <VCBriefCard profile={vc} />
          </section>
        )}

        {dvcs.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-bold text-primary mb-5 pb-2 border-b border-border">
              Deputy Vice-Chancellors
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {dvcs.map(p => <DVCCard key={p.id} profile={p} />)}
            </div>
          </section>
        )}

        <section className="bg-primary/5 rounded-xl border border-border p-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-2">Governance Structure</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            The Vice-Chancellor is the academic and administrative head of Kaimosi Friends University,
            operating under the authority of the University Council in accordance with the Universities Act,
            2012 and the KAFU Charter.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="/about/council" data-testid="link-council"
              className="font-medium text-primary hover:underline">View the University Council</a>
            <a href="/about/management" data-testid="link-management"
              className="font-medium text-primary hover:underline">View the Management Board</a>
          </div>
        </section>

      </div>
    </>
  );
}
