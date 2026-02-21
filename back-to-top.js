/**
 * back-to-top.js
 * Robust back-to-top button that works on iOS Safari + Android.
 *
 * iOS Safari quirks handled:
 *  - scrollY may be 0 even when scrolled; use documentElement.scrollTop fallback
 *  - smooth scroll behavior needs a manual polyfill check
 *  - touch events used alongside click for reliability
 */
(function () {
  function getScrollY() {
    // iOS Safari sometimes reports window.scrollY as 0; documentElement is reliable
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function scrollToTop() {
    // Try native smooth scroll first; fall back to instant if not supported
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  function init() {
    const btn = document.createElement("button");
    btn.id = "backToTop";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "↑";
    document.body.appendChild(btn);

    function update() {
      btn.classList.toggle("visible", getScrollY() > 400);
    }

    // Scroll listener — passive for performance
    window.addEventListener("scroll", update, { passive: true });
    // iOS Safari also fires on document
    document.addEventListener("scroll", update, { passive: true });

    // Both click and touchend for iOS reliability
    btn.addEventListener("click", scrollToTop);
    btn.addEventListener("touchend", (e) => {
      e.preventDefault(); // prevent ghost click
      scrollToTop();
    });

    // Initial check in case page loads mid-scroll (e.g. back/forward cache)
    update();
    window.addEventListener("pageshow", update);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
