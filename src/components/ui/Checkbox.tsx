import React from "react";
import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";

import { theme } from "../../theme/theme";

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          borderWidth: checked ? 0 : 1.5,
          borderColor: theme.colors.borderStrong,
          backgroundColor: checked ? theme.colors.primary : theme.colors.surface,
          alignItems: "center",
          justifyContent: "center",
          ...theme.nativeShadow.sm,
        }}
      >
        {checked ? <Check size={15} color="#fff" strokeWidth={3} /> : null}
      </View>
      <Text style={{ ...theme.typography.body2, color: theme.colors.text, flex: 1 }}>{label}</Text>
    </Pressable>
  );
}
