"use client"

import { useState, useEffect } from "react"
import { useSound } from "./sound-manager"

const bootMessages = [
  { message: "Initializing system...", delay: 250 }, // Reduced from 500ms
  { message: "Loading kernel modules...", delay: 150 }, // Reduced from 300ms
  { message: "Establishing secure connection...", delay: 200 }, // Reduced from 400ms
  { message: "Scanning for threats...", delay: 300 }, // Reduced from 600ms
  { message: "Loading Vedant's neural matrix...", delay: 250 }, // Reduced from 500ms
  { message: "Decrypting personal data...", delay: 350 }, // Reduced from 700ms
  { message: "Bypassing security protocols...", delay: 200 }, // Reduced from 400ms
  { message: "AI protocols initialized...", delay: 150 }, // Reduced from 300ms
  { message: "Matrix connection established...", delay: 250 }, // Reduced from 500ms
  { message: "System ready.", delay: 150 }, // Reduced from 300ms
]

interface BootSequenceProps {
  onComplete: () => void
}

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([])
  const [messageOpacities, setMessageOpacities] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [systemReadyPulse, setSystemReadyPulse] = useState(false)
  const { playSound } = useSound()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let currentIndex = 0

    const showNextMessage = () => {
      if (currentIndex < bootMessages.length) {
        playSound("boot")

        // Add new message with fade-in effect
        setVisibleMessages((prev) => [...prev, bootMessages[currentIndex].message])
        setMessageOpacities((prev) => {
          const newOpacities = [...prev, 0] // Start with opacity 0

          // Fade in the new message
          setTimeout(() => {
            setMessageOpacities((current) => {
              const updated = [...current]
              updated[updated.length - 1] = 1 // Set to full opacity
              return updated
            })
          }, 50)

          return newOpacities
        })

        timeoutId = setTimeout(() => {
          currentIndex++
          showNextMessage()
        }, bootMessages[currentIndex].delay)
      } else {
        // Boot sequence complete
        setTimeout(() => {
          setIsComplete(true)
          setSystemReadyPulse(true)
          setTimeout(() => {
            // Start fade out animation
            setIsFadingOut(true)
            // Wait for animation to complete before calling onComplete
            setTimeout(onComplete, 600) // Reduced from 1000ms to 600ms
          }, 600) // Reduced from 1200ms to 600ms
        }, 400) // Reduced from 800ms to 400ms
      }
    }

    // Start the boot sequence
    showNextMessage()

    return () => clearTimeout(timeoutId)
  }, [onComplete, playSound])

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-black text-green-500 font-mono p-8 transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-2xl">
        {visibleMessages.map((message, index) => (
          <div
            key={index}
            className="flex items-start mb-2 transition-all duration-500"
            style={{
              opacity: messageOpacities[index] || 0,
              transform: `translateY(${messageOpacities[index] < 1 ? "10px" : "0"})`,
            }}
          >
            <span className="text-green-400 mr-2">[✓]</span>
            <span>{message}</span>
          </div>
        ))}

        {isComplete && (
          <div
            className={`mt-6 text-center transition-all duration-500 ${systemReadyPulse ? "animate-pulse" : "opacity-0"}`}
          >
            <p className="text-xl text-green-400">SYSTEM READY</p>
            <p className="text-sm mt-2">Press any key to continue...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BootSequence

