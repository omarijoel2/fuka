import { BookOpen, Users, MapPin, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">About KAFU</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Discover the history, mission, and vision of Kaimosi Friends University.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            {/* History */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our History</h2>
              <div className="prose max-w-none text-muted-foreground text-lg leading-relaxed">
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

            {/* Core Values */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6">Core Values</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Integrity and Professionalism",
                  "Quality and Excellence",
                  "Equity and Inclusivity",
                  "Innovation and Creativity",
                  "Teamwork and Collaboration"
                ].map((value, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-card border rounded-lg shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="lg:col-span-4">
            {/* Sidebar Stats */}
            <div className="bg-primary text-primary-foreground p-8 rounded-xl mb-8 sticky top-24">
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
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
