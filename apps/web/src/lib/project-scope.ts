import type { OfferingGroupKey } from "@/data/offerings";

/**
 * The project scope estimator: ten questions, each answer worth a few effort
 * points, and the sum read as a band. It shows no prices, by design: webvise
 * estimates effort after a discovery call, not from a form.
 */

/** What is being built, grouped by the service it leads to. */
export const PROJECT_TYPES = {
	website: { group: "launch", points: 0, slug: "landing-pages" },
	relaunch: { group: "launch", points: 1, slug: "wordpress-migration" },
	mvp: { group: "launch", points: 2, slug: "mvp-development" },
	internalTool: {
		group: "operate",
		points: 2,
		slug: "internal-tools-dashboards",
	},
	portal: {
		group: "operate",
		points: 3,
		slug: "client-portals-business-apps",
	},
	booking: { group: "operate", points: 3, slug: "booking-event-platforms" },
	assistant: { group: "automate", points: 1, slug: "ai-chatbots" },
	automation: { group: "automate", points: 2, slug: "ai-automation" },
	knowledge: {
		group: "automate",
		points: 2,
		slug: "company-brain-memory-systems",
	},
	other: { group: null, points: 2, slug: null },
} as const satisfies Record<
	string,
	{ group: OfferingGroupKey | null; points: number; slug: string | null }
>;

export type ProjectType = keyof typeof PROJECT_TYPES;

/** Effort points for each answer of the single-choice questions. */
const SINGLE_CHOICE = {
	project: Object.fromEntries(
		Object.entries(PROJECT_TYPES).map(([id, type]) => [id, type.points])
	) as Record<ProjectType, number>,
	size: { small: 0, medium: 1, large: 2, xlarge: 3, unsure: 1 },
	users: { public: 0, oneRole: 1, fewRoles: 2, manyRoles: 3 },
	migration: { none: 0, some: 1, lots: 2, complex: 3 },
	ai: { none: 0, assist: 1, core: 3, unsure: 1 },
	languages: { one: 0, two: 1, more: 2 },
	design: { ready: 0, brand: 1, none: 2 },
	deadline: { flexible: 0, quarter: 0, soon: 1 },
	support: { handover: 0, occasional: 0, ongoing: 1 },
} as const;

type SingleChoice = typeof SINGLE_CHOICE;
export type SingleQuestionId = keyof SingleChoice;

export const INTEGRATIONS = [
	"payments",
	"crm",
	"accounting",
	"calendar",
	"email",
	"otherApi",
] as const;
export type Integration = (typeof INTEGRATIONS)[number];

/** Integrations is the one question with several answers, or one of these. */
export const INTEGRATION_EXCLUSIVE = ["none", "unsure"] as const;
export type IntegrationAnswer =
	| Integration
	| (typeof INTEGRATION_EXCLUSIVE)[number];

export type QuestionId = SingleQuestionId | "integrations";

/** The order the questionnaire asks in. */
export const QUESTION_ORDER = [
	"project",
	"size",
	"users",
	"integrations",
	"migration",
	"ai",
	"languages",
	"design",
	"deadline",
	"support",
] as const satisfies readonly QuestionId[];

export type Answers = {
	[Q in SingleQuestionId]?: keyof SingleChoice[Q];
} & { integrations?: IntegrationAnswer[] };

/** Answer ids of a single-choice question, in the order they are shown. */
export function questionOptions<Q extends SingleQuestionId>(
	question: Q
): (keyof SingleChoice[Q] & string)[] {
	return Object.keys(SINGLE_CHOICE[question]) as (keyof SingleChoice[Q] &
		string)[];
}

/** Toggles one integration. "None" and "not sure" stand alone. */
export function toggleIntegration(
	current: readonly IntegrationAnswer[],
	value: IntegrationAnswer
): IntegrationAnswer[] {
	if (current.includes(value)) {
		return current.filter((item) => item !== value);
	}
	if ((INTEGRATION_EXCLUSIVE as readonly string[]).includes(value)) {
		return [value];
	}
	return [
		...current.filter(
			(item) => !(INTEGRATION_EXCLUSIVE as readonly string[]).includes(item)
		),
		value,
	];
}

export function isAnswered(answers: Answers, question: QuestionId): boolean {
	if (question === "integrations") {
		return (answers.integrations?.length ?? 0) > 0;
	}
	return answers[question] !== undefined;
}

export function isComplete(answers: Answers): boolean {
	return QUESTION_ORDER.every((question) => isAnswered(answers, question));
}

function selectedIntegrations(answers: Answers): Integration[] {
	return (answers.integrations ?? []).filter((item): item is Integration =>
		(INTEGRATIONS as readonly string[]).includes(item)
	);
}

function integrationPoints(answers: Answers): number {
	if (answers.integrations?.includes("unsure")) {
		return 1;
	}
	const count = selectedIntegrations(answers).length;
	if (count >= 4) {
		return 3;
	}
	if (count >= 2) {
		return 2;
	}
	return count;
}

