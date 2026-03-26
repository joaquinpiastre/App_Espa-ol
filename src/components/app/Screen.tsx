import React from "react";
import { ScrollView, View, ViewStyle, StyleSheet, type RefreshControlProps } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "../../theme/theme";

const BOTTOM_SCROLL_EXTRA = theme.spacing.xl;

export function Screen({
  children,
  preset = "scroll",
  contentContainerStyle,
  style,
  refreshControl,
}: {
  children: React.ReactNode;
  preset?: "scroll" | "view";
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}) {
  const insets = useSafeAreaInsets();
  const scrollBottomPad = insets.bottom + BOTTOM_SCROLL_EXTRA;

  return (
    <LinearGradient
      colors={[...theme.colors.bgGradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.12, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[styles.safe, style]}
      >
        <StatusBar style="dark" />
        {preset === "scroll" ? (
          <ScrollView
            refreshControl={refreshControl}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              { flexGrow: 1 },
              contentContainerStyle,
              { paddingBottom: scrollBottomPad },
            ]}
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={[
              { flex: 1, paddingBottom: insets.bottom + theme.spacing.md },
              contentContainerStyle,
            ]}
          >
            {children}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
