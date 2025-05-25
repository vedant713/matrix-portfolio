"use client"

import { useEffect, useRef } from "react"

const ScanningEffect = () => {
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

    // Scanning line animation
    let scanLinePos = 0
    const scanSpeed = 2

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw scanning line
      const gradient = ctx.createLinearGradient(0, scanLinePos - 10, 0, scanLinePos + 10)
      gradient.addColorStop(0, "rgba(0, 255, 0, 0)")
      gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.8)")
      gradient.addColorStop(1, "rgba(0, 255, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, scanLinePos - 10, canvas.width, 20)

      // Draw grid pattern
      ctx.strokeStyle = "rgba(0, 255, 0, 0.3)"
      ctx.lineWidth = 0.5

      // Horizontal grid lines
      const gridSpacing = 20
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw random data points
      ctx.fillStyle = "rgba(0, 255, 0, 0.7)"
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 3 + 1

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw measurement lines near scan line
      if (Math.random() > 0.7) {
        ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"
        ctx.lineWidth = 1

        const lineY = scanLinePos + (Math.random() - 0.5) * 30
        const lineX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1
        const lineWidth = Math.random() * 50 + 20

        ctx.beginPath()
        ctx.moveTo(lineX - lineWidth / 2, lineY)
        ctx.lineTo(lineX + lineWidth / 2, lineY)
        ctx.stroke()

        // Add small vertical ticks
        ctx.beginPath()
        ctx.moveTo(lineX - lineWidth / 2, lineY - 5)
        ctx.lineTo(lineX - lineWidth / 2, lineY + 5)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(lineX + lineWidth / 2, lineY - 5)
        ctx.lineTo(lineX + lineWidth / 2, lineY + 5)
        ctx.stroke()
      }

      // Update scan line position
      scanLinePos += scanSpeed
      if (scanLinePos > canvas.height) {
        scanLinePos = 0
      }

      requestIdRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(requestIdRef.current)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />
}

export default ScanningEffect

