import { BookOpen, Users, MapPin, Globe, GraduationCap, FlaskConical } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CAMPUS_IMG = "https://kafu.ac.ke/wp-content/uploads/IMG_8696.jpg";
const CAMPUS_IMG2 = "https://kafu.ac.ke/wp-content/uploads/PIC1.jpg";
const VC_IMG = "https://kafu.ac.ke/wp-content/uploads/Vice-Chancellor-Prof.-Peter-Mwita-addresses-fourth-year-teacher-trainees-during-the-opening-of-the-Competency-Based-Education-CBE-training-at-Kaimosi-Friends-University.jpg";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header with real campus photo */}
      <div className="relative bg-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
        <img
          src={CAMPUS_IMG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35)" }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">About KAFU</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Discover the history, mission, and vision of Kaimosi Friends University — a Quaker-founded institution at the heart of Western Kenya.
          </p>
        </div>
      </div>

      {/* Campus photo feature strip */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={CAMPUS_IMG2}
          alt="Kaimosi Friends University campus"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className="inline-block bg-background/80 backdrop-blur-sm text-foreground text-sm font-medium px-4 py-1.5 rounded-full border border-border/50">
            Kaimosi Campus — Vihiga County, Western Kenya
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-8 space-y-12">
            {/* History */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our History</h2>
              <div className="prose max-w-none text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Kaimosi Friends University (KAFU) was established in 2014, rooted deeply in the Quaker heritage of truth and service. What began as a constituent college has rapidly grown into a fully-fledged, independent public university in Western Kenya.
                </p>
                <p>
                  The university stands as a testament to the pioneering educational efforts of the Friends Church (Quakers) in the region. Since its inception, KAFU has been dedicated to providing quality higher education, fostering research, and promoting innovation that addresses societal needs.
                </p>
                <p>
                  Today, KAFU serves thousands of students across its five distinct schools, offering over 38 academic programmes ranging from certificates to doctoral degrees.
                </p>
              </div>
            </section>

            {/* VC Photo Feature */}
            <section className="rounded-2xl overflow-hidden border shadow-sm">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto min-h-[260px]">
                  <img
                    src={VC_IMG}
                    alt="Vice-Chancellor Prof. Peter Nyamuhanga Mwita addressing teacher trainees at KAFU"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
                <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">Vice-Chancellor</span>
                  <h3 className="text-2xl font-serif font-bold mb-3">Prof. Peter Nyamuhanga Mwita</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mb-5">
                    Prof. Mwita was officially appointed Vice-Chancellor of Kaimosi Friends University on 14 May 2025, having served in an acting capacity since February 2024. Under his leadership, KAFU continues to advance its mission of quality education, research, and community engagement.
                  </p>
                  <a href="mailto:vc@kafu.ac.ke" className="text-accent text-sm font-medium hover:underline">
                    vc@kafu.ac.ke
                  </a>
                </div>
              </div>
            </section>

            {/* Mission & Vision */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary p-8 rounded-xl border border-border/50">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be a premier university in training, research, innovation and community service.
                </p>
              </div>
              <div className="bg-secondary p-8 rounded-xl border border-border/50">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide quality education and training, promote research and innovation for sustainable development.
                </p>
              </div>
            </section>

            {/* Quaker Heritage */}
            <section className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-primary/90" />
              <img
                src="https://kafu.ac.ke/wp-content/uploads/2025/10/art-culture.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.25)", mixBlendMode: "multiply" }}
              />
              <div className="relative p-8 md:p-12 text-white z-10">
                <h3 className="text-2xl font-serif font-bold mb-4 text-accent">Quaker Heritage</h3>
                <p className="text-white/85 leading-relaxed max-w-2xl">
                  KAFU draws from the rich Quaker tradition of Friends Church East Africa, which established the first school at Kaimosi in 1902. This heritage of service, integrity, and education without discrimination remains at the core of every programme, policy, and partnership the university pursues.
                </p>
              </div>
            </section>

            {/* Core Values */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Core Values</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Integrity and Professionalism",
                  "Quality and Excellence",
                  "Equity and Inclusivity",
                  "Innovation and Creativity",
                  "Teamwork and Collaboration",
                ].map((value, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-card border rounded-lg shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Sidebar Stats */}
            <div className="bg-primary text-primary-foreground p-8 rounded-xl sticky top-24">
              <h3 className="text-xl font-bold font-serif mb-6 border-b border-primary-foreground/20 pb-4">KAFU at a Glance</h3>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="mt-1"><MapPin className="w-5 h-5 text-accent" /></div>
                  <div>
                    <strong className="block font-medium">Location</strong>
                    <span className="text-sm text-primary-foreground/80">Kaimosi, Western Kenya</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1"><BookOpen className="w-5 h-5 text-accent" /></div>
                  <div>
                    <strong className="block font-medium">Academic Breadth</strong>
                    <span className="text-sm text-primary-foreground/80">5 Schools, 38+ Programmes</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1"><Users className="w-5 h-5 text-accent" /></div>
                  <div>
                    <strong className="block font-medium">Founded</strong>
                    <span className="text-sm text-primary-foreground/80">2014</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1"><GraduationCap className="w-5 h-5 text-accent" /></div>
                  <div>
                    <strong className="block font-medium">Programmes</strong>
                    <span className="text-sm text-primary-foreground/80">Certificate to PhD level</span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-1"><FlaskConical className="w-5 h-5 text-accent" /></div>
                  <div>
                    <strong className="block font-medium">Unique Offering</strong>
                    <span className="text-sm text-primary-foreground/80">One of 2 universities in Kenya offering Optometry to PhD</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Explore CTA */}
            <div className="rounded-xl border bg-card p-6 space-y-3">
              <h4 className="font-serif font-bold text-base">Explore KAFU</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/schools">Academic Schools</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/programmes">Programmes</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" asChild>
                  <Link href="/staff">Staff Directory</Link>
                </Button>
                <Button className="w-full text-sm" asChild>
                  <Link href="/admissions">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
