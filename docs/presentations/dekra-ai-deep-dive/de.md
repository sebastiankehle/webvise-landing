# AI, Agents & AI-Coding-Tools: Ein Deep Dive für die Praxis

**Ein Vortrag von Sebastian Kehle, webvise**
Dauer: 60 Minuten | Zielgruppe: Engineering & IT-Leadership

---

## Über den Referenten

### Sebastian Kehle

Gründer von webvise und AI Engineer bei luca in Berlin. Mein Hintergrund liegt in Design und Kommunikation - über die Jahre bin ich immer tiefer in Softwareentwicklung und Automatisierung eingestiegen.

**Stationen:**

- **webvise** (seit 2016) - Design, Webentwicklung und AI-Automatisierung für Unternehmen
- **luca, Berlin** (seit 2022) - Erst Frontend Engineer, heute AI Engineer. Arbeitet an LLM-basierten Lösungen für die Hospitality-Branche
- **Addisco Education GmbH** (2017-2021) - CEO eines Recruiting-Technologie-Startups mit eigenem Matching-Algorithmus

**Technischer Stack:**

TypeScript, React, Next.js, Node.js, PostgreSQL | OpenAI, Anthropic, Vercel AI SDK, Mastra, n8n | Vercel, Docker, Cloudflare, GitHub, Turborepo

**Warum dieses Thema?**

Was ich heute vorstelle, sind Tools und Workflows, die ich im Alltag einsetze - bei luca, bei webvise-Kunden und in Open-Source-Projekten.

---

## Teil 1: Die AI-Landschaft 2026

### Die drei Wellen der AI-gestützten Softwareentwicklung

**Welle 1: Autocomplete (2021-2023)**
GitHub Copilot brachte AI in den Editor. Zeilenvervollständigung, Funktionsvorschläge, Boilerplate-Generierung. Hilfreich, aber begrenzt. Der Entwickler blieb am Steuer, AI war ein besseres IntelliSense.

**Welle 2: Chat & Copilot (2023-2025)**
ChatGPT, Claude und spezialisierte Coding-Assistenten ermöglichten Konversationen über Code. Entwickler konnten ganze Funktionen beschreiben und generieren lassen. Cursor und Windsurf integrierten AI tief in die IDE. Der Kontext wuchs von einzelnen Dateien auf ganze Projekte.

**Welle 3: Autonome Agents (2025-heute)**
AI-Systeme, die eigenständig planen, Tools nutzen, Code schreiben, testen und deployen. Nicht ein Prompt, eine Antwort - sondern ein Ziel, viele Schritte. Claude Code, Codex CLI und Gemini CLI arbeiten direkt im Terminal, navigieren Codebases, führen Tests aus und erstellen Pull Requests. Das ist der aktuelle Stand.

### Zahlen, die zählen

- **McKinsey (2025):** Entwickler, die AI-Coding-Tools nutzen, sind 20-45% produktiver bei Code-Generierung
- **GitHub (2025):** 55% schnellere Task-Completion mit Copilot in kontrollierten Studien
- **Stack Overflow Survey (2025):** 76% der professionellen Entwickler nutzen AI-Tools, 62% im beruflichen Kontext
- **Gartner (2026):** Bis 2028 werden 75% aller Enterprise-Softwareingenieure AI-Coding-Assistenten nutzen (2024: 10%)

### Was das für Unternehmen bedeutet

Wenn Entwickler 30% produktiver werden, ist das kein marginaler Effekt - das ist ein strategischer Vorteil:

- **Wartungskosten sinken:** Automatisierte Code-Reviews, Bug-Erkennung, Dependency-Updates
- **Time-to-Market verkürzt sich:** Features, die Wochen brauchten, werden in Tagen geliefert
- **Code-Qualität steigt:** AI findet Patterns, die Menschen übersehen - Security-Vulnerabilities, Performance-Issues, Accessibility-Probleme
- **Wissenstransfer beschleunigt sich:** Neue Teammitglieder verstehen Legacy-Code schneller mit AI-Unterstützung

---

## Teil 2: AI Coding Tools im Überblick

### Die wichtigsten Tools 2026

#### GitHub Copilot
- **Typ:** IDE-Integration (VS Code, JetBrains, Neovim)
- **Stärke:** Breiteste Adoption, solide Autocomplete-Qualität
- **Schwäche:** Agent Mode seit 2025, wirkt aber nachträglich angefügt. Für einfache Vervollständigung solide - bei komplexen, mehrstufigen Aufgaben schnell am Limit. Begrenztes Codebase-Verständnis
- **Modelle:** GPT-4o, Claude Sonnet, Gemini (wählbar)
- **Preis:** ab $19/Monat pro Entwickler

