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

// Source: /university-council
const FALLBACK: CouncilMember[] = [
  {
    id: 1,
    name: "Prof. Stanley O. Khainga",
    title: "Chairman of the Council",
    photo_url: "/imgs/staff/Prof.-Khainga.jpg",
    category: "chairperson",
    position_order: 1,
    credentials: [],
    bio: "Prof. Stanley O. Khainga chairs the Kaimosi Friends University Council, providing strategic leadership and ensuring sound governance of the institution in accordance with the Universities Act, 2012 and the KAFU Charter.",
  },
  {
    id: 2,
    name: "Prof. Peter N. Mwita",
    title: "Secretary to the Council",
    photo_url: "/imgs/staff/Prof.-Mwita-council.jpg",
    category: "ex_officio",
    position_order: 2,
    credentials: ["PhD"],
    bio: "Prof. Peter N. Mwita is the Vice Chancellor of Kaimosi Friends University and serves as Secretary to the University Council. He is a Full Professor of Statistics and previously served as Deputy Vice-Chancellor (Research, Innovation & Linkages) at Machakos University.",
  },
  {
    id: 3,
    name: "Ms. Rose Chepkoech Langat",
    title: "Member, University Council",
    photo_url: "/imgs/staff/Ms.-Langat.jpg",
    category: "member",
    position_order: 3,
    credentials: [],
    bio: null,
  },
  {
    id: 4,
    name: "Mr. David Mongosi Sigano",
    title: "Member, University Council",
    photo_url: "/imgs/staff/Mr.-Mongosi.jpg",
    category: "member",
    position_order: 4,
    credentials: [],
    bio: null,
  },
  {
    id: 5,
    name: "Dr. Moses Osia Mwanje",
    title: "Member, University Council",
    photo_url: "/imgs/staff/Dr.-Mwanje.jpg",
    category: "member",
    position_order: 5,
    credentials: ["PhD"],
    bio: null,
  },
  {
    id: 6,
    name: "Mr. Yussuf Kala",
    title: "Member, University Council",
    photo_url: "/imgs/staff/Mr.-Kala.jpg",
    category: "member",
    position_order: 6,
    credentials: [],
    bio: null,
  },
  {
    id: 7,
    name: "CPA Gilbert K. Kangogo",
    title: "Member, University Council",
    photo_url: "/imgs/staff/CPA-Kangogo.jpg",
    category: "member",
    position_order: 7,
    credentials: ["CPA (K)"],
    bio: null,
  },
  {
    id: 8,
    name: "Dr. Thaddaeus W. Egondi",
    title: "Member, University Council",
    photo_url: "/imgs/staff/Dr.-Egondi.jpg",
    category: "member",
    position_order: 8,
    credentials: ["PhD"],
    bio: null,
  },
  {
    id: 9,
    name: "Dr. Milton Njuki",
    title: "Member, University Council",
    photo_url: "/imgs/staff/Dr.-Njuki.jpg",
    category: "member",
    position_order: 9,
    credentials: ["PhD"],
    bio: null,
  },
];

function MemberCard({ member, featured = false }: { member: CouncilMember; featured?: boolean }) {
  const initials = member.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className={`relative overflow-hidden bg-primary/5 ${featured ? "aspect-[3/4]" : "aspect-square"}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-primary/20 font-serif">{initials}</span>
        </div>
        {member.photo_url && (
          <img
            src={member.photo_url}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/75 via-primary/20 to-transparent pt-12 pb-2 px-3 text-center">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
            {CATEGORY_LABELS[member.category] ?? "Member"}
          </span>
        </div>
      </div>
      <div className="p-4 text-center flex flex-col flex-1">
        <h3 className="font-serif font-bold text-foreground leading-snug mb-1 text-sm md:text-base">{member.name}</h3>
        <p className="text-xs text-muted-foreground leading-snug">{member.title}</p>
        {member.credentials && member.credentials.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mt-2">
            {member.credentials.map((c, i) => (
              <span key={i} className="text-xs bg-accent/10 text-foreground/60 px-2 py-0.5 rounded border border-border">{c}</span>
            ))}
          </div>
        )}
        {featured && member.bio && (
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-4">{member.bio}</p>
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

  const chairperson = members.find(m => m.category === "chairperson");
  const viceChair = members.find(m => m.category === "vice_chair");
  const exOfficio = members.filter(m => m.category === "ex_officio");
  const rest = members.filter(m => !["chairperson", "vice_chair", "ex_officio"].includes(m.category));

  return (
    <>
      <Helmet>
        <title>University Council — KAFU</title>
        <meta name="description" content="Meet the University Council of Kaimosi Friends University — the supreme governing body responsible for the strategic leadership and oversight of the institution." />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="Governance"
        title="University Council"
        subtitle="The University Council is the supreme governing body of Kaimosi Friends University, responsible for strategic leadership, financial oversight, and the upholding of institutional integrity in accordance with the Universities Act, 2012."
        photo="/imgs/aerial-1.jpg"
        align="center"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "University Council" },
        ]}
      />

      {/* Council intro */}
      <section className="bg-accent/5 border-b border-border py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-5 bg-white rounded-xl border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary font-serif mb-1">{members.length}</p>
              <p className="text-sm text-muted-foreground">Council Members</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary font-serif mb-1">4</p>
              <p className="text-sm text-muted-foreground">Statutory Committees</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-border shadow-sm">
              <p className="text-3xl font-bold text-primary font-serif mb-1">4×</p>
              <p className="text-sm text-muted-foreground">Meetings per Year (minimum)</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">

        {/* Chairperson — featured portrait card */}
        {chairperson && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-primary mb-8 pb-3 border-b border-border">
              Council Leadership
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <MemberCard member={chairperson} featured />
              </div>
            </div>
          </section>
        )}

        {/* Ex-Officio: Vice Chancellor — featured portrait card */}
        {exOfficio.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-primary mb-8 pb-3 border-b border-border">
              Ex-Officio Member
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <MemberCard member={exOfficio[0]} featured />
              </div>
            </div>
          </section>
        )}

        {/* All other members — portrait grid */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-primary mb-8 pb-3 border-b border-border">
            Council Members
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {rest.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Role of Council */}
        <section className="bg-primary/5 rounded-2xl border border-border p-8">
          <h2 className="font-serif text-2xl font-bold text-primary mb-4">Role of the University Council</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Under the Universities Act, 2012 and the KAFU Charter, the University Council is the supreme governing body
            of Kaimosi Friends University. Its core responsibilities include:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "Setting and overseeing the strategic direction of the university",
              "Approving budgets and safeguarding the university's financial health",
              "Appointing and evaluating the performance of the Vice Chancellor",
              "Ensuring compliance with legal and regulatory requirements",
              "Approving academic programmes and university statutes",
              "Upholding institutional integrity, ethics, and governance standards",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </>
  );
}
