"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";

import { CounterCheckoutPanel } from "@/components/menu/CounterCheckoutPanel";
import { useMenuCounterRequired } from "@/context/MenuCounterContext";
import { useVibe } from "@/context/VibeContext";
import { DRINKS } from "@/lib/drinks";
import type { FlavorId } from "@/lib/types";

const CounterCanvas = dynamic(
  () =>
    import("@/components/menu/CounterCanvas").then((mod) => mod.CounterCanvas),
  { ssr: false, loading: () => <SceneFallback /> },
);

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#f5ebe0]">
      <div className="h-14 w-14 animate-pulse rounded-full bg-[#ead9c8]" />
    </div>
  );
}

const WHEEL_COOLDOWN_MS = 380;

export function GlidingCounterMenu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelRef = useRef(0);
  const {
    activeIndex,
    setActiveIndex,
    setActiveById,
    checkoutOpen,
    openCheckout,
    activeDrink,
  } = useMenuCounterRequired();
  const { isNight } = useVibe();
  const searchParams = useSearchParams();

  useEffect(() => {
    const drinkId = searchParams.get("drink");
    if (drinkId) {
      setActiveById(drinkId as FlavorId);
    }
  }, [searchParams, setActiveById]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (checkoutOpen) {
        return;
      }
      event.preventDefault();
      // One cup per scroll gesture: trackpads fire dozens of wheel events for
      // a single swipe, which used to skip several cups mid-glide.
      const now = performance.now();
      if (now - lastWheelRef.current < WHEEL_COOLDOWN_MS || Math.abs(event.deltaY) < 4) {
        return;
      }
      lastWheelRef.current = now;
      if (event.deltaY > 0) {
        setActiveIndex(Math.min(DRINKS.length - 1, activeIndex + 1));
      } else {
        setActiveIndex(Math.max(0, activeIndex - 1));
      }
    },
    [activeIndex, checkoutOpen, setActiveIndex],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <Suspense fallback={<SceneFallback />}>
        <CounterCanvas
          activeIndex={activeIndex}
          checkoutOpen={checkoutOpen}
          isNight={isNight}
          onCupClick={openCheckout}
        />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fdf8f0]/20" />

      {!checkoutOpen ? (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 w-full max-w-md -translate-x-1/2 text-center">
          <div className="mx-auto inline-block rounded-2xl bg-[#fdf8f0]/80 px-6 py-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-baseline justify-center gap-3">
              <p className="font-[family-name:var(--font-quicksand)] text-lg font-semibold text-[#3d3830]/90">
                {activeDrink.name}
              </p>
              <p className="font-[family-name:var(--font-quicksand)] text-base font-bold text-[#b8865c]">
                ${activeDrink.price.toFixed(2)}
              </p>
            </div>
            <p className="mt-0.5 text-xs italic text-[#8b7a68]">
              {activeDrink.description}
            </p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
              {activeDrink.notes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-[#e0cdb4] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#8b6f47]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8b6f47]/70">
            scroll · or pick on receipt · click cup to order
          </p>
        </div>
      ) : null}

      <CounterCheckoutPanel />
    </div>
  );
}
