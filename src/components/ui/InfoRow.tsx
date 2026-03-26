import React from "react";
import { Text, View } from "react-native";

import { theme } from "../../theme/theme";

export function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      {icon ? <View>{icon}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ ...theme.typography.small, color: theme.colors.textMuted }}>
          {label}
        </Text>
        <Text style={{ ...theme.typography.body2, color: theme.colors.text }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

