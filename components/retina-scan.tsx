"use client"

import { useEffect, useState } from "react"
import { useSound } from "./sound-manager"

interface RetinaScanProps {
  onComplete: () => void
}

const RetinaScan = ({ onComplete }: RetinaScanProps) => {
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState<"scanning" | "analyzing" | "complete" | "failed">("scanning")
  const [scanData, setScanData] = useState({
    retinalMatch: 0,
    neuralLink: "Connecting...",
    accessStatus: "PENDING",
  })
  const [coreIntensity, setCoreIntensity] = useState(0.5)
  const [isDisappearing, setIsDisappearing] = useState(false)
  const [phaseTransition, setPhaseTransition] = useState(false)
  const { playSound } = useSound()

  useEffect(() => {
    // Start scan animation
    playSound("decrypt")

    // Animate scan progress
    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          // Add phase transition effect
          setPhaseTransition(true)
          setTimeout(() => {
            setPhaseTransition(false)
            analyzeScan()
          }, 500) // Reduced from 800ms to 500ms
          return 100
        }
        return prev + 2 // Increased from +1 to +2 for faster progress
      })
    }, 30) // Reduced from 50ms to 30ms

    // Animate core pulsing
    const pulseInterval = setInterval(() => {
      setCoreIntensity((prev) => 0.5 + Math.sin(Date.now() / 500) * 0.3)
    }, 50)

    return () => {
      clearInterval(scanInterval)
      clearInterval(pulseInterval)
    }
  }, [playSound])

  // Modify the analyzeScan function to include the disappearing animation
  const analyzeScan = () => {
    setScanStatus("analyzing")
    playSound("decrypt")

    // Animate retinal match percentage
    let matchPercent = 0
    const matchInterval = setInterval(() => {
      matchPercent += 2 // Increased from +1 to +2 for faster progress
      setScanData((prev) => ({
        ...prev,
        retinalMatch: matchPercent,
      }))

      if (matchPercent >= 97.4) {
        clearInterval(matchInterval)

        // Update neural link status with transition
        setTimeout(() => {
          setPhaseTransition(true)
          setTimeout(() => {
            setPhaseTransition(false)
            setScanData((prev) => ({
              ...prev,
              neuralLink: "Established",
            }))

            // Grant access with transition
            setTimeout(() => {
              setPhaseTransition(true)
              setTimeout(() => {
                setPhaseTransition(false)
                setScanStatus("complete")
                setScanData((prev) => ({
                  ...prev,
                  accessStatus: "GRANTED",
                }))
                playSound("command")

                // Start disappearing animation for the entire interface
                setTimeout(() => {
                  setIsDisappearing(true)
                  playSound("glitch")

                  // Proceed to boot sequence after disappearing animation
                  setTimeout(() => {
                    onComplete()
                  }, 800) // Reduced from 1500ms to 800ms
                }, 800) // Reduced from 1500ms to 800ms
              }, 300) // Reduced from 600ms to 300ms
            }, 500) // Reduced from 1000ms to 500ms
          }, 300) // Reduced from 600ms to 300ms
        }, 500) // Reduced from 1000ms to 500ms
      }
    }, 10) // Reduced from 20ms to 10ms
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-30"></div>

      {/* Phase transition overlay */}
      <div
        className={`absolute inset-0 bg-green-500/10 pointer-events-none transition-opacity duration-500 z-50 ${
          phaseTransition ? "opacity-40" : "opacity-0"
        }`}
      ></div>

      <div className="relative w-96 h-96 flex flex-col items-center justify-center">
        {/* Energy Core visualization */}
        <div
          className={`relative w-64 h-64 mb-8 transition-all duration-1500 ${
            isDisappearing ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        >
          {/* Outer neon-green circle */}
          <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-pulse-slow"></div>

          {/* Pulsating rim elements */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-4 bg-green-500"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "0 -32px",
                transform: `rotate(${i * 30}deg) translateX(-0.75px)`,
                opacity: 0.7 + Math.sin(Date.now() / 1000 + i) * 0.3,
                boxShadow: "0 0 5px #00ff00, 0 0 10px #00ff00",
              }}
            ></div>
          ))}

          {/* Secondary rim */}
          <div className="absolute top-1/2 left-1/2 w-56 h-56 border border-green-500/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          {/* Energy Core container */}
          <div
            className={`absolute top-1/2 left-1/2 w-52 h-52 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden transition-all duration-1500 ${
              isDisappearing ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
          >
            {/* Dark background with radial gradient */}
            <div
              className="absolute inset-0 bg-black"
              style={{
                background: "radial-gradient(circle, rgba(0,20,40,1) 0%, rgba(0,0,0,1) 70%)",
              }}
            ></div>

            {/* Energy Core - central glowing orb */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: `${24 + coreIntensity * 8}px`,
                height: `${24 + coreIntensity * 8}px`,
                background:
                  "radial-gradient(circle, rgba(0,200,255,1) 0%, rgba(0,100,200,0.8) 50%, rgba(0,50,150,0) 100%)",
                boxShadow: `0 0 ${20 + coreIntensity * 30}px rgba(0,150,255,${0.5 + coreIntensity * 0.5})`,
                opacity: 0.8 + coreIntensity * 0.2,
              }}
            ></div>

            {/* Energy tendrils - emanating from the core */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`tendril-${i}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "2px",
                  height: `${80 + Math.sin(Date.now() / 1000 + i * 0.5) * 20}px`,
                  background:
                    "linear-gradient(to top, rgba(0,150,255,0) 0%, rgba(0,150,255,0.8) 50%, rgba(0,150,255,0) 100%)",
                  transformOrigin: "bottom center",
                  transform: `rotate(${i * 45}deg)`,
                  opacity: 0.6 + Math.sin(Date.now() / 800 + i) * 0.4,
                }}
              ></div>
            ))}

            {/* Pulsating energy rings */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`ring-${i}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-blue-400/30 rounded-full"
                style={{
                  width: `${(i + 1) * 40 + Math.sin(Date.now() / 1000 + i) * 10}px`,
                  height: `${(i + 1) * 40 + Math.sin(Date.now() / 1000 + i) * 10}px`,
                  opacity: 0.3 + Math.sin(Date.now() / 800 + i * 0.5) * 0.2,
                  boxShadow: `0 0 10px rgba(0,150,255,${0.2 - i * 0.05})`,
                }}
              ></div>
            ))}

            {/* Energy particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute bg-blue-300 rounded-full"
                style={{
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  top: `${50 + Math.sin(Date.now() / 1000 + i) * (20 + (i % 5) * 5)}%`,
                  left: `${50 + Math.cos(Date.now() / 1000 + i) * (20 + (i % 5) * 5)}%`,
                  opacity: 0.5 + Math.random() * 0.5,
                  boxShadow: "0 0 3px rgba(0,150,255,0.8)",
                  animation: `float ${3 + Math.random() * 4}s infinite linear`,
                  animationDelay: `${-Math.random() * 5}s`,
                }}
              ></div>
            ))}

            {/* Heartbeat pulse effect */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid rgba(0,150,255,0.3)",
                animation: "heartbeat 1.5s infinite ease-out",
                opacity: 0.3,
              }}
            ></div>

            {/* Scanning line */}
            {scanStatus === "scanning" && (
              <div
                className="absolute left-0 w-full h-1 bg-red-500/80 z-30"
                style={{
                  top: `${(scanProgress / 100) * 100}%`,
                  boxShadow: "0 0 5px #ff0000, 0 0 10px #ff0000",
                }}
              ></div>
            )}
          </div>

          {/* Target reticle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-60 h-60 border border-green-500/30 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-green-500/30"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-green-500/30"></div>
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-green-500/70"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green-500/70"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-green-500/70"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-green-500/70"></div>
          </div>
        </div>

        {/* HUD Interface */}
        <div
          className={`text-green-500 font-mono w-full transition-all duration-1500 ${
            isDisappearing ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Scan status */}
          <div className="text-center">
            <div
              className={`text-xl font-bold mb-2 transition-opacity duration-300 ${phaseTransition ? "opacity-0" : "opacity-100"}`}
            >
              {scanStatus === "scanning" && "[SCANNING ENERGY CORE...]"}
              {scanStatus === "analyzing" && "[ANALYZING ENERGY SIGNATURE...]"}
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
          {(scanStatus === "analyzing" || scanStatus === "complete") && (
            <div className="mt-8 text-center">
              <div className="space-y-2 mb-4">
                <div
                  className={`flex justify-between px-8 transition-all duration-500 ${phaseTransition ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"}`}
                >
                  <span>Energy Signature:</span>
                  <span className={scanData.retinalMatch >= 90 ? "text-green-400" : "text-yellow-400"}>
                    {scanData.retinalMatch.toFixed(1)}% Match
                  </span>
                </div>
                <div
                  className={`flex justify-between px-8 transition-all duration-500 delay-100 ${phaseTransition ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"}`}
                >
                  <span>Neural Link:</span>
                  <span className={scanData.neuralLink === "Established" ? "text-green-400" : "text-yellow-400"}>
                    {scanData.neuralLink}
                  </span>
                </div>
                {scanStatus === "complete" && (
                  <div
                    className={`mt-4 text-xl font-bold animate-pulse transition-all duration-500 delay-200 ${phaseTransition ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"}`}
                  >
                    [ACCESS {scanData.accessStatus}] Proceeding to System...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional HUD elements */}
      <div
        className={`absolute top-4 left-4 text-green-500/70 font-mono text-xs transition-opacity duration-1500 ${
          isDisappearing ? "opacity-0" : "opacity-100"
        }`}
      >
        SYSTEM: VEDANT_OS v3.7.2
      </div>
      <div
        className={`absolute top-4 right-4 text-green-500/70 font-mono text-xs transition-opacity duration-1500 ${
          isDisappearing ? "opacity-0" : "opacity-100"
        }`}
      >
        SECURITY LEVEL: ALPHA
      </div>
      <div
        className={`absolute bottom-4 left-4 text-green-500/70 font-mono text-xs transition-opacity duration-1500 ${
          isDisappearing ? "opacity-0" : "opacity-100"
        }`}
      >
        SCAN TYPE: ENERGY CORE
      </div>
      <div
        className={`absolute bottom-4 right-4 text-green-500/70 font-mono text-xs transition-opacity duration-1500 ${
          isDisappearing ? "opacity-0" : "opacity-100"
        }`}
      >
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}

export default RetinaScan

