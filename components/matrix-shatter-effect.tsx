"use client"

import { useEffect, useRef } from "react"

const MatrixShatterEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Matrix characters
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~"

    // Particle system for the shatter effect
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      char: string
      size: number
      opacity: number
      rotationSpeed: number
      rotation: number
    }

    const particles: Particle[] = []
    const particleCount = 200

    // Create particles in a face-like shape
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.4

    for (let i = 0; i < particleCount; i++) {
      // Create particles in a rough face shape
      let x, y

      if (Math.random() > 0.7) {
        // Head outline
        const angle = Math.random() * Math.PI * 2
        x = centerX + Math.cos(angle) * radius * (0.9 + Math.random() * 0.2)
        y = centerY + Math.sin(angle) * radius * (0.9 + Math.random() * 0.2)
      } else if (Math.random() > 0.6) {
        // Eyes
        const eyeOffsetX = radius * 0.3
        const eyeOffsetY = radius * 0.1
        const eyeRadius = radius * 0.15

        if (Math.random() > 0.5) {
          // Left eye
          const angle = Math.random() * Math.PI * 2
          x = centerX - eyeOffsetX + Math.cos(angle) * eyeRadius
          y = centerY - eyeOffsetY + Math.sin(angle) * eyeRadius
        } else {
          // Right eye
          const angle = Math.random() * Math.PI * 2
          x = centerX + eyeOffsetX + Math.cos(angle) * eyeRadius
          y = centerY - eyeOffsetY + Math.sin(angle) * eyeRadius
        }
      } else if (Math.random() > 0.7) {
        // Mouth
        const mouthWidth = radius * 0.5
        const mouthHeight = radius * 0.1
        x = centerX + (Math.random() - 0.5) * mouthWidth
        y = centerY + radius * 0.3 + (Math.random() - 0.5) * mouthHeight
      } else {
        // Fill the rest of the face
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * radius * 0.9
        x = centerX + Math.cos(angle) * r
        y = centerY + Math.sin(angle) * r
      }

      // Calculate velocity away from center
      const dx = x - centerX
      const dy = y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const normalizedDx = dx / dist
      const normalizedDy = dy / dist

      particles.push({
        x,
        y,
        vx: normalizedDx * (1 + Math.random() * 3),
        vy: normalizedDy * (1 + Math.random() * 3),
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        size: 10 + Math.random() * 10,
        opacity: 0.7 + Math.random() * 0.3,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
      })
    }

    // Animation
    const draw = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Update rotation
        p.rotation += p.rotationSpeed

        // Update opacity (fade out)
        p.opacity *= 0.99

        // Change character occasionally
        if (Math.random() > 0.95) {
          p.char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
        }

        // Draw character
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.font = `${p.size}px monospace`
        ctx.fillStyle = `rgba(0, 255, 0, ${p.opacity})`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
      }

      // Remove faded particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].opacity < 0.05) {
          particles.splice(i, 1)
        }
      }

      // Continue animation if particles remain
      if (particles.length > 0) {
        requestIdRef.current = requestAnimationFrame(draw)
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(requestIdRef.current)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none" />
}

export default MatrixShatterEffect

