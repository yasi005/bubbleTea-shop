"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { GlassPanel } from "@/components/GlassPanel";
import { useVibe } from "@/context/VibeContext";

const ENTRIES = [
  {
    date: "Sunday · Opening Day",
    title: "One kettle, five flavors",
    body: "We unlocked the porch before the sun finished warming the floorboards. One kettle sang on the counter. Five syrups waited in little bottles like secrets. The first cup was peach — soft, a little too sweet, perfect.",
  },
  {
    date: "Tuesday · The Fridge",
    title: "Polaroids on the wood",
    body: "Menus felt cold, so we scattered drinks across the counter instead. Each polaroid is a memory you can pick up: mango that tastes like late afternoon, matcha that smells like rain on green leaves, strawberry that laughs.",
  },
  {
    date: "Friday · The Brew Bar",
    title: "Nothing faked",
    body: "Pearls fall. Ice clinks. The lid snaps and the straw finds its place. We built a counter where you brew from nothing — not a form, not a dropdown, just the quiet ritual of making something yours.",
  },
  {
    date: "Night shift",
    title: "Soft lights, softer sounds",
    body: "Flip to night and the shop exhales. ASMR lives behind a toggle: pours that glug, cubes that kiss the glass, a mascot that boings when you poke them. Everything is off until you ask for it. We prefer hush by default.",
  },
  {
    date: "Always · Closing note",
    title: "A hug in code",
    body: "Pin what you love. Shake the tote when you’re ready. This boutique is frontend engineering dressed up as a hug — warm browns, peach shadows, and nothing that snaps. Only settles.",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutPage() {
  const { isNight } = useVibe();

  const muted = isNight ? "text-[#c4b4a0]" : "text-[#6b5d4f]";
  const ink = isNight ? "text-[#f5ebe0]" : "text-[#3d3830]";
  const label = isNight ? "text-[#e8b896]" : "text-[#b8956a]";
  const rule = isNight ? "border-[#4a4038]" : "border-[#ead9c8]";
  const secondaryBtn = isNight
    ? "border border-[#5a4e42] text-[#d4c4b0] hover:border-[#f4a582]"
    : "border border-[#ead9c8] text-[#6b5d4f] hover:border-[#f4a582]";

  return (
    <div
      className={`relative min-h-full overflow-hidden ${
        isNight ? "bg-[#2a2622]" : "bg-[#fdf8f0]"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: isNight
            ? "radial-gradient(ellipse 85% 60% at 50% 0%, #3d322c 0%, #2a2622 55%, #221e1b 100%)"
            : "radial-gradient(ellipse 90% 65% at 50% 0%, #fff6ea 0%, #fdf8f0 48%, #f3e6d6 100%)",
        }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full blur-3xl ${
          isNight ? "bg-[#f4a582]/10" : "bg-[#f4a582]/20"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-16 bottom-32 h-56 w-56 rounded-full blur-3xl ${
          isNight ? "bg-[#a8d5ba]/8" : "bg-[#a8d5ba]/25"
        }`}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
        >
          <GlassPanel className="w-full">
            <p
              className={`font-mono text-[10px] uppercase tracking-[0.32em] ${label}`}
            >
              Our Diary
            </p>
            <h1
              className={`mt-2 font-[family-name:var(--font-bubble)] text-3xl font-bold sm:mt-3 sm:text-5xl ${ink}`}
            >
              Pages from the porch
            </h1>
            <p
              className={`mt-4 max-w-prose text-sm leading-relaxed sm:mt-5 sm:text-base ${muted}`}
            >
              Not a manifesto — a scrapbook. Notes from the Sundays we opened,
              the Tuesday we invented The Fridge, and the night we learned that
              ice sounds better than silence.
            </p>
          </GlassPanel>
        </motion.div>

        <ol className="flex flex-col gap-4 sm:gap-5">
          {ENTRIES.map((entry, index) => (
            <motion.li
              key={entry.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.08 + index * 0.07,
                ease,
              }}
            >
              <GlassPanel className="w-full">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={`font-mono text-[10px] uppercase tracking-[0.28em] ${label}`}
                  >
                    {entry.date}
                  </p>
                  <span
                    aria-hidden
                    className={`font-[family-name:var(--font-bubble)] text-lg leading-none ${
                      isNight ? "text-[#f4a582]/45" : "text-[#f4a582]/55"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2
                  className={`mt-2 font-[family-name:var(--font-bubble)] text-xl font-bold sm:text-2xl ${ink}`}
                >
                  {entry.title}
                </h2>
                <div className={`mt-3 border-t pt-3 sm:mt-4 sm:pt-4 ${rule}`} />
                <p
                  className={`text-sm leading-relaxed sm:text-base ${muted}`}
                >
                  {entry.body}
                </p>
              </GlassPanel>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5, ease }}
          className="flex flex-wrap gap-2 pb-4 sm:gap-3"
        >
          <Link
            href="/menu"
            className="btn-pill inline-flex bg-[#f4a582] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e8956f] sm:px-6 sm:py-3"
          >
            Visit The Fridge
          </Link>
          <Link
            href="/brew"
            className={`btn-pill inline-flex px-5 py-2.5 text-sm font-semibold sm:px-6 sm:py-3 ${secondaryBtn}`}
          >
            Brew Your Own
          </Link>
          <Link
            href="/favorites"
            className={`btn-pill inline-flex px-5 py-2.5 text-sm font-semibold sm:px-6 sm:py-3 ${secondaryBtn}`}
          >
            Saved Sips
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
