import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, FileText, Calendar, Bell, Briefcase, Users,
  Image, Tag, ClipboardList, Settings, LogOut, Menu, X,
  ChevronDown, ChevronRight, BookOpen, UserCog, AlertTriangle, Newspaper, SlidersHorizontal,
  FlaskConical, Globe, Banknote, HeartHandshake, MapPin, Building2,
  Home, Navigation, ToggleRight, ArrowRightLeft, Activity, GitBranch, Search, GraduationCap,
  Landmark, Camera, ShieldCheck, Gauge, BarChart3
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string; roles?: string[] }[];
  roles?: string[];
}

const ADMIN_ROLES = ["super_admin", "ict_admin", "communications_admin"];
const REVIEWER_ROLES = [...ADMIN_ROLES, "reviewer"];
const WEBMASTER_ROLES = [...ADMIN_ROLES, "webmaster"];

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, href: "/" },
  {
    label: "Content",
    icon: <FileText className="w-4 h-4" />,
    children: [
      { label: "All Content", href: "/content" },
      { label: "News", href: "/content?type=news" },
      { label: "Articles", href: "/articles" },
      { label: "Events", href: "/content?type=event" },
      { label: "Announcements", href: "/content?type=announcement" },
      { label: "Opportunities", href: "/content?type=opportunity" },
      { label: "Programmes", href: "/content?type=programme" },
      { label: "Staff Profiles", href: "/content?type=staff_profile" },
      { label: "Pages", href: "/content?type=page" },
      { label: "Documents", href: "/content?type=document" },
      { label: "Notices & Memos", href: "/notices" },
    ],
  },
  { label: "Review Queue", icon: <ClipboardList className="w-4 h-4" />, href: "/review-queue", roles: REVIEWER_ROLES },
  {
    label: "Research Office",
    icon: <FlaskConical className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Themes", href: "/research/themes" },
      { label: "Projects", href: "/research/projects" },
      { label: "Publications", href: "/research/publications" },
      { label: "Grants", href: "/research/grants" },
      { label: "Partners", href: "/research/partners" },
    ],
  },
  {
    label: "International Office",
    icon: <Globe className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Partnerships", href: "/international/partnerships" },
      { label: "Exchange Programmes", href: "/international/exchange" },
    ],
  },
  {
    label: "Alumni & Outcomes",
    icon: <GraduationCap className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Alumni Profiles", href: "/alumni/profiles" },
      { label: "Success Stories", href: "/alumni/stories" },
      { label: "Employer Partners", href: "/alumni/employers" },
      { label: "Graduate Outcomes", href: "/alumni/outcomes" },
    ],
  },
  {
    label: "Institutional Data",
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "KPIs & Figures", href: "/institutional/kpis" },
      { label: "Rankings", href: "/institutional/rankings" },
      { label: "Public Reports", href: "/institutional/reports" },
      { label: "Accreditations", href: "/institutional/accreditations" },
    ],
  },
  {
    label: "Institutional Repository",
    icon: <BookOpen className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "All Records", href: "/repository" },
      { label: "Pending Review", href: "/repository?status=under_review" },
    ],
  },
  {
    label: "Journal",
    icon: <FileText className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    href: "/journal",
  },
  {
    label: "Academic Profiles",
    icon: <UserCog className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Staff Profiles", href: "/staff-profiles" },
      { label: "Staff Content", href: "/content?type=staff_profile" },
      { label: "Submission Review", href: "/staff-review" },
      { label: "Staff Accounts", href: "/staff-accounts" },
    ],
  },
  {
    label: "Admissions",
    icon: <GraduationCap className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Document Uploads", href: "/admissions" },
      { label: "Fees & Payments", href: "/admissions/fees" },
      { label: "Postgraduate Programmes", href: "/admissions/programmes" },
      { label: "Eligibility Settings", href: "/admissions/settings" },
    ],
  },
  {
    label: "Governance",
    icon: <Landmark className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "University Council", href: "/governance/council" },
      { label: "VC Office (VC & DVCs)", href: "/governance/vc-office" },
      { label: "Management Board", href: "/governance/management" },
      { label: "Directorates", href: "/governance/directorates" },
      { label: "Departments", href: "/departments" },
      { label: "Strategic Plan", href: "/governance/strategic-plan" },
      { label: "Policies & Regulations", href: "/governance/policies" },
      { label: "Service Charter", href: "/governance/service-charter" },
    ],
  },
  {
    label: "Academic Structure",
    icon: <GraduationCap className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Schools & Faculties", href: "/academic/schools" },
      { label: "Programmes", href: "/academic/programmes" },
    ],
  },
  {
    label: "Media",
    icon: <Camera className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Photo & Video Gallery", href: "/media/gallery" },
      { label: "Media Hub", href: "/media-hub" },
      { label: "Press Releases", href: "/media-hub?tab=press_release" },
      { label: "Publications", href: "/media-hub?tab=publication" },
      { label: "Videos", href: "/media-hub?tab=video" },
      { label: "Downloads", href: "/media-hub?tab=download" },
      { label: "Archives", href: "/media-hub?tab=archive" },
    ],
  },
  {
    label: "Contact & Campus",
    icon: <MapPin className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Campuses", href: "/campuses" },
      { label: "Offices & Services", href: "/offices" },
    ],
  },
  {
    label: "Site Controls",
    icon: <ToggleRight className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Homepage Manager", href: "/homepage" },
      { label: "Hero Slides", href: "/hero-slides" },
      { label: "Pages Manager", href: "/pages-manager" },
      { label: "Branding", href: "/branding-settings" },
      { label: "About Page", href: "/site/about" },
      { label: "Student Services", href: "/site/student-services" },
      { label: "Navigation Manager", href: "/navigation" },
      { label: "Banners & Alerts", href: "/site-controls" },
    ],
  },
  {
    label: "SEO & Redirects",
    icon: <ArrowRightLeft className="w-4 h-4" />,
    roles: ADMIN_ROLES,
    children: [
      { label: "Redirect Rules", href: "/redirects" },
      { label: "Site SEO Settings", href: "/site-settings" },
    ],
  },
  {
    label: "Webmaster Console",
    icon: <Gauge className="w-4 h-4" />,
    roles: WEBMASTER_ROLES,
    children: [
      { label: "Content Governance", href: "/webmaster/governance" },
      { label: "Content Freshness", href: "/webmaster/freshness" },
      { label: "Tasks", href: "/webmaster/tasks" },
      { label: "Governance Reports", href: "/webmaster/reports" },
    ],
  },
  {
    label: "Reports",
    icon: <Activity className="w-4 h-4" />,
    roles: REVIEWER_ROLES,
    children: [
      { label: "Workflow Console", href: "/workflow" },
      { label: "Content Health", href: "/content-health" },
      { label: "Content Ownership", href: "/content-ownership", roles: ADMIN_ROLES },
      { label: "Audit Log", href: "/audit" },
    ],
  },
  { label: "Media Library", icon: <Image className="w-4 h-4" />, href: "/media" },
  { label: "Users", icon: <UserCog className="w-4 h-4" />, href: "/users", roles: ADMIN_ROLES },
  { label: "Permissions Matrix", icon: <ShieldCheck className="w-4 h-4" />, href: "/permissions", roles: ADMIN_ROLES },
  { label: "Taxonomy Manager", icon: <Tag className="w-4 h-4" />, href: "/taxonomy", roles: ADMIN_ROLES },
  { label: "Settings", icon: <Settings className="w-4 h-4" />, href: "/settings", roles: ADMIN_ROLES },
];

