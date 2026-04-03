import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { Settings, Key, Info } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true); setError(""); setSuccess("");
    try {
      await apiPost("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setSuccess("Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Password change failed.");
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> Account Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Full Name</p>
            <p className="font-medium text-foreground">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Email Address</p>
            <p className="font-medium text-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Role</p>
            <p className="font-medium text-foreground">{user?.role_label}</p>
          </div>
          {user?.department && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Department</p>
              <p className="font-medium text-foreground">{user.department}</p>
            </div>
          )}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><Key className="w-4 h-4 text-primary" /> Change Password</h2>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-current-password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-new-password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-confirm-password" />
          </div>
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            data-testid="btn-change-password">
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* System info */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> System Information</h2>
        <div className="text-sm space-y-1.5 text-muted-foreground">
          <p>Institution: <span className="text-foreground font-medium">Kaimosi Friends University (KAFU)</span></p>
          <p>System: <span className="text-foreground font-medium">CMS & Governance Engine v1.0</span></p>
          <p>Backend: <span className="text-foreground font-medium">Laravel 11 (PHP 8.2)</span></p>
          <p>Frontend: <span className="text-foreground font-medium">React 19 + Vite 6</span></p>
          <p>Environment: <span className="text-foreground font-medium">Production</span></p>
        </div>
      </div>
    </div>
  );
}
