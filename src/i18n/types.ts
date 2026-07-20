export interface WorkProject {
	href: string;
	tag: string;
	name: string;
	description: string;
	tags: readonly string[];
	domain: string;
	accent: string;
	highlight: string;
}

export interface OpenSourceRepo {
	href: string;
	name: string;
	description: string;
	lang: string;
	langColor: string;
	npm?: boolean;
}

export interface Pillar {
	title: string;
	description: string;
}

export type SkillIconId =
	| "frontend"
	| "mobile"
	| "desktop"
	| "backend"
	| "cloud"
	| "iot";

export interface StackCategory {
	title: string;
	description: string;
	tags: readonly string[];
	icon: SkillIconId;
}

export interface Translations {
	meta: {
		title: string;
		description: string;
		shortDescription: string;
		keywords: readonly string[];
		ogImageAlt: string;
	};
	nav: {
		about: string;
		stack: string;
		work: string;
		openSource: string;
		contact: string;
		cta: string;
		localeSwitcher: string;
	};
	hero: {
		name: string;
		alias: string;
		lead: string;
		ctaWork: string;
		scroll: string;
		portraitAlt: string;
	};
	marquee: {
		phrases: readonly string[];
	};
	about: {
		title: string;
		paragraphs: readonly string[];
		proofLine: string;
	};
	pillars: {
		title: string;
		subtitle: string;
		items: readonly Pillar[];
	};
	stack: {
		title: string;
		subtitle: string;
		technicalLabel: string;
		categories: readonly StackCategory[];
		leadershipLabel: string;
		leadership: readonly Pillar[];
	};
	work: {
		title: string;
		subtitle: string;
		visitLive: string;
		projects: readonly WorkProject[];
	};
	openSource: {
		title: string;
		subtitle: string;
		repos: readonly OpenSourceRepo[];
		githubCta: string;
	};
	contact: {
		title: string;
		titleEmphasis: string;
		subtitle: string;
	};
	footer: {
		copyright: string;
		backToTop: string;
	};
}
