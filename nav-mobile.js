/**
 * nav-mobile.js
 * Hamburger menu for mobile viewports.
 * - Injects toggle button into topbar
 * - Toggles .nav-open class on topbar
 * - Closes on outside click, Escape, and nav link tap
 * - Works with nav-auth.js dynamic items (Personal, Sign out)
 */
(function () {
  const BREAKPOINT = 768; // px — below this, hamburger activates

  function isMobile() {
    return window.innerWidth < BREAKPOINT;
  }

  function init() {
    const topbar = document.querySelector(".topbar");
    const nav = document.querySelector(".nav");
    if (!topbar || !nav) return;

    // Inject hamburger button
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

    // Inject backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);

    function open() {
      topbar.classList.add("nav-open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close navigation");
      backdrop.classList.add("nav-backdrop--visible");
      document.body.style.overflow = "hidden";
    }

    function close() {
      topbar.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open navigation");
      backdrop.classList.remove("nav-backdrop--visible");
      document.body.style.overflow = "";
    }

    function toggle() {
      topbar.classList.contains("nav-open") ? close() : open();
    }

    btn.addEventListener("click", toggle);
    backdrop.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // Close when any nav link or button is tapped
    nav.addEventListener("click", (e) => {
      const target = e.target.closest("a, button");
      if (target && target.id !== "navToggle") {
        // Small delay so the click registers before nav closes
        setTimeout(close, 80);
      }
    });

    // Close on resize back to desktop
    window.addEventListener("resize", () => {
      if (!isMobile()) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
