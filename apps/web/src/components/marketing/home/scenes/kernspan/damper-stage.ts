import * as THREE from "three";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";

import { buildDamper } from "./damper-geometry";

/**
 * Kernspan's damper, live. On its own site the visitor's scroll drives one
 * `journey` from 0 to 1: side view, axial deconstruction, inspection roll,
 * the side arms sliding off, reassembly. Here the same journey runs on a
 * clock, loops, and can be scrubbed by hand. Motion curves and colours are
 * the project's own; only the driver and the framing are new: the camera
 * keeps the whole stack inside the picture, however far apart it stands.
 */

type Stops = [number, number][];

const FOV = 30;
const TAU = Math.PI * 2;
const SPIN_SPEED = 0.24;
// The site couples three extra turns to the scroll. On a clock that reads as
// a part that only spins, so the loop keeps one.
const SCROLL_SPIN = 1;
const PUMP_SPEED = 0.58;
const PUMP_STROKE = 0.045;
const SIDE_X = 0.85;
const SIDE_Y = -3.53;
const SIDE_Z = -1.25;
const ROOT_SCALE = 1.1;
/** Seconds for one journey, and the rest it takes assembled at each end. */
const LOOP = 24;
const REST = 1.4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
	const c = clamp01(t);
	return c * c * (3 - 2 * c);
};
const settle = (t: number) => {
	const c = clamp01(t);
	return 1 - (1 - c) * (1 - c);
};
const smoothRange = (a: number, b: number, v: number) =>
	smooth((v - a) / (b - a));
const settleRange = (a: number, b: number, v: number) =>
	settle((v - a) / (b - a));

function track(p: number, stops: Stops) {
	if (p <= stops[0][0]) {
		return stops[0][1];
	}
	for (let i = 1; i < stops.length; i++) {
		const [pa, va] = stops[i - 1];
		const [pb, vb] = stops[i];
		if (p <= pb) {
			return lerp(va, vb, smoothRange(pa, pb, p));
		}
	}
	return stops.at(-1)?.[1] ?? 0;
}

const ROT_X: Stops = [
	[0, SIDE_X],
	[0.12, SIDE_X - 0.08],
	[0.28, SIDE_X + 0.12],
	[0.42, SIDE_X + 0.01],
	[0.58, SIDE_X + 0.14],
	[0.74, SIDE_X - 0.04],
	[0.88, SIDE_X + 0.08],
	[1, SIDE_X],
];
const ROT_Y: Stops = [
	[0, SIDE_Y],
	[0.14, SIDE_Y - 0.58],
	[0.3, SIDE_Y - 0.85],
	[0.46, SIDE_Y - 1.55],
	[0.62, SIDE_Y - TAU + 0.54],
	[0.76, SIDE_Y - TAU - 0.08],
	[0.9, SIDE_Y - TAU - 0.52],
	[1, -TAU + SIDE_Y],
];
const ROT_Z: Stops = [
	[0, SIDE_Z],
	[0.14, SIDE_Z + 0.14],
	[0.3, SIDE_Z - 0.08],
	[0.48, SIDE_Z + 0.1],
	[0.64, SIDE_Z - 0.04],
	[0.8, SIDE_Z + 0.09],
	[0.92, SIDE_Z - 0.05],
	[1, SIDE_Z],
];
// These two tracks end where they start, so the loop has no seam.
const ROOT_Y: Stops = [
	[0, 0.01],
	[0.1, 0],
	[0.16, -0.02],
	[0.24, 0.01],
	[0.34, -0.01],
	[0.45, -0.01],
	[0.58, -0.01],
	[0.7, 0.01],
	[0.84, -0.01],
	[0.92, 0.01],
	[1, 0.01],
];
const ROOT_X: Stops = [
	[0, 0],
	[0.1, -0.05],
	[0.16, -0.07],
	[0.24, 0.04],
	[0.34, 0.01],
	[0.48, -0.03],
	[0.58, 0.05],
	[0.7, -0.01],
	[0.84, 0.03],
	[0.92, -0.03],
	[1, 0],
];
const AXIAL_ROLL: Stops = [
	[0, 0],
	[0.12, -0.31],
	[0.28, -0.67],
	[0.46, -0.86],
	[0.62, -0.22],
	[0.76, 1.2],
	[0.9, 1.45],
	[1, 1.82],
];
const EXPLODE: Stops = [
	[0, 0],
	[0.08, 0],
	[0.16, 0.34],
	[0.3, 0.76],
	[0.4, 0.98],
	[0.5, 0.78],
	[0.6, 0.46],
	[0.68, 0.12],
	[0.72, 0],
	[1, 0],
];

