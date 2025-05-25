"use client"

import { useState, useEffect } from "react"
import { Typewriter } from "../typewriter"

const experiences = [
  {
    title: "Data Science Intern",
    company: "The Sparks Foundation",
    period: "July 2024 - Aug 2024",
    details: [
      "Built an XGBoost model (MAE: 2.62, RMSE: 11.18) for terrorist incident prediction (98.9% accuracy)",
      "Analyzed 181,000+ incidents, creating interactive visualizations",
      "Deployed an LSTM-based risk forecasting system",
    ],
  },
  {
    title: "Data Science Intern",
    company: "CodeClause",
    period: "June 2024 - July 2024",
    details: [
      "Clustered 75,000+ customer records using K-Means, DBSCAN, PCA",
      "Created 150+ visualizations for spending/income pattern analysis",
      "Developed a real-time web app with 1,000+ active users",
    ],
  },
]

const ExperienceSection = () => {
  const [isDecrypting, setIsDecrypting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDecrypting(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="trace --work_experience" delay={30} />
        </h2>
      </div>

      {isDecrypting ? (
        <div className="space-y-4">
          <p className="animate-pulse">decrypt professional experience...</p>
          <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-progress"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="border border-green-500/30 p-4 rounded-md bg-green-900/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-green-300">
                  {exp.title} @ {exp.company}
                </h3>
                <span className="text-green-400 text-sm">{exp.period}</span>
              </div>

              <ul className="space-y-1 ml-4">
                {exp.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start">
                    <span className="text-green-400 mr-2">✅</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="text-sm text-green-300/70 italic">
            Type <span className="text-yellow-400 not-italic">ce</span> to view certifications...
          </div>
        </div>
      )}
    </div>
  )
}

export default ExperienceSection

