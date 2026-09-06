"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useVibe } from "@/context/VibeContext";

const PAGES = [
  {
    date: "Opening Sunday",
    accent: "#f4a582",
    title: "hello, porch",
    lines: [
      "Unlocked the door before the kettle woke up.",
      "Five little syrups lined up like shy friends.",
      "First pour: peach. A little too sweet. Perfect.",
    ],
  },
  {
    date: "Fridge Day",
    accent: "#f5d76e",
    title: "polaroid picnic",
    lines: [
      "Menus felt too serious, so we scattered cups instead.",
      "Mango giggles. Matcha whispers. Strawberry waves hello.",
      "Pick one up — it’s already yours.",
    ],
  },
  {
    date: "Brew Night",
    accent: "#c4842f",
    title: "nothing faked",
    lines: [
      "Pearls tumble in like tiny moons.",
      "Ice kisses the glass. Lid snaps. Straw finds home.",
      "Brew from nothing. Sip something soft.",
    ],
  },
  {
    date: "Quiet Hours",
    accent: "#a8d5ba",
    title: "soft sounds only",
    lines: [
      "Night shift dims the lights and slows the air.",
      "ASMR waits behind a tiny toggle — hush by default.",
      "Poke the mascot. They boing. Of course they do.",
    ],
  },
  {
    date: "Always",
    accent: "#f4b8c1",
    title: "a hug in code",
    lines: [
      "Warm browns. Peach shadows. Nothing that snaps.",
      "Pin what you love. Shake the tote when you’re ready.",
      "This shop is engineering dressed as a squeeze.",
    ],
  },
] as const;

