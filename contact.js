window.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("contactOpen");
  const modal = document.getElementById("contactModal");
  const closeBtn = document.getElementById("contactClose");
  const copyBtn = document.getElementById("copyEmail");
  const emailEl = document.getElementById("contactEmail");
  const suggestLink = document.getElementById("suggestLink");
  const reportLink = document.getElementById("reportLink");
  const communityLink = document.getElementById("communityLink");

  if (!openBtn || !modal) return;

  suggestLink?.setAttribute("href", "https://forms.gle/your-form");
  reportLink?.setAttribute("href", "https://forms.gle/your-form");
  communityLink?.setAttribute("href", "https://discord.gg/yourinvite");

  const DURATION = 180; // must match CSS transition time

  const open = () => {
    modal.classList.remove("is-closing");
    modal.showModal();
    closeBtn?.focus();
  };

  const closeAnimated = () => {
    if (!modal.open) return;

    modal.classList.add("is-closing");

    window.setTimeout(() => {
      modal.classList.remove("is-closing");
      modal.close();
      openBtn.focus();
    }, DURATION);
  };

  // Open from URL e.g. index.html?contact=1 (from modules or anywhere)
  const params = new URLSearchParams(window.location.search);
  if (params.get("contact") === "1") {
    history.replaceState(null, "", window.location.pathname || "index.html");
    requestAnimationFrame(() => open());
  }

  openBtn.addEventListener("click", open);
  closeBtn?.addEventListener("click", closeAnimated);

  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) closeAnimated();
  });

  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeAnimated();
  });

  const CONTACT_EMAIL = "zachapp.team@gmail.com";

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      copyBtn.textContent = "Copied! ✓";
      copyBtn.style.background = "rgba(122,162,255,0.25)";
      setTimeout(() => {
        copyBtn.textContent = "Copy email";
        copyBtn.style.background = "";
      }, 2000);
    } catch {
      // Fallback for browsers that block clipboard without interaction
      copyBtn.textContent = CONTACT_EMAIL;
      copyBtn.style.fontSize = "0.78rem";
      setTimeout(() => {
        copyBtn.textContent = "Copy email";
        copyBtn.style.fontSize = "";
      }, 3000);
    }
  });
});
