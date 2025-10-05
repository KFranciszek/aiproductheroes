"use client"

import { motion } from "framer-motion"

export function SocialProof() {
  const testimonials = [
    {
      quote: "6 tools → 1 view. 30 min standups → 5 min.",
      author: "Michał",
      role: "Engineering Lead",
      company: "TechCorp"
    },
    {
      quote: "We went from chaos to perfect alignment in 2 weeks.",
      author: "Anna",
      role: "Product Manager",
      company: "StartupXYZ"
    },
    {
      quote: "Finally, a tool that actually prevents problems.",
      author: "Piotr",
      role: "CTO",
      company: "DevTeam"
    }
  ]

  const hashtags = ["#SyzioAchieved", "#TeamSyzio", "#PerfectAlignment"]

  return (
    <section className="py-24 bg-bg-secondary px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Teams Achieving Syzio
        </motion.h2>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl border border-white/10 bg-bg-primary/50"
            >
              <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
              <div className="text-sm text-text-secondary">
                <div className="font-medium text-text-primary">{testimonial.author}</div>
                <div>{testimonial.role}</div>
                <div className="text-text-muted">{testimonial.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Hashtags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {hashtags.map((hashtag, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium"
            >
              {hashtag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
