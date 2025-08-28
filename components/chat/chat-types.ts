export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: "text" | "file" | "system"
}

export interface ChatConversation {
  id: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  updatedAt: Date
}

export interface ChatParticipant {
  id: string
  name: string
  role: string
  avatar: string
  online: boolean
  lastSeen?: Date
}
