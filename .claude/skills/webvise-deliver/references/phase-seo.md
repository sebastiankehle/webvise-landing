# Phase 4: SEO — Detailed Implementation

## Metadata Template

Every page must export `generateMetadata`. Use this template:

```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generateAlternates, localizedUrl } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageName" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/path", locale),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: localizedUrl("/path", locale),
      siteName: "ClientName",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
    },
  };
}
```

### Key Rules

- Every page gets a UNIQUE title and description (no duplicates across pages)
- Open Graph image should be set at the layout level or per-page if different
- `alternates` must include all supported locales with hreflang
- `siteName` uses the client's business name, not "Webvise"

## JSON-LD Patterns

### Homepage: Organization + WebSite + WebPage

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: "ClientName",
          url: "https://client.com",
          logo: "https://client.com/logo.png",
        },
        {
          "@type": "WebSite",
          name: "ClientName",
          url: "https://client.com",
        },
        {
          "@type": "WebPage",
          name: t("meta.title"),
          description: t("meta.description"),
          url: localizedUrl("/", locale),
        },
      ],
    }),
  }}
/>
```

### Content Pages: WebPage + BreadcrumbList

```tsx
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: t("meta.title"),
      description: t("meta.description"),
      url: localizedUrl("/about", locale),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t("meta.title"),
          item: localizedUrl("/about", locale),
        },
      ],
    },
  ],
}
```

### FAQ Sections: FAQPage

```tsx
{
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}
```

### Service Pages: Service

```tsx
{
  "@type": "Service",
  name: t("serviceName"),
  description: t("serviceDescription"),
  provider: {
    "@type": "Organization",
    name: "ClientName",
  },
}
```

## Redirect Configuration

In `next.config.ts`:

```tsx
async redirects() {
  return [
    // Old WordPress slugs to new routes
    { source: "/old-page-slug", destination: "/new-route", permanent: true },
    { source: "/old-page-slug/", destination: "/new-route", permanent: true },

    // WordPress system paths
    { source: "/wp-admin", destination: "/", permanent: false },
    { source: "/wp-admin/:path*", destination: "/", permanent: false },
    { source: "/wp-login.php", destination: "/", permanent: false },
    { source: "/wp-content/:path*", destination: "/", permanent: false },
    { source: "/wp-includes/:path*", destination: "/", permanent: false },

    // Common WordPress patterns
    { source: "/feed", destination: "/", permanent: true },
    { source: "/feed/", destination: "/", permanent: true },
    { source: "/comments/feed", destination: "/", permanent: true },
    { source: "/xmlrpc.php", destination: "/", permanent: false },
  ];
}
```

### Redirect Rules

- Always include both with and without trailing slash
- Old content pages get 301 (permanent) redirects
- WordPress system paths get 302 (temporary) redirects — they are not real content
- Map EVERY old URL from the discover phase to its new route

## Sitemap Template

```tsx
import type { MetadataRoute } from "next";

const BASE_URL = "https://client.com";
const locales = ["en", "de"]; // adjust per project

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/about",
    "/services",
    "/contact",
    "/blog",
    "/privacy",
    "/imprint",
    // List ALL pages here
  ];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url:
        locale === locales[0]
          ? `${BASE_URL}${page}`
          : `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "/" ? "weekly" : "monthly",
      priority: page === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            l === locales[0]
              ? `${BASE_URL}${page}`
              : `${BASE_URL}/${l}${page}`,
          ]),
        ),
      },
    })),
  );
}
```

### Sitemap Rules

- Include EVERY page (cross-reference with discover phase page list)
- Include hreflang alternates for all locales
- Set appropriate changeFrequency and priority
- Homepage gets priority 1, other pages 0.8, legal pages 0.5

## Robots Template

```tsx
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://client.com/sitemap.xml",
  };
}
```

## SEO Verification Checklist

After implementing all SEO elements, verify each item:

### Per-Page Verification

For EVERY page in the site, check:

- [ ] `<title>` tag is unique and descriptive
- [ ] `<meta name="description">` is unique and under 160 characters
- [ ] `og:title`, `og:description`, `og:image`, `og:url` are set
- [ ] `twitter:card`, `twitter:title`, `twitter:description` are set
- [ ] Canonical URL is correct
- [ ] hreflang alternates point to correct locale variants

### Structured Data Verification

- [ ] Homepage has Organization + WebSite JSON-LD
- [ ] Content pages have WebPage + BreadcrumbList JSON-LD
- [ ] FAQ sections have FAQPage JSON-LD
- [ ] JSON-LD validates at schema.org/validator (paste and check)

### Technical SEO Verification

- [ ] `sitemap.xml` loads and includes ALL pages
- [ ] `sitemap.xml` includes correct hreflang alternates
- [ ] `robots.txt` allows indexing of all public pages
- [ ] No duplicate titles across any pages
- [ ] No duplicate descriptions across any pages
- [ ] All old WordPress URLs redirect correctly (test with curl -I)
- [ ] No broken internal links
- [ ] No broken external links
- [ ] No orphan pages (pages not linked from navigation or other pages)

### Redirect Verification

Test each redirect from the redirect map:

```bash
# Test a redirect
curl -I https://client.com/old-page-slug
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://client.com/new-route

# Test WordPress system paths
curl -I https://client.com/wp-admin
# Expected: HTTP/1.1 302 Found (or 308)
# Location: https://client.com/
```
