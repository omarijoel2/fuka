import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { staffPost, staffGet, setToken, clearToken } from "./api";

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  title?: string;
  job_title?: string;
  department?: string;
  school_code?: string;
  role: string;
  status: string;
  avatar_url?: string;
  first_login_completed: boolean;
  has_consent: boolean;
  last_login_at?: string;
}

interface AuthCtx {
  user: StaffUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (u: StaffUser) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(() => {
    try { return JSON.parse(localStorage.getItem("kafu_staff_user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await staffGet("/me");
      const u = res.user;
      setUser(u);
      localStorage.setItem("kafu_staff_user", JSON.stringify(u));
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("kafu_staff_token");
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await staffPost("/login", { email, password });
    setToken(res.token);
    const u = res.user;
    setUser(u);
    localStorage.setItem("kafu_staff_user", JSON.stringify(u));
  }, []);

  const logout = useCallback(async () => {
    try { await staffPost("/logout"); } catch { /* ignore */ }
    clearToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((u: StaffUser) => {
    setUser(u);
    localStorage.setItem("kafu_staff_user", JSON.stringify(u));
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, login, logout, refreshUser, setUser: updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
