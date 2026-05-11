import React from "react";
import { Pressable, RefreshControl, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Phone, MapPin, MessageCircle, ShieldAlert, Mail } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { HESM_CONFIG } from "../../../constants/appConfig";
import { makeMapsUrl, makeTelUrl, makeWhatsAppUrl, openUrl } from "../../../utils/links";
import { InfoRow } from "../../../components/ui/InfoRow";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";
import { useHesmRemoteStore } from "../../../state/useHesmRemoteStore";

export function Emergencias() {
  const router = useRouter();
  const { whatsappNumber, phonePrincipal, phoneForTel } = useHesmContacts();
  const isSyncing = useHesmRemoteStore((s) => s.isSyncing);
  const syncFromWeb = useHesmRemoteStore((s) => s.syncFromWeb);

  const telUrl = makeTelUrl(phoneForTel);
  const sanRafaelEmergenciasTelUrl = makeTelUrl(HESM_CONFIG.sanRafaelEmergenciasTel);
  const mapsUrl = makeMapsUrl(HESM_CONFIG.address);
  const whatsAppUrl = makeWhatsAppUrl(
    whatsappNumber,
    "Hola, necesito orientación por una urgencia. ¿Podrían derivarme a guardia?"
  );

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}
      refreshControl={
        <RefreshControl
          refreshing={isSyncing}
          onRefresh={() => void syncFromWeb({ force: true })}
          colors={[theme.colors.primary]}
        />
      }
    >
      <SectionTitle
        title="Emergencias"
        subtitle="Teléfonos según hesm.org; deslizá para actualizar."
      />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <View
          style={{
            padding: theme.spacing.lg,
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.primarySoft,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            gap: theme.spacing.md,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.primary,
              }}
            >
              <ShieldAlert size={22} color="#fff" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.primaryDark }}>
                {HESM_CONFIG.guardiaLabel}
              </Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                Atención y orientación para situaciones urgentes.
              </Text>
            </View>
          </View>

          <InfoRow label="Teléfono" value={phonePrincipal} icon={<Phone size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
          <InfoRow
            label="Emergencias San Rafael"
            value={HESM_CONFIG.sanRafaelEmergenciasDisplay}
            icon={<Phone size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />}
          />
          <InfoRow label="Dirección" value={HESM_CONFIG.address} icon={<MapPin size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
          <InfoRow label="Email" value={HESM_CONFIG.email} icon={<Mail size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />

          <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
            <View style={{ flex: 1 }}>
              <Button
                title="Llamar"
                variant="primary"
                size="lg"
                iconLeft={<Phone size={18} color="#fff" strokeWidth={2.2} />}
                onPress={() => openUrl(telUrl)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Abrir mapa"
                variant="secondary"
                size="lg"
                iconLeft={<MapPin size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
                onPress={() => openUrl(mapsUrl)}
              />
            </View>
          </View>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
            Recomendaciones básicas
          </Text>
          <View style={{ gap: 8 }}>
            {[
              "Mantené la calma y asegurá el acceso al lugar (puertas, documentos y datos de contacto).",
              "Si corresponde, indicá síntomas, inicio aproximado y antecedentes relevantes.",
              "No demores la atención si hay signos de gravedad. En caso de riesgo vital, buscá ayuda inmediata.",
              "Evitá medicarte salvo indicación médica.",
              "Para orientación de turnos y consultas no urgentes, podés escribir por WhatsApp.",
            ].map((txt, idx) => (
              <Text key={idx} style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                {`\u2022 ${txt}`}
              </Text>
            ))}
          </View>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
            Contactos rápidos
          </Text>
          <View style={{ flexDirection: "row", gap: theme.spacing.md, flexWrap: "wrap" }}>
            <View style={{ flex: 1, minWidth: 170 }}>
              <Button
                title="WhatsApp (orientación)"
                variant="ghost"
                size="lg"
                iconLeft={<MessageCircle size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
                onPress={() => openUrl(whatsAppUrl)}
              />
            </View>
            <View style={{ flex: 1, minWidth: 170 }}>
              <Button
                title="Turnos"
                variant="secondary"
                size="lg"
                iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
                onPress={() => router.push("/turnos")}
              />
            </View>
            <View style={{ flex: 1, minWidth: 170 }}>
              <Button
                title="Emergencias San Rafael"
                variant="secondary"
                size="lg"
                iconLeft={<Phone size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
                onPress={() => openUrl(sanRafaelEmergenciasTelUrl)}
              />
            </View>
          </View>
        </View>
      </Card>
    </Screen>
  );
}

