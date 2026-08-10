"use client";

import { useState } from "react";

type BizTab = "contacts" | "deals" | "tasks" | "assistant";

interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  stage: string;
  value: number;
}

const SAMPLE_CONTACTS: Contact[] = [
  { id: "1", name: "أحمد الزهراني", company: "شركة النخبة", email: "ahmed@example.com", stage: "عميل محتمل", value: 25000 },
  { id: "2", name: "سارة العمري", company: "مجموعة الرياض", email: "sara@example.com", stage: "قيد التفاوض", value: 68000 },
  { id: "3", name: "محمد الغامدي", company: "التقنية الحديثة", email: "m.ghamdi@example.com", stage: "عرض مُرسَل", value: 15000 },
  { id: "4", name: "نورة القحطاني", company: "حلول المستقبل", email: "noura@example.com", stage: "مُغلَق فائز", value: 42000 },
];

const DEAL_STAGES = ["عميل محتمل", "عرض مُرسَل", "قيد التفاوض", "مُغلَق فائز", "مُغلَق خاسر"];
const STAGE_COLORS: Record<string, string> = {
  "عميل محتمل": "bg-gray-100 text-gray-600",
  "عرض مُرسَل": "bg-blue-100 text-blue-700",
  "قيد التفاوض": "bg-yellow-100 text-yellow-700",
  "مُغلَق فائز": "bg-green-100 text-green-700",
  "مُغلَق خاسر": "bg-red-100 text-red-600",
};

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState<BizTab>("contacts");
  const [contacts] = useState<Contact[]>(SAMPLE_CONTACTS);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [thinking, setThinking] = useState(false);

  const totalValue = contacts.reduce((s, c) => s + c.value, 0);
  const wonDeals = contacts.filter((c) => c.stage === "مُغلَق فائز");

  async function sendToAssistant() {
    if (!assistantInput.trim()) return;
    const userMsg = assistantInput;
    setAssistantMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAssistantInput("");
    setThinking(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAssistantMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: `بناءً على تحليل بيانات CRM الخاصة بك:\n\n📊 لديك ${contacts.length} جهة اتصال بإجمالي قيمة SAR ${totalValue.toLocaleString()}\n\n💡 توصيتي: التركيز على الصفقات في مرحلة "قيد التفاوض" — لديها أعلى احتمالية إغلاق في الـ 30 يوماً القادمة.\n\nهل تريد مني إعداد نص متابعة لجهة اتصال محددة؟`,
      },
    ]);
    setThinking(false);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg">💼</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business AI</h1>
          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">نشط</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">CRM ذكي · عروض وفواتير · مساعد أعمال بالذكاء الاصطناعي</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "جهات الاتصال", value: contacts.length, icon: "👥", color: "#3b82f6" },
          { label: "قيمة خط المبيعات", value: `${(totalValue / 1000).toFixed(0)}K SAR`, icon: "💰", color: "#8b5cf6" },
          { label: "صفقات فائزة", value: wonDeals.length, icon: "🏆", color: "#22c55e" },
          { label: "نسبة التحويل", value: `${Math.round((wonDeals.length / contacts.length) * 100)}%`, icon: "📈", color: "#f97316" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {([["contacts", "جهات الاتصال"], ["deals", "خط المبيعات"], ["tasks", "المهام"], ["assistant", "المساعد الذكي"]] as [BizTab, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === key
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {activeTab === "contacts" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{contacts.length} جهة اتصال</p>
            <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">+ إضافة جهة اتصال</button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["الاسم", "الشركة", "البريد", "المرحلة", "القيمة"].map((h) => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {contacts.map((c) => (
                  <tr key={c.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.company}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[c.stage] ?? ""}`}>{c.stage}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{c.value.toLocaleString()} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "deals" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DEAL_STAGES.map((stage) => {
            const stageContacts = contacts.filter((c) => c.stage === stage);
            const stageValue = stageContacts.reduce((s, c) => s + c.value, 0);
            return (
              <div key={stage} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">{stage}</h3>
                <p className="text-xs text-gray-400 mb-3">{stageContacts.length} صفقة · {(stageValue / 1000).toFixed(0)}K SAR</p>
                <div className="space-y-2">
                  {stageContacts.map((c) => (
                    <div key={c.id} className="bg-white dark:bg-gray-900 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-400 transition-colors">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.company}</p>
                      <p className="text-xs font-semibold text-blue-600 mt-1">{c.value.toLocaleString()} SAR</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-3">
          {[
            { title: "متابعة عرض سارة العمري", due: "اليوم", priority: "عالية", status: "قيد التنفيذ" },
            { title: "إرسال عقد شركة النخبة", due: "غداً", priority: "متوسطة", status: "جديدة" },
            { title: "مراجعة ميزانية Q1", due: "25 يناير", priority: "منخفضة", status: "جديدة" },
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
              <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</p>
                <p className="text-xs text-gray-400">الاستحقاق: {t.due}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === "عالية" ? "bg-red-100 text-red-600" : t.priority === "متوسطة" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                {t.priority}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{t.status}</span>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors">
            + إضافة مهمة
          </button>
        </div>
      )}

      {activeTab === "assistant" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">المساعد الذكي للأعمال</h3>
            <p className="text-xs text-gray-400">اسألني عن صفقاتك، عملائك، أو اطلب مساعدة في إعداد عروض</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {assistantMessages.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <div className="text-3xl mb-2">🤖</div>
                ابدأ بسؤال مثل: "من هم أفضل العملاء المحتملين هذا الشهر؟"
              </div>
            )}
            {assistantMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400">
                  يفكر...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <input
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendToAssistant()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendToAssistant}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium"
            >
              إرسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
