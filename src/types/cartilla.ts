export type Professional = {
  id: string;
  name: string;
  /** Especialidades alineadas a la cartelera de hesm.org */
  specialty:
    | "Clínica médica"
    | "Anestesiología"
    | "Cardiología"
    | "Urología"
    | "Gastroenterología"
    | "Cirugía general"
    | "Cirugía de tórax"
    | "Ginecología"
    | "Traumatología"
    | "Nutrición"
    | "Dermatología"
    | "Diabetología"
    | "Neumonología"
    | "Otorrinolaringología"
    | "Oftalmología"
    | "Pediatría"
    | "Mastología"
    | "Endocrinología";
  modalidad?: string;
  observaciones?: string;
  whatsappMessageContext?: string;
  ratingMock?: number;
};

export type CartillaItem = Professional;

export type CartillaFilters = {
  search: string;
  specialty: string | null;
  professional: string | null;
};
