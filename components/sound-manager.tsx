"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type SoundType = "typing" | "command" | "error" | "decrypt" | "glitch" | "boot"

interface SoundContextType {
  playSound: (type: SoundType) => void
  toggleMute: () => void
  isMuted: boolean
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true)
  const [sounds, setSounds] = useState<Record<SoundType, HTMLAudioElement | null>>({
    typing: null,
    command: null,
    error: null,
    decrypt: null,
    glitch: null,
    boot: null,
  })

  useEffect(() => {
    // Only initialize sounds after user interaction
    const initSounds = () => {
      setSounds({
        typing: new Audio("/sounds/typing.mp3"),
        command: new Audio("/sounds/command.mp3"),
        error: new Audio("/sounds/error.mp3"),
        decrypt: new Audio("/sounds/decrypt.mp3"),
        glitch: new Audio("/sounds/glitch.mp3"),
        boot: new Audio("/sounds/boot.mp3"),
      })
    }

    // Initialize sounds on first user interaction
    const handleInteraction = () => {
      initSounds()
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("keydown", handleInteraction)

    return () => {
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("keydown", handleInteraction)
    }
  }, [])

  const playSound = (type: SoundType) => {
    if (isMuted || !sounds[type]) return

    // Stop and reset the sound before playing
    const sound = sounds[type]
    if (sound) {
      sound.currentTime = 0
      sound.play().catch((err) => console.error("Error playing sound:", err))
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return <SoundContext.Provider value={{ playSound, toggleMute, isMuted }}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}

