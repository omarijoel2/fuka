import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Save, RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Palette, Image, Type, Download } from "lucide-react";

interface BrandingConfig {
  logo_primary_url: string;
  logo_white_url: string;
  logo_alt: string;
  favicon_url: string;
  tagline: string;
  site_description: string;
  primary_color: string;
  gold_color: string;
  white_color: string;
  dark_color: string;
  logo_full_color_url: string;
  logo_reversed_url: string;
  logo_gold_url: string;
  logo_mono_url: string;
  logo_icon_url: string;
  brand_guidelines_url: string;
}

const DEFAULTS: BrandingConfig = {
  logo_primary_url:     "/imgs/logo-updated.png",
  logo_white_url:       "/imgs/logo-updated.png",
  logo_alt:             "Kaimosi Friends University",
  favicon_url:          "/favicon.ico",
  tagline:              "Spring of Knowledge",
  site_description:     "A Quaker-founded public university established in 2014, committed to truth, service, and academic excellence.",
  primary_color:        "#1A5C38",
  gold_color:           "#C9A227",
  white_color:          "#FFFFFF",
  dark_color:           "#111827",
  logo_full_color_url:  "#",
  logo_reversed_url:    "#",
  logo_gold_url:        "#",
  logo_mono_url:        "#",
  logo_icon_url:        "#",
  brand_guidelines_url: "#",
};

function apiBase() {
  return (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
}

function buildHeaders(token: string | null) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="sm:w-52 shrink-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, testid,
}: { value: string; onChange: (v: string) => void; placeholder?: string; testid: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid={testid}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
    />
  );
}

function TextareaInput({
  value, onChange, rows = 2, testid,
}: { value: string; onChange: (v: string) => void; rows?: number; testid: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      data-testid={testid}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
    />
  );
}

function ColorInput({
  value, onChange, testid,
}: { value: string; onChange: (v: string) => void; testid: string }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`${testid}-picker`}
        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#1A5C38"
        data-testid={testid}
        className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      <div className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: value }} />
    </div>
  );
}

function LogoPreview({ url, bg, label }: { url: string; bg: string; label: string }) {
  const [errored, setErrored] = useState(false);
  useEffect(() => { setErrored(false); }, [url]);
  return (
    <div className={`rounded-xl overflow-hidden border border-gray-100 ${bg}`}>
      <div className="h-20 flex items-center justify-center px-4">
        {errored || !url || url === "#" ? (
          <span className="text-xs text-gray-400 italic">No preview</span>
        ) : (
          <img
            src={url}
            alt={label}
            className={`h-10 object-contain ${bg.includes("1A5C38") || bg.includes("primary") ? "brightness-0 invert" : ""}`}
            onError={() => setErrored(true)}
          />
        )}
      </div>
      <p className="text-center text-xs text-gray-500 pb-2">{label}</p>
    </div>
  );
}

