# Deep Interview Spec: Webvise Marketing Site Rebuild

## Metadata
- Interview ID: di-webvise-clone-001
- Rounds: 10
- Final Ambiguity Score: 15.5%
- Type: brownfield
- Generated: 2026-03-06
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.90 | 35% | 0.315 |
| Constraint Clarity | 0.82 | 25% | 0.205 |
| Success Criteria | 0.82 | 25% | 0.205 |
| Context Clarity | 0.80 | 15% | 0.120 |
| **Total Clarity** | | | **0.845** |
| **Ambiguity** | | | **15.5%** |

## Goal
Rebuild the webvise.io marketing website within the existing `apps/web` Next.js app, restyled with peec.ai's minimalist monochrome design language. Include all current sections (modernized), 5 detailed service subpages, a contact form (Resend), embedded booking (Cal.com), and i18n infrastructure for future multilingual support. Launch in English only.

## Site Architecture

### Pages
```
/ (homepage - all sections)
/services/branding-design
/services/full-stack-development
/services/automation-ai
/services/ai-seo (NEW)
/services/website-redesign (NEW)
```

### Homepage Sections (modernized from webvise.io)
1. **Hero** — "Design. Development. Automation." headline with CTAs
2. **Tech Stack** — Logo grid of technologies used
3. **Benefits** — Three value propositions (2-4 week launch, future-proof, fast sites)
4. **Metrics** — Key results/statistics
5. **Services** — Overview cards for all 5 services linking to subpages
6. **Process** — 5-stage approach (Discovery, Planning, Execution, Optimization, Launch)
7. **Testimonials** — Client success stories
8. **Pricing** — AI-era adjusted pricing for all 5 services
9. **Contact** — Form (Resend) + Cal.com booking embed
10. **FAQ** — Expandable sections (General, Technical, Investment)

### Service Subpages (peec.ai style — minimal, typography-focused)
Each service page includes:
- Service title + concise description
- Key deliverables / what's included
- Approach / methodology (brief)
- Pricing
- CTA to book consultation

### Services & AI-Era Pricing
| Service | Current Price | New Price | Timeline |
|---------|-------------|-----------|----------|
| Branding & Design | From €5,000 | From €2,500 | 1-3 weeks |
| Full-Stack Development | From €10,000 | From €5,000 | 2-6 weeks |
| Automation & AI | From €7,500 | From €3,500 | 2-4 weeks |
| AI SEO (NEW) | N/A | From €1,500 | 1-2 weeks |
| Website Redesign (NEW) | N/A | From €3,000 | 2-4 weeks |

*Rationale: AI tooling (Cursor, Claude, Copilot) has roughly halved development time for skilled engineers. Prices reflect this productivity gain while maintaining quality positioning.*

## Constraints

