import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

import { HesmRemoteBootstrap } from "../src/components/app/HesmRemoteBootstrap";

enableScreens();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HesmRemoteBootstrap />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

