/**
 * Generates the favicon set from the brand mark SVG (public/logo.svg):
 *   src/app/favicon.ico   — 16/32/48 multi-resolution ICO
 *   src/app/icon.png      — 512x512 PNG (modern browsers, PWA)
 *   src/app/apple-icon.png— 180x180 PNG (iOS home screen)
 *
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const svg = readFileSync(path.join(root, "public/logo.svg"));

async function renderPng(size) {
  // Render the vector at the exact target size (density scales the 64px viewBox)
  return sharp(svg, { density: Math.round((72 * size) / 64) })
    .resize(size, size)
    .png()
    .toBuffer();
}

const icoSizes = [16, 32, 48];
const icoBuffers = [];
for (const size of icoSizes) {
  icoBuffers.push(await renderPng(size));
}
const ico = await pngToIco(icoBuffers);
writeFileSync(path.join(root, "src/app/favicon.ico"), ico);

writeFileSync(path.join(root, "src/app/icon.png"), await renderPng(512));
writeFileSync(path.join(root, "src/app/apple-icon.png"), await renderPng(180));

for (const f of ["favicon.ico", "icon.png", "apple-icon.png"]) {
  const stat = await sharp(path.join(root, "src/app", f)).metadata().catch(() => null);
  console.log(f, "— written");
}
console.log("Icons generated.");
