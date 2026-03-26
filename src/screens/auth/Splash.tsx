import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../state/useAuthStore";
import { theme } from "../../theme/theme";
import { HESM_CONFIG } from "../../constants/appConfig";

export function Splash() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const [navigating, setNavigating] = useState(false);

  const brandLine = useMemo(
    () => (HESM_CONFIG.name.includes("Hospital") ? "Acceso institucional" : "Acceso"),
    []
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 720, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 720, useNativeDriver: true }),
    ]).start();

    const tryNavigate = () => {
      if (navigating) return;
      const storeAny = useAuthStore as any;
      const hydrated =
        typeof storeAny.persist?.hasHydrated === "function"
          ? storeAny.persist.hasHydrated()
          : true;

      if (!hydrated) {
        setTimeout(tryNavigate, 80);
        return;
      }

      setNavigating(true);
      const authed = useAuthStore.getState().isAuthenticated;
      router.replace(authed ? "/(tabs)/inicio" : "/(auth)/login");
    };

    tryNavigate();
  }, [navigating, opacity, translateY, scale, router]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right", "bottom"]}>
      <LinearGradient
        colors={[...theme.colors.bgGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={styles.fill}
      >
        <View style={styles.center}>
          <Animated.View
            style={{
              width: "100%",
              alignItems: "center",
              paddingHorizontal: theme.spacing.xl,
              transform: [{ translateY }, { scale }],
              opacity,
              gap: theme.spacing.xl,
              paddingTop: theme.spacing.lg,
            }}
          >
            <LinearGradient
              colors={[...theme.colors.gradientPrimary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.45)",
                ...theme.nativeShadow.lifted,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 32 }}>H</Text>
            </LinearGradient>

            <View style={{ alignItems: "center", gap: theme.spacing.sm }}>
              <Text
                style={{
                  ...theme.typography.overline,
                  color: theme.colors.primaryDark,
                  textAlign: "center",
                }}
              >
                HESM
              </Text>
              <Text style={{ ...theme.typography.h1, textAlign: "center", color: theme.colors.text }}>
                {HESM_CONFIG.name}
              </Text>
              <Text style={{ ...theme.typography.body2, color: theme.colors.textMuted, textAlign: "center" }}>
                {brandLine}
              </Text>
            </View>

            <Text style={{ ...theme.typography.body2, color: theme.colors.textSubtle }}>
              {navigating ? "Abriendo…" : "Cargando…"}
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  fill: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
