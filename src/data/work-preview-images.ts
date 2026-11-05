import type { ImageMetadata } from "astro";

import capi from "../assets/work/capi.jpg";
import comentta from "../assets/work/comentta.jpg";
import disppa from "../assets/work/disppa.jpg";
import linkSolucoes from "../assets/work/link-solucoes.jpg";
import rifa from "../assets/work/rifa.jpg";
import scFinance from "../assets/work/sc-finance.jpg";
import spark from "../assets/work/spark.png";
import triglit from "../assets/work/triglit.jpg";

export const workPreviewImages = {
	"linksolucoesbr.com": linkSolucoes,
	"crmspark.com.br": spark,
	"disppa.com": disppa,
	"comentta.com.br": comentta,
	"scfinance.linksolucoesbr.com": scFinance,
	"triglit.com": triglit,
	"capi.legal": capi,
	"rifasimples.com.br": rifa,
} as const satisfies Record<string, ImageMetadata>;

export type WorkPreviewDomain = keyof typeof workPreviewImages;

export function getWorkPreviewImage(domain: string): ImageMetadata {
	const image = workPreviewImages[domain as WorkPreviewDomain];

	if (!image) {
		throw new Error(`Missing work preview image for domain: ${domain}`);
	}

	return image;
}
