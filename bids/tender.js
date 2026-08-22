// ---- ONE REQUEST ------------------------------------------------------------
// Three screens in one, decided by who is looking and what the clock says:
//   · the buyer, while bidding is open  → how many sealed bids are in, and the
//     link to send suppliers;
//   · a supplier, while bidding is open → the bid form (and their own bid back);
//   · everyone, after the closing time  → every bid opened at once, ranked on
//     landed cost, with the line-by-line split award underneath.

const TENDER_ID = new URLSearchParams(location.search).get('id');
const JUST_POSTED = new URLSearchParams(location.search).get('posted') === '1';

let T = null;
let WEIGHT = 0.75;          // price vs speed in the value score
let BID_DRAFT_SHOWN = false;
let LAST_SEALED = null;      // last rendered sealed/open state, for the ticker below

// A supplier may revise their price before the close; only their latest bid
// counts, so earlier drafts never inflate the count or the comparison.
function activeBids(t) {
  const byBidder = new Map();
  for (const b of mzBidsFor(t.id)) {
    const prev = byBidder.get(b.bidderKey);
    if (!prev || new Date(b.createdAt) > new Date(prev.createdAt)) byBidder.set(b.bidderKey, b);
  }
  return [...byBidder.values()];
}

function supplierName(b) {
  return b.supplierCompany || b.supplierName || 'Supplier';
}

function tenderUrl(t) {
  return `${location.origin}${location.pathname}?id=${encodeURIComponent(t.id)}`;
}

// The message that actually gets pasted into a supplier WhatsApp group.
function shareText(t) {
  const lines = t.items.map(i =>
    `• ${qtyText(i.qty)} ${unitShort(i.unit)} — ${materialOf(i.material).en}${i.spec ? ` (${i.spec})` : ''}`).join('\n');
  return `${t.ref} — ${t.title}\n${t.city} · needed on site by ${fmtDate(t.neededBy)}\n\n${lines}\n\n` +
         `Sealed bids close ${fmtDateTime(t.closesAt)}. Send your price here:`;
}

function shareBlock(t) {
  const url = tenderUrl(t);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${shareText(t)}\n${url}`)}`;
  const offline = !MZ_ONLINE
    ? `<p class="hint">⚠️ No database is reachable, so this request lives on this
         device only and the link will not open for anyone else. Run
         <code>supabase/tenders.sql</code> once to make the board shared.</p>`
    : '';
  return `<div class="card">
    <h2>Send it to your suppliers</h2>
    <p>One link, as many suppliers as you like. They bid without seeing each other.</p>
    <div class="btn-row" style="margin-top:0">
      <a class="btn" href="${esc(wa)}" target="_blank" rel="noopener">💬 Share on WhatsApp</a>
      <button class="btn btn-ghost" id="copy-link" data-url="${esc(url)}">🔗 Copy link</button>
    </div>
    ${offline}
  </div>`;
}

// ---- head + items -----------------------------------------------------------

function renderHead() {
  const st = tenderStatus(T);
  const bids = activeBids(T);
  const bidFact = T.awardedBidId ? 'Awarded'
    : isSealed(T) ? `${mzSealedCount(T)} sealed`
    : `${bids.length} opened`;

  document.getElementById('head').innerHTML = `
    <div class="head-row">
      <h1>${esc(T.title)}</h1>
      <span class="badge ${st.kind}">${esc(st.label)}</span>
      ${mzIsMine(T) ? '<span class="badge mine">YOUR REQUEST</span>' : ''}
    </div>
    <p class="sub">${esc(T.ref)} · ${esc(T.city)}${T.buyerCompany ? ` · posted by ${esc(T.buyerCompany)}` : ''}</p>
    <div class="facts">
      <div class="fact"><b>Needed on site</b><span>${fmtDate(T.neededBy)}</span></div>
      <div class="fact"><b>Bids close</b><span>${fmtDateTime(T.closesAt)}</span></div>
      <div class="fact"><b>Bids</b><span>${esc(bidFact)}</span></div>
      ${T.site ? `<div class="fact"><b>Delivery site</b><span style="font-size:13px;font-weight:600">${esc(T.site)}</span></div>` : ''}
    </div>
    ${T.notes ? `<div class="card"><h2>Conditions</h2><p style="margin:0">${esc(T.notes)}</p></div>` : ''}`;
}

