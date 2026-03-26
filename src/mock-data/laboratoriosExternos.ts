import type { LaboratorioExterno } from "../types/externos";

export const laboratoriosExternosMock: LaboratorioExterno[] = [
  {
    id: "ext-lab-clinlab",
    nombre: "ClinLab San Rafael",
    direccion: "Hipólito Yrigoyen 780, San Rafael, Mendoza",
    horarios: "Lun a Vie 7:30 a 18:00",
    telefono: "(260) 444 6100",
    observaciones:
      "Toma de muestras con indicación médica. Coordinación por teléfono sugerida.",
  },
  {
    id: "ext-lab-analisis-del-sur",
    nombre: "Análisis del Sur",
    direccion: "Belgrano 240, San Rafael, Mendoza",
    horarios: "Lun a Vie 8:00 a 17:00",
    telefono: "(260) 444 4200",
    observaciones:
      "Resultados en plazo variable según estudio. Consultar turnos disponibles.",
  },
  {
    id: "ext-lab-imagenes-rad",
    nombre: "RadImagen",
    direccion: "Calle 9 de Julio 520, San Rafael, Mendoza",
    horarios: "Mar a Sáb 8:30 a 16:30",
    telefono: "(260) 444 9000",
    observaciones:
      "Diagnóstico por imágenes con indicación médica. Se recomienda llevar estudios previos.",
  },
  {
    id: "ext-lab-bioquimica-olivares",
    nombre: "Bioquímica Olivares",
    direccion: "Av. San Martín 1000, San Rafael, Mendoza",
    horarios: "Lun a Vie 8:00 a 18:30",
    telefono: "(260) 444 7300",
    observaciones:
      "Estudios de laboratorio y seguimiento. Consultar preparación si aplica.",
  },
];

