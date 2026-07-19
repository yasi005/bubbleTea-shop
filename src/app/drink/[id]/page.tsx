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
import { getDrinkById } from "@/lib/drinks";
import { burstWarmConfetti } from "@/lib/confettiBurst";
import { formatPrice } from "@/lib/storage";
import type { IceLevel, SweetnessLevel } from "@/lib/types";

export default function DrinkPage() {
  const params = useParams<{ id: string }>();
  const drink = getDrinkById(params.id);
  const { addToCart } = useShop();
  const { playPop } = useVibe();
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
      <div className="relative h-[50vh] min-h-[360px] flex-1 lg:h-full">
        <BobaCanvas
          liquidColor={drink.liquidColor}
          interactive
          showParallax
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />
        <p className="absolute bottom-6 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-widest text-[#8b6f47]/80">
          drag to rotate
        </p>
      </div>

      <div className="flex flex-1 items-center px-6 py-10 lg:max-w-md lg:px-8">
        <GlassPanel className="w-full">
          <Link
            href="/menu"
            className="mb-4 inline-flex font-mono text-[10px] uppercase tracking-widest text-[#8b7a68] transition hover:text-[#c4842f]"
          >
            ← table
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-quicksand)] text-3xl font-bold text-[#3d3830]">
                {drink.name}
              </h1>
              <p className="mt-1 text-sm text-[#8b7a68]">{drink.vibe}</p>
            </div>
            <HeartButton drinkId={drink.id} />
          </div>

          <p className="mt-4 text-[#6b5d4f]">{drink.description}</p>

          <ul className="mt-4 space-y-1">
            {drink.notes.map((note) => (
              <li
                key={note}
                className="flex items-center gap-2 text-sm text-[#6b5d4f]"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: drink.color }}
                />
                {note}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-2xl font-bold text-[#c4842f]">
            {formatPrice(drink.price)}
          </p>

          <div className="mt-8 space-y-6">
            <LevelToggle label="Ice Level" value={ice} onChange={setIce} />
            <LevelToggle label="Sweetness" value={sugar} onChange={setSugar} />
          </div>

          <motion.button
            type="button"
            animate={{ scale: buttonPop ? [1, 0.9, 1.05, 1] : 1 }}
            transition={{ duration: 0.32 }}
            onClick={handleAdd}
            className={`btn-pill mt-8 w-full px-8 py-4 text-lg font-semibold text-white ${
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
