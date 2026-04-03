# Content Parity Verification Checklist

Step-by-step process for verifying content parity in migration projects. Use this when rebuilding an existing site to ensure nothing is lost.

---

## Phase 1: Crawl Source Site

### Page Inventory
1. Browse the source site systematically starting from the homepage
2. Follow every navigation link (header, footer, sidebar, in-page)
3. List every unique URL/page found
4. Document the full navigation structure:
   - Header nav items and dropdowns
   - Footer link sections
   - Sidebar navigation (if any)
   - In-page links to other pages
5. Count total pages

### Content Catalog
For each page, document:
- Page URL
- Page title
- Primary heading (h1)
- Number of sections
- Forms present (contact, newsletter, etc.)
- CTAs and their targets
- Downloads or PDFs linked
- Images count

### Interactive Elements
- [ ] List all forms and their fields
- [ ] List all CTAs with link targets
- [ ] List all downloadable files
- [ ] List all external links
- [ ] List all email/phone links

---

## Phase 2: Map to New Routes

### Route Mapping Table

Create a mapping for every page:

| # | Source URL | New Route | Status |
|---|-----------|-----------|--------|
| 1 | /about | /about | Mapped |
| 2 | /services | /services | Mapped |
| 3 | /blog/post-1 | /blog/post-1 | Mapped |
| ... | ... | ... | ... |

### Verification
- [ ] Every source URL has a corresponding new route
- [ ] No pages are marked "Missing" or "TBD"
- [ ] URL structure is logical and consistent
- [ ] Slugs preserved where possible for SEO continuity

### Redirects (if URLs changed)
- [ ] 301 redirects configured for every changed URL
- [ ] Redirect map documented
- [ ] Redirects tested (old URL -> new URL works)

---

## Phase 3: Content Diff

For EACH page, compare source vs new:

### Text Content
- [ ] h1 heading matches (or is intentionally improved)
- [ ] h2-h6 headings all present
- [ ] Body paragraphs — content preserved (can be rewritten but same information)
- [ ] Bullet/numbered lists — all items present
- [ ] Quotes or testimonials preserved
- [ ] Statistics or numbers accurate

### Visual Content
- [ ] All images present (or replaced with equivalent/better quality)
- [ ] Image alt text present and meaningful
- [ ] Videos embedded and playing
- [ ] Icons/illustrations present
- [ ] Logos (partner, client, certification) present

### Metadata
- [ ] Page title captures the same intent
- [ ] Meta description captures the same intent
- [ ] OG image set (can be new design)

### CTAs and Links
- [ ] All CTAs present with correct link targets
- [ ] Internal links point to correct new routes
- [ ] External links preserved and working
- [ ] Download links working

---

## Phase 4: Functional Verification

### Forms
For each form on the source site:
- [ ] Form exists on new site at same/equivalent location
- [ ] All form fields present (name, email, phone, message, etc.)
- [ ] Required field validation works
- [ ] Form submission works (test with real data)
- [ ] Success/error states display correctly
- [ ] Email notifications sent to correct recipients
- [ ] CAPTCHA or spam protection in place

### Links
- [ ] All internal links resolve (no 404s)
- [ ] All external links still valid
- [ ] Email links (`mailto:`) use correct addresses
- [ ] Phone links (`tel:`) use correct numbers and format
- [ ] Social media links go to correct profiles

### Downloads
- [ ] All PDFs accessible and downloadable
- [ ] All other downloadable files working
- [ ] File names are clear and descriptive

### Interactive Features
- [ ] Accordions/FAQ sections work
- [ ] Tabs work
- [ ] Sliders/carousels work
- [ ] Modal/popup triggers work
- [ ] Search functionality works (if present on source)
- [ ] Filtering/sorting works (if present on source)
- [ ] Maps embedded and loading (if present on source)

---

## Phase 5: Legal & Identity

### Legal Pages
- [ ] Privacy Policy page present and accessible
- [ ] Terms of Service page present (if on source)
- [ ] Imprint/Impressum present (required for EU businesses)
- [ ] Cookie consent banner functional
- [ ] Cookie policy page present (if separate from privacy)
- [ ] GDPR compliance elements in place (EU sites)

### Company Identity
- [ ] Company name correct everywhere it appears
- [ ] Address matches source (check footer, contact, imprint)
- [ ] Phone number correct
- [ ] Email addresses correct
- [ ] VAT/registration numbers correct (if displayed)
- [ ] Logo matches current branding

### Social Media
- [ ] All social media links present
- [ ] Links go to correct profiles (not broken/old accounts)
- [ ] Social sharing works on blog posts (if applicable)
- [ ] Open Graph images generate correctly when shared

---

## Parity Report Template

After completing all phases, produce:

```markdown
## Content Parity Report

**Source:** {source_url}
**New site:** {new_url}
**Date:** {date}

### Page Count
- Source: {N} pages
- New site: {N} pages
- Missing: {N} pages (list them)

### Content Status
| Page | Text | Images | Links | Forms | Status |
|------|------|--------|-------|-------|--------|
| / | OK | OK | OK | N/A | PASS |
| /about | OK | 1 missing | OK | N/A | FAIL |
| ... | ... | ... | ... | ... | ... |

### Issues Found
1. {specific issue with location}
2. {specific issue with location}
...
```
