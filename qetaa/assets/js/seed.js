/* =========================================================================
   SEED — the bundled catalogue.
   Used until Supabase is configured, and whenever the database is
   unreachable, so the site is never empty and never broken. Anything a
   visitor adds in demo mode is layered on top of this in local storage.
   Keep in sync with supabase/schema.sql (tools/seed-sql.js regenerates
   supabase/seed.sql from this file).
   ========================================================================= */
window.SEED = {

  /* --- sellers ---------------------------------------------------------- */
  sellers: [
    { id:"s1", slug:"al-salay-parts", name:"تشليح السلي لقطع الغيار", name_en:"Al-Salay Auto Parts", type:"yard",
      city:"riyadh", district:"حي السلي — شارع التشاليح", rating:4.7, reviews_count:212, since:2009,
      phone:"+966500000001", whatsapp:"966500000001", verified:true, plan:"pro",
      hours:"السبت – الخميس · ٨ص – ١٠م", makes:["toyota","lexus","nissan"],
      about:"تشليح متخصص في تويوتا ولكزس منذ ٢٠٠٩. قطع مفحوصة، فاتورة ضريبية، وضمان ١٤ يوم على القطع الميكانيكية." },
    { id:"s2", slug:"shuraia-motors", name:"مؤسسة الشرائع لقطع الغيار", name_en:"Shuraia Motors Parts", type:"shop",
      city:"khobar", district:"شارع الشرائع — الصناعية", rating:4.5, reviews_count:148, since:2013,
      phone:"+966500000002", whatsapp:"966500000002", verified:true, plan:"basic",
      hours:"السبت – الخميس · ٩ص – ١١م", makes:["chevrolet","gmc","ford"],
      about:"قطع أمريكي وارد ومحلي، تخصص تاهو ويوكن وسلفرادو. شحن لكل مدن المملكة." },
    { id:"s3", slug:"jeddah-japan", name:"معرض جدة للوارد الياباني", name_en:"Jeddah Japan Imports", type:"shop",
      city:"jeddah", district:"الصناعية — طريق المدينة", rating:4.8, reviews_count:301, since:2007,
      phone:"+966500000003", whatsapp:"966500000003", verified:true, plan:"yard",
      hours:"يومياً · ٨ص – ١٢م", makes:["toyota","honda","mazda","mitsubishi"],
      about:"استيراد مباشر من اليابان: مكاين، قيرات، وقطع داخلية بحالة ممتازة مع تقرير فحص لكل قطعة." },
    { id:"s4", slug:"dammam-korean", name:"تشليح الدمام للقطع الكورية", name_en:"Dammam Korean Parts", type:"yard",
      city:"dammam", district:"الصناعية الثانية", rating:4.3, reviews_count:96, since:2015,
      phone:"+966500000004", whatsapp:"966500000004", verified:true, plan:"basic",
      hours:"السبت – الخميس · ٨ص – ٩م", makes:["hyundai","kia"],
      about:"كل قطع هيونداي وكيا: صدامات، شمعات، مكاين، وقطع كهرباء مفحوصة." },
    { id:"s5", slug:"german-house", name:"البيت الألماني لقطع الغيار", name_en:"German House Parts", type:"shop",
      city:"riyadh", district:"طريق الخرج — حي الفيصلية", rating:4.6, reviews_count:134, since:2012,
      phone:"+966500000005", whatsapp:"966500000005", verified:true, plan:"pro",
      hours:"السبت – الخميس · ٩ص – ١٠م", makes:["mercedes","bmw"],
      about:"قطع مرسيدس و BMW وارد أوروبي، مع إمكانية الفحص بجهاز الكمبيوتر قبل البيع." },
    { id:"s6", slug:"qassim-trucks", name:"قطع القصيم للوانيتات", name_en:"Qassim Truck Parts", type:"yard",
      city:"qassim", district:"طريق المدينة — بريدة", rating:4.2, reviews_count:64, since:2016,
      phone:"+966500000006", whatsapp:"966500000006", verified:false, plan:"free",
      hours:"السبت – الخميس · ٧ص – ٨م", makes:["toyota","isuzu","nissan"],
      about:"تخصص هايلكس ودي ماكس ونافارا: عفشة، مكاين ديزل، وقطع شاصي." },
    { id:"s7", slug:"fast-fit-jubail", name:"ورشة الجبيل السريعة", name_en:"Jubail Fast Fit", type:"workshop",
      city:"jubail", district:"الصناعية — الفناتير", rating:4.4, reviews_count:52, since:2018,
      phone:"+966500000007", whatsapp:"966500000007", verified:false, plan:"free",
      hours:"السبت – الخميس · ٨ص – ٨م", makes:["hyundai","toyota","kia"],
      about:"ورشة تبيع القطع وتركبها في نفس اليوم، مع ضمان على التركيب." },
    { id:"s8", slug:"abu-mohammed", name:"أبو محمد — بيع قطع شخصية", name_en:"Abu Mohammed (individual)", type:"person",
      city:"riyadh", district:"حي الياسمين", rating:4.1, reviews_count:11, since:2024,
      phone:"+966500000008", whatsapp:"966500000008", verified:false, plan:"free",
      hours:"بعد العصر", makes:["hyundai"],
      about:"أبيع قطع سيارتي السابقة (سوناتا ٢٠١٧) بعد ما استبدلتها." }
  ],

  /* --- listings --------------------------------------------------------- */
  listings: [
    { id:"l1",  ref:"QT-1001", part_name:"صدام أمامي", category:"body", make:"toyota", model:"camry", year_from:2015, year_to:2017, condition:"b", origin:"used_sa", price:480, price_old:650, qty:1, oem:"52119-06962", seller_id:"s1", city:"riyadh", delivery:["pickup","city","shipping"], warranty_days:7, featured:true,  views:412, created_at:"2026-09-12", notes:"صدام أصلي مفكوك من كامري ٢٠١٦، فيه خدش بسيط من الجهة اليمنى يختفي بالبوليش. الحساسات غير مشمولة." },
    { id:"l2",  ref:"QT-1002", part_name:"شمعة أمامية يمين", category:"lighting", make:"toyota", model:"landcruiser", year_from:2016, year_to:2020, condition:"a", origin:"used_jp", price:1450, price_old:0, qty:2, oem:"81145-60F60", seller_id:"s3", city:"jeddah", delivery:["pickup","shipping"], warranty_days:14, featured:true, views:588, created_at:"2026-09-14", notes:"شمعة LED أصلية وارد ياباني، الزجاج نظيف بدون تشققات، جميع الأرجل سليمة." },
    { id:"l3",  ref:"QT-1003", part_name:"قير أوتوماتيك", category:"gearbox", make:"nissan", model:"altima", year_from:2013, year_to:2018, condition:"b", origin:"used_sa", price:2700, price_old:3200, qty:1, oem:"31020-3TX0C", seller_id:"s1", city:"riyadh", delivery:["pickup","city"], warranty_days:14, featured:false, views:730, created_at:"2026-09-10", notes:"قير CVT مفحوص ومجرب على السيارة قبل الفك، ضمان ١٤ يوم استبدال." },
    { id:"l4",  ref:"QT-1004", part_name:"كمبيوتر المحرك ECU", category:"electric", make:"hyundai", model:"sonata", year_from:2015, year_to:2019, condition:"b", origin:"used_sa", price:850, price_old:0, qty:3, oem:"39131-2GGA5", seller_id:"s4", city:"dammam", delivery:["pickup","shipping"], warranty_days:7, featured:false, views:265, created_at:"2026-09-08", notes:"يحتاج برمجة عند الوكالة أو ورشة كهرباء. نوفر رقم القطعة للتأكد من التطابق." },
    { id:"l5",  ref:"QT-1005", part_name:"مكينة كاملة", category:"engine", make:"toyota", model:"corolla", year_from:2014, year_to:2019, condition:"b", origin:"used_jp", price:5200, price_old:6000, qty:1, oem:"2ZR-FE", seller_id:"s3", city:"jeddah", delivery:["pickup","shipping","install"], warranty_days:30, featured:true, views:911, created_at:"2026-09-15", notes:"مكينة 2ZR وارد ياباني ممشى ٨٠ ألف، مع تقرير فحص ضغط وصور للبساتم." },
    { id:"l6",  ref:"QT-1006", part_name:"كمبروسر مكيف", category:"ac", make:"chevrolet", model:"tahoe", year_from:2015, year_to:2020, condition:"b", origin:"used_us", price:690, price_old:0, qty:2, oem:"84208257", seller_id:"s2", city:"khobar", delivery:["pickup","city","shipping"], warranty_days:14, featured:false, views:198, created_at:"2026-09-11", notes:"مجرب على جهاز الشحن، تبريد ممتاز، مع الكلتش." },
    { id:"l7",  ref:"QT-1007", part_name:"باب أمامي يسار", category:"body", make:"hyundai", model:"elantra", year_from:2017, year_to:2020, condition:"c", origin:"used_sa", price:620, price_old:0, qty:1, oem:"76003-F2000", seller_id:"s4", city:"dammam", delivery:["pickup","city"], warranty_days:0, featured:false, views:141, created_at:"2026-09-06", notes:"باب كامل بالزجاج والماطور، لون فضي، يحتاج دهان جزئي." },
    { id:"l8",  ref:"QT-1008", part_name:"جنط 20 بوصة (طقم)", category:"wheels", make:"gmc", model:"yukon", year_from:2015, year_to:2020, condition:"a", origin:"used_sa", price:2400, price_old:2900, qty:1, oem:"", seller_id:"s2", city:"khobar", delivery:["pickup","shipping"], warranty_days:0, featured:false, views:377, created_at:"2026-09-13", notes:"طقم ٤ جنوط أصلية مقاس ٢٠ بحالة ممتازة، بدون اعوجاج، الإطارات غير مشمولة." },
    { id:"l9",  ref:"QT-1009", part_name:"مساعد أمامي يمين", category:"suspension", make:"toyota", model:"prado", year_from:2014, year_to:2019, condition:"b", origin:"used_sa", price:420, price_old:0, qty:4, oem:"48510-69745", seller_id:"s1", city:"riyadh", delivery:["pickup","city","shipping"], warranty_days:7, featured:false, views:223, created_at:"2026-09-09", notes:"مساعد أصلي بدون تزييت، مجرب." },
    { id:"l10", ref:"QT-1010", part_name:"طقم كراسي جلد", category:"interior", make:"lexus", model:"es", year_from:2016, year_to:2021, condition:"a", origin:"used_jp", price:4800, price_old:5500, qty:1, oem:"", seller_id:"s3", city:"jeddah", delivery:["pickup","shipping","install"], warranty_days:0, featured:true, views:642, created_at:"2026-09-16", notes:"طقم كامل بيج فاتح، كهرباء وتدفئة تعمل، بدون تشققات." },
    { id:"l11", ref:"QT-1011", part_name:"رديتر", category:"engine", make:"nissan", model:"patrol", year_from:2012, year_to:2019, condition:"b", origin:"used_sa", price:560, price_old:0, qty:2, oem:"21460-5ZM0A", seller_id:"s6", city:"qassim", delivery:["pickup","shipping"], warranty_days:7, featured:false, views:167, created_at:"2026-09-07", notes:"رديتر أصلي مغسول ومختبر ضغط، بدون تسريب." },
    { id:"l12", ref:"QT-1012", part_name:"شمعة خلفية يسار", category:"lighting", make:"kia", model:"cerato", year_from:2019, year_to:2023, condition:"a", origin:"used_sa", price:380, price_old:0, qty:1, oem:"92401-M6000", seller_id:"s4", city:"dammam", delivery:["pickup","city","shipping"], warranty_days:7, featured:false, views:129, created_at:"2026-09-05", notes:"شمعة نظيفة بدون كسر في الأرجل، كل اللمبات تعمل." },
    { id:"l13", ref:"QT-1013", part_name:"دينمو", category:"electric", make:"toyota", model:"hilux", year_from:2016, year_to:2022, condition:"b", origin:"used_sa", price:520, price_old:640, qty:2, oem:"27060-0L090", seller_id:"s6", city:"qassim", delivery:["pickup","shipping"], warranty_days:14, featured:false, views:203, created_at:"2026-09-12", notes:"دينمو مجرب على البنش، شحن ثابت ١٤.٢ فولت." },
    { id:"l14", ref:"QT-1014", part_name:"صدام خلفي", category:"body", make:"mercedes", model:"eclass", year_from:2014, year_to:2018, condition:"b", origin:"used_eu", price:1650, price_old:0, qty:1, oem:"A2128850025", seller_id:"s5", city:"riyadh", delivery:["pickup","shipping"], warranty_days:0, featured:false, views:312, created_at:"2026-09-14", notes:"صدام أصلي بحساسات الركن، لون أسود، خدش خفيف أسفل الصدام." },
    { id:"l15", ref:"QT-1015", part_name:"طرمبة دركسون", category:"suspension", make:"ford", model:"f150", year_from:2012, year_to:2018, condition:"c", origin:"used_us", price:340, price_old:0, qty:1, oem:"BL3Z-3A674-B", seller_id:"s2", city:"khobar", delivery:["pickup","shipping"], warranty_days:7, featured:false, views:98, created_at:"2026-09-04", notes:"طرمبة تعمل بدون صوت، فيها أثر تسريب خفيف من الجوان تم تنظيفه." },
    { id:"l16", ref:"QT-1016", part_name:"شاشة الوسائط", category:"interior", make:"chevrolet", model:"malibu", year_from:2016, year_to:2020, condition:"b", origin:"used_us", price:760, price_old:900, qty:1, oem:"84190171", seller_id:"s2", city:"khobar", delivery:["pickup","shipping"], warranty_days:14, featured:false, views:245, created_at:"2026-09-10", notes:"شاشة أصلية تعمل مع أبل كاربلاي، بدون خدوش على اللمس." },
    { id:"l17", ref:"QT-1017", part_name:"كبوت", category:"body", make:"honda", model:"accord", year_from:2018, year_to:2022, condition:"b", origin:"used_sa", price:850, price_old:0, qty:1, oem:"60100-TVA-A90", seller_id:"s3", city:"jeddah", delivery:["pickup","shipping"], warranty_days:0, featured:false, views:176, created_at:"2026-09-08", notes:"كبوت بدون صدمات، لون أبيض لؤلؤي، جاهز للتركيب." },
    { id:"l18", ref:"QT-1018", part_name:"كاليبر فرامل أمامي", category:"brakes", make:"bmw", model:"s5", year_from:2013, year_to:2017, condition:"b", origin:"used_eu", price:720, price_old:0, qty:2, oem:"34116799465", seller_id:"s5", city:"riyadh", delivery:["pickup","shipping"], warranty_days:14, featured:false, views:134, created_at:"2026-09-06", notes:"كاليبر مع الفحمات، البستم يتحرك بسلاسة." },
    { id:"l19", ref:"QT-1019", part_name:"مروحة مكيف (طقم)", category:"ac", make:"hyundai", model:"tucson", year_from:2016, year_to:2020, condition:"b", origin:"used_sa", price:430, price_old:0, qty:1, oem:"25380-D3600", seller_id:"s7", city:"jubail", delivery:["pickup","city","install"], warranty_days:7, featured:false, views:88, created_at:"2026-09-03", notes:"طقم مراوح كامل بالغطاء، مجرب ويشتغل على السرعتين." },
    { id:"l20", ref:"QT-1020", part_name:"زجاج أمامي", category:"glass", make:"toyota", model:"camry", year_from:2018, year_to:2023, condition:"a", origin:"new_after", price:640, price_old:0, qty:5, oem:"", seller_id:"s1", city:"riyadh", delivery:["pickup","city","install"], warranty_days:0, featured:false, views:159, created_at:"2026-09-11", notes:"زجاج جديد تجاري مع فتحة الحساس، التركيب متوفر بـ ١٥٠ ريال." },
    { id:"l21", ref:"QT-1021", part_name:"كمبروسر مكيف", category:"ac", make:"hyundai", model:"sonata", year_from:2015, year_to:2019, condition:"c", origin:"used_sa", price:390, price_old:0, qty:1, oem:"97701-C1100", seller_id:"s8", city:"riyadh", delivery:["pickup"], warranty_days:0, featured:false, views:71, created_at:"2026-09-02", notes:"مفكوك من سيارتي، يشتغل لكن فيه صوت خفيف عند التشغيل. السعر قابل للتفاوض." },
    { id:"l22", ref:"QT-1022", part_name:"عكس (دفرنس) خلفي", category:"gearbox", make:"toyota", model:"landcruiser", year_from:2010, year_to:2015, condition:"b", origin:"used_sa", price:3100, price_old:3600, qty:1, oem:"41110-60B00", seller_id:"s1", city:"riyadh", delivery:["pickup","shipping"], warranty_days:14, featured:false, views:289, created_at:"2026-09-13", notes:"عكس كامل بالنسبة الأصلية، بدون أصوات، مجرب على السيارة." },
    { id:"l23", ref:"QT-1023", part_name:"مرايا جانبية يمين", category:"lighting", make:"kia", model:"sportage", year_from:2017, year_to:2021, condition:"a", origin:"used_sa", price:310, price_old:0, qty:2, oem:"87620-D9", seller_id:"s4", city:"dammam", delivery:["pickup","city","shipping"], warranty_days:7, featured:false, views:112, created_at:"2026-09-09", notes:"مرايا كهرباء بالإشارة والطي، لون أبيض." },
    { id:"l24", ref:"QT-1024", part_name:"تربو", category:"engine", make:"isuzu", model:"dmax", year_from:2015, year_to:2020, condition:"b", origin:"used_sa", price:1850, price_old:0, qty:1, oem:"8-98178-825-1", seller_id:"s6", city:"qassim", delivery:["pickup","shipping"], warranty_days:14, featured:false, views:204, created_at:"2026-09-07", notes:"تربو نظيف بدون خبط في الريش، محور بدون خلوص." },
    { id:"l25", ref:"QT-1025", part_name:"شكمان كامل", category:"exhaust", make:"chevrolet", model:"caprice", year_from:2012, year_to:2017, condition:"c", origin:"used_sa", price:520, price_old:0, qty:1, oem:"", seller_id:"s2", city:"khobar", delivery:["pickup"], warranty_days:0, featured:false, views:93, created_at:"2026-09-05", notes:"شكمان كامل مع الكتلايزر، فيه صدأ سطحي." },
    { id:"l26", ref:"QT-1026", part_name:"سلف (مارش)", category:"electric", make:"mitsubishi", model:"pajero", year_from:2012, year_to:2019, condition:"b", origin:"used_jp", price:470, price_old:0, qty:2, oem:"MR994325", seller_id:"s3", city:"jeddah", delivery:["pickup","shipping"], warranty_days:14, featured:false, views:121, created_at:"2026-09-10", notes:"سلف وارد ياباني مجرب على البنش." },
    { id:"l27", ref:"QT-1027", part_name:"رفرف أمامي يمين", category:"body", make:"nissan", model:"sunny", year_from:2016, year_to:2022, condition:"b", origin:"used_sa", price:220, price_old:0, qty:3, oem:"63100-3AW0A", seller_id:"s4", city:"dammam", delivery:["pickup","city","shipping"], warranty_days:0, featured:false, views:104, created_at:"2026-09-04", notes:"رفرف بدون صدأ، يحتاج دهان بلون السيارة." },
    { id:"l28", ref:"QT-1028", part_name:"هوب فرامل خلفي", category:"brakes", make:"toyota", model:"hiace", year_from:2014, year_to:2019, condition:"b", origin:"used_sa", price:280, price_old:0, qty:4, oem:"", seller_id:"s7", city:"jubail", delivery:["pickup","city","install"], warranty_days:7, featured:false, views:66, created_at:"2026-09-01", notes:"هوب بحالة جيدة مع إمكانية الخراطة والتركيب في الورشة." }
  ],

  /* --- open part requests (the RFQ board) -------------------------------- */
  requests: [
    { id:"r1", ref:"RQ-501", make:"toyota", model:"camry", year:2016, part_name:"صدام أمامي", category:"body", city:"riyadh", urgency:"week", condition_pref:"b", status:"open", created_at:"2026-09-18", quotes_count:3, name:"سعود", notes:"أبي صدام أمامي أصلي، يفضل لون أبيض ٠٤٠، وإذا فيه حساسات أفضل." },
    { id:"r2", ref:"RQ-502", make:"hyundai", model:"accent", year:2019, part_name:"شمعة أمامية يسار", category:"lighting", city:"dammam", urgency:"today", condition_pref:"a", status:"open", created_at:"2026-09-19", quotes_count:2, name:"عبدالله", notes:"السيارة عندي في الفحص الدوري وما تعدي بدون شمعة سليمة." },
    { id:"r3", ref:"RQ-503", make:"chevrolet", model:"tahoe", year:2018, part_name:"كمبروسر مكيف", category:"ac", city:"khobar", urgency:"today", condition_pref:"b", status:"open", created_at:"2026-09-19", quotes_count:1, name:"فهد", notes:"المكيف ما يبرد والورشة قالت الكمبروسر. أبي قطعة مضمونة." },
    { id:"r4", ref:"RQ-504", make:"lexus", model:"lx", year:2013, part_name:"طقم كراسي", category:"interior", city:"riyadh", urgency:"flex", condition_pref:"a", status:"open", created_at:"2026-09-17", quotes_count:4, name:"ماجد", notes:"أبحث عن طقم كراسي بني بحالة ممتازة، ويفضل مع التدفئة." },
    { id:"r5", ref:"RQ-505", make:"kia", model:"optima", year:2017, part_name:"قير أوتوماتيك", category:"gearbox", city:"jeddah", urgency:"week", condition_pref:"b", status:"open", created_at:"2026-09-16", quotes_count:2, name:"وليد", notes:"القير يرفس عند التحويل. أبي قير مجرب وبضمان لا يقل عن أسبوعين." },
    { id:"r6", ref:"RQ-506", make:"nissan", model:"patrol", year:2015, part_name:"مساعد خلفي", category:"suspension", city:"qassim", urgency:"flex", condition_pref:"b", status:"open", created_at:"2026-09-15", quotes_count:1, name:"تركي", notes:"أحتاج مساعدين خلف، والأفضل يكونون طقم." },
    { id:"r7", ref:"RQ-507", make:"ford", model:"explorer", year:2020, part_name:"كمبيوتر المحرك ECU", category:"electric", city:"riyadh", urgency:"week", condition_pref:"a", status:"open", created_at:"2026-09-18", quotes_count:0, name:"ياسر", notes:"أحتاج ECU مطابق للرقم، ويفضل من يوفر خدمة البرمجة." },
    { id:"r8", ref:"RQ-508", make:"mercedes", model:"cclass", year:2016, part_name:"شمعة أمامية يمين", category:"lighting", city:"jeddah", urgency:"week", condition_pref:"b", status:"open", created_at:"2026-09-14", quotes_count:2, name:"أحمد", notes:"شمعة LED، لو فيها خدش بسيط ما يضر، المهم تشتغل كامل." }
  ],

  /* --- quotes already posted on those requests --------------------------- */
  quotes: [
    { id:"q1", request_id:"r1", seller_id:"s1", price:480, condition:"b", warranty_days:7,  delivery:"city",     note:"متوفر عندي صدام أصلي أبيض، جاهز اليوم.", created_at:"2026-09-18" },
    { id:"q2", request_id:"r1", seller_id:"s4", price:520, condition:"a", warranty_days:14, delivery:"shipping", note:"صدام بحالة ممتازة مع الحساسات، الشحن للرياض يوم واحد.", created_at:"2026-09-18" },
    { id:"q3", request_id:"r1", seller_id:"s8", price:400, condition:"c", warranty_days:0,  delivery:"pickup",   note:"صدام فيه خدوش، السعر مغري لو تبي تدهنه.", created_at:"2026-09-19" },
    { id:"q4", request_id:"r2", seller_id:"s4", price:340, condition:"a", warranty_days:7,  delivery:"city",     note:"شمعة نظيفة، أقدر أوصلها لك اليوم.", created_at:"2026-09-19" },
    { id:"q5", request_id:"r2", seller_id:"s7", price:390, condition:"a", warranty_days:14, delivery:"install",  note:"مع التركيب في الورشة خلال ساعة.", created_at:"2026-09-19" },
    { id:"q6", request_id:"r3", seller_id:"s2", price:690, condition:"b", warranty_days:14, delivery:"city",     note:"كمبروسر مجرب على جهاز الشحن مع ضمان أسبوعين.", created_at:"2026-09-19" },
    { id:"q7", request_id:"r4", seller_id:"s3", price:4800, condition:"a", warranty_days:0, delivery:"shipping", note:"طقم بيج متوفر، البني أحاول أوفره خلال أسبوع.", created_at:"2026-09-17" },
    { id:"q8", request_id:"r5", seller_id:"s3", price:3400, condition:"b", warranty_days:30, delivery:"shipping", note:"قير وارد ياباني مع تقرير فحص وضمان شهر.", created_at:"2026-09-16" },
    { id:"q9", request_id:"r6", seller_id:"s6", price:760, condition:"b", warranty_days:7,  delivery:"shipping", note:"طقم مساعدين خلف أصلي.", created_at:"2026-09-15" },
    { id:"q10", request_id:"r8", seller_id:"s5", price:2100, condition:"b", warranty_days:14, delivery:"shipping", note:"شمعة LED أصلية وارد أوروبي، مفحوصة بالكمبيوتر.", created_at:"2026-09-14" }
  ],

  /* --- reviews (what builds the rating) ---------------------------------- */
  reviews: [
    { id:"v1", seller_id:"s1", name:"م. خالد", stars:5, date:"2026-09-10", text:"القطعة وصلت نفس اليوم ومطابقة للوصف تماماً. تعامل محترم." },
    { id:"v2", seller_id:"s1", name:"أبو ريان", stars:4, date:"2026-09-02", text:"السعر ممتاز، بس تأخر التوصيل نص يوم عن الموعد." },
    { id:"v3", seller_id:"s3", name:"سلطان", stars:5, date:"2026-09-12", text:"مكينة وارد ياباني نظيفة ومعها تقرير فحص. أنصح فيهم." },
    { id:"v4", seller_id:"s2", name:"ناصر", stars:4, date:"2026-09-08", text:"جنوط اليوكن بحالة ممتازة والشحن للرياض كان سريع." },
    { id:"v5", seller_id:"s4", name:"هاني", stars:4, date:"2026-09-05", text:"قطع كورية متوفرة دائماً، والأسعار منطقية." }
  ]
};
