/**
 * scroll-reveal.js
 * Fade + slide sections in as they enter the viewport.
 * Also handles depth scroll effect (section 5 — scale/depth between sections).
 * Uses IntersectionObserver — zero layout thrash, GPU-composited only.
 */
(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) return; // Respect accessibility — no animations

  // --- Scroll Reveal (feature 1) ---
  // Elements to reveal as they scroll into view
  const REVEAL_SELECTORS = [
    ".hero-text",
    ".hero-card",
    ".stats-bar",
    ".section-head",
    ".guide-card",
    ".update-item",
    ".tile",
    ".guide-page-hero",
    ".guide-section",
    ".note",
    ".footer",
  ].join(", ");

  function initReveal() {
    const els = document.querySelectorAll(REVEAL_SELECTORS);
    if (!els.length) return;

    els.forEach((el, i) => {
      // Stagger siblings within the same parent
      const siblings = [...el.parentElement.children].filter(c =>
        c.matches && c.matches(REVEAL_SELECTORS)
      );
      const sibIndex = siblings.indexOf(el);
      const delay = sibIndex * 60; // 60ms stagger between siblings

      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = `opacity 0.55s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.55s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`;
      el.style.willChange = "opacity, transform";
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        // Clean up after animation so it doesn't interfere with hover effects
        setTimeout(() => {
          el.style.willChange = "auto";
          el.style.transition = "";
        }, 700);
        io.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    els.forEach(el => io.observe(el));
  }

  // --- Depth scroll (feature 5) ---
  // Sections slightly scale down as you scroll past them
  function initDepth() {
    const sections = document.querySelectorAll("section.section");
    if (sections.length < 2) return;

    const depthIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.style.transform = "scale(1)";
          el.style.opacity = "1";
        } else {
          // Section is above viewport — scale it down slightly
          const rect = entry.boundingClientRect;
          if (rect.bottom < 0) {
            el.style.transform = "scale(0.97)";
            el.style.opacity = "0.85";
          }
        }
      });
    }, { threshold: [0, 0.1, 0.9, 1] });

    sections.forEach(el => {
      el.style.transition = "transform 0.4s ease, opacity 0.4s ease";
      el.style.transformOrigin = "center top";
      depthIO.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initReveal();
      initDepth();
    });
  } else {
    initReveal();
    initDepth();
  }
})();
