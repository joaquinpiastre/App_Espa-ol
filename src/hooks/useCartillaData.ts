import { useMemo } from "react";

import { hesParsedToProfessional } from "../services/hesmCatalogParser";
import type { Professional } from "../types/cartilla";
import { useHesmRemoteStore } from "../state/useHesmRemoteStore";
import { cartillaProfessionalsBundled } from "../mock-data/cartilla";

export type CartillaData = {
  professionals: Professional[];
  specialties: string[];
};

/**
 * Cartilla: datos remotos si hubo sync exitoso; si no, bundle embebido.
 */
export function useCartillaData(): CartillaData {
  const remote = useHesmRemoteStore((s) => s.professionals);

  return useMemo(() => {
    const professionals = remote?.length
      ? remote.map(hesParsedToProfessional)
      : cartillaProfessionalsBundled;
    const specialties = Array.from(new Set(professionals.map((p) => p.specialty))).sort();
    return { professionals, specialties };
  }, [remote]);
}
