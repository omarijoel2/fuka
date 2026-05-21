import React, { useState } from "react";
import { Link } from "wouter";
import { useResearchGrants, useResearchPartners } from "@/lib/api-hooks";
import { ChevronRight, Globe, Banknote, ExternalLink, Building2, Users, HeartHandshake } from "lucide-react";
import { SeoHead } from "@/components/seo-head";

const PARTNER_TYPE_LABELS: Record<string, string> = {
  academic: "Academic", government: "Government", ngo: "NGO", donor: "Donor",
  industry: "Industry", international: "International",
};

const GRANT_STATUS_COLOURS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
};

function formatCurrency(amount?: number, currency = "USD") {
  if (!amount) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function ResearchPartnerships() {
  const [partnerType, setPartnerType] = useState("");
  const [grantStatus, setGrantStatus] = useState("");

  const { data: grantData, isLoading: grantsLoading } = useResearchGrants({ status: grantStatus || undefined });
  const { data: partnerData, isLoading: partnersLoading } = useResearchPartners({ type: partnerType || undefined });

  const grants = grantData?.data ?? [];
  const partners = partnerData?.data ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Research Partnerships — Kaimosi Friends University"
        description="KAFU's national and international research partnerships — collaborating with universities, NGOs, government agencies, and industry to drive impactful research."
        path="/research/partnerships"
        breadcrumbs={[{ name: "Research", path: "/research" }, { name: "Partnerships", path: "/research/partnerships" }]}
      />
      {/* Header */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <img src="/imgs/image-82.jpeg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2)" }} />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative container mx-auto px-4 z-10">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <Link href="/research" className="hover:underline">Research</Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span>Partnerships & Grants</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Partnerships & Grants</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            KAFU's research ecosystem is strengthened by partnerships with leading universities, NGOs, government agencies, and international development organisations.
          </p>
        </div>
      </div>

      {/* Grants */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Research Funding</p>
              <h2 className="text-3xl font-serif font-bold text-foreground">Active Grants</h2>
              <p className="text-muted-foreground mt-2">External research funding powering KAFU's scholarly agenda.</p>
            </div>
            <select value={grantStatus} onChange={(e) => setGrantStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-grant-status">
              <option value="">All Grants</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {grantsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-muted rounded-xl h-36 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {grants.map((grant) => (
                <div key={grant.id} className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow" data-testid={`grant-card-${grant.id}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${GRANT_STATUS_COLOURS[grant.status]}`}>
                          {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
                        </span>
                        {grant.funder_type && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium capitalize">
                            {grant.funder_type}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-1">{grant.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        {grant.funder}
                        {grant.funder_country && ` · ${grant.funder_country}`}
                      </p>
                    </div>
                    {grant.amount && (
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Grant Value</p>
                        <p className="font-bold text-primary text-sm">{formatCurrency(grant.amount, grant.currency)}</p>
                      </div>
                    )}
                  </div>
                  {grant.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{grant.description}</p>}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{[formatDate(grant.start_date), formatDate(grant.end_date)].filter(Boolean).join(" — ")}</span>
                    {grant.project && (
                      <Link href={`/research/projects/${grant.project.slug}`} className="text-primary hover:underline font-medium">
                        View Project
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Collaborators</p>
              <h2 className="text-3xl font-serif font-bold text-foreground">Research Partners</h2>
              <p className="text-muted-foreground mt-2">Universities, government bodies, NGOs, and international organisations we work with.</p>
            </div>
            <select value={partnerType} onChange={(e) => setPartnerType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none" data-testid="select-partner-type">
              <option value="">All Types</option>
              {Object.entries(PARTNER_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          {partnersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-muted rounded-xl h-40 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {partners.map((partner) => (
                <div key={partner.id} className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow ${partner.is_featured ? "border-primary/30" : "border-border"}`} data-testid={`partner-card-${partner.slug}`}>
                  {partner.logo_url ? (
                    <div className="h-12 flex items-center mb-4">
                      <img src={partner.logo_url} alt={partner.name} className="max-h-10 max-w-[140px] object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <HeartHandshake className="w-5 h-5 text-primary/50" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-foreground text-sm">{partner.name}</h3>
                    {partner.is_featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 font-bold shrink-0">Featured</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                      {PARTNER_TYPE_LABELS[partner.type] ?? partner.type}
                    </span>
                    {partner.country && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium flex items-center gap-0.5">
                        <Globe className="w-2.5 h-2.5" /> {partner.country}
                      </span>
                    )}
                  </div>
                  {partner.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{partner.description}</p>}
                  {(partner.collaboration_areas?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {partner.collaboration_areas?.slice(0, 2).map((area) => (
                        <span key={area} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{area}</span>
                      ))}
                      {(partner.collaboration_areas?.length ?? 0) > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{(partner.collaboration_areas?.length ?? 0) - 2} more</span>
                      )}
                    </div>
                  )}
                  {partner.website_url && (
                    <a href={partner.website_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium mt-2" data-testid={`btn-partner-website-${partner.id}`}>
                      <ExternalLink className="w-3 h-3" /> Visit Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <HeartHandshake className="w-10 h-10 mx-auto mb-4 opacity-70" />
          <h2 className="text-3xl font-serif font-bold mb-3">Partner With KAFU</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6 text-lg">
            We welcome collaborations with universities, government agencies, NGOs, and industry partners who share our commitment to research that transforms communities.
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition" data-testid="btn-partner-contact">
              Contact the Research Office
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
