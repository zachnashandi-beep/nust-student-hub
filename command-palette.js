/**
 * Universal search + command palette
 * / or Ctrl+K → open; type to filter; Enter → run; Escape → close
 */
window.addEventListener("DOMContentLoaded", () => {
  const paletteId = "commandPalette";
  let palette = document.getElementById(paletteId);
  if (!palette) {
    palette = document.createElement("dialog");
    palette.id = paletteId;
    palette.className = "modal command-palette";
    palette.innerHTML =
      '<div class="modal-inner">' +
      '<input type="text" class="command-palette-input" placeholder="Search or run a command…" autocomplete="off" aria-label="Search" />' +
      '<ul class="command-palette-list" role="listbox" id="commandPaletteList"></ul>' +
      '<p class="muted command-palette-hint">↑↓ navigate · Enter run · Esc close</p>' +
      "</div>";
    document.body.appendChild(palette);
  }

  const input = palette.querySelector(".command-palette-input");
  const listEl = document.getElementById("commandPaletteList");
  const hint = palette.querySelector(".command-palette-hint");

  function buildCommands() {
    const path = window.location.pathname.toLowerCase();
    const isModules = path.endsWith("modules.html");
    const items = [];

    items.push({ id: "modules", label: "Go to Modules", href: "modules.html", keywords: "modules page" });
    items.push({ id: "resources", label: "Go to Resources", href: "index.html#resources", keywords: "resources home" });
    items.push({ id: "contact", label: "Open Contact", action: "contact", keywords: "contact modal email" });
    items.push({ id: "theme", label: "Toggle Theme", action: "theme", keywords: "theme dark light" });
    items.push({ id: "reset-checklists", label: "Reset checklists", action: "resetChecklists", keywords: "reset clear checklists" });

    const data = window.MODULES_DATA;
    if (data && data.y1) {
      data.y1.forEach((mod) => {
        const shortTitle = mod.title.replace(/\s*\([^)]*\)\s*$/, "").trim();
        items.push({
          id: "mod-" + mod.id,
          label: "Module: " + shortTitle,
          href: "modules.html#module-" + mod.id,
          keywords: mod.id + " " + (mod.tag || "") + " " + shortTitle,
        });
        (mod.weeks || []).forEach((w) => {
          items.push({
            id: "week-" + w.weekId,
            label: shortTitle + " — " + w.label,
            href: "modules.html#module-" + mod.id,
            keywords: w.weekId + " " + w.label + " " + mod.id,
          });
        });
      });
    }

    return items;
  }

  let allCommands = [];
  let filtered = [];
  let selectedIndex = 0;

  function open() {
    allCommands = buildCommands();
    filtered = allCommands.slice();
    selectedIndex = 0;
    input.value = "";
    input.placeholder = "Search modules, weeks, or run a command…";
    palette.showModal();
    input.focus();
    render();
  }

  function close() {
    palette.close();
  }

  function render() {
    listEl.innerHTML = "";
    filtered.forEach((item, i) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === selectedIndex);
      li.className = "command-palette-item" + (i === selectedIndex ? " selected" : "");
      li.textContent = item.label;
      li.dataset.index = String(i);
      listEl.appendChild(li);
    });
    if (filtered.length === 0) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = "No matches";
      listEl.appendChild(li);
    }
  }

  function run(item) {
    close();
    if (item.action) {
      if (item.action === "contact") {
        const btn = document.getElementById("contactOpen");
        if (btn) btn.click();
        else window.location.href = "index.html?contact=1";
      } else if (item.action === "theme") {
        const btn = document.getElementById("themeToggle");
        if (btn) btn.click();
      } else if (item.action === "resetChecklists") {
        try {
          localStorage.removeItem("studentHub_weekChecklists");
          if (window.location.pathname.toLowerCase().endsWith("modules.html")) window.location.reload();
          else window.location.href = "modules.html";
        } catch (e) {}
      }
    } else if (item.href) {
      window.location.href = item.href;
    }
  }

  function filter() {
    const q = (input.value || "").toLowerCase().trim();
    if (!q) {
      filtered = allCommands.slice();
    } else {
      filtered = allCommands.filter(
        (c) => c.label.toLowerCase().includes(q) || (c.keywords && c.keywords.toLowerCase().includes(q))
      );
    }
    selectedIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));
    render();
  }

  input.addEventListener("input", filter);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[selectedIndex];
      if (item) run(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  });

  listEl.addEventListener("click", (e) => {
    const li = e.target.closest("[data-index]");
    if (li) {
      const item = filtered[Number(li.dataset.index)];
      if (item) run(item);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      open();
    }
    if (e.key === "/" && !e.target.matches("input, textarea, [contenteditable]")) {
      e.preventDefault();
      open();
    }
  });

  palette.addEventListener("click", (e) => {
    if (e.target === palette) close();
  });
});
