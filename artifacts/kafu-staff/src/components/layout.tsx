import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, User, ClipboardList, LogOut, Menu, X,
  FileText, Clock, ChevronRight, Settings
} from "lucide-react";

interface NavItem { label: string; href: string; icon: React.ReactNode; roles?: string[]; }

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "My Profile", href: "/profile", icon: <User className="w-4 h-4" /> },
  { label: "Submission History", href: "/history", icon: <ClipboardList className="w-4 h-4" /> },
  { label: "Review Queue", href: "/review", icon: <FileText className="w-4 h-4" />, roles: ["reviewer", "super_admin", "ict_admin", "communications_admin"] },
  { label: "Account Management", href: "/accounts", icon: <Settings className="w-4 h-4" />, roles: ["super_admin", "ict_admin"] },
];

export function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNav = NAV.filter(item => !item.roles || item.roles.includes(user?.role ?? ""));

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-60 bg-[#1A5C38] text-white flex flex-col transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-[11px] font-bold tracking-wider uppercase text-white/50">Kaimosi Friends University</p>
          <h1 className="text-base font-bold text-white mt-0.5">Staff Portal</h1>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {visibleNav.map(item => {
            const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <span
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                >
                  {item.icon}
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.charAt(0) ?? "S"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/50 truncate">{user?.job_title ?? user?.role}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors w-full">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-900">KAFU Staff Portal</span>
        </header>
        {/* Content */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
