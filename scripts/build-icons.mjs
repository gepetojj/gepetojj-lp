// Builds public/favicon.ico (16, 32, 48) and public/apple-touch-icon.png
// from the "laço" mark on the graphite tile.
// Usage: node scripts/build-icons.mjs
import { writeFile } from "node:fs/promises";

import sharp from "sharp";

const PAPER = "#141210";
const INK = "#efece6";
const EMBER = "#f26a2c";

const tile = (size, { radius = 0.22, stroke = 6.5, pad = 0.12 } = {}) => {
	const r = size * radius;
	const inner = size * (1 - pad * 2);
	const offset = size * pad;
	return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
	<rect width="${size}" height="${size}" rx="${r}" fill="${PAPER}"/>
	<svg x="${offset}" y="${offset}" width="${inner}" height="${inner}" viewBox="0 0 64 64" fill="none">
		<g stroke="${INK}" stroke-width="${stroke}">
			<path d="M32 5V59"/>
			<path d="M32 8H41C55 8 55 25 32 32C9 39 9 56 23 56H32"/>
		</g>
		<circle cx="32" cy="32" r="3.8" fill="${EMBER}"/>
	</svg>
</svg>`);
};

const png = (size, opts) => sharp(tile(size, opts)).png().toBuffer();

// ICO with PNG entries
const sizes = [16, 32, 48];
const images = await Promise.all(
	sizes.map((s) =>
		png(s, { stroke: s <= 16 ? 8 : 7, pad: s <= 16 ? 0.04 : 0.08 }),
	),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
	const e = Buffer.alloc(16);
	e.writeUInt8(s, 0);
	e.writeUInt8(s, 1);
	e.writeUInt16LE(1, 4);
	e.writeUInt16LE(32, 6);
	e.writeUInt32LE(images[i].length, 8);
	e.writeUInt32LE(offset, 12);
	offset += images[i].length;
	return e;
});
await writeFile(
	"public/favicon.ico",
	Buffer.concat([header, ...entries, ...images]),
);

await sharp(tile(180, { radius: 0, pad: 0.16 }))
	.png()
	.toFile("public/apple-touch-icon.png");

console.log("wrote public/favicon.ico and public/apple-touch-icon.png");
