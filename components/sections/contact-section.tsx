"use client"

import { useState, useEffect } from "react"
import { Typewriter } from "../typewriter"
import { Mail, Linkedin, Github, MapPin } from "lucide-react"

const ContactSection = () => {
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="connect --vedant" delay={30} />
        </h2>
      </div>

      {isConnecting ? (
        <div className="space-y-4">
          <p className="animate-pulse">matrix link established. Secure channels open.</p>
          <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-progress"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border border-green-500/30 p-4 rounded-md bg-green-900/10">
            <ul className="space-y-4">
              <li className="flex items-center group">
                <Mail className="mr-3 text-green-400 h-5 w-5" />
                <a
                  href="mailto:vedant713@gmail.com"
                  className="group-hover:text-green-300 transition-colors relative overflow-hidden"
                >
                  <span className="inline-block group-hover:animate-glitch">vedant713@gmail.com</span>
                </a>
              </li>

              <li className="flex items-center group">
                <Linkedin className="mr-3 text-green-400 h-5 w-5" />
                <a
                  href="https://www.linkedin.com/in/vedant-dhokee/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group-hover:text-green-300 transition-colors relative overflow-hidden"
                >
                  <span className="inline-block group-hover:animate-glitch">linkedin.com/in/vedant-dhokee</span>
                </a>
              </li>

              <li className="flex items-center group">
                <Github className="mr-3 text-green-400 h-5 w-5" />
                <a
                  href="https://github.com/vedant713"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group-hover:text-green-300 transition-colors relative overflow-hidden"
                >
                  <span className="inline-block group-hover:animate-glitch">github.com/vedant713</span>
                </a>
              </li>

              <li className="flex items-center">
                <MapPin className="mr-3 text-green-400 h-5 w-5" />
                <span>Syracuse, NY</span>
              </li>
            </ul>
          </div>

          <div className="text-sm text-green-300/70 italic">
            Try typing <span className="text-yellow-400 not-italic">rp</span> or{" "}
            <span className="text-yellow-400 not-italic">bp</span> to discover an easter egg, or{" "}
            <span className="text-yellow-400 not-italic">re</span> to view my resume...
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactSection

