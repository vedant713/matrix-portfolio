import { Typewriter } from "../typewriter"

const AboutSection = () => {
  return (
    <div className="space-y-6 glitch-container section-transition">
      <div className="glitch-text">
        <h2 className="text-2xl font-bold mb-4 text-green-400">
          <Typewriter text="whois vedant" delay={30} />
        </h2>
      </div>

      <div className="border border-green-500/30 p-4 rounded-md bg-green-900/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h3 className="text-xl font-bold text-green-300">Vedant Ravindra Dhoke</h3>
          <div className="flex space-x-4 text-sm">
            <span>📍 Syracuse, NY</span>
            <span>📧 vedant713@gmail.com</span>
          </div>
        </div>

        <p className="text-green-200/80">
          Software Developer, AI/ML Engineer, and Data Scientist with expertise in building intelligent systems and
          applications.
        </p>
      </div>

      <div className="border border-green-500/30 p-4 rounded-md bg-green-900/10">
        <h3 className="text-lg font-bold mb-2 text-green-300">Education</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-bold">Syracuse University</span>
              <span className="text-green-400">May 2025</span>
            </div>
            <p>MS in Computer Science (GPA: 3.5/4.0)</p>
            <p className="text-sm text-green-300/70">
              Courses: Data Science, Design and Analysis of Algorithms, OS, NLP, Social Media & Data Mining
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-bold">University of Mumbai</span>
              <span className="text-green-400">Aug 2023</span>
            </div>
            <p>BE in Computer Engineering (GPA: 9.15/10)</p>
            <p className="text-sm text-green-300/70">Courses: Software Engineering, AI, OS, DBMS, Data Structures</p>
          </div>
        </div>
      </div>

      <div className="text-sm text-green-300/70 italic">
        Type <span className="text-yellow-400 not-italic">sk</span> to view technical skills...
      </div>
    </div>
  )
}

export default AboutSection

