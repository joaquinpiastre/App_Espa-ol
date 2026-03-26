export type AuthUser = {
  id: string;
  /** Nombre y apellido según base de socios */
  displayName: string;
  /** DNI (solo dígitos normalizados, para mostrar en perfil) */
  emailOrDni: string;
  /** Número de socio normalizado */
  nroSocio?: string;
  /** Cómo figura el socio en el listado (ej. 16.361) */
  nroSocioDisplay?: string;
  plan?: string;
  domicilio?: string;
  /** Cuotas que debe (según CTAS_DEBE en socios.xls) */
  ctasDebe?: string;
};

export type LoginPayload = {
  emailOrDni: string;
  password: string;
  rememberMe: boolean;
};

export type AuthSession = {
  user: AuthUser;
  createdAt: number;
};
