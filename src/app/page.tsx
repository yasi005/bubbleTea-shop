"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { HomeBobaCanvas } from "@/components/home/HomeBobaCanvas";
import { useVibe } from "@/context/VibeContext";
import { useIsMobileShell } from "@/hooks/useMediaQuery";
import { DRINKS } from "@/lib/drinks";
import type { FlavorId } from "@/lib/types";

export default function HomePage() {
  const { isNight } = useVibe();
  const isMobile = useIsMobileShell();
  const [activeFlavor, setActiveFlavor] = useState<FlavorId>("peach");
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
      className={`relative h-full min-h-0 overflow-hidden overscroll-none touch-none ${
        isNight ? "bg-[#2a2622]" : "bg-[#f3e6d6]"
      }`}
    >
      {/* Warm porch atmosphere — fixed on phone so it fills the whole screen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 max-[900px]:fixed max-[900px]:inset-0 max-[900px]:z-0"
        style={{
          background: isNight
            ? "radial-gradient(ellipse 80% 70% at 55% 35%, #3d322c 0%, #2a2622 62%, #221e1b 100%)"
            : "radial-gradient(ellipse 90% 75% at 58% 28%, #fff3e4 0%, #f5e4d0 42%, #e8d2b8 100%)",
        }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[42%] max-[900px]:fixed max-[900px]:z-0 ${
          isNight
            ? "bg-gradient-to-t from-[#1f1b18] via-[#2a2622]/80 to-transparent"
            : "bg-gradient-to-t from-[#dfc7a8]/90 via-[#ead5bc]/45 to-transparent"
        }`}
      />

      {/* Full-bleed cup */}
      <div className="absolute inset-0 z-[1]">
        <HomeBobaCanvas
          liquidColor={activeDrink.liquidColor}
          spinTrigger={spinTrigger}
          showParallax={false}
          cozy
          className="absolute inset-0 h-full w-full"
        />
      </div>

      {/* Soft light wash */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[2] max-[900px]:fixed max-[900px]:inset-0 ${
          isNight
            ? "bg-gradient-to-t from-[#1c1916]/85 via-[#2a2622]/15 to-transparent max-[900px]:from-[#1c1916]/90"
            : "bg-gradient-to-t from-[#e8d4b8]/80 via-[#f5e6d4]/10 to-transparent max-[900px]:from-[#e4cfb2]/88"
        }`}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pt-8 max-[900px]:pb-[calc(var(--mobile-tab-inset)+0.75rem)] sm:px-8 sm:pb-8 lg:justify-between lg:px-12 lg:pb-10 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.38em] ${
              isNight ? "text-[#c4a484]" : "text-[#9a7d5c]"
            }`}
          >
            The Porch
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.34em] lg:hidden ${
              isNight ? "text-[#c4a484]" : "text-[#9a7d5c]"
            }`}
          >
            The Porch
          </p>

          <h1
            className={`mt-2 font-[family-name:var(--font-bubble)] text-[2.35rem] font-bold leading-[0.98] tracking-tight sm:text-5xl lg:mt-0 lg:text-6xl ${
              isNight ? "text-[#f7efe4]" : "text-[#3d3228]"
            }`}
          >
            Bubble Tea
            <br />
            <span className={isNight ? "text-[#f4a582]" : "text-[#c4842f]"}>
              Boutique
            </span>
          </h1>

          <motion.p
            key={activeDrink.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`mt-3 max-w-sm text-sm leading-relaxed sm:mt-4 sm:text-[15px] ${
              isNight ? "text-[#d8c6b2]" : "text-[#6b5746]"
            }`}
          >
            Late light on the counter.{" "}
            <span className="font-medium" style={{ color: activeDrink.color }}>
              {activeDrink.name}
            </span>{" "}
            waiting soft and cold. Come sit a minute.
          </motion.p>

          <div className="mt-5 flex items-center gap-2 sm:mt-6">
            {DRINKS.map((drink) => {
              const active = drink.id === activeFlavor;
              return (
                <button
                  key={drink.id}
                  type="button"
                  aria-label={drink.name}
                  aria-pressed={active}
                  onClick={() => handleFlavorSelect(drink.id)}
                  className={`relative h-3 w-3 rounded-full transition-transform active:scale-90 sm:h-3.5 sm:w-3.5 ${
                    active ? "scale-125 ring-2 ring-white/80" : "opacity-70"
                  }`}
                  style={{ backgroundColor: drink.color }}
                />
              );
            })}
            <AnimatePresence mode="wait">
              <motion.span
                key={activeDrink.id}
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className={`ml-1 font-mono text-[10px] uppercase tracking-[0.22em] ${
                  isNight ? "text-[#b89a78]" : "text-[#8b6f47]"
                }`}
              >
                {activeDrink.name}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-7">
            <Link
              href={`/menu?drink=${activeFlavor}`}
              className="btn-pill inline-flex items-center bg-[#c4842f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a86f25] sm:px-6 sm:py-3"
            >
              Step into The Fridge
            </Link>
            {!isMobile ? (
              <Link
                href="/brew"
                className={`font-mono text-[10px] uppercase tracking-[0.28em] transition hover:text-[#c4842f] ${
                  isNight ? "text-[#c4a484]" : "text-[#8b6f47]"
                }`}
              >
                or brew your own →
              </Link>
            ) : (
              <Link
                href="/brew"
                className={`text-xs font-medium ${
                  isNight ? "text-[#c4a484]" : "text-[#8b6f47]"
                }`}
              >
                Brew your own →
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
