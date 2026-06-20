const isTouch = window.matchMedia("(pointer: coarse)").matches;

if (isTouch) {
	document.body.classList.add("touch-device");
}

if (!isTouch) {
	const dot = document.getElementById("cursor-dot");
	const ring = document.getElementById("cursor-ring");

	if (dot && ring) {
		let mx = window.innerWidth / 2;
		let my = window.innerHeight / 2;
		let rx = mx;
		let ry = my;

		window.addEventListener("mousemove", (e: MouseEvent) => {
			mx = e.clientX;
			my = e.clientY;
			dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
		});

		const loop = () => {
			rx += (mx - rx) * 0.16;
			ry += (my - ry) * 0.16;
			ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
			requestAnimationFrame(loop);
		};
		loop();

		const hoverables = document.querySelectorAll(
			"a, button, .tilt, .magnetic",
		);
		for (const el of hoverables) {
			el.addEventListener("mouseenter", () =>
				ring.classList.add("hovered"),
			);
			el.addEventListener("mouseleave", () =>
				ring.classList.remove("hovered"),
			);
		}
	}
}

const progress = document.getElementById("progress");
const nav = document.getElementById("nav");

const onScroll = () => {
	const h = document.documentElement;
	const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;

	if (progress) {
		progress.style.width = `${scrolled}%`;
	}

	if (nav) {
		nav.classList.toggle("scrolled", h.scrollTop > 40);
	}
};

document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const heroBg = document.getElementById("heroBg");
const hero = document.querySelector(".hero");

if (!isTouch && heroBg && hero instanceof HTMLElement) {
	hero.addEventListener("mousemove", (e: MouseEvent) => {
		const x = ((e.clientX / window.innerWidth) * 100).toFixed(1);
		const y = ((e.clientY / window.innerHeight) * 100).toFixed(1);
		heroBg.style.setProperty("--mx", `${x}%`);
		heroBg.style.setProperty("--my", `${y}%`);
		heroBg.style.setProperty("--mx2", `${100 - Number(x)}%`);
	});
}

const revealEls = document.querySelectorAll("[data-reveal]");

const io = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const el = entry.target;
				if (!(el instanceof HTMLElement)) continue;

				const parent = el.parentElement;

				if (parent) {
					const siblings = Array.from(parent.children).filter(
						(c): c is HTMLElement =>
							c instanceof HTMLElement &&
							c.hasAttribute("data-reveal"),
					);
					const order = siblings.indexOf(el);
					el.style.transitionDelay = `${Math.min(order, 6) * 0.08}s`;
				}

				el.classList.add("visible");
				io.unobserve(el);
			}
		}
	},
	{ threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

for (const el of revealEls) {
	io.observe(el);
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navlinks a[data-link]");

const navIo = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				for (const link of navLinks) {
					link.classList.remove("active");
				}

				const match = document.querySelector(
					`.navlinks a[href="#${entry.target.id}"]`,
				);

				if (match) {
					match.classList.add("active");
				}
			}
		}
	},
	{ threshold: 0, rootMargin: "-45% 0px -45% 0px" },
);

for (const section of sections) {
	navIo.observe(section);
}

if (!isTouch) {
	for (const el of document.querySelectorAll(".magnetic")) {
		el.addEventListener("mousemove", (e) => {
			if (!(el instanceof HTMLElement) || !(e instanceof MouseEvent))
				return;

			const r = el.getBoundingClientRect();
			const relX = e.clientX - r.left - r.width / 2;
			const relY = e.clientY - r.top - r.height / 2;
			el.style.transform = `translate(${relX * 0.25}px,${relY * 0.3}px)`;
		});

		el.addEventListener("mouseleave", () => {
			if (!(el instanceof HTMLElement)) return;

			el.style.transition = "transform .4s cubic-bezier(.16,.8,.3,1)";
			el.style.transform = "translate(0,0)";
			setTimeout(() => {
				el.style.transition = "";
			}, 400);
		});
	}
}

if (!isTouch) {
	for (const el of document.querySelectorAll(".tilt")) {
		if (!(el instanceof HTMLElement)) continue;

		el.style.transition = "transform .15s ease";

		el.addEventListener("mousemove", (e) => {
			if (!(e instanceof MouseEvent)) return;

			const r = el.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width - 0.5;
			const py = (e.clientY - r.top) / r.height - 0.5;
			el.style.transform = `perspective(800px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-2px)`;
		});

		el.addEventListener("mouseleave", () => {
			el.style.transition = "transform .5s cubic-bezier(.16,.8,.3,1)";
			el.style.transform =
				"perspective(800px) rotateX(0) rotateY(0) translateY(0)";
			setTimeout(() => {
				el.style.transition = "transform .15s ease";
			}, 500);
		});
	}
}

for (const anchor of document.querySelectorAll('a[href^="#"]')) {
	anchor.addEventListener("click", (e) => {
		const id = anchor.getAttribute("href");

		if (!id) return;

		if (id.length > 1) {
			const target = document.querySelector(id);

			if (target) {
				e.preventDefault();
				target.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		} else if (id === "#top") {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	});
}
