# Phase 1: DISCOVER — Detailed Protocol

## Systematic Crawling

1. Start at homepage URL
2. Extract ALL links from:
   - Header/navigation menu (including dropdowns/mega-menus)
   - Hero section CTAs
   - Body content links
   - Sidebar navigation (if any)
   - Footer navigation
   - Footer legal links (privacy, terms, imprint)
3. For each discovered page, repeat the link extraction
4. Check sitemap.xml for pages not found via navigation
5. Check robots.txt for sitemap location
6. Common WordPress pages to check even if not linked:
   - /blog/, /category/, /tag/
   - /about/, /contact/, /impressum/, /datenschutz/
   - /wp-sitemap.xml

## Per-Page Content Inventory Template

Use this template for every page discovered:

```markdown
### Page: {title}
- **URL:** {url}
- **Purpose:** {homepage/about/service/contact/blog/legal/other}
- **Sections:**
  1. {section name} — {description: hero with heading + CTA, feature grid, testimonials, etc.}
  2. ...
- **Interactive Elements:**
  - {element}: {type} — hover state: {observed/none}
  - ...
- **Forms:** {yes/no} — fields: {list}
- **Images:** {count} — types: {photos/illustrations/icons}
```

## Brand Asset Extraction

### Logo

1. Right-click and save, or find in /wp-content/uploads/ or /images/
2. Check for SVG versions in the page source
3. Look for multiple variants: dark, light, icon-only, full wordmark
4. Save all variants found

### Colors

Use browser DevTools (Computed Styles) on key elements:

| Element | What to Check |
|---------|--------------|
| Header background | Primary background or transparent |
| Primary button | Brand accent color |
| Body text | Main text color |
| Links | Link color (may differ from brand) |
| Footer background | Often dark or inverted |
| Headings | May use a different color than body |
| Borders/dividers | Subtle separation color |

Record exact hex or RGB values. Convert to OKLCH later if needed.

### Fonts

Check DevTools (Computed > font-family) on:
- `body` — base font
- `h1`, `h2`, `h3` — heading font (may differ from body)
- `nav` — navigation font
- `button` — may use a different weight or family

Record: font family name, weights used, any italic variants.

### Favicon

Check `<link rel="icon">` in page source. Download if available.

## WordPress-Specific Tips

### REST API Discovery

If the WordPress REST API is accessible, use these endpoints:

| Endpoint | Returns |
|----------|---------|
| `/wp-json/wp/v2/pages` | All published pages |
| `/wp-json/wp/v2/posts` | All blog posts |
| `/wp-json/wp/v2/categories` | Blog categories |
| `/wp-json/wp/v2/tags` | Blog tags |
| `/wp-json/wp/v2/media` | Media library items |
| `/wp-json/` | API root with site info |

If the REST API is disabled (403 or 404), fall back to sitemap.xml.

### Common Plugin Pages

Check for pages created by popular WordPress plugins:
- `/shop/`, `/cart/`, `/checkout/` — WooCommerce
- `/events/` — The Events Calendar
- `/portfolio/` — Portfolio plugins
- `/members/`, `/login/`, `/register/` — Membership plugins
- `/faq/` — FAQ plugins

### Theme Detection

Check the page source for:
- `wp-content/themes/{theme-name}/` — identifies the active theme
- Theme-specific classes on `<body>` element
- This helps understand the source site's structure and capabilities

## Content Classification

After crawling, classify each page into one of these categories:

| Category | Examples | Migration Priority |
|----------|----------|-------------------|
| Core | Homepage, About, Contact | HIGH — build first |
| Services | Service listings, individual services | HIGH |
| Legal | Privacy, Terms, Imprint | HIGH — legally required |
| Blog | Blog index, individual posts | MEDIUM |
| Portfolio | Case studies, projects | MEDIUM |
| Utility | Search, 404, sitemap | LOW — handle in build |
| Plugin-generated | Shop, events, members | VARIES — discuss with client |

## Output: Site Map Document

Compile all findings into a single document:

```markdown
# Site Discovery: {client name}

**Source URL:** {url}
**Date:** {date}
**Total pages found:** {count}

## Brand Elements
- **Logo:** {description, file saved}
- **Colors:** primary {hex}, secondary {hex}, accent {hex}, bg {hex}
- **Fonts:** heading: {font}, body: {font}
- **Imagery:** {photos/illustrations/icons style notes}

## Navigation Structure
### Header Nav
- {item} -> {url}
  - {dropdown item} -> {url}
- ...

### Footer Nav
- Column 1: {title}
  - {item} -> {url}
- ...

## Page Inventory

### 1. Homepage
{use per-page template}

### 2. About
{use per-page template}

...
```

## Gate Check Protocol

Present to the user:

1. Total page count found
2. The complete page list with URLs
3. Any pages that seemed incomplete or inaccessible
4. Any pages found only via sitemap (not linked in navigation)

Ask explicitly: "I found {N} pages. Are any missing? Should any be excluded?"

Wait for confirmation before proceeding to Phase 2: PLAN.
