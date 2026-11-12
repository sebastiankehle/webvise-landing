import Image from "next/image";

import { ActionArrow } from "@/components/marketing/action";
import { screenFirst } from "@/components/marketing/case-study-card";
import ProjectScene from "@/components/marketing/home/scenes/project-scene";
import { hasProjectScene } from "@/components/marketing/home/scenes/project-scene-slugs";
import StaggerChildren from "@/components/marketing/stagger-children";
import type { CaseStudy } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";

/** The work as a wall, two to a row and large. Website projects show their
 * real first screen; the others run their live scene. Each leads to its case
 * study. */
export default function WorkWall({
	projects,
}: {
	projects: Pick<
		CaseStudy,
		"cardImage" | "client" | "coverImage" | "industry" | "slug"
	>[];
}) {
	return (
		<StaggerChildren className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2">
			{projects.map((project) =>
				project.coverImage ? (
					<Link
						className="group/arrow block min-w-0 outline-none"
						href={{
							pathname: "/case-studies/[slug]",
							params: { slug: project.slug },
						}}
						key={project.slug}
					>
						<span className="block rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] transition-shadow duration-300 group-hover/arrow:shadow-[0_0_0_1px_rgba(14,18,23,0.1),0_32px_64px_-36px_rgba(14,18,23,0.5)] group-focus-visible/arrow:ring-2 group-focus-visible/arrow:ring-ring/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
							<span className="relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-foreground/[0.04]">
								{hasProjectScene(project.slug) && !screenFirst(project) ? (
									<ProjectScene
										opening={project.cardImage ?? project.coverImage}
										sizes="(min-width: 768px) 50vw, 100vw"
										slug={project.slug}
									/>
								) : (
									<Image
										alt={`${project.client}: ${project.industry}`}
										className="object-cover object-left-top transition-transform duration-700 ease-out group-hover/arrow:scale-[1.015]"
										fill
										sizes="(min-width: 768px) 50vw, 100vw"
										src={project.coverImage}
									/>
								)}
							</span>
						</span>
						<span className="mt-3 flex items-center justify-between gap-4 px-2">
							<span className="min-w-0 truncate text-base text-foreground">
								{project.client}
								<span className="ml-2 text-muted-foreground">
									{project.industry}
								</span>
							</span>
							<span className="text-foreground/50 transition-colors group-hover/arrow:text-foreground">
								<ActionArrow />
							</span>
						</span>
					</Link>
				) : null
			)}
		</StaggerChildren>
	);
}