#### Cursor
- **Typ:** Fork von VS Code mit nativer AI-Integration
- **Stärke:** Multi-File-Editing, Codebase-Kontext, Composer für komplexe Aufgaben
- **Modelle:** Claude, GPT-4o, eigene Modelle
- **Enterprise:** Cursor for Business mit SSO und Admin-Controls
- **Preis:** ab $20/Monat pro Entwickler

#### Claude Code (CLI)
- **Typ:** Terminal-basierter autonomer Agent
- **Stärke:** Agentic Coding - plant, implementiert, testet autonom. Versteht gesamte Codebase. Arbeitet mit Git, Shell, APIs
- **Modelle:** Claude Opus, Sonnet, Haiku (Anthropic)
- **Enterprise:** API-basiert, selbst-hostbar, volle Kontrolle über Datenflüsse
- **Preis:** API-basiert (Pay-per-Use) oder Max-Abonnement

#### Windsurf (ex-Codeium)
- **Typ:** IDE mit AI-First-Ansatz
- **Stärke:** Flows-System für Multi-Step-Aufgaben, gutes Kontext-Management
- **Modelle:** Eigene und Third-Party-Modelle
- **Preis:** ab $15/Monat pro Entwickler

#### Codex CLI (OpenAI)
- **Typ:** Terminal-basierter Agent
- **Stärke:** OpenAI-Ökosystem, Cloud-Sandbox-Execution
- **Preis:** API-basiert

#### Gemini CLI (Google)
- **Typ:** Terminal-basierter Agent
- **Stärke:** Grosses Kontextfenster (1M+ Tokens), Google-Ökosystem
- **Preis:** Kostenloses Tier verfügbar

### Vergleichsmatrix

| Kriterium | Copilot | Cursor | Claude Code | Windsurf |
|---|---|---|---|---|
| Autonomie-Level | Niedrig-Mittel | Mittel-Hoch | Sehr Hoch | Mittel-Hoch |
| Codebase-Verständnis | Begrenzt | Sehr gut | Exzellent | Gut |
| Multi-File-Editing | Ja | Ja | Ja | Ja |
| Terminal-Integration | Begrenzt | Begrenzt | Nativ | Begrenzt |
| Enterprise-Features | Sehr gut | Gut | API-flexibel | Mittel |
| Offline-fähig | Nein | Nein | Nein* | Nein |
| Compliance-Controls | Gut | Mittel | Hoch | Mittel |

*Claude Code kann mit lokalen MCP-Servern und Proxy-Konfigurationen betrieben werden.

---

## Teil 3: AI Agents - Von Chatbots zu autonomen Systemen

### Was ist ein AI Agent?

Ein AI Agent ist ein System, das:
1. **Ein Ziel versteht** - nicht nur einen einzelnen Prompt
2. **Selbstständig plant** - zerlegt komplexe Aufgaben in Schritte
3. **Tools nutzt** - Dateisystem, APIs, Datenbanken, Browser, Terminal
4. **Iteriert** - prüft Ergebnisse, korrigiert Fehler, versucht alternative Ansätze
5. **Wissen aufbaut** - lernt den Kontext des Projekts, merkt sich Entscheidungen

Das ist fundamental anders als ein Chatbot. Ein Chatbot antwortet auf Fragen. Ein Agent erledigt Aufgaben.

### Model Context Protocol (MCP) - Der Standard für Tool-Integration

MCP ist ein offener Standard (von Anthropic initiiert, breit adoptiert), der definiert, wie AI-Modelle mit externen Tools kommunizieren. Denken Sie an USB-C für AI:

**Vor MCP:**
- Jedes Tool brauchte eine eigene Integration
- Jedes AI-System sprach seine eigene Sprache
- Keine Standardisierung, keine Wiederverwendbarkeit

**Mit MCP:**
- Ein Standard-Protokoll für alle Tools
- Ein MCP-Server kann von jedem kompatiblen AI-Client genutzt werden
- Tools sind austauschbar und kombinierbar

