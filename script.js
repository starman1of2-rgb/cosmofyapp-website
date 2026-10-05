/**
 * Cosmofy website script.
 *
 * Minimal, dependency-free enhancement layer. All core content and
 * navigation works without JavaScript, with a truthful static fallback
 * for anything price/date-sensitive; this file only adds:
 *  - accessible mobile menu behavior
 *  - config-driven contact/status/Play Store links
 *  - date-aware launch-sale pricing text (Pacific Time)
 *  - footer year
 */
(function () {
  "use strict";

  function setupMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-primary-nav]");
    if (!toggle || !nav) return;

    function closeNav(returnFocus) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    }

    function openNav() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      if (isOpen) {
        closeNav(false);
      } else {
        openNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav(true);
      }
    });

    nav.addEventListener("click", function (event) {
      var target = event.target;
      if (target && target.tagName === "A") {
        closeNav(false);
      }
    });
  }

  function applyConfig() {
    if (typeof COSMOFY_CONFIG === "undefined") return;

    var contactLinks = document.querySelectorAll("[data-contact-email]");
    contactLinks.forEach(function (el) {
      el.setAttribute("href", "mailto:" + COSMOFY_CONFIG.contactEmail);
      if (el.hasAttribute("data-fill-text")) {
        el.textContent = COSMOFY_CONFIG.contactEmail;
      }
    });

    var supportLinks = document.querySelectorAll("[data-support-email]");
    supportLinks.forEach(function (el) {
      el.setAttribute("href", "mailto:" + COSMOFY_CONFIG.supportEmail);
      if (el.hasAttribute("data-fill-text")) {
        el.textContent = COSMOFY_CONFIG.supportEmail;
      }
    });

    var betaStatusEls = document.querySelectorAll("[data-beta-status]");
    betaStatusEls.forEach(function (el) {
      el.textContent = COSMOFY_CONFIG.betaStatus;
    });

    var facebookLinks = document.querySelectorAll("[data-facebook-link]");
    facebookLinks.forEach(function (el) {
      if (COSMOFY_CONFIG.facebookGroupUrl) {
        el.setAttribute("href", COSMOFY_CONFIG.facebookGroupUrl);
      }
    });

    var playStoreLinks = document.querySelectorAll("[data-play-store-link]");
    playStoreLinks.forEach(function (el) {
      if (COSMOFY_CONFIG.playStoreUrl) {
        el.setAttribute("href", COSMOFY_CONFIG.playStoreUrl);
        el.hidden = false;
      }
    });
  }

  var LONG_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function formatLongDate(isoDate) {
    var parts = isoDate.split("-");
    var month = LONG_MONTHS[parseInt(parts[1], 10) - 1];
    var day = parseInt(parts[2], 10);
    return month + " " + day + ", " + parts[0];
  }

  function formatShortDate(isoDate) {
    var parts = isoDate.split("-");
    var month = LONG_MONTHS[parseInt(parts[1], 10) - 1];
    var day = parseInt(parts[2], 10);
    return month + " " + day;
  }

  // Dates in COSMOFY_CONFIG.pricing are calendar days in Pacific Time, so the
  // phase comparison must also read "now" in Pacific Time rather than the
  // visitor's local timezone — otherwise a visitor east of California could
  // see the sale flip a day early/late relative to the published window.
  function getPacificDateString(date) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function getSalePhase(pricing) {
    var today = getPacificDateString(new Date());
    if (today < pricing.saleStartDate) return "before";
    if (today > pricing.saleEndDate) return "after";
    return "during";
  }

  function pricingSentence(phase, pricing) {
    var startShort = formatShortDate(pricing.saleStartDate);
    var endLong = formatLongDate(pricing.saleEndDate);

    if (phase === "before") {
      return (
        "Cosmofy is " + pricing.regularPrice + ", one time, no subscription. " +
        "The " + pricing.saleName + " drops the price to " + pricing.salePrice +
        " starting " + startShort + " and runs through " + endLong +
        " (Pacific Time, United States)."
      );
    }
    if (phase === "during") {
      return (
        "The " + pricing.saleName + " is on now: " + pricing.salePrice +
        " — save " + pricing.savingsAmount + " (about " + pricing.savingsPercent +
        ") off the regular " + pricing.regularPrice + " — through " + endLong +
        " (Pacific Time, United States). One-time purchase, no subscription."
      );
    }
    return (
      "Cosmofy is " + pricing.regularPrice + ", one time, no subscription. " +
      "No recurring fees, ever."
    );
  }

  function applyPricing() {
    if (typeof COSMOFY_CONFIG === "undefined" || !COSMOFY_CONFIG.pricing) return;
    var pricing = COSMOFY_CONFIG.pricing;
    var phase = getSalePhase(pricing);
    var sentence = pricingSentence(phase, pricing);
    var startShort = formatShortDate(pricing.saleStartDate);

    var sentenceEls = document.querySelectorAll("[data-pricing-sentence]");
    sentenceEls.forEach(function (el) {
      el.textContent = sentence;
    });

    var panels = document.querySelectorAll("[data-pricing-panel]");
    panels.forEach(function (panel) {
      panel.setAttribute("data-phase", phase);

      var regularEl = panel.querySelector("[data-pricing-regular]");
      var saleEl = panel.querySelector("[data-pricing-sale]");
      var savingsEl = panel.querySelector("[data-pricing-savings]");
      var badgeEl = panel.querySelector("[data-pricing-badge]");
      var noteEl = panel.querySelector("[data-pricing-note]");

      if (regularEl) {
        regularEl.textContent = pricing.regularPrice;
        regularEl.classList.toggle("is-secondary", phase !== "after");
        regularEl.classList.toggle("is-struck", phase === "during");
      }
      if (noteEl) noteEl.textContent = sentence;
      if (savingsEl) {
        savingsEl.textContent = "Save " + pricing.savingsAmount + " — about " + pricing.savingsPercent;
      }

      if (phase === "before") {
        if (saleEl) {
          saleEl.textContent = pricing.salePrice + " starting " + startShort;
          saleEl.hidden = false;
        }
        if (savingsEl) savingsEl.hidden = false;
        if (badgeEl) {
          badgeEl.textContent = "Launch sale begins " + startShort;
          badgeEl.hidden = false;
        }
      } else if (phase === "during") {
        if (saleEl) {
          saleEl.textContent = pricing.salePrice;
          saleEl.hidden = false;
        }
        if (savingsEl) savingsEl.hidden = false;
        if (badgeEl) {
          badgeEl.textContent = "Launch sale now";
          badgeEl.hidden = false;
        }
      } else {
        if (saleEl) saleEl.hidden = true;
        if (savingsEl) savingsEl.hidden = true;
        if (badgeEl) badgeEl.hidden = true;
      }
    });
  }

  function setFooterYear() {
    var yearEls = document.querySelectorAll("[data-current-year]");
    var year = String(new Date().getFullYear());
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  function setupLightbox() {
    var dialog = document.querySelector("[data-lightbox]");
    var triggers = Array.prototype.slice.call(
      document.querySelectorAll("[data-lightbox-trigger]")
    );
    if (!dialog || !triggers.length || typeof dialog.showModal !== "function") {
      return;
    }

    var imageEl = dialog.querySelector("[data-lightbox-image]");
    var captionEl = dialog.querySelector("[data-lightbox-caption]");
    var positionEl = dialog.querySelector("[data-lightbox-position]");
    var prevBtn = dialog.querySelector("[data-lightbox-prev]");
    var nextBtn = dialog.querySelector("[data-lightbox-next]");
    var closeBtn = dialog.querySelector("[data-lightbox-close]");

    var items = triggers.map(function (trigger) {
      var img = trigger.querySelector("img");
      var figure = trigger.closest("figure");
      var caption = figure ? figure.querySelector("figcaption") : null;
      return {
        trigger: trigger,
        src: trigger.getAttribute("href"),
        alt: img ? img.getAttribute("alt") : "",
        caption: caption ? caption.textContent : ""
      };
    });

    var currentIndex = 0;
    var lastFocused = null;

    function show(index) {
      currentIndex = (index + items.length) % items.length;
      var item = items[currentIndex];
      imageEl.src = item.src;
      imageEl.alt = item.alt;
      captionEl.textContent = item.caption;
      positionEl.textContent =
        "Screenshot " + (currentIndex + 1) + " of " + items.length;
    }

    function openAt(index, opener) {
      lastFocused = opener || document.activeElement;
      show(index);
      dialog.showModal();
      closeBtn.focus();
    }

    function close() {
      if (dialog.open) dialog.close();
    }

    function getFocusable() {
      return Array.prototype.slice.call(dialog.querySelectorAll("button"));
    }

    function trapFocus(event) {
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openAt(index, trigger);
      });
    });

    prevBtn.addEventListener("click", function () {
      show(currentIndex - 1);
      prevBtn.focus();
    });

    nextBtn.addEventListener("click", function () {
      show(currentIndex + 1);
      nextBtn.focus();
    });

    closeBtn.addEventListener("click", close);

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) close();
    });

    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(currentIndex + 1);
      } else if (event.key === "Tab") {
        trapFocus(event);
      }
    });

    dialog.addEventListener("close", function () {
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();
    applyConfig();
    applyPricing();
    setFooterYear();
    setupLightbox();
  });
})();
