import { Link } from "wouter";
import { useAlumniStory } from "@/lib/api-hooks";
import { ChevronRight, Quote, ArrowLeft } from "lucide-react";
import { SeoHead } from "@/components/seo-head";

function toEmbed(url?: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}

export default function AlumniStoryPage({ slug }: { slug: string }) {
  const { data: s, isLoading, isError } = useAlumniStory(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError || !s) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Quote className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold mb-2">Story not found</h1>
        <Link href="/alumni" className="text-primary font-medium hover:underline" data-testid="link-back-alumni">
          Back to Alumni
        </Link>
      </div>
    );
  }

  const embed = toEmbed(s.video_url);

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title={`${s.title} — KAFU Alumni Stories`}
        description={s.seo_meta?.description ?? s.summary}
        path={`/alumni-stories/${s.slug}`}
        breadcrumbs={[{ name: "Alumni", path: "/alumni" }, { name: s.title, path: `/alumni-stories/${s.slug}` }]}
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <Link href="/alumni" className="hover:underline">Alumni</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="truncate">{s.title}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">{s.title}</h1>
        {(s.alumni_name || s.programme || s.graduation_year) && (
          <p className="text-muted-foreground mb-6">
            {s.alumni_name}
            {s.programme ? ` · ${s.programme}` : ""}
            {s.graduation_year ? ` · Class of ${s.graduation_year}` : ""}
          </p>
        )}

        {embed ? (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-black">
            <iframe src={embed} title={s.title} className="w-full h-full" allowFullScreen data-testid="story-video" />
          </div>
        ) : s.photo_url ? (
          <img src={s.photo_url} alt={s.title} className="w-full rounded-2xl mb-8 object-cover" />
        ) : null}

        <p className="text-lg text-foreground font-medium leading-relaxed mb-6 border-l-4 border-secondary pl-4">{s.summary}</p>

        {s.body && (
          <div className="prose prose-stone max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
            {s.body}
          </div>
        )}

        <Link href="/alumni" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline mt-10" data-testid="link-back">
          <ArrowLeft className="w-4 h-4" /> Back to all alumni
        </Link>
      </div>
    </div>
  );
}
