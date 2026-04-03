import { Button } from "@/components/ui/button";
import { CheckCircle2, GraduationCap, MonitorUp, FileText, ArrowRight } from "lucide-react";

export default function Admissions() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Admissions</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Join the Spring of Knowledge. Find everything you need to know about applying to KAFU.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-accent" />
                How to Apply
              </h2>
              <div className="space-y-6">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-3">Undergraduate Government Sponsored (KUCCPS)</h3>
                  <p className="text-muted-foreground mb-4">
                    Students seeking government sponsorship must apply through the Kenya Universities and Colleges Central Placement Service (KUCCPS). Ensure you select Kaimosi Friends University (KAFU) as your preferred institution during the application window.
                  </p>
                  <Button variant="outline" asChild data-testid="btn-kuccps">
                    <a href="https://students.kuccps.net/" target="_blank" rel="noreferrer">Visit KUCCPS Portal <ArrowRight className="w-4 h-4 ml-2" /></a>
                  </Button>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm border-l-4 border-l-primary">
                  <h3 className="text-xl font-bold mb-3">Self-Sponsored & Postgraduate (Direct Application)</h3>
                  <p className="text-muted-foreground mb-4">
                    For privately sponsored undergraduate, diploma, certificate, and all postgraduate programmes, you can apply directly through our Student Portal. Create an account, fill out the forms, and upload required documents.
                  </p>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild data-testid="btn-direct-apply">
                    <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">Apply via Student Portal <ArrowRight className="w-4 h-4 ml-2" /></a>
                  </Button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-serif font-bold text-primary mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-accent" />
                General Requirements
              </h2>
              <div className="prose max-w-none text-muted-foreground">
                <ul className="space-y-4 list-none pl-0">
                  <li className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="block text-foreground">Undergraduate Degree Programmes</strong>
                      Minimum KCSE mean grade of C+ (Plus) or its equivalent, with specific subject requirements depending on the programme.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="block text-foreground">Diploma Programmes</strong>
                      Minimum KCSE mean grade of C- (Minus) or its equivalent.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="block text-foreground">Postgraduate Programmes</strong>
                      A relevant Bachelor's degree (for Masters) or Master's degree (for PhD) from a recognized university.
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-secondary p-8 rounded-xl border">
                <h3 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> Fees Structure
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Fee structures vary by programme, level, and sponsorship type (Government vs. Self-sponsored). The most up-to-date fee schedules are available on the student portal upon admission.
                </p>
                <Button variant="outline" className="w-full" asChild data-testid="btn-contact-finance">
                  <a href="/contact">Contact Finance Office</a>
                </Button>
              </div>

              <div className="bg-primary text-primary-foreground p-8 rounded-xl">
                <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                  <MonitorUp className="w-5 h-5 text-accent" /> Need Help?
                </h3>
                <p className="text-sm text-primary-foreground/80 mb-6">
                  If you encounter issues during the application process or need guidance on choosing a programme.
                </p>
                <div className="space-y-3 text-sm">
                  <p><strong>Email:</strong> admissions@kafu.ac.ke</p>
                  <p><strong>Phone:</strong> +254 777 373 633</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
