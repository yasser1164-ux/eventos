/**
 * Yusr — shared shell: header, footer, language switching, accordion, menu.
 * Every page loads this module; page-specific modules import helpers from here.
 */

import { CONFIG, waLink } from './config.js';
import { CITY_KEYS, DICT, INSTALL_CITIES, LANGS, getLang, storeLang, t } from './i18n.js';

let currentLang = getLang();

export function lang() { return currentLang; }

/* ---------------------------------------------------------------- icons -- */

export const ICON = {
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.9 2.4 1.02 2.56c.12.17 1.76 2.67 4.25 3.74.6.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.2 2.2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm8 7.2L4.4 6.3a.5.5 0 0 0-.4.5v.3l8 5.1 8-5.1v-.3a.5.5 0 0 0-.4-.5L12 11.2Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.6V6h-2v7.4l5 3 1-1.7-4-2.1Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm12.6 1.4L6.4 19 5 17.6 17.6 5 19 6.4Z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m12 15.4-6-6L7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="i-dir"><path fill="currentColor" d="m13.2 5 6.3 7-6.3 7-1.5-1.3 4.1-4.6H4.5v-2h11.3l-4.1-4.6L13.2 5Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M9.5 17.2 4.8 12.5l1.4-1.4 3.3 3.3 8-8 1.4 1.4-9.4 9.4Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1 13.5-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6Z"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m3.4 14.6 11.2-11.2 5.9 5.9L9.3 20.5l-5.9-5.9Zm3.4.3 1.4 1.4 1.4-1.4-1.4-1.4 1.4-1.4 1.4 1.4 1.4-1.4-1.4-1.4 1.4-1.4 1.4 1.4 1.4-1.4-1.4-1.4 1.5-1.4 2.8 2.9-8.4 8.4-2.9-2.9Z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11 2H4a2 2 0 0 0-2 2v7l11 11 9-9L11 2Zm-3.5 6A1.5 1.5 0 1 1 7.5 5a1.5 1.5 0 0 1 0 3Z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 5h11v9H3V5Zm12 3h3.5L21 11.5V14h-6V8ZM6.5 19a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5Zm11 0a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5Z"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m12 3 9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8Zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.5 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.1 21H2l7.3-8.3L2.2 3h6.4l4.4 5.9L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.8 2h-3v13.4a2.6 2.6 0 1 1-2-2.5V9.8a5.9 5.9 0 1 0 5 5.8V9.1a7 7 0 0 0 4 1.3V7.3a4.1 4.1 0 0 1-4-4.1V2Z"/></svg>',
  snapchat: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2c2.8 0 4.7 2 4.8 4.7v2.1c.5.2 1-.2 1.5-.2.6 0 1.1.4 1.1.9 0 .6-.7.9-1.4 1.1-.5.2-.8.3-.8.7 0 .8 2 3.3 3.9 3.7.3.1.5.3.5.6 0 .7-1.6 1.1-2.5 1.2-.2.4-.2 1.1-.6 1.3-.3.2-.9 0-1.6 0-1 0-1.6.2-2.3.7-.7.5-1.4 1.2-2.6 1.2s-1.9-.7-2.6-1.2c-.7-.5-1.3-.7-2.3-.7-.7 0-1.3.2-1.6 0-.4-.2-.4-.9-.6-1.3-.9-.1-2.5-.5-2.5-1.2 0-.3.2-.5.5-.6 1.9-.4 3.9-2.9 3.9-3.7 0-.4-.3-.5-.8-.7-.7-.2-1.4-.5-1.4-1.1 0-.5.5-.9 1.1-.9.5 0 1 .4 1.5.2V6.7C7.3 4 9.2 2 12 2Z"/></svg>'
};

/* --------------------------------------------------------------- shell -- */

const NAV = [
  { key: 'home', href: 'index.html', page: 'home' },
  { key: 'products', href: 'products.html', page: 'products' },
  { key: 'custom', href: 'custom.html', page: 'custom' },
  { key: 'how', href: 'how.html', page: 'how' },
  { key: 'about', href: 'about.html', page: 'about' },
  { key: 'contact', href: 'contact.html', page: 'contact' }
];

/** Inline logo: an abstract roof arc plus the wordmark, drawn in walnut. */
function logoMarkup(lang) {
  const word = lang === 'ar' ? 'يسر' : 'Yusr';
  return `
    <span class="logo" aria-hidden="true">
      <svg class="logo__mark" viewBox="0 0 40 40" focusable="false" aria-hidden="true">
        <path d="M6 20 20 8l14 12" fill="none" stroke="currentColor" stroke-width="3.2"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 21v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9" fill="none" stroke="currentColor"
              stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>
      </svg>
      <span class="logo__word">${word}</span>
    </span>`;
}

