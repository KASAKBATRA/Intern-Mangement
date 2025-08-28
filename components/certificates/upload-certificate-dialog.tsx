"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
import { Upload, FileText } from "lucide-react"
import type { Certificate } from "./certificate-types"

interface UploadCertificateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadCertificate: (certificate: Omit<Certificate, "id" | "uploadedAt" | "downloadedAt" | "status">) => void
}

// Mock intern data for selection
const mockInterns = [
  { id: "4", name: "John Intern", email: "intern@renu.org", department: "Engineering" },
  { id: "6", name: "Sarah Developer", email: "sarah@renu.org", department: "Engineering" },
  { id: "7", name: "Mike Designer", email: "mike@renu.org", department: "Design" },
  { id: "8", name: "Lisa Marketing", email: "lisa@renu.org", department: "Marketing" },
  { id: "9", name: "Tom Operations", email: "tom@renu.org", department: "Operations" },
]

export function UploadCertificateDialog({ open, onOpenChange, onUploadCertificate }: UploadCertificateDialogProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    internId: "",
    type: "" as "offer_letter" | "completion_certificate" | "",
    file: null as File | null,
  })
  const [dragActive, setDragActive] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !formData.file || !formData.internId || !formData.type) return

    const selectedIntern = mockInterns.find((intern) => intern.id === formData.internId)
    if (!selectedIntern) return

    // Mock file URL (in real app, this would be uploaded to storage)
    const fileUrl = URL.createObjectURL(formData.file)

    const certificate: Omit<Certificate, "id" | "uploadedAt" | "downloadedAt" | "status"> = {
      internId: formData.internId,
      internName: selectedIntern.name,
      internEmail: selectedIntern.email,
      department: selectedIntern.department,
      type: formData.type,
      fileName: formData.file.name,
      fileUrl: fileUrl,
      uploadedBy: user.name,
    }

    onUploadCertificate(certificate)

    // Reset form
    setFormData({
      internId: "",
      type: "",
      file: null,
    })

    onOpenChange(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setFormData({ ...formData, file })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Certificate</DialogTitle>
          <DialogDescription>Upload offer letters or completion certificates for interns.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intern">Select Intern</Label>
              <Select
                value={formData.internId}
                onValueChange={(value) => setFormData({ ...formData, internId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose intern" />
                </SelectTrigger>
                <SelectContent>
                  {mockInterns.map((intern) => (
                    <SelectItem key={intern.id} value={intern.id}>
                      {intern.name} - {intern.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Certificate Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "offer_letter" | "completion_certificate") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offer_letter">Offer Letter</SelectItem>
                  <SelectItem value="completion_certificate">Completion Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{formData.file.name}</p>
                    <p className="text-sm text-slate-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 mb-2">Drag and drop your file here, or click to browse</p>
                  <p className="text-sm text-slate-500">Supports PDF and image files up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Choose File
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-slate-800"
              disabled={!formData.file || !formData.internId || !formData.type}
            >
              Upload Certificate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
