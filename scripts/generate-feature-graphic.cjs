const sharp = require("sharp");
const path = require("path");

const WIDTH = 1024;
const HEIGHT = 500;
const ICON_SIZE = 340;
const OUT_PATH = path.join(__dirname, "..", "assets", "store", "feature-graphic-1024x500.png");
const ICON_PATH = path.join(__dirname, "..", "assets", "icon.png");

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#004A52"/>
      <stop offset="100%" stop-color="#00666E"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <text x="640" y="225" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="800" fill="#FFFFFF">Hospital Español</text>
  <text x="640" y="295" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="800" fill="#FFFFFF">del Sur Mendocino</text>
  <text x="640" y="345" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400" fill="#E6FAFA">Atención, turnos e información para socios</text>
</svg>
`;

async function main() {
  const iconBuffer = await sharp(ICON_PATH).resize(ICON_SIZE, ICON_SIZE).toBuffer();

  await sharp(Buffer.from(svg))
    .composite([{ input: iconBuffer, left: 130, top: Math.round((HEIGHT - ICON_SIZE) / 2) }])
    .png()
    .toFile(OUT_PATH);

  console.log("OK", OUT_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
