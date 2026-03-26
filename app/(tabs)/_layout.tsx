import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { useRouter } from "expo-router";
import { Home, Stethoscope, ShieldAlert, Handshake, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "../../src/state/useAuthStore";
import { theme } from "../../src/theme/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storeAny = useAuthStore as any;
    const check = () => {
      const ok =
        typeof storeAny.persist?.hasHydrated === "function"
          ? storeAny.persist.hasHydrated()
          : true;
      if (ok) setHydrated(true);
      else setTimeout(check, 80);
    };
    check();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace("/(auth)/login");
  }, [hydrated, isAuthenticated, router]);

  const tabIcon = (IconComponent: React.ComponentType<any>) => ({
    color,
    size,
    focused,
  }: {
    color: string;
    size: number;
    focused: boolean;
  }) => (
    <IconComponent
      color={focused ? theme.colors.primary : theme.colors.textMuted}
      size={focused ? size + 1 : size}
      strokeWidth={focused ? 2.4 : 2}
    />
  );

  const tabBarBottomPad = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: tabBarBottomPad,
          minHeight: 52 + tabBarBottomPad,
          ...theme.nativeShadow.tabBar,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Inicio",
          tabBarIcon: tabIcon(Home),
        }}
      />
      <Tabs.Screen
        name="cartilla"
        options={{
          title: "Cartilla",
          tabBarIcon: tabIcon(Stethoscope),
        }}
      />
      <Tabs.Screen
        name="emergencias"
        options={{
          title: "Emergencias",
          tabBarIcon: tabIcon(ShieldAlert),
        }}
      />
      <Tabs.Screen
        name="prestadores"
        options={{
          title: "Prestadores",
          tabBarIcon: tabIcon(Handshake),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: tabIcon(User),
        }}
      />
    </Tabs>
  );
}