**Praktische Beispiele für MCP-Server:**
- **Datenbank-Server:** AI greift sicher auf PostgreSQL, Redis, Elasticsearch zu
- **Git-Server:** AI versteht Repository-Historie, Branches, PRs
- **Jira/Linear-Server:** AI liest und erstellt Tickets
- **Monitoring-Server:** AI analysiert Grafana-Dashboards, Logs, Alerts
- **Browser-Server:** AI navigiert Webseiten, testet UIs, extrahiert Daten

Für Unternehmen bedeutet das: AI-Agents können in bestehende Infrastruktur integriert werden, ohne dass jedes Tool neu gebaut werden muss. MCP-Server für interne Systeme (CI/CD, Monitoring, Ticket-Systeme) werden einmal gebaut und von allen AI-Tools genutzt.

### Praxisbeispiel: Mein täglicher Workflow

Hier zeige ich, wie ich AI-Agents täglich einsetze - nicht als Demo, sondern als realen Arbeitsprozess.

#### Claude Code als Basis

Claude Code ist mein primäres Entwicklungstool. Es läuft im Terminal und hat Zugriff auf:
- Das gesamte Dateisystem des Projekts
- Git (Commits, Branches, PRs)
- Shell-Kommandos (Tests, Builds, Deployments)
- MCP-Server (Datenbanken, APIs, Browser)

#### oh-my-claudecode (OMC) - Multi-Agent-Orchestrierung

Auf Claude Code setze ich oh-my-claudecode (OMC) ein, eine Orchestrierungsschicht, die spezialisierte Agents koordiniert:

**Verfügbare Agents:**
- **Architect** (Opus) - Strategische Architektur-Entscheidungen, Read-Only
- **Planner** (Opus) - Implementierungs-Planung mit Interview-Workflow
- **Executor** (Sonnet) - Fokussierte Code-Implementierung
- **Code Reviewer** (Opus) - Detaillierte Code-Reviews mit Severity-Rating
- **Security Reviewer** (Sonnet) - OWASP Top 10, Secrets-Detection, unsichere Patterns
- **Test Engineer** (Sonnet) - Test-Strategie, TDD-Workflows
- **Debugger** (Sonnet) - Root-Cause-Analyse, Stack-Trace-Analyse
- **Verifier** (Sonnet) - Evidenz-basierte Completion-Checks
- **Designer** (Sonnet) - UI/UX-Design und Implementation
- **Writer** (Haiku) - Dokumentation, API-Docs, Comments

**Workflow-Beispiel: Feature-Implementierung**

```
1. Anforderung: "Implementiere einen Health-Check-Endpoint für alle Microservices"

2. Planner-Agent analysiert:
   - Bestehende Service-Architektur
   - Vorhandene Health-Check-Patterns
   - Abhängigkeiten und Schnittstellen

3. Architect-Agent reviewt den Plan:
   - Empfiehlt standardisiertes Response-Format
   - Identifiziert kritische Pfade

4. Executor-Agents arbeiten parallel:
   - Agent 1: Implementiert Health-Check-Modul
   - Agent 2: Schreibt Tests
   - Agent 3: Aktualisiert Dokumentation

5. Code-Reviewer prüft:
   - Code-Qualität, Patterns, Edge Cases
   - Security-Implikationen

6. Verifier bestätigt:
   - Tests laufen durch
   - Keine Regressionen
   - Deployment erfolgreich
```

Das ist kein theoretisches Szenario. Das ist mein tatsächlicher Workflow bei webvise-Kundenprojekten.

#### Skills - Wiederverwendbare Agent-Fähigkeiten

Skills sind Markdown-basierte Anweisungen, die Agents spezifische Fähigkeiten verleihen. Sie sind:
- **Portabel** - funktionieren in Claude Code, Cursor, Copilot und 19+ weiteren AI-Tools
- **Versionierbar** - in Git, teilbar über Teams
- **Komponierbar** - Skills können andere Skills aufrufen

**Meine webvise-Skills:**
- **webvise-conventions** - Unsere Tech-Stack-Konventionen, Design-System, Code-Patterns
- **webvise-qa** - 7-Kategorien QA-Audit (Performance, Accessibility, SEO, Responsive, Analytics...)
- **webvise-deliver** - 6-Phasen Delivery-Workflow (Discover, Plan, Build, SEO, QA, Deliver)

**Das skills.sh Ökosystem:**
skills.sh ist ein offener Marktplatz für AI-Agent-Skills. Teams können Skills erstellen, teilen und entdecken. Statt dass jedes Team eigene Prompts schreibt, gibt es eine wachsende Bibliothek wiederverwendbarer Fähigkeiten.

