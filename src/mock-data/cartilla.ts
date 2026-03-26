import type { Professional } from "../types/cartilla";
import payload from "../data/cartillaProfessionals.generated.json";

type GenRecord = (typeof payload.records)[number];

function toProfessional(r: GenRecord): Professional {
  const obsParts = [`Horarios: ${r.horariosResumen}.`, "Datos según cartelera en hesm.org."];
  if (r.matricula) obsParts.unshift(`Mat. ${r.matricula}.`);

  return {
    id: r.id,
    name: r.name,
    specialty: r.specialty as Professional["specialty"],
    modalidad: "Presencial",
    observaciones: obsParts.join(" "),
    whatsappMessageContext: `${r.specialty} — ${r.name}`,
  };
}

/** Lista embebida en el bundle (respaldo si no hay red o falla hesm.org) */
export const cartillaProfessionalsBundled: Professional[] = payload.records.map(toProfessional);
