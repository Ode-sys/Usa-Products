"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

type TabKey = "upload" | "datasets" | "dashboards";

interface Dataset {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
  createdAt: string;
}

const SAMPLE_DATASETS: Dataset[] = [
  { id: "1", name: "مبيعات Q4 2024", rowCount: 1240, columnCount: 12, createdAt: "2025-01-15" },
  { id: "2", name: "تقرير العملاء الشهري", rowCount: 380, columnCount: 8, createdAt: "2025-01-10" },
];

export default function ReportingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [datasets] = useState<Dataset[]>(SAMPLE_DATASETS);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const allowed = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (!allowed.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      toast.error("يُقبل فقط CSV أو XLSX");
      return;
    }
    setUploading(true);
    setAnalysisResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setAnalysisResult(`تحليل ملف "${file.name}":

📊 إجمالي الصفوف: 1,247 صف
📋 الأعمدة: المنتج، المبيعات، الكمية، التاريخ، المنطقة، العميل

🔍 الملاحظات الرئيسية:
• ارتفاع في المبيعات بنسبة 23% مقارنة بالفترة السابقة
• المنطقة الشمالية تتصدر بحصة 38% من الإجمالي
• 3 منتجات تمثل 67% من الإيرادات
• انخفاض في متوسط قيمة الطلب في ديسمبر

💡 التوصيات:
1. تعزيز المخزون للمنتجات عالية الأداء
2. مراجعة سياسة التسعير في المناطق الضعيفة
3. تحليل أسباب انخفاض ديسمبر

تم إنشاء لوحة تحكم تلقائية بـ 5 رسوم بيانية.`);
    setUploading(false);
    toast.success("تم تحليل الملف بنجاح");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white text-lg">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reporting AI</h1>
          <span className="px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 rounded-full">نشط</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">ارفع أي ملف بيانات واحصل على تحليل ذكي ولوحات تحكم فورية</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {([["upload", "رفع وتحليل"], ["datasets", "مجموعات البيانات"], ["dashboards", "لوحات التحكم"]] as [TabKey, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === key
                  ? "border-teal-500 text-teal-600 dark:text-teal-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {activeTab === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload panel */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragOver ? "border-teal-400 bg-teal-50 dark:bg-teal-900/10" : "border-gray-300 dark:border-gray-600 hover:border-teal-400"
              }`}
            >
              <div className="text-4xl mb-3">{uploading ? "⏳" : "📂"}</div>
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                {uploading ? "جاري التحليل..." : "اسحب الملف هنا أو انقر للاختيار"}
              </p>
              <p className="text-xs text-gray-400 mt-1">CSV, XLSX — حتى 50MB</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: "📈", label: "رسوم بيانية تلقائية" },
                { icon: "🤖", label: "تحليل ذكاء اصطناعي" },
                { icon: "📄", label: "تصدير PDF / XLSX" },
              ].map((f) => (
                <div key={f.label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-xl mb-1">{f.icon}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis output */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 min-h-[300px]">
            {analysisResult ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">نتائج التحليل</h3>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                      تصدير PDF
                    </button>
                    <button className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      حفظ
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
                  {analysisResult}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <div className="text-3xl mb-3 opacity-30">📊</div>
                <p className="text-sm text-gray-400">ارفع ملفاً لعرض التحليل هنا</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "datasets" && (
        <div className="space-y-3">
          {datasets.map((ds) => (
            <div key={ds.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 text-lg">📋</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{ds.name}</p>
                  <p className="text-xs text-gray-400">{ds.rowCount.toLocaleString()} صف · {ds.columnCount} عمود · {ds.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700">تحليل</button>
                <button className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">عرض</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "dashboards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "مبيعات Q4 2024", charts: 5, updated: "منذ 3 أيام" },
            { name: "أداء العملاء", charts: 4, updated: "منذ أسبوع" },
          ].map((d) => (
            <div key={d.name} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer hover:border-teal-400 transition-colors">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{d.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{d.charts} رسم بياني · آخر تحديث: {d.updated}</p>
              <button className="mt-3 text-xs text-teal-600 hover:text-teal-700 font-medium">فتح اللوحة ←</button>
            </div>
          ))}
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-teal-400 transition-colors">
            <div className="text-2xl mb-2 opacity-40">+</div>
            <p className="text-sm text-gray-400">لوحة جديدة</p>
          </div>
        </div>
      )}
    </div>
  );
}