function renderItems() {
  const rows = T.items.map((i, n) => {
    const m = materialOf(i.material);
    const mk = marketMedian(i.material, i.unit, MZ_BOARD.tenders, MZ_BOARD.bids);
    return `<tr>
      <td>
        <b>${m.emoji} ${esc(m.en)}</b> <span style="color:var(--muted)">${esc(m.ar)}</span>
        ${i.spec ? `<div class="spec">${esc(i.spec)}</div>` : ''}
        ${mk ? `<div class="market">Median on this board: ${money(mk.median)} per ${esc(unitShort(i.unit))} (${mk.samples} bids)</div>` : ''}
      </td>
      <td class="num">${qtyText(i.qty)}</td>
      <td>${esc(UNITS[i.unit] ? UNITS[i.unit].en : i.unit)}</td>
    </tr>`;
  }).join('');

  document.getElementById('items').innerHTML = `<div class="card">
    <h2>What is being bought</h2>
    <p>${T.items.length} line${T.items.length === 1 ? '' : 's'} · every line priced separately, so the request can be split between suppliers.</p>
    <div class="scroll-x"><table>
      <thead><tr><th>Material</th><th class="num">Quantity</th><th>Unit</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>`;
}

// ---- supplier: the bid form -------------------------------------------------

function bidFormHtml(existing) {
  const me = mzMe();
  const lines = T.items.map((i, n) => {
    const m = materialOf(i.material);
    const val = existing && existing.lines[n] != null ? existing.lines[n] : '';
    return `<div class="bidline">
      <div class="what">
        <b>${m.emoji} ${esc(m.en)}</b>
        <div class="spec">${qtyText(i.qty)} ${esc(unitShort(i.unit))}${i.spec ? ` · ${esc(i.spec)}` : ''}</div>
      </div>
      <div>
        <input class="b-line" data-i="${n}" type="number" min="0" step="any" inputmode="decimal"
               value="${esc(val)}" placeholder="price / ${esc(unitShort(i.unit))}" />
        <div class="linesum" id="sum-${n}"></div>
      </div>
    </div>`;
  }).join('');

  return `<div class="card">
    <h2>${existing ? 'Revise your bid' : 'Send your bid'}</h2>
    <p>Prices exclude VAT and are per unit. Leave a line empty if you do not
       carry it — partial bids still compete line by line.</p>
    ${lines}
    <div class="grid2" style="margin-top:16px">
      <label class="field"><span>Delivery to site <em>— total, SAR</em></span>
        <input id="b-delivery" type="number" min="0" step="any" inputmode="decimal" value="${existing ? esc(existing.deliveryFee || 0) : ''}" placeholder="0" /></label>
      <label class="field"><span>Discount <em>— on the full package, SAR</em></span>
        <input id="b-discount" type="number" min="0" step="any" inputmode="decimal" value="${existing ? esc(existing.discount || 0) : ''}" placeholder="0" /></label>
    </div>
    <div class="grid3">
      <label class="field"><span>Delivery in <em>— days</em></span>
        <input id="b-lead" type="number" min="1" step="1" inputmode="numeric" value="${existing ? esc(existing.leadDays) : '3'}" /></label>
      <label class="field"><span>Price valid for <em>— days</em></span>
        <input id="b-validity" type="number" min="1" step="1" inputmode="numeric" value="${existing ? esc(existing.validityDays) : '14'}" /></label>
      <label class="field"><span>Payment terms</span>
        <select id="b-terms">${PAYMENT_TERMS.map(p =>
          `<option value="${p.key}" ${existing && existing.terms === p.key ? 'selected' : ''}>${esc(p.label)}</option>`).join('')}</select></label>
    </div>
    <div class="totals" id="b-totals"></div>
    <div class="grid3" style="margin-top:16px">
      <label class="field"><span>Your name</span><input id="b-name" maxlength="60" value="${esc(me.name)}" placeholder="Khalid" /></label>
      <label class="field"><span>Company</span><input id="b-company" maxlength="80" value="${esc(me.company)}" placeholder="Eastern Cement Traders" /></label>
      <label class="field"><span>Phone</span><input id="b-phone" type="tel" maxlength="24" value="${esc(me.phone)}" placeholder="05xxxxxxxx" /></label>
    </div>
    <label class="field"><span>Notes to the buyer <em>— optional</em></span>
      <textarea id="b-notes" maxlength="400" placeholder="e.g. Stock on the ground, can load tomorrow morning.">${existing ? esc(existing.notes || '') : ''}</textarea></label>
    <p class="err" id="bid-err" hidden></p>
    <div class="btn-row" style="margin-top:6px">
      <button class="btn btn-lg" id="bid-submit">${existing ? 'Send revised bid' : 'Send sealed bid'}</button>
    </div>
    <p class="hint">Your price is sealed until ${fmtDateTime(T.closesAt)} — the buyer
       sees only that a bid arrived. You can revise it any time before then.</p>
  </div>`;
}

