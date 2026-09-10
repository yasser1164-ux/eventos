/* =========================================================================
   CONTENT DATA — services, sectors, catalogue, projects, jobs, quotes, FAQ.
   Every entry carries both languages. Add / edit freely: the pages render
   whatever is in here, so no HTML has to change to add a product or a job.
   NOTE: figures and references below are illustrative placeholders for a
   company that is still being founded — replace them with real ones.
   ========================================================================= */
window.DATA = (function () {
  "use strict";

  /* ---- 1. Divisions / services --------------------------------------- */
  var services = [
    { id:"building", scene:"site", icon:"building", palette:"red",
      t:{ar:"مواد البناء والإنشاء", en:"Building & Construction Materials"},
      d:{ar:"توريد مواد البناء للمشاريع السكنية والتجارية والصناعية، من الحديد والأسمنت إلى التشطيبات والعزل، بكميات المشاريع وبجداول تسليم ملتزمة.",
         en:"Project-scale supply of construction materials — rebar, cement, insulation and finishes — delivered on committed schedules."},
      items:{ar:["حديد التسليح والمقاطع الإنشائية","الأسمنت والخرسانة الجاهزة والإضافات","مواد العزل المائي والحراري","الأدوات الصحية والسباكة","التشطيبات والأرضيات"],
             en:["Rebar & structural steel sections","Cement, ready-mix and admixtures","Waterproofing & thermal insulation","Sanitary ware & plumbing","Finishes and flooring"]} },

    { id:"industrial", scene:"plant", icon:"gear", palette:"steel",
      t:{ar:"الإمدادات الصناعية وقطع الغيار", en:"Industrial Supplies & Spare Parts"},
      d:{ar:"قطع غيار ومستهلكات المصانع والورش: مضخات وصمامات ومحامل وأدوات، مع بدائل معتمدة عند نفاد الأصلي لتقليل زمن التوقف.",
         en:"Plant and workshop spares — pumps, valves, bearings and tooling — with approved alternates when the original is out of stock, so downtime stays short."},
      items:{ar:["المضخات والصمامات والوصلات","المحامل وأنظمة الحركة","الأدوات اليدوية والكهربائية","مستهلكات اللحام والقطع","زيوت ومواد التشحيم"],
             en:["Pumps, valves and fittings","Bearings & power transmission","Hand and power tools","Welding & cutting consumables","Lubricants and oils"]} },

    { id:"electrical", scene:"power", icon:"bolt", palette:"gold",
      t:{ar:"المعدات الكهربائية والطاقة", en:"Electrical & Power Equipment"},
      d:{ar:"كل ما يتصل بالتوزيع الكهربائي داخل المنشآت: كابلات ولوحات ومولدات وأنظمة إنارة، بمواصفات تطابق كود البناء السعودي.",
         en:"Everything on the distribution side — cable, panels, gensets and lighting — specified to the Saudi Building Code."},
      items:{ar:["الكابلات والموصلات","لوحات التوزيع والقواطع","المولدات وأنظمة عدم الانقطاع","الإنارة الصناعية والتجارية","أنظمة الطاقة الشمسية"],
             en:["Cable & connectors","Distribution boards and breakers","Generators and UPS systems","Industrial & commercial lighting","Solar power systems"]} },

    { id:"safety", scene:"safety", icon:"helmet", palette:"red",
      t:{ar:"السلامة ومعدات الوقاية", en:"Safety & Personal Protection"},
      d:{ar:"معدات وقاية شخصية ومستلزمات السلامة بالمواقع، من الخوذ والأحذية إلى أنظمة الحماية من السقوط ومكافحة الحريق.",
         en:"PPE and site safety equipment, from helmets and boots to fall-arrest systems and fire protection."},
      items:{ar:["الخوذ والنظارات وواقيات السمع","الأحذية وملابس العمل","أنظمة الحماية من السقوط","طفايات ومعدات مكافحة الحريق","لوحات وإشارات السلامة"],
             en:["Helmets, eyewear and hearing protection","Safety footwear and workwear","Fall-arrest systems","Fire extinguishers & equipment","Safety signage"]} },

    { id:"trade", scene:"port", icon:"ship", palette:"mix",
      t:{ar:"الاستيراد والتصدير والتخليص", en:"Import, Export & Customs Clearance"},
      d:{ar:"إدارة دورة الاستيراد كاملة: مصادر التوريد، الشحن، الشهادات، فسح الجمارك وشهادات المطابقة (سابر) حتى وصول البضاعة لمستودعك.",
         en:"The full import cycle — sourcing, shipping, certification, customs release and SABER conformity — up to the door of your warehouse."},
      items:{ar:["البحث عن المصادر والتفاوض","الشحن البحري والجوي والبري","شهادات المطابقة والفسح الجمركي","التأمين على الشحنات","التوريد بالإنابة"],
             en:["Sourcing and negotiation","Sea, air and land freight","Conformity certificates & customs release","Cargo insurance","Procurement on your behalf"]} },

    { id:"logistics", scene:"warehouse", icon:"truck", palette:"ink",
      t:{ar:"الخدمات اللوجستية والتخزين", en:"Logistics & Warehousing"},
      d:{ar:"تخزين وتوزيع للمشاريع طويلة الأمد، مع جرد دوري وتسليم مجدول إلى المواقع في كل مناطق المملكة.",
         en:"Storage and distribution for long-running projects, with cycle counts and scheduled site deliveries across the Kingdom."},
      items:{ar:["تخزين قصير وطويل الأمد","إدارة المخزون والجرد","التسليم المجدول للمواقع","التغليف وإعادة التعبئة","التوزيع داخل المملكة"],
             en:["Short and long-term storage","Inventory management & stock counts","Scheduled site delivery","Packing and re-packing","Kingdom-wide distribution"]} }
  ];

  /* ---- 2. Sectors we serve ------------------------------------------- */
  var sectors = [
    { id:"construction", scene:"site", icon:"building", palette:"red",
      t:{ar:"المقاولات والإنشاءات", en:"Construction & Contracting"},
      d:{ar:"توريد متواصل يواكب جدول المشروع", en:"Continuous supply that tracks the programme"} },
    { id:"oilgas", scene:"plant", icon:"oil", palette:"ink",
      t:{ar:"النفط والغاز والبتروكيماويات", en:"Oil, Gas & Petrochemicals"},
      d:{ar:"مواد ومستلزمات بمواصفات دقيقة", en:"Tightly specified materials and consumables"} },
    { id:"manufacturing", scene:"warehouse", icon:"factory", palette:"steel",
      t:{ar:"الصناعة والتصنيع", en:"Industry & Manufacturing"},
      d:{ar:"قطع غيار تقلل زمن توقف الخطوط", en:"Spares that cut line downtime"} },
    { id:"utilities", scene:"power", icon:"grid", palette:"gold",
      t:{ar:"المرافق والطاقة", en:"Utilities & Power"},
      d:{ar:"معدات توزيع ومواد شبكات", en:"Distribution equipment and network materials"} },
    { id:"government", scene:"office", icon:"gov", palette:"mix",
      t:{ar:"القطاع الحكومي والمشاريع العامة", en:"Government & Public Projects"},
      d:{ar:"توريد متوافق مع أنظمة المنافسات", en:"Supply aligned with public tender rules"} },
    { id:"retail", scene:"logistics", icon:"shop", palette:"red",
      t:{ar:"التجزئة والتوزيع", en:"Retail & Distribution"},
      d:{ar:"كميات الجملة وسلاسل الإمداد", en:"Wholesale volumes and supply chains"} }
  ];

  /* ---- 3. Catalogue --------------------------------------------------- */
  var categories = [
    { id:"building",   t:{ar:"مواد البناء", en:"Building materials"} },
    { id:"industrial", t:{ar:"إمدادات صناعية", en:"Industrial supplies"} },
    { id:"electrical", t:{ar:"كهرباء وطاقة", en:"Electrical & power"} },
    { id:"safety",     t:{ar:"السلامة والوقاية", en:"Safety & PPE"} },
    { id:"logistics",  t:{ar:"تغليف وتخزين", en:"Packing & storage"} }
  ];

  var availability = [
    { id:"stock",  t:{ar:"متوفر بالمستودع", en:"In stock"} },
    { id:"order",  t:{ar:"توريد حسب الطلب", en:"Made to order"} },
    { id:"import", t:{ar:"استيراد مباشر", en:"Direct import"} }
  ];

  var products = [
    { id:"P-1001", cat:"building", icon:"building", palette:"red", av:"stock", featured:true,
      t:{ar:"حديد تسليح مضلع — درجة 60", en:"Deformed rebar — Grade 60"},
      d:{ar:"أقطار من ٨ إلى ٣٢ مم، مطابق للمواصفة السعودية، مع شهادة مصنع لكل شحنة.", en:"8–32 mm diameters, to Saudi standard, mill certificate with every load."},
      specs:{ar:["أقطار ٨–٣٢ مم","أطوال ٦ و١٢ م","شهادة مصنع"], en:["8–32 mm","6 m & 12 m lengths","Mill certificate"]}, unit:{ar:"طن", en:"tonne"} },

    { id:"P-1002", cat:"building", icon:"box", palette:"mix", av:"stock",
      t:{ar:"أسمنت بورتلاندي عادي", en:"Ordinary Portland cement"},
      d:{ar:"عبوات ٥٠ كجم أو سائب، توريد بالشاحنة إلى الموقع مباشرة.", en:"50 kg bags or bulk, delivered by the truckload straight to site."},
      specs:{ar:["عبوة ٥٠ كجم","توريد سائب","تسليم للموقع"], en:["50 kg bags","Bulk supply","Site delivery"]}, unit:{ar:"كيس", en:"bag"} },

    { id:"P-1003", cat:"building", icon:"shield", palette:"steel", av:"order",
      t:{ar:"ألواح العزل الحراري", en:"Thermal insulation boards"},
      d:{ar:"ألواح بولي ستايرين وصوف صخري بسماكات مختلفة للأسطح والجدران.", en:"Polystyrene and rock-wool boards in a range of thicknesses for roofs and walls."},
      specs:{ar:["سماكات ٢٥–١٠٠ مم","مقاوم للحريق","مطابق للكود"], en:["25–100 mm","Fire rated","Code compliant"]}, unit:{ar:"م²", en:"m²"} },

    { id:"P-1004", cat:"building", icon:"pipe", palette:"ink", av:"stock",
      t:{ar:"أنابيب وتوصيلات UPVC", en:"UPVC pipe & fittings"},
      d:{ar:"أنابيب صرف وتغذية بأقطار متعددة مع كامل التوصيلات.", en:"Drainage and supply pipe in multiple diameters with the full fitting range."},
      specs:{ar:["أقطار ٢٠–٢٠٠ مم","ضغط ٦–١٦ بار","توصيلات كاملة"], en:["20–200 mm","6–16 bar","Complete fittings"]}, unit:{ar:"متر", en:"m"} },

    { id:"P-2001", cat:"industrial", icon:"valve", palette:"steel", av:"import", featured:true,
      t:{ar:"صمامات بوابة وكرة صناعية", en:"Industrial gate & ball valves"},
      d:{ar:"صمامات فولاذية ومن الحديد الزهر لخطوط المياه والبخار والهواء المضغوط.", en:"Steel and cast-iron valves for water, steam and compressed-air lines."},
      specs:{ar:["أقطار ½\" – ١٢\"","ضغط حتى ٣٠٠ رطل","شهادة اختبار"], en:["½\" – 12\"","Up to 300 lb","Test certificate"]}, unit:{ar:"قطعة", en:"pc"} },

    { id:"P-2002", cat:"industrial", icon:"gear", palette:"ink", av:"order",
      t:{ar:"مضخات طرد مركزي", en:"Centrifugal pumps"},
      d:{ar:"مضخات مياه ومواد كيميائية بمعدلات تدفق مختلفة مع لوحات تحكم.", en:"Water and chemical pumps across a range of duties, with control panels."},
      specs:{ar:["تدفق حتى ٥٠٠ م³/س","محركات كفاءة عالية","لوحة تحكم"], en:["Up to 500 m³/h","High-efficiency motors","Control panel"]}, unit:{ar:"وحدة", en:"unit"} },

    { id:"P-2003", cat:"industrial", icon:"tools", palette:"gold", av:"stock",
      t:{ar:"عدد وأدوات ورش", en:"Workshop tools & equipment"},
      d:{ar:"أدوات يدوية وكهربائية للورش وفرق الصيانة بعلامات تجارية معروفة.", en:"Hand and power tools for workshops and maintenance crews from known brands."},
      specs:{ar:["أطقم كاملة","ضمان المصنع","بدائل معتمدة"], en:["Complete sets","Manufacturer warranty","Approved alternates"]}, unit:{ar:"طقم", en:"set"} },

    { id:"P-2004", cat:"industrial", icon:"gear", palette:"red", av:"import",
      t:{ar:"محامل وأنظمة نقل الحركة", en:"Bearings & power transmission"},
      d:{ar:"محامل وسيور وتروس ووصلات لخطوط الإنتاج والمعدات الثقيلة.", en:"Bearings, belts, gears and couplings for production lines and heavy plant."},
      specs:{ar:["مقاسات قياسية","توريد سريع","بدائل مكافئة"], en:["Standard sizes","Fast supply","Equivalent alternates"]}, unit:{ar:"قطعة", en:"pc"} },

    { id:"P-3001", cat:"electrical", icon:"cable", palette:"gold", av:"stock", featured:true,
      t:{ar:"كابلات نحاسية للجهد المنخفض", en:"LV copper cable"},
      d:{ar:"كابلات نحاسية معزولة بمقاسات المشاريع، مطابقة لمواصفات الشركة السعودية للكهرباء.", en:"Insulated copper cable in project sizes, to Saudi Electricity Company specification."},
      specs:{ar:["١.٥ – ٤٠٠ مم²","معزول XLPE / PVC","بكرات كاملة"], en:["1.5 – 400 mm²","XLPE / PVC","Full drums"]}, unit:{ar:"متر", en:"m"} },

    { id:"P-3002", cat:"electrical", icon:"grid", palette:"steel", av:"order",
      t:{ar:"لوحات التوزيع الكهربائية", en:"Distribution boards"},
      d:{ar:"لوحات مجمعة حسب المخطط أحادي الخط مع القواطع وأجهزة القياس.", en:"Assembled to your single-line diagram, complete with breakers and metering."},
      specs:{ar:["تجميع حسب الطلب","IP٤٢ – IP٦٥","اختبار قبل التسليم"], en:["Built to order","IP42 – IP65","Tested before delivery"]}, unit:{ar:"لوحة", en:"board"} },

    { id:"P-3003", cat:"electrical", icon:"bolt", palette:"mix", av:"import",
      t:{ar:"مولدات ديزل", en:"Diesel generators"},
      d:{ar:"مولدات من ٢٠ إلى ١٠٠٠ ك.ف.أ، صامتة أو مكشوفة، مع لوحة نقل تلقائي.", en:"20 to 1000 kVA, canopied or open, with automatic transfer switch."},
      specs:{ar:["٢٠–١٠٠٠ ك.ف.أ","نقل تلقائي","عقود صيانة"], en:["20–1000 kVA","Auto transfer","Service contracts"]}, unit:{ar:"وحدة", en:"unit"} },

    { id:"P-3004", cat:"electrical", icon:"bolt", palette:"gold", av:"order",
      t:{ar:"وحدات إنارة صناعية LED", en:"Industrial LED lighting"},
      d:{ar:"كشافات ووحدات إنارة للمستودعات والساحات والمصانع بكفاءة عالية.", en:"High-efficiency floodlights and fittings for warehouses, yards and plants."},
      specs:{ar:["٥٠–٤٠٠ واط","IP٦٦","ضمان ٥ سنوات"], en:["50–400 W","IP66","5-year warranty"]}, unit:{ar:"وحدة", en:"unit"} },

    { id:"P-4001", cat:"safety", icon:"helmet", palette:"red", av:"stock", featured:true,
      t:{ar:"خوذ السلامة", en:"Safety helmets"},
      d:{ar:"خوذ بنظام تعليق قابل للضبط، ألوان متعددة، مع إمكانية الطباعة بشعار الشركة.", en:"Adjustable-suspension helmets in several colours, printable with your logo."},
      specs:{ar:["مطابق ANSI / EN","ألوان متعددة","طباعة الشعار"], en:["ANSI / EN certified","Multiple colours","Logo printing"]}, unit:{ar:"قطعة", en:"pc"} },

    { id:"P-4002", cat:"safety", icon:"shield", palette:"ink", av:"stock",
      t:{ar:"أحذية السلامة", en:"Safety footwear"},
      d:{ar:"أحذية بمقدمة فولاذية أو مركبة مقاومة للانزلاق والحرارة.", en:"Steel or composite toe caps, slip and heat resistant."},
      specs:{ar:["مقدمة فولاذية/مركبة","مقاس ٣٨–٤٦","مقاوم للانزلاق"], en:["Steel/composite toe","EU 38–46","Slip resistant"]}, unit:{ar:"زوج", en:"pair"} },

    { id:"P-4003", cat:"safety", icon:"shield", palette:"gold", av:"order",
      t:{ar:"أنظمة الحماية من السقوط", en:"Fall-arrest systems"},
      d:{ar:"أحزمة كاملة وحبال وممتصات صدمات للعمل على الارتفاعات.", en:"Full-body harnesses, lanyards and shock absorbers for work at height."},
      specs:{ar:["حزام كامل","حبل مزدوج","فحص دوري"], en:["Full-body harness","Twin lanyard","Periodic inspection"]}, unit:{ar:"طقم", en:"set"} },

    { id:"P-4004", cat:"safety", icon:"shield", palette:"red", av:"stock",
      t:{ar:"طفايات ومعدات مكافحة الحريق", en:"Fire extinguishers & equipment"},
      d:{ar:"طفايات بأنواعها مع خدمة التعبئة والفحص الدوري في الموقع.", en:"All extinguisher types, with on-site refilling and periodic inspection."},
      specs:{ar:["بودرة / CO₂ / رغوة","تعبئة وفحص","لوحات إرشادية"], en:["Powder / CO₂ / foam","Refill & inspection","Signage"]}, unit:{ar:"قطعة", en:"pc"} },

    { id:"P-5001", cat:"logistics", icon:"box", palette:"mix", av:"stock",
      t:{ar:"مواد التغليف الصناعي", en:"Industrial packing materials"},
      d:{ar:"أفلام ستريتش وشرائط وصناديق وأركان حماية لتجهيز الشحنات.", en:"Stretch film, strapping, cartons and edge protectors for outbound shipments."},
      specs:{ar:["أفلام ستريتش","شرائط تثبيت","صناديق كرتون"], en:["Stretch film","Strapping","Cartons"]}, unit:{ar:"لفة", en:"roll"} },

    { id:"P-5002", cat:"logistics", icon:"truck", palette:"steel", av:"order",
      t:{ar:"رفوف ومنصات التخزين", en:"Racking & pallets"},
      d:{ar:"رفوف معدنية ومنصات خشبية وبلاستيكية بأحمال مختلفة للمستودعات.", en:"Steel racking and wooden or plastic pallets across load ratings."},
      specs:{ar:["أحمال حتى ٣ طن","تركيب بالموقع","تصميم حسب المساحة"], en:["Up to 3 t","On-site install","Laid out to your space"]}, unit:{ar:"وحدة", en:"unit"} }
  ];

  /* ---- 4. Case studies (illustrative) --------------------------------- */
  var projects = [
    { id:"PR-01", scene:"site", palette:"red", icon:"building", year:"2025",
      t:{ar:"توريد مواد إنشائية لمجمع سكني — الرياض", en:"Construction materials for a residential compound — Riyadh"},
      client:{ar:"مقاول رئيسي (اسم محفوظ)", en:"Main contractor (name withheld)"},
      sector:{ar:"المقاولات", en:"Contracting"},
      d:{ar:"جدول توريد لمدة ١٤ شهرًا لحديد التسليح والأسمنت ومواد العزل، بتسليم أسبوعي مرتبط بجدول صب الخرسانة.",
         en:"A 14-month supply programme for rebar, cement and insulation, with weekly deliveries tied to the concrete pour schedule."},
      kpis:[{n:"14",l:{ar:"شهر توريد", en:"months of supply"}},{n:"98%",l:{ar:"التزام بالمواعيد", en:"on-time delivery"}},{n:"0",l:{ar:"حوادث سلامة", en:"safety incidents"}}] },

    { id:"PR-02", scene:"plant", palette:"steel", icon:"factory", year:"2025",
      t:{ar:"قطع غيار وتقليل زمن التوقف — مصنع بالدمام", en:"Spares and downtime reduction — Dammam plant"},
      client:{ar:"مصنع مواد بناء", en:"Building-materials manufacturer"},
      sector:{ar:"الصناعة", en:"Manufacturing"},
      d:{ar:"مخزون أمان مُدار لدينا لقطع الغيار الحرجة، مع تسليم خلال ٢٤ ساعة عند الطلب بدل انتظار الاستيراد.",
         en:"A managed safety stock of critical spares held on our side, released within 24 hours instead of waiting on an import cycle."},
      kpis:[{n:"24h",l:{ar:"زمن التوريد", en:"lead time"}},{n:"37",l:{ar:"صنفًا حرجًا", en:"critical items"}},{n:"-40%",l:{ar:"زمن التوقف", en:"downtime"}}] },

    { id:"PR-03", scene:"power", palette:"gold", icon:"bolt", year:"2026",
      t:{ar:"لوحات وكابلات لمشروع مرافق — المنطقة الشرقية", en:"Panels and cable for a utilities project — Eastern Province"},
      client:{ar:"مقاول كهروميكانيكي", en:"Electromechanical contractor"},
      sector:{ar:"المرافق والطاقة", en:"Utilities"},
      d:{ar:"تجميع لوحات توزيع حسب المخطط أحادي الخط، مع توريد الكابلات على دفعات تتبع تقدم الأعمال بالموقع.",
         en:"Distribution boards assembled to the single-line diagram, with cable released in batches following site progress."},
      kpis:[{n:"22",l:{ar:"لوحة توزيع", en:"boards"}},{n:"18km",l:{ar:"كابلات", en:"of cable"}},{n:"100%",l:{ar:"اجتياز الاختبار", en:"passed testing"}}] },

    { id:"PR-04", scene:"port", palette:"mix", icon:"ship", year:"2026",
      t:{ar:"استيراد وتخليص شحنة معدات — ميناء جدة", en:"Equipment import and clearance — Jeddah port"},
      client:{ar:"شركة صناعية", en:"Industrial company"},
      sector:{ar:"الاستيراد", en:"Import"},
      d:{ar:"إدارة الشحنة من المصنع في الخارج حتى تسليمها بالموقع، شاملة شهادات المطابقة والفسح الجمركي.",
         en:"Managed from the overseas factory to site delivery, including conformity certificates and customs release."},
      kpis:[{n:"6",l:{ar:"حاويات", en:"containers"}},{n:"9",l:{ar:"أيام للفسح", en:"days to clear"}},{n:"0",l:{ar:"غرامات تأخير", en:"demurrage charges"}}] }
  ];

  /* ---- 5. What clients say (illustrative) ----------------------------- */
  var quotes = [
    { id:"Q1", initials:"أ.م",
      text:{ar:"ما نبحث عنه في مورد هو أن يرد بسرعة وأن يلتزم بما وعد به. التعامل كان واضحًا من العرض الأول حتى التسليم.",
            en:"What we want from a supplier is a fast reply and a promise that holds. Dealing with them was clear from the first quotation to delivery."},
      name:{ar:"أ. م.", en:"A. M."}, role:{ar:"مدير مشتريات — قطاع المقاولات", en:"Procurement Manager — Contracting"} },
    { id:"Q2", initials:"س.ع",
      text:{ar:"وجود مخزون أمان لقطع الغيار الحرجة وفّر علينا أيام توقف كاملة. هذا هو الفرق العملي بين مورد ووسيط.",
            en:"Holding a safety stock of our critical spares saved us whole days of downtime. That is the practical difference between a supplier and a middleman."},
      name:{ar:"س. ع.", en:"S. A." }, role:{ar:"مدير صيانة — قطاع الصناعة", en:"Maintenance Manager — Manufacturing"} },
    { id:"Q3", initials:"ف.ح",
      text:{ar:"الأوراق كانت مرتبة: شهادات مطابقة، فواتير ضريبية، وتقارير استلام. هذا يختصر وقت الاعتماد الداخلي كثيرًا.",
            en:"The paperwork was in order — conformity certificates, tax invoices, delivery reports. That shortens our internal approval cycle a lot."},
      name:{ar:"ف. ح.", en:"F. H."}, role:{ar:"رئيس قسم العقود", en:"Head of Contracts"} }
  ];

  /* ---- 6. FAQ ---------------------------------------------------------- */
  var faq = [
    { q:{ar:"كم يستغرق الحصول على عرض سعر؟", en:"How long does a quotation take?"},
      a:{ar:"نرد على طلبات التسعير خلال يوم عمل واحد للأصناف المتوفرة، وخلال ٢–٣ أيام عمل للأصناف التي تحتاج استيرادًا أو تجميعًا حسب الطلب.",
         en:"We answer within one working day for stocked items, and within two to three working days when an item needs importing or building to order."} },
    { q:{ar:"هل تورّدون خارج مدينة الرياض؟", en:"Do you deliver outside Riyadh?"},
      a:{ar:"نعم، نغطي مناطق المملكة عبر شركاء نقل معتمدين، مع جدولة التسليم حسب حاجة الموقع.",
         en:"Yes. We cover the Kingdom through vetted transport partners, with delivery scheduled around what the site needs."} },
    { q:{ar:"ما هي شروط الدفع؟", en:"What are your payment terms?"},
      a:{ar:"الدفعة الأولى عند اعتماد أمر الشراء، والباقي حسب الاتفاق. للعملاء المتعاقدين نوفّر حسابات آجلة بعد استكمال دراسة ائتمانية بسيطة.",
         en:"An advance on purchase-order approval and the balance as agreed. Contracted clients can hold credit terms after a short credit review."} },
    { q:{ar:"هل توفّرون بدائل عند عدم توفر الصنف الأصلي؟", en:"Do you offer alternates when the original item is unavailable?"},
      a:{ar:"نعم. نقترح بديلًا مكافئًا بالمواصفة مع ورقة مقارنة فنية، ولا نورّده إلا بعد اعتمادك الخطي.",
         en:"Yes. We propose an equivalent alternate with a technical comparison sheet, and supply it only after your written approval."} },
    { q:{ar:"هل تتعاملون مع المشاريع الحكومية؟", en:"Do you work on government projects?"},
      a:{ar:"نعم، ونلتزم بمتطلبات المنافسات والمشتريات الحكومية من حيث المستندات والضمانات وشهادات المنشأ.",
         en:"Yes — and we follow public-procurement requirements for documentation, guarantees and certificates of origin."} },
    { q:{ar:"كيف تضمنون جودة ما تورّدونه؟", en:"How do you assure the quality of what you supply?"},
      a:{ar:"نعتمد موردين مؤهلين، ونرفق شهادات المصنع وتقارير الفحص مع كل شحنة، ونجري فحص استلام قبل التسليم النهائي.",
         en:"We qualify our suppliers, attach mill certificates and inspection reports to every shipment, and run a receiving check before final delivery."} }
  ];

  /* ---- 7. Careers (illustrative openings) ------------------------------ */
  var jobs = [
    { id:"J-01", t:{ar:"أخصائي مشتريات", en:"Procurement Specialist"},
      dept:{ar:"المشتريات", en:"Procurement"}, loc:{ar:"الرياض", en:"Riyadh"},
      type:{ar:"دوام كامل", en:"Full time"},
      d:{ar:"مسؤول عن دراسة طلبات التسعير، التفاوض مع الموردين، وإصدار أوامر الشراء ومتابعتها حتى الاستلام.",
         en:"Owns RFQ analysis, supplier negotiation, and purchase orders through to receipt."} },
    { id:"J-02", t:{ar:"مندوب مبيعات — قطاع المقاولات", en:"Sales Representative — Contracting"},
      dept:{ar:"المبيعات", en:"Sales"}, loc:{ar:"الدمام", en:"Dammam"},
      type:{ar:"دوام كامل", en:"Full time"},
      d:{ar:"بناء علاقات مع مقاولي المنطقة الشرقية، وتحويل طلبات التسعير إلى عقود توريد.",
         en:"Builds relationships with Eastern Province contractors and turns RFQs into supply agreements."} },
    { id:"J-03", t:{ar:"مسؤول مستودع", en:"Warehouse Officer"},
      dept:{ar:"العمليات", en:"Operations"}, loc:{ar:"الرياض", en:"Riyadh"},
      type:{ar:"دوام كامل", en:"Full time"},
      d:{ar:"إدارة الاستلام والتخزين والجرد الدوري، وتجهيز الشحنات الصادرة حسب جدول التسليم.",
         en:"Runs receiving, storage and cycle counts, and prepares outbound loads against the delivery schedule."} },
    { id:"J-04", t:{ar:"محاسب", en:"Accountant"},
      dept:{ar:"المالية", en:"Finance"}, loc:{ar:"الرياض", en:"Riyadh"},
      type:{ar:"دوام كامل", en:"Full time"},
      d:{ar:"القيود اليومية، الفوترة الإلكترونية، وإقرارات ضريبة القيمة المضافة.",
         en:"Daily entries, e-invoicing and VAT returns."} }
  ];

  return { services:services, sectors:sectors, categories:categories, availability:availability,
           products:products, projects:projects, quotes:quotes, faq:faq, jobs:jobs };
})();
