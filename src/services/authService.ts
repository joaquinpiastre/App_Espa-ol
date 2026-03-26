import type { AuthUser } from "../types/auth";
import { findSocioByCredentials, normalizeDniInput, normalizeSocioInput } from "../data/sociosLookup";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function loginSocios(params: {
  dni: string;
  numeroSocio: string;
}): Promise<{ user: AuthUser }> {
  await sleep(400);

  const dniTrim = params.dni.trim();
  const socioTrim = params.numeroSocio.trim();

  if (!dniTrim) throw new Error("Ingresá tu DNI.");
  if (!socioTrim) throw new Error("Ingresá tu número de socio.");

  const dniNorm = normalizeDniInput(dniTrim);
  const socioNorm = normalizeSocioInput(socioTrim);

  if (!dniNorm) throw new Error("El DNI no es válido (debe tener entre 6 y 10 dígitos).");
  if (!socioNorm) throw new Error("El número de socio no es válido.");

  const socio = findSocioByCredentials(dniTrim, socioTrim);
  if (!socio) {
    throw new Error("DNI o número de socio incorrectos. Verificá los datos o contactá al hospital.");
  }

  const user: AuthUser = {
    id: `socio_${socio.dniNorm}_${socio.nroSocioNorm}`,
    displayName: toTitleCaseName(socio.nombre),
    emailOrDni: socio.dniNorm,
    nroSocio: socio.nroSocioNorm,
    nroSocioDisplay: socio.nroSocioDisplay,
    plan: socio.plan,
    domicilio: socio.domicilio,
    ctasDebe: socio.ctasDebe,
  };

  return { user };
}

/** Nombre legible: primera letra de cada palabra en mayúscula */
function toTitleCaseName(name: string) {
  return name
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function requestRecoveryMock(params: {
  emailOrDni: string;
}): Promise<{ ok: true }> {
  await sleep(750);
  const t = params.emailOrDni.trim();
  if (!t) throw new Error("Ingresá tu DNI.");
  if (!normalizeDniInput(t)) throw new Error("Ingresá un DNI válido.");
  return { ok: true };
}
