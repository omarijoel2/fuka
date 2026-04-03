import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, formatDate } from "@/lib/api";
import { UserCog, Plus, RefreshCw, Edit2, X } from "lucide-react";

interface CmsUser {
  id: number; name: string; email: string; role: string; role_label: string;
  department?: string; school_code?: string; is_active: boolean; created_at: string;
}

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "ict_admin", label: "ICT Admin" },
  { value: "communications_admin", label: "Communications Admin" },
  { value: "reviewer", label: "Reviewer" },
  { value: "admissions_owner", label: "Admissions Owner" },
  { value: "academic_owner", label: "Academic Owner" },
  { value: "procurement_owner", label: "Procurement Owner" },
  { value: "hr_owner", label: "HR Owner" },
  { value: "staff_user", label: "Staff User" },
  { value: "dept_editor", label: "Department Editor" },
];

function UserModal({ user, onClose, onSaved }: { user: Partial<CmsUser> | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !user?.id;
  const [form, setForm] = useState({
    name: user?.name ?? "", email: user?.email ?? "",
    role: user?.role ?? "staff_user", password: "",
    department: user?.department ?? "", school_code: user?.school_code ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (isNew) await apiPost("/users", form);
      else await apiPut(`/users/${user!.id}`, form);
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{isNew ? "Add User" : "Edit User"}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="btn-close-modal"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-user-name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-user-email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
              data-testid="select-user-role">
              {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          {isNew && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-user-password" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Department</label>
              <input type="text" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none" data-testid="input-user-dept" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">School Code</label>
              <input type="text" value={form.school_code} onChange={(e) => setForm((f) => ({ ...f, school_code: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none" data-testid="input-user-school" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted" data-testid="btn-cancel-user">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60" data-testid="btn-save-user">
              {saving ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<CmsUser> | null | false>(false);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiGet("/users");
      setUsers(data?.data ?? data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} CMS users</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition" data-testid="btn-refresh-users">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setModal({})}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90" data-testid="btn-add-user">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {["Name", "Email", "Role", "Department", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-secondary text-secondary-foreground font-semibold px-2 py-0.5 rounded">
                      {u.role_label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.department ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setModal(u)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition" data-testid={`btn-edit-user-${u.id}`}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal !== false && (
        <UserModal user={modal} onClose={() => setModal(false)} onSaved={load} />
      )}
    </div>
  );
}
