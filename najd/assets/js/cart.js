/* =========================================================================
   QUOTE LIST ("cart") — the visitor collects items across the catalogue and
   sends them as one request for quotation. Stored in localStorage so the
   list survives a page change or a closed tab.
   ========================================================================= */
(function (w, d) {
  "use strict";
  var KEY = "najd.rfq", listeners = [];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
    listeners.forEach(function (fn) { fn(items); });
    paintFab(items);
  }
  function items() { return read(); }
  function count() { return read().reduce(function (n, i) { return n + (+i.qty || 1); }, 0); }
  function lines() { return read().length; }

  function add(id, qty) {
    var all = read(), hit = all.filter(function (i) { return i.id === id; })[0];
    if (hit) hit.qty = (+hit.qty || 1) + (qty || 1);
    else all.push({ id: id, qty: qty || 1 });
    write(all);
    return all;
  }
  function setQty(id, qty) {
    var all = read().map(function (i) { return i.id === id ? { id: id, qty: Math.max(1, Math.min(99999, qty || 1)) } : i; });
    write(all);
  }
  function remove(id) { write(read().filter(function (i) { return i.id !== id; })); }
  function clear() { write([]); }
  function has(id) { return read().some(function (i) { return i.id === id; }); }

  /** the item rows as plain text, for the quote request payload */
  function asText() {
    var byId = {};
    (w.DATA ? w.DATA.products : []).forEach(function (p) { byId[p.id] = p; });
    return read().map(function (i) {
      var p = byId[i.id];
      var name = p ? (w.I18N ? w.I18N.pick(p.t) : p.t.ar) : i.id;
      var unit = p ? (w.I18N ? w.I18N.pick(p.unit) : p.unit.ar) : "";
      return i.id + " — " + name + " × " + i.qty + " " + unit;
    }).join("\n");
  }

  function paintFab(list) {
    var fab = d.querySelector(".cart-fab");
    if (!fab) return;
    var n = (list || read()).length;
    fab.hidden = n === 0;
    var badge = fab.querySelector(".cc");
    if (badge) badge.textContent = n;
  }

  function onChange(fn) { listeners.push(fn); }

  w.CART = { items: items, add: add, setQty: setQty, remove: remove, clear: clear,
             has: has, count: count, lines: lines, asText: asText, onChange: onChange, paintFab: paintFab };

  d.addEventListener("DOMContentLoaded", function () { paintFab(); });
})(window, document);
