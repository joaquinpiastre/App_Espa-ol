import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuthStore, useCurrentUser } from "../../state/useAuthStore";
import { theme } from "../../theme/theme";

type Props = {
  children: React.ReactNode;
};

/**
 * Pantallas exclusivas de socios: emergencias/guardia, cartilla, farmacias, turnos con credencial, etc.
 */
export function RequireSocio({ children }: Props) {
  const router = useRouter();
  const user = useCurrentUser();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storeAny = useAuthStore as unknown as {
      persist?: { hasHydrated?: () => boolean };
    };
    const check = () => {
      const ok =
        typeof storeAny.persist?.hasHydrated === "function"
          ? storeAny.persist?.hasHydrated?.()
          : true;
      if (ok) setHydrated(true);
      else setTimeout(check, 80);
    };
    check();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) {
      router.replace("/(auth)/login");
      return;
    }
    if (user.role === "invitado") {
      router.replace("/(tabs)/inicio");
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated || !isAuthenticated || !user || user.role === "invitado") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.bg }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
