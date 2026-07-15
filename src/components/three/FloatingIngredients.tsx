"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import * as THREE from "three";

interface FloatingIngredientsProps {
  mouseX: number;
  mouseY: number;
}

export function FloatingIngredients({ mouseX, mouseY }: FloatingIngredientsProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.4 + i * 1.2) * 0.08;
      child.rotation.z = Math.sin(t * 0.25 + i) * 0.15;
    });
    groupRef.current.position.x = mouseX * -0.35;
    groupRef.current.position.y = mouseY * 0.2;
  });

  return (
    <group ref={groupRef} position={[0, 0, -2.5]}>
      <Float speed={0.6} floatIntensity={0.3}>
        <mesh position={[-2.2, 0.8, 0]} rotation={[0.4, 0.3, 0.6]} scale={0.35}>
          <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial
            color="#f4a582"
            transparent
            opacity={0.35}
            roughness={0.8}
          />
        </mesh>
      </Float>

      <Float speed={0.5} floatIntensity={0.25}>
        <mesh position={[2.4, -0.3, -0.3]} scale={0.22}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#e8f4fc"
            transparent
            opacity={0.3}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </Float>

      <Float speed={0.7} floatIntensity={0.35}>
        <mesh position={[1.6, 1.1, 0.2]} rotation={[0, 0, 0.8]} scale={[0.5, 0.25, 0.05]}>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshStandardMaterial
            color="#8fbc9a"
            transparent
            opacity={0.4}
            roughness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
    </group>
  );
}
