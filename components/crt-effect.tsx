"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface CRTEffectProps {
  children: React.ReactNode
  intensity?: number
}

const CRTEffect = ({ children, intensity = 0.5 }: CRTEffectProps) => {
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    // Random flicker effect
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 100 + Math.random() * 100)
      }
    }, 500)

    return () => clearInterval(flickerInterval)
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* CRT Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-50 scanlines"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.03), rgba(0, 255, 0, 0.03) 1px, transparent 1px, transparent 2px)`,
          backgroundSize: `100% ${2 + intensity * 2}px`,
          mixBlendMode: "overlay",
        }}
      />

      {/* CRT Flicker */}
      <div
        className={`absolute inset-0 pointer-events-none z-40 transition-opacity duration-100 ${flicker ? "opacity-20" : "opacity-0"}`}
        style={{
          background: "rgba(0, 255, 0, 0.1)",
          boxShadow: "inset 0 0 100px rgba(0, 255, 0, 0.2)",
        }}
      />

      {/* CRT Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          boxShadow: `inset 0 0 ${50 + intensity * 100}px rgba(0, 0, 0, 0.7)`,
          borderRadius: "5px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full overflow-visible">{children}</div>
    </div>
  )
}

export default CRTEffect

