/* Martin's Auto Detailing — interactions */
(function () {
  "use strict";

  /* ---- Current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header state ---- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
  }

  /* ---- Scroll reveal (skip the hero, which animates on load) ---- */
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"))
    .filter(function (el) { return !el.closest(".hero"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---- Before / after slider ---- */
  var ba = document.getElementById("beforeAfter");
  if (ba) {
    var range = document.getElementById("baRange");
    var beforeWrap = document.getElementById("baBeforeWrap");
    var handle = document.getElementById("baHandle");
    var frame = ba.querySelector(".ba-frame");

    var setPos = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      beforeWrap.style.width = pct + "%";
      handle.style.left = pct + "%";
      if (range) range.value = pct;
    };

    if (range) range.addEventListener("input", function () { setPos(parseFloat(range.value)); });

    var dragging = false;
    var posFromEvent = function (clientX) {
      var rect = frame.getBoundingClientRect();
      setPos(((clientX - rect.left) / rect.width) * 100);
    };
    var start = function (e) {
      dragging = true;
      posFromEvent(e.touches ? e.touches[0].clientX : e.clientX);
    };
    var move = function (e) {
      if (!dragging) return;
      posFromEvent(e.touches ? e.touches[0].clientX : e.clientX);
    };
    var end = function () { dragging = false; };

    frame.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseup", end);
    frame.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);

    setPos(parseFloat(range ? range.value : 52));
  }

  /* ---- Quote form -> pre-filled text to Sandro ----
     Static-site friendly: no backend. Composes an SMS the visitor sends
     from their own phone. To switch to email or a form service later,
     see README.md (Formspree / mailto options). */
  var SANDRO_PHONE = "+15082023659";
  var form = document.getElementById("quoteForm");
  if (form) {
    var hint = document.getElementById("formHint");
    var markInvalid = function (el, bad) { el.classList.toggle("invalid", bad); };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var service = form.service.value;
      var msg = form.message.value.trim();

      var ok = true;
      markInvalid(form.name, !name); if (!name) ok = false;
      markInvalid(form.phone, !phone); if (!phone) ok = false;
      markInvalid(form.service, !service); if (!service) ok = false;
      if (!ok) {
        hint.textContent = "Please add your name, phone, and what you need.";
        hint.classList.remove("ok");
        return;
      }

      var body =
        "Hi Sandro, I'd like a quote.\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Service: " + service +
        (msg ? "\nDetails: " + msg : "");

      // Try to copy as a convenient fallback.
      if (navigator.clipboard) { navigator.clipboard.writeText(body).catch(function () {}); }

      window.location.href = "sms:" + SANDRO_PHONE + "?&body=" + encodeURIComponent(body);

      hint.innerHTML = 'Opening your messages app… if nothing happens, just call or text <a href="tel:' + SANDRO_PHONE + '">508-202-3659</a>.';
      hint.classList.add("ok");
    });

    ["name", "phone", "service"].forEach(function (n) {
      if (form[n]) form[n].addEventListener("input", function () { markInvalid(form[n], false); });
    });
  }
})();
