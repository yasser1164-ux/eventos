/**
 * Yusr — the request form on custom.html.
 * Validates, composes a WhatsApp message in the active language, and opens wa.me.
 * There is no cart and no payment step: WhatsApp is the whole checkout.
 */

import { applyI18n, lang, onLangChange } from './main.js';
import { CATEGORIES, CITY_KEYS, t } from './i18n.js';
import { waLink, mailLink } from './config.js';

const form = document.getElementById('request-form');

/* ------------------------------------------------------------- selects -- */

const BUDGETS = ['a', 'b', 'c', 'd', 'e'];
const TIMES = ['morning', 'afternoon', 'evening', 'any'];

function fillSelect(select, items, placeholderKey) {
  if (!select) return;
  const previous = select.value;
  const placeholder = placeholderKey
    ? `<option value="" disabled ${previous ? '' : 'selected'}>${t(placeholderKey, lang())}</option>`
    : '';
  select.innerHTML = placeholder + items
    .map(({ value, labelKey }) => `<option value="${value}">${t(labelKey, lang())}</option>`)
    .join('');
  if (previous) select.value = previous;
}

function fillAllSelects() {
  fillSelect(
    form.querySelector('#f-city'),
    CITY_KEYS.map(k => ({ value: k, labelKey: `cities.${k}` })),
    'form.cityPh'
  );
  fillSelect(
    form.querySelector('#f-category'),
    CATEGORIES.map(k => ({ value: k, labelKey: `cat.${k}` })),
    'form.categoryPh'
  );
  fillSelect(
    form.querySelector('#f-budget'),
    BUDGETS.map(k => ({ value: k, labelKey: `form.budgetRanges.${k}` })),
    'form.budgetPh'
  );
  fillSelect(
    form.querySelector('#f-time'),
    TIMES.map(k => ({ value: k, labelKey: `form.time.${k}` })),
    null
  );
}

/* ---------------------------------------------------------- validation -- */

const SAUDI_MOBILE = /^(?:(?:\+|00)?966|0)?5\d{8}$/;

/** 0512345678 / +966512345678 / 966512345678 → 966512345678 */
function normalisePhone(raw) {
  const digits = raw.replace(/[\s()\-‏‎]/g, '').replace(/^\+/, '');
  const tail = digits.replace(/^(00966|966|0)/, '');
  return `966${tail}`;
}

function setError(field, messageKey) {
  const wrapper = field.closest('.field');
  const errorEl = wrapper && wrapper.querySelector('.field__error');
  field.setAttribute('aria-invalid', 'true');
  if (errorEl) {
    errorEl.dataset.i18n = messageKey;
    errorEl.textContent = t(messageKey, lang());
    errorEl.hidden = false;
  }
}

function clearError(field) {
  const wrapper = field.closest('.field');
  const errorEl = wrapper && wrapper.querySelector('.field__error');
  field.removeAttribute('aria-invalid');
  if (errorEl) errorEl.hidden = true;
}

function validate() {
  const problems = [];
  const check = (selector, test, key) => {
    const field = form.querySelector(selector);
    if (!field) return;
    if (test(field.value.trim())) {
      clearError(field);
    } else {
      setError(field, key);
      problems.push(field);
    }
  };

  check('#f-name', v => v.length >= 2, 'form.nameErr');
  check('#f-city', v => v !== '', 'form.cityErr');
  check('#f-phone', v => SAUDI_MOBILE.test(v.replace(/[\s\-()]/g, '')), 'form.phoneErr');
  check('#f-category', v => v !== '', 'form.categoryErr');
  check('#f-description', v => v.length >= 10, 'form.descriptionErr');
  check('#f-ref', v => v === '' || /^https?:\/\/\S+$/i.test(v), 'form.refErr');

  return problems;
}

/* ------------------------------------------------------------- message -- */

function value(id) {
  const el = form.querySelector(id);
  return el ? el.value.trim() : '';
}

function dimensionsText(l) {
  const w = value('#f-width'), d = value('#f-depth'), h = value('#f-height');
  if (!w && !d && !h) return '';
  const unit = l === 'ar' ? 'سم' : 'cm';
  const part = v => (v === '' ? '?' : v);
  return `${part(w)} × ${part(d)} × ${part(h)} ${unit}`;
}

