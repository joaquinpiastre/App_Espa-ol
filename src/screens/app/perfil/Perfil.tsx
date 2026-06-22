import React, { useMemo, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { CreditCard, LogIn, LogOut, Mail, MessageCircle, Phone, ShieldCheck, Trash2, UserRound } from "lucide-react-native";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { useCurrentUser, useAuthStore } from "../../../state/useAuthStore";
import { HESM_CONFIG, APP_CONFIG, HESM_LEGAL_URLS } from "../../../constants/appConfig";
import { useHesmContacts } from "../../../state/useHesmRemoteStore";
import { InfoRow } from "../../../components/ui/InfoRow";
import { makeMapsUrl, makeTelUrl, makeWhatsAppUrl, openUrl } from "../../../utils/links";

export function Perfil() {
  const router = useRouter();
  const user = useCurrentUser();
  const signOut = useAuthStore((s) => s.signOut);
  const { phonePrincipal, phoneForTel, whatsappNumber } = useHesmContacts();

  const [notifications, setNotifications] = useState(true);
  const appVersion = useMemo(() => {
    // En managed es común que esté en expoConfig.version
    return Constants.expoConfig?.version ?? "1.0.0";
  }, []);

  const isInvitado = user?.role === "invitado";

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

  /** Referencia visible para que el socio lo escriba a mano en Mercado Pago cuando se lo pidan */
  const numeroSocioParaPago = useMemo(() => {
    return user?.nroSocioDisplay ?? user?.nroSocio ?? null;
  }, [user?.nroSocio, user?.nroSocioDisplay]);

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

  async function goToSocioLogin() {
    await signOut();
    router.replace("/(auth)/login");
  }

  async function onHacermeSocioWhatsApp() {
    const opened = await openUrl(makeWhatsAppUrl(whatsappNumber, APP_CONFIG.guestBecomeMemberWhatsAppMessage));
    if (!opened) {
      Alert.alert("WhatsApp", "No se pudo abrir WhatsApp. Verificá que esté instalado o probá más tarde.");
    }
  }

  function onEliminarCuenta() {
    Alert.alert(
      "Eliminar mi cuenta",
      "Vas a ser redirigido a un formulario web para solicitar la eliminación de tu cuenta. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Continuar",
          onPress: async () => {
            const opened = await openUrl(HESM_LEGAL_URLS.eliminarCuenta);
            if (!opened) {
              Alert.alert("No se pudo abrir el enlace", "Verificá tu conexión o probá desde el navegador.");
            }
          },
        },
      ]
    );
  }

  async function onPagarCuota() {
    const url = HESM_CONFIG.mercadoPagoCuotaUrl?.trim() ?? "";
    if (!url) {
      Alert.alert(
        "Enlace de pago",
        "Pedile al equipo que cargue la URL de Mercado Pago en src/constants/appConfig.ts (campo mercadoPagoCuotaUrl)."
      );
      return;
    }
    const opened = await openUrl(url);
    if (!opened) {
      Alert.alert("No se pudo abrir el enlace", "Verificá tu conexión o probá desde el navegador.");
    }
  }

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle
        kicker="MI CUENTA"
        title="Perfil"
        subtitle={
          isInvitado
            ? "Modo invitado: sin credencial de socio. Datos personales solo al iniciar sesión como socio."
            : "Datos de socio y preferencias del dispositivo."
        }
      />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        {isInvitado ? (
          <View
            style={{
              padding: theme.spacing.lg,
              borderRadius: theme.radii.lg,
              backgroundColor: theme.colors.primarySoft,
              borderWidth: 1,
              borderColor: theme.colors.primaryBorderMuted,
              gap: theme.spacing.md,
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
                <UserRound size={22} color="#fff" strokeWidth={2.2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...theme.typography.h2, color: theme.colors.primaryDark }}>Invitado</Text>
                <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                  Información institucional y contactos del hospital. Cartilla médica, farmacias, novedades y emergencias/guardia están disponibles al iniciar sesión como socio.
                </Text>
              </View>
            </View>
            <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
              Los turnos con credencial de socio y tu ficha personal en esta pantalla aparecen cuando ingresás con DNI y
              número de socio.
            </Text>

            <View style={{ gap: theme.spacing.sm }}>
              <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>Hacerme socio</Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                Escribinos por WhatsApp al hospital para consultar cómo asociarte, requisitos y documentación.
              </Text>
              <Button
                title="Consultar por WhatsApp para hacerme socio"
                variant="secondary"
                size="lg"
                onPress={onHacermeSocioWhatsApp}
                iconLeft={<MessageCircle size={18} color={theme.colors.primaryDark} strokeWidth={2.2} />}
              />
            </View>

            <Button
              title="Ya soy socio — iniciar sesión"
              variant="primary"
              size="lg"
              onPress={goToSocioLogin}
              iconLeft={<LogIn size={18} color="#fff" strokeWidth={2.2} />}
            />
          </View>
        ) : (
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

            {user?.plan ? <InfoRow label="Plan" value={user.plan} /> : null}

            {user?.domicilio ? <InfoRow label="Domicilio" value={user.domicilio} /> : null}

            <InfoRow label="Cuotas adeudadas (CTAS_DEBE)" value={cuotasAdeudadasTexto} />

            <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.md }}>
              <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>Pagar cuotas</Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                El mismo enlace lleva a todos los socios al flujo de Mercado Pago del hospital; cada persona completa ahí los
                datos que pida la página (por ejemplo número de socio, sesión en MP o datos del titular). Lo que ves abajo son
                referencias desde tu cuenta en la app para copiar o tener a mano.
              </Text>

              <View
                style={{
                  padding: theme.spacing.lg,
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: theme.colors.primaryBorderMuted,
                  backgroundColor: theme.colors.surface,
                  gap: theme.spacing.xs,
                }}
              >
                <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, fontWeight: "800" }}>
                  Referencias de tu cuenta (para lo que pida Mercado Pago)
                </Text>
                <InfoRow label="N° de socio" value={numeroSocioParaPago ?? "—"} />
                <InfoRow label="DNI" value={user?.emailOrDni ? user.emailOrDni : "—"} />
                <Text style={{ ...theme.typography.small, color: theme.colors.textMuted }}>
                  Mercado Pago puede pedirte distintos pasos según la configuración; usá estos datos cuando corresponda.
                </Text>
              </View>

              <Button
                title="Ir a pagar con Mercado Pago"
                variant="primary"
                size="lg"
                onPress={onPagarCuota}
                iconLeft={<CreditCard size={18} color="#fff" strokeWidth={2.2} />}
              />
            </View>
          </View>
        )}

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

        <View style={{ gap: theme.spacing.sm }}>
          <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>Legal</Text>
          <View style={{ flexDirection: "row", gap: theme.spacing.md, flexWrap: "wrap" }}>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Button
                title="Política de privacidad"
                variant="secondary"
                size="md"
                onPress={() => openUrl(HESM_LEGAL_URLS.privacidad)}
              />
            </View>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Button
                title="Términos y condiciones"
                variant="secondary"
                size="md"
                onPress={() => openUrl(HESM_LEGAL_URLS.terminos)}
              />
            </View>
          </View>
          <Button
            title="Eliminar mi cuenta"
            variant="secondary"
            size="md"
            onPress={onEliminarCuenta}
            iconLeft={<Trash2 size={16} color={theme.colors.primaryDark} strokeWidth={2.2} />}
          />
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