export default function BrandingSettingsPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<BrandingConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase()}/api/admin/site-config/branding`, { headers: buildHeaders(token) })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object" && !data.message) {
          setForm({ ...DEFAULTS, ...data });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  function set<K extends keyof BrandingConfig>(key: K, value: BrandingConfig[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch(`${apiBase()}/api/admin/site-config/branding`, {
        method: "PUT",
        headers: buildHeaders(token),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("success");
      setStatusMsg("Branding settings saved. Changes will appear on the website immediately.");
    } catch {
      setStatus("error");
      setStatusMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the university's logo URLs, tagline, colours, and downloadable brand assets.
            Changes are reflected site-wide immediately.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="branding-save"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {status !== "idle" && (
        <div
          data-testid="branding-status"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
            status === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {statusMsg}
        </div>
      )}

      {/* ── Logo & Identity ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Image className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-gray-900">Logo & Identity</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <LogoPreview url={form.logo_primary_url} bg="bg-gray-50" label="Primary logo" />
          <LogoPreview url={form.logo_white_url} bg="bg-[#1A5C38]" label="White / reversed" />
        </div>

        <FieldRow label="Primary logo URL" hint="Used in navbar and page headers. Must be accessible.">
          <TextInput
            value={form.logo_primary_url}
            onChange={(v) => set("logo_primary_url", v)}
            placeholder="/imgs/logo-updated.png"
            testid="branding-logo-primary-url"
          />
        </FieldRow>

        <FieldRow label="White logo URL" hint="For use on dark/green backgrounds (footer). Can be same file as primary.">
          <TextInput
            value={form.logo_white_url}
            onChange={(v) => set("logo_white_url", v)}
            placeholder="/imgs/logo-updated.png"
            testid="branding-logo-white-url"
          />
        </FieldRow>

        <FieldRow label="Logo alt text" hint="Screen reader description for the logo image.">
          <TextInput
            value={form.logo_alt}
            onChange={(v) => set("logo_alt", v)}
            placeholder="Kaimosi Friends University"
            testid="branding-logo-alt"
          />
        </FieldRow>

        <FieldRow label="Favicon URL" hint="Browser tab icon. Typically /favicon.ico">
          <TextInput
            value={form.favicon_url}
            onChange={(v) => set("favicon_url", v)}
            placeholder="/favicon.ico"
            testid="branding-favicon-url"
          />
        </FieldRow>
      </section>

      {/* ── Brand Voice ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Type className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-gray-900">Brand Voice</h2>
        </div>

        <FieldRow label="Brand tagline" hint="The institutional motto shown in the navbar and footer (e.g. Spring of Knowledge).">
          <TextInput
            value={form.tagline}
            onChange={(v) => set("tagline", v)}
            placeholder="Spring of Knowledge"
            testid="branding-tagline"
          />
        </FieldRow>

        <FieldRow label="Site description" hint="Short brand description shown in the footer and as default SEO fallback.">
          <TextareaInput
            value={form.site_description}
            onChange={(v) => set("site_description", v)}
            rows={3}
            testid="branding-site-description"
          />
        </FieldRow>
      </section>

      {/* ── Colour Palette ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-gray-900">Colour Palette</h2>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          These are the official brand colour reference values displayed on the public Branding page.
          Changing them here updates the reference only — site colours are set in the design system.
        </p>

        <FieldRow label="Primary green" hint="Forest Green — main brand colour.">
          <ColorInput value={form.primary_color} onChange={(v) => set("primary_color", v)} testid="branding-primary-color" />
        </FieldRow>

        <FieldRow label="Gold / accent" hint="KAFU Gold — used for accents and highlights.">
          <ColorInput value={form.gold_color} onChange={(v) => set("gold_color", v)} testid="branding-gold-color" />
        </FieldRow>

        <FieldRow label="White" hint="Contrast colour for dark backgrounds.">
          <ColorInput value={form.white_color} onChange={(v) => set("white_color", v)} testid="branding-white-color" />
        </FieldRow>

        <FieldRow label="Dark / body text" hint="Used for body text and dark UI elements.">
          <ColorInput value={form.dark_color} onChange={(v) => set("dark_color", v)} testid="branding-dark-color" />
        </FieldRow>
      </section>

      {/* ── Download Assets ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-2">
          <Download className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-gray-900">Downloadable Logo Assets</h2>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          URLs for the downloadable logo files shown on the public Branding Resources page.
          Set to <code className="bg-gray-100 px-1 rounded">#</code> to disable a download link.
        </p>

        {([
          { key: "logo_full_color_url",  label: "Full colour logo",   hint: "Primary full-colour version (SVG/PNG)." },
          { key: "logo_reversed_url",    label: "Reversed (white)",   hint: "White variant for dark backgrounds." },
          { key: "logo_gold_url",        label: "Gold variant",       hint: "Gold version for formal use." },
          { key: "logo_mono_url",        label: "Monochrome black",   hint: "Single-colour for print (SVG/PDF)." },
          { key: "logo_icon_url",        label: "Mark / icon only",   hint: "Standalone crest (SVG/PNG/ICO)." },
          { key: "brand_guidelines_url", label: "Brand guidelines",   hint: "PDF brand guidelines document." },
        ] as { key: keyof BrandingConfig; label: string; hint: string }[]).map(({ key, label, hint }) => (
          <FieldRow key={key} label={label} hint={hint}>
            <div className="flex items-center gap-2">
              <TextInput
                value={form[key] as string}
                onChange={(v) => set(key, v)}
                placeholder="https://kafu.ac.ke/downloads/..."
                testid={`branding-${key}`}
              />
              {(form[key] as string) && (form[key] as string) !== "#" && (
                <a
                  href={form[key] as string}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`branding-${key}-open`}
                  className="shrink-0 text-gray-400 hover:text-primary transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </FieldRow>
        ))}
      </section>

      {/* Save footer */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          data-testid="branding-save-bottom"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
