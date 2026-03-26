import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

import { theme } from "../../theme/theme";

const baseWrap = [
  {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  theme.nativeShadow.sm,
] as const;

export function ListItem({
  title,
  subtitle,
  icon,
  onPress,
  right,
  style,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  right?: React.ReactNode;
  style?: ViewStyle;
}) {
  const inner = (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
      {icon ? (
        <View
          style={{
            marginTop: 2,
            width: 40,
            height: 40,
            borderRadius: theme.radii.sm,
            backgroundColor: theme.colors.surfaceMuted,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{title}</Text>
        {subtitle ? (
          <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          ...baseWrap,
          style,
          pressed ? { opacity: 0.9, transform: [{ scale: 0.995 }] } : null,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={[...baseWrap, style]}>{inner}</View>;
}
