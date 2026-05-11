import type { FarmaciaConvenio } from "../types/externos";

/** Convenios según https://www.hesm.org/farmacia/ */
export const farmaciasConvenioMock: FarmaciaConvenio[] = [
  {
    id: "farm-mayo",
    nombre: "Farmacia Mayo",
    descripcion:
      "Convenio activo con el Hospital Español del Sur Mendocino. Atención a socios con beneficios en medicamentos.",
    urlWeb: "https://farmaciamayo.com/",
  },
  {
    id: "farm-el-salto",
    nombre: "El Salto",
    descripcion:
      "Farmacia adherida al convenio HESM. Los socios pueden acceder a descuentos y facilidades en su compra.",
    urlWeb: "https://farmacialincoln.com.ar/farmacia/farmacia-el-salto/",
  },
  {
    id: "farm-crisol",
    nombre: "Crisol",
    descripcion:
      "Integrante de la red de farmacias en convenio. Atención especial para socios del Hospital Español.",
    urlWeb: "https://farmacialincoln.com.ar/farmacia/farmacia-crisol-3/",
  },
];
