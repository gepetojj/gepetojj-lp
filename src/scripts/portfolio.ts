const root = document.documentElement;
root.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- nav: solid on scroll, mobile drawer ---------- */

const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navDrawer = document.getElementById("navDrawer");

const setMenu = (open: boolean) => {
	nav?.classList.toggle("menu-open", open);
	navDrawer?.classList.toggle("is-open", open);
	navDrawer?.setAttribute("aria-hidden", String(!open));
	navDrawer?.toggleAttribute("inert", !open);
	navToggle?.setAttribute("aria-expanded", String(open));
	document.body.classList.toggle("nav-open", open);
};

navToggle?.addEventListener("click", () => {
	setMenu(!nav?.classList.contains("menu-open"));
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && nav?.classList.contains("menu-open")) {
		setMenu(false);
		navToggle?.focus();
	}
});

window.matchMedia("(min-width: 60.0625rem)").addEventListener("change", (e) => {
	if (e.matches) setMenu(false);
});

let ticking = false;
const onScroll = () => {
	if (ticking) return;
	ticking = true;
	requestAnimationFrame(() => {
		nav?.classList.toggle("scrolled", window.scrollY > 24);
		ticking = false;
	});
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- in-page anchors ---------- */

for (const anchor of document.querySelectorAll<HTMLAnchorElement>(
	'a[href^="#"]',
)) {
	anchor.addEventListener("click", (e) => {
		const id = anchor.getAttribute("href");
		if (!id) return;

		if (nav?.classList.contains("menu-open")) setMenu(false);

		const behavior: ScrollBehavior = reduceMotion.matches
			? "auto"
			: "smooth";

		if (id === "#top" || id === "#") {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior });
			return;
		}

		const target = document.querySelector(id);
		if (!target) return;

		e.preventDefault();
		target.scrollIntoView({ behavior, block: "start" });
		history.replaceState(null, "", id);
	});
}

/* ---------- one reveal (content is visible without script) ---------- */

const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");

if ("IntersectionObserver" in window) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add("is-in");
				io.unobserve(entry.target);
			}
		},
		{ rootMargin: "0px 0px -10% 0px" },
	);
	for (const el of revealEls) io.observe(el);
} else {
	for (const el of revealEls) el.classList.add("is-in");
}

/* ---------- scroll spy ---------- */

const spyLinks = document.querySelectorAll<HTMLAnchorElement>("a[data-link]");

if (spyLinks.length && "IntersectionObserver" in window) {
	const spy = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				for (const link of spyLinks) {
					link.classList.toggle(
						"active",
						link.getAttribute("href") === `#${entry.target.id}`,
					);
				}
			}
		},
		{ rootMargin: "-45% 0px -50% 0px" },
	);

	for (const section of document.querySelectorAll("section, .hero")) {
		spy.observe(section);
	}
}

/* ---------- copy email ---------- */

for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
	const label = btn.querySelector(".copy-label");
	const original = label?.textContent ?? "";

	btn.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(btn.dataset.copy ?? "");
		} catch {
			return;
		}
		btn.classList.add("is-copied");
		if (label) label.textContent = btn.dataset.copiedLabel ?? original;
		setTimeout(() => {
			btn.classList.remove("is-copied");
			if (label) label.textContent = original;
		}, 1800);
	});
}

/* ---------- signature: waves on the portrait ---------- */

const waves = document.querySelector<HTMLElement>("[data-waves]");
const waveCanvas = waves?.querySelector<HTMLCanvasElement>(".portrait-waves");
const ditherImg = waves?.querySelector<HTMLImageElement>(".portrait-dither");
const photoImg = waves?.querySelector<HTMLImageElement>(".portrait-photo");

type Wave = { x: number; y: number; born: number };

const ready = (img: HTMLImageElement) =>
	img.complete && img.naturalWidth
		? Promise.resolve()
		: new Promise<void>((res) =>
				img.addEventListener("load", () => res(), { once: true }),
			);

