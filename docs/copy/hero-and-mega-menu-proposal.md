# Hero + Mega Menu Copy Proposal (all 7 locales)

Positioning the hero must carry: custom systems (not websites), AI-native build → **weeks not months**, senior-led. The reworked DE copy is the tone benchmark: concrete examples first, speed claim last, no feature lists.

**Hero strategy:**
- Line 1 = what you get (custom software), line 2 (`<brand>`) = the brand triad.
- EN keeps the verb-triad ("designed, built, and automated") — it's the tagline in sentence form.
- DE/NL keep the English "Design. Development. Automation." — standard in those markets.
- ES/IT/PL get first-person verb triads ("We design. We build. We automate.") — the native agency register in those languages.
- FR gets the noun triad — English taglines read poorly in FR marketing (and Toubon law).
- All subtitles adopt the DE pattern: "Internal tool, client portal, dashboard, or AI workflow: webvise takes your system into production in weeks, not months."

---

## 1. Hero copy

### EN (`hero`)
```json
{
  "title": "Custom software,<br></br><brand>designed, built, and automated.</brand>",
  "subtitle": "Whether it's an internal tool, client portal, dashboard, or AI workflow — webvise takes your system into production in weeks, not months.",
  "cta": "Discuss your project",
  "ctaSecondary": "Explore systems"
}
```
Title and CTAs unchanged. Subtitle: drop the double "builds … built" list-sentence, mirror the DE rhythm.

### DE — keep as-is
The reworked DE hero is the strongest of the seven. No changes.

### ES
```json
{
  "title": "Software a medida.<br></br><brand>Diseñamos. Desarrollamos. Automatizamos.</brand>",
  "subtitle": "Herramienta interna, portal de clientes, panel de control o workflow de IA: webvise pone su sistema en producción en semanas, no en meses.",
  "cta": "Hablemos de su proyecto",
  "ctaSecondary": "Explorar sistemas"
}
```
Was: a literal participle chain ("diseñado, desarrollado y automatizado") + a 35-word list subtitle. First-person verbs are the native Spanish agency register; "Hablemos de su proyecto" is warmer than the infinitive "Hablar del proyecto".

### FR
```json
{
  "title": "Logiciel sur mesure.<br></br><brand>Conception. Développement. Automatisation.</brand>",
  "subtitle": "Outil interne, portail client, dashboard ou workflow IA : webvise met votre système en production en quelques semaines, pas en plusieurs mois.",
  "cta": "Parlons de votre projet",
  "ctaSecondary": "Explorer les systèmes"
}
```
Noun triad over participle agreement gymnastics ("conçus, développés et automatisés"). "Parlons de votre projet" matches the "Let's talk" energy.

### IT
```json
{
  "title": "Software su misura.<br></br><brand>Progettiamo. Sviluppiamo. Automatizziamo.</brand>",
  "subtitle": "Strumento interno, portale clienti, dashboard o workflow AI: webvise porta il vostro sistema in produzione in poche settimane, non in mesi.",
  "cta": "Parliamo del progetto",
  "ctaSecondary": "Esplora i sistemi"
}
```
Uses "voi" (see Lei→voi fix below).

### NL
```json
{
  "title": "Maatwerksoftware.<br></br><brand>Design. Development. Automation.</brand>",
  "subtitle": "Interne tool, klantportaal, dashboard of AI-workflow: webvise brengt uw systeem in weken naar productie — niet in maanden.",
  "cta": "Project bespreken",
  "ctaSecondary": "Systemen bekijken"
}
```
English brand triad reads native in the NL tech market (mirrors DE). CTAs unchanged — Dutch infinitive buttons are the convention.

### PL
```json
{
  "title": "Oprogramowanie szyte na miarę.<br></br><brand>Projektujemy. Budujemy. Automatyzujemy.</brand>",
  "subtitle": "Narzędzie wewnętrzne, portal klienta, dashboard czy workflow AI: webvise wdraża Państwa system na produkcję w kilka tygodni, nie miesięcy.",
  "cta": "Porozmawiajmy o projekcie",
  "ctaSecondary": "Zobacz systemy"
}
```
"Szyte na miarę" (tailor-made) is the natural Polish idiom; "na zamówienie" sounds like ordering merchandise. "Porozmawiajmy o projekcie" beats the bare imperative "Omów projekt".

