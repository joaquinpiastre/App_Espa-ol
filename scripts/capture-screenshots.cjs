const { chromium } = require("playwright");
const path = require("path");

const BASE_URL = "http://localhost:8085";
const OUT_DIR = path.join(__dirname, "..", "assets", "store", "screenshots");
const VIEWPORT = { width: 1080, height: 1920 };

async function shot(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file });
  console.log("saved", file);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("[console.error]", msg.text());
  });

  page.on("pageerror", (err) => console.log("[pageerror]", err.message));

  await page.goto(BASE_URL, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(10000);
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log("BODY TEXT SNIPPET:", JSON.stringify(bodyText));
  await shot(page, "00-initial");

  // Try to reach login screen
  const continuarGuest = page.getByText("Continuar como invitado", { exact: false });
  try {
    await continuarGuest.waitFor({ timeout: 15000 });
    await shot(page, "01-login");
    await continuarGuest.click();
  } catch (e) {
    console.log("No se encontró botón invitado en esta vista:", e.message);
  }

  await page.waitForTimeout(3000);
  await shot(page, "02-after-guest-click");

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
