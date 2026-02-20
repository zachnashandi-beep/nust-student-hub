(function () {
  const root = document.documentElement;
  const btn = () => document.getElementById("themeToggle");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const b = btn();
    if (b) {
      b.textContent = theme === "dark" ? "🌙" : "☀️";
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  // load saved theme or system preference
  const saved = localStorage.getItem("theme");
  if (saved) {
    setTheme(saved);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  // attach click
  window.addEventListener("DOMContentLoaded", () => {
    const b = btn();
    if (!b) return;
    b.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  });
})();
