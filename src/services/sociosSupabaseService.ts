import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabaseClient";
import type { SocioRecord } from "../types/socios";
import { normalizeDniInput, normalizeSocioInput } from "../data/sociosLookup";

const CACHE_PREFIX = "hesm.socio.cache.v1.";

/**
 * Busca un socio en Supabase por DNI + número de socio.
 * Si Supabase no responde (sin internet), intenta el caché local.
 * Retorna null si no existe o si las credenciales no coinciden.
 */
export async function findSocioRemote(
  dniInput: string,
  socioInput: string
): Promise<SocioRecord | null> {
  const dniNorm = normalizeDniInput(dniInput);
  const socioNorm = normalizeSocioInput(socioInput);
  if (!dniNorm || !socioNorm) return null;

  // 1. Intentar Supabase
  try {
    const { data, error } = await supabase
      .from("socios")
      .select("dni_norm, nro_socio_norm, nombre, nro_socio_display, plan, domicilio, ctas_debe")
      .eq("dni_norm", dniNorm)
      .eq("nro_socio_norm", socioNorm)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const record = mapRow(data);
      // Guardar en caché para uso offline
      await AsyncStorage.setItem(CACHE_PREFIX + dniNorm, JSON.stringify(record)).catch(() => null);
      return record;
    }

    // Registro no encontrado en Supabase (DNI/socio incorrectos)
    return null;
  } catch {
    // Sin internet o Supabase caído → usar caché
    return getFromCache(dniNorm, socioNorm);
  }
}

async function getFromCache(dniNorm: string, socioNorm: string): Promise<SocioRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + dniNorm);
    if (!raw) return null;
    const record = JSON.parse(raw) as SocioRecord;
    return record.nroSocioNorm === socioNorm ? record : null;
  } catch {
    return null;
  }
}

function mapRow(row: Record<string, string | null>): SocioRecord {
  return {
    dniNorm: row.dni_norm ?? "",
    nroSocioNorm: row.nro_socio_norm ?? "",
    nombre: row.nombre ?? "",
    nroSocioDisplay: row.nro_socio_display ?? "",
    plan: row.plan ?? undefined,
    domicilio: row.domicilio ?? undefined,
    ctasDebe: row.ctas_debe ?? undefined,
  };
}
