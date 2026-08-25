"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { ShakeCheckout } from "@/components/basket/ShakeCheckout";
import { ToteCupThumb } from "@/components/basket/ToteCupThumb";
import { TrashIcon } from "@/components/basket/TrashIcon";
import { useShop } from "@/context/ShopContext";
import { useVibe } from "@/context/VibeContext";
import { getDrinkById } from "@/lib/drinks";
import { formatPrice } from "@/lib/storage";

export default function BasketPage() {
  const {
    basket,
    cartTotal,
    removeFromBasket,
    updateBasketQty,
    clearBasket,
  } = useShop();
  const { isNight, playPop } = useVibe();
  const [checkedOut, setCheckedOut] = useState(false);
  const [shakeOpen, setShakeOpen] = useState(false);

  const finishCheckout = () => {
    setShakeOpen(false);
    setCheckedOut(true);
    clearBasket();
  };

  const shell = isNight ? "bg-[#2a2622] text-[#f5ebe0]" : "bg-[#fdf8f0] text-[#3d3830]";
  const muted = isNight ? "text-[#a89888]" : "text-[#8b7a68]";
  const soft = isNight ? "text-[#d4c4b0]" : "text-[#6b5d4f]";
  const line = isNight ? "border-[#5c4f42]" : "border-[#ead9c8]";
  const chip = isNight
    ? "bg-[#3d3830] text-[#d4c4b0] active:bg-[#4a433c] hover:bg-[#4a433c]"
    : "bg-[#f5ebe0] text-[#3d3830] active:bg-[#ead9c8] hover:bg-[#ead9c8]";

  if (basket.length === 0 && !checkedOut) {
    return (
      <div
        className={`flex min-h-full items-center justify-center px-5 py-10 ${shell}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mx-auto flex justify-center">
            <ToteCupThumb
              liquidColor="#ead9c8"
              accentColor="#d4c4b0"
              size="lg"
            />
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-bubble)] text-2xl font-bold sm:text-3xl">
            Tote is empty
          </h1>
          <p className={`mt-2 text-sm ${soft}`}>
            Wander to The Fridge and pick something cozy.
          </p>
          <Link
            href="/menu"
            className="btn-pill mt-7 inline-flex bg-[#f4a582] px-7 py-3 text-sm font-semibold text-white hover:bg-[#e8956f]"
          >
            To The Fridge
          </Link>
        </motion.div>
      </div>
    );
  }

  if (checkedOut) {
    return (
      <div
        className={`flex min-h-full items-center justify-center px-5 py-10 ${shell}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mx-auto flex justify-center gap-2">
            <ToteCupThumb liquidColor="#E8A0B0" accentColor="#F4B8C1" size="md" />
            <ToteCupThumb liquidColor="#8FBC9A" accentColor="#A8D5BA" size="lg" />
            <ToteCupThumb liquidColor="#E8956F" accentColor="#F4A582" size="md" />
          </div>
          <h1 className="mt-7 font-[family-name:var(--font-bubble)] text-2xl font-bold sm:text-3xl">
            Order confirmed
          </h1>
          <p className={`mt-2 text-sm ${soft}`}>
            You shook it just right. See you soon, sunshine.
          </p>
          <Link
            href="/menu"
            className="btn-pill mt-7 inline-flex bg-[#c4842f] px-7 py-3 text-sm font-semibold text-white hover:bg-[#a86f25]"
          >
            Order more
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className={`relative min-h-full ${shell}`}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: isNight
              ? "radial-gradient(ellipse at 20% 0%, #3d3830 0%, transparent 55%), radial-gradient(ellipse at 90% 20%, #4a3f35 0%, transparent 40%)"
              : "radial-gradient(ellipse at 15% 0%, #f5ebe0 0%, transparent 50%), radial-gradient(ellipse at 90% 10%, #f4a58222 0%, transparent 42%)",
          }}
        />

        <div className="relative mx-auto flex min-h-full w-full max-w-xl flex-col px-4 py-6 sm:px-6 sm:py-10">
          <header className="flex items-end justify-between gap-3">
            <div>
              <p className={`font-mono text-[10px] uppercase tracking-[0.32em] ${muted}`}>
                Bubble Tea Boutique
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-bubble)] text-2xl font-bold tracking-tight sm:text-3xl">
                My Tote
              </h1>
            </div>
            <p className={`shrink-0 font-mono text-[10px] uppercase tracking-widest ${muted}`}>
              {basket.reduce((sum, item) => sum + item.qty, 0)} drinks
            </p>
          </header>

          <ul className="mt-6 flex-1 space-y-2.5 sm:mt-8 sm:space-y-3">
            <AnimatePresence initial={false}>
              {basket.map((item, index) => {
                const drink = getDrinkById(item.id);
                if (!drink) {
                  return null;
                }

                const title = item.custom ? "Custom Drink" : drink.name;
                const detail = item.custom
                  ? (item.custom.stickerLabel ??
                    item.custom.label.replace(/^Custom Drink: /, ""))
                  : `Ice ${item.ice} · Sugar ${item.sugar}`;

                return (
                  <motion.li
                    key={`${item.id}-${item.ice}-${item.sugar}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, height: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className={`flex items-center gap-3 rounded-[1.35rem] border px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5 ${line} ${
                      isNight ? "bg-[#2f2a26]/80" : "bg-white/45"
                    }`}
                  >
                    <ToteCupThumb
                      liquidColor={drink.liquidColor}
                      accentColor={drink.color}
                      custom={Boolean(item.custom)}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-[family-name:var(--font-bubble)] text-[15px] font-semibold sm:text-base">
                          {title}
                        </h3>
                        <p className="shrink-0 text-sm font-semibold text-[#c4842f]">
                          {formatPrice(drink.price * item.qty)}
                        </p>
                      </div>
                      <p className={`mt-0.5 truncate text-xs ${soft}`}>{detail}</p>
                      {item.custom ? (
                        <p className={`mt-0.5 text-[11px] ${muted}`}>
                          {item.custom.pearlCount} pearls ·{" "}
                          {item.custom.iceCubeCount} ice ·{" "}
                          {Math.round(item.custom.liquidLevel)}% fill
                        </p>
                      ) : null}

                      <div className="mt-2.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.qty <= 1) {
                              removeFromBasket(index);
                              playPop();
                              return;
                            }
                            updateBasketQty(index, item.qty - 1);
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${chip} ${
                            item.qty <= 1 ? "text-[#c4842f]" : ""
                          }`}
                          aria-label={
                            item.qty <= 1 ? "Remove from tote" : "Decrease quantity"
                          }
                        >
                          {item.qty <= 1 ? (
                            <TrashIcon className="h-3.5 w-3.5" />
                          ) : (
                            <span className="text-base leading-none">−</span>
                          )}
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateBasketQty(index, item.qty + 1)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${chip}`}
                          aria-label="Increase quantity"
                        >
                          <span className="text-base leading-none">+</span>
                        </button>

                        {item.qty > 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              removeFromBasket(index);
                              playPop();
                            }}
                            className={`ml-1 flex h-8 w-8 items-center justify-center rounded-full transition ${chip} text-[#c4842f]`}
                            aria-label="Remove from tote"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <div
            className={`sticky bottom-0 mt-6 border-t border-dashed pt-4 backdrop-blur-md max-[900px]:pb-1 ${line} ${
              isNight ? "bg-[#2a2622]/92" : "bg-[#fdf8f0]/92"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className={`font-mono text-[10px] uppercase tracking-[0.28em] ${muted}`}>
                Total
              </span>
              <motion.span
                key={cartTotal}
                initial={{ scale: 1.04 }}
                animate={{ scale: 1 }}
                className="font-[family-name:var(--font-bubble)] text-2xl font-bold text-[#c4842f]"
              >
                {formatPrice(cartTotal)}
              </motion.span>
            </div>
            <button
              type="button"
              onClick={() => setShakeOpen(true)}
              className="btn-pill mt-4 w-full bg-[#f4a582] px-8 py-3.5 text-base font-semibold text-white hover:bg-[#e8956f] sm:py-4 sm:text-lg"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      <ShakeCheckout
        open={shakeOpen}
        onComplete={finishCheckout}
        onCancel={() => setShakeOpen(false)}
      />
    </>
  );
}
