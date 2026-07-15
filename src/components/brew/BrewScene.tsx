"use client";

import { a, useSpring, type SpringValue } from "@react-spring/three";
import { ContactShadows, Environment } from "@react-three/drei";
import { Physics, useBox, useCylinder, usePlane, useSphere } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import type { Group, Mesh, PerspectiveCamera } from "three";

import { BobaCupModel } from "@/components/three/BobaCupModel";
import { useBrew } from "@/context/BrewContext";
import { useVibe } from "@/context/VibeContext";
import { getBrewLiquidColor, liquidScaleFromLevel, type BrewPhase } from "@/lib/brew";

const WALL_SEGMENTS = 14;
const WALL_RADIUS = 0.38;

const SPARKLE_COUNT = 9;
const SPARKLE_COLORS = ["#ffd9a8", "#fff2d0", "#ffc2a0", "#ffe4c4"];

/** Natural counter-side view — eye level, slight angle down at the cup */
function BrewCamera() {
  const { camera } = useThree();

  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.position.set(0.38, 0.74, 3.75);
    cam.lookAt(0, -0.06, 0);
    cam.fov = 32;
    cam.updateProjectionMatrix();
  }, [camera]);

  return null;
}

/** Warm vanilla/peach particles that circle the cup while the drink seals. */
function SparkleRing({
  opacity,
  slow = false,
}: {
  opacity: SpringValue<number>;
  slow?: boolean;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (slow ? 1.1 : 2.6);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.55, 0]}>
      {Array.from({ length: SPARKLE_COUNT }, (_, index) => {
        const angle = (index / SPARKLE_COUNT) * Math.PI * 2;
        const radius = 0.72;
        const color = SPARKLE_COLORS[index % SPARKLE_COLORS.length];
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(index * 1.7) * 0.12,
              Math.sin(angle) * radius,
            ]}
            scale={0.032 + (index % 3) * 0.012}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <a.meshBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

type ShakeApi = {
  wakeUp: () => void;
  applyLocalImpulse: (
    impulse: [number, number, number],
    localPoint: [number, number, number],
  ) => void;
};

function useShakeImpulse(
  shakeToken: number,
  api: ShakeApi,
  lateral: number,
  upBase: number,
  upVar: number,
): void {
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    api.wakeUp();
    api.applyLocalImpulse(
      [
        (Math.random() - 0.5) * lateral,
        upBase + Math.random() * upVar,
        (Math.random() - 0.5) * lateral,
      ],
      [0, 0, 0],
    );
  }, [shakeToken, api, lateral, upBase, upVar]);
}

/**
 * Wobbles the whole cup (bob + tilt, like the porch slosh) whenever the shake
 * token changes, so shaking moves the glass itself — not just its contents.
 */
function ShakeWobble({
  shakeToken,
  children,
}: {
  shakeToken: number;
  children: ReactNode;
}) {
  const firstRun = useRef(true);
  const [{ wobY, wobX, wobZ }, api] = useSpring(() => ({
    wobY: 0,
    wobX: 0,
    wobZ: 0,
  }));

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    api.start({
      to: [
        {
          wobY: 0.07,
          wobX: 0.12,
          wobZ: 0.09,
          config: { tension: 300, friction: 12 },
        },
        {
          wobY: -0.05,
          wobX: -0.09,
          wobZ: -0.07,
          config: { tension: 300, friction: 12 },
        },
        { wobY: 0, wobX: 0, wobZ: 0, config: { tension: 130, friction: 18 } },
      ],
    });
  }, [shakeToken, api]);

  return (
    <a.group position-y={wobY} rotation-x={wobX} rotation-z={wobZ}>
      {children}
    </a.group>
  );
}

function BrewFloor() {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.95, 0],
    type: "Static",
  }));
  return (
    <mesh ref={ref} visible={false}>
      <planeGeometry args={[12, 12]} />
    </mesh>
  );
}

