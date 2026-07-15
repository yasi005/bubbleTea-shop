"use client";

import { useSpring } from "@react-spring/three";
import { ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, MeshStandardMaterial } from "three";

import { BobaCupModel, findLiquidMesh } from "@/components/three/BobaCupModel";
import { FloatingIngredients } from "@/components/three/FloatingIngredients";
import { useVibe } from "@/context/VibeContext";

interface BobaCupSceneProps {
  liquidColor: string;
  spinTrigger: number;
  interactive?: boolean;
  showParallax?: boolean;
  mouseX?: number;
  mouseY?: number;
}

export function BobaCupScene({
  liquidColor,
  spinTrigger,
  interactive = false,
  showParallax = false,
  mouseX = 0,
  mouseY = 0,
}: BobaCupSceneProps) {
  const { isNight } = useVibe();
  const modelRef = useRef<Group>(null);
  const cupGroupRef = useRef<Group>(null);
  const sloshGroupRef = useRef<Group>(null);
  const isDragging = useRef(false);
  const lastPointerX = useRef(0);
  const rotationRef = useRef(0);

  const [{ rotationY }, api] = useSpring(() => ({
    rotationY: 0,
    config: { tension: 120, friction: 28, mass: 1.8 },
  }));

  const [{ sloshY, sloshRotX, sloshRotZ }, sloshApi] = useSpring(() => ({
    sloshY: 0,
    sloshRotX: 0,
    sloshRotZ: 0,
  }));

  useFrame(() => {
    if (cupGroupRef.current) {
      cupGroupRef.current.rotation.y = rotationY.get();
    }
    if (sloshGroupRef.current) {
      sloshGroupRef.current.position.y = sloshY.get();
      sloshGroupRef.current.rotation.x = sloshRotX.get();
      sloshGroupRef.current.rotation.z = sloshRotZ.get();
    }
  });

  useEffect(() => {
    if (spinTrigger === 0) {
      return;
    }

    const from = rotationRef.current;
    const to = from + Math.PI * 2;
    rotationRef.current = to;

    api.start({
      from: { rotationY: from },
      to: { rotationY: to },
      config: { tension: 200, friction: 32, mass: 2.2, clamp: true },
      onRest: () => {
        sloshApi.start({
          sloshY: 0.07,
          sloshRotX: 0.14,
          sloshRotZ: 0.1,
          config: { tension: 280, friction: 14 },
          onRest: () => {
            sloshApi.start({
              sloshY: -0.05,
              sloshRotX: -0.1,
              sloshRotZ: -0.07,
              config: { tension: 280, friction: 14 },
              onRest: () => {
                sloshApi.start({
                  sloshY: 0,
                  sloshRotX: 0,
                  sloshRotZ: 0,
                  config: { tension: 120, friction: 20 },
                });
              },
            });
          },
        });
      },
    });
  }, [spinTrigger, api, sloshApi]);

  useEffect(() => {
    if (!modelRef.current) {
      return;
    }
    const liquid = findLiquidMesh(modelRef.current);
    if (!liquid) {
      return;
    }
    const material = liquid.material as MeshStandardMaterial;
    material.color.set(liquidColor);
  }, [liquidColor]);

  return (
    <>
      <color attach="background" args={[isNight ? "#2a2622" : "#f5ebe0"]} />
      <ambientLight
        intensity={isNight ? 0.3 : 0.6}
        color={isNight ? "#4a3f55" : "#fff5e8"}
      />
      <directionalLight
        position={[4, 6, 3]}
        intensity={isNight ? 0.85 : 1.25}
        color={isNight ? "#f4a582" : "#ffe8cc"}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={isNight ? 0.25 : 0.35}
        color={isNight ? "#ff8c69" : "#fff8f0"}
      />
      {isNight ? (
        <pointLight position={[2, 3, 2]} intensity={0.6} color="#ff8c69" distance={10} />
      ) : null}

      {showParallax ? (
        <FloatingIngredients mouseX={mouseX} mouseY={mouseY} />
      ) : null}

      <group
        ref={cupGroupRef}
        onPointerDown={(event) => {
          if (!interactive) {
            return;
          }
          event.stopPropagation();
          isDragging.current = true;
          lastPointerX.current = event.clientX;
        }}
        onPointerUp={() => {
          isDragging.current = false;
        }}
        onPointerLeave={() => {
          isDragging.current = false;
        }}
        onPointerMove={(event) => {
          if (!interactive || !isDragging.current) {
            return;
          }
          const deltaX = event.clientX - lastPointerX.current;
          lastPointerX.current = event.clientX;
          rotationRef.current += deltaX * 0.01;
          api.start({ rotationY: rotationRef.current, immediate: true });
        }}
      >
        <group ref={sloshGroupRef}>
          <BobaCupModel ref={modelRef} liquidColor={liquidColor} />
        </group>
      </group>

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.38}
        scale={8}
        blur={2.8}
        far={4}
        color="#c4842f"
      />
      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>
    </>
  );
}
