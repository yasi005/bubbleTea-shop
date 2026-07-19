/**
 * gltfjsx-style mesh tree for the boba cup.
 *
 * When you have a real .glb, run:
 *   npm run optimize-model
 *   npm run generate-cup
 *
 * That replaces this file with an auto-generated component. Until then,
 * this hand-built tree mirrors the gltfjsx output: named meshes for cup,
 * liquid, lid, straw, and pearls — each individually targetable.
 */
"use client";

import { forwardRef } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";

// Cup cone: outer radii 0.55 (top) / 0.42 (bottom), height 1.35, centred at
// y = -0.15, so it spans -0.825..0.525. The liquid keeps a small margin
// inside the glass wall.
const CUP_BOTTOM_Y = -0.825;
const CUP_HEIGHT = 1.35;
const INNER_BOTTOM_RADIUS = 0.4;
const INNER_TAPER = 0.13; // inner top radius 0.53 minus inner bottom 0.40
const LIQUID_BOTTOM_Y = -0.79;
const LIQUID_MAX_HEIGHT = 1.14; // tops out just below the rim

/** Inner glass radius at a given world-space height, with a safety margin. */
function innerRadiusAt(y: number): number {
  return (
    INNER_BOTTOM_RADIUS + INNER_TAPER * ((y - CUP_BOTTOM_Y) / CUP_HEIGHT) - 0.01
  );
}

export interface BobaCupModelProps {
  liquidColor: string;
  /** 0–1 fill height for the liquid mesh */
  liquidScale?: number;
  showCup?: boolean;
  showLiquid?: boolean;
  showLid?: boolean;
  showStraw?: boolean;
  /** Straw color — pass the drink's signature color for a product look */
  strawColor?: string;
  showPearls?: boolean;
  /** Reliable frosted look without needing an HDRI environment */
  frosted?: boolean;
  /** Opacity of the clear (non-frosted) glass; porch default 0.55 */
  glassOpacity?: number;
  /** Transmission of the clear (non-frosted) glass; porch default 0.45 */
  glassTransmission?: number;
  /** Opacity of the liquid; below 1 lets pearls/ice show through */
  liquidOpacity?: number;
}

export const BobaCupModel = forwardRef<Group, BobaCupModelProps>(
  function BobaCupModel(
    {
      liquidColor,
      liquidScale = 1,
      showCup = true,
      showLiquid = true,
      showLid = true,
      showStraw = true,
      strawColor = "#f0ebe4",
      showPearls = true,
      frosted = false,
      glassOpacity = 0.55,
      glassTransmission = 0.45,
      liquidOpacity = 1,
    },
    ref,
  ) {
    const pearls = Array.from({ length: 12 }, (_, index) => ({
      x: Math.sin(index * 1.8) * 0.22,
      z: Math.cos(index * 1.8) * 0.22,
      y: -0.55 + (index % 3) * 0.08,
      scale: 0.06 + (index % 2) * 0.015,
    }));

    return (
      <group ref={ref} name="BobaCupRoot">
        {showCup ? (
          <mesh name="Cup" position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.42, 1.35, 48, 1, true]} />
            {frosted ? (
              <meshStandardMaterial
                color="#f8f4ee"
                transparent
                opacity={0.72}
                roughness={0.88}
                metalness={0}
                side={THREE.DoubleSide}
              />
            ) : (
              <meshPhysicalMaterial
                color="#f8f4ee"
                transparent
                opacity={glassOpacity}
                roughness={0.08}
                metalness={0}
                transmission={glassTransmission}
                thickness={0.45}
                ior={1.45}
                side={THREE.DoubleSide}
              />
            )}
          </mesh>
        ) : null}

        {showLiquid
          ? (() => {
              // The cup is conical, so the liquid must taper to match the
              // inner walls at its current fill height — a fixed-radius
              // cylinder scaled in Y pokes through the glass at low fills.
              const fill = Math.min(1, Math.max(0.04, liquidScale));
              const height = LIQUID_MAX_HEIGHT * fill;
              const topY = LIQUID_BOTTOM_Y + height;
              return (
                <mesh
                  name="Liquid"
                  position={[0, LIQUID_BOTTOM_Y + height / 2, 0]}
                  castShadow
                >
                  <cylinderGeometry
                    args={[innerRadiusAt(topY), innerRadiusAt(LIQUID_BOTTOM_Y), height, 48]}
                  />
                  <meshPhysicalMaterial
                    color={liquidColor}
                    roughness={0.28}
                    metalness={0.05}
                    clearcoat={0.55}
                    clearcoatRoughness={0.25}
                    transparent={liquidOpacity < 1}
                    opacity={liquidOpacity}
                  />
                </mesh>
              );
            })()
          : null}

        {showLid ? (
          <group name="Lid">
            {/* Rim ring caps just over the glass edge (outer rim 0.55) and its
                underside sits flush on the rim top (y = 0.525) — seated, not
                floating. */}
            <mesh position={[0, 0.56, 0]} castShadow>
              <cylinderGeometry args={[0.57, 0.57, 0.07, 48]} />
              <meshStandardMaterial
                color="#faf6f0"
                roughness={0.4}
                metalness={0.05}
              />
            </mesh>
            {/* Shallow dome, open at the base (hidden inside the rim ring) */}
            <mesh position={[0, 0.595, 0]} scale={[1, 0.3, 1]} castShadow>
              <sphereGeometry
                args={[0.56, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
              />
              <meshStandardMaterial
                color="#faf6f0"
                roughness={0.4}
                metalness={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Grommet ring marking the hole where the straw punches through */}
            {showStraw ? (
              <mesh position={[0.07, 0.75, 0]} rotation={[Math.PI / 2, 0, 0.18]}>
                <torusGeometry args={[0.055, 0.014, 10, 24]} />
                <meshStandardMaterial color="#d8d2c8" roughness={0.5} />
              </mesh>
            ) : null}
          </group>
        ) : null}

        {showStraw ? (
          <mesh
            name="Straw"
            position={[0.18, 0.15, 0]}
            rotation={[0, 0, 0.18]}
            castShadow
          >
            {/* Long enough to run from just above the dome, through the lid
                hole, down to the bottom of the liquid (~y = -0.79). */}
            <cylinderGeometry args={[0.035, 0.035, 1.9, 16]} />
            <meshStandardMaterial color={strawColor} roughness={0.5} />
          </mesh>
        ) : null}

        {showPearls ? (
          <group name="Pearls">
            {pearls.map((pearl, index) => (
              <mesh
                key={index}
                name={`Pearl_${index}`}
                position={[pearl.x, pearl.y, pearl.z]}
                scale={pearl.scale}
                castShadow
              >
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#2a2018" roughness={0.6} metalness={0.1} />
              </mesh>
            ))}
          </group>
        ) : null}
      </group>
    );
  },
);

export function findLiquidMesh(root: Group): Mesh | null {
  let liquid: Mesh | null = null;
  root.traverse((child) => {
    if (liquid) {
      return;
    }
    if (!("isMesh" in child) || !(child as Mesh).isMesh) {
      return;
    }
    const name = child.name.toLowerCase();
    if (
      name === "liquid" ||
      name.includes("liquid") ||
      name.includes("drink") ||
      name.includes("tea")
    ) {
      liquid = child as Mesh;
    }
  });
  return liquid;
}
