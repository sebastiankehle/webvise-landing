# Open Questions

## Marketing Site Rebuild - 2026-03-06

- [ ] **Cal.com username/link** — What is the Cal.com booking URL to embed? (e.g., `cal.com/webvise/consultation`) This is needed for the embed component in Step 5.
- [ ] **Resend sender domain** — Which verified domain/email should Resend send from? (e.g., `hello@webvise.io`) Required for the contact form API route.
- [ ] **Contact form recipient** — Which email address should receive contact form submissions? Stored as `CONTACT_EMAIL_TO` env var.
- [ ] **Testimonial content** — Are there existing client testimonials to use, or should placeholder content be created for launch? Affects Step 3 (testimonials section).
- [ ] **Logo/brand assets** — Is there a Webvise logo (SVG) ready for the marketing navbar, or should a text-only logo be used initially?
- [ ] **Service page long-form content** — The spec defines pricing and timelines, but do detailed feature descriptions and process steps exist for each service, or should the executor draft them?
- [ ] **Legal pages** — Are Privacy Policy and Imprint/Terms pages needed at launch? The footer will link to them but the pages are not in scope.
- [ ] **Open Graph images** — Should OG images be created for social sharing, or defer to a later iteration?
- [ ] **Analytics** — Is any analytics provider (Plausible, Vercel Analytics, etc.) desired at launch, or deferred?