function buildHeader(page) {
  const links = NAV.map(item => {
    const current = item.page === page ? ' aria-current="page"' : '';
    return `<li><a class="nav__link" href="${item.href}" data-i18n="nav.${item.key}"${current}></a></li>`;
  }).join('');

  return `
  <a class="skip-link" href="#main" data-i18n="nav.skip"></a>
  <header class="site-header" id="site-header">
    <div class="container site-header__inner">
      <a class="site-header__brand" href="index.html">
        ${logoMarkup(currentLang)}
        <span class="visually-hidden" data-i18n="brand.name"></span>
      </a>

      <nav class="nav" id="primary-nav" aria-label="Main">
        <ul class="nav__list">${links}</ul>
      </nav>

      <div class="site-header__actions">
        <button type="button" class="btn btn--ghost btn--sm lang-toggle" id="lang-toggle">
          <span data-i18n="nav.langToggle"></span>
        </button>
        <a class="btn btn--primary btn--sm header-wa" id="header-wa" href="#" target="_blank" rel="noopener">
          ${ICON.whatsapp}<span data-i18n="nav.whatsapp"></span>
        </a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
          <span class="nav-toggle__open">${ICON.menu}</span>
          <span class="nav-toggle__close">${ICON.close}</span>
          <span class="visually-hidden" data-i18n="nav.menu"></span>
        </button>
      </div>
    </div>
  </header>`;
}

function socialMarkup() {
  return Object.entries(CONFIG.social)
    .filter(([, url]) => url)
    .map(([nameKey, url]) => `
      <a class="social__link" href="${url}" target="_blank" rel="noopener me">
        ${ICON[nameKey] || ICON.arrow}
        <span class="visually-hidden" data-i18n="footer.${nameKey}"></span>
      </a>`)
    .join('');
}

function buildFooter() {
  const links = NAV.map(i => `<li><a href="${i.href}" data-i18n="nav.${i.key}"></a></li>`).join('');
  return `
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__col">
        <a class="site-footer__brand" href="index.html">${logoMarkup(currentLang)}</a>
        <p class="site-footer__about" data-i18n="footer.about"></p>
        <p class="site-footer__made">${ICON.check}<span data-i18n="footer.builtIn"></span></p>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__title" data-i18n="footer.links"></h2>
        <ul class="site-footer__links">${links}</ul>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__title" data-i18n="footer.contact"></h2>
        <ul class="site-footer__links">
          <li><a class="with-icon" id="footer-wa" href="#" target="_blank" rel="noopener">${ICON.whatsapp}<span data-i18n="nav.whatsapp"></span></a></li>
          <li><a class="with-icon" href="tel:${CONFIG.phoneDisplay.replace(/\s/g, '')}">${ICON.phone}<span dir="ltr">${CONFIG.phoneDisplay}</span></a></li>
          <li><a class="with-icon" href="mailto:${CONFIG.email}">${ICON.mail}<span dir="ltr">${CONFIG.email}</span></a></li>
        </ul>
        <h2 class="site-footer__title" data-i18n="footer.social"></h2>
        <div class="social">${socialMarkup()}</div>
      </div>
    </div>

    <div class="container site-footer__bottom">
      <p><span data-i18n="brand.name"></span> © <span id="year"></span> · <span data-i18n="footer.rights"></span></p>
      <p class="muted">
        <span data-i18n="home.trust.maroof"></span>: <span dir="ltr">${CONFIG.maroof}</span>
        · <span data-i18n="home.trust.cr"></span>: <span dir="ltr">${CONFIG.cr}</span>
      </p>
    </div>
  </footer>`;
}

/* ------------------------------------------------------------- i18n DOM -- */

/**
 * Apply the dictionary to any subtree. Call this after rendering dynamic HTML.
 */
export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n, currentLang);
  });

  // data-i18n-attr="placeholder:form.namePh;aria-label:nav.menu"
  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s && s.trim());
      if (attr && key) el.setAttribute(attr, t(key, currentLang));
    });
  });
}

function applyMeta() {
  const page = document.body.dataset.page;
  if (!page) return;
  const meta = DICT[currentLang].meta[page];
  if (!meta) return;

  document.title = meta.t;
  setMeta('name', 'description', meta.d);
  setMeta('property', 'og:title', meta.t);
  setMeta('property', 'og:description', meta.d);
  setMeta('property', 'og:locale', currentLang === 'ar' ? 'ar_SA' : 'en_US');
  setMeta('name', 'twitter:title', meta.t);
  setMeta('name', 'twitter:description', meta.d);
}

