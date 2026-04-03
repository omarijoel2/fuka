import { useNews } from "@/lib/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

export default function News() {
  const { data: news, isLoading } = useNews();

  const featured = news?.find(n => n.featured);
  const rest = news?.filter(n => n.id !== featured?.id) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Latest News</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Stay updated with the latest announcements, research breakthroughs, and campus events at KAFU.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-12">
            <Skeleton className="w-full h-[400px] rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <div className="mb-16 bg-card rounded-2xl overflow-hidden border shadow-sm flex flex-col md:flex-row group" data-testid={`news-featured-${featured.id}`}>
                {featured.imageUrl && (
                  <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <img 
                      src={featured.imageUrl} 
                      alt={featured.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {featured.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                    {featured.summary}
                  </p>
                  <button className="text-primary font-bold text-left hover:text-accent uppercase text-sm tracking-wide transition-colors">
                    Read Full Story →
                  </button>
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map(article => (
                <div key={article.id} className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md group flex flex-col" data-testid={`news-card-${article.id}`}>
                  {article.imageUrl && (
                    <div className="h-48 overflow-hidden bg-muted shrink-0">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                      <button className="text-primary text-sm font-medium hover:text-accent">Read →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
