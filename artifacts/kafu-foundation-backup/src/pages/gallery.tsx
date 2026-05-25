import React, { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import { Camera, Play, ChevronRight, Images } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

interface GalleryItem {
  id: number;
  title: string | null;
  caption: string | null;
  type: "image" | "video";
  media_url: string | null;
  thumbnail_url: string | null;
  youtube_id: string | null;
  sort_order: number;
}

interface GalleryAlbum {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  album_date: string | null;
  sort_order: number;
  items?: GalleryItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  graduation:    "Graduation",
  events:        "Events",
  campus:        "Campus Life",
  sports:        "Sports",
  research:      "Research",
  international: "International",
  other:         "Other",
};

const CATEGORY_COLOURS: Record<string, string> = {
  graduation:    "bg-amber-100 text-amber-800",
  events:        "bg-blue-100 text-blue-800",
  campus:        "bg-green-100 text-green-800",
  sports:        "bg-orange-100 text-orange-800",
  research:      "bg-purple-100 text-purple-800",
  international: "bg-teal-100 text-teal-800",
  other:         "bg-gray-100 text-gray-700",
};

const FALLBACK_ALBUMS: GalleryAlbum[] = [
  { id: 1, title: "Graduation Ceremony 2025", slug: "graduation-2025", description: "KAFU's 2025 graduation celebrated over 800 graduates.", category: "graduation", cover_image_url: "/imgs/campus-main.jpg", album_date: "2025-11-28", sort_order: 1 },
  { id: 2, title: "Founder's Day 2025", slug: "founders-day-2025", description: "Founder's Day celebrations with academic and cultural events.", category: "events", cover_image_url: "/imgs/IMG_8696.jpg", album_date: "2025-09-15", sort_order: 2 },
  { id: 3, title: "Campus Life", slug: "campus-life", description: "A glimpse into everyday life at the KAFU campus.", category: "campus", cover_image_url: "/imgs/aerial-1.jpg", album_date: "2025-10-01", sort_order: 3 },
  { id: 4, title: "Research & Innovation Week 2025", slug: "research-week-2025", description: "Showcasing groundbreaking research from students and faculty.", category: "research", cover_image_url: "/imgs/health.jpg", album_date: "2025-07-10", sort_order: 4 },
  { id: 5, title: "International Exchange 2025", slug: "international-exchange-2025", description: "Welcoming international students from partner universities.", category: "international", cover_image_url: "/imgs/undergraduate.jpg", album_date: "2025-06-20", sort_order: 5 },
  { id: 6, title: "Sports Day 2025", slug: "sports-day-2025", description: "Athletics, team sports, and inter-school competitions.", category: "sports", cover_image_url: "/imgs/PIC1.jpg", album_date: "2025-08-05", sort_order: 6 },
];

const FILTERS = ["All", "Graduation", "Events", "Campus Life", "Sports", "Research", "International"];

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" });
}

function itemCounts(album: GalleryAlbum) {
  const items = album.items ?? [];
  const photos = items.filter(i => i.type === "image").length;
  const videos = items.filter(i => i.type === "video").length;
  return { photos, videos };
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const { data } = useQuery<{ data: GalleryAlbum[] }>({
    queryKey: ["gallery-albums"],
    queryFn: () => fetch("/api/gallery/albums").then(r => r.json()),
    staleTime: 1000 * 60 * 5,
  });

  const albums: GalleryAlbum[] = data?.data ?? FALLBACK_ALBUMS;

  const filtered = activeFilter === "All"
    ? albums
    : albums.filter(a => CATEGORY_LABELS[a.category] === activeFilter);

  const totalPhotos = albums.reduce((n, a) => n + (a.items?.filter(i => i.type === "image").length ?? 0), 0);
  const totalVideos = albums.reduce((n, a) => n + (a.items?.filter(i => i.type === "video").length ?? 0), 0);

  return (
    <>
      <SeoHead
        title="Media Gallery | Kaimosi Friends University"
        description="Explore KAFU's photo and video gallery — graduation ceremonies, campus life, events, sports, research, and international activities."
      />

      {/* Hero */}
      <PageHero
        eyebrow="Media"
        title="Photo & Video Gallery"
        subtitle="Explore moments from KAFU's campus life, ceremonies, research activities, and community events."
        photo="/imgs/art-culture.jpg"
        align="center"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      >
        <div className="flex flex-wrap justify-center gap-10">
          {[
            { label: "Albums", value: albums.length },
            { label: "Photos", value: totalPhotos || "100+" },
            { label: "Videos", value: totalVideos || "12+" },
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
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide" data-testid="gallery-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                data-testid={`filter-${f.toLowerCase().replace(" ", "-")}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === f
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Images className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No albums in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(album => {
              const { photos, videos } = itemCounts(album);
              return (
                <Link
                  key={album.id}
                  href={`/gallery/${album.slug}`}
                  data-testid={`album-card-${album.slug}`}
                >
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer">
                    {/* Cover Image */}
                    <div className="relative h-52 bg-gray-100 overflow-hidden">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Camera className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Category Badge */}
                      <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLOURS[album.category] ?? CATEGORY_COLOURS.other}`}>
                        {CATEGORY_LABELS[album.category] ?? album.category}
                      </span>
                      {/* Media count badges */}
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        {photos > 0 && (
                          <span className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                            <Camera className="w-3 h-3" /> {photos}
                          </span>
                        )}
                        {videos > 0 && (
                          <span className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                            <Play className="w-3 h-3" /> {videos}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Card Body */}
                    <div className="p-4">
                      <h2 className="font-serif font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {album.title}
                      </h2>
                      {album.album_date && (
                        <p className="text-xs text-gray-400 mt-1">{formatDate(album.album_date)}</p>
                      )}
                      {album.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{album.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">{(photos + videos) || ""} {(photos + videos) > 0 ? "items" : ""}</span>
                        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          View <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
