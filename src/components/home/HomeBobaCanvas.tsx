"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import type { BobaCanvasProps } from "@/components/BobaCanvas";

const BobaCanvas = dynamic(
  () => import("@/components/BobaCanvas").then((m) => m.BobaCanvas),
  { ssr: false },
);

function CanvasFallback() {
  return (
    <div className="flex h-full min-h-[240px] w-full items-center justify-center bg-[#f3e6d6]">
      <div className="h-12 w-12 animate-pulse rounded-full bg-[#ead9c8]" />
    </div>
  );
}

export function HomeBobaCanvas(props: BobaCanvasProps) {
  return (
    <Suspense fallback={<CanvasFallback />}>
      <BobaCanvas {...props} />
    </Suspense>
  );
}
