"use client";

import { Canvas } from "@react-three/fiber";

import { CafeCounterScene } from "@/components/three/CafeCounterScene";

interface CounterCanvasProps {
  activeIndex: number;
  checkoutOpen: boolean;
  isNight: boolean;
  compact?: boolean;
  onCupClick: () => void;
}

export function CounterCanvas({
  activeIndex,
  checkoutOpen,
  isNight,
  compact = false,
  onCupClick,
}: CounterCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={compact ? [1, 1.15] : [1, 1.25]}
      camera={{
        position: compact ? [0, 1.05, 4.15] : [0, 0.85, 5.4],
        fov: compact ? 48 : 42,
        near: 0.1,
        far: 50,
      }}
      className="h-full w-full touch-none"
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      performance={{ min: 0.5 }}
    >
      <CafeCounterScene
        activeIndex={activeIndex}
        checkoutOpen={checkoutOpen}
        isNight={isNight}
        compact={compact}
        onCupClick={onCupClick}
      />
    </Canvas>
  );
}
