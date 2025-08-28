"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { AboutSection } from "@/components/landing/about-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showLogin, setShowLogin] = useState(false)
  const [defaultTab, setDefaultTab] = useState<"login" | "register">("login")

  console.log("[v0] HomePage render - user:", user, "isLoading:", isLoading, "showLogin:", showLogin)

  if (isLoading) {
    console.log("[v0] Showing loading screen")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (showLogin || user) {
    if (!user) {
      console.log("[v0] Showing login form")
      return <LoginForm onBackToHome={() => setShowLogin(false)} defaultTab={defaultTab} />
    }

    console.log("[v0] User authenticated, showing dashboard")
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <DashboardContent activeSection={activeSection} />
      </div>
    )
  }

  console.log("[v0] Showing landing page")
  return (
    <div className="min-h-screen bg-background">
      <Header
        onSignIn={() => {
          console.log("[v0] Sign in button clicked")
          setDefaultTab("login")
          setShowLogin(true)
        }}
        onRegister={() => {
          console.log("[v0] Register button clicked")
          setDefaultTab("register")
          setShowLogin(true)
        }}
      />
      <HeroSection
        onGetStarted={() => {
          setDefaultTab("login")
          setShowLogin(true)
        }}
      />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </div>
  )
}
