export type FlavorId =
  | "brown-sugar"
  | "matcha"
  | "strawberry"
  | "mango"
  | "peach";

export type IceLevel = "0%" | "50%" | "100%";
export type SweetnessLevel = "0%" | "50%" | "100%";

export interface Drink {
  id: FlavorId;
  name: string;
  price: number;
  color: string;
  liquidColor: string;
  description: string;
  notes: string[];
  vibe: string;
}

export interface CartItem {
  id: FlavorId;
  ice: IceLevel;
  sugar: SweetnessLevel;
  qty: number;
  custom?: {
    pearlCount: number;
    iceCubeCount: number;
    liquidLevel: number;
    label: string;
    stickerLabel?: string;
  };
}

export interface ShopState {
  userName: string | null;
  basket: CartItem[];
  favorites: FlavorId[];
}
