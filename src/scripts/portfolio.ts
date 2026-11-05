const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* ---------- nav: scrolled state + mobile drawer ---------- */

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

window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
	if (e.matches) setMenu(false);
});

const onScroll = () => {
	nav?.classList.toggle("scrolled", window.scrollY > 24);
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

		const wasOpen = nav?.classList.contains("menu-open");
		if (wasOpen) setMenu(false);

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

/* ---------- reveal (progressive: content is visible without JS) ---------- */

if ("IntersectionObserver" in window && !reduceMotion.matches) {
	const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");

	// Elements already in view on load stay visible: no flash.
	const vh = window.innerHeight;
	for (const el of revealEls) {
		if (el.getBoundingClientRect().top < vh * 0.9)
			el.classList.add("is-in");
	}

	root.classList.add("reveal-ready");

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add("is-in");
				io.unobserve(entry.target);
			}
		},
		{ threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
	);

	for (const el of revealEls) {
		if (!el.classList.contains("is-in")) io.observe(el);
	}

	// Stagger siblings inside grids/lists
	for (const group of document.querySelectorAll(".more-grid")) {
		[...group.children].forEach((child, i) => {
			(child as HTMLElement).style.setProperty(
				"--reveal-delay",
				`${(i % 2) * 0.1}s`,
			);
		});
	}
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

	for (const section of document.querySelectorAll("section[id], .hero")) {
		spy.observe(section);
	}
}

/* ---------- local clock ---------- */

const clock = document.getElementById("localClock");

if (clock) {
	const fmt = new Intl.DateTimeFormat(root.lang || "pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: clock.dataset.tz || "America/Maceio",
	});
	const tick = () => {
		const now = new Date();
		clock.textContent = fmt.format(now);
		clock.setAttribute("datetime", now.toISOString());
	};
	tick();
	setInterval(tick, 15_000);
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

/* ---------- cursor label over work (fine pointers only) ---------- */

if (finePointer.matches && !reduceMotion.matches) {
	const targets = document.querySelectorAll<HTMLElement>("[data-cursor]");

	if (targets.length) {
		const label = document.createElement("div");
		label.className = "cursor-label";
		label.setAttribute("aria-hidden", "true");
		document.body.append(label);

		let x = 0;
		let y = 0;
		let lx = 0;
		let ly = 0;
		let raf = 0;

		const loop = () => {
			lx += (x - lx) * 0.2;
			ly += (y - ly) * 0.2;
			label.style.transform = `translate3d(${lx + 16}px, ${ly + 16}px, 0)`;
			raf =
				Math.abs(x - lx) + Math.abs(y - ly) > 0.2
					? requestAnimationFrame(loop)
					: 0;
		};

		window.addEventListener(
			"pointermove",
			(e) => {
				x = e.clientX;
				y = e.clientY;
				if (!raf) raf = requestAnimationFrame(loop);
			},
			{ passive: true },
		);

		for (const el of targets) {
			el.addEventListener("pointerenter", () => {
				label.textContent = el.dataset.cursor ?? "";
				label.classList.add("is-on");
			});
			el.addEventListener("pointerleave", () => {
				label.classList.remove("is-on");
			});
		}
	}
}
