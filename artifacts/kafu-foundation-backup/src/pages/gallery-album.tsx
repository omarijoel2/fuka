import React, { useState, useEffect, useCallback } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SeoHead } from "@/components/seo-head";
import {
  ArrowLeft, Camera, Play, X, ChevronLeft, ChevronRight, ExternalLink,
} from "lucide-react";

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
  items: GalleryItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  graduation: "Graduation", events: "Events", campus: "Campus Life",
  sports: "Sports", research: "Research", international: "International", other: "Other",
};

const CATEGORY_COLOURS: Record<string, string> = {
  graduation: "bg-amber-100 text-amber-800", events: "bg-blue-100 text-blue-800",
  campus: "bg-green-100 text-green-800", sports: "bg-orange-100 text-orange-800",
  research: "bg-purple-100 text-purple-800", international: "bg-teal-100 text-teal-800",
  other: "bg-gray-100 text-gray-700",
};

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" });
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
}

function Lightbox({ items, index, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(index);
  const item = items[current];

  const prev = useCallback(() => setCurrent(i => (i > 0 ? i - 1 : items.length - 1)), [items.length]);
  const next = useCallback(() => setCurrent(i => (i < items.length - 1 ? i + 1 : 0)), [items.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      data-testid="lightbox"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        data-testid="lightbox-close"
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {current + 1} / {items.length}
      </div>

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          data-testid="lightbox-prev"
          className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
      )}

      {/* Media */}
      <div
        className="max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        {item.type === "video" && item.youtube_id ? (
          <div className="w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${item.youtube_id}?autoplay=1`}
              title={item.title ?? "Video"}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <img
            src={item.media_url ?? ""}
            alt={item.title ?? ""}
            className="max-h-[75vh] max-w-full object-contain rounded-lg"
          />
        )}
        {(item.title || item.caption) && (
          <div className="text-center mt-4 text-white">
            {item.title && <p className="font-semibold">{item.title}</p>}
            {item.caption && <p className="text-white/60 text-sm mt-1">{item.caption}</p>}
          </div>
        )}
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next(); }}
          data-testid="lightbox-next"
          className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GalleryAlbumPage() {
  const [, params] = useRoute("/gallery/:slug");
  const slug = params?.slug ?? "";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ data: GalleryAlbum }>({
    queryKey: ["gallery-album", slug],
    queryFn: () => fetch(`/api/gallery/albums/${slug}`).then(r => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  const album = data?.data;
  const items = album?.items ?? [];
  const imageItems = items.filter(i => i.type === "image");
  const videoItems = items.filter(i => i.type === "video");

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <Camera className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h1 className="font-serif text-2xl text-gray-700 mb-2">Album Not Found</h1>
        <p className="text-gray-500 mb-6">This gallery album could not be found.</p>
        <Link href="/gallery" className="text-primary font-medium hover:underline">Back to Gallery</Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={`${album.title} | Media Gallery | KAFU`}
        description={album.description ?? `Photos and videos from ${album.title}`}
      />

      {/* Hero */}
      <section
        className="relative bg-primary text-primary-foreground py-20 overflow-hidden"
        style={album.cover_image_url ? {
          backgroundImage: `url(${album.cover_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } : {}}
      >
        {album.cover_image_url && <div className="absolute inset-0 bg-primary/80" />}
        <div className="relative max-w-6xl mx-auto px-4">
          <Link
            href="/gallery"
            data-testid="back-to-gallery"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Albums
          </Link>
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLOURS[album.category] ?? CATEGORY_COLOURS.other}`}>
              {CATEGORY_LABELS[album.category] ?? album.category}
            </span>
            {album.album_date && (
              <span className="text-white/60 text-sm">{formatDate(album.album_date)}</span>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{album.title}</h1>
          {album.description && (
            <p className="text-white/80 text-lg max-w-2xl">{album.description}</p>
          )}
          {/* Counts */}
          <div className="flex gap-6 mt-6">
            {imageItems.length > 0 && (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Camera className="w-4 h-4" />
                {imageItems.length} {imageItems.length === 1 ? "photo" : "photos"}
              </div>
            )}
            {videoItems.length > 0 && (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Play className="w-4 h-4" />
                {videoItems.length} {videoItems.length === 1 ? "video" : "videos"}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/gallery" className="hover:text-primary">Gallery</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900">{album.title}</span>
        </div>
      </div>

      {/* Items Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No items in this album yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="gallery-grid">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                data-testid={`gallery-item-${item.id}`}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {item.type === "video" ? (
                  <>
                    <img
                      src={item.thumbnail_url ?? `https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`}
                      alt={item.title ?? "Video thumbnail"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-primary ml-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.media_url ?? ""}
                    alt={item.title ?? ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium text-left line-clamp-1">{item.title}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Navigation to other albums */}
      <section className="border-t bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/gallery" data-testid="gallery-back-bottom" className="text-primary font-medium hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </Link>
          <a
            href={`https://kafu.ac.ke`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            KAFU Website <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>
    </>
  );
}
