"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import { isNavActive } from "@/lib/nav";

const TABS = [
  { href: "/", label: "Porch", emoji: "🏠" },
  { href: "/menu", label: "Fridge", emoji: "🧋" },
  { href: "/brew", label: "Brew", emoji: "✨" },
  { href: "/about", label: "Diary", emoji: "📖" },
  { href: "/basket", label: "Tote", emoji: "🧺" },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  const { basketCount, basketBump } = useShop();
  const { isNight, playBoing } = useVibe();

  return (
    <nav
      aria-label="Main"
      className={`fixed inset-x-0 bottom-0 z-50 border-t px-1 pt-1.5 max-[900px]:block min-[901px]:hidden ${
        isNight
          ? "border-[#3d3830] bg-[#2f2a26]/95 text-[#f5ebe0]"
          : "border-[#e8dcc8] bg-[#fdf8f0]/95 text-[#3d3830]"
      }`}
      style={{
        paddingBottom: "max(0.45rem, env(safe-area-inset-bottom))",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-0.5">
        {TABS.map((tab) => {
          const active = isNavActive(pathname, tab.href);
          const isTote = tab.href === "/basket";
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                onClick={() => {
                  if (!active) {
                    playBoing();
                  }
                }}
                className={`relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 transition-colors ${
                  active
                    ? isNight
                      ? "bg-[#3d3830] text-[#fdf8f0]"
                      : "bg-[#f5ebe0] text-[#3d3830]"
                    : isNight
                      ? "text-[#8b7a68] active:text-[#d4c4b0]"
                      : "text-[#8b7a68] active:text-[#6b5d4f]"
                }`}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 top-1 h-0.5 rounded-full bg-[#f4a582]"
                  />
                ) : null}
                {isTote ? (
                  <motion.span
                    key={basketBump}
                    initial={{ rotate: 0 }}
                    animate={
                      basketBump > 0
                        ? { rotate: [0, -18, 12, 0], scale: [1, 1.25, 1] }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.55 }}
                    className="relative text-lg leading-none"
                  >
                    {tab.emoji}
                    {basketCount > 0 ? (
                      <motion.span
                        key={`m-count-${basketBump}`}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: [0.6, 1.2, 1] }}
                        className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f4a582] px-1 text-[9px] font-bold text-white"
                      >
                        {basketCount}
                      </motion.span>
                    ) : null}
                  </motion.span>
                ) : (
                  <span className="text-lg leading-none">{tab.emoji}</span>
                )}
                <span
                  className={`font-[family-name:var(--font-quicksand)] text-[10px] font-semibold tracking-wide ${
                    active ? "text-inherit" : ""
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
