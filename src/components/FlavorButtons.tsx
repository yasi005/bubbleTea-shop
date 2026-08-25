"use client";

import type { FlavorId } from "@/lib/types";

interface FlavorButtonsProps {
  activeFlavor: FlavorId;
  onSelect: (id: FlavorId) => void;
}

const FLAVORS: { id: FlavorId; label: string; short: string; color: string }[] =
  [
    { id: "brown-sugar", label: "Brown Sugar", short: "Brown Sugar", color: "#C4842F" },
    { id: "matcha", label: "Matcha Latte", short: "Matcha", color: "#A8D5BA" },
    { id: "strawberry", label: "Strawberry Milk", short: "Strawberry", color: "#F4B8C1" },
    { id: "mango", label: "Mango Sago", short: "Mango", color: "#F5D76E" },
    { id: "peach", label: "Peach Oolong", short: "Peach", color: "#F4A582" },
  ];

export function FlavorButtons({ activeFlavor, onSelect }: FlavorButtonsProps) {
  return (
    <>
      {/* Phone: compact chip row */}
      <div className="no-scrollbar -mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-0.5 max-[900px]:flex min-[901px]:hidden">
        {FLAVORS.map((flavor) => {
          const isActive = activeFlavor === flavor.id;
          return (
            <button
              key={flavor.id}
              type="button"
              onClick={() => onSelect(flavor.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                isActive
                  ? "border-transparent text-white shadow-sm"
                  : "border-[#e0cdb4] bg-white/50 text-[#6b5d4f] active:bg-white/80"
              }`}
              style={
                isActive ? { backgroundColor: flavor.color } : undefined
              }
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.9)"
                    : flavor.color,
                }}
              />
              {flavor.short}
            </button>
          );
        })}
      </div>

      {/* Desktop: stacked flavor rows */}
      <div className="hidden flex-col gap-2 min-[901px]:flex">
        {FLAVORS.map((flavor) => {
          const isActive = activeFlavor === flavor.id;
          return (
            <button
              key={flavor.id}
              type="button"
              onClick={() => onSelect(flavor.id)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                isActive
                  ? "border-transparent bg-white shadow-md shadow-black/5"
                  : "border-[#ead9c8]/80 bg-[#f5ebe0]/50 hover:bg-white/80"
              }`}
            >
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white"
                style={{ backgroundColor: flavor.color }}
              />
              <span
                className={`font-[family-name:var(--font-quicksand)] text-sm font-semibold ${
                  isActive ? "text-[#4a3f35]" : "text-[#6b5d4f]"
                }`}
              >
                {flavor.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
