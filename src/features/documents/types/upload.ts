export type UploadType = "resume" | "coverLetter" | "portfolio" | "workExperience"

export interface UploadItem {
  id: UploadType
  title: string
  description: string
  required: boolean
  file?: File | null
  uploadedUrl?: string
  exists?: boolean
}
