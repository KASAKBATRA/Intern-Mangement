import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/contexts/auth-context"
import SplashScreen from "@/components/landing/splashscreen"
import "./globals.css"

export const metadata: Metadata = {
  title: "Renu Sharma Foundation - Internship Management",
  description: "Comprehensive internship management system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <SplashScreen />  {/* 🔹 Yeh splash screen show karega */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
