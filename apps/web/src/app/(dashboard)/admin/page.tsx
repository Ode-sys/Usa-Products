"use client";

import { useState, useEffect } from "react";

interface TenantRow {
  id: string;
  name: string;
  type: string;
  plan: string;
  status: string;
  users: number;
  createdAt: string;
}

const SAMPLE_TENANTS: TenantRow[] = [
  { id: "t1", name: "شركة النخبة للتقنية", type: "CLIENT", plan: "Business", status: "ACTIVE", users: 8, createdAt: "2024-10-01" },
  { id: "t2", name: "وكالة إبداع للتسويق", type: "AGENCY", plan: "Agency", status: "ACTIVE", users: 23, createdAt: "2024-09-15" },
  { id: "t3", name: "مدرسة المستقبل الرقمي", type: "CLIENT", plan: "Individual", status: "TRIAL", users: 3, createdAt: "2025-01-05" },
  { id: "t4", name: "متجر أمازون - ريم", type: "CLIENT", plan: "Business", status: "ACTIVE", users: 2, createdAt: "2024-11-20" },
  { id: "t5", name: "حلول التقارير المتقدمة", type: "CLIENT", plan: "Individual", status: "SUSPENDED", users: 1, createdAt: "2024-08-01" },
];

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  TRIAL: "bg-yellow-100 text-yellow-700",
  SUSPENDED: "bg-red-100 text-red-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function AdminPage() {
  const [tenants, setTenants] = useState<TenantRow[]>(SAMPLE_TENANTS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const filtered = tenants.filter(
    (t) =>
      (filterType === "ALL" || t.type === filterType) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "ACTIVE").length,
    trial: tenants.filter((t) => t.status === "TRIAL").length,
    totalUsers: tenants.reduce((s, t) => s + t.users, 0),
    mrr: tenants
      .filter((t) => t.status === "ACTIVE")
      .reduce((s, t) => s + (t.plan === "Business" ? 99 : t.plan === "Agency" ? 299 : 29), 0),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white text-lg">🛡️</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">إدارة جميع المستأجرين والمنصة</p>
        </div>
        <span className="mr-auto px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full">SUPER ADMIN ACCESS</span>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "إجمالي المستأجرين", value: stats.total, icon: "🏢" },
          { label: "نشطون", value: stats.active, icon: "✅" },
          { label: "تجريبي", value: stats.trial, icon: "⏱️" },
          { label: "إجمالي المستخدمين", value: stats.totalUsers, icon: "👥" },
          { label: "MRR المتوقع", value: `$${stats.mrr}`, icon: "💰" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="بحث بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-purple-500 w-56"
        />
        {["ALL", "CLIENT", "AGENCY"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-2 text-xs rounded-xl border transition-colors ${
              filterType === t
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700"
                : "border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300"
            }`}
          >
            {t === "ALL" ? "الكل" : t === "CLIENT" ? "عملاء" : "وكالات"}
          </button>
        ))}
        <button className="mr-auto text-sm px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
          + مستأجر جديد
        </button>
      </div>

      {/* Tenants table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["الاسم", "النوع", "الخطة", "الحالة", "المستخدمون", "تاريخ الإنشاء", "إجراءات"].map((h) => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((t) => (
              <tr key={t.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{t.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.type === "AGENCY" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                    {t.type === "AGENCY" ? "وكالة" : "عميل"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{t.plan}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[t.status] ?? ""}`}>
                    {t.status === "ACTIVE" ? "نشط" : t.status === "TRIAL" ? "تجريبي" : t.status === "SUSPENDED" ? "موقوف" : t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.users}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{t.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">عرض</button>
                    <button className="text-xs text-orange-500 hover:text-orange-600 font-medium">تعديل</button>
                    <button
                      onClick={() =>
                        setTenants((prev) =>
                          prev.map((r) =>
                            r.id === t.id
                              ? { ...r, status: r.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" }
                              : r
                          )
                        )
                      }
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      {t.status === "SUSPENDED" ? "تفعيل" : "تعليق"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit log section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">سجل المراجعة الأخير</h2>
        <div className="space-y-2">
          {[
            { action: "USER_LOGIN", user: "m.otaibi@example.com", tenant: "شركة النخبة", time: "منذ دقيقتين", color: "text-green-600" },
            { action: "REPORT_GENERATED", user: "sara@example.com", tenant: "وكالة إبداع", time: "منذ 15 دقيقة", color: "text-blue-600" },
            { action: "SUBSCRIPTION_UPDATED", user: "system", tenant: "مدرسة المستقبل", time: "منذ ساعة", color: "text-orange-600" },
            { action: "FILE_UPLOADED", user: "noura@example.com", tenant: "متجر أمازون", time: "منذ 3 ساعات", color: "text-purple-600" },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs">
              <span className={`font-mono font-bold ${log.color}`}>{log.action}</span>
              <span className="text-gray-500">{log.user}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600 dark:text-gray-400">{log.tenant}</span>
              <span className="mr-auto text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