// The body holds its roll while the side arms are off, or they would read as
// mounted at the wrong angle.
const SPIN_HOLD_START = 0.72;
const SPIN_HOLD_END = 0.92;
function spinProgress(x: number) {
	if (x <= SPIN_HOLD_START) {
		return x;
	}
	return x >= SPIN_HOLD_END
		? x - (SPIN_HOLD_END - SPIN_HOLD_START)
		: SPIN_HOLD_START;
}
const rollAt = (j: number) => {
	const held = spinProgress(j);
	return track(held, AXIAL_ROLL) + held * TAU * SCROLL_SPIN;
};
const ROLL_PER_LOOP = rollAt(1) - rollAt(0);

/** Dark stage at both ends, light paper through the deconstruction. */
const PHASE: Stops = [
	[0, 1],
	[0.14, 1],
	[0.225, 0],
	[0.89, 0],
	[0.975, 1],
	[1, 1],
];

// The project's own tones.
const PAPER = 0xe2_e7_eb;
const STAGE = 0x1f_26_2d;
const PAPER_LINE = 0x4e_5a_64;
const PAPER_OUTLINE = 0x45_51_5c;
const STAGE_FILL = 0x36_3b_3f;
const STAGE_LINE = 0x1b_20_25;
const STAGE_OUTLINE = 0x12_17_1a;
const STAGE_SHADOW = 0x29_2d_30;
const STAGE_HIGHLIGHT = 0xca_e1_f6;

function armSide(name: string) {
	if (name === "Lagerbock rechts") {
		return 1;
	}
	return name === "Lagerbock links" ? -1 : 0;
}

interface OutlineParameters {
	alpha?: number;
	color?: number[];
	thickness?: number;
	visible?: boolean;
}

export interface DamperStage {
	dispose: () => void;
	/** Hand the journey back to the clock, from where the hand left it. */
	release: () => void;
	/** Take the journey by hand, 0 to 1. */
	scrub: (journey: number) => void;
	setRunning: (running: boolean) => void;
}

