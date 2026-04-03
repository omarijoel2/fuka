import React, { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
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

  return (
    <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png"
            alt="Kaimosi Friends University"
            className="h-10 object-contain brightness-0 invert mb-4"
          />
          <h1 className="text-white text-lg font-bold tracking-wide">CMS Administration</h1>
          <p className="text-sidebar-foreground/60 text-xs mt-1">Governance Engine · Restricted Access</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-1">Sign In</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your authorised credentials to access the CMS.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" data-testid="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
              data-testid="btn-login"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-sidebar-foreground/40 mt-6">
          Kaimosi Friends University &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
