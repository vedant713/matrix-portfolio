"use client"

import { useState, useEffect } from "react"
import { Typewriter } from "../typewriter"
import { Button } from "@/components/ui/button"

const EasterEggSection = () => {
  const [choice, setChoice] = useState<"red" | "blue" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="The Matrix has you..." delay={50} />
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <p className="animate-pulse">Loading reality options...</p>
          <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-progress"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {!choice && (
            <div className="border border-green-500/30 p-6 rounded-md bg-green-900/10 text-center">
              <p className="mb-6 text-lg">Choose your path:</p>

              <div className="flex justify-center space-x-8">
                <Button
                  onClick={() => setChoice("red")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md transition-all hover:scale-105"
                >
                  Red Pill
                </Button>

                <Button
                  onClick={() => setChoice("blue")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md transition-all hover:scale-105"
                >
                  Blue Pill
                </Button>
              </div>
            </div>
          )}

          {choice === "red" && (
            <div className="border border-red-500/30 p-6 rounded-md bg-red-900/10">
              <h3 className="text-xl font-bold mb-4 text-red-400">Advanced AI & ML Projects</h3>

              <div className="space-y-4">
                <div className="p-3 border border-red-500/20 rounded-md">
                  <h4 className="font-bold">Neural Network Architecture for Fraud Detection</h4>
                  <p className="text-sm mt-1">
                    Deep learning model with 99.8% accuracy for detecting anomalies in financial transactions.
                  </p>
                </div>

                <div className="p-3 border border-red-500/20 rounded-md">
                  <h4 className="font-bold">Transformer-Based NLP for Resume Analysis</h4>
                  <p className="text-sm mt-1">
                    BERT-based model for extracting and categorizing skills from unstructured resume text.
                  </p>
                </div>

                <div className="p-3 border border-red-500/20 rounded-md">
                  <h4 className="font-bold">Reinforcement Learning for Automated Trading</h4>
                  <p className="text-sm mt-1">
                    RL agent trained to optimize trading strategies in volatile market conditions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {choice === "blue" && (
            <div className="border border-blue-500/30 p-6 rounded-md bg-blue-900/10">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Fun Projects & Game Development</h3>

              <div className="space-y-4">
                <div className="p-3 border border-blue-500/20 rounded-md">
                  <h4 className="font-bold">Multiplayer FPS Game with Custom Physics</h4>
                  <p className="text-sm mt-1">
                    Unreal Engine 5 game with advanced networking and custom weapon mechanics.
                  </p>
                </div>

                <div className="p-3 border border-blue-500/20 rounded-md">
                  <h4 className="font-bold">Smart Home Automation Dashboard</h4>
                  <p className="text-sm mt-1">
                    React-based control panel for IoT devices with voice commands and scheduling.
                  </p>
                </div>

                <div className="p-3 border border-blue-500/20 rounded-md">
                  <h4 className="font-bold">Chrome Extension for Productivity</h4>
                  <p className="text-sm mt-1">
                    Browser extension that blocks distracting websites and tracks productive time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EasterEggSection

