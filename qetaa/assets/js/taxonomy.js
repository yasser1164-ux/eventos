/* =========================================================================
   TAXONOMY — parts, conditions, cities, seller types.
   Everything that drives filters, forms and labels. Arabic first, English
   alongside, so both languages share one id.
   ========================================================================= */
window.TAX = {

  /* part groups → the category tiles and the main filter ------------------ */
  categories: [
    { id:"engine",    ar:"المحرك وملحقاته",   en:"Engine & parts",
      parts:["مكينة كاملة","رأس مكينة","بلوك","تربو","منيفول","طرمبة زيت","سير الكاتينة","رديتر","مروحة رديتر","حساس أكسجين"] },
    { id:"gearbox",   ar:"القير والنقل",       en:"Transmission",
      parts:["قير أوتوماتيك","قير عادي","كلتش","عكس (دفرنس)","عمود كردان","علبة توزيع"] },
    { id:"body",      ar:"الهيكل والصدامات",   en:"Body & bumpers",
      parts:["صدام أمامي","صدام خلفي","كبوت","رفرف","باب أمامي","باب خلفي","شنطة خلفية","سقف","جناح خلفي"] },
    { id:"lighting",  ar:"الإضاءة",            en:"Lighting",
      parts:["شمعة أمامية","شمعة خلفية","ضباب","ليد نهاري","مرايا جانبية","إشارة"] },
    { id:"suspension",ar:"المساعدات والعفشة",  en:"Suspension & steering",
      parts:["مساعد أمامي","مساعد خلفي","مقص","دركسون","طرمبة دركسون","كبالة","جلد عكس","قاعدة مكينة"] },
    { id:"brakes",    ar:"الفرامل",            en:"Brakes",
      parts:["هوب فرامل","كاليبر","دسكات","فحمات","مضخة فرامل","حساس ABS"] },
    { id:"electric",  ar:"الكهرباء والحساسات", en:"Electrical & sensors",
      parts:["كمبيوتر المحرك ECU","دينمو","سلف","بطارية","شمعات بوجيه","كويلات","وحدة الرفارف","حساس شكمان"] },
    { id:"ac",        ar:"المكيف والتبريد",    en:"A/C & cooling",
      parts:["كمبروسر مكيف","مكثف (كندنسر)","مبخر","مروحة مكيف","خزان ماء"] },
    { id:"interior",  ar:"الداخلية",           en:"Interior",
      parts:["طقم كراسي","شاشة","طبلون","دركسون جلد","كونسول","حزام أمان","سجاد"] },
    { id:"wheels",    ar:"الجنوط والإطارات",   en:"Wheels & tyres",
      parts:["جنط","إطار","غطاء جنط","صرة (هب)","كفر احتياطي"] },
    { id:"exhaust",   ar:"العادم",             en:"Exhaust",
      parts:["شكمان","كتلايزر","مخمد","منيفول عادم"] },
    { id:"glass",     ar:"الزجاج",             en:"Glass",
      parts:["زجاج أمامي","زجاج خلفي","زجاج باب","فتحة سقف"] }
  ],

  /* condition grades — the honesty layer buyers ask for ------------------- */
  conditions: [
    { id:"a", ar:"ممتازة (A)", en:"Excellent (A)", bars:4, note:{ ar:"شبه جديدة، بدون خدوش تذكر", en:"Near new, no notable marks" } },
    { id:"b", ar:"جيدة (B)",   en:"Good (B)",      bars:3, note:{ ar:"آثار استعمال عادية، تعمل بكفاءة", en:"Normal wear, fully working" } },
    { id:"c", ar:"مقبولة (C)", en:"Fair (C)",      bars:2, note:{ ar:"خدوش أو بهتان واضح، سليمة وظيفياً", en:"Visible wear, functionally sound" } },
    { id:"d", ar:"تحتاج صيانة (D)", en:"Needs work (D)", bars:1, note:{ ar:"تحتاج إصلاح — السعر يعكس ذلك", en:"Needs repair — priced accordingly" } }
  ],

  /* where the part came from --------------------------------------------- */
  origins: [
    { id:"used_sa",  ar:"مستعمل — وارد السعودية", en:"Used — local" },
    { id:"used_jp",  ar:"مستعمل — وارد ياباني",   en:"Used — Japan import" },
    { id:"used_us",  ar:"مستعمل — وارد أمريكي",   en:"Used — US import" },
    { id:"used_eu",  ar:"مستعمل — وارد أوروبي",   en:"Used — Europe import" },
    { id:"refurb",   ar:"مجدد / معاد تأهيله",     en:"Refurbished" },
    { id:"new_oem",  ar:"جديد وكالة",             en:"New — OEM" },
    { id:"new_after",ar:"جديد تجاري",             en:"New — aftermarket" }
  ],

  /* who is selling -------------------------------------------------------- */
  sellerTypes: [
    { id:"yard",     ar:"تشليح",        en:"Scrapyard" },
    { id:"shop",     ar:"محل قطع غيار", en:"Parts shop" },
    { id:"workshop", ar:"ورشة",         en:"Workshop" },
    { id:"person",   ar:"فرد",          en:"Individual" }
  ],

  /* delivery options ------------------------------------------------------ */
  delivery: [
    { id:"pickup",   ar:"استلام من المحل", en:"Pickup" },
    { id:"city",     ar:"توصيل داخل المدينة", en:"In-city delivery" },
    { id:"shipping", ar:"شحن لكل المدن", en:"Nationwide shipping" },
    { id:"install",  ar:"تركيب لدى البائع", en:"Fitting available" }
  ],

  /* Saudi cities — the marketplace is city-scoped like the real trade ----- */
  cities: [
    { id:"riyadh",  ar:"الرياض",      en:"Riyadh",        hub:"حي السلي" },
    { id:"jeddah",  ar:"جدة",         en:"Jeddah",        hub:"شارع الصناعية" },
    { id:"dammam",  ar:"الدمام",      en:"Dammam",        hub:"الصناعية الثانية" },
    { id:"khobar",  ar:"الخبر",       en:"Khobar",        hub:"شارع الشرائع" },
    { id:"makkah",  ar:"مكة المكرمة", en:"Makkah",        hub:"" },
    { id:"madinah", ar:"المدينة المنورة", en:"Madinah",   hub:"" },
    { id:"qassim",  ar:"القصيم",      en:"Qassim",        hub:"" },
    { id:"taif",    ar:"الطائف",      en:"Taif",          hub:"" },
    { id:"tabuk",   ar:"تبوك",        en:"Tabuk",         hub:"" },
    { id:"abha",    ar:"أبها",        en:"Abha",          hub:"" },
    { id:"hail",    ar:"حائل",        en:"Hail",          hub:"" },
    { id:"jubail",  ar:"الجبيل",      en:"Jubail",        hub:"" },
    { id:"ahsa",    ar:"الأحساء",     en:"Al-Ahsa",       hub:"" },
    { id:"najran",  ar:"نجران",       en:"Najran",        hub:"" }
  ],

  /* request urgency ------------------------------------------------------- */
  urgency: [
    { id:"today",  ar:"اليوم — السيارة واقفة", en:"Today — car is off the road" },
    { id:"week",   ar:"خلال أسبوع",            en:"Within a week" },
    { id:"flex",   ar:"مافي استعجال",          en:"No rush" }
  ],

  /* helpers --------------------------------------------------------------- */
  find: function (list, id) {
    var i; for (i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i];
    return null;
  },
  label: function (list, id, lang) {
    var o = this.find(list, id);
    return o ? (o[lang === "en" ? "en" : "ar"] || o.ar) : (id || "");
  },
  allParts: function () {
    var out = [], i, j, c;
    for (i = 0; i < this.categories.length; i++) {
      c = this.categories[i];
      for (j = 0; j < c.parts.length; j++) out.push({ name: c.parts[j], category: c.id });
    }
    return out;
  }
};
