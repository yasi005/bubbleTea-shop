"use client";

import { useShop } from "@/context/ShopContext";
import type { FlavorId } from "@/lib/types";

interface HeartButtonProps {
  drinkId: FlavorId;
  className?: string;
}

export function HeartButton({ drinkId, className = "" }: HeartButtonProps) {
  const { isFavorite, toggleFavorite } = useShop();
  const filled = isFavorite(drinkId);

  return (
    <button
      type="button"
      aria-label={filled ? "Remove from favorites" : "Add to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(drinkId);
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm transition-transform active:scale-95 hover:scale-110 sm:h-9 sm:w-9 ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={filled ? "#F4A582" : "none"}
        stroke={filled ? "#F4A582" : "#8B6F47"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
