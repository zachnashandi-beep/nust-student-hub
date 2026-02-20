window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("updateModal");
  if (!modal) return;

  const title = document.getElementById("modalTitle");
  const date = document.getElementById("modalDate");
  const body = document.getElementById("modalBody");

  const closeBtn = document.getElementById("modalClose");
  const okBtn = document.getElementById("modalOk");
  const openUpdateLink = document.getElementById("modalOpenUpdate");

  const STORAGE_KEY = "studentHub_readUpdates";

  function loadReadSet() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  }

  function saveReadSet(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }

  const readSet = loadReadSet();

  function hideBadge(btn) {
    const badge = btn.querySelector("[data-badge]");
    if (badge) badge.style.display = "none";
  }

  // On load: hide badges for already-read updates
  document.querySelectorAll(".update-item").forEach((btn) => {
    const id = btn.dataset.updateId;
    if (id && readSet.has(id)) hideBadge(btn);
  });

  let lastOpener = null;
  const DURATION = 180; // match CSS transition

  function openFrom(btn) {
    lastOpener = document.activeElement;
    modal.classList.remove("is-closing");
    title.textContent = btn.dataset.title || "Update";
    date.textContent = btn.dataset.date || "";
    body.textContent = btn.dataset.body || "";

    if (openUpdateLink) {
      const link = btn.dataset.link;
      if (link) {
        openUpdateLink.href = link;
        openUpdateLink.textContent = "Open this update";
      } else {
        openUpdateLink.href = "modules.html";
        openUpdateLink.textContent = "Go to Modules";
      }
    }

    // mark as read
    const id = btn.dataset.updateId;
    if (id) {
      readSet.add(id);
      saveReadSet(readSet);
      hideBadge(btn);
    }

    modal.showModal();
    const focusable = modal.querySelector(".modal-inner button, .modal-inner a[href]");
    if (focusable) focusable.focus();
  }

  document.querySelectorAll(".update-item").forEach((btn) => {
    btn.addEventListener("click", () => openFrom(btn));
  });

  function closeAnimated() {
    if (!modal.open) return;
    modal.classList.add("is-closing");
    window.setTimeout(() => {
      modal.classList.remove("is-closing");
      modal.close();
      if (lastOpener && typeof lastOpener.focus === "function") lastOpener.focus();
    }, DURATION);
  }

  closeBtn?.addEventListener("click", closeAnimated);
  okBtn?.addEventListener("click", closeAnimated);

  modal.addEventListener("close", () => {
    if (lastOpener && typeof lastOpener.focus === "function") lastOpener.focus();
  });

  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeAnimated();
  });

  modal.addEventListener("click", (e) => {
    const box = modal.querySelector(".modal-inner");
    if (box && !box.contains(e.target)) closeAnimated();
  });
});
