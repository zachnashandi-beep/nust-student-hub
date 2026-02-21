/**
 * page-transitions.js
 * Smooth fade transitions between pages using the View Transitions API.
 * Falls back gracefully on browsers that don't support it.
 *
 * How it works:
 *  - Intercepts clicks on same-origin <a> links
 *  - Triggers document.startViewTransition() which cross-fades old→new page
 *  - CSS @keyframes control the animation (defined in style.css)
 *  - Skips: external links, new-tab links, hash-only links, download links
 */
(function () {
  // Only enhance if the API is available
  if (!document.startViewTransition) return;

  function isSameOrigin(href) {
    try {
      const url = new URL(href, location.href);
      return url.origin === location.origin;
    } catch {
      return false;
    }
  }

  function shouldIntercept(a) {
    const href = a.getAttribute("href");
    if (!href) return false;
    if (a.target === "_blank" || a.target === "_self" && a.rel?.includes("noopener")) return false;
    if (a.hasAttribute("download")) return false;
    if (href.startsWith("#")) return false;         // same-page anchor
    if (href.startsWith("mailto:")) return false;
    if (href.startsWith("tel:")) return false;
    if (!isSameOrigin(href)) return false;
    return true;
  }

  document.addEventListener("click", (e) => {
    // Walk up from target to find an <a>
    const a = e.target.closest("a");
    if (!a || !shouldIntercept(a)) return;

    // Don't intercept if modifier key held (open in new tab etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    const href = a.href;

    document.startViewTransition(() => {
      window.location.href = href;
    });
  });
})();