if (waves && waveCanvas && ditherImg && photoImg && !reduceMotion.matches) {
	Promise.all([ready(ditherImg), ready(photoImg)]).then(() => {
		const ctx = waveCanvas.getContext("2d");
		const crest = document.createElement("canvas");
		const body = document.createElement("canvas");
		const ember = document.createElement("canvas");
		const cctx = crest.getContext("2d");
		const bctx = body.getContext("2d");
		const ectx = ember.getContext("2d");
		if (!ctx || !cctx || !bctx || !ectx) return;

		const accent =
			getComputedStyle(waves).getPropertyValue("--color-accent").trim() ||
			"orangered";

		let size = 0;
		const fit = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			size = Math.round(waves.getBoundingClientRect().width * dpr);
			for (const c of [waveCanvas, crest, body, ember]) {
				c.width = size;
				c.height = size;
			}
			// the dither dots, recoloured ember once per size
			ectx.clearRect(0, 0, size, size);
			ectx.globalCompositeOperation = "source-over";
			ectx.drawImage(ditherImg, 0, 0, size, size);
			ectx.globalCompositeOperation = "source-in";
			ectx.fillStyle = accent;
			ectx.fillRect(0, 0, size, size);
		};
		fit();
		new ResizeObserver(fit).observe(waves);

		const list: Wave[] = [];
		const LIFE = 2600; // ms for a wave to cross the portrait
		let hovering = false;
		let pointer = { x: 0.5, y: 0.35 };
		let lastEmit = 0;
		let raf = 0;

		const emit = (x: number, y: number, now = performance.now()) => {
			list.push({ x, y, born: now });
			if (list.length > 7) list.shift();
			lastEmit = now;
			if (!raf) raf = requestAnimationFrame(frame);
		};

		// one soft band between two radii, added onto a mask canvas
		const band = (
			c: CanvasRenderingContext2D,
			x: number,
			y: number,
			inner: number,
			outer: number,
			alpha: number,
		) => {
			if (outer <= 0 || alpha <= 0) return;
			const g = c.createRadialGradient(
				x,
				y,
				Math.max(0, inner),
				x,
				y,
				outer,
			);
			g.addColorStop(0, "rgba(0,0,0,0)");
			g.addColorStop(0.35, `rgba(0,0,0,${alpha})`);
			g.addColorStop(0.65, `rgba(0,0,0,${alpha})`);
			g.addColorStop(1, "rgba(0,0,0,0)");
			c.fillStyle = g;
			c.fillRect(0, 0, size, size);
		};

		const frame = (now: number) => {
			// while the pointer rests on the portrait, the swell keeps coming
			if (hovering && now - lastEmit > 1100)
				emit(pointer.x, pointer.y, now);

			cctx.globalCompositeOperation = "source-over";
			bctx.globalCompositeOperation = "source-over";
			cctx.clearRect(0, 0, size, size);
			bctx.clearRect(0, 0, size, size);

			const reach = size * 1.45;
			for (let i = list.length - 1; i >= 0; i--) {
				const w = list[i];
				const p = (now - w.born) / LIFE;
				if (p >= 1) {
					list.splice(i, 1);
					continue;
				}
				const x = w.x * size;
				const y = w.y * size;
				const r = reach * p;
				const fade = (1 - p) ** 1.4;
				const crestW = size * (0.05 + 0.05 * p);
				const bodyW = size * (0.1 + 0.1 * p);
				cctx.globalCompositeOperation = "lighter";
				bctx.globalCompositeOperation = "lighter";
				band(cctx, x, y, r - crestW, r, 0.8 * fade);
				band(bctx, x, y, r - crestW - bodyW, r - crestW * 0.4, fade);
			}

			cctx.globalCompositeOperation = "source-in";
			cctx.drawImage(ember, 0, 0);
			bctx.globalCompositeOperation = "source-in";
			bctx.drawImage(photoImg, 0, 0, size, size);

			ctx.clearRect(0, 0, size, size);
			ctx.drawImage(crest, 0, 0);
			ctx.drawImage(body, 0, 0);

			if (list.length || hovering) {
				raf = requestAnimationFrame(frame);
			} else {
				ctx.clearRect(0, 0, size, size);
				raf = 0;
			}
		};

		const local = (e: PointerEvent) => {
			const box = waves.getBoundingClientRect();
			return {
				x: (e.clientX - box.left) / box.width,
				y: (e.clientY - box.top) / box.height,
			};
		};

		const finePointer = window.matchMedia(
			"(hover: hover) and (pointer: fine)",
		);

		if (finePointer.matches) {
			waves.addEventListener("pointerenter", (e) => {
				hovering = true;
				pointer = local(e);
				emit(pointer.x, pointer.y);
			});
			waves.addEventListener("pointermove", (e) => {
				const next = local(e);
				const moved = Math.hypot(
					next.x - pointer.x,
					next.y - pointer.y,
				);
				pointer = next;
				// a moving pointer drops a new wave every so often, like a wake
				if (moved > 0.08 || performance.now() - lastEmit > 420) {
					if (moved > 0.02) emit(pointer.x, pointer.y);
				}
			});
			waves.addEventListener("pointerleave", () => {
				hovering = false;
			});
		} else {
			// touch: two waves from the face when the portrait comes into view,
			// and one from every tap
			waves.addEventListener("click", (e) => {
				const at = local(e as PointerEvent);
				emit(at.x, at.y);
			});
			if ("IntersectionObserver" in window) {
				const once = new IntersectionObserver(
					(entries) => {
						if (!entries.some((e) => e.isIntersecting)) return;
						once.disconnect();
						window.setTimeout(() => emit(0.47, 0.33), 600);
						window.setTimeout(() => emit(0.47, 0.33), 1500);
					},
					{ threshold: 0.6 },
				);
				once.observe(waves);
			}
		}
	});
}
