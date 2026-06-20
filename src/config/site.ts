export const SITE = {
	name: "gepetojj",
	url: "https://gepetojj.com",
	locale: "pt_BR",
	language: "pt-BR",
	title: "João Nobre — CTO & Liderança em Tecnologia | gepetojj",
	description:
		"João Nobre (gepetojj) é CTO da Link Soluções. Liderança técnica, estratégia de produto, automação, plataformas e IA — do diagnóstico à operação em produção. Baseado em Arapiraca, Alagoas.",
	shortDescription:
		"CTO e liderança técnica. Estratégia de produto, automação, plataformas e IA com foco em resultado de negócio.",
	keywords: [
		"João Nobre",
		"gepetojj",
		"CTO",
		"liderança técnica",
		"estratégia de produto",
		"software sob medida",
		"inteligência artificial",
		"automação de processos",
		"Link Soluções",
		"Arapiraca",
		"Alagoas",
		"desenvolvimento de software",
		"plataformas SaaS",
	],
	ogImage: "/og-image.png",
	ogImageAlt:
		"João Nobre (gepetojj) — CTO e liderança em tecnologia, estratégia de produto e IA",
	themeColor: "#08080a",
	author: {
		name: "João Nobre",
		alternateName: "gepetojj",
		givenName: "João",
		familyName: "Nobre",
		email: "oi@gepetojj.com",
		jobTitle: "Chief Technology Officer",
		worksFor: {
			name: "Link Soluções",
			url: "https://linksolucoesbr.com",
		},
		location: {
			city: "Arapiraca",
			region: "AL",
			country: "BR",
			countryName: "Brasil",
		},
		sameAs: [
			"https://github.com/gepetojj",
			"https://www.linkedin.com/in/nobrejoaox/",
			"https://linksolucoesbr.com",
		],
		knowsAbout: [
			"Estratégia de produto",
			"Liderança técnica",
			"Automação de processos",
			"Plataformas e integrações",
			"Inteligência artificial aplicada",
			"Confiabilidade e escala",
			"Desenvolvimento de software",
			"Arquitetura de sistemas",
		],
	},
} as const;

export function absoluteUrl(path: string): string {
	return new URL(path, SITE.url).href;
}
