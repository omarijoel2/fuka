import { Users, Library, Activity, HeartHandshake, ShieldCheck, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";

export default function StudentServices() {
  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Student Services — Kaimosi Friends University"
        description="KAFU student support services — academic registry, library, health services, counselling, accommodation, career services, and digital learning tools."
        path="/student-services"
        breadcrumbs={[{ name: "Student Services", path: "/student-services" }]}
      />
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Student Life & Services</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            We are committed to providing a holistic university experience that nurtures the mind, body, and spirit.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed">
            At Kaimosi Friends University, learning goes beyond the classroom. Since our establishment in 2014, we have continuously developed support systems and extracurricular facilities to ensure our students thrive academically and personally.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          
          <div className="bg-card p-8 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Games & Sports</h3>
            <p className="text-muted-foreground text-sm">
              Established alongside the university in 2014, our sports department offers football, basketball, athletics, and indoor games. We actively participate in regional university leagues.
            </p>
          </div>

          <div className="bg-card p-8 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <Library className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">University Library</h3>
            <p className="text-muted-foreground text-sm">
              A quiet, resourceful environment with extensive physical collections and access to thousands of e-journals and academic databases for research.
            </p>
          </div>

          <div className="bg-card p-8 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Accommodation</h3>
            <p className="text-muted-foreground text-sm">
              Secure, affordable on-campus hostels for students. Off-campus private hostels around Kaimosi are also vetted by our accommodation office.
            </p>
          </div>

          <div className="bg-card p-8 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Counselling Services</h3>
            <p className="text-muted-foreground text-sm">
              Professional, confidential psychological support and mentorship to help students navigate academic stress and personal challenges.
            </p>
          </div>

          <div className="bg-card p-8 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Student Government</h3>
            <p className="text-muted-foreground text-sm">
              The KAFU Students Organization advocates for student welfare, organizes cultural events, and provides leadership development opportunities.
            </p>
          </div>

          <div className="bg-primary p-8 border rounded-xl shadow-sm text-primary-foreground">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Laptop className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Digital Services</h3>
            <p className="text-primary-foreground/80 text-sm mb-6">
              Access your timetables, exam results, and online classes through our centralized portals.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90" asChild data-testid="btn-ss-portal">
                <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">Student Portal</a>
              </Button>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white/10" asChild data-testid="btn-ss-elearning">
                <a href="https://elearning.kafu.ac.ke" target="_blank" rel="noreferrer">E-Learning System</a>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
