import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IdCard, ShieldCheck } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { InfoRow } from "../../../components/ui/InfoRow";
import { theme } from "../../../theme/theme";
import { useCurrentUser } from "../../../state/useAuthStore";
import { APP_CONFIG, HESM_CONFIG } from "../../../constants/appConfig";

export function CarnetDigital() {
  const user = useCurrentUser();

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

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle
        kicker="MI CREDENCIAL"
        title="Carnet Digital"
        subtitle="Mostrá esta pantalla como credencial de socio ante el hospital o consultorios adheridos."
      />

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <LinearGradient
          colors={[...theme.colors.gradientPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: theme.spacing.xl, gap: theme.spacing.md }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: theme.radii.md,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.35)",
              }}
            >
              <IdCard size={24} color="#fff" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: "800", fontSize: 12, letterSpacing: 1 }}>
                {HESM_CONFIG.name.toUpperCase()}
              </Text>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 20 }}>
                {user?.displayName ?? "Socio"}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: theme.spacing.md,
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.25)",
            }}
          >
            <View>
              <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "700" }}>
                N° de socio
              </Text>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 26, letterSpacing: 0.5 }}>
                {user?.nroSocioDisplay ?? user?.nroSocio ?? "—"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={18} color="#fff" strokeWidth={2.4} />
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Activo</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
          <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>Datos del socio</Text>

          <InfoRow label="Nombre y apellido" value={user?.displayName} />
          <InfoRow label="DNI" value={user?.emailOrDni} />
          <InfoRow label="N° de socio" value={user?.nroSocioDisplay ?? user?.nroSocio} />
          <InfoRow label="Credencial" value={credencial} />
          <InfoRow label="Plan" value={user?.plan} />
          <InfoRow label="Domicilio" value={user?.domicilio} />
          <InfoRow label="Cuotas adeudadas" value={cuotasAdeudadasTexto} />
        </View>
      </Card>
    </Screen>
  );
}
