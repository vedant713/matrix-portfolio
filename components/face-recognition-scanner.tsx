"use client"

import { useState, useEffect, useRef } from "react"
import { useSound } from "./sound-manager"
import WireframeFace from "./wireframe-face"
import ScanningEffect from "./scanning-effect"
import MatrixShatterEffect from "./matrix-shatter-effect"

interface FaceRecognitionScannerProps {
  onComplete: () => void
}

const FaceRecognitionScanner = ({ onComplete }: FaceRecognitionScannerProps) => {
  const [scanningState, setScanningState] = useState<"initializing" | "scanning" | "matching" | "granted" | "denied">(
    "initializing",
  )
  const [progress, setProgress] = useState(0)
  const { playSound } = useSound()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate the scanning process
    const initTimeout = setTimeout(() => {
      setScanningState("scanning")
      playSound("boot")
    }, 1000)

    return () => clearTimeout(initTimeout)
  }, [playSound])

  useEffect(() => {
    let interval: NodeJS.Timeout
    let timeout: NodeJS.Timeout

    if (scanningState === "scanning") {
      // Progress bar animation
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (1 + Math.random() * 2)
          if (newProgress >= 100) {
            clearInterval(interval)
            setScanningState("matching")
            playSound("decrypt")
            return 100
          }
          return newProgress
        })
      }, 100)

      // After scanning completes, move to matching
      timeout = setTimeout(() => {
        clearInterval(interval)
        setScanningState("matching")
        playSound("decrypt")

        // After matching, grant access (or randomly deny)
        setTimeout(() => {
          // Always grant access for demo purposes
          // In a real app, you could randomly deny access sometimes
          setScanningState("granted")
          playSound("command")

          // After granting access, trigger the completion callback
          setTimeout(() => {
            onComplete()
          }, 2500)
        }, 2000)
      }, 5000)
    }

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [scanningState, playSound, onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="relative w-full max-w-md aspect-square">
        {/* 3D Wireframe Face */}
        <WireframeFace
          isScanning={scanningState === "scanning"}
          isMatching={scanningState === "matching"}
          isComplete={scanningState === "granted" || scanningState === "denied"}
          isGranted={scanningState === "granted"}
        />

        {/* Scanning Effect Overlay */}
        {scanningState === "scanning" && <ScanningEffect />}

        {/* Matrix Shatter Effect when access granted */}
        {scanningState === "granted" && <MatrixShatterEffect />}
      </div>

      {/* Status Text */}
      <div className="mt-8 font-mono text-green-500 text-center">
        {scanningState === "initializing" && (
          <p className="text-xl animate-pulse">Initializing Facial Recognition...</p>
        )}

        {scanningState === "scanning" && (
          <>
            <p className="text-xl mb-2">Scanning Biometric Signature...</p>
            <div className="w-64 bg-green-900/30 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}

        {scanningState === "matching" && <p className="text-xl animate-pulse">Matching Identity Pattern...</p>}

        {scanningState === "granted" && <p className="text-xl text-green-400">ACCESS GRANTED</p>}

        {scanningState === "denied" && (
          <div className="text-xl text-red-500 animate-glitch">[ERROR] Facial Recognition Failed. Try Again.</div>
        )}
      </div>
    </div>
  )
}

export default FaceRecognitionScanner

