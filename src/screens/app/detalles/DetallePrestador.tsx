import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Phone, Mail, MessageCircle, ArrowRight } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { ScreenHeader } from "../../../components/app/ScreenHeader";
import { Card } from "../../../components/ui/Card";
import { InfoRow } from "../../../components/ui/InfoRow";
import { Button } from "../../../components/ui/Button";
import { theme } from "../../../theme/theme";
import { prestadoresMock } from "../../../mock-data/prestadores";
import { makeTelUrl, makeWhatsAppUrl, openUrl } from "../../../utils/links";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";

export function DetallePrestador() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { whatsappNumber, phoneForTel } = useHesmContacts();
  const prestador = prestadoresMock.find((p) => p.id === params.id);

  if (!prestador) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
        <ScreenHeader title="Prestador" subtitle="No encontramos el detalle." />
        <Card style={{ padding: theme.spacing.xl }}>
          <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
            El prestador solicitado no existe en el mock actual.
          </Text>
          <View style={{ height: theme.spacing.md }} />
          <Button title="Volver" variant="secondary" size="lg" onPress={() => router.back()} />
        </Card>
      </Screen>
    );
  }

  const telUrl = makeTelUrl(phoneForTel);
  const whatsappUrl = makeWhatsAppUrl(
    whatsappNumber,
    `Hola, quiero coordinar un turno. Cobertura: ${prestador.nombre}. ¿Podrían indicarme disponibilidad y requisitos?`
  );

  const coberturaChips = prestador.cobertura.slice(0, 6);

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <ScreenHeader title={prestador.nombre} subtitle={prestador.cobertura.join(" • ")} />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>Detalle básico</Text>
          <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
            {prestador.detalle}
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {coberturaChips.map((c) => (
              <View
                key={c}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: theme.colors.surfaceMuted,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, fontWeight: "800" }}>
                  {c}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {prestador.contacto.telefono ? (
          <InfoRow label="Teléfono" value={prestador.contacto.telefono} icon={<Phone size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
        ) : null}
        {prestador.contacto.email ? (
          <InfoRow label="Email" value={prestador.contacto.email} icon={<Mail size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
        ) : null}
        {prestador.contacto.observaciones ? (
          <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>{prestador.contacto.observaciones}</Text>
        ) : null}

        <View style={{ height: 1, backgroundColor: theme.colors.border }} />

        <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Llamar"
              variant="secondary"
              size="lg"
              onPress={() => openUrl(telUrl)}
              iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="WhatsApp"
              variant="primary"
              size="lg"
              onPress={() => openUrl(whatsappUrl)}
              iconLeft={<MessageCircle size={18} color="#fff" strokeWidth={2.2} />}
              iconRight={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
            />
          </View>
        </View>
      </Card>
    </Screen>
  );
}

