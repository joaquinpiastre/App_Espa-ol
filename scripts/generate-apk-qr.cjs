/**
 * Genera un PNG con QR para descargar la APK.
 *
 * Modo EAS / Expo (cualquier red, recomendado con preview):
 *   1) eas build --platform android --profile preview
 *   2) En https://expo.dev abre el build y copia el enlace de instalación / descarga.
 *   3) PowerShell: $env:APK_PUBLIC_URL="https://expo.dev/..."; npm run qr:apk
 *
 * Modo LAN (misma Wi‑Fi que el PC):
 *   npm run serve:apk  (en otra terminal)  luego  npm run qr:apk
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const QRCode = require("qrcode");

const PORT = Number(process.env.APK_SERVE_PORT || 9876);
const OUT = path.join(
  __dirname,
  "..",
  "assets",
  process.env.QR_OUTPUT || "qr-apk-descarga.png",
);

function pickLanIp() {
  const candidates = [];
  for (const name of Object.keys(os.networkInterfaces())) {
    for (const addr of os.networkInterfaces()[name] || []) {
      if (addr.family !== "IPv4" && addr.family !== 4) continue;
      if (addr.internal) continue;
      const ip = addr.address;
      if (ip.startsWith("169.254.")) continue;
      candidates.push({ ip, name });
    }
  }
  const score = (ip) => {
    if (ip.startsWith("192.168.56.")) return 0;
    if (ip.startsWith("10.")) return 2;
    if (ip.startsWith("192.168.")) return 3;
    return 1;
  };
  candidates.sort((a, b) => score(b.ip) - score(a.ip));
  return candidates[0]?.ip || "192.168.1.1";
}

async function main() {
  const publicUrl =
    process.env.APK_PUBLIC_URL?.trim() ||
    process.env.EAS_BUILD_INSTALL_URL?.trim();

  let url;
  let hint;
  if (publicUrl) {
    url = publicUrl;
    hint =
      "Enlace de Expo/EAS: válido desde internet (según visibilidad del build).";
  } else {
    const ip = process.env.APK_HOST_IP || pickLanIp();
    url = `http://${ip}:${PORT}/app-release.apk`;
    hint = "Modo LAN: ejecuta en otra terminal `npm run serve:apk` y conecta el móvil a la misma Wi‑Fi.";
  }

  await fs.promises.mkdir(path.dirname(OUT), { recursive: true });
  await QRCode.toFile(OUT, url, {
    type: "png",
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
  });
  console.log("QR guardado en:", OUT);
  console.log("URL codificada:", url);
  console.log(hint);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
