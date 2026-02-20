(() => {
  const TOPBAR_SELECTOR = ".topbar";
  const AT_TOP_CLASS = "at-top";
  const BLUR_READY_CLASS = "blur-ready";
  const SCROLLING_CLASS = "scrolling";
  const THRESHOLD = 8; // px
  const SCROLL_IDLE_MS = 150;

  let scrollTimeout;

  function apply() {
    const bar = document.querySelector(TOPBAR_SELECTOR);
    if (!bar) return;

    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const atTop = y <= THRESHOLD;
    bar.classList.toggle(AT_TOP_CLASS, atTop);
    document.documentElement.classList.toggle(AT_TOP_CLASS, atTop);
  }

  const applySoon = () => requestAnimationFrame(apply);

  function handleScrollPerformance() {
    const bar = document.querySelector(TOPBAR_SELECTOR);
    if (!bar) return;

    if (!bar.classList.contains(SCROLLING_CLASS)) {
      bar.classList.add(SCROLLING_CLASS);
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      bar.classList.remove(SCROLLING_CLASS);
    }, SCROLL_IDLE_MS);
  }

  function upgradeBlurSoon() {
    const bar = document.querySelector(TOPBAR_SELECTOR);
    if (!bar) return;

    // Use "lite glass" immediately
    bar.classList.remove(BLUR_READY_CLASS);

    // Enable blur after paint settles (2 frames)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.classList.add(BLUR_READY_CLASS);
      });
    });
  }

  window.addEventListener("DOMContentLoaded", applySoon, { once: true });
  window.addEventListener("DOMContentLoaded", upgradeBlurSoon, { once: true });
  window.addEventListener("load", applySoon, { once: true });
  window.addEventListener("load", upgradeBlurSoon, { once: true });
  window.addEventListener("scroll", () => {
    applySoon();
    handleScrollPerformance();
  }, { passive: true });

  // KEY: handles returning via back/forward cache
  window.addEventListener("pageshow", () => {
    applySoon();
    setTimeout(apply, 0);
    upgradeBlurSoon();
  });
})();

