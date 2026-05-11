import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Screen } from "../../components/app/Screen";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { theme } from "../../theme/theme";
import { findSocioByDni, normalizeDniInput } from "../../data/sociosLookup";

type FormValues = { dni: string };

type LookupState =
  | { kind: "empty" }
  | { kind: "typing" }
  | { kind: "notFound" }
  | { kind: "found"; nroSocioDisplay: string; nombre: string };

export function ForgotPassword() {
  const router = useRouter();
  const [lookup, setLookup] = useState<LookupState>({ kind: "empty" });

  const { control } = useForm<FormValues>({
    defaultValues: { dni: "" },
  });

  const dniValue = useWatch({ control, name: "dni" });

  useEffect(() => {
    const raw = dniValue?.trim() ?? "";
    if (!raw) {
      setLookup({ kind: "empty" });
      return;
    }

    const t = setTimeout(() => {
      const norm = normalizeDniInput(raw);
      if (!norm) {
        setLookup({ kind: "typing" });
        return;
      }
      const socio = findSocioByDni(raw);
      if (socio) {
        setLookup({
          kind: "found",
          nroSocioDisplay: socio.nroSocioDisplay,
          nombre: socio.nombre,
        });
      } else {
        setLookup({ kind: "notFound" });
      }
    }, 350);

    return () => clearTimeout(t);
  }, [dniValue]);

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.lg }}>
        <SectionTitle
          kicker="AYUDA"
          title="Recuperar acceso"
          subtitle="Ingresá tu DNI: si figura en el padrón de la app, te mostraremos tu número de socio para poder iniciar sesión."
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
              />
            )}
          />

          {lookup.kind === "found" ? (
            <View
              style={{
                padding: theme.spacing.lg,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: theme.colors.success,
                backgroundColor: theme.colors.successSoft,
                gap: theme.spacing.sm,
              }}
            >
              <Text style={{ color: theme.colors.primaryDark, fontSize: 13, opacity: 0.85 }}>
                Número de socio asociado a tu DNI
              </Text>
              <Text
                selectable
                style={{
                  color: theme.colors.primaryDark,
                  fontWeight: "900",
                  fontSize: 28,
                  letterSpacing: 0.5,
                }}
              >
                {lookup.nroSocioDisplay}
              </Text>
              <Text style={{ color: theme.colors.primaryDark, fontSize: 14 }}>
                {lookup.nombre}
              </Text>
              <Text style={{ color: theme.colors.primaryDark, fontSize: 12, opacity: 0.8 }}>
                Usá este número junto con tu DNI en la pantalla de inicio de sesión.
              </Text>
            </View>
          ) : null}

          {lookup.kind === "notFound" ? (
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
                No encontramos un socio con ese DNI en los datos actuales de la app. Verificá el número o
                contactá a administración del hospital.
              </Text>
            </View>
          ) : null}

          {lookup.kind === "typing" && (dniValue?.trim().length ?? 0) > 0 ? (
            <Text style={{ color: theme.colors.primaryDark, fontSize: 13, opacity: 0.75 }}>
              Completá un DNI válido (6 a 10 dígitos) para consultar.
            </Text>
          ) : null}

          <Button title="Volver al inicio de sesión" onPress={() => router.replace("/(auth)/login")} size="lg" variant="secondary" />
        </Card>
      </View>
    </Screen>
  );
}
