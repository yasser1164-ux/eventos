/* =========================================================================
   SITE CONFIG — the one file you edit before launch.
   Everything the marketplace shows about itself, and how it stores data,
   comes from here.
   ========================================================================= */
window.QETAA = {
  /* --- identity -------------------------------------------------------- */
  name:      { ar: "قطع", en: "Qetaa" },
  nameFull:  { ar: "قطع — سوق قطع الغيار المستعملة", en: "Qetaa — used car parts marketplace" },
  tagline:   { ar: "قطعة سيارتك… من أقرب تشليح، بسعر تعرفه قبل ما تروح",
               en: "Your part, from the nearest yard — at a price you see before you drive" },
  country:   "SA",
  currency:  { ar: "ريال", en: "SAR" },

  /* --- contact (PLACEHOLDERS — replace before going live) --------------- */
  phone:        "+966500000000",
  phoneText:    "+966 50 000 0000",
  whatsapp:     "966500000000",       /* digits only, no + */
  whatsappText: "+966 50 000 0000",
  email:        "hello@qetaa.sa",
  supportEmail: "support@qetaa.sa",
  salesEmail:   "sellers@qetaa.sa",
  social: { x: "#", instagram: "#", tiktok: "#", linkedin: "#" },

  /* --- data backend -----------------------------------------------------
     mode: "auto"     → use Supabase when the keys below are filled in and the
                        project answers; otherwise fall back to the bundled
                        demo data + this browser's local storage.
           "local"    → never call the network (demo / offline).
           "supabase" → require Supabase (errors surface instead of hiding).
     Filling supabaseUrl + supabaseAnonKey and running supabase/schema.sql is
     the whole "go live" step. The anon key is safe to publish: row level
     security decides what it may read and write.                          */
  data: {
    mode: "auto",
    supabaseUrl: "",
    supabaseAnonKey: ""
  },

  /* --- commercial model (shown on pricing.html, enforced in the app) ---- */
  plans: [
    { id: "free",  price: 0,   listings: 5,   quotes: 5,   featured: 0, badge: false },
    { id: "basic", price: 199, listings: 60,  quotes: 40,  featured: 1, badge: true  },
    { id: "pro",   price: 499, listings: 300, quotes: 200, featured: 5, badge: true  },
    { id: "yard",  price: 999, listings: -1,  quotes: -1,  featured: 20, badge: true }
  ],
  boostPrice: 29,          /* SAR, 7 days featured on one listing            */
  commission: 0,           /* % — 0 while the platform stays a lead engine   */

  /* --- behaviour -------------------------------------------------------- */
  defaultLang: "ar",
  defaultCity: "",         /* "" = all cities                                */
  pageSize: 24,
  warrantyDays: 14,        /* platform-wide minimum return window we ask for */
  demoBanner: true         /* show "sample data" notices while unconfigured  */
};