---

## 2. Mega menu retranslations

Keys covered: `nav.*`, `customSystems.{title,subtitle,detailLink,items.*}`, `services.{title,subtitle,viewAll,*.title,*.tagline}`, `caseStudies.{title,subtitle,viewAll}`, `blog.{title,subtitle,viewAll,minRead}`, `pricing.{title,subtitle,secondaryCta,tiers.*}`.
Only changed strings are listed; everything not listed stays as-is.

### EN (source polish)

| Key | Proposed | Why |
|---|---|---|
| `services.subtitle` | "Landing page, WordPress migration, AI workflow, or full-stack application — design, engineering, and automation in one delivery process, all the way to production." | Mirrors the tightened DE version; current is one 38-word sentence. |

### DE (already reworked — two light touches)

| Key | Current → Proposed | Why |
|---|---|---|
| `pricing.tiers.focused.name` | "Fokussierter Build" → "Fokussiertes Projekt" | "Build" as a German noun is dev jargon; buyers read "Projekt". |
| `customSystems.items.internalTools.description` | "…Nutzer und Operations brauchen." → "…Nutzer und den laufenden Betrieb brauchen." | "Operations" is scale-up Denglisch; "laufender Betrieb" is what a Mittelstand buyer says. |

### ES

| Key | Current → Proposed | Why |
|---|---|---|
| `nav.bookCall` | "Reservar llamada" → "Hablemos" | EN is "Let's talk" — the current string translates a different button. |
| `caseStudies.title` | "Casos de estudio" → "Casos de éxito" | "Caso de estudio" is an anglicism; "casos de éxito" is *the* Spanish B2B term. |
| `caseStudies.viewAll` | → "Ver todos los casos de éxito" | Follows title. |
| `customSystems.title` | "Sistemas a medida para trabajo real" → "Sistemas a medida para el trabajo real" | Missing article — bare "para trabajo real" is calqued. |
| `customSystems.subtitle` | → "Paneles, portales, automatizaciones y aplicaciones en las que su equipo trabaja a diario. Diseñados en torno a sus procesos reales y conectados con las herramientas que ya utiliza, para que el software se adapte a su forma de trabajar, y no al revés." | Drops the doubled opener ("Software de negocio para flujos de trabajo reales:"); "en torno a" instead of the calque "alrededor de". |
| `customSystems.items.internalTools.title` | "Herramientas internas y dashboards" → "Herramientas internas y paneles de control" | Title says "dashboards", its own description says "paneles" — unify on "paneles". |
| `customSystems.items.websiteApps.title` | "Modernización de sitio web a aplicación" → "De sitio web a aplicación" | Shorter, natural (matches IT/PL pattern). |
| `pricing.title` | "Alcance definido alrededor del sistema que necesita." → "El alcance se define en torno al sistema que necesita." | "alrededor de" → "en torno a"; full sentence reads native. |
| `pricing.subtitle` | "…alrededor del flujo de trabajo…" → "…en torno al flujo de trabajo, los usuarios, las integraciones, el modelo de datos, los requisitos de IA y el soporte tras el lanzamiento." | Same calque fix; "tras el lanzamiento" tighter than "necesario después del lanzamiento". |
| `blog.subtitle` | "Perspectivas sobre…" → "Artículos sobre desarrollo web moderno, rendimiento y cómo construir mejores productos digitales." | "Perspectivas" is a calque of "insights". |

### FR

