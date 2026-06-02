import React from "react";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Images, Play, Newspaper, BookOpen, Download, Palette, ChevronRight, ExternalLink } from "lucide-react";

const SECTIONS = [
  {
    icon: Images,
    title: "Photo Gallery",
    description: "Browse photos from graduation ceremonies, campus life, sports, research events, and international activities.",
    href: "/gallery",
    testid: "media-link-gallery",
    colour: "bg-green-50 text-green-700",
  },
  {
    icon: Play,
    title: "Video Gallery",
    description: "Watch videos showcasing KAFU's academic excellence, campus experience, and community impact.",
    href: "/media/videos",
    testid: "media-link-videos",
    colour: "bg-blue-50 text-blue-700",
  },
  {
    icon: Newspaper,
    title: "Press Releases",
    description: "Official press releases and media statements from Kaimosi Friends University.",
    href: "/media/press-releases",
    testid: "media-link-press",
    colour: "bg-amber-50 text-amber-700",
  },
  {
    icon: BookOpen,
    title: "Publications",
    description: "University newsletters, annual reports, prospectus, and institutional publications.",
    href: "/media/publications",
    testid: "media-link-publications",
    colour: "bg-purple-50 text-purple-700",
  },
  {
    icon: Download,
    title: "Downloads",
    description: "Forms, templates, policy documents, and other resources available for download.",
    href: "/media/downloads",
    testid: "media-link-downloads",
    colour: "bg-teal-50 text-teal-700",
  },
  {
    icon: Palette,
    title: "Branding Resources",
    description: "Official logos, colour palette, typography guidelines, and brand usage standards.",
    href: "/media/branding",
    testid: "media-link-branding",
    colour: "bg-rose-50 text-rose-700",
  },
];

const RECENT_PRESS = [
  { title: "KAFU Launches New School of Health Sciences Building", date: "12 May 2026", href: "/media/press-releases" },
  { title: "University Receives KES 50 Million Research Grant from Wellcome Trust", date: "28 Apr 2026", href: "/media/press-releases" },
  { title: "KAFU Signs MOU with Masinde Muliro University of Science and Technology", date: "10 Apr 2026", href: "/media/press-releases" },
];

export default function MediaPage() {
  return (
    <>
      <SeoHead
        title="Media Centre | Kaimosi Friends University"
        description="The KAFU Media Centre — photo and video gallery, press releases, institutional publications, downloads, and branding resources."
      />

      <PageHero
        eyebrow="Media Centre"
        title="News, Media & Resources"
        subtitle="Your one-stop source for KAFU's photos, videos, press releases, publications, and official branding materials."
        photo="/images/uploads/campus-main.jpg"
        align="center"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Media" }]}
      />

      {/* Sections Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Media Sections</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={s.href} data-testid={s.testid}>
                <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-6 cursor-pointer transition-all h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.colour}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 flex-1">{s.description}</p>
                  <span className="mt-4 text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Visit <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Press Releases */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Latest Press Releases</h2>
            <Link href="/media/press-releases" data-testid="media-all-press-link">
              <span className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                All press releases <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="space-y-4">
            {RECENT_PRESS.map((p, i) => (
              <Link key={i} href={p.href} data-testid={`press-recent-${i}`}>
                <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900 hover:text-primary transition-colors">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.date}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Media Enquiries</h3>
            <p className="text-gray-600 text-sm">
              For press credentials, interview requests, or official media enquiries, contact the Communications Office.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <a href="mailto:communications@kafu.ac.ke" className="text-primary hover:underline font-medium" data-testid="media-contact-email">communications@kafu.ac.ke</a>
            <a href="tel:+254777373633" className="text-gray-600 hover:text-primary" data-testid="media-contact-phone">+254 777 373 633</a>
          </div>
        </div>
      </section>
    </>
  );
}
