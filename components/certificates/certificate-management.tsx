"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { UploadCertificateDialog } from "./upload-certificate-dialog"
import { Upload, Download, Search, FileText, Award, Calendar, User, Building, CheckCircle, Clock } from "lucide-react"
import type { Certificate } from "./certificate-types"

// Mock certificates data
const mockCertificates: Certificate[] = [
  {
    id: "1",
    internId: "4",
    internName: "John Intern",
    internEmail: "intern@renu.org",
    department: "Engineering",
    type: "offer_letter",
    fileName: "John_Intern_Offer_Letter.pdf",
    fileUrl: "/placeholder.pdf",
    uploadedBy: "System Admin",
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    downloadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "downloaded",
  },
  {
    id: "2",
    internId: "4",
    internName: "John Intern",
    internEmail: "intern@renu.org",
    department: "Engineering",
    type: "completion_certificate",
    fileName: "John_Intern_Completion_Certificate.pdf",
    fileUrl: "/placeholder.pdf",
    uploadedBy: "System Admin",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "available",
  },
  {
    id: "3",
    internId: "6",
    internName: "Sarah Developer",
    internEmail: "sarah@renu.org",
    department: "Engineering",
    type: "offer_letter",
    fileName: "Sarah_Developer_Offer_Letter.pdf",
    fileUrl: "/placeholder.pdf",
    uploadedBy: "System Admin",
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "available",
  },
]

export function CertificateManagement() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "offer_letter" | "completion_certificate">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "available" | "downloaded">("all")

  if (!user) return null

  const isAdmin = user.role === "Admin"
  const isIntern = user.role === "Intern"

  const handleUploadCertificate = (
    certificateData: Omit<Certificate, "id" | "uploadedAt" | "downloadedAt" | "status">,
  ) => {
    const newCertificate: Certificate = {
      ...certificateData,
      id: Date.now().toString(),
      uploadedAt: new Date(),
      status: "available",
    }

    setCertificates((prev) => [newCertificate, ...prev])
  }

  const handleDownload = (certificate: Certificate) => {
    // Mock download functionality
    const link = document.createElement("a")
    link.href = certificate.fileUrl
    link.download = certificate.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Update certificate status
    setCertificates((prev) =>
      prev.map((cert) =>
        cert.id === certificate.id ? { ...cert, status: "downloaded", downloadedAt: new Date() } : cert,
      ),
    )

    console.log("[v0] Downloaded certificate:", certificate.fileName)
  }

  const getFilteredCertificates = () => {
    let filtered = certificates

    // Role-based filtering
    if (isIntern) {
      filtered = filtered.filter((cert) => cert.internId === user.id)
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (cert) =>
          cert.internName.toLowerCase().includes(query) ||
          cert.fileName.toLowerCase().includes(query) ||
          cert.department.toLowerCase().includes(query),
      )
    }

    // Type filtering
    if (filterType !== "all") {
      filtered = filtered.filter((cert) => cert.type === filterType)
    }

    // Status filtering
    if (filterStatus !== "all") {
      filtered = filtered.filter((cert) => cert.status === filterStatus)
    }

    return filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
  }

  const filteredCertificates = getFilteredCertificates()

  const getStatusColor = (status: Certificate["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "downloaded":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: Certificate["status"]) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-3 w-3" />
      case "downloaded":
        return <Download className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: Certificate["type"]) => {
    return type === "offer_letter" ? (
      <FileText className="h-4 w-4 text-blue-500" />
    ) : (
      <Award className="h-4 w-4 text-green-500" />
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{isAdmin ? "Certificate Management" : "My Certificates"}</h2>
          <p className="text-slate-600">
            {isAdmin
              ? "Upload and manage certificates for interns"
              : "Download your offer letters and completion certificates"}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setUploadDialogOpen(true)} className="bg-black hover:bg-slate-800">
            <Upload className="h-4 w-4 mr-2" />
            Upload Certificate
          </Button>
        )}
      </div>

      {/* Stats Cards (Admin only) */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-slate-600">Total Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{certificates.filter((c) => c.status === "available").length}</p>
                  <p className="text-sm text-slate-600">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{certificates.filter((c) => c.status === "downloaded").length}</p>
                  <p className="text-sm text-slate-600">Downloaded</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{certificates.filter((c) => c.status === "pending").length}</p>
                  <p className="text-sm text-slate-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder={isAdmin ? "Search by intern name, file name, or department..." : "Search certificates..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="offer_letter">Offer Letters</option>
            <option value="completion_certificate">Completion Certificates</option>
          </select>
          {isAdmin && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="downloaded">Downloaded</option>
              <option value="pending">Pending</option>
            </select>
          )}
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {filteredCertificates.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No certificates found</h3>
                <p className="text-slate-600">
                  {isAdmin
                    ? "Upload certificates to get started"
                    : "Your certificates will appear here once uploaded by admin"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-slate-100 rounded-lg">{getTypeIcon(certificate.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">
                          {certificate.type === "offer_letter" ? "Offer Letter" : "Completion Certificate"}
                        </h3>
                        <Badge className={getStatusColor(certificate.status)}>
                          {getStatusIcon(certificate.status)}
                          <span className="ml-1 capitalize">{certificate.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{certificate.internName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{certificate.department}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Uploaded {formatDate(certificate.uploadedAt)}</span>
                        </div>
                        {certificate.downloadedAt && (
                          <div className="flex items-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Downloaded {formatDate(certificate.downloadedAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-700">{certificate.fileName}</p>
                        {isAdmin && <p className="text-xs text-slate-500">Uploaded by {certificate.uploadedBy}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      onClick={() => handleDownload(certificate)}
                      className="bg-black hover:bg-slate-800"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isAdmin && (
        <UploadCertificateDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUploadCertificate={handleUploadCertificate}
        />
      )}
    </div>
  )
}
