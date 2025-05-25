"use client"

import { useEffect, useRef, useState } from "react"
import { useSound } from "./sound-manager"
import * as THREE from "three"

interface RetinaScannerProps {
  onComplete: () => void
}

const RetinaScanner = ({ onComplete }: RetinaScannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState<"scanning" | "analyzing" | "complete" | "failed">("scanning")
  const [scanData, setScanData] = useState({
    retinalMatch: 0,
    neuralLink: "Connecting...",
    accessStatus: "PENDING",
  })
  const { playSound } = useSound()
  const animationFrameRef = useRef<number>(0)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const eyeModelRef = useRef<THREE.Group | null>(null)
  const scannerLightRef = useRef<THREE.SpotLight | null>(null)
  const scanLineRef = useRef<THREE.Mesh | null>(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    // Create eye wireframe model
    const eyeGroup = new THREE.Group()

    // Create sclera (white of the eye)
    const scleraGeometry = new THREE.CircleGeometry(1.5, 32)
    const scleraMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })
    const sclera = new THREE.Mesh(scleraGeometry, scleraMaterial)
    eyeGroup.add(sclera)

    // Create iris
    const irisGeometry = new THREE.CircleGeometry(0.8, 32)
    const irisMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    })
    const iris = new THREE.Mesh(irisGeometry, irisMaterial)
    iris.position.z = 0.01
    eyeGroup.add(iris)

    // Create pupil
    const pupilGeometry = new THREE.CircleGeometry(0.3, 32)
    const pupilMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.9,
    })
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
    pupil.position.z = 0.02
    eyeGroup.add(pupil)

    // Create scanning line
    const scanLineGeometry = new THREE.PlaneGeometry(3.2, 0.05)
    const scanLineMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.7,
    })
    const scanLine = new THREE.Mesh(scanLineGeometry, scanLineMaterial)
    scanLine.position.z = 0.03
    scanLine.position.y = -1.8 // Start below the eye
    scanLine.visible = true
    eyeGroup.add(scanLine)
    scanLineRef.current = scanLine

    // Add circular HUD elements
    const hudRadius = 2.2
    const hudSegments = 64
    const hudGeometry = new THREE.RingGeometry(hudRadius, hudRadius + 0.05, hudSegments)
    const hudMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
    })
    const hud = new THREE.Mesh(hudGeometry, hudMaterial)
    eyeGroup.add(hud)

    // Add HUD tick marks
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const tickGeometry = new THREE.PlaneGeometry(0.1, 0.3)
      const tickMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.7,
      })
      const tick = new THREE.Mesh(tickGeometry, tickMaterial)
      tick.position.x = Math.sin(angle) * (hudRadius + 0.2)
      tick.position.y = Math.cos(angle) * (hudRadius + 0.2)
      tick.rotation.z = angle
      eyeGroup.add(tick)
    }

    // Add scanner light
    const scannerLight = new THREE.SpotLight(0xff0000, 2)
    scannerLight.position.set(0, 0, 5)
    scannerLight.angle = 0.3
    scannerLight.penumbra = 0.2
    scannerLight.distance = 10
    scannerLight.castShadow = true
    scannerLightRef.current = scannerLight
    scene.add(scannerLight)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    scene.add(eyeGroup)
    eyeModelRef.current = eyeGroup

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !eyeModelRef.current) return

      // Subtle eye movement
      eyeModelRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.05

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Start scan animation
    startScan()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)

      // Clean up Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          }
        }
      })

      renderer.dispose()
    }
  }, [])

  // Scan animation
  const startScan = () => {
    playSound("decrypt")

    let scanPosition = -1.8
    const scanSpeed = 0.02
    let scanComplete = false

    const animateScan = () => {
      if (!scanLineRef.current) return

      if (scanPosition < 1.8) {
        scanPosition += scanSpeed
        scanLineRef.current.position.y = scanPosition

        // Update scan progress (map from -1.8 to 1.8 to 0 to 100)
        const progress = ((scanPosition + 1.8) / 3.6) * 100
        setScanProgress(progress)

        requestAnimationFrame(animateScan)
      } else if (!scanComplete) {
        scanComplete = true
        analyzeScan()
      }
    }

    animateScan()
  }

  // Analyze scan results
  const analyzeScan = () => {
    setScanStatus("analyzing")
    playSound("decrypt")

    // Change scanner light to green
    if (scannerLightRef.current) {
      scannerLightRef.current.color.set(0x00ff00)
    }

    // Animate retinal match percentage
    let matchPercent = 0
    const matchInterval = setInterval(() => {
      matchPercent += 1
      setScanData((prev) => ({
        ...prev,
        retinalMatch: matchPercent,
      }))

      if (matchPercent >= 97.4) {
        clearInterval(matchInterval)

        // Update neural link status
        setTimeout(() => {
          setScanData((prev) => ({
            ...prev,
            neuralLink: "Established",
          }))

          // Grant access
          setTimeout(() => {
            setScanStatus("complete")
            setScanData((prev) => ({
              ...prev,
              accessStatus: "GRANTED",
            }))
            playSound("command")

            // Proceed to boot sequence
            setTimeout(() => {
              onComplete()
            }, 2000)
          }, 1000)
        }, 1000)
      }
    }, 20)
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50" ref={containerRef}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500 font-mono z-10 pointer-events-none">
        {/* HUD Interface */}
        <div className="relative w-96 h-96">
          {/* Scan status */}
          <div className="absolute top-0 left-0 right-0 text-center">
            <div className="text-xl font-bold mb-2">
              {scanStatus === "scanning" && "[SCANNING...]"}
              {scanStatus === "analyzing" && "[ANALYZING...]"}
              {scanStatus === "complete" && "[ACCESS GRANTED]"}
              {scanStatus === "failed" && "[ACCESS DENIED]"}
            </div>

            {scanStatus === "scanning" && (
              <div className="w-64 mx-auto bg-green-900/30 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Scan data */}
          {scanStatus === "analyzing" || scanStatus === "complete" ? (
            <div className="absolute bottom-0 left-0 right-0 text-center">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between px-8">
                  <span>Retinal Pattern:</span>
                  <span className={scanData.retinalMatch >= 90 ? "text-green-400" : "text-yellow-400"}>
                    {scanData.retinalMatch.toFixed(1)}% Match
                  </span>
                </div>
                <div className="flex justify-between px-8">
                  <span>Neural Link:</span>
                  <span className={scanData.neuralLink === "Established" ? "text-green-400" : "text-yellow-400"}>
                    {scanData.neuralLink}
                  </span>
                </div>
                {scanStatus === "complete" && (
                  <div className="mt-4 text-xl font-bold animate-pulse">
                    [ACCESS {scanData.accessStatus}] Proceeding to System...
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-30"></div>
    </div>
  )
}

export default RetinaScanner

