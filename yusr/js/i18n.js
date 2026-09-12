/**
 * Yusr — all visible strings live here. Nothing user-facing is hard-coded in HTML.
 * Usage in markup: <h1 data-i18n="home.hero.title"></h1>
 *                  <input data-i18n-attr="placeholder:form.name.ph">
 */

export const DICT = {
  ar: {
    dir: 'rtl',
    lang: 'ar',
    htmlLang: 'ar',
    currency: 'ر.س',
    brand: { name: 'يسر', tagline: 'بيتك على راحتك' },

    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      custom: 'اطلب تفصيل',
      how: 'كيف نعمل',
      about: 'عن يسر',
      contact: 'تواصل',
      menu: 'القائمة',
      close: 'إغلاق القائمة',
      skip: 'تخطّي إلى المحتوى',
      langToggle: 'English',
      langToggleLabel: 'تغيير اللغة إلى الإنجليزية',
      whatsapp: 'واتساب'
    },

    common: {
      from: 'يبدأ من',
      to: 'إلى',
      orderNow: 'اطلب الآن',
      orderThis: 'اطلب هذا المنتج',
      viewAll: 'عرض كل المنتجات',
      details: 'التفاصيل',
      days: 'يوم',
      years: 'سنوات',
      leadTime: 'مدة التنفيذ',
      material: 'الخامة',
      loading: 'جاري التحميل…',
      backToProducts: 'رجوع إلى المنتجات',
      required: 'مطلوب',
      sample: 'نموذج توضيحي'
    },

    cat: {
      all: 'الكل',
      furniture: 'أثاث',
      wardrobes: 'خزائن وغرف ملابس',
      kitchens: 'مطابخ',
      doors: 'أبواب',
      essentials: 'مستلزمات منزلية',
      furnitureDesc: 'كنب وأسِرّة وطاولات ومجالس على مقاسك.',
      wardrobesDesc: 'خزائن وغرف ملابس تستغل كل سنتيمتر في الغرفة.',
      kitchensDesc: 'مطابخ مفصّلة بخامات تتحمل الاستخدام اليومي.',
      doorsDesc: 'أبواب داخلية ومداخل بخشب صلب وتشطيب نظيف.',
      essentialsDesc: 'رفوف وطاولات وقطع صغيرة تكمل البيت.'
    },

    home: {
      hero: {
        eyebrow: 'صُنع في السعودية',
        title: 'أثاث بيتك، على مقاسك بالضبط',
        text: 'يسر يصنع لك أثاثك وخزائنك ومطبخك وأبوابك مع ورش سعودية مختارة، بسعر مباشر من المصنع وتوصيل لكل المملكة.',
        ctaPrimary: 'تصفّح المنتجات',
        ctaSecondary: 'اطلب قطعة على مقاسك',
        imageAlt: 'مجلس بألوان دافئة من تنفيذ يسر'
      },
      categories: { title: 'أقسامنا', text: 'اختر القسم وشوف الأمثلة، أو اطلب قطعة من الصفر.' },
      values: {
        title: 'لماذا يسر',
        a: { t: 'صُنع في السعودية', d: 'كل قطعة تُصنع في ورش سعودية شريكة نزورها ونتابع جودتها.' },
        b: { t: 'على مقاسك', d: 'نأخذ قياسات بيتك الفعلية، فتجي القطعة مضبوطة من أول مرة.' },
        c: { t: 'سعر مباشر من المصنع', d: 'بدون معارض ولا وسطاء. تدفع قيمة الخامة والتنفيذ فقط.' },
        d: { t: 'توصيل لكل المملكة', d: 'نوصل ونركّب في المدن الرئيسية، ونشحن لبقية المناطق.' }
      },
      featured: { title: 'قطع مختارة', text: 'أكثر ما يطلبه عملاؤنا هذا الموسم.' },
      process: {
        title: 'كيف نعمل',
        text: 'أربع خطوات واضحة من أول رسالة إلى تركيب القطعة في بيتك.',
        s1: { t: 'اختر أو صف ما تريد', d: 'أرسل لنا صورة أو وصف بسيط، وحدد المكان المخصص للقطعة.' },
        s2: { t: 'نؤكد القياسات والسعر', d: 'نزورك أو نرسل لك دليل قياس، ثم نعطيك سعرًا نهائيًا مكتوبًا.' },
        s3: { t: 'التصنيع (7–15 يوم)', d: 'تبدأ الورشة بالتنفيذ ونرسل لك صور التقدم في كل مرحلة.' },
        s4: { t: 'التوصيل والتركيب', d: 'نوصل القطعة ونركّبها وننظف المكان قبل ما نمشي.' },
        cta: 'اقرأ التفاصيل كاملة'
      },
      testimonials: {
        title: 'آراء العملاء',
        note: 'نماذج توضيحية إلى حين نشر آراء العملاء الحقيقية.',
        a: { q: 'طلبنا خزانة لغرفة صغيرة وشكلها صار أوسع من قبل. القياس مضبوط والتركيب كان نظيف.', n: 'أم فيصل', c: 'الرياض' },
        b: { q: 'المطبخ تأخر يومين عن الموعد لكن الجودة تستاهل. الخامة أثقل من اللي توقعت.', n: 'عبدالله ا.', c: 'جدة' },
        c: { q: 'أول مرة أطلب أثاث بدون ما أزور معرض. الصور في كل مرحلة طمّنتني.', n: 'نوف س.', c: 'الدمام' }
      },
      trust: {
        title: 'موثوقية وتعامل واضح',
        maroof: 'موثوق (معروف)',
        cr: 'السجل التجاري',
        payments: 'قريبًا: تابي / تمارا',
        paymentsNote: 'التقسيط غير مفعّل حاليًا. الدفع اليوم عبر تحويل بنكي أو نقدًا عند التسليم.'
      },
      faq: {
        title: 'أسئلة متكررة',
        q1: { q: 'كم يستغرق تنفيذ الطلب؟', a: 'من 7 إلى 15 يوم عمل حسب القطعة والخامة. الخزائن والمطابخ الكبيرة قد تصل إلى 21 يومًا، ونخبرك بالمدة الدقيقة قبل التأكيد.' },
        q2: { q: 'هل السعر يشمل التوصيل والتركيب؟', a: 'نعم داخل الرياض وجدة والدمام. باقي المدن يضاف رسم شحن نوضحه لك قبل الطلب.' },
        q3: { q: 'كيف تتم عملية الدفع؟', a: 'دفعة أولى 50% لبدء التصنيع، والباقي عند التسليم. نرسل لك فاتورة مكتوبة بالتفاصيل.' },
        q4: { q: 'هل أقدر أغيّر القياس أو اللون بعد الطلب؟', a: 'تقدر خلال 48 ساعة من تأكيد الطلب وقبل قص الخامة. بعد ذلك يصعب التغيير لأن القطعة تدخل خط التنفيذ.' },
        q5: { q: 'ما هو الضمان؟', a: 'سنتان على التصنيع والهيكل، وسنة على الأجزاء المتحركة مثل المفصلات والمجاري. الاستخدام الخاطئ غير مشمول.' },
        q6: { q: 'هل تنفذون طلبات بتصميم من عندي؟', a: 'نعم. أرسل الرسم أو صورة مرجعية ومقاس المكان، ونرد عليك بالإمكانية والسعر خلال 24 ساعة.' }
      }
    },

    products: {
      title: 'المنتجات',
      lead: 'أمثلة جاهزة نصنعها على مقاسك. غيّر الخامة أو اللون أو الأبعاد كما تحب.',
      searchLabel: 'ابحث في المنتجات',
      searchPh: 'ابحث باسم القطعة أو الخامة…',
      filterLabel: 'تصفية حسب القسم',
      count: 'نتيجة',
      empty: 'ما لقينا نتائج مطابقة. جرّب كلمة أخرى أو اطلب تفصيل خاص.',
      emptyCta: 'اطلب قطعة على مقاسك',
      loadError: 'تعذّر تحميل قائمة المنتجات.',
      loadErrorHint: 'إذا فتحت الملف مباشرة من جهازك، شغّل خادمًا محليًا: python3 -m http.server'
    },

    product: {
      notFound: 'هذا المنتج غير موجود.',
      specs: 'المواصفات',
      dimensions: 'الأبعاد',
      material: 'الخامة',
      colors: 'الألوان',
      leadTime: 'مدة التنفيذ',
      warranty: 'الضمان',
      options: 'اختر مواصفات قطعتك',
      size: 'المقاس',
      color: 'اللون',
      materialOpt: 'الخامة',
      priceNote: 'السعر يختلف حسب المقاس والخامة النهائية. نؤكد السعر قبل بدء التصنيع.',
      gallery: 'صور المنتج',
      thumbAlt: 'صورة مصغّرة'
    },

    custom: {
      title: 'اطلب قطعة على مقاسك',
      lead: 'عبّي النموذج وبنرسل لك السعر المبدئي على واتساب خلال 24 ساعة عمل.',
      prefilled: 'تم تجهيز الطلب لهذا المنتج:',
      section1: 'معلومات التواصل',
      section2: 'تفاصيل القطعة',
      submit: 'أرسل الطلب عبر واتساب',
      submitting: 'جاري فتح واتساب…',
      successTitle: 'تم تجهيز رسالتك',
      successText: 'فتحنا لك واتساب برسالة جاهزة. إذا ما فتح تلقائيًا، استخدم أحد الخيارين:',
      openWa: 'افتح واتساب',
      openMail: 'أرسل بالبريد بدلًا من ذلك',
      again: 'إرسال طلب آخر',
      errorSummary: 'راجع الحقول المطلوبة بالأسفل.'
    },

    form: {
      name: 'الاسم',
      namePh: 'مثال: سارة العتيبي',
      nameErr: 'اكتب اسمك من فضلك.',
      city: 'المدينة',
      cityPh: 'اختر مدينتك',
      cityErr: 'اختر المدينة.',
      phone: 'رقم الجوال',
      phonePh: '05XXXXXXXX',
      phoneHint: 'رقم سعودي يبدأ بـ 05 أو ‎+9665.',
      phoneErr: 'أدخل رقم جوال سعودي صحيح (05XXXXXXXX).',
      category: 'القسم',
      categoryPh: 'اختر القسم',
      categoryErr: 'اختر القسم.',
      product: 'المنتج المرجعي',
      description: 'وصف ما تريد',
      descriptionPh: 'مثال: خزانة بأربعة أبواب سحب ومرآة في الوسط، للغرفة الرئيسية.',
      descriptionErr: 'اكتب وصفًا قصيرًا (10 أحرف على الأقل).',
      dims: 'الأبعاد التقريبية (سم)',
      width: 'العرض',
      depth: 'العمق',
      height: 'الارتفاع',
      dimsHint: 'تقريبية تكفي الآن، ونؤكدها بالقياس الفعلي.',
      materialPref: 'الخامة أو اللون المفضل',
      materialPh: 'مثال: خشب بلوط فاتح مع قماش بيج',
      budget: 'الميزانية التقريبية',
      budgetPh: 'اختر نطاقًا',
      ref: 'رابط صورة مرجعية (اختياري)',
      refPh: 'https://…',
      refErr: 'أدخل رابطًا صحيحًا يبدأ بـ http أو https.',
      contactTime: 'وقت التواصل المفضل',
      time: { morning: 'صباحًا (9 – 12)', afternoon: 'بعد الظهر (12 – 5)', evening: 'مساءً (5 – 10)', any: 'أي وقت' },
      budgetRanges: {
        a: 'أقل من 2,000 ر.س',
        b: '2,000 – 5,000 ر.س',
        c: '5,000 – 10,000 ر.س',
        d: '10,000 – 20,000 ر.س',
        e: 'أكثر من 20,000 ر.س',
        unknown: 'غير محدد'
      },
      optional: 'اختياري'
    },

    waMsg: {
      title: 'طلب جديد من موقع يسر',
      name: 'الاسم',
      city: 'المدينة',
      phone: 'الجوال',
      category: 'القسم',
      product: 'المنتج',
      options: 'الخيارات',
      description: 'الوصف',
      dims: 'الأبعاد (عرض × عمق × ارتفاع)',
      material: 'الخامة / اللون',
      budget: 'الميزانية',
      ref: 'صورة مرجعية',
      contactTime: 'وقت التواصل',
      notSpecified: 'غير محدد'
    },

    how: {
      title: 'كيف نعمل',
      lead: 'من أول رسالة إلى تركيب القطعة، هذه كل خطوة بالتفصيل.',
      deliveryTitle: 'التوصيل والتركيب',
      deliveryText: 'نوصل ونركّب مجانًا داخل الرياض وجدة والدمام. في بقية المدن نشحن عبر شركة شحن ونضيف رسمًا نوضحه قبل تأكيد الطلب. فريق التركيب يفك الكرتون ويأخذه معه، ويترك المكان نظيفًا.',
      deliveryList: {
        a: 'نتفق على موعد التركيب قبلها بيومين.',
        b: 'التركيب في الأدوار العليا بدون مصعد قد يضاف له رسم رفع.',
        c: 'نحتاج المكان فاضيًا وجاهزًا قبل وصول الفريق.'
      },
      warrantyTitle: 'الضمان',
      warrantyText: 'ضمان سنتين على التصنيع والهيكل، وسنة على الأجزاء المتحركة (مفصلات، مجاري، مكابس). يشمل الضمان عيوب التصنيع والتجميع، ولا يشمل سوء الاستخدام أو الرطوبة الزائدة أو التعديل خارج ورشنا.',
      returnsTitle: 'الاستبدال والإلغاء',
      returnsText: 'القطع المفصّلة على المقاس لا تُستبدل لأنها تُصنع لمكان واحد. لكن:',
      returnsList: {
        a: 'تقدر تلغي الطلب خلال 48 ساعة من التأكيد وتسترد كامل الدفعة.',
        b: 'إذا وصلت القطعة بعيب تصنيع أو مقاس مختلف عن المتفق عليه، نصلحها أو نعيد تصنيعها على حسابنا.',
        c: 'إذا تأخر التسليم أكثر من 7 أيام عن الموعد بسببنا، تختار بين خصم 10% أو إلغاء كامل.'
      },
      paymentTitle: 'الدفع',
      paymentText: 'دفعة أولى 50% عند تأكيد القياسات، والباقي عند التسليم. الدفع بتحويل بنكي أو نقدًا عند الاستلام. خدمات التقسيط غير مفعّلة حاليًا.',
      cta: 'جاهز تبدأ؟',
      ctaText: 'أرسل لنا تفاصيل قطعتك ونرد عليك بالسعر خلال 24 ساعة عمل.'
    },

    about: {
      title: 'عن يسر',
      lead: 'بدأنا بسؤال بسيط: ليش أثاث البيت غالي ومو على المقاس؟',
      storyTitle: 'قصتنا',
      storyP1: 'يسر بدأ سنة 2023 بعد تجربة شخصية: غرفة بمساحة غريبة، وخزانة جاهزة ما دخلت فيها. بحثنا عن ورشة تنفذ القياس المطلوب، ولقينا ورشًا سعودية ممتازة لكن ما عندها طريقة واضحة توصل فيها للناس.',
      storyP2: 'اليوم نشتغل وسيطًا واضحًا: نستقبل طلبك، نأخذ القياس، نتفق على السعر، ونسلّم الطلب لورشة تناسب نوع القطعة. نتابع التنفيذ مرحلة بمرحلة ونرسل لك الصور، وتبقى مسؤولية الجودة والضمان علينا لا على الورشة.',
      storyP3: 'ما عندنا معارض ولا مخزون جاهز. كل قطعة تُصنع بعد الطلب، وهذا اللي يخلي السعر أقل والقياس مضبوط.',
      partnersTitle: 'ورش نعمل معها',
      partnersText: 'ورش سعودية مختارة، كل واحدة متخصصة في نوع مختلف من التنفيذ.',
      p1: { n: 'ورشة الحرفة — الرياض', s: 'أثاث خشبي وتنجيد', d: 'متخصصة في الكنب والمجالس والأسِرّة المبطنة، وفيها قسم تنجيد داخلي.' },
      p2: { n: 'مصنع المدى — الدمام', s: 'خزائن ومطابخ', d: 'خطوط قص CNC للألواح، مناسبة للخزائن والمطابخ بقياسات دقيقة.' },
      p3: { n: 'ورشة نجد للأخشاب — القصيم', s: 'أبواب وخشب صلب', d: 'تنفيذ الأبواب الداخلية والمداخل بالخشب الصلب والتشطيب اليدوي.' },
      partnersNote: 'أسماء الورش أدناه أمثلة توضيحية.',
      promiseTitle: 'وعد الجودة',
      promiseList: {
        a: 'نفحص كل قطعة في الورشة قبل الشحن ونرسل لك صور الفحص.',
        b: 'نستخدم خامات مذكورة بالاسم في عرض السعر، لا أوصاف عامة.',
        c: 'أي عيب تصنيع خلال فترة الضمان نصلحه على حسابنا.',
        d: 'السعر الذي نؤكده هو السعر النهائي، بدون رسوم تظهر لاحقًا.'
      },
      statsTitle: 'بالأرقام',
      stat1: 'طلب منفّذ',
      stat2: 'ورش شريكة',
      stat3: 'مدينة نغطيها',
      statsNote: 'أرقام توضيحية إلى حين تحديثها.'
    },

    contact: {
      title: 'تواصل معنا',
      lead: 'أسرع طريقة هي واتساب. نرد خلال ساعات العمل.',
      waTitle: 'واتساب',
      waText: 'للطلبات والاستفسارات والصور.',
      waCta: 'ابدأ محادثة',
      phoneTitle: 'اتصال',
      emailTitle: 'البريد الإلكتروني',
      hoursTitle: 'ساعات العمل',
      hours: 'الأحد – الخميس: 9 صباحًا – 6 مساءً · السبت: 10 صباحًا – 4 عصرًا · الجمعة: إجازة',
      coverageTitle: 'المدن التي نغطيها',
      coverageText: 'توصيل وتركيب مجاني في المدن الرئيسية، وشحن لبقية المناطق.',
      mapTitle: 'موقع الإدارة',
      mapPlaceholder: 'مكان الخريطة — تُضاف بعد اعتماد العنوان.',
      address: 'الرياض، المملكة العربية السعودية',
      formTitle: 'تفضّل ترسل نموذجًا؟',
      formText: 'استخدم نموذج الطلب وبيوصلنا كل التفاصيل مرتبة.',
      formCta: 'افتح نموذج الطلب'
    },

    cities: {
      riyadh: 'الرياض', jeddah: 'جدة', dammam: 'الدمام', khobar: 'الخبر', makkah: 'مكة المكرمة',
      madinah: 'المدينة المنورة', qassim: 'القصيم', abha: 'أبها', tabuk: 'تبوك', hail: 'حائل',
      jazan: 'جازان', taif: 'الطائف', other: 'مدينة أخرى'
    },

    footer: {
      about: 'يسر يصنع أثاث بيتك على مقاسك مع ورش سعودية، ويوصله لباب بيتك.',
      links: 'روابط سريعة',
      contact: 'تواصل',
      social: 'تابعنا',
      rights: 'جميع الحقوق محفوظة.',
      builtIn: 'صُنع في السعودية',
      instagram: 'إنستقرام', x: 'إكس', tiktok: 'تيك توك', snapchat: 'سناب شات'
    },

    meta: {
      home: { t: 'يسر | أثاث وخزائن ومطابخ على مقاسك في السعودية', d: 'يسر يصنع أثاثك وخزائنك ومطبخك وأبوابك على مقاسك مع ورش سعودية، بسعر مباشر من المصنع وتوصيل لكل المملكة.' },
      products: { t: 'المنتجات | يسر', d: 'تصفّح أمثلة الأثاث والخزائن والمطابخ والأبواب التي ننفذها على المقاس، مع أسعار البداية ومدة التنفيذ.' },
      product: { t: 'تفاصيل المنتج | يسر', d: 'مواصفات وخيارات القطعة مع إمكانية طلبها على مقاسك مباشرة عبر واتساب.' },
      custom: { t: 'اطلب تفصيل | يسر', d: 'أرسل قياساتك وتفاصيل القطعة التي تريدها، ونرد عليك بالسعر خلال 24 ساعة عمل.' },
      how: { t: 'كيف نعمل | يسر', d: 'من الطلب إلى التركيب: الخطوات والتوصيل والضمان وسياسة الإلغاء بوضوح.' },
      about: { t: 'عن يسر | صناعة سعودية على المقاس', d: 'قصة يسر، الورش الشريكة، ووعد الجودة الذي نلتزم به في كل طلب.' },
      contact: { t: 'تواصل معنا | يسر', d: 'واتساب وهاتف وبريد وساعات العمل والمدن التي نغطيها بالتوصيل والتركيب.' }
    }
  },

  en: {
    dir: 'ltr',
    lang: 'en',
    htmlLang: 'en',
    currency: 'SAR',
    brand: { name: 'Yusr', tagline: 'Your home, your way.' },

    nav: {
      home: 'Home',
      products: 'Products',
      custom: 'Custom order',
      how: 'How it works',
      about: 'About',
      contact: 'Contact',
      menu: 'Menu',
      close: 'Close menu',
      skip: 'Skip to content',
      langToggle: 'عربي',
      langToggleLabel: 'Switch language to Arabic',
      whatsapp: 'WhatsApp'
    },

    common: {
      from: 'From',
      to: 'to',
      orderNow: 'Order now',
      orderThis: 'Order this piece',
      viewAll: 'View all products',
      details: 'Details',
      days: 'days',
      years: 'years',
      leadTime: 'Lead time',
      material: 'Material',
      loading: 'Loading…',
      backToProducts: 'Back to products',
      required: 'required',
      sample: 'Sample content'
    },

    cat: {
      all: 'All',
      furniture: 'Furniture',
      wardrobes: 'Wardrobes & closets',
      kitchens: 'Kitchens',
      doors: 'Doors',
      essentials: 'Home essentials',
      furnitureDesc: 'Sofas, beds, tables and majlis seating, built to your size.',
      wardrobesDesc: 'Wardrobes and walk-ins that use every centimetre of the room.',
      kitchensDesc: 'Made-to-measure kitchens in materials that take daily use.',
      doorsDesc: 'Interior and entrance doors in solid wood with a clean finish.',
      essentialsDesc: 'Shelves, consoles and smaller pieces that finish a home.'
    },

    home: {
      hero: {
        eyebrow: 'Made in Saudi Arabia',
        title: 'Furniture built to your exact measurements',
        text: 'Yusr makes your furniture, wardrobes, kitchen and doors with selected Saudi workshops — factory-direct pricing, delivered nationwide.',
        ctaPrimary: 'Browse products',
        ctaSecondary: 'Request a custom piece',
        imageAlt: 'A warm-toned majlis built by Yusr'
      },
      categories: { title: 'Categories', text: 'Pick a category for examples, or start a piece from scratch.' },
      values: {
        title: 'Why Yusr',
        a: { t: 'Made in Saudi Arabia', d: 'Every piece is built in partner workshops we visit and inspect.' },
        b: { t: 'Built to your size', d: 'We work from your real measurements, so it fits the first time.' },
        c: { t: 'Factory-direct pricing', d: 'No showrooms, no middlemen. You pay for materials and craft.' },
        d: { t: 'Nationwide delivery', d: 'Free delivery and installation in major cities, shipping elsewhere.' }
      },
      featured: { title: 'Selected pieces', text: 'What customers order most this season.' },
      process: {
        title: 'How it works',
        text: 'Four clear steps, from your first message to installation day.',
        s1: { t: 'Choose or describe it', d: 'Send a photo or a short description and tell us where it goes.' },
        s2: { t: 'We confirm size and price', d: 'We measure on site or send a measuring guide, then quote in writing.' },
        s3: { t: 'Production (7–15 days)', d: 'The workshop starts building and we send progress photos at each stage.' },
        s4: { t: 'Delivery and installation', d: 'We deliver, install, and clean up before we leave.' },
        cta: 'Read the full process'
      },
      testimonials: {
        title: 'What customers say',
        note: 'Sample quotes until real customer reviews are published.',
        a: { q: 'We ordered a wardrobe for a small room and it somehow feels bigger now. The fit was exact and the install was tidy.', n: 'Umm Faisal', c: 'Riyadh' },
        b: { q: 'The kitchen ran two days late, but the quality was worth it. The material is heavier than I expected.', n: 'Abdullah A.', c: 'Jeddah' },
        c: { q: 'First time ordering furniture without visiting a showroom. The photos at every stage kept me relaxed.', n: 'Nouf S.', c: 'Dammam' }
      },
      trust: {
        title: 'Clear, accountable dealing',
        maroof: 'Maroof verified',
        cr: 'Commercial Registration',
        payments: 'Coming soon: Tabby / Tamara',
        paymentsNote: 'Instalments are not active yet. Payment today is by bank transfer or cash on delivery.'
      },
      faq: {
        title: 'Frequently asked questions',
        q1: { q: 'How long does an order take?', a: '7 to 15 working days depending on the piece and material. Large wardrobes and kitchens can reach 21 days, and we confirm the exact timeline before you approve.' },
        q2: { q: 'Does the price include delivery and installation?', a: 'Yes within Riyadh, Jeddah and Dammam. Other cities have a shipping fee that we state before you order.' },
        q3: { q: 'How does payment work?', a: '50% deposit to start production, the balance on delivery. You get a written invoice with the full breakdown.' },
        q4: { q: 'Can I change the size or colour after ordering?', a: 'Yes, within 48 hours of confirmation and before the material is cut. After that the piece is already in production.' },
        q5: { q: 'What is the warranty?', a: 'Two years on build and structure, one year on moving parts such as hinges and runners. Misuse is not covered.' },
        q6: { q: 'Can you build from my own design?', a: 'Yes. Send the drawing or a reference photo plus the space measurements, and we reply with feasibility and price within 24 hours.' }
      }
    },

    products: {
      title: 'Products',
      lead: 'Ready examples that we build to your measurements. Change the material, colour or dimensions as you like.',
      searchLabel: 'Search products',
      searchPh: 'Search by name or material…',
      filterLabel: 'Filter by category',
      count: 'results',
      empty: 'No matches found. Try another word, or request a custom piece.',
      emptyCta: 'Request a custom piece',
      loadError: 'Could not load the product list.',
      loadErrorHint: 'If you opened the file directly from disk, run a local server: python3 -m http.server'
    },

    product: {
      notFound: 'This product does not exist.',
      specs: 'Specifications',
      dimensions: 'Dimensions',
      material: 'Material',
      colors: 'Colours',
      leadTime: 'Lead time',
      warranty: 'Warranty',
      options: 'Choose your specification',
      size: 'Size',
      color: 'Colour',
      materialOpt: 'Material',
      priceNote: 'Price varies with final size and material. We confirm it before production starts.',
      gallery: 'Product images',
      thumbAlt: 'Thumbnail'
    },

    custom: {
      title: 'Request a custom piece',
      lead: 'Fill in the form and we send you an indicative price on WhatsApp within 24 working hours.',
      prefilled: 'Request prepared for this product:',
      section1: 'Contact details',
      section2: 'Piece details',
      submit: 'Send request on WhatsApp',
      submitting: 'Opening WhatsApp…',
      successTitle: 'Your message is ready',
      successText: 'We opened WhatsApp with a prepared message. If it did not open, use one of these:',
      openWa: 'Open WhatsApp',
      openMail: 'Send by e-mail instead',
      again: 'Send another request',
      errorSummary: 'Please check the highlighted fields below.'
    },

    form: {
      name: 'Name',
      namePh: 'e.g. Sarah Alotaibi',
      nameErr: 'Please enter your name.',
      city: 'City',
      cityPh: 'Select your city',
      cityErr: 'Please select a city.',
      phone: 'Mobile number',
      phonePh: '05XXXXXXXX',
      phoneHint: 'Saudi number starting with 05 or +9665.',
      phoneErr: 'Enter a valid Saudi mobile number (05XXXXXXXX).',
      category: 'Category',
      categoryPh: 'Select a category',
      categoryErr: 'Please select a category.',
      product: 'Reference product',
      description: 'Describe what you want',
      descriptionPh: 'e.g. A four-door sliding wardrobe with a mirror in the middle, for the master bedroom.',
      descriptionErr: 'Please write a short description (at least 10 characters).',
      dims: 'Approximate dimensions (cm)',
      width: 'Width',
      depth: 'Depth',
      height: 'Height',
      dimsHint: 'Rough numbers are fine now; we confirm with a real measurement.',
      materialPref: 'Preferred material or colour',
      materialPh: 'e.g. light oak with beige fabric',
      budget: 'Approximate budget',
      budgetPh: 'Select a range',
      ref: 'Reference image URL (optional)',
      refPh: 'https://…',
      refErr: 'Enter a valid link starting with http or https.',
      contactTime: 'Preferred contact time',
      time: { morning: 'Morning (9am – 12pm)', afternoon: 'Afternoon (12pm – 5pm)', evening: 'Evening (5pm – 10pm)', any: 'Any time' },
      budgetRanges: {
        a: 'Under 2,000 SAR',
        b: '2,000 – 5,000 SAR',
        c: '5,000 – 10,000 SAR',
        d: '10,000 – 20,000 SAR',
        e: 'Over 20,000 SAR',
        unknown: 'Not specified'
      },
      optional: 'optional'
    },

    waMsg: {
      title: 'New request from the Yusr website',
      name: 'Name',
      city: 'City',
      phone: 'Mobile',
      category: 'Category',
      product: 'Product',
      options: 'Options',
      description: 'Description',
      dims: 'Dimensions (W × D × H)',
      material: 'Material / colour',
      budget: 'Budget',
      ref: 'Reference image',
      contactTime: 'Contact time',
      notSpecified: 'Not specified'
    },

    how: {
      title: 'How it works',
      lead: 'From the first message to installation day — every step in detail.',
      deliveryTitle: 'Delivery and installation',
      deliveryText: 'Delivery and installation are free within Riyadh, Jeddah and Dammam. Elsewhere we ship through a courier and add a fee that we state before you confirm. The install team removes the packaging and leaves the space clean.',
      deliveryList: {
        a: 'We agree on the installation slot two days in advance.',
        b: 'Upper floors without a lift may carry a carrying fee.',
        c: 'The space needs to be empty and ready before the team arrives.'
      },
      warrantyTitle: 'Warranty',
      warrantyText: 'Two years on build and structure, one year on moving parts (hinges, runners, pistons). It covers manufacturing and assembly defects; it does not cover misuse, excess humidity, or modification outside our workshops.',
      returnsTitle: 'Changes and cancellation',
      returnsText: 'Made-to-measure pieces cannot be resold, because they are built for one specific space. However:',
      returnsList: {
        a: 'You can cancel within 48 hours of confirmation and get the full deposit back.',
        b: 'If a piece arrives with a manufacturing defect or the wrong size, we repair or rebuild it at our cost.',
        c: 'If we deliver more than 7 days late through our own fault, you choose between a 10% discount or a full cancellation.'
      },
      paymentTitle: 'Payment',
      paymentText: '50% deposit once measurements are confirmed, the balance on delivery. Payment by bank transfer or cash on delivery. Instalment services are not active yet.',
      cta: 'Ready to start?',
      ctaText: 'Send us your details and we reply with a price within 24 working hours.'
    },

    about: {
      title: 'About Yusr',
      lead: 'We started with a simple question: why is home furniture expensive and never the right size?',
      storyTitle: 'Our story',
      storyP1: 'Yusr began in 2023 after a personal problem: an oddly shaped room and a ready-made wardrobe that would not fit. We went looking for a workshop that could build to size and found excellent Saudi workshops with no clear way to reach customers.',
      storyP2: 'Today we are a transparent middle layer: we take your request, measure the space, agree a price, and hand the job to the workshop that suits the piece. We follow production stage by stage and send you photos — and quality and warranty stay our responsibility, not the workshop’s.',
      storyP3: 'We hold no showroom and no stock. Every piece is built after it is ordered, which is what keeps the price lower and the fit exact.',
      partnersTitle: 'Workshops we partner with',
      partnersText: 'Selected Saudi workshops, each specialised in a different kind of work.',
      p1: { n: 'Al-Hirfah Workshop — Riyadh', s: 'Wooden furniture and upholstery', d: 'Specialised in sofas, majlis seating and upholstered beds, with an in-house upholstery line.' },
      p2: { n: 'Al-Mada Factory — Dammam', s: 'Wardrobes and kitchens', d: 'CNC panel cutting, suited to wardrobes and kitchens with tight tolerances.' },
      p3: { n: 'Najd Timber Workshop — Qassim', s: 'Doors and solid wood', d: 'Interior and entrance doors in solid wood with hand finishing.' },
      partnersNote: 'The workshop names below are illustrative examples.',
      promiseTitle: 'Our quality promise',
      promiseList: {
        a: 'We inspect every piece at the workshop before shipping and send you the inspection photos.',
        b: 'Materials are named explicitly in the quote — no vague descriptions.',
        c: 'Any manufacturing defect within the warranty period is fixed at our cost.',
        d: 'The price we confirm is the final price. No fees appear later.'
      },
      statsTitle: 'By the numbers',
      stat1: 'orders delivered',
      stat2: 'partner workshops',
      stat3: 'cities covered',
      statsNote: 'Illustrative figures pending update.'
    },

    contact: {
      title: 'Contact us',
      lead: 'WhatsApp is fastest. We reply during working hours.',
      waTitle: 'WhatsApp',
      waText: 'For orders, questions and photos.',
      waCta: 'Start a chat',
      phoneTitle: 'Phone',
      emailTitle: 'E-mail',
      hoursTitle: 'Working hours',
      hours: 'Sunday – Thursday: 9am – 6pm · Saturday: 10am – 4pm · Friday: closed',
      coverageTitle: 'Cities we cover',
      coverageText: 'Free delivery and installation in major cities, shipping everywhere else.',
      mapTitle: 'Office location',
      mapPlaceholder: 'Map placeholder — added once the address is confirmed.',
      address: 'Riyadh, Saudi Arabia',
      formTitle: 'Prefer to send a form?',
      formText: 'Use the request form and every detail reaches us in order.',
      formCta: 'Open the request form'
    },

    cities: {
      riyadh: 'Riyadh', jeddah: 'Jeddah', dammam: 'Dammam', khobar: 'Khobar', makkah: 'Makkah',
      madinah: 'Madinah', qassim: 'Qassim', abha: 'Abha', tabuk: 'Tabuk', hail: 'Hail',
      jazan: 'Jazan', taif: 'Taif', other: 'Another city'
    },

    footer: {
      about: 'Yusr builds your home furniture to measure with Saudi workshops, and delivers it to your door.',
      links: 'Quick links',
      contact: 'Contact',
      social: 'Follow us',
      rights: 'All rights reserved.',
      builtIn: 'Made in Saudi Arabia',
      instagram: 'Instagram', x: 'X', tiktok: 'TikTok', snapchat: 'Snapchat'
    },

    meta: {
      home: { t: 'Yusr | Made-to-measure furniture, wardrobes and kitchens in Saudi Arabia', d: 'Yusr builds your furniture, wardrobes, kitchen and doors to your measurements with Saudi workshops — factory-direct pricing, nationwide delivery.' },
      products: { t: 'Products | Yusr', d: 'Browse the furniture, wardrobes, kitchens and doors we build to measure, with starting prices and lead times.' },
      product: { t: 'Product details | Yusr', d: 'Specifications and options for the piece, with a direct WhatsApp request for your own measurements.' },
      custom: { t: 'Custom order | Yusr', d: 'Send your measurements and piece details, and we reply with a price within 24 working hours.' },
      how: { t: 'How it works | Yusr', d: 'From order to installation: the steps, delivery, warranty and cancellation policy in plain language.' },
      about: { t: 'About Yusr | Saudi-made, built to measure', d: 'The Yusr story, our partner workshops, and the quality promise we hold to on every order.' },
      contact: { t: 'Contact us | Yusr', d: 'WhatsApp, phone, e-mail, working hours and the cities we cover for delivery and installation.' }
    }
  }
};

