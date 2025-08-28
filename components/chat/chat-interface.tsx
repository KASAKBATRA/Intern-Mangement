"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  MessageSquare,
} from "lucide-react"
import type { ChatMessage, ChatConversation, ChatParticipant } from "./chat-types"

// Mock data for conversations and messages
const mockParticipants: ChatParticipant[] = [
  { id: "1", name: "Renu Sharma", role: "CEO", avatar: "RS", online: true },
  { id: "2", name: "Operations Head", role: "COO", avatar: "OH", online: true },
  {
    id: "3",
    name: "Department Head",
    role: "HOD",
    avatar: "DH",
    online: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
  },
  { id: "4", name: "John Intern", role: "Intern", avatar: "JI", online: true },
  {
    id: "5",
    name: "System Admin",
    role: "Admin",
    avatar: "SA",
    online: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "3",
    senderName: "Department Head",
    senderRole: "HOD",
    receiverId: "4",
    content: "Hi John! How's your project coming along?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    type: "text",
  },
  {
    id: "2",
    senderId: "4",
    senderName: "John Intern",
    senderRole: "Intern",
    receiverId: "3",
    content: "Hello! It's going well. I've completed the first phase and working on the API integration now.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
    read: true,
    type: "text",
  },
  {
    id: "3",
    senderId: "3",
    senderName: "Department Head",
    senderRole: "HOD",
    receiverId: "4",
    content: "That's great! Let me know if you need any help with the API documentation.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
    read: true,
    type: "text",
  },
  {
    id: "4",
    senderId: "2",
    senderName: "Operations Head",
    senderRole: "COO",
    receiverId: "4",
    content: "John, please submit your weekly report by Friday.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    type: "text",
  },
]

export function ChatInterface() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  if (!user) return null

  // Filter available contacts based on user role
  const getAvailableContacts = () => {
    switch (user.role) {
      case "Intern":
        return mockParticipants.filter((p) => p.role === "HOD" || p.role === "COO")
      case "HOD":
        return mockParticipants.filter((p) => p.role === "Intern" || p.role === "COO")
      case "COO":
        return mockParticipants.filter((p) => p.role === "Intern" || p.role === "HOD")
      default:
        return []
    }
  }

  const availableContacts = getAvailableContacts()

  // Get conversations for current user
  const getConversations = (): ChatConversation[] => {
    const conversations: ChatConversation[] = []

    availableContacts.forEach((contact) => {
      const conversationMessages = messages.filter(
        (msg) =>
          (msg.senderId === user.id && msg.receiverId === contact.id) ||
          (msg.senderId === contact.id && msg.receiverId === user.id),
      )

      if (conversationMessages.length > 0) {
        const lastMessage = conversationMessages[conversationMessages.length - 1]
        const unreadCount = conversationMessages.filter((msg) => msg.receiverId === user.id && !msg.read).length

        conversations.push({
          id: contact.id,
          participants: [contact],
          lastMessage,
          unreadCount,
          updatedAt: lastMessage.timestamp,
        })
      } else {
        // Create empty conversation
        conversations.push({
          id: contact.id,
          participants: [contact],
          unreadCount: 0,
          updatedAt: new Date(),
        })
      }
    })

    return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  const conversations = getConversations()
  const selectedContact = availableContacts.find((c) => c.id === selectedConversation)

  const getConversationMessages = () => {
    if (!selectedConversation) return []
    return messages.filter(
      (msg) =>
        (msg.senderId === user.id && msg.receiverId === selectedConversation) ||
        (msg.senderId === selectedConversation && msg.receiverId === user.id),
    )
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      receiverId: selectedConversation,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedConversation,
        senderName: selectedContact?.name || "Unknown",
        senderRole: selectedContact?.role || "Unknown",
        receiverId: user.id,
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date(),
        read: false,
        type: "text",
      }
      setMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participants[0].name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg border overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r bg-slate-50 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => {
              const contact = conversation.participants[0]
              return (
                <div
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id ? "bg-blue-100 border border-blue-200" : "hover:bg-white"
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-slate-200">{contact.avatar}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{contact.name}</p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-slate-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-600">{contact.role}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-0">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-xs text-slate-500 truncate mt-1">{conversation.lastMessage.content}</p>
                    )}
                    {!contact.online && contact.lastSeen && (
                      <p className="text-xs text-slate-400">Last seen {formatTime(contact.lastSeen)}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-slate-200">{selectedContact.avatar}</AvatarFallback>
                  </Avatar>
                  {selectedContact.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-sm text-slate-600">
                    {selectedContact.online ? "Online" : `Last seen ${formatTime(selectedContact.lastSeen!)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {getConversationMessages().map((message) => {
                  const isOwn = message.senderId === user.id
                  return (
                    <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn ? "bg-black text-white rounded-br-sm" : "bg-slate-100 text-slate-900 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-end space-x-1 mt-1`}>
                          <span className={`text-xs ${isOwn ? "text-slate-300" : "text-slate-500"}`}>
                            {formatTime(message.timestamp)}
                          </span>
                          {isOwn && (
                            <div className="text-slate-300">
                              {message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} className="bg-black hover:bg-slate-800">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Select a conversation</h3>
              <p className="text-slate-600">Choose a contact from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
