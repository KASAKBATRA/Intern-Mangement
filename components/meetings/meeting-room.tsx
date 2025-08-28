"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { Video, VideoOff, Mic, MicOff, Phone, Users, Clock } from "lucide-react"
import type { Meeting } from "./meeting-types"

interface MeetingRoomProps {
  meeting: Meeting | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MeetingRoom({ meeting, open, onOpenChange }: MeetingRoomProps) {
  const { user } = useAuth()
  const [isJoined, setIsJoined] = useState(false)
  const [joinTime, setJoinTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)

  // Mock participants
  const [participants] = useState([
    { id: "1", name: "Renu Sharma", role: "CEO", avatar: "RS" },
    { id: "2", name: "Operations Head", role: "COO", avatar: "OH" },
    { id: "3", name: "Department Head", role: "HOD", avatar: "DH" },
    { id: "4", name: "John Intern", role: "Intern", avatar: "JI" },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isJoined && joinTime) {
      interval = setInterval(() => {
        const now = new Date()
        const diff = Math.floor((now.getTime() - joinTime.getTime()) / 1000 / 60)
        setDuration(diff)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isJoined, joinTime])

  const handleJoinMeeting = () => {
    setIsJoined(true)
    setJoinTime(new Date())
    console.log("[v0] User joined meeting:", meeting?.id)
  }

  const handleLeaveMeeting = () => {
    if (joinTime && meeting) {
      const leaveTime = new Date()
      const totalDuration = Math.floor((leaveTime.getTime() - joinTime.getTime()) / 1000 / 60)
      const meetingDuration = Math.floor((meeting.endTime.getTime() - meeting.startTime.getTime()) / 1000 / 60)

      // Auto-attendance logic: if present > 50% of meeting time, mark as present
      const attendancePercentage = (totalDuration / meetingDuration) * 100
      const attendanceStatus = attendancePercentage > 50 ? "present" : "partial"

      console.log("[v0] User left meeting:", {
        meetingId: meeting.id,
        userId: user?.id,
        duration: totalDuration,
        attendanceStatus,
        attendancePercentage: Math.round(attendancePercentage),
      })

      // Show attendance status
      alert(
        `Meeting ended!\nDuration: ${totalDuration} minutes\nAttendance: ${attendanceStatus.toUpperCase()}\n${
          attendanceStatus === "present"
            ? "✅ Attendance marked as Present (>50% participation)"
            : "⚠️ Attendance marked as Partial (<50% participation)"
        }`,
      )
    }

    setIsJoined(false)
    setJoinTime(null)
    setDuration(0)
    onOpenChange(false)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (!meeting) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{meeting.title}</span>
            {isJoined && (
              <Badge className="bg-green-100 text-green-800">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(duration)}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {meeting.description} • Organized by {meeting.organizer}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isJoined ? (
            // Pre-meeting view
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Ready to join?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Start Time:</span>
                    <p>{meeting.startTime.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p>{Math.floor((meeting.endTime.getTime() - meeting.startTime.getTime()) / 1000 / 60)} minutes</p>
                  </div>
                  <div>
                    <span className="font-medium">Attendees:</span>
                    <p>{meeting.attendees.length} invited</p>
                  </div>
                  <div>
                    <span className="font-medium">Department:</span>
                    <p>{meeting.department || "All"}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={handleJoinMeeting} className="bg-green-600 hover:bg-green-700">
                    <Video className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // In-meeting view
            <div className="space-y-4">
              {/* Video Area */}
              <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-medium">Meeting in Progress</p>
                  <p className="text-sm text-slate-300">Duration: {formatDuration(duration)}</p>
                </div>
              </div>

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Participants ({participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{participant.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-slate-600">{participant.role}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 ml-auto">Online</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={audioEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="rounded-full w-12 h-12 p-0"
                >
                  {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={videoEnabled ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className="rounded-full w-12 h-12 p-0"
                >
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleLeaveMeeting}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </div>

              {user?.role === "Intern" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Attendance Tracking:</strong> Stay for more than 50% of the meeting duration to be marked as
                    Present. Current participation:{" "}
                    {Math.round(
                      (duration / Math.floor((meeting.endTime.getTime() - meeting.startTime.getTime()) / 1000 / 60)) *
                        100,
                    )}
                    %
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
