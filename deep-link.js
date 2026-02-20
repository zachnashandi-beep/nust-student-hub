window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const targetId = params.get("to");
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  // Clear the query so refresh doesn't keep jumping
  history.replaceState(null, "", "index.html");

  // Wait a bit so the topbar / blur state stabilizes before scrolling
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        // Trigger the glow highlight
        target.classList.remove("flash");
        void target.offsetWidth;
        target.classList.add("flash");
        setTimeout(() => target.classList.remove("flash"), 950);
      }, 250);
    });
  });
});

