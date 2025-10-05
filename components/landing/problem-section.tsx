"use client"

import { motion } from "framer-motion"

const painPoints = [
  "Information scattered across 6 tools",
  "Automations break silently",
  "2-hour manual reports every Friday",
  '"Who\'s working on what?" meetings',
]

export function ProblemSection() {
  return (
    <section id="features" className="py-24 bg-bg-secondary px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Your team is out of alignment
        </motion.h2>

        <div className="max-w-2xl mx-auto space-y-6">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="text-2xl flex-shrink-0">❌</span>
              <p className="text-lg text-text-secondary">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
