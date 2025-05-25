"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Volume2, VolumeX } from "lucide-react"
import AboutSection from "./sections/about-section"
import SkillsSection from "./sections/skills-section"
import ProjectsSection from "./sections/projects-section"
import ExperienceSection from "./sections/experience-section"
import CertificationsSection from "./sections/certifications-section"
import ContactSection from "./sections/contact-section"
import EasterEggSection from "./sections/easter-egg-section"
import MatrixRain from "./matrix-rain"
import { Typewriter } from "./typewriter"
import CRTEffect from "./crt-effect"
import Autocomplete from "./autocomplete"
import BootSequence from "./boot-sequence"
import IPTracker from "./ip-tracker"
import ScrollIndicator from "./scroll-indicator"
import { useSound } from "./sound-manager"
import ResumeSection from "./sections/resume-section"
// Add the import for the retina scanner
import RetinaScan from "./retina-scan"

// List of available commands - short versions (max 2 letters)
const availableCommands = [
  "ab", // about
  "sk", // skills
  "pr", // projects
  "ex", // experience
  "ce", // certifications
  "co", // contact
  "rp", // redpill
  "bp", // bluepill
  "?", // help
  "cl", // clear
  "ho", // home
  "ac", // access
  "su", // sudo
  "tr", // trace
  "re", // resume
]

// Command mapping for display in help
const commandMapping = {
  ab: "About information",
  sk: "Technical skills",
  pr: "Projects",
  ex: "Work experience",
  ce: "Certifications",
  co: "Contact information",
  re: "View resume",
  "?": "Show commands",
  cl: "Clear terminal",
  ho: "Home screen",
  ac: "Access profile",
  su: "Root access",
  tr: "IP trace",
  rp: "Red pill",
  bp: "Blue pill",
}

