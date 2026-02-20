/**
 * Update nav to show Personal:
 * - Not verified: button opens auth modal
 * - Verified: link to personal.html + Sign out button
 */
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  function updateNav() {
    const verified = !!window.Auth?.isVerified?.();

    // Remove anything we injected before (prevents duplicates)
    const oldPersonal = nav.querySelector("#navPersonal");
    const oldSignOut = nav.querySelector("#signOutBtn");
    if (oldPersonal) oldPersonal.remove();
    if (oldSignOut) oldSignOut.remove();

    // ---- PERSONAL ----
    let personalEl;

    if (verified) {
      personalEl = document.createElement("a");
      personalEl.href = "personal.html";
      personalEl.textContent = "Personal";
      personalEl.className = "nav-link";
      personalEl.id = "navPersonal";

      if (window.location.pathname.includes("personal.html")) {
        personalEl.classList.add("active");
      }
    } else {
      personalEl = document.createElement("button");
      personalEl.className = "nav-link";
      personalEl.type = "button";
      personalEl.textContent = "Personal";
      personalEl.id = "navPersonal";
      personalEl.addEventListener("click", () => {
        window.openAuthModal?.();
      });
    }

    const contactBtn = nav.querySelector("#contactOpen");
    if (contactBtn) nav.insertBefore(personalEl, contactBtn);
    else nav.appendChild(personalEl);

    // ---- SIGN OUT (only when verified) ----
    if (verified) {
      const signOutBtn = document.createElement("button");
      signOutBtn.id = "signOutBtn";
      signOutBtn.className = "nav-link";
      signOutBtn.type = "button";
      signOutBtn.textContent = "Sign out";

      signOutBtn.addEventListener("click", () => {
        window.Auth?.clearToken?.();
        window.dispatchEvent(new CustomEvent("auth:verified"));
        if (window.location.pathname.includes("personal.html")) {
          window.location.href = "index.html";
        } else {
          window.location.reload();
        }
      });

      nav.appendChild(signOutBtn);
    }
  }

  updateNav();
  window.addEventListener("auth:verified", updateNav);
});
