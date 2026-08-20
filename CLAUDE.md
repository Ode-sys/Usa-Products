# Ode AI — Master Orchestration

**381 مهارة · 31 وكيل متخصص**
هذا الملف هو مركز التحكم. يُفعَّل تلقائياً في كل جلسة.

---

## 📌 مؤجل — عند الجهاز الجديد

**GBrain** — طبقة ذاكرة دائمة للـ AI agents (28.8k ⭐)
- الرابط: https://github.com/garrytan/gbrain
- ماذا يفعل: يحفظ المعرفة بين الجلسات — Vector + Graph + Synthesis
- يحتاج: Bun + PostgreSQL/pgvector أو PGLite محلي
- وقت الإعداد: 15-30 دقيقة
- **ذكّر المستخدم بتثبيته عند ذكر "جهاز جديد" أو "إعداد بيئة جديدة"**

---

---

## قواعد الأولوية

1. **لا تبدأ تنفيذ أي ميزة معقدة** قبل تفعيل `planner` ثم `architect`
2. **كل كود مكتوب** → `code-reviewer` تلقائياً بعده
3. **كل كود يمس Auth / Payment / API خارجي** → `security-reviewer` إلزامي
4. **كل ملف Amazon مرفوع** → فعّل `amazon-upload-parser` أولاً قبل أي تحليل
5. **كل build فاشل** → `build-error-resolver` + المحلل المختص للغة

---

## دوائر العمل المُشبَّكة

### 🔵 دائرة 1 — ميزة جديدة (Feature)

```
طلب ميزة
    ↓
/planner          ← يُفكّك المتطلبات ويُقسّمها
    ↓
/architect        ← يُصمّم البنية والقرارات التقنية
    ↓
/tdd-guide        ← يكتب الاختبارات أولاً
    ↓
[كتابة الكود]     ← بالمهارة المناسبة للغة
    ↓
/code-reviewer    ← مراجعة الجودة
    ↓
/security-reviewer ← (إذا مس Auth/Data/Payment)
    ↓
/doc-updater      ← تحديث التوثيق
```

### 🔴 دائرة 2 — إصلاح خطأ (Bug Fix)

```
خطأ / فشل build
    ↓
skill: systematic-debugging    ← تشخيص الجذر
    ↓
/build-error-resolver          ← إصلاح أخطاء البناء العامة
    ↓
[محلل اللغة المختص]            ← راجع جدول اللغات أدناه
    ↓
/code-reviewer                 ← تحقق أن الإصلاح لم يكسر شيئاً آخر
```

### 🟠 دائرة 3 — Amazon AI Module

```
ملف مرفوع (CSV/XLSX)
    ↓
skill: amazon-upload-parser    ← يكتشف نوع الملف تلقائياً
    ↓
┌─────────────────────────────────────┐
│  BusinessReport     → amazon-asin-performance
│                     → amazon-wbr-report
│                     → amazon-daily-brand-check
│  SalesAndTraffic    → amazon-wbr-report
│  InventoryHealth    → amazon-inventory-forecast
│                     → amazon-restock-alerts
│  AdvertisingReport  → amazon-ads-analysis
│  OrderReport+COGS   → amazon-pnl-analysis
└─────────────────────────────────────┘
```

**مسارات Amazon المتكاملة:**
- `"شو أداء البراند هالأسبوع"` → parser → wbr-report → daily-brand-check
- `"محتاج أطلب مخزون"` → parser → inventory-forecast → restock-alerts (يُخرج PO draft)
- `"شو ربحي الحقيقي"` → parser → pnl-analysis
- `"حلل إعلاناتي"` → parser → ads-analysis

### 🟡 دائرة 4 — أمان وجودة الكود (Security & Quality)

```
قبل كل commit مهم:
    ↓
skill: security-review         ← فحص OWASP Top 10
    ↓
skill: security-scan           ← scan آلي للثغرات
    ↓
/security-reviewer             ← مراجعة عميقة Auth/API/Secrets
    ↓
skill: codehealth-mcp          ← قياس صحة الكود العامة
```

### 🟢 دائرة 5 — Frontend

```
طلب UI/UX:
    ↓
skill: web-design-guidelines   ← مبادئ التصميم
    ↓
skill: building-ui             ← بناء المكوّن
    ↓
[حسب الإطار]
├── React    → react-best-practices → react-patterns → react-testing
├── Vue      → vue-patterns
├── Angular  → angular-developer
├── React Native → react-native-skills → react-native-patterns
└── SwiftUI  → swiftui-patterns
    ↓
skill: accessibility           ← تحقق من الوصولية
    ↓
skill: webapp-testing          ← اختبار e2e
    ↓
/e2e-runner                    ← تشغيل Playwright
```

### 🔷 دائرة 6 — Backend & API

```
طلب API أو Backend:
    ↓
skill: api-design              ← تصميم العقد
    ↓
[حسب الإطار]
├── Django     → django-patterns → /django-reviewer → /django-build-resolver
├── Spring Boot→ springboot-patterns → springboot-security → springboot-tdd
├── Quarkus    → quarkus-patterns → quarkus-security → quarkus-tdd
└── FastAPI    → async-python-patterns → python-testing
    ↓
skill: database-migration      ← إذا في تغيير Schema
    ↓
/database-reviewer             ← مراجعة SQL والـ ORM
    ↓
skill: sql-optimization        ← تحسين الاستعلامات
```

### 🔶 دائرة 7 — DevOps & Deployment

```
نشر / بنية تحتية:
    ↓
skill: ci-cd-pipeline-design   ← تصميم Pipeline
    ↓
skill: docker-patterns         ← Containerization
    ↓
skill: terraform-module-builder← Infrastructure as Code
    ↓
skill: deploy-to-vercel        ← (للـ frontend/fullstack)
    ↓
skill: vercel-optimize         ← تحسين الأداء بعد النشر
    ↓
skill: canary-watch            ← مراقبة النشر
```

