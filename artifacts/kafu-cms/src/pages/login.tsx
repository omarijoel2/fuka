import React, { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";

type View = "login" | "forgot" | "reset";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState("");

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      try {
        await login(email, password);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Login failed. Please try again.");
      }
    },
    [login, email, password]
  );

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset request.");
      setSuccess(data.message);
      if (data.dev_token) {
        setDevToken(data.dev_token);
        setToken(data.dev_token);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed. Please try again.");
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
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password.");
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
      setError(err instanceof Error ? err.message : "Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png"
            alt="Kaimosi Friends University"
            className="h-10 object-contain brightness-0 invert mb-4"
          />
          <h1 className="text-white text-lg font-bold tracking-wide">CMS Administration</h1>
          <p className="text-sidebar-foreground/60 text-xs mt-1">Governance Engine · Restricted Access</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          {view === "login" && (
            <>
              <h2 className="text-xl font-bold text-foreground mb-1">Sign In</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your authorised credentials to access the CMS.
              </p>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" data-testid="login-error">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@kafu.ac.ke"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    data-testid="input-password"
                  />
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
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                  data-testid="btn-login"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </>
          )}

          {view === "forgot" && (
            <>
              <h2 className="text-xl font-bold text-foreground mb-1">Reset Password</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your account email to receive a password reset token.
              </p>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" data-testid="forgot-error">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700" data-testid="forgot-success">
                  <p>{success}</p>
                  {devToken && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
                      <strong>Dev token (local environment only):</strong>
                      <code className="block mt-1 break-all font-mono">{devToken}</code>
                    </div>
                  )}
                </div>
              )}
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@kafu.ac.ke"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    data-testid="input-forgot-email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                  data-testid="btn-send-reset"
                >
                  {loading ? "Sending..." : "Send Reset Token"}
                </button>
                {success && (
                  <button
                    type="button"
                    onClick={() => { setView("reset"); setError(""); }}
                    className="w-full py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-secondary transition"
                    data-testid="btn-enter-token"
                  >
                    Enter Reset Token
                  </button>
                )}
              </form>
              <button
                type="button"
                onClick={() => { setView("login"); setError(""); setSuccess(""); setDevToken(""); }}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground block text-center w-full"
                data-testid="btn-back-to-login"
              >
                Back to Sign In
              </button>
            </>
          )}

          {view === "reset" && (
            <>
              <h2 className="text-xl font-bold text-foreground mb-1">Set New Password</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter the token sent to your email and choose a new password.
              </p>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" data-testid="reset-error">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700" data-testid="reset-success">
                  {success}
                </div>
              )}
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@kafu.ac.ke"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    data-testid="input-reset-email"
                  />
                </div>
                <div>
                  <label htmlFor="reset-token" className="block text-sm font-medium text-foreground mb-1.5">
                    Reset Token
                  </label>
                  <input
                    id="reset-token"
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste token from email"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-mono placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    data-testid="input-reset-token"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-1.5">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    data-testid="input-new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    data-testid="input-confirm-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                  data-testid="btn-reset-password"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
              <button
                type="button"
                onClick={() => { setView("forgot"); setError(""); setSuccess(""); }}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground block text-center w-full"
                data-testid="btn-back-to-forgot"
              >
                Back
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-sidebar-foreground/40 mt-6">
          Kaimosi Friends University &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
