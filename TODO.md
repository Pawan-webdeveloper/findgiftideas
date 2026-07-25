# MPA Static Pages Implementation - TODO

## Steps

### 1. Create `src/layouts/SiteLayout.astro`
- [x] Shared layout with header/nav, footer, fonts, CSS, meta, `<slot />`

### 2. Create 4 static pages
- [x] `src/pages/privacy.astro` — Privacy Policy with JSON-LD
- [x] `src/pages/terms.astro` — Terms & Conditions with JSON-LD
- [x] `src/pages/about.astro` — About Us with JSON-LD
- [x] `src/pages/contact.astro` — Contact Us with JSON-LD

### 3. Update Footer.tsx
- [x] Replace `#` links with real paths to /privacy, /terms, /about, /contact

### 4. Update Header.tsx
- [x] Add About and Privacy nav links

### 5. Build & Verify
- [x] Run `astro build` — all 5 pages compiled successfully

## Error Pages Implementation - TODO

### Steps

### 1. Create error pages
- [x] `src/pages/404.astro` — 404 Not Found page with SiteLayout, navigation links
- [x] `src/pages/500.astro` — 500 Server Error page with SiteLayout, navigation links
- [x] `src/pages/[...path].astro` — Catch-all route for Astro SSR to serve 404 for unknown paths

### 2. Build & Verify
- [x] Run `astro build` — all error pages compiled successfully

