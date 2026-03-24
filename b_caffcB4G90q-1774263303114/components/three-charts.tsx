"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Float, MeshTransmissionMaterial } from "@react-three/drei"
import * as THREE from "three"

interface ChartDataPoint {
  value: number
  label: string
}

function PriceBar({ 
  position, 
  height, 
  color,
  delay = 0 
}: { 
  position: [number, number, number]
  height: number
  color: string
  delay?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [animatedHeight, setAnimatedHeight] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1000
      const start = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setAnimatedHeight(height * eased)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }, delay)
    
    return () => clearTimeout(timeout)
  }, [height, delay])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.y = animatedHeight || 0.01
      meshRef.current.position.y = (animatedHeight || 0.01) / 2
    }
  })

  return (
    <mesh ref={meshRef} position={[position[0], 0, position[2]]}>
      <boxGeometry args={[0.3, 1, 0.3]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function PriceChart3DScene({ data }: { data: ChartDataPoint[] }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const max = Math.max(...data.map(d => d.value))
  
  return (
    <group ref={groupRef}>
      {/* Grid floor */}
      <gridHelper args={[10, 10, "#00D1FF", "#1a1f35"]} position={[0, 0, 0]} />
      
      {/* Bars */}
      {data.map((point, i) => {
        const x = (i - data.length / 2) * 0.5
        const normalizedHeight = (point.value / max) * 3
        const isPositive = i > 0 ? point.value > data[i - 1].value : true
        
        return (
          <PriceBar
            key={i}
            position={[x, 0, 0]}
            height={normalizedHeight}
            color={isPositive ? "#00FFB3" : "#FF4D6D"}
            delay={i * 50}
          />
        )
      })}
      
      {/* Ambient elements */}
      <pointLight position={[5, 5, 5]} intensity={1} color="#00D1FF" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#9B5CFF" />
    </group>
  )
}

export function PriceChart3D({ data }: { data: ChartDataPoint[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-full h-64 bg-card/50 rounded-xl animate-pulse" />
  )

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-b from-card/80 to-card/40 border border-border">
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <PriceChart3DScene data={data} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}

// Sentiment Sphere 3D Visualization
function SentimentSphereScene({ sentiment }: { sentiment: number }) {
  const sphereRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  
  const color = sentiment > 60 ? "#00FFB3" : sentiment > 40 ? "#FFD166" : "#FF4D6D"
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color={color} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#9B5CFF" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
            wireframe
          />
        </mesh>
        
        {/* Inner glow sphere */}
        <mesh scale={1.3}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
      </Float>
      
      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      
      {/* Data points orbiting */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.2, 0, Math.sin(angle) * 2.2]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#00D1FF" />
          </mesh>
        )
      })}
    </>
  )
}

export function SentimentSphere3D({ sentiment }: { sentiment: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-full h-48 bg-card/50 rounded-xl animate-pulse" />
  )

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-b from-card/80 to-card/40 border border-border">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <SentimentSphereScene sentiment={sentiment} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}

// Network Graph 3D
function NetworkNode({ 
  position, 
  color, 
  size = 0.15,
  connections = []
}: { 
  position: [number, number, number]
  color: string
  size?: number
  connections?: [number, number, number][]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(size + Math.sin(state.clock.elapsedTime * 2) * 0.02)
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      {connections.map((target, i) => {
        const points = [new THREE.Vector3(...position), new THREE.Vector3(...target)]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color={color} transparent opacity={0.3} />
          </line>
        )
      })}
    </group>
  )
}

function ViralityNetworkScene() {
  const groupRef = useRef<THREE.Group>(null)
  
  const nodes = useMemo(() => {
    const nodeList: { pos: [number, number, number]; color: string; connections: [number, number, number][] }[] = []
    
    // Central node
    nodeList.push({
      pos: [0, 0, 0],
      color: "#00D1FF",
      connections: []
    })
    
    // Generate surrounding nodes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 1.5 + Math.random() * 0.5
      const y = (Math.random() - 0.5) * 1.5
      const pos: [number, number, number] = [
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ]
      
      const colors = ["#00D1FF", "#9B5CFF", "#00FFB3", "#FF4D6D"]
      nodeList.push({
        pos,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [[0, 0, 0]]
      })
    }
    
    return nodeList
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00D1FF" />
      
      {nodes.map((node, i) => (
        <NetworkNode
          key={i}
          position={node.pos}
          color={node.color}
          size={i === 0 ? 0.25 : 0.12}
          connections={node.connections}
        />
      ))}
    </group>
  )
}

export function ViralityNetwork3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-full h-48 bg-card/50 rounded-xl animate-pulse" />
  )

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-b from-card/80 to-card/40 border border-border">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ViralityNetworkScene />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}

// Heatmap 3D
function HeatmapBar({ 
  position, 
  intensity 
}: { 
  position: [number, number, number]
  intensity: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [height, setHeight] = useState(0.1)
  
  useEffect(() => {
    const target = 0.1 + intensity * 2
    const duration = 800
    const start = Date.now()
    const startHeight = height
    
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setHeight(startHeight + (target - startHeight) * eased)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [intensity])

  const color = new THREE.Color()
  color.setHSL(0.5 - intensity * 0.5, 1, 0.5)
  
  return (
    <mesh ref={meshRef} position={[position[0], height / 2, position[2]]}>
      <boxGeometry args={[0.4, height, 0.4]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  )
}

function HeatmapScene() {
  const groupRef = useRef<THREE.Group>(null)
  
  const data = useMemo(() => {
    const grid: number[][] = []
    for (let x = 0; x < 8; x++) {
      grid[x] = []
      for (let z = 0; z < 8; z++) {
        grid[x][z] = Math.random()
      }
    }
    return grid
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[-1.5, -0.5, -1.5]}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 10, 5]} intensity={1} />
      
      {data.map((row, x) =>
        row.map((intensity, z) => (
          <HeatmapBar
            key={`${x}-${z}`}
            position={[x * 0.5, 0, z * 0.5]}
            intensity={intensity}
          />
        ))
      )}
      
      <gridHelper args={[4, 8, "#1a1f35", "#1a1f35"]} position={[1.5, 0, 1.5]} />
    </group>
  )
}

export function EngagementHeatmap3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-full h-48 bg-card/50 rounded-xl animate-pulse" />
  )

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-b from-card/80 to-card/40 border border-border">
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        <HeatmapScene />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  )
}
