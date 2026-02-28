'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleScene() {
  const meshRef = useRef<THREE.Points>(null)
  const particleCount = 5000

  const particles = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3)
    const colArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100
      posArray[i + 1] = (Math.random() - 0.5) * 100
      posArray[i + 2] = (Math.random() - 0.5) * 100

      // Color variation between purple and gold
      const useGold = Math.random() > 0.7
      if (useGold) {
        colArray[i] = 1
        colArray[i + 1] = 0.84
        colArray[i + 2] = 0
      } else {
        colArray[i] = 0.55
        colArray[i + 1] = 0.35
        colArray[i + 2] = 1
      }
    }

    return { posArray, colArray }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += 0.00005
    meshRef.current.rotation.y += 0.0001
  })

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.posArray}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colArray}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>
    </>
  )
}
