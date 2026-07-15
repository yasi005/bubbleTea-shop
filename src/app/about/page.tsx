"use client";

import Link from "next/link";

import { GlassPanel } from "@/components/GlassPanel";
import { useVibe } from "@/context/VibeContext";

export default function AboutPage() {
  const { isNight } = useVibe();

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-8 py-12 ${
        isNight ? "bg-[#2a2622]" : "bg-[#fdf8f0]"
      }`}
    >
      <GlassPanel className="max-w-lg">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#b8956a]">
          📖 Our Diary
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-quicksand)] text-4xl font-bold text-[#3d3830]">
          The Recipe Book
        </h1>
        <p className="mt-5 leading-relaxed text-[#6b5d4f]">
          We opened on a slow Sunday with one kettle, five flavors, and a porch
          that always catches the light just right. Every cup here is brewed like
          a love letter — warm, soft, and impossible to rush.
        </p>
        <p className="mt-4 leading-relaxed text-[#6b5d4f]">
          Pin your favorites from The Fridge, brew your own at the counter, and
          shake your tote bag when you&apos;re ready to confirm. This little
          boutique is frontend engineering dressed up as a hug.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="btn-pill inline-flex bg-[#f4a582] px-6 py-3 font-semibold text-white hover:bg-[#e8956f]"
          >
            Visit The Fridge
          </Link>
          <Link
            href="/favorites"
            className="btn-pill inline-flex border border-[#ead9c8] px-6 py-3 font-semibold text-[#6b5d4f] hover:border-[#f4a582]"
          >
            💗 Saved Sips
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}
