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

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();
    applyConfig();
    setFooterYear();
  });
})();
