"use client";

import { useSpring } from "@react-spring/three";
import { ContactShadows, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import type { DepthOfFieldEffect } from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { CounterCup, WoodenCounter } from "@/components/three/CounterCup";
import { CUP_SPACING } from "@/context/MenuCounterContext";
import { DRINKS } from "@/lib/drinks";

interface CafeCounterSceneProps {
  activeIndex: number;
  checkoutOpen: boolean;
  isNight: boolean;
  onCupClick: () => void;
}

export function CafeCounterScene({
  activeIndex,
  checkoutOpen,
  isNight,
  onCupClick,
}: CafeCounterSceneProps) {
  const dofRef = useRef<DepthOfFieldEffect>(null);
  const focusPoint = useMemo(() => new THREE.Vector3(), []);
  const { camera } = useThree();

  const cupX = activeIndex * CUP_SPACING;

  const [{ camX }, camApi] = useSpring(() => ({
    camX: cupX,
    config: { tension: 32, friction: 24, mass: 2.8 },
  }));

  useEffect(() => {
    camApi.start({
      camX: cupX,
      config: { tension: 32, friction: 24, mass: 2.8 },
    });
  }, [cupX, camApi]);

  useFrame(() => {
    const x = camX.get();
    camera.position.set(x, 0.85, 5.4);
    camera.lookAt(x, 0.5, 0);
    focusPoint.set(x, 0.5, 0);

    if (dofRef.current) {
      dofRef.current.cocMaterial.worldFocusDistance =
        camera.position.distanceTo(focusPoint);
    }
  });

  const cupPositions = useMemo(
    () =>
      DRINKS.map(
        (_, index) => [index * CUP_SPACING, 0.1, 0] as [number, number, number],
      ),
    [],
  );

  return (
    <>
      <color attach="background" args={[isNight ? "#2a2622" : "#f5ebe0"]} />
      <fog attach="fog" args={[isNight ? "#2a2622" : "#f5ebe0", 8, 22]} />

      <ambientLight
        intensity={isNight ? 0.22 : 0.45}
        color={isNight ? "#4a3f55" : "#fff5e8"}
      />
      <directionalLight
        position={[cupX + 3, 6, 4]}
        intensity={isNight ? 0.7 : 1.35}
        color={isNight ? "#f4a582" : "#ffe8cc"}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[cupX - 4, 3, 2]}
        intensity={isNight ? 0.2 : 0.35}
        color={isNight ? "#c4842f" : "#fff8f0"}
      />
      <pointLight
        position={[cupX, 2, 2]}
        intensity={isNight ? 0.85 : 0.4}
        color={isNight ? "#ff8c69" : "#f4a582"}
        distance={10}
      />

      {isNight ? (
        <group position={[cupX, 2.8, -3]}>
          <mesh>
            <boxGeometry args={[4, 0.6, 0.15]} />
            <meshStandardMaterial
              color="#f4a582"
              emissive="#ff6b9d"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight position={[0, 0, 1]} intensity={1.2} color="#ff8c69" distance={12} />
        </group>
      ) : null}

      <WoodenCounter length={DRINKS.length} />

      {DRINKS.map((drink, index) => (
        <CounterCup
          key={drink.id}
          drink={drink}
          position={cupPositions[index]}
          isActive={index === activeIndex}
          checkoutOpen={checkoutOpen}
          onSelect={onCupClick}
        />
      ))}

      <ContactShadows
        position={[cupX, -0.95, 0]}
        opacity={0.42}
        scale={14}
        blur={3}
        far={5}
        color="#8b6f47"
      />

      <Environment preset="apartment" />

      <EffectComposer multisampling={0}>
        <DepthOfField
          ref={dofRef}
          focalLength={0.018}
          bokehScale={4}
          height={720}
          worldFocusRange={2.5}
        />
      </EffectComposer>
    </>
  );
}
