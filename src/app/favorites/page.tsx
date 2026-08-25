"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ToteCupThumb } from "@/components/basket/ToteCupThumb";
import { HeartButton } from "@/components/HeartButton";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import { useIsMobileShell } from "@/hooks/useMediaQuery";
import { DRINKS } from "@/lib/drinks";
import { formatPrice } from "@/lib/storage";

export default function FavoritesPage() {
  const { favorites } = useShop();
  const { isNight } = useVibe();
  const isMobile = useIsMobileShell();
  const favoriteDrinks = DRINKS.filter((drink) => favorites.includes(drink.id));

  const shell = isNight ? "bg-[#2a2622] text-[#f5ebe0]" : "bg-[#fdf8f0] text-[#3d3830]";
  const soft = isNight ? "text-[#d4c4b0]" : "text-[#6b5d4f]";

  if (favoriteDrinks.length === 0) {
    return (
      <div className={`flex min-h-full items-center justify-center px-4 py-10 ${shell}`}>
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex justify-center">
            <ToteCupThumb liquidColor="#ead9c8" accentColor="#f4a582" size="lg" />
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-bubble)] text-2xl font-bold sm:text-3xl">
            No hearts yet
          </h1>
          <p className={`mt-2 text-sm ${soft}`}>
            Tap the heart on any drink to pin it here.
          </p>
          <Link
            href="/menu"
            className="btn-pill mt-6 inline-flex bg-[#f4a582] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#e8956f]"
          >
            Explore The Fridge
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-full px-4 py-6 sm:px-8 sm:py-12 ${shell}`}>
      <div className="wood-table absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#b8956a]">
          Pinned with love
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-bubble)] text-2xl font-bold sm:text-4xl">
          Your Hearts
        </h1>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {favoriteDrinks.map((drink, index) => (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={isMobile ? undefined : { y: -6 }}
              transition={{ delay: index * 0.04 }}
              className="relative"
            >
              <Link
                href={`/menu?drink=${drink.id}`}
                className={`block rounded-[1.15rem] border p-2.5 pb-3 sm:rounded-2xl sm:p-3 sm:pb-4 ${
                  isNight
                    ? "border-[#5c4f42] bg-[#2f2a26]/85"
                    : "border-[#ead9c8]/70 bg-[#faf8f5]/95"
                }`}
              >
                <div className="flex justify-center py-1">
                  <ToteCupThumb
                    liquidColor={drink.liquidColor}
                    accentColor={drink.color}
                    size="md"
                  />
                </div>
                <p className="mt-1 truncate text-center font-[family-name:var(--font-bubble)] text-xs font-semibold sm:text-sm">
                  {drink.name}
                </p>
                <p className="text-center text-[11px] font-medium text-[#c4842f] sm:text-xs">
                  {formatPrice(drink.price)}
                </p>
              </Link>
              <div className="absolute right-1.5 top-1.5">
                <HeartButton drinkId={drink.id} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
