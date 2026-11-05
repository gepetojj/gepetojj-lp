/**
 * Water on the portrait.
 *
 * After the idea behind React Bits' PatternWaves: a wave
 * equation runs on a small float texture, the pointer pushes the surface,
 * and a halftone of dots is drawn from that surface. Here the dots are
 * sampled from the portrait itself: their size comes from the photo's
 * brightness, the water displaces and lights them, the crests turn them
 * ember and wherever the water has passed the photo shows in colour for a
 * moment before it dries back to ink.
 *
 * Progressive: the pre-rendered dither <img> stays in the page and is the
 * LCP. This only takes over (figure.is-gl) after the first frame, and never
 * runs under prefers-reduced-motion or without WebGL2 float targets.
 */
import { Mesh, Program, Renderer, RenderTarget, Texture, Triangle } from "ogl";

const CELL = 4; // CSS px between dots, and between water samples
const STEPS_PER_SECOND = 60;
const DAMPING = 0.98; // how long a ripple keeps travelling
const DRY = 0.982; // how fast the colour fades behind the water
const WET_GAIN = 2.6;
const IDLE_DROP_MS = 3200; // a resting pointer keeps dropping a wave

const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const waterFragment = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D tState;
uniform vec2 uTexel;
uniform vec2 uSize;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uRadius;
uniform float uImpulse;
uniform float uDamping;
uniform float uDry;
uniform float uWetGain;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy * uTexel;
  vec4 s = texture(tState, uv);
  float l = texture(tState, uv - vec2(uTexel.x, 0.0)).r;
  float r = texture(tState, uv + vec2(uTexel.x, 0.0)).r;
  float b = texture(tState, uv - vec2(0.0, uTexel.y)).r;
  float a = texture(tState, uv + vec2(0.0, uTexel.y)).r;
  float next = ((l + r + b + a) * 0.5 - s.g) * uDamping;

  vec2 p = uv * uSize;
  vec2 seg = uTo - uFrom;
  float along = clamp(dot(p - uFrom, seg) / max(dot(seg, seg), 1e-4), 0.0, 1.0);
  float d = length(p - uFrom - seg * along) / uRadius;
  next -= uImpulse * exp(-d * d * 2.0);

  float wet = max(s.b * uDry, min(abs(next) * uWetGain, 1.0));
  fragColor = vec4(next, s.r, wet, 1.0);
}
`;

const dotsFragment = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D tPhoto;
uniform sampler2D tWater;
uniform vec2 uRes;
uniform float uPitch;
uniform vec2 uWaterTexel;
uniform float uTime;
uniform vec3 uInk;
uniform vec3 uEmber;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = floor(frag / uPitch);
  vec4 best = vec4(0.0);
  vec3 lightDir = normalize(vec3(-0.45, 0.55, 0.7));

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 c = cell + vec2(float(i), float(j));
      vec2 home = (c + 0.5) * uPitch;
      vec2 uv = home / uRes;
      if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) continue;
      vec4 photo = texture(tPhoto, uv);
      if (photo.a < 0.35) continue;

      vec4 w = texture(tWater, uv);
      float hx = texture(tWater, uv + vec2(uWaterTexel.x, 0.0)).r - texture(tWater, uv - vec2(uWaterTexel.x, 0.0)).r;
      float hy = texture(tWater, uv + vec2(0.0, uWaterTexel.y)).r - texture(tWater, uv - vec2(0.0, uWaterTexel.y)).r;
      // a slow swell under everything, so the surface is never dead still
      vec2 swell = 0.007 * vec2(
        sin(uv.y * 9.0 + uTime * 0.35) + 0.5 * sin(uv.x * 13.0 - uTime * 0.25),
        cos(uv.x * 8.0 - uTime * 0.3)
      );
      vec2 slope = vec2(hx, hy) * 1.6 + swell;

      vec2 center = home + slope * uPitch * 1.4;
      vec3 n = normalize(vec3(-slope * 3.0, 1.0));
      float shade = clamp(dot(n, lightDir), 0.0, 1.0);
      float glint = pow(shade, 28.0) * clamp(length(slope) * 5.0, 0.0, 1.0);

      float lum = dot(photo.rgb, vec3(0.2126, 0.7152, 0.0722));
      lum = 0.05 + 0.95 * pow(clamp(lum * 1.1, 0.0, 1.0), 0.95);
      float level = clamp(lum * (0.8 + 0.3 * shade) + glint * 0.4, 0.0, 1.0);
      float radius = 0.5 * uPitch * 0.9 * sqrt(level);

      float cov = clamp(0.5 - (length(frag - center) - radius), 0.0, 1.0);
      cov *= smoothstep(0.35, 0.65, photo.a);
      if (cov <= best.a) continue;

      float wet = smoothstep(0.06, 0.55, w.b);
      float crest = smoothstep(0.06, 0.3, w.r);
      // at rest the dots carry the photo's tone, not one flat white
      vec3 tone = uInk * mix(0.45, 1.0, smoothstep(0.0, 0.8, lum));
      vec3 col = mix(tone, photo.rgb * (0.85 + 0.35 * shade), wet);
      col = mix(col, uEmber, crest * 0.75);
      col += glint * 0.35;
      best = vec4(col * cov, cov);
    }
  }
  fragColor = best;
}
`;

