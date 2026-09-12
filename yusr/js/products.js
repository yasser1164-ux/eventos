/**
 * Yusr — product data rendering: featured strip (home), catalog (products.html)
 * and the detail page (product.html?id=…). All data comes from data/products.json.
 */

import { applyI18n, imageTag, lang, onLangChange, ICON } from './main.js';
import { CATEGORIES, formatNumber, formatPrice, t, DICT } from './i18n.js';

const DATA_URL = 'data/products.json';

let products = [];

/* ------------------------------------------------------------- loading -- */

async function loadProducts() {
  const res = await fetch(DATA_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function showLoadError(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="notice notice--warn">
      <p data-i18n="products.loadError"></p>
      <p class="muted" data-i18n="products.loadErrorHint"></p>
    </div>`;
  applyI18n(container);
}

/* --------------------------------------------------------------- cards -- */

function priceLabel(p) {
  const from = `<span class="price__label" data-i18n="common.from"></span> <strong class="price__value">${formatPrice(p.priceFrom, lang())}</strong>`;
  return `<p class="price">${from}</p>`;
}

function productCard(p) {
  const l = lang();
  const name = p.name[l];
  const href = `product.html?id=${encodeURIComponent(p.id)}`;
  return `
  <article class="card product-card">
    <a class="product-card__media" href="${href}" tabindex="-1" aria-hidden="true">
      ${imageTag({ src: p.images[0], alt: '', w: 800, h: 600, className: 'product-card__img' })}
    </a>
    <div class="product-card__body">
      <p class="chip chip--soft" data-i18n="cat.${p.category}"></p>
      <h3 class="product-card__title"><a href="${href}">${name}</a></h3>
      <p class="product-card__short muted">${p.short[l]}</p>
      <ul class="product-card__meta">
        <li>${ICON.ruler}<span>${p.specs.material[l]}</span></li>
        <li>${ICON.truck}<span>${formatNumber(p.specs.leadTimeDays)} <span data-i18n="common.days"></span></span></li>
      </ul>
      ${priceLabel(p)}
      <a class="btn btn--primary btn--block" href="custom.html?product=${encodeURIComponent(p.id)}">
        <span data-i18n="common.orderNow"></span>
      </a>
    </div>
  </article>`;
}

function renderCards(container, list) {
  container.innerHTML = list.map(productCard).join('');
  applyI18n(container);
}

/* ------------------------------------------------------ home: featured -- */

function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  renderCards(grid, products.filter(p => p.featured).slice(0, 6));
}

/* --------------------------------------------------------- catalog page -- */

function initCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const filters = document.getElementById('catalog-filters');
  const search = document.getElementById('catalog-search');
  const count = document.getElementById('catalog-count');
  const empty = document.getElementById('catalog-empty');

  const params = new URLSearchParams(location.search);
  let activeCat = CATEGORIES.includes(params.get('cat')) ? params.get('cat') : 'all';
  let query = (params.get('q') || '').trim();
  if (search && query) search.value = query;

  // Filter chips
  filters.innerHTML = ['all', ...CATEGORIES].map(key => `
    <button type="button" class="chip chip--filter" data-cat="${key}"
            aria-pressed="${key === activeCat}">
      <span data-i18n="cat.${key}"></span>
    </button>`).join('');
  applyI18n(filters);

  function matches(p) {
    if (activeCat !== 'all' && p.category !== activeCat) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    const haystack = [
      p.name.ar, p.name.en, p.short.ar, p.short.en,
      p.specs.material.ar, p.specs.material.en,
      t(`cat.${p.category}`, 'ar'), t(`cat.${p.category}`, 'en')
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  }

  function syncUrl() {
    const next = new URLSearchParams(location.search);
    if (activeCat === 'all') next.delete('cat'); else next.set('cat', activeCat);
    if (query) next.set('q', query); else next.delete('q');
    history.replaceState(null, '', `${location.pathname}?${next.toString()}`);
  }

  function render() {
    const list = products.filter(matches);
    renderCards(grid, list);
    count.innerHTML = `${formatNumber(list.length)} <span data-i18n="products.count"></span>`;
    applyI18n(count);
    empty.hidden = list.length > 0;
    filters.querySelectorAll('[data-cat]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.cat === activeCat));
    });
  }

  filters.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    syncUrl();
    render();
  });

  if (search) {
    search.addEventListener('input', () => {
      query = search.value.trim();
      syncUrl();
      render();
    });
  }

  onLangChange(render);
  render();
}

/* ---------------------------------------------------------- detail page -- */

function specRow(labelKey, value) {
  return `<div class="specs__row"><dt data-i18n="${labelKey}"></dt><dd>${value}</dd></div>`;
}

function optionField(kind, values, l) {
  if (!values || !values.length) return '';
  const labelKey = kind === 'material' ? 'product.materialOpt' : `product.${kind}`;
  const opts = values.map(v => `<option value="${v[l] || v}">${v[l] || v}</option>`).join('');
  return `
    <p class="field">
      <label class="field__label" for="opt-${kind}" data-i18n="${labelKey}"></label>
      <select class="field__input" id="opt-${kind}" data-option="${kind}">${opts}</select>
    </p>`;
}

function renderDetail() {
  const root = document.getElementById('product-detail');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id');
  const p = products.find(x => x.id === id);

  if (!p) {
    root.innerHTML = `
      <div class="notice notice--warn">
        <p data-i18n="product.notFound"></p>
        <p><a class="btn btn--primary btn--sm" href="products.html"><span data-i18n="common.backToProducts"></span></a></p>
      </div>`;
    applyI18n(root);
    return;
  }

  const l = lang();
  const colors = p.specs.colors.map(c => c[l] || c).join(l === 'ar' ? '، ' : ', ');

  const thumbs = p.images.map((src, i) => `
    <button type="button" class="gallery__thumb" data-index="${i}" aria-pressed="${i === 0}">
      ${imageTag({ src, alt: `${p.name[l]} — ${t('product.thumbAlt', l)} ${i + 1}`, w: 300, h: 225 })}
    </button>`).join('');

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="products.html">${ICON.arrow}<span data-i18n="common.backToProducts"></span></a>
    </nav>

    <div class="detail">
      <div class="detail__gallery">
        <figure class="gallery" aria-label="${t('product.gallery', l)}">
          <div class="gallery__main" id="gallery-main">
            ${imageTag({ src: p.images[0], alt: p.name[l], w: 1000, h: 750, eager: true })}
          </div>
          <div class="gallery__thumbs">${thumbs}</div>
        </figure>
      </div>

      <div class="detail__info">
        <p class="chip chip--soft" data-i18n="cat.${p.category}"></p>
        <h1 class="detail__title">${p.name[l]}</h1>
        <p class="detail__price">
          <span data-i18n="common.from"></span>
          <strong>${formatPrice(p.priceFrom, l)}</strong>
          <span data-i18n="common.to"></span>
          <strong>${formatPrice(p.priceTo, l)}</strong>
        </p>
        <p class="muted small" data-i18n="product.priceNote"></p>
        <p class="detail__desc">${p.description[l]}</p>

        <form class="detail__options" id="product-options">
          <h2 class="h5" data-i18n="product.options"></h2>
          ${optionField('size', p.options.size, l)}
          ${optionField('color', p.options.color, l)}
          ${optionField('material', p.options.material, l)}
          <a class="btn btn--primary btn--block" id="order-this" href="custom.html?product=${encodeURIComponent(p.id)}">
            <span data-i18n="common.orderThis"></span>
          </a>
        </form>

        <h2 class="h5" data-i18n="product.specs"></h2>
        <dl class="specs">
          ${specRow('product.dimensions', p.specs.dimensions[l])}
          ${specRow('product.material', p.specs.material[l])}
          ${specRow('product.colors', colors)}
          ${specRow('product.leadTime', `${formatNumber(p.specs.leadTimeDays)} ${t('common.days', l)}`)}
          ${specRow('product.warranty', `${formatNumber(p.specs.warrantyYears)} ${t('common.years', l)}`)}
        </dl>
      </div>
    </div>`;

  applyI18n(root);
  document.title = `${p.name[l]} | ${DICT[l].brand.name}`;

  // Gallery switching
  const main = root.querySelector('#gallery-main');
  root.querySelectorAll('.gallery__thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = p.images[Number(btn.dataset.index)];
      main.innerHTML = imageTag({ src, alt: p.name[l], w: 1000, h: 750, eager: true });
      root.querySelectorAll('.gallery__thumb').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });

  // Keep the order link in sync with the chosen options.
  const form = root.querySelector('#product-options');
  const orderLink = root.querySelector('#order-this');
  function syncOrderLink() {
    const params = new URLSearchParams({ product: p.id });
    form.querySelectorAll('[data-option]').forEach(sel => {
      if (sel.value) params.set(sel.dataset.option, sel.value);
    });
    params.set('lang', lang());
    orderLink.href = `custom.html?${params.toString()}`;
  }
  form.addEventListener('change', syncOrderLink);
  syncOrderLink();
}

/* ----------------------------------------------------------------- init -- */

const catalogGrid = document.getElementById('catalog-grid');
const detailRoot = document.getElementById('product-detail');
const featuredGrid = document.getElementById('featured-grid');

loadProducts()
  .then(list => {
    products = list;
    renderFeatured();
    initCatalog();
    renderDetail();
    onLangChange(() => {
      renderFeatured();
      if (detailRoot) renderDetail();
    });
  })
  .catch(err => {
    console.warn('[yusr] product data unavailable:', err.message);
    showLoadError(catalogGrid || detailRoot || featuredGrid);
  });
