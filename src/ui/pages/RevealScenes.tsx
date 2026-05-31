/**
 * RevealScenes — Lazy-loaded 3D scenes for the reveal experience.
 * 
 * Extracted from RevealPage to enable code-splitting of the heavy
 * Three.js / @react-three/fiber / @react-three/drei dependencies.
 * These are only loaded when the user enters the 'opening' stage.
 */

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import type { BoardTheme } from '../store/types'

function GiftBoxScene(props: { opened: boolean; theme: BoardTheme }) {
  const lidRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (props.opened && lidRef.current) {
      lidRef.current.position.y += (4 - lidRef.current.position.y) * delta * 2
      lidRef.current.rotation.x += (1.5 - lidRef.current.rotation.x) * delta * 2
      lidRef.current.position.z += (-2 - lidRef.current.position.z) * delta * 2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[0, -0.5, 0]}>
        {/* Main Box Body */}
        <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#ff4d4d" metalness={0.2} roughness={0.3} />
        </RoundedBox>
        {/* Ribbon Vertical */}
        <RoundedBox args={[0.5, 2.52, 2.52]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
        </RoundedBox>
        {/* Ribbon Horizontal */}
        <RoundedBox args={[2.52, 0.5, 2.52]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
        </RoundedBox>

        {/* Box Lid */}
        <group ref={lidRef} position={[0, 1.3, 0]}>
          <RoundedBox args={[2.7, 0.6, 2.7]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ff4d4d" metalness={0.2} roughness={0.3} />
          </RoundedBox>
          {/* Lid Ribbons */}
          <RoundedBox args={[0.55, 0.62, 2.72]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[2.72, 0.62, 0.55]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
          </RoundedBox>
        </group>
      </group>
    </Float>
  )
}

function PortalScene(props: { opened: boolean; theme: BoardTheme }) {
  const ring1Ref = useRef<Group>(null)
  const ring2Ref = useRef<Group>(null)
  const coreRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 1.5
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 1.2
    
    if (props.opened && coreRef.current) {
      coreRef.current.scale.setScalar(coreRef.current.scale.x + (15 - coreRef.current.scale.x) * delta * 1.5)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group>
        <group ref={ring1Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.5, 0.05, 16, 100]} />
            <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
          </mesh>
        </group>
        <group ref={ring2Ref}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[2.8, 0.03, 16, 100]} />
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={2} />
          </mesh>
        </group>
        
        <group ref={coreRef}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} transparent opacity={0.9} />
          </mesh>
          <pointLight intensity={10} distance={5} color="#ffffff" />
        </group>
      </group>
    </Float>
  )
}

function CardScene(props: { opened: boolean }) {
  const hingeRef = useRef<Group>(null)
  useFrame((_, delta) => {
    const target = props.opened ? -2.2 : 0
    if (hingeRef.current) {
      hingeRef.current.rotation.y += (target - hingeRef.current.rotation.y) * Math.min(1, delta * 3.8)
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.45}>
      <group rotation={[0.1, -0.4, 0]}>
        <RoundedBox args={[2.1, 3, 0.12]} radius={0.08} smoothness={4} position={[-1.05, 0, 0]}>
          <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.4} />
        </RoundedBox>
        <group ref={hingeRef} position={[0, 0, 0]}>
          <RoundedBox args={[2.1, 3, 0.12]} radius={0.08} smoothness={4} position={[1.05, 0, 0]}>
            <meshStandardMaterial color="#f1f5f9" metalness={0.1} roughness={0.3} />
          </RoundedBox>
        </group>
      </group>
    </Float>
  )
}

/** The main opening stage canvas — default-exported for React.lazy */
export default function RevealOpeningCanvas(props: { opened: boolean; theme: BoardTheme }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
      
      {props.theme.animatedBackground === 'balloons' || props.theme.animatedBackground === 'confetti' ? (
        <GiftBoxScene opened={props.opened} theme={props.theme} />
      ) : props.theme.animatedBackground === 'galaxy' || props.theme.animatedBackground === 'stars' || props.theme.animatedBackground === 'floating-shapes' ? (
        <PortalScene opened={props.opened} theme={props.theme} />
      ) : (
        <CardScene opened={props.opened} />
      )}
    </Canvas>
  )
}
