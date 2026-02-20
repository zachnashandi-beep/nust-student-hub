/**
 * Inject personal comments/links into modules.html after verification
 */
const WORKER_URL = "https://student-hub-auth.zach-nashandi.workers.dev";

window.addEventListener("DOMContentLoaded", async () => {
  const token = window.Auth?.getToken();
  if (!token) return;

  try {
    const res = await fetch(`${WORKER_URL}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      window.Auth.clearToken();
      return;
    }

    const data = await res.json();
    if (!data.ok || !data.personal?.modules) return;

    data.personal.modules.forEach((mod) => {
      const weekLi = document.querySelector(`li[data-week-id="${mod.weekId}"]`);
      if (!weekLi) return;

      const existing = weekLi.querySelector(".personal-comment");
      if (existing) existing.remove();

      const commentDiv = document.createElement("div");
      commentDiv.className = "personal-comment";
      commentDiv.style.cssText = "margin-top:8px; padding:8px 12px; background:color-mix(in srgb, var(--accent) 12%, transparent); border-left:2px solid var(--accent); border-radius:6px;";

      if (mod.comment) {
        const p = document.createElement("p");
        p.className = "muted";
        p.style.cssText = "margin:0 0 6px; font-size:0.9rem;";
        p.textContent = mod.comment;
        commentDiv.appendChild(p);
      }

      if (mod.extraLinks?.length) {
        const ul = document.createElement("ul");
        ul.style.cssText = "margin:0; padding-left:16px; font-size:0.9rem;";
        mod.extraLinks.forEach((link) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link.href;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = link.label;
          li.appendChild(a);
          ul.appendChild(li);
        });
        commentDiv.appendChild(ul);
      }

      weekLi.appendChild(commentDiv);
    });
  } catch (e) {
    // Silent fail - personal content is optional
  }
});

// Refresh on auth events
window.addEventListener("auth:verified", () => {
  if (window.location.pathname.includes("modules.html")) {
    window.location.reload();
  }
});
