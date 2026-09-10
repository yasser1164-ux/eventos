#!/usr/bin/env node
/* Regenerates assets/najd-company-profile.pdf from tools/profile.html.
   Run:  node najd/tools/profile.js      (needs Chromium via playwright)      */
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const src = "file://" + path.join(__dirname, "profile.html");
  const out = path.join(__dirname, "..", "assets", "najd-company-profile.pdf");
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(src, { waitUntil: "networkidle" }).catch(() => p.goto(src));
  await p.waitForTimeout(2500);                    // let the webfont settle
  await p.pdf({ path: out, format: "A4", printBackground: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await b.close();
  console.log("✓ " + out);
})();
