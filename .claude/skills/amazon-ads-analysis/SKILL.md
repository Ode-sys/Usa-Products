# amazon-ads-analysis

تحليل عميق لأداء حملات Amazon PPC — يكشف أين تذهب ميزانيتك الإعلانية
ويحدد الحملات الرابحة من المُستنزِفة.

## متى تُفعَّل
عند طلب "حلل الإعلانات"، "PPC analysis"، "ACoS مرتفع"، "ليش الإعلانات ما بتشتغل"،
"campaign performance"، "keyword analysis"، "ROAS"، "advertising report".

## المدخلات المطلوبة
- ملف Advertising Report (Sponsored Products / Brands / Display)
- من Seller Central > Reports > Advertising Reports
- الفترة: أسبوع كحد أدنى، شهر للتحليل الكامل
- ACoS المستهدف (اختياري — يُحدده المستخدم)

## المقاييس الأساسية

```
ACoS (Advertising Cost of Sales) = إنفاق إعلاني ÷ مبيعات إعلانية × 100%
TACoS (Total ACoS)                = إنفاق إعلاني ÷ إجمالي مبيعات × 100%
ROAS                              = مبيعات إعلانية ÷ إنفاق إعلاني
CPC (Cost per Click)              = إنفاق إعلاني ÷ Clicks
CTR (Click-through Rate)          = Clicks ÷ Impressions × 100%
CVR (Conversion Rate)             = Orders ÷ Clicks × 100%
CPA (Cost per Acquisition)        = إنفاق إعلاني ÷ Orders
```

## مراحل التحليل

### المرحلة 1: تقييم الصحة العامة

```
معايير ACoS:
  ACoS < هامش الربح      → الحملة مربحة
  ACoS = هامش الربح      → Break-even
  ACoS > هامش الربح      → الحملة تخسر

تصنيف TACoS:
  < 5%     → هيمنة عضوية قوية، الإعلانات دعم فقط
  5-15%    → توازن صحي
  15-25%   → اعتماد مرتفع على الإعلانات
  > 25%    → مشكلة — راجع الاستراتيجية كاملاً
```

### المرحلة 2: تحليل على مستوى Campaign

لكل حملة:
- ACoS، ROAS، Spend، Sales، Impressions، Clicks، Orders
- مقارنة بالهدف المحدد
- تصنيف: Profitable / Break-even / Losing / Inactive

### المرحلة 3: تحليل على مستوى Ad Group و Keyword

**الكلمات المفتاحية الجيدة (High Value):**
- تحويل عالٍ + ACoS منخفض → زد الـ Bid
- تحويل عالٍ + ACoS مرتفع → خفض الـ Bid تدريجياً

**الكلمات المفتاحية المُستنزِفة (Wasted Spend):**
- إنفاق عالٍ + 0 conversions → أضف كـ Negative Keyword
- CTR منخفض جداً (< 0.2%) → راجع صلة الكلمة

**الكلمات المفتاحية المهملة (Missed Opportunity):**
- Impressions منخفضة + CVR عالٍ → زد الـ Bid أو الـ Budget

### المرحلة 4: تحليل Search Terms

من Sponsored Products Search Term Report:
- أفضل 10 Search Terms محوّلة (أضفها كـ Exact Match)
- أكثر 10 Search Terms استنزافاً (أضفها كـ Negative)
- Search Terms جديدة ذات إمكانية

### المرحلة 5: تشخيص مشاكل الأداء

**Impressions منخفضة:**
→ Bid منخفض أو Budget محدود أو Keyword relevance ضعيفة

**CTR منخفض (< 0.3%):**
→ الـ Main Image أو العنوان لا يجذب — أو الكلمات المفتاحية غير ملائمة

**Clicks بدون Conversions:**
→ مشكلة في الـ Listing (سعر، تقييمات، صور) لا في الإعلان

**ACoS مرتفع مع Conversions:**
→ Bid مرتفع أكثر من اللازم — خفض تدريجي 10-15% كل 5 أيام

## تنسيق تقرير الإعلانات

```
════════════════════════════════════════
📢 AMAZON ADS ANALYSIS REPORT
الفترة: [من - إلى]
════════════════════════════════════════

ملخص الأداء الإعلاني:
  إجمالي الإنفاق:      $X,XXX
  إجمالي المبيعات:     $XX,XXX
  ACoS الكلي:          XX%  (الهدف: XX%)
  TACoS:               XX%
  ROAS:                X.X
  CPC متوسط:           $X.XX
  CTR متوسط:           X.XX%
  CVR متوسط:           X.X%
  الحالة العامة:       ✅ مربح / ⚠️ Break-even / ❌ يخسر

────────────────────────────────────────
أداء Campaigns:

🏆 أفضل Campaign:
  الاسم: [Campaign Name]
  ACoS: XX% | ROAS: X.X | Spend: $XXX | Sales: $X,XXX

⚠️ Campaign تحتاج تدخلاً:
  الاسم: [Campaign Name]
  المشكلة: [ACoS XX% / 0 conversions / Budget محدود]
  الإجراء: [محدد]

────────────────────────────────────────
🔑 أفضل 5 Keywords (رابحة):
  1. "[keyword]" — ACoS XX% — Orders: XX — Bid مقترح: $X.XX
  2. ...

🚫 Keywords تستنزف الميزانية:
  1. "[keyword]" — Spend: $XXX — Orders: 0 → أضف كـ Negative
  2. ...

💡 Search Terms واعدة (يمكن استهدافها):
  1. "[term]" — CVR: XX% — أضف كـ Exact Match

────────────────────────────────────────
⚡ الإجراءات المطلوبة هذا الأسبوع:
  1. [عاجل] ...
  2. [هذا الأسبوع] ...
  3. [هذا الشهر] ...

📌 ملاحظة: ACoS المستهدف المُدخَل: XX% / غير محدد.
   الإجراءات مبنية على بيانات الملف المرفوع فقط.
════════════════════════════════════════
```

## قواعد صارمة
- ACoS "جيد" يعتمد على هامش ربح المنتج — لا توجد نسبة مثلى عالمية
- لا توصِ برفع الـ Bid إلا إذا الـ Budget غير محدود
- كل توصية بتغيير Bid تكون تدريجية (10-15% كحد أقصى)
- Search Term analysis تتطلب ملف Search Terms منفصل — إذا غير موجود اذكر ذلك

## المصدر
Odé AI Platform — Amazon AI Module (أصلي 100%)