const toRgb = (value: string, fallback: [number, number, number]) => {
	const ctx = document.createElement("canvas").getContext("2d");
	if (!ctx) return fallback;
	ctx.fillStyle = "#000";
	ctx.fillStyle = value;
	ctx.fillRect(0, 0, 1, 1);
	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
	return [r / 255, g / 255, b / 255] as [number, number, number];
};

const loaded = (img: HTMLImageElement) =>
	img.complete && img.naturalWidth
		? Promise.resolve()
		: new Promise<void>((resolve, reject) => {
				img.addEventListener("load", () => resolve(), { once: true });
				img.addEventListener("error", () => reject(), { once: true });
			});

export async function startPortraitWaves(figure: HTMLElement) {
	const photo = figure.querySelector<HTMLImageElement>(".portrait-photo");
	if (!photo) return;
	try {
		await loaded(photo);
	} catch {
		return;
	}

	const renderer = new Renderer({
		alpha: true,
		premultipliedAlpha: true,
		antialias: false,
		depth: false,
	});
	const gl = renderer.gl;
	if (!renderer.isWebgl2 || !gl.getExtension("EXT_color_buffer_float")) {
		gl.getExtension("WEBGL_lose_context")?.loseContext();
		return;
	}
	gl.clearColor(0, 0, 0, 0);
	const gl2 = gl as unknown as WebGL2RenderingContext;

	const canvas = gl.canvas as HTMLCanvasElement;
	canvas.className = "portrait-gl";
	canvas.setAttribute("aria-hidden", "true");
	canvas.dataset.keep = "";
	figure.append(canvas);

	const styles = getComputedStyle(figure);
	const ink = toRgb(
		styles.getPropertyValue("--color-ink").trim(),
		[0.94, 0.93, 0.9],
	);
	const ember = toRgb(
		styles.getPropertyValue("--color-accent").trim(),
		[0.95, 0.42, 0.17],
	);

	const geometry = new Triangle(gl);
	const photoTexture = new Texture(gl, {
		image: photo,
		generateMipmaps: false,
		minFilter: gl.LINEAR,
		magFilter: gl.LINEAR,
	});

	const waterTarget = (w: number, h: number) =>
		new RenderTarget(gl, {
			width: w,
			height: h,
			depth: false,
			type: gl2.HALF_FLOAT,
			format: gl.RGBA,
			internalFormat: gl2.RGBA16F,
			minFilter: gl.LINEAR,
			magFilter: gl.LINEAR,
		});

	let water = {
		read: waterTarget(4, 4),
		write: waterTarget(4, 4),
		w: 4,
		h: 4,
	};

	const waterUniforms = {
		tState: { value: water.read.texture },
		uTexel: { value: [1 / 4, 1 / 4] },
		uSize: { value: [1, 1] },
		uFrom: { value: [0, 0] },
		uTo: { value: [0, 0] },
		uRadius: { value: 28 },
		uImpulse: { value: 0 },
		uDamping: { value: DAMPING },
		uDry: { value: DRY },
		uWetGain: { value: WET_GAIN },
	};
	const waterMesh = new Mesh(gl, {
		geometry,
		program: new Program(gl, {
			vertex,
			fragment: waterFragment,
			uniforms: waterUniforms,
			depthTest: false,
			depthWrite: false,
		}),
	});

	const dotsUniforms = {
		tPhoto: { value: photoTexture },
		tWater: { value: water.read.texture },
		uRes: { value: [1, 1] },
		uPitch: { value: CELL },
		uWaterTexel: { value: [1 / 4, 1 / 4] },
		uTime: { value: 0 },
		uInk: { value: ink },
		uEmber: { value: ember },
	};
	const dotsMesh = new Mesh(gl, {
		geometry,
		program: new Program(gl, {
			vertex,
			fragment: dotsFragment,
			uniforms: dotsUniforms,
			depthTest: false,
			depthWrite: false,
			transparent: true,
		}),
	});

	let width = 1;
	let height = 1;
	const resize = () => {
		width = Math.max(1, figure.clientWidth);
		height = Math.max(1, figure.clientHeight);
		renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);
		renderer.setSize(width, height);
		const w = Math.max(8, Math.round(width / CELL));
		const h = Math.max(8, Math.round(height / CELL));
		if (w !== water.w || h !== water.h) {
			for (const t of [water.read, water.write]) {
				gl.deleteFramebuffer(t.buffer);
				gl.deleteTexture(t.texture.texture);
			}
			water = { read: waterTarget(w, h), write: waterTarget(w, h), w, h };
		}
	};
	resize();

	const pointer = {
		x: 0,
		y: 0,
		lastX: 0,
		lastY: 0,
		inside: false,
		burst: 0,
		still: 0,
	};
	let clock = 0;
	let time = 0;
	let last = performance.now();
	let raf = 0;
	let visible = true;
	let shown = false;

	const step = (dt: number) => {
		clock = Math.min(clock + dt * STEPS_PER_SECOND, 4);
		const moved = Math.hypot(
			pointer.x - pointer.lastX,
			pointer.y - pointer.lastY,
		);
		let impulse = pointer.inside ? Math.min(moved / 14, 1) * 0.3 : 0;
		if (pointer.inside && moved < 0.5) {
			pointer.still += dt * 1000;
			if (pointer.still > IDLE_DROP_MS) {
				pointer.still = 0;
				impulse += 0.2;
			}
		} else {
			pointer.still = 0;
		}
		impulse += pointer.burst;
		pointer.burst = 0;

		waterUniforms.uTexel.value = [1 / water.w, 1 / water.h];
		waterUniforms.uSize.value = [width, height];
		waterUniforms.uFrom.value = [pointer.lastX, height - pointer.lastY];
		waterUniforms.uTo.value = [pointer.x, height - pointer.y];
		waterUniforms.uRadius.value = Math.max(18, width * 0.045);
		while (clock >= 1) {
			clock -= 1;
			waterUniforms.tState.value = water.read.texture;
			waterUniforms.uImpulse.value = impulse;
			renderer.render({
				scene: waterMesh,
				target: water.write,
				clear: false,
			});
			[water.read, water.write] = [water.write, water.read];
			impulse = 0;
		}
		pointer.lastX = pointer.x;
		pointer.lastY = pointer.y;
	};

	const frame = (now: number) => {
		raf = 0;
		const dt = Math.min(0.05, Math.max(1 / 240, (now - last) / 1000));
		last = now;
		time += dt;
		step(dt);

		dotsUniforms.tWater.value = water.read.texture;
		dotsUniforms.uWaterTexel.value = [1 / water.w, 1 / water.h];
		dotsUniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
		dotsUniforms.uPitch.value = CELL * renderer.dpr;
		dotsUniforms.uTime.value = time;
		renderer.render({ scene: dotsMesh });

		if (!shown) {
			shown = true;
			figure.classList.add("is-gl");
		}
		if (visible) raf = requestAnimationFrame(frame);
	};

	const start = () => {
		if (raf || !visible) return;
		last = performance.now();
		raf = requestAnimationFrame(frame);
	};

	const locate = (e: PointerEvent) => {
		const box = figure.getBoundingClientRect();
		return { x: e.clientX - box.left, y: e.clientY - box.top };
	};

	figure.addEventListener("pointerenter", (e) => {
		const at = locate(e);
		pointer.x = pointer.lastX = at.x;
		pointer.y = pointer.lastY = at.y;
		pointer.inside = e.pointerType !== "touch";
	});
	figure.addEventListener("pointermove", (e) => {
		if (e.pointerType === "touch") return;
		const at = locate(e);
		pointer.x = at.x;
		pointer.y = at.y;
		pointer.inside = true;
	});
	figure.addEventListener("pointerleave", () => {
		pointer.inside = false;
	});
	figure.addEventListener("pointerdown", (e) => {
		const at = locate(e);
		pointer.x = pointer.lastX = at.x;
		pointer.y = pointer.lastY = at.y;
		pointer.burst = 1.1;
	});

	new ResizeObserver(resize).observe(figure);
	new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting && !document.hidden;
		start();
	}).observe(figure);
	document.addEventListener("visibilitychange", () => {
		visible = !document.hidden;
		start();
	});

	// one splash on the face when the portrait first comes into view
	window.setTimeout(() => {
		pointer.x = pointer.lastX = width * 0.47;
		pointer.y = pointer.lastY = height * 0.34;
		pointer.burst = 0.9;
	}, 900);

	start();
}
