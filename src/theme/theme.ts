import type { TextStyle, ViewStyle } from "react-native";

/**
 * Paleta alineada con hesml.org (CSS del sitio: primary teal + brand navy).
 */
export const theme = {
  colors: {
    bg: "#E6FAFA",
    bgMuted: "#CCF5F5",

    /** Fondo de pantalla (gradiente suave en Screen) */
    bgGradient: ["#E6FAFA", "#F5F5F5"] as const,

    surface: "#FFFFFF",
    surfaceMuted: "#F5FAFA",

    text: "#1A2E2E",
    textMuted: "#5C6D6C",
    textSubtle: "#8A9B99",

    border: "rgba(0, 70, 80, 0.10)",
    borderStrong: "rgba(0, 70, 80, 0.16)",

    /** Teal institucional (hesm.org) */
    primary: "#00666E",
    primaryDark: "#004A52",
    primaryMid: "#009AA8",
    primaryLight: "#00B4C5",
    primarySoft: "rgba(0, 102, 110, 0.12)",
    primaryGlow: "rgba(0, 180, 197, 0.20)",
    primaryBorderMuted: "rgba(0, 102, 110, 0.22)",

    /** Botones / acentos con gradiente */
    gradientPrimary: ["#00B4C5", "#00666E"] as const,

    /** Azul CTA del sitio (botones “Ver especialidades”, enlaces navy) */
    brandNavy: "#0047AB",
    brandNavySoft: "rgba(0, 71, 171, 0.10)",

    danger: "#C93D3D",
    dangerSoft: "rgba(201, 61, 61, 0.10)",
    success: "#1B9B6E",
    successSoft: "rgba(27, 155, 110, 0.12)",
    warning: "#C9922E",
    warningSoft: "rgba(201, 146, 46, 0.12)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 28,
    pill: 999,
  },
  shadows: {
    sm: "0px 6px 18px rgba(2, 6, 23, 0.06)",
    card: "0px 12px 32px rgba(2, 6, 23, 0.07)",
    soft: "0px 4px 14px rgba(2, 6, 23, 0.05)",
  },
  nativeShadow: {
    sm: {
      shadowColor: "#003840",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 2,
    } as ViewStyle,
    card: {
      shadowColor: "#003840",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 4,
    } as ViewStyle,
    lifted: {
      shadowColor: "#003840",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.12,
      shadowRadius: 28,
      elevation: 6,
    } as ViewStyle,
    tabBar: {
      shadowColor: "#003840",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 12,
    } as ViewStyle,
  },
  typography: {
    h1: {
      fontSize: 30,
      fontWeight: "700",
      letterSpacing: -0.6,
      lineHeight: 36,
    } as TextStyle,
    h2: {
      fontSize: 21,
      fontWeight: "700",
      letterSpacing: -0.35,
      lineHeight: 27,
    } as TextStyle,
    h3: {
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: -0.15,
      lineHeight: 22,
    } as TextStyle,
    overline: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.2,
      lineHeight: 14,
      textTransform: "uppercase" as const,
    } as TextStyle,
    body: {
      fontSize: 15,
      fontWeight: "600",
      letterSpacing: 0,
      lineHeight: 22,
    } as TextStyle,
    body2: {
      fontSize: 14,
      fontWeight: "600",
      letterSpacing: 0,
      lineHeight: 20,
    } as TextStyle,
    caption: {
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0,
      lineHeight: 16,
    } as TextStyle,
    small: {
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0,
      lineHeight: 15,
    } as TextStyle,
  },
};

export type Theme = typeof theme;
