import { FileText, Folder, GitBranch } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CallPicture, PlanPicture } from "@/components/marketing/book-next";
import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { H2, H3 } from "@/components/ui/typography";

const itemKeys = ["0", "1", "2", "3"] as const;
const planKeys = ["0", "1", "2", "3"] as const;
const WEEKS = [1, 2, 3] as const;

const pictureClassName =
	"flex w-[15.5rem] flex-col rounded-[12px] bg-card p-3.5 shadow-[0_0_0_1px_rgba(14,18,23,0.07),0_16px_32px_-20px_rgba(14,18,23,0.4)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.09)]";

/** Three weeks of a build: two demos held, the third one coming up. */
function WeekPicture({ demo, week }: { demo: string; week: string }) {
	return (
		<ul className={`${pictureClassName} gap-3`}>
			{WEEKS.map((number) => {
				const held = number < WEEKS.length;
				return (
					<li className="flex items-center gap-3 text-sm" key={number}>
						<span className="w-[4.25rem] shrink-0 text-foreground tabular-nums">
							{week} {number}
						</span>
						<span className="h-1.5 flex-1 rounded-full bg-foreground/[0.08]">
							<span
								className={`block h-full rounded-full ${held ? "w-full bg-foreground/70" : "w-1/2 bg-brand"}`}
							/>
						</span>
						<span
							className={`rounded-full px-2 py-0.5 text-xs ${
								held
									? "bg-foreground text-background"
									: "text-muted-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.14)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
							}`}
						>
							{demo}
						</span>
					</li>
				);
			})}
		</ul>
	);
}

/** The repository under the client's own name, with them as its owner. */
function RepoPicture({
	owner,
	repo,
	you,
}: {
	owner: string;
	repo: string;
	you: string;
}) {
	return (
		<div className={`${pictureClassName} gap-2.5`}>
			<div className="flex items-center gap-2 text-foreground text-sm">
				<GitBranch aria-hidden="true" className="size-4 shrink-0" />
				<span className="min-w-0 truncate font-medium">{repo}</span>
			</div>
			<div className="grid gap-1.5 text-muted-foreground text-sm">
				<span className="flex items-center gap-2">
					<Folder aria-hidden="true" className="size-3.5 shrink-0" />
					docs
				</span>
				<span className="flex items-center gap-2">
					<FileText aria-hidden="true" className="size-3.5 shrink-0" />
					README.md
				</span>
			</div>
			<div className="flex items-center justify-between border-foreground/[0.08] border-t pt-2.5 text-sm">
				<span className="text-muted-foreground">{owner}</span>
				<span className="rounded-full bg-foreground px-2 py-0.5 text-background text-xs">
					{you}
				</span>
			</div>
		</div>
	);
}

/** What keeps the buyer's risk small, gathered in one place right before the
 * closing ask. Each of the four is a standing part of how projects run, shown
 * as the thing itself: the call, the plan, the weekly demo, the repository. */
export default async function Safeguards() {
	const [t, tb] = await Promise.all([
		getTranslations("home.safeguards"),
		getTranslations("book"),
	]);
	const pictures: Record<(typeof itemKeys)[number], ReactNode> = {
		"0": <CallPicture name="Sebastian Kehle" />,
		"1": <PlanPicture rows={planKeys.map((key) => tb(`next.plan.${key}`))} />,
		"2": <WeekPicture demo={t("pictures.demo")} week={t("pictures.week")} />,
		"3": (
			<RepoPicture
				owner={t("pictures.owner")}
				repo={t("pictures.repo")}
				you={t("pictures.you")}
			/>
		),
	};

	return (
		<SectionWrapper id="safeguards">
			<H2 className="max-w-[20ch]">{t("title")}</H2>
			<StaggerChildren className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 xl:grid-cols-4">
				{itemKeys.map((key) => (
					<div
						className="flex flex-col rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
						key={key}
					>
						<div
							aria-hidden="true"
							className="flex aspect-[16/11] items-center justify-center overflow-hidden rounded-[14px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]"
						>
							<div className="scale-110 xl:scale-100">{pictures[key]}</div>
						</div>
						<div className="px-4 pt-4 pb-3 md:px-5">
							<H3 className="text-xl leading-snug">
								{t(`items.${key}.title`)}
							</H3>
							<p className="mt-2 text-base text-muted-foreground leading-[1.6]">
								{t(`items.${key}.description`)}
							</p>
						</div>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
