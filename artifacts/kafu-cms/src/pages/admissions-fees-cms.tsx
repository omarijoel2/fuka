import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Save, Plus, Trash2, Banknote, Info } from "lucide-react";

interface PaymentMethod {
  method: string;
  details: string;
  enabled: boolean;
}

interface FeesConfig {
  academic_year: string;
  note: string;
  payment_methods_visible: boolean;
  payment_methods: PaymentMethod[];
}

const DEFAULT_CONFIG: FeesConfig = {
  academic_year: "2025/2026",
  note: "All fees are reviewed annually. The figures above reflect 2025/2026 rates. Prospective students should confirm current rates with the Finance Office before payment.",
  payment_methods_visible: false,
  payment_methods: [
    { method: "M-Pesa", details: "Paybill Number: [PENDING — confirm with Finance Office]. Use your student ID as account number.", enabled: false },
    { method: "Bank Deposit / Transfer", details: "Kenya Commercial Bank (KCB) — Account: Kaimosi Friends University, A/C No: [PENDING], Branch: Kaimosi", enabled: false },
    { method: "Cooperative Bank", details: "Cooperative Bank — Account: [PENDING], Branch: Kakamega", enabled: false },
    { method: "Cash (Finance Office)", details: "Finance Office, Ground Floor, Administration Block. Mon–Fri, 8:00 AM – 4:00 PM.", enabled: false },
  ],
};

function parseConfig(raw: Record<string, string>): FeesConfig {
  try {
    if (raw?.data) return JSON.parse(raw.data);
  } catch { /* fall through */ }
  return DEFAULT_CONFIG;
}

export default function AdmissionsFeesAdminPage() {
  const qc = useQueryClient();
  const [config, setConfig] = useState<FeesConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const { data: raw, isLoading } = useQuery({
    queryKey: ["cms-admissions-fees"],
    queryFn: () => apiFetch("/site-config/admissions_fees"),
  });

  useEffect(() => {
    if (raw) setConfig(parseConfig(raw as Record<string, string>));
  }, [raw]);

  const save = useMutation({
    mutationFn: () =>
      apiFetch("/site-config/admissions_fees", {
        method: "PUT",
        body: JSON.stringify({ data: JSON.stringify(config) }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cms-admissions-fees"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const setField = <K extends keyof FeesConfig>(k: K, v: FeesConfig[K]) =>
    setConfig(c => ({ ...c, [k]: v }));

  const updatePm = (i: number, key: keyof PaymentMethod, val: string | boolean) =>
    setConfig(c => {
      const pms = [...c.payment_methods];
      pms[i] = { ...pms[i], [key]: val };
      return { ...c, payment_methods: pms };
    });

  const addPm = () =>
    setConfig(c => ({
      ...c,
      payment_methods: [...c.payment_methods, { method: "", details: "", enabled: false }],
    }));

  const removePm = (i: number) =>
    setConfig(c => ({ ...c, payment_methods: c.payment_methods.filter((_, j) => j !== i) }));

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading fee configuration...</div>;

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" /> Admissions Fees Editor
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage the academic year, disclaimer note, and payment method details shown on the fees page.
          </p>
        </div>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          data-testid="save-fees-btn"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved" : save.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        Fee tables (tuition figures per pathway) are managed by the Finance Office and updated each academic year.
        Use this page to update the academic year label, the disclaimer note, and payment channel details.
      </div>

      {/* Academic year */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Academic Year</h2>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Current Academic Year Label</label>
          <input
            data-testid="input-academic-year"
            value={config.academic_year}
            onChange={e => setField("academic_year", e.target.value)}
            className="w-full max-w-xs border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="e.g. 2025/2026"
          />
          <p className="text-xs text-muted-foreground mt-1">Displayed at the top of the fee tables.</p>
        </div>
      </section>

      {/* Disclaimer note */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Disclaimer Note</h2>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Note shown at the bottom of the fees page</label>
          <textarea
            data-testid="input-note"
            value={config.note}
            onChange={e => setField("note", e.target.value)}
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </section>

      {/* Payment methods */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Payment Methods</h2>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              data-testid="toggle-payment-visible"
              checked={config.payment_methods_visible}
              onChange={e => setField("payment_methods_visible", e.target.checked)}
              className="rounded border-border w-4 h-4"
            />
            Show "How to Pay" section on website
          </label>
        </div>

        {!config.payment_methods_visible && (
          <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
            The "How to Pay" section is currently hidden from the public fees page.
            Enable the toggle above to make it visible once payment details are confirmed.
          </div>
        )}

        <div className="space-y-3">
          {config.payment_methods.map((pm, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={pm.enabled}
                  onChange={e => updatePm(i, "enabled", e.target.checked)}
                  data-testid={`pm-enabled-${i}`}
                  className="rounded border-border w-4 h-4 shrink-0"
                />
                <span className="text-xs text-muted-foreground">Enabled</span>
                <button
                  onClick={() => removePm(i)}
                  data-testid={`pm-remove-${i}`}
                  className="ml-auto text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Method Name</label>
                  <input
                    value={pm.method}
                    onChange={e => updatePm(i, "method", e.target.value)}
                    data-testid={`pm-method-${i}`}
                    placeholder="e.g. M-Pesa"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Details / Instructions</label>
                  <input
                    value={pm.details}
                    onChange={e => updatePm(i, "details", e.target.value)}
                    data-testid={`pm-details-${i}`}
                    placeholder="Account number, branch, etc."
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addPm}
          data-testid="add-payment-method"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Payment Method
        </button>
      </section>

      <div className="flex justify-end">
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          data-testid="save-fees-btn-bottom"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm hover:bg-primary/90 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved" : save.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
