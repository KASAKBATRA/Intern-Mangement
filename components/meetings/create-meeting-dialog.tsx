"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"

interface CreateMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMeetingDialog({ open, onOpenChange }: CreateMeetingDialogProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    department: "",
    attendeeType: "all" as "all" | "department" | "role",
    specificRole: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock meeting creation
    console.log("[v0] Creating meeting:", formData)

    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      department: "",
      attendeeType: "all",
      specificRole: "",
    })

    onOpenChange(false)

    // Show success message (in real app, this would be a toast)
    alert("Meeting scheduled successfully!")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Meeting</DialogTitle>
          <DialogDescription>Create a new meeting and invite attendees.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Meeting description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendeeType">Invite</Label>
            <Select
              value={formData.attendeeType}
              onValueChange={(value: "all" | "department" | "role") =>
                setFormData({ ...formData, attendeeType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select attendees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="department">Specific Department</SelectItem>
                <SelectItem value="role">Specific Role</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.attendeeType === "department" && (
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
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.attendeeType === "role" && (
            <div className="space-y-2">
              <Label htmlFor="specificRole">Role</Label>
              <Select
                value={formData.specificRole}
                onValueChange={(value) => setFormData({ ...formData, specificRole: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="COO">COO</SelectItem>
                  <SelectItem value="HOD">HOD</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-slate-800">
              Schedule Meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