Für ein grosses Unternehmen bedeutet das: Einmal einen "DEKRA-Security-Review-Skill" erstellen, und jeder Entwickler nutzt denselben Standard - unabhängig von IDE oder AI-Tool.

---

## Teil 4: Compliance, Sicherheit & Governance

### Warum dieses Kapitel für DEKRA besonders relevant ist

DEKRA steht für Sicherheit, Qualität und Zertifizierung. Wenn AI-Tools in den Entwicklungsprozess integriert werden, müssen dieselben Standards gelten, die DEKRA bei seinen Kunden prüft. Das ist kein Widerspruch - es ist eine Chance, mit gutem Beispiel voranzugehen.

### EU AI Act - Was bedeutet das für Entwicklungstools?

Der EU AI Act (in Kraft seit August 2024, volle Anwendung ab August 2026) klassifiziert AI-Systeme nach Risiko:

**Minimales Risiko (die meisten AI-Coding-Tools):**
- Code-Autocomplete, Refactoring-Vorschläge, Dokumentations-Generierung
- Keine besonderen Anforderungen, aber Transparenzpflichten

**Begrenztes Risiko (einige Agent-Systeme):**
- AI, die eigenständig Code deployed oder Infrastruktur-Entscheidungen trifft
- Transparenzpflicht: Nutzer müssen wissen, dass sie mit AI interagieren
- Dokumentationspflicht für den AI-Einsatz

**Hohes Risiko (potenziell relevant für DEKRA):**
- AI-Systeme in sicherheitskritischen Anwendungen
- Wenn AI-generierter Code in Prüf- oder Zertifizierungssoftware fliesst
- Erfordert: Risikomanagement, Datenqualität, Transparenz, menschliche Aufsicht, Genauigkeit

**Empfehlung für DEKRA:**
- Klassifizieren Sie Ihre Applikationen nach AI-Act-Risikoklassen
- Definieren Sie, welche Apps AI-gestützt entwickelt werden dürfen und mit welchen Auflagen
- Etablieren Sie ein AI-Governance-Board, das Standards setzt

### DSGVO/GDPR und AI-Coding-Tools

**Die zentrale Frage: Wo gehen die Daten hin?**

Wenn ein Entwickler Code mit einem AI-Tool schreibt, wird Quellcode an den Modell-Anbieter gesendet. Das kann problematisch sein, wenn:
- Der Code personenbezogene Daten enthält (Testdaten, Konfigurationen)
- Der Code proprietäre Geschäftslogik enthält
- Der Anbieter Daten zum Training nutzt (bei den meisten Enterprise-Plänen NICHT der Fall)

**Datenfluss-Analyse der wichtigsten Anbieter:**

| Anbieter | Daten-Training | Datenverarbeitung | DPA verfügbar | EU-Hosting |
|---|---|---|---|---|
| Anthropic (Claude) | Nein (API) | USA, EU-Routing möglich | Ja | In Planung |
| OpenAI | Nein (API/Enterprise) | USA, EU-Option | Ja | Azure EU |
| GitHub Copilot | Nein (Business/Enterprise) | USA | Ja | Nein |
| Google (Gemini) | Nein (API) | Global, EU-Option | Ja | EU verfügbar |

**Empfehlung:**
1. Nutzen Sie API-Zugang (nicht Consumer-Produkte) - keine Trainingsdatennutzung
2. Schliessen Sie Data Processing Agreements (DPA) mit allen Anbietern
3. Implementieren Sie Code-Scanning vor dem Senden an AI-APIs (keine Secrets, keine PII)
4. Prüfen Sie EU-Hosting-Optionen für maximale DSGVO-Konformität

### Lokale Modelle: Die Air-Gap-Option

Für hochsensiblen Code gibt es eine Alternative: Lokale AI-Modelle, die vollständig on-premise laufen.

**Verfügbare lokale Modelle (Stand 2026):**

| Modell | Anbieter | Parameter | Hardware-Anforderung | Coding-Qualität |
|---|---|---|---|---|
| Qwen 2.5 Coder | Alibaba | 7B-32B | 16-64GB RAM | Sehr gut |
| DeepSeek Coder V3 | DeepSeek | 16B-236B | 32GB-128GB+ RAM | Exzellent |
| CodeLlama | Meta | 7B-70B | 16-128GB RAM | Gut |
| StarCoder2 | BigCode | 3B-15B | 8-32GB RAM | Gut |
| Mistral Codestral | Mistral | 22B | 32-64GB RAM | Sehr gut |