const Terminal = () => {
  const [input, setInput] = useState("")
  const [activeSection, setActiveSection] = useState("welcome")
  const [showPrompt, setShowPrompt] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [decryptionComplete, setDecryptionComplete] = useState(false)
  const [showMatrix, setShowMatrix] = useState(true)
  // Add state for the retina scanner
  const [showRetinaScan, setShowRetinaScan] = useState(true)
  const [showBootSequence, setShowBootSequence] = useState(false)
  const [showIPTracker, setShowIPTracker] = useState(false)
  const [showSudoMode, setShowSudoMode] = useState(false)
  // Add state for fade-in animation
  const [isFadingIn, setIsFadingIn] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const { playSound, toggleMute, isMuted } = useSound()

  // Function to scroll to bottom of terminal
  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  // Function to manually scroll the terminal
  const handleScroll = (delta: number) => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop += delta
    }
  }

  useEffect(() => {
    // Start fade-in animation
    setTimeout(() => {
      setIsFadingIn(false)
    }, 100)

    if (inputRef.current) {
      inputRef.current.focus()

      // Add after inputRef.current.focus()
      const handleKeyboardScroll = (e: KeyboardEvent) => {
        if (e.key === "PageUp") {
          handleScroll(-300)
          e.preventDefault()
        } else if (e.key === "PageDown") {
          handleScroll(300)
          e.preventDefault()
        } else if (e.key === "ArrowUp" && e.ctrlKey) {
          handleScroll(-50)
          e.preventDefault()
        } else if (e.key === "ArrowDown" && e.ctrlKey) {
          handleScroll(50)
          e.preventDefault()
        }
      }

      document.addEventListener("keydown", handleKeyboardScroll)
      return () => {
        document.removeEventListener("keydown", handleKeyboardScroll)
      }
    }
  }, [activeSection])

  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Scroll to bottom when activeSection or history changes
  useEffect(() => {
    scrollToBottom()
  }, [activeSection, history])

  // Add a mutation observer to detect content changes and scroll to bottom
  useEffect(() => {
    if (!terminalRef.current) return

    const observer = new MutationObserver(() => {
      scrollToBottom()
    })

    observer.observe(terminalRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [])

  // Add handlers for the retina scan and boot sequence
  const handleRetinaScanComplete = () => {
    setShowRetinaScan(false)
    setShowBootSequence(true)
  }

  const handleBootComplete = () => {
    setShowBootSequence(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const newHistory = [...history, `> ${input}`]
    setHistory(newHistory)

    const command = input.toLowerCase().trim()
    playSound("command")
    processCommand(command)

    setInput("")

    // Scroll to bottom with a delay to ensure content is rendered
    setTimeout(scrollToBottom, 150)
  }

  const processCommand = (command: string) => {
    if (activeSection === "welcome") {
      if (command === "ac") {
        setIsDecrypting(true)
        playSound("decrypt")
        setTimeout(() => {
          setIsDecrypting(false)
          setDecryptionComplete(true)
          setShowMatrix(false)
          scrollToBottom()
        }, 1500)
        return
      }
    }

    // Add a fade-out effect before changing sections
    const fadeOutAndChangeSection = (newSection: string) => {
      // First fade out current section
      const tabsContent = document.querySelector(`[data-state="active"]`)
      if (tabsContent) {
        tabsContent.classList.add("animate-fadeOut")

        // After fade out completes, change section
        setTimeout(() => {
          setActiveSection(newSection)
          playSound("decrypt")

          // Ensure we scroll to bottom after processing command
          setTimeout(scrollToBottom, 50)
        }, 200)
      } else {
        // If no active tab is found, just change section directly
        setActiveSection(newSection)
        playSound("decrypt")
        setTimeout(scrollToBottom, 100)
      }
    }

    // Process commands based on input
    if (command === "ab") {
      fadeOutAndChangeSection("about")
    } else if (command === "sk") {
      fadeOutAndChangeSection("skills")
    } else if (command === "pr") {
      fadeOutAndChangeSection("projects")
    } else if (command === "ex") {
      fadeOutAndChangeSection("experience")
    } else if (command === "ce") {
      fadeOutAndChangeSection("certifications")
    } else if (command === "co") {
      fadeOutAndChangeSection("contact")
    } else if (command === "re") {
      fadeOutAndChangeSection("resume")
    } else if (command === "rp" || command === "bp") {
      fadeOutAndChangeSection("easter-egg")
      playSound("glitch")
    } else if (command === "?") {
      fadeOutAndChangeSection("help")
    } else if (command === "cl") {
      setHistory([])
      playSound("command")
    } else if (command === "ho") {
      fadeOutAndChangeSection("welcome")
      setDecryptionComplete(true)
      setShowMatrix(false)
      playSound("command")
    } else if (command === "su") {
      setShowSudoMode(true)
      playSound("glitch")
      setHistory([...history, "🔓 ROOT ACCESS GRANTED", "Welcome to developer mode. Unlocking hidden content..."])
    } else if (command === "tr") {
      setShowIPTracker(true)
      playSound("decrypt")
    } else {
      setHistory([...history, `Command not recognized: ${command}`, "Type '?' for available commands"])
      playSound("error")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Tab") {
      playSound("typing")
    }
  }

  // Update the conditional rendering to include the retina scanner
  if (showRetinaScan) {
    return <RetinaScan onComplete={handleRetinaScanComplete} />
  }

  if (showBootSequence) {
    return <BootSequence onComplete={handleBootComplete} />
  }

  return (
    <div
      className={`w-full max-w-4xl h-[85vh] bg-black border border-green-500 rounded-md overflow-hidden flex flex-col relative transition-opacity duration-1000 ${
        isFadingIn ? "opacity-0" : "opacity-100"
      }`}
    >
      {showMatrix && <MatrixRain density={0.05} speed={1.2} />}

      <div className="bg-black/80 text-green-500 p-2 border-b border-green-500 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs font-mono">VEDANT_MATRIX_TERMINAL v1.0</div>
        <div className="flex items-center space-x-3">
          <button onClick={toggleMute} className="text-green-500 hover:text-green-400 focus:outline-none">
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <div className="text-xs font-mono">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <CRTEffect intensity={0.3}>
        <div
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-green-500 bg-black/90 backdrop-blur-sm terminal-scrollbar"
          style={{
            scrollBehavior: "smooth",
            overflowY: "auto",
            height: "calc(100% - 40px)", // Ensure it takes up available space
            maxHeight: "calc(100% - 40px)", // Set a max height to ensure scrolling
          }}
          onWheel={(e) => {
            // Ensure wheel events work for scrolling
            const delta = e.deltaY
            if (terminalRef.current) {
              terminalRef.current.scrollTop += delta
            }
          }}
        >
          {activeSection === "welcome" && !isDecrypting && !decryptionComplete && (
            <div className="space-y-4 glitch-text">
              <Typewriter text="Wake up, Vedant... The System needs you." delay={50} onComplete={scrollToBottom} />
              <p className="mt-4">
                Type <span className="text-green-300 font-bold">&quot;ac&quot;</span> to continue...
              </p>
            </div>
          )}

          {isDecrypting && (
            <div className="space-y-4">
              <p className="animate-pulse">Decrypting Vedant&apos;s Data...</p>
              <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full animate-progress"></div>
              </div>
            </div>
          )}

          {decryptionComplete && activeSection === "welcome" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold glitch-text mb-2">VEDANT RAVINDRA DHOKE</h1>
              <p className="text-xl mb-6">Building systems, breaking limits.</p>

              <div className="border border-green-500/50 p-4 rounded-md bg-green-900/10">
                <p className="text-green-300 mb-2">Available commands:</p>
                <ul className="space-y-1 text-sm">
                  {Object.entries(commandMapping).map(([cmd, desc]) => (
                    <li key={cmd} className="flex items-start mb-2">
                      <span className="text-yellow-400 w-8 inline-block flex-shrink-0">{cmd}</span>
                      <span className="text-green-200 inline-block">- {desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-green-300/70">Hint: There might be easter eggs somewhere...</p>
              </div>
            </div>
          )}

          <Tabs value={activeSection} className="w-full">
            <TabsContent value="about" className="mt-0 animate-sectionSlideIn">
              <AboutSection />
            </TabsContent>
            <TabsContent value="skills" className="mt-0 animate-sectionSlideIn">
              <SkillsSection />
            </TabsContent>
            <TabsContent value="projects" className="mt-0 animate-sectionSlideIn">
              <ProjectsSection />
            </TabsContent>
            <TabsContent value="experience" className="mt-0 animate-sectionSlideIn">
              <ExperienceSection />
            </TabsContent>
            <TabsContent value="certifications" className="mt-0 animate-sectionSlideIn">
              <CertificationsSection />
            </TabsContent>
            <TabsContent value="contact" className="mt-0 animate-sectionSlideIn">
              <ContactSection />
            </TabsContent>
            <TabsContent value="resume" className="mt-0 animate-sectionSlideIn">
              <ResumeSection />
            </TabsContent>
            <TabsContent value="easter-egg" className="mt-0 animate-sectionSlideIn">
              <EasterEggSection />
            </TabsContent>
            <TabsContent value="help" className="mt-0 animate-sectionSlideIn">
              <div className="border border-green-500/50 p-4 rounded-md bg-green-900/10">
                <p className="text-green-300 mb-2">Available commands:</p>
                <ul className="space-y-1 text-sm">
                  {Object.entries(commandMapping).map(([cmd, desc]) => (
                    <li key={cmd} className="flex items-start mb-2">
                      <span className="text-yellow-400 w-8 inline-block flex-shrink-0">{cmd}</span>
                      <span className="text-green-200 inline-block">- {desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-green-300/70">Hint: Try typing "rp" or "bp"</p>
              </div>
            </TabsContent>
          </Tabs>

          {history.map((line, index) => (
            <div key={index} className="text-green-500 font-mono">
              {line}
            </div>
          ))}

          {showPrompt && (
            <form onSubmit={handleSubmit} className="flex items-center mt-2">
              <span className="text-green-500 mr-2">{">"}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-transparent border-none outline-none text-green-500 font-mono caret-green-500"
                autoFocus
              />
              <Autocomplete input={input} setInput={setInput} commands={availableCommands} />
            </form>
          )}
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator targetRef={terminalRef} />
      </CRTEffect>

      {showSudoMode && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 transition-opacity duration-500">
          <div className="w-full max-w-md bg-black border border-green-500 rounded-md p-4 font-mono text-green-500 terminal-scrollbar max-h-[80vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">DEVELOPER MODE</h3>
              <button
                onClick={() => {
                  // Add fade-out animation before closing
                  const element = document.querySelector(".animate-fadeIn")
                  if (element) {
                    element.classList.remove("animate-fadeIn")
                    element.classList.add("animate-fadeOut")
                    setTimeout(() => setShowSudoMode(false), 500)
                  } else {
                    setShowSudoMode(false)
                  }
                }}
                className="text-green-500 hover:text-green-400"
              >
                [X]
              </button>
            </div>
            <div className="space-y-4">
              <p>Welcome to developer mode. Here are some fun facts about Vedant:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Favorite programming language: Python</li>
                <li>Prefers dark mode in all IDEs and apps</li>
                <li>Drinks coffee while coding late at night</li>
                <li>Has a collection of tech stickers on laptop</li>
                <li>Debugs by explaining code to rubber ducks</li>
              </ul>
              <p className="text-sm text-green-300/70 mt-4">
                This is a hidden section only accessible via the "su" command.
              </p>
            </div>
          </div>
        </div>
      )}

      {showIPTracker && <IPTracker onClose={() => setShowIPTracker(false)} />}
    </div>
  )
}

export default Terminal

