import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { HESM_WHATSAPP_NUMBER, HESM_CONFIG } from "../constants/appConfig";
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { HesmParsedRecord } from "../services/hesmCatalogParser";
import { syncHesmFromPublicWeb } from "../services/hesmRemoteSync";

const STALE_MS = 6 * 60 * 60 * 1000;

type HesmRemoteState = {
  whatsappDigits: string | null;
  phoneDisplay: string | null;
  telHrefRaw: string | null;
  professionals: HesmParsedRecord[] | null;
  lastSyncAt: number | null;
  lastSyncError: string | null;
  isSyncing: boolean;
  /** Fuerza descarga aunque el caché no haya vencido */
  syncFromWeb: (opts?: { force?: boolean }) => Promise<void>;
};

export const useHesmRemoteStore = create<HesmRemoteState>()(
  persist(
    (set, get) => ({
      whatsappDigits: null,
      phoneDisplay: null,
      telHrefRaw: null,
      professionals: null,
      lastSyncAt: null,
      lastSyncError: null,
      isSyncing: false,

      syncFromWeb: async (opts) => {
        const { force } = opts ?? {};
        const { lastSyncAt, isSyncing } = get();
        if (isSyncing) return;
        if (!force && lastSyncAt != null && Date.now() - lastSyncAt < STALE_MS) return;

        set({ isSyncing: true, lastSyncError: null });
        try {
          const r = await syncHesmFromPublicWeb();
          set({
            whatsappDigits: r.whatsappDigits,
            phoneDisplay: r.phoneDisplay,
            telHrefRaw: r.telHrefRaw,
            professionals: r.professionals,
            lastSyncAt: r.fetchedAt,
            lastSyncError: null,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Error al sincronizar con hesm.org";
          set({ lastSyncError: msg });
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: STORAGE_KEYS.hesmRemote,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        whatsappDigits: s.whatsappDigits,
        phoneDisplay: s.phoneDisplay,
        telHrefRaw: s.telHrefRaw,
        professionals: s.professionals,
        lastSyncAt: s.lastSyncAt,
      }),
    }
  )
);

export function useHesmContacts() {
  const whatsappDigits = useHesmRemoteStore((s) => s.whatsappDigits);
  const phoneDisplay = useHesmRemoteStore((s) => s.phoneDisplay);
  const telHrefRaw = useHesmRemoteStore((s) => s.telHrefRaw);

  return {
    whatsappNumber: whatsappDigits ?? HESM_WHATSAPP_NUMBER,
    phonePrincipal: phoneDisplay ?? HESM_CONFIG.phonePrincipal,
    /** Valor a pasar a makeTelUrl (href tel o texto con dígitos) */
    phoneForTel: telHrefRaw || phoneDisplay || HESM_CONFIG.phonePrincipal,
  };
}
