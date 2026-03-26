import React from "react";
import { Pressable, Text, View } from "react-native";

import { theme } from "../../theme/theme";

export function SocialButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        theme.nativeShadow.sm,
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      {icon ? <View>{icon}</View> : null}
      <Text style={{ ...theme.typography.body, color: theme.colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

