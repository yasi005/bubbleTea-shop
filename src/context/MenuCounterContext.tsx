"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DRINKS } from "@/lib/drinks";
import type { Drink, FlavorId } from "@/lib/types";

export const CUP_SPACING = 4.5;

interface MenuCounterContextValue {
  activeIndex: number;
  activeDrink: Drink;
  checkoutOpen: boolean;
  setActiveIndex: (index: number) => void;
  setActiveById: (id: FlavorId) => void;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const MenuCounterContext = createContext<MenuCounterContextValue | null>(null);

export function MenuCounterProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const activeDrink = DRINKS[activeIndex] ?? DRINKS[0];

  const setActiveById = useCallback((id: FlavorId) => {
    const index = DRINKS.findIndex((drink) => drink.id === id);
    if (index >= 0) {
      setActiveIndex(index);
      setCheckoutOpen(false);
    }
  }, []);

  const openCheckout = useCallback(() => {
    setCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
  }, []);

  const value = useMemo<MenuCounterContextValue>(
    () => ({
      activeIndex,
      activeDrink,
      checkoutOpen,
      setActiveIndex: (index: number) => {
        const clamped = Math.max(0, Math.min(DRINKS.length - 1, index));
        setActiveIndex(clamped);
        setCheckoutOpen(false);
      },
      setActiveById,
      openCheckout,
      closeCheckout,
    }),
    [activeIndex, activeDrink, checkoutOpen, setActiveById, openCheckout, closeCheckout],
  );

  return (
    <MenuCounterContext.Provider value={value}>
      {children}
    </MenuCounterContext.Provider>
  );
}

export function useMenuCounter(): MenuCounterContextValue | null {
  return useContext(MenuCounterContext);
}

export function useMenuCounterRequired(): MenuCounterContextValue {
  const context = useContext(MenuCounterContext);
  if (!context) {
    throw new Error("useMenuCounterRequired must be used within MenuCounterProvider");
  }
  return context;
}
