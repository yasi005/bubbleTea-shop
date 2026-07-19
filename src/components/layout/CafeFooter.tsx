"use client";

import Link from "next/link";

import { useVibe } from "@/context/VibeContext";

export function CafeFooter() {
  const { isNight } = useVibe();

  return (
    <footer
      className={`relative z-10 flex shrink-0 items-center justify-between gap-4 border-t border-dashed px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest ${
        isNight
          ? "border-[#3d3830] bg-[#2f2a26] text-[#a89888]"
          : "border-[#e8dcc8] bg-[#fdf8f0]/90 text-[#8b7a68]"
      }`}
    >
      <p className="truncate">
        🧋 Bubble Tea Boutique · brewed with love
      </p>
      <nav className="flex shrink-0 items-center gap-4">
        <Link href="/menu" className="transition hover:text-[#c4842f]">
          The Fridge
        </Link>
        <Link href="/brew" className="transition hover:text-[#c4842f]">
          Brew
        </Link>
        <span className={isNight ? "text-[#f4a582]" : "text-[#b8956a]"}>
          open dawn till dusk ☾
        </span>
      </nav>
    </footer>
  );
}
