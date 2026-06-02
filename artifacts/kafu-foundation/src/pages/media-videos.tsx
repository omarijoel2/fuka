import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Play, ExternalLink } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  category: string;
  date: string;
  duration: string;
  youtube_id: string;
  description: string;
}

const FALLBACK_VIDEOS: VideoItem[] = [
  { id: "v01", title: "KAFU Graduation Ceremony 2025 — Highlights", category: "Ceremony", date: "Nov 2025", duration: "8:24", youtube_id: "dQw4w9WgXcQ", description: "Highlights from the 2025 graduation ceremony celebrating over 800 graduates across all five schools." },
  { id: "v02", title: "KAFU Campus Tour — Kaimosi Main Campus", category: "Campus Life", date: "Oct 2025", duration: "5:12", youtube_id: "dQw4w9WgXcQ", description: "A guided tour of the main campus facilities including lecture halls, library, laboratories, and student accommodation." },
  { id: "v03", title: "Research & Innovation Week 2025", category: "Research", date: "Jul 2025", duration: "12:40", youtube_id: "dQw4w9WgXcQ", description: "Showcasing student and faculty research projects during the annual Research and Innovation Week." },
  { id: "v04", title: "International Exchange Programme — Welcome Day", category: "International", date: "Jun 2025", duration: "4:55", youtube_id: "dQw4w9WgXcQ", description: "Welcoming international students from partner universities in Uganda, Tanzania, and the United Kingdom." },
  { id: "v05", title: "KAFU Sports Day 2025", category: "Sports", date: "Aug 2025", duration: "6:30", youtube_id: "dQw4w9WgXcQ", description: "Recap of the 2025 Inter-School Sports Day featuring athletics, football, volleyball, and traditional games." },
  { id: "v06", title: "Founder's Day 2025 — Academic & Cultural Celebrations", category: "Events", date: "Sep 2025", duration: "9:17", youtube_id: "dQw4w9WgXcQ", description: "Cultural performances, academic processions, and keynote addresses from the 2025 Founder's Day celebrations." },
  { id: "v07", title: "KAFU School of Health Sciences — Facility Overview", category: "Academic", date: "Apr 2025", duration: "7:05", youtube_id: "dQw4w9WgXcQ", description: "An overview of the newly commissioned School of Health Sciences laboratories and clinical training facilities." },
  { id: "v08", title: "Student Testimonials — Life at KAFU", category: "Campus Life", date: "Mar 2025", duration: "3:48", youtube_id: "dQw4w9WgXcQ", description: "Current students share their experiences of studying, living, and growing at Kaimosi Friends University." },
  { id: "v09", title: "Vice Chancellor's Address — 2025 Academic Year", category: "Official", date: "Sep 2025", duration: "14:02", youtube_id: "dQw4w9WgXcQ", description: "The Vice Chancellor's address at the opening of the 2025/2026 academic year, outlining strategic priorities." },
];

const CATEGORIES = ["All", "Ceremony", "Campus Life", "Research", "International", "Sports", "Events", "Academic", "Official"];

export default function MediaVideosPage() {
  const [active, setActive] = useState("All");
  const [playing, setPlaying] = useState<string | null>(null);

  const { data: apiData } = useQuery<{ data: VideoItem[] }>({
    queryKey: ["videos"],
    queryFn: () => fetch("/api/videos").then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const allVideos = apiData?.data ?? FALLBACK_VIDEOS;
  const filtered = active === "All" ? allVideos : allVideos.filter(v => v.category === active);

  return (
    <>
      <SeoHead
        title="Video Gallery | Kaimosi Friends University"
        description="Watch KAFU's official videos — graduation highlights, campus tours, research showcases, sports events, and official addresses."
      />

      <PageHero
        eyebrow="Media"
        title="Video Gallery"
        subtitle="Official videos from graduation ceremonies, campus life, research events, sports, and more."
        photo="/imgs/art-culture.jpg"
        align="center"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Media", href: "/media" }, { label: "Videos" }]}
      >
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { label: "Videos", value: allVideos.length },
            { label: "Categories", value: CATEGORIES.length - 1 },
            { label: "Hours of Content", value: "2+" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-[#C9A227]">{s.value}</div>
              <div className="text-sm text-white/70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Filters */}
      <section className="bg-white border-b sticky top-[4.5rem] z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide" data-testid="video-filters">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActive(c)}
                data-testid={`video-filter-${c.toLowerCase().replace(/\s/g, "-")}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  active === c ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all" data-testid={`video-card-${v.id}`}>
              {/* Thumbnail / Player */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                {playing === v.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full"
                    title={v.title}
                  />
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        onClick={() => setPlaying(v.id)}
                        data-testid={`play-${v.id}`}
                        className="w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
                        aria-label={`Play ${v.title}`}
                      >
                        <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      {v.duration}
                    </span>
                  </>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{v.category}</span>
                  <span className="text-xs text-gray-400">{v.date}</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900 leading-snug mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{v.description}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  data-testid={`youtube-${v.id}`}
                >
                  <ExternalLink className="w-3 h-3" /> Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
