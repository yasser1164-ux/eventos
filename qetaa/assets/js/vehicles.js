/* =========================================================================
   VEHICLE CATALOG — the makes and models that actually drive on Saudi roads,
   ordered roughly by how often their parts are searched for.
   Each model carries the generation years so the year dropdown is never a
   list of 40 meaningless numbers.
   ========================================================================= */
window.VEHICLES = {
  makes: [
    { id:"toyota", ar:"تويوتا", en:"Toyota", models:[
      {id:"camry",ar:"كامري",en:"Camry",from:1995},{id:"corolla",ar:"كورولا",en:"Corolla",from:1995},
      {id:"landcruiser",ar:"لاندكروزر",en:"Land Cruiser",from:1990},{id:"prado",ar:"برادو",en:"Prado",from:1996},
      {id:"hilux",ar:"هايلكس",en:"Hilux",from:1995},{id:"yaris",ar:"يارس",en:"Yaris",from:2006},
      {id:"avalon",ar:"أفالون",en:"Avalon",from:2000},{id:"fortuner",ar:"فورتشنر",en:"Fortuner",from:2006},
      {id:"rav4",ar:"راف فور",en:"RAV4",from:2000},{id:"innova",ar:"إينوفا",en:"Innova",from:2005},
      {id:"hiace",ar:"هايس",en:"Hiace",from:1995},{id:"fj",ar:"إف جي",en:"FJ Cruiser",from:2007}
    ]},
    { id:"hyundai", ar:"هيونداي", en:"Hyundai", models:[
      {id:"elantra",ar:"النترا",en:"Elantra",from:2000},{id:"sonata",ar:"سوناتا",en:"Sonata",from:2000},
      {id:"accent",ar:"أكسنت",en:"Accent",from:2000},{id:"tucson",ar:"توسان",en:"Tucson",from:2005},
      {id:"santafe",ar:"سنتافي",en:"Santa Fe",from:2002},{id:"azera",ar:"أزيرا",en:"Azera",from:2006},
      {id:"creta",ar:"كريتا",en:"Creta",from:2016},{id:"h1",ar:"H1",en:"H1",from:2008}
    ]},
    { id:"nissan", ar:"نيسان", en:"Nissan", models:[
      {id:"altima",ar:"التيما",en:"Altima",from:2002},{id:"sunny",ar:"صني",en:"Sunny",from:2000},
      {id:"patrol",ar:"باترول",en:"Patrol",from:1995},{id:"xtrail",ar:"إكس تريل",en:"X-Trail",from:2005},
      {id:"maxima",ar:"مكسيما",en:"Maxima",from:2000},{id:"navara",ar:"نافارا",en:"Navara",from:2006},
      {id:"urvan",ar:"أورفان",en:"Urvan",from:2002},{id:"pathfinder",ar:"باث فايندر",en:"Pathfinder",from:2005}
    ]},
    { id:"kia", ar:"كيا", en:"Kia", models:[
      {id:"cerato",ar:"سيراتو",en:"Cerato",from:2005},{id:"optima",ar:"أوبتيما",en:"Optima",from:2006},
      {id:"rio",ar:"ريو",en:"Rio",from:2005},{id:"sportage",ar:"سبورتاج",en:"Sportage",from:2005},
      {id:"sorento",ar:"سورنتو",en:"Sorento",from:2004},{id:"pegas",ar:"بيجاس",en:"Pegas",from:2018},
      {id:"carnival",ar:"كرنفال",en:"Carnival",from:2006}
    ]},
    { id:"chevrolet", ar:"شفروليه", en:"Chevrolet", models:[
      {id:"tahoe",ar:"تاهو",en:"Tahoe",from:2000},{id:"suburban",ar:"سبربان",en:"Suburban",from:2000},
      {id:"silverado",ar:"سلفرادو",en:"Silverado",from:2000},{id:"impala",ar:"إمبالا",en:"Impala",from:2006},
      {id:"caprice",ar:"كابرس",en:"Caprice",from:1990},{id:"malibu",ar:"ماليبو",en:"Malibu",from:2008},
      {id:"traverse",ar:"ترافيرس",en:"Traverse",from:2010}
    ]},
    { id:"ford", ar:"فورد", en:"Ford", models:[
      {id:"f150",ar:"إف 150",en:"F-150",from:2000},{id:"explorer",ar:"إكسبلورر",en:"Explorer",from:2002},
      {id:"expedition",ar:"إكسبيديشن",en:"Expedition",from:2003},{id:"taurus",ar:"تورس",en:"Taurus",from:2010},
      {id:"edge",ar:"إيدج",en:"Edge",from:2010},{id:"mustang",ar:"موستنج",en:"Mustang",from:2005}
    ]},
    { id:"gmc", ar:"جي إم سي", en:"GMC", models:[
      {id:"yukon",ar:"يوكن",en:"Yukon",from:2000},{id:"sierra",ar:"سييرا",en:"Sierra",from:2002},
      {id:"acadia",ar:"أكاديا",en:"Acadia",from:2008},{id:"terrain",ar:"تيرين",en:"Terrain",from:2012}
    ]},
    { id:"lexus", ar:"لكزس", en:"Lexus", models:[
      {id:"lx",ar:"LX",en:"LX",from:2000},{id:"gx",ar:"GX",en:"GX",from:2004},
      {id:"es",ar:"ES",en:"ES",from:2000},{id:"is",ar:"IS",en:"IS",from:2006},
      {id:"rx",ar:"RX",en:"RX",from:2004},{id:"ls",ar:"LS",en:"LS",from:2000}
    ]},
    { id:"honda", ar:"هوندا", en:"Honda", models:[
      {id:"accord",ar:"أكورد",en:"Accord",from:2000},{id:"civic",ar:"سيفيك",en:"Civic",from:2002},
      {id:"crv",ar:"CR-V",en:"CR-V",from:2004},{id:"pilot",ar:"بايلوت",en:"Pilot",from:2006},
      {id:"odyssey",ar:"أوديسي",en:"Odyssey",from:2006}
    ]},
    { id:"mitsubishi", ar:"ميتسوبيشي", en:"Mitsubishi", models:[
      {id:"pajero",ar:"باجيرو",en:"Pajero",from:2000},{id:"lancer",ar:"لانسر",en:"Lancer",from:2004},
      {id:"l200",ar:"L200",en:"L200",from:2006},{id:"attrage",ar:"أتراج",en:"Attrage",from:2014}
    ]},
    { id:"mazda", ar:"مازدا", en:"Mazda", models:[
      {id:"m3",ar:"مازدا 3",en:"Mazda 3",from:2005},{id:"m6",ar:"مازدا 6",en:"Mazda 6",from:2005},
      {id:"cx5",ar:"CX-5",en:"CX-5",from:2013},{id:"cx9",ar:"CX-9",en:"CX-9",from:2008}
    ]},
    { id:"mercedes", ar:"مرسيدس", en:"Mercedes-Benz", models:[
      {id:"cclass",ar:"الفئة C",en:"C-Class",from:2000},{id:"eclass",ar:"الفئة E",en:"E-Class",from:2000},
      {id:"sclass",ar:"الفئة S",en:"S-Class",from:2000},{id:"gclass",ar:"جي كلاس",en:"G-Class",from:2000},
      {id:"gle",ar:"GLE / ML",en:"GLE / ML",from:2005}
    ]},
    { id:"bmw", ar:"بي إم دبليو", en:"BMW", models:[
      {id:"s3",ar:"الفئة الثالثة",en:"3 Series",from:2000},{id:"s5",ar:"الفئة الخامسة",en:"5 Series",from:2000},
      {id:"s7",ar:"الفئة السابعة",en:"7 Series",from:2000},{id:"x5",ar:"X5",en:"X5",from:2004}
    ]},
    { id:"isuzu", ar:"إيسوزو", en:"Isuzu", models:[
      {id:"dmax",ar:"دي ماكس",en:"D-Max",from:2006},{id:"npr",ar:"NPR",en:"NPR",from:2000}
    ]},
    { id:"geely", ar:"جيلي", en:"Geely", models:[
      {id:"emgrand",ar:"إمجراند",en:"Emgrand",from:2015},{id:"coolray",ar:"كولراي",en:"Coolray",from:2020}
    ]},
    { id:"mg", ar:"إم جي", en:"MG", models:[
      {id:"mg5",ar:"MG5",en:"MG5",from:2020},{id:"zs",ar:"ZS",en:"ZS",from:2019},{id:"rx5",ar:"RX5",en:"RX5",from:2019}
    ]},
    { id:"changan", ar:"شانجان", en:"Changan", models:[
      {id:"cs35",ar:"CS35",en:"CS35",from:2018},{id:"eado",ar:"إيدو",en:"Eado",from:2018}
    ]},
    { id:"other", ar:"أخرى", en:"Other", models:[{id:"other",ar:"موديل آخر",en:"Other model",from:1990}] }
  ],

  /* --- helpers ---------------------------------------------------------- */
  make: function (id) { var m = this.makes, i; for (i=0;i<m.length;i++) if (m[i].id===id) return m[i]; return null; },
  model: function (makeId, modelId) {
    var mk = this.make(makeId), i; if (!mk) return null;
    for (i=0;i<mk.models.length;i++) if (mk.models[i].id===modelId) return mk.models[i];
    return null;
  },
  makeLabel: function (id, lang) { var m = this.make(id); return m ? (lang==="en"?m.en:m.ar) : id; },
  modelLabel: function (makeId, modelId, lang) {
    var m = this.model(makeId, modelId); return m ? (lang==="en"?m.en:m.ar) : modelId;
  },
  years: function (makeId, modelId) {
    var now = new Date().getFullYear() + 1, m = this.model(makeId, modelId),
        from = m ? m.from : 1995, out = [], y;
    for (y = now; y >= from; y--) out.push(y);
    return out;
  },
  /* "تويوتا كامري 2016" / "Toyota Camry 2016" */
  title: function (makeId, modelId, year, lang) {
    return [this.makeLabel(makeId, lang), this.modelLabel(makeId, modelId, lang), year || ""]
      .filter(Boolean).join(" ");
  }
};
