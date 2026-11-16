import Image from "next/image";

import { ActionArrow } from "@/components/marketing/action";
import { screenFirst } from "@/components/marketing/case-study-card";
import ProjectScene from "@/components/marketing/home/scenes/project-scene";
import {
	hasProjectScene,
	projectSceneControls,
} from "@/components/marketing/home/scenes/project-scene-slugs";
import { ScenePlayer } from "@/components/marketing/scene-player";
import StaggerChildren from "@/components/marketing/stagger-children";
import type { CaseStudy } from "@/data/case-studies";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** The work as a wall. Website projects show their real first screen; the
 * others run their live scene. Each leads to its case study. Two to a row by
 * default; as a bento the first project is large, two sit beside it and
 * three run below. */
export default function WorkWall({
	bento = false,
	projects,
}: {
	bento?: boolean;
	projects: Pick<
		CaseStudy,
		"cardImage" | "client" | "coverImage" | "industry" | "slug"
	>[];
}) {
	return (
		<StaggerChildren
			className={cn(
				"grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2",
				bento && "lg:grid-cols-12"
			)}
		>
			{projects.map((project, index) =>
				project.coverImage ? (
					// The scene's buttons sit beside the link, over the picture's corner
					<ScenePlayer
						className={cn(
							"flex min-w-0 flex-col",
							bento &&
								(index === 0 ? "lg:col-span-8 lg:row-span-2" : "lg:col-span-4")
						)}
						controls={
							!screenFirst(project) && projectSceneControls(project.slug, true)
						}
						key={project.slug}
					>
						<Link
							className="group/arrow flex min-w-0 flex-1 flex-col outline-none"
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: project.slug },
							}}
						>
							<span
								className={cn(
									"block rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] transition-shadow duration-300 group-hover/arrow:shadow-[0_0_0_1px_rgba(14,18,23,0.1),0_32px_64px_-36px_rgba(14,18,23,0.5)] group-focus-visible/arrow:ring-2 group-focus-visible/arrow:ring-ring/70 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
									bento && index === 0 && "lg:flex lg:flex-1 lg:flex-col"
								)}
							>
								<span
									className={cn(
										"relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-foreground/[0.04]",
										// The large tile fills the height of the two beside it
										bento && index === 0 && "lg:aspect-auto lg:flex-1"
									)}
								>
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
								<span className="flex min-w-0 flex-col text-base text-foreground md:block md:truncate">
									{project.client}
									<span className="text-muted-foreground md:ml-2">
										{project.industry}
									</span>
								</span>
								<span className="text-foreground/50 transition-colors group-hover/arrow:text-foreground">
									<ActionArrow />
								</span>
							</span>
						</Link>
					</ScenePlayer>
				) : null
			)}
		</StaggerChildren>
	);
}