### 🟣 دائرة 8 — Brand & Marketing

```
طلب براند أو محتوى:
    ↓
skill: brand-discovery         ← استكشاف هوية البراند
    ↓
skill: brand-guidelines        ← إرساء المعايير
    ↓
skill: brand-voice             ← صوت البراند وأسلوبه
    ↓
skill: seo                     ← تحسين محركات البحث
    ↓
skill: social-publisher        ← نشر على المنصات
    ↓
skill: writing-guidelines      ← معايير الكتابة
```

### 🩷 دائرة 9 — ML / AI Engineering

```
طلب نموذج أو Pipeline ML:
    ↓
skill: mle-workflow            ← تصميم سير العمل
    ↓
skill: pytorch-patterns        ← PyTorch patterns
    ↓
/pytorch-build-resolver        ← إصلاح أخطاء CUDA/Training
    ↓
/mle-reviewer                  ← مراجعة Pipeline الإنتاجي
    ↓
skill: ai-regression-testing   ← اختبار انحدار النموذج
    ↓
skill: benchmark               ← قياس الأداء
```

### ⚪ دائرة 10 — Agent Orchestration (Meta)

```
بناء نظام وكلاء:
    ↓
skill: agentic-engineering     ← مبادئ بناء الوكلاء
    ↓
skill: agent-harness-construction ← بناء الـ Harness
    ↓
skill: team-agent-orchestration← تنسيق الفِرق
    ↓
skill: autonomous-loops        ← تشغيل حلقات مستقلة
    ↓
/loop-operator                 ← مراقبة وإدارة الحلقات
    ↓
skill: agent-eval              ← تقييم أداء الوكلاء
    ↓
/harness-optimizer             ← ضبط موثوقية وتكلفة الـ Harness
```

---

## جدول الوكلاء حسب اللغة

| اللغة | Reviewer | Build Resolver |
|-------|----------|----------------|
| TypeScript/JS | `/typescript-reviewer` | `/build-error-resolver` |
| Python | `/python-reviewer` | `/build-error-resolver` |
| Django | `/django-reviewer` | `/django-build-resolver` |
| Go | `/go-reviewer` | `/go-build-resolver` |
| Rust | `/rust-reviewer` | `/rust-build-resolver` |
| Java/Spring | `/java-reviewer` | `/java-build-resolver` |
| Kotlin/Android | `/kotlin-reviewer` | `/kotlin-build-resolver` |
| C/C++ | `/cpp-reviewer` | `/cpp-build-resolver` |
| F# | `/fsharp-reviewer` | `/build-error-resolver` |
| PyTorch/ML | `/mle-reviewer` | `/pytorch-build-resolver` |

---

## جدول المهام السريعة

| المستخدم يقول | المسار التلقائي |
|--------------|------------------|
| "اعمل ميزة X" | planner → architect → tdd-guide → [lang] → code-reviewer |
| "في خطأ في البناء" | systematic-debugging → build-error-resolver → [lang-resolver] |
| "رفعت ملف Amazon" | amazon-upload-parser → [skill مناسب] |
| "شو ربحي" | upload-parser → pnl-analysis |
| "محتاج أطلب مخزون" | upload-parser → inventory-forecast → restock-alerts |
| "حلل إعلاناتي" | upload-parser → ads-analysis |
| "راجع الكود" | code-reviewer → security-reviewer |
| "انشر على Vercel" | deploy-to-vercel → vercel-optimize → canary-watch |
| "صمم API" | api-design → [backend-skill] → database-reviewer → security-reviewer |
| "احتاج docs" | doc-updater → documentation-lookup → writing-guidelines |
| "شو البراند" | brand-discovery → brand-guidelines → brand-voice |
| "بناء نموذج ML" | mle-workflow → pytorch-patterns → mle-reviewer → benchmark |

---

## قواعد الاستخدام المتوازي

شغّل وكلاء بالتوازي عند الاستقلالية:

```
# مثال: feature جديدة في نفس الوقت
PARALLEL {
  /tdd-guide        ← يكتب الاختبارات
  /architect        ← يُصمّم البنية
}
↓
[تنفيذ الكود بعد اكتمال كليهما]
↓
PARALLEL {
  /code-reviewer
  /security-reviewer
}
```

```
# مثال: مراجعة codebase كامل
PARALLEL {
  skill: security-scan
  skill: codehealth-mcp
  skill: repo-scan
}
↓
/security-reviewer  ← يُجمّع النتائج
```

---

## ما تفعله تلقائياً في كل جلسة

- عند رفع أي ملف → `amazon-upload-parser` إذا كان Amazon، وإلا حدّد النوع
- عند كتابة كود جديد → قرّر وكيل المراجعة من جدول اللغات
- عند سؤال "شو أفعل مع X" → اقترح الدائرة المناسبة من الدوائر أعلاه
- عند طلب تحليل استراتيجي → `planner` + `architect` + `architecture-decision-records`
- عند الشك في أي مهارة موجودة → `skill-scout` أو `skill-stocktake`

---

## المنصة

Odé AI Platform — Amazon AI Module (أصلي 100%)
لا يُستخدم أي كود من مصادر AGPL — كل المهارات الأمازونية مكتوبة من الصفر.
# userEmail
The user's email address is mr.mohammadodeh1980@gmail.com. Use it only to identify the user, such as for authorship, attribution, or filtering their own work. Never send it to an unrelated service, such as in a request header, URL, or payload, unless the user explicitly asks.
# currentDate
Today's date is 2026-08-20.
