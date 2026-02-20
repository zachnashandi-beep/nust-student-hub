// Highlights sections after clicking nav anchor links like #resources / #contact
window.addEventListener("DOMContentLoaded", () => {
  const anchors = document.querySelectorAll('a[href^="#"]');

  function flashTarget(id) {
    const el = document.getElementById(id);
    if (!el) return;

    // remove + re-add so it re-triggers even if clicked repeatedly
    el.classList.remove("flash");
    // force reflow
    void el.offsetWidth;
    el.classList.add("flash");

    // cleanup
    setTimeout(() => el.classList.remove("flash"), 950);
  }

  anchors.forEach((a) => {
    a.addEventListener("click", () => {
      const href = a.getAttribute("href");
      const id = href?.slice(1);
      if (id) flashTarget(id);
    });
  });

  // also highlight if user lands directly on a hash URL
  if (location.hash) {
    flashTarget(location.hash.slice(1));
  }
});

