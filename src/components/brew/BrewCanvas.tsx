"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { BrewScene } from "@/components/brew/BrewScene";

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#f5ebe0]">
      <div className="h-12 w-12 animate-pulse rounded-full bg-[#ead9c8]" />
    </div>
  );
}

export function BrewCanvas() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          shadows
          className="!h-full !w-full"
          style={{ width: "100%", height: "100%", display: "block" }}
          gl={{ antialias: true, alpha: false }}
        >
          <BrewScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
