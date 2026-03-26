import React from "react";
import { Pressable, Text, View } from "react-native";

import { theme } from "../../theme/theme";

export function QuickAccessButton({
  label,
  icon,
  onPress,
  subtitle,
  badge,
}: {
  label: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
          ...theme.nativeShadow.sm,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.md }}>
        {icon ? (
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: theme.radii.sm + 2,
              backgroundColor: theme.colors.primarySoft,
              borderWidth: 1,
              borderColor: theme.colors.primaryBorderMuted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </View>
        ) : null}
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>{label}</Text>
          {subtitle ? (
            <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {badge ? (
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: theme.radii.pill,
              backgroundColor: theme.colors.primarySoft,
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
          >
            <Text style={{ color: theme.colors.primaryDark, fontWeight: "800", fontSize: 11 }}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
