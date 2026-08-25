"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { BobaCanvas } from "@/components/BobaCanvas";
import { GlassPanel } from "@/components/GlassPanel";
import { HeartButton } from "@/components/HeartButton";
import { LevelToggle } from "@/components/LevelToggle";
import { PolaroidCard } from "@/components/menu/PolaroidCard";
import { useShop } from "@/context/ShopContext";
import { DRINKS } from "@/lib/drinks";
import { burstWarmConfetti } from "@/lib/confettiBurst";
import { POLAROID_LAYOUT } from "@/lib/polaroidLayout";
import { formatPrice } from "@/lib/storage";
import type { FlavorId, IceLevel, SweetnessLevel } from "@/lib/types";

export function PolaroidScatterMenu() {
  const { addToCart } = useShop();
  const [selectedId, setSelectedId] = useState<FlavorId | null>(null);
  const [ice, setIce] = useState<IceLevel>("50%");
  const [sugar, setSugar] = useState<SweetnessLevel>("50%");
  const [added, setAdded] = useState(false);
  const [buttonPop, setButtonPop] = useState(false);

  const selectedDrink = selectedId
    ? DRINKS.find((d) => d.id === selectedId)
    : null;

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedDrink) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    burstWarmConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    });

    setButtonPop(true);
    window.setTimeout(() => setButtonPop(false), 320);

    addToCart(selectedDrink.id, ice, sugar);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="relative h-full min-h-screen w-full overflow-hidden">
      <motion.div
        className="wood-table absolute inset-0"
        animate={{ opacity: selectedId ? 0 : 1, scale: selectedId ? 1.05 : 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative h-full min-h-screen w-full">
        {POLAROID_LAYOUT.map((layout) => {
          const drink = DRINKS.find((d) => d.id === layout.id);
          if (!drink) {
            return null;
          }
          const hidden = selectedId !== null && selectedId !== layout.id;
          if (hidden) {
            return null;
          }
          return (
            <PolaroidCard
              key={drink.id}
              drink={drink}
              left={layout.left}
              top={layout.top}
              rotate={layout.rotate}
              zIndex={layout.zIndex}
              expanded={selectedId === drink.id}
              onSelect={() =>
                setSelectedId((prev) => (prev === drink.id ? null : drink.id))
              }
            />
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDrink ? (
          <motion.div
            key="expanded-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center gap-8 px-8 py-12 max-lg:flex-col"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="pointer-events-auto h-[min(52vh,480px)] w-[min(42vw,420px)] max-lg:w-full"
            >
              <BobaCanvas
                liquidColor={selectedDrink.liquidColor}
                interactive
                showParallax
                className="h-full w-full rounded-3xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="pointer-events-auto w-[min(340px,90vw)]"
            >
              <GlassPanel>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-[family-name:var(--font-bubble)] text-2xl font-bold text-[#3d3830]">
                      {selectedDrink.name}
                    </h2>
                    <p className="text-sm text-[#8b7a68]">{selectedDrink.vibe}</p>
                  </div>
                  <HeartButton drinkId={selectedDrink.id} />
                </div>

                <p className="mt-3 text-sm text-[#6b5d4f]">
                  {selectedDrink.description}
                </p>
                <p className="mt-4 text-xl font-bold text-[#c4842f]">
                  {formatPrice(selectedDrink.price)}
                </p>

                <div className="mt-6 space-y-5">
                  <LevelToggle label="Ice Level" value={ice} onChange={setIce} />
                  <LevelToggle
                    label="Sweetness"
                    value={sugar}
                    onChange={setSugar}
                  />
                </div>

                <motion.button
                  type="button"
                  animate={{ scale: buttonPop ? [1, 0.92, 1.06, 1] : 1 }}
                  transition={{ duration: 0.32 }}
                  onClick={handleAdd}
                  className={`btn-pill mt-6 w-full px-6 py-3.5 font-semibold text-white ${
                    added ? "bg-[#a8d5ba]" : "bg-[#f4a582] hover:bg-[#e8956f]"
                  }`}
                >
                  {added ? "Added ✓" : "Add to Basket"}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mt-4 w-full text-center text-xs text-[#8b7a68] transition hover:text-[#c4842f]"
                >
                  ← back to table
                </button>
              </GlassPanel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!selectedId ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8b6f47]/70"
        >
          pick a polaroid
        </motion.p>
      ) : null}
    </div>
  );
}