**Tools für lokales Deployment:**
- **Ollama** - Einfachstes Setup, läuft auf Mac/Linux/Windows
- **llama.cpp** - Maximale Performance, C++ basiert
- **vLLM** - Production-grade Serving für Teams

**Hybrid-Ansatz (Empfehlung für DEKRA):**
- Lokale Modelle für sicherheitskritischen Code (Prüfsoftware, Zertifizierungssysteme)
- Cloud-APIs für unkritische Entwicklung (Marketing-Websites, interne Tools)
- Klare Richtlinien, welcher Code wohin darf

### Code-Ownership und IP-Fragen

**Wem gehört AI-generierter Code?**

- Die meisten Anbieter (Anthropic, OpenAI, GitHub) übertragen alle Rechte am generierten Output an den Nutzer
- Bei API-Nutzung gibt es keine Lizenz-Einschränkungen
- **Wichtig:** Prüfen Sie die ToS jedes Anbieters für Ihre spezifische Nutzung
- **Empfehlung:** Dokumentieren Sie den AI-Einsatz in Ihrem Entwicklungsprozess (welches Tool, welcher Anteil)

### Audit-Trails und Nachvollziehbarkeit

Für ein Unternehmen wie DEKRA, das selbst Audits durchführt, ist Nachvollziehbarkeit entscheidend:

**Best Practices:**
1. **Git-Integration:** Alle AI-generierten Änderungen gehen durch normale Git-Workflows (Branches, PRs, Reviews)
2. **Co-Author-Tags:** AI-generierte Commits werden markiert (z.B. `Co-Authored-By: Claude`)
3. **Review-Pflicht:** Kein AI-generierter Code geht ohne menschliches Review in Produktion
4. **Logging:** Welches Modell, welcher Prompt, welcher Output - für kritische Systeme dokumentieren
5. **Test-Coverage:** AI-generierter Code muss dieselben (oder höhere) Test-Standards erfüllen

**Tooling für Audit-Trails:**
- Git-Hooks, die AI-Co-Author-Tags erzwingen
- CI/CD-Pipelines, die AI-generierten Code flaggen
- Custom MCP-Server, die AI-Interaktionen loggen

---

## Teil 5: Adoption-Strategie für Enterprise

### Das Crawl-Walk-Run Framework

#### Phase 1: Crawl (Monate 1-3)
**Ziel:** Erfahrung sammeln, Quick Wins identifizieren

- **Pilot-Team:** 5-10 Entwickler aus verschiedenen Teams
- **Tools:** GitHub Copilot oder Cursor (niedrige Einstiegshürde)
- **Use Cases:** Code-Completion, Dokumentation, Unit-Tests
- **Governance:** Basis-Richtlinien für Datenklassifizierung
- **Messung:** Entwickler-Zufriedenheit, Code-Output, Fehlerrate

**Quick Wins:**
- Automatisierte Dokumentationsgenerierung für Legacy-Code
- Test-Coverage erhöhen mit AI-generierten Tests
- Code-Reviews beschleunigen mit AI-Unterstützung
- Dependency-Updates und Security-Patches automatisieren

#### Phase 2: Walk (Monate 4-9)
**Ziel:** Standards etablieren, breiter ausrollen

- **Ausweitung:** 50-100 Entwickler
- **Tools:** Claude Code / Cursor für komplexere Aufgaben, erste MCP-Server
- **Use Cases:** Feature-Entwicklung, Refactoring, Bug-Fixing, CI/CD-Integration
- **Governance:** AI-Coding-Richtlinie, DPA mit Anbietern, Klassifizierung der Apps
- **Skills:** Erste unternehmensspezifische Skills erstellen (Coding-Standards, Review-Checklisten)

**Infrastruktur:**
- MCP-Server für interne Systeme (Jira, CI/CD, Monitoring)
- Proxy-Layer für API-Calls (Logging, Filtering, Rate-Limiting)
- Shared Skills-Repository im internen Git

#### Phase 3: Run (ab Monat 10)
**Ziel:** AI als Standard-Werkzeug für alle Entwickler

- **Ausweitung:** Alle Entwicklungsteams
- **Tools:** Multi-Agent-Workflows, automatisierte Pipelines
- **Use Cases:** Vollständige Feature-Entwicklung, automatisierte QA, Incident-Response
- **Governance:** Vollständiges AI-Governance-Framework, regelmässige Audits
- **Messung:** ROI pro Team, Code-Qualitäts-Metriken, Time-to-Market

