/**
 * back-to-top.js
 * Injects a back-to-top button that appears after scrolling 400px.
 * Works on all pages automatically.
 */
(function () {
  function init() {
    const btn = document.createElement("button");
    btn.id = "backToTop";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "↑";
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle("visible", window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
