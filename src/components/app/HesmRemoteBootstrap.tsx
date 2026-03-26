import React, { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { useHesmRemoteStore } from "../../state/useHesmRemoteStore";

/**
 * Sincroniza teléfonos y cartilla desde hesm.org al abrir la app y al volver a primer plano.
 */
export function HesmRemoteBootstrap() {
  useEffect(() => {
    void useHesmRemoteStore.getState().syncFromWeb();
  }, []);

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === "active") {
        void useHesmRemoteStore.getState().syncFromWeb();
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, []);

  return null;
}