function CupColliders() {
  // Thin "coaster" floor sitting at the glass's inner bottom (-0.80), so
  // contents rest on the visible base of the cup instead of floating mid-glass.
  const [bottomRef] = useCylinder<Mesh>(() => ({
    type: "Static",
    position: [0, -0.86, 0],
    args: [0.36, 0.34, 0.12, 16],
  }));

  return (
    <>
      <mesh ref={bottomRef} visible={false}>
        <cylinderGeometry args={[0.36, 0.34, 0.12, 16]} />
      </mesh>
      {Array.from({ length: WALL_SEGMENTS }, (_, index) => {
        const angle = (index / WALL_SEGMENTS) * Math.PI * 2;
        const x = Math.cos(angle) * WALL_RADIUS;
        const z = Math.sin(angle) * WALL_RADIUS;
        return <CupWall key={index} position={[x, -0.18, z]} rotationY={-angle} />;
      })}
    </>
  );
}

function CupWall({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  const [ref] = useBox<Mesh>(() => ({
    type: "Static",
    position,
    rotation: [0, rotationY, 0],
    // Tall enough (spans -0.83..0.47) to overlap the floor collider so there
    // is no escape seam at the bottom; top edge sits just under the rim.
    args: [0.22, 1.3, 0.12],
  }));

  return (
    <mesh ref={ref} visible={false}>
      <boxGeometry args={[0.22, 1.3, 0.12]} />
    </mesh>
  );
}

function IceCube({
  id,
  position,
  shakeToken,
}: {
  id: string;
  position: [number, number, number];
  shakeToken: number;
}) {
  // Physics box is padded slightly beyond the visual mesh so cubes collide
  // before they visually touch anything; extra mass helps them settle.
  const [ref, api] = useBox<Mesh>(() => ({
    mass: 0.55,
    position,
    args: [0.135, 0.135, 0.135],
    material: { friction: 0.6, restitution: 0.05 },
    linearDamping: 0.25,
    angularDamping: 0.4,
  }));

  useShakeImpulse(shakeToken, api, 0.65, 0.55, 0.45);

  return (
    <mesh ref={ref} castShadow name={id}>
      <boxGeometry args={[0.12, 0.12, 0.12]} />
      {/* No transmission — it would hide the transparent liquid behind the
          cube. Plain alpha + low roughness reads as ice with the HDRI. */}
      <meshPhysicalMaterial
        color="#dceefb"
        transparent
        opacity={0.85}
        roughness={0.08}
        ior={1.31}
      />
    </mesh>
  );
}

function BobaPearl({
  id,
  position,
  shakeToken,
}: {
  id: string;
  position: [number, number, number];
  shakeToken: number;
}) {
  // Physics radius (0.06) is padded past the visual 0.05 sphere so pearls
  // collide before visually touching the glass; the higher mass stops the
  // bouncy scatter and lets them pile up at the bottom.
  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 0.3,
    position,
    args: [0.06],
    material: { friction: 0.7, restitution: 0.04 },
    linearDamping: 0.3,
    angularDamping: 0.5,
  }));

  useShakeImpulse(shakeToken, api, 0.35, 0.32, 0.28);

  return (
    <mesh ref={ref} castShadow name={id}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color="#3a2b1c" roughness={0.35} />
    </mesh>
  );
}

