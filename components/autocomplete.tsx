"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSound } from "./sound-manager"

interface AutocompleteProps {
  input: string
  setInput: (value: string) => void
  commands: string[]
}

const Autocomplete = ({ input, setInput, commands }: AutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { playSound } = useSound()

  useEffect(() => {
    if (input.trim() === "") {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = commands.filter((cmd) => cmd.toLowerCase().startsWith(input.toLowerCase()))

    setSuggestions(filtered)
    setSelectedIndex(0)
    setShowSuggestions(filtered.length > 0)
  }, [input, commands])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    // Tab or right arrow for autocomplete
    if (e.key === "Tab" || e.key === "ArrowRight") {
      e.preventDefault()
      if (suggestions.length > 0) {
        setInput(suggestions[selectedIndex])
        playSound("command")
        setShowSuggestions(false)
      }
    }

    // Up arrow to navigate suggestions
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
      playSound("typing")
    }

    // Down arrow to navigate suggestions
    else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
      playSound("typing")
    }

    // Escape to close suggestions
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative">
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-1 w-full max-w-xs bg-black border border-green-500/30 rounded-md overflow-hidden z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-2 py-1 text-sm cursor-pointer ${
                index === selectedIndex ? "bg-green-900/30 text-green-400" : "text-green-500"
              }`}
              onClick={() => {
                setInput(suggestion)
                playSound("command")
                setShowSuggestions(false)
              }}
            >
              {suggestion}
            </div>
          ))}
          <div className="px-2 py-1 text-xs text-green-500/50 border-t border-green-500/20">
            Press Tab to autocomplete
          </div>
        </div>
      )}
    </div>
  )
}

export default Autocomplete

