"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error?.message ?? "خطأ في تسجيل الدخول"); return; }

      // Store tokens
      localStorage.setItem("ode_access_token", data.data.accessToken);
      localStorage.setItem("ode_refresh_token", data.data.refreshToken);
      localStorage.setItem("ode_user", JSON.stringify(data.data.user));

      toast.success(`مرحبًا ${data.data.user.fullName}!`);
      router.push("/dashboard");
    } catch {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold">Odé AI</span>
          </div>
          <p className="text-white/50 mt-2 text-sm">سجّل دخولك للمتابعة</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white mb-6">تسجيل الدخول</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="you@company.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pr-12"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-left mt-1">
                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">نسيت كلمة المرور؟</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="text-center text-sm text-white/50 mt-6">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">أنشئ حسابًا مجانًا</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
