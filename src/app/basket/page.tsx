"use client";

import Link from "next/link";
import { useState } from "react";

import { ShakeCheckout } from "@/components/basket/ShakeCheckout";
import { GlassPanel } from "@/components/GlassPanel";
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
  const { isNight } = useVibe();
  const [checkedOut, setCheckedOut] = useState(false);
  const [shakeOpen, setShakeOpen] = useState(false);

  const finishCheckout = () => {
    setShakeOpen(false);
    setCheckedOut(true);
    clearBasket();
  };

  if (basket.length === 0 && !checkedOut) {
    return (
      <div
        className={`flex h-full min-h-screen items-center justify-center px-8 ${
          isNight ? "bg-[#2a2622]" : ""
        }`}
      >
        <GlassPanel className="max-w-md text-center">
          <h1 className="font-[family-name:var(--font-quicksand)] text-3xl font-bold text-[#3d3830]">
            Tote bag is empty
          </h1>
          <p className="mt-3 text-[#6b5d4f]">
            Wander to The Fridge and pick something cozy.
          </p>
          <Link
            href="/menu"
            className="btn-pill mt-8 inline-flex bg-[#f4a582] px-8 py-3 font-semibold text-white hover:bg-[#e8956f]"
          >
            To The Fridge
          </Link>
        </GlassPanel>
      </div>
    );
  }

  if (checkedOut) {
    return (
      <div
        className={`flex h-full min-h-screen items-center justify-center px-8 ${
          isNight ? "bg-[#2a2622]" : ""
        }`}
      >
        <GlassPanel className="max-w-md text-center">
          <div className="text-5xl">🧋</div>
          <h1 className="mt-6 font-[family-name:var(--font-quicksand)] text-3xl font-bold text-[#3d3830]">
            Order confirmed!
          </h1>
          <p className="mt-3 text-[#6b5d4f]">
            You shook it just right. See you soon, sunshine.
          </p>
          <Link
            href="/menu"
            className="btn-pill mt-8 inline-flex bg-[#c4842f] px-8 py-3 font-semibold text-white hover:bg-[#a86f25]"
          >
            Order more
          </Link>
        </GlassPanel>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex h-full min-h-screen items-start justify-center px-8 py-12 ${
          isNight ? "bg-[#2a2622]" : ""
        }`}
      >
        <GlassPanel className="w-full max-w-xl">
          <h1 className="font-[family-name:var(--font-quicksand)] text-3xl font-bold text-[#3d3830]">
            🧺 My Tote Bag
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#b8956a]">
            Adjust quantities below
          </p>

          <ul className="mt-8 space-y-4">
            {basket.map((item, index) => {
              const drink = getDrinkById(item.id);
              if (!drink) {
                return null;
              }

              return (
                <li
                  key={`${item.id}-${item.ice}-${item.sugar}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#ead9c8]/50 bg-white/40 p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#3d3830]">
                      {item.custom ? "Custom Drink" : drink.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#6b5d4f]">
                      {item.custom
                        ? (item.custom.stickerLabel ??
                          item.custom.label.replace(/^Custom Drink: /, ""))
                        : `Ice ${item.ice} · Sweetness ${item.sugar}`}
                    </p>
                    {item.custom ? (
                      <p className="mt-1 text-xs text-[#8b7a68]">
                        {item.custom.pearlCount} pearls · {item.custom.iceCubeCount}{" "}
                        ice · {Math.round(item.custom.liquidLevel)}% fill
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm font-medium text-[#c4842f]">
                      {formatPrice(drink.price * item.qty)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        item.qty <= 1
                          ? removeFromBasket(index)
                          : updateBasketQty(index, item.qty - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5ebe0] text-[#3d3830] transition hover:bg-[#ead9c8]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateBasketQty(index, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5ebe0] text-[#3d3830] transition hover:bg-[#ead9c8]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromBasket(index)}
                      className="ml-2 text-sm text-[#8b6f47] transition hover:text-[#c4842f]"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex items-center justify-between border-t border-dashed border-[#d4c4b0] pt-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8b7a68]">
              Total
            </span>
            <span className="text-2xl font-bold text-[#c4842f]">
              {formatPrice(cartTotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShakeOpen(true)}
            className="btn-pill mt-6 w-full bg-[#f4a582] px-8 py-4 text-lg font-semibold text-white hover:bg-[#e8956f]"
          >
            Confirm Order
          </button>
        </GlassPanel>
      </div>

      <ShakeCheckout
        open={shakeOpen}
        onComplete={finishCheckout}
        onCancel={() => setShakeOpen(false)}
      />
    </>
  );
}
