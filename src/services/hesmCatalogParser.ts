/**
 * Parsea el bundle JS de /profesionales (Next.js) de hesm.org.
 * Mantener alineado con scripts/build-cartilla-from-hesm.cjs
 */
import type { Professional } from "../types/cartilla";

export type HesmParsedRecord = {
  id: string;
  name: string;
  specialty: Professional["specialty"];
  horariosResumen: string;
  matricula?: string;
};

function decodeJsString(s: string): string {
  return s.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function readQuoted(str: string, quotePos: number): { value: string; end: number } | null {
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

function parseHorariosSlice(slice: string): string {
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
    const parts: string[] = [];
    const re = /"((?:\\.|[^"\\])*)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(inner))) parts.push(decodeJsString(m[1]).trim());
    while (parts.length < 6) parts.push("");
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const lines: string[] = [];
    for (let d = 0; d < 6; d++) {
      if (parts[d]) lines.push(`${days[d]}: ${parts[d]}`);
    }
    return lines.length ? lines.join(" · ") : inner;
  }
  return t;
}

const SPEC_MAP: Record<string, Professional["specialty"]> = {
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

function mapSpecialty(web: string): Professional["specialty"] {
  const s = SPEC_MAP[web];
  if (!s) return "Clínica médica";
  return s;
}

function extractArrayInner(js: string): string {
  const marker = 'let r=[{id:"';
  const pos = js.indexOf(marker);
  if (pos < 0) throw new Error("Lista de profesionales no encontrada en el JS.");
  const openBracket = js.indexOf("[", pos);
  let depth = 0;
  for (let i = openBracket; i < js.length; i++) {
    if (js[i] === "[") depth++;
    else if (js[i] === "]") {
      depth--;
      if (depth === 0) return js.slice(openBracket + 1, i);
    }
  }
  throw new Error("Array de profesionales incompleto.");
}

function findMatchingBrace(s: string, from: number): number {
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

function parseProfessionalObject(str: string): HesmParsedRecord | null {
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

function splitTopLevelObjects(inner: string): string[] {
  const objs: string[] = [];
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

export function parseProfesionalesFromChunkJs(js: string): HesmParsedRecord[] {
  const inner = extractArrayInner(js);
  const rawObjs = splitTopLevelObjects(inner);
  const records: HesmParsedRecord[] = [];
  for (const raw of rawObjs) {
    const p = parseProfessionalObject(raw);
    if (p) records.push(p);
  }
  if (!records.length) throw new Error("No se extrajo ningún profesional.");
  return records;
}

export function hesParsedToProfessional(r: HesmParsedRecord): Professional {
  const obsParts = [`Horarios: ${r.horariosResumen}.`, "Datos según cartelera en hesm.org."];
  if (r.matricula) obsParts.unshift(`Mat. ${r.matricula}.`);
  return {
    id: r.id,
    name: r.name,
    specialty: r.specialty,
    modalidad: "Presencial",
    observaciones: obsParts.join(" "),
    whatsappMessageContext: `${r.specialty} — ${r.name}`,
  };
}
