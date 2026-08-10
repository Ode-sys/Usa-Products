"use client";

import { useEffect, useState } from "react";
import { BarChart3, Brain, Package, Pencil, Building2, School, TrendingUp, Users, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ModuleCard {
  key: string;
  name: string;
  icon: React.ElementType;
  color: string;
  href: string;
  active: boolean;
  stat?: string;
  statLabel?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ fullName: string; role: string; moduleAccess: string[] } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ode_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const moduleAccess = user?.moduleAccess ?? [];

  const modules: ModuleCard[] = [
    { key: "AMAZON_AI",    name: "Amazon AI",    icon: Package,   color: "bg-orange-500", href: "/amazon",    active: moduleAccess.includes("AMAZON_AI"),    stat: "—",  statLabel: "تقارير هذا الشهر" },
    { key: "REPORTING_AI", name: "Reporting AI", icon: BarChart3, color: "bg-teal-500",   href: "/reporting", active: moduleAccess.includes("REPORTING_AI"), stat: "—",  statLabel: "مجموعات بيانات" },
    { key: "CONTENT_AI",   name: "Content AI",   icon: Pencil,    color: "bg-purple-500", href: "/content",   active: moduleAccess.includes("CONTENT_AI"),   stat: "—",  statLabel: "منشورات" },
    { key: "BUSINESS_AI",  name: "Business AI",  icon: Building2, color: "bg-blue-500",   href: "/business",  active: moduleAccess.includes("BUSINESS_AI"),  stat: "—",  statLabel: "صفقات نشطة" },
    { key: "SCHOOL_AI",    name: "School AI",    icon: School,    color: "bg-green-500",  href: "/school",    active: moduleAccess.includes("SCHOOL_AI"),    stat: "—",  statLabel: "طلاب" },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-7 h-7" />
          <h1 className="text-2xl font-bold">مرحبًا، {user?.fullName?.split(" ")[0] ?? "..."}</h1>
        </div>
        <p className="text-white/70">منصة Odé AI جاهزة — اختر الوحدة التي تريد البدء بها</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "وحدات نشطة",    value: moduleAccess.length, icon: Brain,    color: "text-purple-500" },
          { label: "طلبات AI اليوم", value: 0,                   icon: TrendingUp, color: "text-blue-500" },
          { label: "المستخدمون",     value: 1,                   icon: Users,    color: "text-green-500" },
          { label: "التقارير",       value: 0,                   icon: FileText, color: "text-orange-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">وحداتك</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div key={mod.key} className={`relative border border-border rounded-2xl p-6 transition-all ${mod.active ? "bg-card hover:shadow-lg cursor-pointer" : "bg-muted/30 opacity-60"}`}>
              {!mod.active && (
                <div className="absolute top-3 left-3">
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> غير مفعّل
                  </span>
                </div>
              )}
              <div className={`w-10 h-10 ${mod.color} rounded-xl flex items-center justify-center mb-4`}>
                <mod.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">{mod.name}</h3>
              <p className="text-2xl font-bold text-foreground mb-0.5">{mod.stat}</p>
              <p className="text-xs text-muted-foreground">{mod.statLabel}</p>
              {mod.active ? (
                <Link href={mod.href} className="mt-4 block text-center text-sm bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded-lg transition-colors">
                  فتح الوحدة
                </Link>
              ) : (
                <Link href="/billing" className="mt-4 block text-center text-sm bg-muted hover:bg-muted/80 text-muted-foreground py-2 rounded-lg transition-colors">
                  تفعيل من السوق
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">النشاط الأخير</h2>
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">لا يوجد نشاط بعد — ابدأ باستخدام إحدى الوحدات</p>
        </div>
      </div>
    </div>
  );
}
