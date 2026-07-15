"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useState } from "react";

import { BobaCupScene } from "@/components/three/BobaCup";

export interface BobaCanvasProps {
  liquidColor: string;
  spinTrigger?: number;
  interactive?: boolean;
  showParallax?: boolean;
  className?: string;
}

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-12 w-12 animate-pulse rounded-full bg-[#f5ebe0]" />
    </div>
  );
}

export function BobaCanvas({
  liquidColor,
  spinTrigger = 0,
  interactive = false,
  showParallax = false,
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
          camera={{ position: [0, 0.3, 3.2], fov: 42 }}
          gl={{ antialias: true, alpha: false }}
          className="!h-full !w-full"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <BobaCupScene
            liquidColor={liquidColor}
            spinTrigger={spinTrigger}
            interactive={interactive}
            showParallax={showParallax}
            mouseX={mouse.x}
            mouseY={mouse.y}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
