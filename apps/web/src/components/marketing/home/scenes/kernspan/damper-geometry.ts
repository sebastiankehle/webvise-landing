/**
 * Procedural hydraulic Fahrerhausdämpfung (truck-cab damper), modelled to match
 * a real twin-tube cab damper: two bushing eyes, a thin piston rod, a stamped top cap, a
 * domed outer housing (Gehäuse), a cast barrel body that bulges then tapers to a narrow
 * neck, and — hidden inside until it explodes — the rod guide, the ported piston/valve,
 * the rebound spring and the base valve. Built as hidden-line technical line-art.
 *
 * Rendering register (the "real technical drawing" technique, carried over from an earlier hero):
 *   • each part's hard edges → EdgesGeometry → LineSegments2 (screen-space px width,
 *     anti-aliased, identical weight at any depth);
 *   • a single opaque surface pass (paper-flat on the light beats, flat facet tones with a
 *     warm edge light on the dark beats) with polygonOffset so it sits just behind its own
 *     lines and occludes whatever is behind it (true hidden-line) — so the closed housing
 *     hides the internals until it slides away;
 *   • the hero adds an OutlineEffect for the view-dependent silhouette of smooth bodies.
 * Keeping vertex normals is required for both correct occlusion AND the silhouette pass.
 *
 * The damper stands vertically along +Y. Every module separates AXIALLY — straight up or
 * down along the central axis, never sideways — so the deconstruct stays a clean coaxial
 * stack that can never clip out of frame horizontally. `setExplode(t)` lerps home→exploded
 * (the axial shift); `stroke(dy)` telescopes the rod/piston core (the working stroke).
 *
 * three is imported statically; this module is only ever loaded via a client-side
 * dynamic import() in the hero/mini, so it stays out of SSR and the initial bundle.
 */
import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Dihedral angle (deg) above which EdgesGeometry draws a line. Raised 14°→20°: at 14° the
// near-coplanar steps of the dome/thread/knurl profiles each spawned their own full ring,
// and dense concentric rings of identical radius MOIRÉ (beat against each other) under the
// idle rotation at small on-screen sizes. 20° still draws every intentional machined
// feature (real shoulders/chamfers/grooves are ≥30° dihedral) but stops generating a
// separate circle for every shallow profile inflection — fewer, crisper rings, no beating.
const EDGE_ANGLE = 20;

// Around-axis tessellation. High so every revolved silhouette is a smooth curve, not a
// faceted polygon — the core "needs more polygons" fix. Big bodies keep this; small dense
// features use SEG_FINE (below) where 256 facets per ring just feed the moiré.
const SEG = 256;

// Reduced tessellation for the small, densely-ringed features (thread tip, cap dome rings,
// knurl/groove bands). At their tiny on-screen radius 256 segments resolve to sub-pixel
// facets whose round-off interferes between adjacent same-radius rings → the spinning
// shimmer. 96 segments still reads as a smooth circle at that size while giving the lines
// stable, well-separated vertices that don't beat under rotation.
const SEG_FINE = 96;

// Cutaway: the outer shells (housing + body tube) are revolved as PARTIAL surfaces with a
// wedge removed at the FRONT (+Z, where φ=0). The camera only ever orbits within ±AZ of the
// front, so this opening always faces it — sectioning the part so the rod, piston, spring
// and valve inside stay visible, like a technical cutaway. φ=0 → +Z, φ=π/2 → +X.
const CUT = 1.05; // half-angle of the front opening (rad) ≈ 60°
const SHELL_START = CUT;
const SHELL_LEN = Math.PI * 2 - 2 * CUT;

/** Revolved profile (axis = Y). Drop UV only — normals are kept for occlusion + outline. */
function lathe(
	points: [number, number][],
	seg = SEG,
	phiStart = 0,
	phiLength = Math.PI * 2,
): THREE.BufferGeometry {
	const raw = new THREE.LatheGeometry(
		points.map(([x, y]) => new THREE.Vector2(x, y)),
		seg,
		phiStart,
		phiLength,
	);
	const g = raw.toNonIndexed();
	raw.dispose();
	g.deleteAttribute("uv");
	return g;
}

// Drop only UV (keep normals — the fill needs them to occlude and the OutlineEffect
// needs them for the silhouette hull).
const strip = (g: THREE.BufferGeometry) => {
	const out = g.index ? g.toNonIndexed() : g;
	if (out !== g) g.dispose();
	out.deleteAttribute("uv");
	return out;
};

/** The two flat faces that close a partial (cutaway) lathe at its two cut angles. Without
 *  them the shell is OPEN, and OutlineEffect's inverted-hull silhouette breaks up on open
 *  geometry (missing outlines). Capping turns it into a closed SECTIONED solid: a complete,
 *  gap-free silhouette plus a crisp cut outline showing the wall — a real section view.
 *  Lathe maps a profile point (r,y) at angle φ to (r·sinφ, y, r·cosφ); a ShapeGeometry in
 *  XY maps there by rotateY(φ − π/2). */
function cutCaps(
	points: [number, number][],
	phiStart: number,
	phiEnd: number,
): THREE.BufferGeometry {
	const shape = new THREE.Shape(
		points.map(([x, y]) => new THREE.Vector2(x, y)),
	);
	const a = strip(new THREE.ShapeGeometry(shape)).rotateY(
		phiStart - Math.PI / 2,
	);
	const b = strip(new THREE.ShapeGeometry(shape)).rotateY(phiEnd - Math.PI / 2);
	const m = mergeGeometries([a, b], false) ?? a;
	if (m !== a) a.dispose();
	b.dispose();
	return m;
}

/** A ring of n thin radial ridges around radius r at axial position a — a knurled grip
 *  / notched flange band once EdgesGeometry draws the facet seams. */
