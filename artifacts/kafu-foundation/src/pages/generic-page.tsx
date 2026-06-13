import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import NotFound from "@/pages/not-found";

interface PageData {
  title: string;
  summary: string | null;
  body: string | null;
  seo_meta?: { title?: string; description?: string; keywords?: string } | null;
  updated_at?: string | null;
}

export default function GenericPage() {
  const params = useParams();
  const slug = params.slug ?? "";

  const { data, isLoading, isError } = useQuery<PageData | null>({
    queryKey: ["generic-page", slug],
    queryFn: async () => {
      const res = await fetch(`/api/pages/${slug}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to load page");
      const json = await res.json();
      return (json?.data ?? null) as PageData | null;
    },
    enabled: slug.length > 0,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32" data-testid="page-loading">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center" data-testid="page-error">
        <h1 className="font-serif text-2xl text-primary mb-2">Unable to load this page</h1>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  if (!data) {
    return <NotFound />;
  }

  const seo = data.seo_meta ?? {};
  const metaTitle = (seo.title && seo.title.trim()) || data.title;

  return (
    <article className="flex-1" data-testid="generic-page">
      <Helmet>
        <title>{metaTitle} — KAFU</title>
        {seo.description ? <meta name="description" content={seo.description} /> : null}
        {seo.keywords ? <meta name="keywords" content={seo.keywords} /> : null}
      </Helmet>

      <header className="bg-primary text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="font-serif text-3xl md:text-4xl font-bold" data-testid="page-title">
            {data.title}
          </h1>
          {data.summary ? (
            <p className="mt-4 text-base md:text-lg text-white/85 max-w-2xl" data-testid="page-summary">
              {data.summary}
            </p>
          ) : null}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {data.body && data.body.trim().length > 0 ? (
          <div
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary"
            data-testid="page-body"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }}
          />
        ) : (
          <p className="text-gray-500" data-testid="page-empty">
            This page has no content yet.
          </p>
        )}
      </div>
    </article>
  );
}
