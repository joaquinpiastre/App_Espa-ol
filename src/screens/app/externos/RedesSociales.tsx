import React from "react";
import { Text, View } from "react-native";
import { Instagram, Facebook, Globe } from "lucide-react-native";
import { useRouter } from "expo-router";

import { Screen } from "../../../components/app/Screen";
import { Card } from "../../../components/ui/Card";
import { SectionTitle } from "../../../components/ui/SectionTitle";
import { theme } from "../../../theme/theme";
import { socialLinksMock } from "../../../mock-data/socialLinks";
import { SocialButton } from "../../../components/ui/SocialButton";
import { openUrl } from "../../../utils/links";

export function RedesSociales() {
  const router = useRouter();

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: theme.spacing.xl, gap: theme.spacing.xl }}>
      <SectionTitle title="Redes sociales" subtitle="Información institucional y novedades." />

      <Card style={{ padding: theme.spacing.xl, gap: theme.spacing.lg }}>
        <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
          Accedé a nuestras redes y al sitio oficial para novedades y comunicados institucionales.
        </Text>

        <View style={{ gap: theme.spacing.md }}>
          {socialLinksMock.map((s) => {
            const icon =
              s.id === "social-instagram" ? (
                <Instagram size={18} color={theme.colors.primary} strokeWidth={2.2} />
              ) : s.id === "social-facebook" ? (
                <Facebook size={18} color={theme.colors.primary} strokeWidth={2.2} />
              ) : (
                <Globe size={18} color={theme.colors.primary} strokeWidth={2.2} />
              );

            return (
              <SocialButton
                key={s.id}
                label={s.label}
                icon={icon}
                onPress={() => openUrl(s.url)}
              />
            );
          })}
        </View>

        <Text style={{ ...theme.typography.small, color: theme.colors.textMuted }}>
          Los enlaces pueden necesitar actualización en producción.
        </Text>
      </Card>
    </Screen>
  );
}