function knurlRing(
	r: number,
	a: number,
	n: number,
	opts?: { height?: number; tooth?: number; wide?: number },
): THREE.BufferGeometry {
	const height = opts?.height ?? 0.12;
	const tooth = opts?.tooth ?? 0.05;
	const wide = opts?.wide ?? 0.04;
	const proto = strip(new THREE.BoxGeometry(tooth, height, wide));
	proto.translate(r + tooth / 2, a, 0);
	const parts: THREE.BufferGeometry[] = [];
	for (let i = 0; i < n; i++) {
		const v = proto.clone();
		v.applyMatrix4(new THREE.Matrix4().makeRotationY((i / n) * Math.PI * 2));
		parts.push(v);
	}
	proto.dispose();
	const m = mergeGeometries(parts, false) ?? parts[0];
	for (const p of parts) if (p !== m) p.dispose();
	return m;
}

/** A circle of small axial fasteners on a flange face. The heads are intentionally tiny:
 *  they add CNC-machined scale cues without overpowering the hidden-line drawing. */
function boltCircle(
	rc: number,
	y: number,
	n: number,
	opts?: { boltR?: number; height?: number; sides?: number; phase?: number },
): THREE.BufferGeometry {
	const boltR = opts?.boltR ?? 0.025;
	const height = opts?.height ?? 0.055;
	const sides = opts?.sides ?? 6;
	const phase = opts?.phase ?? 0;
	const proto = strip(new THREE.CylinderGeometry(boltR, boltR, height, sides));
	proto.translate(rc, y, 0);
	const parts: THREE.BufferGeometry[] = [];
	for (let i = 0; i < n; i++) {
		const v = proto.clone();
		v.applyMatrix4(
			new THREE.Matrix4().makeRotationY(phase + (i / n) * Math.PI * 2),
		);
		parts.push(v);
	}
	proto.dispose();
	const m = mergeGeometries(parts, false) ?? parts[0];
	for (const p of parts) if (p !== m) p.dispose();
	return m;
}

/** A thin proud band sitting on radius r at axial y — its two open rims read as a crisp
 *  pair of turned-groove circles (the front arc visible, the back hidden behind the fill).
 *  This is the casing-groove trick: it forces clean circumferential lines onto otherwise
 *  blank cylindrical surfaces, which is what gives the drawing its dense, machined read. */
function grooveRing(
	r: number,
	y: number,
	proud = 0.014,
	half = 0.012,
	phiStart = 0,
	phiLength = Math.PI * 2,
	seg = SEG,
) {
	return lathe(
		[
			[r + proud, y + half],
			[r + proud, y - half],
		],
		seg,
		phiStart,
		phiLength,
	);
}

function helixPoints(
	r: number,
	y0: number,
	y1: number,
	turns: number,
	steps: number,
): THREE.Vector3[] {
	const pts: THREE.Vector3[] = [];
	for (let i = 0; i <= steps; i++) {
		const s = i / steps;
		const ang = s * turns * Math.PI * 2;
		pts.push(
			new THREE.Vector3(Math.cos(ang) * r, lerp(y0, y1, s), Math.sin(ang) * r),
		);
	}
	return pts;
}

/** A round-wire coil spring as a tube swept along a helix (CatmullRom → Tube). */
function coilTube(
	pts: THREE.Vector3[],
	wire: number,
	radial: number,
): THREE.BufferGeometry {
	const curve = new THREE.CatmullRomCurve3(pts);
	const raw = new THREE.TubeGeometry(
		curve,
		pts.length - 1,
		wire,
		radial,
		false,
	);
	const g = raw.toNonIndexed();
	raw.dispose();
	g.deleteAttribute("uv");
	return g;
}

function lineSegmentsFromPoints(pts: THREE.Vector3[]): LineSegmentsGeometry {
	const pos: number[] = [];
	for (let i = 1; i < pts.length; i++) {
		const a = pts[i - 1];
		const b = pts[i];
		pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
	}
	const geo = new LineSegmentsGeometry();
	geo.setPositions(pos);
	return geo;
}

/** A ring of n axial bores (flow ports) at radius rc, centred at y=a. */
function portRing(
	rc: number,
	a: number,
	len: number,
	n: number,
	pr = 0.045,
): THREE.BufferGeometry {
	const parts: THREE.BufferGeometry[] = [];
	for (let i = 0; i < n; i++) {
		const c = strip(new THREE.CylinderGeometry(pr, pr, len, 40));
		c.translate(rc, a, 0);
		c.applyMatrix4(new THREE.Matrix4().makeRotationY((i / n) * Math.PI * 2));
		parts.push(c);
	}
	const m = mergeGeometries(parts, false) ?? parts[0];
	for (const p of parts) if (p !== m) p.dispose();
	return m;
}

/** A hexagonal nut / fitting body (6-sided prism) of radius r, height h, centred at y. */
function hexNut(r: number, y: number, h: number): THREE.BufferGeometry {
	return strip(new THREE.CylinderGeometry(r, r, h, 6).translate(0, y, 0));
}

/** A flat valve shim / disc — radius r, thickness h, centred at y (on the axis). */
function disc(r: number, y: number, h: number): THREE.BufferGeometry {
	return strip(new THREE.CylinderGeometry(r, r, h, 128).translate(0, y, 0));
}

/** A horizontal bushing eye centred at y=cy (bore along X). A BEVEL-turned cross-section:
 *  chamfered outer rim + a raised bored hub standing proud of each face — so it reads as a
 *  solid forged eye with real depth, not a flat washer. */
