"use client";

import { useSpring } from "@react-spring/three";
import { ContactShadows, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { CounterCup, WoodenCounter } from "@/components/three/CounterCup";
import { CUP_SPACING } from "@/context/MenuCounterContext";
import { DRINKS } from "@/lib/drinks";

interface CafeCounterSceneProps {
  activeIndex: number;
  checkoutOpen: boolean;
  isNight: boolean;
  compact?: boolean;
  onCupClick: () => void;
}

export function CafeCounterScene({
  activeIndex,
  checkoutOpen,
  isNight,
  compact = false,
  onCupClick,
}: CafeCounterSceneProps) {
  const rigRef = useRef<THREE.Group>(null);
  const shadowRigRef = useRef<THREE.Group>(null);
  const prevX = useRef(0);
  const glideSpeed = useRef(0);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);
  const { camera } = useThree();

  const cupX = activeIndex * CUP_SPACING;
  const camY = compact ? 1.05 : 0.85;
  const camZ = compact ? 4.15 : 5.4;
  const lookY = compact ? 0.35 : 0.5;

  const [{ camX }, camApi] = useSpring(() => ({
    camX: cupX,
    config: { tension: 60, friction: 26, mass: 1.8 },
  }));

  useEffect(() => {
    camApi.start({
      camX: cupX,
      config: { tension: 60, friction: 26, mass: 1.8 },
    });
  }, [cupX, camApi]);

  useEffect(() => {
    if ("fov" in camera) {
      (camera as THREE.PerspectiveCamera).fov = compact ? 48 : 42;
      camera.updateProjectionMatrix();
    }
  }, [camera, compact]);

  useFrame((_, delta) => {
    const x = camX.get();
    const dt = Math.max(delta, 1e-4);

    // Smoothed glide speed drives a subtle lift + pull-back while the camera
    // travels between cups, so scrolling feels like a swooping dolly move
    // instead of a flat slide.
    const speed = Math.abs(x - prevX.current) / dt;
    prevX.current = x;
    glideSpeed.current += (speed - glideSpeed.current) * Math.min(1, dt * 6);
    const lift = Math.min(compact ? 0.22 : 0.35, glideSpeed.current * 0.055);
    const pullBack = Math.min(compact ? 0.35 : 0.55, glideSpeed.current * 0.09);

    camera.position.set(x, camY + lift, camZ + pullBack);
    camera.lookAt(x, lookY, 0);

    // The light rig and floor shadow glide with the camera instead of
    // snapping to the new cup.
    if (rigRef.current) {
      rigRef.current.position.x = x;
    }
    if (shadowRigRef.current) {
      shadowRigRef.current.position.x = x;
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
        intensity={isNight ? 0.28 : 0.55}
        color={isNight ? "#4a3f55" : "#fff5e8"}
      />

      {/* Everything in this rig follows the gliding camera (set per-frame),
          so the lighting travels with you instead of snapping to the new cup. */}
      <group ref={rigRef}>
        {/* Soft overhead key — kept off the right so cups aren't blasted from +X */}
        <directionalLight
          position={[-0.4, 7, 3]}
          intensity={isNight ? 0.45 : 0.55}
          color={isNight ? "#f4a582" : "#ffe8cc"}
          castShadow
          shadow-mapSize={[512, 512]}
        />
        {/* Left fill only — right-side directional intentionally omitted */}
        <directionalLight
          position={[-5, 3, 2]}
          intensity={isNight ? 0.28 : 0.4}
          color={isNight ? "#c4842f" : "#fff8f0"}
        />
        <pointLight
          position={[-0.6, 2, 2]}
          intensity={isNight ? 3.5 : 1.4}
          color={isNight ? "#ff8c69" : "#f4a582"}
          distance={10}
        />
        {/* Display-case downlight over the active cup */}
        <spotLight
          position={[-0.35, 4.2, 1.2]}
          angle={0.4}
          penumbra={1}
          intensity={isNight ? 18 : 10}
          color={isNight ? "#ffb38a" : "#fff3dd"}
          distance={12}
          target={spotTarget}
        />
        <primitive object={spotTarget} position={[0, -0.4, 0]} />

        {isNight ? (
          <group position={[0, 2.8, -3]}>
            <mesh>
              <boxGeometry args={[4, 0.6, 0.15]} />
              <meshStandardMaterial
                color="#f4a582"
                emissive="#ff6b9d"
                emissiveIntensity={1.5}
              />
            </mesh>
            <pointLight
              position={[-0.5, 0, 1]}
              intensity={4}
              color="#ff8c69"
              distance={12}
            />
          </group>
        ) : null}
      </group>

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

      <group ref={shadowRigRef}>
        <ContactShadows
          position={[0, -0.95, 0]}
          opacity={0.32}
          scale={10}
          blur={2}
          far={4}
          resolution={256}
          color="#8b6f47"
        />
      </group>

      <Environment
        preset="apartment"
        environmentIntensity={0.45}
        resolution={256}
      />
    </>
  );
}
