document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || a.target === "_blank") return;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return;

  e.preventDefault();

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      window.location.href = url.href;
    });
  } else {
    document.body.classList.add("fade-out");
    setTimeout(() => (window.location.href = url.href), 120);
  }
});

// Prefetch modules.html on hover so it loads instantly when clicked
document.querySelectorAll('.topbar a[href="modules.html"], .topbar a[href="index.html"]').forEach((a) => {
  a.addEventListener("mouseenter", () => {
    if (a.dataset.prefetched) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
    a.dataset.prefetched = "1";
  }, { once: true });
});
