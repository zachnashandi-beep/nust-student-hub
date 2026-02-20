// nav-auth.js
// Adds a "Personal" item to the nav.
// - If NOT verified: "Personal" is a button that opens the auth modal
// - If verified: "Personal" becomes a link to personal.html + shows "Sign out"

(function () {
  function ensureNavReady() {
    return document.querySelector(".topbar .nav") || document.querySelector("nav") || document.querySelector(".nav");
  }

  function isVerified() {
    try {
      return !!(window.Auth && window.Auth.isVerified && window.Auth.isVerified());
    } catch {
      return false;
    }
  }

  function openAuthModal() {
    if (typeof window.openAuthModal === "function") window.openAuthModal();
  }

  function updateNav() {
    const nav = ensureNavReady();
    if (!nav) return;

    const verified = isVerified();

    // remove previously injected items (so we don't duplicate)
    const oldPersonal = document.getElementById("navPersonal");
    const oldSignOut = document.getElementById("signOutBtn");
    if (oldPersonal) oldPersonal.remove();
    if (oldSignOut) oldSignOut.remove();

    // create Personal item
    let personalEl;
    if (verified) {
      personalEl = document.createElement("a");
      personalEl.href = "personal.html";
      personalEl.textContent = "Personal";
      personalEl.className = "nav-link";
      personalEl.id = "navPersonal";

      // active state if we are on personal.html
      if (window.location.pathname.includes("personal.html")) {
        personalEl.classList.add("active");
      }
    } else {
      personalEl = document.createElement("button");
      personalEl.type = "button";
      personalEl.textContent = "Personal";
      personalEl.className = "nav-link";
      personalEl.id = "navPersonal";
      personalEl.addEventListener("click", openAuthModal);
    }

    // insert Personal before Contact if possible
    const contactBtn = nav.querySelector("#contactOpen");
    if (contactBtn) nav.insertBefore(personalEl, contactBtn);
    else nav.appendChild(personalEl);

    // create Sign out if verified
    if (verified) {
      const signOutBtn = document.createElement("button");
      signOutBtn.type = "button";
      signOutBtn.textContent = "Sign out";
      signOutBtn.className = "nav-link";
      signOutBtn.id = "signOutBtn";

      signOutBtn.addEventListener("click", () => {
        try {
          window.Auth && window.Auth.clearToken && window.Auth.clearToken();
        } catch {}

        // tell the rest of the site auth changed
        window.dispatchEvent(new CustomEvent("auth:verified"));

        // if you're on personal page, go home
        if (window.location.pathname.includes("personal.html")) {
          window.location.href = "index.html";
        } else {
          window.location.reload();
        }
      });

      nav.appendChild(signOutBtn);
    }
  }

  // run once now
  updateNav();

  // update after verify/signout
  window.addEventListener("auth:verified", updateNav);

  // update once DOM is ready (if nav is injected late)
  document.addEventListener("DOMContentLoaded", updateNav);
})();
