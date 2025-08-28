"use client"

import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onGetStarted: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transforming Internship
            <span className="text-accent block">Management</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 leading-relaxed">
            The Renu Sharma Foundation's comprehensive platform for managing internships, connecting mentors with
            interns, and building the next generation of leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg"
            >
              Get Started Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
