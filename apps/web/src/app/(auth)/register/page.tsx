"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", organizationName: "", locale: "ar",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error?.message ?? "خطأ في إنشاء الحساب"); return; }
      toast.success("تم إنشاء الحساب! سجّل دخولك الآن.");
      router.push("/login");
    } catch {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold">Odé AI</span>
          </div>
          <p className="text-white/50 mt-2 text-sm">أنشئ حسابك وابدأ مجانًا</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white mb-6">إنشاء حساب جديد</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">اسمك الكامل</label>
              <input type="text" required value={form.fullName} onChange={set("fullName")}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="محمد أحمد" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">اسم الشركة / الوكالة</label>
              <input type="text" required value={form.organizationName} onChange={set("organizationName")}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="شركة الفجر للتسويق" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">البريد الإلكتروني</label>
              <input type="email" required value={form.email} onChange={set("email")}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@company.com" dir="ltr" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={form.password} onChange={set("password")}
                  minLength={8}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  placeholder="8 أحرف على الأقل" dir="ltr" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-all py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
            </button>

            <p className="text-xs text-white/40 text-center">
              بالتسجيل تقبل <a href="#" className="text-purple-400">شروط الاستخدام</a> و<a href="#" className="text-purple-400">سياسة الخصوصية</a>
            </p>
          </form>

          <p className="text-center text-sm text-white/50 mt-4">
            لديك حساب؟{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">سجّل دخولك</Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          14 يومًا تجريبية مجانية · بدون بطاقة ائتمان
        </p>
      </div>
    </div>
  );
}
