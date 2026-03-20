import type { NavItemWithSections } from "@/types/nav";

const LOGO_SVG = `<svg viewBox="40 40 430 140" xmlns="http://www.w3.org/2000/svg" style="height:32px;width:auto">
  <g>
    <g>
      <g>
        <polygon fill="#F16222" points="135.6,86 175.8,86.2 154.3,119.4 113.9,119.4"/>
        <polygon fill="#F16222" points="105.6,48.3 160,48.3 135.8,86 80.7,86.2"/>
      </g>
      <g>
        <polygon fill="#393A3C" points="71.2,100.4 111.5,100.6 90,133.8 49.6,133.8"/>
        <polygon fill="#393A3C" points="90,133.8 144.4,133.9 119.5,171.5 65,171.7"/>
      </g>
    </g>
    <polygon fill="#393A3C" points="192.4,86.3 186.8,95 211.7,95 186.8,133.5 231.5,133.5 237.6,124.5 204.8,124.5 230.2,86.3"/>
    <path fill="#393A3C" d="M242.4,86.3h10c0,0,0,25,0,28c0,2.9,1.1,9.9,11.4,10.2c10.3,0.3,12.2-6.5,12.2-8.9s0-29.3,0-29.3h10.3 c0,0,0,26,0,28.2s0.3,19-22.3,19s-21.6-17.5-21.6-19.3S242.4,86.3,242.4,86.3z"/>
    <polygon fill="#393A3C" points="348,86.3 348,133.5 388.3,133.5 388.3,124.4 358.4,124.4 358.4,114 383.3,114 383.3,104.9 358.3,104.9 358.3,95.1 388.3,95.1 388.3,86.3"/>
    <path fill="#393A3C" d="M322.8,86.3c-16.8,0-26.8,0-26.8,0v47.2h10.2v-15.9c0,0,16.2,0,18.9,0c2.7,0,13.4-2,15.3-10.8 C342.3,98.2,339.5,86.3,322.8,86.3z M330.5,102.1c-0.4,6.5-6.7,6.6-8.2,6.6c-1.5,0-16,0-16,0V95.2c0,0,15.6,0,16.2,0 S330.9,95.6,330.5,102.1z"/>
    <path fill="#393A3C" d="M424.4,116.3c0,0,2.8,0,4.1,0c1.3,0,12.4-1.6,14.5-10.6c2-9-2.3-19.1-13.8-19.1s-31.5-0.3-31.5-0.3v47.4h10.1 v-20.1l22.2,19.9h13.6L424.4,116.3z M407.7,108.7V95.2c0,0,17.1,0,17.7,0c0.5,0,8.4,0.4,8,6.9c-0.4,6.5-6.7,6.6-8.2,6.6 C423.6,108.7,407.7,108.7,407.7,108.7z"/>
    <g><g>
      <path fill="#393A3C" d="M449.3,86.3h6.6v1h-2.7v8.8h-1.3v-8.8h-2.7V86.3z"/>
      <path fill="#393A3C" d="M457.5,86.4h1.4l3.6,8.1l3.6-8.1h1.4v9.7h-1.3v-7.3l-3.2,7.3H462l-3.3-7.3v7.3h-1.3V86.4z"/>
    </g></g>
  </g>
</svg>`;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateMegaMenuHtml(item: NavItemWithSections): string {
  if (item.sections.length === 0 || item.is_cta) return "";

  const isVertical = item.mega_menu_layout === "vertical";

  const sectionsHtml = item.sections
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((section) => {
      const linksHtml = section.links
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(
          (link) =>
            `<li>
              <a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer" class="mega-link">
                <span class="mega-link-label">${esc(link.label)}</span>
                ${link.description ? `<span class="mega-link-desc">${esc(link.description)}</span>` : ""}
              </a>
            </li>`
        )
        .join("\n");

      if (isVertical) {
        return `<div class="mega-section-vertical">
          <h3 class="mega-section-title-vertical">${esc(section.title)}</h3>
          <ul class="mega-links-vertical">${linksHtml}</ul>
        </div>`;
      }

      return `<div class="mega-section">
        <h3 class="mega-section-title">${esc(section.title)}</h3>
        <ul class="mega-links">${linksHtml}</ul>
      </div>`;
    })
    .join("\n");

  const containerClass = isVertical ? "mega-panel-vertical" : "mega-panel-horizontal";

  return `<div class="mega-dropdown">
    <div class="mega-bridge"></div>
    <div class="mega-card ${containerClass}">${sectionsHtml}</div>
  </div>`;
}

