import Link from "next/link";
import { ArrowLeft, BarChart3, Brain, Building2, Package, Pencil, School } from "lucide-react";

const modules = [
  { key: "content",   icon: Pencil,    name: "Content AI",   nameAr: "الذكاء الاصطناعي للمحتوى",  color: "bg-purple-500", desc: "توليد محتوى احترافي، جدولة، نشر تلقائي" },
  { key: "amazon",    icon: Package,   name: "Amazon AI",    nameAr: "الذكاء الاصطناعي لأمازون",  color: "bg-orange-500", desc: "تقارير WBR، تحليل ASIN، توقع المخزون، P&L" },
  { key: "business",  icon: Building2, name: "Business AI",  nameAr: "الذكاء الاصطناعي للأعمال",  color: "bg-blue-500",   desc: "CRM، صفقات، مهام، مساعد أعمال ذكي" },
  { key: "school",    icon: School,    name: "School AI",    nameAr: "الذكاء الاصطناعي للمدارس",  color: "bg-green-500",  desc: "طلاب، حضور، أقساط، تقارير، رسائل" },
  { key: "reporting", icon: BarChart3, name: "Reporting AI", nameAr: "الذكاء الاصطناعي للتقارير", color: "bg-teal-500",   desc: "رفع Excel/CSV وتحليله بالذكاء الاصطناعي" },
];

const plans = [
  { name: "فردي",  price: 29,  desc: "1 مستخدم، وحدة واحدة",  popular: false },
  { name: "أعمال", price: 99,  desc: "5 مستخدمين، 3 وحدات",   popular: true },
  { name: "وكالة", price: 299, desc: "مستخدمون غير محدودون",   popular: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white" dir="rtl">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-400" />
            <span className="font-bold text-xl">Odé AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#modules" className="hover:text-white transition-colors">الوحدات</a>
            <a href="#pricing" className="hover:text-white transition-colors">الأسعار</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">تسجيل الدخول</Link>
            <Link href="/register" className="bg-purple-600 hover:bg-purple-500 transition-colors px-5 py-2 rounded-lg text-sm font-semibold">
              ابدأ مجانًا
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-8">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            منصة SaaS متعددة الوحدات
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            الذكاء الاصطناعي<br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              لكل احتياجات أعمالك
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            منصة واحدة، حساب واحد، 5 وحدات ذكاء اصطناعي مستقلة. اختر ما تحتاجه وفعّله بنقرة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-purple-600 hover:bg-purple-500 transition-all px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 justify-center">
              ابدأ تجربتك المجانية <ArrowLeft className="w-5 h-5" />
            </Link>
            <a href="#modules" className="border border-white/20 hover:border-white/40 transition-all px-8 py-4 rounded-xl font-semibold text-lg">
              استكشف الوحدات
            </a>
          </div>
          <p className="text-sm text-white/40 mt-4">14 يومًا مجانًا · بدون بطاقة ائتمان · إلغاء في أي وقت</p>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">5 وحدات ذكاء اصطناعي متخصصة</h2>
            <p className="text-white/50">كل وحدة مستقلة — فعّلها أو أوقفها متى تريد</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <div key={mod.key} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                <div className={`w-12 h-12 ${mod.color} rounded-xl flex items-center justify-center mb-4`}>
                  <mod.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">{mod.nameAr}</h3>
                <p className="text-sm text-white/50 mb-3">{mod.name}</p>
                <p className="text-sm text-white/60">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">أسعار واضحة وشفافة</h2>
            <p className="text-white/50">ادفع فقط على ما تستخدمه</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-6 border ${plan.popular ? "bg-purple-600 border-purple-400" : "bg-white/5 border-white/10"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    الأكثر شيوعًا
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-sm text-white/60 mb-4">{plan.desc}</p>
                <div className="text-4xl font-bold mb-1">${plan.price}<span className="text-lg font-normal text-white/50">/شهر</span></div>
                <Link href="/register" className={`mt-6 block text-center py-3 rounded-xl font-semibold transition-all ${plan.popular ? "bg-white text-purple-700 hover:bg-white/90" : "bg-purple-600 hover:bg-purple-500"}`}>
                  ابدأ الآن
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4 text-center text-white/40 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-white/60">Odé AI Platform</span>
        </div>
        <p>© {new Date().getFullYear()} Odé AI. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
