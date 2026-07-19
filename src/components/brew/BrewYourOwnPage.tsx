"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BrewProvider, useBrew } from "@/context/BrewContext";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import {
  BREW_FLAVORS,
  MAX_LIQUID_LEVEL,
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
  const { playPop, playIce, playSticker, playShake } = useVibe();
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
      className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-6 lg:h-full lg:max-w-sm"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#b8956a]">
        ✨ Brew your own
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-quicksand)] text-2xl font-bold text-[#3d3830]">
        Your cup, your pace
      </h1>
      <p className="mt-2 text-sm text-[#6b5d4f]">
        Pick a tea base, drop boba, add ice, then hold pour. The 3D cup reads
        your state in real time.
      </p>

      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#b8956a]">
          Tea base
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BREW_FLAVORS.map((flavorId) => {
            const drink = getDrinkById(flavorId);
            const active = selectedFlavor === flavorId;
            return (
              <button
                key={flavorId}
                type="button"
                disabled={locked}
                onClick={() => setSelectedFlavor(flavorId)}
                className={`btn-pill px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                  active
                    ? "bg-[#c4842f] text-white"
                    : "bg-[#f5ebe0] text-[#6b5d4f] hover:bg-[#ead9c8]"
                }`}
                style={
                  active
                    ? undefined
                    : { borderLeft: `3px solid ${drink?.liquidColor ?? "#ccc"}` }
                }
              >
                {drink?.name ?? flavorId}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <motion.button
          type="button"
          disabled={locked}
          whileTap={locked ? undefined : { scale: 0.97 }}
          onClick={handleDropBoba}
          className="btn-pill w-full bg-[#2a2018] px-6 py-2.5 text-left font-semibold text-white hover:bg-[#3d3028] disabled:opacity-40"
        >
          Drop Boba
          <span className="ml-2 text-xs opacity-70">+10 pearls</span>
        </motion.button>

        <motion.button
          type="button"
          disabled={locked}
          whileTap={locked ? undefined : { scale: 0.97 }}
          onClick={handleAddIce}
          className="btn-pill w-full bg-[#f5ebe0] px-6 py-2.5 text-left font-semibold text-[#3d3830] hover:bg-[#ead9c8] disabled:opacity-40"
        >
          Add Ice
          <span className="ml-2 text-xs opacity-70">+3 cubes</span>
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
          className={`btn-pill w-full px-6 py-2.5 text-left font-semibold transition ${
            isPouring
              ? "bg-[#e8956f] text-white"
              : canPour
                ? "bg-[#f4a582] text-white hover:bg-[#e8956f]"
                : "bg-[#f5ebe0] text-[#8b7a68] disabled:opacity-50"
          }`}
        >
          {isPouring ? "Pouring…" : "Hold to Pour Tea"}
          <span className="ml-2 text-xs opacity-80">
            {Math.round(cup.liquidLevel)}%
          </span>
        </motion.button>

        <motion.button
          type="button"
          disabled={locked || !hasItems}
          whileTap={locked || !hasItems ? undefined : { scale: 0.97, rotate: -2 }}
          onClick={handleShake}
          className="btn-pill w-full bg-[#e7d3f0] px-6 py-2.5 text-left font-semibold text-[#5a3d6b] hover:bg-[#dcc2e8] disabled:opacity-40"
        >
          Shake It
          <span className="ml-2 text-xs opacity-70">rattle the ice & boba</span>
        </motion.button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-3 rounded-2xl border border-dashed border-[#d4c4b0] bg-white/30 px-4 py-2.5 font-mono text-[11px] text-[#6b5d4f]">
        <p>Pearls: {cup.pearls.length}</p>
        <p>Ice cubes: {cup.iceCubes.length}</p>
        <p>
          Liquid: {Math.round(cup.liquidLevel)}% / {MAX_LIQUID_LEVEL}%
        </p>
        <p>
          Flavor:{" "}
          {cup.currentFlavor ? getDrinkById(cup.currentFlavor)?.name : "—"}
        </p>
      </div>

      <motion.button
        type="button"
        disabled={!canAddToBag || locked}
        whileTap={canAddToBag && !locked ? { scale: 0.97 } : undefined}
        onClick={handleBrew}
        className={`btn-pill mt-4 w-full px-8 py-3 font-semibold text-white disabled:opacity-40 ${
          isReady
            ? "bg-[#a8d5ba] hover:bg-[#a8d5ba]"
            : "bg-[#c4842f] hover:bg-[#a86f25]"
        }`}
      >
        {isSealing ? "Sealing…" : isReady ? "Ready! 🧋 In your tote" : "Brew It ✨"}
      </motion.button>

      <motion.button
        type="button"
        disabled={!canReset || isSealing}
        whileTap={canReset && !isSealing ? { scale: 0.97 } : undefined}
        onClick={handleReset}
        className={`btn-pill mt-2 w-full border px-8 py-2.5 font-semibold disabled:opacity-40 ${
          isReady
            ? "border-[#f4a582] bg-[#f4a582]/15 text-[#c4842f] hover:bg-[#f4a582]/25"
            : "border-[#d4c4b0] bg-white/50 text-[#6b5d4f] hover:bg-[#f5ebe0]"
        }`}
      >
        {isReady ? "↺ Redo — start a new cup" : "Reset & Redo"}
      </motion.button>
    </motion.div>

    <BrewToast open={toastOpen} />
    </>
  );
}

function BrewToast({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, x: "-50%", y: 90, scale: 0.9 }}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-50%", y: 70, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          style={{ left: "50%" }}
          className="fixed bottom-8 z-50 overflow-hidden rounded-full border border-white/60 bg-[#fff8ec]/85 pl-3 pr-5 py-3 shadow-[0_12px_40px_-8px_rgba(244,165,130,0.65)] backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#a8d5ba] text-sm font-bold text-white">
              ✓
            </span>
            <p className="pr-1 text-sm font-semibold text-[#5c4f42]">
              Your custom boba is ready! 🧋 Popped it into your tote bag.
            </p>
          </div>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: TOAST_VISIBLE_MS / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 rounded-full bg-[#f4a582]"
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
      <div className="relative min-h-0 w-full flex-1 max-[1023px]:min-h-[38vh]">
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
