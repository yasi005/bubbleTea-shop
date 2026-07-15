import { getDrinkById } from "@/lib/drinks";
import type { FlavorId, IceLevel } from "@/lib/types";

export interface BrewPhysicsItem {
  id: string;
  position: [number, number, number];
}

export interface BrewCupState {
  pearls: BrewPhysicsItem[];
  iceCubes: BrewPhysicsItem[];
  liquidLevel: number;
  currentFlavor: FlavorId | null;
}

/**
 * "idle" is the normal editing state; "sealing" plays the lid-snap + straw-drop
 * finish animation; "sealed" is the finished drink resting with its lid/straw on
 * — it stays that way until the user presses Redo.
 */
export type BrewPhase = "idle" | "sealing" | "sealed";

export interface CustomBrewSnapshot {
  flavorId: FlavorId;
  pearlCount: number;
  iceCubeCount: number;
  liquidLevel: number;
  label: string;
}

export const BOBA_BATCH_SIZE = 10;
export const ICE_BATCH_SIZE = 3;
export const POUR_TICK_DELTA = 2;
export const POUR_TICK_MS = 45;
export const MAX_LIQUID_LEVEL = 100;

export const BREW_FLAVORS: FlavorId[] = [
  "matcha",
  "mango",
  "brown-sugar",
  "strawberry",
  "peach",
];

export const initialBrewCupState: BrewCupState = {
  pearls: [],
  iceCubes: [],
  liquidLevel: 0,
  currentFlavor: null,
};

const GOLDEN_ANGLE = 2.399963;

/**
 * Staggered spiral spawn just above the cup rim. Each item in a batch gets its
 * own height (vertical step ≥ its physics size) and a distinct spiral slot, so
 * no two bodies ever spawn overlapping — overlap on spawn is what made cannon
 * violently eject pearls. Low spawn height also keeps impact speed down so
 * nothing tunnels through the walls.
 */
function spawnAboveCup(index: number, verticalStep: number): [number, number, number] {
  const angle = index * GOLDEN_ANGLE;
  const radius = 0.05 + (index % 4) * 0.035;
  return [
    Math.cos(angle) * radius,
    0.62 + index * verticalStep,
    Math.sin(angle) * radius,
  ];
}

function createPhysicsItems(count: number, verticalStep: number): BrewPhysicsItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: crypto.randomUUID(),
    position: spawnAboveCup(index, verticalStep),
  }));
}

export function createPearlBatch(count = BOBA_BATCH_SIZE): BrewPhysicsItem[] {
  return createPhysicsItems(count, 0.13);
}

export function createIceBatch(count = ICE_BATCH_SIZE): BrewPhysicsItem[] {
  return createPhysicsItems(count, 0.17);
}

export function describeBoba(pearlCount: number): string {
  if (pearlCount === 0) {
    return "No Boba";
  }
  if (pearlCount <= BOBA_BATCH_SIZE) {
    return "Regular Boba";
  }
  return "Extra Boba";
}

export function describeIce(iceCubeCount: number): string {
  if (iceCubeCount === 0) {
    return "No Ice";
  }
  if (iceCubeCount <= ICE_BATCH_SIZE) {
    return "Light Ice";
  }
  if (iceCubeCount <= ICE_BATCH_SIZE * 2) {
    return "Regular Ice";
  }
  return "Extra Ice";
}

export function iceLevelFromCubeCount(iceCubeCount: number): IceLevel {
  if (iceCubeCount === 0) {
    return "0%";
  }
  if (iceCubeCount <= ICE_BATCH_SIZE) {
    return "50%";
  }
  return "100%";
}

export function buildCustomDrinkLabel(
  flavorId: FlavorId,
  pearlCount: number,
  iceCubeCount: number,
): string {
  const drink = getDrinkById(flavorId);
  const baseName = drink?.name ?? "Mystery";
  return `Custom Drink: ${baseName} Base, ${describeBoba(pearlCount)}, ${describeIce(iceCubeCount)}`;
}

export function getBrewLiquidColor(flavorId: FlavorId | null): string {
  if (!flavorId) {
    return "#d4c4b0";
  }
  return getDrinkById(flavorId)?.liquidColor ?? "#8FBC9A";
}

export function liquidScaleFromLevel(liquidLevel: number): number {
  return Math.max(0.04, liquidLevel / MAX_LIQUID_LEVEL);
}
