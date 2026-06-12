import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, Phone, Mail, ArrowLeft, Download, Film, Headphones, Images } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface MediaImage { url: string; caption?: string }
interface MediaAudio { url: string; title?: string }
interface MediaVideo { url: string; title?: string; poster?: string }
interface CharterMedia { video?: MediaVideo[]; audio?: MediaAudio[]; images?: MediaImage[] }

function toVideoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function ServiceCharterMedia({ media }: { media: CharterMedia }) {
  const videos = media.video ?? [];
  const audios = media.audio ?? [];
  const images = media.images ?? [];
  if (videos.length === 0 && audios.length === 0 && images.length === 0) return null;

  return (
    <section className="py-16 bg-background border-b" data-testid="section-charter-media">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Citizen Service Delivery Charter (CSDC)</h2>
          <p className="text-muted-foreground">
            Watch, listen, and view how Kaimosi Friends University implements its Citizen Service Delivery Charter —
            our commitment to transparent, timely, and accountable public service.
          </p>
        </div>

        {videos.length > 0 && (
          <div className="mb-12" data-testid="charter-video-group">
            <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-foreground mb-5">
              <Film className="w-5 h-5 text-primary" /> Video
            </h3>
            <div className={`grid gap-6 ${videos.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"}`}>
              {videos.map((v, i) => {
                const embed = toVideoEmbed(v.url);
                return (
                  <figure key={i} className="rounded-2xl border bg-card overflow-hidden" data-testid={`charter-video-${i}`}>
                    <div className="aspect-video bg-black">
                      {embed ? (
                        <iframe
                          src={embed}
                          title={v.title || `Service Charter video ${i + 1}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video controls preload="metadata" poster={v.poster || undefined} className="w-full h-full" data-testid={`charter-video-player-${i}`}>
                          <source src={v.url} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                    {v.title && <figcaption className="p-4 text-sm font-medium text-foreground">{v.title}</figcaption>}
                  </figure>
                );
              })}
            </div>
          </div>
        )}

        {audios.length > 0 && (
          <div className="mb-12" data-testid="charter-audio-group">
            <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-foreground mb-5">
              <Headphones className="w-5 h-5 text-primary" /> Audio
            </h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              {audios.map((a, i) => (
                <div key={i} className="rounded-xl border bg-card p-5" data-testid={`charter-audio-${i}`}>
                  {a.title && <p className="text-sm font-medium text-foreground mb-3">{a.title}</p>}
                  <audio controls preload="metadata" className="w-full" data-testid={`charter-audio-player-${i}`}>
                    <source src={a.url} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div data-testid="charter-image-group">
            <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-foreground mb-5">
              <Images className="w-5 h-5 text-primary" /> Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <figure key={i} className="rounded-xl border bg-card overflow-hidden" data-testid={`charter-image-${i}`}>
                  <img src={img.url} alt={img.caption || `Service Charter image ${i + 1}`} className="w-full h-48 object-cover" loading="lazy" />
                  {img.caption && <figcaption className="p-3 text-xs text-muted-foreground">{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const FALLBACK_STANDARDS = [
  {
    category: "Admissions & Registration",
    colour: "#1A5C38",
    services: [
      { service: "Online application acknowledgement", standard: "Within 1 working day", remarks: "Automated confirmation email sent" },
      { service: "Application review & offer letter", standard: "5–10 working days", remarks: "After receipt of complete documents" },
      { service: "Student ID card issuance", standard: "2 working days", remarks: "After fee payment confirmation" },
      { service: "Course registration", standard: "Same day", remarks: "Via student portal" },
    ],
  },
  {
    category: "Academic Records",
    colour: "#C9A227",
    services: [
      { service: "Academic transcripts (unofficial)", standard: "3 working days", remarks: "" },
      { service: "Academic transcripts (official)", standard: "5 working days", remarks: "Certified and sealed" },
      { service: "Degree certificate issuance", standard: "30 calendar days", remarks: "After graduation ceremony" },
      { service: "Letter of completion / recommendation", standard: "3 working days", remarks: "" },
      { service: "HELB certification", standard: "2 working days", remarks: "After exam results confirmed" },
    ],
  },
  {
    category: "Finance & Fees",
    colour: "#1B3A6B",
    services: [
      { service: "Fee statement generation", standard: "Immediate", remarks: "Via student portal" },
      { service: "Payment receipt confirmation", standard: "1 working day", remarks: "After bank confirmation" },
      { service: "Bursary / scholarship processing", standard: "10 working days", remarks: "After application submission" },
      { service: "Fee structure enquiries", standard: "Same day", remarks: "Walk-in or phone" },
    ],
  },
  {
    category: "Library Services",
    colour: "#2D6A4F",
    services: [
      { service: "Book borrowing", standard: "Immediate", remarks: "On presentation of valid student ID" },
      { service: "E-resource access", standard: "Immediate", remarks: "Via library portal (24/7)" },
      { service: "Interlibrary loan request", standard: "5–7 working days", remarks: "" },
      { service: "Research assistance", standard: "Same day", remarks: "During library hours" },
    ],
  },
  {
    category: "ICT Support",
    colour: "#8B1A1A",
    services: [
      { service: "Email account activation", standard: "1 working day", remarks: "After registration confirmation" },
      { service: "Password reset", standard: "30 minutes", remarks: "Via helpdesk or self-service" },
      { service: "Network / WiFi fault reporting", standard: "4 working hours", remarks: "" },
      { service: "System access requests", standard: "2 working days", remarks: "Requires line manager approval" },
    ],
  },
  {
    category: "Student Affairs",
    colour: "#3A5A8C",
    services: [
      { service: "Disciplinary complaint acknowledgement", standard: "3 working days", remarks: "" },
      { service: "Counselling appointment", standard: "2 working days", remarks: "Or immediate for crisis situations" },
      { service: "Club / association registration", standard: "5 working days", remarks: "" },
      { service: "Accommodation allocation", standard: "5 working days", remarks: "Subject to availability" },
    ],
  },
];

function CharterImageCard({ src, label, alt, testid }: { src: string; label: string; alt: string; testid: string }) {
  const [errored, setErrored] = React.useState(false);
  return (
    <div className="rounded-xl bg-card border overflow-hidden flex flex-col" data-testid={`card-charter-image-${testid}`}>
      <div className="px-5 py-3 bg-primary/5 border-b">
        <h4 className="font-semibold text-foreground text-sm">{label}</h4>
      </div>
      {errored ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px] bg-secondary/30 text-center px-4">
          <p className="text-sm text-muted-foreground">{label} will be added soon.</p>
        </div>
      ) : (
        <a href={src} target="_blank" rel="noopener noreferrer" data-testid={`link-charter-image-${testid}`}>
          <img
            src={src}
            alt={alt}
            onError={() => setErrored(true)}
            className="w-full h-auto object-contain"
          />
        </a>
      )}
    </div>
  );
}

function CharterVideoCard({ media }: { media: CharterMedia }) {
  const v = (media.video ?? [])[0];
  const embed = v ? toVideoEmbed(v.url) : null;
  return (
    <div className="rounded-xl bg-card border overflow-hidden flex flex-col" data-testid="card-charter-video">
      <div className="px-5 py-3 bg-primary/5 border-b flex items-center gap-2">
        <Film className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-foreground text-sm">{v?.title || "Service Charter Video"}</h4>
      </div>
      {v ? (
        <div className="aspect-video bg-black">
          {embed ? (
            <iframe
              src={embed}
              title={v.title || "Service Charter video"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              data-testid="charter-concern-video-embed"
            />
          ) : (
            <video controls preload="metadata" poster={v.poster || undefined} className="w-full h-full" data-testid="charter-concern-video-player">
              <source src={v.url} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[200px] bg-secondary/30 text-center px-4">
          <p className="text-sm text-muted-foreground">Service Charter video will be added soon.</p>
        </div>
      )}
    </div>
  );
}

function CharterAudioCard({ media }: { media: CharterMedia }) {
  const a = (media.audio ?? [])[0];
  return (
    <div className="rounded-xl bg-card border overflow-hidden flex flex-col" data-testid="card-charter-audio">
      <div className="px-5 py-3 bg-primary/5 border-b flex items-center gap-2">
        <Headphones className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-foreground text-sm">{a?.title || "Service Charter Audio"}</h4>
      </div>
      {a ? (
        <div className="flex-1 flex items-center p-5">
          <audio controls preload="metadata" className="w-full" data-testid="charter-concern-audio-player">
            <source src={a.url} />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[200px] bg-secondary/30 text-center px-4">
          <p className="text-sm text-muted-foreground">Service Charter audio will be added soon.</p>
        </div>
      )}
    </div>
  );
}

export default function ServiceCharter() {
  const { data: pageData } = useQuery({
    queryKey: ["page", "about-service-charter"],
    queryFn: () => fetch("/api/pages/about-service-charter").then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  });
  const sd = pageData?.data?.structured_data ?? {};
  const STANDARDS = (sd.standards as typeof FALLBACK_STANDARDS) ?? FALLBACK_STANDARDS;
  const media = (sd.media as CharterMedia) ?? {};

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Service Charter — KAFU"
        description="KAFU's Service Charter sets out the service standards and commitments we make to students, staff, and the public across all university departments."
        path="/about/service-charter"
      />

      {/* Hero */}
      <PageHero
        eyebrow="Governance"
        title="Service Charter"
        subtitle="Our commitment to service excellence — the standards students, staff, and the public can expect from every department of Kaimosi Friends University."
        photo="/images/uploads/campus-main.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Service Charter" },
        ]}
      >
        <Button className="bg-[#C9A227] text-[#1A5C38] hover:bg-[#b8911f] font-semibold" asChild data-testid="button-download-charter">
          <a href="/documents/kafu-service-charter.pdf" target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4 mr-2" /> Download Service Charter (PDF)
          </a>
        </Button>
      </PageHero>

      {/* Our Commitment */}
      <section className="py-12 bg-secondary/30 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">Our Commitment to You</h2>
            <p className="text-muted-foreground">
              KAFU is committed to providing timely, responsive, and professional services. This charter sets measurable standards
              that our departments are held accountable to. If we fall short, you have the right to raise a concern.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { icon: Clock, title: "Timeliness", desc: "Clear response timeframes for every service, measured and reported quarterly." },
              { icon: CheckCircle, title: "Professionalism", desc: "Courteous, knowledgeable, and respectful service from all KAFU staff." },
              { icon: AlertCircle, title: "Accountability", desc: "Complaints are investigated and resolved. Escalation paths are clear and accessible." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSDC Multimedia (video / audio / images) */}
      <ServiceCharterMedia media={media} />

      {/* Service Standards Table */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-primary text-center mb-12">Service Standards by Department</h2>
          <div className="space-y-8 max-w-5xl mx-auto">
            {STANDARDS.map(cat => (
              <div key={cat.category} className="rounded-2xl border bg-card overflow-hidden" data-testid={`service-cat-${cat.category.replace(/\s/g, "-").toLowerCase()}`}>
                <div className="h-1.5" style={{ backgroundColor: cat.colour }} />
                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold mb-4" style={{ color: cat.colour }}>{cat.category}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 font-semibold text-muted-foreground pr-4">Service</th>
                          <th className="pb-2 font-semibold text-muted-foreground pr-4 whitespace-nowrap">Standard</th>
                          <th className="pb-2 font-semibold text-muted-foreground hidden sm:table-cell">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {cat.services.map((s, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 pr-4 text-foreground">{s.service}</td>
                            <td className="py-3 pr-4 font-semibold text-primary whitespace-nowrap">{s.standard}</td>
                            <td className="py-3 text-muted-foreground hidden sm:table-cell">{s.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to raise a concern */}
      <section className="py-16 bg-secondary/30 border-t">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-serif font-bold text-primary text-center mb-8">Service Charter Documents, Video &amp; Audio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CharterImageCard
              testid="en"
              label="Service Delivery Charter (English)"
              alt="KAFU Service Delivery Charter - English"
              src="/images/uploads/service-delivery-charter-en.jpg"
            />
            <CharterImageCard
              testid="sw"
              label="Service Delivery Charter (Kiswahili)"
              alt="KAFU Service Delivery Charter - Kiswahili"
              src="/images/uploads/service-delivery-charter-sw.jpg"
            />
            <CharterVideoCard media={media} />
            <CharterAudioCard media={media} />
          </div>
          <div className="mt-8 p-5 rounded-xl bg-card border flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-muted-foreground">For urgent matters or if you are unsatisfied with the process:</p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+254777373633" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                <Phone className="w-4 h-4" /> +254 777 373 633
              </a>
              <a href="mailto:registrar@kafu.ac.ke" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                <Mail className="w-4 h-4" /> registrar@kafu.ac.ke
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
