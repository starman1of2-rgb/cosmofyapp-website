(function () {
  "use strict";

  function setupViewer() {
    var dialog = document.querySelector("[data-sprite-lightbox]");
    var triggers = Array.prototype.slice.call(document.querySelectorAll(".sprite-trigger[data-sprite-index]"));
    if (!dialog || !triggers.length || typeof dialog.showModal !== "function") return;

    var cell = dialog.querySelector("[data-sprite-lightbox-cell]");
    var caption = dialog.querySelector("[data-sprite-caption]");
    var position = dialog.querySelector("[data-sprite-position]");
    var previous = dialog.querySelector("[data-sprite-prev]");
    var next = dialog.querySelector("[data-sprite-next]");
    var close = dialog.querySelector("[data-sprite-close]");
    var current = 0;
    var lastFocused = null;

    var items = triggers.map(function (trigger) {
      var figure = trigger.closest("figure");
      var figcaption = figure ? figure.querySelector("figcaption") : null;
      return {
        index: trigger.getAttribute("data-sprite-index"),
        caption: figcaption ? figcaption.textContent : ""
      };
    });

    function show(viewerIndex) {
      current = (viewerIndex + items.length) % items.length;
      cell.setAttribute("data-sprite-index", items[current].index);
      caption.textContent = items[current].caption;
      position.textContent = "Screenshot " + (current + 1) + " of " + items.length;
    }

    triggers.forEach(function (trigger, viewerIndex) {
      trigger.addEventListener("click", function () {
        lastFocused = trigger;
        show(viewerIndex);
        dialog.showModal();
        close.focus();
      });
    });

    previous.addEventListener("click", function () { show(current - 1); previous.focus(); });
    next.addEventListener("click", function () { show(current + 1); next.focus(); });
    close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1); }
      else if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1); }
    });
    dialog.addEventListener("close", function () { if (lastFocused) lastFocused.focus(); });
  }

  document.addEventListener("DOMContentLoaded", setupViewer);
})();
