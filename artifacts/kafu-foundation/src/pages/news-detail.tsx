import { Link, useParams } from "wouter";
import { useNewsDetail, useNews } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ChevronRight, ArrowLeft, ArrowRight, Share2, Download } from "lucide-react";
import { SITE_URL, SeoHead, ORG_JSONLD } from "@/components/seo-head";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data: article, isLoading, isError } = useNewsDetail(slug);
  const { data: allNews } = useNews();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-12 bg-muted rounded w-3/4" />
          <div className="h-72 bg-muted rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-4 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for could not be found.</p>
        <Button asChild><Link href="/news">Back to News</Link></Button>
      </div>
    );
  }

  const related = allNews?.filter((a) => a.id !== article.id && article.related?.includes(a.id)).slice(0, 3) ?? [];

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl ? [article.imageUrl] : undefined,
    author: { "@type": "Person", name: article.author },
    publisher: ORG_JSONLD,
    datePublished: article.date,
    dateModified: article.date,
    url: `${SITE_URL}/news/${slug}`,
    keywords: article.tags?.join(", "),
    articleSection: article.category,
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SeoHead
        title={article.title}
        description={article.excerpt}
        image={article.imageUrl ?? undefined}
        path={`/news/${slug}`}
        type="article"
        breadcrumbs={[{ name: "News", path: "/news" }, { name: article.title }]}
        jsonLd={newsJsonLd}
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
          {/* Main Article */}
          <article className="lg:col-span-8">
            {/* Category + date */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {article.category}
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
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 bg-muted">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Summary */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-5 italic">
              {article.summary}
            </p>

            {/* Body content */}
            <div
              className="prose prose-lg max-w-none text-foreground leading-relaxed space-y-4 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:text-muted-foreground [&_li]:mb-1 [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Attachments */}
            {(() => {
              const attachments = ((article as unknown as Record<string, unknown>).attachments as Array<{ url: string; title: string; type: string }> | undefined) ?? [];
              if (!attachments.length) return null;
              return (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-serif font-bold text-base mb-4 flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" /> Attachments
                  </h3>
                  <div className="space-y-2">
                    {attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                        data-testid={`attachment-${i}`}
                      >
                        <Download className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{att.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto uppercase">{att.type}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share & Back navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button variant="outline" asChild data-testid="btn-back-to-news">
                <Link href="/news">
                  <ArrowLeft className="w-4 h-4 mr-2" /> All News
                </Link>
              </Button>
              <Button variant="ghost" className="text-muted-foreground" onClick={() => navigator.clipboard?.writeText(window.location.href)} data-testid="btn-share-article">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Related Articles */}
            {related.length > 0 && (
              <div className="bg-secondary/40 border rounded-xl p-5">
                <h3 className="font-serif font-bold text-base text-foreground mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {related.map((a) => (
                    <Link key={a.id} href={`/news/${a.slug}`} data-testid={`related-news-${a.id}`}>
                      <div className="group">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{a.category}</span>
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

            {/* Latest News shortcut */}
            <div className="bg-primary text-primary-foreground rounded-xl p-5">
              <h3 className="font-serif font-bold text-base mb-3">Stay Updated</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Browse the latest news, events, and official announcements from KAFU.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 text-sm justify-start" asChild>
                  <Link href="/news"><ArrowRight className="w-4 h-4 mr-2" /> All News</Link>
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 text-sm justify-start" asChild>
                  <Link href="/events"><ArrowRight className="w-4 h-4 mr-2" /> Events Calendar</Link>
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 text-sm justify-start" asChild>
                  <Link href="/announcements"><ArrowRight className="w-4 h-4 mr-2" /> Announcements</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
