import React from "react";
import { View, ViewStyle } from "react-native";

import { theme } from "../../theme/theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
};

export function Card({ children, style, elevated = true }: Props) {
  return (
    <View
      style={[
        styles.card,
        elevated ? theme.nativeShadow.card : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as const,
};
