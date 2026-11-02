# Märkische Projekt Bau: Fallstudie aktualisieren

Auftrag von Sebastian, 2026-11-02. Arbeitsstatus, Abhängigkeiten und Abschluss gehören in [WEB-485](https://linear.app/webvise-studio/issue/WEB-485). Dieses Dokument beschreibt die Umsetzung im Repository `webvise-landing`.

## Startbedingung

Erst beginnen, wenn WEB-467, WEB-474 und WEB-481 abgeschlossen sind: Sebastian hat die aktuelle Kundenrunde freigegeben, der Stand ist produktiv geprüft und der Kunden-Update-Draft ist gespeichert. Der Versand dieses Drafts ist keine Voraussetzung. Vor Beginn die jüngsten direkten Nutzeranweisungen im Kundenchat `01a19b1d-b854-71a1-bef4-e5f653246918`, Host `local`, lesen. Neue offene Korrekturen gehen vor.

Die Umsetzung findet ausschließlich hier statt:
`/Users/sebastiankehle/Documents/webvise/repos/internals/webvise-landing`.
Das Kundenrepository `/Users/sebastiankehle/Documents/webvise/repos/clients/mpbau-landing` dient als Quelle und wird nicht verändert.

## Ziel und Leser

Die Fallstudie soll Inhabern, Geschäftsführern und Verantwortlichen für Kalkulation oder Büroabläufe ähnlicher Bauunternehmen zeigen, welche konkrete Arbeit webvise übernehmen kann. Ein Leser soll erkennen:

- Welche Probleme vorlagen: ein unpassender Webauftritt und manuelle Arbeit mit Leistungsverzeichnissen beziehungsweise Bauplänen.
- Was tatsächlich geliefert wurde: Website, nachvollziehbare Leistungs- und Projektdarstellung sowie die belegten internen KI-Workflows.
- Welchen Nutzen die Lieferung hat und was weiterhin fachliche Prüfung durch Menschen braucht.
- Mit welchem eigenen Vorhaben er webvise ansprechen kann, etwa einem Website-Relaunch oder einem wiederkehrenden Dokumentenablauf.

Schreibe konkrete, kurze Texte in DE und EN. Nutze die vorhandenen Kontaktwege und Serviceverweise. Kein neues Preispaket, keine Garantie und kein kostenloses Leistungsversprechen erfinden. Kundenakquise ist das Ziel der Seite, kein bereits gemessenes Ergebnis dieses Projekts.

## Quellen vor der Umsetzung

- Aktueller freigegebener Live-Stand: `https://www.maerkischeprojekt.de/`. Domain und Deployment erneut prüfen; der alte Vault-Link `mpbau.vercel.app` ist kein verlässlicher aktueller Übergabelink.
- WEB-467 und WEB-474: gelieferter Umfang und Prüfnachweise der jüngsten Runde.
- Vault: `/Users/sebastiankehle/Documents/webvise/obsidian-vault/wiki/work/webvise/clients/mp-bau.md`.
- Freigaben: `/Users/sebastiankehle/Documents/webvise/obsidian-vault/wiki/work/webvise/operations/business-context/proof.md` und `/Users/sebastiankehle/Documents/webvise/obsidian-vault/wiki/content/public-claims-and-constraints.md`.
- Für konkrete Automationsaussagen die dort verlinkten Workshopquellen und den aktuellen Kunden-Code prüfen. Eine einzelne Vorführung beweist keine allgemeine Genauigkeit oder regelmäßige Nutzung.

## Betroffene Dateien und Namensregel

Die Fallstudie liegt in `apps/web/content/case-studies/mp-bau-construction/de.json` und `en.json`. Das englische JSON liefert auch gemeinsame Metadaten wie `client`, Bildpfade, Leistungen und Lieferzeit für beide Sprachen. Beachte das bestehende Schema in `apps/web/src/data/case-studies.ts`; vorhandene Felder wie `results` nutzen, wenn sie zur Darstellung passen.

Öffentliche Nennungen dieses Kunden auf webvise verwenden **Märkische Projekt Bau**, für den juristischen Namen **Märkische Projekt Bau GmbH**. Prüfe zusätzlich:

- `apps/web/src/messages/de.json` und `en.json`, insbesondere die Unternehmenszuordnung zum Testimonial;
- `apps/web/src/data/services.ts` und daraus erzeugte Servicebezüge;
- `apps/web/src/components/marketing/sections/project-surfaces.tsx`;
- Case-Study-Karten, Überschriften, Fließtexte, Bildbeschreibungen und SEO-/OG-Metadaten;
- vorhandene Blogverweise unter `apps/web/content/blog/`.

Suche nach `MP Bau`, `MP-Bau`, `MPBau` und Varianten. Ändere nur Nennungen dieses Kunden. Bestehende Slugs, URLs, Repositorynamen, Bildpfade und interne Übersetzungsschlüssel dürfen ihre technischen Kennungen behalten. Reale Kundenlogos und belegte Zitate nicht umzeichnen oder still umschreiben. Historische interne Dateien sind kein öffentlicher Umbenennungsauftrag.

## Bilder im bisherigen Format

Aktuelle Bilder liegen unter `apps/web/public/images/case-studies/mp-bau-construction/`. Alle sechs Bildrollen erneuern. Verwende echte Aufnahmen des finalen Website-/Portalstands, keine erfundenen UI-Mockups oder künstlich ergänzten Erfolgsergebnisse.

Sebastian hat für die bestehenden Bilder **Eagle** verwendet; die App ist auf seinem Rechner installiert. Falls Format, Ausschnitt oder Export nicht eindeutig aus den Repo-Dateien hervorgehen, die vorhandenen Bilder und ihre Eigenschaften in Eagle als Referenz prüfen. Eagle ist eine verfügbare Hilfe, keine Pflicht für jeden Arbeitsschritt. Die Originale in der Bibliothek erhalten.

| Datei | Bestehendes Format | Neuer Inhalt |
| --- | --- | --- |
| `hero.webp` | WebP, 1512 × 768 px | Freigegebenes Hero mit Skizze, Rohbau und fertigem Haus |
| `references.webp` | WebP, 1512 × 768 px | Aktuelle Referenz- oder Projektansicht |
| `team.webp` | WebP, 1512 × 768 px | Aktuelle Unternehmens-/Teamansicht |
| `admin-portal.webp` | WebP, 1512 × 768 px | Tatsächlich vorhandener interner Workflow mit geeigneten Beispieldaten |
| `chatbot.webp` | WebP, 1600 × 900 px | Tatsächliche Assistentenansicht im bisherigen Bildzuschnitt |
| `fullpage.webp` | WebP, 1512 px breit | Aktuelle vollständige Seite, Höhe aus dem echten Inhalt |

Bei der Vorbereitung hatte `fullpage.webp` 1512 × 8722 px, während `case-study-lightbox.tsx` noch 1511 × 7061 hinterlegte. Den Eintrag für diese Fallstudie auf die tatsächlichen neuen Maße bringen. Keine anderen Lightbox-Einträge oder gemeinsamen Bildlayouts beiläufig ändern.

Vor Browseraufnahmen `/Users/sebastiankehle/Documents/webvise/repos/lab/browser-harness/SKILL.md` lesen und eine eigene Session verwenden. Öffentliche Seiten dürfen direkt aufgenommen werden. Für das geschützte Portal vorhandenen autorisierten Zugang oder eine lokale Instanz mit Beispieldaten nutzen. Keine Kundendokumente, persönlichen Angaben, Zugangsdaten oder internen Kostenstände veröffentlichen. Zugangsschutz bleibt bestehen. Falls eine Ansicht nicht belegbar erreichbar ist, den konkreten fehlenden Zugang melden und keine Oberfläche erfinden.

Vorhandene Ausschnitte und Rollen beibehalten, Seiten nicht verzerren oder Text abschneiden. Große Ansicht und mobile Karten müssen scharf und lesbar bleiben. WebP-Dateien sinnvoll komprimieren; nur die benötigten Assets ablegen.

## Texte und Nachweise

Challenge, Lösung, Ergebnis und Kontaktanlass müssen zusammenpassen. Beschreibe Leistungen über die konkrete Arbeit des Bauunternehmens; eine Liste von Frameworks oder Modellnamen trägt den Nutzen nicht allein.

Prüfe jede bestehende Aussage vor Übernahme. Besonders betroffen sind `95` Lighthouse, `<1.5s` Ladezeit, die LV-Zeitersparnis, konkrete Modellnamen, die Massenermittlung, `3 weeks + ongoing` und das Kundenzitat. Für Kennzahlen braucht es Quelle, Messkontext und öffentliche Freigabe. Ein vorhandener Marketingtext ist kein Beleg. Unbelegte Kennzahlen oder Zitate weglassen; stattdessen ein nachweisbares Ergebnis beschreiben. Keine Anfragensteigerung, Umsatzwirkung, ROI oder wiederkehrende Betreuung aus der Lieferung ableiten.

Die Trennung bleibt deutlich: öffentliches Website-Erlebnis, geschützter interner Ablauf und fachlich zu prüfendes Ergebnis. Möglichkeiten für ähnliche Firmen als Angebot beschreiben, nicht als bereits bei diesem Kunden umgesetzte Zusatzleistung.

## Abnahme

- DE und EN beschreiben denselben gelieferten Umfang in natürlicher Sprache.
- Alle sechs Bilder zeigen den finalen Stand in den beschriebenen Formaten; Fullpage-Höhe und Lightbox stimmen überein.
- In öffentlichen Texten zu diesem Kunden bleibt keine ungeklärte Kurzform übrig. URLs und technische Verweise funktionieren weiter.
- Jede Ergebnisbehauptung und jedes Zitat hat einen Beleg mit Nutzungsfreigabe oder wurde entfernt. Private Preise und interne Geschäftsdetails bleiben draußen.
- Die Fallstudie erklärt einem ähnlichen Bauunternehmen ein verständliches Problem, eine konkrete Lösung und einen passenden Kontaktanlass.
- Detailseite, Karten, Servicebezüge und Lightbox in DE/EN auf Desktop und Mobil visuell prüfen; aktuelle Bilder, Links, Textumbrüche und Kontaktweg nachweisen.
- Passende Typ-, Lint-, Test- und Buildprüfungen aus den aktuellen Paket-Skripten ausführen. Keine Tests nur für Formulierungen erfinden. Umfangreiche Turbo-Archive mit Entwicklungs-Caches vermeiden.
- Vorschau, geänderte Dateien, Bildmaße, Claim-Prüfung und Prüfergebnisse im Arbeitschat sowie in WEB-485 dokumentieren. Linear-Blocker nach Writes prüfen.

Der Auftrag endet mit einem prüfbaren lokalen Stand. Gemäß Repository-Regel kein Push, PR oder Deployment ohne gesonderten Auftrag. Keine Kundenansprache und keine Änderungen anderer Fallstudien.
