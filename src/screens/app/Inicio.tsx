import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  ShieldAlert,
  Stethoscope,
  Handshake,
  Building2,
  Network,
} from "lucide-react-native";

import { Screen } from "../../components/app/Screen";
import { Card } from "../../components/ui/Card";
import { QuickAccessButton } from "../../components/ui/QuickAccessButton";
import { Button } from "../../components/ui/Button";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { theme } from "../../theme/theme";
import { novedadesMock } from "../../mock-data/novedades";
import { useCurrentUser } from "../../state/useAuthStore";
import { HESM_CONFIG, APP_CONFIG } from "../../constants/appConfig";
import { makeMapsUrl, makeTelUrl, makeWhatsAppUrl, makeEmailUrl, openUrl } from "../../utils/links";
import { useCartillaData } from "../../hooks/useCartillaData";
import { useHesmContacts } from "../../state/useHesmRemoteStore";

export function Inicio() {
  const router = useRouter();
  const user = useCurrentUser();
  const { specialties } = useCartillaData();
  const { whatsappNumber, phoneForTel } = useHesmContacts();

  const quickGrid = [
    {
      label: "Cartilla médica",
      icon: <Stethoscope size={22} color={theme.colors.primaryDark} strokeWidth={2.2} />,
      onPress: () => router.push("/cartilla"),
      subtitle: "Profesionales y especialidades",
    },
    {
      label: "Emergencias",
      icon: <ShieldAlert size={22} color={theme.colors.primaryDark} strokeWidth={2.2} />,
      onPress: () => router.push("/emergencias"),
      subtitle: "Guardia 24 hs y orientación",
    },
    {
      label: "Prestadores",
      icon: <Handshake size={22} color={theme.colors.primaryDark} strokeWidth={2.2} />,
      onPress: () => router.push("/prestadores"),
      subtitle: "Coberturas y contacto",
    },
    {
      label: "Consultorios externos",
      icon: <Building2 size={22} color={theme.colors.primaryDark} strokeWidth={2.2} />,
      onPress: () => router.push("/consultorios-externos"),
      subtitle: "Listado y horarios",
    },
    {
      label: "Laboratorios externos",
      icon: <Network size={22} color={theme.colors.primaryDark} strokeWidth={2.2} />,
      onPress: () => router.push("/laboratorios-externos"),
      subtitle: "Turnos y contactos",
    },
    {
      label: "Redes sociales",
      icon: <Network size={22} color={theme.colors.primaryDark} strokeWidth={2.2} />,
      onPress: () => router.push("/redes-sociales"),
      subtitle: "Instagram, Facebook y sitio",
    },
  ];

  const featured = [
    {
      label: "Guardia 24 hs",
      icon: <ShieldAlert size={22} color="#fff" strokeWidth={2.2} />,
      onPress: () => router.push("/emergencias"),
      variant: "primary" as const,
    },
    {
      label: "Turnos por WhatsApp",
      icon: <CalendarCheck size={22} color="#fff" strokeWidth={2.2} />,
      onPress: () => router.push("/turnos"),
      variant: "primary" as const,
    },
  ];

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xxl }}>
      <View style={{ gap: theme.spacing.md, paddingTop: theme.spacing.sm }}>
        <Text style={{ ...theme.typography.overline, color: theme.colors.primaryDark }}>
          BIENVENIDO
        </Text>
        <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
          Hola{user?.displayName ? `, ${user.displayName}` : ""}.
        </Text>
        <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted, lineHeight: 22 }}>
          {APP_CONFIG.loginMessage}
        </Text>
      </View>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <LinearGradient
          colors={[...theme.colors.gradientPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl }}
        >
          <Text style={{ color: "rgba(255,255,255,0.92)", fontWeight: "800", fontSize: 12, letterSpacing: 1 }}>
            INSTITUCIONAL
          </Text>
        </LinearGradient>
        <View style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: theme.spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: theme.spacing.sm }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>Hospital Español</Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                Cartilla y orientación para servicios del hospital. Especialidades en cartilla:{" "}
                {specialties.length}.
              </Text>
            </View>
            <LinearGradient
              colors={[...theme.colors.gradientPrimary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: theme.radii.md,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.35)",
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>H</Text>
            </LinearGradient>
          </View>
          <Text style={{ ...theme.typography.small, color: theme.colors.textSubtle }}>
            Diseñado para claridad, rapidez y confianza en cada contacto.
          </Text>
        </View>
      </Card>

      <View style={{ gap: theme.spacing.md }}>
        <SectionTitle
          kicker="NAVEGACIÓN"
          title="Accesos rápidos"
          subtitle="Lo esencial, a pocos toques."
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.md }}>
          {quickGrid.map((item) => (
            <View key={item.label} style={{ width: "48%" }}>
              <QuickAccessButton
                label={item.label}
                subtitle={item.subtitle}
                icon={item.icon}
                onPress={item.onPress}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionTitle
          kicker="PRIORITARIO"
          title="Atención inmediata"
          subtitle="Urgencias y solicitud de turnos por WhatsApp."
        />
        <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
          {featured.map((item) => (
            <View key={item.label} style={{ flex: 1 }}>
              <Button
                title={item.label}
                onPress={item.onPress}
                size="lg"
                variant={item.variant}
                iconLeft={item.icon}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionTitle kicker="INFO" title="Novedades" subtitle="Información institucional (datos de ejemplo)." />
        <View style={{ gap: theme.spacing.md }}>
          {novedadesMock.map((n) => (
            <Card key={n.id} style={{ padding: theme.spacing.lg, gap: theme.spacing.sm }}>
              <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>{n.titulo}</Text>
              <Text style={{ ...theme.typography.small, color: theme.colors.primaryDark, fontWeight: "800" }}>
                {n.fecha}
              </Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>{n.resumen}</Text>
            </Card>
          ))}
        </View>
      </View>

      <View style={{ gap: theme.spacing.md, paddingBottom: theme.spacing.xl }}>
        <SectionTitle kicker="CONTACTO" title="Contactos rápidos" subtitle="Llamá, escribí o llegá sin perderte." />
        <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
          <View style={{ flexDirection: "row", gap: theme.spacing.md, flexWrap: "wrap" }}>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Button
                title="Llamar"
                variant="secondary"
                onPress={() => openUrl(makeTelUrl(phoneForTel))}
                iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
              />
            </View>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Button
                title="Ubicación"
                variant="secondary"
                onPress={() => openUrl(makeMapsUrl(HESM_CONFIG.address))}
                iconLeft={<MapPin size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: theme.spacing.md, flexWrap: "wrap" }}>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Button
                title="Email"
                variant="secondary"
                onPress={() => openUrl(makeEmailUrl(HESM_CONFIG.email))}
                iconLeft={<Mail size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
              />
            </View>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Button
                title="WhatsApp"
                variant="secondary"
                onPress={() =>
                  openUrl(
                    makeWhatsAppUrl(whatsappNumber, "Hola, necesito orientación para turnos.")
                  )
                }
                iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
              />
            </View>
          </View>

          <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, marginTop: theme.spacing.sm }}>
            {HESM_CONFIG.guardiaLabel}. Atención de urgencias y orientación.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
