"use client";

import Link from "next/link";

import { HeartButton } from "@/components/HeartButton";
import { formatPrice } from "@/lib/storage";
import type { Drink } from "@/lib/types";

interface DrinkCardProps {
  drink: Drink;
}

export function DrinkCard({ drink }: DrinkCardProps) {
  return (
    <Link
      href={`/drink/${drink.id}`}
      className="card-warm group relative flex flex-col overflow-hidden"
    >
      <div className="absolute right-4 top-4 z-10">
        <HeartButton drinkId={drink.id} />
      </div>

      <div
        className="flex h-48 items-center justify-center"
        style={{
          background: `linear-gradient(160deg, ${drink.color}33 0%, #fdf8f0 70%)`,
        }}
      >
        <div
          className="relative h-32 w-24 rounded-b-3xl rounded-t-lg border-2 border-white/60 shadow-inner"
          style={{ backgroundColor: `${drink.liquidColor}88` }}
        >
          <div className="absolute -top-3 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-white/80" />
          <div className="absolute -right-1 top-6 h-16 w-1.5 rotate-12 rounded-full bg-white/70" />
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-[#4a3f35]/60"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-bubble)] text-lg font-bold text-[#4a3f35]">
          {drink.name}
        </h3>
        <p className="mt-1 flex-1 text-sm text-[#6b5d4f] line-clamp-2">
          {drink.description}
        </p>
        <p className="mt-3 font-semibold text-[#c4842f]">
          {formatPrice(drink.price)}
        </p>
      </div>
    </Link>
  );
}
