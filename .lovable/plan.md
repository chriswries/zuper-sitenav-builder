

## Plan: Export Current Navigation as Standalone HTML

### What We're Building
An "Export HTML" button that downloads a self-contained `.html` file rendering the nav bar with CSS-only hover mega menus — no JavaScript, no external dependencies.

### Changes

**1. New utility: `src/utils/exportNavHtml.ts`**
- Function `generateNavHtml(navItems: NavItemWithSections[]): string` that builds a complete HTML document string.
- Inlines all styles matching the app's design tokens (cream bg, orange accents, blur nav bar).
- Inlines the Zuper SVG logo markup from ZuperLogo.tsx.
- Uses CSS `:hover` on `.nav-item-wrapper:hover > .mega-dropdown` to show/hide mega menus (no JS).
- Includes an invisible bridge `div` (8px spacer) between nav item and dropdown for hover continuity.
- Renders horizontal layouts as `display: flex; gap` columns, vertical layouts as a single narrow column.
- All links get `target="_blank" rel="noopener noreferrer"`.
- Footer: "Zuper Nav Prototype — Exported [formatted date]" in muted centered text.
- Font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Function `downloadNavHtml(navItems)` calls `generateNavHtml`, creates a Blob, and triggers `<a>` click download with filename `zuper-nav-export-YYYY-MM-DD.html`.

**2. Update `src/components/SavedNavsLibrary.tsx`**
- Add `onExport` prop (callback).
- Add "Export HTML" button with `Download` icon next to the existing Save/Open buttons, same orange text style.

**3. Update `src/pages/Index.tsx`**
- Import `downloadNavHtml` from the utility.
- Pass `onExport={() => downloadNavHtml(navItems)}` to `SavedNavsLibrary`.

### Technical Details

The CSS-only hover pattern:
```css
.nav-item-wrapper { position: relative; }
.mega-dropdown { display: none; position: absolute; }
.nav-item-wrapper:hover > .mega-dropdown { display: block; }
```

The HTML generator iterates `navItems`, splitting regular items (center nav) from the CTA item (right side), then for each item with sections generates the dropdown markup with layout-appropriate styling.

