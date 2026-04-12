import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { staffPost } from "@/lib/api";
import { CheckCircle, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

type Step = "password" | "consent" | "done";

export default function OnboardingPage() {
  const { user, refreshUser, setUser } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>(!user?.first_login_completed ? "password" : !user?.has_consent ? "consent" : "done");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    if (newPw.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSaving(true);
    try {
      const res = await staffPost("/password/change", {
        current_password: currentPw,
        new_password: newPw,
        new_password_confirmation: confirmPw,
      });
      setUser(res.user);
      setStep("consent");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConsentAccept() {
    setSaving(true);
    try {
      await staffPost("/consent/accept", { policy_version: "v1.0" });
      await refreshUser();
      setStep("done");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record consent.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f3823] to-[#1A5C38] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {(["password", "consent", "done"] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${s === step ? "bg-white text-[#1A5C38]" : (["password","consent","done"].indexOf(step) > i ? "bg-white/30 text-white" : "bg-white/10 text-white/40")}`}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-white/20" />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === "password" && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Set Your Password</h2>
                  <p className="text-xs text-gray-500">Choose a strong new password to continue.</p>
                </div>
              </div>
              {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current (Temporary) Password</label>
                  <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required
                    data-testid="input-current-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                  <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={8}
                    data-testid="input-new-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
                  <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required
                    data-testid="input-confirm-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <button type="submit" disabled={saving} data-testid="btn-change-password"
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? "Saving…" : <><span>Set Password</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {step === "consent" && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Profile Publication Consent</h2>
                  <p className="text-xs text-gray-500">Please review and accept to continue.</p>
                </div>
              </div>
              {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
              <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 space-y-3 mb-6 max-h-64 overflow-y-auto leading-relaxed">
                <p className="font-semibold text-gray-900">KAFU Staff Profile Publication Policy — v1.0</p>
                <p>By accepting this consent, you authorise Kaimosi Friends University (KAFU) to publish your professional profile information on the university's official website and affiliated platforms.</p>
                <p><strong>What will be published:</strong> Your name, title, academic qualifications, research interests, teaching areas, publications, and contact details you designate as public.</p>
                <p><strong>Your rights:</strong> You may update your profile at any time through this portal. Withdrawal of consent requires written notice to ICT and Communications.</p>
                <p><strong>Privacy:</strong> Personal contact details (personal phone/email) will only be shown if explicitly marked as public by you. Your consent record is retained for audit purposes.</p>
                <p><strong>Data use:</strong> Profile data is used solely for institutional visibility, academic directory, and research showcase purposes. It will not be shared with third parties without separate consent.</p>
                <p>This consent is aligned with the Kenya Data Protection Act 2019 and KAFU's institutional data governance policy.</p>
              </div>
              <button onClick={handleConsentAccept} disabled={saving} data-testid="btn-accept-consent"
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? "Recording consent…" : <><ShieldCheck className="w-4 h-4" /><span>I Accept — Continue to Profile</span></>}
              </button>
            </>
          )}

          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Welcome to the Staff Portal</h2>
              <p className="text-sm text-gray-500">Redirecting you to your dashboard…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
