"use client";

import { useState } from "react";
import { toast } from "sonner";

type SettingsTab = "profile" | "organization" | "security" | "notifications" | "api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "محمد العتيبي",
    email: "m.otaibi@example.com",
    phone: "+966 5x xxx xxxx",
    locale: "ar",
    timezone: "Asia/Riyadh",
  });

  const [org, setOrg] = useState({
    name: "شركة النخبة للتقنية",
    slug: "al-nukhba",
    website: "https://example.com",
    industry: "technology",
    size: "11-50",
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    usageLimitAlerts: true,
    billingAlerts: true,
    productUpdates: false,
    weeklyDigest: true,
  });

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("تم حفظ الإعدادات");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">الإعدادات</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">إدارة ملفك الشخصي وإعدادات الحساب</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {([
            ["profile", "👤", "الملف الشخصي"],
            ["organization", "🏢", "المنظمة"],
            ["security", "🔒", "الأمان"],
            ["notifications", "🔔", "الإشعارات"],
            ["api", "⚡", "API Keys"],
          ] as [SettingsTab, string, string][]).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-right ${
                activeTab === key
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          {activeTab === "profile" && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">الملف الشخصي</h2>
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  م
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.fullName}</p>
                  <p className="text-xs text-gray-400">{profile.email}</p>
                  <button className="text-xs text-purple-600 mt-1 hover:text-purple-700">تغيير الصورة</button>
                </div>
              </div>
              {[
                { label: "الاسم الكامل", key: "fullName", type: "text" },
                { label: "البريد الإلكتروني", key: "email", type: "email" },
                { label: "رقم الهاتف", key: "phone", type: "tel" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={profile[f.key as keyof typeof profile]}
                    onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">اللغة</label>
                  <select
                    value={profile.locale}
                    onChange={(e) => setProfile((p) => ({ ...p, locale: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">المنطقة الزمنية</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="Asia/Riyadh">توقيت الرياض (UTC+3)</option>
                    <option value="Asia/Dubai">توقيت دبي (UTC+4)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "organization" && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">إعدادات المنظمة</h2>
              {[
                { label: "اسم المنظمة", key: "name", type: "text" },
                { label: "معرّف الرابط (Slug)", key: "slug", type: "text" },
                { label: "الموقع الإلكتروني", key: "website", type: "url" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={org[f.key as keyof typeof org]}
                    onChange={(e) => setOrg((o) => ({ ...o, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">القطاع</label>
                  <select value={org.industry} onChange={(e) => setOrg((o) => ({ ...o, industry: e.target.value }))} className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500">
                    <option value="technology">تقنية المعلومات</option>
                    <option value="retail">تجزئة</option>
                    <option value="education">تعليم</option>
                    <option value="healthcare">صحة</option>
                    <option value="finance">مال وأعمال</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">حجم الشركة</label>
                  <select value={org.size} onChange={(e) => setOrg((o) => ({ ...o, size: e.target.value }))} className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500">
                    <option value="1-10">1-10 موظفين</option>
                    <option value="11-50">11-50 موظفاً</option>
                    <option value="51-200">51-200 موظفاً</option>
                    <option value="201+">201+ موظف</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">الأمان وكلمة المرور</h2>
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
                ✓ حسابك محمي بـ JWT وتشفير bcrypt. آخر تسجيل دخول: قبل ساعتين.
              </div>
              {[
                { label: "كلمة المرور الحالية", placeholder: "••••••••" },
                { label: "كلمة المرور الجديدة", placeholder: "8 أحرف على الأقل" },
                { label: "تأكيد كلمة المرور الجديدة", placeholder: "••••••••" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{f.label}</label>
                  <input
                    type="password"
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">الجلسات النشطة</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">Chrome · macOS</p>
                    <p className="text-xs text-gray-400">هذه الجلسة الحالية · الرياض, SA</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">نشطة الآن</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">تفضيلات الإشعارات</h2>
              {[
                { key: "emailReports", label: "تقارير التحليل عبر البريد", desc: "استلام التقارير المكتملة في بريدك" },
                { key: "usageLimitAlerts", label: "تنبيهات حد الاستخدام", desc: "إشعار عند الوصول لـ 80% من الحد" },
                { key: "billingAlerts", label: "تنبيهات الفواتير", desc: "تذكير قبل تجديد الاشتراك بيومين" },
                { key: "productUpdates", label: "تحديثات المنتج", desc: "أخبار الميزات الجديدة والتحسينات" },
                { key: "weeklyDigest", label: "ملخص أسبوعي", desc: "ملخص أداء حسابك كل أسبوع" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{n.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications[n.key as keyof typeof notifications] ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[n.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">مفاتيح API</h2>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
                ⚠️ تعامل مع مفاتيح API كأنها كلمات مرور. لا تشاركها أو تضعها في الكود مباشرة.
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">مفاتيح API قيد التطوير — ستُتاح في الإصدار القادم</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">مفاتيح النماذج المربوطة</h3>
                {[
                  { name: "OpenAI API Key", status: "مربوط", masked: "sk-...8x2f" },
                  { name: "Anthropic API Key", status: "غير مربوط", masked: null },
                ].map((k) => (
                  <div key={k.name} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-xl mb-2">
                    <div>
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{k.name}</p>
                      {k.masked && <p className="text-xs text-gray-400 font-mono">{k.masked}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${k.status === "مربوط" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {k.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
