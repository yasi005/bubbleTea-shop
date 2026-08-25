"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { SidebarMascot } from "@/components/nav/SidebarMascot";
import { WigglyText } from "@/components/nav/WigglyText";
import { useMenuCounter } from "@/context/MenuCounterContext";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import { DRINKS, getDrinkById } from "@/lib/drinks";
import { isNavActive, NAV_LINKS } from "@/lib/nav";
import { formatPrice } from "@/lib/storage";

export function CafeReceiptSidebar() {
  const pathname = usePathname();
  const { userName, basket, cartTotal, basketCount, basketBump } = useShop();
  const menuCounter = useMenuCounter();
  const { isNight, soundsEnabled, toggleMode, toggleSounds, playBoing, playIce } =
    useVibe();
  const onMenu = pathname === "/menu";

  return (
    <aside
      className={`receipt-sidebar no-scrollbar relative hidden h-screen w-[25%] min-w-[260px] max-w-[320px] shrink-0 flex-col overflow-y-auto border-r px-6 py-8 min-[901px]:flex ${
        isNight
          ? "border-[#3d3830] bg-[#2f2a26] text-[#f5ebe0]"
          : "border-[#e8dcc8]"
      }`}
    >
      <div className="receipt-grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10">
        <p
          className={`font-[family-name:var(--font-quicksand)] text-[10px] font-bold uppercase tracking-[0.35em] ${
            isNight ? "text-[#f4a582]" : "text-[#b8956a]"
          }`}
        >
          Bubble Tea Boutique
        </p>
        <p className={`mt-2 font-mono text-xs ${isNight ? "text-[#a89888]" : "text-[#8b7a68]"}`}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        {userName ? (
          <p className={`mt-4 text-sm ${isNight ? "text-[#d4c4b0]" : "text-[#6b5d4f]"}`}>
            Serving{" "}
            <span className="font-semibold text-[#f4a582]">{userName}</span>
          </p>
        ) : null}
      </div>

      <nav className="relative z-10 mt-10 flex flex-col gap-1">
        {NAV_LINKS.map((link) => {
          const active = isNavActive(pathname, link.href);
          const isTote = link.href === "/basket";
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (!active) {
                  playBoing();
                }
              }}
              className={`relative flex items-center gap-2 rounded-xl py-3 pl-2 pr-3 transition-colors ${
                active
                  ? isNight
                    ? "text-[#fdf8f0]"
                    : "text-[#3d3830]"
                  : isNight
                    ? "text-[#8b7a68] hover:text-[#d4c4b0]"
                    : "text-[#8b7a68] hover:text-[#6b5d4f]"
              }`}
            >
              {active ? <SidebarMascot /> : null}
              {isTote ? (
                <motion.span
                  key={basketBump}
                  initial={{ rotate: 0 }}
                  animate={
                    basketBump > 0
                      ? { rotate: [0, -20, 15, -9, 0], scale: [1, 1.3, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="inline-block text-base"
                >
                  {link.emoji}
                </motion.span>
              ) : (
                <span className="text-base">{link.emoji}</span>
              )}
              <WigglyText
                text={link.label}
                className={`font-[family-name:var(--font-quicksand)] text-sm font-semibold ${
                  active ? "underline decoration-[#f4a582]/60 decoration-2 underline-offset-4" : ""
                }`}
              />
              {isTote && basketCount > 0 ? (
                <motion.span
                  key={`count-${basketBump}`}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: [0.6, 1.25, 1] }}
                  transition={{ duration: 0.4 }}
                  className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f4a582] px-1.5 text-[11px] font-bold text-white"
                >
                  {basketCount}
                </motion.span>
              ) : null}
            </Link>
          );
        })}

        <Link
          href="/brew"
          onClick={playBoing}
          className={`mt-3 flex items-center gap-2 rounded-xl border border-dashed px-3 py-3 transition ${
            pathname === "/brew"
              ? "border-[#f4a582] bg-[#f4a582]/10 text-[#f4a582]"
              : isNight
                ? "border-[#5c4f42] text-[#d4c4b0] hover:border-[#f4a582]/50"
                : "border-[#d4c4b0] text-[#6b5d4f] hover:border-[#f4a582]/50"
          }`}
        >
          <span>✨</span>
          <WigglyText
            text="Brew Your Own"
            className="font-[family-name:var(--font-quicksand)] text-sm font-semibold"
          />
        </Link>
      </nav>

      {onMenu && menuCounter ? (
        <div
          className={`relative z-10 mt-8 border-t border-dashed pt-5 ${
            isNight ? "border-[#5c4f42]" : "border-[#d4c4b0]"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#b8956a]">
            — Taste test —
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {DRINKS.map((drink, index) => {
              const active = menuCounter.activeIndex === index;
              return (
                <li key={drink.id}>
                  <button
                    type="button"
                    onClick={() => {
                      menuCounter.setActiveIndex(index);
                      playIce();
                    }}
                    onMouseEnter={() => {
                      if (!active) {
                        playIce();
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl py-2.5 pl-2 pr-3 text-left transition-colors ${
                      active
                        ? isNight
                          ? "bg-[#3d3830] text-[#fdf8f0]"
                          : "bg-[#f5ebe0]/80 text-[#3d3830]"
                        : isNight
                          ? "text-[#8b7a68] hover:text-[#d4c4b0]"
                          : "text-[#8b7a68] hover:text-[#6b5d4f]"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: drink.color }}
                    />
                    <span className="font-[family-name:var(--font-quicksand)] text-sm font-semibold">
                      {drink.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="relative z-10 mt-auto space-y-4">
        <button
          type="button"
          onClick={toggleMode}
          aria-pressed={isNight}
          className={`flex w-full items-center justify-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition ${
            isNight
              ? "border-[#5c4f42] text-[#a89888] hover:text-[#f4a582]"
              : "border-[#ead9c8] text-[#8b7a68] hover:text-[#c4842f]"
          }`}
        >
          {isNight ? "🌙 Night shift" : "☀️ Day shift"}
        </button>

        <button
          type="button"
          onClick={toggleSounds}
          aria-pressed={soundsEnabled}
          className={`flex w-full items-center justify-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition ${
            isNight
              ? "border-[#5c4f42] text-[#a89888] hover:text-[#f4a582]"
              : "border-[#ead9c8] text-[#8b7a68] hover:text-[#c4842f]"
          }`}
        >
          {soundsEnabled ? "🔊 ASMR on" : "🔇 ASMR off"}
        </button>

        <div
          className={`border-t border-dashed pt-5 ${
            isNight ? "border-[#5c4f42]" : "border-[#d4c4b0]"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#b8956a]">
            — My tote bag —
          </p>

          <ul className="no-scrollbar mt-3 max-h-40 space-y-1 overflow-y-auto font-mono text-xs">
            <AnimatePresence initial={false}>
              {basket.length === 0 ? (
                <motion.li
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#a89888]"
                >
                  · · · tote is empty · · ·
                </motion.li>
              ) : (
                basket.map((item, index) => {
                  const drink = getDrinkById(item.id);
                  if (!drink) {
                    return null;
                  }
                  return (
                    <motion.li
                      key={`${item.id}-${item.ice}-${item.sugar}-${index}`}
                      initial={{ opacity: 0, y: -12, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      className={`overflow-hidden border-b border-dotted py-1.5 ${
                        isNight ? "border-[#5c4f42] text-[#d4c4b0]" : "border-[#e8dcc8]/80 text-[#5c4f42]"
                      }`}
                    >
                      <div className="flex justify-between gap-2">
                        <span>
                          {drink.name} ×{item.qty}
                        </span>
                        <span>{formatPrice(drink.price * item.qty)}</span>
                      </div>
                    </motion.li>
                  );
                })
              )}
            </AnimatePresence>
          </ul>

          <div
            className={`mt-4 flex items-baseline justify-between border-t border-dashed pt-3 ${
              isNight ? "border-[#5c4f42]" : "border-[#d4c4b0]"
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[#8b7a68]">
              Total
            </span>
            <motion.span
              key={cartTotal}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              className="font-[family-name:var(--font-quicksand)] text-xl font-bold text-[#f4a582]"
            >
              {formatPrice(cartTotal)}
            </motion.span>
          </div>
        </div>
      </div>
    </aside>
  );
}
