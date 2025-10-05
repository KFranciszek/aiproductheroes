"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function OriginStory() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  return (
    <section 
      ref={ref}
      className="py-32 bg-gradient-to-b from-bg-secondary via-bg-tertiary to-bg-primary relative overflow-hidden px-6"
    >
      {/* Parallax stars background */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-40" />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-50" />
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-white rounded-full opacity-30" />
      </motion.div>

      <motion.div 
        style={{ y: y2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-32 right-40 w-3 h-3 bg-accent-blue rounded-full opacity-40 blur-sm" />
        <div className="absolute bottom-32 left-40 w-4 h-4 bg-accent-purple rounded-full opacity-30 blur-sm" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent-green rounded-full opacity-50 blur-sm" />
      </motion.div>
      
      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <p className="text-2xl md:text-3xl leading-relaxed">
            In astronomy, syzygy is when 3 celestial bodies
            align perfectly - a rare moment of cosmic harmony.
          </p>
          
          <p className="text-xl md:text-2xl leading-relaxed text-text-secondary">
            In project management, perfect alignment is just as rare.
          </p>
          
          <p className="text-2xl md:text-3xl font-bold">
            Syzio brings back that perfect alignment.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="pt-8"
          >
            <Link href="/demo">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 text-lg px-8 py-6"
              >
                Achieve Your First Syzio
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
