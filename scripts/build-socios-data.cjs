/**
 * Lee socios.xls (exportación con columnas separadas por ;) y genera src/data/socios.json.
 * Ejecutar tras reemplazar el Excel: npm run import-socios
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src", "data");
const INPUT = path.join(ROOT, "socios.xls");
const OUTPUT = path.join(SRC, "socios.json");

function normalizeArgentineDoc(raw) {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (!t || /^null$/i.test(t)) return null;
  const beforeComma = t.split(",")[0];
  const digits = beforeComma.replace(/\D/g, "");
  if (!digits || digits.length < 6) return null;
  return digits.replace(/^0+/, "") || "0";
}

function normalizeSocio(raw) {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (!t || /^null$/i.test(t)) return null;
  const digits = t.replace(/\D/g, "");
  return digits.length ? digits : null;
}

function cleanCell(raw) {
  if (raw == null) return "";
  const t = String(raw).trim();
  if (!t || /^null$/i.test(t)) return "";
  return t.replace(/\s+/g, " ");
}

function parseLine(line) {
  const cols = line.split(";");
  if (cols.length < 11) return null;
  const nroSocioRaw = cols[0]?.trim() ?? "";
  const nombre = (cols[2] ?? "").trim();
  const domicilioRaw = cols[3] ?? "";
  const nroDocRaw = cols[4]?.trim() ?? "";
  const planNuevo = (cols[7] ?? "").trim();
  const ctasDebeRaw = cols[10] ?? "";

  const dniNorm = normalizeArgentineDoc(nroDocRaw);
  const nroSocioNorm = normalizeSocio(nroSocioRaw);
  if (!dniNorm || !nroSocioNorm || !nombre) return null;

  const domicilio = cleanCell(domicilioRaw);
  const ctasDebe = cleanCell(ctasDebeRaw);

  return {
    dniNorm,
    nroSocioNorm,
    nombre: nombre.replace(/\s+/g, " "),
    nroSocioDisplay: nroSocioRaw,
    plan: planNuevo && !/^null$/i.test(planNuevo) ? planNuevo : undefined,
    domicilio: domicilio || undefined,
    ctasDebe: ctasDebe || undefined,
  };
}

function main() {
  if (!fs.existsSync(INPUT)) {
    if (fs.existsSync(OUTPUT)) {
      console.warn("[import-socios] socios.xls no encontrado; se mantiene src/data/socios.json.");
      process.exit(0);
    }
    console.error("No se encontró socios.xls ni socios.json. Colocá socios.xls en la raíz del proyecto.");
    process.exit(1);
  }

  const buf = fs.readFileSync(INPUT);
  let text = buf.toString("latin1");

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const records = [];
  const seen = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && /NROSOCIO/i.test(line) && /NRODOC/i.test(line)) continue;

    const row = parseLine(line);
    if (!row) continue;

    const key = `${row.dniNorm}|${row.nroSocioNorm}`;
    if (seen.has(key)) continue;
    seen.add(key);
    records.push(row);
  }

  if (!records.length) {
    console.error("No se pudo parsear ningún registro. Revisá el formato del archivo.");
    process.exit(1);
  }

  fs.mkdirSync(SRC, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceFile: "socios.xls",
    count: records.length,
    records,
  };
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 0), "utf8");
  console.log(`OK: ${records.length} socios → ${path.relative(ROOT, OUTPUT)}`);
}

main();
