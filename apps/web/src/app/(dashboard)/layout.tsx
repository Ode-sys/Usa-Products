"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Brain, BarChart3, Package, Pencil, Building2, School,
  LayoutDashboard, Settings, CreditCard, Users, Bell,
  LogOut, ChevronLeft, Shield, Menu, X
} from "lucide-react";

const navItems = [
  { href: "/dashboard",  label: "لوحة التحكم", icon: LayoutDashboard, always: true },
  { href: "/amazon",     label: "Amazon AI",   icon: Package,         module: "AMAZON_AI" },
  { href: "/reporting",  label: "Reporting AI", icon: BarChart3,      module: "REPORTING_AI" },
  { href: "/content",    label: "Content AI",  icon: Pencil,          module: "CONTENT_AI" },
  { href: "/business",   label: "Business AI", icon: Building2,       module: "BUSINESS_AI" },
  { href: "/school",     label: "School AI",   icon: School,          module: "SCHOOL_AI" },
];

const bottomItems = [
  { href: "/users",    label: "المستخدمون",  icon: Users },
  { href: "/billing",  label: "الاشتراكات",  icon: CreditCard },
  { href: "/settings", label: "الإعدادات",   icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName: string; email: string; role: string; moduleAccess: string[] } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ode_access_token");
    if (!token) { router.push("/login"); return; }
    const stored = localStorage.getItem("ode_user");
    if (stored) setUser(JSON.parse(stored));
  }, [router]);

  const logout = () => {
    const refreshToken = localStorage.getItem("ode_refresh_token");
    fetch("/api/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }), headers: { "Content-Type": "application/json" } });
    localStorage.clear();
    router.push("/login");
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const moduleAccess = user?.moduleAccess ?? [];
  const isSuper = user?.role === "SUPER_ADMIN";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        <Brain className="w-6 h-6 text-purple-500 flex-shrink-0" />
        {sidebarOpen && <span className="font-bold text-lg">Odé AI</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          if (!item.always && item.module && !moduleAccess.includes(item.module) && !isSuper) {
            return (
              <div key={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground/40 cursor-not-allowed">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </div>
            );
          }
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${isActive(item.href) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}

        {isSuper && (
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${isActive("/admin") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}>
            <Shield className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Super Admin</span>}
          </Link>
        )}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-border py-2 px-2 space-y-1">
        {bottomItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive(item.href) ? "bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && <span>تسجيل الخروج</span>}
        </button>
      </div>

      {/* User info */}
      {sidebarOpen && user && (
        <div className="border-t border-border px-3 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-sm flex-shrink-0">
            {user.fullName?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{user.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 border-l border-border bg-card transition-all duration-200 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarContent />
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 right-0 translate-x-1/2 z-10 w-5 h-5 bg-border rounded-full flex items-center justify-center hover:bg-accent-foreground/10 hidden lg:flex">
          <ChevronLeft className={`w-3 h-3 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-64 bg-card border-l border-border">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-accent">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-accent">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
