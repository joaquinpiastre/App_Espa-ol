import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { ArrowRight, Stethoscope, Scan, FlaskConical, Activity } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { ListItem } from "../../../components/ui/ListItem";
import { theme } from "../../../theme/theme";
import { makeWhatsAppUrl, openUrl } from "../../../utils/links";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";

const AREAS_TURNOS = [
  {
    key: "consultorios",
    titulo: "Consultorios",
    icon: Stethoscope,
    mensaje: "Hola, quiero solicitar un turno en Consultorios. ¿Podrían indicarme disponibilidad?",
  },
  {
    key: "diagnostico-imagen",
    titulo: "Diagnóstico por imagen",
    icon: Scan,
    mensaje: "Hola, quiero solicitar un turno para Diagnóstico por imagen. ¿Podrían indicarme disponibilidad?",
  },
  {
    key: "laboratorio",
    titulo: "Laboratorio",
    icon: FlaskConical,
    mensaje: "Hola, quiero solicitar un turno para Laboratorio. ¿Podrían indicarme disponibilidad?",
  },
  {
    key: "hemodinamia",
    titulo: "Hemodinamia",
    icon: Activity,
    mensaje: "Hola, quiero solicitar un turno para Hemodinamia. ¿Podrían indicarme disponibilidad?",
  },
] as const;

export function Turnos() {
  const { whatsappNumber, phonePrincipal } = useHesmContacts();

  const solicitar = useCallback(
    (mensaje: string) => {
      void openUrl(makeWhatsAppUrl(whatsappNumber, mensaje));
    },
    [whatsappNumber]
  );

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle
        title="Turnos"
        subtitle="Consultorios, diagnóstico por imagen, laboratorio o hemodinamia: elegí una opción para seguir con tu solicitud."
      />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}>
        <View style={{ gap: theme.spacing.md }}>
          {AREAS_TURNOS.map((area) => {
            const Icon = area.icon;
            return (
              <ListItem
                key={area.key}
                title={area.titulo}
                icon={<Icon size={20} color={theme.colors.primary} strokeWidth={2.2} />}
                right={<ArrowRight size={20} color={theme.colors.textMuted} strokeWidth={2.2} />}
                onPress={() => solicitar(area.mensaje)}
              />
            );
          })}
        </View>
      </Card>

      <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, paddingHorizontal: theme.spacing.xs }}>
        Teléfono institucional: {phonePrincipal}. Para urgencias, usá Emergencias en la app.
      </Text>
    </Screen>
  );
}
