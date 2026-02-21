/**
 * back-to-top.js
 * Robust back-to-top button — works on iOS Safari + Android.
 * Uses Lucide arrow-up SVG (via icons.js) instead of ↑ character.
 */
(function () {
  function getScrollY() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function scrollToTop() {
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
    // Use icons.js if available, otherwise fallback to SVG inline
    if (window.Icons) {
      btn.innerHTML = window.Icons.svg("arrow-up", { size: 20 });
    } else {
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>`;
    }
    document.body.appendChild(btn);

    function update() {
      const show = getScrollY() > 400;
      btn.classList.toggle("btt-visible", show);
    }

    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true });

    btn.addEventListener("click", scrollToTop);
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      scrollToTop();
    });

    update();
    window.addEventListener("pageshow", update);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
