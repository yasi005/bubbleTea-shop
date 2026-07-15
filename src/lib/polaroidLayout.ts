import type { FlavorId } from "./types";

export interface PolaroidLayout {
  id: FlavorId;
  left: string;
  top: string;
  rotate: number;
  zIndex: number;
}

export const POLAROID_LAYOUT: PolaroidLayout[] = [
  { id: "brown-sugar", left: "8%", top: "12%", rotate: -11, zIndex: 2 },
  { id: "matcha", left: "38%", top: "6%", rotate: 5, zIndex: 4 },
  { id: "strawberry", left: "68%", top: "18%", rotate: -6, zIndex: 3 },
  { id: "mango", left: "18%", top: "48%", rotate: 8, zIndex: 5 },
  { id: "peach", left: "55%", top: "42%", rotate: -14, zIndex: 1 },
];
