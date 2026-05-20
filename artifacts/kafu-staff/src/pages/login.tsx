import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react";

type View = "login" | "forgot" | "reset";

export default function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [view, setView] = useState<View>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devToken, setDevToken] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/staff/password/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed.");
      setSuccess(data.message ?? "If that email is registered, a reset link has been sent.");
      if (data.dev_token) {
        setDevToken(data.dev_token);
        setToken(data.dev_token);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/staff/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed.");
      setSuccess(data.message + " You may now sign in.");
      setTimeout(() => {
        setView("login");
        setSuccess("");
        setToken("");
        setNewPassword("");
        setConfirmPassword("");
        setDevToken("");
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f3823] to-[#228B22] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">KAFU Staff Portal</h1>
          <p className="text-white/60 text-sm mt-1">Academic & Professional Profile System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {view === "login" && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Sign In</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your institutional email and password to continue.</p>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@kafu.ac.ke"
                      required
                      data-testid="input-staff-email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      data-testid="input-staff-password"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      data-testid="btn-toggle-password">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setView("forgot"); setError(""); setSuccess(""); }}
                    className="text-xs text-primary hover:underline"
                    data-testid="btn-forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="btn-staff-login"
                  className="w-full py-3 bg-[#228B22] text-white rounded-xl font-semibold text-sm hover:bg-[#164d30] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-6">
                Need access? Contact <a href="mailto:ict@kafu.ac.ke" className="text-primary hover:underline">ict@kafu.ac.ke</a>
              </p>
            </>
          )}

          {view === "forgot" && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Reset Password</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your institutional email to receive a reset token.</p>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-800 text-sm rounded-lg px-4 py-3 mb-5" data-testid="forgot-success">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{success}</p>
                      {devToken && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
                          <strong>Dev token (local env only):</strong>
                          <code className="block mt-1 break-all font-mono">{devToken}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@kafu.ac.ke"
                      required
                      data-testid="input-forgot-email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="btn-send-reset"
                  className="w-full py-3 bg-[#228B22] text-white rounded-xl font-semibold text-sm hover:bg-[#164d30] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Sending…" : "Send Reset Token"}
                </button>
                {success && (
                  <button
                    type="button"
                    onClick={() => { setView("reset"); setError(""); }}
                    data-testid="btn-enter-token"
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Enter Reset Token
                  </button>
                )}
              </form>

              <button
                type="button"
                onClick={() => { setView("login"); setError(""); setSuccess(""); setDevToken(""); }}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 block text-center w-full"
                data-testid="btn-back-to-login"
              >
                Back to Sign In
              </button>
            </>
          )}

          {view === "reset" && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Set New Password</h2>
              <p className="text-sm text-gray-500 mb-6">Enter the token from your email and choose a new password.</p>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 text-green-800 text-sm rounded-lg px-4 py-3 mb-5" data-testid="reset-success">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@kafu.ac.ke"
                      required
                      data-testid="input-reset-email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reset Token</label>
                  <input
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="Paste token from your email"
                    required
                    data-testid="input-reset-token"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      minLength={8}
                      data-testid="input-new-password"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      data-testid="btn-toggle-new-password">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      data-testid="input-confirm-password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="btn-reset-password"
                  className="w-full py-3 bg-[#228B22] text-white rounded-xl font-semibold text-sm hover:bg-[#164d30] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setView("forgot"); setError(""); setSuccess(""); }}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 block text-center w-full"
                data-testid="btn-back-to-forgot"
              >
                Back
              </button>
            </>
          )}
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Kaimosi Friends University &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
