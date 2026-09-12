# يسر | Yusr

موقع تعريفي وطلبات لعلامة **يسر** للأثاث المنزلي المفصّل في السعودية — موقع ثابت بدون خادم، عربي/إنجليزي.

A bilingual (Arabic/English) marketing and ordering site for **Yusr**, a Saudi made-to-order home
furnishing brand. Static — no build step, no backend, no npm.

**رابط النشر / Live URL:** https://yasser1164-ux.github.io/eventos/yusr/

---

## العربية

### نظرة سريعة

- HTML5 + CSS حديث + JavaScript (ES modules) فقط. لا يوجد إطار عمل ولا خطوة بناء.
- اللغة الافتراضية **العربية** (`dir="rtl"`)، والتبديل إلى الإنجليزية من زر الهيدر، ويُحفظ الاختيار في
  `localStorage` كما يمكن تمريره في الرابط: `?lang=en`.
- لا توجد سلة شراء ولا دفع إلكتروني. كل طلب ينتهي برسالة **واتساب** جاهزة، مع رابط بريد كبديل.
- كل النصوص الظاهرة في ملف واحد: `js/i18n.js`.

### الملفات

```
yusr/
  index.html  products.html  product.html  custom.html  how.html  about.html  contact.html
  css/styles.css          ← كل التنسيقات
  js/config.js            ← رقم واتساب وبيانات التواصل  ← ابدأ من هنا
  js/i18n.js              ← كل النصوص بالعربي والإنجليزي
  js/main.js              ← الهيدر والفوتر وتبديل اللغة والأكورديون
  js/products.js          ← عرض المنتجات والتصفية وصفحة التفاصيل
  js/form.js              ← نموذج الطلب وبناء رسالة واتساب
  data/products.json      ← بيانات المنتجات
  assets/                 ← الشعار والأيقونة والأيقونات
  sitemap.xml  robots.txt  README.md
```

### 1) تغيير رقم واتساب وبيانات التواصل

كل شيء في `js/config.js`:

```js
export const CONFIG = {
  whatsapp: '9665XXXXXXXX',      // بصيغة دولية، أرقام فقط، بدون +
  phoneDisplay: '+966 5X XXX XXXX',
  email: 'hello@yusr.sa',
  maroof: '0000000',             // رقم معروف (موثوق)
  cr: '10100000000',             // السجل التجاري
  social: { instagram: '…', x: '…', tiktok: '…', snapchat: '' }
};
```

- `whatsapp`: اكتبه هكذا `966512345678` (بدون `+` وبدون صفر في البداية).
- أي حساب تواصل اجتماعي تتركه فارغًا `''` تختفي أيقونته من الفوتر تلقائيًا.
- ما دام الرقم يحتوي حرف `X` سيظهر تنبيه في وحدة تحكم المتصفح للتذكير بتغييره.

### 2) إضافة أو تعديل منتج

المنتجات في `data/products.json` — مصفوفة من الكائنات. انسخ عنصرًا موجودًا وعدّله:

```json
{
  "id": "sofa-l-01",
  "category": "furniture",
  "name": { "ar": "كنب زاوية قماش", "en": "L-shaped fabric sofa" },
  "short": { "ar": "سطر واحد للبطاقة", "en": "One line for the card" },
  "description": { "ar": "فقرة لصفحة التفاصيل", "en": "A paragraph for the detail page" },
  "priceFrom": 2900,
  "priceTo": 4800,
  "images": ["https://…/1.jpg", "https://…/2.jpg", "https://…/3.jpg"],
  "specs": {
    "dimensions": { "ar": "280 × 180 × 85 سم", "en": "280 × 180 × 85 cm" },
    "material": { "ar": "خشب زان + قماش كتان", "en": "Beech wood + linen fabric" },
    "colors": [{ "ar": "بيج", "en": "Beige" }],
    "leadTimeDays": 12,
    "warrantyYears": 2
  },
  "options": {
    "size": [{ "ar": "240 سم", "en": "240 cm" }],
    "color": [{ "ar": "بيج", "en": "Beige" }],
    "material": [{ "ar": "كتان", "en": "Linen" }]
  },
  "featured": true
}
```

ملاحظات:
- `id` يجب أن يكون فريدًا — هو ما يظهر في الرابط `product.html?id=…`.
- `category` واحدة من: `furniture` · `wardrobes` · `kitchens` · `doors` · `essentials`.
  لإضافة قسم جديد: أضف المفتاح في `CATEGORIES` داخل `js/i18n.js` وأضف له اسمًا ووصفًا في `cat` للغتين.
- `featured: true` تظهر القطعة في الصفحة الرئيسية (تعرض أول 6 فقط).
- الأسعار أرقام بدون فواصل؛ التنسيق والعملة يتمّان تلقائيًا (`ر.س` / `SAR`).
- بعد التعديل تأكد أن الملف JSON سليم: `python3 -m json.tool data/products.json`.

### 3) استبدال الصور

كل الصور حاليًا مؤقتة من `picsum.photos` ومعلّمة في الكود بتعليق `TODO: replace image`.

- **صور المنتجات:** غيّر مصفوفة `images` في `data/products.json` إلى مسارات صورك، مثلًا
  `"assets/photos/sofa-1.jpg"` بعد وضع الصور في `assets/photos/`.
