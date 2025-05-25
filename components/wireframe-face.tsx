"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface WireframeFaceProps {
  isScanning: boolean
  isMatching: boolean
  isComplete: boolean
  isGranted: boolean
}

const WireframeFace = ({ isScanning, isMatching, isComplete, isGranted }: WireframeFaceProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const frameIdRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x00ff00, 1)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)

    // Create wireframe face model
    createWireframeFace()

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      if (modelRef.current) {
        // Rotate the face model
        modelRef.current.rotation.y += 0.005

        // Add slight bobbing motion
        modelRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1

        // If scanning, add a slight glitch effect
        if (isScanning) {
          if (Math.random() > 0.95) {
            modelRef.current.position.x = (Math.random() - 0.5) * 0.1
          } else {
            modelRef.current.position.x *= 0.8
          }
        }

        // If matching, add more intense glitch
        if (isMatching) {
          if (Math.random() > 0.8) {
            modelRef.current.position.x = (Math.random() - 0.5) * 0.2
            modelRef.current.position.y += (Math.random() - 0.5) * 0.2
          }
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  // Update effects based on state changes
  useEffect(() => {
    if (!modelRef.current) return

    if (isComplete) {
      if (isGranted) {
        // Shatter effect for granted access
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          wireframe: true,
          transparent: true,
          opacity: 0.8,
        })

        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material
          }
        })
      } else {
        // Red glitch effect for denied access
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true,
          transparent: true,
          opacity: 0.8,
        })

        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material
          }
        })
      }
    }
  }, [isComplete, isGranted])

  // Create a low-poly face model with wireframe
  const createWireframeFace = () => {
    if (!sceneRef.current) return

    // Create a group to hold the face model
    const faceGroup = new THREE.Group()

    // Create a low-poly sphere for the head
    const headGeometry = new THREE.SphereGeometry(1.2, 16, 16)
    const headMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    faceGroup.add(head)

    // Create eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    })

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.4, 0.2, 0.9)
    faceGroup.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.4, 0.2, 0.9)
    faceGroup.add(rightEye)

    // Create nose
    const noseGeometry = new THREE.ConeGeometry(0.1, 0.4, 4)
    const noseMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    })
    const nose = new THREE.Mesh(noseGeometry, noseMaterial)
    nose.rotation.x = Math.PI / 2
    nose.position.set(0, 0, 1.1)
    faceGroup.add(nose)

    // Create mouth
    const mouthGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI)
    const mouthMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    })
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
    mouth.rotation.x = Math.PI / 2
    mouth.position.set(0, -0.3, 0.9)
    faceGroup.add(mouth)

    // Add face to scene
    sceneRef.current.add(faceGroup)
    modelRef.current = faceGroup
  }

  return <div ref={containerRef} className="w-full h-full" />
}

export default WireframeFace

