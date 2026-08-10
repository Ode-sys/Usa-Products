"use client";

import { useState } from "react";
import { toast } from "sonner";

type Platform = "twitter" | "instagram" | "linkedin" | "facebook";
type ContentType = "post" | "caption" | "article" | "email";

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: "twitter", label: "X / Twitter", icon: "𝕏" },
  { key: "instagram", label: "Instagram", icon: "📸" },
  { key: "linkedin", label: "LinkedIn", icon: "💼" },
  { key: "facebook", label: "Facebook", icon: "📘" },
];

const CONTENT_TYPES: { key: ContentType; label: string }[] = [
  { key: "post", label: "منشور" },
  { key: "caption", label: "كابشن" },
  { key: "article", label: "مقالة" },
  { key: "email", label: "بريد إلكتروني" },
];

interface GeneratedContent {
  platform: Platform;
  text: string;
}

export default function ContentPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [contentType, setContentType] = useState<ContentType>("post");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["twitter"]);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function generate() {
    if (!topic.trim()) { toast.error("أدخل الموضوع أولاً"); return; }
    if (selectedPlatforms.length === 0) { toast.error("اختر منصة واحدة على الأقل"); return; }
    setGenerating(true);
    setResults([]);
    await new Promise((r) => setTimeout(r, 2500));
    const mockResults: GeneratedContent[] = selectedPlatforms.map((p) => ({
      platform: p,
      text: getMockContent(p, topic, tone),
    }));
    setResults(mockResults);
    setGenerating(false);
    toast.success("تم توليد المحتوى");
  }

  function getMockContent(platform: Platform, topic: string, tone: string): string {
    const toneAr = tone === "professional" ? "احترافي" : tone === "friendly" ? "ودي" : "مرح";
    const samples: Record<Platform, string> = {
      twitter: `🚀 ${topic}\n\nبأسلوب ${toneAr} ومحتوى مُخصَّص لجمهورك المستهدف.\n\n✅ نقطة القيمة الأولى\n✅ نقطة القيمة الثانية\n✅ دعوة للتفاعل\n\n#محتوى_ذكي #${topic.replace(/\s+/g, "_")}`,
      instagram: `✨ ${topic} ✨\n\n${toneAr === "احترافي" ? "في عالم يتسارع كل يوم" : "يلا نتكلم عن"} ${topic}...\n\nالنقاط الأساسية:\n1️⃣ الفكرة الأولى\n2️⃣ الفكرة الثانية\n3️⃣ الفكرة الثالثة\n\nشاركنا رأيك في التعليقات 👇\n\n#محتوى #${topic.replace(/\s+/g, "")} #ذكاء_اصطناعي`,
      linkedin: `📌 ${topic}\n\nفي سياق ${toneAr}، نتناول اليوم موضوع ${topic} من زاوية مختلفة.\n\nما الذي يجعل هذا الموضوع مهماً؟\n\n• الأثر على الصناعة\n• التطبيقات العملية\n• التوجهات المستقبلية\n\nنرحب بمشاركة خبراتكم في التعليقات.\n\n#Leadership #Innovation`,
      facebook: `🌟 ${topic}\n\nأصدقاءنا الكرام، نتحدث اليوم عن ${topic}.\n\nبأسلوب ${toneAr}، نشاركك أبرز ما يجب أن تعرفه:\n\n👉 المعلومة الأولى\n👉 المعلومة الثانية\n👉 المعلومة الثالثة\n\nهل تجد هذا المحتوى مفيداً؟ أخبرنا! 💬`,
    };
    return samples[platform];
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("تم النسخ");
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-lg">✍️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content AI</h1>
          <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">نشط</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">توليد محتوى ذكي لجميع منصاتك بلحظات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">الموضوع أو الفكرة</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: إطلاق منتج جديد لتطبيق الياقة البدنية..."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm resize-none h-24 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">نوع المحتوى</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.key}
                  onClick={() => setContentType(ct.key)}
                  className={`py-2 text-xs rounded-lg border transition-colors ${
                    contentType === ct.key
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">الأسلوب</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="professional">احترافي</option>
              <option value="friendly">ودي</option>
              <option value="humorous">مرح</option>
              <option value="formal">رسمي</option>
              <option value="inspiring">ملهم</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">المنصات</label>
            <div className="space-y-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => togglePlatform(p.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    selectedPlatforms.includes(p.key)
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                  {selectedPlatforms.includes(p.key) && <span className="mr-auto text-purple-500">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={generating}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            {generating ? "⏳ جاري التوليد..." : "✨ توليد المحتوى"}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {results.length === 0 && !generating && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="text-5xl mb-4 opacity-20">✍️</div>
              <p className="text-gray-400 text-sm">اختر المنصات وأدخل الموضوع ثم اضغط توليد</p>
            </div>
          )}
          {generating && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-400">يعمل الذكاء الاصطناعي على توليد المحتوى...</p>
            </div>
          )}
          {results.map((r) => {
            const platform = PLATFORMS.find((p) => p.key === r.platform)!;
            return (
              <div key={r.platform} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{platform.icon}</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{platform.label}</span>
                    <span className="text-xs text-gray-400">{r.text.length} حرف</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(r.text)}
                      className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      نسخ
                    </button>
                    <button className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      جدولة
                    </button>
                  </div>
                </div>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
                  {r.text}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
