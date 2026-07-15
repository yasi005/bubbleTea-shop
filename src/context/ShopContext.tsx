"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getDrinkById } from "@/lib/drinks";
import { loadShopState, saveShopState } from "@/lib/storage";
import type { CustomBrewSnapshot } from "@/lib/brew";
import type { FlavorId, IceLevel, ShopState, SweetnessLevel } from "@/lib/types";

interface CustomBrewCheckout extends CustomBrewSnapshot {
  ice: IceLevel;
}

interface ShopContextValue extends ShopState {
  hydrated: boolean;
  basketCount: number;
  basketTotal: number;
  cartTotal: number;
  /** Increments each time an item is added — used to trigger the tote-bag wiggle. */
  basketBump: number;
  setUserName: (name: string) => void;
  addToBasket: (
    id: FlavorId,
    ice: IceLevel,
    sugar: SweetnessLevel,
    qty?: number,
  ) => void;
  addToCart: (
    id: FlavorId,
    ice: IceLevel,
    sugar: SweetnessLevel,
    qty?: number,
  ) => void;
  addCustomBrewToBasket: (brew: CustomBrewCheckout, qty?: number) => void;
  removeFromBasket: (index: number) => void;
  updateBasketQty: (index: number, qty: number) => void;
  clearBasket: () => void;
  toggleFavorite: (id: FlavorId) => void;
  isFavorite: (id: FlavorId) => boolean;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopState>({
    userName: null,
    basket: [],
    favorites: [],
  });
  const [hydrated, setHydrated] = useState(false);
  const [basketBump, setBasketBump] = useState(0);

  useEffect(() => {
    setState(loadShopState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveShopState(state);
    }
  }, [state, hydrated]);

  const setUserName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setState((prev) => ({ ...prev, userName: trimmed }));
  }, []);

  const addToBasket = useCallback(
    (id: FlavorId, ice: IceLevel, sugar: SweetnessLevel, qty = 1) => {
      setBasketBump((bump) => bump + 1);
      setState((prev) => {
        const existingIndex = prev.basket.findIndex(
          (item) => item.id === id && item.ice === ice && item.sugar === sugar,
        );

        if (existingIndex >= 0) {
          const basket = [...prev.basket];
          basket[existingIndex] = {
            ...basket[existingIndex],
            qty: basket[existingIndex].qty + qty,
          };
          return { ...prev, basket };
        }

        return {
          ...prev,
          basket: [...prev.basket, { id, ice, sugar, qty }],
        };
      });
    },
    [],
  );

  const addCustomBrewToBasket = useCallback(
    (brew: CustomBrewCheckout, qty = 1) => {
      setBasketBump((bump) => bump + 1);
      setState((prev) => ({
        ...prev,
        basket: [
          ...prev.basket,
          {
            id: brew.flavorId,
            ice: brew.ice,
            sugar: "50%",
            qty,
            custom: {
              pearlCount: brew.pearlCount,
              iceCubeCount: brew.iceCubeCount,
              liquidLevel: brew.liquidLevel,
              label: brew.label,
            },
          },
        ],
      }));
    },
    [],
  );

  const removeFromBasket = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      basket: prev.basket.filter((_, i) => i !== index),
    }));
  }, []);

  const updateBasketQty = useCallback((index: number, qty: number) => {
    if (qty < 1) {
      return;
    }
    setState((prev) => ({
      ...prev,
      basket: prev.basket.map((item, i) =>
        i === index ? { ...item, qty } : item,
      ),
    }));
  }, []);

  const clearBasket = useCallback(() => {
    setState((prev) => ({ ...prev, basket: [] }));
  }, []);

  const toggleFavorite = useCallback((id: FlavorId) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter((fav) => fav !== id)
        : [...prev.favorites, id],
    }));
  }, []);

  const isFavorite = useCallback(
    (id: FlavorId) => state.favorites.includes(id),
    [state.favorites],
  );

  const basketCount = useMemo(
    () => state.basket.reduce((sum, item) => sum + item.qty, 0),
    [state.basket],
  );

  const basketTotal = useMemo(
    () =>
      state.basket.reduce((sum, item) => {
        const drink = getDrinkById(item.id);
        return sum + (drink?.price ?? 0) * item.qty;
      }, 0),
    [state.basket],
  );

  const value = useMemo<ShopContextValue>(
    () => ({
      ...state,
      hydrated,
      basketCount,
      basketTotal,
      cartTotal: basketTotal,
      basketBump,
      setUserName,
      addToBasket,
      addCustomBrewToBasket,
      addToCart: addToBasket,
      removeFromBasket,
      updateBasketQty,
      clearBasket,
      toggleFavorite,
      isFavorite,
    }),
    [
      state,
      hydrated,
      basketCount,
      basketTotal,
      basketBump,
      setUserName,
      addToBasket,
      addCustomBrewToBasket,
      removeFromBasket,
      updateBasketQty,
      clearBasket,
      toggleFavorite,
      isFavorite,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
