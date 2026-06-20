export const SITE = {
	name: "gepetojj",
	url: "https://gepetojj.com",
	ogImage: "/og-image.png",
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
	},
} as const;

export function absoluteUrl(path: string): string {
	return new URL(path, SITE.url).href;
}
