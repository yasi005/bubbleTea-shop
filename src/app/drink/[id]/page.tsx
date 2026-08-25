"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import { BobaCanvas } from "@/components/BobaCanvas";
import { GlassPanel } from "@/components/GlassPanel";
import { HeartButton } from "@/components/HeartButton";
import { LevelToggle } from "@/components/LevelToggle";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import { useIsMobileShell } from "@/hooks/useMediaQuery";
import { getDrinkById } from "@/lib/drinks";
import { burstWarmConfetti } from "@/lib/confettiBurst";
import { formatPrice } from "@/lib/storage";
import type { IceLevel, SweetnessLevel } from "@/lib/types";

export default function DrinkPage() {
  const params = useParams<{ id: string }>();
  const drink = getDrinkById(params.id);
  const { addToCart } = useShop();
  const { playPop } = useVibe();
  const isMobile = useIsMobileShell();
  const [ice, setIce] = useState<IceLevel>("50%");
  const [sugar, setSugar] = useState<SweetnessLevel>("50%");
  const [added, setAdded] = useState(false);
  const [buttonPop, setButtonPop] = useState(false);

  if (!drink) {
    notFound();
  }

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    burstWarmConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    });
    setButtonPop(true);
    window.setTimeout(() => setButtonPop(false), 320);
    playPop();
    addToCart(drink.id, ice, sugar);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="relative flex min-h-full flex-col lg:h-full lg:flex-row">
      <div className="relative h-[38vh] min-h-[220px] flex-1 max-[900px]:max-h-[42vh] lg:h-full lg:min-h-0 lg:max-h-none">
        <BobaCanvas
          liquidColor={drink.liquidColor}
          interactive={!isMobile}
          showParallax={!isMobile}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />
        {!isMobile ? (
          <p className="absolute bottom-6 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-widest text-[#8b6f47]/80">
            drag to rotate
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 items-center px-4 py-5 sm:px-6 sm:py-10 lg:max-w-md lg:px-8">
        <GlassPanel className="w-full">
          <Link
            href="/menu"
            className="mb-3 inline-flex font-mono text-[10px] uppercase tracking-widest text-[#8b7a68] transition hover:text-[#c4842f] sm:mb-4"
          >
            ← The Fridge
          </Link>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-[family-name:var(--font-bubble)] text-2xl font-bold text-[#3d3830] sm:text-3xl">
                {drink.name}
              </h1>
              <p className="mt-0.5 text-xs text-[#8b7a68] sm:text-sm">
                {drink.vibe}
              </p>
            </div>
            <HeartButton drinkId={drink.id} />
          </div>

          <p className="mt-3 text-sm text-[#6b5d4f] sm:mt-4 sm:text-base">
            {drink.description}
          </p>

          <ul className="mt-3 space-y-1 sm:mt-4">
            {drink.notes.map((note) => (
              <li
                key={note}
                className="flex items-center gap-2 text-xs text-[#6b5d4f] sm:text-sm"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: drink.color }}
                />
                {note}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xl font-bold text-[#c4842f] sm:mt-6 sm:text-2xl">
            {formatPrice(drink.price)}
          </p>

          <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
            <LevelToggle label="Ice Level" value={ice} onChange={setIce} />
            <LevelToggle label="Sweetness" value={sugar} onChange={setSugar} />
          </div>

          <motion.button
            type="button"
            animate={{ scale: buttonPop ? [1, 0.9, 1.05, 1] : 1 }}
            transition={{ duration: 0.32 }}
            onClick={handleAdd}
            className={`btn-pill mt-5 w-full px-6 py-3 text-sm font-semibold text-white sm:mt-8 sm:px-8 sm:py-4 sm:text-lg ${
              added ? "bg-[#a8d5ba]" : "bg-[#f4a582] hover:bg-[#e8956f]"
            }`}
          >
            {added ? "Added to tote ✓" : "Add to Tote Bag"}
          </motion.button>
        </GlassPanel>
      </div>
    </div>
  );
}
