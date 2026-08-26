"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { CounterCheckoutPanel } from "@/components/menu/CounterCheckoutPanel";
import { useMenuCounterRequired } from "@/context/MenuCounterContext";
import { useVibe } from "@/context/VibeContext";
import { useIsMobileShell } from "@/hooks/useMediaQuery";
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
const SWIPE_THRESHOLD_PX = 48;

export function GlidingCounterMenu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelRef = useRef(0);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const swipeLocked = useRef(false);
  const {
    activeIndex,
    setActiveIndex,
    setActiveById,
    checkoutOpen,
    openCheckout,
    activeDrink,
  } = useMenuCounterRequired();
  const { isNight, playIce, toggleMode, toggleSounds, soundsEnabled } =
    useVibe();
  const searchParams = useSearchParams();
  const isMobile = useIsMobileShell();

  useEffect(() => {
    const drinkId = searchParams.get("drink");
    if (drinkId) {
      setActiveById(drinkId as FlavorId);
    }
  }, [searchParams, setActiveById]);

  const goNext = useCallback(() => {
    setActiveIndex(Math.min(DRINKS.length - 1, activeIndex + 1));
  }, [activeIndex, setActiveIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex(Math.max(0, activeIndex - 1));
  }, [activeIndex, setActiveIndex]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (checkoutOpen) {
        return;
      }
      event.preventDefault();
      // One cup per scroll gesture: trackpads fire dozens of wheel events for
      // a single swipe, which used to skip several cups mid-glide.
      const now = performance.now();
      if (
        now - lastWheelRef.current < WHEEL_COOLDOWN_MS ||
        Math.abs(event.deltaY) < 4
      ) {
        return;
      }
      lastWheelRef.current = now;
      if (event.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    },
    [checkoutOpen, goNext, goPrev],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (checkoutOpen || event.pointerType === "mouse") {
      return;
    }
    swipeStartX.current = event.clientX;
    swipeStartY.current = event.clientY;
    swipeLocked.current = false;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      checkoutOpen ||
      swipeStartX.current === null ||
      swipeStartY.current === null ||
      swipeLocked.current
    ) {
      return;
    }
    const dx = event.clientX - swipeStartX.current;
    const dy = event.clientY - swipeStartY.current;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX && Math.abs(dy) < SWIPE_THRESHOLD_PX) {
      return;
    }
    // Prefer horizontal swipes for changing drinks; ignore mostly-vertical pans.
    if (Math.abs(dx) <= Math.abs(dy) * 1.15) {
      swipeStartX.current = null;
      return;
    }
    swipeLocked.current = true;
    if (dx < 0) {
      goNext();
      playIce();
    } else {
      goPrev();
      playIce();
    }
  };

  const onPointerUp = () => {
    swipeStartX.current = null;
    swipeStartY.current = null;
    swipeLocked.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Suspense fallback={<SceneFallback />}>
        <CounterCanvas
          activeIndex={activeIndex}
          checkoutOpen={checkoutOpen}
          isNight={isNight}
          compact={isMobile}
          onCupClick={openCheckout}
        />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fdf8f0]/25 via-transparent to-[#fdf8f0]/35 max-[900px]:from-[#fdf8f0]/40 max-[900px]:via-transparent max-[900px]:to-[#fdf8f0]/55 min-[901px]:bg-gradient-to-r min-[901px]:from-transparent min-[901px]:via-transparent min-[901px]:to-[#fdf8f0]/20" />

      {isMobile ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 px-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <div
            className={`rounded-xl px-2.5 py-1.5 backdrop-blur-md ${
              isNight ? "bg-[#2f2a26]/75 text-[#f5ebe0]" : "bg-[#fdf8f0]/80 text-[#3d3830]"
            }`}
          >
            <p className="font-[family-name:var(--font-quicksand)] text-[9px] font-bold uppercase tracking-[0.26em] text-[#b8956a]">
              The Fridge
            </p>
            <p className="mt-0.5 font-mono text-[9px] text-[#8b7a68]">
              swipe · tap cup to order
            </p>
          </div>
          <div
            className="pointer-events-auto flex gap-1"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={toggleMode}
              aria-label={isNight ? "Switch to day shift" : "Switch to night shift"}
              className={`rounded-full border px-2 py-1.5 text-xs backdrop-blur-md ${
                isNight
                  ? "border-[#5c4f42] bg-[#2f2a26]/8"
                  : "border-[#ead9c8] bg-[#fdf8f0]/85"
              }`}
            >
              {isNight ? "🌙" : "☀️"}
            </button>
            <button
              type="button"
              onClick={toggleSounds}
              aria-label={soundsEnabled ? "Mute ASMR" : "Enable ASMR"}
              className={`rounded-full border px-2 py-1.5 text-xs backdrop-blur-md ${
                isNight
                  ? "border-[#5c4f42] bg-[#2f2a26]/8"
                  : "border-[#ead9c8] bg-[#fdf8f0]/85"
              }`}
            >
              {soundsEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      ) : null}

      {!checkoutOpen ? (
        <div
          className={`absolute z-10 w-full ${
            isMobile
              ? "bottom-[calc(var(--mobile-tab-inset)+0.5rem)] left-0 px-2.5"
              : "pointer-events-none bottom-6 left-1/2 max-w-md -translate-x-1/2 text-center"
          }`}
        >
          {isMobile ? (
            <div
              className={`rounded-[1.15rem] border px-2.5 pb-2.5 pt-2 shadow-[0_10px_30px_-12px_rgba(139,111,71,0.35)] backdrop-blur-md ${
                isNight
                  ? "border-[#5c4f42] bg-[#2f2a26]/88 text-[#f5ebe0]"
                  : "border-[#ead9c8]/90 bg-[#fdf8f0]/90 text-[#3d3830]"
              }`}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <div className="no-scrollbar -mx-0.5 flex gap-1 overflow-x-auto px-0.5 pb-2">
                {DRINKS.map((drink, index) => {
                  const active = index === activeIndex;
                  return (
                    <button
                      key={drink.id}
                      type="button"
                      onClick={() => {
                        setActiveIndex(index);
                        playIce();
                      }}
                      className={`pointer-events-auto shrink-0 rounded-full border px-2.5 py-1 font-[family-name:var(--font-quicksand)] text-[11px] font-semibold transition-colors ${
                        active
                          ? "border-transparent text-white shadow-sm"
                          : isNight
                            ? "border-[#5c4f42] text-[#d4c4b0]"
                            : "border-[#e0cdb4] text-[#6b5d4f]"
                      }`}
                      style={
                        active
                          ? { backgroundColor: drink.color }
                          : undefined
                      }
                    >
                      {drink.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <p className="truncate font-[family-name:var(--font-quicksand)] text-[15px] font-semibold">
                      {activeDrink.name}
                    </p>
                    <p className="shrink-0 font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#b8865c]">
                      ${activeDrink.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-[#8b7a68]">
                    {activeDrink.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCheckout}
                  className="pointer-events-auto shrink-0 rounded-full bg-[#f4a582] px-3.5 py-2 font-[family-name:var(--font-quicksand)] text-xs font-semibold text-white shadow-sm active:scale-[0.97]"
                >
                  Order
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : null}

      <CounterCheckoutPanel compact={isMobile} />
    </div>
  );
}
