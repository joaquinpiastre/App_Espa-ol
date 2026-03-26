export type Prestador = {
  id: string;
  nombre: string;
  cobertura: string[];
  detalle: string;
  contacto: {
    telefono?: string;
    email?: string;
    observaciones?: string;
  };
  ubicacion?: string;
};

