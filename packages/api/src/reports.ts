export interface DeckEntry {
	file: string;
	slug: string;
	title: { de: string; en: string };
}

export interface ReportEntry {
	de: string;
	en: string;
	subject: string;
	subjectEn?: string;
}

/**
 * Gated service-deck PDFs (WEB-59 CI set). Slugs match offering slugs so
 * every service subpage links to its own deck; "leistungsuebersicht" is the
 * cross-service master sheet reachable only via direct link. Each deck ships
 * in German and English: German pages send the German PDF, every other
 * locale the English one.
 */
export const DECKS: DeckEntry[] = [
	{
		slug: "leistungsuebersicht",
		file: "00_WEBVISE_Leistungsuebersicht.pdf",
		title: { de: "Leistungsübersicht", en: "Service Overview" },
	},
	{
		slug: "landing-pages",
		file: "01_WEBVISE_Launch_Landing-Pages.pdf",
		title: {
			de: "Landing Pages und Launch-Seiten",
			en: "Landing Pages & Launch Sites",
		},
	},
	{
		slug: "mvp-development",
		file: "02_WEBVISE_Launch_MVPs-und-Produktprototypen.pdf",
		title: {
			de: "MVPs und Produktprototypen",
			en: "MVPs & Product Prototypes",
		},
	},
	{
		slug: "website-to-app-upgrades",
		file: "03_WEBVISE_Launch_Website-Workflows.pdf",
		title: { de: "Website-Workflows", en: "Website Workflows" },
	},
	{
		slug: "wordpress-migration",
		file: "04_WEBVISE_Launch_WordPress-und-Legacy-Migrationen.pdf",
		title: {
			de: "WordPress- und Legacy-Migrationen",
			en: "WordPress & Legacy Migrations",
		},
	},
	{
		slug: "internal-tools-dashboards",
		file: "05_WEBVISE_Operate_Interne-Tools-und-Dashboards.pdf",
		title: {
			de: "Interne Tools und Dashboards",
			en: "Internal Tools & Dashboards",
		},
	},
	{
		slug: "client-portals-business-apps",
		file: "06_WEBVISE_Operate_Kundenportale-und-Geschaeftsanwendungen.pdf",
		title: {
			de: "Kundenportale und Geschäftsanwendungen",
			en: "Client Portals & Business Applications",
		},
	},
	{
		slug: "booking-event-platforms",
		file: "07_WEBVISE_Operate_Booking-und-Event-Plattformen.pdf",
		title: {
			de: "Booking- und Event-Plattformen",
			en: "Booking & Event Platforms",
		},
	},
	{
		slug: "full-stack-applications",
		file: "08_WEBVISE_Operate_Individuelle-Business-Anwendungen.pdf",
		title: {
			de: "Individuelle Business-Anwendungen",
			en: "Custom Business Applications",
		},
	},
	{
		slug: "ai-consulting",
		file: "09_WEBVISE_Automate_KI-Audit-und-Beratung.pdf",
		title: { de: "KI-Audit und Beratung", en: "AI Audit & Consulting" },
	},
	{
		slug: "company-brain-memory-systems",
		file: "10_WEBVISE_Automate_Company-Brain-Systeme.pdf",
		title: { de: "Company-Brain-Systeme", en: "Company Brain Systems" },
	},
	{
		slug: "ai-automation",
		file: "11_WEBVISE_Automate_KI-Workflow-Automation.pdf",
		title: { de: "KI-Workflow-Automation", en: "AI Workflow Automation" },
	},
	{
		slug: "agentic-workflow-automation",
		file: "12_WEBVISE_Automate_KI-Agenten-mit-Review-Gates.pdf",
		title: {
			de: "KI-Agenten mit Review-Gates",
			en: "AI Agents with Review Gates",
		},
	},
];

const PDF_EXTENSION_PATTERN = /\.pdf$/;

function deckReport(deck: DeckEntry): [string, ReportEntry] {
	const base = deck.file.replace(PDF_EXTENSION_PATTERN, "");
	return [
		`deck-${deck.slug}`,
		{
			de: `reports/decks/${deck.file}`,
			en: `reports/decks/en/${base}_EN.pdf`,
			subject: `webvise Service-Deck: ${deck.title.de}`,
			subjectEn: `webvise service deck: ${deck.title.en}`,
		},
	];
}

export const REPORTS: Record<string, ReportEntry> = {
	"ai-coding-tools-deep-dive": {
		de: "reports/ai-coding-tools-deep-dive-de.pdf",
		en: "reports/ai-coding-tools-deep-dive-en.pdf",
		subject: "AI, Agents & AI Coding Tools - Deep Dive Report",
	},
	...Object.fromEntries(DECKS.map(deckReport)),
};
