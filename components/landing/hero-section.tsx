"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary to-bg-secondary" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* 3D Animation placeholder - will be enhanced in next task */}
        <motion.div
          className="w-full max-w-2xl h-96 mb-12 mx-auto flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative w-64 h-64">
            {/* Three aligned spheres */}
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-accent-blue/60 blur-sm"
              style={{ left: "0%", top: "50%", transform: "translateY(-50%)" }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-accent-purple/70 blur-sm"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-accent-green/60 blur-sm"
              style={{ right: "0%", top: "50%", transform: "translateY(-50%)" }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            
            {/* Alignment line */}
            <motion.div
              className="absolute h-0.5 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green"
              style={{
                left: "10%",
                right: "10%",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          When teams, tasks, and
          <br />
          tools align perfectly
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-text-secondary mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Stop juggling 6 tools. Achieve syzio.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link href="/demo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 text-lg px-8 py-6 transition-all hover:scale-105"
            >
              Try Demo
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("features")}
            className="text-lg px-8 py-6 border-text-secondary text-text-primary hover:bg-white/10 transition-all hover:scale-105"
          >
            See How It Works ↓
          </Button>
        </motion.div>

        {/* Testimonial */}
        <motion.blockquote
          className="text-sm italic text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          "From 6 tools and 30 min standups to 1 view"
          <br />
          — Michał, Engineering Lead
        </motion.blockquote>
      </div>
    </section>
  )
}
