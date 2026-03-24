"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function DataLines() {
  const linesRef = useRef<THREE.Group>(null)
  const [lines, setLines] = useState<{ points: THREE.Vector3[]; speed: number; progress: number }[]>([])

  useEffect(() => {
    const newLines = []
    for (let i = 0; i < 15; i++) {
      const startX = (Math.random() - 0.5) * 20
      const startY = (Math.random() - 0.5) * 10
      const endX = startX + (Math.random() - 0.5) * 8
      const endY = startY + (Math.random() - 0.5) * 4
      
      newLines.push({
        points: [
          new THREE.Vector3(startX, startY, -5),
          new THREE.Vector3(endX, endY, -5)
        ],
        speed: 0.3 + Math.random() * 0.5,
        progress: Math.random()
      })
    }
    setLines(newLines)
  }, [])

  useFrame((state, delta) => {
    setLines(prev => prev.map(line => ({
      ...line,
      progress: (line.progress + delta * line.speed) % 1
    })))
  })

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(line.points)
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial 
              color="#00D1FF" 
              transparent 
              opacity={0.15 + Math.sin(line.progress * Math.PI) * 0.1} 
            />
          </line>
        )
      })}
    </group>
  )
}

function FloatingGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = ((state.clock.elapsedTime * 0.3) % 2) - 1
    }
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, "#9B5CFF", "#0B0F1A"]}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -10]}
    />
  )
}

function GlowingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const [positions] = useState(() => {
    const pos = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
    }
    return pos
  })

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00D1FF"
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function CryptoNetwork() {
  const groupRef = useRef<THREE.Group>(null)
  const [nodes] = useState(() => {
    const nodeData: { pos: THREE.Vector3; connections: number[] }[] = []
    for (let i = 0; i < 30; i++) {
      nodeData.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8 - 3
        ),
        connections: []
      })
    }
    
    // Connect nearby nodes
    for (let i = 0; i < nodeData.length; i++) {
      for (let j = i + 1; j < nodeData.length; j++) {
        if (nodeData[i].pos.distanceTo(nodeData[j].pos) < 5) {
          nodeData[i].connections.push(j)
        }
      }
    }
    
    return nodeData
  })

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.pos}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#9B5CFF" transparent opacity={0.5} />
          </mesh>
          {node.connections.map((targetIdx) => {
            const points = [node.pos, nodes[targetIdx].pos]
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            return (
              <line key={`${i}-${targetIdx}`} geometry={geometry}>
                <lineBasicMaterial color="#9B5CFF" transparent opacity={0.1} />
              </line>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <FloatingGrid />
      <DataLines />
      <GlowingParticles />
      <CryptoNetwork />
    </>
  )
}

export function DataGridBackground() {
  const [mounted, setMounted] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if WebGL is available before trying to create a context
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl")
      if (!gl) setWebglFailed(true)
    } catch {
      setWebglFailed(true)
    }
  }, [])

  if (!mounted) return null

  // CSS-only fallback when WebGL is exhausted or unavailable
  if (webglFailed) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: false }}
        camera={{ position: [0, 0, 10], fov: 60 }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement
          canvas.addEventListener("webglcontextlost", (e) => {
            e.preventDefault()
            setWebglFailed(true)
          })
        }}
      >
        <Scene />
      </Canvas>
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
    </div>
  )
}
