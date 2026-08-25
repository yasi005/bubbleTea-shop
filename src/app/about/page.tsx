"use client";

import Link from "next/link";

import { GlassPanel } from "@/components/GlassPanel";
import { useVibe } from "@/context/VibeContext";

export default function AboutPage() {
  const { isNight } = useVibe();

  return (
    <div
      className={`flex min-h-full items-center justify-center px-4 py-8 sm:px-8 sm:py-12 ${
        isNight ? "bg-[#2a2622]" : "bg-[#fdf8f0]"
      }`}
    >
      <GlassPanel className="w-full max-w-lg">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#b8956a]">
          Our Diary
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-bubble)] text-2xl font-bold text-[#3d3830] sm:mt-3 sm:text-4xl">
          The Recipe Book
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#6b5d4f] sm:mt-5 sm:text-base">
          We opened on a slow Sunday with one kettle, five flavors, and a porch
          that always catches the light just right. Every cup here is brewed like
          a love letter — warm, soft, and impossible to rush.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#6b5d4f] sm:mt-4 sm:text-base">
          Pin your favorites from The Fridge, brew your own at the counter, and
          shake your tote bag when you&apos;re ready to confirm. This little
          boutique is frontend engineering dressed up as a hug.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
          <Link
            href="/menu"
            className="btn-pill inline-flex bg-[#f4a582] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e8956f] sm:px-6 sm:py-3"
          >
            Visit The Fridge
          </Link>
          <Link
            href="/favorites"
            className="btn-pill inline-flex border border-[#ead9c8] px-5 py-2.5 text-sm font-semibold text-[#6b5d4f] hover:border-[#f4a582] sm:px-6 sm:py-3"
          >
            Saved Sips
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}
