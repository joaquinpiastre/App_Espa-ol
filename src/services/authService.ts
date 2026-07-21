import type { AuthUser } from "../types/auth";
import { findSocioByCredentials, normalizeDniInput, normalizeSocioInput } from "../data/sociosLookup";
import { findSocioRemote, findSocioRemoteSinDni } from "./sociosSupabaseService";

export async function loginSocios(params: {
  dni: string;
  numeroSocio: string;
}): Promise<{ user: AuthUser }> {
  const dniTrim = params.dni.trim();
  const socioTrim = params.numeroSocio.trim();

  if (!socioTrim) throw new Error("Ingresá tu número de socio.");

  const socioNorm = normalizeSocioInput(socioTrim);
  if (!socioNorm) throw new Error("El número de socio no es válido.");

  let socio;

  if (!dniTrim) {
    // Sin DNI: solo funciona para cuentas que no tienen DNI cargado en el padrón.
    socio = await findSocioRemoteSinDni(socioTrim);
  } else {
    const dniNorm = normalizeDniInput(dniTrim);
    if (!dniNorm) throw new Error("El DNI no es válido (debe tener entre 6 y 10 dígitos).");

    // 1. Buscar en Supabase (con fallback a caché offline)
    socio = await findSocioRemote(dniTrim, socioTrim);

    // 2. Último recurso: datos locales empaquetados en la app
    if (!socio) {
      socio = findSocioByCredentials(dniTrim, socioTrim);
    }
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
