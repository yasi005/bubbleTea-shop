import type { Drink } from "./types";

export const DRINKS: Drink[] = [
  {
    id: "brown-sugar",
    name: "Brown Sugar",
    price: 5.5,
    color: "#C4842F",
    liquidColor: "#B87333",
    description: "Warm amber caramel swirled through creamy milk tea.",
    notes: ["Brown sugar pearls", "Fresh milk", "Black tea base"],
    vibe: "Warm amber/caramel",
  },
  {
    id: "matcha",
    name: "Matcha Latte",
    price: 5.75,
    color: "#A8D5BA",
    liquidColor: "#8FBC9A",
    description: "Soft ceremonial matcha folded into velvety oat milk.",
    notes: ["Ceremonial matcha", "Oat milk", "Light honey"],
    vibe: "Soft pastel green",
  },
  {
    id: "strawberry",
    name: "Strawberry Milk",
    price: 5.25,
    color: "#F4B8C1",
    liquidColor: "#E8A0B0",
    description: "Sun-ripened strawberries blended with gentle whole milk.",
    notes: ["Fresh strawberries", "Whole milk", "Vanilla bean"],
    vibe: "Warm, gentle pink",
  },
  {
    id: "mango",
    name: "Mango Sago",
    price: 6.0,
    color: "#F5D76E",
    liquidColor: "#E8C547",
    description: "Buttery mango nectar with chewy sago pearls.",
    notes: ["Alphonso mango", "Sago pearls", "Coconut cream"],
    vibe: "Bright, buttery yellow",
  },
  {
    id: "peach",
    name: "Peach Oolong",
    price: 5.5,
    color: "#F4A582",
    liquidColor: "#E8956F",
    description: "Sunset peach essence steeped in fragrant oolong.",
    notes: ["White peach", "Oolong tea", "Honey drizzle"],
    vibe: "Glowing sunset peach",
  },
];

export function getDrinkById(id: string): Drink | undefined {
  return DRINKS.find((drink) => drink.id === id);
}
