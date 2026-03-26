import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MessageCircle } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { makeWhatsAppUrl, openUrl } from "../../../utils/links";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";

export function Turnos() {
  const params = useLocalSearchParams<{ servicio?: string }>();
  const [servicio, setServicio] = useState(params.servicio ?? "");
  const { whatsappNumber, phonePrincipal } = useHesmContacts();

  const message = useMemo(() => {
    const s = servicio.trim();
    return s
      ? `Hola, quiero solicitar un turno. Servicio/Esp.: ${s}. ¿Podrían indicarme disponibilidad?`
      : "Hola, quiero solicitar un turno. ¿Podrían indicarme disponibilidad?";
  }, [servicio]);

  const whatsappUrl = useMemo(
    () => makeWhatsAppUrl(whatsappNumber, message),
    [message, whatsappNumber]
  );

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle title="Turnos por WhatsApp" subtitle="Solicitud simple y orientación (mock)." />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>
            ¿Cómo solicitar un turno?
          </Text>
          <View style={{ gap: 10 }}>
            {[
              "Escribinos por WhatsApp con tu especialidad/servicio.",
              "Indicá preferencia de días/horarios y cualquier dato relevante.",
              "El equipo del hospital confirma disponibilidad según servicio/profesional.",
            ].map((t, i) => (
              <Text key={i} style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                {`\u2022 ${t}`}
              </Text>
            ))}
          </View>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Input
            label="Especialidad / servicio (opcional)"
            placeholder="Ej: Cardiología, Análisis clínicos..."
            value={servicio}
            onChangeText={setServicio}
            autoCapitalize="none"
            accessibilityLabel="Especialidad o servicio"
          />
          <View
            style={{
              padding: theme.spacing.md,
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.primarySoft,
              borderWidth: 1,
              borderColor: theme.colors.primary,
              gap: 6,
            }}
          >
            <Text style={{ ...theme.typography.body2, color: theme.colors.primaryDark, fontWeight: "800" }}>
              Aviso
            </Text>
            <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
              La disponibilidad depende del servicio/profesional y del cupo del día (mock).
            </Text>
          </View>
        </View>

        <Button
          title="Solicitar turno por WhatsApp"
          size="lg"
          variant="primary"
          onPress={() => openUrl(whatsappUrl)}
          iconLeft={<MessageCircle size={20} color="#fff" strokeWidth={2.2} />}
        />

        <View style={{ gap: theme.spacing.sm }}>
          <Text style={{ ...theme.typography.small, color: theme.colors.textMuted }}>
            Contacto (tel. mostrado en web): {phonePrincipal}
          </Text>
          <Text style={{ ...theme.typography.small, color: theme.colors.textMuted }}>
            Para urgencias, contactá la guardia 24 hs.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

