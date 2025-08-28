"use client"

import type React from "react"

import { useState } from "react"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Clock,
  MessageSquare,
  Megaphone,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    roles: ["CEO", "COO", "HOD", "Intern", "Admin"],
  },
  {
    id: "meetings",
    label: "Meetings",
    icon: Calendar,
    roles: ["CEO", "COO", "HOD", "Intern", "Admin"],
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: Clock,
    roles: ["CEO", "COO", "HOD", "Intern", "Admin"],
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    roles: ["COO", "HOD", "Intern"],
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: Megaphone,
    roles: ["CEO", "COO", "HOD", "Intern", "Admin"],
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: FileText,
    roles: ["Intern", "Admin"],
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    roles: ["COO", "HOD", "Admin"],
  },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  if (!user) return null

  const availableItems = navItems.filter((item) => item.roles.includes(user.role))

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">RSF Portal</h2>
            <p className="text-sm text-slate-400">{user.role}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-slate-800"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{user.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            {user.department && <p className="text-xs text-blue-400">{user.department}</p>}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {availableItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-12 px-4",
                "text-slate-300 hover:text-white hover:bg-slate-800",
                activeSection === item.id && "bg-slate-800 text-white border-r-2 border-blue-500",
              )}
              onClick={() => {
                onSectionChange(item.id)
                setIsMobileOpen(false)
              }}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => onSectionChange("settings")}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-red-400 hover:bg-red-950"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white hover:bg-slate-800"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
