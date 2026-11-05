// Generates the 1-bit ordered-dither portrait used in the hero.
// Usage: node scripts/dither-portrait.mjs
import sharp from "sharp";

const SRC = "src/assets/eu.png";
const OUT = "src/assets/eu-dither.png";
const CELL = 2; // each dither pixel becomes CELL×CELL output pixels
const WIDTH = 520; // dither resolution (output = WIDTH * CELL)
const INK = [238, 233, 224];

const bayer = [
	[0, 32, 8, 40, 2, 34, 10, 42],
	[48, 16, 56, 24, 50, 18, 58, 26],
	[12, 44, 4, 36, 14, 46, 6, 38],
	[60, 28, 52, 20, 62, 30, 54, 22],
	[3, 35, 11, 43, 1, 33, 9, 41],
	[51, 19, 59, 27, 49, 17, 57, 25],
	[15, 47, 7, 39, 13, 45, 5, 37],
	[63, 31, 55, 23, 61, 29, 53, 21],
];

const { data, info } = await sharp(SRC)
	.resize(WIDTH)
	.sharpen({ sigma: 1.1 })
	.modulate({ brightness: 1.05 })
	.ensureAlpha()
	.raw()
	.toBuffer({ resolveWithObject: true });

const { width, height } = info;
const out = Buffer.alloc(width * CELL * height * CELL * 4);

for (let y = 0; y < height; y++) {
	for (let x = 0; x < width; x++) {
		const i = (y * width + x) * 4;
		const a = data[i + 3] / 255;
		let lum =
			(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
			255;
		// lift shadows, add contrast so the dark shirt still reads as texture
		lum = Math.min(1, Math.max(0, lum * 1.15));
		lum = 0.05 + 0.95 * lum ** 0.68;
		const threshold = (bayer[y % 8][x % 8] + 0.5) / 64;
		const on = a > 0.5 && lum > threshold;
		if (!on) continue;
		for (let dy = 0; dy < CELL; dy++) {
			for (let dx = 0; dx < CELL; dx++) {
				const o =
					((y * CELL + dy) * width * CELL + (x * CELL + dx)) * 4;
				out[o] = INK[0];
				out[o + 1] = INK[1];
				out[o + 2] = INK[2];
				out[o + 3] = 255;
			}
		}
	}
}

await sharp(out, {
	raw: { width: width * CELL, height: height * CELL, channels: 4 },
})
	.png({ compressionLevel: 9, palette: true })
	.toFile(OUT);

console.log(`wrote ${OUT}`);
