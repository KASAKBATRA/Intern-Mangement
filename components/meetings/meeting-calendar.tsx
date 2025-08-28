"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Video, Clock, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Meeting } from "./meeting-types"

// Mock meeting data
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "All Hands Meeting",
    description: "Monthly company-wide meeting",
    startTime: new Date(2024, 11, 20, 10, 0),
    endTime: new Date(2024, 11, 20, 11, 0),
    organizer: "Operations Head",
    organizerRole: "COO",
    attendees: ["1", "2", "3", "4", "5"],
    meetingLink: "https://meet.example.com/all-hands",
    status: "scheduled",
    attendanceRecords: [],
  },
  {
    id: "2",
    title: "Engineering Team Standup",
    description: "Daily standup for engineering team",
    startTime: new Date(2024, 11, 21, 9, 0),
    endTime: new Date(2024, 11, 21, 9, 30),
    organizer: "Department Head",
    organizerRole: "HOD",
    attendees: ["3", "4"],
    department: "Engineering",
    meetingLink: "https://meet.example.com/eng-standup",
    status: "scheduled",
    attendanceRecords: [],
  },
  {
    id: "3",
    title: "Project Review",
    description: "Q4 project review session",
    startTime: new Date(2024, 11, 22, 14, 0),
    endTime: new Date(2024, 11, 22, 15, 30),
    organizer: "Operations Head",
    organizerRole: "COO",
    attendees: ["1", "2", "3", "4"],
    meetingLink: "https://meet.example.com/project-review",
    status: "scheduled",
    attendanceRecords: [],
  },
]

interface MeetingCalendarProps {
  onCreateMeeting?: () => void
  onJoinMeeting?: (meeting: Meeting) => void
}

export function MeetingCalendar({ onCreateMeeting, onJoinMeeting }: MeetingCalendarProps) {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("week")

  const canScheduleMeetings = user?.role === "COO" || user?.role === "Admin"

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const getMeetingsForDate = (date: Date) => {
    return mockMeetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime)
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const weekDates = getWeekDates(currentDate)

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(currentDate.getDate() - 7)
                setCurrentDate(newDate)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(currentDate.getDate() + 7)
                setCurrentDate(newDate)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg border">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className={view === "day" ? "bg-black text-white" : ""}
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className={view === "week" ? "bg-black text-white" : ""}
            >
              Week
            </Button>
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className={view === "month" ? "bg-black text-white" : ""}
            >
              Month
            </Button>
          </div>

          {canScheduleMeetings && (
            <Button onClick={onCreateMeeting} className="bg-black hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-4 text-center font-medium text-slate-600 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDates.map((date, index) => {
              const meetings = getMeetingsForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div key={index} className="border-r last:border-r-0 p-2">
                  <div className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : "text-slate-900"}`}>
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {meetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-2 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => onJoinMeeting?.(meeting)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-blue-900 truncate">{meeting.title}</span>
                          <Badge className={`text-xs ${getStatusColor(meeting.status)}`}>{meeting.status}</Badge>
                        </div>
                        <div className="flex items-center text-xs text-blue-700">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(meeting.startTime)}
                        </div>
                        <div className="flex items-center text-xs text-blue-700">
                          <Users className="h-3 w-3 mr-1" />
                          {meeting.attendees.length} attendees
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMeetings
              .filter((meeting) => meeting.startTime > new Date())
              .slice(0, 3)
              .map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{meeting.title}</h4>
                    <p className="text-sm text-slate-600">{meeting.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                      <span>
                        {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                      </span>
                      <span>Organizer: {meeting.organizer}</span>
                      {meeting.department && <span>Dept: {meeting.department}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                    <Button size="sm" onClick={() => onJoinMeeting?.(meeting)} className="bg-black hover:bg-slate-800">
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
