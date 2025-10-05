import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { ThreePillars } from "@/components/landing/three-pillars"
import { AIFeatures } from "@/components/landing/ai-features"
import { MultiTeamSync } from "@/components/landing/multi-team-sync"
import { OriginStory } from "@/components/landing/origin-story"
import { SocialProof } from "@/components/landing/social-proof"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Three Pillars Section */}
      <ThreePillars />

      {/* AI Features Section */}
      <AIFeatures />

      {/* Multi-Team Sync Section */}
      <MultiTeamSync />

      {/* Origin Story Section */}
      <OriginStory />

      {/* Social Proof Section */}
      <SocialProof />

      {/* Final CTA Section */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  )
}
