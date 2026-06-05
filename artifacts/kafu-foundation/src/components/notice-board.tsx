import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, AlertCircle, Megaphone, BookOpen, ArrowRight, Bell } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  description: string | null;
  category: "memo" | "circular" | "notice" | "policy" | "announcement";
  file_url: string | null;
  file_name: string | null;
  file_size: string | null;
  cover_image_url: string | null;
  issued_date: string;
  is_active: boolean;
}

function useNotices(limit = 6) {
  return useQuery<Notice[]>({
    queryKey: ["notices", limit],
    queryFn: () => fetch(`/api/notices?limit=${limit}`).then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });
}

const CATEGORY_META: Record<
  Notice["category"],
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  memo: {
    label: "Memo",
    icon: <FileText className="w-3.5 h-3.5" />,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  circular: {
    label: "Circular",
    icon: <Bell className="w-3.5 h-3.5" />,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  notice: {
    label: "Notice",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
  policy: {
    label: "Policy",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  announcement: {
    label: "Announcement",
    icon: <Megaphone className="w-3.5 h-3.5" />,
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
};

export function NoticeBoardSection() {
  const { data: notices, isLoading } = useNotices(6);

  return (
    <section className="py-12 md:py-16 bg-white border-y" data-testid="section-notice-board">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">
              Notice Board
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Official memos, circulars, and institutional announcements
            </p>
          </div>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white self-start sm:self-auto" asChild data-testid="link-all-notices">
            <Link href="/notices">
              All Notices <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !notices || notices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No notices at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notices.map((notice) => {
              const meta = CATEGORY_META[notice.category] ?? CATEGORY_META.notice;
              return (
                <div
                  key={notice.id}
                  className="group flex items-start gap-0 rounded-lg border bg-card hover:border-primary/30 hover:shadow-sm transition-all overflow-hidden"
                  data-testid={`notice-item-${notice.id}`}
                >
                  {/* Cover image strip */}
                  {notice.cover_image_url && (
                    <div className="w-20 shrink-0 self-stretch overflow-hidden">
                      <img
                        src={notice.cover_image_url}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
                    {/* Category badge */}
                    <div className="shrink-0 mt-0.5">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-semibold ${meta.color} ${meta.bg}`}>
                        {meta.icon}
                        {meta.label}
                      </div>
                    </div>

                    {/* Title + date */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {notice.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notice.issued_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Download link */}
                    {notice.file_url && (
                      <a
                        href={notice.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-0.5"
                        data-testid={`notice-download-${notice.id}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        {notice.file_size ?? "Download"}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
