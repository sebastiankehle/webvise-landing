"use client";

import dynamic from "next/dynamic";

import WhenNear from "./when-near";

const scenes = {
	steps: dynamic(() => import("./case-hyyve-steps"), { ssr: false }),
	summary: dynamic(() => import("./case-fz-summary"), { ssr: false }),
	takeoff: dynamic(() => import("./case-mpb-takeoff"), { ssr: false }),
};

/** A live scene from a real project, set into a bento tile. */
export default function BentoScene({ kind }: { kind: keyof typeof scenes }) {
	const Scene = scenes[kind];
	return (
		<WhenNear>
			<Scene />
		</WhenNear>
	);
}