function readBidDraft() {
  return {
    lines: T.items.map((_, i) => {
      const el = document.querySelector(`.b-line[data-i="${i}"]`);
      const v = el ? el.value.trim() : '';
      return v === '' ? null : Number(v);
    }),
    deliveryFee: Number(document.getElementById('b-delivery').value) || 0,
    discount: Number(document.getElementById('b-discount').value) || 0,
    leadDays: Number(document.getElementById('b-lead').value) || 1,
    validityDays: Number(document.getElementById('b-validity').value) || 14,
    terms: document.getElementById('b-terms').value
  };
}

// Live landed cost while typing — the supplier sees the number the buyer will
// rank them on, not just their own unit prices.
function refreshBidTotals() {
  const draft = readBidDraft();
  T.items.forEach((item, i) => {
    const el = document.getElementById(`sum-${i}`);
    const t = lineTotal(T, draft, i);
    el.textContent = t == null ? 'not quoted' : `${qtyText(item.qty)} × ${money(lineUnitPrice(draft, i))} = ${money(t)}`;
  });
  const tot = bidTotals(T, draft);
  const cov = bidCoverage(T, draft);
  document.getElementById('b-totals').innerHTML = `
    <div><span>Goods (${cov.priced} of ${cov.total} lines)</span><span>${money(tot.goods)}</span></div>
    <div><span>Delivery to site</span><span>${money(tot.delivery)}</span></div>
    ${tot.discount ? `<div><span>Discount</span><span>− ${money(tot.discount)}</span></div>` : ''}
    <div><span>VAT ${Math.round(VAT_RATE * 100)}%</span><span>${money(tot.vat)}</span></div>
    <div class="grand"><span>Landed cost</span><span>${money(tot.total)}</span></div>`;
}

