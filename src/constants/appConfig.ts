/** Respaldo si aún no hubo sync con hesm.org (se pisa con datos de /contacto/) */
export const HESM_WHATSAPP_NUMBER = "5492604080000";

export const HESM_CONFIG = {
  name: "Hospital Español del Sur Mendocino",
  address: "Av. El Libertador 950, San Rafael, Mendoza",
  phonePrincipal: "(260) 408 0000",
  /** Línea pública de ambulancia / servicio de ambulancia (San Rafael, Mendoza) */
  sanRafaelEmergenciasDisplay: "(260) 443 7000",
  sanRafaelEmergenciasTel: "+542604437000",
  /** Etiqueta en pantalla Emergencias para la línea sanRafaelEmergenciasDisplay */
  sanRafaelAmbulanciaLabel: "Servicio de ambulancia",
  email: "info@hesm.org",
  guardiaLabel: "Guardia 24 hs",
  websiteUrl: "https://www.hesm.org/",
  instagramUrl: "https://www.hesm.org/", // TODO: reemplazar por el link oficial de Instagram
  facebookUrl: "https://www.hesm.org/", // TODO: reemplazar por el link oficial de Facebook
  /**
   * Entrada al pago de cuotas (mismo enlace para todos los socios; cada uno completa sus datos en Mercado Pago).
   * Si deja de abrirse, generá un link nuevo en MP y reemplazá la URL (session_id / journey suelen caducar).
   */
  mercadoPagoCuotaUrl:
    "https://www.mercadopago.com.ar/one-experience/simple-input/sp_manual_input_product?journey_id=2734b803-d204-4b17-9000-24743c8efbec&session_id=2df0986c-be9d-4420-8233-0ffecdadc132&from=billpayments_entities_search&entity_id=2126_hospital_espaol_del_sur_mendocino_soc_beneficencia_y_mutualid&product_id=2126_hospital_espanol_del_sur_mendocino_soc_beneficencia_y_mutualid&parameter_id=3550&panel_active=CDP",
  services: [
    "Consultorios",
    "Guardia",
    "Internación",
    "Clínica médica",
    "Cardiología",
    "Urología",
    "Gastroenterología",
    "Cirugía",
    "Ginecología",
    "Traumatología",
    "Nutrición",
    "Dermatología",
    "Diabetología",
    "Neumonología",
    "Otorrinolaringología",
    "Oftalmología",
    "Pediatría",
    "Hematología / Oncohematología",
    "Análisis clínicos",
    "Diagnóstico por imágenes",
    "Hemoterapia",
    "Terapia intensiva",
    "Hemodinamia",
    "Maternidad",
    "Neonatología",
    "Nefrología",
    "Farmacia",
  ],
};

/** URLs de páginas legales de la app (desplegadas en hesm-legal.vercel.app) */
export const HESM_LEGAL_URLS = {
  privacidad: "https://hesm-legal.vercel.app/privacidad.html",
  terminos: "https://hesm-legal.vercel.app/terminos.html",
  eliminarCuenta: "https://hesm.org/eliminar-cuenta",
} as const;

/** Imágenes oficiales del sitio (hesm.org) para branding en la app */
export const HESM_REMOTE_ASSETS = {
  buildingFront: "https://www.hesm.org/images/frente.webp",
  logo: "https://www.hesm.org/images/logo.jpg",
} as const;

export const APP_CONFIG = {
  loginMessage:
    "Ingresá con tu DNI y número de socio. Cartilla, contactos y turnos por WhatsApp.",
  socioHomeMessage:
    "Emergencias y guardia arriba en esta pantalla; cartilla, turnos con credencial y tu información de socio disponibles desde acá.",
  guestHomeMessage:
    "Estás en modo invitado: información institucional y contactos del hospital. Cartilla médica, farmacias y novedades están disponibles al iniciar sesión como socio. Podés consultar por WhatsApp cómo hacerte socio desde accesos rápidos o Perfil.",
  guestLoginButton: "Continuar como invitado",
  guestLoginSubtitle: "Información pública sin credencial de socio",
  socioRecoveryLink: "¿Sos socio? Recuperar número de socio",
  /** Mensaje prearmado al hospital por WhatsApp (modo invitado → hacerme socio) */
  guestBecomeMemberWhatsAppMessage:
    "Hola, quiero información para asociarme / hacerme socio del Hospital Español del Sur Mendocino. ¿Me indican los pasos y requisitos? Gracias.",
  appStoreOrCredentialPrefix: "Credencial HESM",
};

