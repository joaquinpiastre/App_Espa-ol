import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HESM_CONFIG, APP_CONFIG, HESM_REMOTE_ASSETS } from "../../constants/appConfig";
import { useAuthStore } from "../../state/useAuthStore";
import { loginInvitado, loginSocios } from "../../services/authService";
import { normalizeDniInput, normalizeSocioInput } from "../../data/sociosLookup";
import { theme } from "../../theme/theme";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";

const HERO_BASE_H = 228;

const loginSchema = z.object({
  dni: z
    .string()
    .min(1, "Ingresá tu DNI.")
    .refine((v) => normalizeDniInput(v) != null, "Ingresá un DNI válido (6 a 10 dígitos)."),
  numeroSocio: z
    .string()
    .min(1, "Ingresá tu número de socio.")
    .refine((v) => normalizeSocioInput(v) != null, "Ingresá un número de socio válido."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const heroHeight = HERO_BASE_H + insets.top;

  const defaultValues = useMemo<LoginFormValues>(
    () => ({
      dni: "",
      numeroSocio: "",
      rememberMe: true,
    }),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    setLoading(true);
    try {
      const { user } = await loginSocios({
        dni: values.dni,
        numeroSocio: values.numeroSocio,
      });

      await signIn(user, values.rememberMe);
      router.replace("/(tabs)/inicio");
    } catch (e: any) {
      setFormError(e?.message ?? "No se pudo iniciar sesión. Intentá nuevamente.");
      Alert.alert("Ingreso no disponible", e?.message ?? "Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function onGuestPress() {
    setFormError(null);
    setLoadingGuest(true);
    try {
      const { user } = await loginInvitado();
      await signIn(user, false);
      router.replace("/(tabs)/inicio");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo continuar como invitado.";
      setFormError(msg);
    } finally {
      setLoadingGuest(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + theme.spacing.xxl },
        ]}
      >
        <View style={[styles.hero, { height: heroHeight }]}>
          <Image
            accessibilityLabel="Fachada del Hospital Español del Sur Mendocino"
            source={{ uri: HESM_REMOTE_ASSETS.buildingFront }}
            style={[StyleSheet.absoluteFill, { height: heroHeight }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,102,110,0.55)", "rgba(0,40,55,0.82)"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <LinearGradient
            colors={["rgba(230,250,250,0)", "rgba(230,250,250,1)"]}
            locations={[0.45, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View
            style={[
              styles.heroTextWrap,
              {
                paddingTop: insets.top + theme.spacing.md,
                paddingLeft: Math.max(insets.left, theme.spacing.xl),
                paddingRight: Math.max(insets.right, theme.spacing.xl),
              },
            ]}
          >
            <Text style={styles.heroKicker}>Hospital Español</Text>
            <Text style={styles.heroTitle} numberOfLines={2}>
              Sur Mendocino
            </Text>
            <Text style={styles.heroSubtitle} numberOfLines={2}>
              Comprometidos con la salud y el cuidado de la comunidad
            </Text>
          </View>
        </View>

        <View style={styles.logoOverlap}>
          <View style={styles.logoCard}>
            <Image
              accessibilityLabel="Logo Hospital Español del Sur Mendocino"
              source={{ uri: HESM_REMOTE_ASSETS.logo }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View
          style={[
            styles.formSection,
            {
              paddingLeft: Math.max(insets.left, theme.spacing.xl),
              paddingRight: Math.max(insets.right, theme.spacing.xl),
            },
          ]}
        >
          <Card style={styles.formCard}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.overline, color: theme.colors.primaryDark }}>
                SOCIOS E INVITADOS
              </Text>
              <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>Iniciar sesión</Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
                Socios: DNI y número de socio. Sin credencial: Continuar como invitado más abajo.
              </Text>
            </View>

            <Controller
              control={control}
              name="dni"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="DNI"
                  placeholder="Ej: 8030193 o 8.030.193"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  error={errors.dni?.message}
                  accessibilityLabel="DNI"
                  autoComplete="off"
                  importantForAutofill="no"
                  textContentType="none"
                />
              )}
            />

            <Controller
              control={control}
              name="numeroSocio"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Número de socio"
                  placeholder="Ej: 16361 o 16.361"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  keyboardType="default"
                  error={errors.numeroSocio?.message}
                  accessibilityLabel="Número de socio"
                  autoComplete="off"
                  importantForAutofill="no"
                  textContentType="none"
                />
              )}
            />

            <Controller
              control={control}
              name="rememberMe"
              render={({ field: { value, onChange } }) => (
                <Checkbox label="Recordarme en este dispositivo" checked={!!value} onChange={onChange} />
              )}
            />

            {formError ? (
              <View
                style={{
                  padding: theme.spacing.md,
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: theme.colors.danger,
                  backgroundColor: theme.colors.dangerSoft,
                }}
              >
                <Text style={{ color: theme.colors.danger, fontWeight: "800", fontSize: 14 }}>
                  {formError}
                </Text>
              </View>
            ) : null}

            <Button
              title={loading ? "Ingresando..." : "Ingresar como socio"}
              loading={loading}
              disabled={loading || loadingGuest}
              onPress={handleSubmit(onSubmit)}
              size="lg"
            />

            <View style={{ gap: theme.spacing.sm }}>
              <Button
                title={loadingGuest ? "Abriendo..." : APP_CONFIG.guestLoginButton}
                variant="secondary"
                loading={loadingGuest}
                disabled={loading || loadingGuest}
                onPress={onGuestPress}
                size="lg"
              />
              <Text style={{ ...theme.typography.small, color: theme.colors.textMuted, textAlign: "center" }}>
                {APP_CONFIG.guestLoginSubtitle}
              </Text>
            </View>

            <View style={{ gap: theme.spacing.md, alignItems: "center" }}>
              <Pressable
                onPress={() => router.push("/(auth)/forgot-password")}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              >
                <Text style={{ color: theme.colors.brandNavy, fontWeight: "800", fontSize: 14, textAlign: "center" }}>
                  {APP_CONFIG.socioRecoveryLink}
                </Text>
              </Pressable>
              <Text style={{ color: theme.colors.textMuted, fontWeight: "600", fontSize: 12, textAlign: "center" }}>
                {HESM_CONFIG.sociosEmail}
              </Text>
            </View>

          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    width: "100%",
    position: "relative",
  },
  heroTextWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: theme.spacing.xl + 8,
  },
  heroKicker: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  heroSubtitle: {
    marginTop: theme.spacing.sm,
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    maxWidth: 320,
  },
  logoOverlap: {
    alignItems: "center",
    zIndex: 2,
    marginTop: -52,
  },
  logoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.lg + 2,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.nativeShadow.lifted,
  },
  logoImage: {
    width: 72,
    height: 88,
  },
  formSection: {
    marginTop: theme.spacing.lg,
  },
  formCard: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
});
