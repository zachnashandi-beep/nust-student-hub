/**
 * icons.js
 * Central SVG icon registry using Lucide icon paths.
 * All icons use currentColor so they automatically match theme.
 *
 * Decorative icons (guide cards, hero, tip card) use rich Noto Emoji images
 * served from Google's CDN — full colour, same on every device.
 * If the image fails to load, it falls back to the SVG automatically.
 *
 * Usage in HTML: <span data-icon="moon"></span>
 * Emoji usage:   <span data-icon="target"></span>  ← renders 🎯 via Noto
 */

// Map icon names to their Noto Emoji unicode codepoint(s) for CDN URL
// Format: https://fonts.gstatic.com/s/e/notoemoji/latest/{codepoint}/emoji.svg
const EMOJI_ICONS = {
  "target":          { emoji: "1f3af", fallback: "🎯" }, // 🎯
  "brain":           { emoji: "1f9e0", fallback: "🧠" }, // 🧠
  "calendar":        { emoji: "1f4c5", fallback: "📅" }, // 📅
  "triangle-alert":  { emoji: "26a0",  fallback: "⚠️" }, // ⚠️
  "book-open":       { emoji: "1f4d6", fallback: "📖" }, // 📖
  "lightbulb":       { emoji: "1f4a1", fallback: "💡" }, // 💡
};

const ICON_PATHS = {
  // Theme toggle
  moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,
  sun:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,

  // Tip shuffle
  "refresh-cw": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,

  // Back to top
  "arrow-up": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,

  // Checklist
  "check-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,

  // 404
  "help-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,

  // Guide cards & page icons (SVG fallbacks — used if Noto fails)
  target: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  brain:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  "triangle-alert": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  "book-open": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
};

window.Icons = {
  get(name) {
    return ICON_PATHS[name] || "";
  },

  svg(name, { size = 18, cls = "", ariaHidden = true } = {}) {
    const raw = ICON_PATHS[name];
    if (!raw) return "";
    return raw
      .replace("<svg ", `<svg width="${size}" height="${size}" class="icon-svg${cls ? " " + cls : ""}" ${ariaHidden ? 'aria-hidden="true" ' : ""}focusable="false" `);
  },

  /**
   * Build a Noto Emoji <img> with SVG fallback.
   * The <img> loads the colourful Google Noto emoji.
   * If it errors, onerror swaps it out for the SVG version.
   */
  emojiImg(name, { size = 28, cls = "" } = {}) {
    const def = EMOJI_ICONS[name];
    if (!def) return this.svg(name, { size, cls });

    const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${def.emoji}/emoji.svg`;

    return `<img src="${url}" width="${size}" height="${size}" alt="${def.fallback}" class="icon-svg noto-emoji${cls ? " " + cls : ""}" aria-hidden="true" loading="lazy" data-icon-fallback="${name}" />`;
  },

  hydrate() {
    document.querySelectorAll("[data-icon]").forEach((el) => {
      const name = el.dataset.icon;
      const size = parseInt(el.dataset.iconSize || "18", 10);
      const cls = el.dataset.iconClass || "";

      if (EMOJI_ICONS[name]) {
        el.innerHTML = this.emojiImg(name, { size, cls });
        el.classList.add("icon");
      } else {
        const svg = this.svg(name, { size, cls });
        if (svg) {
          el.innerHTML = svg;
          el.classList.add("icon");
        }
      }
    });

    // Attach fallback handlers after inserting into DOM
    document.querySelectorAll("img[data-icon-fallback]").forEach((img) => {
      img.addEventListener("error", () => {
        const name = img.dataset.iconFallback;
        const size = parseInt(img.getAttribute("width") || "28", 10);
        const cls = (img.className || "").replace("icon-svg", "").replace("noto-emoji", "").trim();
        const svg = window.Icons.svg(name, { size, cls });
        if (svg) {
          const span = document.createElement("span");
          span.innerHTML = svg;
          img.replaceWith(span.firstChild);
        }
      }, { once: true });
    });
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => window.Icons.hydrate());
} else {
  window.Icons.hydrate();
}
