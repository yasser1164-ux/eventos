#!/usr/bin/env node
/* =========================================================================
   Qetaa page builder.
   The published site is plain static HTML — this script exists only so the
   header, footer, tab bar and <head> of every page stay identical.
   Edit a file in tools/pages/ (page body + front matter) or tools/shell.html
   (the frame), then run:   node qetaa/tools/build.js
   ========================================================================= */
const fs = require("fs");
const path = require("path");

const ROOT  = path.resolve(__dirname, "..");
const PAGES = path.join(__dirname, "pages");
const SHELL = fs.readFileSync(path.join(__dirname, "shell.html"), "utf8");
const BASE  = "https://yasser1164-ux.github.io/eventos/qetaa/"; // ← change on custom domain

/* Kept short on purpose: the logo already goes home, and "Open requests" /
   "Account" live in the tab bar (mobile) and the footer / header icon
   (desktop) instead of competing for space here. Four items reads at a
   glance; six didn't. */
const NAV = [
  { id: "search",   href: "search.html",   ar: "تصفح القطع", key: "nav.search" },
  { id: "request",  href: "request.html",  ar: "اطلب قطعة",  key: "nav.request" },
  { id: "sellers",  href: "sellers.html",  ar: "المتاجر",     key: "nav.sellers" },
  { id: "pricing",  href: "pricing.html",  ar: "للتجار",      key: "nav.pricing" }
];

const navHtml = (cls, page) => NAV.map(n =>
  `<a class="${cls}${n.id === page ? " is-active" : ""}" href="${n.href}" data-i18n="${n.key}">${n.ar}</a>`
).join("\n      ");

const files = fs.readdirSync(PAGES).filter(f => f.endsWith(".html"));
let built = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(PAGES, file), "utf8");
  const m = raw.match(/^<!--META\s*([\s\S]*?)-->\s*/);
  if (!m) { console.error(`! ${file}: no <!--META--> block`); process.exitCode = 1; continue; }

  let meta;
  try { meta = JSON.parse(m[1]); }
  catch (e) { console.error(`! ${file}: bad META JSON — ${e.message}`); process.exitCode = 1; continue; }

  const body = raw.slice(m[0].length);
  const name = file.replace(/\.html$/, "");
  const scripts = (meta.scripts || [])
    .map(s => `<script src="assets/js/${s}?v=__BUILD__"></script>`).join("\n");

  const html = SHELL
    .replace(/\{\{PAGE\}\}/g, name)
    .replace(/\{\{TITLE\}\}/g, meta.title)
    .replace(/\{\{DESC\}\}/g, meta.desc)
    .replace(/\{\{CANONICAL\}\}/g, BASE + (name === "index" ? "" : file))
    .replace(/\{\{NAV_DRAWER\}\}/g, navHtml("d-link", name))
    .replace(/\{\{NAV\}\}/g, navHtml("nav-link", name))
    .replace(/\{\{BODY_CLASS\}\}/g, meta.bodyClass || "")
    .replace(/\{\{EXTRA_HEAD\}\}/g, meta.head || "")
    .replace(/\{\{BODY\}\}/g, body.trim())
    .replace(/\{\{SCRIPTS\}\}/g, scripts);

  fs.writeFileSync(path.join(ROOT, file), html);
  built++;
  console.log(`✓ ${file}`);
}

/* sitemap.xml is generated from the same page list so it never drifts */
const today = new Date().toISOString().slice(0, 10);
const urls = files.map(f => f.replace(/\.html$/, ""))
  .filter(n => n !== "404")
  .sort((a, b) => (a === "index" ? -1 : b === "index" ? 1 : a.localeCompare(b)))
  .map(n => `  <url>\n    <loc>${BASE}${n === "index" ? "" : n + ".html"}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${n === "index" || n === "search" ? "daily" : "monthly"}</changefreq>\n    <priority>${n === "index" ? "1.0" : "0.7"}</priority>\n  </url>`)
  .join("\n");
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

console.log(`\n${built} page(s) + sitemap.xml written to ${ROOT}`);
