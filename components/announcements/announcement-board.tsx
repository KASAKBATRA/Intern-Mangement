"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { CreateAnnouncementDialog } from "./create-announcement-dialog"
import { Plus, Search, Pin, Clock, Users, Building, AlertTriangle, Info, CheckCircle } from "lucide-react"
import type { Announcement, AnnouncementFilter } from "./announcement-types"

// Mock announcements data
const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to Q1 2024 Internship Program",
    content:
      "We're excited to welcome all new interns to the Renu Sharma Foundation. This quarter, we have 45 new interns joining across 8 departments. Please make sure to complete your onboarding checklist and attend the orientation session scheduled for next Monday.",
    authorId: "1",
    authorName: "Renu Sharma",
    authorRole: "CEO",
    targetAudience: "All",
    priority: "High",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    pinned: true,
    readBy: ["4"],
  },
  {
    id: "2",
    title: "Engineering Department: New Project Guidelines",
    content:
      "All engineering interns should follow the new coding standards and project submission guidelines. Please review the updated documentation in the shared drive and ensure all future submissions comply with these standards.",
    authorId: "3",
    authorName: "Department Head",
    authorRole: "HOD",
    targetAudience: "Department",
    department: "Engineering",
    priority: "Medium",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    pinned: false,
    readBy: [],
  },
  {
    id: "3",
    title: "Weekly Report Submission Reminder",
    content:
      "This is a reminder that all interns must submit their weekly progress reports by Friday 5 PM. Reports should include completed tasks, challenges faced, and next week's goals. Late submissions will be noted in your performance review.",
    authorId: "2",
    authorName: "Operations Head",
    authorRole: "COO",
    targetAudience: "Intern",
    priority: "Medium",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    pinned: false,
    readBy: [],
  },
  {
    id: "4",
    title: "System Maintenance Scheduled",
    content:
      "The internship management system will undergo scheduled maintenance this Saturday from 2 AM to 6 AM. During this time, the system will be unavailable. Please plan accordingly and submit any pending work before Friday.",
    authorId: "5",
    authorName: "System Admin",
    authorRole: "Admin",
    targetAudience: "All",
    priority: "Urgent",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    pinned: true,
    readBy: [],
  },
]

export function AnnouncementBoard() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<AnnouncementFilter>("All")

  if (!user) return null

  const canCreateAnnouncements = ["CEO", "COO", "HOD", "Admin"].includes(user.role)

  const handleCreateAnnouncement = (
    announcementData: Omit<Announcement, "id" | "createdAt" | "updatedAt" | "readBy">,
  ) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [],
    }

    setAnnouncements((prev) => [newAnnouncement, ...prev])
  }

  const handleMarkAsRead = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId
          ? {
              ...announcement,
              readBy: announcement.readBy.includes(user.id) ? announcement.readBy : [...announcement.readBy, user.id],
            }
          : announcement,
      ),
    )
  }

  const getVisibleAnnouncements = () => {
    return announcements.filter((announcement) => {
      // Role-based filtering
      if (announcement.targetAudience === "HOD" && user.role !== "HOD") return false
      if (announcement.targetAudience === "Intern" && user.role !== "Intern") return false
      if (
        announcement.targetAudience === "Department" &&
        announcement.department !== user.department &&
        user.role !== "CEO" &&
        user.role !== "COO" &&
        user.role !== "Admin"
      ) {
        return false
      }

      // Search filtering
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !announcement.title.toLowerCase().includes(query) &&
          !announcement.content.toLowerCase().includes(query) &&
          !announcement.authorName.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Additional filtering
      switch (activeFilter) {
        case "Unread":
          return !announcement.readBy.includes(user.id)
        case "Pinned":
          return announcement.pinned
        case "Department":
          return announcement.targetAudience === "Department" || announcement.department === user.department
        case "High Priority":
          return announcement.priority === "High" || announcement.priority === "Urgent"
        default:
          return true
      }
    })
  }

  const visibleAnnouncements = getVisibleAnnouncements()

  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "Urgent":
        return <AlertTriangle className="h-3 w-3" />
      case "High":
        return <Info className="h-3 w-3" />
      default:
        return null
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getAudienceIcon = (targetAudience: Announcement["targetAudience"]) => {
    switch (targetAudience) {
      case "All":
        return <Users className="h-4 w-4" />
      case "Department":
        return <Building className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const filters: { key: AnnouncementFilter; label: string }[] = [
    { key: "All", label: "All" },
    { key: "Unread", label: "Unread" },
    { key: "Pinned", label: "Pinned" },
    { key: "Department", label: "Department" },
    { key: "High Priority", label: "High Priority" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Announcements</h2>
          <p className="text-slate-600">Stay updated with the latest news and updates</p>
        </div>
        {canCreateAnnouncements && (
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-black hover:bg-slate-800">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={activeFilter === filter.key ? "bg-black text-white" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {visibleAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No announcements found</h3>
                <p className="text-slate-600">
                  {searchQuery || activeFilter !== "All"
                    ? "Try adjusting your search or filters"
                    : "Check back later for updates"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          visibleAnnouncements.map((announcement) => {
            const isUnread = !announcement.readBy.includes(user.id)
            return (
              <Card
                key={announcement.id}
                className={`transition-all hover:shadow-md ${
                  isUnread ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                } ${announcement.pinned ? "ring-1 ring-yellow-200 bg-yellow-50/30" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-slate-200 text-sm">
                          {announcement.authorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">{announcement.title}</h3>
                          {announcement.pinned && <Pin className="h-4 w-4 text-yellow-600 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="font-medium">{announcement.authorName}</span>
                          <span>•</span>
                          <span>{announcement.authorRole}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(announcement.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {getPriorityIcon(announcement.priority)}
                        <span className="ml-1">{announcement.priority}</span>
                      </Badge>
                      {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-700 leading-relaxed mb-4">{announcement.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        {getAudienceIcon(announcement.targetAudience)}
                        <span>
                          {announcement.targetAudience === "Department" && announcement.department
                            ? `${announcement.department} Department`
                            : announcement.targetAudience === "All"
                              ? "All Users"
                              : `${announcement.targetAudience}s Only`}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{announcement.readBy.length} read</span>
                    </div>

                    {isUnread && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(announcement.id)}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <CreateAnnouncementDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateAnnouncement={handleCreateAnnouncement}
      />
    </div>
  )
}
