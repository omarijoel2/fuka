import React, { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Calendar, User, Tag, ChevronRight, ArrowLeft, Share2, Images, ChevronDown, ChevronUp,
} from "lucide-react";
import { SeoHead, SITE_URL, ORG_JSONLD } from "@/components/seo-head";
import { resolveStorageUrl, useNews, useArticle } from "@/lib/api-hooks";
import type { ArticleBlock } from "@/lib/api-types";

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function textLength(blocks: ArticleBlock[]): number {
  return blocks.reduce((acc, b) => {
    if (b.type === "paragraph" || b.type === "heading" || b.type === "quote") {
      const raw = b.content ?? "";
      const text = raw.replace(/<[^>]*>/g, "");
      return acc + text.length;
    }
    return acc;
  }, 0);
}

/* ── Block renderer ─────────────────────────────────────────────────────────── */
function BlockNode({ block, index }: { block: ArticleBlock; index: number }) {
  switch (block.type) {
    case "paragraph":
      return (
        <div
          key={block.id}
          data-testid={`article-block-paragraph-${index}`}
          className="prose prose-lg max-w-none text-foreground leading-relaxed
            [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
            [&_li]:text-muted-foreground [&_li]:mb-1
            [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: block.content ?? "" }}
        />
      );

    case "heading": {
      const lvl = block.level ?? 2;
      if (lvl === 3) {
        return (
          <h3
            key={block.id}
            data-testid={`article-block-h3-${index}`}
            className="text-xl font-serif font-bold text-foreground mt-10 mb-3 leading-snug"
          >
            {block.content}
          </h3>
        );
      }
      return (
        <h2
          key={block.id}
          data-testid={`article-block-h2-${index}`}
          className="text-2xl font-serif font-bold text-foreground mt-10 mb-4 leading-snug border-b pb-2"
        >
          {block.content}
        </h2>
      );
    }

    case "image": {
      const src = resolveStorageUrl(block.url ?? "");
      return (
        <figure
          key={block.id}
          data-testid={`article-block-image-${index}`}
          className="my-8"
        >
          <div className="overflow-hidden rounded-xl bg-muted">
            <img
              src={src}
              alt={block.caption ?? ""}
              className="w-full object-cover max-h-[520px]"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-sm text-center text-muted-foreground italic px-4">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "quote":
      return (
        <blockquote
          key={block.id}
          data-testid={`article-block-quote-${index}`}
          className="border-l-4 border-primary pl-6 my-8 bg-primary/5 py-4 rounded-r-xl"
        >
          <p className="text-lg text-foreground leading-relaxed font-medium italic">
            {block.content}
          </p>
          {block.attribution && (
            <cite className="text-sm text-muted-foreground mt-3 block not-italic font-medium">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );

    default:
      return null;
  }
}

/* ── Read-more threshold ────────────────────────────────────────────────────── */
const VISIBLE_BLOCKS = 4;
const CHAR_THRESHOLD = 1000;

/* ── Page component ─────────────────────────────────────────────────────────── */
export default function ArticleDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [expanded, setExpanded] = useState(false);

  const { data: article, isLoading, isError } = useArticle(slug);

  const { data: allNews } = useNews();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-12 bg-muted rounded w-3/4" />
          <div className="h-72 bg-muted rounded-2xl" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded" style={{ width: `${80 - i * 8}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The article you are looking for could not be found.
        </p>
        <Button asChild data-testid="btn-back-to-news">
          <Link href="/news">Back to News</Link>
        </Button>
      </div>
    );
  }

  /* Read-more logic */
  const blocks = article.blocks ?? [];
  const hasBlocks = blocks.length > 0;
  const needsReadMore =
    hasBlocks &&
    (blocks.length > VISIBLE_BLOCKS || textLength(blocks) > CHAR_THRESHOLD);
  const visibleBlocks =
    needsReadMore && !expanded ? blocks.slice(0, VISIBLE_BLOCKS) : blocks;

  /* Related: latest 3 articles/news */
  const related =
    allNews
      ?.filter((a) => a.slug !== slug)
      .slice(0, 3) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt ?? article.summary,
    image: article.imageUrl ? [article.imageUrl] : undefined,
    author: { "@type": "Person", name: article.author },
    publisher: ORG_JSONLD,
    datePublished: article.date,
    dateModified: article.date,
    url: `${SITE_URL}/articles/${slug}`,
    keywords: article.tags?.join(", "),
    articleSection: article.category,
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SeoHead
        title={article.title}
        description={article.excerpt ?? article.summary}
        image={article.imageUrl ?? undefined}
        path={`/articles/${slug}`}
        type="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
          { name: article.title },
        ]}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb */}
      <div className="border-b bg-secondary/30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/news" className="hover:text-primary transition-colors">News</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-foreground font-medium line-clamp-1 max-w-xs">{article.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Main Article ─────────────────────────────────────────────────── */}
          <article className="lg:col-span-8">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {article.category}
              </span>
              <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Feature Story
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(article.date)}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {article.author}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 leading-snug">
              {article.title}
            </h1>

            {/* Featured image */}
            {article.imageUrl && (
              <div className="relative h-64 md:h-[400px] rounded-2xl overflow-hidden mb-8 bg-muted">
                <img
                  src={resolveStorageUrl(article.imageUrl)}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Summary lead */}
            {(article.excerpt || article.summary) && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-5 italic">
                {article.excerpt ?? article.summary}
              </p>
            )}

            {/* Block content */}
            {hasBlocks ? (
              <div className="space-y-2">
                {visibleBlocks.map((block, i) => (
                  <BlockNode key={block.id ?? i} block={block} index={i} />
                ))}

                {/* Read-more gradient + toggle */}
                {needsReadMore && !expanded && (
                  <div className="relative">
                    <div className="absolute bottom-full left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                    <Button
                      variant="outline"
                      className="w-full mt-4 gap-2"
                      onClick={() => setExpanded(true)}
                      data-testid="btn-read-more"
                    >
                      Continue Reading <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {needsReadMore && expanded && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-muted-foreground gap-2"
                    onClick={() => setExpanded(false)}
                    data-testid="btn-collapse-article"
                  >
                    Show Less <ChevronUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              /* Fallback HTML body */
              article.content && (
                <div
                  className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-4
                    [&_p]:text-muted-foreground [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
                    [&_li]:text-muted-foreground [&_li]:mb-1
                    [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )
            )}

            {/* Gallery album link */}
            {article.gallery_album_slug && (
              <div className="mt-10 p-5 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Images className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Photo Gallery</p>
                  <p className="text-xs text-muted-foreground">
                    Photos from this story are available in the gallery.
                  </p>
                </div>
                <Button asChild size="sm" variant="outline" data-testid="btn-view-gallery">
                  <Link href={`/gallery/${article.gallery_album_slug}`}>View Gallery</Link>
                </Button>
              </div>
            )}

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full
                      hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button variant="outline" asChild data-testid="btn-back-to-news">
                <Link href="/news">
                  <ArrowLeft className="w-4 h-4 mr-2" /> All News
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                data-testid="btn-share-article"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </article>

          {/* ── Sidebar ──────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Related / Latest */}
            {related.length > 0 && (
              <div className="bg-secondary/40 border rounded-xl p-5">
                <h3 className="font-serif font-bold text-base text-foreground mb-4">Latest News</h3>
                <div className="space-y-4">
                  {related.map((a) => (
                    <Link
                      key={a.id}
                      href={a.content_type === "article" ? `/articles/${a.slug}` : `/news/${a.slug}`}
                      data-testid={`related-news-${a.id}`}
                    >
                      <div className="group">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                          {a.category}
                        </span>
                        <p className="text-sm font-medium text-foreground mt-0.5 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {a.title}
                        </p>
                        <span className="text-xs text-muted-foreground">{formatDate(a.date)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Category links */}
            <div className="bg-secondary/20 border rounded-xl p-5">
              <h3 className="font-serif font-bold text-sm text-foreground mb-3 uppercase tracking-wide">
                Browse by Category
              </h3>
              <div className="space-y-1">
                {["Research & Innovation", "Academic", "Institutional", "Outreach", "Partnerships"].map((cat) => (
                  <Link
                    key={cat}
                    href={`/news?category=${encodeURIComponent(cat)}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                    data-testid={`category-link-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Gallery promo */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h3 className="font-serif font-bold text-sm text-foreground mb-2 flex items-center gap-2">
                <Images className="w-4 h-4 text-primary" /> Photo Gallery
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Explore photos from university events, activities, and milestones.
              </p>
              <Button asChild size="sm" variant="outline" className="w-full" data-testid="btn-gallery-promo">
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
