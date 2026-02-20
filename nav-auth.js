/**
 * Update nav to show Personal link when verified + sign out button
 */
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  function updateNav() {
    const isVerified = window.Auth?.isVerified();
    const existingPersonal = nav.querySelector('a[href="personal.html"]');
    const existingSignOut = nav.querySelector("#signOutBtn");

    if (isVerified) {
      if (!existingPersonal) {
        const personalLink = document.createElement("a");
        personalLink.href = "personal.html";
        personalLink.textContent = "Personal";
        if (window.location.pathname.includes("personal.html")) {
          personalLink.classList.add("active");
        }
        const contactBtn = nav.querySelector("#contactOpen");
        if (contactBtn) {
          nav.insertBefore(personalLink, contactBtn);
        } else {
          nav.appendChild(personalLink);
        }
      }
    } else {
      // Show Personal link but open modal instead
      if (!existingPersonal) {
        const personalLink = document.createElement("button");
        personalLink.className = "nav-link";
        personalLink.type = "button";
        personalLink.textContent = "Personal";
        personalLink.addEventListener("click", () => {
          window.openAuthModal?.();
        });
        const contactBtn = nav.querySelector("#contactOpen");
        if (contactBtn) {
          nav.insertBefore(personalLink, contactBtn);
        } else {
          nav.appendChild(personalLink);
        }
      }

      if (!existingSignOut) {
        const signOutBtn = document.createElement("button");
        signOutBtn.id = "signOutBtn";
        signOutBtn.className = "nav-link";
        signOutBtn.type = "button";
        signOutBtn.textContent = "Sign out";
        signOutBtn.addEventListener("click", () => {
          window.Auth.clearToken();
          window.dispatchEvent(new CustomEvent("auth:verified"));
          if (window.location.pathname.includes("personal.html")) {
            window.location.href = "index.html";
          } else {
            window.location.reload();
          }
        });
        nav.appendChild(signOutBtn);
      }
    } else {
      if (existingPersonal) existingPersonal.remove();
      if (existingSignOut) existingSignOut.remove();
    }
  }

  updateNav();
  window.addEventListener("auth:verified", updateNav);
});