function setMeta(attr, name, content) {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** hreflang alternates for the current page in both languages. */
function applyAlternates() {
  document.head.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
  const file = location.pathname.split('/').pop() || 'index.html';
  const params = new URLSearchParams(location.search);
  LANGS.concat(['x-default']).forEach(code => {
    const p = new URLSearchParams(params);
    p.set('lang', code === 'x-default' ? 'ar' : code);
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = code;
    link.href = `${file}?${p.toString()}`;
    document.head.appendChild(link);
  });
}

/** Listeners that need to re-run whenever the language changes. */
const langListeners = [];
export function onLangChange(fn) {
  langListeners.push(fn);
}

export function setLang(next, { persist = true } = {}) {
  currentLang = LANGS.includes(next) ? next : 'ar';
  if (persist) storeLang(currentLang);

  const conf = DICT[currentLang];
  document.documentElement.lang = conf.htmlLang;
  document.documentElement.dir = conf.dir;

  // Re-render the logo wordmark, which is language-specific.
  document.querySelectorAll('.logo').forEach(el => {
    el.outerHTML = logoMarkup(currentLang);
  });

  applyI18n();
  applyMeta();
  applyAlternates();
  refreshWaLinks();

  // Keep ?lang= in the URL so the page can be shared in the chosen language.
  const params = new URLSearchParams(location.search);
  params.set('lang', currentLang);
  history.replaceState(null, '', `${location.pathname}?${params.toString()}${location.hash}`);

  langListeners.forEach(fn => fn(currentLang));
}

/** Default WhatsApp greeting used by the header/footer buttons. */
function greeting() {
  return currentLang === 'ar'
    ? 'السلام عليكم، عندي استفسار عن منتجات يسر.'
    : 'Hello Yusr, I have a question about your products.';
}

function refreshWaLinks() {
  document.querySelectorAll('[data-wa-greeting]').forEach(el => {
    el.href = waLink(greeting());
  });
}

/* ------------------------------------------------------- UI behaviours -- */

function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    document.body.classList.toggle('nav-open', !open);
  });

  nav.addEventListener('click', e => {
    if (e.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
      toggle.focus();
    }
  });
}

/** Accordion used by the FAQ. Buttons carry aria-expanded; panels use [hidden]. */
export function initAccordions(root = document) {
  root.querySelectorAll('.accordion__trigger').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
    });
  });
}

/**
 * Placeholder image helper — one place to swap in real photography later.
 * TODO: replace image — point `src` at the real workshop photo for this seed.
 */
export function placeholderImage(seed, w = 800, h = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

/**
 * Build a lazy, responsive <img> for a placeholder or a real photo.
 * @param {{src?:string, seed?:string, alt:string, w?:number, h?:number, className?:string, eager?:boolean}} opts
 */
export function imageTag({ src, seed, alt, w = 800, h = 600, className = '', eager = false }) {
  const url = src || placeholderImage(seed || 'yusr', w, h);
  return `<!-- TODO: replace image -->
    <img class="${className}" src="${url}" alt="${alt}" width="${w}" height="${h}"
         loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
}

/* ----------------------------------------------------------------- init -- */

function mountShell() {
  const page = document.body.dataset.page || '';
  const headerSlot = document.getElementById('header-slot');
  const footerSlot = document.getElementById('footer-slot');
  if (headerSlot) headerSlot.outerHTML = buildHeader(page);
  if (footerSlot) footerSlot.outerHTML = buildFooter();

  document.querySelectorAll('#header-wa, #footer-wa').forEach(el => {
    el.setAttribute('data-wa-greeting', '');
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // <span data-config="maroof"> prints a value from config.js.
  document.querySelectorAll('[data-config]').forEach(el => {
    const value = el.dataset.config.split('.').reduce((node, k) => (node == null ? node : node[k]), CONFIG);
    if (value != null) el.textContent = value;
  });

  // <a data-config-link="tel|mail"> builds the href from config.js.
  document.querySelectorAll('[data-config-link]').forEach(el => {
    if (el.dataset.configLink === 'tel') el.href = `tel:${CONFIG.phoneDisplay.replace(/\s/g, '')}`;
    if (el.dataset.configLink === 'mail') el.href = `mailto:${CONFIG.email}`;
  });

  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => setLang(currentLang === 'ar' ? 'en' : 'ar'));
    toggle.setAttribute('data-i18n-attr', 'aria-label:nav.langToggleLabel');
  }

  initNavToggle();
  initAccordions();
  renderCoverage();
  onLangChange(renderCoverage);
}

/** City coverage list on the contact page; a check marks free installation. */
function renderCoverage() {
  const list = document.getElementById('coverage-list');
  if (!list) return;
  list.innerHTML = CITY_KEYS
    .filter(key => key !== 'other')
    .map(key => `<li>${INSTALL_CITIES.includes(key) ? ICON.check : ''}${t(`cities.${key}`, currentLang)}</li>`)
    .join('');
}

mountShell();
setLang(currentLang, { persist: false });

// Announce readiness so page modules can render after the shell exists.
document.dispatchEvent(new CustomEvent('yusr:ready', { detail: { lang: currentLang } }));
