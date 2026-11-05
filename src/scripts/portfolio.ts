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

/* ---------- signature: water on the portrait (WebGL, loaded on demand) ---------- */

const waterFigure = document.querySelector<HTMLElement>("[data-waves]");

if (waterFigure && !reduceMotion.matches) {
	import("./portrait-waves")
		.then(({ startPortraitWaves }) => startPortraitWaves(waterFigure))
		.catch(() => {
			// the dither <img> stays; nothing to undo
		});
}
