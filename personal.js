/**
 * Personal page: fetch /content and render dashboard
 *
 * Changes:
 *  - Skeleton loading state while fetching
 *  - Renders profile data (name, year, student number) at top of page
 *  - Handles auth:signedout event to reset view
 */
const WORKER_URL = "https://student-hub-auth.zach-nashandi.workers.dev";

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function renderSkeleton(mount) {
  mount.innerHTML = `
    <div class="personal-profile-skeleton" aria-hidden="true">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line skeleton-line--wide"></div>
        <div class="skeleton-line skeleton-line--narrow"></div>
      </div>
    </div>
    <div class="card skeleton-card" style="margin-bottom:14px;" aria-hidden="true">
      <div class="skeleton-line skeleton-line--wide" style="margin-bottom:10px;"></div>
      <div class="skeleton-line skeleton-line--narrow"></div>
    </div>
    <div class="card skeleton-card" aria-hidden="true">
      <div class="skeleton-line skeleton-line--wide" style="margin-bottom:10px;"></div>
      <div class="skeleton-line skeleton-line--mid"></div>
    </div>
  `;
}

function renderProfile(profile) {
  if (!profile) return "";
  const name = profile.name || profile.displayName || "";
  const year = profile.year || profile.studentYear || "";
  const studentNumber = profile.studentNumber || profile.id || "";
  const programme = profile.programme || profile.course || "";

  if (!name && !year && !studentNumber && !programme) return "";

  return `
    <div class="personal-profile card" style="margin-bottom:24px; display:flex; align-items:center; gap:16px; padding:20px 24px;">
      <div class="personal-avatar" aria-hidden="true">
        ${name ? escapeHtml(name.charAt(0).toUpperCase()) : "?"}
      </div>
      <div>
        ${name ? `<h2 class="personal-profile-name" style="margin:0 0 4px;">${escapeHtml(name)}</h2>` : ""}
        <p class="muted" style="margin:0; font-size:0.9rem;">
          ${[programme, year ? `Year ${escapeHtml(String(year))}` : "", studentNumber].filter(Boolean).join(" · ")}
        </p>
      </div>
    </div>
  `;
}

async function loadPersonalContent() {
  const token = window.Auth?.getToken();
  const mount = document.getElementById("personalMount");
  const emptyState = document.getElementById("personalEmptyState");

  if (!token) {
    if (emptyState) emptyState.hidden = false;
    if (mount) mount.innerHTML = "";
    return;
  }

  if (emptyState) emptyState.hidden = true;
  if (mount) renderSkeleton(mount);

  try {
    const res = await fetch(`${WORKER_URL}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      window.Auth.clearToken();
      window.dispatchEvent(new CustomEvent("auth:signedout"));
      if (emptyState) emptyState.hidden = false;
      if (mount) mount.innerHTML = "";
      return;
    }

    const data = await res.json();

    if (!data.ok || !mount) return;

    const { profile, personal } = data;
    let html = renderProfile(profile);

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

    mount.innerHTML = html || '<p class="muted">No personal content available yet.</p>';
  } catch (e) {
    if (emptyState) emptyState.hidden = false;
    if (mount) mount.innerHTML = '<p class="muted">Error loading content. Please try again.</p>';
  }
}

window.addEventListener("DOMContentLoaded", loadPersonalContent);

// Reset view on sign out
window.addEventListener("auth:signedout", () => {
  const mount = document.getElementById("personalMount");
  const emptyState = document.getElementById("personalEmptyState");
  if (mount) mount.innerHTML = "";
  if (emptyState) emptyState.hidden = false;
});
