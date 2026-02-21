/**
 * nav-auth.js
 * - Always shows Personal:
 *    - not verified => button opens modal
 *    - verified     => link to personal.html
 * - Shows Sign out only when verified
 *
 * Changes:
 *  - Sign out fires auth:signedout (not auth:verified)
 *  - Listens to both auth:verified and auth:signedout to update nav
 */
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const PERSONAL_ID = "navPersonal";
  const SIGNOUT_ID = "signOutBtn";

  const isPersonalPage = () => window.location.pathname.includes("personal.html");

  function makePersonalLink() {
    const a = document.createElement("a");
    a.id = PERSONAL_ID;
    a.href = "personal.html";
    a.textContent = "Personal";
    if (isPersonalPage()) a.classList.add("active");
    return a;
  }

  function makePersonalButton() {
    const btn = document.createElement("button");
    btn.id = PERSONAL_ID;
    btn.type = "button";
    btn.className = "nav-link";
    btn.textContent = "Personal";
    btn.addEventListener("click", () => window.openAuthModal?.());
    return btn;
  }

  function makeSignOutButton() {
    const btn = document.createElement("button");
    btn.id = SIGNOUT_ID;
    btn.type = "button";
    btn.className = "nav-link";
    btn.textContent = "Sign out";
    btn.addEventListener("click", () => {
      window.Auth?.clearToken?.();
      window.dispatchEvent(new CustomEvent("auth:signedout"));

      if (isPersonalPage()) window.location.href = "index.html";
      else window.location.reload();
    });
    return btn;
  }

  function insertBeforeContact(el) {
    const contactBtn = nav.querySelector("#contactOpen");
    if (contactBtn) nav.insertBefore(el, contactBtn);
    else nav.appendChild(el);
  }

  function updateNav() {
    const verified = !!window.Auth?.isVerified?.();

    const existingPersonal = nav.querySelector(`#${PERSONAL_ID}`);
    const existingSignOut = nav.querySelector(`#${SIGNOUT_ID}`);

    if (existingPersonal) {
      const shouldBeLink = verified;
      const isLink = existingPersonal.tagName.toLowerCase() === "a";
      if (shouldBeLink !== isLink) existingPersonal.remove();
    }

    if (!nav.querySelector(`#${PERSONAL_ID}`)) {
      const personal = verified ? makePersonalLink() : makePersonalButton();
      insertBeforeContact(personal);
    } else {
      const p = nav.querySelector(`#${PERSONAL_ID}`);
      if (p && p.tagName.toLowerCase() === "a") {
        p.classList.toggle("active", isPersonalPage());
      }
    }

    if (verified) {
      if (!existingSignOut) nav.appendChild(makeSignOutButton());
    } else {
      if (existingSignOut) existingSignOut.remove();
    }
  }

  updateNav();
  window.addEventListener("auth:verified", updateNav);
  window.addEventListener("auth:signedout", updateNav);
});
