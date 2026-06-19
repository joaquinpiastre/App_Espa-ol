const sharp = require("sharp");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOGO_PATH = path.join(ROOT, "assets", "logo-hesm.jfif");

async function main() {
  const meta = await sharp(LOGO_PATH).metadata();
  console.log("logo-hesm.jfif", meta.width + "x" + meta.height, meta.format);

  const size = Math.max(meta.width, meta.height);
  const squareLogo = await sharp(LOGO_PATH)
    .resize(size, size, { fit: "contain", background: "#FFFFFF" })
    .png()
    .toBuffer();

  // 1) assets/icon.png (1024x1024) used by Expo to build app icons
  await sharp(squareLogo)
    .resize(1024, 1024, { fit: "contain", background: "#FFFFFF" })
    .png()
    .toFile(path.join(ROOT, "assets", "icon.png"));
  console.log("OK assets/icon.png");

  // 2) Play Store icon (512x512)
  await sharp(squareLogo)
    .resize(512, 512, { fit: "contain", background: "#FFFFFF" })
    .png()
    .toFile(path.join(ROOT, "assets", "store", "icon-512x512.png"));
  console.log("OK assets/store/icon-512x512.png");

  // 3) Feature graphic (1024x500) with real logo
  const WIDTH = 1024;
  const HEIGHT = 500;
  const LOGO_BOX = 360;

  const svg = `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#004A52"/>
        <stop offset="100%" stop-color="#00666E"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
    <text x="560" y="240" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">Hospital Español</text>
    <text x="560" y="295" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">del Sur Mendocino</text>
    <text x="560" y="335" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400" fill="#E6FAFA">Atención, turnos e información para socios</text>
  </svg>
  `;

  const logoForBanner = await sharp(squareLogo)
    .resize(LOGO_BOX, LOGO_BOX, { fit: "contain", background: "#FFFFFF" })
    .png()
    .toBuffer();

  await sharp(Buffer.from(svg))
    .composite([{ input: logoForBanner, left: 100, top: Math.round((HEIGHT - LOGO_BOX) / 2) }])
    .png()
    .toFile(path.join(ROOT, "assets", "store", "feature-graphic-1024x500.png"));
  console.log("OK assets/store/feature-graphic-1024x500.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
