let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
): void {
  const ctx = getCtx();
  if (!ctx) {
    return;
  }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playIceClink(): void {
  const ctx = getCtx();
  if (!ctx) {
    return;
  }
  playTone(1800 + Math.random() * 400, 0.08, 0.04, "triangle");
  window.setTimeout(() => playTone(2200 + Math.random() * 300, 0.06, 0.025, "sine"), 40);
}

export function playAddPop(): void {
  playTone(520, 0.12, 0.08, "sine");
  window.setTimeout(() => playTone(780, 0.08, 0.05, "triangle"), 60);
}

export function playMascotBoing(): void {
  playTone(280, 0.15, 0.06, "sine");
  window.setTimeout(() => playTone(420, 0.1, 0.04, "triangle"), 80);
}

export function playShakeClink(intensity: number): void {
  if (intensity < 0.3) {
    return;
  }
  playTone(900 + intensity * 200, 0.05, 0.03 * intensity, "triangle");
}

/** Soft tap-tap-tap when pearls land in the cup */
export function playPearlTap(count = 6): void {
  for (let i = 0; i < count; i += 1) {
    window.setTimeout(() => {
      playTone(420 + Math.random() * 80, 0.04, 0.035, "sine");
    }, i * 55 + Math.random() * 30);
  }
}

export function playCrankSpin(): void {
  playTone(340, 0.08, 0.04, "triangle");
  window.setTimeout(() => playTone(480, 0.06, 0.03, "sine"), 70);
  window.setTimeout(() => playTone(620, 0.05, 0.025, "triangle"), 140);
}

export function playPourGlug(): void {
  playTone(180, 0.06, 0.025, "sine");
}

export function playStickerSlap(): void {
  playTone(280, 0.1, 0.07, "sine");
  window.setTimeout(() => playTone(520, 0.08, 0.05, "triangle"), 50);
}
