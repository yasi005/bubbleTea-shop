"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import {
  BOBA_BATCH_SIZE,
  ICE_BATCH_SIZE,
  MAX_LIQUID_LEVEL,
  POUR_TICK_DELTA,
  buildCustomDrinkLabel,
  createIceBatch,
  createPearlBatch,
  initialBrewCupState,
  type BrewCupState,
  type BrewPhase,
  type CustomBrewSnapshot,
} from "@/lib/brew";
import type { FlavorId } from "@/lib/types";

type BrewAction =
  | { type: "ADD_BOBA" }
  | { type: "ADD_ICE" }
  | { type: "POUR_TICK"; flavor: FlavorId; delta?: number }
  | { type: "SET_FLAVOR"; flavor: FlavorId }
  | { type: "RESET" };

interface BrewContextValue {
  cup: BrewCupState;
  selectedFlavor: FlavorId;
  setSelectedFlavor: (flavor: FlavorId) => void;
  dropBoba: () => void;
  addIce: () => void;
  pourTick: () => void;
  resetCup: () => void;
  canPour: boolean;
  canAddToBag: boolean;
  canReset: boolean;
  brewKey: number;
  brewPhase: BrewPhase;
  setBrewPhase: (phase: BrewPhase) => void;
  shakeToken: number;
  shakeCup: () => void;
  buildCheckoutSnapshot: () => CustomBrewSnapshot | null;
}

const BrewContext = createContext<BrewContextValue | null>(null);

function brewReducer(state: BrewCupState, action: BrewAction): BrewCupState {
  switch (action.type) {
    case "ADD_BOBA":
      return {
        ...state,
        pearls: [...state.pearls, ...createPearlBatch(BOBA_BATCH_SIZE)],
      };
    case "ADD_ICE":
      return {
        ...state,
        iceCubes: [...state.iceCubes, ...createIceBatch(ICE_BATCH_SIZE)],
      };
    case "SET_FLAVOR":
      return {
        ...state,
        currentFlavor: action.flavor,
      };
    case "POUR_TICK": {
      const delta = action.delta ?? POUR_TICK_DELTA;
      const nextLevel = Math.min(MAX_LIQUID_LEVEL, state.liquidLevel + delta);
      return {
        ...state,
        liquidLevel: nextLevel,
        currentFlavor: action.flavor,
      };
    }
    case "RESET":
      return initialBrewCupState;
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export function BrewProvider({ children }: { children: ReactNode }) {
  const [cup, dispatch] = useReducer(brewReducer, initialBrewCupState);
  const [selectedFlavor, setSelectedFlavorState] = useState<FlavorId>("matcha");
  const [brewKey, setBrewKey] = useState(0);
  const [brewPhase, setBrewPhase] = useState<BrewPhase>("idle");
  const [shakeToken, setShakeToken] = useState(0);

  const shakeCup = useCallback(() => {
    setShakeToken((token) => token + 1);
  }, []);

  const setSelectedFlavor = useCallback((flavor: FlavorId) => {
    setSelectedFlavorState(flavor);
  }, []);

  const dropBoba = useCallback(() => {
    dispatch({ type: "ADD_BOBA" });
  }, []);

  const addIce = useCallback(() => {
    dispatch({ type: "ADD_ICE" });
  }, []);

  const pourTick = useCallback(() => {
    dispatch({ type: "POUR_TICK", flavor: selectedFlavor });
  }, [selectedFlavor]);

  const resetCup = useCallback(() => {
    dispatch({ type: "RESET" });
    setBrewKey((key) => key + 1);
    setBrewPhase("idle");
  }, []);

  const canPour = cup.liquidLevel < MAX_LIQUID_LEVEL;
  const canAddToBag = cup.currentFlavor !== null && cup.liquidLevel > 0;
  const canReset =
    cup.pearls.length > 0 ||
    cup.iceCubes.length > 0 ||
    cup.liquidLevel > 0 ||
    cup.currentFlavor !== null;

  const buildCheckoutSnapshot = useCallback((): CustomBrewSnapshot | null => {
    if (!cup.currentFlavor || cup.liquidLevel <= 0) {
      return null;
    }

    return {
      flavorId: cup.currentFlavor,
      pearlCount: cup.pearls.length,
      iceCubeCount: cup.iceCubes.length,
      liquidLevel: cup.liquidLevel,
      label: buildCustomDrinkLabel(
        cup.currentFlavor,
        cup.pearls.length,
        cup.iceCubes.length,
      ),
    };
  }, [cup]);

  const value = useMemo<BrewContextValue>(
    () => ({
      cup,
      selectedFlavor,
      setSelectedFlavor,
      dropBoba,
      addIce,
      pourTick,
      resetCup,
      canPour,
      canAddToBag,
      canReset,
      brewKey,
      brewPhase,
      setBrewPhase,
      shakeToken,
      shakeCup,
      buildCheckoutSnapshot,
    }),
    [
      cup,
      selectedFlavor,
      setSelectedFlavor,
      dropBoba,
      addIce,
      pourTick,
      resetCup,
      canPour,
      canAddToBag,
      canReset,
      brewKey,
      brewPhase,
      shakeToken,
      shakeCup,
      buildCheckoutSnapshot,
    ],
  );

  return <BrewContext.Provider value={value}>{children}</BrewContext.Provider>;
}

export function useBrew(): BrewContextValue {
  const context = useContext(BrewContext);
  if (!context) {
    throw new Error("useBrew must be used within BrewProvider");
  }
  return context;
}