export const LANGS = ['ar', 'en'];
export const DEFAULT_LANG = 'ar';
const STORAGE_KEY = 'yusr.lang';

/** Ordered category keys, used by filters and selects. */
export const CATEGORIES = ['furniture', 'wardrobes', 'kitchens', 'doors', 'essentials'];

/** Ordered city keys for the city select and the coverage list. */
export const CITY_KEYS = [
  'riyadh', 'jeddah', 'dammam', 'khobar', 'makkah', 'madinah',
  'qassim', 'abha', 'tabuk', 'hail', 'jazan', 'taif', 'other'
];

/** Cities with free delivery + installation. TODO: confirm */
export const INSTALL_CITIES = ['riyadh', 'jeddah', 'dammam', 'khobar'];

/**
 * Resolve the active language: ?lang= wins, then localStorage, then Arabic.
 */
export function getLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  let stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) { /* private mode */ }
  return LANGS.includes(stored) ? stored : DEFAULT_LANG;
}

export function storeLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* private mode */ }
}

/** Look up a dotted key, e.g. t('home.hero.title'). Returns the key if missing. */
export function t(key, lang = getLang()) {
  const value = key.split('.').reduce((node, part) => (node == null ? node : node[part]), DICT[lang]);
  return value == null ? key : value;
}

/** Western Arabic numerals with thousand separators, in both languages. */
export function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

/** "يبدأ من 2,900 ر.س" / "From 2,900 SAR" */
export function formatPrice(amount, lang = getLang()) {
  return lang === 'ar'
    ? `${formatNumber(amount)} ${DICT.ar.currency}`
    : `${formatNumber(amount)} ${DICT.en.currency}`;
}
