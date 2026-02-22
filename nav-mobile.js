/**
 * nav-mobile.js
 * Hamburger menu for mobile viewports.
 *
 * Fixes:
 *  - No body scroll lock (was breaking back-to-top scroll detection on iOS)
 *  - Backdrop has no blur (was causing scroll jank when menu open)
 *  - Glass effect is on the nav drawer only (GPU-composited, smooth)
 *  - Closes on outside click, Escape, and nav link tap
 *  - Works with nav-auth.js dynamic items
 */
(function () {
  const BREAKPOINT = 768;

  function isMobile() {
    return window.innerWidth < BREAKPOINT;
  }

  function init() {
    const topbar = document.querySelector(".topbar");
    const nav = document.querySelector(".nav");
    if (!topbar || !nav) return;

    // Hamburger button
    const btn = document.createElement("button");
    btn.id = "navToggle";
    btn.type = "button";
    btn.className = "nav-toggle-btn";
    btn.setAttribute("aria-label", "Open navigation");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "mainNav");
    btn.innerHTML = `
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
    `;
    nav.id = "mainNav";
    topbar.appendChild(btn);

    // Backdrop — tap to close, NO blur (blur causes scroll jank)
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);

    function open() {
      topbar.classList.add("nav-open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close navigation");
      backdrop.classList.add("nav-backdrop--visible");
      // Lock body scroll while menu is open — prevents 30fps swipe-behind jank
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      // Hide back-to-top button while menu is open
      const btt = document.getElementById("backToTop");
      if (btt) btt.style.visibility = "hidden";
    }

    function close() {
      topbar.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open navigation");
      backdrop.classList.remove("nav-backdrop--visible");
      // Restore scroll
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      // Restore back-to-top
      const btt = document.getElementById("backToTop");
      if (btt) btt.style.visibility = "";
    }

    function toggle() {
      topbar.classList.contains("nav-open") ? close() : open();
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });

    backdrop.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // Close when any nav link or button is tapped (except the toggle itself)
    nav.addEventListener("click", (e) => {
      const target = e.target.closest("a, button");
      if (target && target.id !== "navToggle") {
        setTimeout(close, 80);
      }
    });

    window.addEventListener("resize", () => {
      if (!isMobile()) close();
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