### Design System (peec.ai aesthetic)
- **Color palette**: Black (#000), white (#fff), light gray (#f7f7f7), dark gray (#595959), accent (#6d6d6d)
- **Typography**: Geist (primary, weights 100-900), Inter (body/UI), Geist Mono (code/technical)
- **Layout**: Max-width 1200px container, 2-column grid on desktop, single-column mobile
- **Spacing**: 40px and 80px vertical rhythm, padding multiples of 10/20/40/80
- **Visual style**: No gradients, no glassmorphism, no colorful accents. Subtle opacity effects (0.5-0.52) for secondary text. Gradient borders (#525252) for refined separation.
- **Dark/light mode**: Support both (monochrome palette works for both)
- **Navigation**: Sticky header, 80px height, clean horizontal menu

### Technical Constraints
- **Framework**: Next.js 16 (App Router) within existing `apps/web`
- **Styling**: Tailwind CSS (already configured)
- **Components**: shadcn/ui (already installed)
- **i18n**: next-intl or similar — set up infrastructure with English content, easy to add languages later
- **Contact form**: Resend API for email delivery
- **Booking**: Cal.com embed widget
- **No backend changes**: Marketing pages are static/SSG, no tRPC or database changes needed
- **Coexist with dashboard**: Marketing routes at /, /services/*. Existing /dashboard, /login, /todos remain untouched.

### Non-Goals
- No CMS or admin panel for content editing
- No blog section
- No e-commerce or payment processing
- No user authentication on marketing pages
- No German or other language content (just infrastructure)
- No changes to existing dashboard/auth/todos functionality

## Acceptance Criteria
- [ ] Homepage renders all 10 sections with modernized content
- [ ] 5 service subpages accessible and styled consistently
- [ ] Design matches peec.ai aesthetic: monochrome, Geist typography, generous spacing, minimal
- [ ] Contact form sends emails via Resend API
- [ ] Cal.com booking widget embedded and functional
- [ ] i18n infrastructure in place (next-intl or equivalent) — adding a new language requires only translation files
- [ ] Responsive design: mobile, tablet, desktop breakpoints
- [ ] Dark/light mode toggle works with monochrome palette
- [ ] Existing dashboard/auth/todos pages still work without regression
- [ ] All 5 service prices reflect AI-era adjusted pricing
- [ ] Site achieves 90+ Lighthouse performance score
- [ ] Navigation includes all pages with smooth scrolling for homepage sections

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| Clone means exact copy | Asked if 1:1 or modified | All sections modernized + new subpages |
| Separate app needed | Asked about architecture | Single app, add routes to apps/web |
| Keep current brand colors | Contrarian: abandon brand for monochrome? | Full peec.ai monochrome committed |
| Need German immediately | Asked i18n scope | English-only launch, infrastructure ready |
| Phased delivery OK | Simplifier: MVP first? | No, full site delivery required |
| Fixed pricing carried over | Asked about pricing | AI-era adjusted (roughly 50% lower) |
| Backend needed for forms | Asked form handling | External services: Resend + Cal.com |

## Technical Context

### Existing Codebase (brownfield)
- **Monorepo**: pnpm workspace with `apps/web`, `packages/{api,auth,db,env,config}`
- **apps/web**: Next.js 16 + React 19 + Tailwind CSS + shadcn/ui
- **Existing routes**: `/dashboard`, `/login`, `/todos`, `/ai`, API routes for auth/trpc/ai
- **Components**: shadcn/ui primitives (button, card, input, label, checkbox, dropdown, skeleton, sonner)
- **Styling**: Tailwind CSS with PostCSS, dark mode via theme-provider
- **State**: tRPC client configured, auth via better-auth

### New Dependencies Needed
- `next-intl` — i18n framework for Next.js App Router
- `@fontsource/geist` or next/font — Geist typography
- `resend` — email API for contact form
- `@calcom/embed-react` — Cal.com booking widget

## Ontology (Key Entities)
| Entity | Fields | Relationships |
|--------|--------|---------------|
| Service | name, slug, description, price, timeline, deliverables, tools | Has subpage, appears in pricing |
| Testimonial | author, role, company, quote, avatar | Displayed on homepage |
| FAQ | question, answer, category | Grouped by category on homepage |
| ContactSubmission | name, email, company, budget, message | Sent via Resend, not stored |
| Translation | locale, namespace, key, value | Powers i18n for all content |

## Interview Transcript
<details>
<summary>Full Q&A (10 rounds)</summary>

### Round 1
**Q:** Should this marketing site be a separate app in your monorepo (e.g. apps/marketing) or should it replace/extend the existing apps/web?
**A:** Add routes to apps/web. Shouldn't be a monorepo split.
**Ambiguity:** 66.5% (Goal: 0.45, Constraints: 0.20, Criteria: 0.15, Context: 0.60)

### Round 2
**Q:** When you say 'clone webvise.io', do you want an exact 1:1 copy or modified content?
**A:** All sections but improve and modernize them. Deep subpages for services in detail. New services too.
**Ambiguity:** 62.2% (Goal: 0.55, Constraints: 0.20, Criteria: 0.15, Context: 0.65)

### Round 3
**Q:** What new services do you want to add?
**A:** AI SEO, website redesign/remake. Everything a bit cheaper than current.
**Ambiguity:** 55.7% (Goal: 0.70, Constraints: 0.25, Criteria: 0.15, Context: 0.65)

### Round 4 (Contrarian Mode)
**Q:** Are you ready to fully abandon current brand identity for stark monochrome?
**A:** Full peec.ai monochrome.
**Ambiguity:** 48.2% (Goal: 0.70, Constraints: 0.55, Criteria: 0.15, Context: 0.65)

### Round 5
**Q:** Which languages and how should language switching work?
**A:** English only + i18n ready.
**Ambiguity:** 42.5% (Goal: 0.70, Constraints: 0.75, Criteria: 0.15, Context: 0.70)

### Round 6 (Simplifier Mode)
**Q:** Would a single-page MVP be a valid first milestone?
**A:** No, need full site at once.
**Ambiguity:** 35.5% (Goal: 0.72, Constraints: 0.75, Criteria: 0.40, Context: 0.70)

### Round 7
**Q:** What content depth for service subpages?
**A:** Like peec.ai service pages — minimal, typography-focused, clean.
**Ambiguity:** 30.8% (Goal: 0.82, Constraints: 0.75, Criteria: 0.45, Context: 0.70)

### Round 8
**Q:** What functional features beyond static content?
**A:** Contact form + booking.
**Ambiguity:** 25.2% (Goal: 0.85, Constraints: 0.75, Criteria: 0.60, Context: 0.75)

### Round 9
**Q:** Pricing specifics?
**A:** Come up with new prices based on how easy things are with AI now.
**Ambiguity:** 20.0% (Goal: 0.88, Constraints: 0.78, Criteria: 0.72, Context: 0.78)

### Round 10
**Q:** Contact form backend — existing tRPC or external services?
**A:** External services only (Resend + Cal.com).
**Ambiguity:** 15.5% (Goal: 0.90, Constraints: 0.82, Criteria: 0.82, Context: 0.80)

</details>
