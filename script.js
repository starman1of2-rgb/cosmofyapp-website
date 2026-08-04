/**
 * Cosmofy website script.
 *
 * Minimal, dependency-free enhancement layer. All core content and
 * navigation works without JavaScript; this file only adds:
 *  - accessible mobile menu behavior
 *  - config-driven contact/beta links
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

    var betaButtons = document.querySelectorAll("[data-beta-cta]");
    betaButtons.forEach(function (btn) {
      if (COSMOFY_CONFIG.betaFormUrl) {
        btn.setAttribute("href", COSMOFY_CONFIG.betaFormUrl);
        btn.removeAttribute("data-mailto-fallback");
      } else {
        btn.setAttribute("href", "mailto:" + COSMOFY_CONFIG.contactEmail);
      }
    });

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

    var playStoreLinks = document.querySelectorAll("[data-play-store-link]");
    playStoreLinks.forEach(function (el) {
      if (COSMOFY_CONFIG.playStoreUrl) {
        el.setAttribute("href", COSMOFY_CONFIG.playStoreUrl);
        el.hidden = false;
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
    setFooterYear();
    setupLightbox();
  });
})();