function BrewCupVisual({
  phase,
  liquidColor,
  liquidScale,
}: {
  phase: BrewPhase;
  liquidColor: string;
  liquidScale: number;
}) {
  const isFinished = phase === "sealing" || phase === "sealed";
  const showLidStraw = isFinished;

  const [{ lidY, strawY, strawTilt, sparkle }, api] = useSpring(() => ({
    lidY: isFinished ? 0.59 : 2.4,
    strawY: isFinished ? 0.6 : 2.9,
    strawTilt: isFinished ? 0.16 : 0.5,
    sparkle: 0,
  }));

  useEffect(() => {
    if (phase === "sealing") {
      // Lid drops first and snaps on with a bouncy overshoot.
      api.start({ lidY: 0.59, config: { tension: 320, friction: 15 } });
      // Straw pierces a beat later, wiggling to rest as it hits the ice.
      api.start({ strawY: 0.6, delay: 230, config: { tension: 340, friction: 9 } });
      api.start({
        strawTilt: 0.16,
        delay: 230,
        config: { tension: 260, friction: 5 },
      });
      // Warm sparkle ring bursts, then settles into a soft ready glow.
      api.start({ sparkle: 1, delay: 340, config: { duration: 280 } });
      api.start({ sparkle: 0.55, delay: 1100, config: { duration: 600 } });
    } else if (phase === "sealed") {
      api.set({ lidY: 0.59, strawY: 0.6, strawTilt: 0.16, sparkle: 0.55 });
    } else {
      api.set({ lidY: 2.4, strawY: 2.9, strawTilt: 0.5, sparkle: 0 });
    }
  }, [phase, api]);

  return (
    <group>
      {/* No transmission on the brew glass: three.js's transmissive pass only
          shows opaque objects behind it, which made the semi-transparent
          liquid invisible. Plain alpha glass + HDRI reflections instead. */}
      <BobaCupModel
        liquidColor={liquidColor}
        liquidScale={liquidScale}
        glassOpacity={0.35}
        glassTransmission={0}
        liquidOpacity={0.8}
        showCup
        showLiquid
        showLid={false}
        showStraw={false}
        showPearls={isFinished}
      />

      {showLidStraw ? (
        <>
          {/* Domed translucent plastic lid */}
          <a.group position-y={lidY}>
            <mesh castShadow>
              <cylinderGeometry args={[0.58, 0.56, 0.13, 40]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transparent
                opacity={0.42}
                roughness={0.06}
                transmission={0.55}
                thickness={0.1}
                ior={1.4}
              />
            </mesh>
            <mesh position={[0, 0.07, 0]} scale={[1, 0.55, 1]} castShadow>
              <sphereGeometry args={[0.5, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial
                color="#ffffff"
                transparent
                opacity={0.34}
                roughness={0.05}
                transmission={0.6}
                thickness={0.08}
                ior={1.4}
              />
            </mesh>
          </a.group>

          {/* Thick pastel straw */}
          <a.group position-x={0.15} position-y={strawY} rotation-z={strawTilt}>
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.045, 1.5, 18]} />
              <meshStandardMaterial color="#f5a9c8" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.12, 18]} />
              <meshStandardMaterial color="#ec86ae" roughness={0.4} />
            </mesh>
          </a.group>

          <SparkleRing opacity={sparkle} slow={phase === "sealed"} />
        </>
      ) : null}
    </group>
  );
}

export function BrewScene() {
  const { isNight } = useVibe();
  const { cup, brewPhase, shakeToken } = useBrew();

  const brewing = brewPhase === "idle";
  const liquidColor = getBrewLiquidColor(cup.currentFlavor);
  const liquidScale = liquidScaleFromLevel(cup.liquidLevel);

  return (
    <>
      <BrewCamera />
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
      <pointLight
        position={[2, 3, 2]}
        intensity={isNight ? 0.6 : 0.35}
        color={isNight ? "#ff8c69" : "#f4a582"}
        distance={10}
      />
      <pointLight
        position={[-1.5, 1.2, 2.5]}
        intensity={isNight ? 0.35 : 0.25}
        color="#fff5e8"
        distance={8}
      />

      <ShakeWobble shakeToken={shakeToken}>
        <BrewCupVisual
          phase={brewPhase}
          liquidColor={liquidColor}
          liquidScale={liquidScale}
        />
      </ShakeWobble>

      {brewing ? (
        <Physics gravity={[0, -12, 0]} allowSleep>
          <BrewFloor />
          <CupColliders />
          {cup.iceCubes.map((cube) => (
            <IceCube
              key={cube.id}
              id={cube.id}
              position={cube.position}
              shakeToken={shakeToken}
            />
          ))}
          {cup.pearls.map((pearl) => (
            <BobaPearl
              key={pearl.id}
              id={pearl.id}
              position={pearl.position}
              shakeToken={shakeToken}
            />
          ))}
        </Physics>
      ) : null}

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
