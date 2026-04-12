import React, { useState, useEffect, useCallback } from "react";
import { adminStaffFetch } from "@/lib/api";
import { fmtDate } from "@/lib/api";
import { Users, Plus, Lock, Unlock, UserX, RefreshCw, Search, Eye } from "lucide-react";

interface StaffAccount {
  id: number;
  name: string;
  email: string;
  payroll_number: string | null;
  staff_number: string | null;
  title: string | null;
  job_title: string | null;
  department: string | null;
  role: string;
  status: string;
  first_login_completed: boolean;
  last_login_at: string | null;
}

const ROLES = [
  "staff_user", "reviewer", "communications_admin", "ict_admin",
  "academic_owner", "department_editor", "research_owner", "super_admin",
];

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  locked: "bg-orange-100 text-orange-700",
  inactive: "bg-gray-100 text-gray-500",
};

const EMPTY_FORM = {
  name: "", email: "", payroll_number: "", staff_number: "",
  title: "", job_title: "", department: "", school_code: "", role: "staff_user",
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [tempPw, setTempPw] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ role: "all", q: search });
      if (filterStatus) params.set("status", filterStatus);
      const res = await adminStaffFetch(`/?${params}`);
      setAccounts(res.data ?? res ?? []);
    } catch {
      showToast("error", "Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await adminStaffFetch("/", { method: "POST", body: JSON.stringify(form) });
      setTempPw(res.temp_password);
      setShowCreate(false);
      setForm({ ...EMPTY_FORM });
      await loadAccounts();
      showToast("success", "Account provisioned.");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to create.");
    } finally {
      setCreating(false);
    }
  }

  async function doAction(id: number, type: "lock" | "unlock" | "deactivate" | "reset-password") {
    setActionLoading(id);
    try {
      const res = await adminStaffFetch(`/${id}/${type}`, { method: "POST", body: JSON.stringify({}) });
      if (type === "reset-password" && res.temp_password) {
        setTempPw(res.temp_password);
      }
      showToast("success", "Action completed.");
      await loadAccounts();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="w-6 h-6 text-primary" /> Account Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Provision, manage, and audit staff accounts.</p>
        </div>
        <button onClick={() => setShowCreate(true)} data-testid="btn-provision-account"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Provision Account
        </button>
      </div>

      {/* Temp password display */}
      {tempPw && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">Temporary Password (share securely — shown once)</p>
          <code className="text-lg font-mono text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg">{tempPw}</code>
          <button onClick={() => setTempPw(null)} className="ml-4 text-xs text-amber-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="search" placeholder="Search by name, email or payroll number…" value={search} onChange={e => setSearch(e.target.value)}
            data-testid="input-accounts-search"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          data-testid="select-accounts-filter"
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="locked">Locked</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading accounts…</div>
        ) : accounts.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No accounts found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Login</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" data-testid={`account-row-${acc.id}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{acc.title ? `${acc.title} ` : ""}{acc.name}</p>
                    <p className="text-xs text-gray-400">{acc.email}</p>
                    {acc.payroll_number && <p className="text-xs text-gray-300 font-mono">{acc.payroll_number}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{acc.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[acc.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {acc.status}
                    </span>
                    {!acc.first_login_completed && <span className="ml-2 text-xs text-amber-500">New</span>}
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-500">{fmtDate(acc.last_login_at)}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      {acc.status === "active" && (
                        <button onClick={() => doAction(acc.id, "lock")} disabled={actionLoading === acc.id}
                          title="Lock account" data-testid={`btn-lock-${acc.id}`}
                          className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-40">
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                      {acc.status === "locked" && (
                        <button onClick={() => doAction(acc.id, "unlock")} disabled={actionLoading === acc.id}
                          title="Unlock account" data-testid={`btn-unlock-${acc.id}`}
                          className="p-1.5 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-40">
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => doAction(acc.id, "reset-password")} disabled={actionLoading === acc.id}
                        title="Reset password" data-testid={`btn-reset-pw-${acc.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-40">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      {acc.status !== "inactive" && (
                        <button onClick={() => doAction(acc.id, "deactivate")} disabled={actionLoading === acc.id}
                          title="Deactivate" data-testid={`btn-deactivate-${acc.id}`}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Provision New Account</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreate} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Full Name", required: true, type: "text" },
                  { key: "email", label: "Institutional Email", required: true, type: "email" },
                  { key: "payroll_number", label: "Payroll Number", required: false, type: "text" },
                  { key: "staff_number", label: "Staff Number", required: false, type: "text" },
                  { key: "title", label: "Title (Dr., Prof., etc.)", required: false, type: "text" },
                  { key: "job_title", label: "Job Title", required: false, type: "text" },
                  { key: "department", label: "Department / School", required: false, type: "text" },
                  { key: "school_code", label: "School Code", required: false, type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}</label>
                    <input type={f.type} value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      required={f.required} data-testid={`input-provision-${f.key}`}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Role</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    data-testid="select-provision-role"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" disabled={creating} data-testid="btn-submit-provision"
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
                  {creating ? "Provisioning…" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
