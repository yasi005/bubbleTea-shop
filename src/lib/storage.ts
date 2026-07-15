import type { CartItem, FlavorId, ShopState } from "./types";

const STORAGE_KEY = "bubble-tea-boutique";

const DEFAULT_STATE: ShopState = {
  userName: null,
  basket: [],
  favorites: [],
};

function isFlavorId(value: string): value is FlavorId {
  return (
    value === "brown-sugar" ||
    value === "matcha" ||
    value === "strawberry" ||
    value === "mango" ||
    value === "peach"
  );
}

function isIceLevel(value: string): value is CartItem["ice"] {
  return value === "0%" || value === "50%" || value === "100%";
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    isFlavorId(item.id) &&
    typeof item.ice === "string" &&
    isIceLevel(item.ice) &&
    typeof item.sugar === "string" &&
    isIceLevel(item.sugar) &&
    typeof item.qty === "number" &&
    item.qty > 0
  );
}

export function loadShopState(): ShopState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(raw) as Partial<ShopState>;
    return {
      userName:
        typeof parsed.userName === "string" && parsed.userName.trim()
          ? parsed.userName.trim()
          : null,
      basket: Array.isArray(parsed.basket)
        ? parsed.basket.filter(isCartItem)
        : [],
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites.filter(isFlavorId)
        : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveShopState(state: ShopState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