- **صور الصفحات الثابتة** (الهيرو، بطاقات الأقسام، الورش): ابحث عن `picsum.photos` في ملفات `.html`
  واستبدل قيمة `src`. احتفظ بخاصيتي `width` و`height` حتى لا تقفز الصفحة أثناء التحميل.
- المقاس المناسب: 1200×900 للهيرو، 800×600 لبطاقات الأقسام والمنتجات.
- استخدم صيغة `.webp` أو `.jpg` مضغوطة (أقل من 200 كيلوبايت للصورة).

### 4) تغيير النصوص

كل النصوص في `js/i18n.js` داخل كائنين: `ar` و`en`. غيّر القيمة في الاثنين معًا.
في ملفات HTML لا يوجد نص ظاهر — فقط مفاتيح مثل `data-i18n="home.hero.title"`.

### 5) النشر على GitHub Pages

المجلد جزء من مستودع `eventos` وينشر تلقائيًا:

```bash
git add yusr
git commit -m "Update Yusr site"
git push
```

ثم من `Settings → Pages` تأكد أن المصدر هو الفرع `main` والمجلد `/ (root)`.
الموقع يظهر على `https://yasser1164-ux.github.io/eventos/yusr/` خلال دقيقة أو دقيقتين.
جميع المسارات في الموقع **نسبية**، لذلك يعمل من أي مجلد فرعي دون تعديل.

### 6) التشغيل محليًا

بيانات المنتجات تُقرأ عبر `fetch` من ملف JSON، والمتصفحات تمنع ذلك عند فتح الملف مباشرة (`file://`).
شغّل خادمًا محليًا بسيطًا:

```bash
cd yusr
python3 -m http.server 8000
# افتح http://localhost:8000
```

بقية الصفحات (كيف نعمل، عن يسر، تواصل) تعمل حتى بالفتح المباشر.

---

## English

### Overview

- Plain HTML5 + modern CSS + vanilla ES modules. No framework, no build step, no npm.
- Default language is **Arabic** (`dir="rtl"`). The header toggle switches to English, the choice is
  stored in `localStorage`, and it can be forced with `?lang=en`.
- No cart, no checkout. Every request composes a pre-filled **WhatsApp** message, with a `mailto:`
  fallback.
- All visible strings live in `js/i18n.js`.

### Change the WhatsApp number

Edit `js/config.js` — it is the single source for every contact detail on the site:

```js
whatsapp: '966512345678'   // international format, digits only, no "+" and no leading 0
```

Also there: `phoneDisplay`, `email`, `maroof`, `cr`, and the `social` links (set one to `''` to hide
its icon). While the number still contains an `X`, the console prints a reminder.

### Add or edit a product

Products live in `data/products.json`. Copy an existing entry and edit it — see the annotated
example in the Arabic section above. Rules:

- `id` must be unique; it is the `product.html?id=…` parameter.
- `category` is one of `furniture`, `wardrobes`, `kitchens`, `doors`, `essentials`. To add a new
  category, add its key to `CATEGORIES` in `js/i18n.js` and a label + description under `cat` in both
  languages.
- `featured: true` puts the piece on the home page (first 6 only).
- Prices are plain numbers; currency and grouping are formatted automatically.
- Validate after editing: `python3 -m json.tool data/products.json`.

### Replace the images

Every image is a `picsum.photos` placeholder, each marked with a `TODO: replace image` comment.

- **Product photos:** change the `images` array in `data/products.json` (e.g. `assets/photos/sofa-1.jpg`).
- **Static page photos** (hero, category cards, partner cards): search the `.html` files for
  `picsum.photos` and swap the `src`. Keep the `width`/`height` attributes to avoid layout shift.
- Suggested sizes: 1200×900 hero, 800×600 cards. Use compressed `.webp`/`.jpg` under ~200 KB.

### Deploy to GitHub Pages

```bash
git add yusr
git commit -m "Update Yusr site"
git push
```

In `Settings → Pages`, the source should be branch `main`, folder `/ (root)`. The site is served at
`https://yasser1164-ux.github.io/eventos/yusr/`. Every path in the site is **relative**, so it works
from any sub-folder.

### Run locally

Product data is loaded with `fetch`, which browsers block on `file://`. Use a local server:

```bash
cd yusr
python3 -m http.server 8000   # then open http://localhost:8000
```

The content pages (how, about, contact) work even when opened directly.

---

## Accessibility & performance notes

- Semantic landmarks, a skip link, visible focus rings, labels on every input, `aria-expanded` on the
  menu and FAQ accordion, `aria-pressed` on filter chips, and live region on the result count.
- Colour contrast: walnut `#4A3728` on sand `#E9DCC9` ≈ 9:1; muted text `#6B5E54` on `#FAF7F2` ≈ 5.5:1.
- Images are lazy-loaded (except the hero) and carry explicit dimensions; fonts use `font-display: swap`.
- Only one external dependency: Google Fonts. No JS libraries.

## Open TODOs for the owner

Search the project for `TODO:` — the outstanding items are listed at the end of the handover summary:
the WhatsApp number, Maroof and CR numbers, phone, e-mail, social links, working hours, the office
address and map embed, the partner workshop names, the about-page figures, the share image, and all
placeholder photography.
