"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { SceneLayer, ScenePlayer } from "@/components/marketing/scene-player";
import WhenNear from "./when-near";

const scenes = {
	steps: dynamic(() => import("./case-hyyve-steps"), { ssr: false }),
	summary: dynamic(() => import("./case-fz-summary"), { ssr: false }),
	takeoff: dynamic(() => import("./case-mpb-takeoff"), { ssr: false }),
};

/** A live scene from a real project, set into a bento tile. */
export default function BentoScene({ kind }: { kind: keyof typeof scenes }) {
	const Scene = scenes[kind];
	const names = useTranslations("scenes.names");
	return (
		<ScenePlayer className="absolute inset-0">
			<div aria-label={names(kind)} className="absolute inset-0" role="img">
				<SceneLayer>
					<WhenNear>
						<Scene />
					</WhenNear>
				</SceneLayer>
			</div>
		</ScenePlayer>
	);
}
