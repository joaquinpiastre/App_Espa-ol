/** Respaldo si aún no hubo sync con hesm.org (se pisa con datos de /contacto/) */
export const HESM_WHATSAPP_NUMBER = "5492604080000";

export const HESM_CONFIG = {
  name: "Hospital Español del Sur Mendocino",
  address: "Av. El Libertador 950, San Rafael, Mendoza",
  phonePrincipal: "(260) 408 0000",
  email: "info@hesm.org",
  guardiaLabel: "Guardia 24 hs",
  websiteUrl: "https://www.hesm.org/",
  instagramUrl: "https://www.hesm.org/", // TODO: reemplazar por el link oficial de Instagram
  facebookUrl: "https://www.hesm.org/", // TODO: reemplazar por el link oficial de Facebook
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

/** Imágenes oficiales del sitio (hesm.org) para branding en la app */
export const HESM_REMOTE_ASSETS = {
  buildingFront: "https://www.hesm.org/images/frente.webp",
  logo: "https://www.hesm.org/images/logo.jpg",
} as const;

export const APP_CONFIG = {
  loginMessage:
    "Ingresá con tu DNI y número de socio. Cartilla, contactos y turnos por WhatsApp.",
  appStoreOrCredentialPrefix: "Credencial HESM",
};

