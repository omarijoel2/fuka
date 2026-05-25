import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA4_ID = (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined) ?? "";

let initialized = false;

function initGA4() {
  if (initialized || !GA4_ID || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    anonymize_ip: true,
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);
}

export function useAnalyticsInit() {
  const [location] = useLocation();

  useEffect(() => {
    initGA4();
  }, []);

  useEffect(() => {
    if (!GA4_ID || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: location,
      page_title: document.title,
    });
  }, [location]);
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", name, params);
}

export function trackOutboundLink(url: string, label?: string) {
  trackEvent("outbound_link_click", { url, label });
}

export function trackDownload(fileName: string, fileType?: string) {
  trackEvent("file_download", { file_name: fileName, file_type: fileType });
}

export function trackSearch(term: string, resultCount?: number) {
  trackEvent("search", { search_term: term, result_count: resultCount });
}

export function trackApply(source?: string, programmeId?: string) {
  trackEvent("apply_now_click", { source, programme_id: programmeId });
}

export function trackProgrammeView(programmeId: string, faculty: string, level: string) {
  trackEvent("programme_view", { programme_id: programmeId, faculty, level });
}

export function trackPublicationView(slug: string, pubType?: string) {
  trackEvent("publication_view", { publication_slug: slug, type: pubType });
}

export function trackPublicationDownload(slug: string) {
  trackEvent("publication_download", { publication_slug: slug });
}

export function trackStaffProfileView(slug: string, department: string) {
  trackEvent("staff_profile_view", { staff_slug: slug, department });
}

export function trackOpportunityView(slug: string, oppType: string) {
  trackEvent("opportunity_view", { opp_slug: slug, type: oppType });
}

export function trackAdmissionsFunnel(step: string, extra?: Record<string, unknown>) {
  trackEvent("admissions_funnel_step", { step, ...extra });
}

export function trackInternationalInterest(section: string) {
  trackEvent("international_interest", { section });
}

export function trackRepositoryAction(action: "view" | "download" | "cite", slug: string) {
  trackEvent("repository_action", { action, item_slug: slug });
}
