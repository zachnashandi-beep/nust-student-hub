(function () {
  const root = document.documentElement;
  const btn = () => document.getElementById("themeToggle");

  const MOON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="icon-svg"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`;
  const SUN_SVG  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="icon-svg"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const b = btn();
    if (b) {
      b.innerHTML = theme === "dark" ? MOON_SVG : SUN_SVG;
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  const saved = localStorage.getItem("theme");
  if (saved) {
    setTheme(saved);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  window.addEventListener("DOMContentLoaded", () => {
    const b = btn();
    if (!b) return;
    // Set icon correctly on load (icons.js may have already set moon span)
    const current = root.getAttribute("data-theme") || "dark";
    b.innerHTML = current === "dark" ? MOON_SVG : SUN_SVG;
    b.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      // Flip animation — add class, switch theme at the midpoint (icon hidden), remove class
      b.classList.add("is-flipping");
      setTimeout(() => {
        setTheme(current === "dark" ? "light" : "dark");
      }, 160); // switch at midpoint of 380ms flip (40% = ~152ms)
      setTimeout(() => {
        b.classList.remove("is-flipping");
      }, 400);
    });
  });
})();
