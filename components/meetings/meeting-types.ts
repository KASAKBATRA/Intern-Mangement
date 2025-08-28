export interface Meeting {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  organizer: string
  organizerRole: string
  attendees: string[]
  department?: string
  meetingLink: string
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
  attendanceRecords: AttendanceRecord[]
}

export interface AttendanceRecord {
  userId: string
  userName: string
  joinTime?: Date
  leaveTime?: Date
  duration: number // in minutes
  status: "present" | "absent" | "partial"
}
