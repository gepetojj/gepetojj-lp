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

/* ---------- signature: the two-wave lens on the portrait ---------- */

const lens = document.querySelector<HTMLElement>("[data-lens]");

if (lens) {
	const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
	const state = { x: 0.5, y: 0.35, r: 0, tx: 0.5, ty: 0.35, tr: 0 };
	let raf = 0;
	let start = performance.now();

	const radius = () => lens.getBoundingClientRect().width * 0.17;

	const paint = (now: number) => {
		const still = reduceMotion.matches;
		const k = still ? 1 : 0.16;
		state.x += (state.tx - state.x) * k;
		state.y += (state.ty - state.y) * k;
		state.r += (state.tr - state.r) * (still ? 1 : 0.12);

		// two waves out of phase, so the rings breathe like water
		const t = (now - start) / 1000;
		const w1 = still ? 1 : 1 + 0.05 * Math.sin(t * 2.4);
		const w2 = still ? 1 : 1 + 0.07 * Math.sin(t * 1.7 + 1.3);
		const r1 = state.r * w1;
		const r2 = state.r * 1.8 * w2;

		lens.style.setProperty("--lx", `${(state.x * 100).toFixed(2)}%`);
		lens.style.setProperty("--ly", `${(state.y * 100).toFixed(2)}%`);
		lens.style.setProperty("--r1", `${r1.toFixed(1)}px`);
		lens.style.setProperty("--r2", `${r2.toFixed(1)}px`);

		const settled =
			state.tr === 0 &&
			state.r < 0.5 &&
			Math.abs(state.tx - state.x) < 0.001 &&
			Math.abs(state.ty - state.y) < 0.001;
		if (settled) {
			state.r = 0;
			lens.style.removeProperty("--r1");
			lens.style.removeProperty("--r2");
			raf = 0;
			return;
		}
		raf = requestAnimationFrame(paint);
	};

	const run = () => {
		if (!raf) {
			start = performance.now();
			raf = requestAnimationFrame(paint);
		}
	};

	const aim = (clientX: number, clientY: number) => {
		const box = lens.getBoundingClientRect();
		state.tx = (clientX - box.left) / box.width;
		state.ty = (clientY - box.top) / box.height;
	};

	if (finePointer.matches) {
		lens.addEventListener("pointerenter", (e) => {
			aim(e.clientX, e.clientY);
			state.x = state.tx;
			state.y = state.ty;
			state.tr = radius();
			run();
		});
		lens.addEventListener("pointermove", (e) => {
			aim(e.clientX, e.clientY);
			run();
		});
		lens.addEventListener("pointerleave", () => {
			state.tr = 0;
			run();
		});
	} else {
		// touch: open once on the face when the portrait is in view, and on each tap
		const pulse = (x: number, y: number) => {
			state.tx = state.x = x;
			state.ty = state.y = y;
			state.tr = radius();
			run();
			window.setTimeout(() => {
				state.tr = 0;
				run();
			}, 2400);
		};
		lens.addEventListener("click", (e) => {
			const box = lens.getBoundingClientRect();
			pulse(
				(e.clientX - box.left) / box.width,
				(e.clientY - box.top) / box.height,
			);
		});
		if ("IntersectionObserver" in window) {
			const once = new IntersectionObserver(
				(entries) => {
					if (!entries.some((e) => e.isIntersecting)) return;
					once.disconnect();
					window.setTimeout(() => pulse(0.47, 0.33), 700);
				},
				{ threshold: 0.6 },
			);
			once.observe(lens);
		}
	}
}
