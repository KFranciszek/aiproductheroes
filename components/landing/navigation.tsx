"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SyzioLogo } from "./syzio-logo"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-lg bg-bg-primary/80 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <SyzioLogo />
        </Link>

        {/* Desktop Navigation Links - removed */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation links removed */}
        </div>

        {/* CTA Button */}
        <Link href="/demo">
          <Button className="bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 transition-opacity">
            Try Demo
          </Button>
        </Link>
      </div>

      {/* Mobile Menu - removed */}
    </nav>
  )
}