function NavItemRow({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const [open, setOpen] = useState(() =>
    !!item.children?.some((c) => currentPath.startsWith(c.href.split("?")[0]))
  );
  const { user } = useAuth();

  if (item.roles && user && !item.roles.includes(user.role)) return null;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
          data-testid={`nav-section-${item.label.toLowerCase().replace(/\s/g, "-")}`}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown className="w-3.5 h-3.5 opacity-60" /> : <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
        </button>
        {open && (
          <div className="ml-7 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
            {item.children.map((child) => {
              if (child.roles && user && !child.roles.includes(user.role)) return null;
              const isActive = currentPath === child.href.split("?")[0] ||
                (currentPath === "/content" && child.href === "/content");
              return (
                <Link key={child.href} href={child.href}>
                  <div
                    className={`px-2 py-1.5 rounded text-xs transition-colors ${
                      isActive
                        ? "text-sidebar-primary font-semibold"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    }`}
                    data-testid={`nav-${child.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {child.label}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isActive = item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href!);
  return (
    <Link href={item.href!}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-sidebar-accent text-sidebar-primary font-semibold"
            : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
        }`}
        data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
      >
        {item.icon}
        {item.label}
      </div>
    </Link>
  );
}

export function CmsLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar shadow-xl
        transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <img
            src="/images/uploads/logo-updated-750x126.png"
            alt="KAFU"
            className="h-7 object-contain brightness-0 invert opacity-90"
          />
        </div>

        {/* CMS Label */}
        <div className="px-4 py-2 border-b border-sidebar-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-primary opacity-80">
            CMS & Governance Engine
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => (
            <NavItemRow key={item.label} item={item} currentPath={location} />
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-primary text-xs font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">{user?.role_label}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/70 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            data-testid="btn-logout"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 py-3 bg-white border-b border-border shadow-sm shrink-0">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="lg:hidden p-1.5 rounded text-muted-foreground hover:text-foreground"
            data-testid="btn-toggle-sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">KAFU CMS Administration</p>
          </div>
          <a href="/" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
            <Newspaper className="w-3.5 h-3.5" /> View Site
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
