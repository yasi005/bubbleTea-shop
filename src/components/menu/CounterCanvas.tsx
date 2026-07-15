"use client";

import { Canvas } from "@react-three/fiber";

import { CafeCounterScene } from "@/components/three/CafeCounterScene";

interface CounterCanvasProps {
  activeIndex: number;
  checkoutOpen: boolean;
  isNight: boolean;
  onCupClick: () => void;
}

export function CounterCanvas({
  activeIndex,
  checkoutOpen,
  isNight,
  onCupClick,
}: CounterCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.85, 5.4], fov: 42, near: 0.1, far: 50 }}
      className="h-full w-full"
      gl={{ antialias: true }}
    >
      <CafeCounterScene
        activeIndex={activeIndex}
        checkoutOpen={checkoutOpen}
        isNight={isNight}
        onCupClick={onCupClick}
      />
    </Canvas>
  );
}
