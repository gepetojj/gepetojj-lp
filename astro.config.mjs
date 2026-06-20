// @ts-check

import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://gepetojj.com",

	i18n: {
		locales: ["pt-br", "en", "es"],
		defaultLocale: "pt-br",
		routing: {
			prefixDefaultLocale: false,
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [
		sitemap({
			i18n: {
				defaultLocale: "pt-br",
				locales: {
					"pt-br": "pt-BR",
					en: "en",
					es: "es",
				},
			},
		}),
	],
	adapter: vercel(),
});
