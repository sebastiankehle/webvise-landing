# SEO Patterns Reference

Exact SEO implementation patterns from the webvise-landing codebase.

## generateMetadata Pattern

Every page exports `generateMetadata` with full i18n support:

```tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generateAlternates, localizedUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

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
      siteName: "Webvise",
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

Key points:
- `params` is `Promise<{ locale: string }>` in Next.js 15+ (must `await`)
- Translation namespace matches the page name
- Meta title/description come from translation files, never hardcoded
- Both OpenGraph and Twitter card metadata are always set

## SEO Utility Functions

From `src/lib/seo.ts`:

```tsx
import { routing } from "@/i18n/routing";

const BASE_URL = "https://webvise.io";

/**
 * Build a locale-aware full URL.
 * Path should not include locale prefix (e.g., "/blog/my-post").
 */
export function localizedUrl(path: string, locale: string): string {
  return locale === routing.defaultLocale
    ? `${BASE_URL}${path}`
    : `${BASE_URL}/${locale}${path}`;
}

/**
 * Generate alternates metadata (canonical + hreflang) for a given path and locale.
 */
export function generateAlternates(path: string, locale: string) {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = localizedUrl(path, loc);
  }
  languages["x-default"] = localizedUrl(path, routing.defaultLocale);

  return {
    canonical: localizedUrl(path, locale),
    languages,
  };
}
```

Key points:
- Default locale gets no prefix (e.g., `https://webvise.io/blog`)
- Non-default locales get prefix (e.g., `https://webvise.io/de/blog`)
- `x-default` always points to default locale URL
- Canonical is locale-specific

## JSON-LD Structured Data

Types used: `Organization`, `WebSite`, `WebPage`, `Service`, `BreadcrumbList`, `FAQPage`.

### Pattern

```tsx
export default async function Page({ params }: Props) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Page Title",
    description: "Page description",
    url: localizedUrl("/path", locale),
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "Webvise",
      url: "https://webvise.io",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  );
}
```

### Organization Schema (used on homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Webvise",
  "url": "https://webvise.io",
  "logo": "https://webvise.io/logo.png",
  "sameAs": ["https://github.com/webvise"]
}
```

### FAQPage Schema (used on service pages)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}
```

### BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://webvise.io" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://webvise.io/services" },
    { "@type": "ListItem", "position": 3, "name": "Web Development" }
  ]
}
```

## Sitemap Pattern

```tsx
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";

const locales = routing.locales;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    "/",
    "/blog",
    "/services/web-development",
    "/services/web-design",
    // ... all static pages
  ];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: localizedUrl(page, locale),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, localizedUrl(page, l)]),
        ),
      },
    })),
  );
}
```

Key points:
- Every page generates one entry per locale
- Each entry includes `alternates.languages` with all locale variants
- Dynamic pages (blog posts) should be fetched and included

## robots.ts Pattern

```tsx
// src/app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://webvise.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

## OG Image Generation

Using `next/og` `ImageResponse` for dynamic Open Graph images:

```tsx
// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Webvise";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a2e",
          color: "#f0f0f0",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.7, marginTop: 20 }}>webvise.io</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

## SEO Checklist for New Pages

1. Export `generateMetadata` with title, description, alternates, openGraph, twitter
2. Add JSON-LD structured data (at minimum `WebPage`)
3. Add the page path to `sitemap.ts`
4. Add translation keys for `meta.title` and `meta.description` in all locale files
5. Use `text-balance` on the primary heading
6. Ensure all images have meaningful `alt` text
7. Use semantic HTML (`<main>`, `<article>`, `<nav>`, `<footer>`)
8. Add `BreadcrumbList` JSON-LD for pages deeper than 1 level
