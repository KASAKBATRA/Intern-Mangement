"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import type { Announcement } from "./announcement-types"

interface CreateAnnouncementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAnnouncement: (announcement: Omit<Announcement, "id" | "createdAt" | "updatedAt" | "readBy">) => void
}

export function CreateAnnouncementDialog({ open, onOpenChange, onCreateAnnouncement }: CreateAnnouncementDialogProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetAudience: "All" as "All" | "HOD" | "Intern" | "Department",
    department: "",
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
    pinned: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const announcement: Omit<Announcement, "id" | "createdAt" | "updatedAt" | "readBy"> = {
      title: formData.title,
      content: formData.content,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      targetAudience: formData.targetAudience,
      department: formData.targetAudience === "Department" ? formData.department : undefined,
      priority: formData.priority,
      pinned: formData.pinned,
    }

    onCreateAnnouncement(announcement)

    // Reset form
    setFormData({
      title: "",
      content: "",
      targetAudience: "All",
      department: "",
      priority: "Medium",
      pinned: false,
    })

    onOpenChange(false)
  }

  const getAudienceOptions = () => {
    if (!user) return []

    switch (user.role) {
      case "CEO":
        return [
          { value: "All", label: "All Users" },
          { value: "HOD", label: "HODs Only" },
          { value: "Intern", label: "Interns Only" },
          { value: "Department", label: "Specific Department" },
        ]
      case "COO":
        return [
          { value: "All", label: "All Users" },
          { value: "HOD", label: "HODs Only" },
          { value: "Intern", label: "Interns Only" },
          { value: "Department", label: "Specific Department" },
        ]
      case "HOD":
        return [
          { value: "Department", label: "My Department" },
          { value: "Intern", label: "My Interns" },
        ]
      default:
        return []
    }
  }

  const audienceOptions = getAudienceOptions()

  if (!user || audienceOptions.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
          <DialogDescription>Share important information with your team.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your announcement here..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value: "All" | "HOD" | "Intern" | "Department") =>
                  setFormData({ ...formData, targetAudience: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "Low" | "Medium" | "High" | "Urgent") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.targetAudience === "Department" && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="pinned"
              checked={formData.pinned}
              onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked })}
            />
            <Label htmlFor="pinned">Pin this announcement</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-slate-800">
              Post Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
