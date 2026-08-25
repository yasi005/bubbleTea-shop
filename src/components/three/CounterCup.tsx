"use client";

import { useSpring, a } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group, MeshStandardMaterial } from "three";

import { BobaCupModel, findLiquidMesh } from "@/components/three/BobaCupModel";
import { FlavorAura } from "@/components/three/FlavorAura";
import { CUP_SPACING } from "@/context/MenuCounterContext";
import type { Drink } from "@/lib/types";

interface CounterCupProps {
  drink: Drink;
  position: [number, number, number];
  isActive: boolean;
  checkoutOpen: boolean;
  onSelect: () => void;
}

const CONDENSATION = [
  [0.42, 0.35, 0.18],
  [-0.38, 0.1, 0.2],
  [0.2, -0.2, 0.45],
  [-0.15, 0.55, -0.1],
  [0.35, -0.45, -0.15],
];

export function CounterCup({
  drink,
  position,
  isActive,
  checkoutOpen,
  onSelect,
}: CounterCupProps) {
  const modelRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);
  const floatRef = useRef<Group>(null);

  // Gentle idle float on the active cup so the showcase feels alive; eases
  // back to rest when the cup loses focus.
  useFrame(({ clock }, delta) => {
    const float = floatRef.current;
    if (!float) {
      return;
    }
    if (!isActive && Math.abs(float.position.y) < 0.0005) {
      float.position.y = 0;
      return;
    }
    const target =
      isActive && !checkoutOpen ? Math.sin(clock.elapsedTime * 1.4) * 0.045 : 0;
    float.position.y += (target - float.position.y) * Math.min(1, delta * 5);
  });

  const [{ rotY, scale }, api] = useSpring(() => ({
    rotY: 0,
    scale: 1.4,
    config: { tension: 80, friction: 20 },
  }));

  useEffect(() => {
    if (checkoutOpen && isActive) {
      api.start({ rotY: -0.35, scale: 1.6, config: { tension: 60, friction: 18 } });
      return;
    }
    api.start({
      rotY: isActive ? 0 : 0.15,
      scale: isActive ? 1.5 : 1.3,
      config: { tension: 70, friction: 20 },
    });
  }, [isActive, checkoutOpen, api]);

  useEffect(() => {
    if (!modelRef.current) {
      return;
    }
    const liquid = findLiquidMesh(modelRef.current);
    if (!liquid) {
      return;
    }
    const material = liquid.material as MeshStandardMaterial;
    material.color.set(drink.liquidColor);
  }, [drink.liquidColor]);

  return (
    <a.group
      ref={groupRef}
      position={position}
      rotation-y={rotY}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();
        if (isActive) {
          onSelect();
        }
      }}
      onPointerOver={(event) => {
        if (isActive) {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <group ref={floatRef}>
        {/* Same clear glass as the brew cup (no transmission — keeps contents
            and liquid fully visible; HDRI reflections supply the gloss). */}
        <BobaCupModel
          ref={modelRef}
          liquidColor={drink.liquidColor}
          glassOpacity={0.35}
          glassTransmission={0}
        />
      </group>

      {isActive
        ? CONDENSATION.map((pos, index) => (
            <mesh
              key={index}
              position={pos as [number, number, number]}
              scale={0.035}
            >
              <sphereGeometry args={[1, 6, 6]} />
              <meshStandardMaterial
                color="#e8f4fc"
                transparent
                opacity={0.45}
                roughness={0.35}
                metalness={0}
              />
            </mesh>
          ))
        : null}

      {isActive ? (
        <FlavorAura flavorId={drink.id} visible={!checkoutOpen} />
      ) : null}
    </a.group>
  );
}

export function WoodenCounter({ length }: { length: number }) {
  return (
    <mesh position={[((length - 1) * CUP_SPACING) / 2, -1.15, 0]} receiveShadow>
      <boxGeometry args={[length * CUP_SPACING + 4, 0.35, 3.2]} />
      <meshStandardMaterial
        color="#c9a96e"
        roughness={0.75}
        metalness={0.05}
        map={undefined}
      />
    </mesh>
  );
}
