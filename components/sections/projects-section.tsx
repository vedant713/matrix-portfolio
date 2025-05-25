"use client"

import { useState, useEffect } from "react"
import { Typewriter } from "../typewriter"

const projects = [
  {
    id: "AI_Job_Search_Companion",
    name: "AI Job Search Companion",
    details: [
      "AI-powered job tracker with React & GPT API",
      "Reduced job search decision fatigue by 30%",
      "Increased user engagement by 35% with AI chatbot",
    ],
  },
  {
    id: "AI_Leetcode_Recommender",
    name: "AI Leetcode Recommender",
    details: [
      "ML-powered coding problem recommender (TF-IDF, RL)",
      "Improved problem difficulty alignment by 40%",
      "Flask/React platform with 98% uptime, scaling to 10,000+ users",
    ],
  },
  {
    id: "Workday_Skills_Autofiller",
    name: "Workday Skills Autofiller",
    details: [
      "Automated Workday skill updates using JavaScript & Chrome APIs",
      "Cut profile update time by 80% (from 12 minutes to 2.5 minutes)",
      "Achieved 95% autofill accuracy",
    ],
  },
  {
    id: "Job_Posting_Fraud_Detector",
    name: "Job Posting Fraud Detector",
    details: [
      "Random Forest model detecting fake job postings with 99.48% accuracy",
      "Identified 15K+ fraudulent listings monthly",
      "Optimized ML pipelines to improve training efficiency by 25%",
    ],
  },
  {
    id: "Competitive_Multiplayer_Shooter_Game",
    name: "Competitive Multiplayer Shooter Game",
    details: [
      "Created 3D multiplayer shooter in Unreal Engine 5",
      "Integrated cross-platform matchmaking (PC/PS5/Xbox)",
      "Increased player retention by 20% with dynamic leaderboards & match states",
    ],
  },
]

const ProjectsSection = () => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isDecrypting, setIsDecrypting] = useState(true)
  const [decryptedProjects, setDecryptedProjects] = useState<string[]>([])

  useEffect(() => {
    if (isDecrypting && currentProjectIndex < projects.length) {
      const timer = setTimeout(() => {
        setDecryptedProjects((prev) => [...prev, projects[currentProjectIndex].id])
        setCurrentProjectIndex((prev) => prev + 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (currentProjectIndex >= projects.length) {
      setIsDecrypting(false)
    }
  }, [currentProjectIndex, isDecrypting])

  return (
    <div className="space-y-6">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="decode --projects" delay={30} />
        </h2>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`border border-green-500/30 p-4 rounded-md bg-green-900/10 transition-all duration-500 ${
              decryptedProjects.includes(project.id) ? "opacity-100" : "opacity-30"
            }`}
          >
            <div className="flex items-center mb-2">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  decryptedProjects.includes(project.id) ? "bg-green-500" : "bg-yellow-500 animate-pulse"
                }`}
              ></div>
              <h3 className="text-lg font-bold text-green-300">
                {decryptedProjects.includes(project.id) ? (
                  <span>{`> decrypt ${project.name}`}</span>
                ) : (
                  <span className="blur-sm">Encrypted Project</span>
                )}
              </h3>
            </div>

            {decryptedProjects.includes(project.id) && (
              <ul className="space-y-1 ml-4">
                {project.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start">
                    <span className="text-green-400 mr-2">✅</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-green-300/70 italic">
        Type <span className="text-yellow-400 not-italic">ex</span> to view work history...
      </div>
    </div>
  )
}

export default ProjectsSection

