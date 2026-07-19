"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { HeartButton } from "@/components/HeartButton";
import { useShop } from "@/context/ShopContext";
import { DRINKS } from "@/lib/drinks";
import { formatPrice } from "@/lib/storage";

export default function FavoritesPage() {
  const { favorites } = useShop();
  const favoriteDrinks = DRINKS.filter((drink) => favorites.includes(drink.id));

  if (favoriteDrinks.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center px-8">
        <div className="glass-panel max-w-md rounded-3xl p-10 text-center">
          <h1 className="font-[family-name:var(--font-quicksand)] text-3xl font-bold text-[#3d3830]">
            No hearts yet
          </h1>
          <p className="mt-3 text-[#6b5d4f]">
            Tap the heart on any drink to pin it here.
          </p>
          <Link
            href="/menu"
            className="btn-pill mt-8 inline-flex bg-[#f4a582] px-8 py-3 font-semibold text-white hover:bg-[#e8956f]"
          >
            Explore table
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full px-8 py-12">
      <div className="wood-table absolute inset-0 opacity-40" />
      <div className="relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#b8956a]">
          Pinned with love
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-quicksand)] text-4xl font-bold text-[#3d3830]">
          Your Hearts
        </h1>

        <div className="mt-10 flex flex-wrap gap-6">
          {favoriteDrinks.map((drink, index) => (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 20, rotate: index % 2 === 0 ? -4 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, rotate: 0 }}
              className="relative w-44"
            >
              <Link
                href={`/menu?drink=${drink.id}`}
                className="block rounded-sm bg-[#faf8f5] p-3 pb-8 shadow-warm-lg"
              >
                <div
                  className="flex h-32 items-center justify-center"
                  style={{
                    background: `linear-gradient(145deg, ${drink.color}44, #fdf8f0)`,
                  }}
                >
                  <div
                    className="h-20 w-14 rounded-b-xl rounded-t-sm"
                    style={{ backgroundColor: `${drink.liquidColor}99` }}
                  />
                </div>
                <p className="mt-2 text-center text-sm font-semibold text-[#3d3830]">
                  {drink.name}
                </p>
                <p className="text-center text-xs text-[#c4842f]">
                  {formatPrice(drink.price)}
                </p>
              </Link>
              <div className="absolute right-2 top-2">
                <HeartButton drinkId={drink.id} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
