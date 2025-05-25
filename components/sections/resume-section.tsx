"use client"

import { useState, useEffect } from "react"
import { Typewriter } from "../typewriter"
import { ExternalLink } from "lucide-react"
import { useSound } from "../sound-manager"

const ResumeSection = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isClicked, setIsClicked] = useState(false)
  const { playSound } = useSound()

  // Google Drive resume link
  const resumeLink = "https://drive.google.com/file/d/1o-LBQ94YZ4uWeu2iBPCR1RlQQ-cA0ey7/view?usp=sharing"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleViewResume = () => {
    playSound("decrypt")
    setIsClicked(true)

    // Open the Google Drive link in a new tab
    window.open(resumeLink, "_blank", "noopener,noreferrer")

    // Reset the clicked state after a delay
    setTimeout(() => {
      setIsClicked(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="download --resume" delay={30} />
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <p className="animate-pulse">Locating resume file...</p>
          <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-progress"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border border-green-500/30 p-4 rounded-md bg-green-900/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-300">Vedant Dhoke - Resume</h3>
              <span className="text-green-400 text-sm">PDF Format</span>
            </div>

            <p className="mb-4">Professional resume with education, skills, projects, and work experience.</p>

            <button
              onClick={handleViewResume}
              className="flex items-center space-x-2 bg-green-900/50 hover:bg-green-800 text-green-300 px-4 py-2 rounded-md border border-green-500/30 transition-all"
            >
              <ExternalLink size={16} />
              <span>{isClicked ? "Opening resume..." : "View Resume"}</span>
            </button>
          </div>

          <div className="text-sm text-green-300/70 italic">
            Type <span className="text-yellow-400 not-italic">?</span> to see all available commands...
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeSection

