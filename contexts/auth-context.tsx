"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "CEO" | "COO" | "HOD" | "Intern" | "Admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string // For HODs and Interns
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole, department?: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  { id: "1", email: "ceo@renu.org", name: "Renu Sharma", role: "CEO" },
  { id: "2", email: "coo@renu.org", name: "Operations Head", role: "COO" },
  { id: "3", email: "hod@renu.org", name: "Department Head", role: "HOD", department: "Engineering" },
  { id: "4", email: "intern@renu.org", name: "John Intern", role: "Intern", department: "Engineering" },
  { id: "5", email: "admin@renu.org", name: "System Admin", role: "Admin" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    console.log("[v0] Login function called", { email, role })
    setIsLoading(true)

    // Mock authentication - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.role === role)
    console.log("[v0] Found user:", foundUser)

    if (foundUser && password === "password") {
      // Mock password check
      console.log("[v0] Setting user and storing in localStorage")
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      setIsLoading(false)
      console.log("[v0] Login completed successfully")
      return true
    }

    console.log("[v0] Login failed - invalid credentials")
    setIsLoading(false)
    return false
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    department?: string,
  ): Promise<boolean> => {
    setIsLoading(true)

    // Mock registration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      department,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
