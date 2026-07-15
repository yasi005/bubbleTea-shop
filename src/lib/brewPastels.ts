import type { FlavorId } from "@/lib/types";

/** Ultra-pastel bakery palette — no blues, no purples */
export const BREW_PASTELS = {
  vanilla: "#FFF8EE",
  vanillaGlow: "#FFF3E0",
  cupFrost: "#F5EDE4",
  peachPuff: "#FFDAB9",
  peachDeep: "#F4C4A0",
  leverPink: "#F8C8C8",
  crankYellow: "#F5E6A8",
  brass: "#C9A86C",
  machineBody: "#FFE8D6",
  machineShadow: "#E8D4C4",
  pearlBrown: "#5C4033",
  iceFrost: "#F0FAF5",
  textWarm: "#6B5344",
  textSoft: "#9A8575",
  stickerCream: "#FFF9F0",
} as const;

export const POUR_FLAVORS: FlavorId[] = ["matcha", "strawberry", "mango"];

export const PASTEL_LIQUID: Record<FlavorId, string> = {
  matcha: "#B8D4B8",
  strawberry: "#F5D0D8",
  mango: "#F5E6A8",
  "brown-sugar": "#E8C9A0",
  peach: "#FFDAB9",
};

export const PASTEL_FLAVOR_LABEL: Record<FlavorId, string> = {
  matcha: "Matcha",
  strawberry: "Strawberry Milk",
  mango: "Mango",
  "brown-sugar": "Brown Sugar",
  peach: "Peach",
};

export const PASTEL_BUTTON: Record<FlavorId, string> = {
  matcha: "#B8D4B8",
  strawberry: "#F5D0D8",
  mango: "#F5E6A8",
  "brown-sugar": "#E8C9A0",
  peach: "#FFDAB9",
};
