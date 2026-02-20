window.addEventListener("DOMContentLoaded", () => {
  const topbar = document.querySelector(".topbar");
  const OFFSET = (topbar?.offsetHeight ?? 64) + 18; // topbar + gap

  // 1) Grab ALL topbar links (hash + normal)
  const links = [...document.querySelectorAll(".topbar a")];

  const clearActive = () => links.forEach((a) => a.classList.remove("active"));

  const setActiveHref = (href) => {
    clearActive();
    const a = links.find((x) => x.getAttribute("href") === href);
    if (a) a.classList.add("active");
  };

  // 2) If we're on modules.html, highlight Modules immediately
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith("modules.html")) {
    setActiveHref("modules.html");
    return; // no section tracking needed on that page
  }

  // 3) On index page, track sections by "closest to top" (not biggest area)
  const hashLinks = links.filter((a) => (a.getAttribute("href") || "").startsWith("#"));
  const sections = hashLinks
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  const setActiveSection = (id) => setActiveHref(`#${id}`);

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;

      // Choose section whose TOP is closest to the topbar offset line
      visible.sort(
        (a, b) =>
          Math.abs(a.boundingClientRect.top - OFFSET) -
          Math.abs(b.boundingClientRect.top - OFFSET)
      );

      setActiveSection(visible[0].target.id);
    },
    {
      threshold: 0,
      // This makes the "activation line" basically under your topbar
      rootMargin: `-${OFFSET}px 0px -60% 0px`,
    }
  );

  sections.forEach((s) => io.observe(s));
});
