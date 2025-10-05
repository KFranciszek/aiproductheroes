"use client"

import { motion } from "framer-motion"

const pillars = [
  {
    icon: "🔵",
    title: "Team Syzio",
    color: "accent-blue",
    features: [
      "Everyone sees the same state",
      "Real-time dependencies",
      "No human middleware",
    ],
  },
  {
    icon: "🟣",
    title: "Tool Syzio",
    color: "accent-purple",
    features: [
      "Automations self-heal",
      "Health Score monitoring",
      "Semantic IDs (never break)",
    ],
  },
  {
    icon: "🟢",
    title: "Sprint Syzio",
    color: "accent-green",
    features: [
      "Plan = Reality",
      "Auto drift detection",
      "One-click reporting",
    ],
  },
]

export function ThreePillars() {
  return (
    <section className="py-32 bg-bg-primary px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-5xl font-bold text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Three forces, one syzio
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-2xl border border-${pillar.color}/30 bg-${pillar.color}/5 hover:border-${pillar.color}/50 transition-all cursor-pointer group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`w-12 h-12 rounded-full bg-${pillar.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <span className="text-2xl">{pillar.icon}</span>
              </div>

              <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>

              <ul className="space-y-3 text-text-secondary">
                {pillar.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>• {feature}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
