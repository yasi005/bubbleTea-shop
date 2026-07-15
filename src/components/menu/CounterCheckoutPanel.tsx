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

export function CounterCheckoutPanel() {
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
            className="absolute inset-0 z-30 bg-[#3d3830]/15 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="absolute right-8 top-1/2 z-40 w-[min(360px,42vw)] -translate-y-1/2 max-lg:right-4 max-lg:w-[min(340px,88vw)]"
          >
            <GlassPanel>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-quicksand)] text-2xl font-bold text-[#3d3830]">
                    {activeDrink.name}
                  </h2>
                  <p className="text-sm text-[#8b7a68]">{activeDrink.vibe}</p>
                </div>
                <HeartButton drinkId={activeDrink.id} />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#6b5d4f]">
                {activeDrink.description}
              </p>
              <p className="mt-4 text-2xl font-bold text-[#c4842f]">
                {formatPrice(activeDrink.price)}
              </p>

              <div className="mt-6 space-y-5">
                <LevelToggle label="Ice Level" value={ice} onChange={setIce} />
                <LevelToggle label="Sweetness" value={sugar} onChange={setSugar} />
              </div>

              <motion.button
                type="button"
                animate={{ scale: buttonPop ? [1, 0.9, 1.06, 1] : 1 }}
                transition={{ duration: 0.32 }}
                onClick={handleAdd}
                className={`btn-pill mt-8 w-full px-8 py-4 text-lg font-semibold text-white ${
                  added ? "bg-[#a8d5ba]" : "bg-[#f4a582] hover:bg-[#e8956f]"
                }`}
              >
                {added ? "Added to tote ✓" : "Add to Tote Bag"}
              </motion.button>

              <button
                type="button"
                onClick={closeCheckout}
                className="mt-4 w-full text-center font-mono text-[10px] uppercase tracking-widest text-[#8b7a68] transition hover:text-[#c4842f]"
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
