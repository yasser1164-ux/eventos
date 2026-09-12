/**
 * Yusr — single source of truth for business contact details.
 * Change values here only; every page reads from this file.
 */

export const CONFIG = {
  /* WhatsApp number in international format, digits only, no "+".
     TODO: confirm — replace with the real business number. */
  whatsapp: '9665XXXXXXXX',

  /* How the phone number is shown to visitors. TODO: confirm */
  phoneDisplay: '+966 5X XXX XXXX',

  /* Fallback contact e-mail. TODO: confirm */
  email: 'hello@yusr.sa',

  /* Maroof (موثوق) registration number. TODO: confirm */
  maroof: '0000000',

  /* Commercial Registration (السجل التجاري). TODO: confirm */
  cr: '10100000000',

  /* Social profiles. Leave a value empty to hide that icon. TODO: confirm */
  social: {
    instagram: 'https://instagram.com/',
    x: 'https://x.com/',
    tiktok: 'https://tiktok.com/',
    snapchat: ''
  }
};

/** Digits-only WhatsApp number, safe for wa.me links. */
export const waNumber = CONFIG.whatsapp.replace(/\D/g, '');

if (/[xX]/.test(CONFIG.whatsapp)) {
  console.warn('[yusr] WhatsApp number is still the placeholder — set CONFIG.whatsapp in js/config.js.');
}

/**
 * Build a wa.me deep link with a pre-filled message.
 * @param {string} text plain message text (not yet encoded)
 */
export function waLink(text) {
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Build a mailto: fallback link with the same message.
 * @param {string} subject
 * @param {string} body
 */
export function mailLink(subject, body) {
  return `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
