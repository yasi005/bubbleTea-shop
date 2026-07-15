"use client";

import type { FlavorId } from "@/lib/types";

interface FlavorButtonsProps {
  activeFlavor: FlavorId;
  onSelect: (id: FlavorId) => void;
}

const FLAVORS: { id: FlavorId; label: string; color: string }[] = [
  { id: "brown-sugar", label: "Brown Sugar", color: "#C4842F" },
  { id: "matcha", label: "Matcha Latte", color: "#A8D5BA" },
  { id: "strawberry", label: "Strawberry Milk", color: "#F4B8C1" },
  { id: "mango", label: "Mango Sago", color: "#F5D76E" },
  { id: "peach", label: "Peach Oolong", color: "#F4A582" },
];

export function FlavorButtons({ activeFlavor, onSelect }: FlavorButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      {FLAVORS.map((flavor) => {
        const isActive = activeFlavor === flavor.id;
        return (
          <button
            key={flavor.id}
            type="button"
            onClick={() => onSelect(flavor.id)}
            className={`group flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
              isActive
                ? "border-transparent bg-white shadow-lg shadow-black/5"
                : "border-[#ead9c8]/80 bg-[#f5ebe0]/50 hover:bg-white/80"
            }`}
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white"
              style={{ backgroundColor: flavor.color }}
            />
            <span
              className={`font-[family-name:var(--font-quicksand)] text-base font-semibold ${
                isActive ? "text-[#4a3f35]" : "text-[#6b5d4f]"
              }`}
            >
              {flavor.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
