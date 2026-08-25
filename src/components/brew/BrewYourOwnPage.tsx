"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BrewProvider, useBrew } from "@/context/BrewContext";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import {
  BREW_FLAVORS,
  POUR_TICK_MS,
  iceLevelFromCubeCount,
} from "@/lib/brew";
import { getDrinkById } from "@/lib/drinks";

const BrewCanvas = dynamic(
  () => import("@/components/brew/BrewCanvas").then((m) => m.BrewCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#f5ebe0]">
        <div className="h-12 w-12 animate-pulse rounded-full bg-[#ead9c8]" />
      </div>
    ),
  },
);

const SEAL_HANDOFF_MS = 1700;
const TOAST_VISIBLE_MS = 3000;

function BrewControls() {
  const { playPop, playIce, playSticker, playShake, isNight } = useVibe();
  const { addCustomBrewToBasket } = useShop();
  const {
    cup,
    selectedFlavor,
    setSelectedFlavor,
    dropBoba,
    addIce,
    pourTick,
    resetCup,
    canPour,
    canAddToBag,
    canReset,
    brewPhase,
    setBrewPhase,
    shakeCup,
    buildCheckoutSnapshot,
  } = useBrew();

  const [toastOpen, setToastOpen] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const pourTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const brewTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const isSealing = brewPhase === "sealing";
  const isReady = brewPhase === "sealed";
  // While sealing the animation runs, and once ready the drink is locked in —
  // either way the build controls are disabled until the user hits Redo.
  const locked = isSealing || isReady;
  const hasItems = cup.pearls.length > 0 || cup.iceCubes.length > 0;

  const stopPour = useCallback(() => {
    if (pourTimerRef.current) {
      clearInterval(pourTimerRef.current);
      pourTimerRef.current = null;
    }
    setIsPouring(false);
  }, []);

  const startPour = useCallback(() => {
    if (!canPour) {
      return;
    }
    setIsPouring(true);
    pourTick();
    pourTimerRef.current = setInterval(() => {
      pourTick();
    }, POUR_TICK_MS);
  }, [canPour, pourTick]);

  useEffect(() => {
    if (!canPour && isPouring) {
      stopPour();
    }
  }, [canPour, isPouring, stopPour]);

  useEffect(() => {
    const brewTimers = brewTimersRef.current;
    return () => {
      if (pourTimerRef.current) {
        clearInterval(pourTimerRef.current);
      }
      brewTimers.forEach(clearTimeout);
    };
  }, []);

  const handleDropBoba = () => {
    dropBoba();
    playPop();
  };

  const handleAddIce = () => {
    addIce();
    playIce();
  };

  const handleReset = () => {
    stopPour();
    resetCup(); // clears the cup + returns phase to idle
    playPop();
  };

  const handleShake = () => {
    if (locked || !hasItems) {
      return;
    }
    shakeCup();
    playShake(1);
  };

  const handleBrew = () => {
    if (locked) {
      return;
    }
    const snapshot = buildCheckoutSnapshot();
    if (!snapshot) {
      return;
    }

    stopPour();
    // Kick off the 3D lid-snap + straw-drop finish and fade the controls out.
    setBrewPhase("sealing");
    playSticker(); // lid clicks on
    brewTimersRef.current.push(
      setTimeout(() => playPop(), 260), // straw pierces
      setTimeout(() => playIce(), 440), // sparkle shimmer
    );

    // Once the drink is "sealed", hand it to the tote bag and pop the toast.
    // The cup keeps its contents + lid so it stays exactly as brewed until Redo.
    brewTimersRef.current.push(
      setTimeout(() => {
        addCustomBrewToBasket({
          flavorId: snapshot.flavorId,
          pearlCount: snapshot.pearlCount,
          iceCubeCount: snapshot.iceCubeCount,
          liquidLevel: snapshot.liquidLevel,
          label: snapshot.label,
          ice: iceLevelFromCubeCount(snapshot.iceCubeCount),
        });
        setToastOpen(true);
        setBrewPhase("sealed"); // stays ready; controls fade back in
      }, SEAL_HANDOFF_MS),
    );

    brewTimersRef.current.push(
      setTimeout(() => setToastOpen(false), SEAL_HANDOFF_MS + TOAST_VISIBLE_MS),
    );
  };

  return (
    <>
      <motion.div
        animate={{ opacity: isSealing ? 0 : 1 }}
        transition={{ duration: isSealing ? 0.45 : 0.4 }}
        style={{ pointerEvents: isSealing ? "none" : "auto" }}
        className={`no-scrollbar flex flex-1 flex-col justify-end overflow-y-auto px-4 pb-3 pt-2 sm:justify-center sm:px-5 sm:py-4 lg:h-full lg:max-w-[20rem] lg:justify-center lg:overflow-hidden lg:px-5 ${
          isNight ? "text-[#f5ebe0]" : "text-[#3d3830]"
        }`}
      >
        <div>
          <p className="font-[family-name:var(--font-bubble)] text-[9px] tracking-wide text-[#b8956a]">
            Pick a flavor · drop · ice · hold to pour
          </p>
          <div className="no-scrollbar mt-1.5 -mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-0.5">
            {BREW_FLAVORS.map((flavorId) => {
              const drink = getDrinkById(flavorId);
              const active = selectedFlavor === flavorId;
              const short =
                drink?.name.split(" ")[0] ?? flavorId.replace("-", " ");
              return (
                <button
                  key={flavorId}
                  type="button"
                  disabled={locked}
                  onClick={() => setSelectedFlavor(flavorId)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:opacity-40 ${
                    active
                      ? "border-transparent text-white shadow-sm"
                      : isNight
                        ? "border-[#5c4f42] bg-[#2f2a26]/80 text-[#d4c4b0]"
                        : "border-[#e0cdb4] bg-white/50 text-[#6b5d4f]"
                  }`}
                  style={
                    active
                      ? { backgroundColor: drink?.color ?? "#c4842f" }
                      : undefined
                  }
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: active
                        ? "rgba(255,255,255,0.9)"
                        : (drink?.liquidColor ?? "#ccc"),
                    }}
                  />
                  {short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <motion.button
            type="button"
            disabled={locked}
            whileTap={locked ? undefined : { scale: 0.97 }}
            onClick={handleDropBoba}
            className="rounded-2xl bg-[#f4b8c1] px-3 py-2 text-left transition-colors active:bg-[#efa3af] hover:bg-[#efa3af] disabled:opacity-40"
          >
            <p className="font-[family-name:var(--font-bubble)] text-[12px] font-semibold text-[#5c3d42]">
              Drop boba
            </p>
            <p className="mt-0.5 text-[10px] text-[#5c3d42]/60">+10 pearls</p>
          </motion.button>

          <motion.button
            type="button"
            disabled={locked}
            whileTap={locked ? undefined : { scale: 0.97 }}
            onClick={handleAddIce}
            className={`rounded-2xl px-3 py-2 text-left transition-colors disabled:opacity-40 ${
              isNight
                ? "bg-[#3d3830] text-[#f5ebe0] active:bg-[#4a433c] hover:bg-[#4a433c]"
                : "bg-[#f5ebe0] text-[#3d3830] active:bg-[#ead9c8] hover:bg-[#ead9c8]"
            }`}
          >
            <p className="font-[family-name:var(--font-bubble)] text-[12px] font-semibold">
              Add ice
            </p>
            <p
              className={`mt-0.5 text-[10px] ${
                isNight ? "text-[#a89888]" : "text-[#8b7a68]"
              }`}
            >
              +3 cubes
            </p>
          </motion.button>

          <motion.button
            type="button"
            disabled={!canPour || locked}
            whileTap={canPour && !locked ? { scale: 0.97 } : undefined}
            onMouseDown={startPour}
            onMouseUp={stopPour}
            onMouseLeave={stopPour}
            onTouchStart={startPour}
            onTouchEnd={stopPour}
            className={`rounded-2xl px-3 py-2 text-left transition-colors ${
              isPouring
                ? "bg-[#e8956f] text-white"
                : canPour
                  ? "bg-[#f4a582] text-white active:bg-[#e8956f] hover:bg-[#e8956f]"
                  : isNight
                    ? "bg-[#3d3830] text-[#8b7a68] disabled:opacity-50"
                    : "bg-[#f5ebe0] text-[#8b7a68] disabled:opacity-50"
            }`}
          >
            <p className="font-[family-name:var(--font-bubble)] text-[12px] font-semibold">
              {isPouring ? "Pouring…" : "Hold to pour"}
            </p>
            <p className="mt-0.5 text-[10px] opacity-75">
              {Math.round(cup.liquidLevel)}%
            </p>
          </motion.button>

          <motion.button
            type="button"
            disabled={locked || !hasItems}
            whileTap={
              locked || !hasItems ? undefined : { scale: 0.97, rotate: -2 }
            }
            onClick={handleShake}
            className="rounded-2xl bg-[#f0e4f7] px-3 py-2 text-left text-[#5a3d6b] transition-colors active:bg-[#e7d3f0] hover:bg-[#e7d3f0] disabled:opacity-40"
          >
            <p className="font-[family-name:var(--font-bubble)] text-[12px] font-semibold">
              Shake
            </p>
            <p className="mt-0.5 text-[10px] opacity-65">rattle pearls</p>
          </motion.button>
        </div>

        <div
          className={`mt-3 grid grid-cols-4 gap-1 rounded-2xl border border-dashed px-2.5 py-2 font-mono text-[10px] tabular-nums ${
            isNight
              ? "border-[#5c4f42] bg-[#2f2a26]/70 text-[#d4c4b0]"
              : "border-[#d4c4b0] bg-white/35 text-[#6b5d4f]"
          }`}
        >
          <div>
            <p className="text-[9px] uppercase tracking-wider text-[#b8956a]">
              Pearls
            </p>
            <p className="mt-0.5 font-semibold">{cup.pearls.length}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-[#b8956a]">
              Ice
            </p>
            <p className="mt-0.5 font-semibold">{cup.iceCubes.length}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-[#b8956a]">
              Fill
            </p>
            <p className="mt-0.5 font-semibold">
              {Math.round(cup.liquidLevel)}%
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider text-[#b8956a]">
              Base
            </p>
            <p className="mt-0.5 truncate font-semibold">
              {cup.currentFlavor
                ? (getDrinkById(cup.currentFlavor)?.name.split(" ")[0] ?? "—")
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-1.5">
          <motion.button
            type="button"
            disabled={!canAddToBag || locked}
            whileTap={canAddToBag && !locked ? { scale: 0.97 } : undefined}
            onClick={handleBrew}
            className={`btn-pill min-w-0 flex-1 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 ${
              isReady
                ? "bg-[#a8d5ba]"
                : "bg-[#c4842f] active:bg-[#a86f25] hover:bg-[#a86f25]"
            }`}
          >
            {isSealing
              ? "Sealing…"
              : isReady
                ? "In tote ✓"
                : "Brew it"}
          </motion.button>

          <motion.button
            type="button"
            disabled={!canReset || isSealing}
            whileTap={canReset && !isSealing ? { scale: 0.97 } : undefined}
            onClick={handleReset}
            className={`btn-pill shrink-0 border px-3.5 py-2.5 text-sm font-semibold disabled:opacity-40 ${
              isReady
                ? "border-[#f4a582] bg-[#f4a582]/15 text-[#c4842f] active:bg-[#f4a582]/25 hover:bg-[#f4a582]/25"
                : isNight
                  ? "border-[#5c4f42] bg-[#2f2a26]/70 text-[#d4c4b0] active:bg-[#3d3830] hover:bg-[#3d3830]"
                  : "border-[#d4c4b0] bg-white/50 text-[#6b5d4f] active:bg-[#f5ebe0] hover:bg-[#f5ebe0]"
            }`}
          >
            {isReady ? "Redo" : "Reset"}
          </motion.button>
        </div>
      </motion.div>

      <BrewToast open={toastOpen} isNight={isNight} />
    </>
  );
}

function BrewToast({ open, isNight }: { open: boolean; isNight: boolean }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, x: "-50%", y: 70, scale: 0.94 }}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-50%", y: 50, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          style={{
            left: "50%",
            bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))",
          }}
          className={`fixed z-50 max-w-[min(92vw,22rem)] overflow-hidden rounded-full border px-3 py-2 shadow-[0_10px_28px_-10px_rgba(244,165,130,0.55)] backdrop-blur-md ${
            isNight
              ? "border-[#5c4f42] bg-[#2f2a26]/92"
              : "border-white/60 bg-[#fff8ec]/90"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a8d5ba] text-[10px] font-bold text-white">
              ✓
            </span>
            <p
              className={`pr-1 text-xs font-semibold ${
                isNight ? "text-[#f5ebe0]" : "text-[#5c4f42]"
              }`}
            >
              Custom boba landed in your tote
            </p>
          </div>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: TOAST_VISIBLE_MS / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 rounded-full bg-[#f4a582]"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function BrewYourOwnContent() {
  const { isNight } = useVibe();
  const { brewKey } = useBrew();

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden lg:flex-row ${
        isNight ? "bg-[#2a2622]" : "bg-[#fdf8f0]"
      }`}
    >
      <div className="relative min-h-0 w-full flex-1 max-[1023px]:min-h-[48vh]">
        <BrewCanvas key={brewKey} />
      </div>
      <BrewControls />
    </div>
  );
}

export function BrewYourOwnPage() {
  return (
    <BrewProvider>
      <BrewYourOwnContent />
    </BrewProvider>
  );
}
