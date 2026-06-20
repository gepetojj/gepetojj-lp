export interface WorkProject {
	href: string;
	tag: string;
	name: string;
	description: string;
	tags: readonly string[];
	domain: string;
}

export interface OpenSourceRepo {
	href: string;
	name: string;
	description: string;
	lang: string;
	langColor: string;
}

export interface CompareRow {
	left: string;
	right: string;
}

export interface Pillar {
	title: string;
	description: string;
}

export interface StackCategory {
	title: string;
	description: string;
	tags: readonly string[];
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
		differential: string;
		stack: string;
		work: string;
		openSource: string;
		contact: string;
		cta: string;
		localeSwitcher: string;
	};
	hero: {
		eyebrow: string;
		name: string;
		alias: string;
		lead: string;
		ctaWork: string;
		scroll: string;
	};
	marquee: {
		phrases: readonly string[];
	};
	about: {
		tag: string;
		title: string;
		paragraphs: readonly string[];
		stats: readonly { value: string; label: string }[];
	};
	pillars: {
		tag: string;
		title: string;
		subtitle: string;
		items: readonly Pillar[];
	};
	compare: {
		tag: string;
		title: string;
		subtitle: string;
		common: string;
		mine: string;
		rows: readonly CompareRow[];
	};
	stack: {
		tag: string;
		title: string;
		subtitle: string;
		categories: readonly StackCategory[];
	};
	work: {
		tag: string;
		title: string;
		subtitle: string;
		projects: readonly WorkProject[];
	};
	openSource: {
		tag: string;
		title: string;
		subtitle: string;
		repos: readonly OpenSourceRepo[];
		githubCta: string;
	};
	contact: {
		tag: string;
		title: string;
		titleEmphasis: string;
		subtitle: string;
	};
	footer: {
		copyright: string;
		backToTop: string;
	};
}
