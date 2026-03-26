import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../theme/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  accessibilityLabel?: string;
};

const sizeHeights = { sm: 42, md: 48, lg: 56 } as const;
const sizeRadii = { sm: theme.radii.md, md: theme.radii.md, lg: theme.radii.lg } as const;
const sizeFonts = { sm: 14, md: 15, lg: 16 } as const;

export function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  iconLeft,
  iconRight,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const h = sizeHeights[size];
  const r = sizeRadii[size];
  const fs = sizeFonts[size];

  if (variant === "primary") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        onPress={onPress}
        disabled={!onPress || isDisabled}
        style={({ pressed }) => [
          theme.nativeShadow.sm,
          {
            borderRadius: r,
            opacity: isDisabled ? 0.55 : pressed ? 0.94 : 1,
            transform: [{ scale: pressed && !isDisabled ? 0.985 : 1 }],
          },
          style,
        ]}
      >
        <LinearGradient
          colors={
            isDisabled
              ? [theme.colors.textSubtle, theme.colors.textMuted]
              : [...theme.colors.gradientPrimary]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            minHeight: h,
            borderRadius: r,
            paddingHorizontal: theme.spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <>
              {iconLeft ? <>{iconLeft}</> : null}
              <Text
                style={[
                  { fontWeight: "700", color: theme.colors.surface, fontSize: fs },
                  textStyle,
                ]}
              >
                {title}
              </Text>
              {iconRight ? <>{iconRight}</> : null}
            </>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      disabled={!onPress || isDisabled}
      style={({ pressed }) => [
        styles.row,
        {
          minHeight: h,
          borderRadius: r,
          paddingHorizontal: theme.spacing.lg,
        },
        styles.variants[variant],
        pressed && !isDisabled ? styles.pressed : null,
        style,
        isDisabled ? styles.disabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "danger" ? theme.colors.surface : theme.colors.primaryDark}
        />
      ) : (
        <>
          {iconLeft ? <>{iconLeft}</> : null}
          <Text
            style={[
              styles.text,
              styles.textByVariant[variant],
              { fontSize: fs },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight ? <>{iconRight}</> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  } as const,
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  } as const,
  disabled: {
    opacity: 0.55,
  } as const,
  variants: {
    secondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      ...theme.nativeShadow.sm,
    },
    ghost: {
      backgroundColor: "rgba(255,255,255,0.45)",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      borderWidth: 1,
      borderColor: theme.colors.danger,
    },
  } as Record<Exclude<ButtonVariant, "primary">, ViewStyle>,
  text: {
    fontWeight: "700",
  } as const,
  textByVariant: {
    secondary: { color: theme.colors.text },
    ghost: { color: theme.colors.text },
    danger: { color: theme.colors.surface },
  } as Record<Exclude<ButtonVariant, "primary">, TextStyle>,
};
