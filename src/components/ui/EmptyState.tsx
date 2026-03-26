import React from "react";
import { Pressable, Text, View } from "react-native";
import { theme } from "../../theme/theme";

export function EmptyState({
  title,
  description,
  actionLabel,
  onActionPress,
  icon,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        padding: theme.spacing.xl,
        gap: theme.spacing.md,
      }}
    >
      {icon ? <View>{icon}</View> : null}
      <Text style={{ ...theme.typography.h3, textAlign: "center", color: theme.colors.text }}>
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            ...theme.typography.body2,
            color: theme.colors.textMuted,
            textAlign: "center",
          }}
        >
          {description}
        </Text>
      ) : null}
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => ({
            paddingHorizontal: theme.spacing.xl,
            height: 46,
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors.primarySoft,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: "800" }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

