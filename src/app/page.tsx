"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

import { HomeBobaCanvas } from "@/components/home/HomeBobaCanvas";
import { FlavorButtons } from "@/components/FlavorButtons";
import { useVibe } from "@/context/VibeContext";
import { DRINKS } from "@/lib/drinks";
import type { FlavorId } from "@/lib/types";

export default function HomePage() {
  const { isNight } = useVibe();
  const [activeFlavor, setActiveFlavor] = useState<FlavorId>("brown-sugar");
  const [spinTrigger, setSpinTrigger] = useState(0);

  const activeDrink = DRINKS.find((d) => d.id === activeFlavor) ?? DRINKS[0];

  const handleFlavorSelect = (id: FlavorId) => {
    if (id !== activeFlavor) {
      setActiveFlavor(id);
      setSpinTrigger((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`relative flex min-h-full flex-col lg:h-full lg:flex-row ${
        isNight ? "bg-[#2a2622]" : "bg-[#fdf8f0]"
      }`}
    >
      <div className="relative h-[55vh] min-h-[380px] w-full flex-1 lg:h-full lg:min-h-[480px]">
        <HomeBobaCanvas
          liquidColor={activeDrink.liquidColor}
          spinTrigger={spinTrigger}
          showParallax
          className="absolute inset-0 h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#fdf8f0]/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col justify-center px-8 py-10 lg:max-w-md lg:px-10"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#b8956a]">
          Athens · hidden cafe energy
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-quicksand)] text-4xl font-bold leading-[1.1] text-[#3d3830] sm:text-5xl">
          Sip slowly.
          <br />
          <span className="text-[#f4a582]">Stay awhile.</span>
        </h1>
        <p className="mt-5 text-[#6b5d4f]">
          The cup lives here. Pick a flavor — watch it spin, slosh, and settle
          like something real.
        </p>

        <div className="mt-8">
          <FlavorButtons
            activeFlavor={activeFlavor}
            onSelect={handleFlavorSelect}
          />
        </div>

        <Link
          href={`/menu?drink=${activeFlavor}`}
          className="btn-pill mt-8 inline-flex w-fit items-center bg-[#c4842f] px-8 py-3.5 font-semibold text-white hover:bg-[#a86f25]"
        >
          Order {activeDrink.name}
        </Link>
      </motion.div>
    </div>
  );
}
