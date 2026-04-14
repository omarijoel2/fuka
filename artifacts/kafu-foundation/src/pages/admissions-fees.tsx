import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/seo-head";
import { useAdmissionsFees } from "@/lib/api-hooks";
import {
  ChevronRight,
  Banknote,
  Home,
  BookOpen,
  Award,
  CreditCard,
  Smartphone,
  Building2,
  Info,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}

export default function AdmissionsFeesPage() {
  const { data, isLoading } = useAdmissionsFees();
  const [activePathway, setActivePathway] = useState<string>("government");

  const fees = data?.data ?? data as any;
  const pathways = fees?.pathways ?? [];
  const currentPathway = pathways.find((p: any) => p.id === activePathway);
  const paymentMethods = fees?.payment_methods ?? [];

  const PATHWAY_ICONS: Record<string, React.ReactNode> = {
    government: <Award className="w-5 h-5" />,
    "self-sponsored": <BookOpen className="w-5 h-5" />,
    postgraduate: <BookOpen className="w-5 h-5" />,
    international: <Banknote className="w-5 h-5" />,
  };

  const PAYMENT_ICONS: Record<string, React.ReactNode> = {
    "M-Pesa": <Smartphone className="w-5 h-5" />,
    "Bank Deposit / Transfer": <Building2 className="w-5 h-5" />,
    "Cooperative Bank": <Building2 className="w-5 h-5" />,
    "Cash (Finance Office)": <CreditCard className="w-5 h-5" />,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Fees & Financial Information — Admissions | KAFU"
        description="Transparent fee structures for all KAFU programmes. Government-sponsored, self-sponsored, postgraduate, and international student fees, plus scholarship information."
        path="/admissions/fees"
        breadcrumbs={[
          { name: "Admissions", path: "/admissions" },
          { name: "Fees & Funding" },
        ]}
      />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <Link href="/admissions" className="hover:underline">Admissions</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span>Fees & Funding</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            Fees & <span className="text-accent">Financial Planning</span>
          </h1>
          <p className="text-primary-foreground/80 max-w-xl text-base leading-relaxed">
            We believe in full financial transparency. Below are the 2025/2026 fee structures across all student pathways, along with scholarship and funding options.
          </p>
          {fees?.academic_year && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-semibold">
              <Info className="w-3.5 h-3.5" /> Academic Year: {fees.academic_year}
            </div>
          )}
        </div>
      </div>

      {/* Pathway Tabs */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-9 w-32 bg-muted rounded-lg animate-pulse shrink-0" />
                ))
              : pathways.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePathway(p.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activePathway === p.id
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    data-testid={`fee-tab-${p.id}`}
                  >
                    {PATHWAY_ICONS[p.id]}
                    {p.title}
                  </button>
                ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : currentPathway ? (
          <div className="max-w-3xl mx-auto">

            {/* Pathway Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-primary mb-1">{currentPathway.title}</h2>
              <p className="text-muted-foreground text-sm">{currentPathway.subtitle}</p>
              <p className="mt-3 text-sm text-foreground bg-secondary border rounded-lg px-4 py-3 leading-relaxed">
                {currentPathway.tuition_note}
              </p>
            </div>

            {/* Fee Table */}
            <div className="mb-8">
              <h3 className="font-serif font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" /> Annual Cost Breakdown
              </h3>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="text-left px-5 py-3 font-semibold">Item</th>
                      <th className="text-right px-5 py-3 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPathway.annual_items.map((item: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"} data-testid={`fee-row-${i}`}>
                        <td className="px-5 py-4">
                          <div className="font-medium text-foreground">{item.label}</div>
                          {item.note && <div className="text-xs text-muted-foreground mt-0.5">{item.note}</div>}
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-semibold text-foreground whitespace-nowrap">
                          {currentPathway.id === "international"
                            ? `USD ${item.amount.toLocaleString()}`
                            : formatKES(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-accent/10 border-t-2 border-accent/30">
                      <td className="px-5 py-4 font-bold text-foreground">Estimated Annual Total</td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-primary text-base">
                        {currentPathway.id === "international"
                          ? `USD ${(currentPathway.estimated_annual_total_usd ?? currentPathway.estimated_annual_total).toLocaleString()}`
                          : formatKES(currentPathway.estimated_annual_total)}
                      </td>
                    </tr>
                    {currentPathway.estimated_4yr_total && currentPathway.id !== "international" && (
                      <tr className="bg-primary/5">
                        <td className="px-5 py-3 text-sm text-muted-foreground">Estimated 4-Year Total (indicative)</td>
                        <td className="px-5 py-3 text-right font-mono text-sm text-muted-foreground">
                          {formatKES(currentPathway.estimated_4yr_total)}
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Scholarships & Funding */}
            {currentPathway.scholarships?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" /> Scholarships & Funding Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentPathway.scholarships.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-xl" data-testid={`scholarship-${i}`}>
                      <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
                {currentPathway.helb_note && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                    <div>
                      <span className="font-semibold text-blue-700">HELB Information: </span>
                      {currentPathway.helb_note}
                      {" "}
                      <a href="https://www.helb.co.ke" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                        helb.co.ke <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Accommodation */}
            <div className="mb-8 p-5 bg-card border rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">On-Campus Accommodation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  KAFU offers comfortable, secure on-campus accommodation. Rooms are allocated on a first-come, first-served basis. Shared facilities include Wi-Fi, common rooms, and laundry areas.
                  Off-campus housing is also available in Kaimosi and surrounding areas from KES 3,000–8,000/month.
                </p>
                <Button variant="outline" className="mt-3 text-sm border-primary text-primary" asChild data-testid="btn-accommodation">
                  <Link href="/contact">Enquire About Accommodation</Link>
                </Button>
              </div>
            </div>

          </div>
        ) : null}

        {/* Payment Methods */}
        {!isLoading && paymentMethods.length > 0 && (
          <div className="max-w-3xl mx-auto mt-6 pt-8 border-t">
            <h3 className="font-serif font-bold text-xl text-foreground mb-2">How to Pay</h3>
            <p className="text-muted-foreground text-sm mb-6">KAFU accepts fee payments through the following channels.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map((pm: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-card border rounded-xl hover:border-primary/50 transition-colors" data-testid={`payment-method-${i}`}>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {PAYMENT_ICONS[pm.method] ?? <CreditCard className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{pm.method}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{pm.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {!isLoading && fees?.note && (
          <div className="max-w-3xl mx-auto mt-6">
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary rounded-lg p-4">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
              <p>{fees.note}</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-8 pt-6 border-t flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">Ready to begin your application?</p>
            <p className="text-sm text-muted-foreground">View the full admissions guide or apply directly on the student portal.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" className="border-primary text-primary" asChild data-testid="btn-admissions-guide">
              <Link href="/admissions">Admissions Guide</Link>
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" asChild data-testid="btn-apply-portal">
              <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">
                Apply Now <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
