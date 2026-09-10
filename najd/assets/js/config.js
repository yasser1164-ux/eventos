/* =========================================================================
   SITE CONFIG — the only file you normally edit before launch.
   Everything the site shows about the company comes from here.
   ========================================================================= */
window.SITE = {
  /* --- identity ------------------------------------------------------- */
  name:      { ar: "شركة نجد الشرق الأوسط للتجارة", en: "Najd Middle East Trading Co." },
  nameShort: { ar: "نجد الشرق الأوسط", en: "Najd Middle East" },
  tagline:   { ar: "شريكك الموثوق في التوريد والتجارة", en: "Your trusted supply & trading partner" },
  founded:   2024,

  /* --- contact (PLACEHOLDERS — replace before going live) -------------- */
  phone:     "+966112345678",
  phoneText: "+966 11 234 5678",
  whatsapp:  "966551234567",
  whatsappText: "+966 55 123 4567",
  email:     "info@najd-me.com",
  salesEmail:"sales@najd-me.com",
  hrEmail:   "careers@najd-me.com",
  address:   {
    ar: "طريق الملك عبدالعزيز، حي الملز، الرياض ١٢٦٣١، المملكة العربية السعودية",
    en: "King Abdulaziz Rd, Al Malaz, Riyadh 12631, Saudi Arabia"
  },
  hours: { ar: "الأحد – الخميس · ٨:٠٠ ص – ٥:٠٠ م", en: "Sun – Thu · 8:00 AM – 5:00 PM" },

  /* legal registration numbers — PLACEHOLDERS */
  cr:  "1010XXXXXX",
  vat: "3000XXXXXXXXXX3",

  social: {
    linkedin: "#", x: "#", instagram: "#", youtube: "#"
  },

  /* --- how forms are delivered ---------------------------------------- */
  /* mode: "local"    → saved in the browser + opens a prepared email (works today,
                        no account needed — this is the default so the site is usable now)
           "formspree"→ POSTs to formspreeEndpoint (free tier, 2 minutes to set up)
           "supabase" → inserts into a Supabase table (see README)               */
  forms: {
    mode: "local",
    formspreeEndpoint: "",          // e.g. https://formspree.io/f/xxxxxxxx
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseTable: "inquiries"
  },

  /* --- photographs ------------------------------------------------------
     Drawn illustrations are used until you add real photos. See
     assets/img/photos/README.md. autodetect:true looks for the files
     directly instead of reading manifest.json.                            */
  photos: { autodetect: false },

  /* --- misc ------------------------------------------------------------ */
  mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=46.70%2C24.64%2C46.76%2C24.70&layer=mapnik&marker=24.67%2C46.73",
  mapLink:  "https://www.openstreetmap.org/?mlat=24.67&mlon=46.73#map=14/24.67/46.73",
  defaultLang: "ar"
};
