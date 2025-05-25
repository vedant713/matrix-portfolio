"use client"

import { useEffect, useRef, useState } from "react"

interface MatrixRainProps {
  density?: number
  speed?: number
  fontSize?: number
  opacity?: number
}

const MatrixRain = ({ density = 0.05, speed = 1.2, fontSize = 14, opacity = 0.05 }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const columns = Math.floor(canvas.width / fontSize)

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height)
    }

    // Include more characters for authenticity
    const matrix =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set the text style
      ctx.font = `${fontSize}px monospace`

      // Draw each character
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = matrix[Math.floor(Math.random() * matrix.length)]

        // Vary the green color for more depth
        const green = 128 + Math.floor(Math.random() * 128)
        ctx.fillStyle = `rgba(0, ${green}, 0, ${0.5 + Math.random() * 0.5})`

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * 1)

        // Reset drop when it reaches bottom or randomly for varied lengths
        if (drops[i] * fontSize > canvas.height && Math.random() > 1 - density) {
          drops[i] = Math.random() * -100
        }

        // Move drop down
        drops[i] += speed
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
    }
  }, [dimensions, density, speed, fontSize, opacity])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
}

export default MatrixRain

