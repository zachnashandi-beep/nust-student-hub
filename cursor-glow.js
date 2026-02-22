/**
 * cursor-glow.js
 * Subtle cursor-following glow on interactive cards — desktop only.
 * Uses CSS custom properties + mousemove. Zero external deps, ~1KB.
 * On touch devices this script does nothing at all.
 */
(function () {
  // Desktop only — skip entirely on touch-primary devices
  if (window.matchMedia("(hover: none)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const CARD_SELECTORS = ".guide-card, .tile, .card, .dropdown, .note";

  function attachGlow(card) {
    if (card.dataset.glowAttached) return;
    card.dataset.glowAttached = "1";

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--glow-x", `${x}%`);
      card.style.setProperty("--glow-y", `${y}%`);
      card.style.setProperty("--glow-opacity", "1");
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--glow-opacity", "0");
    });
  }

  function init() {
    // Attach to all current cards
    document.querySelectorAll(CARD_SELECTORS).forEach(attachGlow);

    // Also attach to dynamically rendered cards (modules page renders them late)
    const observer = new MutationObserver(() => {
      document.querySelectorAll(CARD_SELECTORS).forEach(attachGlow);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
