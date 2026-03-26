import React, { useMemo, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { LogOut, Mail, Phone, ShieldCheck } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { useCurrentUser, useAuthStore } from "../../../state/useAuthStore";
import { HESM_CONFIG, APP_CONFIG } from "../../../constants/appConfig";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";
import { InfoRow } from "../../../components/ui/InfoRow";
import { makeMapsUrl, makeTelUrl, openUrl } from "../../../utils/links";

export function Perfil() {
  const router = useRouter();
  const user = useCurrentUser();
  const signOut = useAuthStore((s) => s.signOut);
  const { phonePrincipal, phoneForTel } = useHesmContacts();

  const [notifications, setNotifications] = useState(true);
  const appVersion = useMemo(() => {
    // En managed es común que esté en expoConfig.version
    return Constants.expoConfig?.version ?? "1.0.0";
  }, []);

  const credencial = useMemo(() => {
    if (user?.nroSocioDisplay) return `Socio ${user.nroSocioDisplay}`;
    if (user?.nroSocio) return `Socio N° ${user.nroSocio}`;
    return APP_CONFIG.appStoreOrCredentialPrefix;
  }, [user]);

  const cuotasAdeudadasTexto = useMemo(() => {
    const v = user?.ctasDebe?.trim();
    if (v == null || v === "") return "—";
    if (/^\d+$/.test(v)) {
      const n = parseInt(v, 10);
      if (n === 0) return "0 (al día)";
      return `${n} cuota${n === 1 ? "" : "s"} adeudada${n === 1 ? "" : "s"}`;
    }
    return v;
  }, [user?.ctasDebe]);

  async function onLogout() {
    Alert.alert("Cerrar sesión", "¿Querés salir de la app en este dispositivo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle
        kicker="MI CUENTA"
        title="Perfil"
        subtitle="Datos de socio y preferencias del dispositivo."
      />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <View
          style={{
            padding: theme.spacing.lg,
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.primarySoft,
            borderWidth: 1,
            borderColor: theme.colors.primaryBorderMuted,
            gap: theme.spacing.sm,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: theme.radii.md,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={22} color="#fff" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.primaryDark }}>
                {user?.displayName ?? "Usuario"}
              </Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                DNI {user?.emailOrDni ?? "—"}
              </Text>
            </View>
          </View>

          <Text style={{ ...theme.typography.small, color: theme.colors.primaryDark, fontWeight: "900" }}>
            {credencial}
          </Text>

          {user?.plan ? (
            <InfoRow label="Plan" value={user.plan} />
          ) : null}

          {user?.domicilio ? (
            <InfoRow label="Domicilio" value={user.domicilio} />
          ) : null}

          <InfoRow label="Cuotas adeudadas (CTAS_DEBE)" value={cuotasAdeudadasTexto} />
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
            Ajustes básicos
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: theme.spacing.md,
              padding: theme.spacing.md,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ ...theme.typography.body, color: theme.colors.text, fontWeight: "900" }}>
                Notificaciones
              </Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                Activación visual (mock).
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primarySoft }}
              thumbColor={notifications ? theme.colors.primary : theme.colors.surface}
            />
          </View>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
            Información institucional
          </Text>
          <InfoRow label="Teléfono" value={phonePrincipal} icon={<Phone size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
          <InfoRow label="Email" value={HESM_CONFIG.email} icon={<Mail size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />} />
          <InfoRow label="Dirección" value={HESM_CONFIG.address} />
          <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, marginTop: theme.spacing.sm }}>
            Versión de la app: {appVersion}
          </Text>
        </View>

        <Button
          title="Cerrar sesión"
          variant="danger"
          size="lg"
          onPress={onLogout}
          iconLeft={<LogOut size={18} color="#fff" strokeWidth={2.2} />}
        />

        <View style={{ flexDirection: "row", gap: theme.spacing.md, flexWrap: "wrap" }}>
          <View style={{ flex: 1, minWidth: 160 }}>
            <Button
              title="Ubicación"
              variant="secondary"
              size="md"
              onPress={() => openUrl(makeMapsUrl(HESM_CONFIG.address))}
            />
          </View>
          <View style={{ flex: 1, minWidth: 160 }}>
            <Button
              title="Llamar"
              variant="secondary"
              size="md"
              onPress={() => openUrl(makeTelUrl(phoneForTel))}
            />
          </View>
        </View>
      </Card>
    </Screen>
  );
}

