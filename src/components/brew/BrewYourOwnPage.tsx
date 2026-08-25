"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BrewProvider, useBrew } from "@/context/BrewContext";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import { useIsMobileShell } from "@/hooks/useMediaQuery";
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

function useBrewActions() {
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
    resetCup();
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
    setBrewPhase("sealing");
    playSticker();
    brewTimersRef.current.push(
      setTimeout(() => playPop(), 260),
      setTimeout(() => playIce(), 440),
    );

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
        setBrewPhase("sealed");
      }, SEAL_HANDOFF_MS),
    );

    brewTimersRef.current.push(
      setTimeout(() => setToastOpen(false), SEAL_HANDOFF_MS + TOAST_VISIBLE_MS),
    );
  };

  return {
    isNight,
    cup,
    selectedFlavor,
    setSelectedFlavor,
    canPour,
    canAddToBag,
    canReset,
    locked,
    isSealing,
    isReady,
    hasItems,
    isPouring,
    toastOpen,
    startPour,
    stopPour,
    handleDropBoba,
    handleAddIce,
    handleReset,
    handleShake,
    handleBrew,
  };
}

function FlavorChips({
  selectedFlavor,
  setSelectedFlavor,
  locked,
  isNight,
  compact = false,
}: {
  selectedFlavor: string;
  setSelectedFlavor: (id: Parameters<ReturnType<typeof useBrew>["setSelectedFlavor"]>[0]) => void;
  locked: boolean;
  isNight: boolean;
  compact?: boolean;
}) {
  return (
    <div className="no-scrollbar -mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-0.5">
      {BREW_FLAVORS.map((flavorId) => {
        const drink = getDrinkById(flavorId);
        const active = selectedFlavor === flavorId;
        const short = drink?.name.split(" ")[0] ?? flavorId.replace("-", " ");
        return (
          <button
            key={flavorId}
            type="button"
            disabled={locked}
            onClick={() => setSelectedFlavor(flavorId)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-semibold transition-colors disabled:opacity-40 ${
              compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
            } ${
              active
                ? "border-transparent text-white shadow-sm"
                : isNight
                  ? "border-[#5c4f42] bg-[#2f2a26]/80 text-[#d4c4b0]"
                  : "border-[#e0cdb4] bg-white/55 text-[#6b5d4f]"
            }`}
            style={
              active ? { backgroundColor: drink?.color ?? "#c4842f" } : undefined
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
  );
}

/** Phone: floating bottom dock over a full-bleed cup — not a side menu. */
function MobileBrewDock() {
  const a = useBrewActions();

  return (
    <>
      <motion.div
        animate={{ opacity: a.isSealing ? 0 : 1 }}
        transition={{ duration: a.isSealing ? 0.45 : 0.35 }}
        style={{ pointerEvents: a.isSealing ? "none" : "auto" }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-2.5 pb-2 pt-8"
      >
        <div
          className={`pointer-events-auto rounded-[1.25rem] border px-2.5 pb-2.5 pt-2 shadow-[0_12px_32px_-14px_rgba(139,111,71,0.45)] backdrop-blur-md ${
            a.isNight
              ? "border-[#5c4f42] bg-[#2f2a26]/90 text-[#f5ebe0]"
              : "border-[#ead9c8]/90 bg-[#fdf8f0]/92 text-[#3d3830]"
          }`}
        >
          <p className="font-[family-name:var(--font-bubble)] text-[9px] tracking-wide text-[#b8956a]">
            Pick a flavor · drop · ice · hold to pour
          </p>

          <div className="mt-1.5">
            <FlavorChips
              selectedFlavor={a.selectedFlavor}
              setSelectedFlavor={a.setSelectedFlavor}
              locked={a.locked}
              isNight={a.isNight}
              compact
            />
          </div>

          <div className="mt-2 grid grid-cols-4 gap-1">
            <motion.button
              type="button"
              disabled={a.locked}
              whileTap={a.locked ? undefined : { scale: 0.97 }}
              onClick={a.handleDropBoba}
              className="rounded-xl bg-[#f4b8c1] px-1.5 py-2 text-center active:bg-[#efa3af] disabled:opacity-40"
            >
              <p className="font-[family-name:var(--font-bubble)] text-[11px] font-semibold leading-tight text-[#5c3d42]">
                Boba
              </p>
              <p className="mt-0.5 text-[9px] text-[#5c3d42]/55">+10</p>
            </motion.button>

            <motion.button
              type="button"
              disabled={a.locked}
              whileTap={a.locked ? undefined : { scale: 0.97 }}
              onClick={a.handleAddIce}
              className={`rounded-xl px-1.5 py-2 text-center disabled:opacity-40 ${
                a.isNight
                  ? "bg-[#3d3830] active:bg-[#4a433c]"
                  : "bg-[#f5ebe0] active:bg-[#ead9c8]"
              }`}
            >
              <p className="font-[family-name:var(--font-bubble)] text-[11px] font-semibold leading-tight">
                Ice
              </p>
              <p
                className={`mt-0.5 text-[9px] ${
                  a.isNight ? "text-[#a89888]" : "text-[#8b7a68]"
                }`}
              >
                +3
              </p>
            </motion.button>

            <motion.button
              type="button"
              disabled={!a.canPour || a.locked}
              whileTap={a.canPour && !a.locked ? { scale: 0.97 } : undefined}
              onTouchStart={a.startPour}
              onTouchEnd={a.stopPour}
              onMouseDown={a.startPour}
              onMouseUp={a.stopPour}
              onMouseLeave={a.stopPour}
              className={`rounded-xl px-1.5 py-2 text-center ${
                a.isPouring
                  ? "bg-[#e8956f] text-white"
                  : a.canPour
                    ? "bg-[#f4a582] text-white active:bg-[#e8956f]"
                    : a.isNight
                      ? "bg-[#3d3830] text-[#8b7a68] disabled:opacity-50"
                      : "bg-[#f5ebe0] text-[#8b7a68] disabled:opacity-50"
              }`}
            >
              <p className="font-[family-name:var(--font-bubble)] text-[11px] font-semibold leading-tight">
                {a.isPouring ? "Pour…" : "Pour"}
              </p>
              <p className="mt-0.5 text-[9px] opacity-75">
                {Math.round(a.cup.liquidLevel)}%
              </p>
            </motion.button>

            <motion.button
              type="button"
              disabled={a.locked || !a.hasItems}
              whileTap={
                a.locked || !a.hasItems ? undefined : { scale: 0.97, rotate: -2 }
              }
              onClick={a.handleShake}
              className="rounded-xl bg-[#f0e4f7] px-1.5 py-2 text-center text-[#5a3d6b] active:bg-[#e7d3f0] disabled:opacity-40"
            >
              <p className="font-[family-name:var(--font-bubble)] text-[11px] font-semibold leading-tight">
                Shake
              </p>
              <p className="mt-0.5 text-[9px] opacity-60">mix</p>
            </motion.button>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <p
              className={`min-w-0 flex-1 truncate font-mono text-[9px] tracking-wide ${
                a.isNight ? "text-[#a89888]" : "text-[#8b7a68]"
              }`}
            >
              {a.cup.pearls.length}p · {a.cup.iceCubes.length}ice ·{" "}
              {Math.round(a.cup.liquidLevel)}%
              {a.cup.currentFlavor
                ? ` · ${getDrinkById(a.cup.currentFlavor)?.name.split(" ")[0]}`
                : ""}
            </p>
            <motion.button
              type="button"
              disabled={!a.canReset || a.isSealing}
              whileTap={a.canReset && !a.isSealing ? { scale: 0.97 } : undefined}
              onClick={a.handleReset}
              className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold disabled:opacity-40 ${
                a.isReady
                  ? "border-[#f4a582] bg-[#f4a582]/15 text-[#c4842f]"
                  : a.isNight
                    ? "border-[#5c4f42] text-[#d4c4b0]"
                    : "border-[#d4c4b0] text-[#6b5d4f]"
              }`}
            >
              {a.isReady ? "Redo" : "Reset"}
            </motion.button>
            <motion.button
              type="button"
              disabled={!a.canAddToBag || a.locked}
              whileTap={
                a.canAddToBag && !a.locked ? { scale: 0.97 } : undefined
              }
              onClick={a.handleBrew}
              className={`btn-pill shrink-0 px-3.5 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40 ${
                a.isReady ? "bg-[#a8d5ba]" : "bg-[#c4842f] active:bg-[#a86f25]"
              }`}
            >
              {a.isSealing ? "…" : a.isReady ? "In tote ✓" : "Brew"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <BrewToast open={a.toastOpen} isNight={a.isNight} />
    </>
  );
}

/** Desktop: real side menu next to the cup. */
function DesktopBrewPanel() {
  const a = useBrewActions();

  return (
    <>
      <motion.aside
        animate={{ opacity: a.isSealing ? 0 : 1 }}
        transition={{ duration: a.isSealing ? 0.45 : 0.4 }}
        style={{ pointerEvents: a.isSealing ? "none" : "auto" }}
        className={`hidden h-full w-[min(22rem,34vw)] shrink-0 flex-col justify-center border-l px-6 py-8 lg:flex ${
          a.isNight
            ? "border-[#3d3830] bg-[#2f2a26]/95 text-[#f5ebe0]"
            : "border-[#ead9c8] bg-[#fdf8f0]/95 text-[#3d3830]"
        }`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#b8956a]">
          Brew your own
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-bubble)] text-3xl leading-tight tracking-wide">
          Counter craft
        </h1>
        <p
          className={`mt-2 text-sm leading-relaxed ${
            a.isNight ? "text-[#d4c4b0]" : "text-[#6b5d4f]"
          }`}
        >
          Pick a flavor · drop · ice · hold to pour
        </p>

        <div className="mt-6">
          <FlavorChips
            selectedFlavor={a.selectedFlavor}
            setSelectedFlavor={a.setSelectedFlavor}
            locked={a.locked}
            isNight={a.isNight}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <motion.button
            type="button"
            disabled={a.locked}
            whileTap={a.locked ? undefined : { scale: 0.97 }}
            onClick={a.handleDropBoba}
            className="rounded-2xl bg-[#f4b8c1] px-3.5 py-3 text-left transition-colors hover:bg-[#efa3af] disabled:opacity-40"
          >
            <p className="font-[family-name:var(--font-bubble)] text-sm text-[#5c3d42]">
              Drop boba
            </p>
            <p className="mt-0.5 text-[11px] text-[#5c3d42]/60">+10 pearls</p>
          </motion.button>

          <motion.button
            type="button"
            disabled={a.locked}
            whileTap={a.locked ? undefined : { scale: 0.97 }}
            onClick={a.handleAddIce}
            className={`rounded-2xl px-3.5 py-3 text-left transition-colors disabled:opacity-40 ${
              a.isNight
                ? "bg-[#3d3830] hover:bg-[#4a433c]"
                : "bg-[#f5ebe0] hover:bg-[#ead9c8]"
            }`}
          >
            <p className="font-[family-name:var(--font-bubble)] text-sm">
              Add ice
            </p>
            <p
              className={`mt-0.5 text-[11px] ${
                a.isNight ? "text-[#a89888]" : "text-[#8b7a68]"
              }`}
            >
              +3 cubes
            </p>
          </motion.button>

          <motion.button
            type="button"
            disabled={!a.canPour || a.locked}
            whileTap={a.canPour && !a.locked ? { scale: 0.97 } : undefined}
            onMouseDown={a.startPour}
            onMouseUp={a.stopPour}
            onMouseLeave={a.stopPour}
            className={`rounded-2xl px-3.5 py-3 text-left transition-colors ${
              a.isPouring
                ? "bg-[#e8956f] text-white"
                : a.canPour
                  ? "bg-[#f4a582] text-white hover:bg-[#e8956f]"
                  : a.isNight
                    ? "bg-[#3d3830] text-[#8b7a68] disabled:opacity-50"
                    : "bg-[#f5ebe0] text-[#8b7a68] disabled:opacity-50"
            }`}
          >
            <p className="font-[family-name:var(--font-bubble)] text-sm">
              {a.isPouring ? "Pouring…" : "Hold to pour"}
            </p>
            <p className="mt-0.5 text-[11px] opacity-75">
              {Math.round(a.cup.liquidLevel)}%
            </p>
          </motion.button>

          <motion.button
            type="button"
            disabled={a.locked || !a.hasItems}
            whileTap={
              a.locked || !a.hasItems ? undefined : { scale: 0.97, rotate: -2 }
            }
            onClick={a.handleShake}
            className="rounded-2xl bg-[#f0e4f7] px-3.5 py-3 text-left text-[#5a3d6b] transition-colors hover:bg-[#e7d3f0] disabled:opacity-40"
          >
            <p className="font-[family-name:var(--font-bubble)] text-sm">
              Shake
            </p>
            <p className="mt-0.5 text-[11px] opacity-65">rattle pearls</p>
          </motion.button>
        </div>

        <div
          className={`mt-4 grid grid-cols-4 gap-1 rounded-2xl border border-dashed px-3 py-2.5 font-mono text-[10px] tabular-nums ${
            a.isNight
              ? "border-[#5c4f42] bg-[#2a2622]/60 text-[#d4c4b0]"
              : "border-[#d4c4b0] bg-white/40 text-[#6b5d4f]"
          }`}
        >
          <div>
            <p className="text-[9px] tracking-wider text-[#b8956a]">Pearls</p>
            <p className="mt-0.5 font-semibold">{a.cup.pearls.length}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-wider text-[#b8956a]">Ice</p>
            <p className="mt-0.5 font-semibold">{a.cup.iceCubes.length}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-wider text-[#b8956a]">Fill</p>
            <p className="mt-0.5 font-semibold">
              {Math.round(a.cup.liquidLevel)}%
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] tracking-wider text-[#b8956a]">Base</p>
            <p className="mt-0.5 truncate font-semibold">
              {a.cup.currentFlavor
                ? (getDrinkById(a.cup.currentFlavor)?.name.split(" ")[0] ?? "—")
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <motion.button
            type="button"
            disabled={!a.canAddToBag || a.locked}
            whileTap={a.canAddToBag && !a.locked ? { scale: 0.97 } : undefined}
            onClick={a.handleBrew}
            className={`btn-pill min-w-0 flex-1 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40 ${
              a.isReady
                ? "bg-[#a8d5ba]"
                : "bg-[#c4842f] hover:bg-[#a86f25]"
            }`}
          >
            {a.isSealing ? "Sealing…" : a.isReady ? "In tote ✓" : "Brew it"}
          </motion.button>

          <motion.button
            type="button"
            disabled={!a.canReset || a.isSealing}
            whileTap={a.canReset && !a.isSealing ? { scale: 0.97 } : undefined}
            onClick={a.handleReset}
            className={`btn-pill shrink-0 border px-4 py-3 text-sm font-semibold disabled:opacity-40 ${
              a.isReady
                ? "border-[#f4a582] bg-[#f4a582]/15 text-[#c4842f] hover:bg-[#f4a582]/25"
                : a.isNight
                  ? "border-[#5c4f42] bg-[#2a2622]/70 text-[#d4c4b0] hover:bg-[#3d3830]"
                  : "border-[#d4c4b0] bg-white/60 text-[#6b5d4f] hover:bg-[#f5ebe0]"
            }`}
          >
            {a.isReady ? "Redo" : "Reset"}
          </motion.button>
        </div>
      </motion.aside>

      <BrewToast open={a.toastOpen} isNight={a.isNight} />
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
  const isMobile = useIsMobileShell();

  return (
    <div
      className={`relative flex h-full max-h-full min-h-0 overflow-hidden overscroll-none touch-none ${
        isMobile ? "flex-col" : "flex-row"
      } ${isNight ? "bg-[#2a2622]" : "bg-[#fdf8f0]"}`}
    >
      <div className="relative min-h-0 w-full flex-1 overflow-hidden">
        <BrewCanvas key={brewKey} />
        {isMobile ? (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-[42%] ${
              isNight
                ? "bg-gradient-to-t from-[#2a2622] via-[#2a2622]/55 to-transparent"
                : "bg-gradient-to-t from-[#fdf8f0] via-[#fdf8f0]/50 to-transparent"
            }`}
          />
        ) : null}
        {isMobile ? <MobileBrewDock /> : null}
      </div>

      {!isMobile ? <DesktopBrewPanel /> : null}
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
