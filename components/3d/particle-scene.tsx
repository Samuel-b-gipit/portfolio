"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleScene() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const particleCount = isMobile ? 2500 : 5000;

  const particles = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3);
    const colArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 120;
      posArray[i + 1] = (Math.random() - 0.5) * 120;
      posArray[i + 2] = (Math.random() - 0.5) * 120;

      const rand = Math.random();
      if (rand > 0.65) {
        // Cyan-teal accent (30%)
        colArray[i] = 0.35;
        colArray[i + 1] = 0.85;
        colArray[i + 2] = 0.82;
      } else if (rand > 0.3) {
        // Electric violet primary (35%)
        colArray[i] = 0.55;
        colArray[i + 1] = 0.3;
        colArray[i + 2] = 1.0;
      } else {
        // Subtle white/blue (35%)
        colArray[i] = 0.7;
        colArray[i + 1] = 0.72;
        colArray[i + 2] = 0.85;
      }
    }

    return { posArray, colArray };
  }, [particleCount]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.00003;
    meshRef.current.rotation.y += 0.00008;

    // Subtle mouse parallax
    const targetRotX = mouseRef.current.y * 0.02;
    const targetRotZ = mouseRef.current.x * 0.01;
    meshRef.current.rotation.x +=
      (targetRotX - meshRef.current.rotation.x) * 0.001;
    meshRef.current.rotation.z +=
      (targetRotZ - meshRef.current.rotation.z) * 0.001;
  });

  return (
    <>
      <color attach="background" args={["#1a1b28"]} />
      <fog attach="fog" args={["#1a1b28", 50, 130]} />
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.posArray}
            itemSize={3}
            args={[particles.posArray, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colArray}
            itemSize={3}
            args={[particles.colArray, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>
    </>
  );
}
