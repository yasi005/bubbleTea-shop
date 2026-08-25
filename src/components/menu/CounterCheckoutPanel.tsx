"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { GlassPanel } from "@/components/GlassPanel";
import { HeartButton } from "@/components/HeartButton";
import { LevelToggle } from "@/components/LevelToggle";
import { useMenuCounterRequired } from "@/context/MenuCounterContext";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import { burstWarmConfetti } from "@/lib/confettiBurst";
import { formatPrice } from "@/lib/storage";
import type { IceLevel, SweetnessLevel } from "@/lib/types";

interface CounterCheckoutPanelProps {
  compact?: boolean;
}

export function CounterCheckoutPanel({
  compact = false,
}: CounterCheckoutPanelProps) {
  const { activeDrink, checkoutOpen, closeCheckout } = useMenuCounterRequired();
  const { addToCart } = useShop();
  const { playPop } = useVibe();
  const [ice, setIce] = useState<IceLevel>("50%");
  const [sugar, setSugar] = useState<SweetnessLevel>("50%");
  const [added, setAdded] = useState(false);
  const [buttonPop, setButtonPop] = useState(false);

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    burstWarmConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    });
    setButtonPop(true);
    window.setTimeout(() => setButtonPop(false), 320);
    playPop();
    addToCart(activeDrink.id, ice, sugar);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <AnimatePresence>
      {checkoutOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCheckout}
            className={
              compact
                ? "fixed inset-0 z-[60] bg-[#3d3830]/25 backdrop-blur-[2px]"
                : "absolute inset-0 z-30 bg-[#3d3830]/15 backdrop-blur-[2px]"
            }
          />
          <motion.div
            initial={
              compact
                ? { opacity: 0, y: 48 }
                : { opacity: 0, x: 80 }
            }
            animate={
              compact ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }
            }
            exit={
              compact
                ? { opacity: 0, y: 36 }
                : { opacity: 0, x: 60 }
            }
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className={
              compact
                ? "fixed inset-x-3 z-[70] max-h-[min(78dvh,640px)] overflow-y-auto"
                : "absolute right-8 top-1/2 z-40 w-[min(360px,42vw)] -translate-y-1/2 max-lg:right-4 max-lg:w-[min(340px,88vw)]"
            }
            style={
              compact
                ? {
                    bottom:
                      "calc(4.35rem + env(safe-area-inset-bottom, 0px))",
                  }
                : undefined
            }
          >
            <GlassPanel className={compact ? "!p-4 sm:!p-6" : undefined}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2
                    className={`font-[family-name:var(--font-bubble)] font-bold text-[#3d3830] ${
                      compact ? "text-xl" : "text-2xl"
                    }`}
                  >
                    {activeDrink.name}
                  </h2>
                  <p className={`text-[#8b7a68] ${compact ? "text-xs" : "text-sm"}`}>
                    {activeDrink.vibe}
                  </p>
                </div>
                <HeartButton drinkId={activeDrink.id} />
              </div>

              <p
                className={`mt-3 leading-relaxed text-[#6b5d4f] ${
                  compact ? "text-sm" : "text-sm"
                }`}
              >
                {activeDrink.description}
              </p>
              <p
                className={`mt-3 font-bold text-[#c4842f] ${
                  compact ? "text-xl" : "mt-4 text-2xl"
                }`}
              >
                {formatPrice(activeDrink.price)}
              </p>

              <div className={`space-y-4 ${compact ? "mt-4" : "mt-6 space-y-5"}`}>
                <LevelToggle label="Ice Level" value={ice} onChange={setIce} />
                <LevelToggle
                  label="Sweetness"
                  value={sugar}
                  onChange={setSugar}
                />
              </div>

              <motion.button
                type="button"
                animate={{ scale: buttonPop ? [1, 0.9, 1.06, 1] : 1 }}
                transition={{ duration: 0.32 }}
                onClick={handleAdd}
                className={`btn-pill w-full font-semibold text-white ${
                  compact
                    ? "mt-5 px-5 py-3 text-sm"
                    : "mt-8 px-8 py-4 text-lg"
                } ${
                  added ? "bg-[#a8d5ba]" : "bg-[#f4a582] hover:bg-[#e8956f]"
                }`}
              >
                {added ? "Added to tote ✓" : "Add to Tote Bag"}
              </motion.button>

              <button
                type="button"
                onClick={closeCheckout}
                className="mt-3 w-full text-center font-mono text-[10px] uppercase tracking-widest text-[#8b7a68] transition hover:text-[#c4842f] sm:mt-4"
              >
                ← keep browsing
              </button>
            </GlassPanel>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
