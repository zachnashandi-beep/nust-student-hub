/**
 * back-to-top.js
 * A small button that appears after scrolling 400px down.
 * Smooth scrolls back to top on click.
 * Injected dynamically — no HTML changes needed per page.
 */
(function () {
  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.createElement("button");
    btn.id = "backToTop";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "↑";
    document.body.appendChild(btn);

    const THRESHOLD = 400;

    function update() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      btn.classList.toggle("btt-visible", y > THRESHOLD);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
})();
