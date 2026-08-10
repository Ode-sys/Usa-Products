"use client";

import { useState } from "react";
import { Package, Upload, FileText, TrendingUp, AlertTriangle, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";

const reportTypes = [
  { value: "WBR",               label: "تقرير WBR الأسبوعي",         desc: "ملخص أداء البراند الأسبوعي" },
  { value: "ASIN_PERFORMANCE",  label: "تحليل ASIN",                  desc: "أداء كل منتج بشكل مفصّل" },
  { value: "PROFIT_LOSS",       label: "الأرباح والخسائر P&L",        desc: "تحليل مالي شامل" },
  { value: "INVENTORY_FORECAST",label: "توقع المخزون",                desc: "متى تطلب؟ وكم تطلب؟" },
  { value: "ADS_ANALYSIS",      label: "تحليل الإعلانات",              desc: "ACoS, ROAS, أداء الكلمات" },
];

export default function AmazonPage() {
  const [selectedReport, setSelectedReport] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedReport) { toast.error("اختر نوع التقرير"); return; }
    if (!file) { toast.error("ارفع الملف أولًا"); return; }

    setGenerating(true);
    setReport(null);

    // MVP: simulate parsing + AI analysis
    try {
      await new Promise((r) => setTimeout(r, 2000)); // simulate processing
      setReport(`## ${reportTypes.find((r) => r.value === selectedReport)?.label}\n\n**ملاحظة:** هذا تقرير تجريبي. في النسخة الكاملة سيتم تحليل ملفك الفعلي بالذكاء الاصطناعي.\n\n---\n\n### ملخص الأداء\n\nلم يتم رفع بيانات حقيقية بعد — هذا مثال على شكل التقرير.\n\n### التوصيات\n1. ربط قاعدة البيانات بـ PostgreSQL\n2. رفع ملف CSV/XLSX حقيقي\n3. تفعيل OpenAI API Key\n\nسيتم توليد التقرير الحقيقي بعد اكتمال الإعداد.`);
      toast.success("تم توليد التقرير!");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Amazon AI</h1>
          <p className="text-muted-foreground text-sm">تحليل بيانات بائع أمازون بالذكاء الاصطناعي</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "تقارير هذا الشهر", value: "0", icon: FileText,    color: "text-orange-500" },
          { label: "ملفات مرفوعة",     value: "0", icon: Upload,       color: "text-blue-500" },
          { label: "ASINs محللة",      value: "0", icon: TrendingUp,   color: "text-green-500" },
          { label: "تنبيهات مخزون",    value: "0", icon: AlertTriangle, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Report Generator */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-500" />
            رفع ملف أمازون
          </h2>

          {/* Report type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">نوع التقرير</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">اختر نوع التقرير...</option>
              {reportTypes.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {selectedReport && (
              <p className="text-xs text-muted-foreground mt-1">
                {reportTypes.find((r) => r.value === selectedReport)?.desc}
              </p>
            )}
          </div>

          {/* File upload */}
          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm font-medium">{file ? file.name : "اسحب الملف أو اضغط للرفع"}</p>
            <p className="text-xs text-muted-foreground mt-1">CSV, XLSX, TXT — أي تقرير من Amazon Seller Central</p>
            <input id="file-upload" type="file" accept=".csv,.xlsx,.txt" className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !selectedReport || !file}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" />جارٍ التحليل...</> : <><BarChart3 className="w-4 h-4" />ولّد التقرير</>}
          </button>
        </div>

        {/* Report Output */}
        <div className="bg-card border border-border rounded-2xl p-6 min-h-64">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            نتيجة التحليل
          </h2>
          {generating && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-orange-500" />
              <p>الذكاء الاصطناعي يحلل بياناتك...</p>
            </div>
          )}
          {!generating && !report && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Package className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">ارفع ملفك واختر نوع التقرير لتبدأ</p>
            </div>
          )}
          {report && (
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm leading-relaxed">
              {report}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