### ROI messen

**Quantitative Metriken:**
- Lines of Code pro Entwickler/Sprint (Vorsicht: nicht als alleinige Metrik)
- Time-to-Merge für Pull Requests
- Bug-Rate in AI-unterstütztem vs. traditionellem Code
- Test-Coverage-Verbesserung
- Time-to-Resolution für Incidents

**Qualitative Metriken:**
- Entwickler-Zufriedenheit (NPS)
- Onboarding-Zeit für neue Teammitglieder
- Wissenstransfer bei Legacy-Systemen
- Innovationsrate (neue Features, Experimente)

### Change Management

**Die grössten Hürden:**
1. **"AI ersetzt Entwickler"** - Nein. AI macht Entwickler produktiver. Der Bedarf an guten Entwicklern steigt, weil sie mehr leisten können
2. **"Der Code ist nicht vertrauenswürdig"** - Deshalb: Reviews, Tests, CI/CD. AI-Code wird genauso geprüft wie menschlicher Code
3. **"Compliance ist zu komplex"** - Deshalb: Klare Richtlinien, Klassifizierung, Governance. Schritt für Schritt
4. **"Wir haben Legacy-Code"** - Gerade da hilft AI am meisten. Legacy-Code verstehen, dokumentieren, modernisieren

**Empfehlung:** Champions-Programm. Identifizieren Sie AI-begeisterte Entwickler in jedem Team. Sie werden zu Multiplikatoren und Ansprechpartnern.

---

## Teil 6: Ausblick 2026/2027

### Was kommt als Nächstes?

**Kurzfristig (2026):**
- AI-Agents werden Standard in jeder IDE
- MCP wird zum De-facto-Standard für Tool-Integration
- Lokale Modelle erreichen Cloud-Qualität für viele Use Cases
- Enterprise-Features (SSO, Audit-Logs, Data Residency) bei allen grossen Anbietern

**Mittelfristig (2027):**
- Multi-Agent-Teams als normaler Entwicklungsworkflow
- AI-gestützte Code-Migration im grossen Stil (Legacy-Modernisierung)
- Spezialisierte Branchenmodelle (Automotive, Healthcare, Finance)
- Integrierte Compliance-Checks in AI-Coding-Workflows

**Langfristig:**
- AI als vollwertiges Teammitglied, das eigenständig Features entwickelt, testet und deployed
- Menschliche Entwickler fokussieren sich auf Architektur, Business-Logik und Review
- Die Grenze zwischen "AI-Code" und "menschlichem Code" wird irrelevant

### Empfehlungen für den nächsten Schritt

1. **Starten Sie jetzt.** Die Lernkurve ist flacher als gedacht, aber die Konkurrenz wartet nicht
2. **Starten Sie klein.** Ein Pilot-Team, ein Tool, klare Metriken
3. **Investieren Sie in Governance.** Richtlinien jetzt zu definieren ist einfacher als sie nachträglich einzuführen
4. **Bauen Sie internes Know-how auf.** Skills, MCP-Server, Best Practices - investieren Sie in Wissen, nicht nur in Lizenzen
5. **Messen Sie Ergebnisse.** Was nicht gemessen wird, wird nicht verbessert

---

## Anhang: Ressourcen

### Weiterführende Artikel (webvise Blog)

- "Best Local AI Models for Compliant Businesses in 2026"
- "How AI Agents Are Transforming Business Automation in 2026"
- "AI Tools Every Small Business Should Be Using in 2026"
- "How We Use AI to Build Better Software, Faster"
- "AI Regulations and Certifications in Germany/Europe"
- "What Is the Model Context Protocol (MCP)"
- "AI Agent Skills Directory"

### Offizielle Dokumentation

- **Claude Code:** claude.ai/claude-code
- **Model Context Protocol:** modelcontextprotocol.io
- **skills.sh:** skills.sh
- **EU AI Act:** artificialintelligenceact.eu
- **oh-my-claudecode:** github.com/anthropics/claude-code (Community-Plugin)

### Kontakt

**Sebastian Kehle**
sebastian.kehle@webvise.io
webvise.io | sebastiankehle.com
LinkedIn: linkedin.com/in/sebastiankehle
GitHub: github.com/sebastiankehle

---

*Dieses Dokument wurde erstellt von webvise - Design, Entwicklung und AI-Automatisierung für digitale Produkte.*
