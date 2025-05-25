"use client"

import { useState, useEffect } from "react"
import { useSound } from "./sound-manager"

interface IPTrackerProps {
  onClose: () => void
}

const IPTracker = ({ onClose }: IPTrackerProps) => {
  const [step, setStep] = useState(0)
  const [ipAddress, setIpAddress] = useState("192.168.1.1")
  const [location, setLocation] = useState("UNKNOWN")
  const [isFadingOut, setIsFadingOut] = useState(false)
  const { playSound } = useSound()

  useEffect(() => {
    // Generate a random IP address
    const generateIP = () => {
      return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    }

    setIpAddress(generateIP())

    // Simulate a trace sequence
    const sequence = [
      () => {
        playSound("decrypt")
        setStep(1)
      },
      () => {
        playSound("decrypt")
        setStep(2)
      },
      () => {
        playSound("glitch")
        setStep(3)
      },
      () => {
        playSound("error")
        setStep(4)
      },
    ]

    const timeoutIds: NodeJS.Timeout[] = []

    sequence.forEach((action, index) => {
      const timeoutId = setTimeout(action, 1000 * (index + 1))
      timeoutIds.push(timeoutId)
    })

    // Auto-close after sequence with fade-out animation
    const closeTimeoutId = setTimeout(() => {
      setIsFadingOut(true)
      setTimeout(() => {
        onClose()
      }, 1000)
    }, 7000)
    timeoutIds.push(closeTimeoutId)

    return () => timeoutIds.forEach((id) => clearTimeout(id))
  }, [onClose, playSound])

  // Handle manual close with fade-out
  const handleClose = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  return (
    <div
      className={`fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-md bg-black border border-green-500 rounded-md p-4 font-mono text-green-500 terminal-scrollbar overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">IP TRACE UTILITY v1.0</h3>
          <button onClick={handleClose} className="text-green-500 hover:text-green-400">
            [X]
          </button>
        </div>

        <div className="space-y-2">
          {step >= 0 && (
            <div className="flex">
              <span className="text-green-400 mr-2">[TRACE]</span>
              <span>Initiating IP trace sequence...</span>
            </div>
          )}

          {step >= 1 && (
            <div className="flex">
              <span className="text-green-400 mr-2">[TRACE]</span>
              <span>Target IP: {ipAddress}</span>
            </div>
          )}

          {step >= 2 && (
            <div className="flex">
              <span className="text-green-400 mr-2">[TRACE]</span>
              <span>IP Location: {location}</span>
            </div>
          )}

          {step >= 3 && (
            <div className="flex animate-pulse">
              <span className="text-yellow-400 mr-2">[WARNING]</span>
              <span>Countermeasures detected. Trace compromised.</span>
            </div>
          )}

          {step >= 4 && (
            <div className="flex text-red-500 animate-glitch">
              <span className="mr-2">[ALERT]</span>
              <span>You are being watched. Disconnect immediately.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IPTracker

