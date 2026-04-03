import React, { useEffect, useState, useCallback } from "react";
import { apiGetSiteSettings, apiPutSiteSettings } from "@/lib/api";
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

type Tab = "contact" | "stats" | "admissions" | "homepage";

// ─── Generic helpers ─────────────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-muted-foreground mb-1">{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text", "data-testid": dtid }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; "data-testid"?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      data-testid={dtid}
    />
  );
}

function SaveBar({ saving, saved, onSave }: { saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className={`text-xs font-medium transition-colors ${saved ? "text-emerald-600" : "text-transparent"}`}>
        Settings saved successfully.
      </span>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
        data-testid="btn-save-settings"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

// ─── Contact Settings ─────────────────────────────────────────────────────────

interface EmailEntry { label: string; address: string }
interface PortalEntry { name: string; url: string }
interface SocialEntry { platform: string; url: string }

interface ContactData {
  institution: string;
  abbreviation: string;
  address: string;
  phone: string;
  website: string;
  emails: EmailEntry[];
  portals: PortalEntry[];
  social_media: SocialEntry[];
}

const DEFAULT_CONTACT: ContactData = {
  institution: "Kaimosi Friends University",
  abbreviation: "KAFU",
  address: "P.O BOX 385 – 50309, Kaimosi, Kenya",
  phone: "+254 777 373 633",
  website: "https://kafu.ac.ke",
  emails: [
    { label: "Vice Chancellor", address: "vc@kafu.ac.ke" },
    { label: "General Enquiries", address: "info@kafu.ac.ke" },
  ],
  portals: [
    { name: "Student Portal", url: "https://portal.kafu.ac.ke" },
    { name: "E-Learning (ODL)", url: "https://elearning.kafu.ac.ke" },
  ],
  social_media: [
    { platform: "Facebook", url: "https://www.facebook.com/KaimosiUniversity" },
    { platform: "Twitter", url: "https://twitter.com/KaimosiUni" },
    { platform: "YouTube", url: "https://www.youtube.com/@kaimosifrienduniversity" },
  ],
};

function ContactTab() {
  const [data, setData] = useState<ContactData>(DEFAULT_CONTACT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetSiteSettings("contact").then((res: any) => {
      if (res?.exists && res?.data?.structured_data) {
        setData({ ...DEFAULT_CONTACT, ...res.data.structured_data });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (key: keyof ContactData, value: unknown) => setData((d) => ({ ...d, [key]: value }));

  const updateEmail = (i: number, field: keyof EmailEntry, v: string) =>
    setData((d) => ({ ...d, emails: d.emails.map((e, idx) => idx === i ? { ...e, [field]: v } : e) }));
  const addEmail = () => setData((d) => ({ ...d, emails: [...d.emails, { label: "", address: "" }] }));
  const removeEmail = (i: number) => setData((d) => ({ ...d, emails: d.emails.filter((_, idx) => idx !== i) }));

  const updatePortal = (i: number, field: keyof PortalEntry, v: string) =>
    setData((d) => ({ ...d, portals: d.portals.map((p, idx) => idx === i ? { ...p, [field]: v } : p) }));
  const addPortal = () => setData((d) => ({ ...d, portals: [...d.portals, { name: "", url: "" }] }));
  const removePortal = (i: number) => setData((d) => ({ ...d, portals: d.portals.filter((_, idx) => idx !== i) }));

  const updateSocial = (i: number, field: keyof SocialEntry, v: string) =>
    setData((d) => ({ ...d, social_media: d.social_media.map((s, idx) => idx === i ? { ...s, [field]: v } : s) }));
  const addSocial = () => setData((d) => ({ ...d, social_media: [...d.social_media, { platform: "", url: "" }] }));
  const removeSocial = (i: number) => setData((d) => ({ ...d, social_media: d.social_media.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true); setSaved(false);
    try { await apiPutSiteSettings("contact", data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-sm text-muted-foreground py-8 text-center">Loading...</div>;

  return (
    <div>
      <SaveBar saving={saving} saved={saved} onSave={save} />

      <div className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Institution Name</Label><Input value={data.institution} onChange={(v) => update("institution", v)} data-testid="input-contact-institution" /></div>
            <div><Label>Abbreviation</Label><Input value={data.abbreviation} onChange={(v) => update("abbreviation", v)} data-testid="input-contact-abbrev" /></div>
          </div>
          <div><Label>Postal Address</Label><Input value={data.address} onChange={(v) => update("address", v)} data-testid="input-contact-address" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Main Phone</Label><Input value={data.phone} onChange={(v) => update("phone", v)} data-testid="input-contact-phone" /></div>
            <div><Label>Website URL</Label><Input value={data.website} onChange={(v) => update("website", v)} data-testid="input-contact-website" /></div>
          </div>
        </div>

        {/* Email addresses */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Email Addresses</h3>
            <button onClick={addEmail} className="flex items-center gap-1 text-xs text-primary hover:underline" data-testid="btn-add-email">
              <Plus className="w-3.5 h-3.5" /> Add Email
            </button>
          </div>
          {data.emails.map((e, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-1"><Label>Label</Label><Input value={e.label} onChange={(v) => updateEmail(i, "label", v)} placeholder="e.g. Vice Chancellor" data-testid={`input-email-label-${i}`} /></div>
              <div className="flex-1"><Label>Email Address</Label><Input value={e.address} onChange={(v) => updateEmail(i, "address", v)} placeholder="email@kafu.ac.ke" data-testid={`input-email-addr-${i}`} /></div>
              <button onClick={() => removeEmail(i)} className="mt-5 text-red-400 hover:text-red-600" data-testid={`btn-remove-email-${i}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {/* Portals */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Online Portals</h3>
            <button onClick={addPortal} className="flex items-center gap-1 text-xs text-primary hover:underline" data-testid="btn-add-portal">
              <Plus className="w-3.5 h-3.5" /> Add Portal
            </button>
          </div>
          {data.portals.map((p, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-1"><Label>Portal Name</Label><Input value={p.name} onChange={(v) => updatePortal(i, "name", v)} placeholder="e.g. Student Portal" data-testid={`input-portal-name-${i}`} /></div>
              <div className="flex-1"><Label>URL</Label><Input value={p.url} onChange={(v) => updatePortal(i, "url", v)} placeholder="https://..." data-testid={`input-portal-url-${i}`} /></div>
              <button onClick={() => removePortal(i)} className="mt-5 text-red-400 hover:text-red-600" data-testid={`btn-remove-portal-${i}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {/* Social media */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Social Media</h3>
            <button onClick={addSocial} className="flex items-center gap-1 text-xs text-primary hover:underline" data-testid="btn-add-social">
              <Plus className="w-3.5 h-3.5" /> Add Platform
            </button>
          </div>
          {data.social_media.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-40"><Label>Platform</Label><Input value={s.platform} onChange={(v) => updateSocial(i, "platform", v)} placeholder="Facebook" data-testid={`input-social-platform-${i}`} /></div>
              <div className="flex-1"><Label>URL</Label><Input value={s.url} onChange={(v) => updateSocial(i, "url", v)} placeholder="https://..." data-testid={`input-social-url-${i}`} /></div>
              <button onClick={() => removeSocial(i)} className="mt-5 text-red-400 hover:text-red-600" data-testid={`btn-remove-social-${i}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stats Settings ───────────────────────────────────────────────────────────

interface StatEntry { label: string; value: number | string }

const DEFAULT_STATS: StatEntry[] = [
  { label: "Schools", value: 5 },
  { label: "Academic Programmes", value: 38 },
  { label: "Years of Excellence", value: 11 },
  { label: "Counties Reached", value: 47 },
];

function StatsTab() {
  const [stats, setStats] = useState<StatEntry[]>(DEFAULT_STATS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetSiteSettings("stats").then((res: any) => {
      if (res?.exists && Array.isArray(res?.data?.structured_data)) {
        setStats(res.data.structured_data);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (i: number, field: keyof StatEntry, v: string) =>
    setStats((s) => s.map((st, idx) => idx === i ? { ...st, [field]: field === "value" ? (isNaN(Number(v)) ? v : Number(v)) : v } : st));
  const add = () => setStats((s) => [...s, { label: "", value: 0 }]);
  const remove = (i: number) => setStats((s) => s.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...stats];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setStats(next);
  };

  const save = async () => {
    setSaving(true); setSaved(false);
    try { await apiPutSiteSettings("stats", stats); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-sm text-muted-foreground py-8 text-center">Loading...</div>;

  return (
    <div>
      <SaveBar saving={saving} saved={saved} onSave={save} />
      <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Homepage Statistics</h3>
            <p className="text-xs text-muted-foreground mt-0.5">These figures appear on the homepage hero and About sections.</p>
          </div>
          <button onClick={add} className="flex items-center gap-1 text-xs text-primary hover:underline" data-testid="btn-add-stat">
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex gap-3 items-center bg-muted/30 rounded-lg p-3">
              <div className="flex flex-col gap-1 mr-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30" data-testid={`btn-stat-up-${i}`}><ChevronUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => move(i, 1)} disabled={i === stats.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30" data-testid={`btn-stat-down-${i}`}><ChevronDown className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex-1">
                <Label>Label</Label>
                <Input value={stat.label} onChange={(v) => update(i, "label", v)} placeholder="e.g. Academic Programmes" data-testid={`input-stat-label-${i}`} />
              </div>
              <div className="w-28">
                <Label>Value</Label>
                <Input value={String(stat.value)} onChange={(v) => update(i, "value", v)} placeholder="0" data-testid={`input-stat-value-${i}`} />
              </div>
              <button onClick={() => remove(i)} className="mt-5 text-red-400 hover:text-red-600" data-testid={`btn-remove-stat-${i}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admissions Settings ──────────────────────────────────────────────────────

interface AdmissionsPathway {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  requirements: string[];
  cta_label: string;
  cta_url: string;
  cta_external: boolean;
}

interface AdmissionsData {
  pathways: AdmissionsPathway[];
  contact_email: string;
  contact_phone: string;
  application_portal: string;
}

const DEFAULT_ADMISSIONS: AdmissionsData = {
  pathways: [
    { id: "undergraduate", title: "Undergraduate", subtitle: "Government Sponsored (KUCCPS) & Direct Entry", description: "Join one of KAFU's 22 undergraduate degree programmes via KUCCPS government placement or direct entry.", requirements: ["Minimum KCSE mean grade of C+ (Plus) or its equivalent", "Valid Kenya National Examinations Council (KNEC) certificate", "National Identity Card or Birth Certificate"], cta_label: "Apply via KUCCPS", cta_url: "https://students.kuccps.net/", cta_external: true },
    { id: "postgraduate", title: "Postgraduate", subtitle: "Masters & Doctoral Programmes", description: "Advance your career through KAFU's research-based and coursework Masters and PhD programmes.", requirements: ["For Masters: A relevant Bachelor's degree (Second Class Honours or above) from a recognized university", "For PhD: A relevant Master's degree from a recognized university", "Official transcripts and two academic referees' letters"], cta_label: "Apply via Student Portal", cta_url: "https://portal.kafu.ac.ke", cta_external: true },
  ],
  contact_email: "admissions@kafu.ac.ke",
  contact_phone: "+254 777 373 633",
  application_portal: "https://portal.kafu.ac.ke",
};

function AdmissionsTab() {
  const [data, setData] = useState<AdmissionsData>(DEFAULT_ADMISSIONS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });
  const [reqInputs, setReqInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    apiGetSiteSettings("admissions").then((res: any) => {
      if (res?.exists && res?.data?.structured_data) {
        const sd = res.data.structured_data;
        setData({ ...DEFAULT_ADMISSIONS, ...(sd.pathways ? sd : { ...DEFAULT_ADMISSIONS, ...sd }) });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updatePathway = (i: number, field: keyof AdmissionsPathway, v: unknown) =>
    setData((d) => ({ ...d, pathways: d.pathways.map((p, idx) => idx === i ? { ...p, [field]: v } : p) }));

  const addReq = (i: number) => {
    const v = reqInputs[i]?.trim();
    if (!v) return;
    const cur = data.pathways[i]?.requirements ?? [];
    updatePathway(i, "requirements", [...cur, v]);
    setReqInputs((r) => ({ ...r, [i]: "" }));
  };
  const removeReq = (pi: number, ri: number) =>
    updatePathway(pi, "requirements", data.pathways[pi].requirements.filter((_, idx) => idx !== ri));

  const addPathway = () => {
    const newP: AdmissionsPathway = { id: `pathway-${Date.now()}`, title: "New Pathway", subtitle: "", description: "", requirements: [], cta_label: "Apply Now", cta_url: "https://portal.kafu.ac.ke", cta_external: true };
    setData((d) => ({ ...d, pathways: [...d.pathways, newP] }));
  };
  const removePathway = (i: number) => setData((d) => ({ ...d, pathways: d.pathways.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true); setSaved(false);
    try { await apiPutSiteSettings("admissions", data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-sm text-muted-foreground py-8 text-center">Loading...</div>;

  return (
    <div>
      <SaveBar saving={saving} saved={saved} onSave={save} />
      <div className="space-y-4">
        {/* Contact / Portal info */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Admissions Contact</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Contact Email</Label><Input value={data.contact_email} onChange={(v) => setData((d) => ({ ...d, contact_email: v }))} data-testid="input-adm-email" /></div>
            <div><Label>Contact Phone</Label><Input value={data.contact_phone} onChange={(v) => setData((d) => ({ ...d, contact_phone: v }))} data-testid="input-adm-phone" /></div>
            <div><Label>Application Portal URL</Label><Input value={data.application_portal} onChange={(v) => setData((d) => ({ ...d, application_portal: v }))} data-testid="input-adm-portal" /></div>
          </div>
        </div>

        {/* Pathways */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Admission Pathways</h3>
          <button onClick={addPathway} className="flex items-center gap-1 text-xs text-primary hover:underline" data-testid="btn-add-pathway">
            <Plus className="w-3.5 h-3.5" /> Add Pathway
          </button>
        </div>

        {data.pathways.map((pathway, i) => (
          <div key={pathway.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded((e) => ({ ...e, [i]: !e[i] }))}
              data-testid={`btn-pathway-toggle-${i}`}
            >
              <div className="text-left">
                <p className="text-sm font-semibold">{pathway.title || "Unnamed Pathway"}</p>
                <p className="text-xs text-muted-foreground">{pathway.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removePathway(i); }} className="text-red-400 hover:text-red-600 p-1" data-testid={`btn-remove-pathway-${i}`}><Trash2 className="w-3.5 h-3.5" /></button>
                {expanded[i] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>

            {expanded[i] && (
              <div className="px-5 pb-5 space-y-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div><Label>Title</Label><Input value={pathway.title} onChange={(v) => updatePathway(i, "title", v)} data-testid={`input-pathway-title-${i}`} /></div>
                  <div><Label>Subtitle</Label><Input value={pathway.subtitle} onChange={(v) => updatePathway(i, "subtitle", v)} data-testid={`input-pathway-subtitle-${i}`} /></div>
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea rows={3} value={pathway.description} onChange={(e) => updatePathway(i, "description", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid={`input-pathway-desc-${i}`} />
                </div>
                <div>
                  <Label>Requirements</Label>
                  <div className="space-y-1.5">
                    {pathway.requirements.map((req, ri) => (
                      <div key={ri} className="flex items-center gap-2">
                        <span className="flex-1 text-xs bg-muted rounded px-2 py-1">{req}</span>
                        <button onClick={() => removeReq(i, ri)} className="text-red-400 hover:text-red-600" data-testid={`btn-remove-req-${i}-${ri}`}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input type="text" value={reqInputs[i] ?? ""} onChange={(e) => setReqInputs((r) => ({ ...r, [i]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addReq(i); } }} placeholder="Add requirement and press Enter" className="flex-1 px-3 py-1.5 rounded-lg border border-border text-xs focus:outline-none" data-testid={`input-req-${i}`} />
                      <button onClick={() => addReq(i)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs" data-testid={`btn-add-req-${i}`}><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>CTA Button Label</Label><Input value={pathway.cta_label} onChange={(v) => updatePathway(i, "cta_label", v)} data-testid={`input-pathway-cta-label-${i}`} /></div>
                  <div><Label>CTA URL</Label><Input value={pathway.cta_url} onChange={(v) => updatePathway(i, "cta_url", v)} data-testid={`input-pathway-cta-url-${i}`} /></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Homepage Settings ────────────────────────────────────────────────────────

interface HomepageData {
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_heading: string;
  about_body: string;
  why_kafu_heading: string;
  why_kafu_items: { title: string; description: string }[];
}

const DEFAULT_HOMEPAGE: HomepageData = {
  hero_title: "Discover Knowledge. Develop Character. Transform Communities.",
  hero_subtitle: "Kaimosi Friends University — rooted in Quaker values, committed to academic excellence, research, and community service in the heart of Western Kenya.",
  hero_cta_primary: "Explore Programmes",
  hero_cta_secondary: "Apply Now",
  about_heading: "A Quaker University with a Global Vision",
  about_body: "Founded in 2013 on the grounds of the historic Friends Africa Mission, Kaimosi Friends University (KAFU) blends its rich heritage with modern academic rigour. Accredited by the Commission for University Education (CUE), KAFU offers programmes across five schools in Education, Business, Technology, Science, and Health Sciences.",
  why_kafu_heading: "Why Choose KAFU?",
  why_kafu_items: [
    { title: "Accredited Programmes", description: "All programmes are CUE-accredited and internationally recognised." },
    { title: "Affordable Education", description: "Competitive fee structures with HELB and scholarship opportunities." },
    { title: "Research & Innovation", description: "Active research centres and Innovation Week driving real-world impact." },
    { title: "Quaker Heritage", description: "Values-based education grounded in integrity, peace, and service." },
  ],
};

function HomepageTab() {
  const [data, setData] = useState<HomepageData>(DEFAULT_HOMEPAGE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetSiteSettings("homepage").then((res: any) => {
      if (res?.exists && res?.data?.structured_data) {
        setData({ ...DEFAULT_HOMEPAGE, ...res.data.structured_data });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (key: keyof HomepageData, value: unknown) => setData((d) => ({ ...d, [key]: value }));

  const updateWhyItem = (i: number, field: "title" | "description", v: string) =>
    setData((d) => ({ ...d, why_kafu_items: d.why_kafu_items.map((item, idx) => idx === i ? { ...item, [field]: v } : item) }));
  const addWhyItem = () => setData((d) => ({ ...d, why_kafu_items: [...d.why_kafu_items, { title: "", description: "" }] }));
  const removeWhyItem = (i: number) => setData((d) => ({ ...d, why_kafu_items: d.why_kafu_items.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true); setSaved(false);
    try { await apiPutSiteSettings("homepage", data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-sm text-muted-foreground py-8 text-center">Loading...</div>;

  return (
    <div>
      <SaveBar saving={saving} saved={saved} onSave={save} />
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Hero Section</h3>
          <div>
            <Label>Hero Title</Label>
            <input type="text" value={data.hero_title} onChange={(e) => update("hero_title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-hero-title" />
          </div>
          <div>
            <Label>Hero Subtitle</Label>
            <textarea rows={3} value={data.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-hero-subtitle" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Primary Button Label</Label><Input value={data.hero_cta_primary} onChange={(v) => update("hero_cta_primary", v)} data-testid="input-hero-cta-primary" /></div>
            <div><Label>Secondary Button Label</Label><Input value={data.hero_cta_secondary} onChange={(v) => update("hero_cta_secondary", v)} data-testid="input-hero-cta-secondary" /></div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">About Section</h3>
          <div><Label>Heading</Label><Input value={data.about_heading} onChange={(v) => update("about_heading", v)} data-testid="input-about-heading" /></div>
          <div>
            <Label>Body Text</Label>
            <textarea rows={4} value={data.about_body} onChange={(e) => update("about_body", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" data-testid="input-about-body" />
          </div>
        </div>

        {/* Why KAFU */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Why KAFU Section</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Feature cards displayed in the Why Choose KAFU section.</p>
            </div>
            <button onClick={addWhyItem} className="flex items-center gap-1 text-xs text-primary hover:underline" data-testid="btn-add-why-item">
              <Plus className="w-3.5 h-3.5" /> Add Card
            </button>
          </div>
          <div><Label>Section Heading</Label><Input value={data.why_kafu_heading} onChange={(v) => update("why_kafu_heading", v)} data-testid="input-why-heading" /></div>
          <div className="space-y-3">
            {data.why_kafu_items.map((item, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Card {i + 1}</span>
                  <button onClick={() => removeWhyItem(i)} className="text-red-400 hover:text-red-600" data-testid={`btn-remove-why-${i}`}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div><Label>Title</Label><Input value={item.title} onChange={(v) => updateWhyItem(i, "title", v)} data-testid={`input-why-title-${i}`} /></div>
                <div>
                  <Label>Description</Label>
                  <textarea rows={2} value={item.description} onChange={(e) => updateWhyItem(i, "description", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-border text-sm resize-none focus:outline-none" data-testid={`input-why-desc-${i}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; description: string }[] = [
  { key: "contact", label: "Contact Information", description: "Manage the university's contact details, email addresses, and social media links." },
  { key: "stats", label: "University Stats", description: "The headline numbers shown on the homepage and about page." },
  { key: "admissions", label: "Admissions", description: "Edit admission pathways, requirements, and application links." },
  { key: "homepage", label: "Homepage Content", description: "Edit the hero, about, and Why KAFU sections on the homepage." },
];

export default function SiteSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("contact");
  const tab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage website-wide content that does not belong to individual content items.
          Changes take effect immediately on the public website.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`tab-${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <SectionHeader title={tab.label} description={tab.description} />

      {activeTab === "contact" && <ContactTab />}
      {activeTab === "stats" && <StatsTab />}
      {activeTab === "admissions" && <AdmissionsTab />}
      {activeTab === "homepage" && <HomepageTab />}
    </div>
  );
}
