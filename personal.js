/**
 * Personal page: fetch /content and render dashboard
 */
const WORKER_URL = "https://student-hub-auth.zach-nashandi.workers.dev";

window.addEventListener("DOMContentLoaded", async () => {
  const token = window.Auth?.getToken();
  const mount = document.getElementById("personalMount");
  const emptyState = document.getElementById("personalEmptyState");

  if (!token) {
    if (emptyState) emptyState.hidden = false;
    if (mount) mount.innerHTML = "";
    return;
  }

  if (emptyState) emptyState.hidden = true;

  try {
    const res = await fetch(`${WORKER_URL}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      window.Auth.clearToken();
      if (emptyState) emptyState.hidden = false;
      if (mount) mount.innerHTML = "";
      return;
    }

    const data = await res.json();

    if (!data.ok || !mount) return;

    const { profile, personal } = data;
    let html = "";

    if (personal?.dashboard?.length) {
      html += '<div class="section"><h2>Dashboard</h2>';
      personal.dashboard.forEach((item) => {
        html += `
          <div class="card" style="margin-bottom:14px;">
            <h3 style="margin:0 0 8px;">${escapeHtml(item.title)}</h3>
            <p class="muted" style="margin:0;">${escapeHtml(item.body)}</p>
          </div>
        `;
      });
      html += "</div>";
    }

    if (personal?.modules?.length) {
      html += '<div class="section"><h2>Module Notes</h2>';
      personal.modules.forEach((mod) => {
        html += `
          <div class="card" style="margin-bottom:14px;">
            <p style="margin:0 0 6px;"><strong>${escapeHtml(mod.moduleId)}</strong> ${mod.weekId ? `— ${escapeHtml(mod.weekId)}` : ""}</p>
            ${mod.comment ? `<p class="muted" style="margin:0 0 8px;">${escapeHtml(mod.comment)}</p>` : ""}
            ${mod.extraLinks?.length ? `<ul style="margin:8px 0 0; padding-left:18px;">${mod.extraLinks.map((l) => `<li><a href="${escapeHtml(l.href)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a></li>`).join("")}</ul>` : ""}
          </div>
        `;
      });
      html += "</div>";
    }

    mount.innerHTML = html || '<p class="muted">No personal content available.</p>';
  } catch (e) {
    if (emptyState) emptyState.hidden = false;
    if (mount) mount.innerHTML = '<p class="muted">Error loading content. Please try again.</p>';
  }
});

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}
