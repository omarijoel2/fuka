import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

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
    id: 1,
    name: "Prof. Stanley O. Khainga",
    title: "Chairperson, Kaimosi Friends University Council",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Stanley-O.-Khainga-Council-Chair.jpg",
    category: "chairperson",
    position_order: 1,
    credentials: [],
    bio: "Prof. Khainga chairs the University Council, providing strategic leadership and ensuring sound governance of Kaimosi Friends University.",
  },
  {
    id: 2,
    name: "Prof. Peter N. Mwita",
    title: "Vice Chancellor & Secretary to the Council",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Prof.-Peter-Mwita-Sec-to-Council.jpg",
    category: "ex_officio",
    position_order: 2,
    credentials: [],
    bio: "Prof. Mwita is a full Professor with over 29 years in academia and research. He previously served as Deputy Vice-Chancellor (Research, Innovation, and Linkages) at Machakos University and has held positions at Jomo Kenyatta University of Agriculture and Technology.",
  },
  {
    id: 3,
    name: "CPA Gilbert K. Kangogo",
    title: "Council Member",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/CPA-Gilbert-K-Kangogo-1.jpg",
    category: "member",
    position_order: 3,
    credentials: ["CPA (K)"],
    bio: null,
  },
  {
    id: 4,
    name: "Dr. Milton Njuki",
    title: "Council Member",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Milton-Njuki.jpg",
    category: "member",
    position_order: 4,
    credentials: [],
    bio: null,
  },
  {
    id: 5,
    name: "Dr. Moses Osia Mwanje",
    title: "Council Member",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Moses-Osia-Mwanje.jpg",
    category: "member",
    position_order: 5,
    credentials: [],
    bio: null,
  },
  {
    id: 6,
    name: "Dr. Thaddaeus W. Egondi",
    title: "Council Member",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Dr.-Thaddaeus-W.-Egondi.jpg",
    category: "member",
    position_order: 6,
    credentials: [],
    bio: null,
  },
  {
    id: 7,
    name: "Mr. David Mongosi",
    title: "Council Member",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Mr.-David-Mongosi-member.jpg",
    category: "member",
    position_order: 7,
    credentials: [],
    bio: null,
  },
  {
    id: 8,
    name: "Mr. Yusuf Kala",
    title: "Council Member",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Mr.-Yusuf-Kala.jpg",
    category: "member",
    position_order: 8,
    credentials: [],
    bio: null,
  },
  {
    id: 9,
    name: "Ms. Rose Chepkoech Langat",
    title: "Council Member",
    photo_url: "https://kafu.ac.ke/wp-content/uploads/2026/02/Ms.-Rose-Chepkoech-Langat-.jpg",
    category: "member",
    position_order: 9,
    credentials: [],
    bio: null,
  },
];

function MemberAvatar({ member }: { member: CouncilMember }) {
  if (member.photo_url) {
    return (
      <img
        src={member.photo_url}
        alt={member.name}
        className="w-24 h-24 rounded-full object-cover object-top border-4 border-white shadow-md"
      />
    );
  }
  const initials = member.name.split(" ").filter(w => /^[A-Z]/.test(w)).slice(0, 2).join("");
  return (
    <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center">
      <span className="text-2xl font-bold text-primary font-serif">{initials}</span>
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
  const rest = members.filter(m => !["chairperson", "vice_chair"].includes(m.category));

  return (
    <>
      <Helmet>
        <title>University Council — KAFU</title>
        <meta name="description" content="Meet the University Council of Kaimosi Friends University — the supreme governing body responsible for the strategic leadership and oversight of the institution." />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-accent text-sm font-medium uppercase tracking-widest mb-3">Governance</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5">University Council</h1>
          <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto leading-relaxed">
            The University Council is the supreme governing body of Kaimosi Friends University,
            responsible for strategic leadership, financial oversight, and the upholding of institutional
            integrity in accordance with the Universities Act, 2012.
          </p>
        </div>
      </section>

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

        {/* Leadership */}
        {(chairperson || viceChair) && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-primary mb-8 pb-3 border-b border-border">
              Council Leadership
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[chairperson, viceChair].filter(Boolean).map(m => m && (
                <div key={m.id} className="flex gap-5 bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <MemberAvatar member={m} />
                  <div className="min-w-0">
                    <span className="inline-block text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded mb-2">
                      {CATEGORY_LABELS[m.category] ?? m.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-foreground leading-snug mb-1">{m.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{m.title}</p>
                    {m.credentials && m.credentials.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {m.credentials.map((c, i) => (
                          <span key={i} className="text-xs bg-accent/10 text-foreground/70 px-2 py-0.5 rounded border border-border">{c}</span>
                        ))}
                      </div>
                    )}
                    {m.bio && <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{m.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All other members */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-primary mb-8 pb-3 border-b border-border">
            Council Members
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map(member => (
              <div key={member.id} className="flex gap-5 bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <MemberAvatar member={member} />
                <div className="min-w-0">
                  <span className="inline-block text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded mb-2">
                    {CATEGORY_LABELS[member.category] ?? "Member"}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-foreground leading-snug mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{member.title}</p>
                  {member.credentials && member.credentials.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.credentials.map((c, i) => (
                        <span key={i} className="text-xs bg-accent/10 text-foreground/70 px-2 py-0.5 rounded border border-border">{c}</span>
                      ))}
                    </div>
                  )}
                  {member.bio && <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{member.bio}</p>}
                </div>
              </div>
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
