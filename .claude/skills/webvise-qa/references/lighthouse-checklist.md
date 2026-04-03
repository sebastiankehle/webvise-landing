# Lighthouse Performance Optimization Checklist

Detailed checklist for achieving 90+ scores across all 4 Lighthouse categories (Performance, Accessibility, Best Practices, SEO).

---

## Images

### next/image Usage
- [ ] All `<img>` tags replaced with `next/image` `<Image>` component
- [ ] No raw HTML `<img>` tags anywhere in the codebase
- [ ] SVGs can remain as `<img>` or inline SVG (next/image not needed for SVGs)

### Sizing
- [ ] Explicit `width` and `height` props set (or `fill` prop for responsive containers)
- [ ] `sizes` attribute set on all responsive images to prevent downloading oversized images
- [ ] Example: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`

### Quality & Format
- [ ] `quality` prop set where appropriate (default 75, lower for decorative/background images)
- [ ] WebP/AVIF served automatically by Next.js image optimization
- [ ] Source images are high resolution enough for 2x displays

### Loading Priority
- [ ] `priority` prop set on above-the-fold hero images and LCP candidates
- [ ] Only 1-2 images per page should have `priority` (overuse defeats the purpose)
- [ ] Below-fold images lazy load by default (do not add `loading="eager"`)

### Static Assets
- [ ] Large images stored in `public/` or served from a CDN
- [ ] Image file names are descriptive (not `IMG_1234.jpg`)
- [ ] No unnecessarily large source images (e.g., 4000px wide for a 400px display)

---

## Fonts

### next/font Setup
- [ ] All fonts loaded via `next/font/google` or `next/font/local`
- [ ] No `<link>` tags to external font CSS (Google Fonts CDN, etc.)
- [ ] No `@import` statements for external fonts in CSS

### Configuration
- [ ] `display: 'swap'` set to prevent invisible text during load
- [ ] `subsets: ['latin']` (or appropriate subset) specified to reduce font file size
- [ ] Only required font weights loaded (not the entire family)
- [ ] Variable fonts used where possible (one file, all weights)

### Preloading
- [ ] next/font handles preloading automatically — verify no manual preload tags conflict
- [ ] `preconnect` to font origins if any external fonts remain

---

## Code Splitting

### Server vs Client Components
- [ ] Default to Server Components (no directive needed)
- [ ] `"use client"` only on components that use: `useState`, `useEffect`, `useRef`, event handlers, browser APIs
- [ ] Client boundaries pushed as deep as possible (wrap only the interactive part, not the whole page)
- [ ] No `"use client"` on layout or page components unless absolutely necessary

### Dynamic Imports
- [ ] Heavy components below the fold use `next/dynamic` with `ssr: false` where appropriate
- [ ] Large libraries (chart libraries, rich text editors) dynamically imported
- [ ] `loading` fallback provided for dynamic imports

### Bundle Hygiene
- [ ] No barrel exports (`index.ts` re-exporting everything) that pull unused modules
- [ ] Tree shaking working: import specific functions, not entire libraries
- [ ] Example: `import { format } from 'date-fns'` not `import * as dateFns from 'date-fns'`
- [ ] Check with `@next/bundle-analyzer` if bundle seems large

---

## CSS

### Tailwind CSS
- [ ] Tailwind purge working in production (check built CSS file size)
- [ ] `content` paths in `tailwind.config` cover all template files
- [ ] No unused custom CSS files

### Optimization
- [ ] No inline `style` attributes where Tailwind classes exist
- [ ] Responsive design uses Tailwind variants (`md:`, `lg:`) not CSS media queries
- [ ] No duplicate class names on elements
- [ ] CSS animations use `transform` and `opacity` (GPU-accelerated properties)
- [ ] No layout-triggering animations (`width`, `height`, `top`, `left`)

---

## Caching & Headers

### Static Generation
- [ ] Static pages use static generation or ISR where possible
- [ ] `generateStaticParams` used for dynamic routes that can be pre-rendered
- [ ] Pages that don't need real-time data are not using `force-dynamic`

### Cache Headers
- [ ] Static assets (JS, CSS, images) have long cache TTL (Vercel handles this)
- [ ] API routes have appropriate `Cache-Control` headers
- [ ] `revalidate` values set appropriately on ISR pages

### Vercel Edge
- [ ] Vercel automatically caches static assets at edge — verify no `no-store` headers on static content
- [ ] Middleware is lean (no heavy computation at the edge)

---

## Third-Party Scripts

### Loading Strategy
- [ ] Analytics scripts use `next/script` with `strategy="afterInteractive"`
- [ ] Non-critical scripts use `strategy="lazyOnload"`
- [ ] No scripts in `<head>` that block rendering (unless critical)

### Bundle Impact
- [ ] Monitor total third-party script size
- [ ] Remove unused analytics or tracking scripts
- [ ] Use `@next/bundle-analyzer` to identify large third-party dependencies

### Specific Services
- [ ] Google Analytics: use `@next/third-parties/google` package
- [ ] Google Tag Manager: load with `afterInteractive` strategy
- [ ] Chat widgets: load lazily, not on initial page load

---

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5s - 4.0s | > 4.0s |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 |
| INP | < 200ms | 200ms - 500ms | > 500ms |
| FCP | < 1.8s | 1.8s - 3.0s | > 3.0s |
| TTFB | < 800ms | 800ms - 1800ms | > 1800ms |

### LCP Optimization
- Preload the LCP image with `priority` prop
- Ensure server response is fast (TTFB < 800ms)
- No render-blocking resources before LCP element
- Font swap prevents invisible text during LCP measurement

### CLS Prevention
- Set explicit dimensions on images and videos
- No dynamically injected content above existing content
- Font swap configured to minimize layout shift
- Skeleton loaders match final content dimensions

### INP Optimization
- Event handlers execute quickly (< 50ms)
- Heavy computations offloaded to web workers or server
- No long tasks blocking the main thread
- Use `startTransition` for non-urgent state updates
