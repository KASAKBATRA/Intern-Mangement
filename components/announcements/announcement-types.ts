export interface Announcement {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorRole: string
  targetAudience: "All" | "HOD" | "Intern" | "Department"
  department?: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  createdAt: Date
  updatedAt: Date
  pinned: boolean
  readBy: string[]
}

export type AnnouncementFilter = "All" | "Unread" | "Pinned" | "Department" | "High Priority"
