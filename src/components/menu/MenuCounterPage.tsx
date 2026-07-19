"use client";

import { Suspense } from "react";

import { GlidingCounterMenu } from "@/components/menu/GlidingCounterMenu";

function MenuFallback() {
  return (
    <div className="flex h-full items-center justify-center bg-[#f5ebe0]">
      <div className="h-14 w-14 animate-pulse rounded-full bg-[#ead9c8]" />
    </div>
  );
}

export function MenuCounterPage() {
  return (
    <Suspense fallback={<MenuFallback />}>
      <GlidingCounterMenu />
    </Suspense>
  );
}
