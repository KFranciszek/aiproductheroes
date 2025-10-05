"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function FinalCTA() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      return
    }

    // Check if already signed up
    const existing = localStorage.getItem("newsletter_signups")
    if (existing?.includes(email)) {
      setStatus("error")
      return
    }

    // Save to localStorage
    const signups = JSON.parse(existing || "[]")
    signups.push({
      email,
      timestamp: new Date().toISOString(),
      source: "landing-page",
    })
    localStorage.setItem("newsletter_signups", JSON.stringify(signups))

    setStatus("success")
    setEmail("")

    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <section className="py-32 bg-gradient-to-b from-bg-secondary to-bg-primary px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h2
          className="text-5xl font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to achieve perfect alignment?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/demo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 text-xl px-12 py-8 mb-12 transition-all hover:scale-105"
            >
              Try Demo - It's Free
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-text-secondary mb-4">Or get early access:</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-bg-secondary border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
            />
            <Button
              type="submit"
              className="bg-accent-blue hover:bg-accent-blue/90"
            >
              Sign Up
            </Button>
          </form>

          {status === "success" && (
            <motion.p
              className="mt-4 text-accent-green text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🌕 You're on the path to perfect syzio!
            </motion.p>
          )}

          {status === "error" && (
            <motion.p
              className="mt-4 text-red-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Please enter a valid email
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