export function questionPoints(answers: Answers, question: QuestionId): number {
	if (question === "integrations") {
		return integrationPoints(answers);
	}
	const answer = answers[question];
	if (answer === undefined) {
		return 0;
	}
	return (SINGLE_CHOICE[question] as Record<string, number>)[answer] ?? 0;
}

function isUnsure(answers: Answers, question: QuestionId): boolean {
	if (question === "integrations") {
		return answers.integrations?.includes("unsure") ?? false;
	}
	// "Something else" leaves the project as open as "not sure" does.
	return answers[question] === "unsure" || answers[question] === "other";
}

export const BANDS = ["compact", "medium", "extensive"] as const;
export type Band = (typeof BANDS)[number];

/** Highest sum each band still covers; anything above is extensive. */
export const BAND_LIMITS = { compact: 5, medium: 11 } as const;

export function bandFor(score: number): Band {
	if (score <= BAND_LIMITS.compact) {
		return "compact";
	}
	if (score <= BAND_LIMITS.medium) {
		return "medium";
	}
	return "extensive";
}

const MAX_DRIVERS = 4;
const MAX_OPEN_QUESTIONS = 4;
// A "not sure" answer is the first thing a call should settle.
const UNSURE_PRIORITY = 10;

export interface Estimate {
	band: Band;
	/** Questions whose answers add the most effort, largest first. */
	drivers: QuestionId[];
	/** Questions a discovery call should settle, most pressing first. */
	openQuestions: QuestionId[];
	score: number;
	/** The service page that fits, or null for the services overview. */
	service: { group: OfferingGroupKey; slug: string } | null;
}

/** The questions with the largest weight, largest first; ties keep the
 * order they were asked in. */
function topQuestions(
	weight: (question: QuestionId) => number,
	limit: number
): QuestionId[] {
	return QUESTION_ORDER.map((question) => ({
		question,
		value: weight(question),
	}))
		.filter(({ value }) => value > 0)
		.sort((a, b) => b.value - a.value)
		.slice(0, limit)
		.map(({ question }) => question);
}

export function estimate(answers: Answers): Estimate {
	const score = QUESTION_ORDER.reduce(
		(sum, question) => sum + questionPoints(answers, question),
		0
	);

	// A "not sure" answer adds effort but says nothing about where it goes,
	// so it is no driver; it goes to the top of the open questions instead.
	const drivers = topQuestions(
		(question) =>
			isUnsure(answers, question) ? 0 : questionPoints(answers, question),
		MAX_DRIVERS
	);
	const openQuestions = topQuestions(
		(question) =>
			isUnsure(answers, question)
				? UNSURE_PRIORITY
				: questionPoints(answers, question),
		MAX_OPEN_QUESTIONS
	);

	const type = answers.project ? PROJECT_TYPES[answers.project] : undefined;
	const service =
		type?.group && type.slug ? { group: type.group, slug: type.slug } : null;

	return { band: bandFor(score), drivers, openQuestions, score, service };
}

/** A next-intl translator, reduced to what the summary needs. */
export type Translate = (
	key: string,
	values?: Record<string, string | number>
) => string;

/** The label of an answer, for the summary and the result. */
export function answerLabel(
	answers: Answers,
	question: QuestionId,
	t: Translate
): string {
	if (question === "integrations") {
		return (answers.integrations ?? [])
			.map((item) => t(`questions.integrations.options.${item}.label`))
			.join(", ");
	}
	const answer = answers[question];
	return answer === undefined
		? ""
		: t(`questions.${question}.options.${String(answer)}.label`);
}

/** The words for one effort driver, from the answer that caused it. */
export function driverText(
	answers: Answers,
	question: QuestionId,
	t: Translate
): string {
	if (question === "integrations") {
		const list = selectedIntegrations(answers);
		return t("drivers.integrations", {
			count: list.length,
			list: list
				.map((item) => t(`questions.integrations.options.${item}.label`))
				.join(", "),
		});
	}
	return t(`drivers.${question}.${String(answers[question])}`);
}

/** Plain text of the answers and the result, to paste into a booking or an
 * email. */
export function summaryText({
	answers,
	result,
	service,
	t,
	toolUrl,
}: {
	answers: Answers;
	result: Estimate;
	service: { title: string; url: string };
	t: Translate;
	toolUrl: string;
}): string {
	const list = (items: string[]) => items.map((item) => `- ${item}`);
	return [
		`${t("summary.heading")} (${toolUrl})`,
		"",
		...QUESTION_ORDER.map(
			(question) =>
				`${t(`questions.${question}.short`)}: ${answerLabel(answers, question, t)}`
		),
		"",
		`${t("summary.band")}: ${t(`bands.${result.band}.title`)}`,
		"",
		`${t("result.driversTitle")}:`,
		...(result.drivers.length > 0
			? list(result.drivers.map((q) => driverText(answers, q, t)))
			: list([t("drivers.none")])),
		"",
		`${t("result.clarifyTitle")}:`,
		...list([
			t("clarify.goals"),
			...result.openQuestions.map((q) => t(`clarify.${q}`)),
		]),
		"",
		`${t("summary.service")}: ${service.title} (${service.url})`,
	].join("\n");
}