| Key | Current → Proposed | Why |
|---|---|---|
| `nav.getStarted` | "Commencer" → "Démarrer un projet" | Bare "Commencer" is weak as a CTA. |
| `nav.bookCall` | "Réserver un appel" → "Parlons-en" | EN is "Let's talk"; "Parlons-en" is the native equivalent. |
| `nav.caseStudies` | "Études de cas" → "Réalisations" | EN nav says "Work"; "Réalisations" is the standard French agency nav label. Keep "Études de cas" as the section/page title. |
| `customSystems.subtitle` | → "Dashboards, portails, automatisations et applications dans lesquels votre équipe travaille vraiment, au quotidien. Conçus autour de vos processus réels et connectés aux outils que vous utilisez déjà — pour que le logiciel s'adapte à votre façon de travailler, et non l'inverse." | Drops the doubled opener ("Du logiciel métier pour des workflows réels :"). |
| `services.items.mvpDevelopment.tagline` | "De l'idée à de vrais utilisateurs en 3 semaines." → "De l'idée aux premiers utilisateurs en 3 semaines." | "à de vrais utilisateurs" is clunky. |
| `services.items.fullStackApps.tagline` | "Du logiciel façonné autour de vos opérations, pas un template tordu pour faire l'affaire." → "Du logiciel pensé pour votre activité, pas un template bricolé." | "tordu pour faire l'affaire" is awkward; "bricolé" is the native word for a hacked-together template. |

### IT — main fix: kill the "Lei" form

`customSystems` already speaks "voi" ("il vostro modo di lavorare") while the service taglines and pricing use stiff capitalized "Lei" ("La Sua", "Le serve", "Racconti"). Modern Italian B2B uses "voi" in prose; short imperative CTAs ("Inizia ora", "Prenota una call") are conventional and can stay.

| Key | Current → Proposed | Why |
|---|---|---|
| `nav.contact` | "Contatto" → "Contatti" | Italian sites use the plural. |
| `services.items.landingPages.tagline` | "La Sua prossima idea…" → "La vostra prossima idea, online in pochi giorni." | Lei → voi. |
| `services.items.aiConsulting.tagline` | → "La vostra roadmap AI, da un ingegnere che la porta in produzione ogni giorno." | Lei → voi. |
| `services.items.aiAutomation.tagline` | → "Il vostro primo agente AI, live in 3 settimane." | Lei → voi. |
| `services.items.fullStackApps.tagline` | "Software modellato sulle operazioni del Suo business." → "Software costruito intorno ai processi della vostra azienda." | Lei → voi; "operazioni del business" is a calque. |
| `pricing.title` | "Ambito definito intorno al sistema che Le serve." → "Un ambito definito intorno al sistema che vi serve." | Lei → voi. |
| `pricing.secondaryCta` | "Racconti quale workflow vuole migliorare" → "Raccontateci quale workflow volete migliorare" | Lei → voi. |
| `nav.wpHealthReport` | "Report salute WP" → "Check-up WordPress" | "Check-up" is the native Italian marketing term; "Report salute WP" is a word-for-word stack. |

(`caseStudies.subtitle` "Progetti con nome e cognome…" is excellent — keep.)

### NL

| Key | Current → Proposed | Why |
|---|---|---|
| `nav.bookCall` | "Gesprek boeken" → "Plan een gesprek" | "Boeken" is for hotels and flights; meetings are "gepland". |
| `nav.wpHealthReport` | "WP-gezondheidsrapport" → "WP-healthcheck" | "Gezondheidsrapport" sounds medical; Dutch tech says "healthcheck". |
| `customSystems.subtitle` | → "Dashboards, portalen, automatiseringen en applicaties waar uw team écht in werkt. Gebouwd rond uw werkelijke processen en gekoppeld aan de tools die u al gebruikt — zodat de software zich aanpast aan uw manier van werken, niet andersom." | Drops the doubled opener; "écht" with accent is a native emphasis touch. |
| `customSystems.items.websiteApps.description` | → "Trage WordPress- of statische websites worden snelle Next.js-applicaties, gekoppeld aan formulieren, CRM, analytics, automatiseringen en AI-workflows." | Fixes missing hyphen ("WordPress- of statische") and the imperative calque "Verander…". |
| `services.subtitle` | → "Of het nu gaat om een landingspagina, een WordPress-migratie, een AI-workflow of een full-stack applicatie: webvise combineert design, engineering en automatisering in één proces — tot in productie." | "productierijp deliveryproces" is a calque; "tot in productie" mirrors DE. |
| `caseStudies.subtitle` | "Projecten op naam, met screenshots…" → "Projecten met naam en toenaam: screenshots, scope, stack en wat er is opgeleverd." | "Met naam en toenaam" is the native idiom for "named". |
| `pricing.tiers.focused.name` | "Gerichte build" → "Gericht project" | Same as DE: "build" as noun is jargon. |
| `pricing.tiers.support.description` | "…monitoring, reparaties, verbeteringen…" → "…monitoring, fixes, verbeteringen en workflow-uitbreidingen." | "Reparaties" sounds like plumbing. |
| `blog.minRead` | "min lezen" → "min. leestijd" | Native convention. |