function optionsText() {
  const params = new URLSearchParams(location.search);
  const l = lang();
  const parts = [];
  if (params.get('size')) parts.push(`${t('product.size', l)}: ${params.get('size')}`);
  if (params.get('color')) parts.push(`${t('product.color', l)}: ${params.get('color')}`);
  if (params.get('material')) parts.push(`${t('product.materialOpt', l)}: ${params.get('material')}`);
  return parts.join(' · ');
}

function buildMessage() {
  const l = lang();
  const m = key => t(`waMsg.${key}`, l);
  const none = m('notSpecified');
  const productName = form.querySelector('#f-product-name');

  const lines = [
    m('title'),
    '——————',
    `${m('name')}: ${value('#f-name')}`,
    `${m('city')}: ${t(`cities.${value('#f-city')}`, l)}`,
    `${m('phone')}: ${normalisePhone(value('#f-phone'))}`,
    `${m('category')}: ${t(`cat.${value('#f-category')}`, l)}`
  ];

  if (productName && productName.value) lines.push(`${m('product')}: ${productName.value}`);
  const opts = optionsText();
  if (opts) lines.push(`${m('options')}: ${opts}`);

  lines.push(`${m('description')}: ${value('#f-description')}`);

  const dims = dimensionsText(l);
  lines.push(`${m('dims')}: ${dims || none}`);
  lines.push(`${m('material')}: ${value('#f-material') || none}`);

  const budget = value('#f-budget');
  lines.push(`${m('budget')}: ${budget ? t(`form.budgetRanges.${budget}`, l) : none}`);

  if (value('#f-ref')) lines.push(`${m('ref')}: ${value('#f-ref')}`);

  const time = value('#f-time');
  lines.push(`${m('contactTime')}: ${time ? t(`form.time.${time}`, l) : none}`);

  return lines.join('\n');
}

/* ---------------------------------------------------------------- flow -- */

function prefillFromUrl() {
  const params = new URLSearchParams(location.search);
  const productId = params.get('product');
  if (!productId) return;

  const notice = document.getElementById('prefill-notice');
  const nameField = form.querySelector('#f-product-name');
  const productLabel = document.getElementById('prefill-product');

  // Resolve the product name from the catalog; fall back to the raw id.
  fetch('data/products.json', { cache: 'no-cache' })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then(list => {
      const p = list.find(x => x.id === productId);
      const render = () => {
        const l = lang();
        const label = p ? p.name[l] : productId;
        if (nameField) nameField.value = label;
        if (productLabel) {
          const opts = optionsText();
          productLabel.textContent = opts ? `${label} — ${opts}` : label;
        }
        if (p) {
          const cat = form.querySelector('#f-category');
          if (cat) cat.value = p.category;
          const desc = form.querySelector('#f-description');
          if (desc && !desc.value) {
            desc.value = l === 'ar'
              ? `أرغب بطلب: ${label}. `
              : `I would like to order: ${label}. `;
          }
        }
      };
      render();
      onLangChange(render);
      if (notice) notice.hidden = false;
    })
    .catch(err => {
      console.warn('[yusr] could not resolve product name:', err.message);
      if (nameField) nameField.value = productId;
      if (productLabel) productLabel.textContent = productId;
      if (notice) notice.hidden = false;
    });
}

function initForm() {
  fillAllSelects();
  prefillFromUrl();
  onLangChange(() => {
    fillAllSelects();
    // Re-translate any visible error messages.
    form.querySelectorAll('.field__error:not([hidden])').forEach(el => {
      if (el.dataset.i18n) el.textContent = t(el.dataset.i18n, lang());
    });
  });

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  const summary = document.getElementById('form-error-summary');
  const success = document.getElementById('form-success');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const problems = validate();

    if (problems.length) {
      summary.hidden = false;
      applyI18n(summary);
      problems[0].focus();
      return;
    }
    summary.hidden = true;

    const message = buildMessage();
    const wa = waLink(message);
    const mail = mailLink(t('waMsg.title', lang()), message);

    document.getElementById('success-wa').href = wa;
    document.getElementById('success-mail').href = mail;
    success.hidden = false;
    form.hidden = true;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    success.querySelector('h2').focus();

    window.open(wa, '_blank', 'noopener');
  });

  const again = document.getElementById('form-again');
  if (again) {
    again.addEventListener('click', () => {
      success.hidden = true;
      form.hidden = false;
      form.querySelector('#f-name').focus();
    });
  }
}

if (form) initForm();
