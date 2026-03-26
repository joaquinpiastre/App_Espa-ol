/**
 * Extrae teléfono y WhatsApp públicos de la página de contacto de hesm.org.
 */

export type HesmContactParsed = {
  /** Solo dígitos, formato wa.me (ej. 5492604498763) */
  whatsappDigits: string;
  /** href tel completo, ej. +542604080000 */
  telHrefRaw: string;
  /** Texto legible para mostrar (línea principal) */
  phoneDisplay: string;
};

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * Primer wa.me en el HTML (contacto / header suelen repetir el mismo).
 */
export function extractWhatsAppFromHtml(html: string): string | null {
  const m = html.match(/wa\.me\/(\d{10,15})/i);
  return m ? m[1] : null;
}

/**
 * Primer enlace tel: (línea institucional en /contacto).
 */
export function extractTelHrefFromHtml(html: string): string | null {
  const m = html.match(/href="tel:([^"]+)"/i);
  if (!m) return null;
  return m[1].trim();
}

/**
 * Intenta el texto visible tipo (0260) 408 0000 antes de formatear desde href.
 */
export function extractPhoneDisplayFromHtml(html: string, telHref: string | null): string {
  const block = html.match(/\(0?260\)\s*[\d\s]{6,18}/i);
  if (block) return block[0].replace(/\s+/g, " ").trim();
  const alt = html.match(/0?260\)\s*408[\d\s]{0,12}/i);
  if (alt) return alt[0].replace(/\s+/g, " ").trim();
  if (telHref) {
    const d = digitsOnly(telHref);
    if (d.length >= 10) {
      const tail = d.slice(-10);
      return `(260) ${tail.slice(0, 3)} ${tail.slice(3)}`;
    }
  }
  return telHref ?? "";
}

export function parseHesmContactPage(html: string): HesmContactParsed | null {
  const whatsappDigits = extractWhatsAppFromHtml(html);
  const telHrefRaw = extractTelHrefFromHtml(html);
  if (!whatsappDigits && !telHrefRaw) return null;
  const phoneDisplay = extractPhoneDisplayFromHtml(html, telHrefRaw);
  return {
    whatsappDigits: whatsappDigits ?? "",
    telHrefRaw: telHrefRaw ?? "",
    phoneDisplay: phoneDisplay.trim() || "(ver sitio web)",
  };
}
