import { Linking } from "react-native";

function digitsOnly(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function makeTelUrl(phone: string) {
  return `tel:${digitsOnly(phone)}`;
}

export function makeMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function makeEmailUrl(email: string) {
  return `mailto:${email}`;
}

export function makeWhatsAppUrl(phoneNumber: string, message?: string) {
  const phone = digitsOnly(phoneNumber).replace(/^\+/, "");
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

// canOpenURL en Android 11+ devuelve false para tel:, mailto:, whatsapp:// etc.
// si no están declarados en <queries> del Manifest — aunque el handler exista.
// Llamamos openURL directamente y capturamos el error para no bloquear la navegación.
export async function openUrl(url: string) {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
