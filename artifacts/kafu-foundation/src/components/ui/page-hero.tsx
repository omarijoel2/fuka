import React from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PHOTO =
  "/imgs/campus-main.jpg";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  photo?: string;
  breadcrumb?: Crumb[];
  align?: "left" | "center";
  children?: React.ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  photo = DEFAULT_PHOTO,
  breadcrumb,
  align = "left",
  children,
  className,
}: PageHeroProps) {
  const center = align === "center";

  return (
    <div
      className={cn(
        "relative bg-primary text-primary-foreground overflow-hidden",
        className
      )}
    >
      {/* Background photo */}
      <img
        src={photo}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: "brightness(0.22)" }}
      />

      {/* Gradient — strong on left, fading right for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/35" />

      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-20 md:pt-20 md:pb-24">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            className={cn(
              "flex flex-wrap items-center gap-1 text-xs text-primary-foreground/55 mb-6",
              center && "justify-center"
            )}
          >
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3 h-3 opacity-40" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary-foreground/90 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary-foreground/80">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-[#C9A227] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              {eyebrow}
            </p>
          )}

          {/* Gold accent bar */}
          <div
            className={cn(
              "h-[3px] w-14 bg-[#C9A227] mb-5 rounded-full",
              center && "mx-auto"
            )}
          />

          {/* Title */}
          <h1
            className={cn(
              "font-serif font-bold leading-[1.1] text-white mb-5",
              "text-5xl md:text-6xl lg:text-[4.5rem]"
            )}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={cn(
                "text-primary-foreground/80 text-lg md:text-xl leading-relaxed",
                center ? "max-w-2xl mx-auto" : "max-w-2xl"
              )}
            >
              {subtitle}
            </p>
          )}

          {/* Extra slot — CTAs, download buttons, etc. */}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>

      {/* Diagonal bottom edge — white triangle cutaway at bottom-right */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
        <div
          className="absolute inset-0 bg-background"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
      </div>
    </div>
  );
}
