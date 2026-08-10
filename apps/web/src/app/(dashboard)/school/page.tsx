"use client";

import { useState } from "react";

type SchoolTab = "students" | "attendance" | "payments" | "programs";

interface Student {
  id: string;
  name: string;
  grade: string;
  guardian: string;
  phone: string;
  status: "active" | "inactive";
  paidUntil: string;
}

const SAMPLE_STUDENTS: Student[] = [
  { id: "1", name: "يوسف المطيري", grade: "الصف الثالث", guardian: "فيصل المطيري", phone: "05x-xxx-1234", status: "active", paidUntil: "2025-06-30" },
  { id: "2", name: "لينا الحربي", grade: "الصف الأول", guardian: "منى الحربي", phone: "05x-xxx-5678", status: "active", paidUntil: "2025-03-31" },
  { id: "3", name: "خالد السهلي", grade: "الصف الثاني", guardian: "ناصر السهلي", phone: "05x-xxx-9012", status: "inactive", paidUntil: "2024-12-31" },
  { id: "4", name: "ريم العتيبي", grade: "الصف الأول", guardian: "أمل العتيبي", phone: "05x-xxx-3456", status: "active", paidUntil: "2025-06-30" },
];

const GRADES = ["الكل", "الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع"];

export default function SchoolPage() {
  const [activeTab, setActiveTab] = useState<SchoolTab>("students");
  const [students] = useState<Student[]>(SAMPLE_STUDENTS);
  const [selectedGrade, setSelectedGrade] = useState("الكل");

  const filtered = selectedGrade === "الكل" ? students : students.filter((s) => s.grade === selectedGrade);
  const activeCount = students.filter((s) => s.status === "active").length;
  const overdueCount = students.filter((s) => new Date(s.paidUntil) < new Date() && s.status === "active").length;

  const today = new Date().toLocaleDateString("ar-SA");
  const attendanceData = filtered.map((s) => ({
    ...s,
    present: Math.random() > 0.2,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white text-lg">🏫</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School AI</h1>
          <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">نشط</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">إدارة الطلاب، الحضور، المدفوعات، والبرامج التعليمية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "إجمالي الطلاب", value: students.length, icon: "👨‍🎓", color: "#22c55e" },
          { label: "الطلاب النشطون", value: activeCount, icon: "✅", color: "#3b82f6" },
          { label: "رسوم متأخرة", value: overdueCount, icon: "⚠️", color: "#f97316" },
          { label: "البرامج النشطة", value: 3, icon: "📚", color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {([["students", "الطلاب"], ["attendance", "الحضور والغياب"], ["payments", "المدفوعات"], ["programs", "البرامج"]] as [SchoolTab, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === key
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Grade filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {GRADES.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              selectedGrade === g
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                : "border-gray-200 dark:border-gray-600 text-gray-500 hover:border-gray-300"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {activeTab === "students" && (
        <div>
          <div className="flex justify-end mb-3">
            <button className="text-sm px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">+ إضافة طالب</button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["اسم الطالب", "الصف", "ولي الأمر", "الهاتف", "الحالة", "مدفوع حتى"].map((h) => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((s) => (
                  <tr key={s.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.grade}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{s.guardian}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {s.status === "active" ? "نشط" : "غير نشط"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      <span className={new Date(s.paidUntil) < new Date() ? "text-red-500 font-medium" : ""}>{s.paidUntil}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">الحضور ليوم: {today}</p>
            <button className="text-sm px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">حفظ الحضور</button>
          </div>
          <div className="space-y-2">
            {attendanceData.map((s) => (
              <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.grade}</p>
                </div>
                <div className="flex gap-2">
                  <button className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-colors ${s.present ? "bg-green-600 text-white" : "border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-green-50"}`}>
                    حاضر
                  </button>
                  <button className={`px-4 py-1.5 text-xs rounded-lg font-medium transition-colors ${!s.present ? "bg-red-500 text-white" : "border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-red-50"}`}>
                    غائب
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="space-y-3">
          {filtered.map((s) => {
            const isOverdue = new Date(s.paidUntil) < new Date();
            return (
              <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${isOverdue ? "bg-red-500" : "bg-green-500"}`}>
                    {s.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.grade}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">مدفوع حتى</p>
                  <p className={`text-sm font-medium ${isOverdue ? "text-red-500" : "text-green-600"}`}>{s.paidUntil}</p>
                </div>
                <div className="flex gap-2">
                  {isOverdue && (
                    <button className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                      إشعار تذكير
                    </button>
                  )}
                  <button className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    تسجيل دفعة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "programs" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "البرنامج الأساسي", price: "800 SAR / شهر", students: 18, color: "#22c55e" },
            { name: "برنامج المتقدم", price: "1,200 SAR / شهر", students: 9, color: "#3b82f6" },
            { name: "برنامج الإثراء", price: "500 SAR / شهر", students: 6, color: "#8b5cf6" },
          ].map((p) => (
            <div key={p.name} className="bg-white dark:bg-gray-900 border rounded-xl p-5" style={{ borderColor: p.color + "40" }}>
              <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: p.color }}>
                <span className="text-white text-sm">📚</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{p.price}</p>
              <p className="text-xs text-gray-400">{p.students} طالب مسجّل</p>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 text-xs py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">تفاصيل</button>
                <button className="flex-1 text-xs py-1.5 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: p.color }}>تسجيل</button>
              </div>
            </div>
          ))}
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors">
            <span className="text-2xl mb-2 opacity-40">+</span>
            <p className="text-sm text-gray-400">برنامج جديد</p>
          </div>
        </div>
      )}
    </div>
  );
}
