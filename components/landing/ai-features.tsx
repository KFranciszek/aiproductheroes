"use client"

import { motion } from "framer-motion"

export function AIFeatures() {
  return (
    <section className="py-24 bg-bg-secondary px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4"
        >
          AI That Prevents Conflicts,<br />Not Just Detects Them
        </motion.h2>
        
        {/* Split screen demo */}
        <div className="max-w-5xl mx-auto my-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Story A */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl border border-accent-blue/30 bg-accent-blue/5"
            >
              <div className="text-sm text-text-muted mb-2">Story A</div>
              <h3 className="text-xl font-bold mb-2">Redesign user authentication</h3>
              <div className="inline-block px-3 py-1 rounded-full bg-accent-blue/20 text-accent-blue text-sm">
                In Progress
              </div>
            </motion.div>
            
            {/* Story B */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl border border-accent-purple/30 bg-accent-purple/5"
            >
              <div className="text-sm text-text-muted mb-2">Story B</div>
              <h3 className="text-xl font-bold mb-2">Remove old login system</h3>
              <div className="inline-block px-3 py-1 rounded-full bg-text-muted/20 text-text-secondary text-sm">
                Planned
              </div>
            </motion.div>
          </div>
          
          {/* AI Mediator in center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
          >
            <div className="bg-warning/20 border-2 border-warning rounded-xl p-4 backdrop-blur-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-sm font-medium text-warning whitespace-nowrap">
                  Conflict detected:<br />B depends on A
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* AI Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto space-y-4"
        >
          <div className="flex items-start gap-4">
            <span className="text-2xl">✨</span>
            <p className="text-lg text-text-secondary">Auto-generate stories from docs</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl">✨</span>
            <p className="text-lg text-text-secondary">AI suggests tasks based on context</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl">✨</span>
            <p className="text-lg text-text-secondary">Stories "argue" - AI mediates</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
