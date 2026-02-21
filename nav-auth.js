/**
 * nav-auth.js
 * - Always shows "Personal" in the nav:
 *    - if NOT verified => button that opens the auth modal
 *    - if verified     => link to personal.html
 * - Shows "Sign out" only when verified
 * - Updates on auth events
 */
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const PERSONAL_ID = "navPersonal";
  const SIGNOUT_ID = "signOutBtn";

  function makePersonalButton() {
    const btn = document.createElement("button");
    btn.id = PERSONAL_ID;
    btn.className = "nav-link";
    btn.type = "button";
    btn.textContent = "Personal";
    btn.addEventListener("click", () => window.openAuthModal?.());
    return btn;
  }

  function makePersonalLink() {
    const a = document.createElement("a");
    a.id = PERSONAL_ID;
    a.className = "nav-link";
    a.href = "personal.html";
    a.textContent = "Personal";

    if (window.location.pathname.includes("personal.html")) {
      a.classList.add("active");
    }
    return a;
  }

  function insertPersonal(el) {
    // Insert before the contact button if it exists (index page), otherwise append.
    const contactBtn = nav.querySelector("#contactOpen");
    if (contactBtn) nav.insertBefore(el, contactBtn);
    else nav.appendChild(el);
  }

  function ensurePersonal(isVerified) {
    const existing = nav.querySelector(`#${PERSONAL_ID}`);

    // If it exists but is the wrong element type, replace it.
    if (existing) {
      const shouldBeLink = isVerified;
      const isLinkNow = existing.tagName.toLowerCase() === "a";
      if (shouldBeLink !== isLinkNow) {
        existing.remove();
      } else {
        // Keep "active" state correct if it's a link.
        if (isLinkNow) {
          existing.classList.toggle(
            "active",
            window.location.pathname.includes("personal.html")
          );
        }
        return;
      }
    }

    // Create if missing
    const el = isVerified ? makePersonalLink() : makePersonalButton();
    insertPersonal(el);
  }

  function ensureSignOut(isVerified) {
    let btn = nav.querySelector(`#${SIGNOUT_ID}`);

    if (!isVerified) {
      if (btn) btn.remove();
      return;
    }

    if (!btn) {
      btn = document.createElement("button");
      btn.id = SIGNOUT_ID;
      btn.className = "nav-link";
      btn.type = "button";
      btn.textContent = "Sign out";

      btn.addEventListener("click", () => {
        window.Auth?.clearToken?.();
        window.dispatchEvent(new CustomEvent("auth:verified")); // refresh nav + pages

        // If you're on personal page, kick back home
        if (window.location.pathname.includes("personal.html")) {
          window.location.href = "index.html";
        } else {
          window.location.reload();
        }
      });

      nav.appendChild(btn);
    }
  }

  function updateNav() {
    const isVerified = !!window.Auth?.isVerified?.();
    ensurePersonal(isVerified);
    ensureSignOut(isVerified);
  }

  updateNav();
  window.addEventListener("auth:verified", updateNav);
});