function wireBidForm(existing) {
  document.querySelectorAll('.b-line, #b-delivery, #b-discount').forEach(el =>
    el.addEventListener('input', refreshBidTotals));
  refreshBidTotals();

  document.getElementById('bid-submit').addEventListener('click', async () => {
    const err = document.getElementById('bid-err');
    err.hidden = true;
    const draft = readBidDraft();
    const cov = bidCoverage(T, draft);
    if (!cov.priced) {
      err.textContent = 'Price at least one line before sending the bid.';
      err.hidden = false;
      return;
    }
    const company = document.getElementById('b-company').value.trim();
    const name = document.getElementById('b-name').value.trim();
    if (!company && !name) {
      err.textContent = 'Add your name or company — the buyer has to know who is quoting.';
      err.hidden = false;
      return;
    }
    const btn = document.getElementById('bid-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    mzSaveMe({ name, company, phone: document.getElementById('b-phone').value.trim() });
    await mzCreateBid({
      tenderId: T.id, ...draft,
      supplierName: name, supplierCompany: company,
      supplierPhone: document.getElementById('b-phone').value.trim(),
      notes: document.getElementById('b-notes').value.trim()
    });
    BID_DRAFT_SHOWN = false;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function myBidSummary(bid) {
  const tot = bidTotals(T, bid);
  const cov = bidCoverage(T, bid);
  return `<div class="card">
    <h2>✅ Your bid is in — and sealed</h2>
    <p>Sent ${fmtDateTime(bid.createdAt)}. It opens with everyone else's at
       ${fmtDateTime(T.closesAt)}.</p>
    <div class="totals">
      <div><span>Goods (${cov.priced} of ${cov.total} lines)</span><span>${money(tot.goods)}</span></div>
      <div><span>Delivery</span><span>${money(tot.delivery)}</span></div>
      <div><span>Delivery in</span><span>${esc(bid.leadDays)} days · ${esc(termsLabel(bid.terms))}</span></div>
      <div class="grand"><span>Landed cost</span><span>${money(tot.total)}</span></div>
    </div>
    <div class="btn-row"><button class="btn btn-ghost" id="revise">Revise my bid</button></div>
  </div>`;
}

// ---- comparison -------------------------------------------------------------

function comparisonHtml(bids) {
  const ranked = scoreBids(T, bids, WEIGHT);
  const canAward = mzIsMine(T) && !T.awardedBidId;

  const rows = ranked.map((r, n) => {
    const b = r.bid;
    const first = n === 0 && r.coverage.complete;
    const won = T.awardedBidId === b.id;
    const delta = r.deltaVsBest == null ? '—'
      : r.deltaVsBest === 0 ? '<span class="best">cheapest</span>'
      : `<span class="delta">+${money(r.deltaVsBest)}</span>`;
    return `<tr class="${won || first ? 'winner' : ''} ${r.coverage.complete ? '' : 'partial'}">
      <td><span class="rank ${first ? 'first' : ''}">${n + 1}</span></td>
      <td class="who">
        <b>${esc(supplierName(b))}${won ? ' 🏆' : ''}</b>
        <span>${r.coverage.complete ? 'all lines' : `${r.coverage.priced} of ${r.coverage.total} lines`}${b.notes ? ' · see note' : ''}</span>
      </td>
      <td class="num">${esc(r.lead)} d</td>
      <td>${esc(termsLabel(b.terms))}</td>
      <td class="num">${money(r.totals.delivery)}</td>
      <td class="num"><b>${money(r.totals.total)}</b></td>
      <td class="num">${delta}</td>
      <td class="num">${r.score == null ? '<span class="delta">not ranked</span>' : r.score}</td>
      ${canAward ? `<td><button class="btn" data-award="${esc(b.id)}">Award</button></td>` : ''}
    </tr>`;
  }).join('');

  const notes = ranked.filter(r => r.bid.notes).map(r =>
    `<p class="hint"><b>${esc(supplierName(r.bid))}:</b> ${esc(r.bid.notes)}</p>`).join('');

  return `<div class="card">
    <h2>Bids opened — ranked on landed cost</h2>
    <p>Landed cost is unit prices × quantities, plus delivery, minus any
       discount, plus ${Math.round(VAT_RATE * 100)}% VAT. Partial bids sit below
       the complete ones; they still compete line by line further down.</p>
    <div class="weight">
      <label for="w">Price ${Math.round(WEIGHT * 100)}% · speed ${Math.round((1 - WEIGHT) * 100)}%</label>
      <input id="w" type="range" min="50" max="100" step="5" value="${Math.round(WEIGHT * 100)}" />
    </div>
    <p class="hint swipe">Swipe the table sideways for every column →</p>
    <div class="scroll-x"><table class="cmp">
      <thead><tr>
        <th>#</th><th>Supplier</th><th class="num">Lead</th><th>Terms</th>
        <th class="num">Delivery</th><th class="num">Landed cost</th>
        <th class="num">vs best</th><th class="num">Score</th>${canAward ? '<th></th>' : ''}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${notes}
  </div>`;
}

function lineMatrixHtml(bids) {
  const head = bids.map(b => `<th class="num">${esc(supplierName(b))}</th>`).join('');
  const rows = T.items.map((item, i) => {
    const prices = bids.map(b => lineUnitPrice(b, i));
    const valid = prices.filter(p => p != null);
    const best = valid.length ? Math.min(...valid) : null;
    const cells = prices.map(p => p == null
      ? '<td class="num" style="color:var(--muted)">—</td>'
      : `<td class="num ${p === best ? 'best' : ''}">${money(p)}</td>`).join('');
    const m = materialOf(item.material);
    return `<tr>
      <td><b>${m.emoji} ${esc(m.en)}</b><div class="spec">${qtyText(item.qty)} ${esc(unitShort(item.unit))}</div></td>
      ${cells}
    </tr>`;
  }).join('');

  return `<div class="card">
    <h2>Line by line</h2>
    <p>Unit prices, cheapest in green. This is the view that tells you whether
       one supplier is genuinely cheaper or just cheaper on the big line.</p>
    <p class="hint swipe">Swipe the table sideways for every supplier →</p>
    <div class="scroll-x"><table>
      <thead><tr><th>Material</th>${head}</tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>`;
}

function splitHtml(bids) {
  const s = splitAward(T, bids);
  if (!s) return '';
  const picks = s.picks.map(p => {
    const m = materialOf(p.item.material);
    return `<tr>
      <td><b>${m.emoji} ${esc(m.en)}</b><div class="spec">${qtyText(p.item.qty)} ${esc(unitShort(p.item.unit))}</div></td>
      <td>${esc(supplierName(p.bid))}</td>
      <td class="num">${money(p.unitPrice)}</td>
      <td class="num">${money(p.lineTotal)}</td>
    </tr>`;
  }).join('');

  const verdict = s.savings == null
    ? '<p class="hint">No single supplier covered every line, so splitting the order is the only way to buy this request in full.</p>'
    : s.worthIt
      ? `<div class="save">Split the order and save ${money(s.savings)}</div>
         <p class="hint">Against ${money(s.singleBest)} from the cheapest single supplier —
            after paying ${esc(s.suppliers.length)} delivery charges (${money(s.delivery)} in total).
            Volume discounts quoted on the full package are not counted here.</p>`
      : `<div class="save thin">${s.savings > 0 ? `Splitting saves only ${money(s.savings)}` : `Splitting costs ${money(-s.savings)} more`}</div>
         <p class="hint">Not worth ${esc(s.suppliers.length)} separate deliveries to chase — award the whole request to the cheapest single supplier.</p>`;

  return `<div class="split">
    <h3>Split award — cheapest supplier per line</h3>
    ${verdict}
    <div class="scroll-x" style="margin-top:10px"><table>
      <thead><tr><th>Material</th><th>Buy from</th><th class="num">Unit</th><th class="num">Line total</th></tr></thead>
      <tbody>${picks}</tbody>
      <tfoot><tr>
        <td colspan="3"><b>Landed cost, split ${esc(s.suppliers.length)} ways</b></td>
        <td class="num"><b>${money(s.total)}</b></td>
      </tr></tfoot>
    </table></div>
  </div>`;
}

function awardedBanner(bids) {
  const won = bids.find(b => b.id === T.awardedBidId) ||
              MZ_BOARD.bids.find(b => b.id === T.awardedBidId);
  if (!won) return '';
  const tot = bidTotals(T, won);
  const wa = won.supplierPhone
    ? ` <a class="btn" style="margin-left:8px" href="https://wa.me/${esc(won.supplierPhone.replace(/[^0-9]/g, ''))}" target="_blank" rel="noopener">💬 Message them</a>`
    : '';
  return `<div class="awarded-note">
    🏆 <b>Awarded to ${esc(supplierName(won))}</b> — ${money(tot.total)} landed,
    delivery in ${esc(won.leadDays)} days, ${esc(termsLabel(won.terms))}.
    ${T.awardedAt ? `Awarded ${fmtDateTime(T.awardedAt)}.` : ''}${wa}
  </div>`;
}

// ---- the three screens ------------------------------------------------------

function renderAction() {
  const el = document.getElementById('action');
  const bids = activeBids(T);
  const mine = mzIsMine(T);

  if (isSealed(T)) {
    if (mine) {
      const n = mzSealedCount(T);
      el.innerHTML = `
        <div class="sealed">
          <div style="font-size:26px">🔒</div>
          <div class="big">${n} sealed bid${n === 1 ? '' : 's'}</div>
          <p>Prices stay hidden — from you too — until ${fmtDateTime(T.closesAt)}
             (${countdown(T.closesAt)}). Then every bid opens at once and this page
             becomes the comparison table. That is what keeps suppliers from
             shading each other's numbers.</p>
        </div>
        ${shareBlock(T)}`;
    } else {
      const my = mzMyBid(T.id);
      el.innerHTML = (my && !BID_DRAFT_SHOWN) ? myBidSummary(my) : bidFormHtml(my);
      if (my && !BID_DRAFT_SHOWN) {
        document.getElementById('revise').addEventListener('click', () => {
          BID_DRAFT_SHOWN = true;
          renderAction();
        });
      } else {
        wireBidForm(my);
      }
    }
    return;
  }

  // Closed: everything opens for everyone.
  if (!bids.length) {
    el.innerHTML = `<div class="empty">Bidding closed ${fmtDateTime(T.closesAt)} with no bids.
      ${mine ? 'Post it again with a longer window, or send the link to more suppliers.' : ''}</div>`;
    return;
  }

  // Both tables read left to right in the same order as the ranking, so the
  // columns line up with the rows above them.
  const ordered = scoreBids(T, bids, WEIGHT).map(r => r.bid);
  el.innerHTML =
    (T.awardedBidId ? awardedBanner(bids) : '') +
    comparisonHtml(bids) +
    (bids.length > 1 ? lineMatrixHtml(ordered) + splitHtml(bids) : '');

  // Dragging updates the label live; the table is rebuilt on release so the
  // slider does not lose the finger mid-drag on a phone.
  const w = document.getElementById('w');
  if (w) {
    const label = w.previousElementSibling;
    w.addEventListener('input', e => {
      const p = Number(e.target.value);
      label.textContent = `Price ${p}% \u00b7 speed ${100 - p}%`;
    });
    w.addEventListener('change', e => {
      WEIGHT = Number(e.target.value) / 100;
      renderAction();
      const el = document.getElementById('w');
      if (el) el.focus();
    });
  }

  el.querySelectorAll('[data-award]').forEach(btn => btn.addEventListener('click', async () => {
    const b = bids.find(x => x.id === btn.dataset.award);
    // Awarding a partial bid is allowed — sometimes one line is all you need —
    // but never by accident: say what it leaves unbought.
    const cov = bidCoverage(T, b);
    const gap = cov.complete ? '' :
      `\n\nThis bid covers only ${cov.priced} of ${cov.total} lines — the rest of the request stays unbought.`;
    if (!confirm(`Award this request to ${supplierName(b)} for ${money(bidTotals(T, b).total)}?${gap}\n\nThis is final and everyone bidding will see it.`)) return;
    btn.disabled = true;
    await mzAward(T.id, b.id);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
}

function renderPosted() {
  if (!JUST_POSTED || !mzIsMine(T)) return;
  document.getElementById('posted-panel').innerHTML = `<div class="awarded-note">
    ✅ <b>${esc(T.ref)} is live.</b> Send the link below to every supplier you
    would normally call. Their prices stay sealed until ${fmtDateTime(T.closesAt)}.
  </div>`;
}

function render() {
  LAST_SEALED = T ? isSealed(T) : null;
  if (!T) {
    document.getElementById('head').innerHTML =
      `<div class="empty">That request could not be found. It may have been posted on another device —
       requests only travel between devices once Supabase is set up.
       <br><br><a class="btn" href="index.html">← Back to the board</a></div>`;
    return;
  }
  document.title = `${T.ref} — ${T.title} · Munaqasa`;
  renderPosted();
  renderHead();
  renderItems();
  renderAction();
}

// Copy-link works from anywhere on the page.
document.addEventListener('click', e => {
  const btn = e.target.closest('#copy-link');
  if (!btn) return;
  navigator.clipboard.writeText(btn.dataset.url).then(() => {
    btn.textContent = '✓ Copied';
    setTimeout(() => { btn.textContent = '🔗 Copy link'; }, 1600);
  }).catch(() => { prompt('Copy this link:', btn.dataset.url); });
});

mzLoadBoard().then(() => {
  T = mzTender(TENDER_ID);
  render();
});

// A tender closing while the page is open should open its bids by itself. Only
// the crossing triggers a full re-render — otherwise just the header is
// refreshed, so a half-typed bid is never wiped by a countdown tick.
setInterval(() => {
  if (!T) return;
  if (isSealed(T) !== LAST_SEALED) render(); else renderHead();
}, 30000);
