"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  Calendar,
  Clock,
  MessageSquare,
  Megaphone,
  FileText,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { MeetingCalendar } from "@/components/meetings/meeting-calendar"
import { CreateMeetingDialog } from "@/components/meetings/create-meeting-dialog"
import { MeetingRoom } from "@/components/meetings/meeting-room"
import { ChatInterface } from "@/components/chat/chat-interface"
import { AnnouncementBoard } from "@/components/announcements/announcement-board"
import { CertificateManagement } from "@/components/certificates/certificate-management"
import type { Meeting } from "@/components/meetings/meeting-types"

interface DashboardContentProps {
  activeSection: string
}

export function DashboardContent({ activeSection }: DashboardContentProps) {
  const { user } = useAuth()
  const [createMeetingOpen, setCreateMeetingOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [meetingRoomOpen, setMeetingRoomOpen] = useState(false)

  if (!user) return null

  const handleCreateMeeting = () => {
    setCreateMeetingOpen(true)
  }

  const handleJoinMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setMeetingRoomOpen(true)
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "CEO":
        return <CEODashboard />
      case "COO":
        return <COODashboard />
      case "HOD":
        return <HODDashboard />
      case "Intern":
        return <InternDashboard />
      case "Admin":
        return <AdminDashboard />
      default:
        return <div>Dashboard not available</div>
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
      case "meetings":
        return (
          <div>
            <MeetingCalendar onCreateMeeting={handleCreateMeeting} onJoinMeeting={handleJoinMeeting} />
            <CreateMeetingDialog open={createMeetingOpen} onOpenChange={setCreateMeetingOpen} />
            <MeetingRoom meeting={selectedMeeting} open={meetingRoomOpen} onOpenChange={setMeetingRoomOpen} />
          </div>
        )
      case "attendance":
        return <AttendanceSection />
      case "chat":
        return <ChatInterface />
      case "announcements":
        return <AnnouncementBoard />
      case "certificates":
        return <CertificateManagement />
      case "users":
        return <UsersSection />
      case "settings":
        return <SettingsSection />
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black capitalize">
            {activeSection === "dashboard" ? `${user.role} Dashboard` : activeSection}
          </h1>
          <p className="text-slate-600">Welcome back, {user.name}</p>
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

function CEODashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
          <Calendar className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-slate-600">+2 from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
          <Users className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-slate-600">+12 this quarter</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
          <TrendingUp className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87%</div>
          <p className="text-xs text-slate-600">+5% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
          <BarChart3 className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-slate-600">Active departments</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Performance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Engineering Department</p>
                <p className="text-sm text-slate-600">Q4 Performance Review</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Department</p>
                <p className="text-sm text-slate-600">Q4 Performance Review</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">All Hands Meeting</p>
                <p className="text-sm text-slate-600">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Board Review</p>
                <p className="text-sm text-slate-600">Friday, 2:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function COODashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending HOD Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">3</div>
          <p className="text-sm text-slate-600">Accounts awaiting approval</p>
          <Button className="mt-4 w-full bg-black hover:bg-slate-800">Review Accounts</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">5</div>
          <p className="text-sm text-slate-600">Scheduled meetings</p>
          <Button className="mt-4 w-full bg-black hover:bg-slate-800">View Calendar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">7</div>
          <p className="text-sm text-slate-600">Require attention</p>
          <Button className="mt-4 w-full bg-black hover:bg-slate-800">Review Issues</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function HODDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>My Interns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">12</div>
          <p className="text-sm text-slate-600">Active interns</p>
          <Button className="mt-4 w-full bg-black hover:bg-slate-800">Manage Interns</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">2</div>
          <p className="text-sm text-slate-600">Intern accounts to verify</p>
          <Button className="mt-4 w-full bg-black hover:bg-slate-800">Review Applications</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">8</div>
          <p className="text-sm text-slate-600">Unread messages</p>
          <Button className="mt-4 w-full bg-black hover:bg-slate-800">Open Chat</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function InternDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>My Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">92%</div>
          <p className="text-sm text-slate-600">This month</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Present</span>
              <span className="text-green-600">18 days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Absent</span>
              <span className="text-red-600">2 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Team Standup</p>
                <p className="text-sm text-slate-600">Today, 9:00 AM</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Join</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Project Review</p>
                <p className="text-sm text-slate-600">Tomorrow, 2:00 PM</p>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button className="bg-black hover:bg-slate-800">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with HOD
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
            <Button variant="outline">
              <Megaphone className="h-4 w-4 mr-2" />
              View Announcements
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">234</div>
          <p className="text-sm text-slate-600">All system users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">15</div>
          <p className="text-sm text-slate-600">Certificates to upload</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span className="text-lg font-medium">Healthy</span>
          </div>
          <p className="text-sm text-slate-600">All systems operational</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">✓</div>
          <p className="text-sm text-slate-600">Last backup: 2 hours ago</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AttendanceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Track and manage attendance</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Attendance tracking features coming soon...</p>
      </CardContent>
    </Card>
  )
}

function CertificatesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificates</CardTitle>
        <CardDescription>Download your certificates</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Certificate management features are now available.</p>
      </CardContent>
    </Card>
  )
}

function UsersSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage system users</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">User management features coming soon...</p>
      </CardContent>
    </Card>
  )
}

function SettingsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>System preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">Settings panel coming soon...</p>
      </CardContent>
    </Card>
  )
}