export function generateNavHtml(navItems: NavItemWithSections[]): string {
  const sorted = [...navItems].sort((a, b) => a.sort_order - b.sort_order);
  const regularItems = sorted.filter((i) => !i.is_cta);
  const ctaItem = sorted.find((i) => i.is_cta);

  const navLinksHtml = regularItems
    .map((item) => {
      const hasMega = item.sections.length > 0;
      const megaHtml = generateMegaMenuHtml(item);
      if (hasMega) {
        return `<div class="nav-item-wrapper">
          <span class="nav-link">${esc(item.label)}</span>
          ${megaHtml}
        </div>`;
      }
      return `<div class="nav-item-wrapper">
        <a href="${esc(item.url || "#")}" target="_blank" rel="noopener noreferrer" class="nav-link">${esc(item.label)}</a>
      </div>`;
    })
    .join("\n");

  const ctaHtml = ctaItem
    ? `<a href="${esc(ctaItem.url || "#")}" target="_blank" rel="noopener noreferrer" class="cta-btn">${esc(ctaItem.label)}</a>`
    : "";

  const exportDate = new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zuper Nav Prototype</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #FFF8F0;
  min-height: 100vh;
}
nav.top-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 32px;
  background: rgba(255,248,240,0.85);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,107,26,0.08);
}
.nav-center { display: flex; align-items: center; gap: 24px; }
.nav-item-wrapper { position: relative; }
.nav-link {
  font-weight: 600; font-size: 0.82rem; color: #2D1E0E;
  text-decoration: none; cursor: pointer; padding: 4px 0;
  transition: color 0.15s;
  background: none; border: none;
  font-family: inherit;
}
.nav-item-wrapper:hover > .nav-link { color: #FF6B1A; }
.cta-btn {
  background: #FF6B1A; color: #fff; font-weight: 700; font-size: 0.875rem;
  padding: 10px 24px; border-radius: 100px; text-decoration: none;
  box-shadow: 0 2px 12px rgba(255,107,26,0.3);
  transition: background 0.15s, transform 0.15s;
  display: inline-block;
}
.cta-btn:hover { background: #E85A0A; transform: translateY(-1px); }
.mega-dropdown {
  display: none; position: absolute; top: 100%; left: 50%;
  transform: translateX(-50%);
}
.nav-item-wrapper:hover > .mega-dropdown { display: block; }
.mega-bridge { height: 8px; }
.mega-card {
  background: #FDF6ED; border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.mega-panel-horizontal { display: flex; gap: 32px; padding: 32px; min-width: 320px; }
.mega-panel-vertical { padding: 24px; min-width: 220px; max-width: 300px; }
.mega-section { min-width: 180px; }
.mega-section-title {
  font-size: 0.875rem; font-weight: 700; color: #2D1E0E;
  letter-spacing: 0.02em; margin-bottom: 12px;
}
.mega-section-vertical + .mega-section-vertical { margin-top: 16px; }
.mega-section-title-vertical {
  font-size: 0.7rem; font-weight: 700; color: #7A6B5A;
  text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;
}
.mega-links, .mega-links-vertical { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.mega-links-vertical { gap: 6px; }
.mega-link { text-decoration: none; display: block; }
.mega-link-label {
  font-size: 0.875rem; font-weight: 500; color: #2D1E0E;
  transition: color 0.15s;
}
.mega-link:hover .mega-link-label { color: #FF6B1A; }
.mega-link-desc {
  display: block; font-size: 0.75rem; color: #7A6B5A; margin-top: 2px;
}
.export-footer {
  text-align: center; padding: 48px 16px 24px;
  font-size: 0.75rem; color: #C4B8A8;
}
</style>
</head>
<body>
<nav class="top-nav">
  <div class="logo">${LOGO_SVG}</div>
  <div class="nav-center">${navLinksHtml}</div>
  <div>${ctaHtml}</div>
</nav>
<div class="export-footer" style="margin-top:80px">
  Zuper Nav Prototype — Exported ${esc(exportDate)}
</div>
</body>
</html>`;
}

export function downloadNavHtml(navItems: NavItemWithSections[]) {
  const html = generateNavHtml(navItems);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `zuper-nav-export-${date}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
