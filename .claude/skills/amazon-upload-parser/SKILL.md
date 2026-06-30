# amazon-upload-parser

استيعاب وتحليل ملفات Amazon المختلفة — يفهم البنية التلقائياً ويستخرج
البيانات الصحيحة بغض النظر عن نوع التقرير أو إصداره.

## متى تُفعَّل
هذه مهارة مساعدة (utility skill) تُفعَّل تلقائياً عندما يرفع المستخدم ملفاً
قبل تشغيل أي مهارة Amazon أخرى. أيضاً عند:
- "كيف أرفع الملف"، "شو نوع الملف هاد"، "parse this file"
- رفع ملف CSV/JSON/XLSX غير معروف النوع

## الملفات المدعومة

| نوع الملف | المصدر في Seller Central | الاستخدام في |
|-----------|--------------------------|--------------|
| `BusinessReport_*.csv` | Reports > Business Reports > By ASIN | WBR، ASIN Analysis |
| `SalesAndTraffic_*.csv` | Reports > Business Reports > Sales and Traffic | WBR، Daily Check |
| `InventoryHealth_*.csv` | Reports > Fulfillment > Inventory Health | Inventory Forecast، Restock |
| `AdvertisingReport_*.csv` | Reports > Advertising Reports | Ads Analysis |
| `SearchTermReport_*.csv` | Advertising Reports > Search Term | Ads Analysis |
| `FBA_Inventory_*.csv` | Reports > Fulfillment > FBA Inventory | Restock Alerts |
| `OrderReport_*.csv` | Reports > Orders > All Orders | P&L Analysis |
| SP-API JSON | مباشر من API | كل المهارات |

## عملية الاستيعاب

### الخطوة 1: تحديد نوع الملف

```
1. قرأ الـ header row (السطر الأول أو الثاني)
2. تطابق مع أنماط الأعمدة المعروفة:

Business Report headers يحتوي على:
  "(Parent) ASIN", "Sessions", "Buy Box Percentage", "Unit Session Percentage"

Sales and Traffic headers يحتوي على:
  "Date", "Sales", "Units Ordered", "Total Order Items"

Inventory Health headers يحتوي على:
  "ASIN", "FNSKU", "Available", "Days of Supply"

Advertising Report headers يحتوي على:
  "Campaign Name", "Impressions", "Clicks", "Spend", "Sales"

3. إذا لم يُطابق أي نمط → اطلب من المستخدم تحديد النوع
```

### الخطوة 2: تنظيف البيانات

```
مشاكل شائعة في ملفات Amazon:
  - أعمدة فارغة في البداية أو النهاية
  - قيم "$" أو "%" تحتاج إزالة قبل التحويل لأرقام
  - تواريخ بصيغة MM/DD/YYYY أو YYYY-MM-DD (كلاهما ممكن)
  - بيانات "(Child)" و"(Parent)" في نفس الملف
  - قيم "N/A" أو "--" تعني 0 أو "غير متاح"
  - أسطر Summary في نهاية الملف (تُستبعد من التحليل التفصيلي)
```

### الخطوة 3: التحقق من اكتمال البيانات

```
فحص:
  - هل الفترة الزمنية كافية للتحليل المطلوب؟
  - هل جميع الأعمدة الضرورية موجودة؟
  - هل يوجد بيانات مكررة (duplicate rows)؟
  - هل جميع ASINs لديها بيانات كافية؟

إذا وُجد نقص → اذكره صراحةً قبل بدء التحليل
```

### الخطوة 4: ربط البيانات بالمهارة الصحيحة

```
بعد تحديد نوع الملف وتنظيف البيانات:

BusinessReport → يمكن تمريره لـ:
  - amazon-wbr-report
  - amazon-asin-performance
  - amazon-daily-brand-check

InventoryHealth + SalesAndTraffic → يمكن تمريرهما لـ:
  - amazon-inventory-forecast
  - amazon-restock-alerts

AdvertisingReport → يمكن تمريره لـ:
  - amazon-ads-analysis

OrderReport + COGS → يمكن تمريرهما لـ:
  - amazon-pnl-analysis
```

## تنسيق رسالة الاستيعاب

```
📂 تم استيعاب الملف
───────────────────────────────
الاسم: [filename]
النوع: [Business Report / Inventory / Advertising / ...]
الفترة: [من - إلى]
عدد الأسطر: X,XXX (X ASINs / X تواريخ)

الأعمدة الرئيسية المكتشفة:
  ✅ [عمود 1]
  ✅ [عمود 2]
  ⚠️ [عمود 3] — القيم جزئية (XX% من الأسطر فارغة)
  ❌ [عمود 4] — غير موجود في هذا الملف

المهارات المتوافقة:
  → [skill-name-1]
  → [skill-name-2]

هل تريد تشغيل [skill-name] مباشرة؟
───────────────────────────────
```

## متعدد الملفات

إذا رُفع أكثر من ملف في نفس الوقت:
1. استوعب كل ملف منفصلاً
2. اكتشف التداخل الزمني بينها
3. ادمجها إذا كانت تكمّل بعضها (مثلاً: Business Report + Advertising Report)
4. وضّح للمستخدم ما تم دمجه

## قواعد صارمة
- لا تبدأ التحليل قبل إعلان نوع الملف المكتشف للمستخدم
- إذا الملف غير معروف النوع → اطلب توضيحاً، لا تخمّن
- لا تحذف بيانات تبدو "خاطئة" — اذكرها وأترك القرار للمستخدم
- "غير متاح في الملف" أفضل من تقدير خاطئ

## المصدر
Odé AI Platform — Amazon AI Module (أصلي 100%)
