#!/usr/bin/env node
/**
 * Add internal cross-links and external authority links to all blog articles.
 * Based on WEB-25 (articles 1-9) and WEB-30 (articles 10-51) plan specs.
 *
 * Usage: node scripts/add-blog-links.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const BLOG_DIR = join(
	import.meta.dirname,
	"../apps/web/content/blog",
);
const LOCALES = ["en", "de", "fr", "es", "nl", "pl", "it"];
const DRY_RUN = process.argv.includes("--dry-run");

// Helper to build locale-aware URL
function locUrl(locale, path) {
	if (locale === "en") return path;
	return `/${locale}${path}`;
}

// Insert a markdown link into text, wrapping the first occurrence of a keyword/phrase
// Returns [newText, wasInserted]
function insertLink(text, keywords, url) {
	// Skip if text already contains this URL (avoid double-linking)
	if (text.includes(`](${url})`)) return [text, false];

	for (const kw of keywords) {
		// Find keyword not already inside a markdown link
		// We need to avoid matching keywords inside [text](url) patterns
		const idx = findUnlinkedOccurrence(text, kw);
		if (idx !== -1) {
			const before = text.slice(0, idx);
			const match = text.slice(idx, idx + kw.length);
			const after = text.slice(idx + kw.length);
			return [`${before}[${match}](${url})${after}`, true];
		}
	}
	return [text, false];
}

function findUnlinkedOccurrence(text, keyword) {
	const kwLower = keyword.toLowerCase();
	let searchFrom = 0;

	while (searchFrom < text.length) {
		const idx = text.toLowerCase().indexOf(kwLower, searchFrom);
		if (idx === -1) return -1;

		// Check if this occurrence is inside an existing markdown link
		if (!isInsideMarkdownLink(text, idx, idx + keyword.length)) {
			return idx;
		}
		searchFrom = idx + 1;
	}
	return -1;
}

function isInsideMarkdownLink(text, start, end) {
	// Check if position is inside [text](url) pattern
	// Look backwards for an unmatched [
	let bracketDepth = 0;
	for (let i = start - 1; i >= 0; i--) {
		if (text[i] === "]" && i + 1 < text.length && text[i + 1] === "(") {
			// This is a ]( which means we're after a link text close
			return false;
		}
		if (text[i] === "[") {
			// Check if there's a matching ](url) after our position
			const closeIdx = text.indexOf("](", end);
			if (closeIdx !== -1) {
				return true; // We're inside the link text
			}
		}
		if (text[i] === ")") {
			// Check if this closes a markdown link that contains our position
			const linkStart = text.lastIndexOf("](", i);
			if (linkStart !== -1) {
				const textStart = text.lastIndexOf("[", linkStart);
				if (textStart !== -1 && textStart < start) {
					return true; // We're inside the URL portion
				}
			}
		}
	}

	// Also check if we're inside the URL part: ](url)
	const prevCloseBracket = text.lastIndexOf("](", start);
	if (prevCloseBracket !== -1) {
		const closeParen = text.indexOf(")", prevCloseBracket + 2);
		if (closeParen !== -1 && closeParen >= end) {
			return true; // Inside URL portion
		}
	}

	return false;
}

// Try to add a link to an article's blocks
// Returns true if link was added
function addLinkToBlocks(blocks, keywords, url, preferredBlockTypes = ["p"]) {
	// First pass: try preferred block types (paragraphs)
	for (const block of blocks) {
		if (!preferredBlockTypes.includes(block.type)) continue;
		if (!block.text) continue;

		const [newText, inserted] = insertLink(block.text, keywords, url);
		if (inserted) {
			block.text = newText;
			return true;
		}
	}

	// Second pass: try list items
	for (const block of blocks) {
		if (block.type !== "ul" || !block.items) continue;
		for (let i = 0; i < block.items.length; i++) {
			const [newText, inserted] = insertLink(block.items[i], keywords, url);
			if (inserted) {
				block.items[i] = newText;
				return true;
			}
		}
	}

	return false;
}

// ─── LINK SPECIFICATIONS ────────────────────────────────────────────────────
// Each article has internal links and external links.
// Keywords are ordered by priority — more specific first.

const INTERNAL_LINKS = {
	"ai-agents-business-automation": [
		{
			path: "/blog/what-is-model-context-protocol",
			keywords: [
				"Model Context Protocol",
				"MCP",
				"standardized tool interface",
				"standardised tool interface",
				"tool interface",
				"tool calls",
				"standard interface",
				"standardisierte Werkzeugschnittstelle",
				"interfaccia standard",
				"interfaz estándar",
				"interface standard",
				"standaard interface",
				"standardowy interfejs",
			],
		},
		{
			path: "/blog/ai-powered-development-workflow",
			keywords: [
				"AI development",
				"AI-Entwicklung",
				"développement IA",
				"desarrollo IA",
				"AI-ontwikkeling",
				"rozwój AI",
				"sviluppo AI",
				"development workflow",
				"workflow",
				"flusso di lavoro",
				"flujo de trabajo",
				"flux de travail",
				"Arbeitsablauf",
			],
		},
		{
			path: "/services/ai-automation",
			keywords: [
				"automation",
				"Automatisierung",
				"automatisation",
				"automatización",
				"automatisering",
				"automatyzacja",
				"automazione",
			],
		},
	],
	"what-is-model-context-protocol": [
		{
			path: "/blog/ai-agents-business-automation",
			keywords: [
				"AI agents",
				"AI agent",
				"AI assistant",
				"agentes de IA",
				"agente de IA",
				"asistente de IA",
				"agents IA",
				"agent IA",
				"assistant IA",
				"KI-Agenten",
				"KI-Agent",
				"KI-Assistent",
				"AI-agents",
				"AI-agent",
				"AI-assistent",
				"agenci AI",
				"agent AI",
				"asystent AI",
				"agenti AI",
				"agente AI",
				"assistente AI",
			],
		},
		{
			path: "/blog/ai-powered-development-workflow",
			keywords: [
				"development workflow",
				"coding assistant",
				"programming assistant",
				"Entwicklungs-Workflow",
				"Programmierassistent",
				"flux de développement",
				"assistant de programmation",
				"flujo de desarrollo",
				"asistente de programación",
				"ontwikkelingsworkflow",
				"programmeerassistent",
				"workflow programistyczny",
				"asystent programowania",
				"flusso di sviluppo",
				"assistente di programmazione",
				"assistenti di programmazione",
				"assistants de programmation",
				"programming assistants",
				"Programmierassistenten",
			],
		},
		{
			path: "/services/ai-automation",
			keywords: [
				"custom MCP server",
				"servidor MCP personalizado",
				"serveur MCP personnalisé",
				"benutzerdefinierter MCP-Server",
				"aangepaste MCP-server",
				"niestandardowy serwer MCP",
				"server MCP personalizzati",
				"server MCP personalizzato",
			],
		},
	],
	"ai-powered-development-workflow": [
		{
			path: "/blog/ai-agents-business-automation",
			keywords: [
				"AI agents",
				"agentes de IA",
				"agents IA",
				"KI-Agenten",
				"AI-agents",
				"agenci AI",
				"agenti AI",
			],
		},
		{
			path: "/blog/what-is-model-context-protocol",
			keywords: [
				"context management",
				"gestión del contexto",
				"gestion du contexte",
				"Kontextmanagement",
				"contextbeheer",
				"zarządzanie kontekstem",
				"gestione del contesto",
			],
		},
		{
			path: "/services/mvp-development",
			keywords: [
				"weeks instead of months",
				"Wochen statt Monaten",
				"semaines au lieu de mois",
				"semanas en lugar de meses",
				"weken in plaats van maanden",
				"tygodnie zamiast miesięcy",
				"settimane invece che in mesi",
				"rapid delivery",
				"rapide",
				"rápida",
			],
		},
	],
	"how-much-does-a-website-cost": [
		{
			path: "/blog/website-audit-checklist",
			keywords: [
				"audit",
				"Audit",
				"auditoría",
				"audyt",
			],
		},
		{
			path: "/blog/website-performance-for-ecommerce",
			keywords: [
				"performance",
				"Performance",
				"rendimiento",
				"prestazioni",
				"wydajność",
				"ecommerce",
			],
		},
		{
			path: "/blog/google-ads-vs-seo",
			keywords: ["ROI", "marketing investment", "inversión en marketing"],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"custom build",
				"individuelle",
				"personnalisé",
				"personalizado",
				"op maat",
				"na zamówienie",
				"personalizzato",
			],
		},
	],
	"google-ads-vs-seo": [
		{
			path: "/blog/website-audit-checklist",
			keywords: [
				"audit",
				"Audit",
				"auditoría",
				"audyt",
			],
		},
		{
			path: "/blog/how-much-does-a-website-cost",
			keywords: [
				"investment",
				"Investition",
				"investissement",
				"inversión",
				"investering",
				"inwestycja",
				"investimento",
			],
		},
		{
			path: "/blog/email-marketing-vs-website",
			keywords: [
				"email marketing",
				"E-Mail-Marketing",
				"email marketing",
				"marketing por correo",
			],
		},
		{
			path: "/services/seo-performance",
			keywords: ["SEO"],
		},
	],
	"website-audit-checklist": [
		{
			path: "/blog/website-performance-for-ecommerce",
			keywords: [
				"speed",
				"Geschwindigkeit",
				"vitesse",
				"velocidad",
				"snelheid",
				"szybkość",
				"velocità",
				"PageSpeed",
			],
		},
		{
			path: "/blog/google-ads-vs-seo",
			keywords: ["SEO"],
		},
		{
			path: "/blog/how-much-does-a-website-cost",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/services/seo-performance",
			keywords: [
				"professional",
				"professionell",
				"professionnel",
				"profesional",
				"professioneel",
				"profesjonalny",
				"professionale",
			],
		},
	],
	"email-marketing-vs-website": [
		{
			path: "/blog/google-ads-vs-seo",
			keywords: [
				"Google Ads",
				"marketing channels",
				"canaux marketing",
				"canales de marketing",
				"Marketingkanäle",
				"marketingkanalen",
				"kanały marketingowe",
				"canali marketing",
			],
		},
		{
			path: "/blog/website-audit-checklist",
			keywords: ["audit", "Audit", "auditoría", "audyt"],
		},
		{
			path: "/blog/website-performance-for-ecommerce",
			keywords: [
				"speed",
				"Geschwindigkeit",
				"vitesse",
				"velocidad",
				"snelheid",
				"szybkość",
				"velocità",
			],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"conversion",
				"Conversion",
				"conversión",
				"conversie",
				"konwersja",
				"conversione",
			],
		},
	],
	"website-performance-for-ecommerce": [
		{
			path: "/blog/how-much-does-a-website-cost",
			keywords: [
				"investment",
				"Investition",
				"investissement",
				"inversión",
				"investering",
				"inwestycja",
				"investimento",
				"cost",
				"Kosten",
				"coût",
				"coste",
			],
		},
		{
			path: "/blog/website-audit-checklist",
			keywords: ["audit", "Audit", "auditoría", "audyt"],
		},
		{
			path: "/blog/multilingual-website-guide",
			keywords: [
				"international",
				"multilingual",
				"mehrsprachig",
				"multilingue",
				"multilingüe",
				"meertalig",
				"wielojęzyczny",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: ["WooCommerce", "WordPress"],
		},
	],
	"multilingual-website-guide": [
		{
			path: "/blog/website-performance-for-ecommerce",
			keywords: [
				"speed",
				"Geschwindigkeit",
				"vitesse",
				"velocidad",
				"snelheid",
				"szybkość",
				"velocità",
				"performance",
			],
		},
		{
			path: "/blog/how-much-does-a-website-cost",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/website-audit-checklist",
			keywords: ["audit", "Audit", "auditoría", "audyt", "checklist"],
		},
		{
			path: "/services/seo-performance",
			keywords: ["SEO"],
		},
	],
	// Articles 10-51
	"website-not-generating-leads": [
		{
			path: "/blog/website-copywriting-tips",
			keywords: [
				"value proposition",
				"Wertversprechen",
				"proposition de valeur",
				"propuesta de valor",
				"waardepropositie",
				"propozycja wartości",
				"proposta di valore",
				"messaging",
				"copy",
			],
		},
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"speed",
				"load time",
				"Ladezeit",
				"temps de chargement",
				"tiempo de carga",
				"laadtijd",
				"czas ładowania",
				"tempo di caricamento",
			],
		},
		{
			path: "/blog/signs-your-website-needs-redesign",
			keywords: [
				"redesign",
				"Redesign",
				"refonte",
				"rediseño",
				"herontwerp",
				"redesign",
				"ridisegnare",
			],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"conversion",
				"Conversion",
				"conversión",
				"conversie",
				"konwersja",
				"conversione",
			],
		},
	],
	"react-vs-wordpress-2026": [
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["Next.js", "WordPress"],
		},
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
				"hidden",
			],
		},
		{
			path: "/blog/wordpress-site-speed",
			keywords: ["PageSpeed", "speed", "Geschwindigkeit"],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
	],
	"website-maintenance-costs": [
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"hidden cost",
				"versteckte Kosten",
				"coûts cachés",
				"costes ocultos",
				"verborgen kosten",
				"ukryte koszty",
				"costi nascosti",
				"TCO",
			],
		},
		{
			path: "/blog/wordpress-security-risks",
			keywords: [
				"security",
				"Sicherheit",
				"sécurité",
				"seguridad",
				"beveiliging",
				"bezpieczeństwo",
				"sicurezza",
				"hack",
			],
		},
		{
			path: "/blog/wordpress-vs-custom-development",
			keywords: [
				"custom",
				"individuell",
				"personnalisé",
				"personalizado",
				"maatwerk",
				"niestandardowy",
				"personalizzato",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
				"alternative",
			],
		},
	],
	"local-seo-for-small-business": [
		{
			path: "/blog/google-business-profile-guide",
			keywords: [
				"Google Business Profile",
				"Google Business",
				"GBP",
			],
		},
		{
			path: "/blog/seo-basics-small-business",
			keywords: ["SEO"],
		},
		{
			path: "/blog/seo-mistakes-small-businesses",
			keywords: [
				"mistakes",
				"Fehler",
				"erreurs",
				"errores",
				"fouten",
				"błędy",
				"errori",
			],
		},
		{
			path: "/services/seo-performance",
			keywords: [
				"professional",
				"professionell",
				"professionnel",
				"profesional",
				"professioneel",
				"profesjonalny",
				"professionale",
			],
		},
	],
	"squarespace-website-problems": [
		{
			path: "/blog/wordpress-alternatives-small-business-2026",
			keywords: [
				"alternative",
				"Alternative",
				"alternativa",
				"alternatief",
				"alternatywa",
			],
		},
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"conversion",
				"Conversion",
				"conversión",
				"conversie",
				"konwersja",
				"conversione",
				"performance",
			],
		},
		{
			path: "/blog/landing-page-vs-full-website",
			keywords: [
				"landing page",
				"Landingpage",
				"page de destination",
				"página de aterrizaje",
				"landingspagina",
				"landing page",
			],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"custom",
				"individuell",
				"personnalisé",
				"personalizado",
				"op maat",
				"niestandardowy",
				"personalizzato",
				"Next.js",
			],
		},
	],
	"wordpress-vs-custom-development": [
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["Next.js"],
		},
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"hidden cost",
				"versteckte Kosten",
				"coûts cachés",
				"costes ocultos",
				"verborgen kosten",
				"ukryte koszty",
				"costi nascosti",
			],
		},
		{
			path: "/blog/headless-cms-explained",
			keywords: ["headless", "Headless"],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
	],
	"wordpress-security-risks": [
		{
			path: "/blog/wordpress-security-2026",
			keywords: [
				"security",
				"Sicherheit",
				"sécurité",
				"seguridad",
				"beveiliging",
				"bezpieczeństwo",
				"sicurezza",
			],
		},
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/should-i-migrate-wordpress-to-nextjs",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
				"migrate",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
	],
	"what-makes-a-good-business-website": [
		{
			path: "/blog/website-copywriting-tips",
			keywords: [
				"messaging",
				"copy",
				"Botschaft",
				"message",
				"mensaje",
				"boodschap",
				"przekaz",
				"messaggio",
			],
		},
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"speed",
				"performance",
				"Geschwindigkeit",
				"Performance",
				"vitesse",
				"rendimiento",
				"prestazioni",
			],
		},
		{
			path: "/blog/website-audit-checklist",
			keywords: ["audit", "Audit", "checklist"],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"professional",
				"professionell",
				"professionnel",
				"profesional",
				"professioneel",
				"profesjonalny",
				"professionale",
			],
		},
	],
	"website-speed-and-conversions": [
		{
			path: "/blog/website-performance-for-ecommerce",
			keywords: [
				"ecommerce",
				"E-Commerce",
				"e-commerce",
			],
		},
		{
			path: "/blog/website-speed-affects-revenue",
			keywords: [
				"revenue",
				"Umsatz",
				"chiffre d'affaires",
				"ingresos",
				"omzet",
				"przychody",
				"ricavi",
				"fatturato",
			],
		},
		{
			path: "/blog/wordpress-site-speed",
			keywords: ["WordPress"],
		},
		{
			path: "/services/seo-performance",
			keywords: [
				"optimization",
				"Optimierung",
				"optimisation",
				"optimización",
				"optimalisatie",
				"optymalizacja",
				"ottimizzazione",
			],
		},
	],
	"website-redesign-signs": [
		{
			path: "/blog/signs-your-website-needs-redesign",
			keywords: [
				"redesign",
				"Redesign",
				"refonte",
				"rediseño",
				"herontwerp",
				"redesign",
				"ridisegnare",
			],
		},
		{
			path: "/blog/website-redesign-cost-2026",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/website-audit-checklist",
			keywords: ["audit", "Audit", "checklist"],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"redesign",
				"professional",
				"professionell",
			],
		},
	],
	"website-redesign-cost-2026": [
		{
			path: "/blog/website-cost-2026",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/how-much-does-a-website-cost",
			keywords: [
				"pricing",
				"Preise",
				"prix",
				"precios",
				"prijzen",
				"ceny",
				"prezzi",
				"budget",
			],
		},
		{
			path: "/blog/how-to-brief-a-web-agency",
			keywords: [
				"brief",
				"Brief",
				"briefing",
				"scope",
				"Umfang",
				"périmètre",
				"alcance",
			],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"custom",
				"individuell",
				"personnalisé",
				"personalizado",
				"op maat",
				"na zamówienie",
				"personalizzato",
			],
		},
	],
	"website-cost-2026": [
		{
			path: "/blog/how-much-does-a-website-cost",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/website-redesign-cost-2026",
			keywords: [
				"redesign",
				"Redesign",
				"refonte",
				"rediseño",
				"herontwerp",
				"redesign",
				"ridisegnare",
			],
		},
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"hidden",
				"versteckt",
				"caché",
				"oculto",
				"verborgen",
				"ukryty",
				"nascosto",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: ["WordPress"],
		},
	],
	"website-copywriting-tips": [
		{
			path: "/blog/website-not-generating-leads",
			keywords: [
				"leads",
				"Leads",
				"prospects",
				"clientes potenciales",
				"leads",
				"leady",
				"contatti",
				"convert",
			],
		},
		{
			path: "/blog/what-makes-a-good-business-website",
			keywords: [
				"good website",
				"gute Website",
				"bon site",
				"buen sitio",
				"goede website",
				"dobra strona",
				"buon sito",
			],
		},
		{
			path: "/blog/b2b-website-lead-generation",
			keywords: ["B2B"],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"landing page",
				"Landingpage",
				"page de destination",
				"landing page",
			],
		},
	],
	"signs-your-website-needs-redesign": [
		{
			path: "/blog/website-redesign-signs",
			keywords: [
				"signs",
				"Zeichen",
				"signes",
				"señales",
				"signalen",
				"sygnały",
				"segnali",
			],
		},
		{
			path: "/blog/website-redesign-cost-2026",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/website-audit-checklist",
			keywords: ["audit", "Audit", "checklist"],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"rebuild",
				"Neubau",
				"reconstruction",
				"reconstrucción",
				"herbouw",
				"przebudowa",
				"ricostruzione",
			],
		},
	],
	"seo-mistakes-small-businesses": [
		{
			path: "/blog/seo-basics-small-business",
			keywords: ["SEO"],
		},
		{
			path: "/blog/local-seo-for-small-business",
			keywords: [
				"local SEO",
				"lokales SEO",
				"SEO local",
				"lokale SEO",
				"lokalne SEO",
				"SEO locale",
			],
		},
		{
			path: "/blog/google-business-profile-guide",
			keywords: ["Google Business Profile", "Google Business"],
		},
		{
			path: "/services/seo-performance",
			keywords: [
				"professional",
				"professionell",
				"professionnel",
				"profesional",
				"professioneel",
				"profesjonalny",
				"professionale",
			],
		},
	],
	"landing-page-vs-full-website": [
		{
			path: "/blog/how-much-does-a-website-cost",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/website-copywriting-tips",
			keywords: [
				"copy",
				"copywriting",
				"Copywriting",
				"rédaction",
			],
		},
		{
			path: "/blog/google-ads-vs-seo",
			keywords: [
				"Google Ads",
				"paid",
				"organic",
				"organisch",
				"orgánico",
			],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"landing page",
				"Landingpage",
				"page de destination",
				"landing page",
			],
		},
	],
	"how-we-build-websites": [
		{
			path: "/blog/how-to-brief-a-web-agency",
			keywords: [
				"brief",
				"Brief",
				"briefing",
			],
		},
		{
			path: "/blog/how-to-choose-a-web-agency",
			keywords: [
				"agency",
				"Agentur",
				"agence",
				"agencia",
				"bureau",
				"agencja",
				"agenzia",
			],
		},
		{
			path: "/blog/website-redesign-cost-2026",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/case-studies",
			keywords: [
				"case stud",
				"Fallstud",
				"étude de cas",
				"caso de estudio",
				"casestud",
				"studium przypadku",
				"caso studio",
				"client",
				"Kunde",
			],
		},
	],
	"how-to-choose-a-web-agency": [
		{
			path: "/blog/how-to-brief-a-web-agency",
			keywords: [
				"brief",
				"Brief",
				"briefing",
			],
		},
		{
			path: "/blog/how-we-build-websites",
			keywords: [
				"process",
				"Prozess",
				"processus",
				"proceso",
				"proces",
				"proces",
				"processo",
			],
		},
		{
			path: "/blog/website-redesign-cost-2026",
			keywords: [
				"budget",
				"Budget",
				"presupuesto",
				"budżet",
			],
		},
		{
			path: "/case-studies",
			keywords: [
				"portfolio",
				"Portfolio",
				"portafolio",
			],
		},
	],
	"how-to-brief-a-web-agency": [
		{
			path: "/blog/how-to-choose-a-web-agency",
			keywords: [
				"agency",
				"Agentur",
				"agence",
				"agencia",
				"bureau",
				"agencja",
				"agenzia",
			],
		},
		{
			path: "/blog/how-we-build-websites",
			keywords: [
				"process",
				"Prozess",
				"processus",
				"proceso",
				"proces",
				"processo",
			],
		},
		{
			path: "/blog/website-cost-2026",
			keywords: [
				"budget",
				"Budget",
				"presupuesto",
				"budżet",
			],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"custom",
				"individuell",
				"personnalisé",
				"personalizado",
				"op maat",
				"na zamówienie",
				"personalizzato",
			],
		},
	],
	"headless-cms-explained": [
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["WordPress", "Next.js"],
		},
		{
			path: "/blog/wordpress-vs-custom-development",
			keywords: [
				"traditional",
				"traditionell",
				"traditionnel",
				"tradicional",
				"traditioneel",
				"tradycyjny",
				"tradizionale",
			],
		},
		{
			path: "/blog/react-vs-wordpress-2026",
			keywords: ["React"],
		},
		{
			path: "/services/full-stack-applications",
			keywords: ["headless", "Headless"],
		},
	],
	"google-business-profile-guide": [
		{
			path: "/blog/local-seo-for-small-business",
			keywords: [
				"local SEO",
				"lokales SEO",
				"SEO local",
				"lokale SEO",
				"lokalne SEO",
				"SEO locale",
			],
		},
		{
			path: "/blog/seo-basics-small-business",
			keywords: ["SEO"],
		},
		{
			path: "/blog/seo-mistakes-small-businesses",
			keywords: [
				"mistakes",
				"Fehler",
				"erreurs",
				"errores",
				"fouten",
				"błędy",
				"errori",
			],
		},
		{
			path: "/services/seo-performance",
			keywords: [
				"professional",
				"professionell",
				"professionnel",
				"profesional",
				"professioneel",
				"profesjonalny",
				"professionale",
			],
		},
	],
	"b2b-website-lead-generation": [
		{
			path: "/blog/website-not-generating-leads",
			keywords: [
				"leads",
				"Leads",
				"prospects",
				"clientes potenciales",
				"leady",
				"contatti",
			],
		},
		{
			path: "/blog/website-copywriting-tips",
			keywords: [
				"messaging",
				"copy",
				"Botschaft",
				"message",
				"mensaje",
				"boodschap",
				"przekaz",
				"messaggio",
			],
		},
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"speed",
				"Geschwindigkeit",
				"vitesse",
				"velocidad",
				"snelheid",
				"szybkość",
				"velocità",
			],
		},
		{
			path: "/services/landing-pages",
			keywords: [
				"conversion",
				"Conversion",
				"conversión",
				"conversie",
				"konwersja",
				"conversione",
			],
		},
	],
	"website-speed-affects-revenue": [
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"conversion",
				"Conversion",
				"conversión",
				"conversie",
				"konwersja",
				"conversione",
			],
		},
		{
			path: "/blog/website-performance-for-ecommerce",
			keywords: [
				"ecommerce",
				"E-Commerce",
				"e-commerce",
			],
		},
		{
			path: "/blog/wordpress-site-speed",
			keywords: ["WordPress"],
		},
		{
			path: "/services/seo-performance",
			keywords: [
				"optimization",
				"Optimierung",
				"optimisation",
				"optimización",
				"optimalisatie",
				"optymalizacja",
				"ottimizzazione",
			],
		},
	],
	"small-business-ai-tools": [
		{
			path: "/blog/ai-agents-business-automation",
			keywords: [
				"AI agents",
				"agentes de IA",
				"agents IA",
				"KI-Agenten",
				"AI-agents",
				"agenci AI",
				"agenti AI",
			],
		},
		{
			path: "/blog/what-is-model-context-protocol",
			keywords: ["MCP", "Model Context Protocol"],
		},
		{
			path: "/blog/ai-powered-development-workflow",
			keywords: [
				"AI development",
				"AI-Entwicklung",
				"développement IA",
				"desarrollo IA",
			],
		},
		{
			path: "/services/ai-automation",
			keywords: [
				"AI implementation",
				"KI-Implementierung",
				"implémentation IA",
				"implementación IA",
				"AI-implementatie",
				"wdrożenie AI",
				"implementazione AI",
				"automation",
			],
		},
	],
	"seo-basics-small-business": [
		{
			path: "/blog/local-seo-for-small-business",
			keywords: [
				"local SEO",
				"lokales SEO",
				"SEO local",
				"lokale SEO",
				"lokalne SEO",
				"SEO locale",
			],
		},
		{
			path: "/blog/google-business-profile-guide",
			keywords: ["Google Business Profile", "Google Business"],
		},
		{
			path: "/blog/seo-mistakes-small-businesses",
			keywords: [
				"mistakes",
				"Fehler",
				"erreurs",
				"errores",
				"fouten",
				"błędy",
				"errori",
			],
		},
		{
			path: "/services/seo-performance",
			keywords: [
				"professional",
				"professionell",
				"professionnel",
				"profesional",
				"professioneel",
				"profesjonalny",
				"professionale",
			],
		},
	],
	"old-world-labs-case-study": [
		{
			path: "/blog/how-we-build-websites",
			keywords: [
				"process",
				"Prozess",
				"processus",
				"proceso",
				"proces",
				"processo",
			],
		},
		{
			path: "/blog/what-makes-a-good-business-website",
			keywords: [
				"quality",
				"Qualität",
				"qualité",
				"calidad",
				"kwaliteit",
				"jakość",
				"qualità",
			],
		},
		{
			path: "/case-studies",
			keywords: [
				"case stud",
				"Fallstud",
				"étude de cas",
				"caso de estudio",
				"studium przypadku",
				"caso studio",
			],
		},
	],
	"mp-bau-case-study": [
		{
			path: "/blog/local-seo-for-small-business",
			keywords: [
				"local SEO",
				"lokales SEO",
				"SEO local",
				"SEO locale",
			],
		},
		{
			path: "/blog/how-we-build-websites",
			keywords: [
				"process",
				"Prozess",
				"processus",
				"proceso",
				"proces",
				"processo",
			],
		},
		{
			path: "/case-studies",
			keywords: [
				"case stud",
				"Fallstud",
				"étude de cas",
				"caso de estudio",
				"studium przypadku",
				"caso studio",
			],
		},
	],
	"wordpress-vs-nextjs-for-business-website": [
		{
			path: "/blog/react-vs-wordpress-2026",
			keywords: ["React"],
		},
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"hidden cost",
				"versteckte Kosten",
				"coûts cachés",
				"costes ocultos",
				"verborgen kosten",
				"ukryte koszty",
				"costi nascosti",
				"TCO",
			],
		},
		{
			path: "/blog/should-i-migrate-wordpress-to-nextjs",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
				"migrate",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
	],
	"typo3-vs-nextjs-enterprise": [
		{
			path: "/blog/typo3-modernization-guide",
			keywords: [
				"modernization",
				"Modernisierung",
				"modernisation",
				"modernización",
				"modernisering",
				"modernizacja",
				"modernizzazione",
			],
		},
		{
			path: "/blog/headless-cms-explained",
			keywords: ["headless", "Headless"],
		},
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["WordPress"],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"enterprise",
				"Enterprise",
				"entreprise",
				"empresa",
				"onderneming",
				"przedsiębiorstwo",
				"impresa",
			],
		},
	],
	"will-i-lose-seo-rankings-rebuild": [
		{
			path: "/blog/should-i-migrate-wordpress-to-nextjs",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
		{
			path: "/blog/wordpress-to-nextjs-migration-faq",
			keywords: ["FAQ", "questions"],
		},
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"speed",
				"Geschwindigkeit",
				"vitesse",
				"velocidad",
				"snelheid",
				"szybkość",
				"velocità",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"managed migration",
				"migration",
				"Migration",
			],
		},
	],
	"wordpress-alternatives-small-business-2026": [
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["Next.js"],
		},
		{
			path: "/blog/squarespace-website-problems",
			keywords: ["Squarespace"],
		},
		{
			path: "/blog/framer-vs-nextjs-business-website",
			keywords: ["Framer"],
		},
		{
			path: "/blog/webflow-limitations-growing-business",
			keywords: ["Webflow"],
		},
	],
	"framer-website-performance-problems": [
		{
			path: "/blog/framer-vs-nextjs-business-website",
			keywords: ["Framer", "Next.js"],
		},
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"conversion",
				"Conversion",
				"conversión",
				"conversie",
				"konwersja",
				"conversione",
			],
		},
		{
			path: "/blog/wordpress-alternatives-small-business-2026",
			keywords: [
				"alternative",
				"Alternative",
				"alternativa",
				"alternatief",
				"alternatywa",
			],
		},
		{
			path: "/services/full-stack-applications",
			keywords: ["Next.js", "custom"],
		},
	],
	"wordpress-slow-on-mobile": [
		{
			path: "/blog/wordpress-site-speed",
			keywords: ["WordPress", "speed", "PageSpeed"],
		},
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["Next.js"],
		},
		{
			path: "/blog/should-i-migrate-wordpress-to-nextjs",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
			],
		},
	],
	"wordpress-to-nextjs-migration-faq": [
		{
			path: "/blog/should-i-migrate-wordpress-to-nextjs",
			keywords: [
				"decision",
				"Entscheidung",
				"décision",
				"decisión",
				"beslissing",
				"decyzja",
				"decisione",
			],
		},
		{
			path: "/blog/will-i-lose-seo-rankings-rebuild",
			keywords: ["SEO", "ranking"],
		},
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["WordPress", "Next.js"],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
			],
		},
	],
	"framer-vs-nextjs-business-website": [
		{
			path: "/blog/framer-website-performance-problems",
			keywords: ["Framer"],
		},
		{
			path: "/blog/wordpress-alternatives-small-business-2026",
			keywords: [
				"alternative",
				"Alternative",
				"alternativa",
				"alternatief",
				"alternatywa",
			],
		},
		{
			path: "/blog/landing-page-vs-full-website",
			keywords: [
				"landing page",
				"Landingpage",
			],
		},
		{
			path: "/services/full-stack-applications",
			keywords: ["Next.js"],
		},
	],
	"should-i-migrate-wordpress-to-nextjs": [
		{
			path: "/blog/wordpress-to-nextjs-migration-faq",
			keywords: ["FAQ", "questions", "Fragen"],
		},
		{
			path: "/blog/will-i-lose-seo-rankings-rebuild",
			keywords: ["SEO", "ranking"],
		},
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"hidden cost",
				"versteckte Kosten",
				"coûts cachés",
				"costes ocultos",
				"verborgen kosten",
				"ukryte koszty",
				"costi nascosti",
				"TCO",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
			],
		},
	],
	"webflow-to-nextjs-migration": [
		{
			path: "/blog/webflow-limitations-growing-business",
			keywords: ["Webflow"],
		},
		{
			path: "/blog/will-i-lose-seo-rankings-rebuild",
			keywords: ["SEO", "ranking"],
		},
		{
			path: "/blog/headless-cms-explained",
			keywords: ["headless", "Headless"],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"custom",
				"individuell",
				"personnalisé",
				"personalizado",
			],
		},
	],
	"typo3-modernization-guide": [
		{
			path: "/blog/typo3-vs-nextjs-enterprise",
			keywords: ["TYPO3", "Next.js"],
		},
		{
			path: "/blog/headless-cms-explained",
			keywords: ["headless", "Headless"],
		},
		{
			path: "/blog/will-i-lose-seo-rankings-rebuild",
			keywords: ["SEO"],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"enterprise",
				"Enterprise",
				"entreprise",
				"empresa",
			],
		},
	],
	"wordpress-security-2026": [
		{
			path: "/blog/wordpress-security-risks",
			keywords: [
				"vulnerabilit",
				"Schwachstell",
				"vulnérabilit",
				"CVE",
			],
		},
		{
			path: "/blog/hidden-cost-of-wordpress",
			keywords: [
				"cost",
				"Kosten",
				"coût",
				"coste",
				"kosten",
				"koszt",
				"costo",
			],
		},
		{
			path: "/blog/should-i-migrate-wordpress-to-nextjs",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
			],
		},
	],
	"hidden-cost-of-wordpress": [
		{
			path: "/blog/website-maintenance-costs",
			keywords: [
				"maintenance",
				"Wartung",
				"maintenance",
				"mantenimiento",
				"onderhoud",
				"utrzymanie",
				"manutenzione",
			],
		},
		{
			path: "/blog/wordpress-security-2026",
			keywords: [
				"security",
				"Sicherheit",
				"sécurité",
				"seguridad",
				"beveiliging",
				"bezpieczeństwo",
				"sicurezza",
			],
		},
		{
			path: "/blog/wordpress-vs-nextjs-for-business-website",
			keywords: ["Next.js"],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
			],
		},
	],
	"webflow-limitations-growing-business": [
		{
			path: "/blog/webflow-to-nextjs-migration",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
		{
			path: "/blog/framer-vs-nextjs-business-website",
			keywords: ["Framer", "Next.js"],
		},
		{
			path: "/blog/wordpress-alternatives-small-business-2026",
			keywords: [
				"alternative",
				"Alternative",
				"alternativa",
			],
		},
		{
			path: "/services/full-stack-applications",
			keywords: [
				"custom",
				"individuell",
				"personnalisé",
				"personalizado",
			],
		},
	],
	"wordpress-site-speed": [
		{
			path: "/blog/wordpress-slow-on-mobile",
			keywords: [
				"mobile",
				"Mobil",
			],
		},
		{
			path: "/blog/website-speed-and-conversions",
			keywords: [
				"conversion",
				"Conversion",
				"conversión",
				"conversie",
				"konwersja",
				"conversione",
			],
		},
		{
			path: "/blog/should-i-migrate-wordpress-to-nextjs",
			keywords: [
				"migration",
				"Migration",
				"migración",
				"migratie",
				"migracja",
				"migrazione",
			],
		},
		{
			path: "/services/wordpress-migration",
			keywords: [
				"migration",
				"Migration",
			],
		},
	],
};

// ─── EXTERNAL AUTHORITY LINKS ────────────────────────────────────────────────
// These use full URLs and will auto-open in new tabs via the renderInline function.

const EXTERNAL_LINKS = {
	"ai-agents-business-automation": [
		{
			url: "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
			keywords: ["batch", "50%", "Batch"],
		},
		{
			url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
			keywords: [
				"4–5",
				"4-5",
				"tool count",
				"too many tools",
				"troppi strumenti",
				"zu viele",
				"trop d'outils",
				"demasiadas",
			],
		},
	],
	"what-is-model-context-protocol": [
		{
			url: "https://modelcontextprotocol.io",
			keywords: [
				"Model Context Protocol",
				"MCP",
			],
		},
	],
	"how-much-does-a-website-cost": [
		{
			url: "https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-load-time/",
			keywords: ["53%", "mobile"],
		},
		{
			url: "https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/",
			keywords: ["13,000", "13.000", "vulnerabilit"],
		},
		{
			url: "https://web.dev/vitals/",
			keywords: ["Core Web Vitals"],
		},
	],
	"google-ads-vs-seo": [
		{
			url: "https://www.wordstream.com/google-ads-benchmarks",
			keywords: ["CPC", "cost per click"],
		},
	],
	"website-audit-checklist": [
		{
			url: "https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-load-time/",
			keywords: ["53%"],
		},
		{
			url: "https://pagespeed.web.dev/",
			keywords: ["PageSpeed Insights", "PageSpeed"],
		},
	],
	"email-marketing-vs-website": [
		{
			url: "https://www.litmus.com/resources/state-of-email",
			keywords: ["42:1", "ROI"],
		},
	],
	"website-performance-for-ecommerce": [
		{
			url: "https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html",
			keywords: ["0.1s", "0,1s", "8%"],
		},
		{
			url: "https://web.dev/vitals/",
			keywords: ["Core Web Vitals"],
		},
	],
	"multilingual-website-guide": [
		{
			url: "https://developers.google.com/search/docs/specialty/international/localized-versions",
			keywords: ["hreflang"],
		},
		{
			url: "https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/",
			keywords: ["13,000", "13.000", "vulnerabilit"],
		},
	],
	// Articles 10-51
	"website-not-generating-leads": [
		{
			url: "https://www.statista.com/statistics/277125/share-of-website-traffic-of-mobile/",
			keywords: ["60%", "mobile traffic"],
		},
		{
			url: "https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-load-time/",
			keywords: ["53%", "3 second"],
		},
	],
	"react-vs-wordpress-2026": [
		{
			url: "https://sucuri.net/reports/website-threat-research-report/",
			keywords: ["90%", "infected"],
		},
		{
			url: "https://web.dev/vitals/",
			keywords: ["Core Web Vitals", "PageSpeed"],
		},
	],
	"website-maintenance-costs": [
		{
			url: "https://w3techs.com/technologies/details/cm-wordpress",
			keywords: ["43%", "powers"],
		},
	],
	"local-seo-for-small-business": [
		{
			url: "https://support.google.com/business/",
			keywords: ["Google Business Profile", "Google Business"],
		},
	],
	"squarespace-website-problems": [
		{
			url: "https://web.dev/vitals/",
			keywords: ["Core Web Vitals"],
		},
	],
	"wordpress-vs-custom-development": [
		{
			url: "https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/",
			keywords: ["13,000", "13.000", "vulnerabilit"],
		},
	],
	"wordpress-security-risks": [
		{
			url: "https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/",
			keywords: ["8,000", "8.000", "plugin vulnerabilit"],
		},
	],
	"what-makes-a-good-business-website": [
		{
			url: "https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-load-time/",
			keywords: ["53%"],
		},
	],
	"website-speed-and-conversions": [
		{
			url: "https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html",
			keywords: ["0.1s", "0,1s", "8%"],
		},
		{
			url: "https://www.portent.com/blog/analytics/research-site-speed-hurting-everyones-revenue.htm",
			keywords: ["1s", "5s", "1 second", "5 second"],
		},
	],
	"website-redesign-signs": [
		{
			url: "https://credibility.stanford.edu/",
			keywords: ["75%", "credibility"],
		},
	],
	"website-cost-2026": [
		{
			url: "https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/",
			keywords: ["13,000", "13.000", "vulnerabilit"],
		},
	],
	"website-copywriting-tips": [
		{
			url: "https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-page-speed-load-time/",
			keywords: ["53%"],
		},
	],
	"seo-mistakes-small-businesses": [
		{
			url: "https://pagespeed.web.dev/",
			keywords: ["PageSpeed"],
		},
		{
			url: "https://developers.google.com/search/docs/appearance/title-link",
			keywords: ["title tag", "Titel-Tag", "balise title", "etiqueta de título"],
		},
	],
	"landing-page-vs-full-website": [
		{
			url: "https://unbounce.com/conversion-benchmark-report/",
			keywords: ["10–20%", "10-20%", "conversion benchmark"],
		},
	],
	"how-we-build-websites": [
		{
			url: "https://web.dev/vitals/",
			keywords: ["Core Web Vitals"],
		},
	],
	"headless-cms-explained": [
		{
			url: "https://w3techs.com/technologies/details/cm-wordpress",
			keywords: ["43%"],
		},
	],
	"google-business-profile-guide": [
		{
			url: "https://safaridigital.com.au/blog/local-seo-statistics/",
			keywords: ["46%", "local"],
		},
	],
	"b2b-website-lead-generation": [
		{
			url: "https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/the-changing-face-b2b-marketing/",
			keywords: ["60–70%", "60-70%", "B2B", "mobile"],
		},
	],
	"website-speed-affects-revenue": [
		{
			url: "https://www.akamai.com/",
			keywords: ["Akamai"],
		},
	],
	"typo3-vs-nextjs-enterprise": [
		{
			url: "https://github.com/vercel/next.js",
			keywords: ["120K", "120,000", "GitHub", "stars"],
		},
	],
	"will-i-lose-seo-rankings-rebuild": [
		{
			url: "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
			keywords: ["301", "redirect"],
		},
	],
	"wordpress-alternatives-small-business-2026": [
		{
			url: "https://w3techs.com/",
			keywords: ["market share", "Marktanteil"],
		},
	],
	"framer-website-performance-problems": [
		{
			url: "https://web.dev/vitals/",
			keywords: ["Core Web Vitals"],
		},
	],
	"wordpress-slow-on-mobile": [
		{
			url: "https://www.statista.com/statistics/277125/share-of-website-traffic-of-mobile/",
			keywords: ["60%", "mobile traffic"],
		},
	],
	"wordpress-to-nextjs-migration-faq": [
		{
			url: "https://nextjs.org/docs/pages/building-your-application/optimizing/images",
			keywords: ["image optimization", "Bildoptimierung", "optimisation d'image"],
		},
	],
	"framer-vs-nextjs-business-website": [
		{
			url: "https://vercel.com/pricing",
			keywords: ["Vercel", "hosting"],
		},
	],
	"should-i-migrate-wordpress-to-nextjs": [
		{
			url: "https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/",
			keywords: ["vulnerabilit", "13,000", "13.000"],
		},
	],
	"webflow-to-nextjs-migration": [
		{
			url: "https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes",
			keywords: ["SEO migration", "301", "redirect"],
		},
	],
	"wordpress-security-2026": [
		{
			url: "https://patchstack.com/whitepaper/state-of-wordpress-security-in-2024/",
			keywords: ["13,000", "13.000"],
		},
		{
			url: "https://sucuri.net/reports/website-threat-research-report/",
			keywords: ["42%", "outdated"],
		},
	],
	"hidden-cost-of-wordpress": [
		{
			url: "https://w3techs.com/technologies/details/cm-wordpress",
			keywords: ["40%", "powers"],
		},
	],
	"webflow-limitations-growing-business": [],
	"wordpress-site-speed": [
		{
			url: "https://pagespeed.web.dev/",
			keywords: ["PageSpeed"],
		},
	],
};

// ─── MAIN PROCESSING ─────────────────────────────────────────────────────────

let totalInternalAdded = 0;
let totalExternalAdded = 0;
let totalInternalMissed = 0;
let totalExternalMissed = 0;
const missingReport = [];

for (const slug of Object.keys(INTERNAL_LINKS)) {
	const articleDir = join(BLOG_DIR, slug);
	if (!existsSync(articleDir)) {
		console.log(`⚠ Directory not found: ${slug}`);
		continue;
	}

	for (const locale of LOCALES) {
		const filePath = join(articleDir, `${locale}.json`);
		if (!existsSync(filePath)) continue;

		const data = JSON.parse(readFileSync(filePath, "utf8"));
		const blocks = data.blocks;
		if (!blocks) continue;

		let internalAdded = 0;
		let internalMissed = 0;

		// Add internal links
		const internalSpecs = INTERNAL_LINKS[slug] || [];
		for (const spec of internalSpecs) {
			const url = locUrl(locale, spec.path);
			if (addLinkToBlocks(blocks, spec.keywords, url)) {
				internalAdded++;
			} else {
				internalMissed++;
				if (locale === "en") {
					missingReport.push(
						`INTERNAL MISS: ${slug}/${locale} → ${spec.path} (keywords: ${spec.keywords.slice(0, 3).join(", ")})`,
					);
				}
			}
		}

		// Add external links
		let externalAdded = 0;
		let externalMissed = 0;
		const externalSpecs = EXTERNAL_LINKS[slug] || [];
		for (const spec of externalSpecs) {
			if (addLinkToBlocks(blocks, spec.keywords, spec.url)) {
				externalAdded++;
			} else {
				externalMissed++;
				if (locale === "en") {
					missingReport.push(
						`EXTERNAL MISS: ${slug}/${locale} → ${spec.url} (keywords: ${spec.keywords.slice(0, 3).join(", ")})`,
					);
				}
			}
		}

		totalInternalAdded += internalAdded;
		totalExternalAdded += externalAdded;
		totalInternalMissed += internalMissed;
		totalExternalMissed += externalMissed;

		if (!DRY_RUN && (internalAdded > 0 || externalAdded > 0)) {
			writeFileSync(filePath, JSON.stringify(data, null, "\t") + "\n");
		}

		if (internalAdded > 0 || externalAdded > 0) {
			console.log(
				`${slug}/${locale}: +${internalAdded} internal, +${externalAdded} external`,
			);
		}
	}
}

console.log("\n--- Summary ---");
console.log(`Internal links added: ${totalInternalAdded}`);
console.log(`External links added: ${totalExternalAdded}`);
console.log(`Internal missed: ${totalInternalMissed}`);
console.log(`External missed: ${totalExternalMissed}`);

if (missingReport.length > 0) {
	console.log(`\n--- Missed (EN only) ---`);
	for (const line of missingReport) {
		console.log(line);
	}
}
