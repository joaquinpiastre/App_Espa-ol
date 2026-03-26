import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { theme } from "../../theme/theme";

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  accessibilityLabel,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  accessibilityLabel?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        theme.nativeShadow.sm,
        {
          borderRadius: theme.radii.lg,
          borderWidth: focused ? 1.5 : 1,
          borderColor: focused ? theme.colors.primary : theme.colors.border,
          backgroundColor: focused ? theme.colors.surface : theme.colors.surfaceMuted,
          paddingHorizontal: theme.spacing.md + 2,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
        },
      ]}
    >
      {leftIcon ? <View>{leftIcon}</View> : null}
      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSubtle}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: "700",
          color: theme.colors.text,
          padding: 0,
        }}
      />
    </View>
  );
}
