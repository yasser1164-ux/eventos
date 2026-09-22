/* =========================================================================
   DATA LAYER — one API for the whole site, two possible backends.

   • Supabase (live)  — when config.data.supabaseUrl/AnonKey are filled in and
     supabase/schema.sql has been run. Real multi-user marketplace.
   • Local (default)  — the bundled SEED plus anything this browser adds,
     kept in localStorage. Everything works end to end offline: post a part,
     it shows up in search; post a request, sellers can quote it.

   Pages never talk to a backend directly — they call DB.*.
   ========================================================================= */
window.DB = (function () {
  "use strict";

  var CFG   = window.QETAA,
      KEY   = "qetaa.store.v1",
      live  = null,          /* null = not decided yet, true/false after probe */
      cache = {};

  /* ---- local storage ---------------------------------------------------- */
  function blank() {
    return { listings: [], requests: [], quotes: [], favs: [], leads: [], me: null, seq: 1 };
  }
  function store() {
    if (cache.store) return cache.store;
    try { cache.store = JSON.parse(localStorage.getItem(KEY)) || blank(); }
    catch (e) { cache.store = blank(); }
    var b = blank(), k;
    for (k in b) if (!(k in cache.store)) cache.store[k] = b[k];
    return cache.store;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(store())); } catch (e) {}
  }
  function nextId(prefix) {
    var s = store(); s.seq = (s.seq || 1) + 1; save();
    return prefix + "-" + Date.now().toString(36) + s.seq;
  }

  /* ---- supabase --------------------------------------------------------- */
  function sbReady() {
    return !!(CFG.data.supabaseUrl && CFG.data.supabaseAnonKey && CFG.data.mode !== "local");
  }
  function sb(path, opts) {
    opts = opts || {};
    var url = CFG.data.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + path;
    return fetch(url, {
      method: opts.method || "GET",
      headers: {
        apikey: CFG.data.supabaseAnonKey,
        Authorization: "Bearer " + CFG.data.supabaseAnonKey,
        "Content-Type": "application/json",
        Prefer: opts.prefer || "return=representation"
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error("supabase " + r.status);
      return r.status === 204 ? null : r.json();
    });
  }
  /* one probe per page load decides which backend the page uses */
  function probe() {
    if (live !== null) return Promise.resolve(live);
    if (!sbReady()) { live = false; return Promise.resolve(false); }
    return sb("qetaa_listings?select=id&limit=1")
      .then(function () { live = true; return true; })
      .catch(function () {
        if (CFG.data.mode === "supabase") throw new Error("Supabase unreachable");
        live = false; return false;
      });
  }

  /* ---- decoration ------------------------------------------------------- */
  function lang() { return (document.documentElement.lang === "en") ? "en" : "ar"; }

  function sellerMap() {
    if (cache.sellers) return cache.sellers;
    var m = {}, list = SEED.sellers.concat(store().sellers || []), i;
    for (i = 0; i < list.length; i++) m[list[i].id] = list[i];
    cache.sellers = m;
    return m;
  }

  /* labels depend on the active language, so a decorated row remembers which
     language it was built for and rebuilds when the visitor switches */
  function decorate(l) {
    var L = lang(), yr;
    if (!l || l.__lang === L) return l;
    l.seller = sellerMap()[l.seller_id] || {
      id: l.seller_id, name: "بائع", type: "person", city: l.city, rating: 0, reviews_count: 0
    };
    l.car_label = VEHICLES.title(l.make, l.model, "", L).trim();
    yr = (l.year_from && l.year_to && l.year_from !== l.year_to)
      ? l.year_from + "–" + l.year_to : (l.year_from || l.year_to || "");
    l.fits = (l.car_label + " " + yr).trim();
    l.condition_obj = TAX.find(TAX.conditions, l.condition) || TAX.conditions[1];
    l.city_label = TAX.label(TAX.cities, l.city, L);
    l.origin_label = TAX.label(TAX.origins, l.origin, L);
    l.photos = l.photos || [];
    l.__lang = L;
    return l;
  }

  function matches(l, f) {
    var q = (f.q || "").trim().toLowerCase(), hay;
    if (q) {
      hay = [l.part_name, l.notes, l.oem, l.ref, l.fits,
             VEHICLES.title(l.make, l.model, "", "ar"),
             VEHICLES.title(l.make, l.model, "", "en")].join(" ").toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    if (f.make && l.make !== f.make) return false;
    if (f.model && l.model !== f.model) return false;
    if (f.year) {
      var y = +f.year;
      if (l.year_from && y < l.year_from) return false;
      if (l.year_to && y > l.year_to) return false;
    }
    if (f.category && l.category !== f.category) return false;
    if (f.city && l.city !== f.city) return false;
    if (f.condition && f.condition.length && f.condition.indexOf(l.condition) === -1) return false;
    if (f.origin && f.origin.length && f.origin.indexOf(l.origin) === -1) return false;
    if (f.sellerType && f.sellerType.length &&
        f.sellerType.indexOf((l.seller && l.seller.type) || "") === -1) return false;
    if (f.delivery && f.delivery.length) {
      var ok = false, i;
      for (i = 0; i < f.delivery.length; i++)
        if ((l.delivery || []).indexOf(f.delivery[i]) > -1) ok = true;
      if (!ok) return false;
    }
    if (f.warranty && !(l.warranty_days > 0)) return false;
    if (f.verified && !(l.seller && l.seller.verified)) return false;
    if (f.priceMin && l.price < +f.priceMin) return false;
    if (f.priceMax && l.price > +f.priceMax) return false;
    return true;
  }

  function sortBy(list, sort) {
    var c = {
      newest:  function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); },
      cheap:   function (a, b) { return a.price - b.price; },
      dear:    function (a, b) { return b.price - a.price; },
      rating:  function (a, b) { return (b.seller.rating || 0) - (a.seller.rating || 0); },
      popular: function (a, b) { return (b.views || 0) - (a.views || 0); }
    };
    /* featured listings always float to the top of the first page — this is
       what the boost fee in pricing.html actually buys */
    return list.sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return (c[sort] || c.newest)(a, b);
    });
  }

  /* ---- public API ------------------------------------------------------- */
  var API = {

    isLive: function () { return live === true; },
    mode: function () { return live === true ? "supabase" : "local"; },

    /* --- listings -------------------------------------------------------- */
    listings: function (filters) {
      var f = filters || {};
      return probe().then(function (isLive) {
        if (isLive) {
          return sb("qetaa_listings?select=*&status=eq.published&order=created_at.desc&limit=500")
            .then(function (rows) { return rows; })
            .catch(function () { return SEED.listings.slice(); });
        }
        return SEED.listings.concat(store().listings);
      }).then(function (rows) {
        var out = rows.map(decorate).filter(function (l) { return matches(l, f); });
        out = sortBy(out, f.sort);
        return { total: out.length, items: f.limit ? out.slice(0, f.limit) : out };
      });
    },

    listing: function (id) {
      return this.listings({}).then(function (r) {
        var i; for (i = 0; i < r.items.length; i++) if (r.items[i].id === id || r.items[i].ref === id) return r.items[i];
        return null;
      });
    },

    similar: function (l, n) {
      return this.listings({ category: l.category }).then(function (r) {
        return r.items.filter(function (x) { return x.id !== l.id; })
          .sort(function (a, b) { return (b.make === l.make ? 1 : 0) - (a.make === l.make ? 1 : 0); })
          .slice(0, n || 4);
      });
    },

    addListing: function (data) {
      var row = {
        id: nextId("l"), ref: "QT-" + (2000 + Math.floor(Math.random() * 7999)),
        status: "published", featured: false, views: 0,
        created_at: new Date().toISOString().slice(0, 10)
      }, k;
      for (k in data) row[k] = data[k];
      return probe().then(function (isLive) {
        if (isLive) return sb("qetaa_listings", { method: "POST", body: [row] }).then(function () { return row; });
        var s = store(); s.listings.unshift(row); save(); return row;
      });
    },

    /* --- sellers --------------------------------------------------------- */
    sellers: function (filters) {
      var f = filters || {};
      return probe().then(function (isLive) {
        if (isLive) return sb("qetaa_sellers?select=*&order=rating.desc").catch(function () { return SEED.sellers; });
        return SEED.sellers.concat(store().sellers || []);
      }).then(function (rows) {
        var L = lang();
        return rows.filter(function (s) {
          if (f.city && s.city !== f.city) return false;
          if (f.type && s.type !== f.type) return false;
          if (f.make && (s.makes || []).indexOf(f.make) === -1) return false;
          if (f.q) {
            var hay = (s.name + " " + (s.name_en || "") + " " + (s.district || "")).toLowerCase();
            if (hay.indexOf(f.q.toLowerCase()) === -1) return false;
          }
          return true;
        }).map(function (s) {
          s.city_label = TAX.label(TAX.cities, s.city, L);
          s.type_label = TAX.label(TAX.sellerTypes, s.type, L);
          return s;
        });
      });
    },

    addSeller: function (seller) {
      var st = store(), i;
      st.sellers = st.sellers || [];
      for (i = 0; i < st.sellers.length; i++) if (st.sellers[i].id === seller.id) { st.sellers[i] = seller; save(); cache.sellers = null; return seller; }
      st.sellers.push(seller); save(); cache.sellers = null;
      return seller;
    },

    seller: function (idOrSlug) {
      return this.sellers({}).then(function (rows) {
        var i; for (i = 0; i < rows.length; i++)
          if (rows[i].id === idOrSlug || rows[i].slug === idOrSlug) return rows[i];
        return null;
      });
    },

    sellerListings: function (sellerId) {
      return this.listings({}).then(function (r) {
        return r.items.filter(function (l) { return l.seller_id === sellerId; });
      });
    },

    reviews: function (sellerId) {
      return Promise.resolve(SEED.reviews.filter(function (v) { return v.seller_id === sellerId; }));
    },

    /* --- requests (RFQ) --------------------------------------------------- */
    requests: function (filters) {
      var f = filters || {};
      return probe().then(function (isLive) {
        if (isLive) return sb("qetaa_requests?select=*&status=eq.open&order=created_at.desc&limit=300")
          .catch(function () { return SEED.requests; });
        return store().requests.concat(SEED.requests);
      }).then(function (rows) {
        var L = lang();
        return rows.filter(function (r) {
          if (f.city && r.city !== f.city) return false;
          if (f.make && r.make !== f.make) return false;
          if (f.category && r.category !== f.category) return false;
          if (f.mine && !(store().me && r.owner === store().me.id)) return false;
          if (f.q) {
            var hay = (r.part_name + " " + r.notes + " " + r.ref + " " +
                       VEHICLES.title(r.make, r.model, r.year, "ar")).toLowerCase();
            if (hay.indexOf(f.q.toLowerCase()) === -1) return false;
          }
          return true;
        }).map(function (r) {
          r.car_label = VEHICLES.title(r.make, r.model, r.year, L);
          r.city_label = TAX.label(TAX.cities, r.city, L);
          r.urgency_obj = TAX.find(TAX.urgency, r.urgency) || TAX.urgency[1];
          return r;
        });
      });
    },

    request: function (id) {
      return this.requests({}).then(function (rows) {
        var i; for (i = 0; i < rows.length; i++) if (rows[i].id === id || rows[i].ref === id) return rows[i];
        return null;
      });
    },

    addRequest: function (data) {
      var me = store().me,
          row = {
            id: nextId("r"), ref: "RQ-" + (600 + Math.floor(Math.random() * 399)),
            status: "open", quotes_count: 0, owner: me ? me.id : null,
            created_at: new Date().toISOString().slice(0, 10)
          }, k;
      for (k in data) row[k] = data[k];
      return probe().then(function (isLive) {
        if (isLive) return sb("qetaa_requests", { method: "POST", body: [row] }).then(function () { return row; });
        var s = store(); s.requests.unshift(row); save(); return row;
      });
    },

    /* --- quotes ----------------------------------------------------------- */
    quotes: function (requestId) {
      return probe().then(function (isLive) {
        if (isLive) return sb("qetaa_quotes?select=*&request_id=eq." + encodeURIComponent(requestId))
          .catch(function () { return SEED.quotes; });
        return SEED.quotes.concat(store().quotes);
      }).then(function (rows) {
        var map = sellerMap();
        return rows.filter(function (q) { return q.request_id === requestId; })
          .map(function (q) { q.seller = map[q.seller_id] || { name: q.seller_name || "بائع", rating: 0 }; return q; })
          .sort(function (a, b) { return a.price - b.price; });
      });
    },

    addQuote: function (data) {
      var row = { id: nextId("q"), created_at: new Date().toISOString().slice(0, 10) }, k;
      for (k in data) row[k] = data[k];
      return probe().then(function (isLive) {
        if (isLive) return sb("qetaa_quotes", { method: "POST", body: [row] }).then(function () { return row; });
        var s = store(); s.quotes.unshift(row); save(); return row;
      });
    },

    /* --- favourites ------------------------------------------------------- */
    favs: function () { return store().favs.slice(); },
    isFav: function (id) { return store().favs.indexOf(id) > -1; },
    toggleFav: function (id) {
      var s = store(), i = s.favs.indexOf(id);
      if (i > -1) s.favs.splice(i, 1); else s.favs.push(id);
      save();
      return i === -1;
    },
    favListings: function () {
      var favs = this.favs();
      return this.listings({}).then(function (r) {
        return r.items.filter(function (l) { return favs.indexOf(l.id) > -1; });
      });
    },

    /* --- leads: every contact tap is the product's real metric ------------ */
    lead: function (kind, listingOrReq) {
      var row = {
        id: nextId("lead"), kind: kind,
        listing_id: listingOrReq && listingOrReq.id,
        seller_id: listingOrReq && (listingOrReq.seller_id || null),
        at: new Date().toISOString()
      };
      var s = store(); s.leads.push(row); save();
      if (sbReady() && live) sb("qetaa_leads", { method: "POST", prefer: "return=minimal", body: [row] }).catch(function () {});
      return row;
    },
    leads: function () { return store().leads.slice(); },

    /* --- who is using this browser (demo account) ------------------------- */
    me: function () { return store().me; },
    signIn: function (profile) {
      var s = store();
      s.me = {
        id: (s.me && s.me.id) || nextId("u"),
        name: profile.name, phone: profile.phone,
        role: profile.role || "buyer", seller_id: profile.seller_id || null,
        city: profile.city || "", at: new Date().toISOString()
      };
      save(); return s.me;
    },
    signOut: function () { var s = store(); s.me = null; save(); },
    myListings: function () {
      var me = store().me;
      if (!me) return Promise.resolve([]);
      return this.listings({}).then(function (r) {
        return r.items.filter(function (l) {
          return l.owner === me.id || (me.seller_id && l.seller_id === me.seller_id);
        });
      });
    },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} cache = {}; }
  };

  return API;
})();
