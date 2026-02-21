// nav-auth.js
// Shows Personal (button if not verified, link if verified) + Sign out when verified

window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const PERSONAL_ID = "navPersonal";
  const SIGNOUT_ID = "signOutBtn";

  function ensurePersonal(isVerified) {
    const existing = nav.querySelector(`#${PERSONAL_ID}`);

    // If verified: Personal is a link
    if (isVerified) {
      if (existing && existing.tagName.toLowerCase() === "a") {
        // Update active state
        if (window.location.pathname.includes("personal.html")) {
          existing.classList.add("active");
        } else {
          existing.classList.remove("active");
        }
        return;
      }

      const a = document.createElement("a");
      a.id = PERSONAL_ID;
      a.href = "personal.html";
      a.textContent = "Personal";

      if (window.location.pathname.includes("personal.html")) {
        a.classList.add("active");
      }

      // Replace button if it exists
      if (existing) existing.replaceWith(a);
      else insertBeforeContact(a);
      return;
    }

    // Not verified: Personal is a button that opens auth modal
    if (existing && existing.tagName.toLowerCase() === "button") return;

    const btn = document.createElement("button");
    btn.id = PERSONAL_ID;
    btn.className = "nav-link";
    btn.type = "button";
    btn.textContent = "Personal";
    btn.addEventListener("click", () => window.openAuthModal?.());

    if (existing) existing.replaceWith(btn);
    else insertBeforeContact(btn);
  }

  function ensureSignOut(isVerified) {
    const existing = nav.querySelector(`#${SIGNOUT_ID}`);

    if (!isVerified) {
      if (existing) existing.remove();
      return;
    }

    if (existing) return;

    const btn = document.createElement("button");
    btn.id = SIGNOUT_ID;
    btn.className = "nav-link";
    btn.type = "button";
    btn.textContent = "Sign out";
    btn.addEventListener("click", () => {
      window.Auth?.clearToken?.();
      window.dispatchEvent(new CustomEvent("auth:verified"));
      if (window.location.pathname.includes("personal.html")) {
        window.location.href = "index.html";
      } else {
        window.location.reload();
      }
    });

    nav.appendChild(btn);
  }

  function insertBeforeContact(el) {
    const contactBtn = nav.querySelector("#contactOpen");
    if (contactBtn) nav.insertBefore(el, contactBtn);
    else nav.appendChild(el);
  }

  function updateNav() {
    const verified = !!window.Auth?.isVerified?.();
    ensurePersonal(verified);
    ensureSignOut(verified);
  }

  updateNav();
  window.addEventListener("auth:verified", updateNav);
});
