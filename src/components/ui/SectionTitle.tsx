import React from "react";
import { Text, View } from "react-native";

import { theme } from "../../theme/theme";

export function SectionTitle({
  title,
  subtitle,
  kicker,
}: {
  title: string;
  subtitle?: string;
  /** Etiqueta pequeña encima del título (ej. INICIO) */
  kicker?: string;
}) {
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
        <View
          style={{
            width: 4,
            height: 28,
            borderRadius: 2,
            backgroundColor: theme.colors.primary,
            opacity: 0.9,
          }}
        />
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          {kicker ? (
            <Text
              style={{
                ...theme.typography.overline,
                color: theme.colors.primaryDark,
              }}
            >
              {kicker}
            </Text>
          ) : null}
          <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>{title}</Text>
          {subtitle ? (
            <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
