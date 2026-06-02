import React, { useState } from "react";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { Palette, Download, Copy, Check, Type, Image } from "lucide-react";
import { useBranding, BRANDING_DEFAULTS } from "@/lib/api-hooks";

interface ColourSwatch {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string;
  usage: string;
}

interface FontSpec {
  name: string;
  role: string;
  weights: string[];
  usage: string;
  source: string;
}

interface LogoVariant {
  id: string;
  name: string;
  description: string;
  preview_bg: string;
  file_url: string;
  format: string;
}

const COLOURS: ColourSwatch[] = [
  { name: "KAFU Forest Green", hex: "#1A5C38", rgb: "26, 92, 56", cmyk: "72, 0, 39, 64", pantone: "Pantone 349 C", usage: "Primary brand colour. Used for headers, CTAs, navigation, and key UI elements." },
  { name: "KAFU Gold", hex: "#C9A227", rgb: "201, 162, 39", cmyk: "0, 19, 81, 21", pantone: "Pantone 7752 C", usage: "Accent and highlight colour. Used for decorative elements, awards, and emphasis." },
  { name: "KAFU White", hex: "#FFFFFF", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", pantone: "White", usage: "Background and contrast colour. Used on dark backgrounds for text and logo." },
  { name: "KAFU Dark", hex: "#111827", rgb: "17, 24, 39", cmyk: "56, 38, 0, 85", pantone: "Pantone Black 6 C", usage: "Body text and dark backgrounds. Provides strong contrast for readability." },
  { name: "KAFU Light Grey", hex: "#F9FAFB", rgb: "249, 250, 251", cmyk: "1, 0, 0, 2", pantone: "Pantone 649 C", usage: "Page backgrounds and section dividers. Creates visual breathing space." },
];

const FONTS: FontSpec[] = [
  { name: "Playfair Display", role: "Display / Headings", weights: ["400 Regular", "600 SemiBold", "700 Bold", "800 ExtraBold"], usage: "Used for all headings (H1–H4), hero titles, section headers, and page titles. Conveys academic authority and tradition.", source: "Google Fonts" },
  { name: "Inter", role: "Body / UI", weights: ["400 Regular", "500 Medium", "600 SemiBold", "700 Bold"], usage: "Used for body text, navigation, buttons, labels, captions, and all UI copy. Clean and highly legible at all sizes.", source: "Google Fonts" },
];

const LOGOS: LogoVariant[] = [
  { id: "logo-full-colour", name: "Full Colour (Primary)", description: "Primary logo on white background. Use wherever possible.", preview_bg: "bg-white", file_url: "#", format: "SVG, PNG" },
  { id: "logo-reversed-white", name: "Reversed White", description: "White logo for use on Forest Green or dark backgrounds.", preview_bg: "bg-[#1A5C38]", file_url: "#", format: "SVG, PNG" },
  { id: "logo-gold", name: "Gold Variant", description: "Gold logo for use on white or light backgrounds in formal contexts.", preview_bg: "bg-white", file_url: "#", format: "SVG, PNG" },
  { id: "logo-monochrome", name: "Monochrome Black", description: "Single-colour black logo for single-colour print applications.", preview_bg: "bg-white", file_url: "#", format: "SVG, PDF" },
  { id: "logo-icon-only", name: "Mark / Icon Only", description: "Standalone crest/mark for social media avatars and favicon use.", preview_bg: "bg-white", file_url: "#", format: "SVG, PNG, ICO" },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={handleCopy}
      data-testid={`copy-${label.replace(/\s/g, "-").toLowerCase()}`}
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export default function MediaBrandingPage() {
  const { data: branding } = useBranding();
  const b = branding ?? BRANDING_DEFAULTS;

  const LOGOS_CMS: LogoVariant[] = [
    { id: "logo-full-colour",   name: "Full Colour (Primary)",  description: "Primary logo on white background. Use wherever possible.",                                    preview_bg: "bg-white",          file_url: b.logo_full_color_url,  format: "SVG, PNG" },
    { id: "logo-reversed-white", name: "Reversed White",        description: "White logo for use on Forest Green or dark backgrounds.",                                      preview_bg: "bg-[#1A5C38]",      file_url: b.logo_reversed_url,    format: "SVG, PNG" },
    { id: "logo-gold",          name: "Gold Variant",           description: "Gold logo for use on white or light backgrounds in formal contexts.",                          preview_bg: "bg-white",          file_url: b.logo_gold_url,        format: "SVG, PNG" },
    { id: "logo-monochrome",    name: "Monochrome Black",       description: "Single-colour black logo for single-colour print applications.",                               preview_bg: "bg-white",          file_url: b.logo_mono_url,        format: "SVG, PDF" },
    { id: "logo-icon-only",     name: "Mark / Icon Only",       description: "Standalone crest/mark for social media avatars and favicon use.",                              preview_bg: "bg-white",          file_url: b.logo_icon_url,        format: "SVG, PNG, ICO" },
  ];

  return (
    <>
      <SeoHead
        title="Branding Resources | Kaimosi Friends University"
        description="Official KAFU branding resources — logos, colour palette, typography guidelines, and brand usage standards."
      />

      <PageHero
        eyebrow="Media"
        title="Branding Resources"
        subtitle="Official logos, colour palette, typography, and usage guidelines for the KAFU brand identity."
        photo="/images/uploads/campus-main.jpg"
        align="left"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Media", href: "/media" }, { label: "Branding" }]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Logo Downloads */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Image className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Logo Package</h2>
              <p className="text-sm text-gray-500">Use only approved logo files. Do not distort, recolour, or alter the logo.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOGOS_CMS.map(logo => (
              <div key={logo.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" data-testid={`logo-card-${logo.id}`}>
                <div className={`h-32 flex items-center justify-center ${logo.preview_bg}`}>
                  <img
                    src={b.logo_primary_url}
                    alt={logo.name}
                    className={`h-12 w-auto object-contain ${logo.preview_bg === "bg-[#1A5C38]" ? "brightness-0 invert" : ""}`}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{logo.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{logo.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Formats: {logo.format}</p>
                  <a
                    href={logo.file_url}
                    data-testid={`logo-download-${logo.id}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Colour Palette */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Colour Palette</h2>
              <p className="text-sm text-gray-500">Official brand colours with HEX, RGB, CMYK, and Pantone references.</p>
            </div>
          </div>
          <div className="space-y-4">
            {COLOURS.map(c => (
              <div key={c.hex} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row overflow-hidden" data-testid={`colour-swatch-${c.hex.replace("#", "")}`}>
                <div className="w-full sm:w-24 h-16 sm:h-auto flex-shrink-0" style={{ backgroundColor: c.hex }} />
                <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{c.usage}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs font-mono shrink-0">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-sans">HEX</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700">{c.hex}</span>
                        <CopyButton text={c.hex} label={`hex-${c.hex}`} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-sans">RGB</span>
                      <span className="text-gray-700">{c.rgb}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-sans">CMYK</span>
                      <span className="text-gray-700">{c.cmyk}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-sans">Pantone</span>
                      <span className="text-gray-700">{c.pantone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Type className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Typography</h2>
              <p className="text-sm text-gray-500">KAFU's official typefaces and usage guidelines.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FONTS.map(f => (
              <div key={f.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" data-testid={`font-card-${f.name.replace(/\s/g, "-").toLowerCase()}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: f.name }}>{f.name}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5 uppercase tracking-wide">{f.role}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{f.source}</span>
                </div>
                <p className="text-4xl font-serif mb-4 leading-tight" style={{ fontFamily: f.name, color: "#1A5C38" }}>Aa Bb Cc</p>
                <p className="text-xs text-gray-500 mb-3">{f.usage}</p>
                <div className="flex flex-wrap gap-2">
                  {f.weights.map(w => (
                    <span key={w} className="text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Rules */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Brand Usage Guidelines</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-green-700 mb-2">Permitted</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use approved logo files as provided</li>
                <li>Maintain clear space around the logo (equal to the cap height of the "K")</li>
                <li>Use the reversed (white) logo on dark green or photographic backgrounds</li>
                <li>Reproduce colours using approved HEX / Pantone references</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-red-700 mb-2">Not Permitted</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Stretching, squashing, or rotating the logo</li>
                <li>Recolouring the logo outside approved variants</li>
                <li>Placing the logo on busy photographic backgrounds without contrast</li>
                <li>Using the logo below 24px height in digital or 15mm in print</li>
                <li>Creating unofficial variations or combining with other logos without approval</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            For approvals, customisation requests, or co-branding queries, contact the Communications Office at{" "}
            <a href="mailto:communications@kafu.ac.ke" className="text-primary hover:underline font-medium" data-testid="branding-contact-email">communications@kafu.ac.ke</a>.
          </p>
        </section>

      </div>
    </>
  );
}
