export interface Certificate {
  id: string
  internId: string
  internName: string
  internEmail: string
  department: string
  type: "offer_letter" | "completion_certificate"
  fileName: string
  fileUrl: string
  uploadedBy: string
  uploadedAt: Date
  downloadedAt?: Date
  status: "pending" | "available" | "downloaded"
}

export interface CertificateUpload {
  internId: string
  type: "offer_letter" | "completion_certificate"
  file: File
}
