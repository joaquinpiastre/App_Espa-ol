/**
 * Descarga el bundle de /profesionales de hesm.org (Next.js) y extrae la lista embebida.
 * Salida: src/data/cartillaProfessionals.generated.json
 * Ejecutar: npm run import-cartilla
 */
const fs = require("fs");
const https = require("https");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src", "data", "cartillaProfessionals.generated.json");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; HESM-app-cartilla-sync/1)" },
        },
        (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            const loc = res.headers.location;
            if (!loc) return reject(new Error("Redirect sin Location"));
            const next = loc.startsWith("http") ? loc : `https://www.hesm.org${loc}`;
            return get(next).then(resolve).catch(reject);
          }
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () => resolve(d));
        }
      )
      .on("error", reject);
  });
}

function decodeJsString(s) {
  return s.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function readQuoted(str, quotePos) {
  if (str[quotePos] !== '"') return null;
  let i = quotePos + 1;
  let out = "";
  while (i < str.length) {
    const c = str[i];
    if (c === "\\" && i + 1 < str.length) {
      const n = str[i + 1];
      if (n === "x" && i + 3 < str.length && /^[0-9a-fA-F]{2}$/.test(str.slice(i + 2, i + 4))) {
        out += String.fromCharCode(parseInt(str.slice(i + 2, i + 4), 16));
        i += 4;
        continue;
      }
      out += n;
      i += 2;
      continue;
    }
    if (c === '"') return { value: decodeJsString(out), end: i + 1 };
    out += c;
    i++;
  }
  return null;
}

function parseHorariosSlice(slice) {
  const t = slice.trim();
  if (t.startsWith('"')) {
    const r = readQuoted(t, 0);
    return r ? r.value : slice;
  }
  if (t.startsWith("o(")) {
    let depth = 0;
    let k = 0;
    for (; k < t.length; k++) {
      if (t[k] === "(") depth++;
      else if (t[k] === ")") {
        depth--;
        if (depth === 0) {
          k++;
          break;
        }
      }
    }
    const inner = t.slice(0, k);
    const parts = [];
    const re = /"((?:\\.|[^"\\])*)"/g;
    let m;
    while ((m = re.exec(inner))) parts.push(decodeJsString(m[1]).trim());
    while (parts.length < 6) parts.push("");
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const lines = [];
    for (let d = 0; d < 6; d++) {
      if (parts[d]) lines.push(`${days[d]}: ${parts[d]}`);
    }
    return lines.length ? lines.join(" · ") : inner;
  }
  return t;
}

/** Texto de especialidad tal como en el sitio → clave del tipo en la app */
const SPEC_MAP = {
  "Clínica Médica": "Clínica médica",
  Traumatología: "Traumatología",
  Nutrición: "Nutrición",
  "Cirugía General": "Cirugía general",
  "Cirugía de Tórax": "Cirugía de tórax",
  Urología: "Urología",
  Diabetología: "Diabetología",
  Dermatología: "Dermatología",
  Cardiología: "Cardiología",
  Neumonología: "Neumonología",
  Anestesiología: "Anestesiología",
  Gastroenterología: "Gastroenterología",
  Ginecología: "Ginecología",
  Otorrinolaringología: "Otorrinolaringología",
  Oftalmología: "Oftalmología",
  Pediatría: "Pediatría",
  Mastología: "Mastología",
  Endocrinología: "Endocrinología",
};

function mapSpecialty(web) {
  const s = SPEC_MAP[web];
  if (!s) {
    console.warn("[import-cartilla] Especialidad sin mapear:", JSON.stringify(web));
    return "Clínica médica";
  }
  return s;
}

function extractArrayInner(js) {
  const marker = 'let r=[{id:"';
  const pos = js.indexOf(marker);
  if (pos < 0) throw new Error("No se encontró la lista de profesionales en el JS. ¿Cambió hesm.org?");
  const openBracket = js.indexOf("[", pos);
  let depth = 0;
  for (let i = openBracket; i < js.length; i++) {
    if (js[i] === "[") depth++;
    else if (js[i] === "]") {
      depth--;
      if (depth === 0) return js.slice(openBracket + 1, i);
    }
  }
  throw new Error("Array de profesionales sin cerrar.");
}

function findMatchingBrace(s, from) {
  let depth = 0;
  for (let i = from; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function parseProfessionalObject(str) {
  if (!str.startsWith("{")) return null;
  const idM = str.match(/^\{id:"(\d+)"/);
  if (!idM) return null;
  const id = idM[1];

  const nKey = ',nombre:"';
  const nPos = str.indexOf(nKey);
  if (nPos < 0) return null;
  const nq = readQuoted(str, nPos + nKey.length - 1);
  if (!nq) return null;

  const eKey = ',especialidad:"';
  const ePos = str.indexOf(eKey, nq.end);
  if (ePos < 0) return null;
  const eq = readQuoted(str, ePos + eKey.length - 1);
  if (!eq) return null;

  const hKey = ",horarios:";
  const hPos = str.indexOf(hKey, eq.end);
  if (hPos < 0) return null;
  const hStart = hPos + hKey.length;

  const mKey = ',matricula:"';
  const mPos = str.indexOf(mKey, hStart);
  const horariosSlice = str.slice(hStart, mPos >= 0 ? mPos : str.lastIndexOf("}"));
  const horarios = parseHorariosSlice(horariosSlice);

  let matricula = "";
  if (mPos >= 0) {
    const mq = readQuoted(str, mPos + mKey.length - 1);
    if (mq) matricula = mq.value;
  }

  return {
    id: `hesm-${id}`,
    name: nq.value.trim(),
    specialty: mapSpecialty(eq.value),
    horariosResumen: horarios,
    matricula: matricula || undefined,
  };
}

function splitTopLevelObjects(inner) {
  const objs = [];
  let i = 0;
  while (i < inner.length) {
    while (i < inner.length && /[\s,]/.test(inner[i])) i++;
    if (i >= inner.length) break;
    if (inner[i] !== "{") break;
    const end = findMatchingBrace(inner, i);
    if (end < 0) break;
    objs.push(inner.slice(i, end + 1));
    i = end + 1;
  }
  return objs;
}

async function main() {
  const html = await get("https://www.hesm.org/profesionales/");
  const chunkMatch = html.match(/\/_next\/static\/chunks\/app\/profesionales\/page-[a-f0-9]+\.js/);
  if (!chunkMatch) throw new Error("No se encontró la ruta del chunk de profesionales en el HTML.");
  const chunkUrl = `https://www.hesm.org${chunkMatch[0]}`;
  const js = await get(chunkUrl);

  const inner = extractArrayInner(js);
  const rawObjs = splitTopLevelObjects(inner);
  const records = [];
  for (const raw of rawObjs) {
    const p = parseProfessionalObject(raw);
    if (p) records.push(p);
  }

  if (!records.length) throw new Error("No se extrajo ningún profesional.");

  fs.mkdirSync(path.join(ROOT, "src", "data"), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceUrl: chunkUrl,
    count: records.length,
    records,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 0), "utf8");
  console.log(`OK: ${records.length} profesionales (hesm.org) → ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