function eye(
	rOuter: number,
	rBore: number,
	width: number,
	cy: number,
): THREE.BufferGeometry {
	const w = width / 2;
	const hub = Math.min(0.07, w * 0.5); // how far the bore boss stands proud of each face
	// CLOSED cross-section: raised hub → face → CRISP cylindrical outer rim → bore wall. The
	// sharp 90° rim makes EdgesGeometry draw the front + back rim circles as complete loops,
	// so the eye's outer outline projects to a complete ellipse at any angle (no silhouette
	// gaps), while the proud hub keeps the forged depth. Lathe round Y, then bore along X.
	const sec = lathe([
		[rBore, w + hub], // hub face (proud)
		[rBore + 0.1, w + hub],
		[rBore + 0.13, w], // step down to the washer face
		[rOuter, w], // crisp front rim (complete circle at the OD)
		[rOuter, -w], // straight cylindrical OD → crisp back rim
		[rBore + 0.13, -w],
		[rBore + 0.1, -w - hub],
		[rBore, -w - hub],
		[rBore, w + hub], // bore wall, close
	]);
	// inner steel sleeve standing proud of both faces — the rubber annulus reads as the gap
	// between the bore wall and the sleeve, so the eye becomes a real rubber-metal bushing.
	const rSleeve = rBore * 0.66;
	const rHole = rBore * 0.4;
	const sleeve = lathe([
		[rHole, w + hub * 1.3],
		[rSleeve, w + hub * 1.3],
		[rSleeve, w + hub * 0.9],
		[rSleeve, -w - hub * 0.9],
		[rSleeve, -w - hub * 1.3],
		[rHole, -w - hub * 1.3],
		[rHole, w + hub * 1.3],
	]);
	const parts = [sec, sleeve];
	const m = mergeGeometries(parts, false) ?? sec;
	for (const p of parts) if (p !== m) p.dispose();
	m.rotateZ(Math.PI / 2);
	m.translate(0, cy, 0);
	return m;
}

/** One cast structural side-arm (Lagerbock) that brackets the lower body. Each is a
 *  BEVEL-EXTRUDED cast plate with a lightening pocket. The right/left arms stay separate so
 *  the final split can detach them outward from the body instead of sliding round shells. */
function sideArm(side: 1 | -1): THREE.BufferGeometry {
	const s = new THREE.Shape();
	// side profile (x = outward from body, y = along the damper axis)
	s.moveTo(0.1, 0.55);
	s.lineTo(0.44, 0.48);
	s.lineTo(0.52, 0.1);
	s.lineTo(0.5, -0.35);
	s.lineTo(0.64, -0.66); // foot flares out
	s.lineTo(0.58, -0.82);
	s.lineTo(0.16, -0.82);
	s.lineTo(0.1, -0.45);
	s.lineTo(0.14, 0.0);
	s.lineTo(0.08, 0.3);
	s.closePath();
	const pocket = new THREE.Path();
	pocket.absellipse(0.32, -0.12, 0.1, 0.24, 0, Math.PI * 2, false, 0);
	s.holes.push(pocket);
	const proto = strip(
		new THREE.ExtrudeGeometry(s, {
			depth: 0.14,
			bevelEnabled: true,
			bevelThickness: 0.025,
			bevelSize: 0.025,
			bevelSegments: 3,
			curveSegments: 24,
			steps: 1,
		}),
	);
	const verticalWeb = strip(new THREE.BoxGeometry(0.042, 0.78, 0.17));
	verticalWeb.translate(0.2, -0.2, 0);
	const upperWeb = strip(new THREE.BoxGeometry(0.36, 0.034, 0.17));
	upperWeb.rotateZ(-0.18);
	upperWeb.translate(0.33, 0.3, 0);
	const lowerWeb = strip(new THREE.BoxGeometry(0.34, 0.034, 0.17));
	lowerWeb.rotateZ(0.16);
	lowerWeb.translate(0.36, -0.58, 0);
	const merged =
		mergeGeometries([proto, verticalWeb, upperWeb, lowerWeb], false) ?? proto;
	for (const p of [proto, verticalWeb, upperWeb, lowerWeb])
		if (p !== merged) p.dispose();
	// Seat the arms outside the body wall with visible clearance. A tiny 0.02-unit gap
	// still clipped during the side-view roll once bevels and outline expansion were added.
	merged.translate(0.6, -0.55, -0.07);
	if (side < 0) merged.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI));
	return merged;
}

export type DamperModule = {
	name: string;
	group: THREE.Group;
	home: THREE.Vector3;
	exploded: THREE.Vector3;
	sprung: boolean;
	label?: string;
};

export type Damper = {
	root: THREE.Group;
	modules: DamperModule[];
	surfaceMat: THREE.ShaderMaterial;
	outlineMat: THREE.MeshBasicMaterial;
	edgeMat: LineMaterial;
	setExplode: (t: number) => void;
	stroke: (dy: number) => void;
	radius: number;
	length: number;
	dispose: () => void;
};

