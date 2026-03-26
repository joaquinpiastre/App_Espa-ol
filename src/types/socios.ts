export type SocioRecord = {
  dniNorm: string;
  nroSocioNorm: string;
  nombre: string;
  nroSocioDisplay: string;
  plan?: string;
  domicilio?: string;
  /** Cuotas adeudadas (columna CTAS_DEBE del export) */
  ctasDebe?: string;
};

export type SociosDataFile = {
  generatedAt: string;
  sourceFile: string;
  count: number;
  records: SocioRecord[];
};
