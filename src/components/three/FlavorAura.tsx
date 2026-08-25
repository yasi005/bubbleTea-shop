"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { FlavorId } from "@/lib/types";

interface FlavorAuraProps {
  flavorId: FlavorId;
  visible: boolean;
}

function AuraGroup({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    let settled = true;
    group.traverse((node) => {
      if (!(node as THREE.Mesh).isMesh) {
        return;
      }
      const mesh = node as THREE.Mesh;
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const material of materials) {
        if (!("opacity" in material)) {
          continue;
        }
        const mat = material as THREE.MeshStandardMaterial;
        const goal = visible
          ? typeof mat.userData.goalOpacity === "number"
            ? mat.userData.goalOpacity
            : 0.7
          : 0;
        mat.transparent = true;
        const next = THREE.MathUtils.lerp(mat.opacity, goal, 0.07);
        if (Math.abs(next - goal) > 0.01) {
          settled = false;
        }
        mat.opacity = next;
      }
    });

    // Hide fully faded auras so they stop contributing draw calls.
    group.visible = visible || !settled;
  });

  return <group ref={groupRef}>{children}</group>;
}

function MatchaAura() {
  return (
    <>
      {[[-1.4, 0.9, -0.6], [-0.8, 1.3, -0.9], [-1.8, 0.5, -0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} scale={0.35 + i * 0.08}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#8fbc9a"
            transparent
            opacity={0.55}
            roughness={0.9}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.55;
            }}
          />
        </mesh>
      ))}
      <group position={[-1.6, 0.7, -0.5]} rotation={[0.3, 0.5, -0.4]}>
        {[0, 0.08, -0.08, 0.16, -0.16].map((offset, i) => (
          <mesh key={i} position={[offset, i * 0.06, 0]} rotation={[0, 0, 0.1 * i]}>
            <cylinderGeometry args={[0.02, 0.015, 0.7, 8]} />
            <meshStandardMaterial
              color="#c4a574"
              transparent
              opacity={0.7}
              onUpdate={(self) => {
                self.userData.goalOpacity = 0.7;
              }}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

function StrawberryAura() {
  return (
    <>
      {[
        [1.5, 0.6, -0.5],
        [1.2, 1.1, -0.8],
        [1.8, 0.3, -0.3],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          rotation={[0, 0, i * 0.4]}
          scale={[0.5, 0.35, 0.4]}
        >
          <sphereGeometry args={[1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial
            color="#e85d75"
            transparent
            opacity={0.75}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.75;
            }}
          />
        </mesh>
      ))}
      {[[0.9, 0.8, -0.6], [1.6, 1.0, -0.4]].map((pos, i) => (
        <mesh key={`milk-${i}`} position={pos as [number, number, number]} scale={0.25}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color="#fff8f0"
            transparent
            opacity={0.45}
            roughness={0.2}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.45;
            }}
          />
        </mesh>
      ))}
    </>
  );
}

function PeachAura() {
  return (
    <>
      {[
        [-1.3, 0.7, -0.55],
        [-1.7, 0.4, -0.35],
        [-0.9, 1.0, -0.7],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} scale={[0.45, 0.35, 0.4]}>
          <sphereGeometry args={[1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#f4a582"
            transparent
            opacity={0.7}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.7;
            }}
          />
        </mesh>
      ))}
      {[[-1.5, 1.2, -0.6], [-1.0, 0.5, -0.8]].map((pos, i) => (
        <mesh
          key={`leaf-${i}`}
          position={pos as [number, number, number]}
          rotation={[0.4, 0.3 * i, 0.8]}
          scale={[0.55, 0.3, 0.05]}
        >
          <boxGeometry args={[1, 1, 0.1]} />
          <meshStandardMaterial
            color="#7a9e6a"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.6;
            }}
          />
        </mesh>
      ))}
    </>
  );
}

function BrownSugarAura() {
  return (
    <>
      {[[1.4, 0.5, -0.5], [1.0, 1.0, -0.7], [1.7, 0.8, -0.35]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} scale={0.2 + i * 0.05}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color="#c4842f"
            transparent
            opacity={0.65}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.65;
            }}
          />
        </mesh>
      ))}
      <mesh position={[1.2, 0.3, -0.4]} scale={[0.8, 0.15, 0.8]}>
        <torusGeometry args={[0.5, 0.08, 12, 32]} />
        <meshStandardMaterial
          color="#b87333"
          transparent
          opacity={0.5}
          onUpdate={(self) => {
            self.userData.goalOpacity = 0.5;
          }}
        />
      </mesh>
    </>
  );
}

function MangoAura() {
  return (
    <>
      {[
        [-1.4, 0.8, -0.5],
        [-1.0, 0.4, -0.7],
        [-1.7, 0.5, -0.35],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          rotation={[0, 0.3 * i, 0.2]}
          scale={[0.55, 0.35, 0.4]}
        >
          <sphereGeometry args={[1, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial
            color="#f5d76e"
            transparent
            opacity={0.75}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.75;
            }}
          />
        </mesh>
      ))}
      {[[-1.2, 0.2, -0.5], [-1.5, 0.6, -0.6], [-0.8, 0.55, -0.45]].map((pos, i) => (
        <mesh key={`sago-${i}`} position={pos as [number, number, number]} scale={0.08}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#fff5e8"
            transparent
            opacity={0.8}
            onUpdate={(self) => {
              self.userData.goalOpacity = 0.8;
            }}
          />
        </mesh>
      ))}
    </>
  );
}

export function FlavorAura({ flavorId, visible }: FlavorAuraProps) {
  return (
    <AuraGroup visible={visible}>
      <Float speed={0.8} floatIntensity={0.5} rotationIntensity={0.15}>
        <group>
          {flavorId === "matcha" ? <MatchaAura /> : null}
          {flavorId === "strawberry" ? <StrawberryAura /> : null}
          {flavorId === "peach" ? <PeachAura /> : null}
          {flavorId === "brown-sugar" ? <BrownSugarAura /> : null}
          {flavorId === "mango" ? <MangoAura /> : null}
        </group>
      </Float>
    </AuraGroup>
  );
}
