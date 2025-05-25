"use client"

import { useState, useEffect } from "react"
import { Typewriter } from "../typewriter"

const certifications = [
  "DevOps on AWS: Code, Build, Test",
  "Foundations: Data, Data, Everywhere, Google",
  "Python for Data Science, AI & Development, IBM",
  "Generative AI by Microsoft and LinkedIn",
  "GitHub Professional Certificate",
]

const CertificationsSection = () => {
  const [isScanning, setIsScanning] = useState(true)
  const [scannedCerts, setScannedCerts] = useState<string[]>([])

  useEffect(() => {
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < certifications.length) {
        setScannedCerts((prev) => [...prev, certifications[currentIndex]])
        currentIndex++
      } else {
        setIsScanning(false)
        clearInterval(interval)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="scan --certifications" delay={30} />
        </h2>
      </div>

      <div className="space-y-4">
        {isScanning && (
          <div className="space-y-2">
            <p className="animate-pulse">fetching verified credentials...</p>
            <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full animate-progress"></div>
            </div>
          </div>
        )}

        <div className="border border-green-500/30 p-4 rounded-md bg-green-900/10">
          <ul className="space-y-3">
            {scannedCerts.map((cert, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-400 mr-2">✅</span>
                <span className="font-mono">{cert}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-sm text-green-300/70 italic">
        Type <span className="text-yellow-400 not-italic">co</span> to view contact information...
      </div>
    </div>
  )
}

export default CertificationsSection

