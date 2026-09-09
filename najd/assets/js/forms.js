/* =========================================================================
   FORMS — validation + delivery.
   Delivery mode comes from SITE.forms.mode in config.js:
     local     → stored in the browser and turned into a ready-to-send email
                 (the default, so every form on the site works from day one)
     formspree → POST to your Formspree endpoint
     supabase  → INSERT into a Supabase table via its REST API
   Whatever the mode, the visitor always gets a reference number.
   ========================================================================= */
(function (w, d) {
  "use strict";

  var CFG = (w.SITE && w.SITE.forms) || { mode: "local" },
      ARCHIVE = "najd.submissions";

  var RE = {
    email: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
    phone: /^[+()\d\s-]{8,20}$/
  };

  function ref() {
    var dt = new Date(),
        p = function (n) { return String(n).padStart(2, "0"); },
        rnd = Math.floor(1000 + Math.random() * 9000);
    return "NJD-" + String(dt.getFullYear()).slice(2) + p(dt.getMonth() + 1) + p(dt.getDate()) + "-" + rnd;
  }

  function fieldOf(input) { return input.closest(".field") || input.parentElement; }

  function setError(input, msg) {
    var f = fieldOf(input);
    f.classList.add("has-error");
    var e = f.querySelector(".err-msg");
    if (e) e.textContent = msg;
    input.setAttribute("aria-invalid", "true");
  }
  function clearError(input) {
    var f = fieldOf(input);
    f.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
  }

  function msg(key, ar) { return w.I18N ? w.I18N.t(key, ar) : ar; }

  function validate(form) {
    var ok = true, first = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === "submit" || el.disabled) return;
      clearError(el);
      var val = (el.type === "checkbox") ? el.checked : String(el.value || "").trim();

      if (el.required && (!val || val === "")) {
        setError(el, msg("form.err.required", "هذا الحقل مطلوب"));
        ok = false; first = first || el; return;
      }
      if (!val) return;
      if (el.type === "email" && !RE.email.test(val)) {
        setError(el, msg("form.err.email", "صيغة البريد الإلكتروني غير صحيحة"));
        ok = false; first = first || el; return;
      }
      if (el.type === "tel" && !RE.phone.test(val)) {
        setError(el, msg("form.err.phone", "صيغة رقم الجوال غير صحيحة"));
        ok = false; first = first || el; return;
      }
      if (el.dataset.min && val.length < +el.dataset.min) {
        setError(el, msg("form.err.short", "النص قصير جدًا"));
        ok = false; first = first || el;
      }
    });
    if (first) { first.focus(); first.scrollIntoView({ block: "center", behavior: "smooth" }); }
    return ok;
  }

  function collect(form) {
    var out = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === "submit") return;
      out[el.name] = el.type === "checkbox" ? (el.checked ? "yes" : "no") : el.value;
    });
    return out;
  }

  function archive(entry) {
    try {
      var all = JSON.parse(localStorage.getItem(ARCHIVE) || "[]");
      all.unshift(entry);
      localStorage.setItem(ARCHIVE, JSON.stringify(all.slice(0, 60)));
    } catch (e) {}
  }

  function asText(payload) {
    return Object.keys(payload).map(function (k) {
      return k + ": " + payload[k];
    }).join("\n");
  }

  function mailtoLink(subject, payload) {
    var to = (w.SITE && (w.SITE.salesEmail || w.SITE.email)) || "";
    return "mailto:" + to + "?subject=" + encodeURIComponent(subject) +
           "&body=" + encodeURIComponent(asText(payload));
  }

  function send(payload) {
    if (CFG.mode === "formspree" && CFG.formspreeEndpoint) {
      return fetch(CFG.formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { if (!r.ok) throw new Error("formspree " + r.status); return true; });
    }
    if (CFG.mode === "supabase" && CFG.supabaseUrl && CFG.supabaseAnonKey) {
      return fetch(CFG.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + (CFG.supabaseTable || "inquiries"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: CFG.supabaseAnonKey,
          Authorization: "Bearer " + CFG.supabaseAnonKey,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          reference: payload.reference, kind: payload.kind,
          name: payload.name || payload.contact_name || "", email: payload.email || "",
          phone: payload.phone || "", company: payload.company || "",
          payload: payload, created_at: new Date().toISOString()
        })
      }).then(function (r) { if (!r.ok) throw new Error("supabase " + r.status); return true; });
    }
    /* local mode — nothing to call, the archive + email link is the delivery */
    return Promise.resolve(false);
  }

  function status(form, kind, html) {
    var box = form.querySelector(".form-status");
    if (!box) return;
    box.className = "form-status is-on " + kind;
    var icon = kind === "ok"
      ? '<svg viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="m8 12.5 2.6 2.6L16 9.6"/></svg>'
      : '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7.5v6M12 16.4v.2"/></svg>';
    box.innerHTML = icon + "<div>" + html + "</div>";
    box.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  /**
   * Wire a form up.
   * @param {HTMLFormElement} form
   * @param {Object} opts  {kind, subject, extra(): Object, onDone(payload)}
   */
  function handle(form, opts) {
    if (!form) return;
    opts = opts || {};
    form.setAttribute("novalidate", "novalidate");

    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      el.addEventListener("input", function () { clearError(el); });
      el.addEventListener("change", function () { clearError(el); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector("[name=company_website]") && form.querySelector("[name=company_website]").value) return; // honeypot
      if (!validate(form)) {
        status(form, "bad", "<b>" + msg("form.checkTitle", "راجع الحقول المميزة") + "</b>" +
                            msg("form.checkBody", "بعض الحقول المطلوبة ناقصة أو غير صحيحة."));
        return;
      }

      var btn = form.querySelector("[type=submit]"),
          label = btn ? btn.innerHTML : "",
          payload = collect(form);

      delete payload.company_website;
      payload.reference = ref();
      payload.kind = opts.kind || "inquiry";
      payload.lang = w.I18N ? w.I18N.lang : "ar";
      payload.page = location.pathname.split("/").pop();
      payload.submitted_at = new Date().toISOString();
      if (typeof opts.extra === "function") {
        var ex = opts.extra() || {};
        Object.keys(ex).forEach(function (k) { payload[k] = ex[k]; });
      }

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span>' + msg("form.sending", "جارٍ الإرسال…");
      }

      send(payload)
        .then(function (delivered) {
          archive(payload);
          var subject = (opts.subject || msg("form.subject", "طلب من الموقع")) + " — " + payload.reference;
          var body = "<b>" + msg("form.okTitle", "تم استلام طلبك") + "</b>" +
                     msg("form.okBody", "سنتواصل معك خلال يوم عمل واحد. رقم المرجع:") +
                     " <strong dir=\"ltr\">" + payload.reference + "</strong>";
          if (!delivered) {
            body += '<div style="margin-top:10px"><a class="btn btn-sm btn-primary" href="' +
                    mailtoLink(subject, payload) + '">' +
                    msg("form.mailBtn", "إرسال نسخة بالبريد") + "</a></div>";
          }
          status(form, "ok", body);
          form.reset();
          if (typeof opts.onDone === "function") opts.onDone(payload);
        })
        .catch(function () {
          archive(payload);
          status(form, "bad", "<b>" + msg("form.failTitle", "تعذّر الإرسال الآن") + "</b>" +
            msg("form.failBody", "يمكنك مراسلتنا مباشرة أو المحاولة لاحقًا.") +
            ' <a href="' + mailtoLink(opts.subject || "طلب", payload) + '"><strong>' +
            ((w.SITE && w.SITE.salesEmail) || "") + "</strong></a>");
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
        });
    });
  }

  w.FORMS = { handle: handle, ref: ref, validate: validate };
})(window, document);
