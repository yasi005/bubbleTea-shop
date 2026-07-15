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
    <div className="flex h-full min-h-[340px] w-full items-center justify-center bg-[#f5ebe0]">
      <div className="h-14 w-14 animate-pulse rounded-full bg-[#ead9c8]" />
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
