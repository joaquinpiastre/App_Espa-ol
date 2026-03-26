import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "../../components/app/Screen";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { theme } from "../../theme/theme";
import { requestRecoveryMock } from "../../services/authService";
import { normalizeDniInput } from "../../data/sociosLookup";

const schema = z.object({
  dni: z
    .string()
    .min(1, "Ingresá tu DNI.")
    .refine((v) => normalizeDniInput(v) != null, "Ingresá un DNI válido."),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dni: "" },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await requestRecoveryMock({ emailOrDni: values.dni });
      setSuccess(
        "Si tu DNI está registrado, en producción recibirías instrucciones por el canal oficial del hospital (simulación)."
      );
      Alert.alert("Listo", "Solicitud registrada (simulación). Contactá al hospital para recuperar tu número de socio.");
    } catch (e: any) {
      const message = e?.message ?? "No se pudo iniciar la recuperación. Intentá nuevamente.";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.lg }}>
        <SectionTitle
          kicker="AYUDA"
          title="Recuperar acceso"
          subtitle="Para recuperar tu número de socio, contactá a administración o usá este formulario de prueba."
        />

        <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
          <Controller
            control={control}
            name="dni"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="DNI"
                placeholder="Ej: 8030193"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={formState.errors.dni?.message}
              />
            )}
          />

          {success ? (
            <View
              style={{
                padding: theme.spacing.md,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: theme.colors.success,
                backgroundColor: theme.colors.successSoft,
              }}
            >
              <Text style={{ color: theme.colors.primaryDark, fontWeight: "800", fontSize: 14 }}>
                {success}
              </Text>
            </View>
          ) : null}

          {error ? (
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
                {error}
              </Text>
            </View>
          ) : null}

          <Button
            title={loading ? "Enviando..." : "Enviar solicitud"}
            loading={loading}
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
            size="lg"
          />

          <Pressable onPress={() => router.replace("/(auth)/login")} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
            <Text style={{ color: theme.colors.primaryDark, fontWeight: "800" }}>Volver al inicio de sesión</Text>
          </Pressable>
        </Card>
      </View>
    </Screen>
  );
}
