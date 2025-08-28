"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onSignIn: () => void
  onRegister: () => void
}

export function Header({ onSignIn, onRegister }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              {/* 🔹 Logo Image yaha lag gaya */}
              <Image 
                src="/rsf-logo.png" 
                alt="RSF Logo" 
                width={40} 
                height={40} 
                className="rounded-lg"
              />

              <div>
                <h1 className="text-xl font-bold">Renu Sharma Foundation</h1>
                <p className="text-sm text-primary-foreground/80">Empowering Future Leaders</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-6">
              <a href="#about" className="hover:text-accent transition-colors">
                About
              </a>
              <a href="#features" className="hover:text-accent transition-colors">
                Features
              </a>
              <a href="#contact" className="hover:text-accent transition-colors">
                Contact
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onRegister}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              Register
            </Button>
            <Button onClick={onSignIn} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
