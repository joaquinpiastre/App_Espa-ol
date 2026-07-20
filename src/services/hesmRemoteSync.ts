import { parseHesmContactPage } from "./hesmContactParser";
import { parseProfesionalesFromChunkJs, type HesmParsedRecord } from "./hesmCatalogParser";

const BASE = "https://www.hesm.org";
const API_PROFESIONALES = "https://hesm.org/api/profesionales";
const UA = "HESM-App/1.0 (sync; +https://www.hesm.org)";

function withCacheBust(url: string, enabled: boolean): string {
  if (!enabled) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}ts=${Date.now()}`;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

type ApiProfesional = {
  id: string | number;
  name: string;
  specialty: string;
  horarios?: string;
  matricula?: string;
};

async function fetchProfesionalesFromApi(cacheBust: boolean): Promise<HesmParsedRecord[]> {
  const url = withCacheBust(API_PROFESIONALES, cacheBust);
  const res = await fetch(url, {
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
  });
  if (!res.ok) throw new Error(`API profesionales HTTP ${res.status}`);
  const json = await res.json() as { profesionales?: ApiProfesional[] } | ApiProfesional[];
  const items: ApiProfesional[] = Array.isArray(json)
    ? json
    : (json.profesionales ?? []);
  if (!items.length) throw new Error("API devolvió lista vacía.");
  return items.map((p) => ({
    id: String(p.id),
    name: p.name,
    // El API puede devolver "Clínica Médica" (todo con mayúsculas) — normalizo a
    // "primera letra mayúscula, resto minúsculas" para que coincida con los tipos de la app.
    specialty: (p.specialty.charAt(0).toUpperCase() + p.specialty.slice(1).toLowerCase()) as HesmParsedRecord["specialty"],
    horariosResumen: p.horarios ?? "",
    matricula: p.matricula,
  }));
}

async function fetchProfesionalesFromScraping(cacheBust: boolean): Promise<HesmParsedRecord[]> {
  const profHtml = await fetchText(withCacheBust(`${BASE}/profesionales/`, cacheBust));
  const chunkMatch = profHtml.match(/\/_next\/static\/chunks\/app\/profesionales\/page-[a-f0-9]+\.js/);
  if (!chunkMatch) throw new Error("No se encontró el script de profesionales en hesm.org.");
  const chunkJs = await fetchText(withCacheBust(`${BASE}${chunkMatch[0]}`, cacheBust));
  return parseProfesionalesFromChunkJs(chunkJs);
}

export type HesmSyncResult = {
  whatsappDigits: string | null;
  phoneDisplay: string | null;
  /** Contenido del href tel: (ej. +542604080000) para armar enlaces de llamada */
  telHrefRaw: string | null;
  professionals: HesmParsedRecord[];
  fetchedAt: number;
};

export async function syncHesmFromPublicWeb(opts?: { cacheBust?: boolean }): Promise<HesmSyncResult> {
  const cacheBust = opts?.cacheBust ?? false;

  const [contactHtml, professionals] = await Promise.all([
    fetchText(withCacheBust(`${BASE}/contacto/`, cacheBust)),
    fetchProfesionalesFromApi(cacheBust).catch(() =>
      fetchProfesionalesFromScraping(cacheBust)
    ),
  ]);

  const contact = parseHesmContactPage(contactHtml);

  return {
    whatsappDigits: contact?.whatsappDigits || null,
    phoneDisplay: contact?.phoneDisplay || null,
    telHrefRaw: contact?.telHrefRaw || null,
    professionals,
    fetchedAt: Date.now(),
  };
}
