# Domain 11: Arabic Content, RTL Design & Creative
*Core to Ode's brand identity and Palestinian expression*

## Skills in This Domain

### Arabic Writing & Content
**Register levels:**
- فصحى معاصرة (Modern Standard) → formal docs, educational content
- عامية شامية/فلسطينية → conversational, rap, social media
- Mix (code-switch) → tech + Arabic blend for modern audience

**Content types Ode creates:**
- Arabic AI/tech curriculum (Claude Academy)
- Palestinian political rap lyrics
- Brand copy for Odé | عودة
- Arabic online teaching materials
- Social media content

### Rap Production Guidelines
**Palestinian political rap structure:**
```
مقدمة (Intro) - 4 bars: establish scene/emotion
مقطع 1 (Verse 1) - 16 bars: story/narrative
جسر (Bridge/Hook) - 8 bars: emotional peak, singable
مقطع 2 (Verse 2) - 16 bars: escalation/twist
جسر (Hook repeat)
خاتمة (Outro) - 4-8 bars: call to action/resolution
```

**Rhyme schemes:** AABB · ABAB · ABCB (most common in Arabic rap)

**Themes:** عودة · مقاومة · هوية · أرض · ذاكرة · أمل

**Meter:** Arabic rap often uses البحر الكامل or البحر الرجز adapted to modern flow

### RTL UI/UX Rules
```css
/* Base RTL setup */
[dir="rtl"] {
  font-family: 'Cairo', 'Tajawal', sans-serif;
  text-align: right;
}

/* Flex RTL */
[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

/* Mirrored icons */
[dir="rtl"] .icon-directional {
  transform: scaleX(-1);
}

/* Numbers stay LTR */
[dir="rtl"] .number {
  direction: ltr;
  display: inline-block;
}
```

### Arabic Typography Standards
- **Headlines:** Cairo Bold / Tajawal Bold
- **Body:** Cairo Regular / Noto Naskh Arabic
- **Code in Arabic UI:** Fira Code + Cairo mixed
- **Min font size:** 16px Arabic body (never less — Arabic needs more space)
- **Line height:** 1.8 for Arabic (vs 1.5 for English)

### Keffiyeh CSS Pattern (Odé Brand)
```css
.keffiyeh-bg {
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0, 151, 54, 0.1) 10px,
      rgba(0, 151, 54, 0.1) 20px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      rgba(206, 17, 38, 0.1) 10px,
      rgba(206, 17, 38, 0.1) 20px
    );
}
```

### Arabic PIL/Image Text (Python)
```python
import arabic_reshaper
from bidi.algorithm import get_display
from PIL import ImageDraw, ImageFont

def draw_arabic(draw, text, position, font, fill):
    reshaped = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped)
    draw.text(position, bidi_text, font=font, fill=fill, anchor="ra")
    # anchor "ra" = right-aligned for RTL
```

### Arabic Claude Academy Curriculum Structure
```
Module 1: أساسيات الذكاء الاصطناعي
Module 2: فهم نماذج اللغة
Module 3: هندسة البرومبت
Module 4: Claude في العمل
Module 5: بناء تطبيقات الذكاء الاصطناعي
```

---

## Odé | عودة Brand Voice

**Tone:** كريم · دافئ · ثوري · أصيل  
**Never:** مبتذل · سياحي · استهلاكي  
**Always:** يحمل الهوية الفلسطينية بكبرياء  

**Taglines to use:**
- عودة — ليست مجرد كلمة، هي وعد
- الأصالة لا تُباع
- من هنا، للعالم
