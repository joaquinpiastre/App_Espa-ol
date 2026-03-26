import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowRight, Phone, MapPin, UserRound } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ScreenHeader } from "../../../components/app/ScreenHeader";
import { theme } from "../../../theme/theme";
import { makeMapsUrl, makeTelUrl, makeWhatsAppUrl, openUrl } from "../../../utils/links";
import { HESM_CONFIG } from "../../../constants/appConfig";
import { useCartillaData } from "../../../hooks/useCartillaData";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";

export function DetalleProfesional() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { professionals } = useCartillaData();
  const { whatsappNumber, phoneForTel } = useHesmContacts();
  const professional = professionals.find((p) => p.id === params.id);

  if (!professional) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
        <ScreenHeader title="Profesional" subtitle="No encontramos el detalle." />
        <Card style={{ padding: theme.spacing.xl }}>
          <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
            El profesional solicitado no existe en el mock actual.
          </Text>
          <View style={{ height: theme.spacing.md }} />
          <Button title="Volver" variant="secondary" size="lg" onPress={() => router.back()} />
        </Card>
      </Screen>
    );
  }

  const whatsappUrl = makeWhatsAppUrl(
    whatsappNumber,
    `Hola, quiero solicitar turno para ${professional.specialty} con ${professional.name}. ¿Podrían indicarme disponibilidad?`
  );
  const telUrl = makeTelUrl(phoneForTel);

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <ScreenHeader title={professional.name} subtitle={professional.specialty} />

      <View style={{ gap: theme.spacing.md }}>
        <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.md }}>
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: theme.radii.md,
                backgroundColor: theme.colors.primarySoft,
                borderWidth: 1,
                borderColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserRound size={22} color={theme.colors.primaryDark} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>{professional.name}</Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                Especialidad: {professional.specialty}
              </Text>
            </View>
          </View>

          {professional.modalidad ? (
            <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>
              <Text style={{ fontWeight: "800", color: theme.colors.text }}>Modalidad: </Text>
              {professional.modalidad}
            </Text>
          ) : null}

          {professional.observaciones ? (
            <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
              {professional.observaciones}
            </Text>
          ) : null}

          <View style={{ height: theme.spacing.sm }} />

          <Button
            title="Solicitar turno por WhatsApp"
            size="lg"
            variant="primary"
            onPress={() => openUrl(whatsappUrl)}
            iconRight={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
          />

          <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
            <View style={{ flex: 1 }}>
              <Button
                title="Llamar"
                variant="secondary"
                onPress={() => openUrl(telUrl)}
                iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Mapa"
                variant="secondary"
                onPress={() => openUrl(makeMapsUrl(HESM_CONFIG.address))}
                iconLeft={<MapPin size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
              />
            </View>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

