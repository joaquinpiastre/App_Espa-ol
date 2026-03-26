import { Linking } from "react-native";

function digitsOnly(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function makeTelUrl(phone: string) {
  return `tel:${digitsOnly(phone)}`;
}

export function makeMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

export function makeEmailUrl(email: string) {
  return `mailto:${email}`;
}

export function makeWhatsAppUrl(phoneNumber: string, message?: string) {
  const base = `https://wa.me/${digitsOnly(phoneNumber)}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export async function openUrl(url: string) {
  const supported = await Linking.canOpenURL(url);
  if (!supported) return false;
  await Linking.openURL(url);
  return true;
}

