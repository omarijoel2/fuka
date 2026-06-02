import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/ui/page-hero";

interface CouncilMember {
  id: number;
  name: string;
  title: string;
  photo_url: string | null;
  bio: string | null;
  credentials: string[] | null;
  category: string;
  position_order: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  chairperson: "Chairperson",
  vice_chair: "Vice Chairperson",
  ex_officio: "Ex-Officio",
  government: "Government Representative",
  member: "Council Member",
};

const FALLBACK: CouncilMember[] = [
  {
    id: 1, name: "Prof. Stanley O. Khainga", title: "Chairman of the Council",
    photo_url: "/images/uploads/Prof.-Khainga.jpg", category: "chairperson", position_order: 1,
    credentials: [],
    bio: "Prof. Stanley O. Khainga chairs the University Council, providing strategic leadership and ensuring sound governance in accordance with the Universities Act, 2012 and the KAFU Charter.",
  },
  {
    id: 2, name: "Prof. Peter N. Mwita", title: "Vice Chancellor & Secretary to the Council",
    photo_url: "/images/uploads/prof-peter-mwita.jpg", category: "ex_officio", position_order: 2,
    credentials: ["PhD Statistics"],
    bio: "Prof. Peter N. Mwita serves as an ex-officio member and Secretary to the University Council by virtue of his office as Vice Chancellor. A Full Professor of Statistics, he brings over three decades of academic and institutional leadership as the chief executive and principal academic officer of Kaimosi Friends University.",
  },
  {
    id: 3, name: "Ms. Rose Chepkoech Langat", title: "Member, University Council",
    photo_url: "/images/uploads/Ms.-Langat.jpg", category: "member", position_order: 3, credentials: [], bio: null,
  },
  {
    id: 4, name: "Mr. David Mongosi Sigano", title: "Member, University Council",
    photo_url: "/images/uploads/Mr.-Mongosi.jpg", category: "member", position_order: 4, credentials: [], bio: null,
  },
  {
    id: 5, name: "Dr. Moses Osia Mwanje", title: "Member, University Council",
    photo_url: "/images/uploads/Dr.-Mwanje.jpg", category: "member", position_order: 5, credentials: ["PhD"], bio: null,
  },
  {
    id: 6, name: "Mr. Yussuf Kala", title: "Member, University Council",
    photo_url: "/images/uploads/Mr.-Kala.jpg", category: "member", position_order: 6, credentials: [], bio: null,
  },
  {
    id: 7, name: "CPA Gilbert K. Kangogo", title: "Member, University Council",
    photo_url: "/images/uploads/CPA-Kangogo.jpg", category: "member", position_order: 7, credentials: ["CPA (K)"], bio: null,
  },
  {
    id: 8, name: "Dr. Thaddaeus W. Egondi", title: "Member, University Council",
    photo_url: "/images/uploads/Dr.-Egondi.jpg", category: "member", position_order: 8, credentials: ["PhD"], bio: null,
  },
  {
    id: 9, name: "Dr. Milton Njuki", title: "Member, University Council",
    photo_url: "/images/uploads/Dr.-Njuki.jpg", category: "member", position_order: 9, credentials: ["PhD"], bio: null,
  },
];

/** Compact horizontal card for chairperson and ex-officio members */
function LeaderCard({ member }: { member: CouncilMember }) {
  const initials = member.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm flex">
      {/* Square photo */}
      <div className="relative w-28 sm:w-32 shrink-0 bg-primary/5">
        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-primary/20 font-serif">{initials}</span>
        {member.photo_url && (
          <img src={member.photo_url} alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        )}
      </div>
      {/* Info */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider mb-1">
          {CATEGORY_LABELS[member.category] ?? "Member"}
        </span>
        <h3 className="font-serif text-sm font-bold text-foreground leading-snug mb-0.5">{member.name}</h3>
        <p className="text-xs text-muted-foreground mb-2 leading-snug">{member.title}</p>
        {member.credentials && member.credentials.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {member.credentials.map((c, i) => (
              <span key={i} className="text-[10px] bg-accent/10 text-foreground/60 px-1.5 py-0.5 rounded border border-border">{c}</span>
            ))}
          </div>
        )}
        {member.bio && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{member.bio}</p>
        )}
      </div>
    </div>
  );
}

/** Compact portrait card for regular council members */
function MemberCard({ member }: { member: CouncilMember }) {
  const initials = member.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-primary/5">
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary/20 font-serif">{initials}</span>
        {member.photo_url && (
          <img src={member.photo_url} alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/65 to-transparent pt-8 pb-1.5 px-2">
          <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider">Member</span>
        </div>
      </div>
      <div className="p-3 text-center">
        <h3 className="font-serif text-xs font-bold text-foreground leading-snug mb-0.5">{member.name}</h3>
        {member.credentials && member.credentials.length > 0 && (
          <p className="text-[10px] text-muted-foreground">{member.credentials.join(" · ")}</p>
        )}
      </div>
    </div>
  );
}

export default function CouncilPage() {
  const { data: apiData } = useQuery<{ data: CouncilMember[] }>({
    queryKey: ["council-members"],
    queryFn: () => fetch("/api/council").then(r => r.json()),
  });

  const members = apiData?.data ?? FALLBACK;

  const leaders = members.filter(m => ["chairperson", "vice_chair", "ex_officio"].includes(m.category));
  const rest = members.filter(m => !["chairperson", "vice_chair", "ex_officio"].includes(m.category));

  return (
    <>
      <Helmet>
        <title>University Council — KAFU</title>
        <meta name="description" content="Meet the University Council of Kaimosi Friends University — the supreme governing body responsible for the strategic leadership and oversight of the institution." />
      </Helmet>

      <PageHero
        eyebrow="Governance"
        title="University Council"
        subtitle="The supreme governing body of Kaimosi Friends University, responsible for strategic leadership, financial oversight, and institutional integrity under the Universities Act, 2012."
        photo="/images/uploads/aerial-1.jpg"
        align="center"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "University Council" },
        ]}
      />

      {/* Stats bar */}
      <section className="bg-accent/5 border-b border-border py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: members.length, label: "Council Members" },
              { value: "4", label: "Statutory Committees" },
              { value: "4×", label: "Meetings per Year" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg border border-border py-4 px-3 shadow-sm">
                <p className="text-2xl font-bold text-primary font-serif mb-0.5">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Council Leadership — horizontal compact cards */}
        {leaders.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-bold text-primary mb-5 pb-2 border-b border-border">
              Council Leadership
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {leaders.map(m => <LeaderCard key={m.id} member={m} />)}
            </div>
          </section>
        )}

        {/* Council Members — compact portrait grid */}
        {rest.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-bold text-primary mb-5 pb-2 border-b border-border">
              Council Members
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {rest.map(member => <MemberCard key={member.id} member={member} />)}
            </div>
          </section>
        )}

        {/* Role of Council */}
        <section className="bg-primary/5 rounded-xl border border-border p-6">
          <h2 className="font-serif text-lg font-bold text-primary mb-3">Role of the University Council</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Under the Universities Act, 2012 and the KAFU Charter, the Council is the supreme governing body of the university. Its core responsibilities include:
          </p>
          <ul className="space-y-1.5">
            {[
              "Setting and overseeing the strategic direction of the university",
              "Approving budgets and safeguarding the university's financial health",
              "Appointing and evaluating the performance of the Vice Chancellor",
              "Ensuring compliance with legal and regulatory requirements",
              "Approving academic programmes and university statutes",
              "Upholding institutional integrity, ethics, and governance standards",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

      </div>
    </>
  );
}