export function mountDamper(
	canvas: HTMLCanvasElement,
	host: HTMLElement,
	options: {
		/** How much of the picture's smaller side the stack may span when it
		 * stands fully apart, 0 to 1. Assembled, the part comes a step closer. */
		fill?: number;
		/** Pixels at the foot of the picture the part keeps clear, for a control
		 * laid over it. */
		inset?: number;
		onJourney?: (journey: number) => void;
		onReady?: () => void;
	} = {}
): DamperStage {
	const fill = options.fill ?? 0.86;
	const inset = options.inset ?? 0;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
		powerPreference: "high-performance",
	});
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

	const scene = new THREE.Scene();
	const ground = new THREE.Color(STAGE);
	scene.background = ground;
	scene.fog = new THREE.Fog(STAGE, 52, 150);
	const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
	const damper = buildDamper();
	damper.edgeMat.linewidth = 0.96;

	// Measure the part assembled and fully apart: where its middle is and how
	// far it reaches. The frame loop blends the two, so the part turns about
	// its middle and the camera backs off as the stack grows.
	const inner = new THREE.Group();
	inner.add(damper.root);
	const part = new THREE.Group();
	part.add(inner);
	scene.add(part);
	const measure = (explode: number) => {
		damper.setExplode(explode);
		const box = new THREE.Box3().setFromObject(damper.root);
		const size = box.getSize(new THREE.Vector3());
		return {
			centre: box.getCenter(new THREE.Vector3()),
			reach: Math.hypot(size.x, size.y, size.z) / 2,
		};
	};
	const apart = measure(1);
	const whole = measure(0);

	const paper = new THREE.Color(PAPER);
	const stage = new THREE.Color(STAGE);
	const paperFill = new THREE.Color(PAPER).multiplyScalar(0.9);
	const stageFill = new THREE.Color(STAGE_FILL);
	const paperLine = new THREE.Color(PAPER_LINE);
	const stageLine = new THREE.Color(STAGE_LINE);
	const paperOutline = new THREE.Color(PAPER_OUTLINE);
	const stageOutline = new THREE.Color(STAGE_OUTLINE);
	const surface = new THREE.Color();
	const line = new THREE.Color();
	const outline = new THREE.Color();
	damper.surfaceMat.uniforms.uShadowColor.value.setHex(STAGE_SHADOW);
	damper.surfaceMat.uniforms.uHighlightColor.value.setHex(STAGE_HIGHLIGHT);

	const outlineParameters = damper.outlineMat.userData
		.outlineParameters as OutlineParameters;
	outlineParameters.thickness = 0.0022;
	outlineParameters.alpha = 0.88;
	outlineParameters.visible = true;
	const outlineEffect = new OutlineEffect(renderer, {
		defaultAlpha: 0.88,
		defaultKeepAlive: true,
		defaultThickness: 0.0022,
	});

	const paint = (phase: number) => {
		ground.copy(paper).lerp(stage, phase);
		scene.fog?.color.copy(ground);
		surface.copy(paperFill).lerp(stageFill, phase);
		line.copy(paperLine).lerp(stageLine, phase);
		outline.copy(paperOutline).lerp(stageOutline, phase);
		damper.surfaceMat.uniforms.uColor.value.copy(surface);
		damper.surfaceMat.uniforms.uShade.value = Math.round(phase * 1000) / 1000;
		damper.surfaceMat.uniforms.uInkColor.value.copy(outline);
		damper.edgeMat.color.copy(line);
		outlineParameters.color = [outline.r, outline.g, outline.b];
	};

	const tanFov = Math.tan((FOV * Math.PI) / 180 / 2);
	let aspect = 1;
	/** The share of the picture's height the inset takes. */
	let clear = 0;

	let clock = 0;
	let journey = 0;
	let held: number | null = null;
	let spin = 0;
	let elapsed = 0;
	const position = new THREE.Vector3();

	const draw = (dt: number) => {
		elapsed += dt;
		if (held === null) {
			const before = Math.floor(clock / LOOP);
			clock += dt;
			// A new lap starts at roll zero again; carry the lap's roll into the
			// free spin so the part does not jump.
			spin += (Math.floor(clock / LOOP) - before) * ROLL_PER_LOOP;
			journey = clamp01(((clock % LOOP) - REST) / (LOOP - 2 * REST));
		} else {
			journey += (held - journey) * (1 - Math.exp(-dt * 12));
		}
		// A scrubbed value shows even under reduced motion; the free loop does not.
		const j = reduced && held === null ? 0 : journey;

		const explode = track(j, EXPLODE);
		const split = settleRange(0.72, 0.84, j) * (1 - settleRange(0.9, 0.98, j));
		const pumping =
			smoothRange(0.1, 0.24, j) * (1 - smoothRange(0.66, 0.76, j));
		const stroke =
			pumping *
			(Math.sin(elapsed * PUMP_SPEED * TAU) * PUMP_STROKE +
				smoothRange(0.1, 0.24, j) * (1 - smoothRange(0.56, 0.7, j)) * 0.1);
		// Back off until the part's whole reach spans its share of the smaller
		// side: `fill` when apart, a little more when assembled.
		const reach = lerp(whole.reach, apart.reach, explode) * ROOT_SCALE;
		const share = lerp(Math.min(1, fill + 0.14), fill, explode) * (1 - clear);
		const distance = reach / (share * tanFov * Math.min(1, aspect));

		paint(track(j, PHASE));
		part.rotation.set(track(j, ROT_X), track(j, ROT_Y), track(j, ROT_Z), "XYZ");
		part.scale.setScalar(ROOT_SCALE);
		part.position.set(
			track(j, ROOT_X) * whole.reach,
			track(j, ROOT_Y) * whole.reach + clear * tanFov * distance,
			0
		);
		damper.root.position
			.lerpVectors(whole.centre, apart.centre, explode)
			.negate();

		spin +=
			dt * SPIN_SPEED * lerp(1, 0.28, Math.max(explode, split)) * (1 - split);
		inner.rotation.y = rollAt(j) + spin;

		for (const mod of damper.modules) {
			position.lerpVectors(mod.home, mod.exploded, explode);
			// The cast side arms leave along the body's own lateral axis.
			position.x += (armSide(mod.name) * 2.05 * split) / ROOT_SCALE;
			if (mod.sprung) {
				position.y += stroke;
			}
			mod.group.position.copy(position);
		}

		camera.position.set(0, 0, distance);
		camera.lookAt(0, 0, 0);
		outlineEffect.render(scene, camera);
		options.onJourney?.(j);
	};

	let frame = 0;
	let last = 0;
	let running = false;
	const tick = (now: number) => {
		draw(Math.min(0.05, (now - last) / 1000));
		last = now;
		frame = requestAnimationFrame(tick);
	};

	const resize = () => {
		const width = host.clientWidth;
		const height = host.clientHeight;
		if (!(width && height)) {
			return;
		}
		renderer.setSize(width, height, false);
		const ratio = renderer.getPixelRatio();
		damper.edgeMat.resolution.set(width * ratio, height * ratio);
		aspect = width / height;
		clear = inset / height;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		if (!running) {
			draw(0);
		}
	};
	const observer = new ResizeObserver(resize);
	observer.observe(host);
	resize();
	options.onReady?.();

	return {
		dispose: () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			damper.dispose();
			renderer.forceContextLoss();
			renderer.dispose();
		},
		release: () => {
			if (held === null) {
				return;
			}
			held = null;
			clock =
				Math.floor(clock / LOOP) * LOOP + REST + journey * (LOOP - 2 * REST);
			if (!running) {
				draw(0);
			}
		},
		scrub: (value) => {
			held = clamp01(value);
			if (!running) {
				// No loop to ease toward it: jump there and draw one frame.
				journey = held;
				draw(0);
			}
		},
		setRunning: (next) => {
			if (next === running || reduced) {
				return;
			}
			running = next;
			cancelAnimationFrame(frame);
			if (running) {
				last = performance.now();
				frame = requestAnimationFrame(tick);
			}
		},
	};
}