### PL

| Key | Current → Proposed | Why |
|---|---|---|
| `nav.caseStudies` | "Studia przypadków" → "Realizacje" | "Studia przypadków" is academic; "Realizacje" is *the* Polish agency term for "Work". |
| `caseStudies.title` | → "Realizacje" | Follows nav. |
| `caseStudies.viewAll` | → "Zobacz wszystkie realizacje" | Follows title. |
| `caseStudies.subtitle` | "Nazwane projekty ze screenshotami…" → "Konkretne projekty: zrzuty ekranu, zakres, stack i to, co zostało dostarczone." | "Nazwane projekty" is a calque of "named work". |
| `customSystems.title` | "Systemy na zamówienie do realnej pracy" → "Systemy dedykowane do codziennej pracy" | "Dedykowane" is the standard Polish IT term for custom software; "do realnej pracy" is calqued. |
| `customSystems.subtitle` | → "Dashboardy, portale, automatyzacje i aplikacje, w których zespół naprawdę pracuje na co dzień. Wszystko zaprojektowane wokół rzeczywistych procesów i połączone z narzędziami, z których już Państwo korzystają — to oprogramowanie dopasowuje się do Państwa sposobu pracy, nie odwrotnie." | Drops doubled opener; active closing clause. |
| `customSystems.items.internalTools.description` | "Dashboardy na zamówienie i narzędzia…" → "Dedykowane dashboardy i narzędzia administracyjne dla zespołów, które potrzebują jednego niezawodnego miejsca do zarządzania danymi, procesami, użytkownikami i operacjami." | "Dedykowane" + "procesami" instead of "przepływami pracy". |
| `customSystems.items.aiWorkflows.title` | "Przepływy pracy wspierane przez AI" → "Automatyzacja procesów z pomocą AI" | "Przepływy pracy" is a stiff calque — and the file already says "workflow AI" elsewhere; "procesy" is what Polish buyers say. |
| `services.title` | "Usługi stojące za systemami" → "Usługi, z których powstają systemy" | "Stojące za" is a calque of "behind". |
| `services.subtitle` | → "Landing page, migracja z WordPressa, workflow AI czy aplikacja full-stack: webvise łączy design, inżynierię i automatyzację w jeden proces — aż do wdrożenia na produkcję." | Drops the heavy "Niezależnie od tego, czy potrzebują Państwo…" frame. |
| `services.items.mvpDevelopment.title` | "Rozwój MVP" → "Budowa MVP" | "Rozwój" means growth/evolution; building an MVP is "budowa". |
| `pricing.secondaryCta` | "Opisz przepływ pracy do usprawnienia" → "Jaki proces chcą Państwo usprawnić?" | Fixes register clash (informal "Opisz" vs "Państwo" everywhere else) and the "przepływ pracy" calque. |
| `blog.subtitle` | "Spostrzeżenia na temat nowoczesnego tworzenia stron internetowych…" → "Artykuły o nowoczesnym web developmencie, wydajności i budowaniu lepszych produktów cyfrowych." | "Spostrzeżenia" is a calque of "insights"; "tworzenie stron internetowych" is dated. |

---

## Register decisions (kept consistent, flagged for awareness)

- **DE**: Sie · **NL**: u · **PL**: Państwo (with conventional informal imperatives in short CTAs) · **ES**: usted · **FR**: vous · **IT**: voi in prose, imperative CTAs.
- NL "u" → "je" would be the bolder modern choice (Coolblue-style), but that's a site-wide voice decision, not a mega-menu fix.
