"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useState } from "react";

import { BobaCupScene } from "@/components/three/BobaCup";

export interface BobaCanvasProps {
  liquidColor: string;
  spinTrigger?: number;
  interactive?: boolean;
  showParallax?: boolean;
  cozy?: boolean;
  className?: string;
}

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-14 w-14 animate-pulse rounded-full bg-[#ead9c8]" />
    </div>
  );
}

export function BobaCanvas({
  liquidColor,
  spinTrigger = 0,
  interactive = false,
  showParallax = false,
  cozy = false,
  className = "",
}: BobaCanvasProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!showParallax) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      setMouse({
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    },
    [showParallax],
  );

  return (
    <div
      className={`h-full w-full ${className}`}
      onMouseMove={handleMouseMove}
    >
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          shadows
          dpr={cozy ? [1, 1.25] : [1, 1.5]}
          camera={{
            position: cozy ? [0, 0.45, 3.55] : [0, 0.3, 3.2],
            fov: cozy ? 40 : 42,
          }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
          }}
          className="!h-full !w-full"
          style={{ width: "100%", height: "100%", display: "block" }}
          performance={{ min: 0.5 }}
        >
          <BobaCupScene
            liquidColor={liquidColor}
            spinTrigger={spinTrigger}
            interactive={interactive}
            showParallax={showParallax}
            cozy={cozy}
            mouseX={mouse.x}
            mouseY={mouse.y}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
