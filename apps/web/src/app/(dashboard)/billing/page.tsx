"use client";

import { useState, useEffect } from "react";

interface Plan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  interval: string;
  modules: string[];
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "individual",
    name: "Individual",
    nameAr: "الفردي",
    price: 29,
    interval: "شهرياً",
    modules: ["Reporting AI (أساسي)", "Amazon AI (أساسي)"],
  },
  {
    id: "business",
    name: "Business",
    nameAr: "الأعمال",
    price: 99,
    interval: "شهرياً",
    highlight: true,
    modules: ["Reporting AI (كامل)", "Amazon AI (كامل)", "Content AI", "Business AI"],
  },
  {
    id: "agency",
    name: "Agency",
    nameAr: "الوكالة",
    price: 299,
    interval: "شهرياً",
    modules: ["جميع الوحدات", "حسابات متعددة", "وصول API", "مدير حساب مخصص"],
  },
];

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "open" | "void";
  plan: string;
}

const SAMPLE_INVOICES: Invoice[] = [
  { id: "INV-2025-003", date: "2025-01-01", amount: "99.00 USD", status: "paid", plan: "Business Plan" },
  { id: "INV-2024-012", date: "2024-12-01", amount: "99.00 USD", status: "paid", plan: "Business Plan" },
  { id: "INV-2024-011", date: "2024-11-01", amount: "99.00 USD", status: "paid", plan: "Business Plan" },
];

export default function BillingPage() {
  const [currentPlan] = useState("business");
  const [invoices] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch("/api/subscriptions/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Portal redirect
    } finally {
      setLoading(false);
    }
  }

  async function upgrade(planId: string) {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Checkout redirect
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">الاشتراك والفواتير</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">إدارة خطة الاشتراك وتاريخ الفواتير</p>
      </div>

      {/* Current plan */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-purple-200 text-sm mb-1">الخطة الحالية</p>
            <h2 className="text-2xl font-bold mb-1">Business Plan</h2>
            <p className="text-purple-200 text-sm">99.00 USD / شهرياً · التجديد في 1 فبراير 2025</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-center">نشط ✓</span>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={openPortal}
            disabled={loading}
            className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-xl text-sm hover:bg-purple-50 transition-colors"
          >
            {loading ? "جارٍ التحميل..." : "إدارة الاشتراك"}
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors border border-white/30">
            تحميل الفاتورة
          </button>
        </div>
      </div>

      {/* Plans comparison */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الخطط المتاحة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl p-5 border ${
                plan.highlight
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-0.5 rounded-full font-semibold">
                  الأكثر شيوعاً
                </div>
              )}
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{plan.nameAr}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                <span className="text-sm text-gray-400">{plan.interval}</span>
              </div>
              <ul className="space-y-1.5 mb-4">
                {plan.modules.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {m}
                  </li>
                ))}
              </ul>
              {currentPlan === plan.id ? (
                <button disabled className="w-full py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                  الخطة الحالية
                </button>
              ) : (
                <button
                  onClick={() => upgrade(plan.id)}
                  disabled={loading}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "border border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                  }`}
                >
                  {plan.price > 99 ? "ترقية" : plan.price < 99 ? "تخفيض" : "الانتقال"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoice history */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">سجل الفواتير</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["رقم الفاتورة", "التاريخ", "الخطة", "المبلغ", "الحالة", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400 text-xs">{inv.id}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{inv.date}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{inv.plan}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === "paid" ? "bg-green-100 text-green-700" :
                      inv.status === "open" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {inv.status === "paid" ? "مدفوعة" : inv.status === "open" ? "مفتوحة" : "ملغاة"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">تحميل PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
