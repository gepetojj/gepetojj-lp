// @ts-check

import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://gepetojj.com",

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [sitemap()],
	adapter: vercel(),
});
