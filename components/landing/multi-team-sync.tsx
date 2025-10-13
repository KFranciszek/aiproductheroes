"use client"

import { motion } from "framer-motion"

export function MultiTeamSync() {
  const teams = [
    { name: "Frontend", color: "accent-blue", tasks: 12, bgClass: "bg-accent-blue/5", borderClass: "border-accent-blue/30", dotBgClass: "bg-accent-blue/20", dotClass: "bg-accent-blue" },
    { name: "Backend", color: "accent-purple", tasks: 15, bgClass: "bg-accent-purple/5", borderClass: "border-accent-purple/30", dotBgClass: "bg-accent-purple/20", dotClass: "bg-accent-purple" },
    { name: "DevOps", color: "accent-green", tasks: 8, bgClass: "bg-accent-green/5", borderClass: "border-accent-green/30", dotBgClass: "bg-accent-green/20", dotClass: "bg-accent-green" },
    { name: "Design", color: "accent-cyan", tasks: 10, bgClass: "bg-accent-cyan/5", borderClass: "border-accent-cyan/30", dotBgClass: "bg-accent-cyan/20", dotClass: "bg-accent-cyan" },
    { name: "Testing", color: "accent-orange", tasks: 9, bgClass: "bg-accent-orange/5", borderClass: "border-accent-orange/30", dotBgClass: "bg-accent-orange/20", dotClass: "bg-accent-orange" },
    { name: "Analysis", color: "accent-pink", tasks: 7, bgClass: "bg-accent-pink/5", borderClass: "border-accent-pink/30", dotBgClass: "bg-accent-pink/20", dotClass: "bg-accent-pink" }
  ]

  return (
    <section className="py-24 bg-bg-primary px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          One Project, Many Teams, Perfect Sync
        </motion.h2>

        {/* Network diagram */}
        <div className="max-w-4xl mx-auto my-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${team.borderClass} ${team.bgClass} text-center`}
              >
                <div className={`w-12 h-12 rounded-full ${team.dotBgClass} mx-auto mb-4 flex items-center justify-center`}>
                  <div className={`w-6 h-6 rounded-full ${team.dotClass}`} />
                </div>
                <h3 className="font-bold mb-2">{team.name}</h3>
                <p className="text-sm text-text-muted">{team.tasks} tasks</p>
              </motion.div>
            ))}
          </div>

          {/* Connection visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-text-secondary text-sm flex-wrap">
              <span>Frontend</span>
              <span>←→</span>
              <span>Backend</span>
              <span>←→</span>
              <span>DevOps</span>
              <span>←→</span>
              <span>Design</span>
              <span>←→</span>
              <span>Testing</span>
              <span>←→</span>
              <span>Analysis</span>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-2"
        >
          <p className="text-xl text-text-secondary">
            Real-time visibility. Shared resources. Zero meetings.
          </p>
          <p className="text-sm text-text-muted">
            Scales from 2 teams to 20+
          </p>
        </motion.div>
      </div>
    </section>
  )
}
