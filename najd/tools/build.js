#!/usr/bin/env node
/* =========================================================================
   Page builder.
   The published site is plain static HTML — this script only exists so the
   header, footer and <head> of every page stay identical. Edit a file in
   tools/pages/ (page body + front matter) or tools/shell.html (the frame),
   then run:   node najd/tools/build.js
   ========================================================================= */
const fs = require("fs");
const path = require("path");

const ROOT   = path.resolve(__dirname, "..");
const PAGES  = path.join(__dirname, "pages");
const SHELL  = fs.readFileSync(path.join(__dirname, "shell.html"), "utf8");
const BASE   = "https://yasser1164-ux.github.io/eventos/najd/";  // ← change on custom domain

const NAV = [
  { id: "index",    href: "index.html",    ar: "الرئيسية",    key: "nav.home" },
  { id: "about",    href: "about.html",    ar: "من نحن",      key: "nav.about" },
  { id: "services", href: "services.html", ar: "خدماتنا",     key: "nav.services" },
  { id: "products", href: "products.html", ar: "المنتجات",    key: "nav.products" },
  { id: "projects", href: "projects.html", ar: "أعمالنا",     key: "nav.projects" },
  { id: "careers",  href: "careers.html",  ar: "الوظائف",     key: "nav.careers" },
  { id: "contact",  href: "contact.html",  ar: "تواصل معنا",  key: "nav.contact" }
];

const navHtml = (cls) => NAV.map(n =>
  `<a class="${cls}" href="${n.href}" data-i18n="${n.key}">${n.ar}</a>`).join("\n      ");

const files = fs.readdirSync(PAGES).filter(f => f.endsWith(".html"));
let built = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(PAGES, file), "utf8");
  const m = raw.match(/^<!--META\s*([\s\S]*?)-->\s*/);
  if (!m) { console.error(`! ${file}: no <!--META--> block`); process.exitCode = 1; continue; }

  const meta = JSON.parse(m[1]);
  const body = raw.slice(m[0].length);
  const name = file.replace(/\.html$/, "");
  const scripts = (meta.scripts || [])
    .map(s => `<script src="assets/js/${s}?v=__BUILD__"></script>`).join("\n");

  const html = SHELL
    .replace(/\{\{PAGE\}\}/g, name)
    .replace(/\{\{TITLE\}\}/g, meta.title)
    .replace(/\{\{DESC\}\}/g, meta.desc)
    .replace(/\{\{CANONICAL\}\}/g, BASE + (name === "index" ? "" : file))
    .replace(/\{\{NAV\}\}/g, navHtml("nav-link"))
    .replace(/\{\{NAV_DRAWER\}\}/g, navHtml("d-link"))
    .replace(/\{\{BODY_CLASS\}\}/g, meta.bodyClass || "")
    .replace(/\{\{EXTRA_HEAD\}\}/g, meta.head || "")
    .replace(/\{\{BODY\}\}/g, body.trim())
    .replace(/\{\{SCRIPTS\}\}/g, scripts);

  fs.writeFileSync(path.join(ROOT, file), html);
  built++;
  console.log(`✓ ${file}`);
}
console.log(`\n${built} page(s) written to ${ROOT}`);
