/**
 * Authentication: token management + verification modal
 * Token stored in localStorage as studentHub_token
 */
const AUTH_TOKEN_KEY = "studentHub_token";
const WORKER_URL = "https://student-hub-auth.zach-nashandi.workers.dev";

window.Auth = {
  getToken() {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token) {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      return true;
    } catch {
      return false;
    }
  },

  clearToken() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return true;
    } catch {
      return false;
    }
  },

  isVerified() {
    return !!this.getToken();
  },
};

window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  const usernameInput = document.getElementById("authUsername");
  const accessKeyInput = document.getElementById("authAccessKey");
  const submitBtn = document.getElementById("authSubmit");
  const closeBtn = document.getElementById("authClose");
  const errorMsg = document.getElementById("authError");

  const DURATION = 180;

  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg || "";
      errorMsg.style.display = msg ? "block" : "none";
    }
  }

  function open() {
    modal.classList.remove("is-closing");
    modal.showModal();
    usernameInput?.focus();
    showError("");
  }

  function closeAnimated() {
    if (!modal.open) return;
    modal.classList.add("is-closing");
    window.setTimeout(() => {
      modal.classList.remove("is-closing");
      modal.close();
    }, DURATION);
  }

  async function handleSubmit() {
    const username = (usernameInput?.value || "").trim();
    const accessKey = (accessKeyInput?.value || "").trim();

    if (!username || !accessKey) {
      showError("Please enter both username and access key");
      return;
    }

    showError("");
    submitBtn.disabled = true;
    submitBtn.textContent = "Verifying...";

    try {
      const res = await fetch(`${WORKER_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, accessKey }),
      });

      const data = await res.json();

      if (data.ok && data.token) {
        window.Auth.setToken(data.token);
        closeAnimated();
        submitBtn.disabled = false;
        submitBtn.textContent = "Verify";
        usernameInput.value = "";
        accessKeyInput.value = "";

        // Dispatch event so other scripts can refresh
        window.dispatchEvent(new CustomEvent("auth:verified"));
        if (window.location.pathname.includes("personal.html")) {
          window.location.reload();
        }
      } else {
        showError(data.error || "Verification failed");
        submitBtn.disabled = false;
        submitBtn.textContent = "Verify";
      }
    } catch (e) {
      showError("Network error. Please try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Verify";
    }
  }

  submitBtn?.addEventListener("click", handleSubmit);
  usernameInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSubmit();
  });
  accessKeyInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSubmit();
  });

  closeBtn?.addEventListener("click", closeAnimated);
  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeAnimated();
  });
  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) closeAnimated();
  });

  // Expose open for other scripts
  window.openAuthModal = open;
});
