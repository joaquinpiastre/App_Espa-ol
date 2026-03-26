import type { SociosDataFile, SocioRecord } from "../types/socios";
import sociosPayload from "./socios.json";

const payload = sociosPayload as SociosDataFile;

/** DNI: solo dígitos; se quitan ceros a la izquierda para comparar. */
export function normalizeDniInput(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 6 || digits.length > 10) return null;
  return digits.replace(/^0+/, "") || "0";
}

/** Número de socio: solo dígitos (acepta 16.361 o 16361). */
export function normalizeSocioInput(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  return digits.length ? digits : null;
}

export function findSocioByCredentials(dniInput: string, socioInput: string): SocioRecord | null {
  const dni = normalizeDniInput(dniInput);
  const socio = normalizeSocioInput(socioInput);
  if (!dni || !socio) return null;

  return (
    payload.records.find((r) => r.dniNorm === dni && r.nroSocioNorm === socio) ?? null
  );
}

export function getSociosCount(): number {
  return payload.records.length;
}
