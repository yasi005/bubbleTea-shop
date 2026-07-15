export type VibeMode = "day" | "night";

export interface VibeState {
  mode: VibeMode;
  soundsEnabled: boolean;
}

const VIBE_KEY = "bubble-tea-vibe";

const DEFAULT_VIBE: VibeState = {
  mode: "day",
  soundsEnabled: false,
};

export function loadVibeState(): VibeState {
  if (typeof window === "undefined") {
    return DEFAULT_VIBE;
  }
  try {
    const raw = window.localStorage.getItem(VIBE_KEY);
    if (!raw) {
      return DEFAULT_VIBE;
    }
    const parsed = JSON.parse(raw) as Partial<VibeState>;
    return {
      mode: parsed.mode === "night" ? "night" : "day",
      soundsEnabled: Boolean(parsed.soundsEnabled),
    };
  } catch {
    return DEFAULT_VIBE;
  }
}

export function saveVibeState(state: VibeState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(VIBE_KEY, JSON.stringify(state));
}