const STICKERS = [
  { label: "sip!", rotate: -12, x: "5%", y: "16%", color: "#f4a582" },
  { label: "♡", rotate: 8, x: "90%", y: "20%", color: "#f4b8c1" },
  { label: "pearl", rotate: -6, x: "8%", y: "74%", color: "#c4842f" },
  { label: "yum", rotate: 14, x: "86%", y: "70%", color: "#a8d5ba" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function CupDoodle({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 72 88"
      className="h-16 w-14 sm:h-20 sm:w-[4.5rem]"
      aria-hidden
    >
      <ellipse cx="36" cy="78" rx="22" ry="5" fill={color} opacity="0.25" />
      <path
        d="M18 22h36l-4 48c-1 10-10 14-14 14s-13-4-14-14L18 22z"
        fill={color}
        opacity="0.55"
      />
      <path
        d="M22 28h28l-3.2 38c-.7 7-7 10-10.8 10s-10.1-3-10.8-10L22 28z"
        fill="#fffaf3"
        opacity="0.55"
      />
      <rect x="30" y="8" width="4" height="18" rx="2" fill={color} opacity="0.7" />
      <path
        d="M54 30c8 2 12 10 8 18s-14 8-16 4"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="28" cy="52" r="3.2" fill="#3d3830" opacity="0.35" />
      <circle cx="38" cy="58" r="2.6" fill="#3d3830" opacity="0.3" />
      <circle cx="33" cy="64" r="2.2" fill="#3d3830" opacity="0.28" />
    </svg>
  );
}

function HeartDoodle({ color }: { color: string }) {
  return (
    <motion.span
      aria-hidden
      className="absolute right-6 top-5 hidden sm:block"
      animate={{ y: [0, -4, 0], rotate: [8, 12, 8] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 28 26" className="h-6 w-7">
        <path
          d="M14 23s-10-6.2-10-13A5.5 5.5 0 0 1 14 7a5.5 5.5 0 0 1 10 3c0 6.8-10 13-10 13z"
          fill={color}
          opacity="0.85"
        />
      </svg>
    </motion.span>
  );
}

export default function AboutPage() {
  const { isNight } = useVibe();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const page = PAGES[index];
  const ink = isNight ? "text-[#f5ebe0]" : "text-[#3d3830]";
  const muted = isNight ? "text-[#c4b4a0]" : "text-[#6b5d4f]";
  const paper = isNight ? "bg-[#342e29]" : "bg-[#fffaf3]";
  const paperShadow = isNight
    ? "shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
    : "shadow-[0_18px_44px_rgba(196,132,47,0.18)]";
  const gutter = isNight ? "border-[#4a4038]" : "border-[#f0e2d2]";
  const tape = isNight ? "bg-[#f4a582]/55" : "bg-[#f4d4b8]/90";

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col overflow-hidden ${
        isNight ? "bg-[#2a2622]" : "bg-[#f7ecdf]"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: isNight
            ? "radial-gradient(ellipse 80% 70% at 50% 40%, #3a322c 0%, #2a2622 70%)"
            : "radial-gradient(ellipse 85% 75% at 50% 35%, #fff6ea 0%, #f7ecdf 55%, #ebd9c4 100%)",
        }}
      />
      <div
        aria-hidden
        className="wood-table pointer-events-none absolute inset-x-0 bottom-0 h-[38%] opacity-25"
      />

      {STICKERS.map((sticker, i) => (
        <motion.span
          key={sticker.label}
          aria-hidden
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { delay: 0.15 + i * 0.07, duration: 0.4 },
            scale: { delay: 0.15 + i * 0.07, duration: 0.4 },
            y: {
              delay: 0.5 + i * 0.12,
              duration: 3.5 + i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="pointer-events-none absolute z-[5] hidden select-none font-[family-name:var(--font-bubble)] text-sm font-bold lg:inline-block"
          style={{ left: sticker.x, top: sticker.y, color: sticker.color }}
        >
          <span
            className={`inline-block px-3 py-1 ${
              isNight ? "bg-[#2f2a26]/80" : "bg-white/75"
            }`}
            style={{
              transform: `rotate(${sticker.rotate}deg)`,
              borderRadius: "999px",
            }}
          >
            {sticker.label}
          </span>
        </motion.span>
      ))}

      <div className="relative z-10 flex h-full min-h-0 flex-col px-4 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="shrink-0 text-center"
        >
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.32em] ${
              isNight ? "text-[#e8b896]" : "text-[#b8956a]"
            }`}
          >
            Our Diary
          </p>
          <h1
            className={`mt-0.5 font-[family-name:var(--font-bubble)] text-2xl font-bold sm:text-3xl lg:text-[2.35rem] ${ink}`}
          >
            little shop notes
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease }}
          className="relative mx-auto mt-2 flex min-h-0 w-full max-w-5xl flex-1 items-stretch justify-center sm:mt-3"
        >
          <div
            className={`relative flex h-full w-full max-h-full overflow-hidden rounded-[1.35rem] sm:rounded-[1.85rem] ${paper} ${paperShadow}`}
          >
            {/* Spine */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 lg:block"
              style={{
                background: isNight
                  ? "linear-gradient(to bottom, transparent, #5a4e42, transparent)"
                  : "linear-gradient(to bottom, transparent, #e2cbb3, transparent)",
              }}
            />
            <div
              aria-hidden
              className={`absolute inset-y-4 left-1/2 z-10 hidden w-7 -translate-x-1/2 rounded-full opacity-35 lg:block ${
                isNight ? "bg-[#1f1b18]" : "bg-[#e8d5c0]"
              }`}
            />

            {/* Washi tape */}
            <span
              aria-hidden
              className={`absolute left-[18%] top-0 z-30 h-3 w-24 -translate-y-1/2 rotate-[-8deg] rounded-sm sm:w-28 ${tape}`}
            />
            <span
              aria-hidden
              className={`absolute right-[16%] top-0 z-30 h-3 w-20 -translate-y-1/2 rotate-[10deg] rounded-sm sm:w-24 ${
                isNight ? "bg-[#a8d5ba]/45" : "bg-[#cfe8d8]/95"
              }`}
            />

            <HeartDoodle color={page.accent} />

            {/* Left page */}
            <div
              className={`relative flex w-full flex-col justify-between p-5 sm:p-7 lg:w-1/2 lg:border-r lg:p-8 xl:p-9 ${gutter}`}
            >
              <div>
                <CupDoodle color={page.accent} />
                <p
                  className={`mt-3 font-mono text-[10px] uppercase tracking-[0.28em] ${
                    isNight ? "text-[#e8b896]" : "text-[#b8956a]"
                  }`}
                >
                  {page.date}
                </p>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={page.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease }}
                    className={`mt-1.5 font-[family-name:var(--font-bubble)] text-3xl font-bold leading-tight sm:text-4xl ${ink}`}
                  >
                    {page.title}
                  </motion.h2>
                </AnimatePresence>
                <p
                  className={`mt-3 max-w-[17rem] text-sm leading-relaxed ${muted}`}
                >
                  Flip the scrapbook — tiny porch days, written soft.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2">
                {PAGES.map((p, i) => (
                  <button
                    key={p.title}
                    type="button"
                    aria-label={`Open page ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => go(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-7 bg-[#f4a582]"
                        : isNight
                          ? "w-2.5 bg-[#5a4e42] hover:bg-[#f4a582]/60"
                          : "w-2.5 bg-[#e8d5c0] hover:bg-[#f4a582]/70"
                    }`}
                  />
                ))}
              </div>

              {/* Mobile lined notes */}
              <div className="relative mt-5 border-t pt-4 lg:hidden" style={{ borderColor: isNight ? "#4a4038" : "#f0e2d2" }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={page.title}
                    custom={direction}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease }}
                    className="space-y-3"
                  >
                    {page.lines.map((lineText) => (
                      <p
                        key={lineText}
                        className={`font-[family-name:var(--font-bubble)] text-base leading-relaxed sm:text-lg ${ink}`}
                      >
                        {lineText}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right page — lined paper */}
            <div className="relative hidden w-1/2 flex-col lg:flex">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  backgroundImage: isNight
                    ? "repeating-linear-gradient(transparent, transparent 27px, rgba(184,149,106,0.18) 28px)"
                    : "repeating-linear-gradient(transparent, transparent 27px, rgba(232,213,192,0.85) 28px)",
                  backgroundPosition: "0 2.5rem",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-8 right-8 h-16 w-16 rounded-full opacity-30"
                style={{
                  background: `radial-gradient(circle at 35% 30%, #fff8, transparent 45%), ${page.accent}`,
                }}
              />
              <div className="relative flex h-full flex-col justify-center px-8 py-8 xl:px-10">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={page.title}
                    custom={direction}
                    initial={{ opacity: 0, x: direction >= 0 ? 24 : -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction >= 0 ? -16 : 16 }}
                    transition={{ duration: 0.32, ease }}
                    className="space-y-5"
                  >
                    {page.lines.map((lineText) => (
                      <p
                        key={lineText}
                        className={`font-[family-name:var(--font-bubble)] text-[1.35rem] leading-[1.85] xl:text-[1.45rem] ${ink}`}
                      >
                        {lineText}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>
                <p
                  className={`mt-8 font-mono text-[10px] uppercase tracking-[0.28em] ${
                    isNight ? "text-[#a89888]" : "text-[#b8956a]"
                  }`}
                >
                  page {String(index + 1).padStart(2, "0")} / 0{PAGES.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2.5 flex shrink-0 flex-wrap items-center justify-center gap-2 sm:mt-3 sm:gap-2.5"
        >
          <button
            type="button"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            className={`btn-pill px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35 ${
              isNight
                ? "border border-[#5a4e42] text-[#d4c4b0]"
                : "border border-[#ead9c8] text-[#6b5d4f]"
            }`}
          >
            ← prev
          </button>
          <button
            type="button"
            disabled={index === PAGES.length - 1}
            onClick={() => go(index + 1)}
            className={`btn-pill px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35 ${
              isNight
                ? "border border-[#5a4e42] text-[#d4c4b0]"
                : "border border-[#ead9c8] text-[#6b5d4f]"
            }`}
          >
            next →
          </button>
          <Link
            href="/menu"
            className="btn-pill inline-flex bg-[#f4a582] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e8956f]"
          >
            Visit The Fridge
          </Link>
          <Link
            href="/brew"
            className={`btn-pill inline-flex px-5 py-2 text-sm font-semibold ${
              isNight
                ? "border border-[#5a4e42] text-[#d4c4b0] hover:border-[#f4a582]"
                : "border border-[#ead9c8] text-[#6b5d4f] hover:border-[#f4a582]"
            }`}
          >
            Brew Your Own
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
