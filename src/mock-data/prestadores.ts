import type { Prestador } from "../types/prestadores";

export const prestadoresMock: Prestador[] = [
  {
    id: "prest-pami",
    nombre: "PAMI",
    cobertura: ["PAMI"],
    detalle:
      "Cobertura para jubilados y pensionados. La disponibilidad puede variar según especialidad y prestador.",
    contacto: {
      telefono: "(260) 408 0000",
      email: "prestaciones@hesm.org",
      observaciones:
        "Para confirmación de turnos, comunicarse por WhatsApp o teléfono.",
    },
    ubicacion: "Recepción - Av. El Libertador 950",
  },
  {
    id: "prest-ioma",
    nombre: "IOMA",
    cobertura: ["IOMA"],
    detalle:
      "Atención bajo convenios vigentes. Consultar disponibilidad del servicio y requisitos de derivación.",
    contacto: {
      telefono: "(260) 408 0000",
      email: "convenios@hesm.org",
    },
    ubicacion: "Administración - Recepción",
  },
  {
    id: "prest-osde",
    nombre: "OSDE",
    cobertura: ["OSDE"],
    detalle:
      "Consultas y estudios sujetos a cobertura y autorización cuando corresponda.",
    contacto: {
      telefono: "(260) 408 0000",
      observaciones:
        "Para turnos, indicar obra social y número de afiliado.",
    },
    ubicacion: "Recepción",
  },
  {
    id: "prest-obera",
    nombre: "Obra Social del Personal de la Salud (OSPS)",
    cobertura: ["OSPS"],
    detalle:
      "Cobertura para afiliados del área salud. Turnos sujetos a disponibilidad del servicio.",
    contacto: {
      telefono: "(260) 408 0000",
      email: "turnos@hesm.org",
    },
    ubicacion: "Área de Turnos",
  },
  {
    id: "prest-swiss-medical",
    nombre: "Swiss Medical",
    cobertura: ["Swiss Medical"],
    detalle:
      "Atención según planes y convenios. Se recomienda contar con orden médica cuando aplique.",
    contacto: {
      telefono: "(260) 408 0000",
      observaciones:
        "Para consultas por cartilla, indicar especialidad y preferencia de horario.",
    },
    ubicacion: "Consultorios Externos",
  },
  {
    id: "prest-omint",
    nombre: "OMINT",
    cobertura: ["OMINT"],
    detalle:
      "Turnos y prácticas bajo convenios. Coordinación previa para estudios complementarios.",
    contacto: {
      telefono: "(260) 408 0000",
    },
    ubicacion: "Recepción",
  },
  {
    id: "prest-particulares",
    nombre: "Pacientes particulares",
    cobertura: ["Particular"],
    detalle:
      "Opciones de turnos para pacientes sin obra social. Confirmar disponibilidad por WhatsApp.",
    contacto: {
      telefono: "(260) 408 0000",
      email: "info@hesm.org",
    },
    ubicacion: "Recepción",
  },
];

