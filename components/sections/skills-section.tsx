"use client"

import { useState, useEffect } from "react"
import { Typewriter } from "../typewriter"

const SkillsSection = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="analyzing vedant's tech stack..." delay={20} />
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <p className="animate-pulse">Scanning skills database...</p>
          <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-progress"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <SkillCategory
            title="Programming Languages & Frameworks"
            skills={[
              "Python: NumPy, Pandas, Scikit-Learn, PyTorch, TensorFlow, Matplotlib, Seaborn, Plotly, Django, Flask, Streamlit",
              "C++, Bash, PowerShell",
              "JavaScript (React, Next.js, FastAPI)",
              "Algorithm Optimization, Linux CLI",
            ]}
          />

          <SkillCategory
            title="Databases"
            skills={[
              "SQL: MySQL, PostgreSQL, SQL Server (stored procedures, indexing, normalization)",
              "NoSQL: MongoDB",
            ]}
          />

          <SkillCategory
            title="Developer Tools"
            skills={["Git, GitHub, WSL, VSCode, PyCharm, Jupyter Notebook, VirtualBox"]}
          />

          <SkillCategory
            title="Machine Learning & Data Science"
            skills={["NLTK, Keras, SciPy, OpenCV, PyTorch, OpenAI GPT-4, Hugging Face Transformers"]}
          />

          <div className="text-sm text-green-300/70 italic">
            Type <span className="text-yellow-400 not-italic">pr</span> to view projects...
          </div>
        </div>
      )}
    </div>
  )
}

interface SkillCategoryProps {
  title: string
  skills: string[]
}

const SkillCategory = ({ title, skills }: SkillCategoryProps) => {
  return (
    <div className="border border-green-500/30 p-4 rounded-md bg-green-900/10">
      <h3 className="text-lg font-bold mb-2 text-green-300">{title}</h3>
      <ul className="space-y-2">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-400 mr-2">✅</span>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkillsSection

