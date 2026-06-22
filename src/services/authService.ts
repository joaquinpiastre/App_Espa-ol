import type { AuthUser } from "../types/auth";
import { findSocioByCredentials, normalizeDniInput, normalizeSocioInput } from "../data/sociosLookup";
import { findSocioRemote } from "./sociosSupabaseService";

export async function loginSocios(params: {
  dni: string;
  numeroSocio: string;
}): Promise<{ user: AuthUser }> {
  const dniTrim = params.dni.trim();
  const socioTrim = params.numeroSocio.trim();

  if (!dniTrim) throw new Error("Ingresá tu DNI.");
  if (!socioTrim) throw new Error("Ingresá tu número de socio.");

  const dniNorm = normalizeDniInput(dniTrim);
  const socioNorm = normalizeSocioInput(socioTrim);

  if (!dniNorm) throw new Error("El DNI no es válido (debe tener entre 6 y 10 dígitos).");
  if (!socioNorm) throw new Error("El número de socio no es válido.");

  // 1. Buscar en Supabase (con fallback a caché offline)
  let socio = await findSocioRemote(dniTrim, socioTrim);

  // 2. Último recurso: datos locales empaquetados en la app
  if (!socio) {
    socio = findSocioByCredentials(dniTrim, socioTrim);
  }

  if (!socio) {
    throw new Error("DNI o número de socio incorrectos. Verificá los datos o contactá al hospital.");
  }

  const user: AuthUser = {
    id: `socio_${socio.dniNorm}_${socio.nroSocioNorm}`,
    role: "socio",
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

/** Acceso sin credencial: funciones institucionales limitadas */
export async function loginInvitado(): Promise<{ user: AuthUser }> {
  const user: AuthUser = {
    id: "hesm_invitado",
    role: "invitado",
    displayName: "Invitado",
    emailOrDni: "",
  };
  return { user };
}

function toTitleCaseName(name: string) {
  return name
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
