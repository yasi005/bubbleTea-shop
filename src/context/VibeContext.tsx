"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  playAddPop,
  playCrankSpin,
  playIceClink,
  playMascotBoing,
  playPearlTap,
  playPourGlug,
  playShakeClink,
  playStickerSlap,
} from "@/lib/sounds";
import {
  loadVibeState,
  saveVibeState,
  type VibeMode,
} from "@/lib/vibeStorage";

interface VibeContextValue {
  mode: VibeMode;
  soundsEnabled: boolean;
  hydrated: boolean;
  isNight: boolean;
  toggleMode: () => void;
  toggleSounds: () => void;
  playIce: () => void;
  playPop: () => void;
  playBoing: () => void;
  playShake: (intensity: number) => void;
  playPearlTap: () => void;
  playCrank: () => void;
  playPour: () => void;
  playSticker: () => void;
}

const VibeContext = createContext<VibeContextValue | null>(null);

export function VibeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<VibeMode>("day");
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const state = loadVibeState();
    setMode(state.mode);
    setSoundsEnabled(state.soundsEnabled);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveVibeState({ mode, soundsEnabled });
    }
    document.documentElement.dataset.vibe = mode;
  }, [mode, soundsEnabled, hydrated]);

  const guarded = useCallback(
    (fn: () => void) => {
      if (soundsEnabled) {
        fn();
      }
    },
    [soundsEnabled],
  );

  const value = useMemo<VibeContextValue>(
    () => ({
      mode,
      soundsEnabled,
      hydrated,
      isNight: mode === "night",
      toggleMode: () => setMode((prev) => (prev === "day" ? "night" : "day")),
      toggleSounds: () => setSoundsEnabled((prev) => !prev),
      playIce: () => guarded(playIceClink),
      playPop: () => guarded(playAddPop),
      playBoing: () => guarded(playMascotBoing),
      playShake: (intensity: number) => guarded(() => playShakeClink(intensity)),
      playPearlTap: () => guarded(() => playPearlTap()),
      playCrank: () => guarded(playCrankSpin),
      playPour: () => guarded(playPourGlug),
      playSticker: () => guarded(playStickerSlap),
    }),
    [mode, soundsEnabled, hydrated, guarded],
  );

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
}

export function useVibe(): VibeContextValue {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error("useVibe must be used within VibeProvider");
  }
  return context;
}