export function buildDamper(): Damper {
	const root = new THREE.Group();

	// ONE opaque surface pass carrying both registers: the flat paper fill (light beats,
	// uShade=0) and the dark-phase volume (uShade=1) in the anime.js hero register —
	// per-FACET flat tones (three quantized dark values) plus a solid ice-blue edge light
	// on facets that graze the view while turned toward the key. The facet normal comes from
	// screen-space derivatives, so every face renders ONE constant tone: no terminator can
	// cross a face, which kills the thin crawling shadow lines (and their rotation
	// flicker) that any smooth ramp paints across dense grooves/ribs. Opaque single pass:
	// the old transparent shadow/highlight overlays stacked in concave clusters and sank
	// them to black — the tonal floor here is bounded at uShadowColor by construction.
	const surfaceMat = new THREE.ShaderMaterial({
		// highp: iOS may otherwise pick mediump for the fragment stage, where the N·L dot
		// loses precision across the wide ramp. Cheap cross-GPU safety.
		precision: "highp",
		uniforms: {
			uColor: { value: new THREE.Color(0xffffff) },
			uShadowColor: { value: new THREE.Color(0x3c4650) },
			uHighlightColor: { value: new THREE.Color(0xd5e8fb) },
			uInkColor: { value: new THREE.Color(0x667584) },
			uLightDir: {
				value: new THREE.Vector3(-0.48, 0.78, 0.42).normalize(),
			},
			uShade: { value: 0 },
		},
		vertexShader: `
			varying vec3 vNormal;
			varying vec3 vWorldPos;

			void main() {
				vec4 worldPos = modelMatrix * vec4(position, 1.0);
				vWorldPos = worldPos.xyz;
				vNormal = normalize(mat3(modelMatrix) * normal);
				gl_Position = projectionMatrix * viewMatrix * worldPos;
			}
		`,
		fragmentShader: `
			uniform vec3 uColor;
			uniform vec3 uShadowColor;
			uniform vec3 uHighlightColor;
			uniform vec3 uInkColor;
			uniform vec3 uLightDir;
			uniform float uShade;
			varying vec3 vNormal;
			varying vec3 vWorldPos;

			void main() {
				// Geometric facet normal from screen-space derivatives: constant per face
				// (and automatically viewer-facing, so cutaway interiors shade coherently).
				vec3 nf = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
				// Where a surface goes edge-on the pixel-quad derivatives straddle many
				// foreshortened triangles and nf flips per pixel — a bristling noise fan at
				// every limb (the dome was the worst). The interpolated vertex normal stays
				// stable there, so blend to it as the surface grazes the view. Hard-normal
				// geometry (arms, tabs, hexes) is unaffected: its vertex normals are
				// per-face anyway, so the flat facet look survives everywhere it's visible.
				vec3 v = normalize(cameraPosition - vWorldPos);
				vec3 ns = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
				float ndv = clamp(dot(ns, v), 0.0, 1.0);
				vec3 n = normalize(mix(ns, nf, smoothstep(0.15, 0.4, ndv)));
				// Wrap diffuse (0 = fully anti-light, 1 = facing the key).
				float t = dot(n, normalize(uLightDir)) * 0.5 + 0.5;
				// Three flat value zones — anti-light facets sink to the shadow tone, the
				// body holds one dark value (camera-facing faces stay dark, like the
				// reference), and only facets genuinely turned up into the key lift toward
				// a lit grey. A facet's t is constant so a zone can never band across a
				// face; the windows are deliberately WIDE: the dense micro-facet arrays
				// (groove-band rims, knurl teeth, eye rings) sweep through the thresholds
				// as the part turns, and narrow windows made each tiny face pop binary
				// dark/light — the "shadow made of flickering lines". A wide window turns
				// that pop into a gentle ramp across a few facets while big faces still
				// read as one flat tone.
				vec3 tone = mix(uShadowColor, uColor, smoothstep(0.32, 0.5, t));
				tone = mix(tone, mix(uColor, uHighlightColor, 0.5), smoothstep(0.72, 0.88, t));
				// The signature edge light: facets grazing the view while turned toward
				// the key catch a solid highlight sliver along lit silhouettes.
				float rim = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
				float edgeCatch = smoothstep(0.25, 0.55, rim) * smoothstep(0.35, 0.5, t);
				tone = mix(tone, uHighlightColor, edgeCatch);
				vec3 col = mix(uColor, tone, uShade);
				// Screen-space ink contour: a ~2px band where the smooth surface turns
				// edge-on to the view. The inverted-hull outline needs a closed far side,
				// so it breaks on the cutaway shells as the part spins; this hugs EVERY
				// silhouette — open shells, section edges, interior limbs — at constant
				// pixel width (fwidth-scaled), with no depth contests at all.
				float iw = max(fwidth(ndv), 1e-4);
				float ink = 1.0 - smoothstep(1.6 * iw, 3.2 * iw, ndv);
				col = mix(col, uInkColor, ink * 0.85);
				gl_FragColor = vec4(col, 1.0);
				// Color uniforms are linear-sRGB (ColorManagement converts on setHex); encode
				// back to the renderer's sRGB output like the built-in materials do, or the
				// whole surface renders a stop too dark.
				#include <colorspace_fragment>
			}
		`,
		side: THREE.DoubleSide,
		// POSITIVE offset pushes the surface BACK so its own edge lines reliably draw in
		// front (the classic hidden-line tie-break). Factor 1, NOT 2: the factor term is
		// slope-scaled, and at grazing angles a factor of 2 pushed the fill so far back
		// that the OutlineEffect's near-black hull won the depth test and bled through the
		// dome/eye interiors as flickering black strips. The old factor-2 headroom existed
		// for coplanar transparent shading passes that no longer exist. Positive offset is
		// safe on Apple TBDR (negative offset was the historical iOS regression).
		polygonOffset: true,
		polygonOffsetFactor: 1,
		polygonOffsetUnits: 2,
	});
	surfaceMat.userData.outlineParameters = { visible: false };
	const outlineMat = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0,
		depthWrite: false,
	});
	outlineMat.colorWrite = false;
	outlineMat.userData.outlineParameters = {
		visible: true,
		thickness: 0.0022,
		color: [0.235, 0.247, 0.267],
		alpha: 0.88,
		keepAlive: true,
	};
	// The line-art register: thin, MID-GREY lines (not near-black). Near-black + dense
	// rings read as filled/"shaded"; mid-grey thin lines read as a clean technical drawing.
	const edgeMat = new LineMaterial({
		color: 0x8d9297,
		linewidth: 1.02,
		worldUnits: false,
		alphaToCoverage: true,
	});
	const disposables: { dispose: () => void }[] = [
		surfaceMat,
		outlineMat,
		edgeMat,
	];

	// geometry → line-art group: the shaded surface mesh + its hard edges as fat lines.
	// lineGeo: draw the edge lines from THIS geometry instead of the full one (which still
	// fills/occludes/outlines) — keeps dense micro-features (rim tabs, bolt heads) out of
	// the line pass, where their strokes pile into a black bristle at grazing angles while
	// the features themselves stay visible as shaded, silhouetted forms.
	const lineArt = (
		geo: THREE.BufferGeometry,
		edgeAngle = EDGE_ANGLE,
		lineGeo?: THREE.BufferGeometry,
	) => {
		const g = new THREE.Group();
		const surface = new THREE.Mesh(geo, surfaceMat);
		const outline = new THREE.Mesh(geo, outlineMat);
		const edges = new THREE.EdgesGeometry(lineGeo ?? geo, edgeAngle);
		const lsg = new LineSegmentsGeometry().fromEdgesGeometry(edges);
		edges.dispose();
		const lines = new LineSegments2(lsg, edgeMat);
		g.add(surface, outline, lines);
		disposables.push(geo, lsg);
		if (lineGeo) disposables.push(lineGeo);
		return g;
	};
	const springArt = (geo: THREE.BufferGeometry, pts: THREE.Vector3[]) => {
		const g = new THREE.Group();
		const surface = new THREE.Mesh(geo, surfaceMat);
		const outline = new THREE.Mesh(geo, outlineMat);
		const lsg = lineSegmentsFromPoints(pts);
		const lines = new LineSegments2(lsg, edgeMat);
		g.add(surface, outline, lines);
		disposables.push(geo, lsg);
		return g;
	};

	const modules: DamperModule[] = [];
	// geo is baked at its real assembled position; `shift` is the axial offset (up/down
	// the central axis) it moves to when fully exploded. Nothing ever leaves the axis.
	const add = (
		name: string,
		geo: THREE.BufferGeometry,
		shift: number,
		opts?: {
			label?: string;
			sprung?: boolean;
			edgeAngle?: number;
			outlineGeo?: THREE.BufferGeometry;
			lineGeo?: THREE.BufferGeometry;
		},
	) => {
		const mod = new THREE.Group();
		mod.add(lineArt(geo, opts?.edgeAngle, opts?.lineGeo));
		if (opts?.outlineGeo) {
			mod.add(new THREE.Mesh(opts.outlineGeo, outlineMat));
			disposables.push(opts.outlineGeo);
		}
		root.add(mod);
		modules.push({
			name,
			group: mod,
			home: new THREE.Vector3(0, 0, 0),
			exploded: new THREE.Vector3(0, shift, 0),
			sprung: opts?.sprung ?? false,
			label: opts?.label,
		});
		return mod;
	};
	const addSpring = (
		name: string,
		geo: THREE.BufferGeometry,
		pts: THREE.Vector3[],
		shift: number,
		opts?: { label?: string; sprung?: boolean },
	) => {
		const mod = new THREE.Group();
		mod.add(springArt(geo, pts));
		root.add(mod);
		modules.push({
			name,
			group: mod,
			home: new THREE.Vector3(0, 0, 0),
			exploded: new THREE.Vector3(0, shift, 0),
			sprung: opts?.sprung ?? false,
			label: opts?.label,
		});
		return mod;
	};

	// ---- Lagerauge oben (top mounting eye) — sprung, rides the rod ----
	const upperEye = eye(0.4, 0.16, 0.32, 3.0);
	add("Lagerauge oben", upperEye, 3.3, {
		label: "Lagerauge",
		sprung: true,
	});

	// ---- Kolbenstange (piston rod) — thin chromed shaft up through the body/guide/cap into a
	// thicker exposed rod and a threaded tip that the top eye nuts onto. Sprung: telescopes. ----
	const rodParts: THREE.BufferGeometry[] = [
		strip(
			new THREE.CylinderGeometry(0.09, 0.09, 2.0, 72).translate(0, 0.45, 0),
		),
		strip(new THREE.CylinderGeometry(0.13, 0.13, 1.0, 72).translate(0, 1.9, 0)),
		// turned relief shoulder, then the necked threaded tip
		strip(new THREE.CylinderGeometry(0.1, 0.1, 0.46, 72).translate(0, 2.57, 0)),
		// hex jam nut where the upper eye seats on the tip
		hexNut(0.15, 2.42, 0.12),
	];
	// rolled thread on the exposed tip. 4 proud rings (was 6) at the same pitch but spread a
	// touch wider, and at SEG_FINE: six 256-segment rings of identical 0.1 radius stacked
	// 0.055 apart was the worst moiré source — adjacent rings beat against each other under
	// rotation. Fewer, lower-tessellation rings still read clearly as a threaded tip.
	for (let i = 0; i < 4; i++)
		rodParts.push(
			grooveRing(0.1, 2.55 + i * 0.07, 0.01, 0.014, 0, Math.PI * 2, SEG_FINE),
		);
	const rodOutlineParts: THREE.BufferGeometry[] = [
		strip(
			new THREE.CylinderGeometry(0.09, 0.09, 2.0, 72).translate(0, 0.45, 0),
		),
		strip(new THREE.CylinderGeometry(0.13, 0.13, 1.0, 72).translate(0, 1.9, 0)),
		strip(new THREE.CylinderGeometry(0.1, 0.1, 0.46, 72).translate(0, 2.57, 0)),
	];
	const rodMerged = mergeGeometries(rodParts, false) ?? rodParts[0];
	for (const p of rodParts) p.dispose();
	const rodOutline =
		mergeGeometries(rodOutlineParts, false) ?? rodOutlineParts[0];
	for (const p of rodOutlineParts) if (p !== rodOutline) p.dispose();
	add("Kolbenstange", rodMerged, 3.5, {
		sprung: true,
		outlineGeo: rodOutline,
	});

	// ---- Deckel (stamped top cover) — the signature top feature of a real cab damper: a
	// wide DOMED pressed cover the rod exits through, overhanging the can, with a castellated
	// (tabbed) rim. Domed profile + big rim tabs read unmistakably as a stamped cover. ----
	const capProfile: [number, number][] = [
		[0.13, 1.06], // central bore (rod hole), underside
		[0.13, 1.2], // bore wall up
		[0.22, 1.42], // dome inner top
		[0.44, 1.35], // dome curve out
		[0.62, 1.2], // dome shoulder down
		[0.74, 1.1], // out to the wide overhanging flange
		[0.74, 1.0], // flange edge height
		[0.62, 0.98], // flange underside
		[0.3, 1.02], // underside back toward the bore
		[0.13, 1.06],
	];
	const capParts: THREE.BufferGeometry[] = [
		lathe(capProfile, SEG),
		// castellated rim — fewer, larger tabs than a knurl → pressed-cover scallops
		knurlRing(0.74, 1.05, 12, { height: 0.12, tooth: 0.042, wide: 0.068 }),
		// explicit rim witness line: closes the cap visually without using a heavy silhouette
		// proxy that turns into a dark disk when the cap faces the camera.
		grooveRing(0.745, 1.05, 0.006, 0.052),
		boltCircle(0.66, 1.1, 8, {
			boltR: 0.024,
			height: 0.055,
			phase: Math.PI / 8,
		}),
		// No radial dome spokes and no pressed dome rings: viewed at grazing, every
		// concentric ring's linework foreshortens and piles up at the dome's limb — dozens
		// of overlapping 1px strokes that read as a bristling black cluster and shimmer
		// under rotation (the "shadow made of flickering lines"). The dome reads as a
		// stamped cover through its profile + shading alone.
	];
	const capMerged = mergeGeometries(capParts, false) ?? capParts[0];
	for (const p of capParts) p.dispose();
	// Lines come from the turned profile + the rim witness groove ONLY: the castellated
	// tabs and bolt heads still render (occlude, shade, silhouette) but draw no edge
	// lines — at grazing their box edges piled into the flange's bristle cluster.
	// edgeAngle 32: the dome's shallow profile joints (≈22–25° dihedral) otherwise each
	// draw a full ring whose limb strokes join the same pile.
	const capLineParts: THREE.BufferGeometry[] = [
		lathe(capProfile, SEG),
		grooveRing(0.745, 1.05, 0.006, 0.052),
	];
	const capLine = mergeGeometries(capLineParts, false) ?? capLineParts[0];
	for (const p of capLineParts) if (p !== capLine) p.dispose();
	add("Deckel", capMerged, 2.4, { edgeAngle: 32, lineGeo: capLine });

	// ---- Gehäuse (outer housing / reservoir can) — a domed-top shell. CUT AWAY at the front
	// so the rod guide inside stays visible, and slides up to reveal the rest on explode ----
	const housingProfile: [number, number][] = [
		[0.62, 0.0],
		[0.62, 0.36],
		[0.58, 0.42], // turned groove
		[0.62, 0.48],
		[0.62, 0.68],
		[0.58, 0.74], // turned groove
		[0.62, 0.8],
		[0.62, 0.86],
		[0.6, 0.97], // shoulder into the dome
		[0.5, 1.08],
		[0.34, 1.16], // dome down to the rod hole
		[0.32, 1.14],
		[0.47, 1.06], // inner dome back down
		[0.57, 0.94],
		[0.57, 0.02], // inner wall (shell thickness), open bottom
	];
	const housingParts: THREE.BufferGeometry[] = [
		lathe(housingProfile, SEG, SHELL_START, SHELL_LEN),
		cutCaps(housingProfile, SHELL_START, SHELL_START + SHELL_LEN),
	];
	const housingOutlineParts: THREE.BufferGeometry[] = [
		lathe(housingProfile, SEG, SHELL_START, SHELL_LEN),
		cutCaps(housingProfile, SHELL_START, SHELL_START + SHELL_LEN),
	];
	// proud turned rings: shell-conforming surface detail that cannot read as detached
	// floating bars when the part rolls through side view.
	for (const y of [0.08, 0.2, 0.43, 0.7, 0.88])
		housingParts.push(
			grooveRing(0.62, y, 0.014, 0.012, SHELL_START, SHELL_LEN),
		);
	const housingMerged = mergeGeometries(housingParts, false) ?? housingParts[0];
	for (const p of housingParts) if (p !== housingMerged) p.dispose();
	const housingOutline =
		mergeGeometries(housingOutlineParts, false) ?? housingOutlineParts[0];
	for (const p of housingOutlineParts) if (p !== housingOutline) p.dispose();
	add("Gehäuse", housingMerged, 1.72, {
		label: "Gehäuse",
		outlineGeo: housingOutline,
	});

	// ---- Hauptkörper (turned reservoir body) — a STEPPED turned part: distinct cylindrical
	// diameters separated by crisp chamfered shoulders (each shoulder draws a clean ring),
	// carrying turned groove rings, a cast port boss, and a domed closed bottom. The stack of
	// real machined features — not a bare silhouette — is what reads as a precise drawing. ----
	const bodyProfile: [number, number][] = [
		[0.0, 0.36],
		[0.28, 0.36], // top face
		[0.28, 0.2], // rod-exit hub cylinder
		[0.4, 0.16], // chamfer out
		[0.4, 0.12],
		[0.6, 0.04], // chamfer out to the body shoulder (crisp ring)
		[0.6, -0.95], // main body cylinder
		[0.54, -1.02], // chamfer in (shoulder ring)
		[0.54, -1.55], // mid cylinder
		[0.46, -1.66], // chamfer in (shoulder ring)
		[0.46, -1.8], // lower cylinder
		[0.34, -1.92], // dome chamfer
		[0.18, -1.99],
		[0.0, -2.02], // closed bottom
	];
	// CUT AWAY at the front like a sectioned tube, so the piston, spring and base valve nested
	// inside stay visible (the hollow interior reads through the opening)
	const bodyParts: THREE.BufferGeometry[] = [
		lathe(bodyProfile, SEG, SHELL_START, SHELL_LEN),
		cutCaps(bodyProfile, SHELL_START, SHELL_START + SHELL_LEN),
	];
	const bodyOutlineParts: THREE.BufferGeometry[] = [
		lathe(bodyProfile, SEG, SHELL_START, SHELL_LEN),
		cutCaps(bodyProfile, SHELL_START, SHELL_START + SHELL_LEN),
	];
	// a few turned grooves (sparse, so the body reads as a smooth machined pressure tube)
	for (const y of [-0.1, -0.28, -0.55, -0.88])
		bodyParts.push(grooveRing(0.6, y, 0.014, 0.012, SHELL_START, SHELL_LEN));
	for (const y of [-1.18, -1.3, -1.48])
		bodyParts.push(grooveRing(0.54, y, 0.014, 0.012, SHELL_START, SHELL_LEN));
	bodyParts.push(boltCircle(0.48, 0.08, 10, { boltR: 0.018, height: 0.045 }));
	// a cast port boss on the barrel (single side → a real asymmetric feature that also
	// registers the rotation), seated on the body wall, with a bored flow port through it
	const boss = strip(new THREE.BoxGeometry(0.18, 0.36, 0.44));
	boss.translate(0.64, -0.4, 0);
	bodyParts.push(boss);
	const outlineBoss = strip(new THREE.BoxGeometry(0.18, 0.36, 0.44));
	outlineBoss.translate(0.64, -0.4, 0);
	bodyOutlineParts.push(outlineBoss);
	bodyParts.push(
		strip(
			new THREE.CylinderGeometry(0.07, 0.07, 0.44, 32)
				.rotateZ(Math.PI / 2)
				.translate(0.64, -0.4, 0),
		),
	);
	// a small gas-charge valve fitting low on the body (hex body + stem), on the +X shell
	const charge = hexNut(0.07, 0, 0.14);
	charge.rotateZ(Math.PI / 2);
	charge.translate(0.6, -1.3, 0);
	bodyParts.push(charge);
	bodyParts.push(
		strip(
			new THREE.CylinderGeometry(0.03, 0.03, 0.12, 24)
				.rotateZ(Math.PI / 2)
				.translate(0.72, -1.3, 0),
		),
	);
	const nameplate = strip(new THREE.BoxGeometry(0.018, 0.32, 0.34));
	nameplate.translate(-0.612, -0.72, 0);
	bodyParts.push(nameplate);
	const bodyMerged = mergeGeometries(bodyParts, false) ?? bodyParts[0];
	for (const p of bodyParts) p.dispose();
	const bodyOutline =
		mergeGeometries(bodyOutlineParts, false) ?? bodyOutlineParts[0];
	for (const p of bodyOutlineParts) if (p !== bodyOutline) p.dispose();
	add("Hauptkörper", bodyMerged, -0.9, {
		label: "Hauptkörper",
		outlineGeo: bodyOutline,
	});

	// ---- Lagerbock (cast side-arms) — two structural brackets gripping the lower body.
	// Separate modules let the later hero split pull them outward left/right while circular
	// shells stay coaxial. Their first deconstruction slot still remains axial. ----
	const rightArm = sideArm(1);
	const leftArm = sideArm(-1);
	add("Lagerbock rechts", rightArm, -3.2, {
		label: "Lagerbock",
		outlineGeo: rightArm.clone(),
	});
	add("Lagerbock links", leftArm, -3.2, {
		label: "Lagerbock",
		outlineGeo: leftArm.clone(),
	});

	// ---- Führung / Dichtung (rod guide + seal head) — inside the housing top: a press-fit
	// head carrying the rod seal, with a raised scraper lip around the rod and a seal groove ----
	const guideParts: THREE.BufferGeometry[] = [
		lathe([
			[0.1, 0.42], // raised seal/scraper lip around the rod
			[0.19, 0.42],
			[0.19, 0.34],
			[0.47, 0.32],
			[0.47, 0.14],
			[0.41, 0.06],
			[0.41, -0.04],
			[0.1, -0.04],
			[0.1, 0.42],
		]),
		knurlRing(0.47, 0.2, 28, { height: 0.1, tooth: 0.022, wide: 0.034 }),
		boltCircle(0.39, 0.33, 12, {
			boltR: 0.017,
			height: 0.04,
			phase: Math.PI / 12,
		}),
		grooveRing(0.47, 0.27, 0.012, 0.012), // seal-retainer groove on the OD
		grooveRing(0.32, 0.4, 0.01, 0.01),
	];
	const guideMerged = mergeGeometries(guideParts, false) ?? guideParts[0];
	for (const p of guideParts) p.dispose();
	add("Führung", guideMerged, 0.8, { label: "Führung" });

	// ---- Kolben + Ventil (piston + valve stack) — the heart of the damper: a ported piston
	// carrying a PTFE wear band on the OD and a stack of valve shim discs on each face, held by
	// a retaining nut on the rod. Sprung (rides the rod). ----
	const pistonParts: THREE.BufferGeometry[] = [
		// piston body
		lathe([
			[0.0, -0.26],
			[0.42, -0.26],
			[0.5, -0.2],
			[0.54, -0.12],
			[0.54, 0.12],
			[0.5, 0.2],
			[0.42, 0.26],
			[0.0, 0.26],
		]).translate(0, -0.5, 0),
		// PTFE wear band on the OD (proud band → two crisp rings)
		grooveRing(0.54, -0.5, 0.012, 0.07),
		// ring of flow ports through the piston
		portRing(0.32, -0.5, 0.26, 10, 0.032),
		boltCircle(0.24, -0.5, 8, {
			boltR: 0.015,
			height: 0.032,
			phase: Math.PI / 8,
		}),
	];
	// valve shim stacks — thin discs of decreasing radius on each face (rebound side up,
	// compression side down) + the retaining nut on the rod below the piston
	const pistonTop = -0.24; // top face (toward the rod)
	const pistonBot = -0.76; // bottom face
	for (let i = 0; i < 4; i++) {
		pistonParts.push(disc(0.32 - i * 0.06, pistonTop + 0.03 + i * 0.025, 0.02));
		pistonParts.push(disc(0.32 - i * 0.06, pistonBot - 0.03 - i * 0.025, 0.02));
	}
	pistonParts.push(hexNut(0.14, pistonBot - 0.14, 0.1));
	const pistonMerged = mergeGeometries(pistonParts, false) ?? pistonParts[0];
	for (const p of pistonParts) p.dispose();
	add("Kolben", pistonMerged, 0.2, { label: "Kolben", sprung: true });

	// ---- Druckfeder (rebound coil) — round-wire helix. Keep the coil as its own module so
	// it can carry spring-specific wire detail without making the guide/collars turn into
	// noisy hatch marks.
	const springPts = helixPoints(0.31, -1.8, -0.8, 7.6, 420);
	addSpring("Druckfeder", coilTube(springPts, 0.032, 10), springPts, -1.6, {
		label: "Druckfeder",
	});
	const springGuideParts: THREE.BufferGeometry[] = [
		strip(
			new THREE.CylinderGeometry(0.055, 0.055, 1.12, 48).translate(0, -1.3, 0),
		),
		disc(0.34, -1.84, 0.035),
		disc(0.34, -0.76, 0.035),
		grooveRing(0.34, -1.84, 0.008, 0.006, 0, Math.PI * 2, SEG_FINE),
		grooveRing(0.34, -0.76, 0.008, 0.006, 0, Math.PI * 2, SEG_FINE),
	];
	const springGuideMerged =
		mergeGeometries(springGuideParts, false) ?? springGuideParts[0];
	for (const p of springGuideParts) if (p !== springGuideMerged) p.dispose();
	add("Federführung", springGuideMerged, -1.6, { edgeAngle: 42 });

	// ---- Bodenventil (base / foot valve) — the compression valve seated in the bottom of the
	// tube: a ported valve body carrying its own disc + shim stack and a central retainer ----
	const baseParts: THREE.BufferGeometry[] = [
		lathe([
			[0.0, -2.0],
			[0.28, -2.0],
			[0.3, -1.9],
			[0.27, -1.78],
			[0.0, -1.78],
		]),
		portRing(0.18, -1.9, 0.26, 8, 0.036),
		boltCircle(0.22, -1.82, 8, {
			boltR: 0.015,
			height: 0.03,
			phase: Math.PI / 8,
		}),
		disc(0.21, -1.74, 0.02), // valve disc on the upper face
		disc(0.14, -1.71, 0.02), // shim
		disc(0.1, -1.685, 0.018), // fine shim
		hexNut(0.08, -1.66, 0.08), // central retainer
	];
	const baseMerged = mergeGeometries(baseParts, false) ?? baseParts[0];
	for (const p of baseParts) p.dispose();
	add("Bodenventil", baseMerged, -2.5, { label: "Bodenventil" });

	// ---- Lagerauge unten (bottom mounting eye) — a bushing on a short, chunky collar that
	// seats well up into the body bottom, so assembled it reads as one connected part ----
	const lowerEyeParts: THREE.BufferGeometry[] = [
		eye(0.42, 0.18, 0.34, -2.5),
		strip(
			new THREE.CylinderGeometry(0.26, 0.26, 0.5, 96).translate(0, -1.95, 0),
		),
		strip(
			new THREE.CylinderGeometry(0.2, 0.2, 0.36, 96).translate(0, -2.18, 0),
		),
		// turned rings on the collar — SEG_FINE: five small-radius rings stacked 0.1 apart are
		// a concentric-ring moiré source at small on-screen size.
		grooveRing(0.26, -1.74, 0.01, 0.01, 0, Math.PI * 2, SEG_FINE),
		grooveRing(0.26, -1.84, 0.012, 0.012, 0, Math.PI * 2, SEG_FINE),
		grooveRing(0.26, -1.94, 0.01, 0.01, 0, Math.PI * 2, SEG_FINE),
		grooveRing(0.26, -2.04, 0.012, 0.012, 0, Math.PI * 2, SEG_FINE),
		grooveRing(0.2, -2.18, 0.01, 0.012, 0, Math.PI * 2, SEG_FINE),
		boltCircle(0.24, -1.82, 8, {
			boltR: 0.014,
			height: 0.03,
			phase: Math.PI / 8,
		}),
	];
	const lowerEyeMerged =
		mergeGeometries(lowerEyeParts, false) ?? lowerEyeParts[0];
	for (const p of lowerEyeParts) p.dispose();
	add("Lagerauge unten", lowerEyeMerged, -2.7, {
		label: "Lagerauge",
	});

	const tmp = new THREE.Vector3();
	const setExplode = (t: number) => {
		for (const m of modules) {
			tmp.lerpVectors(m.home, m.exploded, t);
			m.group.position.copy(tmp);
		}
	};
	setExplode(0);

	// Telescope the rod/piston core along the axis — the damper's working stroke. Applied
	// on top of setExplode() each frame (additive), so callers do setExplode() → stroke().
	const stroke = (dy: number) => {
		for (const m of modules) if (m.sprung) m.group.position.y += dy;
	};

	const dispose = () => {
		for (const d of disposables) d.dispose();
	};

	return {
		root,
		modules,
		surfaceMat,
		outlineMat,
		edgeMat,
		setExplode,
		stroke,
		radius: 0.9,
		length: 8,
		dispose,
	};
}
