import { Link, useLocation } from "wouter";
import { Book, LayoutTemplate, Box, FileText, Users, Shield, Search, Accessibility, BarChart, Menu, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { path: "/", label: "Overview", icon: Book },
  { path: "/design-system", label: "Design System", icon: LayoutTemplate },
  { path: "/components", label: "Component Inventory", icon: Box },
  { path: "/cms-governance", label: "CMS Governance", icon: FileText },
  { path: "/roles-permissions", label: "Roles & Permissions", icon: Users },
  { path: "/security", label: "Security Baseline", icon: Shield },
  { path: "/seo", label: "SEO Framework", icon: Search },
  { path: "/accessibility", label: "Accessibility", icon: Accessibility },
  { path: "/analytics", label: "Analytics Event Map", icon: BarChart },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem = navItems.find((item) => item.path === location) || navItems[0];

  return (
    <div className="flex min-h-[100dvh] w-full flex-col md:flex-row bg-background print:bg-white">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card print:hidden">
        <span className="font-serif font-bold text-lg text-primary">KAFU Foundation</span>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} data-testid="btn-toggle-sidebar">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 print:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-primary-foreground font-serif font-bold text-xl">
              K
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-card-foreground leading-tight">KAFU Digital</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Foundation Layer</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path} onClick={() => setSidebarOpen(false)}>
                  <div
                    data-testid={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
        <div className="flex-1 overflow-y-auto print:overflow-visible scroll-smooth">
          <div className="container max-w-5xl mx-auto py-12 px-4 md:px-8 lg:px-12 print:py-0 print:px-0">
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center text-sm text-muted-foreground mb-8 print:hidden">
              <span>Foundation Layer</span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-foreground font-medium">{activeItem.label}</span>
            </div>
            
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
