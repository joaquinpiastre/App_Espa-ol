import { parseHesmContactPage } from "./hesmContactParser";
import { parseProfesionalesFromChunkJs, type HesmParsedRecord } from "./hesmCatalogParser";

const BASE = "https://www.hesm.org";
const UA = "HESM-App/1.0 (sync; +https://www.hesm.org)";

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

export type HesmSyncResult = {
  whatsappDigits: string | null;
  phoneDisplay: string | null;
  /** Contenido del href tel: (ej. +542604080000) para armar enlaces de llamada */
  telHrefRaw: string | null;
  professionals: HesmParsedRecord[];
  fetchedAt: number;
};

/**
 * Descarga contacto + cartilla desde el sitio público (sin API propia del hospital).
 */
export async function syncHesmFromPublicWeb(): Promise<HesmSyncResult> {
  const [contactHtml, profHtml] = await Promise.all([
    fetchText(`${BASE}/contacto/`),
    fetchText(`${BASE}/profesionales/`),
  ]);

  const contact = parseHesmContactPage(contactHtml);
  const chunkMatch = profHtml.match(/\/_next\/static\/chunks\/app\/profesionales\/page-[a-f0-9]+\.js/);
  if (!chunkMatch) throw new Error("No se encontró el script de profesionales en hesm.org.");

  const chunkJs = await fetchText(`${BASE}${chunkMatch[0]}`);
  const professionals = parseProfesionalesFromChunkJs(chunkJs);

  return {
    whatsappDigits: contact?.whatsappDigits || null,
    phoneDisplay: contact?.phoneDisplay || null,
    telHrefRaw: contact?.telHrefRaw || null,
    professionals,
    fetchedAt: Date.now(),
  };
}
